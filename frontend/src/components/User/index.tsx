import React, { useState, useEffect, useContext } from "react";
import API from "rest/api";
import { UserContext } from "contexts/UserContext";
import style from "./style.module.scss";

const User = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    API.users
      .getUser()
      .then((res) => {
        if (res.success) {
          setUser(res.user);
        }
      })
      .finally(() => setLoading(false));
  }, [setUser]);

  if (loading) return null;

  return (
    <div className={style.user}>
      {user.id ? (
        <img src={user.photo} alt="" />
      ) : (
        <a
          href={`${process.env.REACT_APP_API_URL}/auth/login/google`}
          className={style.book}
        >
          Login
        </a>
      )}
    </div>
  );
};

export default User;
