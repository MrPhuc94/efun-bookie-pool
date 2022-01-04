import Images from "src/common/Images";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./styles.scss";

const MenuTop = ({ menu, onPressItem }) => {
  const menuTab = useSelector((state) => state.user?.menuTab || 0);
  const [active, setActive] = useState(menuTab);

  const handleMenuActive = (data) => {
    setActive(data);
    onPressItem && onPressItem(data);
  };

  return (
    <div className="menu-wrapper">
      <ul className="list-menu">
        {menu?.map((item, index) => (
          <li
            key={index}
            className={`menu-item ${
              active === index ? "menu-item--active" : ""
            }`}
            onClick={() => {
              handleMenuActive(index);
            }}
          >
            <div>
              <img src={item?.logo} alt="" width={40} height={40} />
              <span> {item?.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuTop;
