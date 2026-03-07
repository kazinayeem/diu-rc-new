import React from "react";

export default function Offline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <h2 className="text-xl font-bold text-cyan-400">DIU Robotics Club</h2>
      </div>

      {/* Main Content */}
      <div className="max-w-md text-center">
        {/* Icon - Signal Waves */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-cyan-400/30">
            <svg
              className="w-16 h-16 text-cyan-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.111 16H5m13 0h-3m-7-4h.01M9 20h6m-6-4h6m0-11V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4m12 0a2 2 0 00-2-2H7a2 2 0 00-2 2m12 0v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7m12-4l-3.758-2.253A2 2 0 0012 2.75h0m0 0L8.242 5.003A2 2 0 006 6.75v10.5a2 2 0 002 2h12a2 2 0 002-2V6.75a2 2 0 00-2-1.75z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
          Connection Required
        </h1>

        {/* Description */}
        <p className="text-white/75 mb-2 text-lg">
          We're ready to serve you better with an internet connection.
        </p>
        <p className="text-white/60 mb-8 text-sm">
          Your app is saved locally, but full features work best online.
        </p>

        {/* Call to Action */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-lg"
          >
            Reconnect & Refresh
          </button>
          <p className="text-white/50 text-xs">
            Check your internet connection and try again
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-white/40 text-xs">
        <p>PWA • Offline Mode Active</p>
      </div>
    </div>
  );
}
