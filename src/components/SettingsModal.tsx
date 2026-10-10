import React, { useState } from 'react';
import { X, Key, User, Save, Check } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="card bg-[var(--card)] rounded-[12px] max-w-lg w-full p-6 shadow-xl border border-[var(--line)] relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center font-bold border border-[var(--ac)]/20 shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-medium text-[var(--ink)] tracking-tight">
                User Profile & Intelligence
              </h3>
              <p className="text-xs text-[var(--mut)] mt-0.5">Customize physiological factors & Gemini API credentials</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px] h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 my-5 text-xs">
          {/* User Name & Age */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="font-medium text-[var(--ink)]">Your Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="bg-[var(--card)] border-[var(--line)] h-9 text-xs rounded-[8px] focus-visible:ring-[var(--ac)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium text-[var(--ink)]">Age</Label>
              <Input
                type="number"
                value={age}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(Number(e.target.value))}
                className="bg-[var(--card)] border-[var(--line)] h-9 text-xs rounded-[8px] focus-visible:ring-[var(--ac)]"
              />
            </div>
          </div>

          {/* Health Conditions */}
          <div className="space-y-1.5">
            <Label className="font-medium text-[var(--ink)]">
              Respiratory / Health Conditions (comma-separated)
            </Label>
            <Input
              type="text"
              value={health}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHealth(e.target.value)}
              placeholder="e.g. Mild Asthma, Bronchitis, None"
              className="bg-[var(--card)] border-[var(--line)] h-9 text-xs rounded-[8px] focus-visible:ring-[var(--ac)]"
            />
          </div>

          {/* Sensitivity */}
          <div className="space-y-1.5">
            <Label className="font-medium text-[var(--ink)]">Vulnerability Sensitivity</Label>
            <select
              value={sensitivity}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSensitivity(e.target.value as any)}
              className="flex h-9 w-full rounded-[8px] border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ac)]"
            >
              <option value="normal">Normal (Standard healthy adult)</option>
              <option value="sensitive">Sensitive (Prone to throat / ocular irritation)</option>
              <option value="high_risk">High Risk (Asthmatic, cardiovascular or elderly)</option>
            </select>
          </div>

          {/* Gemini API Key */}
          <div className="card p-3.5 bg-[var(--bg)] rounded-[10px] border border-[var(--line)]">
            <div className="flex items-center gap-2 font-medium text-[var(--ink)] mb-1">
              <Key className="w-3.5 h-3.5 text-[var(--ac)]" />
              <span className="font-display text-xs">Google Gemini API Key (Optional)</span>
            </div>
            <p className="text-[11px] text-[var(--mut)] mb-2.5">
              Leave blank to employ the onboard autonomous rule synthesis model.
            </p>
            <Input
              type="password"
              value={keyInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="bg-[var(--card)] border-[var(--line)] h-8 font-mono text-xs rounded-[8px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-[var(--line)] flex items-center justify-end gap-2.5">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-xs h-8 px-3 rounded-[8px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="text-xs font-semibold h-8 px-4 rounded-[8px]"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
