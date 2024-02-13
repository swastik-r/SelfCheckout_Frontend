import "./loginStyles.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { IoBackspaceOutline } from "react-icons/io5";

export default function Login() {
   const [userName, setUserName] = useState("Guest");
   const { setUser, setIsGuest } = useAuthContext();
   const [mobileNumber, setMobileNumber] = useState("");
   const [skipReg, setSkipReg] = useState(true);
   const [registrationWindow, setRegistrationWindow] = useState(false);
   const navigate = useNavigate();

   function handleKeyPress(key) {
      const currentMobileNumber = mobileNumber.replace(/ - /g, "");

      if (currentMobileNumber.length < 10) {
         const newMobileNumber = currentMobileNumber + key.target.innerText;
         let formattedMobileNumber = "";

         if (newMobileNumber.length <= 3) {
            formattedMobileNumber = newMobileNumber;
         } else if (newMobileNumber.length <= 6) {
            formattedMobileNumber = `${newMobileNumber.slice(
               0,
               3
            )} - ${newMobileNumber.slice(3)}`;
         } else {
            formattedMobileNumber = `${newMobileNumber.slice(
               0,
               3
            )} - ${newMobileNumber.slice(3, 6)} - ${newMobileNumber.slice(
               6,
               10
            )}`;
         }
         setMobileNumber(formattedMobileNumber);
      }
   }

   function handleClear() {
      setMobileNumber("");
   }

   function handleBackspace() {
      const currentMobileNumber = mobileNumber.replace(/ - /g, "");
      const newMobileNumber = currentMobileNumber.slice(0, -1);
      let formattedMobileNumber = "";

      if (newMobileNumber.length <= 3) {
         formattedMobileNumber = newMobileNumber;
      } else if (newMobileNumber.length <= 6) {
         formattedMobileNumber = `${newMobileNumber.slice(
            0,
            3
         )} - ${newMobileNumber.slice(3)}`;
      } else {
         formattedMobileNumber = `${newMobileNumber.slice(
            0,
            3
         )} - ${newMobileNumber.slice(3, 6)} - ${newMobileNumber.slice(6, 10)}`;
      }
      setMobileNumber(formattedMobileNumber);
   }

   async function handleContinue() {
      if (mobileNumber.length === 16) {
         const response = await axios.get(
            `http://localhost:8080/users/login/${mobileNumber.replace(
               / - /g,
               ""
            )}`
         );
         if (response.data) {
            // add mobile number to user object
            response.data.mobileNumber = "+91 " + mobileNumber;
            setUser(response.data);
            setIsGuest(false);
            navigate("/cart");
         } else {
            setRegistrationWindow(true);
         }
      } else {
         toast.error("Please enter a valid 10-digit mobile number");
      }
   }

   async function handleRegister() {
      if (!skipReg) {
         const response = await axios.post(
            "http://localhost:8080/users/register",
            {
               name: userName,
               mobileNumber: mobileNumber.replace(/ - /g, ""),
            }
         );
         // update user object with mobile number
         response.data.mobileNumber = "+91 " + mobileNumber;
         setUser(response.data);
         console.log("New User", response.data);
         setIsGuest(false);
      } else {
         setUser({
            name: userName,
            mobileNumber: "+91 " + mobileNumber,
         });
         console.log("Guest User");
      }
      navigate("/cart");
   }

   return (
      <>
         {registrationWindow ? (
            <RegistrationWindow
               setUserName={setUserName}
               handleRegister={handleRegister}
               skipReg={skipReg}
               setSkipReg={setSkipReg}
            />
         ) : (
            <LoginWindow
               mobileNumber={mobileNumber}
               handleKeyPress={handleKeyPress}
               handleClear={handleClear}
               handleContinue={handleContinue}
               handleBackspace={handleBackspace}
            />
         )}
      </>
   );
}

function LoginWindow({
   mobileNumber,
   handleKeyPress,
   handleBackspace,
   handleClear,
   handleContinue,
}) {
   return (
      <div className="screen">
         <div className="top-div">
            <span className="heading">
               <span style={{ fontSize: "4rem" }}>
                  Please enter your{" "}
                  <span style={{ fontWeight: "600" }}>Mobile Number</span>
               </span>
            </span>
         </div>
         <div className="bottom-div">
            <div className="login-left-div">
               {/* Input */}
               <div className="input-fields-div">
                  <input
                     className="login-input slow"
                     placeholder="123 - 456 - 7890"
                     value={mobileNumber}
                     maxLength={12}
                     readOnly
                  />
                  <button
                     style={{
                        backgroundColor: "transparent",
                     }}
                     onClick={handleBackspace}
                  >
                     <IoBackspaceOutline size={50} style={{ color: "black" }} />
                  </button>
               </div>

               {/* Buttons */}
               <div
                  style={{
                     width: "50%",
                     display: "flex",
                     justifyContent: "space-evenly",
                  }}
               >
                  <button
                     onClick={handleClear}
                     style={{
                        background: "transparent",
                        color: "black",
                        border: "1px solid black",
                     }}
                  >
                     CLEAR
                  </button>
                  <button onClick={handleContinue}>CONTINUE</button>
               </div>
            </div>
            <div className="login-right-div">
               <div className="login-keypad">
                  <div className="login-keypad-row">
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        1
                     </button>
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        2
                     </button>
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        3
                     </button>
                  </div>
                  <div className="login-keypad-row">
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        4
                     </button>
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        5
                     </button>
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        6
                     </button>
                  </div>
                  <div className="login-keypad-row">
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        7
                     </button>
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        8
                     </button>
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        9
                     </button>
                  </div>
                  <div className="login-keypad-row-0">
                     <button
                        className="login-keypad-button"
                        onClick={handleKeyPress}
                     >
                        0
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function RegistrationWindow({
   setUserName,
   handleRegister,
   skipReg,
   setSkipReg,
}) {
   const [inputValue, setInputValue] = useState("");
   const capitalizeFirstLetter = (input) => {
      return input
         .split(/\s+/)
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(" ");
   };

   return (
      <>
         <div className="reg-details">
            <span className="reg-heading">Sign Up</span>
            <span className="reg-subheading">
               Let us get to know you better. Please enter your <b>Name</b>{" "}
               below:
            </span>
            <input
               className="reg-input"
               placeholder="Optional"
               value={inputValue}
               onChange={(e) => {
                  const capitalizedValue = capitalizeFirstLetter(
                     e.target.value
                  );
                  setInputValue(capitalizedValue);
                  setUserName(capitalizedValue);
                  setSkipReg(capitalizedValue.length > 0 ? false : true);
               }}
            />
         </div>

         <button
            className={skipReg ? "skip-button" : "register-button"}
            onClick={handleRegister}
         >
            {skipReg ? "SKIP" : "REGISTER"}
         </button>
      </>
   );
}
