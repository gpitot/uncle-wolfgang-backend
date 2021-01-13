import { query } from "../query";

const getUsers = ({ event_id }) => {
  const sql = `
    SELECT 
    user_events.event_id,
    user_events.enabled,
    user_events.paid,
    users.id,
    users.firstname,
    users.lastname,
    users.photo
    
    FROM user_events left join users
    on user_events.user_id = users.id
    WHERE event_id = $1;
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

const addUserEvent = ({ user_id, event_id, paid = false, receipt = null }) => {
  const checkEventStartStopSql = `
  SELECT 
  events.spots, events.start, events.open, events.enabled as event_enabled, user_events.user_id, user_events.enabled as user_event_enabled
   from events left join user_events on events.id = user_events.event_id
   where events.id = $1 and events.start >= now() + '11 hour'::interval and events.open <= now() + '11 hour'::interval
   and events.enabled = true;
  `;

  const addUserEventSql = `
  INSERT INTO user_events (user_id, registered, event_id, paid, receipt)
   VALUES ($1, now(), $2, $3, $4);
  `;

  return new Promise((resolve, reject) => {
    query(checkEventStartStopSql, [event_id])
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

        query(addUserEventSql, [user_id, event_id, paid, receipt])
          .then(() => resolve())
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

export { getUsers, addUserEvent, updateUserEvent };
