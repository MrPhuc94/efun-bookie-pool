import Images from "src/common/Images";
import React, { useState } from "react";
import "./styles.scss";
import MenuTop from "../MenuTop/MenuTop";

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
        <div class="section-games">
          <div className="menu-games">
            {dataMiniGame.map((item, index) => {
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
            <div>Detail MiniGame Predict</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
