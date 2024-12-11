export type Contact = {
  id: string, 
  name: string,
  title?: string,
  school?: string,
  email?: string,
  cell_phone?: string,
  work_phone?: string,
  team_lead?: boolean,
  notify_msg: string
}

export type User = {
  id: number;
  displayName: string;
  role: string;
  status: number;
  title: string;
}

export type Message = {
  id: string;
  type?: string;
  text: string;
  user: User;
  timestamp: Date;
}

export type Tip = {
  tipId: string;
  status: string;
  lifeSafety: boolean;
  submittedAt: string;
  tipType: string;
  assignedTo: string;
  stakeholders: string[];
  tags?: string[];
}