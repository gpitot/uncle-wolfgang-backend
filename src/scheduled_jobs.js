#! /app/.heroku/node/bin/node

import { sendFreebieMessages } from "./scheduled/freebies";
import { demoteUsers } from "./scheduled/demotions";
import { sendMessage } from "./twilio-api";

const failedJob = async (task) => {
  await sendMessage(`${task} failed`, "0433641873", 1);
};

const startJob = async () => {
  await sendMessage("scheduled job starts", "0433641873", 1);
};

const jobs = async () => {
  await startJob();
  try {
    await sendFreebieMessages();
  } catch (e) {
    await failedJob("sendFreebieMessages");
  }

  try {
    await demoteUsers();
  } catch (e) {
    await failedJob("demoteUsers");
  }
  process.exit();
};

jobs();
