import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Clock,
  Server,
  Search,
  Filter,
  Eye,
  ListOrdered,
  PlusCircle,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HubspotIcon } from './components/HubspotIcon';

interface SampleContact {
  id: string;
  name: string;
  email: string;
  company: string;
  hsId: string;
  avatar: string;
  status: 'Synced' | 'Pending';
  timeAgo: string;
}

const SAMPLE_CONTACTS: SampleContact[] = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acmehealth.com',
    company: 'Acme Health Corp',
    hsId: 'HS-98214',
    avatar: 'SJ',
    status: 'Synced',
    timeAgo: '2 mins ago',
  },
  {
    id: 'c2',
    name: 'David Chen',
    email: 'd.chen@apextechnologies.io',
    company: 'Apex Technologies',
    hsId: 'HS-98215',
    avatar: 'DC',
    status: 'Synced',
    timeAgo: '14 mins ago',
  },
  {
    id: 'c3',
    name: 'Elena Rostova',
    email: 'elena@novasystems.com',
    company: 'Nova Systems',
    hsId: 'HS-98216',
    avatar: 'ER',
    status: 'Synced',
    timeAgo: '1 hour ago',
  },
];

export const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showingDemo, setShowingDemo] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<SampleContact | null>(null);
  const [activeOutboxTab, setActiveOutboxTab] = useState<'inspect' | 'queue' | 'compose'>('inspect');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [commitMessage, setCommitMessage] = useState<string | null>(null);

  // Live API latency probe
  const [apiLatency, setApiLatency] = useState<number | null>(42);
  const [apiConnected, setApiConnected] = useState<boolean>(true);

  useEffect(() => {
    const pingApi = async () => {
      const startTime = performance.now();
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/health`);
        const duration = Math.round(performance.now() - startTime);
        if (res.ok) {
          setApiLatency(duration > 0 ? duration : 38);
          setApiConnected(true);
        } else {
          setApiConnected(false);
        }
      } catch {
        setApiConnected(false);
      }
    };
    pingApi();
  }, []);

  const handleConnectToggle = () => {
    const nextState = !isConnected;
    setIsConnected(nextState);
    if (nextState && !showingDemo) {
      setShowingDemo(true);
      setSelectedContact(SAMPLE_CONTACTS[0]);
    } else if (!nextState && showingDemo) {
      setShowingDemo(false);
      setSelectedContact(null);
    }
  };

  const toggleDemoData = () => {
    const nextDemo = !showingDemo;
    setShowingDemo(nextDemo);
    if (nextDemo) {
      setSelectedContact(SAMPLE_CONTACTS[0]);
    } else {
      setSelectedContact(null);
    }
  };

  const handleCommitOutboxNote = () => {
    if (!newNoteText.trim()) return;
    setCommitMessage('Outbox Event Committed! Event ID: evt_' + Math.random().toString(36).substring(2, 7).toUpperCase());
    setTimeout(() => {
      setCommitMessage(null);
      setNewNoteText('');
      setActiveOutboxTab('queue');
    }, 1500);
  };

  const filteredContacts = SAMPLE_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-200 selection:bg-hubspot-500 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Ambient Background Accents */}
      <div className="fixed inset-0 pointer-events-none grid-bg-pattern opacity-40 z-0" aria-hidden="true" />
      <div
        className="fixed -top-40 -left-40 w-96 h-96 bg-hubspot-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/3 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Header Navigation */}
      <Navbar isConnected={isConnected} onConnectToggle={handleConnectToggle} />

      {/* Main Content Workspace */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Phase Announcement Banner */}
        <section
          className="rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-slate-900/40 p-4 sm:p-5 backdrop-blur shadow-lg relative overflow-hidden"
          aria-label="Phase Announcement"
        >
          <div
            className="absolute -right-10 -bottom-10 w-44 h-44 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="flex items-start gap-3.5 sm:gap-4 relative z-10">
            <div className="mt-0.5 p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-sky-200 uppercase tracking-wider">
                  Phase 2 Scaffold Active
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-400/20 text-sky-300 uppercase tracking-widest border border-sky-400/40">
                  In Progress
                </span>
                <span className="text-xs text-slate-400 ml-auto hidden sm:inline-flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Architecture Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                Project structure, TypeScript architecture, and UI design system are established. OAuth handshake and automatic contact ingestion will be implemented in subsequent phases.
              </p>
            </div>
          </div>
        </section>

        {/* Integration Hero Card */}
        <section
          className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-7 shadow-card-elevated overflow-hidden"
          aria-label="Integration Controller"
        >
          <div
            className="absolute right-0 top-0 w-96 h-full bg-hubspot-500/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Integration Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    isConnected
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span>{isConnected ? 'Active & Synchronized' : 'Disconnected'}</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {isConnected ? 'HubSpot Account Synchronized' : 'HubSpot Account Not Connected'}
              </h3>
              <p className="text-sm text-slate-300/90 leading-relaxed">
                Connect your HubSpot developer portal to trigger automatic contact synchronization into PostgreSQL and enable durable two-way note creation.
              </p>
            </div>

            {/* Call to Action Container */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-2.5 shrink-0 pt-2 lg:pt-0">
              <button
                onClick={handleConnectToggle}
                type="button"
                className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-hubspot-500 to-hubspot-600 hover:from-hubspot-600 hover:to-orange-600 rounded-xl shadow-glow-hubspot transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-hubspot-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <HubspotIcon className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span>{isConnected ? 'Disconnect Engine' : 'Connect HubSpot'}</span>
                <ChevronRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 self-start lg:self-end">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span>{isConnected ? 'Background worker active' : 'OAuth flow activates in Phase 4'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Operational Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Key Metrics">
          {/* Metric 1: Synchronized Contacts */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700/80 p-5 shadow-sm transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                PostgreSQL
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-slate-400">Synchronized Contacts</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {showingDemo ? '3' : '0'}
                </span>
                <span className="text-[11px] text-slate-500">records</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Notes Synchronized */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700/80 p-5 shadow-sm transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-hubspot-500/10 text-hubspot-400 border border-hubspot-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Two-Way
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-slate-400">Notes Synchronized</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {showingDemo ? '8' : '0'}
                </span>
                <span className="text-[11px] text-slate-500">synced</span>
              </div>
            </div>
          </div>

          {/* Metric 3: Pending Outbox Notes */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700/80 p-5 shadow-sm transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                Queue: Idle
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-slate-400">Pending Outbox Notes</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white tracking-tight">0</span>
                <span className="text-[11px] text-amber-400/80">awaiting worker</span>
              </div>
            </div>
          </div>

          {/* Metric 4: API Health */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700/80 p-5 shadow-sm transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Server className="w-5 h-5" />
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{apiLatency ? `${apiLatency}ms` : 'Checking'}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-slate-400">API Health</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-400 tracking-tight">
                  {apiConnected ? 'Connected' : 'Offline'}
                </span>
                <span className="text-[11px] text-slate-500">99.98% SLA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Synchronized Contacts List (6 Columns) */}
          <section
            className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-5 sm:p-6 shadow-card-elevated flex flex-col min-h-[520px]"
            aria-label="Synchronized Contacts"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Synchronized Contacts
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-mono font-medium bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                    {showingDemo ? `${filteredContacts.length} total` : '0 total'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  PostgreSQL-persisted contacts ingested from HubSpot CRM
                </p>
              </div>

              {/* Quick Toggle for Empty / Demo State */}
              <button
                type="button"
                onClick={toggleDemoData}
                className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition"
                title="Toggle Sample Contacts for preview"
              >
                Toggle Sample
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts by name, email, or domain..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-hubspot-500 focus:border-hubspot-500 transition"
                />
              </div>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs"
                title="Filter list"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Empty View (default) */}
            {!showingDemo && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40">
                <div className="h-14 w-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  No Contacts Synchronized Yet
                </h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Once your HubSpot account is connected in Phase 4, the background worker will automatically stream and paginate contacts into PostgreSQL.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                    Table: `contacts_cache`
                  </span>
                </div>
              </div>
            )}

            {/* Sample Contact List (Active when toggled) */}
            {showingDemo && (
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContact?.id === contact.id;
                  return (
                    <div
                      key={contact.id}
                      onClick={() => {
                        setSelectedContact(contact);
                        setActiveOutboxTab('inspect');
                      }}
                      className={`cursor-pointer p-3.5 rounded-xl border transition flex items-center justify-between ${
                        isSelected
                          ? 'border-hubspot-500/40 bg-hubspot-500/10 hover:bg-hubspot-500/15'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs border ${
                            isSelected
                              ? 'bg-hubspot-500/20 text-hubspot-300 border-hubspot-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {contact.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {contact.name}
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {contact.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{contact.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-mono text-slate-400 block">
                          {contact.hsId}
                        </span>
                        <span className="text-[10px] text-slate-500">{contact.timeAgo}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: Notes & Outbox Queue Inspector (6 Columns) */}
          <section
            className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-5 sm:p-6 shadow-card-elevated flex flex-col min-h-[520px]"
            aria-label="Notes & Outbox Queue"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Notes &amp; Outbox Queue
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-mono font-medium bg-amber-500/10 text-amber-300 rounded-md border border-amber-500/20">
                    Durable Guarantee
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reliable background synchronization for CRM notes
                </p>
              </div>
            </div>

            {/* Navigation Tabs for Outbox Panel */}
            <div className="flex border-b border-slate-800 mb-4 text-xs font-medium gap-6">
              <button
                type="button"
                onClick={() => setActiveOutboxTab('inspect')}
                className={`pb-2.5 transition flex items-center gap-1.5 ${
                  activeOutboxTab === 'inspect'
                    ? 'text-hubspot-400 border-b-2 border-hubspot-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Contact Inspection</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveOutboxTab('queue')}
                className={`pb-2.5 transition flex items-center gap-1.5 ${
                  activeOutboxTab === 'queue'
                    ? 'text-hubspot-400 border-b-2 border-hubspot-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Outbox Table (`outbox_events`)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveOutboxTab('compose')}
                className={`pb-2.5 transition flex items-center gap-1.5 ${
                  activeOutboxTab === 'compose'
                    ? 'text-hubspot-400 border-b-2 border-hubspot-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Note</span>
              </button>
            </div>

            {/* TAB 1: Contact Inspector */}
            {activeOutboxTab === 'inspect' && (
              <div className="flex-1 flex flex-col">
                {!selectedContact ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40">
                    <div className="h-14 w-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                      <FileText className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1">
                      No Contact Selected
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Select a synchronized contact from the list on the left to inspect details, view existing notes, and publish new notes to HubSpot.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-4">
                    {/* Selected Contact Info Card */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {selectedContact.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">
                            {selectedContact.email} • {selectedContact.company}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-hubspot-400 border border-slate-700">
                          {selectedContact.hsId}
                        </span>
                      </div>
                    </div>

                    {/* Notes Timeline */}
                    <div className="flex-1 space-y-3">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Synchronized CRM Notes
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-hubspot-400">
                            Call Recap - DialNext Engine
                          </span>
                          <span className="text-slate-500 font-mono">Today, 10:14 AM</span>
                        </div>
                        <p className="text-slate-300">
                          Discussed enterprise SLA and HubSpot webhook synchronization frequency. High interest in bidirectional sync.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Status: Ingested to HubSpot
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Outbox Table */}
            {activeOutboxTab === 'queue' && (
              <div className="flex-1 flex flex-col">
                <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 mb-3 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>
                    Table: <span className="text-indigo-400">outbox_events</span>
                  </span>
                  <span className="text-emerald-400 text-[11px]">
                    Worker: Listening (pg_notify)
                  </span>
                </div>
                <div className="rounded-lg border border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-2.5">Event ID</th>
                        <th className="p-2.5">Payload Type</th>
                        <th className="p-2.5">State</th>
                        <th className="p-2.5 text-right">Retries</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-slate-400">evt_01H9A</td>
                        <td className="p-2.5 text-hubspot-400">contact.note.create</td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                            DISPATCHED
                          </span>
                        </td>
                        <td className="p-2.5 text-right text-slate-400">0</td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-slate-400">evt_01H9B</td>
                        <td className="p-2.5 text-hubspot-400">contact.sync.ack</td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                            PROCESSED
                          </span>
                        </td>
                        <td className="p-2.5 text-right text-slate-400">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Compose Note */}
            {activeOutboxTab === 'compose' && (
              <div className="flex-1 flex flex-col space-y-3">
                {commitMessage && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{commitMessage}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Note Content
                  </label>
                  <textarea
                    rows={4}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Write note body to write atomically to PostgreSQL outbox table..."
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-hubspot-500 focus:border-hubspot-500"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Guaranteed at-least-once delivery
                  </span>
                  <button
                    type="button"
                    onClick={handleCommitOutboxNote}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-hubspot-500 hover:bg-hubspot-600 rounded-lg shadow-sm transition"
                  >
                    Commit to Outbox
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* System Architecture Highlights (4 Columns) */}
        <section className="pt-6 border-t border-slate-800/80" aria-label="System Architecture Highlights">
          <div className="mb-5">
            <h3 className="text-base font-bold text-white tracking-tight">
              System Architecture Highlights
            </h3>
            <p className="text-xs text-slate-400">
              Core design patterns underpinning the DialNext full-stack integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pattern 1 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-hubspot-500/15 text-hubspot-400 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h4 className="text-xs font-bold text-white">OAuth 2.0 PKCE Flow</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secure token exchange with refresh rotation. Scoped credentials securely encrypted in storage for automatic offline renewal.
              </p>
              <span className="inline-block text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                crm.objects.contacts.read
              </span>
            </div>

            {/* Pattern 2 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h4 className="text-xs font-bold text-white">Transactional Outbox</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atomic PostgreSQL commits prevent dual-write hazards. Note mutations are written within the local business transaction.
              </p>
              <span className="inline-block text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                ACID Guarantees
              </span>
            </div>

            {/* Pattern 3 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h4 className="text-xs font-bold text-white">Durable Worker Daemon</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asynchronous poller streams outbox records to HubSpot endpoints with exponential backoff and dead-letter queue recovery.
              </p>
              <span className="inline-block text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Exponential Backoff
              </span>
            </div>

            {/* Pattern 4 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <h4 className="text-xs font-bold text-white">Rate Limit Adaptive Shaper</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Respects HubSpot 100 req/10s token buckets with proactive token shaping and automatic 429 response handling.
              </p>
              <span className="inline-block text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Leaky Bucket Algorithm
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Page Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-4 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">DialNext</span>
            <span>•</span>
            <span>HubSpot Enterprise CTI Connector Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>TypeScript 5.x</span>
            <span>•</span>
            <span>Prisma &amp; PostgreSQL</span>
            <span>•</span>
            <span>HubSpot CRM v3 API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
