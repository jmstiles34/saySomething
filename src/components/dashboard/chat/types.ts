export interface User {
  id: number;
  displayName:string;
  role: string;
  status: number;
  title: string;
}

export interface Message {
  id: number;
  text: string;
  user: User;
  timestamp: string;
}

export interface Tip {
  tipId: string;
  status: string;
  lifeSafety: boolean;
  submittedAt: string;
  tipType: string;
  assignedTo: string;
}