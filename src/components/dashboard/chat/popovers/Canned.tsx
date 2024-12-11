import { createSignal, For } from "solid-js";
import "./Canned.css";
import { canned } from '/src/data/canned.json';
import { formatCamelCase } from '/src/common/utils/utils';

export default function Canned(props:any) {
  const [category, setCategory] = createSignal("");

  const handleCategoryClick = (cat:string) => {
    if(cat === category()){
      setCategory("");
    } else {
      setCategory(cat);
    }
  }

  return (
    <div class="canned-wrapper">
      <div class="canned-grid">
        <ul class="canned-category-list">
          <For each={Object.keys(canned)}>
            {(cat) => (
              <li class={`canned-category ${cat === category() ? 'canned-category-selected' : ''}`} onClick={() => {
                handleCategoryClick(cat);
                }}>
                {formatCamelCase(cat)}
              </li>
            )}
          </For>
        </ul>

        <ul class="canned-message-list">
          <For each={Object.entries(canned).filter((can) => can[0] === category() || category() ===  "")}>
            {(cat) => (
              <For each={cat[1]}>
                {(item) => (
                <li class="canned-message" onClick={() => {
                  props.handleCannedPopoverClick(item.message);
                  }}>
                    <div><strong>{formatCamelCase(item.type)}</strong></div>
                    <div>{item.message}</div>
                </li>
                )}
              </For>
            )}
          </For>
        </ul>
      </div>
    </div>
  )
}