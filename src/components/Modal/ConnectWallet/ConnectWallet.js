import React, { useRef, useState } from "react";
import { dismissAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import Images from "src/common/Images";

const ModalConnectWallet = () => {
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
  const [showDialog, setShowDialog] = useState();
  const [availableWallet, setAvailableWallet] = useState();
  const [isSigning, setIsSigning] = useState();
  const [hasMetamask, setHasMetamask] = useState();
  const [hasBinance, setHasBinance] = useState();
  const [hasTrust, setHasTrust] = useState();
  const [errorDialog, setShowErrorDialog] = useState();

  // dynamic function
  const connectWallet = async (walletName) => {
    if (availableWallet && availableWallet.includes(walletName)) {
      try {
        isSigning = walletName;
        await connectWallet(walletName, false);
        isSigning = false;
        //emit("close");
        localStorage.setItem("extensionName", walletName);
      } catch (e) {
        setShowErrorDialog({ text: e });
      }
    } else {
      setShowErrorDialog({
        text: `You need to have the ${walletName} extension first. Please set up or login to your ${walletName} account and connect it to continue.`,
      });
    }
  };

  const getWalletConnect = async (walletName) => {
    try {
      // required set
      localStorage.setItem("extensionName", walletName);
      isSigning = walletName;
      await connectWallet(walletName, false);
      isSigning = false;
      //emit("close");
    } catch (e) {
      localStorage.removeItem("extensionName");
    }
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
            <span className="text-large">Wallet integration</span>
          </div>
          <div className="btn-close" onClick={onClose}></div>
        </div>

        <div className="mb-large center">
          <span className="text-medium">
            Please connect account to your wallet
          </span>
        </div>
        <div
          className="flex_row_start mb-medium btn-metamask"
          onClick={() => {
            connectWallet("Metamask");
          }}
        >
          <div className="mr-small">
            <img src={Images.metaMask} alt="" width={40} height={40} />
          </div>
          <div>Metamask wallet</div>
        </div>
        <div
          className="flex_row_start btn-trust"
          onClick={() => {
            connectWallet("TrustWallet");
          }}
        >
          <div className="mr-small">
            <img src={Images.trust} alt="" width={40} height={40} />
          </div>
          <div>Trust wallet</div>
        </div>
      </div>
    </div>
  );
};

export default ModalConnectWallet;
