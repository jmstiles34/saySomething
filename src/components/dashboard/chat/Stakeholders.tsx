import { createSignal, For, Show } from 'solid-js';
import "./Stakeholders.css";
import { contacts } from '/src/data/contacts.json'; 
import { formatPhoneNumber } from '/src/common/utils/utils';

export default function Stakeholders(props:any) {
  const [expandedList, setExpandedList] = createSignal<string[]>([]);

  const handleCardClick = (id:string) => {
    if( expandedList().includes(id)){
      setExpandedList([...expandedList().filter(v => v !== id)]);
    } else {
      setExpandedList([...expandedList(), id]);
    }
  }

  return (
    <div class="stakeholder-scroll">
      <For each={contacts}>
          {(contact) => (
            <div class="stakeholder-card" onClick={() => handleCardClick(contact.id)}>
              <div><strong>{contact.name}</strong>, {contact.title}</div>
              <div>{contact.school}</div>
              <Show when={expandedList().includes(contact.id)}>
                <div><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
                <div>Cell: {formatPhoneNumber(contact.cell_phone)}</div>
                <div>Phone: {formatPhoneNumber(contact.work_phone)}</div>
              </Show>
            </div>
          )}
        </For>
    </div>
  );
}