import React from "react";
import AdminControl from "components/AdminControl";
import classnames from "classnames";
import style from "./style.module.scss";
interface IProps {
  paid: boolean;
}
const Paid = ({ paid }: IProps) => {
  const c = paid ? style.paid : style.notpaid;
  return <div className={classnames(style.paidIcon, c)}></div>;
};

export default AdminControl(Paid);
