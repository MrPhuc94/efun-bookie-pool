import Images from "src/common/Images";
import React, { useState, useEffect, useMemo } from "react";
import "./styles.scss";
import MenuTop from "../MenuTop/MenuTop";
import SlideOptions from "./SlideOptions/SlideOptions";
import { store } from "src/redux/store";
import {
  changeYourBet,
  changeYourBetEfun,
} from "src/redux/reducers/matchesSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import Decimal from "decimal.js";
import { MatchesContract } from "src/blockchain/utils/MatchesContract";
import { walletManager } from "src/blockchain/utils/walletManager";
import * as Support from "src/blockchain/utils/support/signAndSendTx";
import _get from "lodash/get";
import { changeCurrentMatchesBlockchainEfun } from "src/redux/reducers/matchesSlice";
import {
  changeCurrentAddress,
  changeSupportTokenAndBalance,
} from "src/redux/reducers/walletSlice";
import { setPathBackGround, showAppPopup } from "src/redux/reducers/appSlice";
import ModalErrorWallet from "../Modal/ErrorWallet/ErrorWallet";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import { WIDTH } from "src/assets/themes/dimension";
import { AMOUNT_EFUN_FER_CHANCE } from "src/common/Constants";
import moment from "moment";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  BARCA_PLACE,
  DATA_MINI_GAME_AFICANATIONS_CUP,
  ELP_CLUB,
  RONALDO_GOLD,
} from "src/common/mockup";
import TableOption from "./TableOption/TableOption";
import {
  REACT_APP_BNB_TOKEN,
  REACT_APP_EFUN_TOKEN,
} from "src/common/Environment";
import { useTranslation } from "react-i18next";
import { formatNumberPrice } from "src/utils/helper";

const override = css`
  margin: 0 auto;
`;

const MiniGame = () => {
  const { t } = useTranslation();
  // const
  const sponsorEven = 1000;
  const sponsorETAmount = 0;
  const [loadingPlace, setLoadingPlace] = useState(false);
  const loadingPlace2 = false;
  const predictOptions = "";
  const amountRules = [
    (v) => !!v || "Invalid amount",
    (v) => parseFloat(amount) >= 0.005 || "Min Predict Amount >= 0.005 BNB",
    (v) =>
      /^\d+(\.\d{0,5})?$/.test(parseFloat(amount)) ||
      "must below 5 digit after decimal",
    (v) =>
      parseFloat(amount) <= parseFloat(_get(currentToken, "balance", 0)) ||
      "Insufficient balance",
  ];
  const amountRules2 = [
    (v) => !!v || "Invalid amount",
    (v) => parseFloat(amount) >= 500 || "Min Predict Amount >= 500 EFUN",
    (v) =>
      /^\d+(\.\d{0,5})?$/.test(parseFloat(amount)) ||
      "must below 5 digit after decimal",
    (v) =>
      parseFloat(amount) <= parseFloat(_get(currentToken, "balance", 0)) ||
      "Insufficient balance",
  ];

  // variables
  const [checkApproveFirst, setCheckApproveFirst] = useState(0);
  const [checkApprove, setCheckApprove] = useState(0);
  const [waitingApprove, setWaitingApprove] = useState(false);
  const [amount, setAmount] = useState("500");
  const [approveDialog, setApproveDialog] = useState(null);
  const [addWalletDialog, setAddWalletDialog] = useState(null);
  const [successDialog, setSuccessDialog] = useState(null);
  const [approveMsg, setApproveMsg] = useState(null);
  const [approveHash, setApproveHash] = useState(null);
  const [recept, setRecept] = useState(null);
  const [validTime, setValidTime] = useState(null);
  const [formBet, setFormBet] = useState(null);
  const [hotList, setHotList] = useState([]);
  const [fixtureList, setFixtureList] = useState([]);
  const [activeBetting, setActiveBetting] = useState(1);
  const [reward1, setReward1] = useState(null);
  const [reward2, setReward2] = useState(null);
  const [reward3, setReward3] = useState(null);
  const [rewardEfun1, setRewardEfun1] = useState(null);
  const [rewardEfun2, setRewardEfun2] = useState(null);
  const [rewardEfun3, setRewardEfun3] = useState(null);
  const [totalReward, setTotalReward] = useState(null);
  const [totalRewardEfun, setTotalRewardEfun] = useState(null);
  const [sponsorReward, setSponsorReward] = useState(null);
  const [isMobile, setIsMobile] = useState(null);
  const [message, setMessage] = useState(null);
  const [isTimeEndedMatch, setIsTimeEndedMatch] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  let timer;
  let currentTimer;

  let [color, setColor] = useState("#ffffff");

  const currentMatches = {
    id: "0",
    bc_match_id: "0",
    bc_match_meta: "0",
    bc_result: true,
    bc_result_meta: "0",
    remote_id: "0",
    hot: true,
    timezone: "0",
    date: "2021-12-11T17:12:37.000Z",
    timestamp: 1646072675,
    status_long: "1",
    status_short: "1",
    winner: 1,
    score_meta: "json",
    meta: "json",
    created_at: "2021-12-11T17:13:07.000Z",
    updated_at: "2021-12-11T17:13:10.000Z",
    deleted_at: null,
  };

  const matchSelected = currentMatches.id;

  const currentMatchesBlockchain = useSelector(
    (state) => state.matches.currentMatchesBlockchain
  );

  const changeCurrentMatches = useSelector(
    (state) => state.matches.changeCurrentMatches
  );

  const changeCurrentMatchesBlockchain = useSelector(
    (state) => state.matches.changeCurrentMatchesBlockchain
  );

  const currentMatchesBlockchainEfun = useSelector(
    (state) => state.matches.currentMatchesBlockchainEfun
  );

  const currentAddress =
    useSelector((state) => state.wallet.currentAddress) ||
    localStorage.getItem("currentAddress");

  const dataMiniGame = [
    {
      name: "AFCON_2021",
      type: "mini_game",
      label: "Who are the Champions of AFCON 2021?",
      matchId: "aficacupnations_2021",
      logo: Images.aficanationscup,
      endDate: "20/01/2022",
      data: DATA_MINI_GAME_AFICANATIONS_CUP,
      backGround: Images.header_box,
    },
    {
      name: "Cristiano_Ronaldo",
      type: "event",
      label:
        "How many goals does Cristiano Ronaldo have for MU at the end of the season 2021/2022 in all competitions?",
      matchId: "aficacupnations_2021",
      logo: Images.Banner_Ronaldo2,
      endDate: "31/01/2022",
      data: RONALDO_GOLD,
      backGround: Images.Banner_Ronaldo,
    },
    {
      name: "LaLiga",
      type: "event",
      label: "Where is Barcelona's place in La Liga season 2021/2022?",
      matchId: "aficacupnations_2021",
      logo: Images.Banner_Barca2,
      endDate: "31/01/2022",
      data: BARCA_PLACE,
      backGround: Images.BannerBarca,
    },
    {
      name: "EPL_club",
      type: "event",
      label: "Which EPL club will have the biggest summer 2022 transfers in? ",
      matchId: "aficacupnations_2021",
      logo: Images.Banner_Ronaldo2,
      endDate: "31/01/2022",
      data: ELP_CLUB,
      backGround: Images.Banner_Ronaldo,
    },
  ];
  // get balance token
  let tokens =
    useSelector((state) => state.wallet.tokens) ||
    JSON.parse(localStorage.getItem("tokens"));
  const currentToken = tokens?.find((item) => item?.symbol === "EFUN");
  let balanceEfun = currentToken?.balance;
  const timesCanChance = Math.floor(
    parseFloat(currentToken?.balance) / AMOUNT_EFUN_FER_CHANCE
  );

  // time predict
  // const matchTimeEnd = moment("2022-02-21 00:00");
  // useEffect(() => {
  //   currentTimer = setInterval(() => {
  //     const currentTime = moment();
  //     setCurrentTime(currentTime);
  //   }, 2000);

  //   return () => {
  //     clearInterval(currentTimer);
  //   };
  // }, []);

  // useEffect(() => {
  //   timer = setInterval(() => {
  //     let matchEnded = matchTimeEnd.isBefore(currentTime);
  //     if (matchEnded) {
  //       setIsTimeEndedMatch(true);
  //       clearInterval(timer);
  //     }
  //   }, 1000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [currentTime]);

  // RESULT MATCH

  // get match predicted from blockchain

  const yourPredictBet =
    useSelector((state) => state.matches.yourBet) ||
    JSON.parse(localStorage.getItem("yourPredictBet")) ||
    [];
  //console.log("yourPredictBet", yourPredictBet);

  const resultMatch = { Ban1: 0, Ban2: 3 };

  const areYourReWard = useMemo(() => {
    return yourPredictBet?.predict?.find(
      (item) => item.Ban1 === resultMatch.Ban1 && item.Ban2 === resultMatch.Ban2
    );
  }, [yourPredictBet]);

  //console.log("timesCanChance", timesCanChance);

  const isMaxChance =
    yourPredictBet.length >= timesCanChance || yourPredictBet.length >= 10;

  const [selectedItem, setSelectedItem] = useState(0);

  // method

  const calculateEndTime = () => {
    if (currentMatches) {
      const now = Date.now() / 1000;
      if (+currentMatches.timestamp + 180 - now >= 1) {
        validTime = true;
      } else {
        validTime = false;
      }
    }
  };

  const predict = async () => {
    setLoadingPlace(true);
    if (!currentAddress) {
      setAddWalletDialog(true);
      setLoadingPlace(false);
    } else if (activeBetting === null) {
      setLoadingPlace(false);
    } else {
      try {
        const token =
          currentToken.symbol === "BNB"
            ? REACT_APP_BNB_TOKEN
            : REACT_APP_EFUN_TOKEN;

        const recept = await MatchesContract.predict(
          currentMatches.bc_match_id,
          "0-0;0-1;0-2;0-3;",
          token,
          0,
          currentAddress
        );
        // const recept = await MatchesContract.predict(
        //   currentMatches.bc_match_id,
        //   predictOptions,
        //   token,
        //   amount,
        //   currentAddress
        // );

        // await axios.post(process.env.API_HOST + '/api/v1/block-numbers/create', {
        //   type: 'group_predict',
        //   block_number: recept.tx.hash.blockNumber
        // })
        //console.log(recept, "recept");
        recept = recept.transactionHash;
        setMessage("Your predict was successful!");
        // activeBetting = null
        // methodBet = null
        amount = setDefaultValue();
      } catch (e) {
        console.log("error====", e);
        store.dispatch(
          showAppPopup(<ModalErrorWallet messageError={e.message} />)
        );
      } finally {
        repeat(this, 10);
        setLoadingPlace(false);
        setSuccessDialog(true);
        formBet.resetValidation();
      }
    }
  };

  const repeat = (self, retryTime) => {
    setTimeout(async () => {
      if (localStorage.getItem("extensionName")) {
        const extensionName = localStorage.getItem("extensionName");
        await walletManager.connectWallet(extensionName, 0);
        const data = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          REACT_APP_BNB_TOKEN
        );
        const dataEfun = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          REACT_APP_EFUN_TOKEN
        );
        const yourDataEfun = await MatchesContract.getBetInfo(
          currentMatches.bc_match_id,
          REACT_APP_EFUN_TOKEN,
          currentAddress
        );
        const yourData = await MatchesContract.getBetInfo(
          currentMatches.bc_match_id,
          REACT_APP_BNB_TOKEN,
          currentAddress
        );
        changeCurrentMatchesBlockchain(data.tx.data);
        store.dispatch(changeCurrentMatchesBlockchainEfun(dataEfun.tx.data));
        changeYourBet(yourData.tx.data);
        changeYourBetEfun(yourDataEfun.tx.data);
        changeCurrentAddress(walletManager.currentAddress());
        changeSupportTokenAndBalance(walletManager.tokens());
        if (retryTime !== 0) {
          return repeat(self, retryTime - 1);
        }
      }
    }, 2000);
  };

  useEffect(() => {
    if (currentToken && currentAddress) {
      _checkApprove(false);
    }
  }, [currentToken, currentAddress]);

  const _checkApprove = async (boolean) => {
    if (currentToken) {
      let checkapprove = await MatchesContract.checkApproveTx(
        currentAddress,
        "EFUN"
      );
      //console.log("checkapprove", checkapprove);
      if (checkapprove) {
        setCheckApproveFirst(checkapprove);
        setCheckApprove(checkapprove);
      }

      // waitingApprove = false
      if (checkapprove != 0) {
        setWaitingApprove(false);
        if (!boolean) {
          setApproveDialog(true);
        }
      }
    }
  };

  const changeBetting = (predictOptions) => {
    predictOptions = predictOptions;
    activeBetting = predictOptions;
  };

  const approve = async () => {
    try {
      setWaitingApprove(true);
      const approve = await MatchesContract.createApproveTx(
        currentAddress,
        currentToken?.symbol
      );
      // sign approve TX
      const recept = await Support.signAndSendTx(approve);
      // console.log(recept, 'recept')
      if (recept) {
        if (currentToken?.symbol === "EFUN") {
          setCheckApprove(1);
        } else {
          repeat2(this, 10);
        }
        setApproveMsg("Approve successfully");
        setApproveHash(recept.transactionHash);
        // appLabel = 'Approved EFUN'
        // checkApproveFirst = 1
      }
    } catch (e) {
      setWaitingApprove(false);
      setApproveMsg(e?.message);
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e?.message?.toString()} />)
      );
    } finally {
      // approveDialog = true
      // waitingApprove = false
    }
  };

  const repeat2 = (self, retryTime) => {
    setTimeout(async () => {
      if (localStorage.getItem("extensionName")) {
        _checkApprove(false);
        if (retryTime !== 0 && checkApprove == 0) {
          return repeat2(self, retryTime - 1);
        }
      }
    }, 2000);
  };

  // const maxAmount = () => {
  //   if (!currentAddress) {
  //     addWalletDialog = true;
  //   } else {
  //     const number = new Decimal(_get(currentToken, "balance", 0));
  //     amount = number.toFixed(5, Decimal.ROUND_DOWN);
  //   }
  // };

  const convertAmountBC = (amount) => {
    return new BigNumber(amount).dividedBy(10 ** 18).toString();
  };

  const setDefaultValue = () => {
    if (currentToken.symbol === "BNB") {
      return 0.005;
    }
    if (currentToken.symbol === "EFUN") {
      return 500;
    }
  };

  // const calculateReward = async () => {
  //   try {
  //     const reward = await MatchesContract.calculateReward(
  //       currentMatches.bc_match_id,
  //       currentAddress,
  //       REACT_APP_BNB_TOKEN
  //     );
  //     console.log(reward.tx.data, "calculateReward");
  //     totalReward = reward.tx.data._reward;
  //     sponsorReward = reward.tx.data._sponsorReward;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const calculateRewardEfun = async () => {
  //   try {
  //     const reward = await MatchesContract.calculateReward(
  //       currentMatches.bc_match_id,
  //       currentAddress,
  //       REACT_APP_EFUN_TOKEN,
  //       REACT_APP_EFUN_TOKEN
  //     );
  //     // console.log(reward.tx.data, 'rewardefun')
  //     totalRewardEfun = reward.tx.data._reward;
  //     sponsorReward = reward.tx.data._sponsorReward;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const claim = async () => {
    try {
      loadingPlace = true;
      await MatchesContract.claimReward(
        currentMatches.bc_match_id,
        REACT_APP_BNB_TOKEN,
        currentAddress
      );
      const yourData = await MatchesContract.getBetInfo(
        currentMatches.bc_match_id,
        REACT_APP_BNB_TOKEN,
        currentAddress
      );
      changeYourBet(yourData.tx.data);
      message = "Claimed Successful!";
    } catch (e) {
      // console.log(e, 'err')
      recept = e.transactionHash;
      message = e.message;
    } finally {
      // repeat(this, 10)
      loadingPlace = false;
      successDialog = true;
    }
  };
  const claimEfun = async () => {
    try {
      loadingPlace2 = true;
      await MatchesContract.claimReward(
        currentMatches.bc_match_id,
        REACT_APP_EFUN_TOKEN,
        REACT_APP_EFUN_TOKEN,
        currentAddress
      );
      const yourDataEfun = await MatchesContract.getBetInfo(
        currentMatches.bc_match_id,
        REACT_APP_EFUN_TOKEN,
        currentAddress
      );
      changeYourBetEfun(yourDataEfun.tx.data);
      message = "Claimed Successful!";
    } catch (e) {
      // console.log(e, 'err')
      recept = e.transactionHash;
      message = e.message;
    } finally {
      // repeat(this, 10)
      loadingPlace2 = false;
      successDialog = true;
    }
  };
  const create = async () => {
    const tx = await MatchesContract.createMatches(
      ["description"],
      [1623171248],
      [1646072675],
      [process.env.DFY_TOKEN],
      currentAddress
    );
    const data = tx.tx.data.events;
  };
  const getMatchesDetail = async () => {
    if (currentAddress) {
      if (localStorage.getItem("extensionName")) {
        const extensionName = localStorage.getItem("extensionName");
        await walletManager.connectWallet(extensionName, 0);
        changeCurrentAddress(walletManager.currentAddress());
        changeSupportTokenAndBalance(walletManager.tokens());
      }
      try {
        const data = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          REACT_APP_BNB_TOKEN
        );
        const dataEfun = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          REACT_APP_EFUN_TOKEN
        );
        // console.log(data, 'data')
        // console.log(dataEfun, 'dataEfun')
        if (currentAddress) {
          const yourData = await MatchesContract.getBetInfo(
            currentMatches.bc_match_id,
            REACT_APP_BNB_TOKEN,
            currentAddress
          );
          const yourDataEfun = await MatchesContract.getBetInfo(
            currentMatches.bc_match_id,
            REACT_APP_EFUN_TOKEN,
            currentAddress
          );
          // console.log(yourData, 'yourData')
          // console.log(yourDataEfun, 'yourDataEfun')
          await changeYourBet(yourData.tx.data);
          await changeYourBetEfun(yourDataEfun.tx.data);
        }
        changeCurrentMatchesBlockchain(data.tx.data);
        changeCurrentMatchesBlockchainEfun(dataEfun.tx.data);
      } catch (error) {
        console.log(error, "errr");
      } finally {
        changeCurrentMatches(currentMatches);
      }
    } else {
      try {
        matchSelected = currentMatches.id;
        const data = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          REACT_APP_BNB_TOKEN
        );
        const dataEfun = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          REACT_APP_EFUN_TOKEN
        );
        // if (currentAddress) {
        //   const yourData = await MatchesContract.getBetInfo(currentMatches.bc_match_id, REACT_APP_BNB_TOKEN, currentAddress)
        //   const yourDataEfun = await MatchesContract.getBetInfo(currentMatches.bc_match_id, REACT_APP_EFUN_TOKEN, currentAddress)
        //   await changeYourBet(yourData.tx.data)
        //   await changeYourBetEfun(yourDataEfun.tx.data)
        // }
        changeCurrentMatchesBlockchain(data.tx.data);
        changeCurrentMatchesBlockchainEfun(dataEfun.tx.data);
      } catch (error) {
        console.log(error, "errr");
      } finally {
        changeCurrentMatches(currentMatches);
      }
    }
  };

  const ETAmountEfun = (amount, index) => {
    if (currentMatchesBlockchainEfun) {
      let totalBetWithYou = null;
      if (index === null) {
        return 0;
      } else if (index === 1) {
        totalBetWithYou = convertAmountBC(
          currentMatchesBlockchainEfun.predictionAmount[1]
        );
      } else if (index === 2) {
        totalBetWithYou = convertAmountBC(
          currentMatchesBlockchainEfun.predictionAmount[0]
        );
      } else {
        totalBetWithYou = convertAmountBC(
          currentMatchesBlockchainEfun.predictionAmount[2]
        );
      }
      const totalOtherBetting =
        +convertAmountBC(currentMatchesBlockchainEfun.predictionAmount[1]) +
        +convertAmountBC(currentMatchesBlockchainEfun.predictionAmount[0]) +
        +convertAmountBC(currentMatchesBlockchainEfun.predictionAmount[2]) -
        totalBetWithYou;
      const yourPercentBetAmount = +amount / +totalBetWithYou;
      // sponsor token
      // sponsorReward = sponsorEven * yourPercentBetAmount;
      // console.log(sponsorReward, 'sponsorReward');
      return +amount + +yourPercentBetAmount * 0.975 * +totalOtherBetting;
    } else {
      return 0;
    }
  };

  const ETAmount = (amount, index) => {
    if (currentMatchesBlockchain) {
      let totalBetWithYou = null;
      if (index === null) {
        return 0;
      } else if (index === 1) {
        totalBetWithYou = convertAmountBC(
          currentMatchesBlockchain.predictionAmount[1]
        );
      } else if (index === 2) {
        totalBetWithYou = convertAmountBC(
          currentMatchesBlockchain.predictionAmount[0]
        );
      } else {
        totalBetWithYou = convertAmountBC(
          currentMatchesBlockchain.predictionAmount[2]
        );
      }
      const totalOtherBetting =
        +convertAmountBC(currentMatchesBlockchain.predictionAmount[1]) +
        +convertAmountBC(currentMatchesBlockchain.predictionAmount[0]) +
        +convertAmountBC(currentMatchesBlockchain.predictionAmount[2]) -
        totalBetWithYou;
      const yourPercentBetAmount = +amount / +totalBetWithYou;
      return +amount + +yourPercentBetAmount * 0.945 * +totalOtherBetting;
    } else {
      return 0;
    }
  };

  const calculatePercent = (amount) => {
    if (currentMatchesBlockchain) {
      const total =
        +currentMatchesBlockchain.predictionAmount[1] +
        +currentMatchesBlockchain.predictionAmount[0] +
        +currentMatchesBlockchain.predictionAmount[2];
      if (total === 0) {
        return total + "%";
      } else {
        const number = new Decimal((amount * 100) / total);
        const amount2 = number.toFixed(0, Decimal.ROUND_DOWN);
        return "~" + amount2 + "%";
      }
    }
  };
  const calculatePercentEfun = (amount) => {
    if (currentMatchesBlockchainEfun) {
      const total =
        +currentMatchesBlockchainEfun.predictionAmount[1] +
        +currentMatchesBlockchainEfun.predictionAmount[0] +
        +currentMatchesBlockchainEfun.predictionAmount[2];
      if (total === 0) {
        return total + "%";
      } else {
        const number = new Decimal((amount * 100) / total);
        const amount2 = number.toFixed(0, Decimal.ROUND_DOWN);
        return "~" + amount2 + "%";
      }
    }
  };

  const handleSelectMiniGame = (index) => {
    setSelectedItem(index);
    localStorage.removeItem("yourPredictBet");
    store.dispatch(changeYourBet(null));
  };

  return (
    <div className="container">
      <div className="miniGame">
        <div
          className={`heading-box ${
            dataMiniGame[selectedItem].type === "event" && "heading-box-contain"
          }`}
          style={{
            background: `url(${dataMiniGame[selectedItem].backGround}) no-repeat center center`,
            objectFit: "cover",
          }}
        >
          {dataMiniGame[selectedItem].type === "mini_game" && (
            <h1>
              Mini <strong>games</strong>
            </h1>
          )}
        </div>
        {/* <MenuTop menu={leagueList?.items || []} /> */}
        <div className="section-games">
          <div className="menu-games">
            {dataMiniGame?.map((item, index) => {
              return (
                <div
                  className={`item  ${selectedItem === index ? "active" : ""}`}
                  key={index}
                  onClick={() => handleSelectMiniGame(index)}
                >
                  <div className="item-left">
                    <img src={item.logo} width={30} height={30} alt="logo" />
                  </div>
                  <div
                    className={`${
                      WIDTH <= 600 ? "text-small" : ""
                    } item-center`}
                  >
                    {item.label}
                  </div>
                  <div className="btn-predict item-right">Predict</div>
                </div>
              );
            })}
          </div>
          <div className="detail-games">
            <div className="description mb-large">
              {/* <div className="mb-small">
                <img
                  src={dataMiniGame[selectedItem].logo}
                  alt=""
                  width={60}
                  height={60}
                />
              </div> */}
              <div className="mb-small">
                <span className="text-large bold">
                  {dataMiniGame[selectedItem].label}
                </span>
              </div>
              <div>
                <span className="text-small red">
                  Deadline : {dataMiniGame[selectedItem].endDate} 00:00 UTC
                </span>
              </div>
            </div>

            <div className="your-predict">
              <div className="description mb-large">
                <div className="mb-large">
                  <span className="bold text-medium">
                    {t("common.your_predict")}
                  </span>
                </div>
                <div>
                  <div className="mb-tiny">
                    <span className="text-medium yellow mb-small">
                      {t("common.description_1")}
                    </span>
                  </div>
                  {/* <span className="mt-small yellow">{`In total we have 24 options.`}</span> */}
                  <span className="mt-small yellow">
                    {t("common.description_2")}
                  </span>

                  <br />
                  {isMaxChance && (
                    <div className="mt-small text-small">
                      <RiErrorWarningLine /> {t("common.error_message_1")}
                    </div>
                  )}
                </div>
              </div>

              <div className="table-options mb-large">
                <TableOption
                  data={dataMiniGame[selectedItem]}
                  yourPredictBet={yourPredictBet}
                  isMaxChance={isMaxChance}
                  isTimeEndedMatch={isTimeEndedMatch}
                />
              </div>

              <div className="text-small yellow margin-horizontal-large">
                {`${t("common.with")} ${
                  balanceEfun ? formatNumberPrice(balanceEfun) : 0
                } EFUN, ${t("common.have_predict_1")} ${
                  timesCanChance ? timesCanChance : 0
                } ${t("common.have_predict_2")}`}
              </div>

              <div className="flex_row_center mt-tiny center">
                {isTimeEndedMatch && (
                  <div
                    className={`btn-submit flex_row `}
                    disabled={`${!areYourReWard && "disabled"}`}
                  >
                    {areYourReWard ? (
                      <span>Claim</span>
                    ) : (
                      <span>No Reward</span>
                    )}
                  </div>
                )}
                {!isTimeEndedMatch &&
                  (checkApprove === 0 ? (
                    <div className="flex_row_center">
                      <div
                        className="btn-submit flex_row_center center"
                        onClick={approve}
                        style={{ minWidth: `${WIDTH < 600 ? "60%" : "30%"}` }}
                      >
                        {waitingApprove ? (
                          <ClipLoader
                            color={color}
                            loading={waitingApprove}
                            css={override}
                            size={30}
                          />
                        ) : (
                          <span className="center">
                            {t("common.approve_to_predict")}
                          </span>
                        )}
                      </div>
                      <div className="btn-submit flex_row" disabled="disabled">
                        {t("common.place_your_predict_now")}
                      </div>
                    </div>
                  ) : (
                    <div className="flex_row btn-submit" onClick={predict}>
                      {loadingPlace ? (
                        <ClipLoader
                          color={color}
                          loading={loadingPlace}
                          css={override}
                          size={30}
                        />
                      ) : (
                        <span>{t("common.place_your_predict_now")}</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
