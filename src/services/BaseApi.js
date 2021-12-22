import axios from "axios";
import PropTypes from "prop-types";
import { store } from "../redux/store";
import { ENVIRONMENT } from "../common/Environment";
import { showAppLoading } from "../redux/reducers/appSlice";
import { getData } from "src/utils/storageUtils";
import { ASYNC_STORAGE_KEYS } from "src/common/constants/Constant";

axios.interceptors.request.use((config) => {
  console.log("request config =================> response: ", config);
  return config;
});
axios.interceptors.response.use(
  (response) => {
    console.log("request success =================> response: ", response);
    return Promise.resolve(response);
  },
  (error) => {
    console.log("request error =================> error: ", error);
    return Promise.reject(error);
  }
);

FETCH.propTypes = {
  phoneNumber: PropTypes.string,
};

function FETCH({
  onSuccess,
  onError,
  url,
  method,
  body,
  params,
  headers = null,
  timeout = 10 * 3600,
  showLoading = false,
  hideLoading,
  showError = false,
}) {
  const language = store.getState().user.language;
  const config = {
    method,
    baseURL: "https://furama.upgo.vn",
    url,
    data: body,
    timeout,
    params: {
      lang: language.id,
      ...params,
    },
  };
  const token = getData(ASYNC_STORAGE_KEYS.TOKEN);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "*/*",
    "SESSION-TOKEN": token,
  };
  if (headers) {
    config.headers = { ...defaultHeaders, ...headers };
  } else {
    config.headers = defaultHeaders;
  }
  showLoading && store.dispatch(showAppLoading(true));
  axios(config)
    .then(function (response) {
      onSuccess && onSuccess(response);
      if (hideLoading === undefined) {
        showLoading && store.dispatch(showAppLoading(false));
      } else {
        hideLoading && store.dispatch(showAppLoading(false));
      }
    })
    .catch(function (error) {
      onError && onError(error.response?.data);
      showError && alert(error.response?.data?.error_message);
      // if (
      //   error.response?.data?.error_code === API_ERROR_CODES.PERMISSION_ERROR
      // ) {
      //   signOut();
      // }
      showLoading && store.dispatch(showAppLoading(false));
    });
}

const GET = (data) => {
  data.method = "get";
  return FETCH(data);
};
const POST = (data) => {
  data.method = "post";
  return FETCH(data);
};
const PUT = (data) => {
  data.method = "put";
  return FETCH(data);
};
const DELETE = (data) => {
  data.method = "delete";
  return FETCH(data);
};

export default { GET, POST, PUT, DELETE };
