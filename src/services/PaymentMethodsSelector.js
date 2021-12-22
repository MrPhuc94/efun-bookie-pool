import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import lodash from "lodash";

import { checkTransaction, paymentTransaction } from "./ApiService";
import VNPayService from "./VNPayService";
import { Colors } from "src/themes/Colors";
import { useSelector } from "react-redux";

export const PAYMENT_METHOD_TYPES = {
  CREDIT_CARD: "CREDIT_CARD",
  ROOM_CHARGE: "ROOM_CHARGE",
  CASH_PAYMENT: "CASH_PAYMENT",
};

const PaymentMethodsSelector = forwardRef((props, ref) => {
  const {
    onChange,
    style,
    onPaySuccess,
    disabledMethods,
    payAgain,
    setPaymentMethod,
    paymentMethod,
    setLoading,
  } = props;

  const paymentMethods = useSelector((state) => state.payment?.paymentMethods);
  const [currentPaymentMethods, setCurrentPaymentMethods] =
    useState(paymentMethods);
  const isProcessingVnPayApp = useRef(false);
  const isCheckingVnPayQuery = useRef(false);
  const vnpParamsRef = useRef({});
  const amountRef = useRef(0);
  // const appState = useRef(AppState.currentState);

  useImperativeHandle(ref, () => ({
    payVnPay,
  }));

  // VNPay

  useEffect((e) => {
    // mở sdk
    //eventEmitter.addListener("PaymentBack", async (e) => {
    if (e) {
      // console.log('e.resultCode = ', JSON.stringify(e));
      switch (e.resultCode) {
        //resultCode == -1
        //vi: Người dùng nhấn back từ sdk để quay lại
        //en: back from sdk (user press back in button title or button back in hardware android)

        //resultCode == 98
        //vi: giao dịch thanh toán bị failed
        //en: payment failed

        //resultCode == 97
        //vi: thanh toán thành công trên webview
        //en: payment success
        case 97:
        //resultCode == 99
        //vi: Người dùng nhấn back từ trang thanh toán thành công khi thanh toán qua thẻ khi gọi đến http://sdk.merchantbackapp
        //en: back from button (button: done, ...) in the webview when payment success. (incase payment with card, atm card, visa ...)
        case 99:
          checkVnpayOrder();
          break;
        //resultCode == 10
        //vi: Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...) lúc này app tích hợp sẽ cần lưu lại cái PNR, khi nào người dùng mở lại app tích hợp thì sẽ gọi kiểm tra trạng thái thanh toán của PNR Đó xem đã thanh toán hay chưa.
        //en: user select app to payment (Mobile banking, wallet ...) you need save your PNR code. because we don't know when app banking payment successfully. so when user re-open your app. you need call api check your PNR code (is paid or unpaid). PNR: it's vnp_TxnRef. Reference code of transaction at Merchant system
        case 10:
          break;
        default:
          break;
      }
    }
  });

  const handleCreateOnlineTransactionError = (error, errMessage) => {
    switch (error?.error_code) {
      case "DUPLICATE_TRANSACTION":
        payAgain && payAgain();
        break;
      case "TRANSACTION_COMPLETED":
        onPaySuccess && onPaySuccess();
        break;
      default:
        //Alert.alert(null, errMessage);
        setLoading(false);
        break;
    }
  };

  const payVnPay = async ({
    amount,
    transactionId,
    onError,
    onSuccess,
    salesorder_info,
  }) => {
    amountRef.current = amount;
    setLoading(true);
    await VNPayService.makeVnPayUrl({
      amount,
      transactionId,
      onSuccess: async ({ vnpUrl, vnpParams }) => {
        vnpParamsRef.current = vnpParams;
        paymentTransaction({
          tran_id: vnpParams.vnp_TxnRef,
          amount: amount * 100,
          salesorder_info: salesorder_info,
          onSuccess: (res) => {
            // console.log('createOnlineTransaction res', res)
            if (res.status === 200) {
              isProcessingVnPayApp.current = true;
              VNPayService.showSdkPaymentView({ vnpUrl });
            } else {
              isProcessingVnPayApp.current = false;
              onError && onError(res.data);
            }
            setLoading(false);
          },
          onError: (err) => {
            isProcessingVnPayApp.current = false;
            onError && onError(err);
            // console.log('createOnlineTransaction err', err)
            isProcessingVnPayApp.current = false;
            setLoading(false);
            handleCreateOnlineTransactionError(
              err,
              "Có lỗi xảy ra khi thanh toán với VN Pay"
            );
          },
        });
      },
      onError: (err) => {
        // console.log('vnpay err', err)
        isProcessingVnPayApp.current = false;
        onError && onError(err);
        setLoading(false);
      },
    });
  };

  const checkVnpayOrder = () => {
    if (isCheckingVnPayQuery.current || !vnpParamsRef.current.vnp_TxnRef) {
      return;
    }
    isCheckingVnPayQuery.current = true;
    setLoading(true);
    setTimeout(async () => {
      checkTransaction({
        tran_id: vnpParamsRef.current.vnp_TxnRef,
        onSuccess: async (res) => {
          // console.log('vnpay check transaction success: ', res.data);
          if (res.data?.payment_data?.vnp_ResponseCode === "00") {
            onPaySuccess && onPaySuccess(true);
          }
          setLoading(false);
          setTimeout(() => {
            isCheckingVnPayQuery.current = false;
          }, 300);
        },
        onError: (err) => {
          // console.log('vnpay check transaction err: ', err);
          setLoading(false);
          setTimeout(() => {
            isCheckingVnPayQuery.current = false;
          }, 300);
        },
      });
    }, 2000);
  };

  const _handleAppStateChange = async (nextAppState) => {
    // if (appState.current.match(/background/) && nextAppState === "active") {
    //   if (isProcessingVnPayApp.current) {
    //     checkVnpayOrder();
    //   }
    // }
    // appState.current = nextAppState;
  };

  useEffect(() => {
    onChange && onChange(lodash.get(currentPaymentMethods, "[0]", []));
  }, []);

  useEffect(() => {
    if (disabledMethods?.length > 0) {
      const enableMethods = lodash.differenceBy(
        paymentMethods,
        disabledMethods,
        "id"
      );

      setCurrentPaymentMethods(Object.assign([], enableMethods));
      if (
        disabledMethods?.findIndex((item) => item.id === paymentMethod?.id) > -1
      ) {
        onChange && onChange(lodash.get(enableMethods, "[0]", []));
      }
    }
  }, [disabledMethods]);

  return <></>;
});

export default PaymentMethodsSelector;
