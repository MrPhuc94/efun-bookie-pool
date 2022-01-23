import { WIDTH } from "src/assets/themes/dimension";
import React from "react";
import "./styles.scss";
import { store } from "src/redux/store";
import { changeYourPredict } from "src/redux/reducers/matchesSlice";
import { AMOUNT_EFUN_FER_CHANCE } from "src/common/Constants";
import { useSelector } from "react-redux";
import { showAppPopup } from "src/redux/reducers/appSlice";
import ModalErrorWallet from "src/components/Modal/ErrorWallet/ErrorWallet";
import Images from "src/common/Images";

const TableOption = (props) => {
  const { data, isTimeEndedMatch, isMaxChance, listPredicted } = props;
  //console.log("isMaxChance", isMaxChance);
  console.log("isTimeEndedMatch", isTimeEndedMatch);
  //console.log("listPredictedAAA", listPredicted);

  // get balance token
  let currentAddress =
    useSelector((state) => state.wallet?.currentAddress) ||
    localStorage.getItem("currentAddress");

  //console.log("timesCanChance", timesCanChance);

  const yourPredict = JSON.parse(localStorage.getItem("yourPredict")) || [];

  const handleChooseOption = (item) => {
    if (!currentAddress) {
      return store.dispatch(
        showAppPopup(
          <ModalErrorWallet messageError="Your need connect wallet first" />
        )
      );
    }

    let isExistItem = yourPredict.find(
      (value) => value?.country === item?.country
    );

    if (isExistItem) {
      let newSelectedOptions = yourPredict.filter(
        (value) => value?.country !== item?.country
      );
      // set state to store
      localStorage.setItem("yourPredict", JSON.stringify(newSelectedOptions));
      store.dispatch(changeYourPredict(newSelectedOptions));
    } else {
      let newSelectedOptions = [...yourPredict, item];
      // set state to storeyourPredict
      console.log("newSelectedOptions", newSelectedOptions);
      localStorage.setItem("yourPredict", JSON.stringify(newSelectedOptions));
      store.dispatch(changeYourPredict(newSelectedOptions));
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

    let isExistItem = yourPredict.find((value) => value.key === item.key);

    //console.log("yourPredict", yourPredict);
    if (isExistItem) {
      let newSelectedOptions = yourPredict.filter(
        (value) => value.key !== item.key
      );
      // set state to store
      localStorage.setItem("yourPredict", JSON.stringify(newSelectedOptions));
      store.dispatch(changeYourPredict(newSelectedOptions));
    } else {
      let newSelectedOptions = [...yourPredict, item];
      // set state to storeyourPredict
      console.log("newSelectedOptions", newSelectedOptions);
      localStorage.setItem("yourPredict", JSON.stringify(newSelectedOptions));
      store.dispatch(changeYourPredict(newSelectedOptions));
    }
  };

  const checkItemSelected = (item) => {
    const findItem = yourPredict?.find(
      (value) => value?.country === item?.country
    );
    if (findItem) return true;
    return false;
  };

  const checkItemSelectedNumber = (item) => {
    const findItem = yourPredict?.find((value) => value.key === item.key);
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

  const checkItemHadPredicted = (item) => {
    const isPredictedItem = listPredicted.find(
      (predicted) => predicted === item?.value
    );
    if (isPredictedItem) return true;
    return false;
  };

  const renderContent = () => {
    switch (data?.name) {
      case "AFCON_2021":
        console.log("dataAFCON_2021", data.data);
        return data?.data.map((item, index) => {
          return (
            <div className="flex_row table-option" key={index}>
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
                    } ${checkItemHadPredicted(item) ? "active" : ""}`}
                    onClick={() => {
                      if (isTimeEndedMatch) {
                        return;
                      }
                      if (checkItemHadPredicted(item)) {
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
                  className={`item-option-2 ${
                    checkItemSelectedNumber(item)
                      ? "active"
                      : isMaxChance
                      ? "disable"
                      : ""
                  } ${checkItemHadPredicted(item) ? "active" : ""}`}
                  onClick={() => {
                    if (isTimeEndedMatch) {
                      return;
                    }
                    if (checkItemHadPredicted(item)) {
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
                  className={`item-option-2 ${
                    checkItemSelectedNumber(item)
                      ? "active"
                      : isMaxChance
                      ? "disable"
                      : ""
                  } ${checkItemHadPredicted(item) ? "active" : ""}`}
                  onClick={() => {
                    if (isTimeEndedMatch) {
                      return;
                    }
                    if (checkItemHadPredicted(item)) {
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
      default:
        return null;
    }
  };

  return (
    <div className="table-option">
      {isTimeEndedMatch ? (
        <div className="place-closed">
          <img src={Images.closed} alt="closed" />
        </div>
      ) : null}
      <div>{renderContent()}</div>
    </div>
  );
};

export default TableOption;
