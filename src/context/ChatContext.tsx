import { createContext, createSignal, useContext } from "solid-js";
import type { Case, Counselor, Message } from "../common/types/types";
import { tips } from '../data/tips.json';
import { schools } from '../data/schools.json';
import { counselors } from '../data/counselors.json';

const ChatContext = createContext();

export function ChatProvider(props:any) {
  const [reporterMessages, setReporterMessages] = createSignal<Message[]>([]);
  const [teamMessages, setTeamMessages] = createSignal<Message[]>([]);
  const [activeCounselor, setActiveCounselor] = createSignal<Counselor | undefined>(
    counselors.find((c:Counselor) => c.id === "2d57065b-3230-4f0f-b2ba-c8814d4d4c50")
  );
  const [selectedCase, setSelectedCase] = createSignal<Case | null>(null);

  return (
    <ChatContext.Provider
      value={{
        selectedCase: [selectedCase, setSelectedCase],
        activeCounselor: [activeCounselor, setActiveCounselor],
        reporterChat: [reporterMessages, setReporterMessages],
        teamChat: [teamMessages, setTeamMessages],
        tips,
        schools,
        counselors
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export function useChatContext() { return useContext(ChatContext); }