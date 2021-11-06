import { query } from "../query";
import { updateStreak } from "../user_events";

const recalculateAllStreaks = async () => {
  const sql =
    "select id from users where streak = 2 or streak = 5 or streak = 8 or streak = 11";
  try {
    const res = await query(sql);
    console.log(res.rows);
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

const usersWithMostSocialSignups = async () => {
  const sql = `select
                     count(user_id), user_id, users.firstname, users.lastname
                 FROM user_events left join users
                                            on user_events.user_id = users.id
                 group by user_events.user_id, users.firstname, users.lastname
                 order by count desc`;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

const usersWithNoSocialSignups = async () => {
  const sql = `select id, firstname, lastname from users
                 where id not in (
                     select user_id as id from user_events
                 )`;
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

export {
  usersWithMostSocialSignups,
  usersWithNoSocialSignups,
  recalculateAllStreaks,
  getRecentlyCreatedUsers,
};
