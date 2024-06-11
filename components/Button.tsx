import { MouseEvent, ReactNode, useEffect, useState } from "react";
import styles from "../styles/Button.module.css";

type ButtonProps = {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  color: "info" | "success" | "error" | "dark" | "warning" | "light";
  outline: Boolean;
  rounded: Boolean;
  className: string;
  transform: "uppercase" | "lowercase" | "none";
  disabled: Boolean;
  type: "button" | "submit" | "reset" | undefined
};

const Button = ({
  children,
  onClick,
  color,
  outline,
  rounded,
  className,
  transform,
  disabled,
  type
}: ButtonProps) => {

  return (
    <button
      className={`${styles["btn"]} ${styles[color]} ${className} ${
        rounded ? "rounded-full" : "rounded"
      } ${disabled && styles["disabled"]} ${outline ? styles["outline"] : ""}`}
      style={{ textTransform: transform }}
      disabled={disabled ? true : false}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  outline: false,
  rounded: false,
  className: "",
  transform: "none",
  disabled: false,
  type: "button",
  color: "dark"
};

export default Button;
