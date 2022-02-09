const { default: Images } = require("./Images");

const generate_result = () => {
  let list = [];
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item2) => {
      return list.push({ value: `${item}-${item2}` });
    });
  });
  return list;
};

export const array_default_result = generate_result();

export const PRIMARY_DATA_MINI_GAME_AFICANATIONS_CUP = [
  { country: "Gambia", logo: Images.Gambia, groupName: "Group F" },
  { country: "Cameroon", logo: Images.cameroon, groupName: "Group A" },
  { country: "Burkina Faso", logo: Images.burkinafaso, groupName: "Group A" },
  { country: "Tunisia", logo: Images.Tunisia, groupName: "Group F" },
  { country: "Egypt", logo: Images.Egypt, groupName: "Group D" },
  { country: "Morocco", logo: Images.Morocco, groupName: "Group C" },
  { country: "Senegal", logo: Images.senegal, groupName: "Group B" },
  {
    country: "Equatorial Guinea",
    logo: Images.EquatorialGuinea,
    groupName: "Group E",
  },
];

let PRIMARY_RONALDO_GOLD = [
  14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  52, 53, 54, 55, 56, 58,
];

// add value
let DATA_MINI_GAME_AFICANATIONS_CUP_VALUE = array_default_result.slice(
  0,
  PRIMARY_DATA_MINI_GAME_AFICANATIONS_CUP.length
);

export const DATA_MINI_GAME_AFICANATIONS_CUP =
  PRIMARY_DATA_MINI_GAME_AFICANATIONS_CUP.map((item, index) => {
    return {
      ...item,
      value: DATA_MINI_GAME_AFICANATIONS_CUP_VALUE[index].value,
    };
  });

let RONALDO_GOLD_VALUE = array_default_result.slice(
  0,
  PRIMARY_RONALDO_GOLD.length
);
export const RONALDO_GOLD = PRIMARY_RONALDO_GOLD.map((item, index) => {
  return { key: item, value: RONALDO_GOLD_VALUE[index].value };
});

let PRIMARY_BARCA_PLACE = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
let BARCA_PLACE_VALUE = array_default_result.slice(
  0,
  PRIMARY_BARCA_PLACE.length
);

export const BARCA_PLACE = PRIMARY_BARCA_PLACE.map((item, index) => {
  return { key: item, value: BARCA_PLACE_VALUE[index].value };
});

export const PRIMARY_ELP_CLUB = [
  { name: "Man City" },
  { name: "Chelsea" },
  { name: "Liverpool" },
  { name: "Arsenal" },
  { name: "West Ham" },
  { name: "Tottenham" },
  { name: "Manchester Utd" },
  { name: "Wolves" },
  { name: "Brighton" },
  { name: "Leicester City" },
  { name: "Crystal Palace" },
  { name: "Brentford" },
  { name: "Aston Villa" },
  { name: "Southampton" },
  { name: "Everton" },
  { name: "Leeds United" },
  { name: "Watford" },
  { name: "Burnley" },
  { name: "Newcastle" },
  { name: "Norwich City" },
];

let ELP_CLUB_VALUE = array_default_result.slice(0, PRIMARY_ELP_CLUB.length);

export const ELP_CLUB = PRIMARY_ELP_CLUB.map((item, index) => {
  return { ...item, value: ELP_CLUB_VALUE[index].value };
});
