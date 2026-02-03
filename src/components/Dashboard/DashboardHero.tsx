
import React from 'react';

export function DashboardHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 sm:p-10 text-white shadow-lg">
      <div className="relative z-10">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
          Selamat Datang di Dashboard LPK
        </h1>
        <p className="text-blue-100 text-sm sm:text-lg max-w-2xl">
          Kelola program pemagangan Jepang dengan sistem terintegrasi yang modern dan efisien.
        </p>
      </div>
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl transform translate-x-16 sm:translate-x-32 -translate-y-8 sm:-translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-56 sm:h-56 bg-white/5 rounded-full blur-2xl transform -translate-x-12 sm:-translate-x-24 translate-y-6 sm:translate-y-12"></div>
    </div>
  );
}
