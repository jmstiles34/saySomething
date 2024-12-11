import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { type Editor as TinyEditor } from "tinymce";
import DOMPurify from 'dompurify';
import Editor  from "tinymce-solid";
import "./Chat.css";
import { format, isSameDay } from 'date-fns';
import type { Contact, Message, User } from "./types";
import { DIALOG_TYPE, MESSAGE_TYPE, MODAL, POPOVER, USERS } from '/src/common/constants/constants'
import { contacts } from '/src/data/contacts.json'; 
import { getOrdinalSuffix } from '/src/common/utils/utils';
import Popover from './Popover';
import Canned from './popovers/Canned';
import Contacts from './popovers/Contacts';
import Modal from './Modal';
import Instructions from './modals/Instructions';
import Stakeholders from "./modals/Stakeholders";
import Tags from "./modals/Tags";

export default function Chat(props:any) {
  const [chatMessage, setChatMessage] = createSignal("");
  const [filteredContacts, setFilteredContacts] = createSignal<Contact[]>(contacts);
  const [modal, setModal] = createSignal<string | null>(null);
  const [popover, setPopover] = createSignal<string | null>(null);

  const display = DIALOG_TYPE[props.target as keyof typeof DIALOG_TYPE];
  let chatContainerRef: HTMLDivElement | undefined;
  let editorRef!: TinyEditor;
  const useRichEditor:boolean = false;
  
  createEffect(() => {
    if (props.messages.length) {
      scrollToBottom()
    }
  });

  const scrollToBottom = () => {
    if (chatContainerRef) {
      chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    }
  };

  const addCallMessage = (message:string) => {
    const newMessage = createMessage(USERS.counselor, message, MESSAGE_TYPE.CALL)
    sendMessage(newMessage);
  }

  const createMessage = (user: User, text: string, type = MESSAGE_TYPE.CHAT) => {
    return {
      id: crypto.randomUUID(),
      type,
      text,
      user,
      timestamp: new Date()
    }
  };

  const formatMessageGroupDate = (date:Date) => {
    const day = format(date, 'd');
    const suffix = getOrdinalSuffix(Number(day));
    return format(date, `EEEE, MMMM d`) + suffix;
  }

  const handleMessageSubmit = (e: Event) => {
    e.preventDefault();
    const newMessage = createMessage(USERS.counselor, chatMessage())
    sendMessage(newMessage);
    setChatMessage("");
  };

  const moveCursorToEnd = () => {
    if(useRichEditor){
      editorRef.focus();
      const lastElement = editorRef.getBody().lastChild;
      if(lastElement){
        editorRef.selection.select(lastElement);
        editorRef.selection.collapse(false);
      }
    } else {
      document.getElementById(`message-box-${display.style}`)?.focus();
    }
  }

  const openModal = (buttonKey:string) => {
    setModal(buttonKey === modal() ? null : buttonKey);
  };

  const sendMessage = (newMessage:Message) => {
    props.setMessages([...props.messages, newMessage]);
  };

  const simpleInput = (text:string): void => {
    setChatMessage(text);
    const lastChar = text[text.length - 1];
    if (lastChar === '@') {
      setPopover(POPOVER.CONTACTS);
    } else if (lastChar === '/' && text.length === 1) {
      setPopover(POPOVER.CANNED);
    } else {
      if (text.includes("/")) (true);
      const mentionMatch = text.match(/@([^@\s]*)$/);
      if (mentionMatch) {
        setPopover(POPOVER.CONTACTS);
        const searchTerm = mentionMatch[1].toLowerCase();
        setFilteredContacts(contacts.sort((a:Contact, b:Contact) => a.name.localeCompare(b.name)).filter((contact:Contact) =>
          contact.name.toLowerCase().includes(searchTerm)
        ));

        if(filteredContacts().length === 0) setPopover(null);
      } else {
        setPopover(null);
      }
    }
  };
  const richInput = (key:string, content:string): void => {
    const rawContent = stripHtmlTags(content) + key;
    if (key === '@') {
      setPopover(POPOVER.CONTACTS);
    } else if (key === '/' && rawContent.length === 1) {
      setPopover(POPOVER.CANNED);
    } else {
      const mentionMatch = rawContent.match(/@([^@\s]*)$/);
      if (mentionMatch) {
        const searchTerm = mentionMatch[1].toLowerCase();
        setFilteredContacts(contacts.sort((a:Contact, b:Contact) => a.name.localeCompare(b.name)).filter((contact:Contact) =>
          contact.name.toLowerCase().includes(searchTerm)
        ));
        if(filteredContacts().length === 0) setPopover(null);
      } else {
        setPopover(null);
      }
    }
  };

  const stripHtmlTags = (html:string) => {
    return DOMPurify.sanitize(html, {ALLOWED_TAGS: []});
  }

  const handleContactsPopoverClick = (name:string) => {
    const atInd = chatMessage().indexOf('@');
    setChatMessage(useRichEditor ? 
      chatMessage().substring(0, atInd) + `<span style="background-color: #c5eff6;">@${name}</span> <span>&nbsp;</span>`
      : `@${name} `
    )
    setPopover(null);
    moveCursorToEnd();
  }
  const handleCannedPopoverClick = (text:string) => {
    setChatMessage(chatMessage() === "/" ? text : `${chatMessage()} ${text}`);
    setPopover(null);
    moveCursorToEnd();
  }

  const manageStakeholders = (action: string, id:string, name:string) => {
    if(action === 'add'){
      props.setActiveCase({...props.case, stakeholders: [...props.case.stakeholders, id]});
      const newMessage = createMessage(USERS.counselor, `${name} was added to ${props.target === 'team' ? 'Team Communication' : 'Reporter Dialog'}.`, MESSAGE_TYPE.STAKEHOLDERS)
      sendMessage(newMessage);
    } else if (action === 'remove') {
      props.setActiveCase({...props.case, stakeholders: [...props.case.stakeholders.filter((v:string) => v !== id)]});
      const newMessage = createMessage(USERS.counselor, `${name} was removed from ${props.target === 'team' ? 'Team Communication' : 'Reporter Dialog'}.`, MESSAGE_TYPE.STAKEHOLDERS)
      sendMessage(newMessage);
    }
  }

  const manageTags = (action: string, id:string) => {
    if(action === 'add'){
      props.setActiveCase({...props.case, tags: [...props.case.tags, id]});
    } else if (action === 'remove') {
      props.setActiveCase({...props.case, tags: [...props.case.tags.filter((v:string) => v !== id)]});
    }
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
        <div class="group-wrapper" onClick={() => openModal(MODAL.STAKEHOLDERS)}>
          <button class="icon">
            <i class={`fa fa-user-group fa-lg ${modal() === MODAL.STAKEHOLDERS ? 'icon-active' : ''}`}></i>
          </button>
          {props.case?.stakeholders.length} 
        </div>
        <Show when={display.style === 'reporter'}>
          <button class="icon" onClick={() => openModal(MODAL.TAGS)}>
            <i class={`fa-solid fa-tags fa-lg ${modal() === MODAL.TAGS ? 'icon-active' : ''}`}></i>
          </button>
        </Show>   
        <Show when={display.style === 'team'}>  
          <button class="icon" onClick={() => openModal(MODAL.INSTRUCTIONS)}>
            <i class={`fa-solid fa-circle-info fa-lg ${modal() === MODAL.INSTRUCTIONS ? 'icon-active' : ''}`}></i>
          </button>
        </Show>        
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
        <For each={[...new Set(
        props.messages.map((msg:Message) => new Date(msg.timestamp).toDateString())
      )]}>  
          {(mDate) => (
            <div class="message-group-wrapper">
              <div class="message-group-date">
                {formatMessageGroupDate(new Date(mDate as string))}
              </div>
              <ul class="message-list">
                <For each={props.messages.filter((msg:Message) => isSameDay(new Date(mDate as string), new Date(msg.timestamp))) 
                }>
                  {(message) => (
                    <Switch>
                      <Match when={message.type === MESSAGE_TYPE.CHAT}>
                        <li class={`message-element message-element-${message.user.role}`}>
                          <div class="message-element-avatar">
                            <img src={`/src/assets/icons/${message.user.role}.svg`} alt={`${message.user.role} icon`} /> 
                          </div>
                          <div class="bold-author">
                            {message.user.displayName}
                          </div>
                          <div class="message-element-date">{format(message.timestamp, 'h:mm aa')}</div>
                          
                          <div innerHTML={message.text} class="message-element-text"/>
                          {/* <div class="message-element-text">{message.text}</div> */}
                        </li>
                      </Match>
                      <Match when={message.type === MESSAGE_TYPE.CALL}>
                        <li class={`message-element message-element-call`}>
                          <div class="message-element-avatar">
                            <i class="fa-solid fa-phone fa-xl call-icon"></i>
                            {/* <img src={`/src/assets/icons/call-outgoing.svg`} alt={`Phone icon`} /> */} 
                          </div>
                          <div class="bold-author">
                            {message.user.displayName}
                          </div>
                          <div class="message-element-date">{format(message.timestamp, 'h:mm aa')}</div>
                          
                          <div innerHTML={message.text} class="message-element-text"/>
                          {/* <div class="message-element-text">{message.text}</div> */}
                        </li>
                      </Match>
                      <Match when={message.type === MESSAGE_TYPE.STAKEHOLDERS}>
                        <li class={`message-element message-element-call`}>
                          <div class="message-element-avatar">
                          <i class="fa-solid fa-right-left fa-xl call-icon"></i>
                          </div>
                          <div class="bold-author">
                            {message.user.displayName}
                          </div>
                          <div class="message-element-date">{format(message.timestamp, 'h:mm aa')}</div>
                          
                          <div innerHTML={message.text} class="message-element-text"/>
                          {/* <div class="message-element-text">{message.text}</div> */}
                        </li>
                      </Match>
                    </Switch>
                    
                  )}
                </For>
              </ul>
            </div>
          )}
        </For>
      </div>

      {/* chap input */}
      <div class={`chat-input-wrapper ${display.style}`}>
        <div class={`chat-input`}>
          
          <Show when={popover()}>
            <Popover>
              <Switch>
                <Match when={popover() === POPOVER.CONTACTS}>
                  <Contacts 
                    filteredContacts={filteredContacts()}
                    stakeholders={props.case.stakeholders} 
                    handleContactsPopoverClick={handleContactsPopoverClick} 
                  />
                </Match>
                <Match when={popover() === POPOVER.CANNED}>
                  <Canned handleCannedPopoverClick={handleCannedPopoverClick} />
                </Match>
              </Switch>
            </Popover>
          </Show>

          <div class="editor-anchor">
            <Show when={!useRichEditor}>
              <textarea 
                id={`message-box-${display.style}`} 
                placeholder={`Message to ${display.name}...`} 
                rows="2"
                value={chatMessage()}
                onInput={(e) => simpleInput(e.currentTarget.value)}
                onKeyPress={(e) => e.key === "Enter" && handleMessageSubmit(e)}></textarea> 
            </Show>
          
            <Show when={useRichEditor}>
              <Editor
                id={`message-box-${display.style}`}
                ref={editorRef}
                apiKey="zmj3mwd02jhm0petatetozceb2u06fqhpz8f9y9oi9bnihcr"
                value={chatMessage()}
                /* onInit={(_content: string, editor: TinyEditor) => (editorRef = editor)} */
                init={{
                  menubar: false,
                  height: 125,
                  highlight_on_focus: false,
                  resize: false,
                  width: "100%",
                  statusbar: false,
                  placeholder: `Message to ${display.name}...`,
                  setup: function(editor) {
                    editor.on('keypress', function(e) {
                      richInput(e.key, editor.getContent());
                    });                  
                  },
                  plugins:
                    "advlist advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
                  toolbar:
                    "undo redo | bold italic forecolor | bullist numlist | link image code",
                }}
                onEditorChange={(content: string, editor: TinyEditor) => {
                  // const newContent = editor.getContent();
                  setChatMessage(content);
                }}
              />
            </Show>
          </div>

          <div class="input-icon-wrapper">
            <button class="icon" onClick={() => {}}>
              <i class="fa fa-paperclip fa-lg"></i>
            </button>
            <button class="icon" onClick={() => setPopover( popover() === POPOVER.CANNED ? null : POPOVER.CANNED)}>
              <i class={`fa fa-comment-medical fa-lg ${popover() === POPOVER.CANNED ? 'icon-active' : ''}`}></i>
            </button>   
          </div> 
            
          <button class="message-send" onClick={handleMessageSubmit}>Send</button>       
        </div>
      </div>
      
      <Modal modal={modal()} setModal={setModal}>
        <Switch>
          <Match when={modal() === MODAL.INSTRUCTIONS}>
              <Instructions />
          </Match>
          <Match when={modal() === MODAL.STAKEHOLDERS}>
              <Stakeholders 
                allContacts={contacts} 
                contacts={props.case.stakeholders} 
                addCallMessage={addCallMessage}
                manageStakeholders={manageStakeholders}
              />
          </Match>
          <Match when={modal() === MODAL.TAGS}>
              <Tags caseTags={props.case.tags} manageTags={manageTags} />
          </Match>
        </Switch>
      </Modal>
    </div>
  );
}