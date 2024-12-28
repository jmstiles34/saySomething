import { createSignal, For, JSX, Show } from 'solid-js';
import type { Signal } from "solid-js";
import type { Case, Message } from "../../../common/types/types";
import "./Chatting.css";
import { useChatContext } from "../../../context/ChatContext";
import { USERS } from '../../../common/constants/constants';
import { MESSAGE_TYPE } from '../../../common/constants/constants';

type RecipientType = 'reporter' | 'team';
type SenderType = 'reporter' | 'team';

export default function Chatting(props:any) {
  const {selectedCase, reporterChat, teamChat} = useChatContext() as {
    selectedCase:Signal<Case | null>,
    reporterChat:Signal<Message[]>, 
    teamChat:Signal<Message[]>
  };
  const [reporterMessages, setReporterMessages] = reporterChat;
  const [teamMessages, setTeamMessages] = teamChat;
  const [activeCase, setActiveCase] = selectedCase;
  
  const [message, setMessage] = createSignal("");
  const [sender, setSender] = createSignal('team');
  const [recipient, setRecipient] = createSignal('reporter');
  const [teamMember, setTeamMember] = createSignal('');

  const createMessage = (text: string) => {
    return {
      id: crypto.randomUUID(),
      type: MESSAGE_TYPE.CHAT,
      text,
      sender: getSender(),
      timestamp: new Date()
    }
  };

  const getSender = () => {
    if(sender() === 'reporter') return USERS.reporter;

    const user = activeCase()?.school?.staff?.filter(s => s.id === teamMember())[0];

    return {
      id: teamMember(),
      displayName: `${user?.firstName} ${user?.lastName}`,
      role: "collaborator",
      status: 1,
      title: user?.title,
  }
  }

  const sendMessage = (newMessage:Message) => {
    if(recipient() === "reporter") {
      setReporterMessages([...reporterMessages(), newMessage]);
    } else {
      setTeamMessages([...teamMessages(), newMessage]);
    }
  };

  const handleMessageSubmit = (e: Event) => {
    e.preventDefault();
    sendMessage(createMessage(message()));
    setMessage("");
  };

  const handleRecipientChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    const value = event.currentTarget.value as RecipientType;
    setRecipient(value);
  };

  const handleSenderChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    const value = event.currentTarget.value as SenderType;
    setSender(value);
    if(value === 'reporter'){
      setRecipient('reporter');
    }
  };

  const handleSenderSelection: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (event) => {
    const value = event.currentTarget.value as string;
    console.log(value)
    setTeamMember(value);
  }

  const buttonIsDisabled = () => {
    return !message().length || (sender() === 'team' && teamMember() === '')
  }

  return (
    <div class="chatting-container">
      <div> 
        <fieldset class="radio-group">
          <legend>Choose Sender</legend>
          <div class="radio-option">
            <input
              type="radio"
              id="send-reporter"
              name="sender"
              value="reporter"
              checked={sender() === 'reporter'}
              onChange={handleSenderChange}
            />
            <label for="send-reporter">Reporter</label>
          </div>
          <div class="radio-option">
            <input
              type="radio"
              id="send-team"
              name="sender"
              value="team"
              checked={sender() === 'team'}
              onChange={handleSenderChange}
            />
            <label for="send-team">Collaborator</label>
          </div>
          <div>
            <select 
              name="collaborator" 
              class="filter-select" 
              disabled={sender() === 'reporter'}
              onChange={handleSenderSelection}
            >
            <option value="">Choose sender...</option>
              <For each={activeCase()?.school?.staff}>
                {(user) => (
                  <option value={user.id}>{user.firstName} {user.lastName}</option>
                )}
              </For>
            </select>
          </div>
          
        </fieldset>
      </div>
      <div>
        <fieldset class="radio-group">
          <legend>Choose Target</legend>
          <div class="radio-option">
            <input
              type="radio"
              id="reporter"
              name="recipient"
              value="reporter"
              checked={recipient() === 'reporter'}
              onChange={handleRecipientChange}
            />
            <label for="reporter">Reporter Dialog</label>
          </div>
          <div class="radio-option">
            <input
              type="radio"
              id="team"
              name="recipient"
              value="team"
              disabled={sender() === 'reporter'}
              checked={recipient() === 'team'}
              onChange={handleRecipientChange}
            />
            <label for="team">Team Dialog</label>
          </div>
        </fieldset>
      </div>
      <div>
        <textarea 
          name="message-to-send" 
          id="message-to-send" 
          placeholder={`Message to ${recipient()}...`} 
          rows="2"
          value={message()}
          onInput={(e) => setMessage(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && handleMessageSubmit(e)} />
      </div>
      <div class="send-button">
        <button 
          class="message-send" 
          onClick={handleMessageSubmit}
          disabled={buttonIsDisabled()}
        >Send to {recipient()}</button>
      </div>
    </div>
  );
}