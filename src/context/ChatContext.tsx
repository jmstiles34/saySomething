import { createContext, createSignal, useContext } from "solid-js";
import type { Message } from "~/components/chat/types";

const ChatContext = createContext();

export function ChatProvider(props:any) {
  const [reporterMessages, setReporterMessages] = createSignal<Message[]>([]);
  const [teamMessages, setTeamMessages] = createSignal<Message[]>([]);

  return (
    <ChatContext.Provider
      value={{
        reporterChat: [reporterMessages, setReporterMessages],
        teamChat: [teamMessages, setTeamMessages]
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export function useChatContext() { return useContext(ChatContext); }