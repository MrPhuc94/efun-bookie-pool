import React, { useRef, useState, useEffect } from "react";
import { dismissAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import Images from "src/common/Images";

const ModalContributeRule = (props) => {

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

  useEffect(() => {
      
  }, []);

  return (
    <div
      className="modal-container-rule"
      ref={modalRef}
      onClick={(e) => handleCloseModal(e)}
    >
      <div className="modal-wrapper">
      <div>
        <h4>
          Contribute Rules
        </h4>
      </div>
       <div className="mt-4">
         <p>
         The amount of tokens investors receive will depend on the the amount contributed among total bookie pool - in other words, the more investor contribute, the more profit investor will likely receive.
         </p>
         <p>
         Your profit will be finalized and recontributed to your contribution amount at the beginning of each month. 
         </p>
       </div>
       <div>
         <p>To contribute your $EFUN tokens:</p>
         <p>1. Connect your desired wallet (make sure to have BNB as well for the transaction fee)</p>
         <p>2. Approve EFUN</p>
         <p>3. Select the amount you’d like to contribute</p>
         <p>4. Press "Contribute EFUN”</p>
         <p>5. You’re ready to go!</p>
       </div>
       <p>Please note you can withdraw your tokens at any point, however if you request withdraw, you will need to wait till the first day of next month to claim your tokens (plus your profit that is finalized at the beginning of next month) without a fee. Should you wish to claim immediately, your profit will be canceled and a 15% charge fee is applied to your withdrawal amount.</p>
       <div className="underline mt-4 gray cursor-pointer" onClick={onClose}>Close</div>
      </div>
    </div>
  );
};

export default ModalContributeRule;
