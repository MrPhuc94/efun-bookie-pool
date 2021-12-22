import axios from "axios";

const initialState = {
  round1: null,
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
  yourBet: {
    predictionAmount: ["0", "0", "0"],
  },
  yourBetEfun: {
    predictionAmount: ["0", "0", "0"],
  },
  leagueList: null,
  leagueSelected: null,
  currentFixtures: null,
  currentRound: null,
  currentRoundSelected: null,
  seasonList: null,
  hotMatches: true,
  hotMatchList: null,
};

export const matchesStore = {
  round1(state) {
    return state.round1;
  },
  round2(state) {
    return state.round2;
  },
  round3(state) {
    return state.round3;
  },
  currentMatches(state) {
    return state.currentMatches;
  },
  currentMatchesBlockchain(state) {
    return state.currentMatchesBlockchain;
  },
  currentMatchesBlockchainEfun(state) {
    return state.currentMatchesBlockchainEfun;
  },
  matchesDetailsLoading(state) {
    return state.matchesDetailsLoading;
  },
  matchesLoading(state) {
    return state.matchesLoading;
  },
  showBetDetail(state) {
    return state.showBetDetail;
  },
  yourBet(state) {
    return state.yourBet;
  },
  yourBetEfun(state) {
    return state.yourBetEfun;
  },
  leagueList(state) {
    return state.leagueList;
  },
  leagueSelected(state) {
    return state.leagueSelected;
  },
  currentFixtures(state) {
    return state.currentFixtures;
  },
  currentRound(state) {
    return state.currentRound;
  },
  currentRoundSelected(state) {
    return state.currentRoundSelected;
  },
  seasonList(state) {
    return state.seasonList;
  },
  hotMatches(state) {
    return state.hotMatches;
  },
  hotMatchList(state) {
    return state.hotMatchList;
  },
};
export const actions = {
  async changeRound1({ commit }) {
    const data = await axios.get("json/round1.json");
    commit("CHANGE_ROUND_1", data.data.response);
  },
  async changeRound2({ commit }) {
    const data = await axios.get("json/round2.json");
    commit("CHANGE_ROUND_2", data.data.response);
  },
  async changeRound3({ commit }) {
    const data = await axios.get("json/round3.json");
    commit("CHANGE_ROUND_3", data.data.response);
  },
  async changeSeasonList({ commit }) {
    const data = await axios.get(process.env.API_HOST + "/api/v1/seasons");
    commit("CHANGE_SEASON_LIST", data.data.data.items);
  },
  async changeLeagueList({ commit }) {
    const data = await axios.get(process.env.API_HOST + "/api/v1/leagues");
    commit("CHANGE_LEAGUE_LIST", data.data.data.items);
  },
  async changeCurrentRound({ commit }, payload) {
    // const data = await axios.get(`https://a.efun.tech/api/v1/rounds?filter[league_id]=${payload.leagueId}`)
    const data = await axios.get(
      process.env.API_HOST +
        `/api/v1/rounds?filter[league_id]=${payload.leagueId}&filter[season_id]=${payload.seasionId}`
    );
    commit("CHANGE_CURRENT_ROUND", data.data.data.items);
  },
  async changeCurrentFixtures({ commit }, payload) {
    const data = await axios.get(
      process.env.API_HOST +
        `/api/v1/fixtures?filter[league_id]=${payload.leagueId}&filter[round_id]=${payload.roundId}`
    );
    commit("CHANGE_CURRENT_FIXTURES", data.data.data.items);
  },
  changeCurrentMatches({ commit }, data) {
    const dataParsed = Object.fromEntries(
      Object.entries(data).map(function ([key, value]) {
        try {
          return [key, JSON.parse(value)];
        } catch (error) {
          return [key, value];
        }
      })
    );
    commit("CHANGE_CURRENT_MATCHES", dataParsed);
  },
  changeCurrentMatchesBlockchain({ commit }, data) {
    commit("CHANGE_CURRENT_MATCHES_BLOCKCHAIN", data);
  },
  changeCurrentMatchesBlockchainEfun({ commit }, data) {
    commit("CHANGE_CURRENT_MATCHES_BLOCKCHAIN_EFUN", data);
  },
  changeMatchesDetailLoading({ commit }, boolean) {
    commit("CHANGE_MATCHES_DETAILS_LOADING", boolean);
  },
  changeMatchesLoading({ commit }, boolean) {
    commit("CHANGE_MATCHES_LOADING", boolean);
  },
  changeShowDetail({ commit }, boolean) {
    commit("CHANGE_SHOW_DETAIL", boolean);
  },
  changeYourBet({ commit }, data) {
    commit("CHANGE_YOUR_BET", data);
  },
  changeYourBetEfun({ commit }, data) {
    commit("CHANGE_YOUR_BET_EFUN", data);
  },
  changeLeagueSelected({ commit }, data) {
    commit("CHANGE_LEAGUE_SELECTED", data);
  },
  changeCurrentRoundSelected({ commit }, data) {
    commit("CHANGE_CURRENT_ROUND_SELECTED", data);
  },
  changeHotMatch({ commit }, boolean) {
    commit("CHANGE_HOT_MATCH", boolean);
  },
  async changeHotMatchList({ commit }) {
    const data = await axios.get(process.env.API_HOST + "/api/v1/fixtures/hot");
    commit("CHANGE_HOT_MATCH_LIST", data.data.data.items);
  },
};
export const mutations = {
  CHANGE_ROUND_1(state, data) {
    state.round1 = data;
  },
  CHANGE_ROUND_2(state, data) {
    state.round2 = data;
  },
  CHANGE_ROUND_3(state, data) {
    state.round3 = data;
  },
  CHANGE_LEAGUE_LIST(state, data) {
    state.leagueList = data;
  },
  CHANGE_SEASON_LIST(state, data) {
    state.seasonList = data;
  },
  CHANGE_CURRENT_ROUND(state, data) {
    state.currentRound = data;
  },
  CHANGE_CURRENT_FIXTURES(state, data) {
    state.currentFixtures = data;
  },
  CHANGE_CURRENT_MATCHES(state, data) {
    state.currentMatches = data;
  },
  CHANGE_CURRENT_MATCHES_BLOCKCHAIN(state, data) {
    state.currentMatchesBlockchain = data;
  },
  CHANGE_CURRENT_MATCHES_BLOCKCHAIN_EFUN(state, data) {
    state.currentMatchesBlockchainEfun = data;
  },
  CHANGE_MATCHES_DETAILS_LOADING(state, boolean) {
    state.matchesDetailsLoading = boolean;
  },
  CHANGE_MATCHES_LOADING(state, boolean) {
    state.matchesLoading = boolean;
  },
  CHANGE_SHOW_DETAIL(state, boolean) {
    state.showBetDetail = boolean;
  },
  CHANGE_YOUR_BET(state, data) {
    state.yourBet = data;
  },
  CHANGE_YOUR_BET_EFUN(state, data) {
    state.yourBetEfun = data;
  },
  CHANGE_LEAGUE_SELECTED(state, data) {
    console.log(data, "data");
    state.leagueSelected = data;
  },
  CHANGE_CURRENT_ROUND_SELECTED(state, data) {
    state.currentRoundSelected = data;
  },
  CHANGE_HOT_MATCH(state, boolean) {
    state.hotMatches = boolean;
  },
  CHANGE_HOT_MATCH_LIST(state, data) {
    state.hotMatchList = data;
  },
};
