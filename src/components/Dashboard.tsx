import { createSignal } from "solid-js";
import "./Dashboard.css";
import BurgerButton from "./dashboard/BurgerButton";
import ToolPanel from "./dashboard/ToolPanel";
import CaseBar from "./dashboard/CaseBar";
import { Tip } from './dashboard/chat/types';

export default function Dashboard() {
  const [selectedNav, setSelectedNav] = createSignal("");
  const [activeTipId, setActiveTipId] = createSignal<string | null>(null);
  const [activeCase, setActiveCase] = createSignal<Tip | null>(null);

  return (
    <main>
      <BurgerButton setSelectedNav={setSelectedNav} />
      <CaseBar activeTipId={activeTipId} setActiveCase={setActiveCase} setActiveTipId={setActiveTipId} />
      <ToolPanel selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
      <div></div>
    </main>
  );
}