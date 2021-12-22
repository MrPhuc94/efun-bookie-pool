import React, { useState } from "react";
import "./styles.scss";

const Checkbox = (props) => {
  const {
    id,
    label,
    type,
    indeterminate,
    hasError,
    onPress,
    selected,
    children,
    ...inputProps
  } = props;
  const checkboxClassName = `
      m-checkbox
      ${type === "switch" && "m-checkbox--switch"}
      ${type === "checkbox-circle" && "m-checkbox circle"}
      ${hasError && "m-checkbox--has-error"}
    `;

  const inputClassName = `
      m-checkbox__input
      ${type === "switch" && "m-checkbox--switch__input"}
      ${type === "checkbox-circle" && "m-checkbox circle"}
      ${hasError && "m-checkbox--has-error__input"}
      ${type === "switch" && selected === true && "isChecked"}
    `;

  const onClick = () => {
    onPress && onPress();
  };

  return (
    <div className={checkboxClassName} onClick={onClick}>
      <input
        type="checkbox"
        className={inputClassName}
        {...inputProps}
        checked={selected}
        onChange={() => {}}
      />
      {children}
    </div>
  );
};

export default Checkbox;
