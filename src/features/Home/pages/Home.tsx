import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HelpSupport from "../components/HelpSupport";

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white">
      <Hero />
      <Features />
      <HelpSupport />
    </div>
  );
};

export default Home;
