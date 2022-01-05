import { query } from "../query";
import {
  addAdminSheetsNotification,
  addLadderChallengeSubmittedNotification,
  addLadderChallengeResponseNotification,
  addLadderResultApprovedNotification,
  sendDemotionMessage,
  sendDemotionWarningMessage,
} from "../notifications";

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
  ladder_id = undefined,
  player_id = undefined,
  challenges = false,
  limit = 10,
  offset = 0,
}) => {
  //with playerid gets challenges for that player
  const currentEpoch = Date.now();
  const args = [currentEpoch];

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
               LADDER_MATCHES.declined,

               player_1_users.firstname as player_1_firstname,
               player_1_users.lastname  as player_1_lastname,
               player_1_users.photo     as player_1_photo,

               player_2_users.firstname as player_2_firstname,
               player_2_users.lastname  as player_2_lastname,
               player_2_users.photo     as player_2_photo
        FROM LADDER_MATCHES
                 inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.id
                 inner join USERS as player_2_users on LADDER_MATCHES.player_2 = player_2_users.id
        WHERE LADDER_MATCHES.declined = false
          and
    `;

  const onlyChallenges =
    challenges === "true"
      ? "(MATCH_DATE is null or MATCH_DATE > $1)"
      : "MATCH_DATE < $1 and approved = true";

  sql += onlyChallenges;

  if (player_id) {
    sql += `
    and (
      player_1 = $2
      or
      player_2 = $2
  )
    `;
    args.push(player_id);
  }

  if (ladder_id) {
    args.push(ladder_id);
    sql += ` and ladder_id = $${args.length}`;
  }

  args.push(limit);
  args.push(offset);

  const matchOrder = challenges === "true" ? "ASC" : "DESC";

  sql += `
    order by match_date ${matchOrder}, accepted DESC, challenge_date DESC LIMIT $${
    args.length - 1
  } offset $${args.length};
    `;

  return new Promise((resolve, reject) => {
    query(sql, args)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const getPrivateRanks = async ({ ladder_id }) => {
  const sql = `select ladder_ranks.recent_change,
                        users.id,
                        users.firstname,
                        users.lastname,
                        users.photo,
                        users.phone,
                        ladder_ranks.rank,
                        ladder_ranks.last_demoted,
                        ladder_ranks.last_warned
                 from ladder_ranks
                          inner join users on ladder_ranks.user_id = users.id
                 where ladder_id = $1
                 order by rank DESC;
    `;
  try {
    const { rows } = await query(sql, [ladder_id]);
    return rows;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};

const getRanks = async ({ ladder_id }) => {
  const data = await getPrivateRanks({ ladder_id });
  return data.map((row) => ({
    ...row,
    phone: undefined,
    rank: undefined,
    last_demoted: undefined,
  }));
};

const addChallenge = ({ ladder_id, player_1, player_2, player_1_name }) => {
  const currentEpoch = Date.now();
  const sql = `
        insert into ladder_matches (ladder_id,
                                    player_1,
                                    player_2,
                                    challenge_date)
        values ($1,
                $2,
                $3,
                $4)
        returning id;
    `;

  //first check that this challenge has not already been made (and pending)
  const noChallengeYet = `
        select *
        from ladder_matches
        where ladder_id = $1
          and player_1 = $2
          and player_2 = $3
          and accepted = false
    `;

  return new Promise((resolve, reject) => {
    if (player_1 === player_2) return reject("Cannot challenge yourself");

    signUp({ ladder_id, player_id: player_1 })
      .then(() => {
        query(noChallengeYet, [ladder_id, player_1, player_2])
          .then((data) => {
            if (data.rows.length > 0) {
              reject("You already have challenged this player");
            } else {
              query(sql, [ladder_id, player_1, player_2, currentEpoch])
                .then(() => {
                  // add notification to challenged user
                  addLadderChallengeSubmittedNotification(
                    player_1_name,
                    player_2
                  );

                  addAdminSheetsNotification(
                    `${player_1} has challenged ${player_2} on ladder: ${ladder_id}`
                  );
                  console.log("this should resolve nicely");
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                  reject("Could not challenge player");
                });
            }
          })
          .catch((err) => {
            console.log(err);
            reject("Could not challenge player");
          });
      })
      .catch((err) => {
        console.log(err);
        reject("Could not challenge player");
      });
  });
};
const acceptChallenge = ({ match_id, player_2, player_2_name }) => {
  //accept match then we organise for them
  //do not set date yet
  const sql = `
        UPDATE LADDER_MATCHES
        set accepted = true
        where id = $1
          and player_2 = $2;
    `;
  return new Promise((resolve, reject) => {
    query(sql, [match_id, player_2])
      .then((data) => {
        addLadderChallengeResponseNotification(
          player_2_name,
          match_id,
          player_2,
          true
        );
        resolve(data.rowCount === 1);
      })
      .catch((err) => reject(err));
  });
};

const declineChallenge = ({ match_id, player_2, player_2_name }) => {
  //accept match then we organise for them
  //do not set date yet
  const sql = `
        UPDATE LADDER_MATCHES
        set declined = true
        where id = $1
          and player_2 = $2;
    `;
  return new Promise((resolve, reject) => {
    query(sql, [match_id, player_2])
      .then((data) => {
        addLadderChallengeResponseNotification(
          player_2_name,
          match_id,
          player_2,
          false
        );
        resolve(data.rowCount === 1);
      })
      .catch((err) => reject(err));
  });
};

const setMatchTime = ({ match_id, time }) => {
  const sql = `
        UPDATE LADDER_MATCHES
        set match_date = $2
        where id = $1;
    `;
  return new Promise((resolve, reject) => {
    query(sql, [match_id, time])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const submitResult = ({ match_id, userid, player_1_games, player_2_games }) => {
  const checkUserSql =
    "select player_1, player_2 from ladder_matches where id = $1;";

  const sql = `
        UPDATE LADDER_MATCHES
        set player_1_games = $2,
            player_2_games = $3
        where id = $1;
    `;
  return new Promise(async (resolve, reject) => {
    try {
      const data = await query(checkUserSql, [match_id]);
      const rows = data.rows;
      if (rows[0].player_1 !== userid && rows[0].player_2 !== userid) {
        reject("Invalid userid");
      }
    } catch (err) {
      reject(err);
    }

    query(sql, [match_id, player_1_games, player_2_games])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const approveResult = ({ match_id }) => {
  const sql = `
        UPDATE LADDER_MATCHES
        set approved = true
        where id = $1
        returning ladder_id, player_1, player_2, player_1_games;
    `;
  return new Promise(async (resolve, reject) => {
    try {
      const { rows } = await query(sql, [match_id]);

      try {
        let winner;
        let loser;
        const { ladder_id, player_1, player_2, player_1_games } = rows[0];

        if (player_1_games === 3) {
          winner = player_1;
          loser = player_2;
        } else {
          winner = player_2;
          loser = player_1;
        }

        await changeRank({
          ladder_id: ladder_id,
          winner,
          loser,
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
        SELECT user_id, rank
        from LADDER_RANKS
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
  const sql = `
        UPDATE LADDER_RANKS
        set rank = $1
        where user_id = $2
          and ladder_id = $3;
    `;

  const moveWinnerAboveLoser = (rows) => {
    if (loserIndex > 0) {
      /*
            returns loser rank + (person above loser - loser rank / 2)
            */
      return (
        parseFloat(rows[loserIndex].rank) +
        (parseFloat(rows[loserIndex - 1].rank) -
          parseFloat(rows[loserIndex].rank)) /
          2
      );
    }
    return (
      parseFloat(rows[loserIndex].rank) +
      (MAX_RANK - parseFloat(rows[loserIndex].rank)) / 2
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const data = await query(sqlGetRanksLean, [ladder_id]);
      const rows = data.rows;

      //find loser and person above them
      //get halfway point
      //that is winner new rank

      for (let i = 0; i < rows.length; i += 1) {
        const { user_id } = rows[i];

        //if you find winner before loser then they are already above and stay in position
        if (user_id === winner) {
          winnerIndex = i;
        }

        if (user_id === loser) {
          loserIndex = i;
        }
      }

      try {
        if (winnerIndex > loserIndex) {
          console.log("winner is below loser");
          const newRank = moveWinnerAboveLoser(rows);
          console.log("new rank : ", newRank, "winner id ", winner);
          await query(sql, [newRank, winner, ladder_id]);
        }
        addLadderResultApprovedNotification(
          winner,
          loser,
          winnerIndex,
          loserIndex
        );
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
        select rank
        from ladder_ranks
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

const getUserExistsOnLadder = ({ ladder_id, player_id }) => {
  const sql = `
        SELECT *
        FROM LADDER_RANKS
        where ladder_id = $1
          and user_id = $2
    `;
  return new Promise((resolve, reject) => {
    query(sql, [ladder_id, player_id])
      .then((data) => {
        resolve(data.rows.length >= 1);
      })
      .catch((err) => reject(err));
  });
};

const signUp = ({ ladder_id, player_id }) => {
  const sql = `
        INSERT INTO LADDER_RANKS (ladder_id, user_id, rank)
        VALUES ($1, $2, $3);
    `;
  return new Promise((resolve, reject) => {
    getUserExistsOnLadder({ ladder_id, player_id })
      .then((exists) => {
        if (exists) {
          //user already exists do not sign them up
          return resolve();
        } else {
          getBottomRank(ladder_id)
            .then((bottomRank) => {
              const newBottomRank = bottomRank / 2;

              query(sql, [ladder_id, player_id, newBottomRank])
                .then(() => {
                  resolve();
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
  });
};

const getUpcomingMatches = () => {
  const sql = `
        SELECT LADDER_MATCHES.id,
               LADDER_MATCHES.match_date,

               LADDER_MATCHES.player_1,
               LADDER_MATCHES.player_2,
               player_1_users.firstname as player_1_firstname,
               player_1_users.lastname  as player_1_lastname,
               player_1_users.photo     as player_1_photo,

               player_2_users.firstname as player_2_firstname,
               player_2_users.lastname  as player_2_lastname,
               player_2_users.photo     as player_2_photo
        FROM LADDER_MATCHES
                 inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.id
                 inner join USERS as player_2_users on LADDER_MATCHES.player_2 = player_2_users.id
        WHERE LADDER_MATCHES.match_date > $1
        ORDER BY LADDER_MATCHES.match_date ASC`;

  return new Promise((resolve, reject) => {
    query(sql, [Date.now()])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const getAwaitingResults = ({ userid }) => {
  const sql = `
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
               player_1_users.lastname  as player_1_lastname,
               player_1_users.photo     as player_1_photo,

               player_2_users.firstname as player_2_firstname,
               player_2_users.lastname  as player_2_lastname,
               player_2_users.photo     as player_2_photo
        FROM LADDER_MATCHES
                 inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.id
                 inner join USERS as player_2_users on LADDER_MATCHES.player_2 = player_2_users.id
        WHERE (
                player_1_users.id = $1
                or
                player_2_users.id = $1
            )
          AND approved = false
          AND MATCH_DATE < $2
          AND player_1_games is null;
    `;
  return new Promise((resolve, reject) => {
    query(sql, [userid, Date.now()])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const getAwaitingApprovals = () => {
  const sql = `
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
               player_1_users.lastname  as player_1_lastname,
               player_1_users.photo     as player_1_photo,

               player_2_users.firstname as player_2_firstname,
               player_2_users.lastname  as player_2_lastname,
               player_2_users.photo     as player_2_photo
        FROM LADDER_MATCHES
                 inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.id
                 inner join USERS as player_2_users on LADDER_MATCHES.player_2 = player_2_users.id
        WHERE approved = false
          AND MATCH_DATE < $1
          AND player_1_games is not null;
    `;
  return new Promise((resolve, reject) => {
    query(sql, [Date.now()])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const adminEditMatch = ({
  match_id,
  match_date,
  player_1_games,
  player_2_games,
  accepted,
  declined,
}) => {
  const sql = `
        UPDATE LADDER_MATCHES
        SET match_date     = $1,
            player_1_games = $2,
            player_2_games = $3,
            accepted       = $4,
            declined       = $5
        WHERE id = $6
    `;
  return new Promise((resolve, reject) => {
    query(sql, [
      match_date,
      player_1_games,
      player_2_games,
      accepted,
      declined,
      match_id,
    ])
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

const adminGetPendingAcceptedMatches = () => {
  const sql = `
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
               player_1_users.lastname  as player_1_lastname,
               player_1_users.photo     as player_1_photo,

               player_2_users.firstname as player_2_firstname,
               player_2_users.lastname  as player_2_lastname,
               player_2_users.photo     as player_2_photo
        FROM LADDER_MATCHES
                 inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.id
                 inner join USERS as player_2_users on LADDER_MATCHES.player_2 = player_2_users.id
        where accepted = false
          and declined = false;
    `;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

const adminGetPendingBookingMatches = () => {
  const sql = `
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
               player_1_users.lastname  as player_1_lastname,
               player_1_users.photo     as player_1_photo,

               player_2_users.firstname as player_2_firstname,
               player_2_users.lastname  as player_2_lastname,
               player_2_users.photo     as player_2_photo
        FROM LADDER_MATCHES
                 inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.id
                 inner join USERS as player_2_users on LADDER_MATCHES.player_2 = player_2_users.id
        where accepted = true
          and match_date is null;
    `;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

const adminGetPendingResultsMatches = () => {
  const sql = `
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
               player_1_users.lastname  as player_1_lastname,
               player_1_users.photo     as player_1_photo,

               player_2_users.firstname as player_2_firstname,
               player_2_users.lastname  as player_2_lastname,
               player_2_users.photo     as player_2_photo
        FROM LADDER_MATCHES
                 inner join USERS as player_1_users on LADDER_MATCHES.player_1 = player_1_users.id
                 inner join USERS as player_2_users on LADDER_MATCHES.player_2 = player_2_users.id
        WHERE match_date < $1
          and player_1_games is null
    `;
  return new Promise((resolve, reject) => {
    query(sql, [Date.now()])
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

const getUsersWhoPlayedSinceDate = async (date, ladder_id) => {
  const sql = `
        select player_1, player_2
        from LADDER_MATCHES
        where match_date > $1
          and match_date < $2
          and ladder_id = $3
          and approved = true`;
  try {
    const { rows } = await query(sql, [date, Date.now(), ladder_id]);
    const userSet = new Set();

    rows.forEach(({ player_1, player_2 }) => {
      userSet.add(player_1);
      userSet.add(player_2);
    });
    return userSet;
  } catch (e) {
    console.log("ERROR ----", e);
    return [];
  }
};

const updateUserRank = async (ladder_id, user, rank, isDemoted) => {
  console.log("updateUserRank called", user, rank);
  // return Promise.resolve();
  const args = [rank, ladder_id, user];

  let sql = `
        UPDATE ladder_ranks
        SET rank = $1`;

  if (isDemoted) {
    sql += ", last_demoted = $4";
    const last_demoted = Date.now() - 1000 * 60 * 60; // now - 1 hour for buffer
    args.push(last_demoted);
  }

  sql += `        
        WHERE 
          ladder_id = $2 and
          user_id = $3
     `;

  await query(sql, args);
};

const demoteUsersWhoAreInactive = async (ladder_id, activeUsers, ranks) => {
  // go from top down, find any inactive user who has not been demoted recently and
  // find the first next player who is also inactive, place them above that player
  const MIN_TIME_BETWEEN_DEMOTIONS = 1000 * 60 * 60 * 24 * 14; // 7 days
  const CURRENT_TIME = Date.now();
  const promises = [];

  for (let i = 0; i < ranks.length; i += 1) {
    const { id, firstname, last_demoted, phone } = ranks[i];
    if (
      !activeUsers.has(id) &&
      last_demoted < CURRENT_TIME - MIN_TIME_BETWEEN_DEMOTIONS &&
      i < ranks.length - 1
    ) {
      console.log("TARGET FOUND - ", firstname, "initial rank ", ranks[i].rank);
      // we do not demote an inactive user if the next user is inactive also - skip this
      if (i < ranks.length - 1) {
        if (!activeUsers.has(ranks[i + 1].id)) {
          console.log(
            "NEVERMIND - ",
            ranks[i + 1].firstname,
            "is inactive also"
          );
          continue;
        }
      }

      //we have our user
      // find the placement

      let targetFound = false;
      let DEMOTED_RANK = 1;
      let readableDemotedRank = 0;
      for (let x = i + 1; x < ranks.length; x += 1) {
        if (!activeUsers.has(ranks[x].id)) {
          console.log(
            "NEXT INACTIVE USER FOUND - ",
            ranks[x].firstname,
            "their rank ",
            ranks[x].rank
          );
          // we have found our next inactive user, place the previous user above this one
          DEMOTED_RANK =
            ranks[x - 1].rank - (ranks[x - 1].rank - ranks[x].rank) / 2;
          readableDemotedRank = x + 1;
          targetFound = true;
          break;
        }
      }
      if (!targetFound) {
        // got to end of list with no more inactive users , demote to bottom
        console.log("NO TARGET FOUND GO TO BOTTOM - ");
        DEMOTED_RANK = Math.max(
          ranks[ranks.length - 1].rank / 2,
          ranks[ranks.length - 1].rank - 1
        );
        readableDemotedRank = ranks.length;
      }

      console.log(
        "-----user demoted",
        id,
        firstname,
        readableDemotedRank,
        DEMOTED_RANK,
        phone
      );
      await updateUserRank(ladder_id, id, DEMOTED_RANK, true);
      promises.push(
        sendDemotionMessage(id, firstname, readableDemotedRank, phone)
      );
    }
  }
  return Promise.all(promises);
};

/*
  get all matches played in the last week
  get all users from these matches
  get all ranks for these users
  go through in descending order (e.g. 1st rank first)
  swap user with above
  e.g. 9th becomes 8th, 8th becomes 9th
  then
  10th becomes 9th, 9th becomes 10th
 */
const demoteForInactivity = async ({ ladder_id }) => {
  const MAX_INACTIVE_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
  const CURRENT_TIME = Date.now();
  try {
    const users = await getUsersWhoPlayedSinceDate(
      CURRENT_TIME - MAX_INACTIVE_TIME,
      ladder_id
    );
    const ranks = await getPrivateRanks({ ladder_id });

    return demoteUsersWhoAreInactive(ladder_id, users, ranks);
  } catch (e) {
    console.log("reject ", e);
    return Promise.reject();
  }
};

const updateLastWarned = (id, epoch) => {
  const sql = `
  UPDATE LADDER_RANKS
  set last_warned = $2
    where user_id = $1
  `;
  return query(sql, [epoch, id]);
};

const getAlmostInactiveUsers = async (ladder_id) => {
  const MAX_INACTIVE_TIME = 1000 * 60 * 60 * 24 * 20; // 20 days
  const CURRENT_TIME = Date.now();
  const TIME_BETWEEN_WARNINGS = CURRENT_TIME - 1000 * 60 * 60 * 24 * 10; // 10 days
  try {
    const users = await getUsersWhoPlayedSinceDate(
      CURRENT_TIME - MAX_INACTIVE_TIME,
      ladder_id
    );
    // get all users
    // filter by active users and people who have been demoted in the last 20 days
    const ranks = await getPrivateRanks({ ladder_id });
    const promises = [];
    for (const rank of ranks) {
      if (
        !users.has(rank.id) &&
        rank.last_demoted < CURRENT_TIME - MAX_INACTIVE_TIME &&
        rank.last_warned < TIME_BETWEEN_WARNINGS
      ) {
        promises.push(
          sendDemotionWarningMessage(rank.id, rank.firstname, rank.phone)
        );
        // update last warned
        promises.push(updateLastWarned(CURRENT_TIME, rank.id));
      }
    }
    return Promise.all(promises);
  } catch (e) {
    console.log("reject ", e);
    return Promise.reject();
  }
};

export {
  getLadders,
  getMatches,
  getRanks,
  addChallenge,
  acceptChallenge,
  declineChallenge,
  setMatchTime,
  submitResult,
  approveResult,
  signUp,
  getUpcomingMatches,
  getAwaitingResults,
  getAwaitingApprovals,
  adminEditMatch,
  adminGetPendingAcceptedMatches,
  adminGetPendingBookingMatches,
  adminGetPendingResultsMatches,
  demoteForInactivity,
  demoteUsersWhoAreInactive,
  updateUserRank,
  getAlmostInactiveUsers,
};
