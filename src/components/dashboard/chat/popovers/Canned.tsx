import { createEffect, createSignal, For } from "solid-js";
import "./Canned.css";
import { reporter, team } from '../../../../data/canned-codes.json';
import { formatCamelCase } from '../../../../common/utils/utils';

export default function Canned(props:any) {
  const [category, setCategory] = createSignal("");

  createEffect(() => {
    if(props.cannedFilter){
      const filterParts = props.cannedFilter.split(".");
      const categories = Object.entries(props.target === 'team' ? team : reporter);
      const catMatch = categories.filter(([cat, details]) => details.key === filterParts[0]);
      if(catMatch.length){
        if(filterParts.length === 1){
          setCategory(catMatch[0][0]);
        } else {
          const msgMatch = catMatch[0][1].messages.filter((m) => m.key === filterParts[1]);
          if(msgMatch.length){
            props.handleCannedPopoverClick(msgMatch[0].message);
          }
        }
      }
    }
  });

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
          <For each={Object.entries(props.target === 'team' ? team : reporter)}>
            {([cat, details]) => (
              <li class={`canned-category ${cat === category() ? 'canned-category-selected' : ''}`} onClick={() => {
                handleCategoryClick(cat);
                }}>
                {formatCamelCase(cat)} <span>({details.key})</span>
              </li>
            )}
          </For>
        </ul>

        <ul class="canned-message-list">
          <For each={Object.entries(props.target === 'team' ? team : reporter).filter(([name, d]) => name === category() || category() ===  "")}>
            {([cat, details]) => (
              <For each={details.messages}>
                {(item) => (
                <li class="canned-message" onClick={() => {
                  props.handleCannedPopoverClick(item.message);
                  }}>
                    <div><strong>{formatCamelCase(item.type)}</strong> <span>({item.key})</span></div>
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