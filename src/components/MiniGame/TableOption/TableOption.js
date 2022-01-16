import { WIDTH } from "src/assets/themes/dimension";
import React from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import { changeYourBet } from "src/redux/reducers/matchesSlice";
import { AMOUNT_EFUN_FER_CHANCE } from "src/common/Constants";
import { useSelector } from "react-redux";
import { showAppPopup } from "src/redux/reducers/appSlice";
import ModalErrorWallet from "src/components/Modal/ErrorWallet/ErrorWallet";

function TableOption(props) {
  const { data, isTimeEndedMatch, isMaxChance } = props;
  //console.log("isMaxChance", isMaxChance);
  //console.log("isTimeEndedMatch", isTimeEndedMatch);

  // get balance token
  let currentAddress =
    useSelector((state) => state.wallet?.currentAddress) ||
    localStorage.getItem("currentAddress");

  //console.log("timesCanChance", timesCanChance);

  const yourPredictBet =
    JSON.parse(localStorage.getItem("yourPredictBet")) || [];

  const handleChooseOption = (item) => {
    if (!currentAddress) {
      return store.dispatch(
        showAppPopup(
          <ModalErrorWallet messageError="Your need connect wallet first" />
        )
      );
    }

    let isExistItem = yourPredictBet.find(
      (value) => value?.country === item?.country
    );

    if (isExistItem) {
      let newSelectedOptions = yourPredictBet.filter(
        (value) => value?.country !== item?.country
      );
      // set state to store
      localStorage.setItem(
        "yourPredictBet",
        JSON.stringify(newSelectedOptions)
      );
      store.dispatch(changeYourBet(newSelectedOptions));
    } else {
      let newSelectedOptions = [...yourPredictBet, item];
      // set state to storeyourPredictBet
      console.log("newSelectedOptions", newSelectedOptions);
      localStorage.setItem(
        "yourPredictBet",
        JSON.stringify(newSelectedOptions)
      );
      store.dispatch(changeYourBet(newSelectedOptions));
    }
  };

  const handleChooseOptionNumber = (item) => {
    //console.log("item====", item);
    if (!currentAddress) {
      return store.dispatch(
        showAppPopup(
          <ModalErrorWallet messageError="Your need connect wallet first" />
        )
      );
    }

    let isExistItem = yourPredictBet.find((value) => value.key === item.key);

    //console.log("yourPredictBet", yourPredictBet);
    if (isExistItem) {
      let newSelectedOptions = yourPredictBet.filter(
        (value) => value.key !== item.key
      );
      // set state to store
      localStorage.setItem(
        "yourPredictBet",
        JSON.stringify(newSelectedOptions)
      );
      store.dispatch(changeYourBet(newSelectedOptions));
    } else {
      let newSelectedOptions = [...yourPredictBet, item];
      // set state to storeyourPredictBet
      console.log("newSelectedOptions", newSelectedOptions);
      localStorage.setItem(
        "yourPredictBet",
        JSON.stringify(newSelectedOptions)
      );
      store.dispatch(changeYourBet(newSelectedOptions));
    }
  };

  const checkItemSelected = (item) => {
    const findItem = yourPredictBet?.find(
      (value) => value?.country === item?.country
    );
    if (findItem) return true;
    return false;
  };

  const checkItemSelectedNumber = (item) => {
    const findItem = yourPredictBet?.find((value) => value.key === item.key);
    if (findItem) return true;
    return false;
  };

  const handleSelectItemNumber = (item) => {
    if (isTimeEndedMatch) {
      return;
    }
    if (checkItemSelectedNumber(item)) {
      return handleChooseOptionNumber(item);
    }
    if (isMaxChance) {
      return;
    }
    return handleChooseOptionNumber(item);
  };

  const renderContent = () => {
    switch (data?.name) {
      case "AFCON_2021":
        return data?.data.map((item, index) => {
          return (
            <div className="flex_row" key={index}>
              <div className="text-tiny bold">{item[0].groupName}</div>
              {item.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`item-option text-tiny ${
                      checkItemSelected(item)
                        ? "active"
                        : isMaxChance
                        ? "disable"
                        : ""
                    }`}
                    onClick={() => {
                      if (isTimeEndedMatch) {
                        return;
                      }
                      if (checkItemSelected(item)) {
                        return handleChooseOption(item);
                      }
                      if (isMaxChance) {
                        return;
                      }
                      return handleChooseOption(item);
                    }}
                  >
                    <img src={item.logo} width={30} height={30} alt="logo" />
                    {WIDTH <= 600
                      ? `${item.country.slice(0, 10)} ${
                          item.country.length > 10 ? ".." : ""
                        } `
                      : item.country}
                  </div>
                );
              })}
            </div>
          );
        });
      case "Cristiano_Ronaldo":
        return (
          <div className="flex_row">
            {data?.data.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`item-option-2 text-tiny ${
                    checkItemSelectedNumber(item)
                      ? "active"
                      : isMaxChance
                      ? "disable"
                      : ""
                  }`}
                  onClick={() => {
                    if (isTimeEndedMatch) {
                      return;
                    }
                    if (checkItemSelectedNumber(item)) {
                      return handleChooseOptionNumber(item);
                    }
                    if (isMaxChance) {
                      return;
                    }
                    return handleChooseOptionNumber(item);
                  }}
                >
                  {item.key}
                </div>
              );
            })}
          </div>
        );
      case "LaLiga":
        return (
          <div className="flex_row">
            {data?.data.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`item-option-2 text-tiny ${
                    checkItemSelectedNumber(item)
                      ? "active"
                      : isMaxChance
                      ? "disable"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectItemNumber(item);
                  }}
                >
                  {item.key}
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
}

export default TableOption;
