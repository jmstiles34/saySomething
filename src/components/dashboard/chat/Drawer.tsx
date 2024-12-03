import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import "./Drawer.css";
import Stakeholders from "../tipDashboard/stakeholders/Stakeholders";

export default function Drawer(props:any) {
  return (
    <div class={`drawer ${props.activeDrawer ? 'active' : ''}`}>
      <div class="drawer-content">
        <Switch>
          <Match when={props.activeDrawer === "attach"}>
            Attachments
          </Match>
          <Match when={props.activeDrawer === "canned"}>
            Canned Messages
          </Match>
          <Match when={props.activeDrawer === "team"}>
            <Stakeholders />
          </Match>
        </Switch>
      </div>
    </div>
  )
}