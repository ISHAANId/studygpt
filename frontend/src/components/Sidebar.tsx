import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, BookOpen, HelpCircle, TrendingUp, Link as LinkIcon, Mic } from 'lucide-react';
import logo from "/logo.png";

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Chat', path: '/chat', icon: <MessageSquare size={20} /> },
  { name: 'Tutor', path: '/tutor', icon: <BookOpen size={20} /> },
  { name: 'Quiz', path: '/quiz', icon: <HelpCircle size={20} /> },
  { name: 'Progress', path: '/progress', icon: <TrendingUp size={20} /> },
  { name: 'Resources', path: '/resources', icon: <LinkIcon size={20} /> },
  { name: 'Voice', path: '/voice', icon: <Mic size={20} /> },
];

export default function Sidebar() {
  return (
    <aside className="bg-primary text-white flex flex-col h-screen w-72 shadow-md p-4">
      <div className="flex items-center gap-3 px-4 mb-8">
        <img src={logo} alt="StudyGPT" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-accent3 bg-clip-text text-transparent">
          StudyGPT
        </span>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-accent1 to-accent2 text-white font-medium'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-4 border-t border-white border-opacity-20 pt-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full" /> {/* avatar placeholder */}
        <div className="flex-1">
          <p className="text-sm font-medium">Ishaani Dongre</p>
          <Link to="/settings" className="text-xs opacity-80 hover:opacity-100">
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
