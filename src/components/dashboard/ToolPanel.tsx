import { Match, Switch } from "solid-js";
import { LABEL_CHATTING, LABEL_PHONE, LABEL_TIPS } from "/src/common/constants/constants";
import "./ToolPanel.css";
import Chatting from "./tools/Chatting";
import Phone from "./tools/phone/Phone";
import Tips from "./tools/Tips";


export default function ToolPanel(props:any) {
  return (
    <div class={`tool-panel ${props.selectedNav().length ? 'active' : ''}`}>
      <div class="tool-panel-header">
        <div>{props.selectedNav()}</div>
        <button class="close-icon" onClick={() => props.setSelectedNav('')}>
          <i class="fa-solid fa-circle-xmark fa-xl"></i>
        </button>
      </div>
      <Switch>
        <Match when={props.selectedNav() === LABEL_CHATTING}>
          <Chatting />
        </Match>
        <Match when={props.selectedNav() === LABEL_PHONE}>
          <Phone />
        </Match>
        <Match when={props.selectedNav() === LABEL_TIPS}>
          <Tips />
        </Match>
      </Switch>
    </div>
  );
}