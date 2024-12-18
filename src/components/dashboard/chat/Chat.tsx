import { createEffect, createSignal, For, JSX, Match, Show, Switch } from "solid-js";
import { type Editor as TinyEditor } from "tinymce";
import DOMPurify from 'dompurify';
import Editor  from "tinymce-solid";
import "./Chat.css";
import { format, toZonedTime } from 'date-fns-tz'
import { isSameDay } from 'date-fns';
import type { Message, Staff } from "../../../common/types/types";
import { DIALOG_TYPE, MESSAGE_TYPE, MODAL, POPOVER, TIME_ZONES } from '../../../common/constants/constants';
import { dateInTimezone, getOrdinalSuffix } from '../../../common/utils/utils';
import Popover from './Popover';
import Attach from './popovers/Attach';
import Canned from './popovers/Canned';
import Contacts from './popovers/Contacts';
import Modal from './Modal';
import Instructions from './modals/Instructions';
import Stakeholders from "./modals/Stakeholders";
import Tags from "./modals/Tags";
import Summary from "./modals/Summary";
import Counselor from "../../icons/Counselor";
import Avatar from "../Avatar";
import Reporter from "../../icons/Reporter";
import Team from "../../icons/Team";

export default function Chat(props:any) {
  const [chatMessage, setChatMessage] = createSignal("");
  const [filteredContacts, setFilteredContacts] = createSignal<Staff[] | null>(null);
  const [modal, setModal] = createSignal<string | null>(null);
  const [popover, setPopover] = createSignal<string | null>(null);
  const [useSchoolTimezone, setUseSchoolTimezone] = createSignal<boolean>(false);
  const [schoolTimezone, setSchoolTimezone] = createSignal<string>("");
  const [defaultTimezone, setDefaultTimezone] = createSignal<string>(props.activeCounselor?.timezone);

  const display = DIALOG_TYPE[props.target as keyof typeof DIALOG_TYPE];
  let chatContainerRef: HTMLDivElement | undefined;
  let editorRef!: TinyEditor;
  const useRichEditor:boolean = true;

  const [timezone, setTimezone] = createSignal<string>(defaultTimezone());

  createEffect(() => {
    if (props.messages.length) {
      scrollToBottom()
    }
  });
  createEffect(() => {
    if (props.tipId) {
      setChatMessage("");
      /* setModal(null);
      setPopover(null); */
      setSchoolTimezone(props.case.school.timezone);
      setFilteredContacts(props.case.school.staff)
    }
  });

  const scrollToBottom = () => {
    if (chatContainerRef) {
      chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    }
  };

  const addCallMessage = (message:string) => {
    const newMessage = createMessage(message, MESSAGE_TYPE.CALL)
    sendMessage(newMessage);
  }

  const createMessage = (text: string, type = MESSAGE_TYPE.CHAT) => {
    return {
      id: crypto.randomUUID(),
      type,
      text: replaceVariables(text),
      sender: {
        id: props.activeCounselor.id,
        displayName: props.activeCounselor.displayName,
        role: props.activeCounselor.role,
        colors: props.activeCounselor.colors,
      },
      timestamp: new Date()
    }
  };

  const replaceVariables = (msg:string): string => {
    if(msg.includes("[TIPID]")){
      msg = msg.replace("[TIPID]", props.tipId);
    }

    const {fullDateTime, dateOnly, timeOnly, timeWithLocale, timezone} = dateInTimezone(new Date, schoolTimezone());

    if(msg.includes("[DATE]")){
      msg = msg.replaceAll("[DATE]", dateOnly);
    }
    if(msg.includes("[TIME]")){
      msg = msg.replaceAll("[TIME]", timeWithLocale);
    }
    if(msg.includes("[DATETIME]")){
      msg = msg.replaceAll("[DATETIME]", dateOnly + ' ' + timeWithLocale);
    }

    return msg
  }

  const formatMessageGroupDate = (date:Date): string => {
    const day = format(date, 'd');
    const suffix = getOrdinalSuffix(Number(day));
    return format(date, `EEEE, MMMM d`) + suffix;
  }

  const handleMessageSubmit = (e: Event): void => {
    e.preventDefault();
    const newMessage = createMessage(chatMessage())
    sendMessage(newMessage);
    setChatMessage("");
  };

  const moveCursorToEnd = (): void => {
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

  const openModal = (buttonKey:string): void => {
    setModal(buttonKey === modal() ? null : buttonKey);
  };

  const sendMessage = (newMessage:Message): void => {
    props.setMessages([...props.messages, newMessage]);
  };

  const simpleInput = (text:string): void => {
    setChatMessage(replaceVariables(text));
    const lastChar = text[text.length - 1];
    if (lastChar === '@') {
      setPopover(POPOVER.CONTACTS);
    } else if (lastChar === '/') {
      setPopover(POPOVER.CANNED);
    } else if (text.includes("/") && popover() === POPOVER.CANNED) {
      setPopover(null);
    } else {
      const mentionMatch = text.match(/@([^@\s]*)$/);
      if (mentionMatch) {
        setPopover(POPOVER.CONTACTS);
        const searchTerm = mentionMatch[1].toLowerCase();
        setFilteredContacts(props.case.school.staff
          .sort((a:Staff, b:Staff) => {
            const aName = `${a.firstName} ${a.lastName}`;
            const bName = `${b.firstName} ${b.lastName}`;
            
            return aName.localeCompare(bName)
          })
          .filter((contact:Staff) => {
            const name = `${contact.firstName} ${contact.lastName}`;
            return name.toLowerCase().includes(searchTerm)
          }
        ));

        if(filteredContacts()?.length === 0) setPopover(null);
      } else {
        setPopover(null);
      }
    }
  };
  const richInput = (key:string, content:string): void => {
    const rawContent = stripHtmlTags(content) + key;
    if (key === '@') {
      setPopover(POPOVER.CONTACTS);
    } else if (key === '/') {
      setPopover(POPOVER.CANNED);
    } else {
      const mentionMatch = rawContent.match(/@([^@\s]*)$/);
      if (mentionMatch) {
        const searchTerm = mentionMatch[1].toLowerCase();
        setFilteredContacts(props.case.school.staff
          .sort((a:Staff, b:Staff) => {
            const aName = `${a.firstName} ${a.lastName}`;
            const bName = `${b.firstName} ${b.lastName}`;
            
            return aName.localeCompare(bName)
          })
          .filter((contact:Staff) => {
            const name = `${contact.firstName} ${contact.lastName}`;
            return name.toLowerCase().includes(searchTerm)
          }
        ));
        if(filteredContacts()?.length === 0) setPopover(null);
      } else {
        setPopover(null);
      }
    }
  };

  const stripHtmlTags = (html:string): string => {
    return DOMPurify.sanitize(html, {ALLOWED_TAGS: []});
  }

  const handleContactsPopoverClick = (name:string): void => {
    const atInd = chatMessage().indexOf('@');
    setChatMessage(useRichEditor ? 
      chatMessage().substring(0, atInd) + `<span class="callout">@${name}</span> <span>&nbsp;</span>`
      : `@${name} `
    )
    setPopover(null);
    moveCursorToEnd();
  }

  const handleCannedPopoverClick = (text:string): void => {
    const rawContent = useRichEditor ? stripHtmlTags(chatMessage()) : chatMessage();
    const lastChar = rawContent[rawContent.length - 1];
    const replacedText = replaceVariables(text);

    if(rawContent === "/"){
      setChatMessage(replacedText);
    } else {
      if( useRichEditor){
        setChatMessage(lastChar === "/" ? `${chatMessage().replace('/</p>', '')} ${replacedText}</p>` : `${chatMessage().slice(0, -4)} ${replacedText}</p>`);
      } else {
        setChatMessage(lastChar === "/" ? `${chatMessage().slice(0, -1)} ${replacedText}` : `${chatMessage()} ${replacedText}`);
      }
    }
    
    setPopover(null);
    moveCursorToEnd();
  }

  const manageStakeholders = (action: string, id:string, name:string) => {
    if(action === 'add'){
      props.setActiveCase({
        ...props.case, 
        stakeholders: [...props.case.stakeholders, id]
      });
      const newMessage = createMessage(`${name} was added to ${props.target === 'team' ? 'Team Communication' : 'Reporter Dialog'}.`, MESSAGE_TYPE.STAKEHOLDERS)
      sendMessage(newMessage);
    } else if (action === 'remove') {
      props.setActiveCase({
        ...props.case, 
        stakeholders: [...props.case.stakeholders.filter((v:string) => v !== id)]
      });
      const newMessage = createMessage(`${name} was removed from ${props.target === 'team' ? 'Team Communication' : 'Reporter Dialog'}.`, MESSAGE_TYPE.STAKEHOLDERS)
      sendMessage(newMessage);
    }
  }

  const manageTags = (action: string, id:string) => {
    if(action === 'add'){
      props.setActiveCase({...props.case, tags: [...props.case.tags, id]});
    } else if (action === 'remove') {
      props.setActiveCase({
        ...props.case, 
        tags: [...props.case.tags.filter((v:string) => v !== id)]
      });
    }
  }

  const toggleTimezone: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    setUseSchoolTimezone(isChecked);
    setTimezone(isChecked ? schoolTimezone() : defaultTimezone());
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
            <img class="title-danger-icon" src={`/src/assets/icons/life-safety.svg`} alt="Life Safety Icon" />
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

        <button class="icon" onClick={() => openModal(MODAL.SUMMARY)}>
            <i class={`fa-solid fa-wand-magic-sparkles fa-lg ${modal() === MODAL.SUMMARY ? 'icon-active' : ''}`}></i>
          </button>       
      </div>

      {/* case details */}
      <div class="case-details">
        <Show when={props.target === 'reporter'}>
          <div>Case type: {props.case?.tipType}</div>
          <div>|</div>
          <div>Status: {props.case?.status}</div>
        </Show>
        <Show when={props.target === 'team'}>
        <label class="timezone-toggle">
          <input 
            type="checkbox" 
            checked={useSchoolTimezone()} 
            onInput={toggleTimezone}
          />
          <span>Show local times ({schoolTimezone()})</span>
        </label>
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
                        <li class={`message-element message-element-${message.sender.role}`}>
                          <div class="avatar-span">
                            <Avatar>
                              <Switch>
                                <Match when={message.sender.role === 'counselor'}>
                                  <Counselor body={message.sender.colors[1]} head={message.sender.colors[0]} />
                                </Match>
                                <Match when={message.sender.role === 'reporter'}>
                                  <Reporter />
                                </Match>
                                <Match when={message.sender.role === 'collaborator'}>
                                  <Team />
                                </Match>
                              </Switch>
                            </Avatar>
                          </div>
                          <div class="bold-author">
                            {message.sender.displayName}
                          </div>
                          <div class="message-element-date">
                            {format(toZonedTime(message.timestamp, TIME_ZONES[timezone() as keyof typeof TIME_ZONES]), 'h:mm aa', { timeZone: TIME_ZONES[timezone() as keyof typeof TIME_ZONES] })}
                            </div>
                          
                          <div innerHTML={message.text} class="message-element-text"/>
                          {/* <div class="message-element-text">{message.text}</div> */}
                        </li>
                      </Match>
                      <Match when={message.type === MESSAGE_TYPE.ATTACH}>
                        <li class={`message-element message-element-${message.sender.role}`}>
                        <div class="avatar-span">
                            <Avatar>
                              <Switch>
                                <Match when={message.sender.role === 'counselor'}>
                                  <Counselor body={message.sender.colors[1]} head={message.sender.colors[0]} />
                                </Match>
                                <Match when={message.sender.role === 'reporter'}>
                                  <Reporter />
                                </Match>
                                <Match when={message.sender.role === 'collaborator'}>
                                  <Team />
                                </Match>
                              </Switch>
                            </Avatar>
                          </div>
                          <div class="bold-author">
                            {message.sender.displayName}
                          </div>
                          <div class="message-element-date">
                            {format(toZonedTime(message.timestamp, TIME_ZONES[timezone() as keyof typeof TIME_ZONES]), 'h:mm aa', { timeZone: TIME_ZONES[timezone() as keyof typeof TIME_ZONES] })}
                            </div>
                          
                          <div class="message-element-attachments">
                            <For each={message.attachments}>
                              {(att) => (
                                <div class="attachment-thumb-wrapper">
                                  <img class={`
                                    ${att.flagged === "inappropriate" ? 'blurred-image-lt' : ''}
                                    ${att.flagged === "illegal" ? 'blurred-image-hvy' : ''}
                                    `} src={`/src/assets/uploads/${att.file}`} alt={`Upload file thumbnail`} />
                                    <Show when={att.flagged === "illegal"}>
                                      <i class="fa-solid fa-lock fa-2xl attach-lock"></i>
                                    </Show>
                                </div>
                              )}
                            </For>
                          </div> 
                        </li>
                      </Match>
                      <Match when={message.type === MESSAGE_TYPE.CALL}>
                        <li class={`message-element message-element-call`}>
                          <div class="avatar-span">
                            <Avatar>
                              <i class="fa-solid fa-phone fa-xl call-icon"></i>
                            </Avatar>
                          </div>
                          <div class="bold-author">
                            {message.sender.displayName}
                          </div>
                          <div class="message-element-date">
                            {format(toZonedTime(message.timestamp, TIME_ZONES[timezone() as keyof typeof TIME_ZONES]), 'h:mm aa', { timeZone: TIME_ZONES[timezone() as keyof typeof TIME_ZONES] })}
                          </div>
                          
                          <div innerHTML={message.text} class="message-element-text"/>
                          {/* <div class="message-element-text">{message.text}</div> */}
                        </li>
                      </Match>
                      <Match when={message.type === MESSAGE_TYPE.STAKEHOLDERS}>
                        <li class={`message-element message-element-call`}>
                          <div class="avatar-span">
                            <Avatar>
                              <i class="fa-solid fa-right-left fa-xl call-icon"></i>
                            </Avatar>
                          </div>
                          <div class="bold-author">
                            {message.sender.displayName}
                          </div>
                          <div class="message-element-date">
                            {format(toZonedTime(message.timestamp, TIME_ZONES[timezone() as keyof typeof TIME_ZONES]), 'h:mm aa', { timeZone: TIME_ZONES[timezone() as keyof typeof TIME_ZONES] })}
                          </div>
                          
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
                <Match when={popover() === POPOVER.ATTACH}>
                  <Attach 
                    cancelClick={() => setPopover(null)} 
                    handleAttachPopoverClick={handleContactsPopoverClick} 
                  />
                </Match>
                <Match when={popover() === POPOVER.CONTACTS}>
                  <Contacts 
                    filteredContacts={filteredContacts()}
                    stakeholders={props.case.stakeholders} 
                    handleContactsPopoverClick={handleContactsPopoverClick} 
                  />
                </Match>
                <Match when={popover() === POPOVER.CANNED}>
                  <Canned target={props.target} handleCannedPopoverClick={handleCannedPopoverClick} />
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
                onInit={(_content: string, editor: TinyEditor) => (editorRef = editor)}
                init={{
                  menubar: false,
                  height: 125,
                  highlight_on_focus: false,
                  resize: false,
                  width: "100%",
                  statusbar: false,
                  placeholder: `Message to ${display.name}...`,
                  content_style: '.callout { background-color: hsla(51, 100%, 50%, .5); padding: 4px; border-radius: 4px; color: #4682b4; }',
                  setup: function(editor) {
                    editor.on('keypress', function(e) {
                      richInput(e.key, editor.getContent());
                    });                  
                  },
                  plugins:
                    "advlist advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
                  toolbar:
                    "undo redo | bold italic forecolor | bullist numlist | link code",
                }}
                onEditorChange={(content: string, editor: TinyEditor) => {
                  // const newContent = editor.getContent();
                  setChatMessage(replaceVariables(content));
                }}
              />
            </Show>
          </div>

          <div class="input-icon-wrapper">
            <button class="icon" onClick={() => setPopover( popover() === POPOVER.ATTACH ? null : POPOVER.ATTACH)}>
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
                allContacts={props.case.school.staff} 
                contacts={props.case.stakeholders} 
                school={props.case.school}
                addCallMessage={addCallMessage}
                manageStakeholders={manageStakeholders}
              />
          </Match>
          <Match when={modal() === MODAL.TAGS}>
              <Tags caseTags={props.case.tags} manageTags={manageTags} />
          </Match>
          <Match when={modal() === MODAL.SUMMARY}>
              <Summary target={props.target} tipId={props.tipId} />
          </Match>
        </Switch>
      </Modal>
    </div>
  );
}