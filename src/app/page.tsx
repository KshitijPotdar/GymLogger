import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-m3-background p-4 font-sans">
      <div className="text-center max-w-2xl mx-auto">
        
        {/* Main Title */}
        <h1 className="mb-6 text-6xl font-bold text-m3-primary drop-shadow-lg">
          GymLogger
        </h1>
        
        {/* Subtitle */}
        <p className="mb-10 text-xl text-m3-text-muted font-medium">
          Track your workouts, achieve your goals
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-center">
          
          <Link
            href="/login"
            className="rounded-m3-btn bg-m3-primary px-10 py-4 text-m3-on-primary font-bold text-lg hover:brightness-110 shadow-lg shadow-m3-primary/20 transition-all active:scale-95"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="rounded-m3-btn bg-m3-surface-variant px-10 py-4 text-m3-text-main font-semibold text-lg hover:brightness-110 transition-all"
          >
            View Dashboard
          </Link>
          
        </div>
      </div>
    </div>
  );
}