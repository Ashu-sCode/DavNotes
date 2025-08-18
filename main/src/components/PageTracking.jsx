// src/components/PageTracking.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageview } from "@/lib/ga"; // <- your ga.js file

export default function PageTracking() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return null; // nothing to render
}
