import { createSignal, For, Show } from 'solid-js';
import { format } from 'date-fns';
import case from "./Tips.css";
import { tips } from '/src/data/tipData.json';

export default function Tips(props:any) {
  const [activeTab, setActiveTab] = createSignal(0);

  const groupedTips = [
    {
      label: "Mine",
      value: "mine",
      tips: tips.filter(t => t.assignedTo === "mine" && t.status !== "resolved")
    },
    {
      label: "Team",
      value: "team",
      tips: tips.filter(t => t.assignedTo === "team" && t.status !== "resolved")
    },
    {
      label: "Unassigned",
      value: "unassigned",
      tips: tips.filter(t => t.assignedTo === "")
    }
  ];
 
  return (
    <div class="Case.case-wrapper">
      <div class="Case.search-container">
        <div class="Case.search-box">
          <div class="Case.search-icon">
            <i class="fa fa-magnifying-glass fa-lg"></i>
          </div>
          <div class="Case.search-field">
            <input class="Case.search-input" placeholder="Search tips" name="searchValue" />
          </div>
          <div></div>
        </div>
        <div>
          <button class="Case.new-tip">New Tip</button>
        </div>
      </div>
 
      <div class="Case.tabs-header">
        <For each={groupedTips}>
          {(tab, index) => (
            <button
              class={`Case.tab-button ${activeTab() === index() ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label} ({tab.tips.length})
            </button>
          )}
        </For>
      </div>

      <div class="Case.tip-list">
        <For each={groupedTips[activeTab()].tips}>
          {(tip, index) => (
            <div class="Case.tip-card">
              <div class="Case.tip-card-col">
                <div>{tip.tipId}</div>
                <div>Event: {tip.tipType}</div>
                <div>Status: {tip.status}</div>
              </div>
              <div class="Case.tip-card-col Case.align-end">
                <div>{format(tip.submittedAt, 'MM/dd/yyyy hh:mm aa')}</div>
                <Show when={tip.lifeSafety}>
                  <div class="Case.danger">
                    <i class="fa-solid fa-triangle-exclamation fa-xl"/>
                  </div>
                </Show>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}