import BaseApi from "./BaseApi";

export const GET_HISTORY_RESULTS_PER_PAGE = 20;
export const GET_NOTIFICATIONS_RESULTS_PER_PAGE = 20;
export const POST_RESULTS_PER_PAGE = 20;

export function getAppConfig({ onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/get_app_config",
    showLoading: false,
  };
  return BaseApi.GET(data);
}

export function getListService({
  lang,
  onSuccess,
  onError,
  showLoading = false,
}) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/item_type",
    showLoading: showLoading,
    header: {
      lang,
    },
  };
  return BaseApi.GET(data);
}

export function getServiceCategories(onSuccess, onError, item_type_no) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/item_type/get/categories",
    params: {
      item_type_no,
    },
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function getTourCategories(onSuccess, onError) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/tour_category",
  };
  return BaseApi.GET(data);
}

export function getServiceProviders(onSuccess, onError, item_type_no) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/item_type/get/providers",
    params: {
      item_type_no,
    },
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function getPosts({ onSuccess, onError, page }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/post",
    params: {
      page,
      results_per_page: POST_RESULTS_PER_PAGE,
    },
    showLoading: false,
  };
  return BaseApi.GET(data);
}

export function getTopping(onSuccess, onError, item_id) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/item/get/topping",
    params: {
      item_id,
    },
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function getLaundryMethod(onSuccess, onError, item_id) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/item/get/method",
    params: {
      item_id,
    },
    showLoading: false,
  };
  return BaseApi.GET(data);
}

export function getTourDetail(onSuccess, onError, id) {
  const data = {
    onSuccess,
    onError,
    url: `/api/v1/tour/${id}`,
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function checkTourOrder(onSuccess, onError, tour_id) {
  const data = {
    onSuccess,
    onError,
    url: `/api/v1/tour/check_order`,
    params: {
      tour_id,
    },
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function postSalesorder({ body, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/app/v1/salesorder",
    showLoading: true,
    body,
  };
  return BaseApi.POST(data);
}

export function getHistory(page, onSuccess, onError, showLoading = true) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/salesorder/get/history",
    params: {
      results_per_page: GET_HISTORY_RESULTS_PER_PAGE,
      page,
    },
    showLoading,
  };
  return BaseApi.GET(data);
}

export function saveFirebaseToken({ token, sessionToken, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/notification/save_token",
    body: {
      token,
    },
    headers: {
      "SESSION-TOKEN": sessionToken,
    },
    showLoading: false,
  };
  return BaseApi.POST(data);
}

export function getNotifications(page, onSuccess, onError, showLoading) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/notification/get/target",
    showLoading: showLoading,
    params: {
      notify_target: "furama_app",
      results_per_page: GET_NOTIFICATIONS_RESULTS_PER_PAGE,
      page,
    },
  };
  return BaseApi.GET(data);
}

export function postFeedBack({
  onSuccess,
  onError,
  feedback_items,
  description,
  vote,
}) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/feedback/post",
    body: {
      description,
      feedback_items,
      vote,
    },
    showLoading: true,
  };
  return BaseApi.POST(data);
}

export function getFeedBack(onSuccess, onError) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/feedback/get",
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function getItemDetail({ id, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "api/v1/item/item_detail",
    showLoading: true,
    params: {
      id,
    },
  };
  return BaseApi.GET(data);
}

export function getContactDetail({ onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "api/app/v1/contact/detail",
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function loginRoom({ contact_firstname, room_no, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/v1/contact_visit/login_room",
    showLoading: true,
    body: {
      room_no,
      contact_firstname,
    },
  };
  return BaseApi.POST(data);
}

export function postMakeUpRoom({ body, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/app/v1/contact/make_up_room",
    showLoading: true,
    body,
  };
  return BaseApi.POST(data);
}

export function postPrivacyMode({
  do_not_disturb,
  start_time,
  end_time,
  note,
  onSuccess,
  onError,
}) {
  const data = {
    onSuccess,
    onError,
    url: "/api/app/v1/contact/do_not_disturb",
    showLoading: false,
    body: {
      start_time,
      do_not_disturb,
      end_time,
      note,
    },
  };
  return BaseApi.POST(data);
}

export function postContactTurnDown({
  turn_down,
  start_time,
  end_time,
  onSuccess,
  onError,
}) {
  const data = {
    onSuccess,
    onError,
    url: "api/app/v1/contact/turn_down",
    showLoading: false,
    body: {
      start_time,
      turn_down,
      end_time,
    },
  };
  return BaseApi.POST(data);
}

export function postDefectsPest({ items, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "api/app/v1/contact/defects_pest",
    showLoading: true,
    body: {
      items,
    },
  };
  return BaseApi.POST(data);
}

export function cancelOrder({ id, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "api/app/salesorder/user_cancel_order",
    showLoading: true,
    body: {
      id,
      sostatus: "user_cancelled",
    },
  };
  return BaseApi.POST(data);
}

export function checkOrder({ body, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/app/v1/check_order",
    showLoading: true,
    body,
  };
  return BaseApi.POST(data);
}

export function paymentTransaction({
  tran_id,
  amount,
  salesorder_info,
  onSuccess,
  onError,
}) {
  const data = {
    onSuccess,
    onError,
    url: "/api/app/v1/payment_transaction",
    showLoading: true,
    body: {
      tran_id,
      salesorder_info,
      amount,
      payment_type: "order_payment",
    },
  };
  return BaseApi.POST(data);
}

export function getVnPayReturnUrl({ onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/payment_gateway/vnpay/api/return_url",
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function checkTransaction({ tran_id, onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/payment_gateway/vnpay/api/transaction",
    showLoading: true,
    params: {
      tran_id,
    },
  };
  return BaseApi.GET(data);
}

export function getPaymentMethods({ onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/app/v1/payment_methods",
    showLoading: true,
  };
  return BaseApi.GET(data);
}

export function logout({ onSuccess, onError }) {
  const data = {
    onSuccess,
    onError,
    url: "/api/app/v1/contact_visit/log_out",
    showLoading: false,
  };
  return BaseApi.GET(data);
}
