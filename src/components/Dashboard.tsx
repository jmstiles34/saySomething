import { createEffect, createSignal, onMount } from "solid-js";
import type { Signal } from "solid-js";
import { useChatContext } from "../context/ChatContext";
import "./Dashboard.css";
import ToolBar from "./dashboard/ToolBar";
import { Case, Counselor, Message, School, Tip } from '../common/types/types';
import Chat from "./dashboard/chat/Chat";

export default function Dashboard(props:any) {
  const { selectedCase, activeCounselor, schools, tips, reporterChat, teamChat, messages } = 
    useChatContext() as {
      selectedCase:Signal<Case | null>, 
      activeCounselor:Signal<Counselor>, 
      schools:School[], 
      tips:Tip[], 
      reporterChat:Signal<Message[]>, 
      teamChat:Signal<Message[]>,
      messages:{}
    }; 
  const [reporterMessages, setReporterMessages] = reporterChat;
  const [teamMessages, setTeamMessages] = teamChat;
  const [activeTipId, setActiveTipId] = createSignal<string | null>(null);
  const [activeCase, setActiveCase] = selectedCase;
  const [counselor, setCounselor] = activeCounselor;

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
        counselorId={counselor().id}
      />

      <div class="tip-dash-chat">
        <Chat 
          target="reporter" 
          tipId={activeTipId()} 
          case={activeCase()}
          messages={reporterMessages()}
          setMessages={setReporterMessages}
          setActiveCase={setActiveCase}
          activeCounselor={counselor()}
        />
        <Chat 
          target="team" 
          tipId={activeTipId()} 
          case={activeCase()}
          messages={teamMessages()}
          setMessages={setTeamMessages}
          setActiveCase={setActiveCase}
          activeCounselor={counselor()}
        />
      </div>
    </main>
  );
}