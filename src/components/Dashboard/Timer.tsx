
import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

const Timer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(25);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsRunning(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(Math.floor(totalTime / 60));
    setSeconds(totalTime % 60);
  };

  const handleEditSave = () => {
    const newTotalTime = editMinutes * 60;
    setTotalTime(newTotalTime);
    setMinutes(editMinutes);
    setSeconds(0);
    setIsRunning(false);
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
            <div className="text-6xl font-mono font-bold text-white mb-4">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
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
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
