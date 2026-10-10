import React, { useState } from 'react';
import { X, Key, User, Heart, Compass, Shield, Save, Check } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile, apiKey, setApiKey } = useAirGuard();

  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [health, setHealth] = useState(userProfile.healthConditions.join(', '));
  const [sensitivity, setSensitivity] = useState(userProfile.sensitivityLevel);
  const [keyInput, setKeyInput] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setUserProfile({
      ...userProfile,
      name,
      age: Number(age) || 24,
      healthConditions: health.split(',').map((s) => s.trim()).filter(Boolean),
      sensitivityLevel: sensitivity,
    });
    setApiKey(keyInput);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              👤
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">User Profile & Intelligence</h3>
              <p className="text-xs text-slate-500">Customize exposure coefficients & Gemini API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 my-4 text-xs">
          {/* User Name & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Health Conditions */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Respiratory / Health Conditions (comma-separated)
            </label>
            <input
              type="text"
              value={health}
              onChange={(e) => setHealth(e.target.value)}
              placeholder="e.g. Mild Asthma, Bronchitis, None"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Sensitivity */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Vulnerability Sensitivity</label>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden focus:border-indigo-500"
            >
              <option value="normal">Normal (Standard healthy adult)</option>
              <option value="sensitive">Sensitive (Prone to throat / eye irritation)</option>
              <option value="high_risk">High Risk (Asthmatic, cardiovascular or elderly)</option>
            </select>
          </div>

          {/* Gemini API Key */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>Google Gemini API Key (Optional)</span>
            </div>
            <p className="text-[11px] text-indigo-700 mb-2">
              Leave blank to use the built-in offline intelligent rule engine for seamless hackathon demos!
            </p>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
