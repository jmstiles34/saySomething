import { createContext, createSignal, useContext } from "solid-js";
import type { Message } from "/src/common/types/types";
import { tips } from '/src/data/tips.json';
import { schools } from '/src/data/schools.json';
import { counselors } from '/src/data/counselors.json';

const ChatContext = createContext();

export function ChatProvider(props:any) {
  const [reporterMessages, setReporterMessages] = createSignal<Message[]>([]);
  const [teamMessages, setTeamMessages] = createSignal<Message[]>([]);

  return (
    <ChatContext.Provider
      value={{
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