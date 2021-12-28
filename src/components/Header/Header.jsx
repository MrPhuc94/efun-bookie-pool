import React, { useState, useEffect } from "react";
import "./styles.scss";
import { showAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import ModalConnectWallet from "../Modal/ConnectWallet/ConnectWallet";
import Images from "src/common/Images";
import { useSelector } from "react-redux";
import { shortAddress } from "src/utils/helper";

const showChooseWallet = () => {
  console.log("ABCDEF");
  store.dispatch(showAppPopup(<ModalConnectWallet />));
};

const Header = () => {
  const currentAddress = useSelector((state) => state.wallet.currentAddress);
  console.log("currentAddress1234", currentAddress);

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
                {currentAddress !== null ? (
                  <button className="btn-address">
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
            <ul className="menu-mb">
              <li>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
