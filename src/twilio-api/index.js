// eslint-disable-next-line import/no-commonjs
require("dotenv").config();
import twilio from "twilio";
import { addAdminSheetsNotification } from "../queries/notifications";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const cleanNumber = (number) => {
  const n = number.split(" ").join("");
  if (n[0] !== "6" && n[0] !== "+") {
    return `61${n}`;
  }
  return n;
};

const sendMessage = (body, number) => {
  const cleanNum = cleanNumber(number);
  addAdminSheetsNotification(`${cleanNum} ${body}`);
  //"+610433813674"
  client.messages
    .create({ body, from: "ManlySquash", to: cleanNum })
    .then((message) => console.log(message.sid))
    .catch(console.log);
};

export { sendMessage };
