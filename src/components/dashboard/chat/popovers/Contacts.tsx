import { createEffect, createSignal, For, Show } from "solid-js";
import "./Contacts.css";
import type { Contact } from "../types";

export default function Contacts(props:any) {
  const [contacts, setContacts] = createSignal<Contact[]>([
    ...props.filteredContacts.filter((contact:Contact) => props.stakeholders.includes(contact.id)),
    {id: "XX", name: "@channel", notify_msg: "Notify every stakeholder."},
    {id: "YY", name: "@here", notify_msg: "Notify every online stakeholder."},
    ...props.filteredContacts.filter((contact:Contact) => !props.stakeholders.includes(contact.id))
  ]);

  createEffect(() => {
    if (props.filteredContacts.length) {
      setContacts([
        ...props.filteredContacts.filter((contact:Contact) => props.stakeholders.includes(contact.id)),
        {id: "XX", name: "@channel", notify_msg: "Notify every stakeholder."},
        {id: "YY", name: "@here", notify_msg: "Notify every online stakeholder."},
        ...props.filteredContacts.filter((contact:Contact) => !props.stakeholders.includes(contact.id))
      ])
    }
  });
  
  return (
    <div class="contacts-wrapper">
      <For each={contacts()}>
        {(contact) => (
          <div class="contacts-item" onClick={() => props.handleContactsPopoverClick(contact.name.replace('@', ''))}>
            <i class={`${contact.notify_msg ? 'fa-solid fa-bullhorn' : 'fa-regular fa-circle-user'}`}></i>
            <div><strong>{contact.name}</strong> {contact.notify_msg}</div>
            <Show when={!props.stakeholders.includes(contact.id) && !contact.notify_msg}>
              <div class="Contacts-align-end">Not in chat</div>
            </Show>
          </div>
        )}
      </For>
    </div>
  )
}