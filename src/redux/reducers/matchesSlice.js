import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  round1: null,
  round2: null,
  round3: null,
  currentMatches: null,
  currentMatchesBlockchain: {
    predictionAmount: ["0", "0", "0"],
  },
  currentMatchesBlockchainEfun: {
    predictionAmount: ["0", "0", "0"],
  },
  showBetDetail: null,
  matchesDetailsLoading: false,
  matchesLoading: false,
  yourBet: null,
  yourBetEfun: null,
  leagueList: null,
  leagueSelected: null,
  currentFixtures: null,
  currentRound: null,
  currentRoundSelected: null,
  seasonList: null,
  hotMatches: true,
  hotMatchList: null,
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    async changeRound1(state, action) {
      const data = await axios.get("json/round1.json");
      state.round1 = data.data.response;
    },
    async changeRound2(state, action) {
      const data = await axios.get("json/round2.json");
      state.round2 = data.data.response;
    },
    async changeRound3(state, action) {
      const data = await axios.get("json/round3.json");
      state.round2 = data.data.response;
    },
    changeSeasonList(state, action) {},
    async changeLeagueList(state, action) {
      axios
        .get(process.env.REACT_APP_API_HOST + "/api/v1/leagues")
        .then((response) => {
          console.log("Success ========>", response);
          state.leagueList = response.data.data;
        })
        .catch((error) => {
          console.log("Error ========>", error);
        });
    },
    async changeCurrentRound(state, action) {
      // const data = await axios.get(`https://a.efun.tech/api/v1/rounds?filter[league_id]=${payload.leagueId}`)
      const data = await axios.get(
        process.env.REACT_APP_API_HOST +
          `/api/v1/rounds?filter[league_id]=${action.payload.leagueId}&filter[season_id]=${action.payload.seasionId}`
      );
      state.changeCurrentRound = data.data.response;
    },
    async changeCurrentFixtures(state, action) {
      const data = await axios.get(
        process.env.API_HOST +
          `/api/v1/fixtures?filter[league_id]=${action.payload.leagueId}&filter[round_id]=${action.payload.roundId}`
      );
      state.changeCurrentFixtures = data.data.data.items;
    },
    changeCurrentMatches(state, action) {
      const dataParsed = Object.fromEntries(
        Object.entries(action.payload).map(function ([key, value]) {
          try {
            return [key, JSON.parse(value)];
          } catch (error) {
            return [key, value];
          }
        })
      );

      state.changeCurrentMatches = dataParsed;
    },
    changeCurrentMatchesBlockchain(state, action) {
      state.changeCurrentMatchesBlockchain = action.payload;
    },
    changeCurrentMatchesBlockchainEfun(state, action) {
      state.changeCurrentMatchesBlockchainEfun = action.payload;
    },
    changeMatchesDetailLoading(state, action) {
      state.changeMatchesDetailLoading = action.payload;
    },
    changeMatchesLoading(state, action) {
      state.changeMatchesLoading = action.payload;
    },
    changeShowDetail(state, action) {
      state.changeShowDetail = action.payload;
    },
    changeYourBet(state, action) {
      state.yourBet = action.payload;
    },
    changeYourBetEfun(state, action) {
      state.yourBetEfun = action.payload;
    },
    changeLeagueSelected(state, action) {
      state.changeLeagueSelected = action.payload;
    },
    changeCurrentRoundSelected(state, action) {
      state.changeCurrentRoundSelected = action.payload;
    },
    changeHotMatch(state, action) {
      state.changeHotMatch = action.payload;
    },
    async changeHotMatchList(state, action) {
      const data = await axios.get(
        process.env.API_HOST + "/api/v1/fixtures/hot"
      );
      state.changeHotMatchList = data.data.data.item;
    },
  },
});

export const {
  changeRound1,
  changeRound2,
  changeRound3,
  changeSeasonList,
  changeLeagueList,
  changeCurrentRound,
  changeCurrentFixtures,
  changeCurrentMatches,
  changeCurrentMatchesBlockchain,
  changeCurrentMatchesBlockchainEfun,
  changeMatchesDetailLoading,
  changeMatchesLoading,
  changeShowDetail,
  changeYourBet,
  changeYourBetEfun,
  changeLeagueSelected,
  changeCurrentRoundSelected,
  changeHotMatch,
  changeHotMatchList,
} = matchesSlice.actions;

export default matchesSlice.reducer;
