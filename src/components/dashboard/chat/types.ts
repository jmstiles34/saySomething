export interface Contact {
  id: string, 
  name: string,
  title: string,
  school: string,
  email: string,
  cell_phone: string,
  work_phone: string,
  team_lead: boolean
}

export interface User {
  id: number;
  displayName: string;
  role: string;
  status: number;
  title: string;
}

export interface Message {
  id: number;
  text: string;
  user: User;
  timestamp: Date;
}

export interface Tip {
  tipId: string;
  status: string;
  lifeSafety: boolean;
  submittedAt: string;
  tipType: string;
  assignedTo: string;
  stakeholders: string[];
}