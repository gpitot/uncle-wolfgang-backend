import React, { useContext } from "react";
import { UserContext } from "contexts/UserContext";

const AdminControl = <P extends object>(Component: React.ComponentType<P>) => {
  const AdminComponent = (props: P) => {
    const { user } = useContext(UserContext);

    if (!user.id) return null;
    if (user.role !== "admin" && user.role !== "superman") return null;
    return <Component {...props} />;
  };

  return AdminComponent;
};

export default AdminControl;
