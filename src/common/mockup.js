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
  { country: "Cameroon", logo: Images.cameroon, groupName: "Group A" },
  { country: "Cape Verde", logo: Images.capeVerde, groupName: "Group A" },
  { country: "Burkina Faso", logo: Images.burkinafaso, groupName: "Group A" },
  { country: "Ethiopia", logo: Images.ethiopia, groupName: "Group A" },
  { country: "Guinea", logo: Images.guinea, groupName: "Group B" },
  { country: "Senegal", logo: Images.senegal, groupName: "Group B" },
  { country: "Malawi", logo: Images.malawi, groupName: "Group B" },
  { country: "Zimbabwe", logo: Images.zimbabwe, groupName: "Group B" },
  { country: "Gabon", logo: Images.gabon, groupName: "Group C" },
  { country: "Morocco", logo: Images.Morocco, groupName: "Group C" },
  { country: "Comoros", logo: Images.Comoros, groupName: "Group C" },
  { country: "Ghana", logo: Images.Ghana, groupName: "Group C" },

  { country: "Nigeria", logo: Images.Nigeria, groupName: "Group D" },
  {
    country: "Guinea-Bissau",
    logo: Images.GuineaBissau,
    groupName: "Group D",
  },
  { country: "Sudan", logo: Images.Sudan, groupName: "Group D" },
  { country: "Egypt", logo: Images.Egypt, groupName: "Group D" },
  { country: "Ivory Coast", logo: Images.IvoryCoast, groupName: "Group E" },
  { country: "Algeria", logo: Images.Algeria, groupName: "Group E" },
  { country: "Sierra Leone", logo: Images.SierraLeone, groupName: "Group E" },
  {
    country: "Equatorial Guinea",
    logo: Images.EquatorialGuinea,
    groupName: "Group E",
  },
  { country: "Gambia", logo: Images.Gambia, groupName: "Group F" },
  { country: "Mali", logo: Images.Mali, groupName: "Group F" },
  { country: "Mauritania", logo: Images.Mauritania, groupName: "Group F" },
  { country: "Tunisia", logo: Images.Tunisia, groupName: "Group F" },
];

let PRIMARY_RONALDO_GOLD = [
  14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
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

export const ELP_CLUB = [
  { name: "Man. City" },
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
