import MessageModal from "src/containers/Message/MessageModal";
import { showAppPopup } from "src/redux/reducers/appSlice";
import { store } from "src/redux/store";
import { saveFirebaseToken } from "./ApiService";
import { REMOTE_NOTIFICATION_TYPES } from "src/common/constants/Constant";
import "./firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const _getToken = (sessionToken) => {
  const token = store.getState().user.token;
  const messaging = getMessaging();
  console.log("tokenJWT", sessionToken);
  if (sessionToken || token) {
    getToken(messaging, {
      vapidKey:
        "BJ7jwA4UnRIG29TFCgyhnM6zp5WjunPuafIVAs12qmFreI8I9tNB4HB1yRkey8hJAVKx1HqCSzrRcHjhv1mNfBg",
    })
      .then((fcmToken) => {
        console.log("fcmToken", fcmToken);
        if (fcmToken) {
          saveFirebaseToken({
            token: fcmToken,
            sessionToken: sessionToken || token,
            onSuccess: (res) => {
              console.log("saveFirebaseToken", res);
            },
            onError: (err) => {
              // console.log('saveFirebaseToken err', err)
            },
          });
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }
};

const sendTokenToServer = (token) => {
  saveFirebaseToken({
    token,
    onSuccess: (res) => {
      console.log("saveFirebaseToken", res);
    },
    onError: (err) => {
      console.log("saveFirebaseToken err", err);
    },
  });
};

const handelRemoteMessage = (remoteMessage) => {
  console.log("remoteMessage =============>", remoteMessage);
  switch (remoteMessage?.data?.type) {
    // case REMOTE_NOTIFICATION_TYPES.has_saleorder_change:
    //   refreshNotifications();
    //   // showNotificationPopup({data: remoteMessage?.data});
    //   break;
    case REMOTE_NOTIFICATION_TYPES.NORMAL:
      store.dispatch(showAppPopup(<MessageModal data={remoteMessage?.data} />));
      break;
    default:
      break;
  }
};

export const registerNotificationEvents = () => {
  const messaging = getMessaging();
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // ...
    handelRemoteMessage(payload);
  });
};
