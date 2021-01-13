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

const getMatches = ({ ladder_id, player_id = null, past = true }) => {
  //with playerid gets challenges for that player
  const isPast = past ? "MATCH_DATE < now()" : "MATCH_DATE > now();";
  if (player_id) {
    const sql = `
    SELECT * FROM LADDER_MATCHES 
    WHERE (
        MATCH_DATE = null 
        or 
        ${isPast}
    )
    and (
        player_1 = $2
        or
        player_2 = $2
    )
    and ladder_id = $1
    order by match_date DESC, challenge_date DESC
    ;
    `;

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
    WHERE (
        MATCH_DATE = null 
        or
        ${isPast}
    )
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

const addChallenge = ({ ladder_id, player_1, player_2, challenge_date }) => {
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
    query(sql, [ladder_id, player_1, player_2, challenge_date])
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
        resolve(data.rows);
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
  const sql = `
    UPDATE LADDER_MATCHES
    set
    player_1_games = $3,
    player_2_games = $4
    where
    id = $1
    and player_1 = $2;
  `;
  return new Promise((resolve, reject) => {
    query(sql, [match_id, player_1, player_1_games, player_2_games])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const approveResult = ({ match_id, ladder_id, winner, loser }) => {
  const sql = `
    UPDATE LADDER_MATCHES
    set
    approved = true
    where
    id = $1;
  `;
  return new Promise(async (resolve, reject) => {
    try {
      await changeRank({ ladder_id, winner, loser });
    } catch (err) {
      reject(err);
    }

    query(sql, [match_id])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
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

  return new Promise(async (resolve, reject) => {
    try {
      const data = await query(sqlGetRanksLean, [ladder_id]);
      const rows = data.rows;

      //find loser and person above them
      //get halfway point
      //that is winner new rank

      let aboveLoser = null;
      let halfway = null;
      for (let i = 0; i < rows.length; i += 1) {
        const { player_id, rank } = rows[i];

        //if you find winner before loser then they are already above and stay in position
        if (player_id === winner) {
          return resolve();
        }

        if (player_id === loser) {
          if (aboveLoser === null) {
            //loser is top rank
            halfway = (MAX_RANK - rank) / 2 + rank;
          }

          halfway = (aboveLoser - rank) / 2 + rank;
          break;
        }

        aboveLoser = rank;
      }

      try {
        const sql = `
            UPDATE LADDER_RANKS
            set rank = $1
            where
            player_id = $2;
          `;

        await query(sql, [halfway, winner]);
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
