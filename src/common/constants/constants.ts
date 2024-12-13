export const DIALOG_TYPE = {
  counselor: {
    name: "Counselor",
    icon: "counselor.svg",
    style: "counselor",
  },
  reporter: {
    name: "Reporter",
    icon: "reporter.svg",
    style: "reporter",
  },
  team: {
    name: "Team",
    icon: "team.svg",
    style: "team",
  },
};

export const MESSAGE_TYPE = {
  CALL: "call",
  CHAT: "chat",
  STAKEHOLDERS: "stakeholders",
};

export const MODAL = {
  INSTRUCTIONS: "instructions",
  STAKEHOLDERS: "stakeholders",
  SUMMARY: "summary",
  TAGS: "tags",
};

export const POPOVER = {
  CANNED: "canned",
  CONTACTS: "contacts"
};

export const TOOLS = [
  {
    label: "Tips",
    icon: "pen-to-square",
    link: "",
  },
  {
    label: "Phone",
    icon: "phone",
    link: "",
  },
  {
    label: "Staff",
    icon: "users",
    link: "",
  },
  {
    label: "Search",
    icon: "magnifying-glass",
    link: "",
  },
  {
    label: "Reports",
    icon: "chart-line",
    link: "",
  },
  {
    label: "Rotation",
    icon: "headphones",
    link: "",
  },
  {
    label: "Settings",
    icon: "cog",
    link: "",
  },
  {
    label: "Chatting",
    icon: "comment-dots",
    link: "",
  },
];

export const USERS = {
  reporter: {
    id: 1,
    displayName: "Anonymous User",
    role: "reporter",
    status: 1,
    title: "",
  },
  counselor: {
    id: 1,
    displayName: "Ellie Johnson",
    role: "counselor",
    status: 1,
    title: "SHP Counselor",
  },
  collaborator: {
    id: 1,
    displayName: "Maria Gonzalez",
    role: "collaborator",
    status: 1,
    title: "School Collaborator",
  },
};

export const REPLACE_VALUES = ['TIPID','DATE','TIME']

export const LABEL_CHATTING = "Chatting";
export const LABEL_HOME = "Home";
export const LABEL_PHONE = "Phone";
export const LABEL_REPORTS = "Reports";
export const LABEL_ROTATION = "Rotation";
export const LABEL_SEARCH = "Search";
export const LABEL_SETTINGS = "Settings";
export const LABEL_STAFF = "Staff";
export const LABEL_TIPS = "Tips";


export const TIME_ZONES = {
  CST: 'America/Chicago',
  EST: 'America/New_York',
  MST: 'America/Denver',
  PST: 'America/Los_Angeles'
}