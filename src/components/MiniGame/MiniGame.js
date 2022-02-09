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

function MiniGame() {
  const dataMiniGame = [
    {
      name: "AFCON2021",
      type: "mini_game",
      label: "Who are the Champions of AFCON 2021?",
      matchId: 0,
      logo: Images.Africa_Cup_logo,
      endDate: "2022-02-08 12:00",
      data: chunkArray(DATA_MINI_GAME_AFICANATIONS_CUP, 4),
      backGround: Images.Africa_Cup_logo,
    },
    {
      name: "CristianoRonaldo",
      type: "event",
      label:
        "How many goals does Cristiano Ronaldo have for MU at the end of the season 2021/2022 in all competitions?",
      matchId: 1,
      logo: Images.man_united_logo,
      endDate: "2022-02-31 00:00",
      data: RONALDO_GOLD,
      backGround: Images.Banner_Ronaldo2,
    },
    {
      name: "LaLiga",
      type: "event",
      label: "Where is Barcelona's place in La Liga season 2021/2022?",
      matchId: 2,
      logo: Images.logo_barca,
      endDate: "2022-02-31 00:00",
      data: BARCA_PLACE,
      backGround: Images.Banner_Barca2,
    },
    {
      name: "EPLClub",
      type: "event",
      label: "Which EPL club will have the biggest summer 2022 transfers in? ",
      matchId: 3,
      logo: Images.PremierLeague,
      endDate: "2022-02-31 00:00",
      data: ELP_CLUB,
      backGround: Images.Banner_EPL2,
    },
  ];

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
      <div className="list-mini-game">
        <div className="box-item">
          {dataMiniGame.map((item, index) => {
            return <DetailItem item={item} index={index} key={index} />;
          })}
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
