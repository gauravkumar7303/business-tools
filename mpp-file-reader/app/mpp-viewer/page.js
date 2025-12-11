// 'use client'

// import { useState, useMemo, useEffect } from 'react'
// import { extractFromExcelOrCSV } from '@/src/lib/excelCsvExtractor'
// import { GanttChart } from '@/src/components/MPPViewer/GanttChart'
// import { ProjectAnalysis } from '@/src/components/MPPViewer/ProjectAnalysis'
// import Image from 'next/image';
// import { Calendar, BarChart3, Users, Clock, CheckCircle, AlertCircle, User, Target, Loader, AlertTriangle, Shield, Activity, TrendingUp, PieChart, FileText, Briefcase, Settings, Download, Filter, ChevronRight, ChevronDown } from 'lucide-react'

// // Helper function to parse dates
// const parseDate = (dateStr) => {
//   if (!dateStr) return null;

//   try {
//     // Handle dates like "November 3, 2025 8:00 AM"
//     if (typeof dateStr === 'string') {
//       // Try parsing full date string with month name
//       const monthNames = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//       ];

//       for (let i = 0; i < monthNames.length; i++) {
//         if (dateStr.includes(monthNames[i])) {
//           // Extract date parts
//           const parts = dateStr.split(', ');
//           if (parts.length >= 2) {
//             const monthDay = parts[0]; // "November 3"
//             const yearTime = parts[1]; // "2025 8:00 AM"

//             const month = monthNames.indexOf(monthNames[i]); // 0-11
//             const day = parseInt(monthDay.split(' ')[1]);
//             const year = parseInt(yearTime.split(' ')[0]);

//             if (!isNaN(day) && !isNaN(year)) {
//               return new Date(year, month, day);
//             }
//           }
//         }
//       }
//     }

//     // Try parsing as standard date
//     const date = new Date(dateStr);
//     if (!isNaN(date.getTime())) {
//       return date;
//     }

//     console.warn('Could not parse date:', dateStr);
//     return null;
//   } catch (e) {
//     console.error('Error parsing date:', dateStr, e);
//     return null;
//   }
// };

// // Helper function to parse duration strings
// const parseDuration = (durationStr) => {
//   if (!durationStr) return 0;

//   const str = String(durationStr).toLowerCase();
//   const match = str.match(/(\d+)\s*([dwmh]?)/);
//   if (match) {
//     const value = parseInt(match[1]);
//     const unit = match[2];

//     switch (unit) {
//       case 'h': return value / 8; // hours to days
//       case 'd': return value;
//       case 'w': return value * 5; // weeks to days (5 work days)
//       case 'm': return value * 20; // months to days (20 work days)
//       default: return value; // assume days
//     }
//   }

//   const num = parseFloat(str);
//   return isNaN(num) ? 0 : num;
// };

// // Helper function to render cell values based on column type
// const renderCellValue = (header, value) => {
//   if (value === undefined || value === null || value === '') {
//     return <span className="text-gray-400">-</span>;
//   }

//   // Handle percentage columns - FIXED
//   if (header.toLowerCase().includes('complete') ||
//     header.toLowerCase().includes('progress') ||
//     header.toLowerCase().includes('percent')) {
//     const percent = parseFloat(value);
//     if (!isNaN(percent)) {
//       // FIX: Ensure the progress bar shows correctly
//       const displayPercent = Math.min(100, Math.max(0, percent));
//       return (
//         <div className="flex items-center gap-2">
//           <div className="w-20 bg-gray-200 rounded-full h-2.5">
//             <div
//               className={`h-2.5 rounded-full transition-all duration-300 ${displayPercent >= 100 ? 'bg-green-600' :
//                 displayPercent >= 80 ? 'bg-green-500' :
//                   displayPercent >= 50 ? 'bg-yellow-500' :
//                     displayPercent > 0 ? 'bg-blue-500' :
//                       'bg-gray-400'
//                 }`}
//               style={{ width: `${displayPercent}%` }}
//             ></div>
//           </div>
//           <span className="text-sm font-medium min-w-[40px]">{displayPercent.toFixed(1)}%</span>
//         </div>
//       );
//     }
//   }

//   // Handle date columns
//   if (header.toLowerCase().includes('date') ||
//     header.toLowerCase().includes('start') ||
//     header.toLowerCase().includes('finish') ||
//     header.toLowerCase().includes('end') ||
//     header.toLowerCase().includes('begin')) {
//     const date = parseDate(value);
//     if (date) {
//       return date.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     }
//   }

//   // Handle duration
//   if (header.toLowerCase().includes('duration')) {
//     const duration = parseDuration(value);
//     if (duration > 0) {
//       // FIX: Better duration display
//       if (duration < 1) {
//         return `${(duration * 8).toFixed(1)} hours`;
//       } else if (duration >= 5 && duration < 20) {
//         return `${duration} work days`;
//       } else if (duration >= 20) {
//         const weeks = (duration / 5).toFixed(1);
//         return `${weeks} weeks (${duration} days)`;
//       }
//       return `${duration} days`;
//     }
//   }

//   // Handle work hours
//   if (header.toLowerCase().includes('work')) {
//     const hours = parseFloat(value);
//     if (!isNaN(hours)) {
//       if (hours >= 40) {
//         const days = (hours / 8).toFixed(1);
//         return `${hours}h (${days} days)`;
//       }
//       return `${hours}h`;
//     }
//   }

//   // Default: return as string
//   return String(value);
// };

// // Helper function to get task status
// const getTaskStatus = (task) => {
//   const completion = parseFloat(task['% Complete']) ||
//     parseFloat(task['% Work Complete']) ||
//     parseFloat(task.Progress) || 0;

//   let status = 'Not Started';
//   let statusColor = 'bg-gray-100 text-gray-800';

//   if (completion >= 100) {
//     status = 'Completed';
//     statusColor = 'bg-green-100 text-green-800';
//   } else if (completion > 0) {
//     status = 'In Progress';
//     statusColor = 'bg-blue-100 text-blue-800';
//   }

//   // Check if overdue
//   const endDateStr = task['Finish Date'] || task.Finish || task.End;
//   if (endDateStr) {
//     const endDate = parseDate(endDateStr);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (endDate && endDate < today && completion < 100) {
//       status = 'Overdue';
//       statusColor = 'bg-red-100 text-red-800';
//     }
//   }

//   return { status, statusColor };
// };

// // Helper function to get resource work status
// const getResourceWorkStatus = (resource) => {
//   const totalWork = resource['Total Work'] || 0;
//   const completedWork = resource['Completed Work'] || 0;
//   const remainingWork = resource['Remaining Work'] || 0;

//   if (remainingWork === 0 && totalWork > 0) {
//     return { status: 'Completed', color: 'bg-green-100 text-green-800' };
//   } else if (completedWork > 0) {
//     return { status: 'In Progress', color: 'bg-blue-100 text-blue-800' };
//   } else if (totalWork > 0) {
//     return { status: 'Not Started', color: 'bg-gray-100 text-gray-800' };
//   } else {
//     return { status: 'No Work', color: 'bg-gray-100 text-gray-800' };
//   }
// };

// // Helper function to check if task is a heading (Outline Level = 1)
// const isHeadingTask = (task) => {
//   const outlineLevel = parseInt(task['Outline Level'] || task['OutlineLevel'] || task['Outline Number'] || 0);
//   return outlineLevel === 1;
// };

// // Helper function to get Outline Level
// const getOutlineLevel = (task) => {
//   return parseInt(task['Outline Level'] || task['OutlineLevel'] || task['Outline Number'] || 0);
// };

// export default function Home() {
//   const [file, setFile] = useState(null)
//   const [content, setContent] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [activeTab, setActiveTab] = useState('tasks')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filterStatus, setFilterStatus] = useState('all')
//   const [expandedHeadings, setExpandedHeadings] = useState({})

//   // Load saved data from localStorage on component mount
//   useEffect(() => {
//     const savedData = localStorage.getItem('mppAnalyzerData');
//     if (savedData) {
//       try {
//         const parsedData = JSON.parse(savedData);
//         setContent(parsedData.content);
//         setFile(parsedData.file);
//         setActiveTab(parsedData.activeTab || 'tasks');

//         console.log('Loaded saved data from localStorage:', {
//           tasks: parsedData.content?.tasks?.length || 0,
//           fileName: parsedData.file?.name
//         });
//       } catch (err) {
//         console.error('Error loading saved data:', err);
//         localStorage.removeItem('mppAnalyzerData');
//       }
//     }
//   }, []);

//   // Save data to localStorage whenever content changes
//   useEffect(() => {
//     if (content && file) {
//       const dataToSave = {
//         content,
//         file: { name: file.name, size: file.size, type: file.type },
//         activeTab,
//         timestamp: new Date().toISOString()
//       };
//       localStorage.setItem('mppAnalyzerData', JSON.stringify(dataToSave));
//     }
//   }, [content, file, activeTab]);

//   // Clear saved data
//   const clearSavedData = () => {
//     localStorage.removeItem('mppAnalyzerData');
//     setContent(null);
//     setFile(null);
//     setError(null);
//     setSearchTerm('');
//     setFilterStatus('all');
//     setActiveTab('tasks');
//     setExpandedHeadings({});
//   };

//   const handleFileUpload = async (e) => {
//     const selectedFile = e.target.files[0]
//     if (!selectedFile) return

//     const validExtensions = ['.csv', '.xlsx', '.xls']
//     const fileExt = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'))

//     if (!validExtensions.includes(fileExt)) {
//       setError('Please select a .csv, .xlsx or .xls file exported from Microsoft Project')
//       return
//     }

//     setFile(selectedFile)
//     setLoading(true)
//     setContent(null)
//     setError(null)
//     setActiveTab('tasks')
//     setSearchTerm('')
//     setFilterStatus('all')
//     setExpandedHeadings({})

//     try {
//       console.log('Processing file:', selectedFile.name)

//       const extractedContent = await extractFromExcelOrCSV(selectedFile)
//       setContent(extractedContent)

//       console.log('Extraction completed:', {
//         tasks: extractedContent.tasks.length,
//         resources: extractedContent.resources.length,
//         assignments: extractedContent.assignments.length,
//         riskAnalysis: extractedContent.riskAnalysis
//       })

//       // Expand all headings by default
//       const headings = {};
//       extractedContent.tasks.forEach((task, index) => {
//         if (isHeadingTask(task)) {
//           headings[index] = true;
//         }
//       });
//       setExpandedHeadings(headings);

//     } catch (error) {
//       console.error('Error:', error)
//       setError(`Error processing file: ${error.message}`)
//       setContent(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Toggle heading expansion
//   const toggleHeading = (index) => {
//     setExpandedHeadings(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   // Calculate project statistics
//   const projectStats = useMemo(() => {
//     if (!content || !content.tasks.length) return null;

//     const stats = {
//       totalTasks: content.tasks.length,
//       totalResources: content.resources.length,
//       totalAssignments: content.assignments.length,
//       completedTasks: 0,
//       inProgressTasks: 0,
//       notStartedTasks: 0,
//       overdueTasks: 0,
//       totalDuration: 0,
//       avgCompletion: 0,
//       timelineStats: {
//         earliestStart: null,
//         latestEnd: null,
//         totalDays: 0
//       },
//       riskStats: content.riskAnalysis?.statistics || {
//         total: 0,
//         high: 0,
//         medium: 0,
//         low: 0
//       },
//       workStats: {
//         totalWork: 0,
//         completedWork: 0,
//         remainingWork: 0
//       },
//       headingStats: {
//         totalHeadings: 0,
//         totalDetailTasks: 0
//       }
//     };

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Process tasks
//     content.tasks.forEach(task => {
//       // Count headings
//       if (isHeadingTask(task)) {
//         stats.headingStats.totalHeadings++;
//       } else {
//         stats.headingStats.totalDetailTasks++;
//       }

//       const completion = parseFloat(task['% Complete']) ||
//         parseFloat(task['% Work Complete']) ||
//         parseFloat(task.Progress) || 0;

//       if (completion >= 100) {
//         stats.completedTasks++;
//       } else if (completion > 0) {
//         stats.inProgressTasks++;
//       } else {
//         stats.notStartedTasks++;
//       }

//       // Check for overdue
//       const endDateStr = task['Finish Date'] || task.Finish || task.End;
//       if (endDateStr) {
//         const endDate = parseDate(endDateStr);
//         if (endDate && endDate < today && completion < 100) {
//           stats.overdueTasks++;
//         }
//       }

//       // Duration
//       const duration = parseDuration(task.Duration);
//       if (duration > 0) {
//         stats.totalDuration += duration;
//       }

//       // Work hours
//       const totalWork = parseFloat(task['Total Work']) || 0;
//       const completedWork = parseFloat(task['Completed Work']) || 0;
//       stats.workStats.totalWork += totalWork;
//       stats.workStats.completedWork += completedWork;
//       stats.workStats.remainingWork += (totalWork - completedWork);

//       // Timeline
//       const startDate = parseDate(task['Start Date'] || task.Start || task.Begin);
//       const finishDate = parseDate(task['Finish Date'] || task.Finish || task.End);

//       if (startDate) {
//         if (!stats.timelineStats.earliestStart || startDate < stats.timelineStats.earliestStart) {
//           stats.timelineStats.earliestStart = startDate;
//         }
//       }

//       if (finishDate) {
//         if (!stats.timelineStats.latestEnd || finishDate > stats.timelineStats.latestEnd) {
//           stats.timelineStats.latestEnd = finishDate;
//         }
//       }
//     });

//     // Calculate project duration in days
//     if (stats.timelineStats.earliestStart && stats.timelineStats.latestEnd) {
//       const diffTime = Math.abs(stats.timelineStats.latestEnd - stats.timelineStats.earliestStart);
//       stats.timelineStats.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     }

//     // Average completion (excluding headings)
//     stats.avgCompletion = stats.headingStats.totalDetailTasks > 0
//       ? (stats.completedTasks / stats.headingStats.totalDetailTasks) * 100
//       : 0;

//     return stats;
//   }, [content]);

//   // Organize tasks by hierarchy for display
//   const organizedTasks = useMemo(() => {
//     if (!content?.tasks) return [];

//     const tasks = content.tasks;
//     const organized = [];
//     let currentOutlineLevel = 0;
//     let currentHeadingIndex = -1;
//     let headingStack = [];

//     tasks.forEach((task, index) => {
//       const outlineLevel = getOutlineLevel(task);
//       const isHeading = isHeadingTask(task);

//       if (isHeading) {
//         // Add as heading
//         organized.push({
//           ...task,
//           isHeading: true,
//           originalIndex: index,
//           level: outlineLevel,
//           children: []
//         });
//         currentHeadingIndex = organized.length - 1;
//         headingStack = [currentHeadingIndex];
//         currentOutlineLevel = outlineLevel;
//       } else if (currentHeadingIndex >= 0 && outlineLevel > currentOutlineLevel) {
//         // Add as child of current heading
//         if (organized[currentHeadingIndex]) {
//           organized[currentHeadingIndex].children.push({
//             ...task,
//             isHeading: false,
//             originalIndex: index,
//             level: outlineLevel,
//             parentIndex: currentHeadingIndex
//           });
//         } else {
//           // No parent heading found, add as regular task
//           organized.push({
//             ...task,
//             isHeading: false,
//             originalIndex: index,
//             level: outlineLevel
//           });
//         }
//       } else {
//         // Add as regular task
//         organized.push({
//           ...task,
//           isHeading: false,
//           originalIndex: index,
//           level: outlineLevel
//         });
//         currentHeadingIndex = -1;
//         headingStack = [];
//         currentOutlineLevel = 0;
//       }
//     });

//     return organized;
//   }, [content]);

//   // Filtered tasks with hierarchy
//   const filteredTasks = useMemo(() => {
//     if (!organizedTasks.length) return [];

//     let filtered = organizedTasks;

//     // Search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(task => {
//         const matches = (task.Name || task['Task Name'] || '').toLowerCase().includes(term) ||
//           (task.Description || '').toLowerCase().includes(term);

//         // If heading matches, show all its children
//         if (matches && task.isHeading) {
//           return true;
//         }

//         // If child matches, show its parent heading
//         if (matches && !task.isHeading && task.parentIndex !== undefined) {
//           return true;
//         }

//         return matches;
//       });
//     }

//     // Status filter (for non-heading tasks)
//     if (filterStatus !== 'all') {
//       filtered = filtered.filter(task => {
//         if (task.isHeading) {
//           // Always show headings when filtering
//           return true;
//         }
//         const { status } = getTaskStatus(task);
//         return status.toLowerCase() === filterStatus.toLowerCase().replace(' ', '');
//       });
//     }

//     return filtered;
//   }, [organizedTasks, searchTerm, filterStatus]);

//   // Check if a heading should be visible based on its children
//   const isHeadingVisible = (heading, filteredTasks) => {
//     // Heading is always visible if it matches search
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       const headingMatches = (heading.Name || heading['Task Name'] || '').toLowerCase().includes(term) ||
//         (heading.Description || '').toLowerCase().includes(term);

//       if (headingMatches) return true;

//       // Check if any child matches
//       if (heading.children) {
//         const childMatches = heading.children.some(child => {
//           const childMatchesSearch = (child.Name || child['Task Name'] || '').toLowerCase().includes(term) ||
//             (child.Description || '').toLowerCase().includes(term);

//           if (filterStatus !== 'all') {
//             const { status } = getTaskStatus(child);
//             return childMatchesSearch && status.toLowerCase() === filterStatus.toLowerCase().replace(' ', '');
//           }
//           return childMatchesSearch;
//         });

//         return childMatches;
//       }
//     }

//     return true;
//   };

//   // Filtered resources
//   const filteredResources = useMemo(() => {
//     if (!content?.resources) return [];

//     let filtered = content.resources;

//     // Search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(resource =>
//         (resource.Name || resource['Resource Name'] || '').toLowerCase().includes(term)
//       );
//     }

//     return filtered;
//   }, [content, searchTerm]);

//   // Filtered assignments
//   const filteredAssignments = useMemo(() => {
//     if (!content?.assignments) return [];

//     let filtered = content.assignments;

//     // Search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(assignment =>
//         (assignment['Task Name'] || '').toLowerCase().includes(term) ||
//         (assignment['Resource Name'] || '').toLowerCase().includes(term)
//       );
//     }

//     return filtered;
//   }, [content, searchTerm]);

//   // Prepare data for Gantt chart
//   const ganttData = useMemo(() => {
//     if (!content || !content.tasks.length) return [];

//     return content.tasks
//       .filter(task => {
//         // Use Start_Date and Finish_Date (from your Excel)
//         const startDate = parseDate(task['Start Date'] || task['Start_Date'] || task.Start);
//         const endDate = parseDate(task['Finish Date'] || task['Finish_Date'] || task.Finish);
//         return startDate && endDate;
//       })
//       .map((task, index) => {
//         const startDate = parseDate(task['Start Date'] || task['Start_Date'] || task.Start);
//         const endDate = parseDate(task['Finish Date'] || task['Finish_Date'] || task.Finish);

//         // Get completion from assignment sheet or task sheet
//         let completion = 0;

//         // First check assignments
//         if (content.assignments && content.assignments.length > 0) {
//           const taskAssignments = content.assignments.filter(assignment =>
//             assignment['Task Name'] === task.Name
//           );
//           if (taskAssignments.length > 0) {
//             completion = parseFloat(taskAssignments[0]['Percent Work Complete'] || 0);
//           }
//         }

//         // Fallback to task sheet
//         if (completion === 0) {
//           completion = parseFloat(task['% Complete'] || 0);
//         }

//         const { status } = getTaskStatus(task);

//         return {
//           id: task.ID || task.Id || index + 1,
//           name: task.Name || task['Task Name'] || `Task ${index + 1}`,
//           start: startDate,
//           end: endDate,
//           completion,
//           status,
//           duration: task.Duration || '',
//           resources: task['Resource Names'] || task.Resources || '',
//           dependencies: task.Predecessors || '',
//           isHeading: task.outlineLevel === 1,
//           outlineLevel: task.outlineLevel || 0
//         };
//       })
//       .sort((a, b) => a.start - b.start);
//   }, [content]);
//   // Risk analysis data
//   const riskAnalysis = useMemo(() => {
//     if (!content?.riskAnalysis) return null;

//     return content.riskAnalysis;
//   }, [content]);

//   // Render Task List with hierarchy
//   const renderTaskList = () => {
//     if (!content?.tasks.length) {
//       return (
//         <div className="text-center py-12">
//           <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
//           <p className="text-gray-500">The uploaded file doesn't contain task data.</p>
//         </div>
//       );
//     }
//     // Helper function to check if a task should be displayed based on search and filters
//     const shouldDisplayTask = (task, isHeading = false) => {
//       // Always show headings when there's no search term
//       if (isHeading && !searchTerm && filterStatus === 'all') return true;

//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         const matches = (task.Name || task['Task Name'] || '').toLowerCase().includes(term) ||
//           (task.Description || '').toLowerCase().includes(term);

//         if (matches) return true;
//       }

//       if (filterStatus !== 'all' && !isHeading) {
//         const { status } = getTaskStatus(task);
//         return status.toLowerCase() === filterStatus.toLowerCase().replace(' ', '');
//       }

//       return !isHeading; // Show non-heading tasks by default
//     };
//     // Organize tasks into hierarchy
//     const getHierarchicalTasks = () => {
//       const tasks = content.tasks;
//       const result = [];

//       for (let i = 0; i < tasks.length; i++) {
//         const task = tasks[i];
//         const outlineLevel = getOutlineLevel(task);
//         const isHeading = outlineLevel === 1;

//         const shouldDisplay = shouldDisplayTask(task, isHeading);

//         if (shouldDisplay) {
//           result.push({
//             ...task,
//             isHeading,
//             originalIndex: i,
//             outlineLevel,
//             display: true
//           });
//         }
//       }

//       return result;
//     };

//     const displayTasks = getHierarchicalTasks();


//     // Helper function to render a single task row
//     const renderTaskRow = (task, index) => {
//       const { status, statusColor } = getTaskStatus(task);
//       const isHeading = task.isHeading;
//       const taskId = task.ID || task.Id || task.originalIndex + 1;
//       const taskName = task.Name || task['Task Name'] || `Task ${task.originalIndex + 1}`;

//       // Calculate completion for display
//       const completion = parseFloat(task['% Complete']) ||
//         parseFloat(task['% Work Complete']) ||
//         parseFloat(task.Progress) || 0;

//       return (
//         <tr key={`task-${index}`} className={`hover:bg-gray-50 ${isHeading ? 'bg-blue-50' : ''}`}>
//           <td className="p-4">
//             <div className="flex items-center">
//               {isHeading && (
//                 <button
//                   onClick={() => toggleHeading(task.originalIndex)}
//                   className="text-gray-500 hover:text-gray-700 mr-2"
//                 >
//                   {expandedHeadings[task.originalIndex] ? (
//                     <ChevronDown className="w-4 h-4" />
//                   ) : (
//                     <ChevronRight className="w-4 h-4" />
//                   )}
//                 </button>
//               )}
//               <span className={`px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded font-mono ${isHeading ? 'font-bold' : ''}`}>
//                 {taskId}
//               </span>
//             </div>
//           </td>
//           <td className="p-4">
//             <div
//               className={`${isHeading ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}
//               style={{
//                 paddingLeft: isHeading ? '0' : `${(getOutlineLevel(task) - 1) * 20}px`
//               }}
//             >
//               {isHeading ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg">📂</span>
//                   <span>{taskName}</span>
//                 </div>
//               ) : (
//                 taskName
//               )}
//               {isHeading && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   Outline Level: {getOutlineLevel(task)}
//                 </div>
//               )}
//             </div>
//           </td>
//           <td className="p-4 text-gray-700">
//             {renderCellValue('Start Date', task['Start Date'] || task.Start)}
//           </td>
//           <td className="p-4 text-gray-700">
//             {renderCellValue('Finish Date', task['Finish Date'] || task.Finish)}
//           </td>
//           <td className="p-4 text-gray-700">
//             {renderCellValue('Duration', task.Duration)}
//           </td>
//           <td className="p-4">
//             <span className={`px-3 py-1 text-xs font-medium rounded-full ${isHeading ? 'bg-purple-100 text-purple-800' : statusColor}`}>
//               {isHeading ? 'Heading' : status}
//             </span>
//           </td>
//           <td className="p-4">
//             {isHeading ? (
//               <div className="text-gray-400 text-sm">-</div>
//             ) : (
//               renderCellValue('% Complete', task['% Complete'] || task['% Work Complete'])
//             )}
//           </td>
//         </tr>
//       );
//     };

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">📋 Task List with Hierarchy</h3>
//             <p className="text-gray-600">
//               {displayTasks.length} of {content.tasks.length} tasks visible
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search tasks..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//             </div>
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Status</option>
//               <option value="Not Started">Not Started</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//               <option value="Overdue">Overdue</option>
//             </select>
//           </div>
//         </div>

//         <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
//           <div className="flex items-center gap-2">
//             <span className="text-blue-600 font-medium">📌 Headings</span>
//             <span className="text-sm text-blue-600">are shown in <strong>bold</strong> with purple background</span>
//           </div>
//           <div className="mt-2 text-sm text-blue-600">
//             • Outline Level 1 tasks are considered as headings<br />
//             • Click on the arrow to expand/collapse heading details
//           </div>
//         </div>

//         <div className="overflow-x-auto border rounded-lg">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-4 text-left font-semibold text-gray-700">ID</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Task Name</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Start Date</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Finish Date</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Duration</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Status</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">% Complete</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {displayTasks.map((task, index) => renderTaskRow(task, index))}
//             </tbody>
//           </table>
//         </div>

//         {displayTasks.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No tasks found matching your search criteria.
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render Resource List
//   const renderResourceList = () => {
//     if (!content?.resources.length) {
//       return (
//         <div className="text-center py-12">
//           <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
//           <p className="text-gray-500">The uploaded file doesn't contain resource data.</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">👥 Resource List</h3>
//             <p className="text-gray-600">
//               {filteredResources.length} resources
//             </p>
//           </div>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search resources..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//           </div>
//         </div>

//         <div className="overflow-x-auto border rounded-lg">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-4 text-left font-semibold text-gray-700">ID</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Name</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Type</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Work Status</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Total Work</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Completed</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Remaining</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">% Complete</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredResources.map((resource, index) => {
//                 const { status, color } = getResourceWorkStatus(resource);
//                 const totalWork = resource['Total Work'] || 0;
//                 const completedWork = resource['Completed Work'] || 0;
//                 const remainingWork = resource['Remaining Work'] || 0;
//                 const percentComplete = totalWork > 0 ? (completedWork / totalWork) * 100 : 0;

//                 return (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="p-4">
//                       <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded font-mono">
//                         {resource.ID || resource.Id || index + 1}
//                       </span>
//                     </td>
//                     <td className="p-4 font-medium text-gray-800">
//                       {resource.Name || resource['Resource Name'] || `Resource ${index + 1}`}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {resource.Type || 'Work'}
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
//                         {status}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {totalWork ? `${totalWork.toFixed(1)}h` : '-'}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {completedWork ? `${completedWork.toFixed(1)}h` : '-'}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {remainingWork ? `${remainingWork.toFixed(1)}h` : '-'}
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <div className="w-16 bg-gray-200 rounded-full h-2">
//                           <div
//                             className={`h-2 rounded-full ${percentComplete >= 80 ? 'bg-green-600' :
//                               percentComplete >= 50 ? 'bg-yellow-600' :
//                                 'bg-red-600'
//                               }`}
//                             style={{ width: `${Math.min(100, percentComplete)}%` }}
//                           ></div>
//                         </div>
//                         <span className="text-sm font-medium">{percentComplete.toFixed(1)}%</span>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {filteredResources.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No resources found matching your search criteria.
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render Assignment List
//   const renderAssignmentList = () => {
//     if (!content?.assignments.length) {
//       return (
//         <div className="text-center py-12">
//           <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
//           <p className="text-gray-500">The uploaded file doesn't contain assignment data.</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">🔗 Assignment List</h3>
//             <p className="text-gray-600">
//               {filteredAssignments.length} assignments
//             </p>
//           </div>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search assignments..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//           </div>
//         </div>

//         <div className="overflow-x-auto border rounded-lg">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-4 text-left font-semibold text-gray-700">Task Name</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Resource Name</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">% Work Complete</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Work (Hours)</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Units</th>
//                 <th className="p-4 text-left font-semibold text-gray-700">Remaining Work</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredAssignments.map((assignment, index) => {
//                 const taskName = assignment['Task Name'] || assignment.Task || 'Unnamed Task';
//                 const resourceName = assignment['Resource Name'] || assignment.Resource || 'Unnamed Resource';
//                 const percentComplete = parseFloat(assignment['% Work Complete']) || 0;
//                 const work = parseFloat(assignment.Work) || 0;
//                 const units = assignment.Units || '100%';
//                 const remainingWork = work * (100 - percentComplete) / 100;

//                 return (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="p-4 font-medium text-gray-800">
//                       {taskName}
//                     </td>
//                     <td className="p-4 font-medium text-gray-700">
//                       {resourceName}
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <div className="w-16 bg-gray-200 rounded-full h-2">
//                           <div
//                             className={`h-2 rounded-full ${percentComplete >= 80 ? 'bg-green-600' :
//                               percentComplete >= 50 ? 'bg-yellow-600' :
//                                 'bg-red-600'
//                               }`}
//                             style={{ width: `${Math.min(100, percentComplete)}%` }}
//                           ></div>
//                         </div>
//                         <span className="text-sm font-medium">{percentComplete}%</span>
//                       </div>
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {work ? `${work}h` : '-'}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {units}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {remainingWork > 0 ? `${remainingWork.toFixed(1)}h` : '-'}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {filteredAssignments.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No assignments found matching your search criteria.
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render Risk Analysis
//   const renderRiskAnalysis = () => {
//     if (!riskAnalysis) {
//   return (
//     <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
//       <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//       <h3 className="text-xl font-bold text-gray-800 mb-3">No Risk Analysis Available</h3>
//       <p className="text-gray-600 mb-6">Risk analysis could not be generated from the uploaded file.</p>
//       <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
//         <span className="text-sm">Try re-uploading your project file</span>
//       </div>
//     </div>
//   );
// }
// if (riskAnalysis.risks.length === 0) {
//   return (
//     <div className="space-y-8">
//       <div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">✅ Risk Analysis</h3>
//         <p className="text-gray-600">
//           No potential risks detected in the project
//         </p>
//       </div>

//       {/* Positive Status Card */}
//       <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-green-100 rounded-lg">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//           </div>
//           <div>
//             <h4 className="text-lg font-bold text-green-800">Project Health: Excellent</h4>
//             <p className="text-green-700">No major risks identified. Your project is on track.</p>
//           </div>
//         </div>
        
//         {/* Health Indicators */}
//         <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? projectStats.avgCompletion.toFixed(0) + '%' : 'N/A'}
//             </div>
//             <div className="text-sm text-gray-600">Progress Rate</div>
//           </div>
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? projectStats.overdueTasks : '0'}
//             </div>
//             <div className="text-sm text-gray-600">Overdue Tasks</div>
//           </div>
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? projectStats.completedTasks : '0'}
//             </div>
//             <div className="text-sm text-gray-600">Completed</div>
//           </div>
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? 'Good' : 'N/A'}
//             </div>
//             <div className="text-sm text-gray-600">Overall Status</div>
//           </div>
//         </div>
//       </div>
      
//       {/* Prevention Tips */}
//       <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
//         <h4 className="font-bold text-blue-800 mb-3">💡 Tips to Maintain Low Risk</h4>
//         <ul className="space-y-2 text-blue-700">
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Continue regular progress monitoring and weekly reviews</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Ensure all tasks have assigned resources</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Maintain buffer time for critical path tasks</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Document lessons learned for future projects</span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

//     return (
//       <div className="space-y-8">
//         <div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">⚠️ Risk Analysis</h3>
//           <p className="text-gray-600">
//             Identified {riskAnalysis.statistics.total} potential risks in the project
//           </p>
//         </div>

//         {/* Risk Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-red-100 rounded-lg">
//                 <AlertCircle className="w-6 h-6 text-red-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.high}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">High Risks</h3>
//             <p className="text-sm text-gray-500">Require immediate attention</p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-yellow-100 rounded-lg">
//                 <AlertTriangle className="w-6 h-6 text-yellow-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.medium}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">Medium Risks</h3>
//             <p className="text-sm text-gray-500">Monitor closely</p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <AlertTriangle className="w-6 h-6 text-blue-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.low}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">Low Risks</h3>
//             <p className="text-sm text-gray-500">Regular monitoring</p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-gray-100 rounded-lg">
//                 <Shield className="w-6 h-6 text-gray-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.total}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">Total Risks</h3>
//             <p className="text-sm text-gray-500">All identified risks</p>
//           </div>
//         </div>

//         {/* Risk Details */}
//         <div className="bg-white rounded-xl shadow">
//           <div className="p-6 border-b">
//             <h4 className="text-lg font-bold text-gray-800">📋 Risk Details</h4>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="p-4 text-left font-semibold text-gray-700">Risk Level</th>
//                   <th className="p-4 text-left font-semibold text-gray-700">Type</th>
//                   <th className="p-4 text-left font-semibold text-gray-700">Task/Resource</th>
//                   <th className="p-4 text-left font-semibold text-gray-700">Description</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {riskAnalysis.risks.map((risk, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="p-4">
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${risk.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
//                         risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-blue-100 text-blue-800'
//                         }`}>
//                         {risk.riskLevel}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-700">{risk.riskType}</td>
//                     <td className="p-4">
//                       <div className="font-medium">
//                         {risk.taskName || risk.resourceName}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {risk.taskId ? `Task ID: ${risk.taskId}` : `Resource: ${risk.resourceName}`}
//                       </div>
//                     </td>
//                     <td className="p-4 text-gray-700">{risk.description}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recommendations */}
//         {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
//           <div className="bg-white rounded-xl shadow p-6">
//             <h4 className="text-lg font-bold text-gray-800 mb-4">💡 Recommendations</h4>
//             <div className="space-y-4">
//               {riskAnalysis.recommendations.map((rec, index) => (
//                 <div key={index} className={`p-4 rounded-lg border-l-4 ${rec.priority === 'High' ? 'border-l-red-500 bg-red-50' :
//                   rec.priority === 'Medium' ? 'border-l-yellow-500 bg-yellow-50' :
//                     'border-l-blue-500 bg-blue-50'
//                   }`}>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h5 className="font-semibold text-gray-800">{rec.type} Risk</h5>
//                       <p className="text-gray-600 mt-1">{rec.description}</p>
//                     </div>
//                     <span className={`px-3 py-1 text-xs font-medium rounded-full ${rec.priority === 'High' ? 'bg-red-100 text-red-800' :
//                       rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-blue-100 text-blue-800'
//                       }`}>
//                       {rec.priority} Priority
//                     </span>
//                   </div>
//                   <div className="mt-3 text-sm">
//                     <span className="font-medium">Action: </span>
//                     <span className="text-gray-700">{rec.action}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render Duration Count
//   const renderDurationCount = () => {
//     if (!projectStats || !content) return null;

//     return (
//       <div className="space-y-6">
//         <div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">⏱️ Duration Analysis & Actual vs Planned</h3>
//           <p className="text-gray-600">Task duration statistics and schedule variance</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Duration Analysis */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h4 className="font-bold text-gray-700 mb-4">Duration Analysis</h4>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Total Tasks with Duration:</span>
//                 <span className="font-medium">
//                   {content.tasks.filter(t => t.Duration && parseDuration(t.Duration) > 0).length}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Average Task Duration:</span>
//                 <span className="font-medium">
//                   {(() => {
//                     const durations = content.tasks
//                       .map(t => parseDuration(t.Duration || 0))
//                       .filter(d => d > 0);
//                     return durations.length > 0
//                       ? (durations.reduce((a, b) => a + b) / durations.length).toFixed(1)
//                       : '0';
//                   })()} days
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Shortest Task:</span>
//                 <span className="font-medium">
//                   {(() => {
//                     const durations = content.tasks
//                       .map(t => parseDuration(t.Duration || 0))
//                       .filter(d => d > 0);
//                     return durations.length > 0
//                       ? Math.min(...durations) + ' days'
//                       : 'N/A';
//                   })()}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Longest Task:</span>
//                 <span className="font-medium">
//                   {(() => {
//                     const durations = content.tasks
//                       .map(t => parseDuration(t.Duration || 0))
//                       .filter(d => d > 0);
//                     return durations.length > 0
//                       ? Math.max(...durations) + ' days'
//                       : 'N/A';
//                   })()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Actual vs Planned Comparison */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h4 className="font-bold text-gray-700 mb-4">Actual vs Planned</h4>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Tasks Started on Time:</span>
//                 <span className="font-medium text-green-600">
//                   {(() => {
//                     const onTime = content.tasks.filter(task => {
//                       const plannedStart = parseDate(task['Start Date'] || task.Start);
//                       const actualStart = parseDate(task['Actual Start']);
//                       if (!plannedStart || !actualStart) return false;
//                       return actualStart <= plannedStart;
//                     }).length;
//                     const total = content.tasks.filter(t => t['Actual Start']).length;
//                     return total > 0 ? `${onTime}/${total} (${((onTime / total) * 100).toFixed(1)}%)` : 'N/A';
//                   })()}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Tasks Finished on Time:</span>
//                 <span className="font-medium text-green-600">
//                   {(() => {
//                     const onTime = content.tasks.filter(task => {
//                       const plannedFinish = parseDate(task['Finish Date'] || task.Finish);
//                       const actualFinish = parseDate(task['Actual Finish']);
//                       if (!plannedFinish || !actualFinish) return false;
//                       return actualFinish <= plannedFinish;
//                     }).length;
//                     const total = content.tasks.filter(t => t['Actual Finish']).length;
//                     return total > 0 ? `${onTime}/${total} (${((onTime / total) * 100).toFixed(1)}%)` : 'N/A';
//                   })()}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Average Delay (Start):</span>
//                 <span className="font-medium text-red-600">
//                   {(() => {
//                     const delays = content.tasks
//                       .filter(task => task['Actual Start'] && task['Start Date'])
//                       .map(task => {
//                         const planned = parseDate(task['Start Date'] || task.Start);
//                         const actual = parseDate(task['Actual Start']);
//                         if (!planned || !actual) return 0;
//                         return Math.max(0, (actual - planned) / (1000 * 60 * 60 * 24));
//                       })
//                       .filter(d => d > 0);

//                     return delays.length > 0
//                       ? delays.reduce((a, b) => a + b) / delays.length + ' days'
//                       : '0 days';
//                   })()}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Average Delay (Finish):</span>
//                 <span className="font-medium text-red-600">
//                   {(() => {
//                     const delays = content.tasks
//                       .filter(task => task['Actual Finish'] && task['Finish Date'])
//                       .map(task => {
//                         const planned = parseDate(task['Finish Date'] || task.Finish);
//                         const actual = parseDate(task['Actual Finish']);
//                         if (!planned || !actual) return 0;
//                         return Math.max(0, (actual - planned) / (1000 * 60 * 60 * 24));
//                       })
//                       .filter(d => d > 0);

//                     return delays.length > 0
//                       ? delays.reduce((a, b) => a + b) / delays.length + ' days'
//                       : '0 days';
//                   })()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Task Duration Distribution Chart */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h4 className="font-bold text-gray-700 mb-4">Task Duration Distribution</h4>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {[
//               { label: 'Short (≤ 5 days)', min: 0, max: 5, color: 'bg-blue-50', textColor: 'text-blue-600' },
//               { label: 'Medium (6-20 days)', min: 6, max: 20, color: 'bg-green-50', textColor: 'text-green-600' },
//               { label: 'Long (21-50 days)', min: 21, max: 50, color: 'bg-yellow-50', textColor: 'text-yellow-600' },
//               { label: 'Very Long (> 50 days)', min: 51, max: Infinity, color: 'bg-red-50', textColor: 'text-red-600' }
//             ].map((category, index) => {
//               const count = content.tasks.filter(t => {
//                 const duration = parseDuration(t.Duration || 0);
//                 return duration >= category.min && duration <= category.max;
//               }).length;

//               return (
//                 <div key={index} className={`text-center p-4 ${category.color} rounded-lg`}>
//                   <div className={`text-2xl font-bold ${category.textColor}`}>
//                     {count}
//                   </div>
//                   <div className={`text-sm ${category.textColor} mt-2`}>
//                     {category.label}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {content.tasks.length > 0 ? ((count / content.tasks.length) * 100).toFixed(1) : 0}%
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Main render function
//   const renderContent = () => {
//     if (!content) return null;

//     return (
//       <div className="space-y-8">
//         {/* Clear Data Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={clearSavedData}
//             className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium flex items-center gap-2 transition-colors"
//           >
//             <span>🗑️ Clear Current Data</span>
//           </button>
//         </div>

//         {/* Project Overview Cards */}
//         {projectStats && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             <div className="bg-white rounded-xl shadow p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <FileText className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <span className="text-xl font-bold text-gray-800">{projectStats.totalTasks}</span>
//               </div>
//               <h3 className="text-sm font-semibold text-gray-700 mt-2">Total Tasks</h3>
//               <p className="text-xs text-gray-500 mt-1">
//                 {projectStats.headingStats.totalHeadings} headings
//               </p>
//             </div>

//             <div className="bg-white rounded-xl shadow p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <Users className="w-5 h-5 text-green-600" />
//                 </div>
//                 <span className="text-xl font-bold text-gray-800">{projectStats.totalResources}</span>
//               </div>
//               <h3 className="text-sm font-semibold text-gray-700 mt-2">Resources</h3>
//             </div>

//             <div className="bg-white rounded-xl shadow p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <Briefcase className="w-5 h-5 text-purple-600" />
//                 </div>
//                 <span className="text-xl font-bold text-gray-800">{projectStats.totalAssignments}</span>
//               </div>
//               <h3 className="text-sm font-semibold text-gray-700 mt-2">Assignments</h3>
//             </div>

//             <div className="bg-white rounded-xl shadow p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <AlertCircle className="w-5 h-5 text-red-600" />
//                 </div>
//                 <span className="text-xl font-bold text-gray-800">{projectStats.overdueTasks}</span>
//               </div>
//               <h3 className="text-sm font-semibold text-gray-700 mt-2">Overdue</h3>
//             </div>

//             <div className="bg-white rounded-xl shadow p-4">
//               <div className="flex items-center justify-between">
//                 <div className="p-2 bg-yellow-100 rounded-lg">
//                   <Clock className="w-5 h-5 text-yellow-600" />
//                 </div>
//                 <span className="text-xl font-bold text-gray-800">{projectStats.timelineStats.totalDays}</span>
//               </div>
//               <h3 className="text-sm font-semibold text-gray-700 mt-2">Total Days</h3>
//               <p className="text-xs text-gray-500 mt-1">
//                 {projectStats.headingStats.totalDetailTasks} detail tasks
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-xl shadow">
//           <div className="border-b border-gray-200">
//             <nav className="flex flex-wrap -mb-px overflow-x-auto">
//               <button
//                 onClick={() => setActiveTab('tasks')}
//                 className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tasks'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 📋 Task List
//               </button>
//               <button
//                 onClick={() => setActiveTab('resources')}
//                 className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'resources'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 👥 Resource List
//               </button>
//               <button
//                 onClick={() => setActiveTab('assignments')}
//                 className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'assignments'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 🔗 Assignment List
//               </button>
//               <button
//                 onClick={() => setActiveTab('gantt')}
//                 className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'gantt'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 📊 Gantt Chart
//               </button>
//               <button
//                 onClick={() => setActiveTab('analysis')}
//                 className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'analysis'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 📈 Project Analysis
//               </button>
//               <button
//                 onClick={() => setActiveTab('risks')}
//                 className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'risks'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 ⚠️ Risk Analysis
//               </button>
//               <button
//                 onClick={() => setActiveTab('duration')}
//                 className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'duration'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 ⏱️ Duration Count
//               </button>
//             </nav>
//           </div>

//           <div className="p-6">
//             {activeTab === 'tasks' && renderTaskList()}
//             {activeTab === 'resources' && renderResourceList()}
//             {activeTab === 'assignments' && renderAssignmentList()}
//             {activeTab === 'gantt' && (
//               <GanttChart
//                 data={ganttData}
//                 projectStats={projectStats}
//               />
//             )}
//             {activeTab === 'analysis' && (
//               <ProjectAnalysis
//                 stats={projectStats}
//                 tasks={content.tasks}
//                 assignments={content.assignments}  // Add this line
//               />
//             )}
//             {activeTab === 'risks' && renderRiskAnalysis()}
//             {activeTab === 'duration' && renderDurationCount()}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
//       <header className="max-w-7xl mx-auto mb-8 text-center">
//         {/* Logo and Title */}
//         <div className="flex flex-col items-center gap-4 mb-6">
//           {/* MS Project Logo using next/image */}
//           <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4">
//             <div className="relative w-16 h-16">
//               <Image
//                 src="/Logos/MS_Project_Logo.png"
//                 alt="Microsoft Project Logo"
//                 fill
//                 className="object-contain"
//                 sizes="64px"
//               />
//             </div>
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
//             Microsoft Project Analyzer
//           </h1>
//           <p className="text-gray-600">
//             Upload MS Project files for complete analysis: Tasks, Resources, Assignments, Gantt Charts & Risk Analysis
//           </p>
//           {content && (
//             <div className="bg-blue-50 px-4 py-2 rounded-lg">
//               <p className="text-sm text-blue-700">
//                 ✅ Data is saved locally. Page refresh will not clear your analysis.
//               </p>
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto">
//         {/* Upload Section */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
//           <h2 className="text-2xl font-bold mb-6">📤 Upload Exported File</h2>

//           <div className="border-3 border-dashed border-blue-400 rounded-xl p-8 md:p-12 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
//             <label className="cursor-pointer block">
//               <input
//                 type="file"
//                 accept=".csv,.xlsx,.xls"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//               <div className="space-y-4">
//                 <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
//                   <span className="text-3xl">📁</span>
//                 </div>
//                 <div>
//                   <p className="text-xl font-medium text-gray-700">Click to select exported file</p>
//                   <p className="text-gray-500 mt-2">
//                     Supported: .csv, .xlsx, .xls (exported from MS Project)
//                   </p>
//                 </div>
//                 <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
//                   <span>Browse Files</span>
//                 </div>
//               </div>
//             </label>
//           </div>

//           {loading && (
//             <div className="mt-6 text-center p-6">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
//               <p className="font-medium text-gray-700">Processing file...</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 Analyzing tasks, resources, assignments, and risks...
//               </p>
//             </div>
//           )}

//           {error && (
//             <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-700 font-medium">⚠️ {error}</p>
//               <p className="text-sm text-red-600 mt-1">
//                 Make sure you're uploading a file exported from Microsoft Project (Excel or CSV format).
//               </p>
//             </div>
//           )}

//           {file && !loading && !error && (
//             <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-green-700 font-medium">✅ File ready: {file.name}</p>
//               <p className="text-sm text-green-600 mt-1">
//                 Size: {(file.size / 1024).toFixed(2)} KB •
//                 Type: {file.name.split('.').pop().toUpperCase()} •
//                 {content && " Data is saved locally"}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Content Display */}
//         {content && !loading && renderContent()}

//         {/* Instructions */}
//         {!content && !loading && !error && (
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Project Analysis Tool</h3>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <div className="text-center p-4 bg-blue-50 rounded-xl">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                   <FileText className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <h4 className="font-bold text-gray-700 text-sm">Task List</h4>
//                 <p className="text-gray-600 text-xs mt-1">ID, Name, Dates, Status</p>
//               </div>

//               <div className="text-center p-4 bg-green-50 rounded-xl">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                   <Users className="w-5 h-5 text-green-600" />
//                 </div>
//                 <h4 className="font-bold text-gray-700 text-sm">Resource List</h4>
//                 <p className="text-gray-600 text-xs mt-1">ID, Name, Type, Work Status</p>
//               </div>

//               <div className="text-center p-4 bg-purple-50 rounded-xl">
//                 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                   <Briefcase className="w-5 h-5 text-purple-600" />
//                 </div>
//                 <h4 className="font-bold text-gray-700 text-sm">Assignment List</h4>
//                 <p className="text-gray-600 text-xs mt-1">Task, Resource, % Complete, Work</p>
//               </div>

//               <div className="text-center p-4 bg-red-50 rounded-xl">
//                 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                   <Shield className="w-5 h-5 text-red-600" />
//                 </div>
//                 <h4 className="font-bold text-gray-700 text-sm">Risk Analysis</h4>
//                 <p className="text-gray-600 text-xs mt-1">High/Medium/Low risks</p>
//               </div>
//             </div>

//             <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <Settings className="h-5 w-5 text-blue-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-blue-700">
//                     <strong>How to Export:</strong> In MS Project, go to <strong>File → Save As → Excel Workbook</strong>. Make sure to include all columns.
//                   </p>
//                   <p className="text-sm text-blue-700 mt-1">
//                     <strong>Note:</strong> Your data is saved locally in your browser. It will persist even after page refresh.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm">
//         <p>Microsoft Project Analyzer • Complete Project Analysis Tool</p>
//         <p className="mt-1">All processing happens locally in your browser • Data is saved in localStorage</p>
//       </footer>
//     </div>
//   )
// }
'use client'

import { useState, useMemo, useEffect } from 'react'
import { extractFromExcelOrCSV } from '@/src/lib/excelCsvExtractor'
import { GanttChart } from '@/src/components/MPPViewer/GanttChart'
import { ProjectAnalysis } from '@/src/components/MPPViewer/ProjectAnalysis'
import Image from 'next/image';
import { Calendar, BarChart3, Users, Clock, CheckCircle, AlertCircle, User, Target, Loader, AlertTriangle, Shield, Activity, TrendingUp, PieChart, FileText, Briefcase, Settings, Download, Filter, ChevronRight, ChevronDown } from 'lucide-react'

// Helper function to parse dates
const parseDate = (dateStr) => {
  if (!dateStr) return null;

  try {
    // Handle dates like "November 3, 2025 8:00 AM"
    if (typeof dateStr === 'string') {
      // Try parsing full date string with month name
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      for (let i = 0; i < monthNames.length; i++) {
        if (dateStr.includes(monthNames[i])) {
          // Extract date parts
          const parts = dateStr.split(', ');
          if (parts.length >= 2) {
            const monthDay = parts[0]; // "November 3"
            const yearTime = parts[1]; // "2025 8:00 AM"

            const month = monthNames.indexOf(monthNames[i]); // 0-11
            const day = parseInt(monthDay.split(' ')[1]);
            const year = parseInt(yearTime.split(' ')[0]);

            if (!isNaN(day) && !isNaN(year)) {
              return new Date(year, month, day);
            }
          }
        }
      }
    }

    // Try parsing as standard date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    console.warn('Could not parse date:', dateStr);
    return null;
  } catch (e) {
    console.error('Error parsing date:', dateStr, e);
    return null;
  }
};

// Helper function to parse duration strings
const parseDuration = (durationStr) => {
  if (!durationStr) return 0;

  const str = String(durationStr).toLowerCase();
  const match = str.match(/(\d+)\s*([dwmh]?)/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'h': return value / 8; // hours to days
      case 'd': return value;
      case 'w': return value * 5; // weeks to days (5 work days)
      case 'm': return value * 20; // months to days (20 work days)
      default: return value; // assume days
    }
  }

  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

// Helper function to render cell values based on column type
const renderCellValue = (header, value) => {
  if (value === undefined || value === null || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  // Handle percentage columns - FIXED
  if (header.toLowerCase().includes('complete') ||
    header.toLowerCase().includes('progress') ||
    header.toLowerCase().includes('percent')) {
    const percent = parseFloat(value);
    if (!isNaN(percent)) {
      // FIX: Ensure the progress bar shows correctly
      const displayPercent = Math.min(100, Math.max(0, percent));
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${displayPercent >= 100 ? 'bg-green-600' :
                displayPercent >= 80 ? 'bg-green-500' :
                  displayPercent >= 50 ? 'bg-yellow-500' :
                    displayPercent > 0 ? 'bg-blue-500' :
                      'bg-gray-400'
                }`}
              style={{ width: `${displayPercent}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium min-w-[40px]">{displayPercent.toFixed(1)}%</span>
        </div>
      );
    }
  }

  // Handle date columns - UPDATED WITH ACTUAL DATES
  if (header.toLowerCase().includes('date') ||
    header.toLowerCase().includes('start') ||
    header.toLowerCase().includes('finish') ||
    header.toLowerCase().includes('end') ||
    header.toLowerCase().includes('begin') ||
    header.toLowerCase().includes('actual')) { // Added 'actual' for actual start/finish
    const date = parseDate(value);
    if (date) {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  // Handle duration
  if (header.toLowerCase().includes('duration')) {
    const duration = parseDuration(value);
    if (duration > 0) {
      // FIX: Better duration display
      if (duration < 1) {
        return `${(duration * 8).toFixed(1)} hours`;
      } else if (duration >= 5 && duration < 20) {
        return `${duration} work days`;
      } else if (duration >= 20) {
        const weeks = (duration / 5).toFixed(1);
        return `${weeks} weeks (${duration} days)`;
      }
      return `${duration} days`;
    }
  }

  // Handle work hours
  if (header.toLowerCase().includes('work')) {
    const hours = parseFloat(value);
    if (!isNaN(hours)) {
      if (hours >= 40) {
        const days = (hours / 8).toFixed(1);
        return `${hours}h (${days} days)`;
      }
      return `${hours}h`;
    }
  }

  // Default: return as string
  return String(value);
};

// Helper function to get task status
const getTaskStatus = (task) => {
  const completion = parseFloat(task['% Complete']) ||
    parseFloat(task['% Work Complete']) ||
    parseFloat(task.Progress) || 0;

  let status = 'Not Started';
  let statusColor = 'bg-gray-100 text-gray-800';

  if (completion >= 100) {
    status = 'Completed';
    statusColor = 'bg-green-100 text-green-800';
  } else if (completion > 0) {
    status = 'In Progress';
    statusColor = 'bg-blue-100 text-blue-800';
  }

  // Check if overdue
  const endDateStr = task['Finish Date'] || task.Finish || task.End;
  if (endDateStr) {
    const endDate = parseDate(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate && endDate < today && completion < 100) {
      status = 'Overdue';
      statusColor = 'bg-red-100 text-red-800';
    }
  }

  return { status, statusColor };
};

// Helper function to get resource work status
const getResourceWorkStatus = (resource) => {
  const totalWork = resource['Total Work'] || 0;
  const completedWork = resource['Completed Work'] || 0;
  const remainingWork = resource['Remaining Work'] || 0;

  if (remainingWork === 0 && totalWork > 0) {
    return { status: 'Completed', color: 'bg-green-100 text-green-800' };
  } else if (completedWork > 0) {
    return { status: 'In Progress', color: 'bg-blue-100 text-blue-800' };
  } else if (totalWork > 0) {
    return { status: 'Not Started', color: 'bg-gray-100 text-gray-800' };
  } else {
    return { status: 'No Work', color: 'bg-gray-100 text-gray-800' };
  }
};

// Helper function to check if task is a heading (Outline Level = 1)
const isHeadingTask = (task) => {
  const outlineLevel = parseInt(task['Outline Level'] || task['OutlineLevel'] || task['Outline Number'] || 0);
  return outlineLevel === 1;
};

// Helper function to get Outline Level
const getOutlineLevel = (task) => {
  return parseInt(task['Outline Level'] || task['OutlineLevel'] || task['Outline Number'] || 0);
};

export default function Home() {
  const [file, setFile] = useState(null)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('tasks')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedHeadings, setExpandedHeadings] = useState({})

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('mppAnalyzerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setContent(parsedData.content);
        setFile(parsedData.file);
        setActiveTab(parsedData.activeTab || 'tasks');

        console.log('Loaded saved data from localStorage:', {
          tasks: parsedData.content?.tasks?.length || 0,
          fileName: parsedData.file?.name
        });
      } catch (err) {
        console.error('Error loading saved data:', err);
        localStorage.removeItem('mppAnalyzerData');
      }
    }
  }, []);

  // Save data to localStorage whenever content changes
  useEffect(() => {
    if (content && file) {
      const dataToSave = {
        content,
        file: { name: file.name, size: file.size, type: file.type },
        activeTab,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('mppAnalyzerData', JSON.stringify(dataToSave));
    }
  }, [content, file, activeTab]);

  // Clear saved data
  const clearSavedData = () => {
    localStorage.removeItem('mppAnalyzerData');
    setContent(null);
    setFile(null);
    setError(null);
    setSearchTerm('');
    setFilterStatus('all');
    setActiveTab('tasks');
    setExpandedHeadings({});
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const validExtensions = ['.csv', '.xlsx', '.xls']
    const fileExt = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'))

    if (!validExtensions.includes(fileExt)) {
      setError('Please select a .csv, .xlsx or .xls file exported from Microsoft Project')
      return
    }

    setFile(selectedFile)
    setLoading(true)
    setContent(null)
    setError(null)
    setActiveTab('tasks')
    setSearchTerm('')
    setFilterStatus('all')
    setExpandedHeadings({})

    try {
      console.log('Processing file:', selectedFile.name)

      const extractedContent = await extractFromExcelOrCSV(selectedFile)
      setContent(extractedContent)

      console.log('Extraction completed:', {
        tasks: extractedContent.tasks.length,
        resources: extractedContent.resources.length,
        assignments: extractedContent.assignments.length,
        riskAnalysis: extractedContent.riskAnalysis
      })

      // Expand all headings by default
      const headings = {};
      extractedContent.tasks.forEach((task, index) => {
        if (isHeadingTask(task)) {
          headings[index] = true;
        }
      });
      setExpandedHeadings(headings);

    } catch (error) {
      console.error('Error:', error)
      setError(`Error processing file: ${error.message}`)
      setContent(null)
    } finally {
      setLoading(false)
    }
  }

  // Toggle heading expansion
  const toggleHeading = (index) => {
    setExpandedHeadings(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Calculate project statistics
  const projectStats = useMemo(() => {
    if (!content || !content.tasks.length) return null;

    const stats = {
      totalTasks: content.tasks.length,
      totalResources: content.resources.length,
      totalAssignments: content.assignments.length,
      completedTasks: 0,
      inProgressTasks: 0,
      notStartedTasks: 0,
      overdueTasks: 0,
      totalDuration: 0,
      avgCompletion: 0,
      timelineStats: {
        earliestStart: null,
        latestEnd: null,
        totalDays: 0
      },
      riskStats: content.riskAnalysis?.statistics || {
        total: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      workStats: {
        totalWork: 0,
        completedWork: 0,
        remainingWork: 0
      },
      headingStats: {
        totalHeadings: 0,
        totalDetailTasks: 0
      }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Process tasks
    content.tasks.forEach(task => {
      // Count headings
      if (isHeadingTask(task)) {
        stats.headingStats.totalHeadings++;
      } else {
        stats.headingStats.totalDetailTasks++;
      }

      const completion = parseFloat(task['% Complete']) ||
        parseFloat(task['% Work Complete']) ||
        parseFloat(task.Progress) || 0;

      if (completion >= 100) {
        stats.completedTasks++;
      } else if (completion > 0) {
        stats.inProgressTasks++;
      } else {
        stats.notStartedTasks++;
      }

      // Check for overdue
      const endDateStr = task['Finish Date'] || task.Finish || task.End;
      if (endDateStr) {
        const endDate = parseDate(endDateStr);
        if (endDate && endDate < today && completion < 100) {
          stats.overdueTasks++;
        }
      }

      // Duration
      const duration = parseDuration(task.Duration);
      if (duration > 0) {
        stats.totalDuration += duration;
      }

      // Work hours
      const totalWork = parseFloat(task['Total Work']) || 0;
      const completedWork = parseFloat(task['Completed Work']) || 0;
      stats.workStats.totalWork += totalWork;
      stats.workStats.completedWork += completedWork;
      stats.workStats.remainingWork += (totalWork - completedWork);

      // Timeline
      const startDate = parseDate(task['Start Date'] || task.Start || task.Begin);
      const finishDate = parseDate(task['Finish Date'] || task.Finish || task.End);

      if (startDate) {
        if (!stats.timelineStats.earliestStart || startDate < stats.timelineStats.earliestStart) {
          stats.timelineStats.earliestStart = startDate;
        }
      }

      if (finishDate) {
        if (!stats.timelineStats.latestEnd || finishDate > stats.timelineStats.latestEnd) {
          stats.timelineStats.latestEnd = finishDate;
        }
      }
    });

    // Calculate project duration in days
    if (stats.timelineStats.earliestStart && stats.timelineStats.latestEnd) {
      const diffTime = Math.abs(stats.timelineStats.latestEnd - stats.timelineStats.earliestStart);
      stats.timelineStats.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Average completion (excluding headings)
    stats.avgCompletion = stats.headingStats.totalDetailTasks > 0
      ? (stats.completedTasks / stats.headingStats.totalDetailTasks) * 100
      : 0;

    return stats;
  }, [content]);

  // Organize tasks by hierarchy for display
  const organizedTasks = useMemo(() => {
    if (!content?.tasks) return [];

    const tasks = content.tasks;
    const organized = [];
    let currentOutlineLevel = 0;
    let currentHeadingIndex = -1;
    let headingStack = [];

    tasks.forEach((task, index) => {
      const outlineLevel = getOutlineLevel(task);
      const isHeading = isHeadingTask(task);

      if (isHeading) {
        // Add as heading
        organized.push({
          ...task,
          isHeading: true,
          originalIndex: index,
          level: outlineLevel,
          children: []
        });
        currentHeadingIndex = organized.length - 1;
        headingStack = [currentHeadingIndex];
        currentOutlineLevel = outlineLevel;
      } else if (currentHeadingIndex >= 0 && outlineLevel > currentOutlineLevel) {
        // Add as child of current heading
        if (organized[currentHeadingIndex]) {
          organized[currentHeadingIndex].children.push({
            ...task,
            isHeading: false,
            originalIndex: index,
            level: outlineLevel,
            parentIndex: currentHeadingIndex
          });
        } else {
          // No parent heading found, add as regular task
          organized.push({
            ...task,
            isHeading: false,
            originalIndex: index,
            level: outlineLevel
          });
        }
      } else {
        // Add as regular task
        organized.push({
          ...task,
          isHeading: false,
          originalIndex: index,
          level: outlineLevel
        });
        currentHeadingIndex = -1;
        headingStack = [];
        currentOutlineLevel = 0;
      }
    });

    return organized;
  }, [content]);

  // Filtered tasks with hierarchy
  const filteredTasks = useMemo(() => {
    if (!organizedTasks.length) return [];

    let filtered = organizedTasks;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => {
        const matches = (task.Name || task['Task Name'] || '').toLowerCase().includes(term) ||
          (task.Description || '').toLowerCase().includes(term);

        // If heading matches, show all its children
        if (matches && task.isHeading) {
          return true;
        }

        // If child matches, show its parent heading
        if (matches && !task.isHeading && task.parentIndex !== undefined) {
          return true;
        }

        return matches;
      });
    }

    // Status filter (for non-heading tasks)
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => {
        if (task.isHeading) {
          // Always show headings when filtering
          return true;
        }
        const { status } = getTaskStatus(task);
        return status.toLowerCase() === filterStatus.toLowerCase().replace(' ', '');
      });
    }

    return filtered;
  }, [organizedTasks, searchTerm, filterStatus]);

  // Check if a heading should be visible based on its children
  const isHeadingVisible = (heading, filteredTasks) => {
    // Heading is always visible if it matches search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const headingMatches = (heading.Name || heading['Task Name'] || '').toLowerCase().includes(term) ||
        (heading.Description || '').toLowerCase().includes(term);

      if (headingMatches) return true;

      // Check if any child matches
      if (heading.children) {
        const childMatches = heading.children.some(child => {
          const childMatchesSearch = (child.Name || child['Task Name'] || '').toLowerCase().includes(term) ||
            (child.Description || '').toLowerCase().includes(term);

          if (filterStatus !== 'all') {
            const { status } = getTaskStatus(child);
            return childMatchesSearch && status.toLowerCase() === filterStatus.toLowerCase().replace(' ', '');
          }
          return childMatchesSearch;
        });

        return childMatches;
      }
    }

    return true;
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    if (!content?.resources) return [];

    let filtered = content.resources;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource =>
        (resource.Name || resource['Resource Name'] || '').toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [content, searchTerm]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    if (!content?.assignments) return [];

    let filtered = content.assignments;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(assignment =>
        (assignment['Task Name'] || '').toLowerCase().includes(term) ||
        (assignment['Resource Name'] || '').toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [content, searchTerm]);

  // Prepare data for Gantt chart
  const ganttData = useMemo(() => {
    if (!content || !content.tasks.length) return [];

    return content.tasks
      .filter(task => {
        // Use Start_Date and Finish_Date (from your Excel)
        const startDate = parseDate(task['Start Date'] || task['Start_Date'] || task.Start);
        const endDate = parseDate(task['Finish Date'] || task['Finish_Date'] || task.Finish);
        return startDate && endDate;
      })
      .map((task, index) => {
        const startDate = parseDate(task['Start Date'] || task['Start_Date'] || task.Start);
        const endDate = parseDate(task['Finish Date'] || task['Finish_Date'] || task.Finish);

        // Get completion from assignment sheet or task sheet
        let completion = 0;

        // First check assignments
        if (content.assignments && content.assignments.length > 0) {
          const taskAssignments = content.assignments.filter(assignment =>
            assignment['Task Name'] === task.Name
          );
          if (taskAssignments.length > 0) {
            completion = parseFloat(taskAssignments[0]['Percent Work Complete'] || 0);
          }
        }

        // Fallback to task sheet
        if (completion === 0) {
          completion = parseFloat(task['% Complete'] || 0);
        }

        const { status } = getTaskStatus(task);

        return {
          id: task.ID || task.Id || index + 1,
          name: task.Name || task['Task Name'] || `Task ${index + 1}`,
          start: startDate,
          end: endDate,
          completion,
          status,
          duration: task.Duration || '',
          resources: task['Resource Names'] || task.Resources || '',
          dependencies: task.Predecessors || '',
          isHeading: task.outlineLevel === 1,
          outlineLevel: task.outlineLevel || 0
        };
      })
      .sort((a, b) => a.start - b.start);
  }, [content]);
  // Risk analysis data
  const riskAnalysis = useMemo(() => {
    if (!content?.riskAnalysis) return null;

    return content.riskAnalysis;
  }, [content]);

  // Render Task List with hierarchy - UPDATED WITH ACTUAL DATES
  // const renderTaskList = () => {
  //   if (!content?.tasks.length) {
  //     return (
  //       <div className="text-center py-12">
  //         <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
  //         <p className="text-gray-500">The uploaded file doesn't contain task data.</p>
  //       </div>
  //     );
  //   }
  //   // Helper function to check if a task should be displayed based on search and filters
  //   const shouldDisplayTask = (task, isHeading = false) => {
  //     // Always show headings when there's no search term
  //     if (isHeading && !searchTerm && filterStatus === 'all') return true;

  //     if (searchTerm) {
  //       const term = searchTerm.toLowerCase();
  //       const matches = (task.Name || task['Task Name'] || '').toLowerCase().includes(term) ||
  //         (task.Description || '').toLowerCase().includes(term);

  //       if (matches) return true;
  //     }

  //     if (filterStatus !== 'all' && !isHeading) {
  //       const { status } = getTaskStatus(task);
  //       return status.toLowerCase() === filterStatus.toLowerCase().replace(' ', '');
  //     }

  //     return !isHeading; // Show non-heading tasks by default
  //   };
  //   // Organize tasks into hierarchy
  //   const getHierarchicalTasks = () => {
  //     const tasks = content.tasks;
  //     const result = [];

  //     for (let i = 0; i < tasks.length; i++) {
  //       const task = tasks[i];
  //       const outlineLevel = getOutlineLevel(task);
  //       const isHeading = outlineLevel === 1;

  //       const shouldDisplay = shouldDisplayTask(task, isHeading);

  //       if (shouldDisplay) {
  //         result.push({
  //           ...task,
  //           isHeading,
  //           originalIndex: i,
  //           outlineLevel,
  //           display: true
  //         });
  //       }
  //     }

  //     return result;
  //   };

  //   const displayTasks = getHierarchicalTasks();


  //   // Helper function to render a single task row - UPDATED
  //   const renderTaskRow = (task, index) => {
  //     const { status, statusColor } = getTaskStatus(task);
  //     const isHeading = task.isHeading;
  //     const taskId = task.ID || task.Id || task.originalIndex + 1;
  //     const taskName = task.Name || task['Task Name'] || `Task ${task.originalIndex + 1}`;

  //     // Calculate completion for display
  //     const completion = parseFloat(task['% Complete']) ||
  //       parseFloat(task['% Work Complete']) ||
  //       parseFloat(task.Progress) || 0;

  //     return (
  //       <tr key={`task-${index}`} className={`hover:bg-gray-50 ${isHeading ? 'bg-blue-50' : ''}`}>
  //         <td className="p-4">
  //           <div className="flex items-center">
  //             {isHeading && (
  //               <button
  //                 onClick={() => toggleHeading(task.originalIndex)}
  //                 className="text-gray-500 hover:text-gray-700 mr-2"
  //               >
  //                 {expandedHeadings[task.originalIndex] ? (
  //                   <ChevronDown className="w-4 h-4" />
  //                 ) : (
  //                   <ChevronRight className="w-4 h-4" />
  //                 )}
  //               </button>
  //             )}
  //             <span className={`px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded font-mono ${isHeading ? 'font-bold' : ''}`}>
  //               {taskId}
  //             </span>
  //           </div>
  //         </td>
  //         <td className="p-4">
  //           <div
  //             className={`${isHeading ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}
  //             style={{
  //               paddingLeft: isHeading ? '0' : `${(getOutlineLevel(task) - 1) * 20}px`
  //             }}
  //           >
  //             {isHeading ? (
  //               <div className="flex items-center gap-2">
  //                 <span className="text-lg">📂</span>
  //                 <span>{taskName}</span>
  //               </div>
  //             ) : (
  //               taskName
  //             )}
  //             {isHeading && (
  //               <div className="text-xs text-gray-500 mt-1">
  //                 Outline Level: {getOutlineLevel(task)}
  //               </div>
  //             )}
  //           </div>
  //         </td>
  //         <td className="p-4 text-gray-700">
  //           {renderCellValue('Start Date', task['Start Date'] || task.Start)}
  //         </td>
  //         <td className="p-4 text-gray-700">
  //           {renderCellValue('Finish Date', task['Finish Date'] || task.Finish)}
  //         </td>
  //         {/* ACTUAL START DATE COLUMN - NEW */}
  //         <td className="p-4 text-gray-700">
  //           {renderCellValue('Actual Start', task['Actual Start'] || task['Actual_Start'] || task['Actual Start Date'])}
  //         </td>
  //         {/* ACTUAL FINISH DATE COLUMN - NEW */}
  //         <td className="p-4 text-gray-700">
  //           {renderCellValue('Actual Finish', task['Actual Finish'] || task['Actual_Finish'] || task['Actual Finish Date'])}
  //         </td>
  //         <td className="p-4 text-gray-700">
  //           {renderCellValue('Duration', task.Duration)}
  //         </td>
  //         <td className="p-4">
  //           <span className={`px-3 py-1 text-xs font-medium rounded-full ${isHeading ? 'bg-purple-100 text-purple-800' : statusColor}`}>
  //             {isHeading ? 'Heading' : status}
  //           </span>
  //         </td>
  //         <td className="p-4">
  //           {isHeading ? (
  //             <div className="text-gray-400 text-sm">-</div>
  //           ) : (
  //             renderCellValue('% Complete', task['% Complete'] || task['% Work Complete'])
  //           )}
  //         </td>
  //       </tr>
  //     );
  //   };

  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-between items-center">
  //         <div>
  //           <h3 className="text-xl font-bold text-gray-800 mb-2">📋 Task List with Hierarchy</h3>
  //           <p className="text-gray-600">
  //             {displayTasks.length} of {content.tasks.length} tasks visible
  //           </p>
  //         </div>
  //         <div className="flex gap-4">
  //           <div className="relative">
  //             <input
  //               type="text"
  //               placeholder="Search tasks..."
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //               className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             />
  //             <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
  //           </div>
  //           <select
  //             value={filterStatus}
  //             onChange={(e) => setFilterStatus(e.target.value)}
  //             className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           >
  //             <option value="all">All Status</option>
  //             <option value="Not Started">Not Started</option>
  //             <option value="In Progress">In Progress</option>
  //             <option value="Completed">Completed</option>
  //             <option value="Overdue">Overdue</option>
  //           </select>
  //         </div>
  //       </div>

  //       <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
  //         <div className="flex items-center gap-2">
  //           <span className="text-blue-600 font-medium">📌 Headings</span>
  //           <span className="text-sm text-blue-600">are shown in <strong>bold</strong> with purple background</span>
  //         </div>
  //         <div className="mt-2 text-sm text-blue-600">
  //           • Outline Level 1 tasks are considered as headings<br />
  //           • Click on the arrow to expand/collapse heading details
  //         </div>
  //       </div>

  //       <div className="overflow-x-auto border rounded-lg">
  //         <table className="w-full">
  //           <thead className="bg-gray-50">
  //             <tr>
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">ID</th>
  //               <th className="p-4 text-left font-semibold text-gray-700 min-w-[200px]">Task Name</th>
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Start Date</th>
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Finish Date</th>
  //               {/* ACTUAL START HEADER - NEW */}
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Actual Start</th>
  //               {/* ACTUAL FINISH HEADER - NEW */}
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Actual Finish</th>
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Duration</th>
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
  //               <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">% Complete</th>
  //             </tr>
  //           </thead>
  //           <tbody className="divide-y divide-gray-200">
  //             {displayTasks.map((task, index) => renderTaskRow(task, index))}
  //           </tbody>
  //         </table>
  //       </div>

  //       {displayTasks.length === 0 && (
  //         <div className="text-center py-8 text-gray-500">
  //           No tasks found matching your search criteria.
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  // Render Task List with hierarchy - UPDATED WITH ACTUAL DATES
const renderTaskList = () => {
  if (!content?.tasks.length) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
        <p className="text-gray-500">The uploaded file doesn't contain task data.</p>
      </div>
    );
  }
  
  // Filter out the header row (first row if it contains "ID" as column name)
  const tasksWithoutHeader = content.tasks.filter(task => {
    // Skip the first row if it's a header row (contains "ID" or "Name" as value)
    const taskName = task.Name || task['Task Name'] || '';
    const taskId = task.ID || task.Id || '';
    
    // Check if this looks like a header row
    const isHeaderRow = (
      taskName === 'ID' || 
      taskName === 'Name' || 
      taskName === 'Task Name' ||
      taskId === 'ID' ||
      (typeof taskId === 'string' && taskId.trim().toUpperCase() === 'ID')
    );
    
    return !isHeaderRow;
  });

  if (tasksWithoutHeader.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Valid Tasks Found</h3>
        <p className="text-gray-500">The file appears to only contain header information.</p>
      </div>
    );
  }

  // Helper function to check if a task should be displayed based on search and filters
  const shouldDisplayTask = (task, isHeading = false) => {
    // Always show headings when there's no search term
    if (isHeading && !searchTerm && filterStatus === 'all') return true;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = (task.Name || task['Task Name'] || '').toLowerCase().includes(term) ||
        (task.Description || '').toLowerCase().includes(term);

      if (matches) return true;
    }

    if (filterStatus !== 'all' && !isHeading) {
      const { status } = getTaskStatus(task);
      return status.toLowerCase() === filterStatus.toLowerCase().replace(' ', '');
    }

    return !isHeading; // Show non-heading tasks by default
  };
  
  // Organize tasks into hierarchy
  const getHierarchicalTasks = () => {
    const tasks = tasksWithoutHeader;
    const result = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const outlineLevel = getOutlineLevel(task);
      const isHeading = outlineLevel === 1;

      const shouldDisplay = shouldDisplayTask(task, isHeading);

      if (shouldDisplay) {
        result.push({
          ...task,
          isHeading,
          originalIndex: i,
          outlineLevel,
          display: true
        });
      }
    }

    return result;
  };

  const displayTasks = getHierarchicalTasks();

  // Helper function to render a single task row - UPDATED
  const renderTaskRow = (task, index) => {
    const { status, statusColor } = getTaskStatus(task);
    const isHeading = task.isHeading;
    const taskId = task.ID || task.Id || task.originalIndex + 1;
    const taskName = task.Name || task['Task Name'] || `Task ${task.originalIndex + 1}`;

    // Calculate completion for display
    const completion = parseFloat(task['% Complete']) ||
      parseFloat(task['% Work Complete']) ||
      parseFloat(task.Progress) || 0;

    return (
      <tr key={`task-${index}`} className={`hover:bg-gray-50 ${isHeading ? 'bg-blue-50' : ''}`}>
        <td className="p-4">
          <div className="flex items-center">
            {isHeading && (
              <button
                onClick={() => toggleHeading(task.originalIndex)}
                className="text-gray-500 hover:text-gray-700 mr-2"
              >
                {expandedHeadings[task.originalIndex] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <span className={`px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded font-mono ${isHeading ? 'font-bold' : ''}`}>
              {taskId}
            </span>
          </div>
        </td>
        <td className="p-4">
          <div
            className={`${isHeading ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}
            style={{
              paddingLeft: isHeading ? '0' : `${(getOutlineLevel(task) - 1) * 20}px`
            }}
          >
            {isHeading ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">📂</span>
                <span>{taskName}</span>
              </div>
            ) : (
              taskName
            )}
            {isHeading && (
              <div className="text-xs text-gray-500 mt-1">
                Outline Level: {getOutlineLevel(task)}
              </div>
            )}
          </div>
        </td>
        <td className="p-4 text-gray-700">
          {renderCellValue('Start Date', task['Start Date'] || task.Start)}
        </td>
        <td className="p-4 text-gray-700">
          {renderCellValue('Finish Date', task['Finish Date'] || task.Finish)}
        </td>
        {/* ACTUAL START DATE COLUMN - NEW */}
        <td className="p-4 text-gray-700">
          {renderCellValue('Actual Start', task['Actual Start'] || task['Actual_Start'] || task['Actual Start Date'])}
        </td>
        {/* ACTUAL FINISH DATE COLUMN - NEW */}
        <td className="p-4 text-gray-700">
          {renderCellValue('Actual Finish', task['Actual Finish'] || task['Actual_Finish'] || task['Actual Finish Date'])}
        </td>
        <td className="p-4 text-gray-700">
          {renderCellValue('Duration', task.Duration)}
        </td>
        <td className="p-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${isHeading ? 'bg-purple-100 text-purple-800' : statusColor}`}>
            {isHeading ? 'Heading' : status}
          </span>
        </td>
        <td className="p-4">
          {isHeading ? (
            <div className="text-gray-400 text-sm">-</div>
          ) : (
            renderCellValue('% Complete', task['% Complete'] || task['% Work Complete'])
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">📋 Task List with Hierarchy</h3>
          <p className="text-gray-600">
            {displayTasks.length} of {tasksWithoutHeader.length} tasks visible
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-medium">📌 Headings</span>
          <span className="text-sm text-blue-600">are shown in <strong>bold</strong> with purple background</span>
        </div>
        <div className="mt-2 text-sm text-blue-600">
          • Outline Level 1 tasks are considered as headings<br />
          • Click on the arrow to expand/collapse heading details
        </div>
      </div> */}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">ID</th>
              <th className="p-4 text-left font-semibold text-gray-700 min-w-[200px]">Task Name</th>
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Start Date</th>
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Finish Date</th>
              {/* ACTUAL START HEADER - NEW */}
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Actual Start</th>
              {/* ACTUAL FINISH HEADER - NEW */}
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Actual Finish</th>
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Duration</th>
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap">% Complete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayTasks.map((task, index) => renderTaskRow(task, index))}
          </tbody>
        </table>
      </div>

      {displayTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks found matching your search criteria.
        </div>
      )}
    </div>
  );
};

  // Render Resource List
  const renderResourceList = () => {
    if (!content?.resources.length) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
          <p className="text-gray-500">The uploaded file doesn't contain resource data.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">👥 Resource List</h3>
            <p className="text-gray-600">
              {filteredResources.length} resources
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">ID</th>
                <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Type</th>
                <th className="p-4 text-left font-semibold text-gray-700">Work Status</th>
                <th className="p-4 text-left font-semibold text-gray-700">Total Work</th>
                <th className="p-4 text-left font-semibold text-gray-700">Completed</th>
                <th className="p-4 text-left font-semibold text-gray-700">Remaining</th>
                <th className="p-4 text-left font-semibold text-gray-700">% Complete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResources.map((resource, index) => {
                const { status, color } = getResourceWorkStatus(resource);
                const totalWork = resource['Total Work'] || 0;
                const completedWork = resource['Completed Work'] || 0;
                const remainingWork = resource['Remaining Work'] || 0;
                const percentComplete = totalWork > 0 ? (completedWork / totalWork) * 100 : 0;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded font-mono">
                        {resource.ID || resource.Id || index + 1}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {resource.Name || resource['Resource Name'] || `Resource ${index + 1}`}
                    </td>
                    <td className="p-4 text-gray-700">
                      {resource.Type || 'Work'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      {totalWork ? `${totalWork.toFixed(1)}h` : '-'}
                    </td>
                    <td className="p-4 text-gray-700">
                      {completedWork ? `${completedWork.toFixed(1)}h` : '-'}
                    </td>
                    <td className="p-4 text-gray-700">
                      {remainingWork ? `${remainingWork.toFixed(1)}h` : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${percentComplete >= 80 ? 'bg-green-600' :
                              percentComplete >= 50 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                            style={{ width: `${Math.min(100, percentComplete)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{percentComplete.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No resources found matching your search criteria.
          </div>
        )}
      </div>
    );
  };

  // Render Assignment List
  // const renderAssignmentList = () => {
  //   if (!content?.assignments.length) {
  //     return (
  //       <div className="text-center py-12">
  //         <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
  //         <p className="text-gray-500">The uploaded file doesn't contain assignment data.</p>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-between items-center">
  //         <div>
  //           <h3 className="text-xl font-bold text-gray-800 mb-2">🔗 Assignment List</h3>
  //           <p className="text-gray-600">
  //             {filteredAssignments.length} assignments
  //           </p>
  //         </div>
  //         <div className="relative">
  //           <input
  //             type="text"
  //             placeholder="Search assignments..."
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //             className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           />
  //           <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
  //         </div>
  //       </div>

  //       <div className="overflow-x-auto border rounded-lg">
  //         <table className="w-full">
  //           <thead className="bg-gray-50">
  //             <tr>
  //               <th className="p-4 text-left font-semibold text-gray-700">Task Name</th>
  //               <th className="p-4 text-left font-semibold text-gray-700">Resource Name</th>
  //               <th className="p-4 text-left font-semibold text-gray-700">% Work Complete</th>
  //               <th className="p-4 text-left font-semibold text-gray-700">Work (Hours)</th>
  //               <th className="p-4 text-left font-semibold text-gray-700">Units</th>
  //               <th className="p-4 text-left font-semibold text-gray-700">Remaining Work</th>
  //             </tr>
  //           </thead>
  //           <tbody className="divide-y divide-gray-200">
  //             {filteredAssignments.map((assignment, index) => {
  //               const taskName = assignment['Task Name'] || assignment.Task || 'Unnamed Task';
  //               const resourceName = assignment['Resource Name'] || assignment.Resource || 'Unnamed Resource';
  //               const percentComplete = parseFloat(assignment['% Work Complete']) || 0;
  //               const work = parseFloat(assignment.Work) || 0;
  //               const units = assignment.Units || '100%';
  //               const remainingWork = work * (100 - percentComplete) / 100;

  //               return (
  //                 <tr key={index} className="hover:bg-gray-50">
  //                   <td className="p-4 font-medium text-gray-800">
  //                     {taskName}
  //                   </td>
  //                   <td className="p-4 font-medium text-gray-700">
  //                     {resourceName}
  //                   </td>
  //                   <td className="p-4">
  //                     <div className="flex items-center gap-2">
  //                       <div className="w-16 bg-gray-200 rounded-full h-2">
  //                         <div
  //                           className={`h-2 rounded-full ${percentComplete >= 80 ? 'bg-green-600' :
  //                             percentComplete >= 50 ? 'bg-yellow-600' :
  //                               'bg-red-600'
  //                             }`}
  //                           style={{ width: `${Math.min(100, percentComplete)}%` }}
  //                         ></div>
  //                       </div>
  //                       <span className="text-sm font-medium">{percentComplete}%</span>
  //                     </div>
  //                   </td>
  //                   <td className="p-4 text-gray-700">
  //                     {work ? `${work}h` : '-'}
  //                   </td>
  //                   <td className="p-4 text-gray-700">
  //                     {units}
  //                   </td>
  //                   <td className="p-4 text-gray-700">
  //                     {remainingWork > 0 ? `${remainingWork.toFixed(1)}h` : '-'}
  //                   </td>
  //                 </tr>
  //               );
  //             })}
  //           </tbody>
  //         </table>
  //       </div>

  //       {filteredAssignments.length === 0 && (
  //         <div className="text-center py-8 text-gray-500">
  //           No assignments found matching your search criteria.
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
 // Add this function to calculate overall progress from assignments
const calculateOverallProgressFromAssignments = useMemo(() => {
  if (!content?.assignments || content.assignments.length === 0) return 0;
  
  console.log('📊 Calculating overall progress from assignments...');
  
  let totalCompletion = 0;
  let validAssignments = 0;
  
  // Group assignments by task to avoid double counting
  const taskCompletionMap = {};
  
  content.assignments.forEach(assignment => {
    const taskName = assignment['Task Name'] || assignment.Task || '';
    const percentComplete = assignment['Percent Work Complete'];
    
    if (taskName && percentComplete !== undefined && percentComplete !== null && percentComplete !== '') {
      const completionValue = parseFloat(percentComplete);
      if (!isNaN(completionValue)) {
        if (!taskCompletionMap[taskName]) {
          taskCompletionMap[taskName] = [];
        }
        taskCompletionMap[taskName].push(completionValue);
      }
    }
  });
  
  // Calculate average per task
  Object.values(taskCompletionMap).forEach(taskCompletions => {
    if (taskCompletions.length > 0) {
      const taskAverage = taskCompletions.reduce((a, b) => a + b, 0) / taskCompletions.length;
      totalCompletion += Math.min(100, Math.max(0, taskAverage));
      validAssignments++;
    }
  });
  
  const overallProgress = validAssignments > 0 ? totalCompletion / validAssignments : 0;
  
  console.log('Overall progress from assignments:', {
    totalAssignments: content.assignments.length,
    tasksWithAssignments: Object.keys(taskCompletionMap).length,
    validAssignments,
    overallProgress: overallProgress.toFixed(1) + '%'
  });
  
  return overallProgress;
}, [content?.assignments]);

// Count in-progress tasks from assignments
const inProgressTasksFromAssignments = useMemo(() => {
  if (!content?.assignments || content.assignments.length === 0) return 0;
  
  const taskStatusMap = {};
  
  content.assignments.forEach(assignment => {
    const taskName = assignment['Task Name'] || assignment.Task || '';
    const percentComplete = parseFloat(assignment['Percent Work Complete']) || 0;
    
    if (taskName) {
      if (!taskStatusMap[taskName]) {
        taskStatusMap[taskName] = { percentComplete: 0, count: 0 };
      }
      taskStatusMap[taskName].percentComplete += percentComplete;
      taskStatusMap[taskName].count++;
    }
  });
  
  let inProgressCount = 0;
  
  Object.values(taskStatusMap).forEach(taskData => {
    const avgCompletion = taskData.percentComplete / taskData.count;
    if (avgCompletion > 0 && avgCompletion < 100) {
      inProgressCount++;
    }
  });
  
  console.log('In-progress tasks from assignments:', inProgressCount);
  return inProgressCount;
}, [content?.assignments]);
  // Render Assignment List - SIMPLIFIED VERSION
// ============================================================================
// FILE: page.js
// COMPLETE UPDATED renderAssignmentList FUNCTION
// ============================================================================

// Render Assignment List - WITH WORK HOURS BREAKDOWN
const renderAssignmentList = () => {
  if (!content?.assignments.length) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
        <p className="text-gray-500">The uploaded file doesn't contain assignment data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">🔗 Assignment List</h3>
          <p className="text-gray-600">
            {filteredAssignments.length} assignments
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* ✅ ✅ ✅ NEW: Explanation Card ✅ ✅ ✅ */}
      {/* <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600 font-medium">📊 Work Hours Calculation:</span>
        </div>
        <div className="text-sm text-blue-700 space-y-1">
          <div><strong>Scheduled Work:</strong> कुल work hours (Total hours planned)</div>
          <div><strong>Actual Work:</strong> Scheduled Work × (% Complete ÷ 100) = काम हो गए hours</div>
          <div><strong>Remaining Work:</strong> Scheduled Work - Actual Work = बाकी hours</div>
        </div>
      </div> */}
      {/* ✅ ✅ ✅ END OF NEW CARD ✅ ✅ ✅ */}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Task Name</th>
              <th className="p-4 text-left font-semibold text-gray-700">Resource Name</th>
              <th className="p-4 text-left font-semibold text-gray-700">% Complete</th>
              {/* ✅ ✅ ✅ NEW COLUMNS ✅ ✅ ✅ */}
              <th className="p-4 text-left font-semibold text-gray-700">Scheduled Work 📊</th>
              <th className="p-4 text-left font-semibold text-gray-700">Actual Work ✅</th>
              <th className="p-4 text-left font-semibold text-gray-700">Remaining Work ⏳</th>
              {/* ✅ ✅ ✅ END OF NEW COLUMNS ✅ ✅ ✅ */}
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssignments.map((assignment, index) => {
              const taskName = assignment['Task Name'] || assignment.Task || 'Unnamed Task';
              const resourceName = assignment['Resource Name'] || assignment.Resource || 'Unnamed Resource';
              const percentComplete = parseFloat(assignment['Percent Work Complete']) || 0;
              
              // ✅ ✅ ✅ NEW: Get calculated work hours ✅ ✅ ✅
              const scheduledWork = parseFloat(assignment['Scheduled Work']) || 0;
              const actualWork = parseFloat(assignment['Actual Work']) || 0;
              const remainingWork = parseFloat(assignment['Remaining Work']) || 0;
              // ✅ ✅ ✅ END ✅ ✅ ✅
              
              // Determine status
              let status = 'Not Started';
              let statusColor = 'bg-gray-100 text-gray-800';
              
              if (percentComplete >= 100) {
                status = 'Completed';
                statusColor = 'bg-green-100 text-green-800';
              } else if (percentComplete > 0 && percentComplete < 100) {
                status = 'In Progress';
                statusColor = 'bg-blue-100 text-blue-800';
              } else if (remainingWork === 0 && scheduledWork > 0) {
                status = 'Completed';
                statusColor = 'bg-green-100 text-green-800';
              }

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">
                    {taskName}
                  </td>
                  <td className="p-4 font-medium text-gray-700">
                    {resourceName}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            percentComplete >= 100 ? 'bg-green-600' :
                            percentComplete >= 80 ? 'bg-green-500' :
                            percentComplete >= 50 ? 'bg-yellow-500' :
                            percentComplete > 0 ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(100, percentComplete)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium min-w-[40px]">
                        {percentComplete.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  
                  {/* ✅ ✅ ✅ NEW: Scheduled Work Column ✅ ✅ ✅ */}
                  <td className="p-4">
                    <div className="font-medium text-blue-600">
                      {scheduledWork > 0 ? `${scheduledWork.toFixed(1)}h` : '0h'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Total planned
                    </div>
                  </td>
                  
                  {/* ✅ ✅ ✅ NEW: Actual Work Column ✅ ✅ ✅ */}
                  <td className="p-4">
                    <div className="font-medium text-green-600">
                      {actualWork > 0 ? `${actualWork.toFixed(1)}h` : '0h'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Completed
                    </div>
                  </td>
                  
                  {/* ✅ ✅ ✅ NEW: Remaining Work Column ✅ ✅ ✅ */}
                  <td className="p-4">
                    <div className="font-medium text-orange-600">
                      {remainingWork > 0 ? `${remainingWork.toFixed(1)}h` : '0h'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Pending
                    </div>
                  </td>
                  {/* ✅ ✅ ✅ END OF NEW COLUMNS ✅ ✅ ✅ */}
                  
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* {filteredAssignments.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-bold text-gray-700 mb-4">📊 Work Hours Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredAssignments
                  .reduce((sum, a) => sum + (parseFloat(a['Scheduled Work']) || 0), 0)
                  .toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Scheduled Work</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredAssignments
                  .reduce((sum, a) => sum + (parseFloat(a['Actual Work']) || 0), 0)
                  .toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Completed Work</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {filteredAssignments
                  .reduce((sum, a) => sum + (parseFloat(a['Remaining Work']) || 0), 0)
                  .toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Remaining Work</div>
            </div>
          </div>
        </div>
      )} */}
      {/* ✅ ✅ ✅ END OF SUMMARY CARD ✅ ✅ ✅ */}

      {/* {filteredAssignments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No assignments found matching your search criteria.
        </div>
      )} */}
    </div>
  );
};


  // Render Risk Analysis
//   const renderRiskAnalysis = () => {
//     if (!riskAnalysis) {
//   return (
//     <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
//       <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//       <h3 className="text-xl font-bold text-gray-800 mb-3">No Risk Analysis Available</h3>
//       <p className="text-gray-600 mb-6">Risk analysis could not be generated from the uploaded file.</p>
//       <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
//         <span className="text-sm">Try re-uploading your project file</span>
//       </div>
//     </div>
//   );
// }
// if (riskAnalysis.risks.length === 0) {
//   return (
//     <div className="space-y-8">
//       <div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">✅ Risk Analysis</h3>
//         <p className="text-gray-600">
//           No potential risks detected in the project
//         </p>
//       </div>

//       {/* Positive Status Card */}
//       <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-green-100 rounded-lg">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//           </div>
//           <div>
//             <h4 className="text-lg font-bold text-green-800">Project Health: Excellent</h4>
//             <p className="text-green-700">No major risks identified. Your project is on track.</p>
//           </div>
//         </div>
        
//         {/* Health Indicators */}
//         <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? projectStats.avgCompletion.toFixed(0) + '%' : 'N/A'}
//             </div>
//             <div className="text-sm text-gray-600">Progress Rate</div>
//           </div>
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? projectStats.overdueTasks : '0'}
//             </div>
//             <div className="text-sm text-gray-600">Overdue Tasks</div>
//           </div>
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? projectStats.completedTasks : '0'}
//             </div>
//             <div className="text-sm text-gray-600">Completed</div>
//           </div>
//           <div className="text-center p-3 bg-white rounded-lg">
//             <div className="text-2xl font-bold text-green-600">
//               {projectStats ? 'Good' : 'N/A'}
//             </div>
//             <div className="text-sm text-gray-600">Overall Status</div>
//           </div>
//         </div>
//       </div>
      
//       {/* Prevention Tips */}
//       <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
//         <h4 className="font-bold text-blue-800 mb-3">💡 Tips to Maintain Low Risk</h4>
//         <ul className="space-y-2 text-blue-700">
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Continue regular progress monitoring and weekly reviews</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Ensure all tasks have assigned resources</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Maintain buffer time for critical path tasks</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="text-blue-500">•</span>
//             <span>Document lessons learned for future projects</span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

//     return (
//       <div className="space-y-8">
//         <div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">⚠️ Risk Analysis</h3>
//           <p className="text-gray-600">
//             Identified {riskAnalysis.statistics.total} potential risks in the project
//           </p>
//         </div>

//         {/* Risk Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-red-100 rounded-lg">
//                 <AlertCircle className="w-6 h-6 text-red-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.high}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">High Risks</h3>
//             <p className="text-sm text-gray-500">Require immediate attention</p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-yellow-100 rounded-lg">
//                 <AlertTriangle className="w-6 h-6 text-yellow-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.medium}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">Medium Risks</h3>
//             <p className="text-sm text-gray-500">Monitor closely</p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <AlertTriangle className="w-6 h-6 text-blue-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.low}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">Low Risks</h3>
//             <p className="text-sm text-gray-500">Regular monitoring</p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between">
//               <div className="p-3 bg-gray-100 rounded-lg">
//                 <Shield className="w-6 h-6 text-gray-600" />
//               </div>
//               <span className="text-2xl font-bold text-gray-800">{riskAnalysis.statistics.total}</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mt-4">Total Risks</h3>
//             <p className="text-sm text-gray-500">All identified risks</p>
//           </div>
//         </div>

//         {/* Risk Details */}
//         <div className="bg-white rounded-xl shadow">
//           <div className="p-6 border-b">
//             <h4 className="text-lg font-bold text-gray-800">📋 Risk Details</h4>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="p-4 text-left font-semibold text-gray-700">Risk Level</th>
//                   <th className="p-4 text-left font-semibold text-gray-700">Type</th>
//                   <th className="p-4 text-left font-semibold text-gray-700">Task/Resource</th>
//                   <th className="p-4 text-left font-semibold text-gray-700">Description</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {riskAnalysis.risks.map((risk, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="p-4">
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${risk.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
//                         risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-blue-100 text-blue-800'
//                         }`}>
//                         {risk.riskLevel}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-700">{risk.riskType}</td>
//                     <td className="p-4">
//                       <div className="font-medium">
//                         {risk.taskName || risk.resourceName}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {risk.taskId ? `Task ID: ${risk.taskId}` : `Resource: ${risk.resourceName}`}
//                       </div>
//                     </td>
//                     <td className="p-4 text-gray-700">{risk.description}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recommendations */}
//         {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
//           <div className="bg-white rounded-xl shadow p-6">
//             <h4 className="text-lg font-bold text-gray-800 mb-4">💡 Recommendations</h4>
//             <div className="space-y-4">
//               {riskAnalysis.recommendations.map((rec, index) => (
//                 <div key={index} className={`p-4 rounded-lg border-l-4 ${rec.priority === 'High' ? 'border-l-red-500 bg-red-50' :
//                   rec.priority === 'Medium' ? 'border-l-yellow-500 bg-yellow-50' :
//                     'border-l-blue-500 bg-blue-50'
//                   }`}>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h5 className="font-semibold text-gray-800">{rec.type} Risk</h5>
//                       <p className="text-gray-600 mt-1">{rec.description}</p>
//                     </div>
//                     <span className={`px-3 py-1 text-xs font-medium rounded-full ${rec.priority === 'High' ? 'bg-red-100 text-red-800' :
//                       rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-blue-100 text-blue-800'
//                       }`}>
//                       {rec.priority} Priority
//                     </span>
//                   </div>
//                   <div className="mt-3 text-sm">
//                     <span className="font-medium">Action: </span>
//                     <span className="text-gray-700">{rec.action}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };
// Render Risk Analysis - SIMPLIFIED VERSION
const renderRiskAnalysis = () => {
  if (!riskAnalysis) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-3">No Risk Analysis Available</h3>
        <p className="text-gray-600 mb-6">Risk analysis could not be generated from the uploaded file.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
          <span className="text-sm">Try re-uploading your project file</span>
        </div>
      </div>
    );
  }

  // Get all high risk task names
  const highRiskTaskNames = new Set();
  
  riskAnalysis.risks.forEach(risk => {
    if (risk.riskLevel === 'High' && (risk.taskName || risk.resourceName)) {
      highRiskTaskNames.add(risk.taskName || risk.resourceName);
    }
  });

  console.log('High risk tasks:', Array.from(highRiskTaskNames));

  // Filter medium risks - remove those that are already in high risk
  const filteredRisks = riskAnalysis.risks.filter(risk => {
    const taskName = risk.taskName || risk.resourceName;
    
    // If task is in high risk, don't show it in medium/low
    if (highRiskTaskNames.has(taskName) && risk.riskLevel !== 'High') {
      return false; // Skip this risk
    }
    
    return true; // Keep this risk
  });

  // Count risks after filtering
  const riskCounts = {
    High: 0,
    Medium: 0,
    Low: 0,
    total: 0
  };

  filteredRisks.forEach(risk => {
    riskCounts[risk.riskLevel]++;
    riskCounts.total++;
  });

  console.log('Filtered risks:', {
    original: riskAnalysis.risks.length,
    filtered: filteredRisks.length,
    counts: riskCounts
  });

  if (filteredRisks.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">✅ Risk Analysis</h3>
          <p className="text-gray-600">No potential risks detected in the project</p>
        </div>
        {/* ... rest of no risks UI ... */}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">⚠️ Risk Analysis</h3>
        <p className="text-gray-600">
          {riskCounts.total} risks identified
          <span className="text-sm text-gray-500 ml-2">
            (High risk tasks removed from medium/low)
          </span>
        </p>
      </div>

      {/* Risk Statistics - SIMPLIFIED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{riskCounts.High}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">High Risks</h3>
          <p className="text-sm text-gray-500">Critical - needs immediate action</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{riskCounts.Medium}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Medium Risks</h3>
          <p className="text-sm text-gray-500">Monitor closely</p>
          <p className="text-xs text-gray-400 mt-1">
            (High risk tasks excluded)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{riskCounts.Low}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Low Risks</h3>
          <p className="text-sm text-gray-500">Regular monitoring</p>
          <p className="text-xs text-gray-400 mt-1">
            (High risk tasks excluded)
          </p>
        </div>
      </div>

      {/* Simple Warning
      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="font-bold text-red-800">Note:</span>
          <span className="text-red-700">
            Tasks with High risk are NOT shown in Medium/Low risk sections
          </span>
        </div>
      </div> */}

      {/* Risk Details - SHOW FILTERED RISKS */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <h4 className="text-lg font-bold text-gray-800">📋 All Risks</h4>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredRisks.length} risks (filtered to avoid duplicates)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Risk Level</th>
                <th className="p-4 text-left font-semibold text-gray-700">Task/Resource</th>
                <th className="p-4 text-left font-semibold text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRisks.map((risk, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      risk.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {risk.riskLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">
                      {risk.taskName || risk.resourceName || 'General Risk'}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{risk.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Summary
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-gray-800">📊 Summary:</span>
        </div>
        <div className="text-sm text-gray-600">
          <p>• <strong className="text-red-600">High Risk:</strong> {riskCounts.High} tasks - Need immediate attention</p>
          <p>• <strong className="text-yellow-600">Medium Risk:</strong> {riskCounts.Medium} tasks - Monitor closely</p>
          <p>• <strong className="text-blue-600">Low Risk:</strong> {riskCounts.Low} tasks - Regular monitoring</p>
          <p className="mt-2 text-xs text-gray-500">
            Note: If a task has both High and Medium risks, it's only shown as High risk
          </p>
        </div>
      </div> */}
    </div>
  );
};

  // Render Duration Count
  const renderDurationCount = () => {
    if (!projectStats || !content) return null;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">⏱️ Duration Analysis & Actual vs Planned</h3>
          <p className="text-gray-600">Task duration statistics and schedule variance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration Analysis */}
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-bold text-gray-700 mb-4">Duration Analysis</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Tasks with Duration:</span>
                <span className="font-medium">
                  {content.tasks.filter(t => t.Duration && parseDuration(t.Duration) > 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Task Duration:</span>
                <span className="font-medium">
                  {(() => {
                    const durations = content.tasks
                      .map(t => parseDuration(t.Duration || 0))
                      .filter(d => d > 0);
                    return durations.length > 0
                      ? (durations.reduce((a, b) => a + b) / durations.length).toFixed(1)
                      : '0';
                  })()} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shortest Task:</span>
                <span className="font-medium">
                  {(() => {
                    const durations = content.tasks
                      .map(t => parseDuration(t.Duration || 0))
                      .filter(d => d > 0);
                    return durations.length > 0
                      ? Math.min(...durations) + ' days'
                      : 'N/A';
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Longest Task:</span>
                <span className="font-medium">
                  {(() => {
                    const durations = content.tasks
                      .map(t => parseDuration(t.Duration || 0))
                      .filter(d => d > 0);
                    return durations.length > 0
                      ? Math.max(...durations) + ' days'
                      : 'N/A';
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Actual vs Planned Comparison */}
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-bold text-gray-700 mb-4">Actual vs Planned</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tasks Started on Time:</span>
                <span className="font-medium text-green-600">
                  {(() => {
                    const onTime = content.tasks.filter(task => {
                      const plannedStart = parseDate(task['Start Date'] || task.Start);
                      const actualStart = parseDate(task['Actual Start']);
                      if (!plannedStart || !actualStart) return false;
                      return actualStart <= plannedStart;
                    }).length;
                    const total = content.tasks.filter(t => t['Actual Start']).length;
                    return total > 0 ? `${onTime}/${total} (${((onTime / total) * 100).toFixed(1)}%)` : 'N/A';
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tasks Finished on Time:</span>
                <span className="font-medium text-green-600">
                  {(() => {
                    const onTime = content.tasks.filter(task => {
                      const plannedFinish = parseDate(task['Finish Date'] || task.Finish);
                      const actualFinish = parseDate(task['Actual Finish']);
                      if (!plannedFinish || !actualFinish) return false;
                      return actualFinish <= plannedFinish;
                    }).length;
                    const total = content.tasks.filter(t => t['Actual Finish']).length;
                    return total > 0 ? `${onTime}/${total} (${((onTime / total) * 100).toFixed(1)}%)` : 'N/A';
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Delay (Start):</span>
                <span className="font-medium text-red-600">
                  {(() => {
                    const delays = content.tasks
                      .filter(task => task['Actual Start'] && task['Start Date'])
                      .map(task => {
                        const planned = parseDate(task['Start Date'] || task.Start);
                        const actual = parseDate(task['Actual Start']);
                        if (!planned || !actual) return 0;
                        return Math.max(0, (actual - planned) / (1000 * 60 * 60 * 24));
                      })
                      .filter(d => d > 0);

                    return delays.length > 0
                      ? delays.reduce((a, b) => a + b) / delays.length + ' days'
                      : '0 days';
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Delay (Finish):</span>
                <span className="font-medium text-red-600">
                  {(() => {
                    const delays = content.tasks
                      .filter(task => task['Actual Finish'] && task['Finish Date'])
                      .map(task => {
                        const planned = parseDate(task['Finish Date'] || task.Finish);
                        const actual = parseDate(task['Actual Finish']);
                        if (!planned || !actual) return 0;
                        return Math.max(0, (actual - planned) / (1000 * 60 * 60 * 24));
                      })
                      .filter(d => d > 0);

                    return delays.length > 0
                      ? delays.reduce((a, b) => a + b) / delays.length + ' days'
                      : '0 days';
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Duration Distribution Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-bold text-gray-700 mb-4">Task Duration Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Short (≤ 5 days)', min: 0, max: 5, color: 'bg-blue-50', textColor: 'text-blue-600' },
              { label: 'Medium (6-20 days)', min: 6, max: 20, color: 'bg-green-50', textColor: 'text-green-600' },
              { label: 'Long (21-50 days)', min: 21, max: 50, color: 'bg-yellow-50', textColor: 'text-yellow-600' },
              { label: 'Very Long (> 50 days)', min: 51, max: Infinity, color: 'bg-red-50', textColor: 'text-red-600' }
            ].map((category, index) => {
              const count = content.tasks.filter(t => {
                const duration = parseDuration(t.Duration || 0);
                return duration >= category.min && duration <= category.max;
              }).length;

              return (
                <div key={index} className={`text-center p-4 ${category.color} rounded-lg`}>
                  <div className={`text-2xl font-bold ${category.textColor}`}>
                    {count}
                  </div>
                  <div className={`text-sm ${category.textColor} mt-2`}>
                    {category.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {content.tasks.length > 0 ? ((count / content.tasks.length) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderContent = () => {
    if (!content) return null;

    return (
      <div className="space-y-8">
        {/* Clear Data Button */}
        <div className="flex justify-end">
          <button
            onClick={clearSavedData}
            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span>🗑️ Clear Current Data</span>
          </button>
        </div>

        {/* Project Overview Cards */}
        {projectStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xl font-bold text-gray-800">{projectStats.totalTasks-1}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mt-2">Total Tasks</h3>
              <p className="text-xs text-gray-500 mt-1">
                {projectStats.headingStats.totalHeadings} headings
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xl font-bold text-gray-800">{projectStats.totalResources}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mt-2">Resources</h3>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xl font-bold text-gray-800">{projectStats.totalAssignments}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mt-2">Assignments</h3>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xl font-bold text-gray-800">{projectStats.overdueTasks}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mt-2">Overdue</h3>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-xl font-bold text-gray-800">{projectStats.timelineStats.totalDays}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mt-2">Total Days</h3>
              <p className="text-xs text-gray-500 mt-1">
                {projectStats.headingStats.totalDetailTasks} detail tasks
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                📋 Task List
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'resources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                👥 Resource List
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                🔗 Assignment List
              </button>
              <button
                onClick={() => setActiveTab('gantt')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'gantt'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                📊 Gantt Chart
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                📈 Project Analysis
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'risks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                ⚠️ Risk Analysis
              </button>
              <button
                onClick={() => setActiveTab('duration')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'duration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                ⏱️ Duration Count
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'tasks' && renderTaskList()}
            {activeTab === 'resources' && renderResourceList()}
            {activeTab === 'assignments' && renderAssignmentList()}
            {activeTab === 'gantt' && (
              <GanttChart
                data={ganttData}
                projectStats={projectStats}
              />
            )}
           {activeTab === 'analysis' && (
  <ProjectAnalysis
    stats={projectStats}
    tasks={content.tasks}
    assignments={content.assignments}
    overallProgressFromAssignments={calculateOverallProgressFromAssignments}
    inProgressFromAssignments={inProgressTasksFromAssignments}
  />
)}
            {activeTab === 'risks' && renderRiskAnalysis()}
            {activeTab === 'duration' && renderDurationCount()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8 text-center">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {/* MS Project Logo using next/image */}
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4">
            <div className="relative w-16 h-16">
              <Image
                src="/Logos/MS_Project_Logo.png"
                alt="Microsoft Project Logo"
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Microsoft Project Analyzer
          </h1>
          <p className="text-gray-600">
            Upload MS Project files for complete analysis: Tasks, Resources, Assignments, Gantt Charts & Risk Analysis
          </p>
          {content && (
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-700">
                ✅ Data is saved locally. Page refresh will not clear your analysis.
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">📤 Upload Exported File</h2>

          <div className="border-3 border-dashed border-blue-400 rounded-xl p-8 md:p-12 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
            <label className="cursor-pointer block">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📁</span>
                </div>
                <div>
                  <p className="text-xl font-medium text-gray-700">Click to select exported file</p>
                  <p className="text-gray-500 mt-2">
                    Supported: .csv, .xlsx, .xls (exported from MS Project)
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                  <span>Browse Files</span>
                </div>
              </div>
            </label>
          </div>

          {loading && (
            <div className="mt-6 text-center p-6">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="font-medium text-gray-700">Processing file...</p>
              <p className="text-sm text-gray-500 mt-2">
                Analyzing tasks, resources, assignments, and risks...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">⚠️ {error}</p>
              <p className="text-sm text-red-600 mt-1">
                Make sure you're uploading a file exported from Microsoft Project (Excel or CSV format).
              </p>
            </div>
          )}

          {file && !loading && !error && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">✅ File ready: {file.name}</p>
              <p className="text-sm text-green-600 mt-1">
                Size: {(file.size / 1024).toFixed(2)} KB •
                Type: {file.name.split('.').pop().toUpperCase()} •
                {content && " Data is saved locally"}
              </p>
            </div>
          )}
        </div>

        {/* Content Display */}
        {content && !loading && renderContent()}

        {/* Instructions */}
        {!content && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Project Analysis Tool</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-700 text-sm">Task List</h4>
                <p className="text-gray-600 text-xs mt-1">ID, Name, Dates, Status</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-700 text-sm">Resource List</h4>
                <p className="text-gray-600 text-xs mt-1">ID, Name, Type, Work Status</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-700 text-sm">Assignment List</h4>
                <p className="text-gray-600 text-xs mt-1">Task, Resource, % Complete, Work</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="font-bold text-gray-700 text-sm">Risk Analysis</h4>
                <p className="text-gray-600 text-xs mt-1">High/Medium/Low risks</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Settings className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>How to Export:</strong> In MS Project, go to <strong>File → Save As → Excel Workbook</strong>. Make sure to include all columns.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Note:</strong> Your data is saved locally in your browser. It will persist even after page refresh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm">
        <p>Microsoft Project Analyzer • Complete Project Analysis Tool</p>
        <p className="mt-1">All processing happens locally in your browser • Data is saved in localStorage</p>
      </footer>
    </div>
  )
}