import { query } from "../query";

const getEvents = () => {
  const sql = `
SELECT * FROM events;
`;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const addEvent = ({
  event_name,
  event_description,
  event_people_limit,
  event_day,
}) => {
  const sql = `
    INSERT INTO events
    (event_name, event_description, event_people_limit, event_day) 
    VALUES
    ($1, $2, $3, $4);
  `;
  const params = [event_name, event_description, event_people_limit, event_day];
  return new Promise((resolve, reject) => {
    query(sql, params)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

export { addEvent, getEvents };
