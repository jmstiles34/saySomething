import { createEffect, createSignal, For } from 'solid-js';
import "./CaseBar.css";
import { tips } from '/src/data/tipData.json';
import { Tip } from './chat/types';

export default function CaseBar(props:any) {
  const [filteredCases, setFilteredCases] = createSignal<Tip[]>(
    tips.filter(t => t.assignedTo === "mine" && t.status !== "resolved"
    ));
   
  createEffect(() => {
    if (props.activeTipId() === null) {
      props.setActiveTipId(filteredCases()[0].tipId)
    }
  });

  createEffect(() => {
    props.setActiveCase(filteredCases().find(({tipId}) => tipId === props.activeTipId()) || null);
  });
  
  return (
    <div class="caseBar">
      <For each={filteredCases()}>
        {(tip, index) => (
          <button
            class={`case-button ${props.activeTipId() === tip.tipId ? 'active' : ''}`}
            onClick={() => props.setActiveTipId(tip.tipId)}
          >
            {tip.tipId} {tip.lifeSafety ? <i class="fa-solid fa-triangle-exclamation fa danger"/> : ''}
          </button>
        )}
      </For>
    </div>
  );
}