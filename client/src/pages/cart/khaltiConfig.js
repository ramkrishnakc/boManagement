import myKey from "./khaltiKey";
import axios from "axios";

const getConfig = ({ successHandler }) => {
  return {
    /* Replace this key with yours */
    publicKey: myKey.publicTestKey,
    productIdentity: "1237666",
    productName: "My Book Store",
    productUrl: "http://localhost:3000",
    eventHandler: {
      onSuccess(payload) {
        /* Hit merchant api for initiating verfication */
        console.log(payload);
        // const data = {
        //   token: payload.token,
        //   amount: payload.amount,
        // };

        axios
          .get
          // `https://meslaforum.herokuapp.com/khalti/${data.token}/${data.amount}/${myKey.secretKey}`
          ()
          .then((response) => {
            console.log(response.data);
            alert("Thank you for generosity");
            // Run this function on Successful payment
            successHandler();
          })
          .catch((error) => {
            console.log(error);
          });
      },
      // onError handler is optional
      onError(error) {
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
};

export default getConfig;
