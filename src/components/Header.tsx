import Notifications from "./icons/Notifications";
import Profile from "./icons/Profile";

export default function Header() {
  return (
    <header> 
      <img 
        src="/src/assets/images/SHP_Logo.svg"  
        alt="The shape of a tree where an arm and hand represent the truck and hand-prints represent the leafs." />
      
      <div>
        <Notifications />
        <Profile />
      </div>
    </header>
  );
}