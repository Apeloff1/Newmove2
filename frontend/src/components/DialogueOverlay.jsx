import React, { useState, useEffect } from 'react';
import { useAdventure } from '../context/AdventureContext';
import { X, ChevronRight } from 'lucide-react';

// ============================================================================
// DIALOGUE OVERLAY - Monkey Island Style Conversations
// ============================================================================

export const DialogueOverlay = () => {
  const { 
    currentDialogue, 
    selectDialogueOption, 
    closeDialogue,
    hasItem 
  } = useAdventure();

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [selectedOption, setSelectedOption] = useState(-1);

  // Typewriter effect for dialogue text
  useEffect(() => {
    if (!currentDialogue?.dialogue?.text) return;
    
    const fullText = currentDialogue.dialogue.text;
    let index = 0;
    setIsTyping(true);
    setDisplayedText('');

    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 25);

    return () => clearInterval(typeInterval);
  }, [currentDialogue?.dialogue?.text, currentDialogue?.currentNode]);

  // Skip typing on click
  const handleSkipTyping = () => {
    if (isTyping && currentDialogue?.dialogue?.text) {
      setDisplayedText(currentDialogue.dialogue.text);
      setIsTyping(false);
    }
  };

  // Handle option selection
  const handleOptionClick = (index, option) => {
    // Check if option requires an item
    if (option.requiresItem && !hasItem(option.requiresItem)) {
      return;
    }
    
    setSelectedOption(index);
    setTimeout(() => {
      selectDialogueOption(index);
      setSelectedOption(-1);
    }, 200);
  };

  if (!currentDialogue) return null;

  const { npc, dialogue } = currentDialogue;
  const options = dialogue?.options || [];

  return (
    <div 
      className="dialogue-overlay fixed inset-0 z-50 flex items-end justify-center pb-4 px-4"
      onClick={handleSkipTyping}
      data-testid="dialogue-overlay"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* NPC Portrait (top left) */}
      <div className="absolute top-24 left-4 z-10 animate-slide-right">
        <div className="dialogue-portrait">
          <div className="text-6xl mb-2">{npc.portrait}</div>
          <div className="text-center">
            <div className="font-pixel text-gold text-sm">{npc.name}</div>
            <div className="text-xs text-amber-200/60">{npc.title}</div>
          </div>
        </div>
      </div>

      {/* Main Dialogue Box */}
      <div 
        className="dialogue-box relative z-10 w-full max-w-3xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeDialogue}
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
          data-testid="close-dialogue-btn"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Parchment texture background */}
        <div className="dialogue-box-inner">
          {/* NPC name header */}
          <div className="dialogue-header">
            <span className="text-lg">{npc.portrait}</span>
            <span className="font-pixel text-amber-900">{npc.name}</span>
          </div>

          {/* Dialogue text with typewriter effect */}
          <div className="dialogue-text min-h-[80px]">
            <p className="text-xl leading-relaxed">
              {displayedText}
              {isTyping && <span className="dialogue-cursor">▌</span>}
            </p>
          </div>

          {/* Response options */}
          {!isTyping && options.length > 0 && (
            <div className="dialogue-options mt-6 space-y-2">
              {options.map((option, index) => {
                const isLocked = option.requiresItem && !hasItem(option.requiresItem);
                const isSelected = selectedOption === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index, option)}
                    disabled={isLocked}
                    className={`dialogue-option ${isSelected ? 'dialogue-option-selected' : ''} ${
                      isLocked ? 'dialogue-option-locked' : ''
                    }`}
                    data-testid={`dialogue-option-${index}`}
                  >
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      isSelected ? 'translate-x-1' : ''
                    }`} />
                    <span className="flex-1 text-left">{option.text}</span>
                    {option.cost && (
                      <span className="text-amber-600 text-sm">💰 {option.cost}</span>
                    )}
                    {isLocked && (
                      <span className="text-red-500 text-sm">🔒</span>
                    )}
                    {option.mood && (
                      <span className="text-xs opacity-60">
                        {getMoodEmoji(option.mood)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* End of conversation indicator */}
          {!isTyping && options.length === 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={closeDialogue}
                className="dialogue-end-btn"
                data-testid="end-dialogue-btn"
              >
                End conversation
              </button>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="mt-4 text-center text-amber-600/60 text-sm">
              Click to skip...
            </div>
          )}
        </div>

        {/* Decorative corners */}
        <div className="dialogue-corner dialogue-corner-tl">⚓</div>
        <div className="dialogue-corner dialogue-corner-tr">⚓</div>
        <div className="dialogue-corner dialogue-corner-bl">⚓</div>
        <div className="dialogue-corner dialogue-corner-br">⚓</div>
      </div>
    </div>
  );
};

// Helper function to get mood emoji
const getMoodEmoji = (mood) => {
  const moods = {
    happy: '😊',
    suspicious: '🤨',
    confused: '😕',
    neutral: '😐',
    concerned: '😟',
    excited: '🤩',
    scared: '😰',
    determined: '💪',
    grateful: '🙏',
    amused: '😄',
    sympathetic: '💗',
    pragmatic: '🎯',
    curious: '🤔',
    interested: '👀',
    alarmed: '😳',
    warm: '❤️'
  };
  return moods[mood] || '';
};

export default DialogueOverlay;
