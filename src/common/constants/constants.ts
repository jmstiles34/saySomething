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

export const FAKE_ATTACHMENTS = [
  {
    file: "cat01.jpg",
    flagged: "safe"
  },
  {
    file: "cat02.jpg",
    flagged: "inappropiate"
  },
  {
    file: "cat03.jpg",
    flagged: "illegal"
  }
]

export const MESSAGE_TYPE = {
  ATTACH: "attach",
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
  ATTACH: "attach",
  CANNED: "canned",
  CONTACTS: "contacts"
};

export const TIP_CATEGORY = {
  critical: {
    name: "Critical Threats",
    icon: '🚨',
    description: "Tips involving immediate danger or high-risk situations requiring urgent intervention.",
    examples: "Weapons, bomb threats, physical assault, self-harm, suicide threats"
  },
  bullying: {
    name: "Bullying and Harassment",
    icon: '💬',
    description: "Tips about repeated harmful behavior or personal attacks targeting individuals or groups.",
    examples: "Bullying, cyberbullying, harassment, discrimination"
  },
  substance: {
    name: "Substance Use",
    icon: '🚬',
    description: "Tips related to the use or distribution of substances on school premises.",
    examples: "Vaping, drug use, alcohol consumption"
  },
  property: {
    name: "Property-Related Incidents",
    icon: '🔒',
    description: "Tips about actions impacting personal or school property.",
    examples: "Theft, vandalism, damage to property."
  },
  wellness: {
    name: "Wellness Concerns",
    icon: '💙',
    description: "Tips involving emotional, mental, or physical well-being that don’t pose an immediate threat.",
    examples: "Anxiety, depression, family problems, eating disorders."
  },
  safety: {
    name: "General Safety Concerns",
    icon: '🧯',
    description: "Tips about environmental or situational hazards that may lead to harm.",
    examples: "Hazardous conditions, unsafe equipment, environmental threats."
  },
  misconduct: {
    name: "Misconduct",
    icon: '⚖️',
    description: "Tips about violations of school rules or inappropriate behavior not posing immediate risk.",
    examples: "Cheating, inappropriate language, dress code violations."
  },
  misc: {
    name: "Miscellaneous/Other",
    icon: '❓',
    description: "Tips that don’t clearly fit into predefined categories or require further clarification.",
    examples: "Anonymous grievances, unclear or unclassified issues."
  }
}

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