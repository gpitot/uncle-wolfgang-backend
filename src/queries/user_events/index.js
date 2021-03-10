import { query } from "../query";

const getUsers = ({ event_id }) => {
  const sql = `
    SELECT 
    user_events.id as id,
    user_events.event_id,
    user_events.enabled,
    user_events.paid,
    users.email as email,
    users.firstname,
    users.lastname,
    users.photo
    
    FROM user_events left join users
    on user_events.user_id = users.email
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
    query(getValidUser, [id, user.email])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject("Invalid user tried to delete user_event");
        }
        query(sql, [id])
          .then((data) => {
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

const addUserEvent = ({ user_id, event_id, paid = false, receipt = null }) => {
  const currentEpoch = Date.now();

  const checkEventStartStopSql = `
  SELECT 
  events.spots, events.start, events.open, events.enabled as event_enabled, user_events.user_id, user_events.enabled as user_event_enabled
   from events left join user_events on events.id = user_events.event_id
   where events.id = $1 and events.start >= $2 and events.open <= $2
   and events.enabled = true;
  `;

  const addUserEventSql = `
  INSERT INTO user_events (user_id, registered, event_id, paid, receipt)
   VALUES ($1, $2, $3, $4, $5)
   returning *;
  `;

  return new Promise((resolve, reject) => {
    query(checkEventStartStopSql, [event_id, currentEpoch])
      .then((data) => {
        //check start and open
        if (data.rows.length === 0) {
          // no event id here
          return reject(`Event ${event_id} does not exist`);
        }
        const { spots, enabled } = data.rows[0];
        if (enabled === false) {
          return reject(`Event ${event_id} is not enabled`);
        }

        //count all entries that are enabled
        let enabledEntries = 0;
        for (let i = 0; i < data.rows.length; i += 1) {
          if (data.rows[i].user_event_enabled === true) {
            enabledEntries += 1;
          }
        }
        if (enabledEntries >= spots) {
          return reject(
            `Event ${event_id} is full at max capacity at ${spots} spots`
          );
        }

        query(addUserEventSql, [user_id, currentEpoch, event_id, paid, receipt])
          .then((data) => resolve(data.rows[0]))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

export { getUsers, addUserEvent, updateUserEvent, removeSelfUserEvent };
