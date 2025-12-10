// GanttChart.js - MS Project Style
'use client'

import { useState, useMemo } from 'react'  // useState जोड़ें
import { Calendar, Clock, TrendingUp, Users, ChevronRight, ChevronDown } from 'lucide-react'

export function GanttChart({ data, projectStats }) {
  const [expandedTasks, setExpandedTasks] = useState({});

  // Toggle task expansion
  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Calculate timeline dimensions - IMPROVED
  const timelineData = useMemo(() => {
    if (!data || data.length === 0) return { chartWidth: 0, days: [] };

    // Find earliest and latest dates
    const dates = data
      .map(task => task.start)
      .filter(date => date instanceof Date && !isNaN(date));

    const endDates = data
      .map(task => task.end)
      .filter(date => date instanceof Date && !isNaN(date));

    if (dates.length === 0 || endDates.length === 0) {
      return { chartWidth: 0, days: [] };
    }

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));

    // Calculate days between
    const timeDiff = maxDate.getTime() - minDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    const chartWidth = Math.max(1000, daysDiff * 30);

    // Generate date labels - ONLY DATES, NO DAYS COUNT
    const days = [];
    let currentDate = new Date(minDate);

    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(currentDate);
      const dayOfWeek = date.getDay();

      // Only include weekdays (Monday to Friday) for MS Project style
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        days.push({
          date: new Date(date),
          day: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          year: date.getFullYear(),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isWeekend: false
        });
      } else {
        days.push({
          date: new Date(date),
          day: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          year: date.getFullYear(),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isWeekend: true
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      minDate,
      maxDate,
      chartWidth,
      days,
      totalDays: daysDiff
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Gantt Data Available</h3>
        <p className="text-gray-500">Tasks need start and end dates for Gantt chart.</p>
      </div>
    );
  }

  const { minDate, maxDate, chartWidth, days, totalDays } = timelineData;

  // Function to calculate task position
  const getTaskPosition = (taskStart, taskEnd) => {
    if (!taskStart || !taskEnd) return { left: 0, width: 0 };

    const startDiff = (taskStart.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const taskDuration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) + 1;

    const left = startDiff * 30; // 30px per day
    const width = Math.max(20, taskDuration * 30);

    return { left, width };
  };

  // MS Project style color coding
  const getTaskBarColor = (task) => {
    if (task.isHeading) {
      return {
        barColor: 'bg-blue-600',
        progressColor: 'bg-blue-400',
        borderColor: 'border-blue-700'
      };
    }

    switch (task.status) {
      case 'Completed':
        return {
          barColor: 'bg-green-600',
          progressColor: 'bg-green-400',
          borderColor: 'border-green-700'
        };
      case 'In Progress':
        return {
          barColor: 'bg-blue-500',
          progressColor: 'bg-green-400',
          borderColor: 'border-blue-600'
        };
      case 'Overdue':
        return {
          barColor: 'bg-red-600',
          progressColor: 'bg-red-400',
          borderColor: 'border-red-700'
        };
      default:
        return {
          barColor: 'bg-gray-400',
          progressColor: 'bg-gray-300',
          borderColor: 'border-gray-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">📊 MS Project Style Gantt Chart</h3>
        <p className="text-gray-600">
          Timeline: {minDate.toLocaleDateString()} to {maxDate.toLocaleDateString()} ({totalDays} days)
        </p>
      </div>

      {/* Gantt Chart Container */}
      <div className="bg-white rounded-xl shadow p-4">
        {/* Timeline Header - MS Project Style */}
        <div className="overflow-x-auto mb-4 border-b pb-2">
          <div style={{ width: `${chartWidth + 200}px`, minWidth: '100%' }}>
            <div className="flex">
              {/* Task Name Column */}
              <div className="w-64 flex-shrink-0 p-2 font-semibold text-gray-700 border-r bg-gray-50">
                Task Name
              </div>

              {/* Timeline Days */}
              <div className="flex-1 flex">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`w-30 flex-shrink-0 p-2 text-xs text-center ${day.isWeekend ? 'bg-gray-100' : 'bg-white'} border-r`}
                    style={{ width: '30px' }}
                  >
                    <div className={`font-medium ${day.isWeekend ? 'text-gray-500' : 'text-gray-700'}`}>
                      {day.day}
                    </div>
                    <div className={`text-[10px] ${day.isWeekend ? 'text-gray-400' : 'text-gray-500'}`}>
                      {day.weekday}
                    </div>
                    {index === 0 || day.day === 1 ? (
                      <div className={`text-[9px] ${day.isWeekend ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {day.month} {day.year !== days[Math.max(0, index - 1)]?.year ? day.year : ''}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Gantt Bars */}
        <div className="overflow-x-auto">
          <div style={{ width: `${chartWidth + 200}px`, minWidth: '100%' }}>
            {data.map((task, index) => {
              const { left, width } = getTaskPosition(task.start, task.end);
              const colors = getTaskBarColor(task);

              return (
                <div key={index} className="flex items-center mb-3 relative h-12">
                  {/* Task Name */}
                  <div className="w-64 flex-shrink-0 p-2 border-r">
                    <div className="flex items-center">
                      {task.isHeading && (
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="text-gray-500 hover:text-gray-700 mr-2"
                        >
                          {expandedTasks[task.id] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <div className={`truncate ${task.isHeading ? 'font-bold text-blue-700' : 'text-gray-800'}`}>
                        {task.name}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {task.resources || 'No resources'}
                    </div>
                  </div>

                  {/* Gantt Bar Area */}
                  <div className="flex-1 relative h-full">
                    {/* Today Line */}
                    <div
                      className="absolute h-full w-0.5 bg-red-500 z-10"
                      style={{
                        left: `${((new Date() - minDate) / (1000 * 60 * 60 * 24)) * 30}px`
                      }}
                    >
                      <div className="absolute -top-2 -left-1.5 text-xs bg-red-500 text-white px-1 py-0.5 rounded">
                        Today
                      </div>
                    </div>

                    {/* Task Bar */}
                    {left >= 0 && width > 0 && (
                      <div
                        className={`absolute h-8 rounded border ${colors.borderColor} ${colors.barColor} opacity-90 hover:opacity-100 transition-opacity`}
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                        title={`${task.name}: ${task.start?.toLocaleDateString()} - ${task.end?.toLocaleDateString()}`}
                      >
                        {/* Progress Overlay */}
                        {task.status === 'In Progress' && task.completion > 0 && (
                          <div
                            className={`h-full rounded-l ${colors.progressColor}`}
                            style={{ width: `${Math.min(100, task.completion)}%` }}
                          ></div>
                        )}

                        {/* Milestone Indicator */}
                        {width <= 30 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-700"></div>
                          </div>
                        )}

                        {/* Task Label */}
                        {width > 60 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-white truncate px-2">
                              {task.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Completion Percentage */}
                    {task.completion > 0 && task.completion < 100 && (
                      <div
                        className="absolute text-xs font-bold bg-white px-1 py-0.5 rounded border shadow-sm"
                        style={{
                          left: `${left + width + 5}px`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          minWidth: '40px',
                          textAlign: 'center'
                        }}
                      >
                        {task.completion}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend - MS Project Style */}
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Gantt Chart Legend
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-blue-600 rounded border border-blue-700"></div>
            <div>
              <div className="font-medium text-gray-800">Headings</div>
              <div className="text-sm text-gray-500">Summary tasks</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-green-600 rounded border border-green-700"></div>
            <div>
              <div className="font-medium text-gray-800">Completed</div>
              <div className="text-sm text-gray-500">100% done</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-blue-500 rounded border border-blue-600">
              <div className="h-full w-1/2 bg-green-400 rounded-l"></div>
            </div>
            <div>
              <div className="font-medium text-gray-800">In Progress</div>
              <div className="text-sm text-gray-500">With progress</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-gray-700 rounded-full border-2 border-white shadow"></div>
            <div>
              <div className="font-medium text-gray-800">Milestone</div>
              <div className="text-sm text-gray-500">Zero duration</div>
            </div>
          </div>
        </div>

        {/* Today Line Indicator */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-red-500"></div>
            <div>
              <div className="font-medium text-gray-800">Today Line</div>
              <div className="text-sm text-gray-500">Current date indicator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {totalDays} days
              </div>
              <div className="text-sm text-gray-600">Project Duration</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {data.filter(t => t.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {data.length}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}