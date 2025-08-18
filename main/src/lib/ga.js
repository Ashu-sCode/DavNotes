// src/lib/ga.js
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID; // Replace with your ID

// Initialize GA
export const pageview = (url) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
