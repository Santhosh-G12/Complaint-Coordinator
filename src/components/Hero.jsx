import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function Frame() {
  return (
    <main className="bg-transparent flex flex-row justify-center w-full min-h-screen">
      <section className="bg-[url(/frame-2.png)] bg-cover bg-center w-full max-w-[1280px] h-[832px] relative flex flex-col">
        <header className="mt-0 ml-[23px]">
          <h1 className="font-bold text-[#d9d9d9] text-5xl tracking-[0] leading-normal font-['Outfit-Bold',Helvetica]">
            Complaint Coordinator
          </h1>
        </header>

        <div className="flex flex-col items-center justify-center flex-grow">
          <Card className="bg-transparent border-none shadow-none max-w-2xl">
            <CardContent className="p-0">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Turn Complaints into Solutions with{" "}
                <span className="text-[#b7d3dd]">AI-Powered Insights</span>
              </h2>

              <p className="w-[787px] rotate-[-0.02deg] text-shadow-md font-normal italic text-[#22293a] text-2xl tracking-[0] leading-normal font-['Inter-Italic',Helvetica]">
                I am your Complaint Coordinator !!!
              </p>
            </CardContent>
          </Card>

          <Button className="w-[411px] h-[76px] mt-16 bg-[#b7d3dd] rounded-[15px] hover:bg-[#a6c2cc] transition-colors">
            <span className="font-['Silkscreen-Regular',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-normal">
              Get Started !
            </span>
          </Button>
        </div>
      </section>
    </main>
  );
}
