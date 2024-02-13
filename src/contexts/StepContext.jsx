import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { timeout, promptBeforeIdle } from "../config/TimeoutConfig";

const StepContext = createContext();

export function useStepContext() {
   return useContext(StepContext);
}

export default function StepProvider({ children }) {
   const pagesURL = ["/", "/login", "/cart", "/payment", "/feedback"];
   const location = useLocation();
   const currentStep = pagesURL.indexOf(location.pathname);
   const navigate = useNavigate();

   function handlePrev() {
      const newStep = currentStep - 1;
      if (newStep >= 0) {
         navigate(pagesURL[newStep]);
      }
   }

   // add a try catch block to handle the error
   function handleNext() {
      const newStep = currentStep + 1;
      if (newStep < pagesURL.length) {
         navigate(pagesURL[newStep]);
      }
   }

   function handleExit() {
      navigate(pagesURL[0]);
      window.location.reload(false);
   }

   // Constants for the Idle Timer
   const [state, setState] = useState("Active");
   const [remaining, setRemaining] = useState(0);
   const [idlePromptOpen, setIdlePromptOpen] = useState(false);

   const onIdle = () => {
      setState("Idle");
      setIdlePromptOpen(false);
      handleExit();
   };

   const onActive = () => {
      setState("Active");
      setIdlePromptOpen(false);
   };

   const onPrompt = () => {
      setState("Prompted");
      setIdlePromptOpen(true);
   };

   const { getRemainingTime, activate } = useIdleTimer({
      onIdle,
      onActive,
      onPrompt,
      timeout,
      promptBeforeIdle,
      throttle: 500,
   });

   const handleStillHere = () => {
      activate();
   };

   useEffect(() => {
      const interval = setInterval(() => {
         setRemaining(Math.ceil(getRemainingTime() / 1000));
      }, 500);

      return () => {
         clearInterval(interval);
      };
   }, [getRemainingTime]);

   const seconds = remaining === 1 ? "second" : "seconds";

   const contextValue = {
      state,
      remaining,
      seconds,
      promptBeforeIdle,
      idlePromptOpen,
      step: currentStep,
      pages: pagesURL,
      handleStillHere,
      handlePrev,
      handleNext,
      handleExit,
   };

   return (
      <StepContext.Provider value={contextValue}>
         {children}
      </StepContext.Provider>
   );
}
