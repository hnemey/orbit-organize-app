
import React, { useState, useEffect, useRef } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

const Timer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(25);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('timer-state');
    if (savedState) {
      const state = JSON.parse(savedState);
      setMinutes(state.minutes);
      setSeconds(state.seconds);
      setTotalTime(state.totalTime);
      setIsRunning(state.isRunning);
      setIsAlarmPlaying(state.isAlarmPlaying);
      setStartTime(state.startTime);
      setPausedTime(state.pausedTime);
      setEditMinutes(Math.floor(state.totalTime / 60));
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      minutes,
      seconds,
      totalTime,
      isRunning,
      isAlarmPlaying,
      startTime,
      pausedTime
    };
    localStorage.setItem('timer-state', JSON.stringify(state));
  }, [minutes, seconds, totalTime, isRunning, isAlarmPlaying, startTime, pausedTime]);

  useEffect(() => {
    // Create audio element for timer end sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUWfToW');
    audioRef.current.loop = true; // Make the sound loop
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle alarm sound
  useEffect(() => {
    if (isAlarmPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (!isAlarmPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isAlarmPlaying]);

  // Update timer based on elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime && !isAlarmPlaying) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = totalTime - elapsed;
        
        if (remaining <= 0) {
          setMinutes(0);
          setSeconds(0);
          setIsRunning(false);
          setIsAlarmPlaying(true);
          setStartTime(null);
        } else {
          setMinutes(Math.floor(remaining / 60));
          setSeconds(remaining % 60);
        }
      }, 100); // Check every 100ms for smoother updates
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, totalTime, isAlarmPlaying]);

  const startTimer = () => {
    const now = Date.now();
    const currentRemaining = minutes * 60 + seconds;
    
    if (pausedTime) {
      // Resume from paused state
      setStartTime(now - (totalTime - currentRemaining) * 1000);
      setPausedTime(null);
    } else {
      // Start fresh
      setStartTime(now);
    }
    
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setPausedTime(Date.now());
    setStartTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsAlarmPlaying(false);
    setStartTime(null);
    setPausedTime(null);
    setMinutes(Math.floor(totalTime / 60));
    setSeconds(totalTime % 60);
  };

  const handleEditSave = () => {
    const newTotalTime = editMinutes * 60;
    setTotalTime(newTotalTime);
    setMinutes(editMinutes);
    setSeconds(0);
    setIsRunning(false);
    setIsAlarmPlaying(false);
    setStartTime(null);
    setPausedTime(null);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditMinutes(Math.floor(totalTime / 60));
    setIsEditing(false);
  };

  const progress = ((totalTime - (minutes * 60 + seconds)) / totalTime) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TimerIcon className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Timer</h2>
          {isAlarmPlaying && (
            <span className="text-red-400 animate-pulse font-bold">TIME'S UP!</span>
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Edit
        </button>
      </div>

      <div className="text-center">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Minutes</label>
              <input
                type="number"
                value={editMinutes}
                onChange={(e) => setEditMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-center"
                min="1"
                max="999"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`text-6xl font-mono font-bold mb-4 ${isAlarmPlaying ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${isAlarmPlaying ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex gap-4 justify-center">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  disabled={minutes === 0 && seconds === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  Pause
                </button>
              )}
              <button
                onClick={resetTimer}
                className={`px-6 py-2 text-white rounded transition-colors ${isAlarmPlaying ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
