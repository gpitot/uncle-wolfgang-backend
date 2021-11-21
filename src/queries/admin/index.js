import { query } from "../query";
import { updateStreak } from "../user_events";

const recalculateAllStreaks = async () => {
  const sql =
    "select id from users where streak = 3 or streak = 7 or streak = 11 or streak = 15";
  try {
    const res = await query(sql);
    const promises = [];
    res.rows.forEach(({ id }) => {
      promises.push(updateStreak(id));
    });
    try {
      await Promise.all(promises);
      return true;
    } catch (e) {
      return false;
    }
  } catch (e) {
    return false;
  }
};

const usersByNumSocialSignups = async ({ order = "DESC", limit = 100 }) => {
  const sql = `select
                     count(user_id), users.id, users.firstname, users.lastname
                 FROM users left join user_events
                                            on user_events.user_id = users.id
                 group by users.id, users.firstname, users.lastname
                 order by count ${order} limit ${limit}`;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

const getRecentlyCreatedUsers = async () => {
  const sql =
    "select id, firstname, lastname, phone from users order by id desc limit 5";
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

// should always recalculate streaks before calling this
const getUsersWithFreebieSession = async () => {
  await recalculateAllStreaks();
  const sql = `select id, firstname, lastname, phone from users 
    where streak = 3 or streak = 7 or streak = 11 or streak = 15`;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

export {
  usersByNumSocialSignups,
  getRecentlyCreatedUsers,
  getUsersWithFreebieSession,
};
