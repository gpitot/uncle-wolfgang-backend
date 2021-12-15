#! /app/.heroku/node/bin/node

import { sendFreebieMessages } from "./scheduled/freebies";

const jobs = async () => {
  await sendFreebieMessages();

  process.exit();
};

jobs();
