import { createSignal, For, Show } from "solid-js";
import type { Signal } from "solid-js";
import "./Profile.css"
import Icon from "./Icon";
import Counselor from "../../assets/icons/Counselor"
import type { Counselor as CounselorType } from '../../common/types/types';
import { useChatContext } from "../../context/ChatContext";

export default function Profile() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const { activeCounselor, counselors } = 
    useChatContext() as {
      activeCounselor:Signal<CounselorType>,
      counselors:CounselorType[]
    };
  const [counselor, setCounselor] = activeCounselor;

  const handleCounselorClick = (profile:CounselorType) => {
    setCounselor({...profile});
    setIsMenuOpen(false);
  }

  return (      
    <div>
      <button class="profile-button" onClick={() => setIsMenuOpen(!isMenuOpen())}>
        <Icon>
          <Counselor body={counselor().colors[1]} head={counselor().colors[0]} />
        </Icon>
      </button>
      

      <Show when={isMenuOpen()}>
        <menu>
          <ul class="profile-list">
            <For each={counselors}>
              {(c) => (
                <li class={`profile-item`} onClick={() => handleCounselorClick(c)}>
                    <div>{c.displayName}</div>
                </li>
              )}
            </For>
          </ul>
        </menu>
      </Show>
    </div>
  );
}