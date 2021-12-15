import { demoteForInactivity } from "../queries/ladder";

const demoteUsers = () => {
  return demoteForInactivity({ ladder_id: 1 });
};

export { demoteUsers };
