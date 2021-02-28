import { query } from "../query";

const getShop = () => {
  const sql = `
      select * from shop
      `;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const getTransactions = () => {
  const sql = `
    select * from transactions order by purchase_date
    `;
  return new Promise((resolve, reject) => {
    query(sql)
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

const addTransaction = ({ itemId, userId }) => {
  const sql = `
  insert into transactions
  ( item,
    purchaser,
    purchase_date)
    values ($1, $2, $3)
  `;

  return new Promise((resolve, reject) => {
    query(sql, [itemId, userId, Date.now()])
      .then((data) => {
        resolve(data.rows);
      })
      .catch((err) => reject(err));
  });
};

export { getShop, getTransactions, addTransaction };
