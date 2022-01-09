import Images from "src/common/Images";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import MenuTop from "../MenuTop/MenuTop";
import SlideOptions from "./SlideOptions/SlideOptions";
import { store } from "src/redux/store";
import {
  changeSeasonList,
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
import { showAppPopup } from "src/redux/reducers/appSlice";
import ModalErrorWallet from "../Modal/ErrorWallet/ErrorWallet";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
const override = css`
  margin: 0 auto;
`;

const MiniGame = () => {
  // const
  const currentSelect = "EFUN";
  const appLabel = "Approve EFUN";
  const sponsorEven = 1000;
  const sponsorETAmount = 0;
  const [loadingPlace, setLoadingPlace] = useState(false);
  const loadingPlace2 = false;
  const methodBet = 1;
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

  //list selected options predict
  const [selectedOptionList, setSelectedOptionList] = useState([]);

  let [color, setColor] = useState("#ffffff");

  const currentMatches = {
    id: "1",
    bc_match_id: "1",
    bc_match_meta: "1",
    bc_result: true,
    bc_result_meta: "1",
    remote_id: "1",
    hot: true,
    timezone: "1",
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
      Team1: "Liverpool",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Liverpool",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
  ];
  // get balance token
  let tokens =
    useSelector((state) => state.wallet.tokens) ||
    localStorage.getItem("tokens");

  if (tokens && typeof tokens === "string") {
    tokens = JSON.parse(tokens);
  }

  const currentToken = tokens?.find((item) => item?.symbol === "EFUN");

  const balanceEfun = currentToken?.balance;
  const timesCanChance = Math.floor(parseFloat(currentToken?.balance) / 50000);

  const [seasonList, setSeasonList] = useState(null);
  const [leagueList, setLeagueList] = useState(null);

  const setListPredict = (item) => {
    let newSetSelectedOptionList = [...selectedOptionList, item];
    console.log("newSetSelectedOptionList====", newSetSelectedOptionList);

    setSelectedOptionList(newSetSelectedOptionList);
  };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_HOST + "/api/v1/seasons")
      .then((response) => {
        console.log("Success ========>", response.data.data);
        setSeasonList(response.data.data);
      })
      .catch((error) => {
        console.log("Error ========>", error);
      });

    axios
      .get(process.env.REACT_APP_API_HOST + "/api/v1/leagues")
      .then((response) => {
        console.log("Success ========>", response);
        setLeagueList(response.data.data || []);
      })
      .catch((error) => {
        console.log("Error ========>", error);
      });
  }, []);

  const dataOptions = [];

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item2) => {
      return dataOptions.push({
        Ban1: item,
        Ban2: item2,
      });
    });
  });

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

  const bet = async () => {
    setLoadingPlace(true);
    if (!currentAddress) {
      setAddWalletDialog(true);
      setLoadingPlace(false);
      // } else if (formBet.validate()) {
      //   formBet.validate();
      //   setLoadingPlace(false);
    } else if (activeBetting === null) {
      setLoadingPlace(false);
    } else {
      try {
        const token =
          currentToken.symbol === "BNB"
            ? process.env.REACT_APP_BNB_TOKEN
            : process.env.REACT_APP_EFUN_TOKEN;
        console.log("currentMatches", currentMatches);
        console.log("methodBet", methodBet);
        console.log("token", token);
        console.log("amount", amount);
        console.log("currentAddress", currentAddress);

        const recept = await MatchesContract.predict(
          currentMatches.bc_match_id,
          methodBet,
          token,
          amount,
          currentAddress
        );

        // await axios.post(process.env.API_HOST + '/api/v1/block-numbers/create', {
        //   type: 'group_predict',
        //   block_number: recept.tx.hash.blockNumber
        // })
        console.log(recept, "recept");
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
          process.env.BNB_TOKEN
        );
        const dataEfun = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          process.env.EFUN_TOKEN
        );
        const yourDataEfun = await MatchesContract.getBetInfo(
          currentMatches.bc_match_id,
          process.env.EFUN_TOKEN,
          currentAddress
        );
        const yourData = await MatchesContract.getBetInfo(
          currentMatches.bc_match_id,
          process.env.BNB_TOKEN,
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
      console.log("currentAddress", currentAddress);
      console.log("currentToken", currentToken);

      _checkApprove(false);
    }
  }, [currentToken, currentAddress]);

  const _checkApprove = async (boolean) => {
    if (currentToken) {
      let checkapprove = await MatchesContract.checkApproveTx(
        currentAddress,
        "EFUN"
      );
      console.log("checkapprove", checkapprove);
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

  const changeBetting = (methodBet) => {
    methodBet = methodBet;
    activeBetting = methodBet;
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
      console.log(e, "eee");
      setWaitingApprove(false);
      setApproveMsg(e?.message);
      store.dispatch(
        showAppPopup(<ModalErrorWallet messageError={e?.message} />)
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

  const maxAmount = () => {
    if (!currentAddress) {
      addWalletDialog = true;
    } else {
      const number = new Decimal(_get(currentToken, "balance", 0));
      amount = number.toFixed(5, Decimal.ROUND_DOWN);
    }
  };

  const getFixtures = () => {
    axios
      .get(
        "https://efun.datsan247.com/api/v1/fixtures/sponsor?filter[bc_match_id]=1"
      )
      .then((res) => {
        fixtureList = res.data.item;
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getHotFixtures = () => {
    axios
      .get("https://efun.datsan247.com/api/v1/fixtures/sponsor/hot")
      .then((res) => {
        hotList = res.data.item;
      })
      .catch((e) => {
        console.log(e);
      });
  };
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

  const calculateReward = async () => {
    try {
      const reward = await MatchesContract.calculateReward(
        currentMatches.bc_match_id,
        currentAddress,
        process.env.BNB_TOKEN
      );
      console.log(reward.tx.data, "calculateReward");
      totalReward = reward.tx.data._reward;
      sponsorReward = reward.tx.data._sponsorReward;
    } catch (e) {
      console.log(e);
    }
  };
  const calculateRewardEfun = async () => {
    try {
      const reward = await MatchesContract.calculateReward(
        currentMatches.bc_match_id,
        currentAddress,
        process.env.EFUN_TOKEN
      );
      // console.log(reward.tx.data, 'rewardefun')
      totalRewardEfun = reward.tx.data._reward;
      sponsorReward = reward.tx.data._sponsorReward;
    } catch (e) {
      console.log(e);
    }
  };
  const claim = async () => {
    try {
      loadingPlace = true;
      await MatchesContract.claimReward(
        currentMatches.bc_match_id,
        process.env.BNB_TOKEN,
        currentAddress
      );
      const yourData = await MatchesContract.getBetInfo(
        currentMatches.bc_match_id,
        process.env.BNB_TOKEN,
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
        process.env.EFUN_TOKEN,
        currentAddress
      );
      const yourDataEfun = await MatchesContract.getBetInfo(
        currentMatches.bc_match_id,
        process.env.EFUN_TOKEN,
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
          process.env.BNB_TOKEN
        );
        const dataEfun = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          process.env.EFUN_TOKEN
        );
        // console.log(data, 'data')
        // console.log(dataEfun, 'dataEfun')
        if (currentAddress) {
          const yourData = await MatchesContract.getBetInfo(
            currentMatches.bc_match_id,
            process.env.BNB_TOKEN,
            currentAddress
          );
          const yourDataEfun = await MatchesContract.getBetInfo(
            currentMatches.bc_match_id,
            process.env.EFUN_TOKEN,
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
          process.env.BNB_TOKEN
        );
        const dataEfun = await MatchesContract.getMatchInfo(
          currentMatches.bc_match_id,
          process.env.EFUN_TOKEN
        );
        // if (currentAddress) {
        //   const yourData = await MatchesContract.getBetInfo(currentMatches.bc_match_id, process.env.BNB_TOKEN, currentAddress)
        //   const yourDataEfun = await MatchesContract.getBetInfo(currentMatches.bc_match_id, process.env.EFUN_TOKEN, currentAddress)
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

  console.log("checkApprove", checkApprove);
  return (
    <div className="container">
      <div className="miniGame">
        <div className="heading-box">
          <h1>
            Mini <strong>games</strong>
          </h1>
        </div>
        <MenuTop menu={leagueList?.items || []} />
        <div className="section-games">
          <div className="menu-games">
            {dataMiniGame?.map((item, index) => {
              return (
                <div
                  className={`item ${selectedItem === index ? "active" : ""}`}
                  key={index}
                  onClick={() => setSelectedItem(index)}
                >
                  <div className="team">
                    <span>{item.Team1}</span>
                    <img
                      src={item?.Logo1}
                      alt="logo-team1"
                      width={30}
                      height={30}
                    />
                  </div>
                  <span>{item.Time}</span>
                  <div className="team">
                    <img
                      src={item?.Logo2}
                      alt="logo-team2"
                      width={30}
                      height={30}
                    />
                    <span>{item.Team2}</span>
                  </div>
                  <button className="btn-predict">Predict</button>
                </div>
              );
            })}
          </div>
          <div className="detail-games">
            <div className="description mb-large">
              <div className="mb-small">
                <img src={Images.laliga} alt="" className="mr-small" />
                <span>Premier League</span>
              </div>
              <div>
                <span className="text-small red">
                  Deadline : 3 mins before START
                </span>
              </div>
              <div>
                <span className="text-small gray">
                  St. James' Park, Newcastle upon Tyne
                </span>
              </div>
              <div>
                <span className="text-small">Regular Season - 18</span>
              </div>
            </div>

            <div
              className="MatchGame flex_row mb-large"
              style={{ justifyContent: "center" }}
            >
              <div style={{ width: 200 }}>
                <div className="mb-small">
                  <img src={dataMiniGame[selectedItem].Logo1} alt="" />
                </div>
                <div>
                  <span className="text-medium gray">
                    {dataMiniGame[selectedItem].Team1}
                  </span>
                </div>
              </div>

              <div className="match-result">0 - 0</div>

              <div style={{ width: 200 }}>
                <div className="mb-small">
                  <img src={dataMiniGame[selectedItem].Logo2} alt="" />
                </div>
                <div>
                  <span className="text-medium gray">
                    {dataMiniGame[selectedItem].Team2}
                  </span>
                </div>
              </div>
            </div>

            <div className="your-predict">
              <div className="description mb-large">
                <div className="mb-large">
                  <span className="bold text-medium">Your predict</span>
                </div>

                <div className="text-small">
                  <span className="text-medium yellow">
                    For each 50k EFUN in your wallet, you have 1 more chance to
                    predict
                    <br />
                    <span>{`You can select ${dataOptions.length} options`}</span>
                  </span>
                </div>
              </div>

              <div className="table-options mb-large">
                <div className="slider-option">
                  <SlideOptions
                    data={dataOptions}
                    setListPredict={setListPredict}
                  />
                </div>
              </div>

              <div className="text-small yellow">
                {`With ${balanceEfun} EFUN, you have ${timesCanChance} options to predict now !`}
              </div>

              <div className="flex_row_center mt-tiny center">
                {checkApprove === 0 ? (
                  <div className="flex_row_center">
                    <div
                      className="btn-submit flex_row"
                      onClick={approve}
                      style={{ minWidth: "30%" }}
                    >
                      {waitingApprove ? (
                        <ClipLoader
                          color={color}
                          loading={waitingApprove}
                          css={override}
                          size={30}
                        />
                      ) : (
                        <span> Approve Efun</span>
                      )}
                    </div>
                    <div className="btn-submit flex_row" disabled="disabled">
                      Place your predict now
                    </div>
                  </div>
                ) : (
                  <div className="flex_row btn-submit" onClick={bet}>
                    {loadingPlace ? (
                      <ClipLoader
                        color={color}
                        loading={loadingPlace}
                        css={override}
                        size={30}
                      />
                    ) : (
                      <span>Place your predict now</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
