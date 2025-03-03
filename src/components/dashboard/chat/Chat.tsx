import { createEffect, createSignal, For, JSX, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { type Editor as TinyEditor } from "tinymce";
import DOMPurify from 'dompurify';
import Editor  from "tinymce-solid";
import "./Chat.css";
import { format, toZonedTime } from 'date-fns-tz'
import { isSameDay } from 'date-fns';
import type { Message, Staff } from "../../../common/types/types";
import { DIALOG_TYPE, HOT_KEY_SCRIPT, MESSAGE_TYPE, MODAL, POPOVER, TIME_ZONES, TIP_CATEGORY, USERS } from '../../../common/constants/constants';
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
  const EDITOR_KEY = import.meta.env.TINY_MCE;
  const [chatMessage, setChatMessage] = createSignal("");
  const [filteredContacts, setFilteredContacts] = createSignal<Staff[] | null>(null);
  const [modal, setModal] = createSignal<string | null>(null);
  const [popover, setPopover] = createSignal<string | null>(null);
  const [useSchoolTimezone, setUseSchoolTimezone] = createSignal<boolean>(false);
  const [schoolTimezone, setSchoolTimezone] = createSignal<string>("");
  const [defaultTimezone, setDefaultTimezone] = createSignal<string>(props.activeCounselor?.timezone);
  const [cannedFilter, setCannedFilter] = createSignal<string | null>(null);
  const [cannedMessage, setCannedMessage] = createSignal<string | null>(null);
  const [messageList, setMessageList] = createSignal<Message[]>(props.messages);

  const display = DIALOG_TYPE[props.target as keyof typeof DIALOG_TYPE];
  let chatContainerRef: HTMLDivElement | undefined;
  let editorRef!: TinyEditor;
  const useRichEditor:boolean = false;

  const [timezone, setTimezone] = createSignal<string>(defaultTimezone());

  onMount(() => {
    document.addEventListener('keydown', handleKeyCombo, true)
  });
  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyCombo, true)
  });

  createEffect(() => {
    if (props.tipId) {
      setChatMessage("");
      setSchoolTimezone(props.case.school.timezone);
      setFilteredContacts(props.case.school.staff)
    }
  });

  createEffect(() => {
    setMessageList(props.messages);
    scrollToBottom();
  });

  createEffect(() => {
    if(messageList().length){
      scrollToBottom();
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

  const createMessage = (text: string, type = MESSAGE_TYPE.CHAT, isCounselor = true, isTipster = false) => {
    const sender = isCounselor ?
      {
        id: props.activeCounselor.id,
        displayName: props.activeCounselor.displayName,
        role: props.activeCounselor.role,
        colors: props.activeCounselor.colors,
      }
      : isTipster ? 
      USERS.reporter 
      : {
        id: "bfff333a-6800-4279-91c9-8e291012c971",
        displayName: "Charlie Taylor",
        role: "collaborator",
        status: 1,
        title: "Vice Principal"
      }
    
    return {
      id: crypto.randomUUID(),
      type,
      text: replaceVariables(text),
      sender,
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
    const newList = [...messageList(), newMessage];
    props.setMessages(newList);
    props.updateRootMessages(props.target, newList)
  };

  const simpleInput = (text:string): void => {
    setChatMessage(replaceVariables(text));
    const lastChar = text[text.length - 1];
    if (lastChar === '@') {
      setPopover(POPOVER.CONTACTS);
    } else if (lastChar === '/') {
      setPopover(POPOVER.CANNED);
    } else if (lastChar === ' ' && popover() === POPOVER.CANNED) {
      setPopover(null);
    } else if (text.includes("/") && popover() === POPOVER.CANNED) {
      const slashIdx = text.lastIndexOf("/")+1;
      setCannedFilter(text.substring(slashIdx));
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
    } else if (key === ' ' && popover() === POPOVER.CANNED) {
      setPopover(null);
    } else if (rawContent.includes('/') && popover() === POPOVER.CANNED) {
      const slashIdx = rawContent.lastIndexOf("/")+1;
      setCannedFilter(rawContent.substring(slashIdx));
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
    if(rawContent === "/" || rawContent === `/${cannedFilter()}`){
      setChatMessage(replacedText);
    } else {
      if( useRichEditor){
        if(!cannedFilter()){
          setChatMessage(lastChar === "/" 
            ? `${chatMessage().replace('/</p>', '')} ${replacedText}</p>` 
            : `${chatMessage().slice(0, -4)} ${replacedText}</p>`);
        } else {
          setCannedMessage(replacedText);
        }
      } else {
        if(cannedFilter()){
          setChatMessage(chatMessage().replace(`/${cannedFilter()}`, ` ${replacedText} `))
        } else {
          setChatMessage(lastChar === "/" 
            ? `${chatMessage().slice(0, -1)} ${replacedText} ` 
            : `${chatMessage()} ${replacedText} `);
        }
      }
    }
    
    if(!useRichEditor && cannedFilter()){
      setCannedFilter(null);
      setCannedMessage(null);
    }

    setPopover(null);
    moveCursorToEnd();
  }

  const applyCannedMessage = (content:string) => {
    const charCount = (cannedFilter()?.length || 0)*-1;
    setChatMessage(`${content.slice(0, charCount-5)} ${cannedMessage()}</p>`);
    setCannedFilter(null);
    setCannedMessage(null);
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

  const typeText = async (text:string) => {
    const typingSpeed = 30;
    const variance = 20;
    const typeText = stripHtmlTags(text);
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    for (let i = 0; i < typeText.length; i++) {
      setChatMessage(typeText.substring(0, i + 1))
      const randomDelay = typingSpeed + (Math.random() * variance - variance / 2)
      await new Promise(resolve => setTimeout(resolve, randomDelay))
    }
    
    sendMessage(createMessage(text));
    setChatMessage('')
    return true
  }

  const handleKeyCombo = async (event: KeyboardEvent) => {
    // Check if Control is pressed and it's a number key 1-9
    if (event.ctrlKey && event.key >= '1' && event.key <= '9') {
      // Prevent the default browser behavior
      event.preventDefault()
            
      // Add your custom logic here
      switch (event.key) {
        case '1':
            props.assignTip();
            break;
        case '2':
          if(props.target === "reporter"){
            await typeText(HOT_KEY_SCRIPT[event.key]);
            setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, true)), 10000);
          }
          break
        case '3':
          if(props.target === "reporter"){
            await typeText(HOT_KEY_SCRIPT[event.key]);
            setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, true)), 10000);
          }
          break
        case '4':
          if(props.target === "team"){
            await typeText(HOT_KEY_SCRIPT[event.key]);
            inviteTeam();
            setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'sum'], MESSAGE_TYPE.SUMMARY, false, false)), 1000);
            setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, false)), 10000);
          }
          break
        case '5':
            if(props.target === "team"){
              await typeText(HOT_KEY_SCRIPT[event.key]);
              setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, false)), 8000);
              setTimeout(() => sendMessage(              
                {
                  id: crypto.randomUUID(),
                  type: MESSAGE_TYPE.CHAT,
                  text: replaceVariables(HOT_KEY_SCRIPT[event.key+'reply2']),
                  sender: {
                    id: "bfff333a-6800-4279-91c9-8e291012c971",
                    displayName: "Diana Thompson",
                    role: "collaborator",
                    status: 1,
                    title: "Counselor"
                  },
                  timestamp: new Date()
                }
              ), 16000);
            }
            break
        case '6':
          if(props.target === "reporter"){
            await typeText(HOT_KEY_SCRIPT[event.key]);
            setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, true)), 10000);
          }
          break
        case '7':
            const messageWithAttachments = {
              id: crypto.randomUUID(),
              type: MESSAGE_TYPE.ATTACH,
              text: "",
              sender: USERS.reporter,
              timestamp: new Date(),
              attachments: [
                  {
                  "file": "bruise03.jpeg",
                  "flagged": "safe"
                  },
                  {
                  "file": "bruise01.jpeg",
                  "flagged": "inappropriate"
                  },
                  {
                  "file": "bruise02.jpeg",
                  "flagged": "illegal"
                  }
              ]
            }

            if(props.target === "reporter"){
              await typeText(HOT_KEY_SCRIPT[event.key]);
              setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, true)), 10000);
              setTimeout(() => typeText(HOT_KEY_SCRIPT[event.key+'reply2']), 15000);
              setTimeout(() => sendMessage(messageWithAttachments), 30000);
            }
            break
          case '8':
            if(props.target === "team"){
              await typeText(HOT_KEY_SCRIPT[event.key]);
              setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, false)), 10000);
            }
            break
          case '9':
            if(props.target === "reporter"){
              await typeText(HOT_KEY_SCRIPT[event.key]);
              setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply'], MESSAGE_TYPE.CHAT, false, true)), 8000);
              setTimeout(() => sendMessage(createMessage(HOT_KEY_SCRIPT[event.key+'reply2'], MESSAGE_TYPE.CHAT, true, false)), 12000);
            }
            break
      }
    }
  }

  const inviteTeam = () => {
    props.setActiveCase({
      ...props.case, 
      stakeholders: [
        ...props.case.stakeholders,
        "00acca6b-22be-4bad-9e20-be9a278416f1", 
        "bfff333a-6800-4279-91c9-8e291012c971",
        "8a558cc8-a784-4a76-b484-0bbf3bed8f8c",
        "7327f7ac-8f9a-4387-8bf4-3dbf70f8908b"
      ]
    });
    props.updateRootTip();
    const newMessage = createMessage(`<strong>Quinn Garcia</strong>, <strong>Charlie Taylor</strong>, <strong>Julia White</strong> and <strong>Diana Thompson</strong> were added as collaborators`, MESSAGE_TYPE.STAKEHOLDERS)
    sendMessage(newMessage);
  }


  return (
    <div class="chat-wrapper">
      <div class={`chat-title ${display.style}`}>
        <Show when={display.style === "team"}>
          {display.name} Communication
        </Show>
        <Show when={display.style === "reporter"}>
          {display.name} Dialog — {`${props.tipId} `}
          <Show when={props.case?.lifeSafety}>
            <img
              class="title-danger-icon"
              src={`/src/assets/icons/life-safety.svg`}
              alt="Life Safety Icon"
            />
          </Show>
        </Show>
      </div>

      {/* icon buttons */}
      <div class="chat-tool-icons">
        <div
          class="group-wrapper"
          onClick={() => openModal(MODAL.STAKEHOLDERS)}
        >
          <button class="icon">
            <i
              class={`fa fa-user-group fa-lg ${
                modal() === MODAL.STAKEHOLDERS ? "icon-active" : ""
              }`}
            ></i>
          </button>
          {props.case?.stakeholders.length}
        </div>
        <Show when={display.style === "reporter"}>
          <button class="icon" onClick={() => openModal(MODAL.TAGS)}>
            <i
              class={`fa-solid fa-tags fa-lg ${
                modal() === MODAL.TAGS ? "icon-active" : ""
              }`}
            ></i>
          </button>
        </Show>
        <Show when={display.style === "team"}>
          <button class="icon" onClick={() => openModal(MODAL.INSTRUCTIONS)}>
            <i
              class={`fa-solid fa-circle-info fa-lg ${
                modal() === MODAL.INSTRUCTIONS ? "icon-active" : ""
              }`}
            ></i>
          </button>
        </Show>

        <button class="icon" onClick={() => openModal(MODAL.SUMMARY)}>
          <i
            class={`fa-solid fa-wand-magic-sparkles fa-lg ${
              modal() === MODAL.SUMMARY ? "icon-active" : ""
            }`}
          ></i>
        </button>
      </div>

      {/* case details */}
      <div class="case-details">
        <Show when={props.target === "reporter"}>
          <div>
            Case type:{" "}
            {props.case &&
              TIP_CATEGORY[props.case?.tipType as keyof typeof TIP_CATEGORY]
                .name}
          </div>
          <div>|</div>
          <div>Status: {props.case?.status}</div>
        </Show>
        <Show when={props.target === "team"}>
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
        <For
          each={[
            ...new Set(
              messageList().map((msg: Message) =>
                new Date(msg.timestamp).toDateString()
              )
            ),
          ]}
        >
          {(mDate) => (
            <div class="message-group-wrapper">
              <div class="message-group-date">
                {formatMessageGroupDate(new Date(mDate as string))}
              </div>
              <ul class="message-list">
                <For
                  each={messageList().filter((msg: Message) =>
                    isSameDay(
                      new Date(mDate as string),
                      new Date(msg.timestamp)
                    )
                  )}
                >
                  {(message) => (
                    <Switch>
                      <Match when={message.type === MESSAGE_TYPE.CHAT}>
                        <li
                          class={`message-element message-element-${message.sender.role}`}
                        >
                          <div class="avatar-span">
                            <Avatar>
                              <Switch>
                                <Match
                                  when={message.sender.role === "counselor"}
                                >
                                  <Counselor
                                    body={message.sender.colors[1]}
                                    head={message.sender.colors[0]}
                                  />
                                </Match>
                                <Match
                                  when={message.sender.role === "reporter"}
                                >
                                  <Reporter />
                                </Match>
                                <Match
                                  when={message.sender.role === "collaborator"}
                                >
                                  <Team />
                                </Match>
                              </Switch>
                            </Avatar>
                          </div>
                          <div>
                            <span class="bold-author">
                              {message.sender.displayName}
                            </span>
                            <Show when={props.target === "team"}>
                              , {message.sender.title}
                            </Show>
                          </div>
                          <div class="message-element-date">
                            {format(
                              toZonedTime(
                                message.timestamp,
                                TIME_ZONES[
                                  timezone() as keyof typeof TIME_ZONES
                                ]
                              ),
                              "h:mm aa",
                              {
                                timeZone:
                                  TIME_ZONES[
                                    timezone() as keyof typeof TIME_ZONES
                                  ],
                              }
                            )}
                          </div>

                          <div
                            innerHTML={message.text}
                            class="message-element-text"
                          />
                          {/* <div class="message-element-text">{message.text}</div> */}
                        </li>
                      </Match>
                      <Match when={message.type === MESSAGE_TYPE.ATTACH}>
                        <li
                          class={`message-element message-element-${message.sender.role}`}
                        >
                          <div class="avatar-span">
                            <Avatar>
                              <Switch>
                                <Match
                                  when={message.sender.role === "counselor"}
                                >
                                  <Counselor
                                    body={message.sender.colors[1]}
                                    head={message.sender.colors[0]}
                                  />
                                </Match>
                                <Match
                                  when={message.sender.role === "reporter"}
                                >
                                  <Reporter />
                                </Match>
                                <Match
                                  when={message.sender.role === "collaborator"}
                                >
                                  <Team />
                                </Match>
                              </Switch>
                            </Avatar>
                          </div>
                          <div>
                            <span class="bold-author">
                              {message.sender.displayName}
                            </span>
                            <Show when={props.target === "team"}>,</Show>
                          </div>
                          <div class="message-element-date">
                            {format(
                              toZonedTime(
                                message.timestamp,
                                TIME_ZONES[
                                  timezone() as keyof typeof TIME_ZONES
                                ]
                              ),
                              "h:mm aa",
                              {
                                timeZone:
                                  TIME_ZONES[
                                    timezone() as keyof typeof TIME_ZONES
                                  ],
                              }
                            )}
                          </div>

                          <div class="message-element-attachments">
                            <For each={message.attachments}>
                              {(att) => (
                                <div class="attachment-thumb-wrapper">
                                  <img
                                    class={`
                                    ${
                                      att.flagged === "inappropriate"
                                        ? "blurred-image-lt"
                                        : ""
                                    }
                                    ${
                                      att.flagged === "illegal"
                                        ? "blurred-image-hvy"
                                        : ""
                                    }
                                    `}
                                    src={`/src/assets/uploads/${att.file}`}
                                    alt={`Upload file thumbnail`}
                                  />
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
                            {format(
                              toZonedTime(
                                message.timestamp,
                                TIME_ZONES[
                                  timezone() as keyof typeof TIME_ZONES
                                ]
                              ),
                              "h:mm aa",
                              {
                                timeZone:
                                  TIME_ZONES[
                                    timezone() as keyof typeof TIME_ZONES
                                  ],
                              }
                            )}
                          </div>

                          <div
                            innerHTML={message.text}
                            class="message-element-text"
                          />
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
                            {format(
                              toZonedTime(
                                message.timestamp,
                                TIME_ZONES[
                                  timezone() as keyof typeof TIME_ZONES
                                ]
                              ),
                              "h:mm aa",
                              {
                                timeZone:
                                  TIME_ZONES[
                                    timezone() as keyof typeof TIME_ZONES
                                  ],
                              }
                            )}
                          </div>

                          <div
                            innerHTML={message.text}
                            class="message-element-text"
                          />
                          {/* <div class="message-element-text">{message.text}</div> */}
                        </li>
                      </Match>
                      <Match when={message.type === MESSAGE_TYPE.SUMMARY}>
                        <li class={`message-element message-element-call`}>
                          <div class="avatar-span"></div>
                          <div
                            innerHTML={`<i><strong>Summary:</strong> ${message.text}</i>`}
                            class="message-element-text"
                          />
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
                  <Canned
                    target={props.target}
                    cannedFilter={cannedFilter()}
                    handleCannedPopoverClick={handleCannedPopoverClick}
                  />
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
                onKeyPress={(e) => e.key === "Enter" && handleMessageSubmit(e)}
              ></textarea>
            </Show>

            <Show when={useRichEditor}>
              <Editor
                id={`message-box-${display.style}`}
                ref={editorRef}
                apiKey={EDITOR_KEY}
                value={chatMessage()}
                onInit={(_content: string, editor: TinyEditor) =>
                  (editorRef = editor)
                }
                init={{
                  menubar: false,
                  height: 125,
                  highlight_on_focus: false,
                  resize: false,
                  width: "100%",
                  statusbar: false,
                  placeholder: `Message to ${display.name}...`,
                  content_style:
                    ".callout { background-color: hsla(51, 100%, 50%, .5); padding: 4px; border-radius: 4px; color: #4682b4; }",
                  setup: function (editor) {
                    editor.on("keypress", function (e) {
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
                  if (cannedMessage()) {
                    applyCannedMessage(content);
                  }
                }}
              />
            </Show>
          </div>

          <div class="input-icon-wrapper">
            <button
              class="icon"
              onClick={() =>
                setPopover(popover() === POPOVER.ATTACH ? null : POPOVER.ATTACH)
              }
            >
              <i class="fa fa-paperclip fa-lg"></i>
            </button>
            <button
              class="icon"
              onClick={() =>
                setPopover(popover() === POPOVER.CANNED ? null : POPOVER.CANNED)
              }
            >
              <i
                class={`fa fa-comment-medical fa-lg ${
                  popover() === POPOVER.CANNED ? "icon-active" : ""
                }`}
              ></i>
            </button>
          </div>

          <button class="message-send" onClick={handleMessageSubmit}>
            Send
          </button>
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
              tags={props.case.tags}
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