import { query } from "../query";

const getEvents = () => {
    const sql = `
  SELECT * FROM events
  WHERE
  open < now() and start > now();
  `;
  //const sql = `SELECT *, now() FROM events;`;
  return new Promise((resolve, reject) => {
    query(sql)
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

export { addEvent, getEvents, editEvent };
