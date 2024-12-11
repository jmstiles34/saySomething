import { For } from 'solid-js';
import "./Tags.css";
import { tags } from '/src/data/tags.json';
import { formatCamelCase } from '/src/common/utils/utils';

export default function Tags(props:any) {

  const handleTagClick = (name:string) => {
    const action = props.caseTags.includes(name) ? 'remove' : 'add';
    props.manageTags(action, name);
  }

  return (
    <div class="tags-wrapper">
      <div class="tags-header">
        <h1 class="title">Tagging</h1>
      </div>

      <div class="tags-category-list">
        <For each={Object.entries(tags)}>
            {(cat) => (
              <div>
                <h2 class="tags-section">{formatCamelCase(cat[0])}</h2>
                <div class="tags-list">
                  <For each={cat[1] as string[]}>
                    {(tag) => (
                      <button 
                        class={`tags-item ${props.caseTags.includes(tag) ? 'tags-item-selected' : ''}`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            )}
        </For>
      </div>
    </div>
  )
}