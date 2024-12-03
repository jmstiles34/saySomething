import { createSignal, For, Match, Show, Switch } from 'solid-js';
import "./Phone.css";
import DialPad from './Dialpad';
import CallLog from './CallLog';
 
export default function Phone(props:any) {
  const [activeTab, setActiveTab] = createSignal(0);
  
  const phoneTabs = [
    {
      label: "Calls",
      value: "calls"
    },
    {
      label: "Dialpad",
      value: "dialpad"
    },
    {
      label: "Voicemail (6)",
      value: "voicemail"
    }
  ];

  return (
    <div class="phone-container">
      <div class="search-container">
        <div class="search-box">
          <div class="search-icon">
            <i class="fa fa-magnifying-glass fa-lg"></i>
          </div>
          <div class="search-field">
            <input class="search-input" placeholder="Search calls" name="searchValue" />
          </div>
          <div></div>
        </div>

        <div class="phone-filter">
          <select name="phoneFilter" class="filter-select">
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>
         
      <div class="tabs-header">
        <For each={phoneTabs}>
          {(tab, index) => (
            <button
              class={`tab-button ${activeTab() === index() ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div> 

      <Switch>
        <Match when={activeTab() === 0}>
          <CallLog />
        </Match>
        <Match when={activeTab() === 1}>
          <DialPad />
        </Match>
      </Switch>
    </div>
  );
}