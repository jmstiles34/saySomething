import { createEffect, createSignal, For, Show } from "solid-js";
import "./Contacts.css";
import type { Staff } from "../../../../common/types/types";

export default function Contacts(props:any) {
  const [contacts, setContacts] = createSignal<Staff[]>([
    ...props.filteredContacts.filter((contact:Staff) => props.stakeholders.includes(contact.id)),
    {id: "XX", name: "@channel", notify_msg: "Notify every stakeholder."},
    {id: "YY", name: "@here", notify_msg: "Notify every online stakeholder."},
    ...props.filteredContacts.filter((contact:Staff) => !props.stakeholders.includes(contact.id))
  ]);

  createEffect(() => {
    if (props.filteredContacts.length) {
      setContacts([
        ...props.filteredContacts.filter((contact:Staff) => props.stakeholders.includes(contact.id)),
        {id: "XX", firstName: "@channel", lastName: "", notify_msg: "Notify every stakeholder."},
        {id: "YY", firstName: "@here", lastName: "", notify_msg: "Notify every online stakeholder."},
        ...props.filteredContacts.filter((contact:Staff) => !props.stakeholders.includes(contact.id))
      ])
    }
  });
  
  return (
    <div class="contacts-wrapper">
      <For each={contacts()}>
        {(contact) => (
          <div class="contacts-item" onClick={() => props.handleContactsPopoverClick(`${contact.firstName.replace('@', '')} ${contact.lastName}`)}>
            <i class={`${contact.notify_msg ? 'fa-solid fa-bullhorn' : 'fa-regular fa-circle-user'}`}></i>
            <div><strong>{contact.firstName} {contact.lastName}</strong> {contact.notify_msg}</div>
            <Show when={!props.stakeholders.includes(contact.id) && !contact.notify_msg}>
              <div class="contacts-align-end">Not in chat</div>
            </Show>
          </div>
        )}
      </For>
    </div>
  )
}