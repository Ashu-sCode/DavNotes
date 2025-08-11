import { Link } from "react-router-dom";
import LandingHero from "../components/LandingHero";
import Features from "../components/Features";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      <LandingHero />
      <Features />
      <CTA />
    </div>
  );
};

export default HomePage;
