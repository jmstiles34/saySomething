import { createSignal, For, Show } from "solid-js";
import type { Signal } from "solid-js";
import "./Profile.css"
import Counselor from "./Counselor"
import type { Counselor as CounselorType } from '../../common/types/types';
import { useChatContext } from "../../context/ChatContext";
import Avatar from "../dashboard/Avatar";

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
        <Avatar>
          <Counselor body={counselor().colors[1]} head={counselor().colors[0]} />
        </Avatar>
      </button>
      

      <Show when={isMenuOpen()}>
        <menu>
          <ul class="profile-list">
            <For each={counselors.sort((a, b) => {            
              return a.displayName.localeCompare(b.displayName)
            })}>
              {(c) => (
                <li class="profile-item" onClick={() => handleCounselorClick(c)}>
                    <Avatar size="sm">
                      <Counselor body={c.colors[1]} head={c.colors[0]} />
                    </Avatar>
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