import React, { Component } from "react";
import Slider from "react-slick";
import lodash from "lodash";
import "./styles.scss";

export default class SlideOptions extends Component {
  state = {
    display: true,
    width: 600,
    selectedOptions: [],
  };

  render() {
    const handleChooseOption = (item) => {
      if (this.state.selectedOptions.includes(item)) {
        let newSelectedOptions = this.state.selectedOptions.filter(
          (_item) => _item !== item
        );
        return this.setState({
          selectedOptions: newSelectedOptions,
        });
      }

      let newSelectedOptions = [
        ...new Set([...this.state.selectedOptions, item]),
      ];

      this.setState({
        selectedOptions: newSelectedOptions,
      });
    };

    const checkItemSelected = (item) => {
      return this.state.selectedOptions.includes(item);
    };

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
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
                          checkItemSelected(item) ? "active" : ""
                        }`}
                        onClick={() => {
                          handleChooseOption(item);
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
