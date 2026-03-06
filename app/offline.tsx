import React from "react";

export default function Offline() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-cyan-400 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16H5m13 0h-3m-7-4h.01M9 20h6m-6-4h6m0-11V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4m12 0a2 2 0 00-2-2H7a2 2 0 00-2 2m12 0v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7m12-4l-3.758-2.253A2 2 0 0012 2.75h0m0 0L8.242 5.003A2 2 0 006 6.75v10.5a2 2 0 002 2h12a2 2 0 002-2V6.75a2 2 0 00-2-1.75z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
        <p className="text-white/70 mb-6">
          It looks like you've lost your internet connection. Some features may not be available right now.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2 px-6 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
