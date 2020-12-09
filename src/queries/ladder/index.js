import Joi from '@hapi/joi';

import pool from '../index';

const query = `
select id, password from player
where
email = $1
`;

const login = async ({ email }) => {
  return new Promise((resolve, reject) => {
    pool.connect(async (err, client, release) => {
      if (err) {
        throw err;
      }
      try {
        const data = await client.query(query, [email]);
        release();
        const id = data.rows.length > 0 ? data.rows[0] : null;
        return resolve(id);
      } catch (err) {
        release();
        return reject(null);
      }
    });
  });
};

function validate(data) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  });
  return schema.validate(data);
}

export { login, validate };