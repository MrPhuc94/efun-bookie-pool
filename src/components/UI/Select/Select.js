import React from "react";
import Select, { components } from "react-select";

function SelectCustom(props) {
  const { options } = props;

  const CustomOption = ({ innerRef, innerProps }) => (
    <div ref={innerRef} {...innerProps} />
  );

  return <Select components={{ Option: CustomOption }} options={options} />;
}

export default SelectCustom;
