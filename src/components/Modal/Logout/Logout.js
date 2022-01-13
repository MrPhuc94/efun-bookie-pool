import React, { useRef, useEffect } from "react";
import { dismissAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import { resetStoreRedux } from "src/utils/helper";

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

  useEffect(() => {
    const body = document.querySelector("body");
    body.style.overflow = modalRef ? "hidden" : "auto";
    return () => {
      body.style.overflow = "auto";
    };
  }, [modalRef]);

  const handleLogout = () => {
    localStorage.clear();
    resetStoreRedux();
  };

  return (
    <div
      className="modal-container"
      ref={modalRef}
      onClick={(e) => handleCloseModal(e)}
    >
      <div className="modal-wrapper">
        <div className="flex_row_center center mb-large">
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
