import { createEffect, createSignal, For, Show } from "solid-js";
import type { Signal } from "solid-js";
import "./ToolBar.css";
import { Tip } from "../../common/types/types";
import { useChatContext } from "../../context/ChatContext";
import { TIP_CATEGORY } from "../../common/constants/constants";
import { formatCamelCase, randomNumber } from "../../common/utils/utils";

export default function ToolBar(props:any) {
  const {rootTips} = useChatContext() as {rootTips:Signal<Tip[]>};
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [openGroups, setOpenGroups] = createSignal<string[]>(['mine']);
  const [tips, setTips] = rootTips;
  const [animationPlayed, setAnimationPlayed] = createSignal<boolean>(false);
  
  createEffect(() => {
    if(props.counselorId){
      setGroupedTips(
        buildGroupedTips(props.counselorId)
      )
      setOpenGroups(['mine'])
    }
  });

  const buildGroupedTips = (id:string) => {
    return {
      mine: {
        icon: "user",
        tips: tips()
          .filter((t:Tip) => t.assignedTo === id)
      },
      team: {
        icon: "user",
        tips: tips()
          .filter((t:Tip) => t.assignedTo !== id && t.assignedTo !== null)
          .map((t:Tip) => { return {...t, unread: randomNumber(5)}})
      }/* ,
      unassigned: {
        icon: "user",
        tips: tips().filter((t:Tip) => t.assignedTo === null)
      } */
    }
  }
  const [groupedTips, setGroupedTips] = createSignal<object>(buildGroupedTips(props.counselorId));

  const toggleGroupOpen = (group:string) => {
    if(openGroups().includes(group)){
      setOpenGroups(openGroups().filter(g => g !== group))
    } else {
      setOpenGroups([...openGroups(), group])
    }
  }

  return (
    <div class={`toolbar ${isExpanded() ? 'expanded' : ''}`}>
      <button class="icon" onClick={() => setIsExpanded(!isExpanded())}> 
        <i class={`fa-solid fa-angles-${isExpanded() ? 'left' : 'right'}`}></i>
      </button>

      <ul class="toolbar-list">
        <For each={Object.entries(groupedTips())}>
          {([group, data]) => (
            <li class="toolbar-list-group">
              <button class="tip-group-title" onClick={() => toggleGroupOpen(group)}>
                <div>{openGroups().includes(group) ? '▾' : '▸'}</div>
                <div class="group-name">{formatCamelCase(group)} <span>({data.tips.length})</span></div>
              </button>

              <Show when={openGroups().includes(group)}>
                <ul>
                  <For each={data.tips}>
                    {(tip) => (
                      <li class={(group === 'mine' && tip.tipId === 'TIP-8999') ? 'tip-bg-pulse' : ''}>
                        <button
                          class={`toolbar-list-card ${props.tipId === tip.tipId ? 'list-card-active' : ''}`}
                          onClick={() => props.handleTipUpdate(tip.tipId)}
                        >
                          <div>{TIP_CATEGORY[tip.tipType as keyof typeof TIP_CATEGORY].icon}</div>
                          <div class={`list-card-tipid ${tip.unread && tip.unread > 10 ? 'tip-id-pulse' : ''}`}>
                            {tip.tipId}
                          </div> 
                          <Show when={isExpanded() && tip.unread && tip.unread > 0}>
                            <div class="tip-message-count">{tip.unread}</div>
                          </Show>
                        </button>
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
  );
}