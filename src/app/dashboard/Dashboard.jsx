import React from "react";
import WelcomeCard from "../../components/Welcome";
import { Link } from "react-router-dom";
import BrowseCharactersCard from "../../components/BrowseCharactersCard";
import FarmableToday from "../../components/FarmableToday";
import DashboardCalculatorCard from "../../components/CalculatorCard";
import DashboardTodoCard from "../../components/TodoCard";
import DashboardAboutCard from "../../components/AboutCard";

export default function Dashboard() {
  return (
    <main className='dashboard min-h-screen bg-zinc-950 text-white pt-6 pb-10'>
      <div className='max-w-sm px-4 md:px-2 lg:px-0 sm:max-w-4xl mx-auto grid gap-4 lg:grid-cols-3 lg:auto-rows-min'>
        <div className='absolute inset-0 flex justify-center'>
          <img
            src={"/images/Comment_Decoration_Ineffa.png"}
            alt=''
            className='object-contain hidden md:block lg:max-w-[72%] md:top-[30%] lg:top-[15%] sticky md:fixed opacity-75'
          />
        </div>

        {/* full header */}
        <div className='md:col-span-3'>
          <WelcomeCard />
        </div>

        <div className='md:col-span-3'>
          <BrowseCharactersCard variant='compact' />
        </div>

        {/* left FarmableToday */}
        <div className='md:col-span-2 z-10'>
          <FarmableToday />
        </div>

        {/* right TodoCard & CalculatorCard */}
        <div className='md:col-span-1 lg:self-start space-y-6 md:space-y-6'>
          <DashboardTodoCard variant='compact' />
          <DashboardCalculatorCard variant='compact' />
          <DashboardAboutCard variant='compact' />
        </div>
      </div>
    </main>
  );
}
