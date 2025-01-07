import { createContext, createSignal, useContext } from "solid-js";
import type { Case, Counselor, Message } from "../common/types/types";
import { tips } from '../data/tips.json';
import { schools } from '../data/schools.json';
import { counselors } from '../data/counselors.json';
import { messages } from '../data/messages.json';
import { subHours, subMinutes } from 'date-fns'

const ChatContext = createContext();
const seedTips = ["TIP-6832", "TIP-5600", "TIP-2315", "TIP-8999"];
const TIME_OFFSET = {
  "TIP-6832": 50,
  "TIP-5600": 35,
  "TIP-2315": 20,
  "TIP-8999": 4
}
export function ChatProvider(props:any) {
  const [reporterMessages, setReporterMessages] = createSignal<Message[]>([]);
  const [teamMessages, setTeamMessages] = createSignal<Message[]>([]);
  const [activeCounselor, setActiveCounselor] = createSignal<Counselor | undefined>(
    counselors.find((c:Counselor) => c.id === "2d57065b-3230-4f0f-b2ba-c8814d4d4c50")
  );
  const [selectedCase, setSelectedCase] = createSignal<Case | null>(null);

  const randomBetween = (min:number, max:number) => {    
    if (min > max) {
      [min, max] = [max, min]
    }  
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  const resetTimeStamps = () => {
    const tempMessages = {...messages};
    seedTips.forEach(tip => {
      const timeOffset = TIME_OFFSET[tip as keyof typeof TIME_OFFSET]; 
      const rdMultiplier = timeOffset/tempMessages[tip].reporterDialog.length;
      const tcMultiplier = tempMessages[tip].teamComm.length ? timeOffset/tempMessages[tip].teamComm.length : timeOffset;

      tempMessages[tip].reporterDialog = tempMessages[tip].reporterDialog.map(
        (m,i) => {
          const multiplier = rdMultiplier*i;
          const hourOffset = i === 0 ? timeOffset : timeOffset - (randomBetween(multiplier-(rdMultiplier), multiplier));
          return {...m, timestamp: subMinutes(new Date(), Math.abs(hourOffset))}
      })
      tempMessages[tip].teamComm = tempMessages[tip].teamComm.map(
        (m,i) => {
          const multiplier = tcMultiplier*i;
          const hoursOffset = i === 0 ? timeOffset : timeOffset - (randomBetween(multiplier-(tcMultiplier), multiplier));
          return {...m, timestamp: subMinutes(new Date(), Math.abs(hoursOffset))}
      })
    });
    
    return tempMessages
  }
  const [rootMessages, setRootMessages] = createSignal(resetTimeStamps());

  return (
    <ChatContext.Provider
      value={{
        selectedCase: [selectedCase, setSelectedCase],
        activeCounselor: [activeCounselor, setActiveCounselor],
        reporterChat: [reporterMessages, setReporterMessages],
        teamChat: [teamMessages, setTeamMessages],
        tips,
        schools,
        counselors,
        rootMessages: [rootMessages, setRootMessages]
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export function useChatContext() { return useContext(ChatContext); }