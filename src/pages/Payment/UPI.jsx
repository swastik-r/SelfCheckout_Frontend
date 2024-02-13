import upiQr from "./upi-qr.png";
import timerGif from "./timer-gif.gif";
import "./Payment.css";
import { useStepContext } from "../../contexts/StepContext";
import { useCartContext } from "../../contexts/CartContext";

export default function Card() {
   const { handleNext } = useStepContext();
   const { createOrder } = useCartContext();

   return (
      <>
         <span className="paymentHeading">
            <span className="boldText">Scan </span> the{" "}
            <span className="boldText">QR Code</span> and complete the payment
         </span>
         <div className="paymentContent">
            <img
               onClick={() => {
                  createOrder();
                  handleNext();
               }}
               className="machineImg"
               src={upiQr}
               alt="UPI QR"
            />
            <img className="timerImg" src={timerGif} alt="Timer" />
         </div>
      </>
   );
}
