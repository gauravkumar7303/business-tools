'use client'

import { useState } from 'react'
import { Calendar, Users, BarChart3, PieChart, TrendingUp, Clock, Flag } from 'lucide-react'

export default function MPPViewer({ data, viewMode = 'table' }) {
  const [selectedTask, setSelectedTask] = useState(null)

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No Project Data</h3>
        <p className="text-gray-500">Upload a Microsoft Project file to view project details</p>
      </div>
    )
  }

  const calculateStats = () => {
    const tasks = data.tasks || []
    const completed = tasks.filter(t => t.progress === 100).length
    const inProgress = tasks.filter(t => t.progress > 0 && t.progress < 100).length
    const notStarted = tasks.filter(t => t.progress === 0).length
    const avgProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / (tasks.length || 1)
    
    return {
      completed,
      inProgress,
      notStarted,
      avgProgress: Math.round(avgProgress),
      totalDuration: tasks.reduce((sum, t) => sum + (t.duration || 0), 0)
    }
  }

  const stats = calculateStats()

  const renderTableView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{data.projectName}</h2>
            <p className="text-gray-600">
              {data.startDate} to {data.endDate} • {data.tasks?.length || 0} tasks
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.avgProgress}%</div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        
        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Task</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Progress</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Resource</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.tasks && data.tasks.map((task) => (
                <tr 
                  key={task.id} 
                  className={`hover:bg-blue-50 cursor-pointer ${selectedTask?.id === task.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{task.name}</div>
                    <div className="text-sm text-gray-500">{task.status}</div>
                  </td>
                  <td className="p-4 text-gray-700">{task.startDate}</td>
                  <td className="p-4 text-gray-700">{task.endDate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{task.duration} days</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{task.resource}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Selected Task Details */}
      {selectedTask && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <Flag className="w-6 h-6 text-blue-600" />
            Task Details
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold">Task Name</p>
              <p className="text-lg font-bold text-gray-800">{selectedTask.name}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-semibold">Progress</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${selectedTask.progress}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-800">{selectedTask.progress}%</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Duration</p>
              <p className="text-lg font-bold text-gray-800">{selectedTask.duration} days</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-semibold">Resource</p>
              <p className="text-lg font-bold text-gray-800">{selectedTask.resource}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStatsView = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Progress Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Progress Overview</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Completed</span>
              <span>{stats.completed} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-600 h-4 rounded-full"
                style={{ 
                  width: `${(stats.completed / (data.tasks?.length || 1)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>In Progress</span>
              <span>{stats.inProgress} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full"
                style={{ 
                  width: `${(stats.inProgress / (data.tasks?.length || 1)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Not Started</span>
              <span>{stats.notStarted} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gray-400 h-4 rounded-full"
                style={{ 
                  width: `${(stats.notStarted / (data.tasks?.length || 1)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Distribution */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <PieChart className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Task Distribution</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { label: 'Completed', value: stats.completed, color: 'bg-green-500', textColor: 'text-green-700' },
            { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-500', textColor: 'text-blue-700' },
            { label: 'Not Started', value: stats.notStarted, color: 'bg-gray-400', textColor: 'text-gray-700' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.label}</span>
                  <span className={`font-bold ${item.textColor}`}>{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ 
                      width: `${(item.value / (data.tasks?.length || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderResourcesView = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Project Resources</h3>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.resources && data.resources.map((resource) => (
          <div key={resource.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{resource.name}</h4>
                <p className="text-gray-600 text-sm">{resource.role}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Allocation</span>
                <span>{resource.allocation}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${resource.allocation}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Main render based on view mode
  return (
    <div>
      {viewMode === 'table' && renderTableView()}
      {viewMode === 'stats' && renderStatsView()}
      {viewMode === 'resources' && renderResourcesView()}
    </div>
  )
}