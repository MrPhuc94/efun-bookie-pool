import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { dismissAppPopup, showAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import ModalConnectWallet from "../Modal/ConnectWallet/ModalConnectWallet";
import Images from "src/common/Images";
import { useSelector } from "react-redux";
import { shortAddress } from "src/utils/helper";
import ModalLogout from "../Modal/Logout/Logout";
import World from "src/assets/icons/World";
import unitedKingdom from "src/assets/images/country/united-kingdom.png";
import china from "src/assets/images/country/china.png";
import indonesia from "src/assets/images/country/indonesia.png";
import japan from "src/assets/images/country/japan.png";
import philippines from "src/assets/images/country/philippines.png";
import southKorea from "src/assets/images/country/south-korea.png";
import iran from "src/assets/images/country/iran.png";
import { useTranslation } from "react-i18next";

const showChooseWallet = () => {
  store.dispatch(showAppPopup(<ModalConnectWallet />));
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const _currentAddress =
    useSelector((state) => state.wallet?.currentAddress) ||
    localStorage.getItem("currentAddress");

  const [currentAddress, setCurrentAddress] = useState("");
  const [activeNav, setActiveNav] = useState(false);
  const navWrapper = useRef();

  const listLang = [
    { key: "en", label: "English", icon: unitedKingdom },
    { key: "in", label: "Indonesia", icon: indonesia },
    { key: "kr", label: "Korea", icon: southKorea },
    { key: "ir", label: "Persian", icon: iran },
    { key: "pl", label: "Philippines", icon: philippines },
    { key: "jp", label: "Japan", icon: japan },
    { key: "cn", label: "Chinese", icon: china },
  ];

  const handleChangeLanguage = (param) => {
    i18n.changeLanguage(param?.key);
  };

  useEffect(() => {
    setCurrentAddress(_currentAddress);
  }, [_currentAddress]);

  const showModalLogout = () => {
    store.dispatch(dismissAppPopup());
    store.dispatch(
      showAppPopup(<ModalLogout currentAddress={currentAddress} />)
    );
  };

  const handleCloseNav = () => setActiveNav(!activeNav);

  return (
    <header className="header">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <a
            href="https://app.efun.tech/"
            target="_blank"
            alt=""
            rel="noreferrer"
            className="logo"
          >
            <img src={Images.logo} alt="" />
          </a>
          <nav className="main-menu">
            <ul className="menu-pc">
              <li>
                <a
                  href="https://efun.tech/"
                  target="_blank"
                  alt=""
                  rel="noreferrer"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://docs.efun.tech/efun-ecosystem-1/efun-sponsored-events"
                  target="_blank"
                  alt=""
                  rel="noreferrer"
                >
                  How It Works
                </a>
              </li>
              <li>
                <div className="dropdown">
                  <span className="button">
                    <World />
                  </span>
                  <div className="dropdown-content">
                    {listLang.map((item, index) => (
                      <div key={index}>
                        <img
                          src={item.icon}
                          width={20}
                          height={20}
                          alt={item.label}
                        />
                        <span style={{ marginLeft: 10 }}>{item.label} </span>
                        <br />
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                {currentAddress !== null ? (
                  <button className="btn-address" onClick={showModalLogout}>
                    {shortAddress(currentAddress, 5)}
                  </button>
                ) : (
                  <div>
                    <button
                      className="connect-wallet-btn"
                      onClick={showChooseWallet}
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </li>
            </ul>
            <ul className="menu-mobile">
              <li>
                <div className="dropdown">
                  <span className="button">
                    <World />
                  </span>
                  <div className="dropdown-content">
                    {listLang.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleChangeLanguage(item)}
                      >
                        <img
                          src={item.icon}
                          width={20}
                          height={20}
                          alt={item.label}
                        />
                        <span style={{ marginLeft: 10 }}>{item.label} </span>
                        <br />
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                {currentAddress !== null ? (
                  <button className="btn-address" onClick={showModalLogout}>
                    {shortAddress(currentAddress, 5)}
                  </button>
                ) : (
                  <div>
                    <button
                      className="connect-wallet-btn"
                      onClick={showChooseWallet}
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </li>
              <li onClick={handleCloseNav}>
                <span
                  className="menu_mb_btn"
                  onClick={() => {
                    //return openMenu();
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="20"
                      height="2"
                      rx="1"
                      fill="white"
                    />
                    <rect
                      x="2"
                      y="11"
                      width="20"
                      height="2"
                      rx="1"
                      fill="white"
                    />
                    <rect
                      x="2"
                      y="19"
                      width="20"
                      height="2"
                      rx="1"
                      fill="white"
                    />
                  </svg>
                </span>
              </li>
            </ul>
          </nav>
          <div
            className={`nav-wrapper ${activeNav ? "nav-active" : ""}`}
            ref={navWrapper}
            onClick={handleCloseNav}
          >
            <ul className="nav-mobile">
              <li style={{ marginBottom: 10 }}>
                <a
                  href="https://app.efun.tech/"
                  target="_blank"
                  alt=""
                  rel="noreferrer"
                  className="logo"
                >
                  <img src={Images.logo} alt="" />
                </a>
              </li>
              <li className="nav-mobile-item">
                <a
                  href="https://efun.tech/"
                  target="_blank"
                  alt=""
                  rel="noreferrer"
                >
                  About
                </a>
              </li>
              <li className="nav-mobile-item">
                <a
                  href="https://docs.efun.tech/efun-ecosystem-1/efun-sponsored-events"
                  target="_blank"
                  alt=""
                  rel="noreferrer"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
