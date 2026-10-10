import React, { useState } from 'react';
import { X, Key, User, Heart, Compass, Shield, Save, Check } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm border border-indigo-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">User Profile & Intelligence</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Customize exposure coefficients & Gemini API</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-5 my-5 text-xs">
          {/* User Name & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Your Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="bg-slate-50 border-slate-200 h-10 shadow-inner focus-visible:ring-indigo-500/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700">Age</Label>
              <Input
                type="number"
                value={age}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(Number(e.target.value))}
                className="bg-slate-50 border-slate-200 h-10 shadow-inner focus-visible:ring-indigo-500/30"
              />
            </div>
          </div>

          {/* Health Conditions */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">
              Respiratory / Health Conditions (comma-separated)
            </Label>
            <Input
              type="text"
              value={health}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHealth(e.target.value)}
              placeholder="e.g. Mild Asthma, Bronchitis, None"
              className="bg-slate-50 border-slate-200 h-10 shadow-inner focus-visible:ring-indigo-500/30"
            />
          </div>

          {/* Sensitivity */}
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700">Vulnerability Sensitivity</Label>
            <select
              value={sensitivity}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSensitivity(e.target.value as any)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 shadow-inner"
            >
              <option value="normal">Normal (Standard healthy adult)</option>
              <option value="sensitive">Sensitive (Prone to throat / eye irritation)</option>
              <option value="high_risk">High Risk (Asthmatic, cardiovascular or elderly)</option>
            </select>
          </div>

          {/* Gemini API Key */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100/80 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-2 font-bold text-indigo-900 mb-1">
              <Key className="w-4 h-4 text-indigo-600" />
              <span>Google Gemini API Key (Optional)</span>
            </div>
            <p className="text-[11px] text-indigo-700/80 mb-3 font-medium">
              Leave blank to use the built-in offline intelligent rule engine for seamless hackathon demos!
            </p>
            <Input
              type="password"
              value={keyInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="bg-white border-indigo-200 h-9 font-mono text-xs focus-visible:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-600 hover:bg-slate-100 font-bold h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 shadow-sm transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
