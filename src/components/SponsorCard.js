"use client";
import { useEffect, useRef, useState } from "react";

export default function SponsorCard() {
  const cardRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkCardState = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        setExpanded(width > 150);
      }
    };
    const interval = setInterval(checkCardState, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[#478EBC]">
      <div
        ref={cardRef}
        className={`relative flex items-center justify-center overflow-hidden shadow-md transition-all duration-700 ${
          expanded ? "rounded-[15px] w-[300px] h-[150px]" : "rounded-full w-[100px] h-[100px]"
        } animate-expandContract`}
        style={{
          background:
            "linear-gradient(135deg, #2D58AA,#99AA2D,#ED6A3B,#D4D4D4,#CFD80C, white,#E0F834, red, skyblue)",
        }}
      >
        <img
          src="/logo.png"
          alt="Sponsor Logo"
          className="absolute left-5 top-5 w-[60px] h-[60px] rounded-full object-cover z-10"
        />

        <div
          className={`absolute left-[100px] right-[15px] transition-opacity duration-500 ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800">NewtalentsG Ltd</h3>
          <p className="text-sm text-gray-700">
            Promoting your business with us. Contact us on WhatsApp: 0722319367
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes expandContract {
          0% {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
          10% {
            width: 300px;
            height: 150px;
            border-radius: 15px;
          }
          90% {
            width: 300px;
            height: 150px;
            border-radius: 15px;
          }
          100% {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
        }

        .animate-expandContract {
          animation: expandContract 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
