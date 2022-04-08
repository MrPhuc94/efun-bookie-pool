import React, { useRef, useState, useEffect } from "react";
import { dismissAppPopup, showAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import Images from "src/common/Images";
import { walletManager } from "src/blockchain/utils/walletManager";
import { useSelector } from "react-redux";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import ModalErrorWallet from "../ErrorWallet/ErrorWallet";
import { changeCurrentAddress } from "src/redux/reducers/walletSlice";

const override = css`
  margin: 0 auto;
`;

const ModalConnectWallet = (props) => {
  // const { navigate } = props;
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

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
  const [showDialog, setShowDialog] = useState(0);
  const [availableWallet, setAvailableWallet] = useState();
  const [isSigning, setIsSigning] = useState();
  const [hasMetamask, setHasMetamask] = useState();
  const [hasBinance, setHasBinance] = useState();
  const [hasTrust, setHasTrust] = useState();
  const [errorDialog, setShowErrorDialog] = useState();

  useEffect(() => {
    const body = document.querySelector("body");
    body.style.overflow = modalRef ? "hidden" : "auto";
    return () => {
      body.style.overflow = "auto";
    };
  }, [modalRef]);

  useEffect(() => {
    let isAvailableWallet = walletManager.checkSupportedWalletsType();
    setAvailableWallet(isAvailableWallet);
    // console.log("availableWallet", isAvailableWallet);
  }, []);

  const currentAddress = useSelector((state) => state?.wallet?.currentAddress);
  //console.log("currentAddress", currentAddress);

  // dynamic function
  const connectWallet = async (walletName) => {
    setLoading(true);
    if (availableWallet && availableWallet.includes(walletName)) {
      try {
        const currentAddress = await walletManager.connectWallet(
          walletName,
          false
        );
        localStorage.setItem("currentAddress", currentAddress);
        store.dispatch(changeCurrentAddress(currentAddress));
        localStorage.setItem("extensionName", walletName);
        setLoading(false);
        store.dispatch(dismissAppPopup());
        // navigate("/");
      } catch (e) {
        store.dispatch(
          showAppPopup(<ModalErrorWallet messageError={e.toString()} />)
        );
      }
    } else {
      setLoading(false);
      store.dispatch(dismissAppPopup());
      store.dispatch(
        showAppPopup(
          <ModalErrorWallet
            messageError={`You need to have the ${walletName} extension first. Please set up or login to your ${walletName} account and connect it to continue.`}
          />
        )
      );
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
        <div className="flex_row_center center mb-large">
          <span className="text-large">Wallet integration</span>
          <div className="btn-close" onClick={onClose}></div>
        </div>

        <div className="mb-large center">
          <span className="text-small">
            Please connect account to your wallet
          </span>
        </div>
        <div
          className="flex_row_start mb-medium btn-metamask"
          onClick={() => {
            connectWallet("Metamask");
          }}
        >
          {!loading ? (
            <>
              <div className="mr-small">
                <img src={Images.metaMask} alt="" width={40} height={40} />
              </div>
              <div className="text-small">Metamask wallet</div>
            </>
          ) : (
            <ClipLoader
              color={color}
              loading={loading}
              css={override}
              size={40}
            />
          )}
        </div>

        <div
          className="flex_row_start btn-trust"
          onClick={() => {
            // connectWallet("TrustWallet");
          }}
        >
          <div className="mr-small">
            <img src={Images.trust} alt="" width={40} height={40} />
          </div>
          <div className="text-small">Trust wallet</div>
        </div>
      </div>
    </div>
  );
};

export default ModalConnectWallet;
