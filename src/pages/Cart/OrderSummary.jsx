import React from "react";
import { useCartContext } from "../../contexts/CartContext";

export default function OrderSummary() {
   const { orderSummaryVals } = useCartContext();
   // add commas to the numbers
   function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }

   return (
      <div className="cart-summary">
         <div className="summary-item">
            <div className="summary-label">Item Count</div>
            <div className="summary-value">{orderSummaryVals.itemCount}</div>
         </div>
         <div className="summary-item">
            <div className="summary-label">Total Amount</div>
            <div className="summary-value">
               ₹ {numberWithCommas(orderSummaryVals.roundedTotal)}
            </div>
         </div>
         <div className="summary-item">
            <div className="summary-label">Savings</div>
            <div className="summary-value discount-value">
               - ₹ {numberWithCommas(orderSummaryVals.roundedDiscount)}
            </div>
         </div>
         <div className="summary-item">
            <div className="summary-label">GST</div>
            <div className="summary-value">
               ₹ {numberWithCommas(orderSummaryVals.roundedTax)}
            </div>
         </div>
         <hr />
         <div className="summary-item">
            <div className="summary-label">Grand Total</div>
            <div className="summary-value grand-total">
               ₹ {numberWithCommas(orderSummaryVals.roundedGrandTotal)}
            </div>
         </div>
      </div>
   );
}
