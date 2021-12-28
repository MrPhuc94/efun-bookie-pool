import Images from "src/common/Images";
import React, { useState } from "react";
import "./styles.scss";
import MenuTop from "../MenuTop/MenuTop";
import SlideOptions from "./SlideOptions/SlideOptions";

const MiniGame = () => {
  const dataMiniGame = [
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
    {
      Team1: "Inter",
      Team2: "Torino",
      Time: "23/12 - 00:30",
      Logo1: Images.wales,
      Logo2: Images.finland,
    },
  ];

  const dataOptions = [];

  [0, 1, 2, 3, 4, 5].map((item) => {
    return [0, 1, 2, 3, 4, 5].map((item2) => {
      return dataOptions.push({
        Ban1: item,
        Ban2: item2,
      });
    });
  });

  const [selectedItem, setSelectedItem] = useState(0);
  return (
    <div className="container">
      <div className="miniGame">
        <div className="heading-box">
          <h1>
            Mini <strong>games</strong>
          </h1>
        </div>
        <MenuTop />
        <div className="section-games">
          <div className="menu-games">
            {dataMiniGame?.map((item, index) => {
              return (
                <div
                  className={`item ${selectedItem === index ? "active" : ""}`}
                  key={index}
                  onClick={() => setSelectedItem(index)}
                >
                  <span>{item.Team1}</span>
                  <img src={item?.Logo1} alt="logo-team1" />
                  <span>{item.Time}</span>
                  <img src={item?.Logo2} alt="logo-team2" />

                  <span>{item.Team2}</span>
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

            <div className="MatchGame flex_row mb-large">
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
                  <SlideOptions data={dataOptions} />
                </div>
              </div>

              <div className="text-small yellow">
                With 150,000 EFUN, you have 3 options to predict now !
              </div>
              <div className="">
                <button className="btn-submit">Predict</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
