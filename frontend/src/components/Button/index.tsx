import React from "react";
import style from "./style.module.scss";
interface IProps {
  handleClick: () => void;
  text: string;
  disabled?: boolean;
}

const Button = ({ disabled = false, handleClick, text }: IProps) => {
  return (
    <button className={style.button} disabled={disabled} onClick={handleClick}>
      {text}
    </button>
  );
};

export default Button;
