import { createEffect, createSignal, For, Show } from "solid-js";
import "./ToolBar.css";
import { School, Tip } from "../../common/types/types";
import { useChatContext } from "/src/context/ChatContext";
import { randomNumber } from "../../common/utils/utils";

type GroupTip = {
  label: string,
  value: string,
  icon: string,
  tips: Tip[]
}

export default function ToolBar(props:any) {
  const {schools, tips} = useChatContext();
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isHovering, setIsHovering] = createSignal(false);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  
  createEffect(() => {
    if(props.counselorId){
      setGroupedTips(
        buildGroupedTips(props.counselorId)
      )
      setTipGroup(groupedTips().filter(({value}) => value === 'mine')[0]);
    }
  });

  const buildGroupedTips = (id:string) => {
    return [
      {
        label: "Mine",
        value: "mine",
        icon: "user",
        tips: tips.filter((t:Tip) => t.assignedTo === id)
      },
      {
        label: "Team",
        value: "team",
        icon: "users",
        tips: tips.filter((t:Tip) => t.assignedTo !== id && t.assignedTo !== null)
      },
      {
        label: "Unassigned",
        value: "unassigned",
        icon: "layer-group",
        tips: tips.filter((t:Tip) => t.assignedTo === null)
      }
    ]
  }
  const [groupedTips, setGroupedTips] = createSignal<GroupTip[]>(buildGroupedTips(props.counselorId));

  const pulsingTips = ["TIP-6832"];

  const [tipGroup, setTipGroup] = createSignal(groupedTips().filter(({value}) => value === 'mine')[0]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen());
  }

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay to allow mouse to move between hamburger and submenu
    setTimeout(() => {
      if (!isHovering()) {
        setIsMenuOpen(false);
      }
    }, 100);
  };

  const handleSubmenuEnter = () => {
    setIsHovering(true);
  };

  const handleSubmenuLeave = () => {
    setIsMenuOpen(false);
    setIsHovering(false);
  };

  const handleMenuClick = (item:string) => {
    setTipGroup(groupedTips().filter(({value}) => value === item)[0]);
    handleSubmenuLeave();
  }

  return (
    <div class={`toolbar ${isExpanded() ? 'expanded' : ''}`}>
      <div class="toolbar-header">
          <button class="burger-button icon" onClick={toggleMenu} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <i class={`fa fa-bars`}></i>
          </button> 

          {isMenuOpen() && (
            <menu 
              class="burger-menu"
              onMouseEnter={handleSubmenuEnter}
              onMouseLeave={handleSubmenuLeave}
            >
              <ul class="items">
                <For each={groupedTips()}>
                  {(group) => (
                    <li class={`tip-menu-item ${group.value === tipGroup().value ? 'list-card-active' : ''}`} onClick={() => handleMenuClick(group.value)}>
                        <div><i class={`fa-solid fa-${group.icon} fa-sm`} aria-hidden="true"></i></div>
                        <div>{group.label}</div>
                    </li>
                  )}
                </For>
              </ul>
            </menu>
          )}

          <button class="icon" onClick={() => setIsExpanded(!isExpanded())}>
            <i class={`fa-solid fa-angles-${isExpanded() ? 'left' : 'right'}`}></i>
          </button>
      </div>
      <div class="toolbar-list">
        <For each={tipGroup().tips}>
          {(tip, index) => (
            <div class={`
              toolbar-list-card-wrapper 
              ${tip.lifeSafety ? 'tip-card-life-safety' : ''}
              ${props.tipId === tip.tipId ? 'list-card-active' : ''}
            `}>
              <button
                class={`
                  toolbar-list-card 
                  ${pulsingTips.includes(tip.tipId) ? 'tip-pulse' : ''}
                `}
                onClick={() => props.handleTipUpdate(tip.tipId)}
              >
                <div class={`${pulsingTips.includes(tip.tipId) ? 'tip-id-pulse' : ''}`}>{tip.tipId}</div> 
                <div class="tip-message-count">{randomNumber(5)}</div>
                <div class={`tip-type ${isExpanded() ? 'tip-type-expanded' : ''}`}>
                  {/* {tip.lifeSafety && <img class="danger-icon" src={`/src/assets/icons/life-safety.svg`} alt="Life Safety Icon" />} */}
                  {tip.tipType}
                </div>
                <Show when={isExpanded()}>
                  <div class="tip-timezone">
                    {schools.find((school:School) => school.id === tip.schoolId)?.timezone}
                  </div>
                </Show>
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}