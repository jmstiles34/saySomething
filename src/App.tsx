import type { Component } from 'solid-js';
import "./App.css"
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { ChatProvider } from "/src/context/ChatContext";

const App: Component = () => {
  return (
    <ChatProvider>
      <div class="app">
        <Header />
        <Dashboard />
      </div>
    </ChatProvider>
  );
};

export default App;
