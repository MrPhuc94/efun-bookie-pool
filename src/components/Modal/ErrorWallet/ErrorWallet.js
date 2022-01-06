import React, { useRef, useEffect } from "react";
import { dismissAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import { changeCurrentAddress } from "src/redux/reducers/walletSlice";

const ModalErrorWallet = (props) => {
  const { messageError } = props;
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

  return (
    <div
      className="modal-container"
      ref={modalRef}
      // onClick={(e) => handleCloseModal(e)}
    >
      <div className="modal-wrapper">
        <div className="mb-large center">
          <div
            className="text-large"
            style={{ color: "#fff", wordBreak: "break-all" }}
          >
            {messageError}
          </div>
        </div>
        <div className="center">
          <button className="btn-logout" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalErrorWallet;
