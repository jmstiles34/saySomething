import { For, Show } from 'solid-js';
import "./Summary.css";
import { summaries } from '/src/data/summaries.json';

export default function Summary(props:any) {

  return (
    <div class="summary-wrapper">
      <div class="summary-header">
        <h1>{props.target === "team" ? 'Team Communications' : 'Reporter Dialog'} Summary</h1>
      </div>

      <ul>
        <For each={props.target === "team" ? summaries[props.tipId].teamComm : summaries[props.tipId].reporterDialog}>
            {(opt) => (
              <li>
                <h2>{opt.title}</h2>
                <Show when={typeof opt.notes === 'string'}>
                  <p>{opt.notes}</p>
                </Show>
                <Show when={typeof opt.notes !== 'string'}>
                  <ul class="nested">
                    <For each={opt.notes as string[]}>
                      {(note) => (
                        <li>
                          {note}
                        </li>
                      )}
                    </For>
                  </ul>
                </Show>
              </li>
            )}
        </For>
      </ul>
    </div>
  )
}