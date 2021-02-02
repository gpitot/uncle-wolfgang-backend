import React from "react";
import style from "./style.module.scss";
interface IProps {
  name: string;
  photo: string;
}

const UserRow = ({ name, photo }: IProps) => (
  <div className={style.user}>
    <img src={photo} alt=""/>
    <span>{name}</span>
  </div>
);

export default UserRow;
