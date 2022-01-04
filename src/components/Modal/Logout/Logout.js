import React, { useRef } from "react";
import { dismissAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import { changeCurrentAddress } from "src/redux/reducers/walletSlice";

const ModalLogout = (props) => {
  const { currentAddress } = props;
  //default function
  const handleCloseModal = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const onClose = () => {
    store.dispatch(dismissAppPopup());
  };

  //state
  const { t } = useTranslation();
  const modalRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("currentAddress");
    store.dispatch(changeCurrentAddress(null));
    store.dispatch(dismissAppPopup());
  };

  return (
    <div
      className="modal-container"
      ref={modalRef}
      onClick={(e) => handleCloseModal(e)}
    >
      <div className="modal-wrapper">
        <div className="flex_row center mb-large">
          <div>
            <span className="text-large">Your wallet</span>
          </div>
          <div className="btn-close" onClick={onClose}></div>
        </div>

        <div className="mb-large center">
          <a
            className="text-medium"
            href={`https://testnet.bscscan.com/address/0x6b4De875dD6e6C4524Dc65Fc9B96b1Bf95BABbaA`}
            alt=""
            style={{ color: "#7676ff" }}
          >
            {currentAddress}
          </a>
        </div>
        <div className="mb-large center">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogout;
