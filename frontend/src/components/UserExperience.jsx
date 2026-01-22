/**
 * ============================================================================
 * END USER EXPERIENCE IMPROVEMENTS - 1500+ Lines
 * ============================================================================
 * Player progression, achievements, settings, accessibility,
 * tutorials, and quality of life features
 * ============================================================================
 */

import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import {
  Settings, Volume2, VolumeX, Sun, Moon, Eye, EyeOff,
  Palette, Monitor, Smartphone, Gamepad2, Keyboard,
  HelpCircle, BookOpen, Award, Star, Trophy, Target,
  Zap, Gift, Crown, Heart, Shield, Sparkles, Medal,
  TrendingUp, BarChart3, Clock, Calendar, User,
  Bell, BellOff, Globe, Languages, Accessibility,
  Save, Download, Upload, RefreshCw, Trash2, Check
} from 'lucide-react';

// ============================================================================
// SETTINGS CONTEXT & PROVIDER
// ============================================================================

const defaultSettings = {
  // Audio
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 80,
  ambientVolume: 60,
  voiceVolume: 100,
  
  // Graphics
  quality: 'high',
  particles: true,
  weatherEffects: true,
  screenShake: true,
  showFPS: false,
  fullscreen: false,
  
  // Gameplay
  autoSave: true,
  autoSaveInterval: 5,
  showTutorials: true,
  showHints: true,
  difficulty: 'normal',
  fishingAssist: false,
  
  // Accessibility
  colorBlindMode: 'none',
  textSize: 'medium',
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
  
  // UI
  hudScale: 100,
  minimapSize: 'medium',
  showDamageNumbers: true,
  showQuestTracker: true,
  compactInventory: false,
  
  // Controls
  invertYAxis: false,
  mouseSensitivity: 50,
  controlScheme: 'default',
  
  // Notifications
  showAchievements: true,
  showLevelUp: true,
  showQuestUpdates: true,
  showFishCaught: true,
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('gameSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  
  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);
  
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);
  
  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

// ============================================================================
// SETTINGS PANEL COMPONENT
// ============================================================================

export const SettingsPanel = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings } = useSettings() || { settings: defaultSettings, updateSetting: () => {}, resetSettings: () => {} };
  const [activeTab, setActiveTab] = useState('audio');
  
  if (!isOpen) return null;
  
  const tabs = [
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'graphics', label: 'Graphics', icon: Monitor },
    { id: 'gameplay', label: 'Gameplay', icon: Gamepad2 },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'controls', label: 'Controls', icon: Keyboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];
  
  const renderSlider = (label, settingKey, min = 0, max = 100, step = 1) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-white/80">{label}</label>
        <span className="text-white/60">{settings[settingKey]}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={settings[settingKey]}
        onChange={(e) => updateSetting(settingKey, parseInt(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
      />
    </div>
  );
  
  const renderToggle = (label, settingKey, description) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-white/80">{label}</p>
        {description && <p className="text-xs text-white/40">{description}</p>}
      </div>
      <button
        onClick={() => updateSetting(settingKey, !settings[settingKey])}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          settings[settingKey] ? 'bg-amber-500' : 'bg-white/20'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          settings[settingKey] ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
  
  const renderSelect = (label, settingKey, options) => (
    <div className="space-y-2">
      <label className="text-white/80">{label}</label>
      <select
        value={settings[settingKey]}
        onChange={(e) => updateSetting(settingKey, e.target.value)}
        className="w-full p-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-black/20 border-r border-white/10 p-4">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Settings</h2>
          </div>
          
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={resetSettings}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
          
          {/* Audio Settings */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Audio Settings</h3>
              {renderSlider('Master Volume', 'masterVolume')}
              {renderSlider('Music Volume', 'musicVolume')}
              {renderSlider('Sound Effects', 'sfxVolume')}
              {renderSlider('Ambient Sounds', 'ambientVolume')}
              {renderSlider('Voice Volume', 'voiceVolume')}
            </div>
          )}
          
          {/* Graphics Settings */}
          {activeTab === 'graphics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Graphics Settings</h3>
              {renderSelect('Quality', 'quality', [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'ultra', label: 'Ultra' },
              ])}
              {renderToggle('Particle Effects', 'particles', 'Enable particle effects like splashes and sparkles')}
              {renderToggle('Weather Effects', 'weatherEffects', 'Show rain, snow, and other weather effects')}
              {renderToggle('Screen Shake', 'screenShake', 'Camera shake on impacts')}
              {renderToggle('Show FPS', 'showFPS', 'Display frames per second')}
              {renderToggle('Fullscreen', 'fullscreen', 'Run in fullscreen mode')}
            </div>
          )}
          
          {/* Gameplay Settings */}
          {activeTab === 'gameplay' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Gameplay Settings</h3>
              {renderSelect('Difficulty', 'difficulty', [
                { value: 'easy', label: 'Easy - Relaxed fishing' },
                { value: 'normal', label: 'Normal - Balanced challenge' },
                { value: 'hard', label: 'Hard - For experienced anglers' },
                { value: 'legendary', label: 'Legendary - Ultimate challenge' },
              ])}
              {renderToggle('Auto Save', 'autoSave', 'Automatically save progress')}
              {renderSlider('Auto Save Interval (minutes)', 'autoSaveInterval', 1, 30)}
              {renderToggle('Show Tutorials', 'showTutorials', 'Display tutorial messages for new features')}
              {renderToggle('Show Hints', 'showHints', 'Display helpful hints during gameplay')}
              {renderToggle('Fishing Assist', 'fishingAssist', 'Enable visual aids for fishing timing')}
            </div>
          )}
          
          {/* Accessibility Settings */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Accessibility Settings</h3>
              {renderSelect('Color Blind Mode', 'colorBlindMode', [
                { value: 'none', label: 'None' },
                { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
                { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
                { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
              ])}
              {renderSelect('Text Size', 'textSize', [
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'extra-large', label: 'Extra Large' },
              ])}
              {renderToggle('High Contrast', 'highContrast', 'Increase contrast for better visibility')}
              {renderToggle('Reduce Motion', 'reduceMotion', 'Minimize animations and movement')}
              {renderToggle('Screen Reader Support', 'screenReader', 'Enable screen reader compatibility')}
              {renderSlider('HUD Scale (%)', 'hudScale', 50, 150)}
            </div>
          )}
          
          {/* Controls Settings */}
          {activeTab === 'controls' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Control Settings</h3>
              {renderSelect('Control Scheme', 'controlScheme', [
                { value: 'default', label: 'Default' },
                { value: 'alternative', label: 'Alternative' },
                { value: 'lefty', label: 'Left-Handed' },
                { value: 'custom', label: 'Custom' },
              ])}
              {renderToggle('Invert Y-Axis', 'invertYAxis', 'Invert vertical camera movement')}
              {renderSlider('Mouse Sensitivity', 'mouseSensitivity', 1, 100)}
              
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <h4 className="font-medium text-white mb-3">Key Bindings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Cast Line</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Inventory</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white">I</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Quest Log</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white">J</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Map</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white">M</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Interact</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white">E</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Menu</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white">Esc</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
              {renderToggle('Achievement Notifications', 'showAchievements', 'Show when you unlock achievements')}
              {renderToggle('Level Up Notifications', 'showLevelUp', 'Show when you level up')}
              {renderToggle('Quest Updates', 'showQuestUpdates', 'Show quest progress and completion')}
              {renderToggle('Fish Caught Notifications', 'showFishCaught', 'Show notification for each fish caught')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ACHIEVEMENT SYSTEM
// ============================================================================

export const AchievementPopup = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!achievement) return null;
  
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-in-up">
      <div className="bg-gradient-to-r from-amber-500/90 to-yellow-500/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-yellow-400/50 min-w-[300px]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-400/30 rounded-xl">
            <Trophy className="w-8 h-8 text-yellow-200" />
          </div>
          <div>
            <p className="text-yellow-200 text-sm font-medium">Achievement Unlocked!</p>
            <p className="text-white font-bold text-lg">{achievement.name}</p>
            <p className="text-yellow-100/80 text-sm">{achievement.description}</p>
          </div>
        </div>
        {achievement.rewards && (
          <div className="mt-3 pt-3 border-t border-yellow-400/30 flex gap-3">
            {achievement.rewards.xp && (
              <span className="text-sm text-yellow-200">+{achievement.rewards.xp} XP</span>
            )}
            {achievement.rewards.gold && (
              <span className="text-sm text-yellow-200">+{achievement.rewards.gold} Gold</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const AchievementsPanel = ({ isOpen, onClose, achievements = [], unlockedIds = [] }) => {
  const [filter, setFilter] = useState('all');
  
  if (!isOpen) return null;
  
  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return unlockedIds.includes(a.id);
    if (filter === 'locked') return !unlockedIds.includes(a.id);
    return true;
  });
  
  const progress = {
    total: achievements.length,
    unlocked: unlockedIds.length,
    percent: achievements.length > 0 ? (unlockedIds.length / achievements.length) * 100 : 0,
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Achievements</h2>
                <p className="text-white/60">{progress.unlocked} of {progress.total} unlocked</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
              ✕
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          
          {/* Filter */}
          <div className="flex gap-2 mt-4">
            {['all', 'unlocked', 'locked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === f ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        {/* Achievements grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {filteredAchievements.map(achievement => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-amber-500/20' : 'bg-white/10'}`}>
                      <span className="text-2xl">{achievement.icon || '🏆'}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${isUnlocked ? 'text-amber-400' : 'text-white/60'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-white/50">{achievement.description}</p>
                      {achievement.rewards && (
                        <div className="flex gap-2 mt-2">
                          {achievement.rewards.xp && (
                            <span className="text-xs text-purple-400">+{achievement.rewards.xp} XP</span>
                          )}
                          {achievement.rewards.gold && (
                            <span className="text-xs text-yellow-400">+{achievement.rewards.gold}g</span>
                          )}
                        </div>
                      )}
                    </div>
                    {isUnlocked && <Check className="w-5 h-5 text-green-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PLAYER STATS & PROFILE
// ============================================================================

export const PlayerProfile = ({ player, stats, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const level = player?.level || 1;
  const xp = player?.xp || 0;
  const xpToNext = level * 1000;
  const xpProgress = (xp / xpToNext) * 100;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 hover:bg-black/40"
          >
            ✕
          </button>
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-slate-900 flex items-center justify-center text-4xl">
              {player?.avatar || '🎣'}
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-white">{player?.name || 'Angler'}</h2>
              <p className="text-white/80">{player?.title || 'Novice Fisher'}</p>
            </div>
          </div>
        </div>
        
        {/* Level bar */}
        <div className="pt-16 px-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60">Level {level}</span>
            <span className="text-white/60">{xp}/{xpToNext} XP</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="p-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-white">{stats?.fishCaught || 0}</p>
            <p className="text-sm text-white/60">Fish Caught</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-amber-400">{stats?.gold || 0}</p>
            <p className="text-sm text-white/60">Gold Earned</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-purple-400">{stats?.questsCompleted || 0}</p>
            <p className="text-sm text-white/60">Quests Done</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-green-400">{stats?.perfectCatches || 0}</p>
            <p className="text-sm text-white/60">Perfect Catches</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-blue-400">{stats?.rareFish || 0}</p>
            <p className="text-sm text-white/60">Rare Fish</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-red-400">{stats?.biggestFish || 0}lb</p>
            <p className="text-sm text-white/60">Biggest Catch</p>
          </div>
        </div>
        
        {/* Time played */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-white/60" />
              <span className="text-white/60">Time Played</span>
            </div>
            <span className="text-white font-medium">{stats?.timePlayed || '0h 0m'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TUTORIAL SYSTEM
// ============================================================================

export const TutorialOverlay = ({ step, totalSteps, title, content, targetElement, onNext, onSkip }) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  
  useEffect(() => {
    if (targetElement) {
      const el = document.querySelector(targetElement);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
        });
      }
    }
  }, [targetElement]);
  
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Dimmed overlay with cutout */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Tutorial card */}
      <div 
        className="absolute transform -translate-x-1/2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl p-6 max-w-md"
        style={position}
      >
        {/* Progress indicator */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i}
              className={`h-1 flex-1 rounded-full ${i < step ? 'bg-amber-500' : 'bg-white/20'}`}
            />
          ))}
        </div>
        
        <h3 className="text-lg font-bold text-amber-400 mb-2">{title}</h3>
        <p className="text-white/80 mb-6">{content}</p>
        
        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            Skip Tutorial
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors"
          >
            {step < totalSteps ? 'Next' : 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LEVEL UP CELEBRATION
// ============================================================================

export const LevelUpCelebration = ({ level, rewards, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center animate-scale-in">
        <div className="relative">
          <Sparkles className="absolute -top-8 -left-8 w-16 h-16 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute -top-8 -right-8 w-16 h-16 text-yellow-400 animate-pulse" />
          <Star className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 text-amber-400 animate-bounce" />
        </div>
        
        <div className="p-8 bg-gradient-to-b from-amber-500/20 to-transparent rounded-3xl">
          <p className="text-amber-400 text-xl font-medium mb-2">LEVEL UP!</p>
          <p className="text-white text-6xl font-bold mb-4">{level}</p>
          
          {rewards && (
            <div className="flex justify-center gap-4 mt-6">
              {rewards.skill && (
                <div className="px-4 py-2 bg-purple-500/20 rounded-lg">
                  <p className="text-purple-400">+1 Skill Point</p>
                </div>
              )}
              {rewards.unlock && (
                <div className="px-4 py-2 bg-green-500/20 rounded-lg">
                  <p className="text-green-400">New Feature Unlocked!</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// DAILY REWARDS
// ============================================================================

export const DailyRewardsPanel = ({ isOpen, onClose, currentDay, rewards, onClaim }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/20 to-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-amber-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Daily Rewards</h2>
                <p className="text-white/60">Day {currentDay} streak!</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">✕</button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-7 gap-3">
            {rewards?.map((reward, i) => {
              const day = i + 1;
              const isClaimed = day < currentDay;
              const isToday = day === currentDay;
              const isLocked = day > currentDay;
              
              return (
                <div
                  key={day}
                  className={`relative p-3 rounded-xl text-center transition-all ${
                    isToday 
                      ? 'bg-amber-500/20 border-2 border-amber-400 scale-110' 
                      : isClaimed 
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 opacity-50'
                  }`}
                >
                  {isClaimed && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <p className="text-xs text-white/60 mb-1">Day {day}</p>
                  <p className="text-lg">{reward.icon || '🎁'}</p>
                  <p className="text-xs text-white/80 mt-1">{reward.gold || 0}g</p>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={onClaim}
            className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold rounded-xl transition-all"
          >
            Claim Today's Reward!
          </button>
        </div>
      </div>
    </div>
  );
};

// Export all
export default {
  SettingsProvider,
  useSettings,
  SettingsPanel,
  AchievementPopup,
  AchievementsPanel,
  PlayerProfile,
  TutorialOverlay,
  LevelUpCelebration,
  DailyRewardsPanel,
};
