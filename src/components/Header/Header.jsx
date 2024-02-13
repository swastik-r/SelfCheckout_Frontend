import styles from "./Header.module.css";
import kpmgLogo from "../../assets/KPMG_logo.svg";
import ProgressBar from "../ProgressBar/ProgressBar";
import DateTime from "../DateTime";
import UserDetailsBar from "../UserDetailsBar/UserDetailsBar";
import { useStepContext } from "../../contexts/StepContext";

export default function Header() {
   const { step, handleExit } = useStepContext();

   return (
      <>
         <div className={styles.header}>
            <img src={kpmgLogo} alt="logo" style={{ width: "150px" }} />
            <ProgressBar />
            <DateTime />
            {step !== 0 && step !== 5 && (
               <button
                  style={{
                     backgroundColor: "darkred",
                  }}
                  onClick={() => {
                     handleExit();
                  }}
               >
                  EXIT
               </button>
            )}
         </div>

         {/* Don't Show UserDetailsBar when step=0 or 1  */}
         {step > 1 && <UserDetailsBar />}
      </>
   );
}
