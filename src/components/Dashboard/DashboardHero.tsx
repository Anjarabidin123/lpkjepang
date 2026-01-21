
import React from 'react';

export function DashboardHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-white shadow-lg">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-3">
          Selamat Datang di Dashboard LPK
        </h1>
        <p className="text-blue-100 text-lg">
          Kelola program pemagangan Jepang dengan sistem terintegrasi
        </p>
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-2xl transform -translate-x-24 translate-y-12"></div>
    </div>
  );
}
