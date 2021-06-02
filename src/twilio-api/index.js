// eslint-disable-next-line import/no-commonjs
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import twilio from "twilio";
const client = twilio(accountSid, authToken);

const sendMessage = (body, number) => {
  console.log(body, number);
  //"+610433813674"
  client.messages
    .create({ body, from: "ManlySquash", to: number })
    .then((message) => console.log(message.sid));
};

export { sendMessage };
