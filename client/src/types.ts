export interface GateThresholds {
  auditMinChars: number;
  journalGateDays: number;
  habitGateDays: number;
  consistencyGateDays: number;
}

export interface Streak {
  best: number;
  cur: number;
}

export interface Gates {
  thresholds: GateThresholds;
  journal: Streak;
  habits: Streak;
  consistency: Streak;
  exposureChars: number;
  done: [boolean, boolean, boolean, boolean, boolean];
  locked: [boolean, boolean, boolean, boolean, boolean];
}

export interface Profile {
  name: string;
  role: string;
  city: string;
  org: string;
  years: string;
  sys: string[];
  des: string[];
  constraints: string[];
  commitment: string;
  createdAt: string;
}

export interface Me {
  id: string;
  email: string;
  referralCode: string;
  hasProfile: boolean;
  profile: Profile | null;
  notificationSettings: NotificationSettings | null;
  gates: Gates;
}

export interface ExposureAudit {
  userId: string;
  text: string;
  registeredAt: string | null;
}

export interface JournalEntry {
  id: string;
  date: string;
  tags: string[];
  text: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  checkedToday: boolean;
}

export interface Mentee {
  name: string;
  stage: string;
  joined: string;
}

export interface CircleData {
  inviteCode: string;
  inviteLink: string;
  mentees: Mentee[];
}

export interface NotificationSettings {
  journal: boolean;
  actions: boolean;
  review: boolean;
}
