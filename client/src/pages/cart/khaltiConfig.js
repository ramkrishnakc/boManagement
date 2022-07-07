import myKey from "./khaltiKey";
import axios from "axios";

const config = {
  // replace this key with yours
  publicKey: myKey.publicTestKey,
  productIdentity: "1237666",
  productName: "My Book Store",
  productUrl: "http://localhost:3000",
  eventHandler: {
    onSuccess(payload) {
      // hit merchant api for initiating verfication
      console.log(payload);
      const data = {
        token: payload.token,
        amount: payload.amount,
      };

      axios
        .get
        // `https://meslaforum.herokuapp.com/khalti/${data.token}/${data.amount}/${myKey.secretKey}`
        ()
        .then((response) => {
          console.log(response.data);
          alert("Thank you for generosity");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // onError handler is optional
    onError(error) {
      // handle errors
      console.log(error);
    },
    onClose() {
      console.log("widget is closing");
    },
  },
  paymentPreference: [
    "KHALTI",
    "EBANKING",
    "MOBILE_BANKING",
    "CONNECT_IPS",
    "SCT",
  ],
};

export default config;
