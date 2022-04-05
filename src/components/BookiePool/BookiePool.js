import Images from "src/common/Images";
import React, { useEffect } from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import { changeYourPredict } from "src/redux/reducers/matchesSlice";
import MenuLink from "./MenuLink/MenuLink";

function BookiePool() {
  useEffect(() => {
    localStorage.removeItem("yourPredict");
    store.dispatch(changeYourPredict(null));
  }, []);

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
              <span className="yellow bold">0 EFUN</span>
            </div>
            <div className="item">
              <span className="gray">Your P&L</span>
              <span className="yellow bold">0 EFUN</span>
            </div>
          </div>
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
                <input className="input" type="text" defaultValue={0}/>
                <div className="underline bold yellow">Max</div>
              </div>
            </div>
            <div className="btn-contribute mt-3">
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
