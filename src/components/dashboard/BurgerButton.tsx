import { createSignal, For } from "solid-js";
import { TOOLS } from "/src/common/constants/constants";
import "./BurgerButton.css";

export default function BurgerButton(props:any) {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [isHovering, setIsHovering] = createSignal(false);
   
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

  const handleNavClick = (item:string) => {
    if( item === props.selectedNav) {
      props.setSelectedNav('');
    } else {
      props.setSelectedNav(item);
    }
    handleSubmenuLeave();
  }

  return (
    <div class="burger-button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button class="icon" onClick={toggleMenu}>
          <i class={`fa fa-bars fa-lg`}></i>
        </button>

        {isMenuOpen() && (
          <nav 
            class="burger-menu"
            onMouseEnter={handleSubmenuEnter}
            onMouseLeave={handleSubmenuLeave}
          >
            <ul class="items">
              <For each={TOOLS}>
              {(item) => (
                <li class="item" onClick={() => handleNavClick(item.label)}>
                    <i class={`fa fa-${item.icon}`} aria-hidden="true"></i>
                    <div>{item.label}</div>
                </li>
              )}
              </For>
            </ul>
          </nav>
        )}
      </div>
  );
}