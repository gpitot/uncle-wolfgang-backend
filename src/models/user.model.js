import config from 'config';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import mongoose from 'mongoose';

Joi.extend(JoiDate);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  dob: {
    type: Date,
    required: true
  }
});

//custom method to generate authToken
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
};

const User = mongoose.model('User', UserSchema);

//function to validate user
function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    }),
    password: Joi.string()
      .min(3)
      .max(255)
      .required(),

    dob: Joi.date()
      .format(['YYYY/MM/DD'])
      .required()
  });
  return schema.validate(user);
}
export {
    User,
    validate
};
