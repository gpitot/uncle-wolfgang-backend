import { query } from "../query";

const getEvent = ({ id }) => {
  const sql = `
  SELECT 
  *
   from events 
   where events.id = $1
  `;
  return new Promise((resolve, reject) => {
    query(sql, [id])
      .then((data) => {
        resolve(data.rows[0]);
      })
      .catch((err) => reject(err));
  });
};

const getEvents = () => {
  //for some reason needs to add 11 hours because it takes 11 off the now ?
  const currentEpoch = Date.now();
  const sql = `SELECT * FROM events
  where start >= $1 and open <= $1 ORDER BY START ASC`;
  return new Promise((resolve, reject) => {
    query(sql, [currentEpoch])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const editEvent = ({ id, name, description, spots, start, open, enabled }) => {
  const sql = `
    update events
    set
    name = $1,
    description = $2,
    spots = $3,
    start = $4,
    open = $5,
    enabled = $6
    where id = $7;
  `;

  const params = [name, description, spots, start, open, enabled, id];
  return new Promise((resolve, reject) => {
    query(sql, params)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const addEvent = ({ name, description, spots, start, open }) => {
  const sql = `
    INSERT INTO events
    (name, description, spots, start, open) 
    VALUES
    ($1, $2, $3, $4, $5);
  `;
  const params = [name, description, spots, start, open];
  return new Promise((resolve, reject) => {
    query(sql, params)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

export { addEvent, getEvent, getEvents, editEvent };
