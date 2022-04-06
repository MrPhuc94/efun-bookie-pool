import Images from "src/common/Images";
import React, { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import { changeYourContributed, changeYourContributedPending } from "src/redux/reducers/matchesSlice";
import MenuLink from "./MenuLink/MenuLink";
import { showAppPopup } from "src/redux/reducers/appSlice";
import ModalClaim from "../Modal/ModalClaim/ModalClaim";
import { useSelector } from "react-redux";


export const showChooseWallet = (navigate) => {
  store.dispatch(showAppPopup(<ModalClaim navigate={navigate} />));
};


const BookiePool = () =>  {
  const [amountContribute, setAmountContribute] =  useState('')

  useEffect(() => {
    // localStorage.removeItem("yourPredict");
    // store.dispatch(changeYourPredict(null));
  }, []);

  const yourContributed = useSelector(state => state.matches.yourContributed)
  const yourContributedPending = useSelector(state => state.matches.yourContributedPending)

  const contributeEfun= () => {
    console.log('isFirstDayOfMonth', isFirstDayOfMonth)
    if (isFirstDayOfMonth) {
      const totalContributed = parseFloat(amountContribute) + parseFloat(yourContributed)
      store.dispatch(changeYourContributed(totalContributed))
    } else {
      const totalContributed = parseFloat(amountContribute) + parseFloat(yourContributedPending)
      store.dispatch(changeYourContributedPending(totalContributed))
    }
  }

  const isFirstDayOfMonth = useMemo(() => {
    let date = new Date().getDate();
    console.log("date====12222", date)
    if(date === 1) return true
    return false
  }, [])


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
              <span className="yellow bold">{yourContributed} EFUN</span>
            </div>
            <div className="item">
              <span className="gray">Your P&L</span>
              <span className="yellow bold">0 EFUN</span>
            </div>
          { yourContributedPending > 0 && 
              <div className="item">
                <span className="gray">Pending contribution</span>
                <span className="yellow bold">{yourContributedPending} EFUN</span>
              </div> 
          }
          </div>
          { yourContributedPending > 0 && 
            <div className="box-amount-pending mt-4">
                <span className="gray">Pending contribution amount will be added to the bookie pool on the first day of next month</span>
              </div> 
          }
          <div className="mt-4">
            <span className="underline gray">Request Withdraw</span>
          </div>
          <div className="section-contribute mt-5">
            <div className="contribute">
              <div className="item">
                <span className="gray">Total Bookie Pool</span>
                <span className="yellow bold">123.000.000 EFUN</span>
              </div>
              <div className="item">
                <span className="gray">Return rate</span>
                <span className="bold">0% monthly</span>
              </div>
            </div>
            <div className="flex_row mt-4 contribute">
                <span className="gray">Contribute Amount - Your Balance:</span>
                <span className="yellow bold"> 1,000,000 EFUN</span>
            </div>
            <div className="contribute">
              <div className="box-input mt-3">
                <input className="input" type="number" value={amountContribute} onChange={(e) => setAmountContribute(e.target.value)}
                />
                <div className="underline bold yellow">Max</div>
              </div>
            </div>
            <div className="btn-contribute mt-3" onClick={contributeEfun}>
              <span className="bold black">Contribute EFUN</span>
            </div>
            <div className="mt-3">
              <span className="underline gray">Contribution rules</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookiePool;
