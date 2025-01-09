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
  SUMMARY: "summary",
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

export const HOT_KEY_SCRIPT = {
  2: "Thank you for reaching out and sharing this information. This is very concerning, and I want to make sure Sarah and everyone involved are safe. Could you clarify if Tyler is a student at the same school, or if he's coming from outside the campus?",
  "2reply": "No, he doesn't go to the school. He just shows up when he knows Sarah will be there.",
  3: "I see, thank you for letting us know. It's important that the school and authorities are made aware of this. Has Sarah or her friends reported any of this to a teacher or administrator?",
  "3reply": "No, Sarah is too scared to say anything, and her friends don't want to get involved because of his threats.",
  4: "<strong>@invite</strong> Hi, this is Ellie from the Crisis Center. I’m currently handling an anonymous tip regarding a serious situation involving Sarah, an 11th-grade student, and an individual named Tyler, who’s reportedly abusive and making threats.",
  "4reply": "I’m following along. From what I’ve seen in the tip so far, we’ll immediately alert campus security to watch for unauthorized visitors. I’ll also inform Coach Johnson to pull Emmitt aside for a conversation. If you’re able to get images or any additional information, let me know. We’ll prepare to escalate this to law enforcement if necessary.",
  "4sum": "Tyler, who is not a student, is abusive toward his girlfriend Sarah, an 11th grader, and stalks her on campus, threatening harm to her and her friends to keep them silent. Coach Johnson and administration are advised to speak with Sarah’s best friend, Emmitt, for more information.",
  5: "Understood. I’ll ask the tipster if they can safely provide any evidence, such as images of bruises or marks.",
  "5reply": "I’ll also make sure Sarah is discreetly checked on. <strong>@Diana-Thompson</strong> Please connect with Sarah during a neutral moment to avoid raising suspicion.",
  "5reply2": "Yes. Checking her schedule now and will follow-up.",
  6: "Understood. Sarah's safety is a priority, and it's critical that this is addressed quickly. I will notify the appropriate school officials, including Coach Johnson, as you suggested, so they can speak with Emmitt.\n\nDo you know if Sarah has been physically harmed, or if she's mentioned feeling in immediate danger?",
  "6reply": "I think he's hit her before, but I don't know for sure. She doesn't really talk about it, but she always seems scared.",
  7: "That's very concerning. If you happen to have or can safely obtain any images of bruises or marks that Sarah might have from physical abuse, uploading those could be very helpful in providing evidence to ensure she gets the proper support and protection.",
  "7reply": "I think one of her friends took a picture of a bruise on Sarah's arm a while ago, but I'll have to ask them.",
  "7reply2": "If it's safe for you to provide images, it could be very helpful for the authorities or school to take this seriously and act quickly. However, please don't put yourself or anyone else in danger trying to get it.\n\nIf you're able to upload it here, we can ensure it's handled confidentially and used to protect Sarah.",
  8: "Thank you. The tipster has also mentioned that Tyler is actively threatening Sarah’s friends. I suggest including that in your outreach to Emmitt—he may be afraid to speak up as well.",
  "8reply": "Already noted. I’ll ensure Coach Johnson reassures Emmitt that his safety is a priority and that the school will protect him if he chooses to come forward.",
  9: "Thank you. Please stay safe. The information you've provided is incredibly valuable, and we'll act on it. Let us know if there's anything else you think we should know.",
  "9reply": "Alright, I'll try. Thanks for helping.",
  "9reply2": "You're welcome. You're making a big difference by speaking up. Reach out anytime."
}