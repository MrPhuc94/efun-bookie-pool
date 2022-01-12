import React, { Component } from "react";
import Slider from "react-slick";
import lodash from "lodash";
import "./styles.scss";
import { WIDTH } from "src/assets/themes/dimension";
import { store } from "src/redux/store";
import { changeYourBet } from "src/redux/reducers/matchesSlice";

const ArrowLeft = (props) => <button {...props} className={"prev"} />;
const ArrowRight = (props) => <button {...props} className={"next"} />;
export default class SlideOptions extends Component {
  state = {
    display: true,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
    width: WIDTH > 800 ? 600 : WIDTH > 600 ? 480 : 320,
    innerHeight: true,
  };

  render() {
    const yourPredictBet =
      JSON.parse(localStorage.getItem("yourPredictBet")) ||
      this.props.yourPredictBet;

    const timesCanChance = this.props.timesCanChance;
    const isTimeEndedMatch = this.props.isTimeEndedMatch;
    const isMaxChance = yourPredictBet.length >= timesCanChance;

    // console.log("yourPredictBet", yourPredictBet);
    // console.log("timesCanChance", timesCanChance);
    // console.log("timesCanChance", isMaxChance);

    const handleChooseOption = (item) => {
      let isExistItem = yourPredictBet.find(
        (value) => value.Ban1 === item.Ban1 && value.Ban2 === item.Ban2
      );
      if (isExistItem) {
        let newSelectedOptions = yourPredictBet.filter(
          (value) => value.Ban1 !== item.Ban1 || value.Ban2 !== item.Ban2
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
        localStorage.setItem(
          "yourPredictBet",
          JSON.stringify(newSelectedOptions)
        );
        store.dispatch(changeYourBet(newSelectedOptions));
      }
    };

    const checkItemSelected = (item) => {
      const findItem = yourPredictBet?.find(
        (value) => value.Ban1 === item.Ban1 && value.Ban2 === item.Ban2
      );
      if (findItem) return true;
      return false;
    };

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 3,
            infinite: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    let dataSource = this.props.data;

    if (dataSource.length > 16) {
      dataSource = lodash.chunk(dataSource, 16);
    }

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
