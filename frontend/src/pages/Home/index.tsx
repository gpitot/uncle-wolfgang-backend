import React, { useEffect } from "react";
import style from "./style.module.scss";
import { useLocation } from "react-router-dom";
import API from "rest/api";

const Home = () => {
  const query = new URLSearchParams(useLocation().search);
  const refreshUser = query.get("updatelogin") === "true";

  useEffect(() => {
    if (refreshUser) {
      API.users.refreshUser();
    }
  }, [refreshUser]);

  return (
    <>
      <section className={style.area}>
        <video src="video.webm" className={style.video}></video>
      </section>
    </>
  );
};

export default Home;
