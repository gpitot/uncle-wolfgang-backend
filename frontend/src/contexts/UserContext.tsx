import React, { createContext, useState } from "react";
import { IUser } from "rest/users";

const defaultUser = {
  id: undefined,
  email: "",
  firstname: "",
  lastname: "",
  role: "",
  photo: "",
} as IUser;

const defaultUserContext = {
  user: defaultUser,
  setUser: (user: IUser) => {},
};

const UserContext = createContext(defaultUserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(defaultUser);

  console.log("provider ", user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext };
export default UserProvider;
