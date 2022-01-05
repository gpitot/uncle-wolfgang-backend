import { demoteForInactivity, getAlmostInactiveUsers } from "../queries/ladder";

const demoteUsers = () => {
  return demoteForInactivity({ ladder_id: 1 });
};

const warnUsersAboutIncomingDemotion = () => {
  return getAlmostInactiveUsers(1);
};

export { demoteUsers, warnUsersAboutIncomingDemotion };
