import Images from "src/common/Images";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import {
  changeYourPredict,
  changeYourClaimed,
  changeListPredicted,
} from "src/redux/reducers/matchesSlice";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import Decimal from "decimal.js";
import { MatchesContract } from "src/blockchain/utils/MatchesContract";
import { getBalance, walletManager } from "src/blockchain/utils/walletManager";
import { showAppPopup, showAppLoading } from "src/redux/reducers/appSlice";
import ModalErrorWallet from "../Modal/ErrorWallet/ErrorWallet";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import { WIDTH } from "src/assets/themes/dimension";
import {
  AMOUNT_EFUN_FER_CHANCE,
  MAXIMUM_OPTIONS_PREDICT,
} from "src/common/Constants";
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
  const dataItem = location.state?.data;
  const loadingApp = useSelector((state) => state.app.loading);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [checkApprove, setCheckApprove] = useState(0);
  const [waitingApprove, setWaitingApprove] = useState(false);
  const [amount, setAmount] = useState(AMOUNT_EFUN_FER_CHANCE.toString());
  const [isTimeEndedMatch, setIsTimeEndedMatch] = useState(null);
  const [isTimeEndToPredict, setIsTimeEndToPredict] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [warningPredictNull, setWarningPredictNull] = useState(false);
  const [isMaxChance, setIsMaxChance] = useState(false);
  const [amountClaimReward, setAmountClaimReward] = useState(0);
  const [totalReward, setTotalReward] = useState(0);

  // list options predicted on blockchain

  const [matchInfoOnBlockChain, setMatchInfoOnBlockChain] = useState({});

  const listPredicted = useSelector((state) => state.matches.listPredicted);
  //console.log("listPredicted", listPredicted);

  let timer;
  let currentTimer;
  let timerCheckBalance;
  let timerCheckMatchTimeEnd;
  let timerCheckMatchTimeEndPredict;

  const currentAddress =
    useSelector((state) => state.wallet.currentAddress) ||
    localStorage.getItem("currentAddress");

  let claimSuccessArray = useSelector((state) => state.matches.yourClaimed);
  let claimSuccess = claimSuccessArray?.find(
    (item) => item?.matchId === dataItem.matchId
  )?.claimed;

  const yourPredict =
    useSelector((state) => state.matches.yourPredict) ||
    JSON.parse(localStorage.getItem("yourPredict")) ||
    [];

  // get balance token
  let tokens =
    useSelector((state) => state.wallet.tokens) ||
    JSON.parse(localStorage.getItem("tokens"));
  const currentToken = tokens?.find((item) => item?.symbol === "EFUN");
  let balanceEfun = currentToken?.balance;

  const isEnoughForChance =
    parseFloat(currentToken?.balance) >= AMOUNT_EFUN_FER_CHANCE;

  const maxTimeWithBalance = Math.floor(
    parseFloat(currentToken?.balance) / AMOUNT_EFUN_FER_CHANCE
  );



  // Times can chance

  const isMaxPredictedOnBlockChain = useMemo(() => {
    return listPredicted.length >= MAXIMUM_OPTIONS_PREDICT;
  }, [listPredicted]);

  const timesCanChance = useMemo(() => {
    let timesCanChance = 0;
    const maxTimeChance =
      maxTimeWithBalance < MAXIMUM_OPTIONS_PREDICT
        ? maxTimeWithBalance
        : MAXIMUM_OPTIONS_PREDICT;

    if (listPredicted.length) {
      timesCanChance = maxTimeChance - listPredicted.length;
    } else {
      timesCanChance = maxTimeChance;
    }
    return timesCanChance;
  }, [maxTimeWithBalance, listPredicted]);

  //console.log("array_default_result", array_default_result);
  useEffect(() => {
    const _isMaxChance =
      yourPredict.length >= timesCanChance ||
      yourPredict.length >= maxTimeWithBalance;
    setIsMaxChance(_isMaxChance);
  }, [timesCanChance, yourPredict, maxTimeWithBalance]);

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
        dataItem.matchId,
        // 0,
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
      //console.log(e);
    }
  };

  const getTotalReward = async () => {
    const matchInfo = await MatchesContract.getMatchInfo(
      dataItem.matchId,
      // 0,
      REACT_APP_EFUN_TOKEN
    );
    // console.log("matchInfo?.tx.data.sTotal", matchInfo?.tx.data.sTotal);

    if (matchInfo) {
      let total = matchInfo?.tx.data.sTotal / 10 ** 18 || 0;
      setTotalReward(total);
    }
  };

  useEffect(() => {
    getTotalReward(dataItem.matchId);
  }, []);

  // TIME PREDICT
  const matchTimeEnd = moment.parseZone(dataItem?.endDate);
  const timeEndToPredict = moment
    .parseZone(dataItem?.endDate)
    .subtract({ minutes: 3 });

  timerCheckMatchTimeEndPredict = setInterval(() => {
    const currentTime = moment();
    let matchEnded = timeEndToPredict.isBefore(currentTime);
    if (matchEnded) {
      setIsTimeEndToPredict(true);
      clearInterval(timerCheckMatchTimeEndPredict);
    }
  }, 2000);

  timerCheckMatchTimeEnd = setInterval(() => {
    const currentTime = moment();

    let matchEnded = matchTimeEnd.isBefore(currentTime);
    if (matchEnded) {
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

  const resultMatch = {
    value: `${matchInfoOnBlockChain?.score?.firstTeam}-${matchInfoOnBlockChain?.score?.secondTeam}`,
  } || { value: null };

  const areYourReWard = useMemo(() => {
    //console.log("listPredicted=====1111111", listPredicted);
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
    //console.log("dataResultMatch", dataResultMatch);
    return dataResultMatch;
  }, [resultMatch, dataItem]);

  /**
   * HANDLE DATA REQUEST BLOCKCHAIN =TODO
   */

  const predict = async () => {
    // console.log("yourPredict===172", yourPredict);
    if (yourPredict?.length < 1) {
      setWarningPredictNull(true);
      return;
    }
    setLoadingPlace(true);
    setIsMaxChance(false);

    // handle map param request to blockchain
    const listPredict =
      yourPredict?.map((item) => item.value).join(";") + ";" || "";

    //console.log("listPredict", listPredict);

    // get amount  TOKEN_EFUN for this predict
    const amount = yourPredict?.length * AMOUNT_EFUN_FER_CHANCE;
    // console.log("matchIdPredict", dataItem.matchId);

    try {
      const token =
        currentToken.symbol === "BNB"
          ? REACT_APP_BNB_TOKEN
          : REACT_APP_EFUN_TOKEN;

      let recept = await MatchesContract.predict(
        dataItem.matchId,
        // 0,
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
              messageError={`Your predict was successful! Transaction hash: ${recept?.hash}`}
              onOk={() => {
                getMatchDetailOnBlockChain(false);
              }}
            />
          )
        );
      } else {
        setLoadingPlace(false);
        updateBalanceToken();
        store.dispatch(changeYourPredict(null));
        localStorage.setItem("yourPredict", null);
        store.dispatch(
          showAppPopup(
            <ModalErrorWallet
              messageError={`${recept.error?.message.toString()}`}
            />
          )
        );
      }
    } catch (e) {
      setLoadingPlace(false);
      updateBalanceToken();
      store.dispatch(changeYourPredict(null));
      localStorage.setItem("yourPredict", null);
      // console.log("error====", e);
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
      //console.log("checkapprove1111111", checkapprove);
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
        dataItem.matchId,
        // 0,
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
      // console.log(e, "err");
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e?.message?.toString()} />)
      );
    } finally {
      // repeat(this, 10)
      setLoadingClaim(false);
    }
  };

  // check balance
  useEffect(() => {
    if (currentAddress && currentAddress !== "") {
      updateBalanceToken();
    }
  }, []);

  // update balance then predict success
  const updateBalanceToken = async () => {
    await getBalance();
  };

  // get info match from blockchain
  const getMatchDetailOnBlockChain = async (loading = true) => {
    loading && store.dispatch(showAppLoading(true));
    try {
      const matchInfo = await MatchesContract.getMatchInfo(
        dataItem.matchId,
        // 0,
        REACT_APP_EFUN_TOKEN
      );
      if (matchInfo) {
        // console.log("matchInfo====", matchInfo);
        setMatchInfoOnBlockChain(matchInfo?.tx.data);
      }

      const yourPredicted = await MatchesContract.getBetInfo(
        dataItem.matchId,
        // 0,
        REACT_APP_EFUN_TOKEN,
        currentAddress
      );
      if (yourPredicted) {
        let dataPredictedOnBlockChain = yourPredicted?.tx.data[1];
        let arrayData = dataPredictedOnBlockChain.split(";");
        // set list predicted
        if (arrayData) {
          arrayData.pop();
        }
        store.dispatch(changeListPredicted(arrayData));
      }
    } catch (error) {
      // console.log(
      //   "Error getMatchDetailOnBlockChain in file MiniGameDetail line 397 "
      // );
    } finally {
      setTimeout(function () {
        loading && store.dispatch(showAppLoading(false));
        //  console.log("listPredicted", listPredicted);
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
                <span className="text-medium yellow bold">
                  Total Reward : {formatNumberPrice(totalReward)} EFUN
                </span>
              </div>
              <div>
                <span className="text-small red bold">
                  Deadline : {dataItem?.endDate} UTC
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
                      {balanceEfun > 0 &&
                        yourPredict.length > 0 &&
                        isMaxChance &&
                        !isMaxPredictedOnBlockChain && (
                          <div className="mt-small text-medium red">
                            <TiWarningOutline style={{ color: "yellow" }} />{" "}
                            {t("common.error_message_1")}
                          </div>
                        )}

                      {yourPredict.length === 0 && warningPredictNull && (
                        <div className="mt-small text-medium red">
                          <TiWarningOutline style={{ color: "yellow" }} />
                          You need to choose at least 1 option to predict.
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
                    <span className="bold">{timesCanChance}</span>{" "}
                    {`${t("common.have_predict_2")}`}
                  </div>

                  <div>
                    {isTimeEndedMatch && areYourReWard ? (
                      <div className="box-result-match">
                        {dataResultMatch?.country || dataResultMatch?.value}
                        <img
                          src={Images.checked}
                          width={20}
                          height={20}
                          alt="reward"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex_row_center mt-tiny center">
                    {isTimeEndedMatch && (
                      <div
                        className={`${
                          !currentAddress && "disable-btn"
                        } btn-submit flex_row_center ${claimSuccess && "claim-success"}`}
                        onClick={!claimSuccess ? claimEfun : () => {}}
                      >
                        {!loadingClaim ? (
                            <span>
                              Claim{" "}
                              {`${formatNumberPrice(amountClaimReward)} EFUN`}
                            </span>
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
                            (loadingPlace ||
                              !isEnoughForChance ||
                              isMaxPredictedOnBlockChain ||
                              isTimeEndToPredict) &&
                            "disable-btn"
                          }`}
                          onClick={
                            isEnoughForChance && !isMaxPredictedOnBlockChain
                              ? predict
                              : () => {}
                          }
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
