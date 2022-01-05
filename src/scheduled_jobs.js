#! /app/.heroku/node/bin/node

import { sendFreebieMessages } from "./scheduled/freebies";
import {
  demoteUsers,
  warnUsersAboutIncomingDemotion,
} from "./scheduled/demotions";
import { sendMessage } from "./twilio-api";

const failedJob = async (task) => {
  await sendMessage(`${task} failed`, "0433641873", 1);
};

const jobs = async () => {
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

  try {
    await warnUsersAboutIncomingDemotion();
  } catch (e) {
    await failedJob("warnUsersAboutIncomingDemotion");
  }
  process.exit();
};

jobs();
