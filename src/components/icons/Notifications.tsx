import { createSignal, Show } from "solid-js";
import "./Notifications.css"
import Icon from "./Icon";
import Bell from "./Bell"
import Chatting from "../dashboard/tools/Chatting";

export default function Notifications() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  return (  
    <div>   
      <button class="notifications-button" onClick={() => setIsMenuOpen(!isMenuOpen())}>
        <Icon>
          <div>
            <Bell color="#4d4d4d" />
          </div>
        </Icon>
      </button>

      <Show when={isMenuOpen()}>
        <div class="notifications-popover">
          <Chatting />
        </div>
      </Show>
    </div> 
  );
}