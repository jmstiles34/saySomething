import { createEffect, createSignal, For, Show } from "solid-js";
import type { Signal } from "solid-js";
import { type Editor as TinyEditor } from "tinymce";
import DOMPurify from 'dompurify';
import Editor  from "tinymce-solid";
import "./Chat.css";
import { format, isSameDay } from 'date-fns';
import type { Contact, Message, User } from "./types";
import { DIALOG_TYPE, USERS } from '/src/common/constants/constants'
import { useChatContext } from "/src/context/ChatContext";
import { messages } from '/src/data/messages.json';
import { contacts } from '/src/data/contacts.json'; 
import { getOrdinalSuffix } from '/src/common/utils/utils';

export default function Chat(props:any) {
  const {reporterChat, teamChat} = useChatContext() as {reporterChat:Signal<Message[]>, teamChat:Signal<Message[]>};
  const [reporterMessages, setReporterMessages] = reporterChat;
  //const [reporterMessages, setReporterMessages] = createSignal<Message[]>(messages[props.tipId]?.reporterDialog || []);
  const [teamMessages, setTeamMessages] = teamChat;
  //const [teamMessages, setTeamMessages] = createSignal<Message[]>(messages[props.tipId]?.teamComm || []);
  const [activeAction, setActiveAction] = createSignal<string | null>(null);
  const [chatMessage, setChatMessage] = createSignal("");
  const [showNamesPopover, setShowNamesPopover] = createSignal(false);
  const [showCannedPopover, setShowCannedPopover] = createSignal(false);
  const [filteredContacts, setFilteredContacts] = createSignal<Contact[]>(contacts);
  const [uniqueReporterDates, setUniqueReporterDates] = createSignal<string[]>([]);
  const [uniqueTeamDates, setUniqueTeamDates] = createSignal<string[]>([]);

  const display = DIALOG_TYPE[props.target as keyof typeof DIALOG_TYPE];
  let chatContainerRef: HTMLDivElement | undefined;
  let editorRef!: TinyEditor;
  
  const scrollToBottom = () => {
    if (chatContainerRef) {
      chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    }
  };

  createEffect(() => {
    if (reporterMessages().length && props.target === 'reporter') {
      setUniqueReporterDates([...new Set(
        reporterMessages().map(msg => new Date(msg.timestamp).toDateString())
      )])
    }
  });
  createEffect(() => {
    if (teamMessages().length && props.target === 'team') {
      setUniqueTeamDates([...new Set(
        teamMessages().map(msg => new Date(msg.timestamp).toDateString())
      )])
    }
  });
  createEffect(() => {
    if ((reporterMessages().length || uniqueReporterDates().length) && props.target === 'reporter') {
      setTimeout(() => scrollToBottom(), 100);
    }
  });
  createEffect(() => {
    if ((teamMessages().length || uniqueTeamDates().length) && props.target === 'team') {
      setTimeout(() => scrollToBottom(), 500);
    }
  });
  createEffect(() => {
    setReporterMessages(messages[props.tipId]?.reporterDialog || [])
    setTeamMessages(messages[props.tipId]?.teamComm || [])
  });

  const moveCursorToEnd = () => {
    editorRef.focus();
    const lastElement = editorRef.getBody().lastChild;
    if(lastElement){
      editorRef.selection.select(lastElement);
      editorRef.selection.collapse(false);
    }
  }

  const createMessage = (user: User, text: string) => {
    const messageDate =  new Date();
    
    return {
      id: 12345,
      text,
      user,
      timestamp: messageDate
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

  const handleInput = (text:string): void => {
    setChatMessage(text);
    const lastChar = text[text.length - 1];
    if (lastChar === '@') {
      setShowNamesPopover(true);
    } else if (lastChar === '/') {
      setShowCannedPopover(true);
    } else {
      if (text.includes("/")) (true);
      const mentionMatch = text.match(/@([^@\s]*)$/);
      if (mentionMatch) {
        const searchTerm = mentionMatch[1].toLowerCase();
        setFilteredContacts(contacts.sort((a:Contact, b:Contact) => a.name.localeCompare(b.name)).filter((contact:Contact) =>
          contact.name.toLowerCase().includes(searchTerm)
        ));
      } else {
        setShowNamesPopover(false);
      }
    }
                
    // Close canned responses if not immediately after /
    if (!text.endsWith('/')) {
      setShowCannedPopover(false);
    }
  };
  const handleInput2 = (key:string, content:string): void => {
    const rawContent = stripHtmlTags(content) + key;
    if (key === '@') {
      setShowNamesPopover(true);
    } else if (key === '/') {
      setShowCannedPopover(true);
    } else {
      //console.log(rawContent)
      //if (text.includes("/")) (true);
      const mentionMatch = rawContent.match(/@([^@\s]*)$/);
      if (mentionMatch) {
        const searchTerm = mentionMatch[1].toLowerCase();
        setFilteredContacts(contacts.sort((a:Contact, b:Contact) => a.name.localeCompare(b.name)).filter((contact:Contact) =>
          contact.name.toLowerCase().includes(searchTerm)
        ));
      } else {
        setShowNamesPopover(false);
      }
    }
                
    // Close canned responses if not immediately after /
    if (key !== '/') {
      setShowCannedPopover(false);
    }
  };

  const stripHtmlTags = (html:string) => {
    return DOMPurify.sanitize(html, {ALLOWED_TAGS: []});
  }

  const formatMessageGroupDate = (date:Date) => {
    const day = format(date, 'd');
    const suffix = getOrdinalSuffix(Number(day));
    return format(date, `EEEE, MMMM d`) + suffix;
  }

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
        <div class="group-wrapper" onClick={() => openAction('team')}>
          <button class="icon">
            <i class={`fa fa-user-group fa-lg ${activeAction() === 'team' ? 'icon-active' : ''}`}></i>
          </button>
          {props.case?.stakeholders.length} 
        </div>
        <Show when={display.style === 'reporter'}>
          <button class="icon" onClick={() => openAction('tags')}>
            <i class={`fa-solid fa-tags fa-lg ${activeAction() === 'tags' ? 'icon-active' : ''}`}></i>
          </button>
        </Show>      
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
        <For each={props.target === "reporter" ? uniqueReporterDates() : uniqueTeamDates()}>  
          {(mDate) => (
            <div class="message-group-wrapper">
              <div class="message-group-date">
                {formatMessageGroupDate(new Date(mDate))}
              </div>
              <ul class="message-list">
                <For each={props.target === "reporter" ? 
                    reporterMessages().filter(({timestamp}) => isSameDay(new Date(mDate), new Date(timestamp))) 
                    : teamMessages().filter(({timestamp}) => isSameDay(new Date(mDate), new Date(timestamp)))
                }>
                  {(message) => (
                    <li class={`message-element message-element-${message.user.role}`}>
                      <div class="message-element-avatar">
                        <img src={`/src/assets/icons/${message.user.role}.svg`} alt={`${message.user.role} icon`} /> 
                      </div>
                      <div class="bold-author">
                        {message.user.displayName}
                      </div>
                      <div class="message-element-date">{format(message.timestamp, 'h:mm aa')}</div>
                      
                      <div innerHTML={message.text} class="message-element-text"/>
                      {/* <div class="message-element-text">
                        {message.text}
                      </div> */}
                    </li>
                  )}
                </For>
              </ul>
            </div>
          )}
        </For>
      </div>

      {/* case input */}
      <div id="editor" class={`chat-input ${display.style}`}>
        <Show when={showCannedPopover()}>
          <div class="popover">
            {/* <For each={cannedResponses}>
              {(response) => (
                <div class="popover-item" onClick={() => {
                  setCounselorMessage(response)
                  setShowCannedPopover(false);
                  }}>
                  {response}
                </div>
              )}
            </For> */}
          </div>
        </Show> 
        <Show when={showNamesPopover()}>
          <div class="popover">
          <For each={filteredContacts().filter((contact) => props.case.stakeholders.includes(contact.id))}>
              {(contact) => (
                <div class="popover-item" onClick={() => {
                  const atInd = chatMessage().indexOf('@');
                  setChatMessage(chatMessage().substring(0, atInd) + `<span style="background-color: #c5eff6;">@${contact.name}</span> <span>&nbsp;</span>`)
                  setShowNamesPopover(false);
                  //document.getElementById(`message-box-${display.style}`)?.focus();
                  moveCursorToEnd();
                }}>
                  <i class="fa-regular fa-circle-user"></i> <strong>{contact.name}</strong>
                </div>
              )}
            </For>
            <div class="popover-item" onClick={async () => {
              const atInd = chatMessage().indexOf('@');
              await setChatMessage(chatMessage().substring(0, atInd) + `<span style="background-color: #c5eff6;">@channel</span> <span>&nbsp;</span>`)
              setShowNamesPopover(false);
              //document.getElementById(`message-box-${display.style}`)?.focus();
              moveCursorToEnd();
            }}>
              <i class="fa-solid fa-bullhorn"></i> <strong>@channel</strong> Notify everyone in this chat.
            </div>
            <div class="popover-item" onClick={() => {
              const atInd = chatMessage().indexOf('@');
              setChatMessage(chatMessage().substring(0, atInd) + `<span style="background-color: #c5eff6;">@here</span> <span>&nbsp;</span>`)
              setShowNamesPopover(false);
              //document.getElementById(`message-box-${display.style}`)?.focus();
              moveCursorToEnd();
            }}>
              <i class="fa-solid fa-bullhorn"></i> <strong>@here</strong> Notify every online member in this chat.
            </div>
            <For each={filteredContacts().filter((contact) => !props.case.stakeholders.includes(contact.id))}>
              {(contact) => (
                <div class="popover-item" onClick={() => {
                  const atInd = chatMessage().indexOf('@');
                  setChatMessage(chatMessage().substring(0, atInd) + `<span style="background-color: #c5eff6;">@${contact.name}</span> <span>&nbsp;</span>`)
                  setShowNamesPopover(false);
                  //document.getElementById(`message-box-${display.style}`)?.focus();
                  moveCursorToEnd();
                }}>
                  <i class="fa-regular fa-circle-user"></i>
                  <div><strong>{contact.name}</strong></div>
                  <div class="popover-align-end">Not in chat.</div>
                </div>
              )}
            </For>
          </div>
        </Show>
        <div class="editor-anchor">
        {/* <textarea 
          id={`message-box-${display.style}`} 
          placeholder={`Message to ${display.name}...`} 
          rows="2"
          value={chatMessage()}
          onInput={(e) => handleInput(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && handleMessageSubmit(e)}></textarea>  */}

          <Editor
          id={`message-box-${display.style}`}
          ref={editorRef}
        apiKey="zmj3mwd02jhm0petatetozceb2u06fqhpz8f9y9oi9bnihcr"
        value={chatMessage()}
        onInit={(_content: string, editor: TinyEditor) => (editorRef = editor)}
        init={{
          menubar: false,
          height: 125,
          resize: false,
          width: "100%",
          statusbar: false,
          placeholder: `Message to ${display.name}...`,
          setup: function(editor) {
            editor.on('keypress', function(e) {
              handleInput2(e.key, editor.getContent());
            });
          },
          plugins:
            "advlist advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
          toolbar:
            "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code | removeformat | help",
        }}
        onEditorChange={(content: string, editor: TinyEditor) => {
          // you can also access the editor's content via its own accessor
          // const newContent = editor.getContent();
          setChatMessage(content);
        }}
      />           
         </div> 
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