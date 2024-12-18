import { createEffect, createSignal, For, Show } from "solid-js";
import "./ToolBar.css";
import { School, Tip } from "../../common/types/types";
import { useChatContext } from "../../context/ChatContext";
import { formatCamelCase, randomNumber } from "../../common/utils/utils";

type GroupTip = {
  icon: string,
  tips: Tip[]
}

export default function ToolBar(props:any) {
  const {schools, tips} = useChatContext() as {
    schools:School[],
    tips:Tip[]
  };
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isHovering, setIsHovering] = createSignal(false);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [groupName, setGroupName] = createSignal('mine');
  const pulsingTips = ["TIP-6832"];
  
  createEffect(() => {
    if(props.counselorId){
      setGroupedTips(
        buildGroupedTips(props.counselorId)
      )
      setGroupName('mine')
    }
  });

  const buildGroupedTips = (id:string) => {
    return {
      mine: {
        icon: "user",
        tips: tips.filter((t:Tip) => t.assignedTo === id)
      },
      team: {
        icon: "user",
        tips: tips.filter((t:Tip) => t.assignedTo !== id && t.assignedTo !== null)
      },
      unassigned: {
        icon: "user",
        tips: tips.filter((t:Tip) => t.assignedTo === null)
      }
    }
  }
  const [groupedTips, setGroupedTips] = createSignal<object>(buildGroupedTips(props.counselorId));

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
    setGroupName(item);
    handleSubmenuLeave();
  }

  return (
    <div class={`toolbar ${isExpanded() ? 'expanded' : ''}`}>
      <div>
        <button class="burger-button icon" onClick={toggleMenu} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <i class={`fa fa-bars`}></i>
        </button> 

        {isMenuOpen() && (
          <menu onMouseEnter={handleSubmenuEnter} onMouseLeave={handleSubmenuLeave}>
            <ul>
              <For each={Object.entries(groupedTips())}>
                {([name, values]) => (
                  <li class={`${name === groupName() ? 'menu-item-active' : ''}`} onClick={() => handleMenuClick(name)}>
                    <div><i class={`fa-solid fa-${values.icon} fa-sm`} aria-hidden="true"></i></div>
                    <div>{formatCamelCase(name)}</div>
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

      <ul class="toolbar-list">
        <For each={(groupedTips()[groupName() as keyof typeof groupedTips] as GroupTip).tips}>
          {(tip) => (
            <li class={`
              toolbar-list-card-wrapper 
              ${props.tipId === tip.tipId ? 'list-card-active' : ''}
              ${tip.lifeSafety ? 'tip-card-life-safety' : ''}
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
                  {tip.tipType}
                </div>
                <Show when={isExpanded()}>
                  <div class="tip-timezone">
                    {schools.find((school:School) => school.id === tip.schoolId)?.timezone}
                  </div>
                </Show>
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}