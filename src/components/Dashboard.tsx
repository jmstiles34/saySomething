import { createEffect, createSignal, onMount } from "solid-js";
import type { Signal } from "solid-js";
import { useChatContext } from "/src/context/ChatContext";
import { messages } from '/src/data/messages.json';
import type { Message } from "./types";
import "./Dashboard.css";
import ToolBar from "./dashboard/ToolBar";
import { Case, Counselor, School, Tip } from '../common/types/types';
import Chat from "./dashboard/chat/Chat";

export default function Dashboard(props:any) {
  const {counselors, schools, tips, reporterChat, teamChat} = 
    useChatContext() as {
      counselors:Counselor[], 
      schools:School[], 
      tips:Tip[], 
      reporterChat:Signal<Message[]>, 
      teamChat:Signal<Message[]>
    };
  const [reporterMessages, setReporterMessages] = reporterChat;
  const [teamMessages, setTeamMessages] = teamChat;
  const [activeTipId, setActiveTipId] = createSignal<string | null>(null);
  const [activeCase, setActiveCase] = createSignal<Case | null>(null);
  const [activeCounselor, setActiveCounselor] = createSignal<Counselor | undefined>(
    counselors.find(c => c.id === "2d57065b-3230-4f0f-b2ba-c8814d4d4c50")
  );

  onMount(() => {
    setActiveTipId('TIP-5600');
  })

  createEffect(() => {
    if(activeTipId()){
      const newCase = tips.find((tip) => tip.tipId === activeTipId()) || null;

      if(newCase){
        setActiveCase({
          ...newCase,
          school: schools.find(s => s.id === newCase.schoolId) 
        });
      } else {
        setActiveCase(null)
      }
      setReporterMessages(messages[activeTipId()]?.reporterDialog || [])
      setTeamMessages(messages[activeTipId()]?.teamComm || [])
    }
  });

  const handleTipUpdate = (tipId:string) => {
    const newCase = tips.find((tip) => tip.tipId === tipId) || null;
    setActiveTipId(tipId);
    if(newCase){
      setActiveCase({
        ...newCase,
        school: schools.find(s => s.id === newCase.schoolId) 
      });
    } else {
      setActiveCase(null)
    }
  }

  return (
    <main>
      <ToolBar 
        tipId={activeTipId()}
        handleTipUpdate={handleTipUpdate}
        activeCounselor={activeCounselor()}
      />

      <div class="tip-dash-chat">
        <Chat 
          target="reporter" 
          tipId={activeTipId()} 
          case={activeCase()}
          messages={reporterMessages()}
          setMessages={setReporterMessages}
          setActiveCase={setActiveCase}
          activeCounselor={activeCounselor()}
        />
        <Chat 
          target="team" 
          tipId={activeTipId()} 
          case={activeCase()}
          messages={teamMessages()}
          setMessages={setTeamMessages}
          setActiveCase={setActiveCase}
          activeCounselor={activeCounselor()}
        />
      </div>
    </main>
  );
}