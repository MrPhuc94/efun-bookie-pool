import React, { Component } from "react";
import Slider from "react-slick";
import lodash from "lodash";
import "./styles.scss";
import { WIDTH } from "src/assets/themes/dimension";
import { store } from "src/redux/store";
import { changeYourPredict } from "src/redux/reducers/matchesSlice";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    >
      ASDASDSA
    </div>
  );
}

export default class SlideOptions extends Component {
  state = {
    display: true,
    infinite: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    width: WIDTH > 800 ? 400 : WIDTH > 600 ? 480 : 320,
    innerHeight: true,
  };

  render() {
    const yourPredict =
      JSON.parse(localStorage.getItem("yourPredict")) || this.props.yourPredict;

    const timesCanChance = this.props.timesCanChance;
    const isTimeEndedMatch = this.props.isTimeEndedMatch;
    const isMaxChance = yourPredict.length >= timesCanChance;

    // console.log("yourPredict", yourPredict);
    // console.log("timesCanChance", timesCanChance);
    // console.log("timesCanChance", isMaxChance);

    const handleChooseOption = (item) => {
      let isExistItem = yourPredict.find(
        (value) => value.Ban1 === item.Ban1 && value.Ban2 === item.Ban2
      );
      if (isExistItem) {
        let newSelectedOptions = yourPredict.filter(
          (value) => value.Ban1 !== item.Ban1 || value.Ban2 !== item.Ban2
        );
        // set state to store
        localStorage.setItem("yourPredict", JSON.stringify(newSelectedOptions));
        store.dispatch(changeYourPredict(newSelectedOptions));
      } else {
        let newSelectedOptions = [...yourPredict, item];
        // set state to storeyourPredict
        localStorage.setItem("yourPredict", JSON.stringify(newSelectedOptions));
        store.dispatch(changeYourPredict(newSelectedOptions));
      }
    };

    const checkItemSelected = (item) => {
      const findItem = yourPredict?.find(
        (value) => value.Ban1 === item.Ban1 && value.Ban2 === item.Ban2
      );
      if (findItem) return true;
      return false;
    };

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    let dataSource = this.props.data;

    if (dataSource.length > 11) {
      dataSource = lodash.chunk(dataSource, 11);
    }

    console.log("dataSource", dataSource);
    return (
      <div>
        <div
          style={{
            width: this.state.width + "px",
            display: this.state.display ? "block" : "none",
          }}
        >
          <Slider {...settings}>
            {dataSource.map((data, index) => {
              return (
                <div key={index} className="SlideItem">
                  {data?.map((item, index) => {
                    return (
                      <div
                        className={`ItemOption ${
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
                        key={index}
                      >
                        <span>
                          {item.Ban1} - {item.Ban2}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    );
  }
}
