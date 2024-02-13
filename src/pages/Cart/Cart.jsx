import "./cartStyles.css";
import CartImg from "./cartImg.gif";
import BagImg from "../../assets/carryBag.png";
import { BsFillBagPlusFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { RiArrowDownSLine } from "react-icons/ri";
import { useStepContext } from "../../contexts/StepContext";
import { useCartContext } from "../../contexts/CartContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState, useRef } from "react";
import OrderSummary from "./OrderSummary";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineSms } from "react-icons/md";

export default function Cart() {
   const { emptyCart, fetchCartItems, cartItems, handleDeleteItem } =
      useCartContext();
   const { user } = useAuthContext();
   const [openCarryBag, setOpenCarryBag] = useState(false);

   // Handle down arrow button click to scroll
   const itemListRef = useRef(null);
   function handleArrowDownClick() {
      if (itemListRef.current) {
         itemListRef.current.scrollTop += 400;
      }
   }

   // Item Deletion Pop-up
   const [itemToDelete, setItemToDelete] = useState(null);
   function showConfirmDeletePopup(item) {
      setItemToDelete(item);
   }

   // Show Image of the Product and its details
   const [showDetailsItem, setShowDetailsItem] = useState(null);
   function handleShowDetails(item) {
      setShowDetailsItem(item);
   }

   return (
      <>
         <div className="cart-container">
            {/* Confirm Delete Pop-up */}
            {itemToDelete && (
               <ConfirmDeleteItem
                  item={itemToDelete}
                  handleDeleteItem={handleDeleteItem}
                  setItemToDelete={setItemToDelete}
               />
            )}

            {/* Show Product Details */}
            {showDetailsItem && (
               <ShowDetails
                  item={showDetailsItem}
                  setShowDetailsItem={setShowDetailsItem}
               />
            )}

            {/* Show MMRP Pop-up */}
            {/* {showMMRP && <MMRPInput setShowMMRP={setShowMMRP} />} */}
            <MMRPInput />

            {/* Carry Bag Pop-up */}
            {openCarryBag && (
               <CarryBagPopup setOpenCarryBag={setOpenCarryBag} />
            )}

            <div className={"cart-left" + (emptyCart ? " empty" : "")}>
               {/* List of Cart Items */}
               <div className="item-list" ref={itemListRef}>
                  {cartItems.map((item) => (
                     <ProductTile
                        key={item.product_serial}
                        item={item}
                        showConfirmDelete={showConfirmDeletePopup}
                        handleShowDetails={handleShowDetails}
                     />
                  ))}

                  {cartItems.length > 5 && (
                     <div
                        className="down-arrow-container"
                        onClick={handleArrowDownClick}
                     >
                        <RiArrowDownSLine className="down-arrow-icon" />
                     </div>
                  )}
               </div>

               {/* Empty Cart Display*/}
               {emptyCart && (
                  <div className="empty-cart" onClick={fetchCartItems}>
                     <span style={{ fontSize: "27px" }}>
                        Welcome {user.name}
                     </span>
                     <span>
                        to the Self-Checkout Kiosk @{" "}
                        <span style={{ fontWeight: "600" }}>
                           KPMG Retail, CyberHub
                        </span>
                     </span>
                     <img
                        style={{ height: "70%" }}
                        src={CartImg}
                        alt="add-to-basket"
                     />
                     <span>
                        Your cart is <b>empty</b>. Please <b>scan</b> your items
                        to add them here.
                     </span>
                  </div>
               )}
            </div>

            {/* Cart Summary */}
            <div className="cart-right">
               <OrderDetails setOpenCarryBag={setOpenCarryBag} />
            </div>
         </div>
      </>
   );
}

// Cart Components

function ProductTile({ item, showConfirmDelete, handleShowDetails }) {
   return (
      <>
         <div className="product-tile">
            {/* Item's Product Image */}
            <div className="detail-1" onClick={() => handleShowDetails(item)}>
               <img src={item.product_image} alt="product-image" />
            </div>

            {/* Item's Brand Name and Product Name */}
            <div className="detail-3">
               <div>
                  <div className="brand-name">{item.product_brand}</div>
                  {/* Product Name with Quantity for bags */}
                  <div className="product-name">{item.product_name}</div>
               </div>

               {/* Carry Bag count */}
               {item.product_category === "Miscellaneous" && (
                  <div className="cb-count">
                     COUNT <b>{item.quantity}</b>
                  </div>
               )}

               {/* Item's Serial Number */}
               {item.product_category !== "Miscellaneous" && (
                  <div className="product-serial">
                     UPC <b>{item.product_serial}</b>
                  </div>
               )}
            </div>

            {/* Item's Price and Discount */}
            <div className="detail-4">
               <div className="product-price">₹ {item.selling_price}</div>
               {item.mrp - item.selling_price > 0 && (
                  <div style={{ display: "flex" }}>
                     <div className="mrp">₹ {item.mrp}</div>
                     <div className="discount">
                        {Math.trunc(
                           ((item.mrp - item.selling_price) * 100) / item.mrp
                        )}
                        % OFF
                     </div>
                  </div>
               )}
            </div>

            {/* Delete Item */}
            <div className="detail-6">
               <button
                  className="delete-button"
                  onClick={() => showConfirmDelete(item)}
               >
                  ╳
               </button>
            </div>
         </div>
      </>
   );
}

function OrderDetails({ setOpenCarryBag }) {
   const { emptyCart, recieveInvoiceOpts, handleButtonClick, forgotCarryBag } =
      useCartContext();
   const { handleNext } = useStepContext();

   return (
      <>
         <OrderSummary />
         <div className="misc-div">
            <span style={{ fontWeight: "500", fontSize: "large" }}>
               Please click here to add a carry bag
            </span>
            <button
               disabled={emptyCart}
               className="notif-button"
               onClick={() => {
                  setOpenCarryBag(true);
               }}
            >
               <div
                  style={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                  }}
               >
                  <BsFillBagPlusFill size={30} />
                  <span style={{ marginLeft: "10px" }}>Add Carry Bag</span>
               </div>
            </button>
         </div>

         {/* INVOICE RECEIVING OPTIONS */}
         <div className="misc-div">
            <span style={{ fontWeight: "500", fontSize: "large" }}>
               Recieve invoice on:
            </span>
            <div className="notif-buttons-1">
               <button
                  disabled={emptyCart}
                  className={`notif-button ${
                     recieveInvoiceOpts.includes("WhatsApp") && "selected"
                  }`}
                  onClick={() => handleButtonClick("WhatsApp")}
               >
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                     }}
                  >
                     <FaWhatsapp size={30} />
                     <span style={{ marginLeft: "10px" }}>WhatsApp</span>
                  </div>
               </button>
               <button
                  disabled={emptyCart}
                  className={`notif-button ${
                     recieveInvoiceOpts.includes("SMS") && "selected"
                  }`}
                  onClick={() => handleButtonClick("SMS")}
               >
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                     }}
                  >
                     <MdOutlineSms size={30} />
                     <span style={{ marginLeft: "10px" }}>SMS</span>
                  </div>
               </button>
            </div>
            <div className="notif-buttons-2">
               <button
                  disabled={emptyCart}
                  className={`notif-button ${
                     recieveInvoiceOpts.includes("WhatsApp") &&
                     recieveInvoiceOpts.includes("SMS") &&
                     recieveInvoiceOpts.length === 2 &&
                     "selected"
                  }`}
                  onClick={() => handleButtonClick("Both")}
               >
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                     }}
                  >
                     <span style={{ marginRight: "10px" }}>Both</span>
                     <FaWhatsapp size={30} />
                     <span style={{ margin: "0 10px" }}>and</span>
                     <MdOutlineSms size={30} />
                  </div>
               </button>
            </div>
         </div>

         <button
            disabled={emptyCart || !recieveInvoiceOpts.length}
            style={{
               display: "flex",
               justifyItems: "space-evenly",
               alignItems: "center",
               outline: "none",
            }}
            onClick={() => {
               if (forgotCarryBag) {
                  setOpenCarryBag(true);
               } else {
                  handleNext();
               }
            }}
         >
            Select a Payment Method
         </button>
      </>
   );
}

// Miscellaneous Components

function CarryBagPopup({ setOpenCarryBag }) {
   const {
      carryBagData,
      handleAddCarryBag,
      handleDeleteCarryBag,
      handleAddItem,
      forgotCarryBag,
      recieveInvoiceOpts,
   } = useCartContext();
   const { handleNext } = useStepContext();

   function CarryBag({ bag }) {
      return (
         <div className="carry-bag-item">
            {/* Bag image */}
            <img src={BagImg} style={{ height: bag.width }} />

            {/* Carry Bag quantity in cart */}
            <span style={{ fontSize: "large", fontWeight: "bold" }}>
               {bag.quantity}
            </span>

            {/* Buttons for quantity control */}
            <div style={{ display: "flex", justifyContent: "center" }}>
               <button
                  className="quantButton"
                  onClick={() => {
                     handleAddCarryBag(bag);
                  }}
               >
                  +
               </button>
               <button
                  className="quantButton"
                  onClick={() => {
                     handleDeleteCarryBag(bag);
                  }}
               >
                  Remove All
               </button>
            </div>

            {/* Bag details */}
            <span style={{ fontSize: "25px" }}>
               <b>{bag.product_name}</b>
            </span>
            <span>
               <b>₹{bag.selling_price}</b> each
            </span>
         </div>
      );
   }

   return (
      <div className="popupContainer" onClick={() => setOpenCarryBag(false)}>
         <div
            className="popup-outer"
            onClick={(event) => event.stopPropagation()}
         >
            <div className="popup-inner">
               <div className="header-items">
                  <span className="carry-bag-title">
                     {forgotCarryBag
                        ? "Forgot to add carry bags?"
                        : "Need carry bags?"}
                  </span>
                  <RxCross1 size={30} onClick={() => setOpenCarryBag(false)} />
               </div>
               <div className="carry-bag-allItems">
                  {carryBagData.map((bag) => (
                     <CarryBag
                        key={bag.product_name}
                        bag={bag}
                        handleAddItem={handleAddItem}
                     />
                  ))}
               </div>
               <div className="carry-bag-buttons">
                  <button
                     disabled={recieveInvoiceOpts.length === 0}
                     onClick={() => {
                        setOpenCarryBag(false);
                        handleNext();
                     }}
                  >
                     {forgotCarryBag ? "Skip" : "Select a Payment Method"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

function ConfirmDeleteItem({ item, setItemToDelete }) {
   const { handleDeleteItem, handleDeleteCarryBag } = useCartContext();

   return (
      <div
         className="popupContainer slow"
         onClick={() => setItemToDelete(null)}
      >
         <div
            className="deletion-outer"
            onClick={(event) => event.stopPropagation()}
         >
            <div className="popup-inner">
               <div className="header-items">
                  <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                     Confirm Deletion
                  </span>
                  <RxCross1
                     size={30}
                     onClick={() => setItemToDelete(null)}
                     style={{ cursor: "pointer" }}
                  />
               </div>
               <div className="deletion-body">
                  <span style={{ fontSize: "1.5rem" }}>
                     Are you sure you want to delete this item?
                  </span>
                  <img
                     style={{ width: "200px" }}
                     src={item.product_image}
                     alt="product"
                  />
                  <span style={{ fontSize: "1.5rem", fontWeight: "500" }}>
                     {item.product_brand} - {item.product_name}
                  </span>
               </div>
               <div style={{ width: "40%" }}>
                  <div
                     style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                     }}
                  >
                     <button onClick={() => setItemToDelete(null)}>NO</button>
                     <button
                        onClick={() => {
                           if (item.product_category === "Miscellaneous") {
                              handleDeleteCarryBag(item);
                           } else {
                              handleDeleteItem(item);
                           }
                           setItemToDelete(null);
                        }}
                        style={{ backgroundColor: "darkred" }}
                     >
                        YES
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function MMRPInput({ setShowMMRP }) {
   return (
      <div className="popupContainer slow">
         <div className="deletion-outer">
            <div className="popup-inner">
               <div className="header-items">
                  <span style={{ fontSize: "2rem" }}>Enter MRP</span>
                  <RxCross1
                     size={30}
                     style={{ cursor: "pointer" }}
                     onClick={() => {
                        setShowMMRP(false);
                     }}
                  />
               </div>
               <div className="mmrp-body">
                  <span>Enter the MRP of the product</span>
                  <input type="number" placeholder="₹ 0.00" />
                  <div
                     style={{
                        display: "flex",
                        width: "50%",
                        height: "70px",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                     }}
                  >
                     <button
                        onClick={() => {
                           setShowMMRP(false);
                        }}
                     >
                        Cancel
                     </button>
                     <button style={{ backgroundColor: "darkred" }}>
                        Submit
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function ShowDetails({ item, setShowDetailsItem }) {
   return (
      <div
         className="popupContainer slow"
         onClick={() => setShowDetailsItem(null)}
      >
         <div
            className="deletion-outer"
            onClick={(event) => event.stopPropagation()}
         >
            <div className="popup-inner">
               <div className="header-items">
                  <span style={{ fontSize: "2rem" }}>Product Image</span>
                  <RxCross1
                     size={30}
                     style={{ cursor: "pointer" }}
                     onClick={() => setShowDetailsItem(null)}
                  />
               </div>
               <div className="deletion-body">
                  <img
                     style={{ height: "100%" }}
                     src={item.product_image}
                     alt="product"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
