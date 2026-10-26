export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type SyncStatus = 'idle' | 'in_progress' | 'completed' | 'failed';

export interface HubspotPortalInfo {
  portalId?: string;
  connectedAt?: string;
  expiresAt?: string;
}

export interface Contact {
  id: string;
  hubspotId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  lifecycleStage?: string;
  notesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  contactId: string;
  hubspotNoteId?: string;
  body: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  errorMessage?: string;
  createdAt: string;
  syncedAt?: string;
}

export interface AppMetrics {
  totalContacts: number;
  syncedNotes: number;
  pendingNotes: number;
  lastSyncTime?: string;
}
