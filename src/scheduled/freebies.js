import { sendGroupMessage } from "../queries/notifications";
import { getUsersWithFreebieSession } from "../queries/admin";

const sendFreebieMessages = async () => {
  const date = new Date();
  console.log("date.getDay() ", date.getDay(), date.getHours());
  if (date.getDay() === 1) {
    const users = await getUsersWithFreebieSession();
    await sendGroupMessage(users, "social-freebie-reminder");
  }
  return Promise.resolve();
};

export { sendFreebieMessages };
