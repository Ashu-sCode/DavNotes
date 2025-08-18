import { logEvent } from "firebase/analytics";

export const logEventUtil = (analytics, eventName, params) => {
  if (!analytics) {
    console.warn("Analytics not initialized");
    return;
  }
  // console.log("📊 Logging event:", eventName, params); // ✅ Debug log
  logEvent(analytics, eventName, params);
};
