import { query } from "../query";
import {
  addAdminSheetsNotification,
  sendResetPasswordTokenToUser,
} from "../notifications";
import bcrypt from "bcrypt";
import { signUp } from "../ladder";
const saltRounds = 10;

const getUser = (id) => {
  const sql =
    "SELECT id, firstname, lastname, photo, streak, email, phone, vaccinated from USERS where id = $1";
  return new Promise((resolve, reject) => {
    query(sql, [id])
      .then((data) => {
        if (data.rows.length === 0) return reject("No user exists");
        return resolve(data.rows[0]);
      })
      .catch(() => {
        reject("An unknown error occurred");
      });
  });
};

const login = (req) => {
  const sql = `
  SELECT 
  *
   from users 
   where email = $1
  `;
  return new Promise((resolve, reject) => {
    query(sql, [req.email.toLowerCase()])
      .then((data) => {
        if (data.rows.length === 0) return reject("No user exists");
        const {
          id,
          email,
          password: hashedPassword,
          firstname,
          lastname,
          photo,
          role,
          streak,
        } = data.rows[0];
        bcrypt.compare(req.password, hashedPassword, function (err, result) {
          // result == true
          if (result) {
            resolve({ id, email, firstname, lastname, photo, role, streak });
          } else {
            reject("incorrect password");
          }
        });
      })
      .catch((err) => reject(err));
  });
};

const addUser = ({
  email,
  password,
  firstname,
  lastname,
  photo = "default.jpg",
  phone,
}) => {
  const sql = `
  INSERT INTO USERS (email, password, firstname, lastname, photo, phone)
  VALUES ($1, $2, $3, $4, $5, $6)
  returning *;
  `;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return reject(err);
      }

      query(sql, [email.toLowerCase(), hash, firstname, lastname, photo, phone])
        .then((data) => {
          const { id, email, firstname, lastname, photo, role } = data.rows[0];

          resolve({ id, email, firstname, lastname, photo, role });
          addAdminSheetsNotification(
            `${firstname} ${lastname} has registered an account`
          );
          signUp({ ladder_id: 1, player_id: id });
        })
        .catch((qerr) => reject(qerr));
    });
  });
};

const resetPassword = ({ password, token }) => {
  //check token is valid

  //reset password for user associated with token
  return new Promise((resolve, reject) => {
    query("select * from password_resets where token = $1", [token])
      .then((data) => {
        if (data.rows.length === 0) return reject("invalid token");
        const { user_id, expiry } = data.rows[0];
        const currentEpoch = Date.now();
        if (currentEpoch > expiry) return reject("invalid token");

        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            return reject(err);
          }
          query("update users set password = $1 where id = $2", [hash, user_id])
            .then(() => {
              query("update password_resets set expiry = 0 where token = $1", [
                token,
              ]);
              resolve();
            })
            .catch((qerr) => reject(qerr));
        });
      })
      .catch((berr) => {
        reject(berr);
      });
  });
};

const generateResetToken = ({ user_id, phone }, sendToPhone = false) => {
  const expiry = Date.now() + 1000 * 60 * 48; // 2 days
  const token = Math.floor(Math.random() * 100000000) + 10000000;
  return new Promise((resolve, reject) => {
    query(
      "insert into password_resets (user_id, token, expiry) values ($1, $2, $3)",
      [user_id, token, expiry]
    )
      .then(() => {
        if (!sendToPhone) {
          return resolve(token);
        }

        sendResetPasswordTokenToUser(phone, token, user_id);
        resolve();
      })
      .catch(reject);
  });
};

const searchForUsers = ({ q }) => {
  return new Promise((resolve, reject) => {
    query(
      "select id, email, phone, firstname, lastname, streak from users where firstname ILIKE $1 or lastname ILIKE $1 limit 5",
      [`${q}%`]
    )
      .then((res) => {
        resolve(res.rows);
      })
      .catch(reject);
  });
};

const getMyStreak = (userid) => {
  return new Promise((resolve, reject) => {
    query("select streak from users where id = $1", [userid])
      .then((res) => {
        resolve(res.rows[0]);
      })
      .catch(reject);
  });
};

const getIdPhoneFromEmail = ({ email }) => {
  return new Promise((resolve, reject) => {
    query("select id, phone from users where email = $1", [email])
      .then((res) => {
        resolve(res.rows[0]);
      })
      .catch(reject);
  });
};

const editUser = ({
  id,
  email,
  phone,
  firstname,
  lastname,
  photo,
  vaccinated,
}) => {
  const sql = `
        update users
        set email=$2,
            phone=$3,
            firstname=$4,
            lastname=$5,
            photo=$6,
            vaccinated=$7
        where id = $1
    `;
  return new Promise((resolve, reject) => {
    query(sql, [id, email, phone, firstname, lastname, photo, vaccinated])
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
};

export {
  getUser,
  addUser,
  resetPassword,
  generateResetToken,
  login,
  searchForUsers,
  getMyStreak,
  getIdPhoneFromEmail,
  editUser,
};
