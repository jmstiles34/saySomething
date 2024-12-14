import { createEffect, createSignal, For, Match, Switch } from "solid-js";
import "./ToolBar.css";
import { tips } from '/src/data/tipData.json';
import { Tip } from "./chat/types";

export default function ToolPanel(props:any) {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isHovering, setIsHovering] = createSignal(false);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [filteredCases, setFilteredCases] = createSignal<Tip[]>(
    tips.filter((t:Tip) => t.assignedTo === "mine"
    ));
   
  const pulsingTips = ["TIP-002"];

  createEffect(() => {
    if (props.tipId === null) {
      props.setActiveTipId(filteredCases()[0].tipId)
    }
  });

  createEffect(() => {
    props.setActiveCase(filteredCases().find(({tipId}) => tipId === props.tipId) || null);
  });

  const groupedTips = [
    {
      label: "Mine",
      value: "mine",
      icon: "user",
      tips: tips.filter((t:Tip) => t.assignedTo === "mine" && t.status !== "resolved")
    },
    {
      label: "Team",
      value: "team",
      icon: "users",
      tips: tips.filter((t:Tip) => t.assignedTo === "team" && t.status !== "resolved")
    },
    {
      label: "New",
      value: "new",
      icon: "layer-group",
      tips: tips.filter((t:Tip) => t.assignedTo === "")
    }
  ];
  const [tipGroup, setTipGroup] = createSignal(groupedTips.filter(({value}) => value === 'mine')[0]);

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
    setTipGroup(groupedTips.filter(({value}) => value === item)[0]);
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
                <For each={groupedTips}>
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
            <div class="toolbar-list-card-wrapper">
              <button
                class={`toolbar-list-card ${props.tipId === tip.tipId ? 'list-card-active' : ''} ${pulsingTips.includes(tip.tipId) ? 'tip-pulse' : ''}`}
                onClick={() => props.setActiveTipId(tip.tipId)}
              >
                <div class={`${pulsingTips.includes(tip.tipId) ? 'tip-id-pulse' : ''}`}>{tip.tipId}</div> 
                <div></div>
                <div class="tip-type">
                  {tip.lifeSafety && <img class="danger-icon" src={`/src/assets/icons/life-safety.svg`} alt="Life Safety Icon" />}
                  {tip.tipType}
                  </div>
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}