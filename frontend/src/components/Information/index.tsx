import React from "react";
import style from "./style.module.scss";
import classnames from "classnames";
import { ClassValue } from "classnames/types";
interface IProps {
  children: React.ReactNode;
  styles?: ClassValue;
}
const Information = ({ children, styles }: IProps) => (
  <div className={classnames(style.block, styles)}>{children}</div>
);
export default Information;
