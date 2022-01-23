import Images from "src/common/Images";
import React, { useState, useEffect, useMemo, useRef } from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import {
  changeYourPredict,
  changeYourPredictEfun,
  changeYourClaimed,
} from "src/redux/reducers/matchesSlice";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import Decimal from "decimal.js";
import { MatchesContract } from "src/blockchain/utils/MatchesContract";
import { getBalance, walletManager } from "src/blockchain/utils/walletManager";
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
  //console.log("dataItemMiniGame", dataItem);
  //LOADING APP
  const loadingApp = useSelector((state) => state.app.loading);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [checkApprove, setCheckApprove] = useState(0);
  const [waitingApprove, setWaitingApprove] = useState(false);
  const [amount, setAmount] = useState(AMOUNT_EFUN_FER_CHANCE.toString());
  const [isTimeEndedMatch, setIsTimeEndedMatch] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [warningPredictNull, setWarningPredictNull] = useState(false);
  const [isMaxChance, setIsMaxChance] = useState(false);
  const [amountClaimReward, setAmountClaimReward] = useState(0);

  // list options predicted on blockchain

  const [listPredicted, setListPredicted] = useState([]);
  const [matchInfoOnBlockChain, setMatchInfoOnBlockChain] = useState({});

  let timer;
  let currentTimer;
  let timerCheckBalance;
  let timerCheckMatchTimeEnd;

  const currentAddress =
    useSelector((state) => state.wallet.currentAddress) ||
    localStorage.getItem("currentAddress");

  let claimSuccessArray = useSelector((state) => state.matches.yourClaimed);
  let claimSuccess = claimSuccessArray?.find(
    (item) => item?.matchId === dataItem.matchId
  )?.claimed;

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
    getMatchDetailOnBlockChain();
  }, []);

  const calculateRewardEfun = async () => {
    try {
      const reward = await MatchesContract.calculateReward(
        // dataItem.matchId,
        0,
        currentAddress,
        REACT_APP_EFUN_TOKEN,
        REACT_APP_EFUN_TOKEN
      );

      let tokenReward = reward?.tx.data._reward / 10 ** 18;
      let tokenPredict =
        listPredicted?.length > 0 &&
        (listPredicted.length - 1) * AMOUNT_EFUN_FER_CHANCE;
      let amountClaimReward = tokenReward + tokenPredict;

      setAmountClaimReward(amountClaimReward);
    } catch (e) {
      console.log(e);
    }
  };

  // TIME PREDICT
  const matchTimeEnd = moment(dataItem?.endDate);

  timerCheckMatchTimeEnd = setInterval(() => {
    const currentTime = moment();
    let matchEnded = matchTimeEnd.isBefore(currentTime);
    //console.log("AAAAAA");
    if (matchEnded) {
      //console.log("BBBBBB");
      setIsTimeEndedMatch(true);
      calculateRewardEfun();
      clearInterval(timerCheckMatchTimeEnd);
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

  const resultMatch = {
    value: `${matchInfoOnBlockChain?.score?.firstTeam}-${matchInfoOnBlockChain?.score?.secondTeam}`,
  } || { value: null };

  console.log("resultMatch", resultMatch);

  const areYourReWard = useMemo(() => {
    console.log("listPredicted=====1111111", listPredicted);
    return listPredicted?.find((item) => resultMatch.value === item);
  }, [resultMatch, listPredicted]);

  const dataResultMatch = useMemo(() => {
    let dataResultMatch;
    if (dataItem?.name === "AFCON_2021") {
      dataItem?.data.forEach((item) => {
        let result = item.find((data) => data.value === resultMatch.value);
        if (result) {
          dataResultMatch = result;
          return;
        }
      });
    } else {
      dataResultMatch = dataItem?.data.find(
        (item) => item.value === resultMatch.value
      );
    }
    console.log("dataResultMatch", dataResultMatch);
    return dataResultMatch;
  }, [resultMatch, dataItem]);

  //console.log("array_default_result", array_default_result);
  useEffect(() => {
    const _isMaxChance =
      yourPredict.length >= timesCanChance || yourPredict.length >= 10;
    setIsMaxChance(_isMaxChance);
  }, [timesCanChance, yourPredict]);

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
    setIsMaxChance(false);

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
        updateBalanceToken();
        store.dispatch(changeYourPredict(null));
        localStorage.setItem("yourPredict", null);
        store.dispatch(
          showAppPopup(
            <ModalErrorWallet
              messageError={`Predict success! Transaction hash: ${recept?.hash}`}
              onOk={getMatchDetailOnBlockChain}
            />
          )
        );
      } else {
        updateBalanceToken();
        setLoadingPlace(false);
        store.dispatch(
          showAppPopup(
            <ModalErrorWallet
              messageError={`${recept.error?.message.toString()}`}
            />
          )
        );
      }
    } catch (e) {
      updateBalanceToken();
      console.log("error====", e);
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e.message?.toString()} />)
      );
    }
  };

  const _checkApprove = async () => {
    if (currentToken) {
      let checkapprove = await MatchesContract.checkApproveTx(
        currentAddress,
        "EFUN"
      );
      console.log("checkapprove1111111", checkapprove);
      if (checkapprove) {
        // setCheckApproveFirst(checkapprove);
        setCheckApprove(checkapprove);
      }

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
      //const recept = await Support.signAndSendTx(approve);
      if (approve) {
        if (currentToken?.symbol === "EFUN") {
          setCheckApprove(1);
          store.dispatch(
            showAppPopup(<ModalErrorWallet messageError="Approve Success" />)
          );
        } else {
          setCheckApprove(0);
        }
      }
    } catch (e) {
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e?.message?.toString()} />)
      );
    } finally {
      setWaitingApprove(false);
    }
  };

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

      if (dataClaim?.error) {
        return store.dispatch(
          showAppPopup(
            <ModalErrorWallet
              messageError={dataClaim.error.message?.toString()}
            />
          )
        );
      } else {
        // Announce success
        store.dispatch(
          changeYourClaimed({
            matchId: dataItem?.matchId,
            claimed: true,
          })
        );
        store.dispatch(
          showAppPopup(<ModalErrorWallet messageError="Claim success" />)
        );
      }
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

  // // check balance
  // useEffect(() => {
  //   checkBalanceToken();
  // });

  // const checkBalanceToken = () => {
  //   if (currentAddress && currentAddress !== "") {
  //     setInterval(() => {
  //       updateBalanceToken();
  //     }, 2000);
  //   }
  // };

  // update balance then predict success
  const updateBalanceToken = async () => {
    await getBalance();
  };

  // get info match from blockchain
  const getMatchDetailOnBlockChain = async () => {
    store.dispatch(showAppLoading(true));
    try {
      const matchInfo = await MatchesContract.getMatchInfo(
        // dataItem.matchId,
        0,
        REACT_APP_EFUN_TOKEN
      );
      //console.log("matchInfo", matchInfo);

      if (matchInfo) {
        setMatchInfoOnBlockChain(matchInfo?.tx.data);
      }

      const yourPredicted = await MatchesContract.getBetInfo(
        // dataItem.matchId,
        0,
        REACT_APP_EFUN_TOKEN,
        currentAddress
      );
      //console.log("yourPredictedFromBlockChain", yourPredicted);
      if (yourPredicted) {
        let dataPredictedOnBlockChain = yourPredicted?.tx.data[1];
        console.log("dataPredictedOnBlockChain", dataPredictedOnBlockChain);
        let arrayData = dataPredictedOnBlockChain.split(";");

        // set list predicted

        setListPredicted(arrayData);
      }
    } catch (error) {
      console.log(
        "Error getMatchDetailOnBlockChain in file MiniGameDetail line 397 "
      );
    } finally {
      setTimeout(function () {
        store.dispatch(showAppLoading(false));
        console.log("listPredicted", listPredicted);
      }, 800);
    }
  };

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
                      {balanceEfun > 0 && isMaxChance && (
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

                  <div>
                    {isTimeEndedMatch && areYourReWard ? (
                      <div className="box-result-match">
                        {dataResultMatch?.country || dataResultMatch?.value}
                        <img src={Images.checked} width={20} height={20} />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex_row_center mt-tiny center">
                    {isTimeEndedMatch && (
                      <div
                        className={`${
                          !currentAddress && "disable-btn"
                        } btn-submit flex_row_center ${
                          !areYourReWard ? "disable-btn" : ""
                        } ${claimSuccess && "claim-success"}`}
                        onClick={!claimSuccess ? claimEfun : () => {}}
                      >
                        {!loadingClaim ? (
                          areYourReWard ? (
                            <span>
                              Claim{" "}
                              {`${formatNumberPrice(amountClaimReward)} EFUN`}
                            </span>
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
                      (checkApprove == 0 ? (
                        <div className="flex_row_center">
                          <div
                            className={`btn-submit flex_row_center center ${
                              waitingApprove && "disable-btn"
                            }`}
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
                          } btn-submit flex_row_center ${
                            loadingPlace && "disable-btn"
                          }`}
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
