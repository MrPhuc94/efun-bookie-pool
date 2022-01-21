import Images from "src/common/Images";
import React, { useState, useEffect, useMemo, useRef } from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import {
  changeYourPredict,
  changeYourPredictEfun,
} from "src/redux/reducers/matchesSlice";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import Decimal from "decimal.js";
import { MatchesContract } from "src/blockchain/utils/MatchesContract";
import { walletManager } from "src/blockchain/utils/walletManager";
import * as Support from "src/blockchain/utils/support/signAndSendTx";
import _get from "lodash/get";
import { changeCurrentMatchesBlockchainEfun } from "src/redux/reducers/matchesSlice";
import { showAppPopup, showAppLoading } from "src/redux/reducers/appSlice";
import ModalErrorWallet from "../Modal/ErrorWallet/ErrorWallet";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import { WIDTH } from "src/assets/themes/dimension";
import { AMOUNT_EFUN_FER_CHANCE } from "src/common/Constants";
import moment from "moment";
import { TiWarningOutline } from "react-icons/ti";
import TableOption from "./TableOption/TableOption";
import {
  REACT_APP_BNB_TOKEN,
  REACT_APP_EFUN_TOKEN,
} from "src/common/Environment";
import { useTranslation } from "react-i18next";
import { formatNumberPrice } from "src/utils/helper";
import { showChooseWallet } from "../Header/Header";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useLocation } from "react-router-dom";
import MenuLink from "./MenuLink/MenuLink";
import AppLoading from "../AppLoading/AppLoading";

const override = css`
  margin: 0 auto;
`;

const MiniGameDetail = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dataItem = location.state.data;
  console.log("dataItemMiniGame", dataItem);

  //LOADING APP
  const loadingApp = useSelector((state) => state.app.loading);
  console.log("loadingApp", loadingApp);

  const [loadingPlace, setLoadingPlace] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  // const amountRules = [
  //   (v) => !!v || "Invalid amount",
  //   (v) => parseFloat(amount) >= 0.005 || "Min Predict Amount >= 0.005 BNB",
  //   (v) =>
  //     /^\d+(\.\d{0,5})?$/.test(parseFloat(amount)) ||
  //     "must below 5 digit after decimal",
  //   (v) =>
  //     parseFloat(amount) <= parseFloat(_get(currentToken, "balance", 0)) ||
  //     "Insufficient balance",
  // ];
  // const amountRules2 = [
  //   (v) => !!v || "Invalid amount",
  //   (v) => parseFloat(amount) >= 500 || "Min Predict Amount >= 500 EFUN",
  //   (v) =>
  //     /^\d+(\.\d{0,5})?$/.test(parseFloat(amount)) ||
  //     "must below 5 digit after decimal",
  //   (v) =>
  //     parseFloat(amount) <= parseFloat(_get(currentToken, "balance", 0)) ||
  //     "Insufficient balance",
  // ];

  // variables

  const [checkApprove, setCheckApprove] = useState(0);
  const [waitingApprove, setWaitingApprove] = useState(false);
  const [amount, setAmount] = useState(AMOUNT_EFUN_FER_CHANCE.toString());
  const [isTimeEndedMatch, setIsTimeEndedMatch] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [warningPredictNull, setWarningPredictNull] = useState(false);

  // list options predicted on blockchain

  const [listPredicted, setListPredicted] = useState([]);

  let timer;
  let currentTimer;

  const changeCurrentMatchesBlockchain = useSelector(
    (state) => state.matches.changeCurrentMatchesBlockchain
  );

  const currentAddress =
    useSelector((state) => state.wallet.currentAddress) ||
    localStorage.getItem("currentAddress");

  // get balance token
  let tokens =
    useSelector((state) => state.wallet.tokens) ||
    JSON.parse(localStorage.getItem("tokens"));
  const currentToken = tokens?.find((item) => item?.symbol === "EFUN");
  let balanceEfun = currentToken?.balance;

  // Times can chance
  const timesCanChance = Math.floor(
    parseFloat(currentToken?.balance) / AMOUNT_EFUN_FER_CHANCE
  );

  // scroll top for mobile
  useEffect(() => {
    let rootElement = document.documentElement;
    function scrollToTop() {
      // Scroll to top logic
      rootElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    scrollToTop();
  }, []);

  // Check approve and get mini game detail from blockchain
  useEffect(() => {
    if (currentToken && currentAddress) {
      _checkApprove();
    }
  }, [currentToken, currentAddress]);

  useEffect(() => {
    getPredictedOnBlockChain();
  }, []);

  // TIME PREDICT
  const matchTimeEnd = moment(dataItem?.endDate);

  setInterval(() => {
    const currentTime = moment();
    let matchEnded = matchTimeEnd.isBefore(currentTime);
    if (matchEnded) {
      setIsTimeEndedMatch(true);
    }
  }, 2000);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
      if (currentTimer) clearInterval(currentTimer);
    };
  }, []);

  // RESULT MATCH

  // get match predicted from blockchain

  const yourPredict =
    useSelector((state) => state.matches.yourPredict) ||
    JSON.parse(localStorage.getItem("yourPredict")) ||
    [];
  console.log("yourPredict", yourPredict);

  const resultMatch = { value: "0-1" };

  const areYourReWard = useMemo(() => {
    return listPredicted?.find((item) => resultMatch.value === item);
  }, [yourPredict]);

  //console.log("array_default_result", array_default_result);

  const isMaxChance =
    yourPredict.length >= timesCanChance || yourPredict.length >= 10;

  /**
   * HANDLE DATA REQUEST BLOCKCHAIN =TODO
   */

  const predict = async () => {
    console.log("yourPredict===172", yourPredict);
    if (yourPredict?.length < 1) {
      setWarningPredictNull(true);
      return;
    }
    setLoadingPlace(true);

    // handle map param request to blockchain
    const listPredict =
      yourPredict?.map((item) => item.value).join(";") + ";" || "";

    console.log("listPredict", listPredict);

    // get amount  TOKEN_EFUN for this predict
    const amount = yourPredict?.length * AMOUNT_EFUN_FER_CHANCE;
    // console.log("predictAmount", amount);

    try {
      const token =
        currentToken.symbol === "BNB"
          ? REACT_APP_BNB_TOKEN
          : REACT_APP_EFUN_TOKEN;

      let recept = await MatchesContract.predict(
        //dataItem.matchId,
        0,
        listPredict,
        token,
        amount,
        currentAddress
      );

      if (!recept.error) {
        setLoadingPlace(false);
        store.dispatch(
          showAppPopup(
            <ModalErrorWallet
              messageError={`Predict success! Transaction hash: ${recept?.hash}`}
              onOk={getPredictedOnBlockChain}
            />
          )
        );
      } else {
        setLoadingPlace(false);
        store.dispatch(
          showAppPopup(
            <ModalErrorWallet messageError={`${recept.error?.message}`} />
          )
        );
      }
    } catch (e) {
      console.log("error====", e);
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e.message} />)
      );
    }
  };

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

      if (checkapprove !== 0) {
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
      if (approve) {
        if (currentToken?.symbol === "BNB") {
          setCheckApprove(1);
        } else {
          //repeat2(this, 10);
        }
      }
    } catch (e) {
      setWaitingApprove(false);
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e?.message?.toString()} />)
      );
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
  // const claim = async () => {
  //   try {
  //     setLoadingPlace(true);
  //     await MatchesContract.claimReward(
  //       dataItem.matchId,
  //       REACT_APP_BNB_TOKEN,
  //       currentAddress
  //     );
  //     const yourData = await MatchesContract.getBetInfo(
  //       dataItem.matchId,
  //       REACT_APP_BNB_TOKEN,
  //       currentAddress
  //     );
  //     changeYourPredict(yourData.tx.data);
  //   } catch (e) {
  //     // console.log(e, 'err')
  //   } finally {
  //     // repeat(this, 10)
  //     setLoadingPlace(false);
  //   }
  // };
  const claimEfun = async () => {
    try {
      setLoadingClaim(true);
      const dataClaim = await MatchesContract.claimReward(
        //dataItem.matchId,
        0,
        REACT_APP_EFUN_TOKEN,
        REACT_APP_EFUN_TOKEN,
        currentAddress
      );
      // const yourDataEfun = await MatchesContract.getBetInfo(
      //   dataItem.matchId,
      //   REACT_APP_EFUN_TOKEN,
      //   currentAddress
      // );
      //console.log("yourDataEfun", yourDataEfun);
      //changeYourPredict(yourDataEfun.tx.data);
      if (dataClaim?.error) {
        return store.dispatch(
          showAppPopup(
            <ModalErrorWallet
              messageError={dataClaim.error.message?.toString()}
            />
          )
        );
      }
      // Announce success
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError="Claim success" />)
      );
    } catch (e) {
      console.log(e, "err");
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e?.message?.toString()} />)
      );
    } finally {
      // repeat(this, 10)
      setLoadingClaim(false);
    }
  };

  const getPredictedOnBlockChain = async () => {
    try {
      // const dataEfun = await MatchesContract.getMatchInfo(
      //   // dataItem.matchId,
      //   0,
      //   REACT_APP_EFUN_TOKEN
      // );
      store.dispatch(showAppLoading(true));
      const yourPredicted = await MatchesContract.getBetInfo(
        // dataItem.matchId,
        0,
        REACT_APP_EFUN_TOKEN,
        currentAddress
      );
      console.log("yourPredictedFromBlockChain", yourPredicted);
      if (yourPredicted) {
        let dataPredictedOnBlockChain = yourPredicted?.tx.data[1];
        console.log("dataPredictedOnBlockChain", dataPredictedOnBlockChain);
        let arrayData = dataPredictedOnBlockChain.split(";");

        // set list predicted

        setListPredicted(arrayData);
      }
    } catch (error) {
      console.log(
        "Error getPredictedOnBlockChain in file MiniGameDetail line 397 "
      );
    } finally {
      setTimeout(function () {
        store.dispatch(showAppLoading(false));
        console.log("listPredicted", listPredicted);
      }, 800);
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

  return (
    <>
      <Header />
      {loadingApp && <AppLoading />}
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
            <MenuLink />
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
                        <div className="mt-small text-medium red">
                          <TiWarningOutline style={{ color: "yellow" }} />{" "}
                          {t("common.error_message_1")}
                        </div>
                      )}

                      {yourPredict.length === 0 && warningPredictNull && (
                        <div className="mt-small text-medium red">
                          <TiWarningOutline style={{ color: "yellow" }} /> You
                          need choice minimum 1 option to predict.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="table-options mb-large">
                    <TableOption
                      data={dataItem}
                      yourPredict={yourPredict}
                      isMaxChance={isMaxChance}
                      isTimeEndedMatch={isTimeEndedMatch}
                      listPredicted={listPredicted}
                    />
                  </div>

                  <div className="text-small yellow margin-horizontal-large">
                    {`${t("common.with")} `}
                    <span className="bold">
                      {balanceEfun ? formatNumberPrice(balanceEfun) : 0} EFUN
                    </span>
                    {`, ${t("common.have_predict_1")} `}
                    <span className="bold">
                      {timesCanChance ? timesCanChance : 0}
                    </span>{" "}
                    {`${t("common.have_predict_2")}`}
                  </div>

                  <div className="flex_row_center mt-tiny center">
                    {isTimeEndedMatch && (
                      <div
                        className={`${
                          !currentAddress && "disable-btn"
                        } btn-submit flex_row_center`}
                        disabled={`${!areYourReWard ? "disabled" : ""}`}
                        onClick={claimEfun}
                      >
                        {!loadingClaim ? (
                          areYourReWard ? (
                            <span>Claim</span>
                          ) : (
                            <span>No Reward</span>
                          )
                        ) : (
                          <ClipLoader
                            color="#fff"
                            loading={loadingClaim}
                            css={override}
                            size={30}
                          />
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
                                color="#fff"
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
                              color="#fff"
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
