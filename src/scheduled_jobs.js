#! /app/.heroku/node/bin/node

import { sendMessage } from "./twilio-api";

sendMessage("scheduled job 1", "0433641873", 1);
