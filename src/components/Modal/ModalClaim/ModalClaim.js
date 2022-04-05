import React, { useRef, useState, useEffect } from "react";
import { dismissAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import Images from "src/common/Images";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  margin: 0 auto;
`;

const ModalClaim = (props) => {
  const { navigate } = props;
  let [loading, setLoading] = useState(false);

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

  useEffect(() => {
      
  }, []);

  return (
    <div
      className="modal-container-claim"
      ref={modalRef}
      onClick={(e) => handleCloseModal(e)}
    >
      <div className="modal-wrapper">
       <img src={Images.Coins} alt="coin"/>
       <div className="mt-5 gray">
         <span className="Montserrat">
            Your token will be able to be claimed without fee on May 1st, 2022. If you want to claim now, a 15% charge fee is applied.
         </span>
       </div>
       <div className="flex_row mt-4">
           <div className="button" onClick={onClose}>
               <span>Wait till May 1st, 2022</span>
           </div>
           <div className="button-highlight" onClick={onClose}>
               <span>Claim now</span>
           </div>
       </div>
       <div className="underline mt-4 gray" onClick={onClose}>Cancel</div>
      </div>
    </div>
  );
};

export default ModalClaim;
