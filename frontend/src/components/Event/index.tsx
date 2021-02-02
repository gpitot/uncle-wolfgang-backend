import React from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import { IEvent } from "rest/events";

const Event = (event: IEvent) => {
  const { description, id, name } = event;
  return (
    <Link
      to={{ pathname: `/event/${id}`, state: event }}
      className={style.event}
      key={id}
    >
      <h2>{name}</h2>
      <h5>{description}</h5>
    </Link>
  );
};

export default Event;
