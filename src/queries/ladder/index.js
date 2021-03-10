import { query } from "../query";

const getLadders = () => {
  const sql = "SELECT * FROM LADDERS;";
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const getMatches = ({
  ladder_id,
  player_id = undefined,
  challenges = false,
}) => {
  //with playerid gets challenges for that player
  const currentEpoch = Date.now();
  const args = [ladder_id, currentEpoch];

  let sql = `
  SELECT LADDER_MATCHES.id,
  LADDER_MATCHES.player_1,
  LADDER_MATCHES.player_2,
  LADDER_MATCHES.match_date,
  LADDER_MATCHES.player_2_games,
  LADDER_MATCHES.player_1_games,
  LADDER_MATCHES.player_1_paid,
  LADDER_MATCHES.player_2_paid,
  LADDER_MATCHES.approved,
  LADDER_MATCHES.accepted,

  player_1_users.firstname as player_1_firstname,
  player_1_users.lastname as player_1_lastname, 
  player_1_users.photo as player_1_photo,

  player_2_users.firstname as player_2_firstname,
  player_2_users.lastname as player_2_lastname, 
  player_2_users.photo as player_2_photo
   FROM LADDER_MATCHES 
   inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.email
   inner join USERS as player_2_users on  LADDER_MATCHES.player_2 = player_2_users.email
   WHERE

   `;

  const onlyChallenges =
    challenges === "true"
      ? "(MATCH_DATE is null or MATCH_DATE > $2)"
      : "MATCH_DATE < $2 and approved = true";

  sql += onlyChallenges;

  if (player_id) {
    sql += `
    and (
      player_1 = $3
      or
      player_2 = $3
  )
    `;
    args.push(player_id);
  }

  sql += `
  and ladder_id = $1
    order by match_date DESC, challenge_date DESC;
    `;

  return new Promise((resolve, reject) => {
    query(sql, args)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const getRanks = ({ ladder_id }) => {
  const sql = `select 
    ladder_ranks.player_id,
    ladder_ranks.recent_change,
    users.email,
    users.firstname,
    users.lastname,
    users.photo
    from ladder_ranks 
    inner join users on ladder_ranks.player_id = users.email
    where ladder_id = $1
    order by rank DESC;
    `;

  return new Promise((resolve, reject) => {
    query(sql, [ladder_id])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const addChallenge = ({ ladder_id, player_1, player_2 }) => {
  const currentEpoch = Date.now();
  const sql = `
    insert into ladder_matches (
        ladder_id,
        player_1,
        player_2,
        challenge_date
    )
    values (
        $1,
        $2,
        $3,
        $4
    )
    `;

  //first check that this challenge has not already been made (and pending)
  const noChallengeYet = `
      select * from ladder_matches
      where 
      ladder_id = $1
      and
      player_1 = $2
      and
      player_2 = $3
      and
      accepted = false
  `;

  return new Promise((resolve, reject) => {
    if (player_1 === player_2) return reject("Cannot challenge yourself");
    query(noChallengeYet, [ladder_id, player_1, player_2])
      .then((data) => {
        if (data.rows.length > 0) {
          reject("Challenge already exists");
        } else {
          query(sql, [ladder_id, player_1, player_2, currentEpoch])
            .then((data) => {
              resolve(data.rows);
            })
            .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
  });
};
const acceptChallenge = ({ match_id, player_2 }) => {
  //accept match then we organise for them
  //do not set date yet
  const sql = `
    UPDATE LADDER_MATCHES
    set
    accepted = true
    where
    id = $1 and player_2 = $2;
  `;
  return new Promise((resolve, reject) => {
    query(sql, [match_id, player_2])
      .then((data) => {
        console.log(data);
        resolve(data.rowCount === 1);
      })
      .catch((err) => reject(err));
  });
};

const setMatchTime = ({ match_id, time }) => {
  const sql = `
    UPDATE LADDER_MATCHES
    set
    match_date = $2
    where
    id = $1;
  `;
  return new Promise((resolve, reject) => {
    query(sql, [match_id, time])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const submitResult = ({
  match_id,
  player_1,
  player_1_games,
  player_2_games,
}) => {
  const checkUserSql = "select player_1 from ladder_matches where id = $1;";

  const sql = `
    UPDATE LADDER_MATCHES
    set
    player_1_games = $3,
    player_2_games = $4
    where
    id = $1
    and player_1 = $2;
  `;
  return new Promise(async (resolve, reject) => {
    try {
      const data = await query(checkUserSql, [match_id]);
      const rows = data.rows;
      if (rows[0].player_1 !== player_1) {
        reject("Invalid player1 id");
      }
    } catch (err) {
      reject(err);
    }

    query(sql, [match_id, player_1, player_1_games, player_2_games])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const approveResult = ({ match_id }) => {
  const sql = `
    UPDATE LADDER_MATCHES
    set
    approved = true
    where
    id = $1
    returning ladder_id, player_1, player_2;
  `;
  return new Promise(async (resolve, reject) => {
    try {
      const { rows } = await query(sql, [match_id]);

      try {
        await changeRank({
          ladder_id: rows[0].ladder_id,
          winner: rows[0].player_1,
          loser: rows[0].player_2,
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    } catch (err) {
      reject(err);
    }
  });
};

//not public
const MAX_RANK = 10000;
const changeRank = ({ ladder_id, winner, loser }) => {
  const sqlGetRanksLean = `
    SELECT player_id, rank from LADDER_RANKS
    where ladder_id = $1
    order by rank DESC;
    `;

  /*  

    check that loser is in ranks table already
    if no : 
        add to bottom rank e..g halfway between 0 and current bottom
    if yes : 
    

    check that winner is in ranks table already
    if no :
        if loser exists: 
            place above between player above loser and loser
        if loser doesnt exist either
            CASE DOESNT EXIST (SOMEONE MUST CHALLENGE PLAYER ON RANK TABLE)


    if yes : 
        if loser does not exist:
            stay in same rank

        if loser does exist : 
            if above then
                 move winner to above them

            if below :
                keep winner same spot



    */

  let loserIndex = null;
  let winnerIndex = null;
  let player;
  let newRank;
  let sql = `
    UPDATE LADDER_RANKS
    set rank = $1
    where
    player_id = $2
    and ladder_id = $3;
    `;

  const moveWinnerAboveLoser = (rows) => {
    if (loserIndex > 0) {
      newRank =
        parseFloat(rows[loserIndex].rank) +
        (parseFloat(rows[loserIndex - 1].rank) -
          parseFloat(rows[loserIndex].rank)) /
          2;
    } else {
      newRank =
        parseFloat(rows[loserIndex].rank) +
        (MAX_RANK - parseFloat(rows[loserIndex].rank)) / 2;
    }

    player = winner;
  };

  return new Promise(async (resolve, reject) => {
    try {
      const data = await query(sqlGetRanksLean, [ladder_id]);
      const rows = data.rows;

      //find loser and person above them
      //get halfway point
      //that is winner new rank

      for (let i = 0; i < rows.length; i += 1) {
        const { player_id } = rows[i];

        //if you find winner before loser then they are already above and stay in position
        if (player_id === winner) {
          winnerIndex = i;
        }

        if (player_id === loser) {
          loserIndex = i;
        }
      }

      if (loserIndex === null) {
        // put in loser at bottom of table
        newRank = rows[rows.length - 1].rank / 2;
        player = loser;
      }

      if (winnerIndex === null) {
        // place winner above loser
        moveWinnerAboveLoser(rows);
        sql = `
            INSERT INTO LADDER_RANKS
            (ladder_id, player_id, rank)
            values ($3, $2, $1);
        `;
      } else {
        if (loserIndex === null) {
          //do nothing this should not occur
        } else {
          if (loserIndex > winnerIndex) {
            //place winner above loser
            moveWinnerAboveLoser(rows);
          }
        }
      }

      try {
        console.log(newRank, player, sql);
        await query(sql, [newRank, player, ladder_id]);
        resolve();
      } catch (err) {
        reject(err);
      }
    } catch (err) {
      reject(err);
    }
  });
};

const getBottomRank = (ladder_id) => {
  const sql = `
    select rank from ladder_ranks 
    where ladder_id = $1
    order by rank ASC
    limit 1
  `;

  return new Promise((resolve, reject) => {
    query(sql, [ladder_id])
      .then((data) => {
        if (data.rows.length === 0) {
          return resolve(5000);
        }
        resolve(data.rows[0].rank);
      })
      .catch((err) => reject(err));
  });
};

const signUp = ({ ladder_id, player_id }) => {
  const sql = `
    INSERT INTO LADDER_RANKS (ladder_id, player_id, rank) VALUES (
      $1, $2, $3
    );
  `;
  console.log("signUp ", ladder_id, player_id);
  return new Promise((resolve, reject) => {
    getBottomRank(ladder_id)
      .then((bottomRank) => {
        console.log(bottomRank);
        const newBottomRank = bottomRank / 2;

        query(sql, [ladder_id, player_id, newBottomRank])
          .then(() => {
            resolve();
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const getUpcomingMatches = () => {
  const sql = `
  SELECT LADDER_MATCHES.id,
  LADDER_MATCHES.match_date,
  

  player_1_users.firstname as player_1_firstname,
  player_1_users.lastname as player_1_lastname, 
  player_1_users.photo as player_1_photo,

  player_2_users.firstname as player_2_firstname,
  player_2_users.lastname as player_2_lastname, 
  player_2_users.photo as player_2_photo
   FROM LADDER_MATCHES 
   inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.email
   inner join USERS as player_2_users on  LADDER_MATCHES.player_2 = player_2_users.email
   WHERE
   LADDER_MATCHES.match_date > $1
   ORDER BY LADDER_MATCHES.match_date ASC`;

  return new Promise((resolve, reject) => {
    query(sql, [Date.now()])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

export {
  getLadders,
  getMatches,
  getRanks,
  addChallenge,
  acceptChallenge,
  setMatchTime,
  submitResult,
  approveResult,
  signUp,
  getUpcomingMatches,
};
