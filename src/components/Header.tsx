import "./Header.css";

export default function Header() {
  return (
    <header class="header">
      <img 
        src="/src/assets/images/SHP_Logo.svg"  
        alt="Sandy Hook Promise Logo" />
      
      <div class="header-icons">
        <div class="notification-icon">
          <i class="fa-solid fa-bell fa-xl"></i>
        </div>
      </div>
    </header>
  );
}