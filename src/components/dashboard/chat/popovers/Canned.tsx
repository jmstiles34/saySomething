import { For } from "solid-js";
import "./Canned.css";
import { canned } from '/src/data/canned.json';

export default function Canned(props:any) {
  
  return (
    <For each={["HANDOFF #1","HANDOFF #2","HANDOFF #3","HANDOFF #4","HANDOFF #5"]}>
      {(response) => (
        <div class="popover-item" onClick={() => {
          props.handleMessagesPopoverClick(null);
          }}>
          {response}
        </div>
      )}
    </For>
  )
}