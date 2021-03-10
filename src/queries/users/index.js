import { query } from "../query";
import bcrypt from "bcrypt";
const saltRounds = 10;

const login = (req) => {
  const sql = `
  SELECT 
  *
   from users 
   where email = $1
  `;
  return new Promise((resolve, reject) => {
    query(sql, [req.email])
      .then((data) => {
        if (data.rows.length === 0) return reject("No user exists");
        const {
          email,
          password: hashedPassword,
          firstname,
          lastname,
          photo,
          role,
        } = data.rows[0];
        bcrypt.compare(req.password, hashedPassword, function (err, result) {
          // result == true
          if (result) {
            resolve({ email, firstname, lastname, photo, role });
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
}) => {
  const sql = `
  INSERT INTO USERS (email, password, firstname, lastname, photo)
  VALUES ($1, $2, $3, $4, $5);
  `;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return reject(err);
      }

      query(sql, [email, hash, firstname, lastname, photo])
        .then(() => {
          resolve({ email, firstname, lastname, photo, role: "user" });
        })
        .catch((qerr) => reject(qerr));
    });
  });
};

const updateUser = ({ user }) => {
  const sql = `

  UPDATE USERS
  set
  password = $1,
  firstname = $2,
  lastname = $3,
  photo = $4
  where email = $5
  `;
  const { email, password, firstname, lastname, photo } = user;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return reject(err);
      }

      query(sql, [hash, firstname, lastname, photo, email])
        .then(() => {
          resolve();
        })
        .catch((qerr) => reject(qerr));
    });
  });
};

export { addUser, updateUser, login };
