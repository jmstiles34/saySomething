import { createEffect, createSignal, For, Show } from 'solid-js';
import "./Stakeholders.css";
import { formatPhoneNumber } from '../../../../common/utils/utils';
import { Staff } from '../../../../common/types/types';

export default function Stakeholders(props:any) {
  const [expandedList, setExpandedList] = createSignal<string[]>([]);
  const [filteredContacts, setFilteredContacts] = createSignal<Staff[]>(props.allContacts);
  const [invitedContacts, setInvitedContacts] = createSignal<string[]>(props.contacts);
  const [searchValue, setSearchValue] = createSignal<string>("");

  createEffect(() => {
    if (props.contacts || props.allContacts) {
      setFilteredContacts(props.allContacts)
      setInvitedContacts(props.contacts)
    }
  });

  const handleCallClick = (message:string) => {
    props.addCallMessage(`Outgoing call to ${message}`);
  }

  const handleCardClick = (id:string) => {
    if( expandedList().includes(id)){
      setExpandedList([...expandedList().filter(v => v !== id)]);
    } else {
      setExpandedList([...expandedList(), id]);
    }
  }

  const handleSearchInput = (text:string): void => {
    setSearchValue(text);
    if(text === ""){
      setFilteredContacts(props.allContacts);
    } else {
      setFilteredContacts([...props.allContacts.filter((contact:Staff) => {
        const joinedName = `${contact.firstName} ${contact.lastName}`
        return joinedName.toLowerCase().includes(text.toLowerCase())
      })]) 
    }
  }

  return (
    <div class="stakeholder-wrapper">
      <div class="stakeholder-header">
        <h1 class="title">Collaborators</h1>
      </div>

      <div class="search-container">
        <div class="search-box">
          <div class="search-icon">
            <i class="fa fa-magnifying-glass fa-lg"></i>
          </div>
          <div class="search-field">
            <input 
              class="search-input" 
              placeholder="Find collaborators..." 
              name="searchValue" 
              value={searchValue()}
              onInput={(e) => handleSearchInput(e.currentTarget.value)}
            />
          </div>
          <div></div>
        </div>
      </div>
    
      <div class="stakeholder-list">
      <Show when={!searchValue().length}>
          <div class="stakeholder-divider">
            Invited Collaborators
          </div>
        </Show>

        <For each={filteredContacts().filter((contact:Staff) => invitedContacts().includes(contact.id))}>
          {(contact) => (
            <div class="stakeholder-card" onClick={() => handleCardClick(contact.id)}>
              <div>
                <div><strong>{contact.firstName} {contact.lastName}</strong>, {contact.title}</div>
                <div>{props.school.name}</div>
                <Show when={expandedList().includes(contact.id)}>
                  <div>{contact.email}</div>
                  <div>Cell: {formatPhoneNumber(contact.phone.cell)}</div>
                  <div>Phone: {formatPhoneNumber(contact.phone.work)}</div>
                </Show>
              </div>

              <div class="stakeholder-actions">                  
                <button class="icon" onClick={(e) => {
                    e.stopPropagation();
                    handleCallClick(`${contact.firstName} ${contact.lastName}, ${contact.title}`)}}>
                  <i class={`fa-solid fa-square-phone fa-lg`}></i>
                </button>
                <button class="icon" onClick={(e) => {
                  e.stopPropagation();
                  props.manageStakeholders('remove', contact.id, `${contact.firstName} ${contact.lastName}`)
                }}>
                  <i class="fa fa-user-minus fa-lg"></i>
                </button>

                {/* <button class="call-button" onClick={(e) => {
                  e.stopPropagation();
                  handleCallClick(`${contact.name}, ${contact.title}`)}
                  }><i class="fa-solid fa-square-phone"></i> Call</button> */}
              </div>
            </div>
          )}
        </For>

        <Show when={!searchValue().length}>
          <div class="stakeholder-divider">
            Other Collaborators
          </div>
        </Show>
      
        <For each={filteredContacts().filter((contact:Staff) => !invitedContacts().includes(contact.id))}>
          {(contact) => (
            <div class="stakeholder-card" onClick={() => handleCardClick(contact.id)}>
              <div>
                <div><strong>{contact.firstName} {contact.lastName}</strong>, {contact.title}</div>
                <div>{props.school.name}</div>
                <Show when={expandedList().includes(contact.id)}>
                  <div>{contact.email}</div>
                  <div>Cell: {formatPhoneNumber(contact.phone.cell)}</div>
                  <div>Phone: {formatPhoneNumber(contact.phone.work)}</div>
                </Show>
              </div>

              <div class="stakeholder-actions">                  
                <button class="icon" onClick={(e) => {
                    e.stopPropagation();
                    handleCallClick(`${contact.firstName} ${contact.lastName}, ${contact.title}`)}}>
                  <i class={`fa-solid fa-square-phone fa-lg`}></i>
                </button>
                <button class="icon" onClick={(e) => {
                  e.stopPropagation();
                  props.manageStakeholders('add', contact.id, `${contact.firstName} ${contact.lastName}`)
                }}>
                  <i class="fa fa-user-plus fa-lg"></i>
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}