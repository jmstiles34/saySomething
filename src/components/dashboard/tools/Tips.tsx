import { createSignal, For, Show } from 'solid-js';
import { format } from 'date-fns';
import styles from "./Tips.module.css";
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
    <div class={styles.tipsWrapper}>
      <div class={styles.searchContainer}>
        <div class={styles.searchBox}>
          <div class={styles.searchIcon}>
            <i class="fa fa-magnifying-glass fa-lg"></i>
          </div>
          <div class={styles.searchField}>
            <input class={styles.searchInput} placeholder="Search tips" name="searchValue" />
          </div>
          <div></div>
        </div>
        <div>
          <button class={styles.newTip}>New Tip</button>
        </div>
      </div>
 
      <div class={styles.tabsHeader}>
        <For each={groupedTips}>
          {(tab, index) => (
            <button
              class={`${styles.tabButton} ${activeTab() === index() ? styles.active : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label} ({tab.tips.length})
            </button>
          )}
        </For>
      </div>
 
      <ul class={styles.tipList}>
        <For each={groupedTips[activeTab()].tips}>
          {(tip, index) => (
            <li class={`${styles.tipCard} ${props.activeTipId() === tip.tipId ? styles.tipActive : ''}`} onClick={() => props.setActiveTipId(tip.tipId)}>
              <div>
                <div>{tip.tipId}</div>
                <div>Event: {tip.tipType}</div>
                <div>Status: {tip.status}</div>
              </div>
              <div class={styles.rightCol}>
                <div>{format(tip.submittedAt, 'MM/dd/yyyy hh:mm aa')}</div>
                <Show when={tip.lifeSafety}>
                  <div class={styles.dangerIcon}>
                    <i class="fa-solid fa-triangle-exclamation fa-2xl"/>
                  </div>
                </Show>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}