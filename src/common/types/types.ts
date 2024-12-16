export type Counselor = {
  id: string,
  firstName: string,
  lastName: string,
  displayName: string,
  title: string,
  phone: string,
  email: string,
  role: string,
  colors: string[],
  status: string,
  timezone: string
}

export type School = {
  id: string,
  name: string,
  address: Address,
  contact: ContactInfo,
  timezone: "PST" | "MST" | "CST" | "EST",
  staff?: Staff[]
}

type Address = {
  street: string,
  city: string,
  state: string,
  zip: string
}

type ContactInfo = {
  phone: string,
  email: string
}

export type Staff = {
  id: string, 
  firstName: string,
  lastName: string,
  title: string,
  schoolId: string,
  email: string,
  phone: Phone,
  teamLead: boolean,
  notify_msg?: string
}

type Phone = {
  cell: string,
  work: string
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
  sender: {
    id: number;
    displayName: string;
    role: string;
    status?: number;
    title?: string;
  };
  timestamp: Date;
}

export type Tip = {
  tipId: string;
  status: string;
  lifeSafety: boolean;
  submittedAt: string;
  tipType: string;
  assignedTo: string;
  schoolId: string;
  stakeholders: string[];
  tags?: string[];
}

export interface Case extends Tip {
  school: School | undefined
}