import React, { useState } from "react";
import styles from "./feedback.module.css";
import smile from "./smile.png";
import neutral from "./neutral.png";
import angry from "./angry.png";
import { useStepContext } from "../../contexts/StepContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function Feedback() {
   const [selectcircle, setSelectCircle] = useState(null);
   const { handleExit } = useStepContext();
   const { user } = useAuthContext();

   function circleSelect(imageName) {
      setSelectCircle(imageName);
   }

   function submitFeedback(selectcircle) {
      const feedbackVal =
         selectcircle === "smile" ? 3 : selectcircle === "neutral" ? 2 : 1;
      axios
         .put(`http://localhost:8080/users/feedback`, {
            userId: user.id,
            rating: feedbackVal,
         })
         .then(() => {
            console.log("Feedback rating updated successfully!");
         });

      handleExit();
   }

   return (
      <div className={styles.content}>
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               justifyContent: "center",
            }}
         >
            <span style={{ fontSize: "40px" }}>Rate Your Experience</span>
            <span style={{ fontSize: "20px" }}>
               Earn <b>10 Loyalty Points</b> for your feedback
            </span>
         </div>

         <div>
            <img
               src={smile}
               alt="smile"
               onClick={() => circleSelect("smile")}
               className={`${styles.emoji} ${
                  selectcircle === "smile" && styles.selected
               }`}
            />
            <img
               src={neutral}
               alt="neutral"
               onClick={() => circleSelect("neutral")}
               className={`${styles.emoji} ${
                  selectcircle === "neutral" && styles.selected
               }`}
            />
            <img
               src={angry}
               alt="angry"
               onClick={() => circleSelect("angry")}
               className={`${styles.emoji} ${
                  selectcircle === "angry" && styles.selected
               }`}
            />
         </div>
         <button
            className={`${styles.finalButton} ${
               selectcircle && styles.submitType
            }`}
            // onClick to submit feedback or skip
            onClick={() =>
               selectcircle ? submitFeedback(selectcircle) : handleExit()
            }
         >
            {selectcircle ? "Submit" : "Skip"} Feedback
         </button>
         <div>
            <span className={styles.addInfo}>
               We would love to hear from you.{" "}
            </span>
            <span className={styles.addInfo}>
               Please reach us out at{" "}
               <span className={styles.link}>
                  selfc.retail-feedback@kpmg.com
               </span>{" "}
               for any additional feedback.
            </span>
         </div>
      </div>
   );
}
