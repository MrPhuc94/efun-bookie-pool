import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { WIDTH } from "src/assets/themes/dimension";

const Dropdown = (props) => {
  const { selectedValue, options, changeSelected } = props;

  const [isListOpen, setIsListOpen] = useState(false);

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const selectItem = (item) => {
    changeSelected(item);
    setIsListOpen(!isListOpen);
  };

  return (
    <div className="dd-wrapper">
      <div onClick={toggleList}>
        <div className="flex-row">
          <div className="item active">
            <div className="item-left">
              <img src={selectedValue.logo} width={30} height={30} alt="logo" />
            </div>
            <div className={`${WIDTH <= 600 ? "text-small" : ""} item-center`}>
              {selectedValue.label}
            </div>
            <div className="btn-predict item-right">Predict</div>
            <div style={{ display: "block", width: 20 }}>
              {isListOpen ? <FiArrowDown /> : <FiArrowUp />}
            </div>
          </div>
        </div>
      </div>
      {isListOpen && (
        <div role="list" className="dd-list">
          {options.map((item, index) => (
            <div
              className={`item `}
              key={index}
              onClick={() => selectItem(index)}
            >
              <div className="item-left">
                <img src={item.logo} width={30} height={30} alt="logo" />
              </div>
              <div
                className={`${WIDTH <= 600 ? "text-small" : ""} item-center`}
              >
                {item.label}
              </div>
              <div className="btn-predict item-right">Predict</div>
              <div style={{ display: "block", width: 20 }}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
