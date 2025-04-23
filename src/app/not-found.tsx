'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  // Calculate subtle rotation based on mouse position
  const rotateX = (mousePosition.y / window.innerHeight - 0.5) * 5;
  const rotateY = (mousePosition.x / window.innerWidth - 0.5) * -5;

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-red-500/20 blur-3xl"
        style={{ 
          left: `calc(20% + ${mousePosition.x * 0.2}px)`,
          top: `calc(30% + ${mousePosition.y * 0.2}px)`
        }}
      ></div>
      <div 
        className="absolute w-80 h-80 rounded-full bg-red-700/20 blur-3xl"
        style={{ 
          right: `calc(25% + ${mousePosition.x * -0.2}px)`,
          bottom: `calc(20% + ${mousePosition.y * -0.2}px)`
        }}
      ></div>
      
      {/* Glassmorphic card with subtle animation */}
      <Card 
        className="relative w-full max-w-md dark shadow-xl rounded-xl transition-transform duration-200 ease-out"
        style={{ 
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <div className="p-8 flex flex-col items-center">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-blue-200/90 mb-2">
            404
          </h1>
          
          <h2 className="text-xl font-medium text-white/90 mb-6">
            Page Not Found
          </h2>
          
          <p className="text-white/70 text-center mb-8">
            Oops! The page you are looking for might have been removed, 
            renamed, or is temporarily unavailable.
          </p>
          
          <Link href="/" passHref>
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
              Return Home
            </Button>
          </Link>
        </div>
        
        {/* Light reflection effect */}
        <div 
          className="absolute w-full h-full top-0 left-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x - window.innerWidth/4}px ${mousePosition.y - window.innerHeight/4}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`,
          }}
        ></div>
      </Card>
    </div>
  );
}