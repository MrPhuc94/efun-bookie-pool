import Images from "src/common/Images";
import {
  BARCA_PLACE,
  DATA_MINI_GAME_AFICANATIONS_CUP,
  ELP_CLUB,
  RONALDO_GOLD,
} from "src/common/mockup";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import { chunkArray } from "src/utils/helper";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { store } from "src/redux/store";
import { changeYourPredict } from "src/redux/reducers/matchesSlice";
import { REACT_APP_EFUN_TOKEN } from "src/common/Environment";
import { MatchesContract } from "src/blockchain/utils/MatchesContract";
import { formatNumberPrice } from "src/utils/helper";
import MenuLink from "../MiniGameDetail/MenuLink/MenuLink";

function MiniGame() {
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
          Mini <strong>games</strong>
        </h1>
      </div>
      <div className="page-bookie">
        <MenuLink />
        <div className="box-bookie">
          <img src={Images.FrameBookie} alt="bookie"/>
          {/* Contribution */}
          <div className="contribution mt-5">
            <div className="item">
              <span>Your contribution</span>
              <span>0 EFUN</span>
            </div>
            <div className="item">
              <span>Your P&L</span>
              <span>0 EFUN</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="underline">Request Withdraw</span>
          </div>
          <div className="section-contribute mt-5">
            <div className="contribute pt-5">
              <div className="item">
                <span>Total Bookie Pool</span>
                <span>123.000.000 EFUN</span>
              </div>
              <div className="item">
                <span>Return rate</span>
                <span>0% monthly</span>
              </div>
            </div>
            <div className="contribute mt-4">
              <span>Contribute Amount - Your Balance:</span>
              <span> 1,000,000 EFUN</span>
            </div>
            <div className="contribute">
              <div className="box-input mt-3">
                <input className="input" type="text" />
                <div className="underline">Max</div>
              </div>
            </div>
            <div className="btn-contribute mt-3">
              Contribute EFUN
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default MiniGame;

const DetailItem = (props) => {
  const { item, index } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalReward, setTotalReward] = useState(0);

  const directToDetail = (item) => {
    //console.log("item", item);
    navigate(`/mini-game/${item.name}`, {
      state: { data: { ...item, totalReward } },
    });
  };

  const getTotalReward = async (matchId) => {
    //console.log("matchId===", matchId);
    const matchInfo = await MatchesContract.getMatchInfo(
      matchId,
      // 0,
      REACT_APP_EFUN_TOKEN
    );
    //console.log("matchInfo?.tx.data.sTotal", matchInfo?.tx.data.sTotal);

    if (matchInfo) {
      let total = matchInfo?.tx.data.sTotal / 10 ** 18 || 0;
      setTotalReward(total);
    }
  };

  useEffect(() => {
    getTotalReward(item.matchId);
  }, [item]);

  return (
    <div
      className="item"
      key={index}
      onClick={() => {
        directToDetail(item);
      }}
    >
      <div className="thumb" to="">
        <img src={item?.backGround} alt="efun mini game" />
        <span className="btn">Join now</span>
      </div>
      <div className="name">{item.label}</div>
      <div className="deadline flex_row_left">
        <div> Total Reward:</div>
        <div className="time bold" style={{ color: "yellow" }}>{`${
          totalReward ? formatNumberPrice(totalReward) : 0
        } EFUN`}</div>
      </div>
      <div className="deadline flex_row_left">
        <div> Deadline:</div>
        <div className="time">{item.endDate} UTC</div>
      </div>
    </div>
  );
};
