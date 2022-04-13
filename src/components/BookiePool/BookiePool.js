import Images from "src/common/Images";
import React, { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import { changeYourContributed, changeYourContributedPending } from "src/redux/reducers/matchesSlice";
import MenuLink from "./MenuLink/MenuLink";
import { showAppPopup } from "src/redux/reducers/appSlice";
import ModalClaim from "../Modal/ModalClaim/ModalClaim";
import { useSelector } from "react-redux";
import { formatNumber, formatNumberPrice } from "src/utils/helper";
import ModalConnectWallet from "../Modal/ConnectWallet/ModalConnectWallet";
import ModalContributeRule from "../Modal/ModalContributeRule/ModalContributeRule";


export const showChooseWallet = () => {
  store.dispatch(showAppPopup(<ModalClaim />));
};

export const showContributeRule = () => {
  store.dispatch(showAppPopup(<ModalContributeRule />));
};


const BookiePool = () =>  {
  const [amountContribute, setAmountContribute] =  useState(20000)
  const [errorAmount, setErrorAmount] =  useState('')
  const [totalBookiePool, setTotalBookiePool] = useState(123000)
  const [balanceEfun, setBalanceToken] = useState(0)


  useEffect(() => {
    // localStorage.removeItem("yourPredict");
    // store.dispatch(changeYourPredict(null));
  }, []);

  const yourContributed = useSelector(state => state.matches.yourContributed)
  const yourContributedPending = useSelector(state => state.matches.yourContributedPending)

  const currentAddress =
  useSelector((state) => state.wallet?.currentAddress) ||
  localStorage.getItem("currentAddress");

  // get balance token
  let tokens =
  useSelector((state) => state.wallet.tokens) ||
  JSON.parse(localStorage.getItem("tokens"));

  useEffect(() => {
    const currentToken = tokens?.find((item) => item?.symbol === "EFUN");
    if(currentToken) {
      setBalanceToken(currentToken?.balance)
      resetValue()
    }else{
      setBalanceToken(0)
    }
  }, [currentAddress])

  const resetValue = () => {
    store.dispatch(changeYourContributed(0))
    store.dispatch(changeYourContributedPending(0))
  }
 
  const contributeEfun= () => {
    // console.log('isFirstDayOfMonth', isFirstDayOfMonth)
    if(currentAddress == null) {
      store.dispatch(showAppPopup(<ModalConnectWallet />));
    }else{
      if(errorAmount !== '') return;

      if (isFirstDayOfMonth) {
        const totalContributed = parseFloat(amountContribute) + parseFloat(yourContributed)
        const newTotalPredictPool = totalBookiePool + totalContributed;
        setTotalBookiePool(newTotalPredictPool)
        store.dispatch(changeYourContributed(totalContributed))
      } else {
        const totalContributed = parseFloat(amountContribute) + parseFloat(yourContributedPending)
        store.dispatch(changeYourContributedPending(totalContributed))
      }
    }
  }

  const isFirstDayOfMonth = useMemo(() => {
    let date = new Date().getDate();
    if(date === 1) return true
    return true
  }, [])

  const maxAmount = () => {
    setAmountContribute(formatNumber(balanceEfun))
  }

  const requestWithDraw  = () => {
    store.dispatch(showAppPopup(<ModalClaim />));
  }

  useEffect(() => {
    // console.log('balanceEfun', balanceEfun)
    // console.log('amountContribute', amountContribute)
    if(parseFloat(amountContribute) > parseFloat(balanceEfun)){
      setErrorAmount('Insufficient balance')
    } else if (parseFloat(amountContribute) < 20000 ) {
      setErrorAmount('Min Contribute Amount >= 20000 EFUN')
    } 
    else if (amountContribute === '') {
      setErrorAmount('Invalid amount')
    } 
    else {
      setErrorAmount('')
    }
  }, [amountContribute, balanceEfun])

  const percentMonthly = useMemo(() => {
    return yourContributed / parseFloat(totalBookiePool) * 100
  }, [yourContributed, totalBookiePool])

  return (
    <div className="mini-game">
      <div
        className={`heading-box`}
        style={{
          background: `url(${Images.header_box}) no-repeat center center`,
          objectFit: "cover",
        }}
      >
        <h1>
          Bookie <strong>pool</strong>
        </h1>
      </div>
      <div className="page-bookie">
        <MenuLink />
        <div className="box-bookie">
          <img src={Images.FrameBookie} alt="bookie"/>
          {/* Contribution */}
          <div className="contribution mt-5">
            <div className="item">
              <span className="gray">Your contribution</span>
              <span className="yellow bold">{formatNumberPrice(yourContributed)} EFUN</span>
            </div>
            <div className="item">
              <span className="gray">Your P&L</span>
              <span className="bold">0 EFUN</span>
            </div>
          </div>
          {currentAddress !== null && <div className="mt-4">
            <span className="underline gray cursor-pointer" onClick={requestWithDraw}>Request Withdraw</span>
          </div>}
          <div className="section-contribute mt-5">
            <div className="contribute">
              <div className="item">
                <span className="gray">Total Bookie Pool</span>
                <span className="yellow bold">{formatNumberPrice(totalBookiePool)} EFUN</span>
              </div>
              <div className="item">
                <span className="gray">Return rate</span>
                <span className={`bold ${percentMonthly > 0 && 'color-green'}`}>{formatNumberPrice(percentMonthly)}% monthly</span>
              </div>
              { yourContributedPending > 0 &&
              <div className="item mt-3">
                <span className="gray">Pending contribution</span>
                <span className="yellow bold">{formatNumberPrice(yourContributedPending)} EFUN</span>
              </div> 
              }
              { yourContributedPending > 0 && 
                <div className="box-amount-pending mt-1">
                    <span className="gray">Pending contribution amount will be added to the bookie pool on the first day of next month</span>
                </div> 
              }
            </div>
            {currentAddress !== null && <div className="flex_row mt-4 contribute">
                <span className="gray">Your Balance</span>
                <span className="yellow bold">{formatNumberPrice(balanceEfun)} EFUN</span>
            </div>}
            {currentAddress !== null &&            
              <>
                <div className="flex_row contribute mt-2">
                  <span>Contribute Amount</span>
                </div>
                <div className="contribute">
                  <div className="box-input mt-2">
                    <input className="input" type="number" style={{ outline: "none" }} value={amountContribute} onChange={(e) => setAmountContribute(e.target.value)}
                    />
                    <div className="underline bold yellow cursor-pointer" onClick={maxAmount}>Max</div>
                  </div>
                  <div style={{ color: "red", textAlign: "left", fontWeight: "bold" }}>{errorAmount}</div>
                </div>
              </>
           }
            <div className={`btn-contribute mt-3 ${errorAmount !== '' && "disable-btn"}`} onClick={contributeEfun}>
              <span className="bold black">Contribute EFUN</span>
            </div>
            <div className="mt-3" onClick={showContributeRule}>
              <span className="underline gray cursor-pointer">Contribution rules</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookiePool;
