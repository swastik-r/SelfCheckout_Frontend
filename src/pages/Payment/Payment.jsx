import UPI from "./UPI";
import Card from "./Card";
import { useCartContext } from "../../contexts/CartContext";
import { useStepContext } from "../../contexts/StepContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState } from "react";
import OrderSummary from "../Cart/OrderSummary";
import "./Payment.css";

export default function Payment() {
   const {
      paymentMethod,
      pointsRedeemed,
      setPointsRedeemed,
      redeemPoints,
      orderSummaryVals,
   } = useCartContext();
   const [paymentInitiated, setPaymentInitiated] = useState(false);

   // Handle the points validation
   function handleRedeemPoints(points) {
      setPointsRedeemed(!pointsRedeemed);
      if (pointsRedeemed) {
         redeemPoints(points * -1);
      } else {
         redeemPoints(points);
      }
   }

   return (
      <>
         <div className="cart-container">
            <div className="payment-left">
               {paymentMethod === "UPI" && paymentInitiated ? (
                  <UPI />
               ) : paymentMethod === "Debit/Credit Card" && paymentInitiated ? (
                  <Card />
               ) : (
                  <>
                     <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                        Cart Summary
                     </span>
                     <span style={{ fontSize: "1.2em" }}>
                        You will earn{" "}
                        <span
                           style={{ color: "rgb(0,0,255)", fontWeight: "bold" }}
                        >
                           {(orderSummaryVals.roundedGrandTotal / 20).toFixed(
                              0
                           )}
                        </span>{" "}
                        Loyalty Points on this purchase
                     </span>
                     <OrderSummary />
                     <LPRedemption
                        pointsRedeemed={pointsRedeemed}
                        handleRedeemPoints={handleRedeemPoints}
                     />
                  </>
               )}
            </div>
            <div className="payment-right">
               <PaymentOpts
                  pointsRedeemed={pointsRedeemed}
                  handleRedeemPoints={handleRedeemPoints}
                  paymentInitiated={paymentInitiated}
                  setPaymentInitiated={setPaymentInitiated}
               />
            </div>
         </div>
      </>
   );
}

function PaymentOpts({
   pointsRedeemed,
   handleRedeemPoints,
   paymentInitiated,
   setPaymentInitiated,
}) {
   const { orderSummaryVals, setPaymentMethod, paymentMethod } =
      useCartContext();
   const { handlePrev } = useStepContext();
   const { user } = useAuthContext();
   const paymentOpts = [
      {
         name: "Debit/Credit Card",
         offer: "Additional 10% off on your purchase",
         disabled: false,
      },
      {
         name: "UPI",
         offer: "Get flat 5% discount on your purchase",
         disabled: false,
      },
      {
         name: "Gift Card",
         offer: "Earn 200 Reward Points on your purchase",
         disabled: true,
      },
   ];

   return (
      <>
         <div className="payment-opts">
            {/* Show Grand Total */}
            <span style={{ fontSize: "25px" }}>
               To Pay:{" "}
               <span style={{ fontWeight: "600" }}>
                  {/* add commas */}₹ {orderSummaryVals.roundedGrandTotal}
               </span>
            </span>

            {/* Map the payment options */}
            {paymentOpts.map((opt) => (
               <PayOptTile
                  key={opt.name}
                  opt={opt}
                  isSelected={paymentMethod === opt.name}
                  onClick={() => setPaymentMethod(opt.name)}
                  disabled={opt.disabled || paymentInitiated}
               />
            ))}
            <div>
               <button
                  style={{ margin: "10px" }}
                  onClick={() => {
                     if (pointsRedeemed) {
                        handleRedeemPoints(user.loyaltyPoints);
                     }
                     handlePrev();
                  }}
                  disabled={paymentInitiated}
               >
                  Back to Cart
               </button>
               <button
                  style={{ margin: "10px" }}
                  onClick={() => setPaymentInitiated(true)}
                  disabled={!paymentMethod || paymentInitiated}
               >
                  Proceed to Pay
               </button>
            </div>
         </div>
      </>
   );
}

function PayOptTile({ opt, isSelected, onClick, disabled }) {
   return (
      <label
         className={`pay-opt-button ${isSelected ? "highlighted slow" : ""}`}
         style={{
            opacity: disabled ? "0.5" : "1",
            cursor: disabled ? "not-allowed" : "pointer",
         }}
      >
         <input
            type="radio"
            name="paymentOption"
            value={opt.name}
            checked={isSelected}
            onChange={onClick}
            style={{ display: "none" }}
            disabled={disabled}
         />
         <span style={{ fontSize: "17px", fontWeight: "600" }}>{opt.name}</span>
         {/* {!isSelected && (
            <span
               style={{
                  color: "black",
                  fontSize: "13px",
                  textAlign: "center",
               }}
            >
               {offer}
            </span>
         )} */}
      </label>
   );
}

function LPRedemption({ pointsRedeemed, handleRedeemPoints }) {
   const { user } = useAuthContext();

   return (
      <div className="lp-redemption-container">
         <div className="lp-details">
            <span>
               Loyalty Points Available: <strong>{user.loyaltyPoints}</strong>
            </span>
            <span style={{ color: "grey" }}>1 Loyalty Point = ₹ 1 </span>
         </div>
         <button
            className={`redeem-button ${pointsRedeemed ? "cancel" : "redeem"}`}
            onClick={() => {
               handleRedeemPoints(user.loyaltyPoints);
            }}
            disabled={user.loyaltyPoints === 0}
         >
            {pointsRedeemed ? "Cancel Redemption" : "Redeem Loyalty Points"}
         </button>
      </div>
   );
}
