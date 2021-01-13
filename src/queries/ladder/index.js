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

const getMatches = ({ ladder_id, player_id = null, challenges = false }) => {
  //with playerid gets challenges for that player
  const onlyChallenges = challenges
    ? "(MATCH_DATE is null or MATCH_DATE > now())"
    : "MATCH_DATE < now()";
  if (player_id) {
    const sql = `
    SELECT * FROM LADDER_MATCHES 
    WHERE ${onlyChallenges}
    and (
        player_1 = $2
        or
        player_2 = $2
    )
    and ladder_id = $1
    order by match_date DESC, challenge_date DESC
    ;
    `;

    //console.log(sql);

    return new Promise((resolve, reject) => {
      query(sql, [ladder_id, player_id])
        .then((data) => {
          resolve(data.rows);
        })
        .catch((err) => reject(err));
    });
  }

  const sql = `
    SELECT * FROM LADDER_MATCHES 
    WHERE ${onlyChallenges}
    and ladder_id = $1
    order by match_date DESC, challenge_date DESC
    ;
    `;

  return new Promise((resolve, reject) => {
    query(sql, [ladder_id])
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
    users.id,
    users.firstname,
    users.lastname,
    users.photo
    from ladder_ranks 
    inner join users on ladder_ranks.player_id = users.id
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
        now()
    )
    `;

  return new Promise((resolve, reject) => {
    query(sql, [ladder_id, player_1, player_2])
      .then((data) => {
        resolve(data.rows);
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

export {
  getLadders,
  getMatches,
  getRanks,
  addChallenge,
  acceptChallenge,
  setMatchTime,
  submitResult,
  approveResult,
};
