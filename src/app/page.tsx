"use client";
import React from "react";
import Navbar from "./navbar";
import Background from "./Background.jpg";
import Image from "next/image";
import Example from "./exampleProblem.png";
import {useRouter} from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const handleButton1 = () => {
    router.push('/registration');
  };
  const handleButton2 = () => {
    router.push('/past-tests');
  }

  return (
    <div className= "text-black min-h-screen">
      <Navbar/>
      <header className="relative w-full h-screen flex flex-col justify-center items-start text-white text-left p-6">
        <Image src={Background} alt="Background" className="absolute top-0 left-0 w-full h-full object-cover" />
        <div className="items-left relative z-10 -mt-20">
          <h1 className="text-7xl font-bold drop-shadow-lg text-black ml-8">
            Skyline Mathematical Applications Contest
          </h1>
          <p className="mt-6 text-2xl max-w-5xl leading-relaxed drop-shadow-md text-black ml-14">
            The Skyline Mathematical Applications Contest (SMAC) is a middle-school math competition run by the Skyline Math Club. 
            We are passionate about bringing a fun and engaging math competition to students aiming to learn more about the applications of math in the real world!
          </p>
          <button className="mt-8 bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:bg-gray-200 transition ml-14" onClick={handleButton1}> 
            REGISTER FOR SMAC 2025 HERE! 
          </button>
        </div>
      </header>
      
      <section className="bg-gray-200 p-16 -mt-7">
        <h2 className="text-4xl font-bold text-center">What is SMAC?</h2>
        <p className="text-center text-2xl mt-6 max-w-4xl mx-auto text-lg leading-relaxed">
          Skyline Mathematical Applications Contest is run entirely by Skyline students. Starting in 2023, SMAC was began in an effort to bring competition opportunities to middle-school students in the greater Seattle area while encouraging a more practical view of mathematics. 
        </p>
      </section>

      <section className="bg-gray-300 p-16 text-center flex flex-col justify-center">
        <h2 className="text-4xl font-bold">Competitions</h2>
            <p className="text-center text-2xl mt-6 max-w-4xl mx-auto text-lg leading-relaxed">
              SMAC hosts one competition each year, typically in February. The competition is open to all middle-school students in the greater Seattle area and is composed of three rounds: a multiple-choice round, a numerical response round, and an investigative question. Students in each grade who perform well in the competition advance to a college from which prizes and recognition are awarded.
            </p>
      </section>

      <section className="bg-gray-200 p-16">
      <h2 className="text-4xl font-bold text-center">Past Problems</h2>
      <div className="flex justify-center space-x-16 mt-6 ml-20">
        <div className="max-w-md text-center">
          <h3 className="text-2xl font-semibold mb-4">Want to see our past tests and practice solving problems?</h3>
          <button className="bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:bg-gray-200 transition" onClick={handleButton2}>
            CLICK ME!
          </button>
        </div>
        <div>
          <Image src = {Example} alt = "exampleproblem" className="w-full h-full size-200"/>
        </div>
      </div>
    </section> 

      <footer className="py-4 bg-red-800 text-center">
        <p>&copy; 2025 Skyline Mathematical Applications Contest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

