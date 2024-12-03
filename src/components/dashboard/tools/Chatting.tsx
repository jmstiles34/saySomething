import { createSignal, For, JSX, Show } from 'solid-js';
import type { Signal } from "solid-js";
import type { Message, User } from "/src/components/chat/types";
import "./Chatting.css";
import { useChatContext } from "/src/context/ChatContext";
import { USERS } from '/src/common/constants/constants';

type RecipientType = 'reporter' | 'team';
type SenderType = 'reporter' | 'team';

export default function Chatting(props:any) {
  const {reporterChat, teamChat} = useChatContext() as {reporterChat:Signal<Message[]>, teamChat:Signal<Message[]>};
  const [reporterMessages, setReporterMessages] = reporterChat;
  const [teamMessages, setTeamMessages] = teamChat;
  
  const [message, setMessage] = createSignal("");
  const [sender, setSender] = createSignal('team');
  const [recipient, setRecipient] = createSignal('reporter');

  const createMessage = (text: string) => {
    return {
      id: 12345,
      text,
      user: sender() === 'team' ? USERS.collaborator : USERS.reporter,
      timestamp: new Date()
    }
  };

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
        </fieldset>
      </div>
      <div>
        <fieldset class="radio-group">
          <legend>Choose Recipient</legend>
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
        <button class="message-send" onClick={handleMessageSubmit}>Send to {recipient()}</button>
      </div>
    </div>
  );
}