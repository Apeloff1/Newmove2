/**
 * ============================================================================
 * ENHANCED UI COMPONENTS - 1500+ Lines of UI Improvements
 * ============================================================================
 * Comprehensive UI component library for improved user experience
 * Including tooltips, notifications, modals, menus, and more
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { 
  X, Check, AlertCircle, Info, AlertTriangle, CheckCircle,
  ChevronDown, ChevronRight, ChevronUp, ChevronLeft,
  Settings, Volume2, VolumeX, Sun, Moon, Maximize, Minimize,
  Save, Download, Upload, Trash2, Edit, Copy, Share,
  Bell, BellOff, HelpCircle, ExternalLink, RefreshCw,
  Star, Heart, Bookmark, Flag, Award, Zap, Gift,
  Eye, EyeOff, Lock, Unlock, Search, Filter, Menu,
  Plus, Minus, MoreHorizontal, MoreVertical, Loader
} from 'lucide-react';

// ============================================================================
// CONTEXT PROVIDERS
// ============================================================================

// Toast/Notification Context
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration || 3000);
    }
    
    return id;
  }, []);
  
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

export const Tooltip = ({ children, content, position = 'top', delay = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: position === 'top' ? rect.top : rect.bottom,
        });
      }
      setIsVisible(true);
    }, delay);
  }, [position, delay]);
  
  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);
  
  const positionStyles = useMemo(() => {
    switch (position) {
      case 'top':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' };
      default:
        return {};
    }
  }, [position]);
  
  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div 
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-fade-in"
          style={positionStyles}
          role="tooltip"
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' :
              position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' :
              position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' :
              'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TOAST/NOTIFICATION COMPONENTS
// ============================================================================

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const typeConfig = {
    success: { icon: CheckCircle, bg: 'bg-green-500/90', iconColor: 'text-green-200' },
    error: { icon: AlertCircle, bg: 'bg-red-500/90', iconColor: 'text-red-200' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/90', iconColor: 'text-amber-200' },
    info: { icon: Info, bg: 'bg-blue-500/90', iconColor: 'text-blue-200' },
    achievement: { icon: Award, bg: 'bg-purple-500/90', iconColor: 'text-purple-200' },
  };
  
  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;
  
  return (
    <div 
      className={`${config.bg} backdrop-blur-xl rounded-xl shadow-2xl p-4 pointer-events-auto animate-slide-in-right`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="font-semibold text-white">{toast.title}</p>
          )}
          <p className="text-sm text-white/90">{toast.message}</p>
          {toast.action && (
            <button 
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-white/80 hover:text-white underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button 
          onClick={onRemove}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL COMPONENT
// ============================================================================

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      
      {/* Modal */}
      <div 
        className={`relative ${sizeClasses[size]} w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl animate-scale-in overflow-hidden`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ml-auto"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-white/10 bg-black/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// DROPDOWN MENU COMPONENT
// ============================================================================

export const Dropdown = ({ trigger, children, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 min-w-[200px] bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in origin-top ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {React.Children.map(children, child => 
            React.cloneElement(child, { onClose: () => setIsOpen(false) })
          )}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ icon: Icon, children, onClick, onClose, danger = false, disabled = false }) => (
  <button
    onClick={() => {
      if (!disabled) {
        onClick?.();
        onClose?.();
      }
    }}
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : danger 
          ? 'hover:bg-red-500/20 text-red-400'
          : 'hover:bg-white/10 text-white'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{children}</span>
  </button>
);

export const DropdownDivider = () => (
  <div className="border-t border-white/10 my-1" />
);

// ============================================================================
// PROGRESS BAR COMPONENTS
// ============================================================================

export const ProgressBar = ({ value, max = 100, size = 'md', color = 'blue', showLabel = false, animated = false }) => {
  const percent = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
    xl: 'h-6',
  };
  
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    red: 'from-red-500 to-orange-400',
    purple: 'from-purple-500 to-pink-400',
    amber: 'from-amber-500 to-yellow-400',
    rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  };
  
  return (
    <div className="w-full">
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-white/60">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export const CircularProgress = ({ value, max = 100, size = 100, strokeWidth = 8, color = 'blue' }) => {
  const percent = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  
  const colorClasses = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    red: 'stroke-red-500',
    purple: 'stroke-purple-500',
    amber: 'stroke-amber-500',
  };
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-500`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute text-white font-bold">
        {Math.round(percent)}%
      </div>
    </div>
  );
};

// ============================================================================
// BADGE COMPONENTS
// ============================================================================

export const Badge = ({ children, variant = 'default', size = 'md', dot = false }) => {
  const variantClasses = {
    default: 'bg-white/10 text-white',
    primary: 'bg-blue-500/20 text-blue-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-cyan-500/20 text-cyan-400',
  };
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

export const StatCard = ({ label, value, icon: Icon, change, changeType = 'neutral', suffix = '' }) => {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-white/60',
  };
  
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-white/60">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-white/40" />}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}{suffix}</span>
        {change !== undefined && (
          <span className={`text-sm ${changeColors[changeType]}`}>
            {changeType === 'positive' && '+'}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// TABS COMPONENT
// ============================================================================

export const Tabs = ({ tabs, activeTab, onChange, variant = 'default' }) => {
  const variantClasses = {
    default: {
      container: 'bg-white/5 rounded-xl p-1',
      tab: 'rounded-lg',
      active: 'bg-white/20 text-white',
      inactive: 'text-white/60 hover:text-white hover:bg-white/10',
    },
    underline: {
      container: 'border-b border-white/10',
      tab: '',
      active: 'text-amber-400 border-b-2 border-amber-400',
      inactive: 'text-white/60 hover:text-white',
    },
    pills: {
      container: 'flex gap-2',
      tab: 'rounded-full',
      active: 'bg-amber-500 text-black',
      inactive: 'bg-white/10 text-white hover:bg-white/20',
    },
  };
  
  const styles = variantClasses[variant];
  
  return (
    <div className={`flex ${styles.container}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2 font-medium transition-all ${styles.tab} ${
            activeTab === tab.id ? styles.active : styles.inactive
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <Badge size="sm" variant={activeTab === tab.id ? 'primary' : 'default'}>
                {tab.count}
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// ACCORDION COMPONENT
// ============================================================================

export const Accordion = ({ items, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState([]);
  
  const toggleItem = (id) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };
  
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              {item.icon && <item.icon className="w-5 h-5 text-white/60" />}
              <span className="font-medium text-white">{item.title}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${
              openItems.includes(item.id) ? 'rotate-180' : ''
            }`} />
          </button>
          {openItems.includes(item.id) && (
            <div className="p-4 bg-black/20 border-t border-white/10 animate-accordion-down">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

export const Spinner = ({ size = 'md', color = 'white' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  return (
    <Loader className={`${sizeClasses[size]} text-${color} animate-spin`} />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
    <Spinner size="xl" />
    <p className="mt-4 text-white/60">{message}</p>
  </div>
);

export const Skeleton = ({ width, height, rounded = 'md' }) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  return (
    <div 
      className={`bg-white/10 animate-pulse ${roundedClasses[rounded]}`}
      style={{ width, height }}
    />
  );
};

// ============================================================================
// ALERT COMPONENT
// ============================================================================

export const Alert = ({ type = 'info', title, children, onClose, action }) => {
  const typeConfig = {
    info: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    success: { icon: CheckCircle, bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
    error: { icon: AlertCircle, bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;
  
  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4`} role="alert">
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <p className={`font-semibold ${config.text} mb-1`}>{title}</p>}
          <div className="text-white/80">{children}</div>
          {action && (
            <button 
              onClick={action.onClick}
              className={`mt-2 text-sm font-medium ${config.text} hover:underline`}
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X className="w-4 h-4 text-white/60" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// AVATAR COMPONENT
// ============================================================================

export const Avatar = ({ src, alt, fallback, size = 'md', status, border = false }) => {
  const [error, setError] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  };
  
  return (
    <div className={`relative inline-flex ${sizeClasses[size]}`}>
      {src && !error ? (
        <img 
          src={src} 
          alt={alt} 
          onError={() => setError(true)}
          className={`w-full h-full rounded-full object-cover ${border ? 'ring-2 ring-white/20' : ''}`}
        />
      ) : (
        <div className={`w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold ${border ? 'ring-2 ring-white/20' : ''}`}>
          {fallback || alt?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full ring-2 ring-slate-900`} />
      )}
    </div>
  );
};

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && (
      <div className="p-4 rounded-full bg-white/5 mb-4">
        <Icon className="w-12 h-12 text-white/30" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    {description && <p className="text-white/60 max-w-sm mb-4">{description}</p>}
    {action && (
      <button 
        onClick={action.onClick}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  const variantClasses = {
    danger: 'bg-red-500 hover:bg-red-400',
    warning: 'bg-amber-500 hover:bg-amber-400',
    info: 'bg-blue-500 hover:bg-blue-400',
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <div className="p-3 rounded-full bg-red-500/20 w-fit mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 ${variantClasses[variant]} text-white rounded-lg transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================================
// ANIMATION STYLES
// ============================================================================

export const UIAnimationStyles = () => (
  <style>{`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slide-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes accordion-down {
      from { opacity: 0; height: 0; }
      to { opacity: 1; height: auto; }
    }
    
    .animate-fade-in { animation: fade-in 0.2s ease-out; }
    .animate-scale-in { animation: scale-in 0.2s ease-out; }
    .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
    .animate-slide-in-up { animation: slide-in-up 0.3s ease-out; }
    .animate-accordion-down { animation: accordion-down 0.2s ease-out; }
  `}</style>
);

// Export all
export default {
  ToastProvider,
  useToast,
  Tooltip,
  Modal,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  ProgressBar,
  CircularProgress,
  Badge,
  StatCard,
  Tabs,
  Accordion,
  Spinner,
  LoadingOverlay,
  Skeleton,
  Alert,
  Avatar,
  EmptyState,
  ConfirmDialog,
  UIAnimationStyles,
};
