import { query } from "../query";

const getUsers = ({ event_id }) => {
  const sql = `
    SELECT 
    user_events.id as id,
    user_events.event_id,
    user_events.enabled,
    user_events.paid,
    users.id as user_id,
    users.firstname,
    users.lastname,
    users.photo,
    users.streak
    
    FROM user_events left join users
    on user_events.user_id = users.id
    WHERE event_id = $1
    and enabled = true
    order by user_events.registered;
    `;
  return new Promise((resolve, reject) => {
    query(sql, [event_id])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const updateUserEvent = ({ id, event_id, paid, enabled }) => {
  const sql = `
  update user_events
  set 
  event_id = $1,
  paid = $2,
  enabled = $3
  where id = $4;
   `;

  return new Promise((resolve, reject) => {
    query(sql, [event_id, paid, enabled, id])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const removeSelfUserEvent = ({ id, user }) => {
  const getValidUser = `
    select * from user_events where id = $1 and user_id = $2;
  `;
  const sql = `
  update user_events
  set 
  enabled = false
  where id = $1;
   `;

  return new Promise((resolve, reject) => {
    query(getValidUser, [id, user.id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject("Invalid user tried to delete user_event");
        }
        query(sql, [id])
          .then((data) => {
            updateStreak(user.id);
            resolve(data.rows);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => {
        console.log(err);
        return reject("Invalid user tried to delete user_event");
      });
  });
};

const eventIsOpenToEntries = (event_id) => {
  const sql = ` 
    select start, open, enabled, spots from events where id = $1; 
  `;
  const currentEpoch = Date.now();

  return new Promise((resolve, reject) => {
    query(sql, [event_id])
      .then((data) => {
        const { start, open, enabled, spots } = data.rows[0];
        if (currentEpoch > start) {
          reject("Event has already started");
        }

        if (currentEpoch < open) {
          reject("Event is not open yet");
        }

        if (enabled === false) {
          reject("Event is no longer enabled");
        }

        resolve(spots);
      })
      .catch((err) => {
        console.log("error 1");
        console.log(err);
        reject("An unknown error occurred #1");
      });
  });
};

const eventHasSpace = (event_id, spots) => {
  const sql = ` 
    select user_id from user_events where event_id = $1 
  `;

  return new Promise((resolve, reject) => {
    query(sql, [event_id])
      .then((data) => {
        if (data.length >= spots) {
          reject("Event is full");
        }
        resolve();
      })
      .catch((err) => {
        console.log("error 2");
        console.log(err);
        reject("An unknown error occurred #2");
      });
  });
};

const enableUserEvent = (event_id, user_id) => {
  const sql = `
    update user_events 
    set enabled = true 
    where event_id = $1 
    and user_id = $2
    returning *`;
  return query(sql, [event_id, user_id]);
};

const addUserEvent = ({ user_id, event_id, paid = false, receipt = null }) => {
  const currentEpoch = Date.now();

  const addUserEventSql = `
  INSERT INTO user_events (user_id, registered, event_id, paid, receipt)
   VALUES ($1, $2, $3, $4, $5)
   returning *;
  `;

  return new Promise((resolve, reject) => {
    eventIsOpenToEntries(event_id)
      .then((spots) => {
        eventHasSpace(event_id, spots)
          .then(() => {
            query(addUserEventSql, [
              user_id,
              currentEpoch,
              event_id,
              paid,
              receipt,
            ])
              .then((data) => {
                updateStreak(user_id);
                return resolve(data.rows[0]);
              })
              .catch((err) => {
                //check if err is unique violation, if so update to enabled instead
                if (err.constraint === "user_events_user_id_event_id_key") {
                  enableUserEvent(event_id, user_id)
                    .then((data) => {
                      updateStreak(user_id);
                      resolve(data.rows[0]);
                    })
                    .catch((err) => {
                      console.log(err);
                      reject("An unknown error occurred #4");
                    });
                } else {
                  reject("An unknown error occurred #3");
                }
              });
          })
          .catch((spaceErr) => {
            reject(spaceErr);
          });
      })
      .catch((entryErr) => {
        reject(entryErr);
      });
  });
};

const getUsersPastEvents = (user_id) => {
  const sql = `
  select events.id, name, start from user_events inner join events
    on user_events.event_id = events.id
    where user_events.paid = true and user_events.enabled = true and user_events.user_id = $1
    order by events.start desc;
  `;

  return new Promise((resolve, reject) => {
    query(sql, [user_id])
      .then((data) => {
        resolve(data.rows);
      })
      .catch(reject);
  });
};

const calculateStreak = async (user_id) => {
  //run this whenever somone registers or unregisters for an event
  let streak = 0;
  try {
    const events = await getUsersPastEvents(user_id);
    let time = Date.now();
    const weekInMill = 1000 * 60 * 60 * 24 * 7;

    for (let i = 0; i < events.length; i += 1) {
      const { start } = events[i];
      if (time - weekInMill > start) {
        return streak;
      }
      streak += 1;
    }
  } catch (err) {
    console.log(err);
    return null;
  }

  return streak;
};

const updateStreak = async (user_id) => {
  let streak;
  try {
    streak = await calculateStreak(user_id);
  } catch (err) {
    streak = null;
  }

  if (streak === null) {
    console.log("error occurred updating streak");
    return;
  }

  const sql = `
    UPDATE users
    set streak = $1
    where id = $2;
  `;

  query(sql, [streak, user_id]);
};

export {
  getUsers,
  addUserEvent,
  updateUserEvent,
  removeSelfUserEvent,
  getUsersPastEvents,
};
