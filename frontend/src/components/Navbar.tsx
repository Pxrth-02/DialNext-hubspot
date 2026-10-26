import React from 'react';
import { Code2, Zap } from 'lucide-react';
import { HubspotIcon } from './HubspotIcon';

interface NavbarProps {
  isConnected: boolean;
  onConnectToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isConnected, onConnectToggle }) => {
  return (
    <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Engine Title */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-hubspot-600 to-amber-500 flex items-center justify-center shadow-lg shadow-hubspot-600/30 ring-1 ring-white/20 shrink-0">
            <Zap className="w-5 h-5 text-white drop-shadow fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Dial<span className="text-hubspot-400">Next</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-hubspot-500/15 text-hubspot-400 border border-hubspot-500/30">
                HubSpot Engine
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 tracking-wide">
              OAuth Sync &amp; Durable Outbox Architecture
            </p>
          </div>
        </div>

        {/* Right Action Controls & Status Badges */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Live Connection Status Pill */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
            role="status"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span>{isConnected ? 'Connected (App ID: 98124)' : 'Disconnected'}</span>
          </div>

          {/* Git Repository Link Badge */}
          <a
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800/90 hover:bg-slate-700/80 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all duration-150 group"
            href="https://github.com/Pxrth-02/DialNext-hubspot"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span>Pxrth-02/DialNext-hubspot</span>
          </a>

          {/* Connect Action Trigger */}
          <button
            onClick={onConnectToggle}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-hubspot-500 to-hubspot-600 hover:from-hubspot-600 hover:to-orange-600 active:scale-95 transition-all shadow-md shadow-hubspot-500/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-hubspot-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <HubspotIcon className="w-4 h-4 text-white" />
            <span>{isConnected ? 'Disconnect Engine' : 'Connect HubSpot'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
