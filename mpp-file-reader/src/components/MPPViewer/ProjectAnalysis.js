
// 'use client'

// import { useState, useMemo, useCallback } from 'react'
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
// } from 'recharts'
// import { 
//   Calendar, TrendingUp, AlertTriangle, CheckCircle, 
//   Clock, Target, BarChart as BarChartIcon, PieChart as PieChartIcon,
//   Lightbulb, Users, Zap, AlertCircle
// } from 'lucide-react'

// export function ProjectAnalysis({ stats, tasks, assignments }) {
//   const [chartType, setChartType] = useState('completion')

//   // COMPLETION CALCULATION FROM ASSIGNMENT SHEET
//  const getTaskCompletion = useCallback((task) => {
//   if (!task) return 0;
  
//   console.log('🔍 Checking task completion for:', {
//     taskName: task.Name || task['Task Name'],
//     assignments: assignments
//   });
  
//   // FIRST: Check Assignment sheet data if available
//   if (assignments && assignments.length > 0) {
//     const taskName = task.Name || task['Task Name'] || task.Task || '';
//     console.log(`Looking for task: "${taskName}" in assignments`);
    
//     if (taskName) {
//       // Find all assignments for this task
//       const taskAssignments = assignments.filter(assignment => {
//         const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//         const isMatch = assignmentTaskName.toString().trim() === taskName.toString().trim();
        
//         if (isMatch) {
//           console.log(`✅ Found assignment for "${taskName}":`, {
//             assignmentTaskName,
//             percentComplete: assignment['Percent Work Complete'],
//             type: typeof assignment['Percent Work Complete']
//           });
//         }
        
//         return isMatch;
//       });
      
//       console.log(`Found ${taskAssignments.length} assignments for "${taskName}"`);
      
//       if (taskAssignments.length > 0) {
//         // Calculate average completion from assignments
//         let totalCompletion = 0;
//         let validAssignments = 0;
        
//         taskAssignments.forEach(assignment => {
//           const assignmentCompletion = assignment['Percent Work Complete'];
//           console.log('Assignment completion data:', {
//             raw: assignmentCompletion,
//             parsed: parseFloat(assignmentCompletion),
//             isNumber: typeof assignmentCompletion === 'number'
//           });
          
//           if (assignmentCompletion !== undefined && assignmentCompletion !== null && assignmentCompletion !== '') {
//             const completionValue = parseFloat(assignmentCompletion);
//             if (!isNaN(completionValue)) {
//               totalCompletion += completionValue;
//               validAssignments++;
//               console.log(`Added completion: ${completionValue}`);
//             }
//           }
//         });
        
//         if (validAssignments > 0) {
//           const avgCompletion = totalCompletion / validAssignments;
//           const finalCompletion = Math.min(100, Math.max(0, avgCompletion));
//           console.log(`📊 Task "${taskName}" completion from assignments: ${finalCompletion}%`);
//           return finalCompletion;
//         }
//       }
//     }
//   }
  
//   // FALLBACK: Check task sheet fields
//   const possibleFields = [
//     '% Complete', '%_Complete', 'Percent Complete', 'Percent_Complete',
//     'Progress', 'Complete', 'Completion', 
//     'Progress%', '%Progress', 'Pct Complete', 'Pct_Complete',
//     '% Work Complete', 'Work_Complete', 'Work%'
//   ];
  
//   for (const field of possibleFields) {
//     if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
//       const value = task[field];
//       console.log(`📝 Found completion field "${field}":`, value);
      
//       if (typeof value === 'number') {
//         const finalValue = Math.min(100, Math.max(0, value));
//         console.log(`Using numeric value: ${finalValue}%`);
//         return finalValue;
//       }
      
//       if (typeof value === 'string') {
//         const cleaned = value.replace('%', '').trim();
//         const parsed = parseFloat(cleaned);
//         if (!isNaN(parsed)) {
//           const finalValue = Math.min(100, Math.max(0, parsed));
//           console.log(`Using parsed string value: ${finalValue}%`);
//           return finalValue;
//         }
//       }
//     }
//   }
  
//   console.log(`⚠️ No completion found for task: ${task.Name || task['Task Name']}`);
//   return 0;
// }, [assignments])
//   // COMPLETION DATA - Based on Assignment Sheet
//  const completionData = useMemo(() => {
//   if (!tasks || tasks.length === 0) {
//     console.log('No tasks available');
//     return [];
//   }
  
//   console.log(`=== COMPLETION ANALYSIS START ===`);
//   console.log(`Total tasks: ${tasks.length}`);
//   console.log(`Assignments available: ${assignments ? assignments.length : 0}`);
//   console.log(`Sample assignments:`, assignments ? assignments.slice(0, 3) : 'No assignments');
    
//     const buckets = [
//       { range: '0%', min: 0, max: 0, count: 0, color: '#ef4444' },
//       { range: '1-25%', min: 1, max: 25, count: 0, color: '#f97316' },
//       { range: '26-50%', min: 26, max: 50, count: 0, color: '#eab308' },
//       { range: '51-75%', min: 51, max: 75, count: 0, color: '#84cc16' },
//       { range: '76-99%', min: 76, max: 99, count: 0, color: '#22c55e' },
//       { range: '100%', min: 100, max: 100, count: 0, color: '#15803d' }
//     ];
    
//     let processedCount = 0;
//     let zeroCompletionCount = 0;
//     let hundredCompletionCount = 0;
    
//     tasks.forEach((task, index) => {
//       const completion = getTaskCompletion(task);
      
//       if (index < 5) {
//         console.log(`Task ${index + 1} Completion Analysis:`, {
//           name: task.Name || task['Task Name'] || task.Task || 'Unknown',
//           completion,
//           'Assignments found': assignments ? assignments.filter(a => {
//             const assignmentTaskName = a['Task Name'] || a.Task || '';
//             const taskName = task.Name || task['Task Name'] || task.Task || '';
//             return assignmentTaskName.toString().trim() === taskName.toString().trim();
//           }).length : 0
//         });
//       }
      
//       if (completion === 0) zeroCompletionCount++;
//       if (completion === 100) hundredCompletionCount++;
      
//       let found = false;
//       for (const bucket of buckets) {
//         if (completion >= bucket.min && completion <= bucket.max) {
//           bucket.count++;
//           processedCount++;
//           found = true;
//           break;
//         }
//       }
      
//       if (!found) {
//         console.warn(`Task ${index} with completion ${completion} didn't fit any bucket`);
//       }
//     });
    
//     console.log('Completion Buckets:', buckets);
//     console.log(`0% tasks: ${zeroCompletionCount}, 100% tasks: ${hundredCompletionCount}`);
    
//     return buckets.map(b => ({
//       name: b.range,
//       tasks: b.count,
//       percentage: tasks.length > 0 ? (b.count / tasks.length) * 100 : 0,
//       color: b.color
//     }));
//  }, [tasks, getTaskCompletion, assignments])

//   // TIMELINE DATA - Project Timeline Analysis
//   const timelineData = useMemo(() => {
//     if (!tasks || tasks.length === 0) return []
    
//     const timelineMap = {}
    
//     tasks.forEach(task => {
//       const startDateStr = task['Start Date'] || task.Start || task.Begin
//       if (startDateStr) {
//         try {
//           const date = new Date(startDateStr)
//           const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
          
//           if (!timelineMap[monthKey]) {
//             timelineMap[monthKey] = {
//               month: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}`,
//               tasksStarted: 0,
//               tasksCompleted: 0,
//               totalTasks: 0
//             }
//           }
//           timelineMap[monthKey].tasksStarted++
//           timelineMap[monthKey].totalTasks++
          
//           const completion = getTaskCompletion(task);
//           if (completion >= 100) {
//             timelineMap[monthKey].tasksCompleted++
//           }
//         } catch (e) {
//           console.error('Error parsing date:', startDateStr)
//         }
//       }
//     })
    
//     return Object.values(timelineMap).sort((a, b) => a.month.localeCompare(b.month))
//   }, [tasks, getTaskCompletion])

//   // STATUS DISTRIBUTION
//   const statusData = useMemo(() => {
//     if (!stats) return []
    
//     return [
//       { name: 'Completed', value: stats.completedTasks, color: '#22c55e' },
//       { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
//       { name: 'Not Started', value: stats.notStartedTasks, color: '#6b7280' },
//       { name: 'Overdue', value: stats.overdueTasks, color: '#ef4444' }
//     ].filter(item => item.value > 0)
//   }, [stats])

//   // DURATION STATISTICS
//   const durationStats = useMemo(() => {
//     if (!tasks || tasks.length === 0) return null
    
//     let totalDuration = 0
//     let minDuration = Infinity
//     let maxDuration = 0
//     const durations = []
    
//     tasks.forEach(task => {
//       const durationStr = task.Duration
//       if (durationStr) {
//         // Parse duration from various formats
//         const durationMatch = durationStr.toString().match(/(\d+(\.\d+)?)\s*([dwmh]?)/i)
//         if (durationMatch) {
//           let duration = parseFloat(durationMatch[1])
//           const unit = durationMatch[3]?.toLowerCase()
          
//           // Convert to days
//           switch(unit) {
//             case 'h': duration = duration / 8; break // hours to days
//             case 'w': duration = duration * 5; break // weeks to days
//             case 'm': duration = duration * 20; break // months to days
//             // 'd' or no unit = days
//           }
          
//           totalDuration += duration
//           minDuration = Math.min(minDuration, duration)
//           maxDuration = Math.max(maxDuration, duration)
//           durations.push(duration)
//         } else {
//           // Try to parse as number
//           const duration = parseFloat(durationStr)
//           if (!isNaN(duration)) {
//             totalDuration += duration
//             minDuration = Math.min(minDuration, duration)
//             maxDuration = Math.max(maxDuration, duration)
//             durations.push(duration)
//           }
//         }
//       }
//     })
    
//     const avgDuration = durations.length > 0 ? totalDuration / durations.length : 0
    
//     const durationDistribution = [
//       { range: '1-5 days', min: 1, max: 5, count: 0 },
//       { range: '6-20 days', min: 6, max: 20, count: 0 },
//       { range: '21-50 days', min: 21, max: 50, count: 0 },
//       { range: '51+ days', min: 51, max: Infinity, count: 0 }
//     ]
    
//     durations.forEach(duration => {
//       for (const bucket of durationDistribution) {
//         if (duration >= bucket.min && duration <= bucket.max) {
//           bucket.count++
//           break
//         }
//       }
//     })
    
//     return {
//       avgDuration: avgDuration.toFixed(1),
//       minDuration: minDuration === Infinity ? 0 : minDuration,
//       maxDuration,
//       totalDuration,
//       distribution: durationDistribution.filter(d => d.count > 0)
//     }
//   }, [tasks])

//   // RISK FACTORS ANALYSIS
//   const riskFactors = useMemo(() => {
//     if (!stats || !tasks) return []
    
//     const risks = []
    
//     // Overdue Tasks Risk
//     if (stats.overdueTasks > 0) {
//       const severity = stats.overdueTasks > stats.totalTasks * 0.1 ? 'High' : 'Medium'
//       risks.push({
//         factor: 'Overdue Tasks',
//         count: stats.overdueTasks,
//         severity,
//         description: `${stats.overdueTasks} tasks are behind schedule`
//       })
//     }
    
//     // Low Progress Risk
//     if (stats.avgCompletion < 30) {
//       risks.push({
//         factor: 'Low Progress',
//         severity: 'High',
//         description: `Only ${stats.avgCompletion.toFixed(1)}% overall completion`
//       })
//     } else if (stats.avgCompletion < 60) {
//       risks.push({
//         factor: 'Moderate Progress',
//         severity: 'Medium',
//         description: `${stats.avgCompletion.toFixed(1)}% overall completion`
//       })
//     }
    
//     // Many Not Started Tasks Risk
//     if (stats.notStartedTasks > stats.totalTasks * 0.3) {
//       risks.push({
//         factor: 'Many Not Started',
//         count: stats.notStartedTasks,
//         severity: 'Medium',
//         description: `${stats.notStartedTasks} tasks (${((stats.notStartedTasks/stats.totalTasks)*100).toFixed(1)}%) haven't started`
//       })
//     }
    
//     // Resource Overload Risk
//     if (stats.resourceStats) {
//       const resourceCount = Object.keys(stats.resourceStats).length
//       if (resourceCount > 0) {
//         const avgTasksPerResource = stats.totalTasks / resourceCount
//         if (avgTasksPerResource > 10) {
//           risks.push({
//             factor: 'Resource Overload',
//             severity: 'Medium',
//             description: `Average of ${avgTasksPerResource.toFixed(1)} tasks per resource`
//           })
//         }
//       }
//     }
    
//     // Tasks without Assignments Risk
//     if (assignments && assignments.length > 0) {
//       const tasksWithoutAssignments = tasks.filter(task => {
//         const taskName = task.Name || task['Task Name'] || task.Task || '';
//         const hasAssignment = assignments.some(assignment => {
//           const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//           return assignmentTaskName.toString().trim() === taskName.toString().trim();
//         });
//         return !hasAssignment;
//       }).length;
      
//       if (tasksWithoutAssignments > 0) {
//         risks.push({
//           factor: 'Tasks Without Assignments',
//           count: tasksWithoutAssignments,
//           severity: 'Medium',
//           description: `${tasksWithoutAssignments} tasks don't have resource assignments`
//         });
//       }
//     }
    
//     return risks
//   }, [stats, tasks, assignments])

//   // RECOMMENDATIONS
//   const recommendations = useMemo(() => {
//     const recs = []
    
//     if (!stats) return recs
    
//     // Progress-based recommendations
//     if (stats.avgCompletion < 40) {
//       recs.push({
//         icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
//         title: 'Accelerate Progress',
//         description: 'Project progress is below 40%. Consider reallocating resources to critical tasks.',
//         priority: 'high'
//       })
//     } else if (stats.avgCompletion < 70) {
//       recs.push({
//         icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
//         title: 'Maintain Momentum',
//         description: 'Progress is moderate. Focus on completing in-progress tasks to build momentum.',
//         priority: 'medium'
//       })
//     } else {
//       recs.push({
//         icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
//         title: 'Sustain Progress',
//         description: 'Good progress rate. Continue current pace and focus on quality.',
//         priority: 'low'
//       })
//     }
    
//     // Overdue tasks recommendations
//     if (stats.overdueTasks > 0) {
//       recs.push({
//         icon: <Clock className="w-5 h-5 flex-shrink-0" />,
//         title: 'Address Overdue Tasks',
//         description: `${stats.overdueTasks} tasks are overdue. Review and adjust deadlines.`,
//         priority: stats.overdueTasks > 5 ? 'high' : 'medium'
//       })
//     }
    
//     // Resource allocation recommendations
//     if (stats.resourceStats) {
//       const resourceCount = Object.keys(stats.resourceStats).length
//       if (resourceCount > 0) {
//         const avgTasksPerResource = stats.totalTasks / resourceCount
        
//         if (avgTasksPerResource > 8) {
//           recs.push({
//             icon: <Users className="w-5 h-5 flex-shrink-0" />,
//             title: 'Resource Allocation',
//             description: `High workload per resource (${avgTasksPerResource.toFixed(1)} tasks avg). Consider redistributing work.`,
//             priority: 'medium'
//           })
//         }
//       }
//     }
    
//     // Project duration recommendations
//     if (stats.timelineStats && stats.timelineStats.totalDays > 180) {
//       recs.push({
//         icon: <Calendar className="w-5 h-5 flex-shrink-0" />,
//         title: 'Long Project Duration',
//         description: `Project spans ${stats.timelineStats.totalDays} days. Consider breaking into phases.`,
//         priority: 'medium'
//       })
//     }
    
//     // High-risk areas recommendations
//     if (riskFactors.some(r => r.severity === 'High')) {
//       recs.push({
//         icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
//         title: 'High-Risk Areas',
//         description: 'High-risk factors identified. Prioritize mitigation strategies.',
//         priority: 'high'
//       })
//     }
    
//     // Tasks without assignments recommendations
//     if (assignments && assignments.length > 0) {
//       const tasksWithoutAssignments = tasks.filter(task => {
//         const taskName = task.Name || task['Task Name'] || task.Task || '';
//         const hasAssignment = assignments.some(assignment => {
//           const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//           return assignmentTaskName.toString().trim() === taskName.toString().trim();
//         });
//         return !hasAssignment;
//       }).length;
      
//       if (tasksWithoutAssignments > 0) {
//         recs.push({
//           icon: <Users className="w-5 h-5 flex-shrink-0" />,
//           title: 'Assign Resources',
//           description: `${tasksWithoutAssignments} tasks don't have resource assignments. Assign team members to these tasks.`,
//           priority: 'medium'
//         });
//       }
//     }
    
//     // Standard recommendations
//     recs.push({
//       icon: <Lightbulb className="w-5 h-5 flex-shrink-0" />,
//       title: 'Weekly Reviews',
//       description: 'Conduct weekly progress reviews to stay on track.',
//       priority: 'low'
//     })
    
//     recs.push({
//       icon: <Zap className="w-5 h-5 flex-shrink-0" />,
//       title: 'Focus on Critical Path',
//       description: 'Prioritize tasks on the critical path to avoid delays.',
//       priority: 'medium'
//     })
    
//     // Sort by priority
//     return recs.sort((a, b) => {
//       const priorityOrder = { high: 0, medium: 1, low: 2 }
//       return priorityOrder[a.priority] - priorityOrder[b.priority]
//     })
//   }, [stats, riskFactors, tasks, assignments])

//   // PROGRESS TRENDS
//   const progressTrends = useMemo(() => {
//     if (!stats) return []
    
//     return [
//       {
//         name: 'Overall Progress',
//         value: stats.avgCompletion,
//         target: 100,
//         color: '#3b82f6',
//         description: 'Project completion rate based on assignments'
//       },
//       {
//         name: 'On-time Progress',
//         value: ((stats.totalTasks - stats.overdueTasks) / stats.totalTasks) * 100,
//         target: 100,
//         color: '#22c55e',
//         description: 'Tasks completed on schedule'
//       },
//       {
//         name: 'Started Tasks',
//         value: ((stats.completedTasks + stats.inProgressTasks) / stats.totalTasks) * 100,
//         target: 100,
//         color: '#f59e0b',
//         description: 'Tasks that have started'
//       },
//       {
//         name: 'Completion Velocity',
//         value: stats.inProgressTasks > 0 ? (stats.avgCompletion / (stats.timelineStats?.totalDays || 30)) * 100 : 0,
//         target: 3,
//         color: '#8b5cf6',
//         description: 'Progress per time unit'
//       }
//     ]
//   }, [stats])

//   // Loading state
//   if (!stats) {
//     return (
//       <div className="text-center py-12">
//         <BarChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
//         <p className="text-gray-500">Upload a project file to see analysis.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Chart Type Navigation */}
//       <div className="flex flex-wrap gap-2 border-b pb-4">
//         <button 
//           onClick={() => setChartType('completion')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'completion' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <TrendingUp className="inline-block w-4 h-4 mr-2" />
//           Completion Analysis
//         </button>
//         <button 
//           onClick={() => setChartType('timeline')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'timeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <Calendar className="inline-block w-4 h-4 mr-2" />
//           Timeline Analysis
//         </button>
//         <button 
//           onClick={() => setChartType('status')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'status' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <PieChartIcon className="inline-block w-4 h-4 mr-2" />
//           Status Distribution
//         </button>
//         <button 
//           onClick={() => setChartType('risks')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'risks' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <AlertTriangle className="inline-block w-4 h-4 mr-2" />
//           Risk Analysis
//         </button>
//         <button 
//           onClick={() => setChartType('trends')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'trends' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <Lightbulb className="inline-block w-4 h-4 mr-2" />
//           Project Trends
//         </button>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <Target className="w-8 h-8 text-blue-600" />
//             <span className="text-2xl font-bold">{stats.avgCompletion.toFixed(1)}%</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Overall Progress</h3>
//           <p className="text-sm text-gray-500">Based on assignment completion</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//             <span className="text-2xl font-bold">{stats.completedTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Completed Tasks</h3>
//           <p className="text-sm text-gray-500">100% completion tasks</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <Clock className="w-8 h-8 text-yellow-600" />
//             <span className="text-2xl font-bold">{stats.inProgressTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">In Progress</h3>
//           <p className="text-sm text-gray-500">Active tasks (1-99%)</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <AlertTriangle className="w-8 h-8 text-red-600" />
//             <span className="text-2xl font-bold">{stats.overdueTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Overdue</h3>
//           <p className="text-sm text-gray-500">Tasks behind schedule</p>
//         </div>
//       </div>

//       {/* Main Chart Area */}
//       <div className="bg-white rounded-xl shadow border p-6">
//         <h3 className="text-xl font-bold mb-6">
//           {chartType === 'completion' && 'Task Completion Analysis (Based on Assignment Sheet)'}
//           {chartType === 'timeline' && 'Project Timeline Analysis'}
//           {chartType === 'status' && 'Task Status Distribution'}
//           {chartType === 'risks' && 'Project Risk Analysis'}
//           {chartType === 'trends' && 'Project Trends & Recommendations'}
//         </h3>
        
//         <div className="h-96">
//           {/* COMPLETION ANALYSIS CHART */}
//           {chartType === 'completion' && (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={completionData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" />
//                 <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
//                 <Tooltip 
//                   formatter={(value, name, props) => {
//                     if (name === 'tasks') {
//                       const percentage = props.payload.percentage || 0;
//                       return [`${value} tasks (${percentage.toFixed(1)}%)`, 'Count'];
//                     }
//                     return [value, name];
//                   }}
//                   labelFormatter={(label) => `Completion Range: ${label}`}
//                 />
//                 <Legend />
//                 <Bar dataKey="tasks" name="Number of Tasks" radius={[4, 4, 0, 0]}>
//                   {completionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           )}
          
//           {/* TIMELINE ANALYSIS CHART */}
//           {chartType === 'timeline' && (
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={timelineData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="month" />
//                 <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
//                 <Tooltip />
//                 <Legend />
//                 <Area 
//                   type="monotone" 
//                   dataKey="tasksStarted" 
//                   name="Tasks Started" 
//                   stroke="#3b82f6" 
//                   fill="#3b82f6" 
//                   fillOpacity={0.3} 
//                 />
//                 <Area 
//                   type="monotone" 
//                   dataKey="tasksCompleted" 
//                   name="Tasks Completed" 
//                   stroke="#22c55e" 
//                   fill="#22c55e" 
//                   fillOpacity={0.3} 
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
          
//           {/* STATUS DISTRIBUTION CHART */}
//           {chartType === 'status' && (
//             <div className="flex flex-col lg:flex-row gap-8 items-center h-full">
//               <div className="lg:w-1/2 h-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie 
//                       data={statusData} 
//                       cx="50%" 
//                       cy="50%" 
//                       labelLine={false} 
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
//                       outerRadius={150} 
//                       fill="#8884d8" 
//                       dataKey="value"
//                     >
//                       {statusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               <div className="lg:w-1/2 space-y-4">
//                 {statusData.map((item, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
//                       <span className="font-medium">{item.name}</span>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-bold text-lg">{item.value}</div>
//                       <div className="text-sm text-gray-500">
//                         {stats.totalTasks > 0 ? ((item.value / stats.totalTasks) * 100).toFixed(1) : 0}% of total
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* RISK ANALYSIS */}
//           {chartType === 'risks' && (
//             <div className="space-y-6">
//               {riskFactors.length === 0 ? (
//                 <div className="text-center py-12">
//                   <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
//                   <h4 className="text-lg font-medium text-gray-900 mb-2">No Major Risks Detected</h4>
//                   <p className="text-gray-500">Your project appears to be on track with healthy progress metrics.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {riskFactors.map((risk, index) => (
//                     <div 
//                       key={index} 
//                       className={`p-4 rounded-lg border-l-4 ${
//                         risk.severity === 'High' ? 'border-red-500 bg-red-50' : 
//                         risk.severity === 'Medium' ? 'border-yellow-500 bg-yellow-50' : 
//                         'border-blue-500 bg-blue-50'
//                       }`}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-bold text-gray-800">{risk.factor}</h4>
//                           <p className="text-gray-600 mt-1">{risk.description}</p>
//                         </div>
//                         <span className={`px-3 py-1 text-sm font-medium rounded-full ${
//                           risk.severity === 'High' ? 'bg-red-100 text-red-800' : 
//                           risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
//                           'bg-blue-100 text-blue-800'
//                         }`}>
//                           {risk.severity} Risk
//                         </span>
//                       </div>
//                       {risk.count && (
//                         <div className="mt-3 flex items-center gap-4">
//                           <div className="flex-1 bg-gray-200 rounded-full h-2">
//                             <div 
//                               className={`h-2 rounded-full ${
//                                 risk.severity === 'High' ? 'bg-red-500' : 
//                                 risk.severity === 'Medium' ? 'bg-yellow-500' : 
//                                 'bg-blue-500'
//                               }`} 
//                               style={{ width: `${(risk.count / stats.totalTasks) * 100}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-sm text-gray-600">{risk.count} tasks affected</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
          
//           {/* PROJECT TRENDS & RECOMMENDATIONS */}
//           {chartType === 'trends' && (
//             <div className="h-full overflow-y-auto">
//               <div className="space-y-8">
//                 {/* Progress Trends Section */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5" />
//                     Progress Trends
//                   </h4>
//                   <div className="space-y-6">
//                     {progressTrends.map((trend, index) => (
//                       <div key={index} className="space-y-2">
//                         <div className="flex justify-between">
//                           <div>
//                             <span className="font-medium text-gray-700">{trend.name}</span>
//                             <p className="text-sm text-gray-500">{trend.description}</p>
//                           </div>
//                           <span className="font-bold">{trend.value.toFixed(1)}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-3">
//                           <div 
//                             className="h-3 rounded-full transition-all duration-500" 
//                             style={{ 
//                               width: `${Math.min(100, trend.value)}%`, 
//                               backgroundColor: trend.color 
//                             }}
//                           ></div>
//                         </div>
//                         <div className="flex justify-between text-sm text-gray-500">
//                           <span>Current: {trend.value.toFixed(1)}%</span>
//                           <span>Target: {trend.target}%</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Recommendations Section */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <Lightbulb className="w-5 h-5" />
//                     Recommendations
//                   </h4>
//                   <div className="space-y-4">
//                     {recommendations.map((rec, index) => (
//                       <div 
//                         key={index} 
//                         className={`p-4 rounded-lg border-l-4 ${
//                           rec.priority === 'high' ? 'border-l-red-500 bg-red-50' : 
//                           rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
//                           'border-l-green-500 bg-green-50'
//                         }`}
//                       >
//                         <div className="flex gap-3">
//                           <div className="flex-shrink-0">{rec.icon}</div>
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                               <h5 className="font-semibold text-gray-800">{rec.title}</h5>
//                               <span className={`px-2 py-1 text-xs font-medium rounded ${
//                                 rec.priority === 'high' ? 'bg-red-100 text-red-800' : 
//                                 rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
//                                 'bg-green-100 text-green-800'
//                               }`}>
//                                 {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
//                               </span>
//                             </div>
//                             <p className="text-gray-600 mt-1">{rec.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Project Health Summary */}
//                 <div className="bg-blue-50 p-6 rounded-lg">
//                   <h4 className="font-bold text-blue-800 mb-3">Project Health Summary</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-blue-700">Overall Status:</p>
//                       <p className="font-bold text-blue-800">
//                         {stats.avgCompletion >= 70 ? 'Good' : stats.avgCompletion >= 40 ? 'Moderate' : 'Needs Attention'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-blue-700">Risk Level:</p>
//                       <p className="font-bold text-blue-800">
//                         {riskFactors.some(r => r.severity === 'High') ? 'High' : 
//                          riskFactors.length > 3 ? 'Medium' : 'Low'}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="text-sm text-blue-700 mt-3">
//                     {stats.avgCompletion >= 70 
//                       ? 'Project is progressing well. Focus on maintaining quality and monitoring risks.'
//                       : stats.avgCompletion >= 40
//                       ? 'Project requires attention to accelerate progress and address risks.'
//                       : 'Immediate action required to improve project progress and address critical issues.'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Bottom Stats Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Duration Analysis */}
//         <div className="bg-white rounded-xl shadow border p-6">
//           <h3 className="text-lg font-bold mb-4">Duration Analysis</h3>
//           {durationStats ? (
//             <div className="space-y-6">
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center p-4 bg-blue-50 rounded">
//                   <div className="text-2xl font-bold text-blue-700">{durationStats.avgDuration}</div>
//                   <div className="text-sm text-blue-600">Avg Days</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded">
//                   <div className="text-2xl font-bold text-green-700">{durationStats.minDuration}</div>
//                   <div className="text-sm text-green-600">Min Days</div>
//                 </div>
//                 <div className="text-center p-4 bg-red-50 rounded">
//                   <div className="text-2xl font-bold text-red-700">{durationStats.maxDuration}</div>
//                   <div className="text-sm text-red-600">Max Days</div>
//                 </div>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-gray-700 mb-3">Duration Distribution</h4>
//                 <div className="space-y-3">
//                   {durationStats.distribution.map((item, index) => (
//                     <div key={index}>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm text-gray-600">{item.range}</span>
//                         <span className="text-sm font-medium">{item.count} tasks</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="h-2 rounded-full bg-purple-600" 
//                           style={{ width: `${(item.count / tasks.length) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-500">No duration data available</p>
//           )}
//         </div>

//         {/* Task Distribution */}
//         <div className="bg-white rounded-xl shadow border p-6">
//           <h3 className="text-lg font-bold mb-4">Task Distribution</h3>
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="text-center p-4 bg-gray-50 rounded">
//                 <div className="text-2xl font-bold text-gray-700">{stats.totalTasks}</div>
//                 <div className="text-sm text-gray-600">Total Tasks</div>
//               </div>
//               <div className="text-center p-4 bg-blue-50 rounded">
//                 <div className="text-2xl font-bold text-blue-700">
//                   {tasks.filter(t => {
//                     const completion = getTaskCompletion(t);
//                     return completion > 0 && completion < 100;
//                   }).length}
//                 </div>
//                 <div className="text-sm text-blue-600">Active Tasks</div>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-3">Task Status Overview</h4>
//               <div className="space-y-3">
//                 {[
//                   { label: 'Completed', value: stats.completedTasks, color: 'bg-green-500' },
//                   { label: 'In Progress', value: stats.inProgressTasks, color: 'bg-blue-500' },
//                   { label: 'Not Started', value: stats.notStartedTasks, color: 'bg-gray-400' },
//                   { label: 'Overdue', value: stats.overdueTasks, color: 'bg-red-500' }
//                 ].map((item, index) => (
//                   <div key={index}>
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm text-gray-600">{item.label}</span>
//                       <span className="text-sm font-medium">{item.value} tasks</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className={`h-2 rounded-full ${item.color}`} 
//                         style={{ width: `${(item.value / stats.totalTasks) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="pt-4 border-t">
//               <h4 className="font-medium text-gray-700 mb-2">Completion Forecast</h4>
//               <p className="text-sm text-gray-600">
//                 {stats.inProgressTasks > 0 
//                   ? `At current pace, project will complete in approximately ${Math.ceil((100 - stats.avgCompletion) / (stats.avgCompletion / (stats.timelineStats?.totalDays || 30)))} days`
//                   : 'Not enough progress data to calculate forecast'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Export Report Section */}
//       <div className="bg-gray-50 rounded-xl p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800">Analysis Report</h3>
//             <p className="text-gray-600">Export detailed project analysis</p>
//           </div>
//           <button
//             onClick={() => {
//               const report = {
//                 projectName: stats.projectName || 'Project Analysis',
//                 date: new Date().toLocaleDateString(),
//                 summary: {
//                   totalTasks: stats.totalTasks,
//                   completed: stats.completedTasks,
//                   inProgress: stats.inProgressTasks,
//                   notStarted: stats.notStartedTasks,
//                   overdue: stats.overdueTasks,
//                   avgCompletion: stats.avgCompletion,
//                   projectDuration: stats.timelineStats?.totalDays || 0
//                 },
//                 completionAnalysis: completionData,
//                 risks: riskFactors,
//                 recommendations: recommendations.map(rec => ({
//                   title: rec.title,
//                   description: rec.description,
//                   priority: rec.priority
//                 }))
//               }
              
//               const reportText = JSON.stringify(report, null, 2)
//               const blob = new Blob([reportText], { type: 'application/json' })
//               const url = URL.createObjectURL(blob)
//               const link = document.createElement('a')
//               link.href = url
//               link.download = `project-analysis-${new Date().toISOString().split('T')[0]}.json`
//               link.click()
//               URL.revokeObjectURL(url)
//             }}
//             className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Export Analysis Report
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
// 'use client'

// import { useState, useMemo, useCallback } from 'react'
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
// } from 'recharts'
// import { 
//   Calendar, TrendingUp, AlertTriangle, CheckCircle, 
//   Clock, Target, BarChart as BarChartIcon, PieChart as PieChartIcon,
//   Lightbulb, Users, Zap, AlertCircle
// } from 'lucide-react'

// export function ProjectAnalysis({ stats, tasks, assignments }) {
//   const [chartType, setChartType] = useState('completion')

//   // COMPLETION CALCULATION FROM ASSIGNMENT SHEET
//  const getTaskCompletion = useCallback((task) => {
//   if (!task) return 0;
  
//   console.log('🔍 Checking task completion for:', {
//     taskName: task.Name || task['Task Name'],
//     assignments: assignments
//   });
  
//   // FIRST: Check Assignment sheet data if available
//   if (assignments && assignments.length > 0) {
//     const taskName = task.Name || task['Task Name'] || task.Task || '';
//     console.log(`Looking for task: "${taskName}" in assignments`);
    
//     if (taskName) {
//       // Find all assignments for this task
//       const taskAssignments = assignments.filter(assignment => {
//         const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//         const isMatch = assignmentTaskName.toString().trim() === taskName.toString().trim();
        
//         if (isMatch) {
//           console.log(`✅ Found assignment for "${taskName}":`, {
//             assignmentTaskName,
//             percentComplete: assignment['Percent Work Complete'],
//             type: typeof assignment['Percent Work Complete']
//           });
//         }
        
//         return isMatch;
//       });
      
//       console.log(`Found ${taskAssignments.length} assignments for "${taskName}"`);
      
//       if (taskAssignments.length > 0) {
//         // Calculate average completion from assignments
//         let totalCompletion = 0;
//         let validAssignments = 0;
        
//         taskAssignments.forEach(assignment => {
//           const assignmentCompletion = assignment['Percent Work Complete'];
//           console.log('Assignment completion data:', {
//             raw: assignmentCompletion,
//             parsed: parseFloat(assignmentCompletion),
//             isNumber: typeof assignmentCompletion === 'number'
//           });
          
//           if (assignmentCompletion !== undefined && assignmentCompletion !== null && assignmentCompletion !== '') {
//             const completionValue = parseFloat(assignmentCompletion);
//             if (!isNaN(completionValue)) {
//               totalCompletion += completionValue;
//               validAssignments++;
//               console.log(`Added completion: ${completionValue}`);
//             }
//           }
//         });
        
//         if (validAssignments > 0) {
//           const avgCompletion = totalCompletion / validAssignments;
//           const finalCompletion = Math.min(100, Math.max(0, avgCompletion));
//           console.log(`📊 Task "${taskName}" completion from assignments: ${finalCompletion}%`);
//           return finalCompletion;
//         }
//       }
//     }
//   }
//   // Add this function to calculate overall progress from assignments
// const calculateOverallProgressFromAssignments = useMemo(() => {
//   if (!assignments || assignments.length === 0) return 0;
  
//   console.log('📊 Calculating overall progress from assignments...');
  
//   let totalCompletion = 0;
//   let validAssignments = 0;
  
//   // Group assignments by task to avoid double counting
//   const taskCompletionMap = {};
  
//   assignments.forEach(assignment => {
//     const taskName = assignment['Task Name'] || assignment.Task || '';
//     const percentComplete = assignment['Percent Work Complete'];
    
//     if (taskName && percentComplete !== undefined && percentComplete !== null && percentComplete !== '') {
//       const completionValue = parseFloat(percentComplete);
//       if (!isNaN(completionValue)) {
//         if (!taskCompletionMap[taskName]) {
//           taskCompletionMap[taskName] = [];
//         }
//         taskCompletionMap[taskName].push(completionValue);
//       }
//     }
//   });
  
//   // Calculate average per task
//   Object.values(taskCompletionMap).forEach(taskCompletions => {
//     if (taskCompletions.length > 0) {
//       const taskAverage = taskCompletions.reduce((a, b) => a + b, 0) / taskCompletions.length;
//       totalCompletion += Math.min(100, Math.max(0, taskAverage));
//       validAssignments++;
//     }
//   });
//   // Count in-progress tasks from assignments
// const inProgressTasksFromAssignments = useMemo(() => {
//   if (!assignments || assignments.length === 0) return 0;
  
//   const taskStatusMap = {};
  
//   assignments.forEach(assignment => {
//     const taskName = assignment['Task Name'] || assignment.Task || '';
//     const percentComplete = parseFloat(assignment['Percent Work Complete']) || 0;
    
//     if (taskName) {
//       if (!taskStatusMap[taskName]) {
//         taskStatusMap[taskName] = { percentComplete: 0, count: 0 };
//       }
//       taskStatusMap[taskName].percentComplete += percentComplete;
//       taskStatusMap[taskName].count++;
//     }
//   });
  
//   let inProgressCount = 0;
  
//   Object.values(taskStatusMap).forEach(taskData => {
//     const avgCompletion = taskData.percentComplete / taskData.count;
//     if (avgCompletion > 0 && avgCompletion < 100) {
//       inProgressCount++;
//     }
//   });
  
//   console.log('In-progress tasks from assignments:', inProgressCount);
//   return inProgressCount;
// }, [assignments]);
  
//   const overallProgress = validAssignments > 0 ? totalCompletion / validAssignments : 0;
  
//   console.log('Overall progress from assignments:', {
//     totalAssignments: assignments.length,
//     tasksWithAssignments: Object.keys(taskCompletionMap).length,
//     validAssignments,
//     overallProgress: overallProgress.toFixed(1) + '%'
//   });
  
//   return overallProgress;
// }, [assignments]);
  
//   // FALLBACK: Check task sheet fields
//   const possibleFields = [
//     '% Complete', '%_Complete', 'Percent Complete', 'Percent_Complete',
//     'Progress', 'Complete', 'Completion', 
//     'Progress%', '%Progress', 'Pct Complete', 'Pct_Complete',
//     '% Work Complete', 'Work_Complete', 'Work%'
//   ];
  
//   for (const field of possibleFields) {
//     if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
//       const value = task[field];
//       console.log(`📝 Found completion field "${field}":`, value);
      
//       if (typeof value === 'number') {
//         const finalValue = Math.min(100, Math.max(0, value));
//         console.log(`Using numeric value: ${finalValue}%`);
//         return finalValue;
//       }
      
//       if (typeof value === 'string') {
//         const cleaned = value.replace('%', '').trim();
//         const parsed = parseFloat(cleaned);
//         if (!isNaN(parsed)) {
//           const finalValue = Math.min(100, Math.max(0, parsed));
//           console.log(`Using parsed string value: ${finalValue}%`);
//           return finalValue;
//         }
//       }
//     }
//   }
  
//   console.log(`⚠️ No completion found for task: ${task.Name || task['Task Name']}`);
//   return 0;
// }, [assignments])
//   // COMPLETION DATA - Based on Assignment Sheet
//  const completionData = useMemo(() => {
//   if (!tasks || tasks.length === 0) {
//     console.log('No tasks available');
//     return [];
//   }
  
//   console.log(`=== COMPLETION ANALYSIS START ===`);
//   console.log(`Total tasks: ${tasks.length}`);
//   console.log(`Assignments available: ${assignments ? assignments.length : 0}`);
//   console.log(`Sample assignments:`, assignments ? assignments.slice(0, 3) : 'No assignments');
    
//     const buckets = [
//       { range: '0%', min: 0, max: 0, count: 0, color: '#ef4444' },
//       { range: '1-25%', min: 1, max: 25, count: 0, color: '#f97316' },
//       { range: '26-50%', min: 26, max: 50, count: 0, color: '#eab308' },
//       { range: '51-75%', min: 51, max: 75, count: 0, color: '#84cc16' },
//       { range: '76-99%', min: 76, max: 99, count: 0, color: '#22c55e' },
//       { range: '100%', min: 100, max: 100, count: 0, color: '#15803d' }
//     ];
    
//     let processedCount = 0;
//     let zeroCompletionCount = 0;
//     let hundredCompletionCount = 0;
    
//     tasks.forEach((task, index) => {
//       const completion = getTaskCompletion(task);
      
//       if (index < 5) {
//         console.log(`Task ${index + 1} Completion Analysis:`, {
//           name: task.Name || task['Task Name'] || task.Task || 'Unknown',
//           completion,
//           'Assignments found': assignments ? assignments.filter(a => {
//             const assignmentTaskName = a['Task Name'] || a.Task || '';
//             const taskName = task.Name || task['Task Name'] || task.Task || '';
//             return assignmentTaskName.toString().trim() === taskName.toString().trim();
//           }).length : 0
//         });
//       }
      
//       if (completion === 0) zeroCompletionCount++;
//       if (completion === 100) hundredCompletionCount++;
      
//       let found = false;
//       for (const bucket of buckets) {
//         if (completion >= bucket.min && completion <= bucket.max) {
//           bucket.count++;
//           processedCount++;
//           found = true;
//           break;
//         }
//       }
      
//       if (!found) {
//         console.warn(`Task ${index} with completion ${completion} didn't fit any bucket`);
//       }
//     });
    
//     console.log('Completion Buckets:', buckets);
//     console.log(`0% tasks: ${zeroCompletionCount}, 100% tasks: ${hundredCompletionCount}`);
    
//     return buckets.map(b => ({
//       name: b.range,
//       tasks: b.count,
//       percentage: tasks.length > 0 ? (b.count / tasks.length) * 100 : 0,
//       color: b.color
//     }));
//  }, [tasks, getTaskCompletion, assignments])

//   // TIMELINE DATA - Project Timeline Analysis
//   const timelineData = useMemo(() => {
//     if (!tasks || tasks.length === 0) return []
    
//     const timelineMap = {}
    
//     tasks.forEach(task => {
//       const startDateStr = task['Start Date'] || task.Start || task.Begin
//       if (startDateStr) {
//         try {
//           const date = new Date(startDateStr)
//           const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
          
//           if (!timelineMap[monthKey]) {
//             timelineMap[monthKey] = {
//               month: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}`,
//               tasksStarted: 0,
//               tasksCompleted: 0,
//               totalTasks: 0
//             }
//           }
//           timelineMap[monthKey].tasksStarted++
//           timelineMap[monthKey].totalTasks++
          
//           const completion = getTaskCompletion(task);
//           if (completion >= 100) {
//             timelineMap[monthKey].tasksCompleted++
//           }
//         } catch (e) {
//           console.error('Error parsing date:', startDateStr)
//         }
//       }
//     })
    
//     return Object.values(timelineMap).sort((a, b) => a.month.localeCompare(b.month))
//   }, [tasks, getTaskCompletion])

//   // STATUS DISTRIBUTION
//   const statusData = useMemo(() => {
//     if (!stats) return []
    
//     return [
//       { name: 'Completed', value: stats.completedTasks, color: '#22c55e' },
//       { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
//       { name: 'Not Started', value: stats.notStartedTasks, color: '#6b7280' },
//       { name: 'Overdue', value: stats.overdueTasks, color: '#ef4444' }
//     ].filter(item => item.value > 0)
//   }, [stats])

//   // DURATION STATISTICS
//   const durationStats = useMemo(() => {
//     if (!tasks || tasks.length === 0) return null
    
//     let totalDuration = 0
//     let minDuration = Infinity
//     let maxDuration = 0
//     const durations = []
    
//     tasks.forEach(task => {
//       const durationStr = task.Duration
//       if (durationStr) {
//         // Parse duration from various formats
//         const durationMatch = durationStr.toString().match(/(\d+(\.\d+)?)\s*([dwmh]?)/i)
//         if (durationMatch) {
//           let duration = parseFloat(durationMatch[1])
//           const unit = durationMatch[3]?.toLowerCase()
          
//           // Convert to days
//           switch(unit) {
//             case 'h': duration = duration / 8; break // hours to days
//             case 'w': duration = duration * 5; break // weeks to days
//             case 'm': duration = duration * 20; break // months to days
//             // 'd' or no unit = days
//           }
          
//           totalDuration += duration
//           minDuration = Math.min(minDuration, duration)
//           maxDuration = Math.max(maxDuration, duration)
//           durations.push(duration)
//         } else {
//           // Try to parse as number
//           const duration = parseFloat(durationStr)
//           if (!isNaN(duration)) {
//             totalDuration += duration
//             minDuration = Math.min(minDuration, duration)
//             maxDuration = Math.max(maxDuration, duration)
//             durations.push(duration)
//           }
//         }
//       }
//     })
    
//     const avgDuration = durations.length > 0 ? totalDuration / durations.length : 0
    
//     const durationDistribution = [
//       { range: '1-5 days', min: 1, max: 5, count: 0 },
//       { range: '6-20 days', min: 6, max: 20, count: 0 },
//       { range: '21-50 days', min: 21, max: 50, count: 0 },
//       { range: '51+ days', min: 51, max: Infinity, count: 0 }
//     ]
    
//     durations.forEach(duration => {
//       for (const bucket of durationDistribution) {
//         if (duration >= bucket.min && duration <= bucket.max) {
//           bucket.count++
//           break
//         }
//       }
//     })
    
//     return {
//       avgDuration: avgDuration.toFixed(1),
//       minDuration: minDuration === Infinity ? 0 : minDuration,
//       maxDuration,
//       totalDuration,
//       distribution: durationDistribution.filter(d => d.count > 0)
//     }
//   }, [tasks])

//   // RISK FACTORS ANALYSIS - COMMENTED OUT
//   /*
//   const riskFactors = useMemo(() => {
//     if (!stats || !tasks) return []
    
//     const risks = []
    
//     // Overdue Tasks Risk
//     if (stats.overdueTasks > 0) {
//       const severity = stats.overdueTasks > stats.totalTasks * 0.1 ? 'High' : 'Medium'
//       risks.push({
//         factor: 'Overdue Tasks',
//         count: stats.overdueTasks,
//         severity,
//         description: `${stats.overdueTasks} tasks are behind schedule`
//       })
//     }
    
//     // Low Progress Risk
//     if (stats.avgCompletion < 30) {
//       risks.push({
//         factor: 'Low Progress',
//         severity: 'High',
//         description: `Only ${stats.avgCompletion.toFixed(1)}% overall completion`
//       })
//     } else if (stats.avgCompletion < 60) {
//       risks.push({
//         factor: 'Moderate Progress',
//         severity: 'Medium',
//         description: `${stats.avgCompletion.toFixed(1)}% overall completion`
//       })
//     }
    
//     // Many Not Started Tasks Risk
//     if (stats.notStartedTasks > stats.totalTasks * 0.3) {
//       risks.push({
//         factor: 'Many Not Started',
//         count: stats.notStartedTasks,
//         severity: 'Medium',
//         description: `${stats.notStartedTasks} tasks (${((stats.notStartedTasks/stats.totalTasks)*100).toFixed(1)}%) haven't started`
//       })
//     }
    
//     // Resource Overload Risk
//     if (stats.resourceStats) {
//       const resourceCount = Object.keys(stats.resourceStats).length
//       if (resourceCount > 0) {
//         const avgTasksPerResource = stats.totalTasks / resourceCount
//         if (avgTasksPerResource > 10) {
//           risks.push({
//             factor: 'Resource Overload',
//             severity: 'Medium',
//             description: `Average of ${avgTasksPerResource.toFixed(1)} tasks per resource`
//           })
//         }
//       }
//     }
    
//     // Tasks without Assignments Risk
//     if (assignments && assignments.length > 0) {
//       const tasksWithoutAssignments = tasks.filter(task => {
//         const taskName = task.Name || task['Task Name'] || task.Task || '';
//         const hasAssignment = assignments.some(assignment => {
//           const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//           return assignmentTaskName.toString().trim() === taskName.toString().trim();
//         });
//         return !hasAssignment;
//       }).length;
      
//       if (tasksWithoutAssignments > 0) {
//         risks.push({
//           factor: 'Tasks Without Assignments',
//           count: tasksWithoutAssignments,
//           severity: 'Medium',
//           description: `${tasksWithoutAssignments} tasks don't have resource assignments`
//         });
//       }
//     }
    
//     return risks
//   }, [stats, tasks, assignments])
//   */

//   // RECOMMENDATIONS
//   const recommendations = useMemo(() => {
//     const recs = []
    
//     if (!stats) return recs
    
//     // Progress-based recommendations
//     if (stats.avgCompletion < 40) {
//       recs.push({
//         icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
//         title: 'Accelerate Progress',
//         description: 'Project progress is below 40%. Consider reallocating resources to critical tasks.',
//         priority: 'high'
//       })
//     } else if (stats.avgCompletion < 70) {
//       recs.push({
//         icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
//         title: 'Maintain Momentum',
//         description: 'Progress is moderate. Focus on completing in-progress tasks to build momentum.',
//         priority: 'medium'
//       })
//     } else {
//       recs.push({
//         icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
//         title: 'Sustain Progress',
//         description: 'Good progress rate. Continue current pace and focus on quality.',
//         priority: 'low'
//       })
//     }
    
//     // Overdue tasks recommendations
//     if (stats.overdueTasks > 0) {
//       recs.push({
//         icon: <Clock className="w-5 h-5 flex-shrink-0" />,
//         title: 'Address Overdue Tasks',
//         description: `${stats.overdueTasks} tasks are overdue. Review and adjust deadlines.`,
//         priority: stats.overdueTasks > 5 ? 'high' : 'medium'
//       })
//     }
    
//     // Resource allocation recommendations
//     if (stats.resourceStats) {
//       const resourceCount = Object.keys(stats.resourceStats).length
//       if (resourceCount > 0) {
//         const avgTasksPerResource = stats.totalTasks / resourceCount
        
//         if (avgTasksPerResource > 8) {
//           recs.push({
//             icon: <Users className="w-5 h-5 flex-shrink-0" />,
//             title: 'Resource Allocation',
//             description: `High workload per resource (${avgTasksPerResource.toFixed(1)} tasks avg). Consider redistributing work.`,
//             priority: 'medium'
//           })
//         }
//       }
//     }
    
//     // Project duration recommendations
//     if (stats.timelineStats && stats.timelineStats.totalDays > 180) {
//       recs.push({
//         icon: <Calendar className="w-5 h-5 flex-shrink-0" />,
//         title: 'Long Project Duration',
//         description: `Project spans ${stats.timelineStats.totalDays} days. Consider breaking into phases.`,
//         priority: 'medium'
//       })
//     }
    
//     // High-risk areas recommendations - COMMENTED OUT
//     /*
//     if (riskFactors.some(r => r.severity === 'High')) {
//       recs.push({
//         icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
//         title: 'High-Risk Areas',
//         description: 'High-risk factors identified. Prioritize mitigation strategies.',
//         priority: 'high'
//       })
//     }
//     */
    
//     // Tasks without assignments recommendations
//     if (assignments && assignments.length > 0) {
//       const tasksWithoutAssignments = tasks.filter(task => {
//         const taskName = task.Name || task['Task Name'] || task.Task || '';
//         const hasAssignment = assignments.some(assignment => {
//           const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//           return assignmentTaskName.toString().trim() === taskName.toString().trim();
//         });
//         return !hasAssignment;
//       }).length;
      
//       if (tasksWithoutAssignments > 0) {
//         recs.push({
//           icon: <Users className="w-5 h-5 flex-shrink-0" />,
//           title: 'Assign Resources',
//           description: `${tasksWithoutAssignments} tasks don't have resource assignments. Assign team members to these tasks.`,
//           priority: 'medium'
//         });
//       }
//     }
    
//     // Standard recommendations
//     recs.push({
//       icon: <Lightbulb className="w-5 h-5 flex-shrink-0" />,
//       title: 'Weekly Reviews',
//       description: 'Conduct weekly progress reviews to stay on track.',
//       priority: 'low'
//     })
    
//     recs.push({
//       icon: <Zap className="w-5 h-5 flex-shrink-0" />,
//       title: 'Focus on Critical Path',
//       description: 'Prioritize tasks on the critical path to avoid delays.',
//       priority: 'medium'
//     })
    
//     // Sort by priority
//     return recs.sort((a, b) => {
//       const priorityOrder = { high: 0, medium: 1, low: 2 }
//       return priorityOrder[a.priority] - priorityOrder[b.priority]
//     })
//   }, [stats, tasks, assignments])
//   // riskFactors को dependencies से हटा दिया

//   // PROGRESS TRENDS
//   const progressTrends = useMemo(() => {
//     if (!stats) return []
    
//     return [
//       {
//         name: 'Overall Progress',
//         value: stats.avgCompletion,
//         target: 100,
//         color: '#3b82f6',
//         description: 'Project completion rate based on assignments'
//       },
//       {
//         name: 'On-time Progress',
//         value: ((stats.totalTasks - stats.overdueTasks) / stats.totalTasks) * 100,
//         target: 100,
//         color: '#22c55e',
//         description: 'Tasks completed on schedule'
//       },
//       {
//         name: 'Started Tasks',
//         value: ((stats.completedTasks + stats.inProgressTasks) / stats.totalTasks) * 100,
//         target: 100,
//         color: '#f59e0b',
//         description: 'Tasks that have started'
//       },
//       {
//         name: 'Completion Velocity',
//         value: stats.inProgressTasks > 0 ? (stats.avgCompletion / (stats.timelineStats?.totalDays || 30)) * 100 : 0,
//         target: 3,
//         color: '#8b5cf6',
//         description: 'Progress per time unit'
//       }
//     ]
//   }, [stats])

//   // Loading state
//   if (!stats) {
//     return (
//       <div className="text-center py-12">
//         <BarChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
//         <p className="text-gray-500">Upload a project file to see analysis.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Chart Type Navigation - Risk Analysis Button Removed */}
//       <div className="flex flex-wrap gap-2 border-b pb-4">
//         <button 
//           onClick={() => setChartType('completion')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'completion' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <TrendingUp className="inline-block w-4 h-4 mr-2" />
//           Completion Analysis
//         </button>
//         <button 
//           onClick={() => setChartType('timeline')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'timeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <Calendar className="inline-block w-4 h-4 mr-2" />
//           Timeline Analysis
//         </button>
//         <button 
//           onClick={() => setChartType('status')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'status' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <PieChartIcon className="inline-block w-4 h-4 mr-2" />
//           Status Distribution
//         </button>
//         {/* Risk Analysis Button Commented Out */}
//         {/*
//         <button 
//           onClick={() => setChartType('risks')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'risks' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <AlertTriangle className="inline-block w-4 h-4 mr-2" />
//           Risk Analysis
//         </button>
//         */}
//         <button 
//           onClick={() => setChartType('trends')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'trends' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <Lightbulb className="inline-block w-4 h-4 mr-2" />
//           Project Trends
//         </button>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <Target className="w-8 h-8 text-blue-600" />
//             <span className="text-2xl font-bold">{stats.avgCompletion.toFixed(1)}%</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Overall Progress</h3>
//           <p className="text-sm text-gray-500">Based on assignment completion</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//             <span className="text-2xl font-bold">{stats.completedTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Completed Tasks</h3>
//           <p className="text-sm text-gray-500">100% completion tasks</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <Clock className="w-8 h-8 text-yellow-600" />
//             <span className="text-2xl font-bold">{stats.inProgressTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">In Progress</h3>
//           <p className="text-sm text-gray-500">Active tasks (1-99%)</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <AlertTriangle className="w-8 h-8 text-red-600" />
//             <span className="text-2xl font-bold">{stats.overdueTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Overdue</h3>
//           <p className="text-sm text-gray-500">Tasks behind schedule</p>
//         </div>
//       </div>

//       {/* Main Chart Area */}
//       <div className="bg-white rounded-xl shadow border p-6">
//         <h3 className="text-xl font-bold mb-6">
//           {chartType === 'completion' && 'Task Completion Analysis (Based on Assignment Sheet)'}
//           {chartType === 'timeline' && 'Project Timeline Analysis'}
//           {chartType === 'status' && 'Task Status Distribution'}
//           {/* Risk Analysis Commented Out */}
//           {/* {chartType === 'risks' && 'Project Risk Analysis'} */}
//           {chartType === 'trends' && 'Project Trends & Recommendations'}
//         </h3>
        
//         <div className="h-96">
//           {/* COMPLETION ANALYSIS CHART */}
//           {chartType === 'completion' && (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={completionData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" />
//                 <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
//                 <Tooltip 
//                   formatter={(value, name, props) => {
//                     if (name === 'tasks') {
//                       const percentage = props.payload.percentage || 0;
//                       return [`${value} tasks (${percentage.toFixed(1)}%)`, 'Count'];
//                     }
//                     return [value, name];
//                   }}
//                   labelFormatter={(label) => `Completion Range: ${label}`}
//                 />
//                 <Legend />
//                 <Bar dataKey="tasks" name="Number of Tasks" radius={[4, 4, 0, 0]}>
//                   {completionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           )}
          
//           {/* TIMELINE ANALYSIS CHART */}
//           {chartType === 'timeline' && (
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={timelineData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="month" />
//                 <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
//                 <Tooltip />
//                 <Legend />
//                 <Area 
//                   type="monotone" 
//                   dataKey="tasksStarted" 
//                   name="Tasks Started" 
//                   stroke="#3b82f6" 
//                   fill="#3b82f6" 
//                   fillOpacity={0.3} 
//                 />
//                 <Area 
//                   type="monotone" 
//                   dataKey="tasksCompleted" 
//                   name="Tasks Completed" 
//                   stroke="#22c55e" 
//                   fill="#22c55e" 
//                   fillOpacity={0.3} 
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
          
//           {/* STATUS DISTRIBUTION CHART */}
//           {chartType === 'status' && (
//             <div className="flex flex-col lg:flex-row gap-8 items-center h-full">
//               <div className="lg:w-1/2 h-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie 
//                       data={statusData} 
//                       cx="50%" 
//                       cy="50%" 
//                       labelLine={false} 
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
//                       outerRadius={150} 
//                       fill="#8884d8" 
//                       dataKey="value"
//                     >
//                       {statusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               <div className="lg:w-1/2 space-y-4">
//                 {statusData.map((item, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
//                       <span className="font-medium">{item.name}</span>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-bold text-lg">{item.value}</div>
//                       <div className="text-sm text-gray-500">
//                         {stats.totalTasks > 0 ? ((item.value / stats.totalTasks) * 100).toFixed(1) : 0}% of total
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* RISK ANALYSIS - COMMENTED OUT */}
//           {/*
//           {chartType === 'risks' && (
//             <div className="space-y-6">
//               {riskFactors.length === 0 ? (
//                 <div className="text-center py-12">
//                   <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
//                   <h4 className="text-lg font-medium text-gray-900 mb-2">No Major Risks Detected</h4>
//                   <p className="text-gray-500">Your project appears to be on track with healthy progress metrics.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {riskFactors.map((risk, index) => (
//                     <div 
//                       key={index} 
//                       className={`p-4 rounded-lg border-l-4 ${
//                         risk.severity === 'High' ? 'border-red-500 bg-red-50' : 
//                         risk.severity === 'Medium' ? 'border-yellow-500 bg-yellow-50' : 
//                         'border-blue-500 bg-blue-50'
//                       }`}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-bold text-gray-800">{risk.factor}</h4>
//                           <p className="text-gray-600 mt-1">{risk.description}</p>
//                         </div>
//                         <span className={`px-3 py-1 text-sm font-medium rounded-full ${
//                           risk.severity === 'High' ? 'bg-red-100 text-red-800' : 
//                           risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
//                           'bg-blue-100 text-blue-800'
//                         }`}>
//                           {risk.severity} Risk
//                         </span>
//                       </div>
//                       {risk.count && (
//                         <div className="mt-3 flex items-center gap-4">
//                           <div className="flex-1 bg-gray-200 rounded-full h-2">
//                             <div 
//                               className={`h-2 rounded-full ${
//                                 risk.severity === 'High' ? 'bg-red-500' : 
//                                 risk.severity === 'Medium' ? 'bg-yellow-500' : 
//                                 'bg-blue-500'
//                               }`} 
//                               style={{ width: `${(risk.count / stats.totalTasks) * 100}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-sm text-gray-600">{risk.count} tasks affected</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           */}
          
//           {/* PROJECT TRENDS & RECOMMENDATIONS */}
//           {chartType === 'trends' && (
//             <div className="h-full overflow-y-auto">
//               <div className="space-y-8">
//                 {/* Progress Trends Section */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5" />
//                     Progress Trends
//                   </h4>
//                   <div className="space-y-6">
//                     {progressTrends.map((trend, index) => (
//                       <div key={index} className="space-y-2">
//                         <div className="flex justify-between">
//                           <div>
//                             <span className="font-medium text-gray-700">{trend.name}</span>
//                             <p className="text-sm text-gray-500">{trend.description}</p>
//                           </div>
//                           <span className="font-bold">{trend.value.toFixed(1)}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-3">
//                           <div 
//                             className="h-3 rounded-full transition-all duration-500" 
//                             style={{ 
//                               width: `${Math.min(100, trend.value)}%`, 
//                               backgroundColor: trend.color 
//                             }}
//                           ></div>
//                         </div>
//                         <div className="flex justify-between text-sm text-gray-500">
//                           <span>Current: {trend.value.toFixed(1)}%</span>
//                           <span>Target: {trend.target}%</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Recommendations Section */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <Lightbulb className="w-5 h-5" />
//                     Recommendations
//                   </h4>
//                   <div className="space-y-4">
//                     {recommendations.map((rec, index) => (
//                       <div 
//                         key={index} 
//                         className={`p-4 rounded-lg border-l-4 ${
//                           rec.priority === 'high' ? 'border-l-red-500 bg-red-50' : 
//                           rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
//                           'border-l-green-500 bg-green-50'
//                         }`}
//                       >
//                         <div className="flex gap-3">
//                           <div className="flex-shrink-0">{rec.icon}</div>
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                               <h5 className="font-semibold text-gray-800">{rec.title}</h5>
//                               <span className={`px-2 py-1 text-xs font-medium rounded ${
//                                 rec.priority === 'high' ? 'bg-red-100 text-red-800' : 
//                                 rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
//                                 'bg-green-100 text-green-800'
//                               }`}>
//                                 {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
//                               </span>
//                             </div>
//                             <p className="text-gray-600 mt-1">{rec.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Project Health Summary */}
//                 <div className="bg-blue-50 p-6 rounded-lg">
//                   <h4 className="font-bold text-blue-800 mb-3">Project Health Summary</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-blue-700">Overall Status:</p>
//                       <p className="font-bold text-blue-800">
//                         {stats.avgCompletion >= 70 ? 'Good' : stats.avgCompletion >= 40 ? 'Moderate' : 'Needs Attention'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-blue-700">Risk Level:</p>
//                       <p className="font-bold text-blue-800">
//                         {/* Risk level comment removed */}
//                         Low
//                       </p>
//                     </div>
//                   </div>
//                   <p className="text-sm text-blue-700 mt-3">
//                     {stats.avgCompletion >= 70 
//                       ? 'Project is progressing well. Focus on maintaining quality and monitoring progress.'
//                       : stats.avgCompletion >= 40
//                       ? 'Project requires attention to accelerate progress and meet deadlines.'
//                       : 'Immediate action required to improve project progress and address critical tasks.'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Bottom Stats Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Duration Analysis */}
//         <div className="bg-white rounded-xl shadow border p-6">
//           <h3 className="text-lg font-bold mb-4">Duration Analysis</h3>
//           {durationStats ? (
//             <div className="space-y-6">
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center p-4 bg-blue-50 rounded">
//                   <div className="text-2xl font-bold text-blue-700">{durationStats.avgDuration}</div>
//                   <div className="text-sm text-blue-600">Avg Days</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded">
//                   <div className="text-2xl font-bold text-green-700">{durationStats.minDuration}</div>
//                   <div className="text-sm text-green-600">Min Days</div>
//                 </div>
//                 <div className="text-center p-4 bg-red-50 rounded">
//                   <div className="text-2xl font-bold text-red-700">{durationStats.maxDuration}</div>
//                   <div className="text-sm text-red-600">Max Days</div>
//                 </div>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-gray-700 mb-3">Duration Distribution</h4>
//                 <div className="space-y-3">
//                   {durationStats.distribution.map((item, index) => (
//                     <div key={index}>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm text-gray-600">{item.range}</span>
//                         <span className="text-sm font-medium">{item.count} tasks</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="h-2 rounded-full bg-purple-600" 
//                           style={{ width: `${(item.count / tasks.length) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-500">No duration data available</p>
//           )}
//         </div>

//         {/* Task Distribution */}
//         {/* <div className="bg-white rounded-xl shadow border p-6">
//           <h3 className="text-lg font-bold mb-4">Task Distribution</h3>
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="text-center p-4 bg-gray-50 rounded">
//                 <div className="text-2xl font-bold text-gray-700">{stats.totalTasks}</div>
//                 <div className="text-sm text-gray-600">Total Tasks</div>
//               </div>
//               <div className="text-center p-4 bg-blue-50 rounded">
//                 <div className="text-2xl font-bold text-blue-700">
//                   {tasks.filter(t => {
//                     const completion = getTaskCompletion(t);
//                     return completion > 0 && completion < 100;
//                   }).length}
//                 </div>
//                 <div className="text-sm text-blue-600">Active Tasks</div>
//               </div>
//             </div> */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex items-center gap-2 mb-4">
//         <BarChartIcon className="w-5 h-5 text-gray-700" />
//         <h3 className="text-lg font-semibold">Task Distribution</h3>
//       </div>
//       <div className="space-y-6">
//         <div className="text-center">
//           <div className="text-4xl font-bold text-blue-600 mb-2">
//             {stats.totalTasks - 1}
//           </div>
//           <div className="text-sm text-gray-600">Total Tasks</div>
//         </div>
//         <div className="text-center">
//           <div className="text-3xl font-bold text-green-600 mb-2">
//             {tasks.filter(t => {
//               const completion = getTaskCompletion(t);
//               return completion > 0 && completion < 100;
//             }).length}
//           </div>
//           <div className="text-sm text-gray-600">Active Tasks</div>
//         </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-3">Task Status Overview</h4>
//               <div className="space-y-3">
//                 {[
//                   { label: 'Completed', value: stats.completedTasks, color: 'bg-green-500' },
//                   { label: 'In Progress', value: stats.inProgressTasks, color: 'bg-blue-500' },
//                   { label: 'Not Started', value: stats.notStartedTasks, color: 'bg-gray-400' },
//                   { label: 'Overdue', value: stats.overdueTasks, color: 'bg-red-500' }
//                 ].map((item, index) => (
//                   <div key={index}>
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm text-gray-600">{item.label}</span>
//                       <span className="text-sm font-medium">{item.value} tasks</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className={`h-2 rounded-full ${item.color}`} 
//                         style={{ width: `${(item.value / stats.totalTasks) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="pt-4 border-t">
//               <h4 className="font-medium text-gray-700 mb-2">Completion Forecast</h4>
//               <p className="text-sm text-gray-600">
//                 {stats.inProgressTasks > 0 
//                   ? `At current pace, project will complete in approximately ${Math.ceil((100 - stats.avgCompletion) / (stats.avgCompletion / (stats.timelineStats?.totalDays || 30)))} days`
//                   : 'Not enough progress data to calculate forecast'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Export Report Section */}
//       <div className="bg-gray-50 rounded-xl p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800">Analysis Report</h3>
//             <p className="text-gray-600">Export detailed project analysis</p>
//           </div>
//           <button
//             onClick={() => {
//               const report = {
//                 projectName: stats.projectName || 'Project Analysis',
//                 date: new Date().toLocaleDateString(),
//                 summary: {
//                   totalTasks: stats.totalTasks,
//                   completed: stats.completedTasks,
//                   inProgress: stats.inProgressTasks,
//                   notStarted: stats.notStartedTasks,
//                   overdue: stats.overdueTasks,
//                   avgCompletion: stats.avgCompletion,
//                   projectDuration: stats.timelineStats?.totalDays || 0
//                 },
//                 completionAnalysis: completionData,
//                 // risks: riskFactors, // Commented out
//                 recommendations: recommendations.map(rec => ({
//                   title: rec.title,
//                   description: rec.description,
//                   priority: rec.priority
//                 }))
//               }
              
//               const reportText = JSON.stringify(report, null, 2)
//               const blob = new Blob([reportText], { type: 'application/json' })
//               const url = URL.createObjectURL(blob)
//               const link = document.createElement('a')
//               link.href = url
//               link.download = `project-analysis-${new Date().toISOString().split('T')[0]}.json`
//               link.click()
//               URL.revokeObjectURL(url)
//             }}
//             className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Export Analysis Report
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
// 'use client'

// import { useState, useMemo, useCallback } from 'react'
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
// } from 'recharts'
// import { 
//   Calendar, TrendingUp, AlertTriangle, CheckCircle, 
//   Clock, Target, BarChart as BarChartIcon, PieChart as PieChartIcon,
//   Lightbulb, Users, Zap, AlertCircle
// } from 'lucide-react'

// export function ProjectAnalysis({ stats, tasks, assignments, overallProgressFromAssignments, inProgressFromAssignments }) {
//   const [chartType, setChartType] = useState('completion')

//   // COMPLETION CALCULATION FROM ASSIGNMENT SHEET
//  const getTaskCompletion = useCallback((task) => {
//   if (!task) return 0;
  
//   console.log('🔍 Checking task completion for:', {
//     taskName: task.Name || task['Task Name'],
//     assignments: assignments
//   });
  
//   // FIRST: Check Assignment sheet data if available
//   if (assignments && assignments.length > 0) {
//     const taskName = task.Name || task['Task Name'] || task.Task || '';
//     console.log(`Looking for task: "${taskName}" in assignments`);
    
//     if (taskName) {
//       // Find all assignments for this task
//       const taskAssignments = assignments.filter(assignment => {
//         const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//         const isMatch = assignmentTaskName.toString().trim() === taskName.toString().trim();
        
//         if (isMatch) {
//           console.log(`✅ Found assignment for "${taskName}":`, {
//             assignmentTaskName,
//             percentComplete: assignment['Percent Work Complete'],
//             type: typeof assignment['Percent Work Complete']
//           });
//         }
        
//         return isMatch;
//       });
      
//       console.log(`Found ${taskAssignments.length} assignments for "${taskName}"`);
      
//       if (taskAssignments.length > 0) {
//         // Calculate average completion from assignments
//         let totalCompletion = 0;
//         let validAssignments = 0;
        
//         taskAssignments.forEach(assignment => {
//           const assignmentCompletion = assignment['Percent Work Complete'];
//           console.log('Assignment completion data:', {
//             raw: assignmentCompletion,
//             parsed: parseFloat(assignmentCompletion),
//             isNumber: typeof assignmentCompletion === 'number'
//           });
          
//           if (assignmentCompletion !== undefined && assignmentCompletion !== null && assignmentCompletion !== '') {
//             const completionValue = parseFloat(assignmentCompletion);
//             if (!isNaN(completionValue)) {
//               totalCompletion += completionValue;
//               validAssignments++;
//               console.log(`Added completion: ${completionValue}`);
//             }
//           }
//         });
        
//         if (validAssignments > 0) {
//           const avgCompletion = totalCompletion / validAssignments;
//           const finalCompletion = Math.min(100, Math.max(0, avgCompletion));
//           console.log(`📊 Task "${taskName}" completion from assignments: ${finalCompletion}%`);
//           return finalCompletion;
//         }
//       }
//     }
//   }
  
//   // FALLBACK: Check task sheet fields
//   const possibleFields = [
//     '% Complete', '%_Complete', 'Percent Complete', 'Percent_Complete',
//     'Progress', 'Complete', 'Completion', 
//     'Progress%', '%Progress', 'Pct Complete', 'Pct_Complete',
//     '% Work Complete', 'Work_Complete', 'Work%'
//   ];
  
//   for (const field of possibleFields) {
//     if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
//       const value = task[field];
//       console.log(`📝 Found completion field "${field}":`, value);
      
//       if (typeof value === 'number') {
//         const finalValue = Math.min(100, Math.max(0, value));
//         console.log(`Using numeric value: ${finalValue}%`);
//         return finalValue;
//       }
      
//       if (typeof value === 'string') {
//         const cleaned = value.replace('%', '').trim();
//         const parsed = parseFloat(cleaned);
//         if (!isNaN(parsed)) {
//           const finalValue = Math.min(100, Math.max(0, parsed));
//           console.log(`Using parsed string value: ${finalValue}%`);
//           return finalValue;
//         }
//       }
//     }
//   }
  
//   console.log(`⚠️ No completion found for task: ${task.Name || task['Task Name']}`);
//   return 0;
// }, [assignments])

//   // COMPLETION DATA - Based on Assignment Sheet
//  const completionData = useMemo(() => {
//   if (!tasks || tasks.length === 0) {
//     console.log('No tasks available');
//     return [];
//   }
  
//   console.log(`=== COMPLETION ANALYSIS START ===`);
//   console.log(`Total tasks: ${tasks.length}`);
//   console.log(`Assignments available: ${assignments ? assignments.length : 0}`);
//   console.log(`Sample assignments:`, assignments ? assignments.slice(0, 3) : 'No assignments');
    
//     const buckets = [
//       { range: '0%', min: 0, max: 0, count: 0, color: '#ef4444' },
//       { range: '1-25%', min: 1, max: 25, count: 0, color: '#f97316' },
//       { range: '26-50%', min: 26, max: 50, count: 0, color: '#eab308' },
//       { range: '51-75%', min: 51, max: 75, count: 0, color: '#84cc16' },
//       { range: '76-99%', min: 76, max: 99, count: 0, color: '#22c55e' },
//       { range: '100%', min: 100, max: 100, count: 0, color: '#15803d' }
//     ];
    
//     let processedCount = 0;
//     let zeroCompletionCount = 0;
//     let hundredCompletionCount = 0;
    
//     tasks.forEach((task, index) => {
//       const completion = getTaskCompletion(task);
      
//       if (index < 5) {
//         console.log(`Task ${index + 1} Completion Analysis:`, {
//           name: task.Name || task['Task Name'] || task.Task || 'Unknown',
//           completion,
//           'Assignments found': assignments ? assignments.filter(a => {
//             const assignmentTaskName = a['Task Name'] || a.Task || '';
//             const taskName = task.Name || task['Task Name'] || task.Task || '';
//             return assignmentTaskName.toString().trim() === taskName.toString().trim();
//           }).length : 0
//         });
//       }
      
//       if (completion === 0) zeroCompletionCount++;
//       if (completion === 100) hundredCompletionCount++;
      
//       let found = false;
//       for (const bucket of buckets) {
//         if (completion >= bucket.min && completion <= bucket.max) {
//           bucket.count++;
//           processedCount++;
//           found = true;
//           break;
//         }
//       }
      
//       if (!found) {
//         console.warn(`Task ${index} with completion ${completion} didn't fit any bucket`);
//       }
//     });
    
//     console.log('Completion Buckets:', buckets);
//     console.log(`0% tasks: ${zeroCompletionCount}, 100% tasks: ${hundredCompletionCount}`);
    
//     return buckets.map(b => ({
//       name: b.range,
//       tasks: b.count,
//       percentage: tasks.length > 0 ? (b.count / tasks.length) * 100 : 0,
//       color: b.color
//     }));
//  }, [tasks, getTaskCompletion, assignments])

//   // TIMELINE DATA - Project Timeline Analysis
//   const timelineData = useMemo(() => {
//     if (!tasks || tasks.length === 0) return []
    
//     const timelineMap = {}
    
//     tasks.forEach(task => {
//       const startDateStr = task['Start Date'] || task.Start || task.Begin
//       if (startDateStr) {
//         try {
//           const date = new Date(startDateStr)
//           const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
          
//           if (!timelineMap[monthKey]) {
//             timelineMap[monthKey] = {
//               month: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}`,
//               tasksStarted: 0,
//               tasksCompleted: 0,
//               totalTasks: 0
//             }
//           }
//           timelineMap[monthKey].tasksStarted++
//           timelineMap[monthKey].totalTasks++
          
//           const completion = getTaskCompletion(task);
//           if (completion >= 100) {
//             timelineMap[monthKey].tasksCompleted++
//           }
//         } catch (e) {
//           console.error('Error parsing date:', startDateStr)
//         }
//       }
//     })
    
//     return Object.values(timelineMap).sort((a, b) => a.month.localeCompare(b.month))
//   }, [tasks, getTaskCompletion])

//   // STATUS DISTRIBUTION
//   const statusData = useMemo(() => {
//     if (!stats) return []
    
//     return [
//       { name: 'Completed', value: stats.completedTasks, color: '#22c55e' },
//       { name: 'In Progress', value: inProgressFromAssignments || stats.inProgressTasks, color: '#3b82f6' },
//       { name: 'Not Started', value: stats.notStartedTasks, color: '#6b7280' },
//       { name: 'Overdue', value: stats.overdueTasks, color: '#ef4444' }
//     ].filter(item => item.value > 0)
//   }, [stats, inProgressFromAssignments])

//   // DURATION STATISTICS
//   const durationStats = useMemo(() => {
//     if (!tasks || tasks.length === 0) return null
    
//     let totalDuration = 0
//     let minDuration = Infinity
//     let maxDuration = 0
//     const durations = []
    
//     tasks.forEach(task => {
//       const durationStr = task.Duration
//       if (durationStr) {
//         // Parse duration from various formats
//         const durationMatch = durationStr.toString().match(/(\d+(\.\d+)?)\s*([dwmh]?)/i)
//         if (durationMatch) {
//           let duration = parseFloat(durationMatch[1])
//           const unit = durationMatch[3]?.toLowerCase()
          
//           // Convert to days
//           switch(unit) {
//             case 'h': duration = duration / 8; break // hours to days
//             case 'w': duration = duration * 5; break // weeks to days
//             case 'm': duration = duration * 20; break // months to days
//             // 'd' or no unit = days
//           }
          
//           totalDuration += duration
//           minDuration = Math.min(minDuration, duration)
//           maxDuration = Math.max(maxDuration, duration)
//           durations.push(duration)
//         } else {
//           // Try to parse as number
//           const duration = parseFloat(durationStr)
//           if (!isNaN(duration)) {
//             totalDuration += duration
//             minDuration = Math.min(minDuration, duration)
//             maxDuration = Math.max(maxDuration, duration)
//             durations.push(duration)
//           }
//         }
//       }
//     })
    
//     const avgDuration = durations.length > 0 ? totalDuration / durations.length : 0
    
//     const durationDistribution = [
//       { range: '1-5 days', min: 1, max: 5, count: 0 },
//       { range: '6-20 days', min: 6, max: 20, count: 0 },
//       { range: '21-50 days', min: 21, max: 50, count: 0 },
//       { range: '51+ days', min: 51, max: Infinity, count: 0 }
//     ]
    
//     durations.forEach(duration => {
//       for (const bucket of durationDistribution) {
//         if (duration >= bucket.min && duration <= bucket.max) {
//           bucket.count++
//           break
//         }
//       }
//     })
    
//     return {
//       avgDuration: avgDuration.toFixed(1),
//       minDuration: minDuration === Infinity ? 0 : minDuration,
//       maxDuration,
//       totalDuration,
//       distribution: durationDistribution.filter(d => d.count > 0)
//     }
//   }, [tasks])

//   // RECOMMENDATIONS
//   const recommendations = useMemo(() => {
//     const recs = []
    
//     if (!stats) return recs
    
//     const overallProgress = overallProgressFromAssignments || stats.avgCompletion
    
//     // Progress-based recommendations
//     if (overallProgress < 40) {
//       recs.push({
//         icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
//         title: 'Accelerate Progress',
//         description: `Project progress is below 40%. Consider reallocating resources to critical tasks.`,
//         priority: 'high'
//       })
//     } else if (overallProgress < 70) {
//       recs.push({
//         icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
//         title: 'Maintain Momentum',
//         description: `Progress is moderate. Focus on completing in-progress tasks to build momentum.`,
//         priority: 'medium'
//       })
//     } else {
//       recs.push({
//         icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
//         title: 'Sustain Progress',
//         description: 'Good progress rate. Continue current pace and focus on quality.',
//         priority: 'low'
//       })
//     }
    
//     // Overdue tasks recommendations
//     if (stats.overdueTasks > 0) {
//       recs.push({
//         icon: <Clock className="w-5 h-5 flex-shrink-0" />,
//         title: 'Address Overdue Tasks',
//         description: `${stats.overdueTasks} tasks are overdue. Review and adjust deadlines.`,
//         priority: stats.overdueTasks > 5 ? 'high' : 'medium'
//       })
//     }
    
//     // Resource allocation recommendations
//     if (stats.resourceStats) {
//       const resourceCount = Object.keys(stats.resourceStats).length
//       if (resourceCount > 0) {
//         const avgTasksPerResource = stats.totalTasks / resourceCount
        
//         if (avgTasksPerResource > 8) {
//           recs.push({
//             icon: <Users className="w-5 h-5 flex-shrink-0" />,
//             title: 'Resource Allocation',
//             description: `High workload per resource (${avgTasksPerResource.toFixed(1)} tasks avg). Consider redistributing work.`,
//             priority: 'medium'
//           })
//         }
//       }
//     }
    
//     // Project duration recommendations
//     if (stats.timelineStats && stats.timelineStats.totalDays > 180) {
//       recs.push({
//         icon: <Calendar className="w-5 h-5 flex-shrink-0" />,
//         title: 'Long Project Duration',
//         description: `Project spans ${stats.timelineStats.totalDays} days. Consider breaking into phases.`,
//         priority: 'medium'
//       })
//     }
    
//     // Tasks without assignments recommendations
//     if (assignments && assignments.length > 0) {
//       const tasksWithoutAssignments = tasks.filter(task => {
//         const taskName = task.Name || task['Task Name'] || task.Task || '';
//         const hasAssignment = assignments.some(assignment => {
//           const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
//           return assignmentTaskName.toString().trim() === taskName.toString().trim();
//         });
//         return !hasAssignment;
//       }).length;
      
//       if (tasksWithoutAssignments > 0) {
//         recs.push({
//           icon: <Users className="w-5 h-5 flex-shrink-0" />,
//           title: 'Assign Resources',
//           description: `${tasksWithoutAssignments} tasks don't have resource assignments. Assign team members to these tasks.`,
//           priority: 'medium'
//         });
//       }
//     }
    
//     // Standard recommendations
//     recs.push({
//       icon: <Lightbulb className="w-5 h-5 flex-shrink-0" />,
//       title: 'Weekly Reviews',
//       description: 'Conduct weekly progress reviews to stay on track.',
//       priority: 'low'
//     })
    
//     recs.push({
//       icon: <Zap className="w-5 h-5 flex-shrink-0" />,
//       title: 'Focus on Critical Path',
//       description: 'Prioritize tasks on the critical path to avoid delays.',
//       priority: 'medium'
//     })
    
//     // Sort by priority
//     return recs.sort((a, b) => {
//       const priorityOrder = { high: 0, medium: 1, low: 2 }
//       return priorityOrder[a.priority] - priorityOrder[b.priority]
//     })
//   }, [stats, tasks, assignments, overallProgressFromAssignments])

//   // PROGRESS TRENDS
//   const progressTrends = useMemo(() => {
//     if (!stats) return []
    
//     const overallProgress = overallProgressFromAssignments || stats.avgCompletion
    
//     return [
//       {
//         name: 'Overall Progress',
//         value: overallProgress,
//         target: 100,
//         color: '#3b82f6',
//         description: 'Project completion rate based on assignments'
//       },
//       {
//         name: 'On-time Progress',
//         value: ((stats.totalTasks - stats.overdueTasks) / stats.totalTasks) * 100,
//         target: 100,
//         color: '#22c55e',
//         description: 'Tasks completed on schedule'
//       },
//       {
//         name: 'Started Tasks',
//         value: ((stats.completedTasks + (inProgressFromAssignments || stats.inProgressTasks)) / stats.totalTasks) * 100,
//         target: 100,
//         color: '#f59e0b',
//         description: 'Tasks that have started'
//       },
//       {
//         name: 'Completion Velocity',
//         value: stats.inProgressTasks > 0 ? (overallProgress / (stats.timelineStats?.totalDays || 30)) * 100 : 0,
//         target: 3,
//         color: '#8b5cf6',
//         description: 'Progress per time unit'
//       }
//     ]
//   }, [stats, overallProgressFromAssignments, inProgressFromAssignments])

//   // Loading state
//   if (!stats) {
//     return (
//       <div className="text-center py-12">
//         <BarChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
//         <p className="text-gray-500">Upload a project file to see analysis.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Chart Type Navigation */}
//       <div className="flex flex-wrap gap-2 border-b pb-4">
//         <button 
//           onClick={() => setChartType('completion')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'completion' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <TrendingUp className="inline-block w-4 h-4 mr-2" />
//           Completion Analysis
//         </button>
//         <button 
//           onClick={() => setChartType('timeline')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'timeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <Calendar className="inline-block w-4 h-4 mr-2" />
//           Timeline Analysis
//         </button>
//         <button 
//           onClick={() => setChartType('status')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'status' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <PieChartIcon className="inline-block w-4 h-4 mr-2" />
//           Status Distribution
//         </button>
//         <button 
//           onClick={() => setChartType('trends')} 
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'trends' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//         >
//           <Lightbulb className="inline-block w-4 h-4 mr-2" />
//           Project Trends
//         </button>
//       </div>

//       {/* Key Metrics Cards - UPDATED FOR ASSIGNMENT SHEET DATA */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <Target className="w-8 h-8 text-blue-600" />
//             <span className="text-2xl font-bold">
//               {overallProgressFromAssignments ? overallProgressFromAssignments.toFixed(1) : stats.avgCompletion.toFixed(1)}%
//             </span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Overall Progress</h3>
//           <p className="text-sm text-gray-500">Based on assignment completion</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//             <span className="text-2xl font-bold">{stats.completedTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Completed Tasks</h3>
//           <p className="text-sm text-gray-500">100% completion tasks</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <Clock className="w-8 h-8 text-yellow-600" />
//             <span className="text-2xl font-bold">
//               {inProgressFromAssignments || stats.inProgressTasks}
//             </span>
//           </div>
//           <h3 className="font-semibold text-gray-700">In Progress</h3>
//           <p className="text-sm text-gray-500">Active tasks from assignments (1-99%)</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <div className="flex items-center justify-between mb-4">
//             <AlertTriangle className="w-8 h-8 text-red-600" />
//             <span className="text-2xl font-bold">{stats.overdueTasks}</span>
//           </div>
//           <h3 className="font-semibold text-gray-700">Overdue</h3>
//           <p className="text-sm text-gray-500">Tasks behind schedule</p>
//         </div>
//       </div>

//       {/* Main Chart Area */}
//       <div className="bg-white rounded-xl shadow border p-6">
//         <h3 className="text-xl font-bold mb-6">
//           {chartType === 'completion' && 'Task Completion Analysis (Based on Assignment Sheet)'}
//           {chartType === 'timeline' && 'Project Timeline Analysis'}
//           {chartType === 'status' && 'Task Status Distribution'}
//           {chartType === 'trends' && 'Project Trends & Recommendations'}
//         </h3>
        
//         <div className="h-96">
//           {/* COMPLETION ANALYSIS CHART */}
//           {chartType === 'completion' && (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={completionData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" />
//                 <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
//                 <Tooltip 
//                   formatter={(value, name, props) => {
//                     if (name === 'tasks') {
//                       const percentage = props.payload.percentage || 0;
//                       return [`${value} tasks (${percentage.toFixed(1)}%)`, 'Count'];
//                     }
//                     return [value, name];
//                   }}
//                   labelFormatter={(label) => `Completion Range: ${label}`}
//                 />
//                 <Legend />
//                 <Bar dataKey="tasks" name="Number of Tasks" radius={[4, 4, 0, 0]}>
//                   {completionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           )}
          
//           {/* TIMELINE ANALYSIS CHART */}
//           {chartType === 'timeline' && (
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={timelineData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="month" />
//                 <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
//                 <Tooltip />
//                 <Legend />
//                 <Area 
//                   type="monotone" 
//                   dataKey="tasksStarted" 
//                   name="Tasks Started" 
//                   stroke="#3b82f6" 
//                   fill="#3b82f6" 
//                   fillOpacity={0.3} 
//                 />
//                 <Area 
//                   type="monotone" 
//                   dataKey="tasksCompleted" 
//                   name="Tasks Completed" 
//                   stroke="#22c55e" 
//                   fill="#22c55e" 
//                   fillOpacity={0.3} 
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
          
//           {/* STATUS DISTRIBUTION CHART */}
//           {chartType === 'status' && (
//             <div className="flex flex-col lg:flex-row gap-8 items-center h-full">
//               <div className="lg:w-1/2 h-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie 
//                       data={statusData} 
//                       cx="50%" 
//                       cy="50%" 
//                       labelLine={false} 
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
//                       outerRadius={150} 
//                       fill="#8884d8" 
//                       dataKey="value"
//                     >
//                       {statusData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
              
//               <div className="lg:w-1/2 space-y-4">
//                 {statusData.map((item, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
//                       <span className="font-medium">{item.name}</span>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-bold text-lg">{item.value}</div>
//                       <div className="text-sm text-gray-500">
//                         {stats.totalTasks > 0 ? ((item.value / stats.totalTasks) * 100).toFixed(1) : 0}% of total
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* PROJECT TRENDS & RECOMMENDATIONS */}
//           {chartType === 'trends' && (
//             <div className="h-full overflow-y-auto">
//               <div className="space-y-8">
//                 {/* Progress Trends Section */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5" />
//                     Progress Trends
//                   </h4>
//                   <div className="space-y-6">
//                     {progressTrends.map((trend, index) => (
//                       <div key={index} className="space-y-2">
//                         <div className="flex justify-between">
//                           <div>
//                             <span className="font-medium text-gray-700">{trend.name}</span>
//                             <p className="text-sm text-gray-500">{trend.description}</p>
//                           </div>
//                           <span className="font-bold">{trend.value.toFixed(1)}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-3">
//                           <div 
//                             className="h-3 rounded-full transition-all duration-500" 
//                             style={{ 
//                               width: `${Math.min(100, trend.value)}%`, 
//                               backgroundColor: trend.color 
//                             }}
//                           ></div>
//                         </div>
//                         <div className="flex justify-between text-sm text-gray-500">
//                           <span>Current: {trend.value.toFixed(1)}%</span>
//                           <span>Target: {trend.target}%</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Recommendations Section */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <Lightbulb className="w-5 h-5" />
//                     Recommendations
//                   </h4>
//                   <div className="space-y-4">
//                     {recommendations.map((rec, index) => (
//                       <div 
//                         key={index} 
//                         className={`p-4 rounded-lg border-l-4 ${
//                           rec.priority === 'high' ? 'border-l-red-500 bg-red-50' : 
//                           rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
//                           'border-l-green-500 bg-green-50'
//                         }`}
//                       >
//                         <div className="flex gap-3">
//                           <div className="flex-shrink-0">{rec.icon}</div>
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                               <h5 className="font-semibold text-gray-800">{rec.title}</h5>
//                               <span className={`px-2 py-1 text-xs font-medium rounded ${
//                                 rec.priority === 'high' ? 'bg-red-100 text-red-800' : 
//                                 rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
//                                 'bg-green-100 text-green-800'
//                               }`}>
//                                 {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
//                               </span>
//                             </div>
//                             <p className="text-gray-600 mt-1">{rec.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Project Health Summary */}
//                 <div className="bg-blue-50 p-6 rounded-lg">
//                   <h4 className="font-bold text-blue-800 mb-3">Project Health Summary</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-blue-700">Overall Status:</p>
//                       <p className="font-bold text-blue-800">
//                         {overallProgressFromAssignments >= 70 ? 'Good' : overallProgressFromAssignments >= 40 ? 'Moderate' : 'Needs Attention'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-blue-700">Risk Level:</p>
//                       <p className="font-bold text-blue-800">Low</p>
//                     </div>
//                   </div>
//                   <p className="text-sm text-blue-700 mt-3">
//                     {overallProgressFromAssignments >= 70 
//                       ? 'Project is progressing well. Focus on maintaining quality and monitoring progress.'
//                       : overallProgressFromAssignments >= 40
//                       ? 'Project requires attention to accelerate progress and meet deadlines.'
//                       : 'Immediate action required to improve project progress and address critical tasks.'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Bottom Stats Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Duration Analysis */}
//         <div className="bg-white rounded-xl shadow border p-6">
//           <h3 className="text-lg font-bold mb-4">Duration Analysis</h3>
//           {durationStats ? (
//             <div className="space-y-6">
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center p-4 bg-blue-50 rounded">
//                   <div className="text-2xl font-bold text-blue-700">{durationStats.avgDuration}</div>
//                   <div className="text-sm text-blue-600">Avg Days</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded">
//                   <div className="text-2xl font-bold text-green-700">{durationStats.minDuration}</div>
//                   <div className="text-sm text-green-600">Min Days</div>
//                 </div>
//                 <div className="text-center p-4 bg-red-50 rounded">
//                   <div className="text-2xl font-bold text-red-700">{durationStats.maxDuration}</div>
//                   <div className="text-sm text-red-600">Max Days</div>
//                 </div>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-gray-700 mb-3">Duration Distribution</h4>
//                 <div className="space-y-3">
//                   {durationStats.distribution.map((item, index) => (
//                     <div key={index}>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm text-gray-600">{item.range}</span>
//                         <span className="text-sm font-medium">{item.count} tasks</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="h-2 rounded-full bg-purple-600" 
//                           style={{ width: `${(item.count / tasks.length) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-500">No duration data available</p>
//           )}
//         </div>

//         {/* Task Distribution */}
//         <div className="bg-white rounded-xl shadow border p-6">
//           <h3 className="text-lg font-bold mb-4">Task Distribution</h3>
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="text-center p-4 bg-gray-50 rounded">
//                 <div className="text-2xl font-bold text-gray-700">{stats.totalTasks - 1}</div>
//                 <div className="text-sm text-gray-600">Total Tasks</div>
//               </div>
//               <div className="text-center p-4 bg-blue-50 rounded">
//                 <div className="text-2xl font-bold text-blue-700">
//                   {tasks.filter(t => {
//                     const completion = getTaskCompletion(t);
//                     return completion > 0 && completion < 100;
//                   }).length}
//                 </div>
//                 <div className="text-sm text-blue-600">Active Tasks</div>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-3">Task Status Overview</h4>
//               <div className="space-y-3">
//                 {[
//                   { label: 'Completed', value: stats.completedTasks, color: 'bg-green-500' },
//                   { label: 'In Progress', value: inProgressFromAssignments || stats.inProgressTasks, color: 'bg-blue-500' },
//                   { label: 'Not Started', value: stats.notStartedTasks, color: 'bg-gray-400' },
//                   { label: 'Overdue', value: stats.overdueTasks, color: 'bg-red-500' }
//                 ].map((item, index) => (
//                   <div key={index}>
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm text-gray-600">{item.label}</span>
//                       <span className="text-sm font-medium">{item.value} tasks</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className={`h-2 rounded-full ${item.color}`} 
//                         style={{ width: `${(item.value / stats.totalTasks) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="pt-4 border-t">
//               <h4 className="font-medium text-gray-700 mb-2">Completion Forecast</h4>
//               <p className="text-sm text-gray-600">
//                 {stats.inProgressTasks > 0 
//                   ? `At current pace, project will complete in approximately ${Math.ceil((100 - overallProgressFromAssignments) / (overallProgressFromAssignments / (stats.timelineStats?.totalDays || 30)))} days`
//                   : 'Not enough progress data to calculate forecast'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Export Report Section */}
//       <div className="bg-gray-50 rounded-xl p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800">Analysis Report</h3>
//             <p className="text-gray-600">Export detailed project analysis</p>
//           </div>
//           <button
//             onClick={() => {
//               const report = {
//                 projectName: stats.projectName || 'Project Analysis',
//                 date: new Date().toLocaleDateString(),
//                 summary: {
//                   totalTasks: stats.totalTasks,
//                   completed: stats.completedTasks,
//                   inProgress: inProgressFromAssignments || stats.inProgressTasks,
//                   notStarted: stats.notStartedTasks,
//                   overdue: stats.overdueTasks,
//                   avgCompletion: overallProgressFromAssignments || stats.avgCompletion,
//                   projectDuration: stats.timelineStats?.totalDays || 0
//                 },
//                 completionAnalysis: completionData,
//                 recommendations: recommendations.map(rec => ({
//                   title: rec.title,
//                   description: rec.description,
//                   priority: rec.priority
//                 }))
//               }
              
//               const reportText = JSON.stringify(report, null, 2)
//               const blob = new Blob([reportText], { type: 'application/json' })
//               const url = URL.createObjectURL(blob)
//               const link = document.createElement('a')
//               link.href = url
//               link.download = `project-analysis-${new Date().toISOString().split('T')[0]}.json`
//               link.click()
//               URL.revokeObjectURL(url)
//             }}
//             className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Export Analysis Report
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useMemo, useCallback } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { 
  Calendar, TrendingUp, AlertTriangle, CheckCircle, 
  Clock, Target, BarChart as BarChartIcon, PieChart as PieChartIcon,
  Lightbulb, Users, Zap, AlertCircle
} from 'lucide-react'

export function ProjectAnalysis({ stats, tasks, assignments, overallProgressFromAssignments, inProgressFromAssignments }) {
  const [chartType, setChartType] = useState('completion')

  // COMPLETION CALCULATION FROM ASSIGNMENT SHEET
 const getTaskCompletion = useCallback((task) => {
  if (!task) return 0;
  
  // FIRST: Check Assignment sheet data if available
  if (assignments && assignments.length > 0) {
    const taskName = task.Name || task['Task Name'] || task.Task || '';
    
    if (taskName) {
      // Find all assignments for this task
      const taskAssignments = assignments.filter(assignment => {
        const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
        const isMatch = assignmentTaskName.toString().trim() === taskName.toString().trim();
        return isMatch;
      });
      
      if (taskAssignments.length > 0) {
        // Calculate average completion from assignments
        let totalCompletion = 0;
        let validAssignments = 0;
        
        taskAssignments.forEach(assignment => {
          const assignmentCompletion = assignment['Percent Work Complete'];
          
          if (assignmentCompletion !== undefined && assignmentCompletion !== null && assignmentCompletion !== '') {
            const completionValue = parseFloat(assignmentCompletion);
            if (!isNaN(completionValue)) {
              totalCompletion += completionValue;
              validAssignments++;
            }
          }
        });
        
        if (validAssignments > 0) {
          const avgCompletion = totalCompletion / validAssignments;
          const finalCompletion = Math.min(100, Math.max(0, avgCompletion));
          return finalCompletion;
        }
      }
    }
  }
  
  // FALLBACK: Check task sheet fields
  const possibleFields = [
    '% Complete', '%_Complete', 'Percent Complete', 'Percent_Complete',
    'Progress', 'Complete', 'Completion', 
    'Progress%', '%Progress', 'Pct Complete', 'Pct_Complete',
    '% Work Complete', 'Work_Complete', 'Work%'
  ];
  
  for (const field of possibleFields) {
    if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
      const value = task[field];
      
      if (typeof value === 'number') {
        return Math.min(100, Math.max(0, value));
      }
      
      if (typeof value === 'string') {
        const cleaned = value.replace('%', '').trim();
        const parsed = parseFloat(cleaned);
        if (!isNaN(parsed)) {
          return Math.min(100, Math.max(0, parsed));
        }
      }
    }
  }
  
  return 0;
}, [assignments])

  // Calculate task status counts CORRECTLY
  const taskStatusCounts = useMemo(() => {
    if (!tasks || tasks.length === 0) return { completed: 0, inProgress: 0, notStarted: 0, overdue: 0 };
    
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let overdue = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter out header row
    const validTasks = tasks.filter(task => {
      const taskName = task.Name || task['Task Name'] || '';
      const taskId = task.ID || task.Id || '';
      
      // Skip header rows
      const isHeaderRow = (
        taskName === 'ID' || 
        taskName === 'Name' || 
        taskName === 'Task Name' ||
        taskId === 'ID' ||
        (typeof taskId === 'string' && taskId.trim().toUpperCase() === 'ID')
      );
      
      return !isHeaderRow;
    });

    validTasks.forEach(task => {
      const completion = getTaskCompletion(task);
      const endDateStr = task['Finish Date'] || task.Finish || task.End;
      let isOverdue = false;

      // Check if overdue
      if (endDateStr && completion < 100) {
        const endDate = new Date(endDateStr);
        if (endDate < today) {
          isOverdue = true;
          overdue++;
        }
      }

      if (completion >= 100) {
        completed++;
      } else if (completion > 0) {
        inProgress++;
      } else {
        notStarted++;
      }
    });
    
    return { completed, inProgress, notStarted, overdue, totalTasks: validTasks.length };
  }, [tasks, getTaskCompletion]);

  // COMPLETION DATA - Based on Assignment Sheet
 const completionData = useMemo(() => {
  if (!tasks || tasks.length === 0) {
    return [];
  }
    
    const buckets = [
      { range: '0%', min: 0, max: 0, count: 0, color: '#ef4444' },
      { range: '1-25%', min: 1, max: 25, count: 0, color: '#f97316' },
      { range: '26-50%', min: 26, max: 50, count: 0, color: '#eab308' },
      { range: '51-75%', min: 51, max: 75, count: 0, color: '#84cc16' },
      { range: '76-99%', min: 76, max: 99, count: 0, color: '#22c55e' },
      { range: '100%', min: 100, max: 100, count: 0, color: '#15803d' }
    ];
    
    // Filter out header row
    const validTasks = tasks.filter(task => {
      const taskName = task.Name || task['Task Name'] || '';
      const taskId = task.ID || task.Id || '';
      
      const isHeaderRow = (
        taskName === 'ID' || 
        taskName === 'Name' || 
        taskName === 'Task Name' ||
        taskId === 'ID' ||
        (typeof taskId === 'string' && taskId.trim().toUpperCase() === 'ID')
      );
      
      return !isHeaderRow;
    });

    validTasks.forEach((task) => {
      const completion = getTaskCompletion(task);
      
      for (const bucket of buckets) {
        if (completion >= bucket.min && completion <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    });
    
    return buckets.map(b => ({
      name: b.range,
      tasks: b.count,
      percentage: validTasks.length > 0 ? (b.count / validTasks.length) * 100 : 0,
      color: b.color
    }));
 }, [tasks, getTaskCompletion, assignments])

  // TIMELINE DATA - Project Timeline Analysis
  const timelineData = useMemo(() => {
    if (!tasks || tasks.length === 0) return []
    
    const timelineMap = {}
    
    tasks.forEach(task => {
      const startDateStr = task['Start Date'] || task.Start || task.Begin
      if (startDateStr) {
        try {
          const date = new Date(startDateStr)
          const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
          
          if (!timelineMap[monthKey]) {
            timelineMap[monthKey] = {
              month: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}`,
              tasksStarted: 0,
              tasksCompleted: 0,
              totalTasks: 0
            }
          }
          timelineMap[monthKey].tasksStarted++
          timelineMap[monthKey].totalTasks++
          
          const completion = getTaskCompletion(task);
          if (completion >= 100) {
            timelineMap[monthKey].tasksCompleted++
          }
        } catch (e) {
          console.error('Error parsing date:', startDateStr)
        }
      }
    })
    
    return Object.values(timelineMap).sort((a, b) => a.month.localeCompare(b.month))
  }, [tasks, getTaskCompletion])

  // STATUS DISTRIBUTION - FIXED
  const statusData = useMemo(() => {
    return [
      { name: 'Completed', value: taskStatusCounts.completed, color: '#22c55e' },
      { name: 'In Progress', value: inProgressFromAssignments || taskStatusCounts.inProgress, color: '#3b82f6' },
      { name: 'Not Started', value: taskStatusCounts.notStarted, color: '#6b7280' },
      { name: 'Overdue', value: taskStatusCounts.overdue, color: '#ef4444' }
    ].filter(item => item.value > 0)
  }, [taskStatusCounts, inProgressFromAssignments])

  // DURATION STATISTICS
  const durationStats = useMemo(() => {
    if (!tasks || tasks.length === 0) return null
    
    let totalDuration = 0
    let minDuration = Infinity
    let maxDuration = 0
    const durations = []
    
    // Filter out header row
    const validTasks = tasks.filter(task => {
      const taskName = task.Name || task['Task Name'] || '';
      const taskId = task.ID || task.Id || '';
      
      const isHeaderRow = (
        taskName === 'ID' || 
        taskName === 'Name' || 
        taskName === 'Task Name' ||
        taskId === 'ID' ||
        (typeof taskId === 'string' && taskId.trim().toUpperCase() === 'ID')
      );
      
      return !isHeaderRow;
    });

    validTasks.forEach(task => {
      const durationStr = task.Duration
      if (durationStr) {
        // Parse duration from various formats
        const durationMatch = durationStr.toString().match(/(\d+(\.\d+)?)\s*([dwmh]?)/i)
        if (durationMatch) {
          let duration = parseFloat(durationMatch[1])
          const unit = durationMatch[3]?.toLowerCase()
          
          // Convert to days
          switch(unit) {
            case 'h': duration = duration / 8; break // hours to days
            case 'w': duration = duration * 5; break // weeks to days
            case 'm': duration = duration * 20; break // months to days
            // 'd' or no unit = days
          }
          
          totalDuration += duration
          minDuration = Math.min(minDuration, duration)
          maxDuration = Math.max(maxDuration, duration)
          durations.push(duration)
        } else {
          // Try to parse as number
          const duration = parseFloat(durationStr)
          if (!isNaN(duration)) {
            totalDuration += duration
            minDuration = Math.min(minDuration, duration)
            maxDuration = Math.max(maxDuration, duration)
            durations.push(duration)
          }
        }
      }
    })
    
    const avgDuration = durations.length > 0 ? totalDuration / durations.length : 0
    
    const durationDistribution = [
      { range: '1-5 days', min: 1, max: 5, count: 0 },
      { range: '6-20 days', min: 6, max: 20, count: 0 },
      { range: '21-50 days', min: 21, max: 50, count: 0 },
      { range: '51+ days', min: 51, max: Infinity, count: 0 }
    ]
    
    durations.forEach(duration => {
      for (const bucket of durationDistribution) {
        if (duration >= bucket.min && duration <= bucket.max) {
          bucket.count++
          break
        }
      }
    })
    
    return {
      avgDuration: avgDuration.toFixed(1),
      minDuration: minDuration === Infinity ? 0 : minDuration,
      maxDuration,
      totalDuration,
      distribution: durationDistribution.filter(d => d.count > 0)
    }
  }, [tasks])

  // RECOMMENDATIONS
  const recommendations = useMemo(() => {
    const recs = []
    
    if (!taskStatusCounts.totalTasks) return recs
    
    const overallProgress = overallProgressFromAssignments || (taskStatusCounts.completed / taskStatusCounts.totalTasks) * 100
    
    // Progress-based recommendations
    if (overallProgress < 40) {
      recs.push({
        icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
        title: 'Accelerate Progress',
        description: `Project progress is below 40%. Consider reallocating resources to critical tasks.`,
        priority: 'high'
      })
    } else if (overallProgress < 70) {
      recs.push({
        icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
        title: 'Maintain Momentum',
        description: `Progress is moderate. Focus on completing in-progress tasks to build momentum.`,
        priority: 'medium'
      })
    } else {
      recs.push({
        icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
        title: 'Sustain Progress',
        description: 'Good progress rate. Continue current pace and focus on quality.',
        priority: 'low'
      })
    }
    
    // Overdue tasks recommendations
    if (taskStatusCounts.overdue > 0) {
      recs.push({
        icon: <Clock className="w-5 h-5 flex-shrink-0" />,
        title: 'Address Overdue Tasks',
        description: `${taskStatusCounts.overdue} tasks are overdue. Review and adjust deadlines.`,
        priority: taskStatusCounts.overdue > 5 ? 'high' : 'medium'
      })
    }
    
    // Resource allocation recommendations
    if (stats?.resourceStats) {
      const resourceCount = Object.keys(stats.resourceStats).length
      if (resourceCount > 0) {
        const avgTasksPerResource = taskStatusCounts.totalTasks / resourceCount
        
        if (avgTasksPerResource > 8) {
          recs.push({
            icon: <Users className="w-5 h-5 flex-shrink-0" />,
            title: 'Resource Allocation',
            description: `High workload per resource (${avgTasksPerResource.toFixed(1)} tasks avg). Consider redistributing work.`,
            priority: 'medium'
          })
        }
      }
    }
    
    // Project duration recommendations
    if (stats?.timelineStats && stats.timelineStats.totalDays > 180) {
      recs.push({
        icon: <Calendar className="w-5 h-5 flex-shrink-0" />,
        title: 'Long Project Duration',
        description: `Project spans ${stats.timelineStats.totalDays} days. Consider breaking into phases.`,
        priority: 'medium'
      })
    }
    
    // Tasks without assignments recommendations
    if (assignments && assignments.length > 0) {
      const tasksWithoutAssignments = tasks.filter(task => {
        const taskName = task.Name || task['Task Name'] || task.Task || '';
        const hasAssignment = assignments.some(assignment => {
          const assignmentTaskName = assignment['Task Name'] || assignment.Task || '';
          return assignmentTaskName.toString().trim() === taskName.toString().trim();
        });
        return !hasAssignment;
      }).length;
      
      if (tasksWithoutAssignments > 0) {
        recs.push({
          icon: <Users className="w-5 h-5 flex-shrink-0" />,
          title: 'Assign Resources',
          description: `${tasksWithoutAssignments} tasks don't have resource assignments. Assign team members to these tasks.`,
          priority: 'medium'
        });
      }
    }
    
    // Standard recommendations
    recs.push({
      icon: <Lightbulb className="w-5 h-5 flex-shrink-0" />,
      title: 'Weekly Reviews',
      description: 'Conduct weekly progress reviews to stay on track.',
      priority: 'low'
    })
    
    recs.push({
      icon: <Zap className="w-5 h-5 flex-shrink-0" />,
      title: 'Focus on Critical Path',
      description: 'Prioritize tasks on the critical path to avoid delays.',
      priority: 'medium'
    })
    
    // Sort by priority
    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [taskStatusCounts, tasks, assignments, overallProgressFromAssignments, stats])

  // PROGRESS TRENDS
  const progressTrends = useMemo(() => {
    if (!taskStatusCounts.totalTasks) return []
    
    const overallProgress = overallProgressFromAssignments || (taskStatusCounts.completed / taskStatusCounts.totalTasks) * 100
    
    return [
      {
        name: 'Overall Progress',
        value: overallProgress,
        target: 100,
        color: '#3b82f6',
        description: 'Project completion rate based on assignments'
      },
      {
        name: 'On-time Progress',
        value: ((taskStatusCounts.totalTasks - taskStatusCounts.overdue) / taskStatusCounts.totalTasks) * 100,
        target: 100,
        color: '#22c55e',
        description: 'Tasks completed on schedule'
      },
      {
        name: 'Started Tasks',
        value: ((taskStatusCounts.completed + taskStatusCounts.inProgress) / taskStatusCounts.totalTasks) * 100,
        target: 100,
        color: '#f59e0b',
        description: 'Tasks that have started'
      },
      {
        name: 'Completion Velocity',
        value: taskStatusCounts.inProgress > 0 ? (overallProgress / (stats?.timelineStats?.totalDays || 30)) * 100 : 0,
        target: 3,
        color: '#8b5cf6',
        description: 'Progress per time unit'
      }
    ]
  }, [taskStatusCounts, overallProgressFromAssignments, stats])

  // Loading state
  if (!taskStatusCounts.totalTasks || taskStatusCounts.totalTasks === 0) {
    return (
      <div className="text-center py-12">
        <BarChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
        <p className="text-gray-500">Upload a project file to see analysis.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Chart Type Navigation */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        <button 
          onClick={() => setChartType('completion')} 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'completion' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <TrendingUp className="inline-block w-4 h-4 mr-2" />
          Completion Analysis
        </button>
        <button 
          onClick={() => setChartType('timeline')} 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'timeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Calendar className="inline-block w-4 h-4 mr-2" />
          Timeline Analysis
        </button>
        <button 
          onClick={() => setChartType('status')} 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'status' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <PieChartIcon className="inline-block w-4 h-4 mr-2" />
          Status Distribution
        </button>
        <button 
          onClick={() => setChartType('trends')} 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${chartType === 'trends' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Lightbulb className="inline-block w-4 h-4 mr-2" />
          Project Trends
        </button>
      </div>

      {/* Key Metrics Cards - UPDATED FOR ASSIGNMENT SHEET DATA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">
              {overallProgressFromAssignments ? overallProgressFromAssignments.toFixed(1) : ((taskStatusCounts.completed / taskStatusCounts.totalTasks) * 100).toFixed(1)}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">Overall Progress</h3>
          <p className="text-sm text-gray-500">Based on assignment completion</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold">{taskStatusCounts.completed}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Completed Tasks</h3>
          <p className="text-sm text-gray-500">100% completion tasks</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold">
              {inProgressFromAssignments || taskStatusCounts.inProgress}
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">In Progress</h3>
          <p className="text-sm text-gray-500">Active tasks from assignments (1-99%)</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold">{taskStatusCounts.overdue}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Overdue</h3>
          <p className="text-sm text-gray-500">Tasks behind schedule</p>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-xl font-bold mb-6">
          {chartType === 'completion' && 'Task Completion Analysis (Based on Assignment Sheet)'}
          {chartType === 'timeline' && 'Project Timeline Analysis'}
          {chartType === 'status' && 'Task Status Distribution'}
          {chartType === 'trends' && 'Project Trends & Recommendations'}
        </h3>
        
        <div className="h-96">
          {/* COMPLETION ANALYSIS CHART */}
          {chartType === 'completion' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === 'tasks') {
                      const percentage = props.payload.percentage || 0;
                      return [`${value} tasks (${percentage.toFixed(1)}%)`, 'Count'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Completion Range: ${label}`}
                />
                <Legend />
                <Bar dataKey="tasks" name="Number of Tasks" radius={[4, 4, 0, 0]}>
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {/* TIMELINE ANALYSIS CHART */}
          {chartType === 'timeline' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="tasksStarted" 
                  name="Tasks Started" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="tasksCompleted" 
                  name="Tasks Completed" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          
          {/* STATUS DISTRIBUTION CHART - FIXED */}
          {chartType === 'status' && (
            <div className="flex flex-col lg:flex-row gap-8 items-center h-full">
              <div className="lg:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={statusData} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false} 
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                      outerRadius={150} 
                      fill="#8884d8" 
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="lg:w-1/2 space-y-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{item.value}</div>
                      <div className="text-sm text-gray-500">
                        {taskStatusCounts.totalTasks > 0 ? ((item.value / taskStatusCounts.totalTasks) * 100).toFixed(1) : 0}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* PROJECT TRENDS & RECOMMENDATIONS */}
          {chartType === 'trends' && (
            <div className="h-full overflow-y-auto">
              <div className="space-y-8">
                {/* Progress Trends Section */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progress Trends
                  </h4>
                  <div className="space-y-6">
                    {progressTrends.map((trend, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium text-gray-700">{trend.name}</span>
                            <p className="text-sm text-gray-500">{trend.description}</p>
                          </div>
                          <span className="font-bold">{trend.value.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${Math.min(100, trend.value)}%`, 
                              backgroundColor: trend.color 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Current: {trend.value.toFixed(1)}%</span>
                          <span>Target: {trend.target}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recommendations Section */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Recommendations
                  </h4>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border-l-4 ${
                          rec.priority === 'high' ? 'border-l-red-500 bg-red-50' : 
                          rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
                          'border-l-green-500 bg-green-50'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">{rec.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h5 className="font-semibold text-gray-800">{rec.title}</h5>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Project Health Summary */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-3">Project Health Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700">Overall Status:</p>
                      <p className="font-bold text-blue-800">
                        {overallProgressFromAssignments >= 70 ? 'Good' : overallProgressFromAssignments >= 40 ? 'Moderate' : 'Needs Attention'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Risk Level:</p>
                      <p className="font-bold text-blue-800">Low</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mt-3">
                    {overallProgressFromAssignments >= 70 
                      ? 'Project is progressing well. Focus on maintaining quality and monitoring progress.'
                      : overallProgressFromAssignments >= 40
                      ? 'Project requires attention to accelerate progress and meet deadlines.'
                      : 'Immediate action required to improve project progress and address critical tasks.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Section - FIXED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Duration Analysis */}
        <div className="bg-white rounded-xl shadow border p-6">
          <h3 className="text-lg font-bold mb-4">Duration Analysis</h3>
          {durationStats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-700">{durationStats.avgDuration}</div>
                  <div className="text-sm text-blue-600">Avg Days</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-700">{durationStats.minDuration}</div>
                  <div className="text-sm text-green-600">Min Days</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-700">{durationStats.maxDuration}</div>
                  <div className="text-sm text-red-600">Max Days</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Duration Distribution</h4>
                <div className="space-y-3">
                  {durationStats.distribution.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">{item.range}</span>
                        <span className="text-sm font-medium">{item.count} tasks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-purple-600" 
                          style={{ width: `${(item.count / taskStatusCounts.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No duration data available</p>
          )}
        </div>

        {/* Task Distribution - FIXED */}
        <div className="bg-white rounded-xl shadow border p-6">
          <h3 className="text-lg font-bold mb-4">Task Distribution</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-700">{taskStatusCounts.totalTasks}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
                <div className="text-xs text-gray-500 mt-1">
                  (Excluding header row)
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-700">
                  {taskStatusCounts.inProgress}
                </div>
                <div className="text-sm text-blue-600">Active Tasks</div>
                <div className="text-xs text-gray-500 mt-1">
                  (1-99% completion)
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Task Status Overview</h4>
              <div className="space-y-3">
                {[
                  { label: 'Completed', value: taskStatusCounts.completed, color: 'bg-green-500' },
                  { label: 'In Progress', value: taskStatusCounts.inProgress, color: 'bg-blue-500' },
                  { label: 'Not Started', value: taskStatusCounts.notStarted, color: 'bg-gray-400' },
                  { label: 'Overdue', value: taskStatusCounts.overdue, color: 'bg-red-500' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-medium">{item.value} tasks</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`} 
                        style={{ width: `${(item.value / taskStatusCounts.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">Completion Forecast</h4>
              <p className="text-sm text-gray-600">
                {taskStatusCounts.inProgress > 0 
                  ? `At current pace, project will complete in approximately ${Math.ceil((100 - (overallProgressFromAssignments || (taskStatusCounts.completed / taskStatusCounts.totalTasks) * 100)) / ((overallProgressFromAssignments || (taskStatusCounts.completed / taskStatusCounts.totalTasks) * 100) / (stats?.timelineStats?.totalDays || 30)))} days`
                  : 'Not enough progress data to calculate forecast'}
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Export Report Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Analysis Report</h3>
            <p className="text-gray-600">Export detailed project analysis</p>
          </div>
          <button
            onClick={() => {
              const report = {
                projectName: stats?.projectName || 'Project Analysis',
                date: new Date().toLocaleDateString(),
                summary: {
                  totalTasks: taskStatusCounts.totalTasks,
                  completed: taskStatusCounts.completed,
                  inProgress: inProgressFromAssignments || taskStatusCounts.inProgress,
                  notStarted: taskStatusCounts.notStarted,
                  overdue: taskStatusCounts.overdue,
                  avgCompletion: overallProgressFromAssignments || (taskStatusCounts.completed / taskStatusCounts.totalTasks) * 100,
                  projectDuration: stats?.timelineStats?.totalDays || 0
                },
                completionAnalysis: completionData,
                recommendations: recommendations.map(rec => ({
                  title: rec.title,
                  description: rec.description,
                  priority: rec.priority
                }))
              }
              
              const reportText = JSON.stringify(report, null, 2)
              const blob = new Blob([reportText], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `project-analysis-${new Date().toISOString().split('T')[0]}.json`
              link.click()
              URL.revokeObjectURL(url)
            }}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export Analysis Report
          </button>
        </div>
      </div>
    </div>
  )
}