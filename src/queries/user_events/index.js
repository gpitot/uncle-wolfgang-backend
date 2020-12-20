import { query } from "../query";

const getUsers = ({ event_id }) => {
  const sql = `
    SELECT * FROM user_events
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

const addUserEvent = ({
  firstname,
  lastname,
  event_id,
  paid = false,
  receipt = null,
}) => {
  const checkEventStartStopSql = `
  SELECT 
  events.spots, events.start, events.open, events.enabled, user_events.firstname
   from events left join user_events on events.id = user_events.event_id
   where events.id = $1 and events.start > now() and events.open < now()
   and events.enabled = true
   and user_events.enabled = true;
  `;

  const addUserEventSql = `
  INSERT INTO user_events (firstname, lastname, registered, event_id, paid, receipt)
   VALUES ($1, $2, now(), $3, $4, $5);
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

        if (data.rows.length >= spots) {
          return reject(
            `Event ${event_id} is full at max capacity at ${spots} spots`
          );
        }

        query(addUserEventSql, [firstname, lastname, event_id, paid, receipt])
          .then(() => resolve())
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

export { getUsers, addUserEvent, updateUserEvent };
