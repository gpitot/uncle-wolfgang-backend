import React from "react";
import style from "./style.module.scss";

interface IProps {
  time: string;
}

const EventDate = ({ time }: IProps) => {
  const date = new Date(time);

  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  return (
    <div className={style.date}>
      {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}{" "}
      {date.getHours()}:{minutes}
    </div>
  );
};

export default EventDate;
