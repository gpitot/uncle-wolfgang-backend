const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendMessage = (body, number) => {
  //"+610433813674"
  client.messages
    .create({ body, from: "Squash", to: number })
    .then((message) => console.log(message.sid));
};

export { sendMessage };
