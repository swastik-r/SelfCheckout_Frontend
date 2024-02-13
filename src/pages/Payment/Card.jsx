import machineImg from "./card-machine.jpg";
import timerGif from "./timer-gif.gif";
import "./Payment.css";
import { useCartContext } from "../../contexts/CartContext";
import { useStepContext } from "../../contexts/StepContext";

export default function Card() {
   const { handleNext } = useStepContext();
   const { createOrder } = useCartContext();

   return (
      <>
         <span className="paymentHeading">
            <span className="boldText">Insert, Swipe or Tap</span> your{" "}
            <span className="boldText">Credit / Debit Card</span> on the Card
            Machine
         </span>
         <div className="paymentContent">
            <img
               onClick={() => {
                  createOrder();
                  handleNext();
               }}
               className="machineImg"
               src={machineImg}
               alt="Card Machine"
            />
            <img className="timerImg" src={timerGif} alt="Timer" />
         </div>
      </>
   );
}
