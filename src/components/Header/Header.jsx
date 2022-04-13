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
import { storeData } from "src/utils/storageUtils";
import { ASYNC_STORAGE_KEYS } from "src/common/Constants";
import { setLanguage } from "src/redux/reducers/userSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { walletManager } from "src/blockchain/utils/walletManager";
import { changeCurrentAddress } from "src/redux/reducers/walletSlice";

export const showChooseWallet = (navigate) => {
  store.dispatch(showAppPopup(<ModalConnectWallet navigate={navigate} />));
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  // const [currentAddress, setCurrentAddress] = useState('')

  const currentAddress =
    useSelector((state) => state.wallet?.currentAddress) ||
    localStorage.getItem("currentAddress");

  window.ethereum?.on("accountsChanged", async function (accounts) {
    // check balance meta mask
    const currentAddress = await walletManager.connectWallet('Metamask');
    localStorage.setItem("currentAddress", currentAddress);
    store.dispatch(changeCurrentAddress(currentAddress));
    localStorage.setItem("extensionName", "metamask");
  });


  const [activeNav, setActiveNav] = useState(false);
  const navWrapper = useRef();
  const [showNavLang, setShowNavLang] = useState(false);
  const modalRef = useRef(null);

  const listLang = [
    // { key: "en", label: "English", icon: unitedKingdom },
    // { key: "id", label: "Indonesia", icon: indonesia },
    // { key: "kr", label: "Korea", icon: southKorea },
    // { key: "ir", label: "Persian", icon: iran },
    // { key: "pl", label: "Philippines", icon: philippines },
    // { key: "jp", label: "Japan", icon: japan },
    // { key: "cn", label: "Chinese", icon: china },
    // { key: "fr", label: "France", icon: Images.France },
    { key: "en", label: "English", icon: unitedKingdom },
    { key: "en", label: "Indonesia", icon: indonesia },
    { key: "en", label: "Korea", icon: southKorea },
    { key: "en", label: "Persian", icon: iran },
    { key: "en", label: "Philippines", icon: philippines },
    { key: "en", label: "Japan", icon: japan },
    { key: "en", label: "Chinese", icon: china },
    { key: "en", label: "France", icon: Images.France },
  ];

  const handleChangeLanguage = (param) => {
    if (param?.label !== "English") {
      toast("Coming soon!");
    }
    i18n.changeLanguage(param?.key);
    store.dispatch(setLanguage(param.key));
    storeData(ASYNC_STORAGE_KEYS.LANGUAGE, JSON.stringify(param));
    setShowNavLang(false);
  };

  const showModalLogout = () => {
    store.dispatch(dismissAppPopup());
    store.dispatch(
      showAppPopup(
        <ModalLogout currentAddress={currentAddress} navigate={navigate} />
      )
    );
  };

  const handleCloseNav = () => setActiveNav(!activeNav);

  const _showNavLang = () => {
    setShowNavLang(!showNavLang);
  };

  const handleCloseModal = (e) => {
    if (e.target === modalRef.current) _showNavLang();
  };

  return (
    <div className="header">
      <nav className="main-menu">
        <div>
          <a href="https://app.efun.tech/" target="_blank" rel="noreferrer">
            <img src={Images.logo} alt="logo" />
          </a>
        </div>
        <ul className="menu-pc">
          <li>
            <a
              href="https://efun.tech/"
              target="_blank"
              alt=""
              rel="noreferrer"
            >
              {t("common.about")}
            </a>
          </li>
          <li>
            <a
              href="https://docs.efun.tech/efun-ecosystem-1/efun-sponsored-events"
              target="_blank"
              alt=""
              rel="noreferrer"
            >
              {t("common.how_it_works")}
            </a>
          </li>
          <li>
            <div className="dropdown">
              <span className="button" onClick={_showNavLang}>
                <World />
              </span>
              <div className={`dropdown-content ${showNavLang && "active"}`} ref={modalRef}>
                {listLang.map((item, index) => (
                  <div key={index} onClick={() => handleChangeLanguage(item)}>
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
                  onClick={() => showChooseWallet(navigate)}
                >
                  {t("common.connect_wallet")}
                </button>
              </div>
            )}
          </li>
        </ul>
        <ul className="menu-mobile">
          <li>
            <div className="dropdown">
              <span className="button" onClick={_showNavLang}>
                <World />
              </span>
              <div className={`dropdown-content ${showNavLang && "active"}`}>
                {listLang.map((item, index) => (
                  <div key={index} onClick={() => handleChangeLanguage(item)}>
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
                  onClick={() => showChooseWallet(navigate)}
                >
                  {t("common.connect_wallet")}
                </button>
              </div>
            )}
          </li>
          <li onClick={handleCloseNav}>
            <span className="menu_mb_btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="3" width="20" height="2" rx="1" fill="white" />
                <rect x="2" y="11" width="20" height="2" rx="1" fill="white" />
                <rect x="2" y="19" width="20" height="2" rx="1" fill="white" />
              </svg>
            </span>
          </li>
        </ul>
      </nav>
      <div
        className={`nav-wrapper ${activeNav && "nav-active"}`}
        ref={navWrapper}
        onClick={handleCloseNav}
      >
        <ul className="nav-mobile">
          <div>
            <img src={Images.logo} alt="logo" />
          </div>
          <li className="item">
            <a
              href="https://efun.tech/"
              target="_blank"
              alt=""
              rel="noreferrer"
            >
              {t("common.about")}
            </a>
          </li>
          <li className="item">
            <a
              href="https://docs.efun.tech/efun-ecosystem-1/efun-sponsored-events"
              target="_blank"
              alt=""
              rel="noreferrer"
            >
              {t("common.how_it_works")}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
