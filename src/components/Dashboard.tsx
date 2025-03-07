import { createEffect, createSignal, onMount } from "solid-js";
import type { Signal } from "solid-js";
import { useChatContext } from "../context/ChatContext";
import "./Dashboard.css";
import ToolBar from "./dashboard/ToolBar";
import { Case, Counselor, Message, School, Tip } from '../common/types/types';
import Chat from "./dashboard/chat/Chat";

export default function Dashboard(props:any) {
  const { selectedCase, activeCounselor, schools, reporterChat, teamChat, rootMessages, rootTips } = 
    useChatContext() as {
      selectedCase:Signal<Case | null>, 
      activeCounselor:Signal<Counselor>, 
      schools:School[], 
      tips:Tip[], 
      reporterChat:Signal<Message[]>, 
      teamChat:Signal<Message[]>,
      rootMessages:Signal<{}>
      rootTips:Signal<Tip[]>
    }; 
  const [reporterMessages, setReporterMessages] = reporterChat;
  const [teamMessages, setTeamMessages] = teamChat;
  const [activeTipId, setActiveTipId] = createSignal<string | null>(null);
  const [activeCase, setActiveCase] = selectedCase;
  const [counselor, setCounselor] = activeCounselor;
  const [messages, setMessages] = rootMessages;
  const [tips, setTips] = rootTips;
  
  onMount(() => {
    setActiveTipId('TIP-5600');
  })

  createEffect(() => {
    if(activeTipId()){
      const newCase = tips().find((tip) => tip.tipId === activeTipId()) || null;

      if(newCase){
        setActiveCase({
          ...newCase,
          school: schools.find(s => s.id === newCase.schoolId) 
        });
      } else {
        setActiveCase(null)
      }
      setReporterMessages(messages()[activeTipId()]?.reporterDialog || [])
      setTeamMessages(messages()[activeTipId()]?.teamComm || [])
    }
  });
  
  const handleTipUpdate = (tipId:string) => {
    const newCase = tips().find((tip) => tip.tipId === tipId) || null;
    setActiveTipId(tipId);
    removeUnreads(tipId);
    if(newCase){
      setActiveCase({
        ...newCase,
        school: schools.find(s => s.id === newCase.schoolId) 
      });
    } else {
      setActiveCase(null)
    }
  }

  const updateRootMessages = (target:string, newMessages:Message[]) => {
    if(target === "reporter"){
      setMessages({
        ...messages(),
        [activeTipId() as string]: {
          ...messages()[activeTipId()],
          reporterDialog: newMessages
        }
      });
    } else {
      setMessages({
        ...messages(),
        [activeTipId() as string]: {
          ...messages()[activeTipId()],
          teamComm: newMessages
        }
      });
    }
  }

  const updateRootTip = () => {
    setTips(
      tips().map(tip => {
        if(tip.tipId === activeTipId()){
          return activeCase()
        }
        return tip
      })
    );
  }

  const assignTip = () => {
    setTips(
      tips().map(tip => {
        if(tip.tipId === "TIP-8999"){
          return {
            ...tip,
            "assignedTo": "2d57065b-3230-4f0f-b2ba-c8814d4d4c50",
            "unread": 1
          }
        }
        return tip
      })
    );
  }
  const removeUnreads = (id:string) => {
    setTips(
      tips().map(tip => {
        if(tip.tipId === id){
          return {
            ...tip,
            "unread": 0
          }
        }
        return tip
      })
    );
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
          updateRootMessages={updateRootMessages}
          updateRootTip={updateRootTip}
          setActiveCase={setActiveCase}
          activeCounselor={counselor()}
          assignTip={assignTip}
        />
        <Chat 
          target="team" 
          tipId={activeTipId()} 
          case={activeCase()}
          messages={teamMessages()}
          setMessages={setTeamMessages}
          updateRootMessages={updateRootMessages}
          updateRootTip={updateRootTip}
          setActiveCase={setActiveCase}
          activeCounselor={counselor()}
          assignTip={assignTip}
        />
      </div>
    </main>
  );
}