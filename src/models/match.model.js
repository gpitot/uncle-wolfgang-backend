import mongoose from 'mongoose';
import Joi from '@hapi/joi';
import ObjectId from 'joi-objectid';
Joi.objectId = ObjectId(Joi);

const MatchSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved: {
    type: Boolean,
    required: true
  }
});

const Match = mongoose.model('Match', MatchSchema);

function validate(data) {
  const schema = Joi.object({
    userA : Joi.objectId().required(),
    userB : Joi.objectId().required(),
    approved : Joi.boolean().required()
  });
  return schema.validate(data);
}
export {Match, validate};


