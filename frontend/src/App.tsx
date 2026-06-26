import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import Tutor from "./components/Tutor";
import Quiz from "./components/Quiz";
import Progress from "./components/Progress";
import Resources from "./components/Resources";
import Voice from "./components/Voice";
import Settings from "./components/Settings";

function Layout() {
  return (
    <div className="flex min-h-screen bg-bg font-sans text-primary">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<div className="bg-bg min-h-screen" />} />
      </Routes>
    </BrowserRouter>
  );
}

