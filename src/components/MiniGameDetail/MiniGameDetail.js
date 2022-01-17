import Images from "src/common/Images";
import React, { useState, useEffect, useMemo, useRef } from "react";
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
  array_default_result,
} from "src/common/mockup";
import TableOption from "./TableOption/TableOption";
import {
  REACT_APP_BNB_TOKEN,
  REACT_APP_EFUN_TOKEN,
} from "src/common/Environment";
import { useTranslation } from "react-i18next";
import { chunkArray, formatNumberPrice } from "src/utils/helper";
import SelectCustom from "src/components/UI/Select/Select";
import Dropdown from "../UI/Dropdown/Dropdown";
import { showChooseWallet } from "../Header/Header";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";

const override = css`
  margin: 0 auto;
`;

const MiniGameDetail = (props) => {
  const { t } = useTranslation();
  const location = useLocation();

  const dataItem = location.state.data;
  console.log("dataItem======", dataItem);

  // const
  const sponsorEven = 1000;
  const sponsorETAmount = 0;
  const [loadingPlace, setLoadingPlace] = useState(false);
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
  //const [checkApproveFirst, setCheckApproveFirst] = useState(0);
  const [checkApprove, setCheckApprove] = useState(0);
  const [waitingApprove, setWaitingApprove] = useState(false);
  const [amount, setAmount] = useState(AMOUNT_EFUN_FER_CHANCE.toString());

  const [isTimeEndedMatch, setIsTimeEndedMatch] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  let itemOptionPredict = useRef();
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
      logo: Images.Africa_Cup_logo,
      endDate: "20/01/2022",
      data: chunkArray(DATA_MINI_GAME_AFICANATIONS_CUP, 4),
      backGround: Images.aficanationscup,
    },
    {
      name: "Cristiano_Ronaldo",
      type: "event",
      label:
        "How many goals does Cristiano Ronaldo have for MU at the end of the season 2021/2022 in all competitions?",
      matchId: "aficacupnations_2021",
      logo: Images.man_united_logo,
      endDate: "31/01/2022",
      data: RONALDO_GOLD,
      backGround: Images.Banner_Ronaldo2,
    },
    {
      name: "LaLiga",
      type: "event",
      label: "Where is Barcelona's place in La Liga season 2021/2022?",
      matchId: "aficacupnations_2021",
      logo: Images.logo_barca,
      endDate: "31/01/2022",
      data: BARCA_PLACE,
      backGround: Images.Banner_Barca2,
    },
    {
      name: "EPL_club",
      type: "event",
      label: "Which EPL club will have the biggest summer 2022 transfers in? ",
      matchId: "aficacupnations_2021",
      logo: Images.PremierLeague,
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
  const matchTimeEnd = moment("2022-02-21 00:00");
  useEffect(() => {
    return () => {};
  }, []);

  // setInterval(() => {
  //   const currentTime = moment();
  //   setCurrentTime(currentTime);
  // }, 2000);

  // setInterval(() => {
  //   let matchEnded = matchTimeEnd.isBefore(currentTime);
  //   if (matchEnded) {
  //     setIsTimeEndedMatch(true);
  //   }
  // }, 1000);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
      if (currentTimer) clearInterval(currentTimer);
    };
  }, []);

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

  //console.log("array_default_result", array_default_result);

  const isMaxChance =
    yourPredictBet.length >= timesCanChance || yourPredictBet.length >= 10;

  const [selectedItem, setSelectedItem] = useState(0);

  /**
   * HANDLE DATA REQUEST BLOCKCHAIN =TODO
   */

  const predict = async () => {
    if (yourPredictBet?.length < 1) {
      console.log("itemOptionPredict", itemOptionPredict);

      itemOptionPredict.current.classList.add("option-effect");
      return;
    }
    setLoadingPlace(true);

    // handle map param request to blockchain
    const listAnswer =
      yourPredictBet?.map((item) => item.value).join(";") + ";" || "";
    console.log("listAnswer", listAnswer);

    // get amount EFFUN TOKEN for this predict
    const amount = yourPredictBet?.length * AMOUNT_EFUN_FER_CHANCE;
    console.log("amount", amount);

    if (!currentAddress) {
      setLoadingPlace(false);
    } else {
      try {
        const token =
          currentToken.symbol === "BNB"
            ? REACT_APP_BNB_TOKEN
            : REACT_APP_EFUN_TOKEN;

        console.log("predictToken", token);

        let recept = await MatchesContract.predict(
          currentMatches.bc_match_id,
          listAnswer,
          token,
          amount,
          currentAddress
        );

        console.log("receptPredict=====", recept);

        // await axios.post(process.env.API_HOST + '/api/v1/block-numbers/create', {
        //   type: 'group_predict',
        //   block_number: recept.tx.hash.blockNumber
        // })
      } catch (e) {
        console.log("error====", e);
        store.dispatch(
          showAppPopup(<ModalErrorWallet messageError={e.message} />)
        );
      } finally {
        //repeat(this, 10);
        setLoadingPlace(false);
        //setSuccessDialog(true);
        //Show success
        store.dispatch(
          showAppPopup(<ModalErrorWallet messageError="Approve success" />)
        );
        // formBet.resetValidation();
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

  const _checkApprove = async () => {
    if (currentToken) {
      let checkapprove = await MatchesContract.checkApproveTx(
        currentAddress,
        "EFUN"
      );
      console.log("checkapprove", checkapprove);
      if (checkapprove) {
        // setCheckApproveFirst(checkapprove);
        setCheckApprove(checkapprove);
      }

      // waitingApprove = false
      if (checkapprove != 0) {
        setWaitingApprove(false);
      }
    }
  };

  const approve = async () => {
    if (!currentAddress) {
      showChooseWallet();
    }
    try {
      setWaitingApprove(true);
      const approve = await MatchesContract.createApproveTx(
        currentAddress,
        currentToken?.symbol
      );
      // sign approve TX
      // const recept = await Support.signAndSendTx(approve);
      // console.log(recept, 'recept')
      if (approve) {
        if (currentToken?.symbol === "BNB") {
          setCheckApprove(1);
        } else {
          //repeat2(this, 10);
        }

        // setApproveHash(recept.transactionHash);
        // appLabel = 'Approved EFUN'
        // checkApproveFirst = 1
      }
    } catch (e) {
      setWaitingApprove(false);
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e?.message?.toString()} />)
      );
    } finally {
      // approveDialog = true
      // waitingApprove = false
    }
  };

  // const repeat2 = (self, retryTime) => {
  //   setTimeout(async () => {
  //     if (localStorage.getItem("extensionName")) {
  //       _checkApprove(false);
  //       if (retryTime !== 0 && checkApprove == 0) {
  //         return repeat2(self, retryTime - 1);
  //       }
  //     }
  //   }, 2000);
  // };

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
      setLoadingPlace(true);
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
    } catch (e) {
      // console.log(e, 'err')
    } finally {
      // repeat(this, 10)
      setLoadingPlace(false);
    }
  };
  const claimEfun = async () => {
    try {
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
    } catch (e) {
      // console.log(e, 'err')
    } finally {
      // repeat(this, 10)
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

  // const ETAmountEfun = (amount, index) => {
  //   if (currentMatchesBlockchainEfun) {
  //     let totalBetWithYou = null;
  //     if (index === null) {
  //       return 0;
  //     } else if (index === 1) {
  //       totalBetWithYou = convertAmountBC(
  //         currentMatchesBlockchainEfun.predictionAmount[1]
  //       );
  //     } else if (index === 2) {
  //       totalBetWithYou = convertAmountBC(
  //         currentMatchesBlockchainEfun.predictionAmount[0]
  //       );
  //     } else {
  //       totalBetWithYou = convertAmountBC(
  //         currentMatchesBlockchainEfun.predictionAmount[2]
  //       );
  //     }
  //     const totalOtherBetting =
  //       +convertAmountBC(currentMatchesBlockchainEfun.predictionAmount[1]) +
  //       +convertAmountBC(currentMatchesBlockchainEfun.predictionAmount[0]) +
  //       +convertAmountBC(currentMatchesBlockchainEfun.predictionAmount[2]) -
  //       totalBetWithYou;
  //     const yourPercentBetAmount = +amount / +totalBetWithYou;
  //     // sponsor token
  //     // sponsorReward = sponsorEven * yourPercentBetAmount;
  //     // console.log(sponsorReward, 'sponsorReward');
  //     return +amount + +yourPercentBetAmount * 0.975 * +totalOtherBetting;
  //   } else {
  //     return 0;
  //   }
  // };

  // const ETAmount = (amount, index) => {
  //   if (currentMatchesBlockchain) {
  //     let totalBetWithYou = null;
  //     if (index === null) {
  //       return 0;
  //     } else if (index === 1) {
  //       totalBetWithYou = convertAmountBC(
  //         currentMatchesBlockchain.predictionAmount[1]
  //       );
  //     } else if (index === 2) {
  //       totalBetWithYou = convertAmountBC(
  //         currentMatchesBlockchain.predictionAmount[0]
  //       );
  //     } else {
  //       totalBetWithYou = convertAmountBC(
  //         currentMatchesBlockchain.predictionAmount[2]
  //       );
  //     }
  //     const totalOtherBetting =
  //       +convertAmountBC(currentMatchesBlockchain.predictionAmount[1]) +
  //       +convertAmountBC(currentMatchesBlockchain.predictionAmount[0]) +
  //       +convertAmountBC(currentMatchesBlockchain.predictionAmount[2]) -
  //       totalBetWithYou;
  //     const yourPercentBetAmount = +amount / +totalBetWithYou;
  //     return +amount + +yourPercentBetAmount * 0.945 * +totalOtherBetting;
  //   } else {
  //     return 0;
  //   }
  // };

  // const calculatePercent = (amount) => {
  //   if (currentMatchesBlockchain) {
  //     const total =
  //       +currentMatchesBlockchain.predictionAmount[1] +
  //       +currentMatchesBlockchain.predictionAmount[0] +
  //       +currentMatchesBlockchain.predictionAmount[2];
  //     if (total === 0) {
  //       return total + "%";
  //     } else {
  //       const number = new Decimal((amount * 100) / total);
  //       const amount2 = number.toFixed(0, Decimal.ROUND_DOWN);
  //       return "~" + amount2 + "%";
  //     }
  //   }
  // };
  // const calculatePercentEfun = (amount) => {
  //   if (currentMatchesBlockchainEfun) {
  //     const total =
  //       +currentMatchesBlockchainEfun.predictionAmount[1] +
  //       +currentMatchesBlockchainEfun.predictionAmount[0] +
  //       +currentMatchesBlockchainEfun.predictionAmount[2];
  //     if (total === 0) {
  //       return total + "%";
  //     } else {
  //       const number = new Decimal((amount * 100) / total);
  //       const amount2 = number.toFixed(0, Decimal.ROUND_DOWN);
  //       return "~" + amount2 + "%";
  //     }
  //   }
  // };

  const handleSelectMiniGame = (index) => {
    setSelectedItem(index);
    localStorage.removeItem("yourPredictBet");
    store.dispatch(changeYourBet(null));
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="miniGame">
          <div
            className={`heading-box ${
              dataItem?.type === "event" && "heading-box-contain"
            }`}
            style={{
              background: `url(${Images.header_box}) no-repeat center center`,
              objectFit: "cover",
            }}
          >
            <h1>
              Mini <strong>games</strong>
            </h1>
          </div>
          <div className="section-games">
            <div className="menu-games"></div>
            <div className="description mb-large center mt-medium margin-horizontal-large">
              <div className="mb-small">
                <span className="text-large bold">{dataItem?.label}</span>
              </div>
              <div>
                <span className="text-small red bold">
                  Deadline : {dataItem?.endDate} 00:00 UTC
                </span>
              </div>
            </div>
            <div className="detail-games">
              <div className="detail-games-banner">
                <img
                  src={dataItem?.backGround}
                  height={WIDTH >= 675 ? 500 : 200}
                  width={`${WIDTH >= 675 ? "80%" : 200}`}
                  alt="background"
                />
              </div>

              <div className="detail-games-description">
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
                      data={dataItem}
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
                        className={`${
                          !currentAddress && "disable-btn"
                        } btn-submit flex_row_center`}
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
                          <div
                            className={`${
                              !currentAddress && "disable-btn"
                            } btn-submit flex_row_center`}
                            disabled="disabled"
                          >
                            {t("common.place_your_predict_now")}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`${
                            !currentAddress && "disable-btn"
                          } btn-submit flex_row_center`}
                          onClick={predict}
                        >
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
      </div>
      <Footer />
    </>
  );
};

export default MiniGameDetail;
