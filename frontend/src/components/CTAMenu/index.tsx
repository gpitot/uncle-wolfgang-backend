import React from "react";
import style from "./style.module.scss";

const CTAMenu = ({ children }: { children: React.ReactNode }) => (
  <div className={style["cta-menu"]}>{children}</div>
);

export default CTAMenu;
