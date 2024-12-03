import { createEffect, createSignal, For, Show } from "solid-js";
import type { Signal } from "solid-js";
import "./Chat.css";
import { format } from 'date-fns';
import type { Message, User } from "./types";
import { DIALOG_TYPE, USERS } from '/src/common/constants/constants'
import { useChatContext } from "/src/context/ChatContext";
import { messages } from '/src/data/messages.json'; 

export default function Chat(props:any) {
  const {reporterChat, teamChat} = useChatContext() as {reporterChat:Signal<Message[]>, teamChat:Signal<Message[]>};
  const [reporterMessages, setReporterMessages] = reporterChat;
  //const [reporterMessages, setReporterMessages] = createSignal<Message[]>(messages);
  const [teamMessages, setTeamMessages] = teamChat;
  const [activeAction, setActiveAction] = createSignal<string | null>(null);
  const [chatMessage, setChatMessage] = createSignal("");

  const display = DIALOG_TYPE[props.target as keyof typeof DIALOG_TYPE];
  let chatContainerRef: HTMLDivElement | undefined;

  const scrollToBottom = () => {
    if (chatContainerRef) {
      chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    }
  };

  createEffect(() => {
    if (reporterMessages().length && props.target === 'reporter') {
      scrollToBottom();
    }
  });
  createEffect(() => {
    if (teamMessages().length && props.target === 'team') {
      scrollToBottom();
    }
  });

  const createMessage = (user: User, text: string) => {
    const messageDate =  new Date();
    
    return {
      id: 12345,
      text,
      user,
      timestamp: messageDate.toDateString()
    }
  };

  const sendMessage = (newMessage:Message) => {
    if(props.target === "reporter") {
      setReporterMessages([...reporterMessages(), newMessage]);
    } else {
      setTeamMessages([...teamMessages(), newMessage]);
    }
    
  };

  const handleMessageSubmit = (e: Event) => {
    e.preventDefault();
    const newMessage = createMessage(USERS.counselor, chatMessage())
    sendMessage(newMessage);
    setChatMessage("");
  };

  const openAction = (buttonKey:string) => {
    setActiveAction(buttonKey === activeAction() ? null : buttonKey);
  };

  return (
    <div class="chat-wrapper">
      <div class={`chat-title ${display.style}`}>
        <Show when={display.style === 'team'}>
          {display.name} Communication
        </Show>
        <Show when={display.style === 'reporter'}>
          {display.name} Dialog — {`${props.tipId} `}
          <Show when={props.case?.lifeSafety}>
            <i class="fa-solid fa-triangle-exclamation fa danger"/>
          </Show>
        </Show>
      </div>

      {/* icon buttons */}
      <div class="chat-tool-icons">
        <Show when={display.style === 'reporter'}>
          <button class="icon" onClick={() => openAction('tags')}>
            <i class={`fa-solid fa-tags fa-lg ${activeAction() === 'tags' ? 'icon-active' : ''}`}></i>
          </button>
        </Show>
        <button class="icon" onClick={() => openAction('team')}>
          <i class={`fa fa-user-group fa-lg ${activeAction() === 'team' ? 'icon-active' : ''}`}></i>
        </button>       
        <button class="icon" onClick={() => openAction('attach')}>
          <i class={`fa fa-paperclip fa-lg ${activeAction() === 'attach' ? 'icon-active' : ''}`}></i>
        </button>
        <button class="icon" onClick={() => openAction('canned')}>
          <i class={`fa fa-comment-medical fa-lg ${activeAction() === 'canned' ? 'icon-active' : ''}`}></i>
        </button>       
      </div>

      {/* case details */}
      <div class="case-details">
        <Show when={display.style === 'reporter'}>
          <div>Case type: {props.case?.tipType}</div>
          <div>|</div>
          <div>Status: {props.case?.status}</div>
        </Show>
      </div>

      {/* case messages */}
      <div class="message-wrapper" ref={chatContainerRef}>
        <ul class="message-list">
          <For each={props.target === "reporter" ? reporterMessages() : teamMessages()}>
            {(message) => (
              <li class={`message-element message-element-${message.user.role}`}>
                <div class="message-element-avatar">
                  <img src={`/src/assets/icons/${message.user.role}.svg`} alt={`${message.user.role} icon`} /> 
                </div>
                <div>
                  <span class="bold-author">{message.user.displayName}</span> <i class="fa-solid fa-circle-info fa-sm"></i>
                </div>
                <div class="message-element-date">{format(message.timestamp, 'MM/dd/yyyy hh:mm aa')}</div>
                
                <div class="message-element-text">
                  {message.text}
                </div>
              </li>
            )}
          </For>
        </ul>
      </div>

      {/* case input */}
      <div class={`chat-input ${display.style}`}>
        <textarea 
          name="message-to-send" 
          id="message-to-send" 
          placeholder={`Message to ${display.name}...`} 
          rows="2"
          value={chatMessage()}
          onInput={(e) => setChatMessage(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && handleMessageSubmit(e)}></textarea>            
          
          <button class="message-send" onClick={handleMessageSubmit}>Send</button>       
      </div>
      
      <div class={`chat-dim-layer ${activeAction() ? 'chat-dim-layer-show' : ''}`} 
          onClick={() => setActiveAction(null)}>
            <div class="action-wrapper">
              <div class="close-icon-wrapper">
                <button class="close-icon" onClick={() => setActiveAction(null)}>
                  <i class="fa-solid fa-xmark fa-xl"></i>
                </button>
              </div>
            </div>
      </div>
    </div>
  );
}