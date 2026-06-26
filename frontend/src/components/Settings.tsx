import React, { useState } from 'react';
import { User, Settings as SettingsIcon, Shield, Moon, Save } from 'lucide-react';

export default function Settings() {
  const [userName, setUserName] = useState('Ishaani Dongre');
  const [theme, setTheme] = useState('warm');
  const [assistantModel, setAssistantModel] = useState('llama3.2:latest');
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="space-y-8 min-h-[calc(100vh-100px)] max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <SettingsIcon size={24} className="text-accent1" />
          Settings & Customization
        </h2>
        <p className="text-sm text-gray-500 mt-1">Configure your personal preferences and AI learning model settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: profile summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 rounded-full bg-accent1/10 flex items-center justify-center text-accent1 border-2 border-accent3">
            <User size={48} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">{userName}</h3>
            <p className="text-xs text-gray-400 font-medium">Student Scholar</p>
          </div>
          <div className="w-full border-t border-gray-100 my-2 pt-4 text-xs text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="font-bold text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Class Year:</span>
              <span className="font-bold text-primary">Senior</span>
            </div>
          </div>
        </div>

        {/* Right side: configuration form */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-primary/5">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <h4 className="font-bold text-primary border-b border-gray-100 pb-2 text-sm flex items-center gap-1.5">
                <User size={16} className="text-accent2" /> Personal Profile
              </h4>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-gray-50 text-sm text-primary border border-gray-200 focus:border-accent1 rounded-xl px-4 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-primary border-b border-gray-100 pb-2 text-sm flex items-center gap-1.5">
                <Moon size={16} className="text-accent2" /> Interface Preferences
              </h4>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">UI Color Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'warm', label: 'Warm Hues', desc: 'Warm cream, rose & amber' },
                    { id: 'dark', label: 'Dark Mode', desc: 'Sleek carbon dark tone' },
                    { id: 'default', label: 'Vibrant Light', desc: 'Standard clean look' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        theme === t.id
                          ? 'border-accent1 bg-accent3/10 ring-1 ring-accent1'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-bold text-primary">{t.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-primary border-b border-gray-100 pb-2 text-sm flex items-center gap-1.5">
                <Shield size={16} className="text-accent2" /> AI Assistant Options
              </h4>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ollama Model Registry</label>
                <select
                  value={assistantModel}
                  onChange={(e) => setAssistantModel(e.target.value)}
                  className="w-full bg-gray-50 text-sm text-primary border border-gray-200 focus:border-accent1 rounded-xl px-4 py-2.5 focus:outline-none"
                >
                  <option value="llama3.2:latest">Llama 3.2 (Latest - Recommended)</option>
                  <option value="llama3:latest">Llama 3 (Alternative)</option>
                  <option value="mistral:latest">Mistral (Compact)</option>
                </select>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-green-600 font-semibold">
                {savedStatus && '✨ Settings saved successfully!'}
              </span>
              <button
                type="submit"
                className="bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white py-2.5 px-6 rounded-xl font-bold text-sm shadow transition-all flex items-center gap-1.5"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
