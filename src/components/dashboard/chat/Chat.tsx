import { createEffect, createSignal, For, Show } from "solid-js";
import type { Signal } from "solid-js";
import "./Chat.css";
import { format } from 'date-fns';
import type { Message, User } from "./types";
import { DIALOG_TYPE, USERS } from '~/common/constants/constants'
import { useChatContext } from "~/context/ChatContext";
import Drawer from "./Drawer";
import { messages } from '~/data/messages.json'; 

export default function Chat(props:any) {
  const {reporterChat, teamChat} = useChatContext() as {reporterChat:Signal<Message[]>, teamChat:Signal<Message[]>};
  //const [reporterMessages, setReporterMessages] = reporterChat;
  const [reporterMessages, setReporterMessages] = createSignal<Message[]>(messages);
  const [teamMessages, setTeamMessages] = teamChat;
  const [activeDrawer, setActiveDrawer] = createSignal<string | null>(null);
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
      console.log(reporterMessages())
    }
  });
  createEffect(() => {
    if (teamMessages().length && props.target === 'team') {
      scrollToBottom();
      console.log(teamMessages())
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

  const openDrawer = (buttonKey:string) => {
    setActiveDrawer(buttonKey === activeDrawer() ? null : buttonKey);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
  };

/*
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

      <div class="chat-body">
        <div class="chat-header">
          <div class="case-details">
            <Show when={display.style === 'reporter'}>
              <div>Case type: {props.case?.tipType}</div>
              <div>|</div>
              <div>Status: {props.case?.status}</div>
            </Show>
          </div>
          <div class="chat-tool-icons">
            <Show when={display.style === 'reporter'}>
              <button class="icon" onClick={() => openDrawer('tags')}>
                <i class={`fa-solid fa-tags fa-lg ${activeDrawer() === 'tags' ? 'icon-active' : ''}`}></i>
              </button>
            </Show>
            <button class="icon" onClick={() => openDrawer('team')}>
              <i class={`fa fa-user-group fa-lg ${activeDrawer() === 'team' ? 'icon-active' : ''}`}></i>
            </button>       
            <button class="icon" onClick={() => openDrawer('attach')}>
              <i class={`fa fa-paperclip fa-lg ${activeDrawer() === 'attach' ? 'icon-active' : ''}`}></i>
            </button>
            <button class="icon" onClick={() => openDrawer('canned')}>
              <i class={`fa fa-comment-medical fa-lg ${activeDrawer() === 'canned' ? 'icon-active' : ''}`}></i>
            </button>       
          </div>
        </div>
        
        <div class="chat-messages" ref={chatContainerRef}>
          <For each={props.target === "reporter" ? reporterMessages() : teamMessages()}>
            {(message) => (
              <div class={`message-element message-element-${message.user.role}`}>
                <div class="message-element-header">
                  <div class="message-element-avatar">
                    <img src={`icons/${message.user.role}.svg`} alt={`${message.user.role} icon`} /> 
                  </div>
                  <div class="message-element-header-col">
                    <div class="bold" >{message.user.displayName}</div>
                    <div>{message.user.title}</div>
                  </div>
                  <div class="message-element-date">{format(message.timestamp, 'MM/dd/yyyy hh:mm aa')}</div>
                </div>
                <div class="message-element-text">
                  {message.text}
                </div>
              </div>
            )}
          </For>
        </div>

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

        <div class={`chat-dim-layer ${activeDrawer() ? 'chat-dim-layer-show' : ''}`} onClick={() => closeDrawer()}></div>
        <Drawer activeDrawer={activeDrawer()} />
      </div>
    </div>
*/

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
      
      <div class="chat-body">
        <div class="chat-header">
          <div class="case-details">
            <Show when={display.style === 'reporter'}>
              <div>Case type: {props.case?.tipType}</div>
              <div>|</div>
              <div>Status: {props.case?.status}</div>
            </Show>
          </div>
          <div class="chat-tool-icons">
            <Show when={display.style === 'reporter'}>
              <button class="icon" onClick={() => openDrawer('tags')}>
                <i class={`fa-solid fa-tags fa-lg ${activeDrawer() === 'tags' ? 'icon-active' : ''}`}></i>
              </button>
            </Show>
            <button class="icon" onClick={() => openDrawer('team')}>
              <i class={`fa fa-user-group fa-lg ${activeDrawer() === 'team' ? 'icon-active' : ''}`}></i>
            </button>       
            <button class="icon" onClick={() => openDrawer('attach')}>
              <i class={`fa fa-paperclip fa-lg ${activeDrawer() === 'attach' ? 'icon-active' : ''}`}></i>
            </button>
            <button class="icon" onClick={() => openDrawer('canned')}>
              <i class={`fa fa-comment-medical fa-lg ${activeDrawer() === 'canned' ? 'icon-active' : ''}`}></i>
            </button>       
          </div>
        </div>
        
        <div class="chat-messages" ref={chatContainerRef}>
          <For each={props.target === "reporter" ? reporterMessages() : teamMessages()}>
            {(message) => (
              <div class={`message-element message-element-${message.user.role}`}>
                <div class="message-element-header">
                  <div class="message-element-avatar">
                    <img src={`icons/${message.user.role}.svg`} alt={`${message.user.role} icon`} /> 
                  </div>
                  <div class="message-element-header-col">
                    <div class="bold" >{message.user.displayName}</div>
                    <div>{message.user.title}</div>
                  </div>
                  <div class="message-element-date">{format(message.timestamp, 'MM/dd/yyyy hh:mm aa')}</div>
                </div>
                <div class="message-element-text">
                  {message.text}
                </div>
              </div>
            )}
          </For>
        </div>

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

        <div class={`chat-dim-layer ${activeDrawer() ? 'chat-dim-layer-show' : ''}`} onClick={() => closeDrawer()}></div>
        <Drawer activeDrawer={activeDrawer()} />
      </div>
    </div>
  );
}