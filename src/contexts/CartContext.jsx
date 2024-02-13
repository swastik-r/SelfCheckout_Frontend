import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BagImg from "../assets/carryBag.png";
import { useAuthContext } from "./AuthContext";

const CartContext = createContext();

export function useCartContext() {
   return useContext(CartContext);
}

export default function CartProvider({ children }) {
   const { user } = useAuthContext();

   // Initial Values
   const [cartItems, setCartItems] = useState([]);
   const [showPaymentOpts, setShowPaymentOpts] = useState(false);
   const [recieveInvoiceOpts, setRecieveInvoiceOpts] = useState([]);
   const [paymentMethod, setPaymentMethod] = useState(null);
   const [emptyCart, setEmptyCart] = useState(true);
   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
   const [pointsRedeemed, setPointsRedeemed] = useState(false);
   const [forgotCarryBag, setForgotCarryBag] = useState(true);
   const [paymentInitiated, setPaymentInitiated] = useState(false);
   const [orderSummaryVals, setOrderSummaryVals] = useState({
      itemCount: 0,
      roundedDiscount: 0,
      roundedTotal: 0,
      roundedTax: 0,
      roundedGrandTotal: 0,
   });
   const [carryBagData, setCarryBagData] = useState([
      {
         product_brand: "KPMG Retail",
         product_name: "Carry Bag (Small)",
         product_image: BagImg,
         product_category: "Miscellaneous",
         quantity: 0,
         tax_rate: 0,
         mrp: 5,
         selling_price: 5,
         width: "120px",
      },
      {
         product_brand: "KPMG Retail",
         product_name: "Carry Bag (Medium)",
         product_image: BagImg,
         product_category: "Miscellaneous",
         quantity: 0,
         tax_rate: 0,
         mrp: 10,
         selling_price: 10,
         width: "200px",
      },
      {
         product_brand: "KPMG Retail",
         product_name: "Carry Bag (Large)",
         product_image: BagImg,
         product_category: "Miscellaneous",
         quantity: 0,
         tax_rate: 0,
         mrp: 15,
         selling_price: 15,
         width: "250px",
      },
   ]);

   // Fetch Cart Items
   function fetchCartItems() {
      axios
         .get("http://localhost:8081/products/allProducts")
         .then((response) => {
            const data = response.data;
            data.forEach((item) => {
               item.quantity = 1;
            });
            setCartItems(data.sort(() => Math.random() - 0.5));
         })
         .catch((error) => {
            console.error("Error fetching data: ", error.message);
         });
   }

   // Create Order
   function createOrder() {
      // Simplify Cart Items for Order Creation
      const simplifiedCartItems = cartItems.map((item) => ({
         productId: item.product_serial,
         productFullName: item.product_brand + " " + item.product_name,
         quantity: item.quantity,
         mrp: item.mrp,
         price: item.selling_price,
      }));

      console.log("Data being sent to create order:");
      console.log(
         user.id,
         user.mobileNumber,
         paymentMethod,
         simplifiedCartItems
      );

      // Create Order by posting the data to the backend
      axios
         .post("http://localhost:8082/transactions/create", {
            userId: user.id,
            encryptedMobile: user.mobileNumber,

            paymentId: 12345678,
            paymentMethod: paymentMethod,
            paymentStatus: "Successful",
            errorMessage: "NA",

            orderItems: simplifiedCartItems,
         })
         .then(() => {
            const recieveInvoiceOpts2 = recieveInvoiceOpts.join(" and ");
            toast.success(
               `Order has been created successfully! Invoice sent via ${recieveInvoiceOpts2}.`
            );
            toast(
               "Your order invoice is being printed. Please show it while exiting the store."
            );
         })
         .catch((error) => {
            console.error("Error creating order: ", error.message);
         });

      // Update stock in inventory on successfully placing an order
      // axios
      //    .post("http://localhost:8081/inventory/reduce", simplifiedCartItems)
      //    .then((response) => {
      //       console.log("Inventory has been updated.");
      //    })
      //    .catch((error) => {
      //       console.error("Error updating inventory: ", error.message);
      //    });

      // Deduct the redeemed points from the user's loyalty points
      const pointsEarned = (orderSummaryVals.roundedGrandTotal / 20).toFixed(0);

      axios
         .post("http://localhost:8080/users/updateLp", {
            userId: user.id,
            pointsEarned: pointsEarned,
            hasRedeemed: pointsRedeemed,
         })
         .then(() => {
            console.log("Loyalty Points have been updated.");
         });
   }

   // Handle Item Addition
   function handleAddItem(item) {
      const updatedCart = [...cartItems];
      const updatedItemIndex = updatedCart.findIndex(
         (cartItem) => cartItem.product_serial === item.product_serial
      );
      // If item does not exist in Cart Items, add it
      if (updatedItemIndex < 0) {
         updatedCart.push({ ...item, quantity: 1 });
         toast.success(
            `${item.product_brand} ${item.product_name} added to cart`
         );
         // If item already exists, increment the quantity
      } else {
         const updatedItem = {
            ...updatedCart[updatedItemIndex],
         };
         updatedItem.quantity++;
         updatedCart[updatedItemIndex] = updatedItem;
      }
      setCartItems(updatedCart);
   }

   // Handle Item Deletion
   function handleDeleteItem(item) {
      const updatedCart = cartItems.filter(
         (cartItem) => cartItem.product_serial !== item.product_serial
      );
      setCartItems(updatedCart);
      toast.success(
         `${item.product_brand} ${item.product_name} removed from cart`
      );
   }

   function handleAddCarryBag(item) {
      const updatedCart = [...cartItems];
      const updatedItemIndex = updatedCart.findIndex(
         (cartItem) => cartItem.product_name === item.product_name
      );

      // If item does not exist in Cart Items, add it
      if (updatedItemIndex < 0) {
         updatedCart.push({ ...item, quantity: 1 });
      } else {
         const updatedItem = {
            ...updatedCart[updatedItemIndex],
         };
         updatedItem.quantity++;
         updatedCart[updatedItemIndex] = updatedItem;
      }
      // Update the quantity of the carry bag in carryBagData
      const updatedCarryBagData = carryBagData.map((bag) =>
         bag.product_name === item.product_name
            ? { ...bag, quantity: bag.quantity + 1 }
            : bag
      );
      setCarryBagData(updatedCarryBagData);
      // Update the cart items
      setCartItems(updatedCart);
   }

   function handleDeleteCarryBag(item) {
      const updatedCart = cartItems.filter(
         (cartItem) => cartItem.product_name !== item.product_name
      );
      setCartItems(updatedCart);

      const updatedCarryBagData = carryBagData.map((bag) =>
         bag.product_name === item.product_name ? { ...bag, quantity: 0 } : bag
      );
      setCarryBagData(updatedCarryBagData);
   }

   // Highlights the selected "Recieve Invoice" options
   function handleButtonClick(option) {
      if (option === "Both") {
         // If "Both" button is clicked, set recieveInvoiceOpts to an array containing both options
         if (recieveInvoiceOpts.length === 2) {
            // If both options are already selected, remove both options
            setRecieveInvoiceOpts([]);
         } else {
            // If not, add both options
            setRecieveInvoiceOpts(["WhatsApp", "SMS"]);
         }
      } else {
         // If any other button is clicked, toggle the option in the array
         setRecieveInvoiceOpts((prevOptions) => {
            if (prevOptions.includes(option)) {
               return prevOptions.filter((opt) => opt !== option);
            } else {
               return [...prevOptions, option];
            }
         });
      }
   }

   // Increment Quantity
   function incrementQuantity(product_serial) {
      const updatedCart = cartItems.map((item) =>
         item.product_serial === product_serial
            ? { ...item, quantity: item.quantity + 1 }
            : item
      );
      setCartItems(updatedCart);
   }

   // Decrement Quantity
   function decrementQuantity(product_serial) {
      const updatedCart = cartItems
         .map((item) =>
            item.product_serial === product_serial
               ? { ...item, quantity: item.quantity - 1 }
               : item
         )
         .filter((item) => item.quantity > 0);
      setCartItems(updatedCart);
   }

   // Redeem Points
   function redeemPoints(points) {
      const updatedOrderSummaryVals = { ...orderSummaryVals };
      updatedOrderSummaryVals.roundedGrandTotal -= points;
      setOrderSummaryVals(updatedOrderSummaryVals);

      if (points > 0) {
         toast.success(
            `You have successfully redeemed ${points} loyalty points.`
         );
      } else {
         toast.warning(`${points * -1} loyalty points reverted back.`);
      }
   }

   // useEffect: Cart Items
   useEffect(() => {
      // Update EmptyCart state on any change in cartItems
      setEmptyCart(cartItems.length === 0);

      // Update the forgotCarryBag state to false if any of the carry bags are present in the cart
      setForgotCarryBag(
         cartItems.every((item) => item.product_category !== "Miscellaneous")
      );

      // Updating Order Summary Values
      const total = cartItems.reduce(
         (acc, item) => acc + item.selling_price * item.quantity,
         0
      );

      // Calculate Tax using the Category table
      const tax = cartItems.reduce(
         (acc, item) =>
            acc + (item.selling_price * item.quantity * item.tax_rate) / 100,
         0
      );

      // Calculate the discounts using mrp - price
      const discount = cartItems.reduce(
         (acc, item) => acc + (item.mrp - item.selling_price) * item.quantity,
         0
      );

      // Calculate the grand total
      const grandTotal = total + tax - discount;

      // Update only roundedGrandTotal state
      setOrderSummaryVals({
         itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
         roundedDiscount: Number(discount.toFixed(2)),
         roundedTotal: Number(total.toFixed(2)),
         roundedTax: Number(tax.toFixed(2)),
         roundedGrandTotal: Number(grandTotal.toFixed(2)),
      });

      console.log(cartItems);
   }, [cartItems]);

   // Context Value
   const contextValue = {
      // Cart Items
      emptyCart,
      setEmptyCart,

      cartItems,
      setCartItems,

      carryBagData,
      setCarryBagData,

      showConfirmDelete,
      setShowConfirmDelete,

      forgotCarryBag,
      setForgotCarryBag,

      // Cart Item Functions
      handleAddItem,
      handleDeleteItem,
      handleAddCarryBag,
      handleDeleteCarryBag,
      handleButtonClick,
      incrementQuantity,
      decrementQuantity,
      fetchCartItems,

      // Cart Summary and Loyalty Points
      orderSummaryVals,

      redeemPoints,
      pointsRedeemed,
      setPointsRedeemed,

      // Payment Options & Invoice Methods
      paymentInitiated,
      setPaymentInitiated,

      showPaymentOpts,
      setShowPaymentOpts,

      paymentMethod,
      setPaymentMethod,

      recieveInvoiceOpts,
      setRecieveInvoiceOpts,

      // Order Creation Function
      createOrder,
   };

   return (
      <CartContext.Provider value={contextValue}>
         {children}
      </CartContext.Provider>
   );
}
