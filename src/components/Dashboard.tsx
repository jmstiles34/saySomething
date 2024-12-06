import { createEffect, createSignal } from "solid-js";
import type { Signal } from "solid-js";
import { useChatContext } from "/src/context/ChatContext";
import { messages } from '/src/data/messages.json';
import type { Message } from "./types";
import "./Dashboard.css";
import BurgerButton from "./dashboard/BurgerButton";
import ToolPanel from "./dashboard/ToolPanel";
import CaseBar from "./dashboard/CaseBar";
import { Tip } from './dashboard/chat/types';
import Chat from "./dashboard/chat/Chat";

export default function Dashboard() {
  const {reporterChat, teamChat} = useChatContext() as {reporterChat:Signal<Message[]>, teamChat:Signal<Message[]>};
  const [reporterMessages, setReporterMessages] = reporterChat;
  const [teamMessages, setTeamMessages] = teamChat;
  const [selectedNav, setSelectedNav] = createSignal("");
  const [activeTipId, setActiveTipId] = createSignal<string | null>('TIP-014');
  const [activeCase, setActiveCase] = createSignal<Tip | null>(null);

  createEffect(() => {
    setReporterMessages(messages[activeTipId()]?.reporterDialog || [])
    setTeamMessages(messages[activeTipId()]?.teamComm || [])
  });

  return (
    <main>
      <BurgerButton setSelectedNav={setSelectedNav} />
      <CaseBar activeTipId={activeTipId} setActiveCase={setActiveCase} setActiveTipId={setActiveTipId} />
      <ToolPanel selectedNav={selectedNav} setSelectedNav={setSelectedNav} activeTipId={activeTipId} setActiveCase={setActiveCase} setActiveTipId={setActiveTipId} />
      <div class="tip-dash-chat">
        <Chat 
          target="reporter" 
          tipId={activeTipId()} 
          case={activeCase()}
          messages={reporterMessages()}
          setMessages={setReporterMessages}
        />
        <Chat 
          target="team" 
          tipId={activeTipId()} 
          case={activeCase()}
          messages={teamMessages()}
          setMessages={setTeamMessages}
        />
      </div>
    </main>
  );
}