/**
 * ============================================================================
 * WEATHER EFFECTS SYSTEM - Dynamic Weather Visualization & Effects
 * ============================================================================
 * Complete weather system with visual effects, particle systems,
 * and gameplay integration for fishing bonuses
 * ============================================================================
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, CloudFog, Thermometer, Droplets, Snowflake } from 'lucide-react';

// Import weather data
import { WEATHER_SYSTEMS } from '../lib/openWorldAssets';

// ============================================================================
// WEATHER PARTICLE SYSTEM
// ============================================================================

const WeatherParticle = ({ type, index, containerWidth, containerHeight }) => {
  const particleStyles = useMemo(() => {
    const baseStyles = {
      position: 'absolute',
      pointerEvents: 'none',
    };
    
    switch (type) {
      case 'rain':
        return {
          ...baseStyles,
          left: `${Math.random() * 100}%`,
          top: '-20px',
          width: '2px',
          height: '15px',
          background: 'linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.8))',
          animation: `rainFall ${0.5 + Math.random() * 0.3}s linear infinite`,
          animationDelay: `${Math.random() * 2}s`,
        };
      case 'rain_heavy':
        return {
          ...baseStyles,
          left: `${Math.random() * 100}%`,
          top: '-30px',
          width: '3px',
          height: '25px',
          background: 'linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.9))',
          animation: `rainFallHeavy ${0.3 + Math.random() * 0.2}s linear infinite`,
          animationDelay: `${Math.random() * 1}s`,
        };
      case 'snow':
        return {
          ...baseStyles,
          left: `${Math.random() * 100}%`,
          top: '-10px',
          width: '8px',
          height: '8px',
          background: 'white',
          borderRadius: '50%',
          opacity: 0.8,
          animation: `snowFall ${3 + Math.random() * 4}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
        };
      case 'fog':
        return {
          ...baseStyles,
          left: `${Math.random() * 120 - 10}%`,
          top: `${Math.random() * 100}%`,
          width: `${100 + Math.random() * 200}px`,
          height: `${50 + Math.random() * 100}px`,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: `fogDrift ${20 + Math.random() * 20}s linear infinite`,
          animationDelay: `${Math.random() * 10}s`,
        };
      case 'leaves':
        const leafEmojis = ['🍂', '🍁', '🍃'];
        return {
          ...baseStyles,
          left: `${Math.random() * 100}%`,
          top: '-30px',
          fontSize: `${12 + Math.random() * 8}px`,
          animation: `leafFall ${4 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          content: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
        };
      case 'cherry_blossoms':
        return {
          ...baseStyles,
          left: `${Math.random() * 100}%`,
          top: '-20px',
          fontSize: `${10 + Math.random() * 6}px`,
          animation: `petalFall ${5 + Math.random() * 5}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        };
      case 'lightning':
        return {
          ...baseStyles,
          left: `${10 + Math.random() * 80}%`,
          top: '0',
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(200,200,255,0.5), transparent)',
          opacity: 0,
          animation: `lightningFlash ${0.2}s ease-out`,
          animationDelay: `${2 + Math.random() * 8}s`,
          animationIterationCount: 'infinite',
        };
      case 'sparkles':
        return {
          ...baseStyles,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          fontSize: '12px',
          animation: `sparkle ${1 + Math.random() * 2}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 3}s`,
        };
      case 'fireflies':
        return {
          ...baseStyles,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: '6px',
          height: '6px',
          background: 'radial-gradient(circle, rgba(255,255,150,1) 0%, rgba(255,255,100,0.5) 50%, transparent 70%)',
          borderRadius: '50%',
          animation: `fireflyFloat ${5 + Math.random() * 5}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        };
      default:
        return baseStyles;
    }
  }, [type, index]);
  
  const getContent = () => {
    switch (type) {
      case 'leaves':
        return ['🍂', '🍁', '🍃'][index % 3];
      case 'cherry_blossoms':
        return '🌸';
      case 'sparkles':
        return '✨';
      case 'snow':
        return index % 5 === 0 ? '❄️' : null;
      default:
        return null;
    }
  };
  
  return (
    <div style={particleStyles}>
      {getContent()}
    </div>
  );
};

// ============================================================================
// WEATHER OVERLAY COMPONENT
// ============================================================================

const WeatherOverlay = ({ weather, intensity = 1, timeOfDay = 'day' }) => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  
  // Generate particles based on weather
  useEffect(() => {
    const particleConfig = {
      clear: { types: [], counts: {} },
      partly_cloudy: { types: ['cloud_shadows'], counts: { cloud_shadows: 3 } },
      cloudy: { types: ['cloud_shadows'], counts: { cloud_shadows: 5 } },
      drizzle: { types: ['rain'], counts: { rain: 50 } },
      rain: { types: ['rain'], counts: { rain: 100 } },
      storm: { types: ['rain_heavy', 'lightning'], counts: { rain_heavy: 150, lightning: 3 } },
      foggy: { types: ['fog'], counts: { fog: 15 } },
      windy: { types: ['leaves'], counts: { leaves: 20 } },
      heatwave: { types: [], counts: {} },
      rainbow: { types: ['sparkles'], counts: { sparkles: 30 } },
      snow: { types: ['snow'], counts: { snow: 80 } },
    };
    
    const config = particleConfig[weather] || particleConfig.clear;
    const newParticles = [];
    
    config.types.forEach(type => {
      const count = Math.floor((config.counts[type] || 0) * intensity);
      for (let i = 0; i < count; i++) {
        newParticles.push({ type, id: `${type}-${i}` });
      }
    });
    
    // Add time-of-day specific particles
    if (timeOfDay === 'night' && weather === 'clear') {
      for (let i = 0; i < 20; i++) {
        newParticles.push({ type: 'fireflies', id: `firefly-${i}` });
      }
    }
    
    setParticles(newParticles);
  }, [weather, intensity, timeOfDay]);
  
  // Get overlay styles based on weather
  const overlayStyles = useMemo(() => {
    const baseStyles = {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      transition: 'all 2s ease-in-out',
    };
    
    switch (weather) {
      case 'storm':
        return {
          ...baseStyles,
          background: 'linear-gradient(to bottom, rgba(30,30,50,0.7), rgba(20,20,40,0.5))',
        };
      case 'rain':
        return {
          ...baseStyles,
          background: 'linear-gradient(to bottom, rgba(50,60,80,0.5), rgba(40,50,70,0.3))',
        };
      case 'drizzle':
        return {
          ...baseStyles,
          background: 'linear-gradient(to bottom, rgba(70,80,100,0.3), rgba(60,70,90,0.2))',
        };
      case 'foggy':
        return {
          ...baseStyles,
          background: 'rgba(200,200,210,0.4)',
        };
      case 'cloudy':
        return {
          ...baseStyles,
          background: 'linear-gradient(to bottom, rgba(100,110,130,0.3), transparent)',
        };
      case 'heatwave':
        return {
          ...baseStyles,
          background: 'linear-gradient(to bottom, rgba(255,200,100,0.2), rgba(255,150,50,0.1))',
        };
      case 'rainbow':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, 
            rgba(255,0,0,0.1) 0%, 
            rgba(255,127,0,0.1) 15%, 
            rgba(255,255,0,0.1) 30%, 
            rgba(0,255,0,0.1) 45%, 
            rgba(0,0,255,0.1) 60%, 
            rgba(75,0,130,0.1) 75%, 
            rgba(148,0,211,0.1) 100%
          )`,
        };
      default:
        return baseStyles;
    }
  }, [weather]);
  
  return (
    <div ref={containerRef} style={overlayStyles} className="weather-overlay">
      {particles.map(particle => (
        <WeatherParticle
          key={particle.id}
          type={particle.type}
          index={parseInt(particle.id.split('-')[1]) || 0}
        />
      ))}
      
      {/* Lightning flash overlay */}
      {weather === 'storm' && (
        <div 
          className="absolute inset-0 bg-white pointer-events-none"
          style={{
            animation: 'lightningOverlay 10s infinite',
            opacity: 0,
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// WEATHER HUD COMPONENT
// ============================================================================

const WeatherHUD = ({ currentWeather, timeOfDay, season, fishingBonus, onWeatherChange }) => {
  const weatherData = WEATHER_SYSTEMS?.types?.[currentWeather] || {
    name: 'Unknown',
    icon: '❓',
    description: 'Weather unknown',
    fishActivity: 1.0,
  };
  
  const timeData = WEATHER_SYSTEMS?.timeOfDay?.[timeOfDay] || {
    name: 'Day',
    icon: '☀️',
  };
  
  const seasonData = WEATHER_SYSTEMS?.seasons?.[season] || {
    name: 'Summer',
    icon: '☀️',
  };
  
  const WeatherIcon = useMemo(() => {
    switch (currentWeather) {
      case 'storm': return CloudLightning;
      case 'rain':
      case 'drizzle': return CloudRain;
      case 'foggy': return CloudFog;
      case 'windy': return Wind;
      case 'cloudy':
      case 'partly_cloudy': return Cloud;
      case 'heatwave': return Thermometer;
      default: return Sun;
    }
  }, [currentWeather]);
  
  return (
    <div 
      className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 min-w-[200px]"
      data-testid="weather-hud"
    >
      {/* Current weather */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-white/10">
          <WeatherIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-white">{weatherData.name}</p>
          <p className="text-xs text-white/60">{weatherData.description}</p>
        </div>
        <span className="text-2xl ml-auto">{weatherData.icon}</span>
      </div>
      
      {/* Time and season */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 p-2 bg-white/5 rounded-lg text-center">
          <span className="text-lg">{timeData.icon}</span>
          <p className="text-xs text-white/60">{timeData.name}</p>
        </div>
        <div className="flex-1 p-2 bg-white/5 rounded-lg text-center">
          <span className="text-lg">{seasonData.icon}</span>
          <p className="text-xs text-white/60">{seasonData.name}</p>
        </div>
      </div>
      
      {/* Fishing bonus */}
      <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/80">🎣 Fish Activity</span>
          <span className={`font-bold ${
            weatherData.fishActivity > 1 ? 'text-green-400' :
            weatherData.fishActivity < 1 ? 'text-red-400' :
            'text-white'
          }`}>
            {weatherData.fishActivity > 1 ? '+' : ''}{((weatherData.fishActivity - 1) * 100).toFixed(0)}%
          </span>
        </div>
        {fishingBonus !== 1 && (
          <div className="mt-1 text-xs text-white/50">
            Combined bonus: {((fishingBonus - 1) * 100).toFixed(0)}%
          </div>
        )}
      </div>
      
      {/* Weather warnings */}
      {weatherData.dangerous && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-400 flex items-center gap-2">
            <CloudLightning className="w-4 h-4" />
            Dangerous conditions!
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// WEATHER CONTROLLER HOOK
// ============================================================================

export const useWeatherSystem = (initialWeather = 'clear') => {
  const [currentWeather, setCurrentWeather] = useState(initialWeather);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [season, setSeason] = useState('summer');
  const [weatherTimer, setWeatherTimer] = useState(0);
  
  // Calculate fishing bonus
  const fishingBonus = useMemo(() => {
    const weatherData = WEATHER_SYSTEMS?.types?.[currentWeather] || { fishActivity: 1 };
    const timeData = WEATHER_SYSTEMS?.timeOfDay?.[timeOfDay] || { fishActivity: 1 };
    return weatherData.fishActivity * (timeData.fishActivity || 1);
  }, [currentWeather, timeOfDay]);
  
  // Weather transition
  const transitionWeather = useCallback(() => {
    const weatherData = WEATHER_SYSTEMS?.types?.[currentWeather];
    if (!weatherData?.transitionsTo) return;
    
    const nextWeather = weatherData.transitionsTo[
      Math.floor(Math.random() * weatherData.transitionsTo.length)
    ];
    
    setWeatherHistory(prev => [...prev.slice(-10), currentWeather]);
    setCurrentWeather(nextWeather);
  }, [currentWeather]);
  
  // Update time of day
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 7) setTimeOfDay('dawn');
      else if (hour >= 7 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
      else if (hour >= 17 && hour < 20) setTimeOfDay('evening');
      else if (hour >= 20 && hour < 21) setTimeOfDay('dusk');
      else setTimeOfDay('night');
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Update season
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if ([3, 4, 5].includes(month)) setSeason('spring');
    else if ([6, 7, 8].includes(month)) setSeason('summer');
    else if ([9, 10, 11].includes(month)) setSeason('autumn');
    else setSeason('winter');
  }, []);
  
  // Weather timer
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherTimer(prev => {
        if (prev <= 0) {
          transitionWeather();
          const weatherData = WEATHER_SYSTEMS?.types?.[currentWeather] || {};
          const duration = weatherData.duration || { min: 60, max: 300 };
          return duration.min + Math.random() * (duration.max - duration.min);
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentWeather, transitionWeather]);
  
  // Force weather change
  const setWeather = useCallback((weather) => {
    if (WEATHER_SYSTEMS?.types?.[weather]) {
      setWeatherHistory(prev => [...prev.slice(-10), currentWeather]);
      setCurrentWeather(weather);
    }
  }, [currentWeather]);
  
  return {
    currentWeather,
    timeOfDay,
    season,
    fishingBonus,
    weatherTimer,
    weatherHistory,
    setWeather,
    transitionWeather,
  };
};

// ============================================================================
// WEATHER STYLES (CSS-in-JS)
// ============================================================================

export const WeatherStyles = () => (
  <style>{`
    @keyframes rainFall {
      0% { transform: translateY(-20px) rotate(15deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(100vh) rotate(15deg); opacity: 0; }
    }
    
    @keyframes rainFallHeavy {
      0% { transform: translateY(-30px) rotate(10deg); opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { transform: translateY(100vh) rotate(10deg); opacity: 0; }
    }
    
    @keyframes snowFall {
      0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.8; }
      50% { transform: translateY(50vh) translateX(30px) rotate(180deg); }
      90% { opacity: 0.8; }
      100% { transform: translateY(100vh) translateX(-30px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes fogDrift {
      0% { transform: translateX(-100%); opacity: 0; }
      10% { opacity: 0.3; }
      90% { opacity: 0.3; }
      100% { transform: translateX(100vw); opacity: 0; }
    }
    
    @keyframes leafFall {
      0% { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      25% { transform: translateY(25vh) translateX(50px) rotate(90deg); }
      50% { transform: translateY(50vh) translateX(-30px) rotate(180deg); }
      75% { transform: translateY(75vh) translateX(40px) rotate(270deg); }
      90% { opacity: 1; }
      100% { transform: translateY(100vh) translateX(0) rotate(360deg); opacity: 0; }
    }
    
    @keyframes petalFall {
      0% { transform: translateY(-20px) translateX(0) rotate(0deg) scale(1); opacity: 0; }
      10% { opacity: 1; }
      50% { transform: translateY(50vh) translateX(30px) rotate(180deg) scale(0.8); }
      90% { opacity: 0.8; }
      100% { transform: translateY(100vh) translateX(-20px) rotate(360deg) scale(0.6); opacity: 0; }
    }
    
    @keyframes lightningFlash {
      0%, 100% { opacity: 0; }
      5%, 10% { opacity: 1; }
      15% { opacity: 0; }
      20% { opacity: 0.5; }
      25% { opacity: 0; }
    }
    
    @keyframes lightningOverlay {
      0%, 94%, 100% { opacity: 0; }
      95% { opacity: 0.8; }
      96% { opacity: 0; }
      97% { opacity: 0.4; }
      98% { opacity: 0; }
    }
    
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
      50% { opacity: 1; transform: scale(1) rotate(180deg); }
    }
    
    @keyframes fireflyFloat {
      0%, 100% { 
        transform: translate(0, 0); 
        opacity: 0.3;
      }
      25% { 
        transform: translate(20px, -30px); 
        opacity: 1;
      }
      50% { 
        transform: translate(-10px, -50px); 
        opacity: 0.5;
      }
      75% { 
        transform: translate(30px, -20px); 
        opacity: 1;
      }
    }
    
    .weather-overlay {
      z-index: 5;
    }
  `}</style>
);

// ============================================================================
// MAIN WEATHER SYSTEM COMPONENT
// ============================================================================

const WeatherSystem = ({ children, enabled = true }) => {
  const {
    currentWeather,
    timeOfDay,
    season,
    fishingBonus,
    setWeather,
  } = useWeatherSystem('clear');
  
  if (!enabled) return children;
  
  return (
    <div className="relative w-full h-full">
      <WeatherStyles />
      <WeatherOverlay 
        weather={currentWeather} 
        timeOfDay={timeOfDay}
        intensity={1}
      />
      <WeatherHUD
        currentWeather={currentWeather}
        timeOfDay={timeOfDay}
        season={season}
        fishingBonus={fishingBonus}
        onWeatherChange={setWeather}
      />
      {children}
    </div>
  );
};

export { WeatherOverlay, WeatherHUD, WeatherParticle };
export default WeatherSystem;
