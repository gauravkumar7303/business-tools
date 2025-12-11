// import * as XLSX from 'xlsx';

// /**
//  * Extract COMPLETE project data from Excel files with multiple sheets
//  * @param {File} file - The uploaded Excel file
//  * @returns {Object} - Extracted data with tasks, resources, assignments
//  */
// export async function extractFromExcelOrCSV(file) {
//   const result = {
//     fileName: file.name,
//     fileType: file.name.split('.').pop().toLowerCase(),
//     tasks: [],
//     resources: [],
//     assignments: [],
//     projectInfo: {},
//     analysis: {},
//     note: '',
//     extractedSheets: [],
//     warnings: [],
//     riskAnalysis: {}
//   };

//   try {
//     const data = await file.arrayBuffer();

//     if (result.fileType === 'csv') {
//       // Handle CSV file
//       const text = new TextDecoder('utf-8').decode(data);
//       const { tasks, columns } = parseCSV(text);

//       if (tasks.length === 0) {
//         throw new Error('CSV file is empty or contains no valid data');
//       }

//       result.tasks = tasks;
//       result.columns = columns;
//       result.note = 'Extracted from CSV file';

//       // Extract project info and analysis
//       extractProjectInfo(tasks, result);
//       extractAnalysisData(tasks, result);

//     } else if (result.fileType === 'xlsx' || result.fileType === 'xls') {
//       // Handle Excel files
//       const workbook = XLSX.read(data, {
//         type: 'array',
//         cellDates: true,
//         cellNF: false,
//         cellText: false,
//         sheetStubs: false
//       });

//       console.log('📊 Excel sheets found:', workbook.SheetNames);

//       if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
//         throw new Error('Excel file contains no sheets');
//       }

//       // Check for specific sheet names from your file
//       const taskSheetName = workbook.SheetNames.find(name =>
//         name.toLowerCase().replace(/[^a-z0-9]/g, '').includes('tasktable') ||
//         name.toLowerCase().includes('task_table') ||
//         name.toLowerCase().includes('task') && !name.toLowerCase().includes('resource') && !name.toLowerCase().includes('assignment')
//       );

//       const resourceSheetName = workbook.SheetNames.find(name =>
//         name.toLowerCase().replace(/[^a-z0-9]/g, '').includes('resourcetable') ||
//         name.toLowerCase().includes('resource_table') ||
//         name.toLowerCase().includes('resource')
//       );

//       const assignmentSheetName = workbook.SheetNames.find(name =>
//         name.toLowerCase().replace(/[^a-z0-9]/g, '').includes('assignmenttable') ||
//         name.toLowerCase().includes('assignment_table') ||
//         name.toLowerCase().includes('assignment')
//       );

//       console.log('🔍 Sheet detection results:', {
//         taskSheet: taskSheetName,
//         resourceSheet: resourceSheetName,
//         assignmentSheet: assignmentSheetName,
//         allSheets: workbook.SheetNames
//       });

//       // Process Task_Table sheet
//       if (taskSheetName) {
//         const taskSheet = workbook.Sheets[taskSheetName];
//         if (taskSheet && taskSheet['!ref']) {
//           console.log(`✅ Processing Task sheet: ${taskSheetName}`);
//           processTaskSheet(taskSheet, result, taskSheetName);
//         }
//       } else {
//         // Try first sheet as task sheet
//         const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//         if (firstSheet && firstSheet['!ref']) {
//           console.log(`⚠️ No task sheet found, using first sheet: ${workbook.SheetNames[0]}`);
//           processTaskSheet(firstSheet, result, workbook.SheetNames[0]);
//         }
//       }

//       // Process Resource_Table sheet
//       if (resourceSheetName) {
//         const resourceSheet = workbook.Sheets[resourceSheetName];
//         if (resourceSheet && resourceSheet['!ref']) {
//           console.log(`✅ Processing Resource sheet: ${resourceSheetName}`);
//           processResourceSheet(resourceSheet, result, resourceSheetName);
//         }
//       } else {
//         // Check if any other sheet might be resource sheet
//         workbook.SheetNames.forEach(sheetName => {
//           if (sheetName !== taskSheetName && sheetName !== assignmentSheetName) {
//             const sheet = workbook.Sheets[sheetName];
//             if (sheet && sheet['!ref']) {
//               const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
//               if (jsonData.length > 0) {
//                 const headers = jsonData[0] || [];
//                 const headerStr = headers.join(' ').toLowerCase();
//                 if (headerStr.includes('resource') || headerStr.includes('name') || headerStr.includes('type')) {
//                   console.log(`✅ Found Resource sheet: ${sheetName}`);
//                   processResourceSheet(sheet, result, sheetName);
//                 }
//               }
//             }
//           }
//         });
//       }

//       // Process Assignment_Table sheet
//       if (assignmentSheetName) {
//         const assignmentSheet = workbook.Sheets[assignmentSheetName];
//         if (assignmentSheet && assignmentSheet['!ref']) {
//           console.log(`✅ Processing Assignment sheet: ${assignmentSheetName}`);
//           processAssignmentSheet(assignmentSheet, result, assignmentSheetName);
//         }
//       } else {
//         // Check if any other sheet might be assignment sheet
//         workbook.SheetNames.forEach(sheetName => {
//           if (sheetName !== taskSheetName && sheetName !== resourceSheetName) {
//             const sheet = workbook.Sheets[sheetName];
//             if (sheet && sheet['!ref']) {
//               const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
//               if (jsonData.length > 0) {
//                 const headers = jsonData[0] || [];
//                 const headerStr = headers.join(' ').toLowerCase();
//                 if (headerStr.includes('assignment') || headerStr.includes('task name') || headerStr.includes('resource name') || headerStr.includes('work')) {
//                   console.log(`✅ Found Assignment sheet: ${sheetName}`);
//                   processAssignmentSheet(sheet, result, sheetName);
//                 }
//               }
//             }
//           }
//         });
//       }

//       // Link data between tables
//       linkDataBetweenTables(result);

//       // Perform risk analysis
//       performRiskAnalysis(result);

//       // Extract project info and analysis
//       if (result.tasks.length > 0) {
//         extractProjectInfo(result.tasks, result);
//         extractAnalysisData(result.tasks, result);
//         result.note = `Extracted ${result.tasks.length} tasks, ${result.resources.length} resources, ${result.assignments.length} assignments`;

//         console.log('📊 Final extraction results:', {
//           tasks: result.tasks.length,
//           resources: result.resources.length,
//           assignments: result.assignments.length
//         });

//         // Show sample data
//         console.log('📋 Sample task:', result.tasks[0]);
//         if (result.resources.length > 0) console.log('👥 Sample resource:', result.resources[0]);
//         if (result.assignments.length > 0) console.log('🔗 Sample assignment:', result.assignments[0]);
//       } else {
//         throw new Error('No task data found in any sheet');
//       }

//     } else {
//       throw new Error(`Unsupported file type: ${result.fileType}`);
//     }

//     // Final validation
//     if (result.tasks.length === 0) {
//       throw new Error('No tasks could be extracted from the file');
//     }

//     console.log('🎉 Extraction successful!');

//   } catch (error) {
//     console.error('❌ Error extracting from Excel/CSV:', error);
//     throw new Error(`Failed to read file: ${error.message}`);
//   }

//   return result;
// }

// /**
//  * Process Task sheet from Excel
//  */
// function processTaskSheet(sheet, result, sheetName) {
//   try {
//     const jsonData = XLSX.utils.sheet_to_json(sheet, {
//       defval: '',
//       raw: false,
//       header: 1
//     });
    
//     if (!jsonData || jsonData.length < 2) {
//       console.warn(`Task sheet "${sheetName}" has insufficient data`);
//       return;
//     }
    
//     const headers = jsonData[0] || [];
//     const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
//     console.log(`📋 Task sheet headers:`, cleanedHeaders.filter(h => h));
    
//     const tasks = [];
    
//     // YOUR SPECIFIC COLUMN MAPPING
//     const columnMapping = {
//       'ID': ['ID', 'Id', 'Task ID', 'Task_ID'],
//       'Name': ['Name', 'Task Name', 'Task_Name', 'Task'],
//       'Start Date': ['Start Date', 'Start_Date', 'Start', 'Begin'],
//       'Finish Date': ['Finish Date', 'Finish_Date', 'Finish', 'End'],
//       'Actual Start': ['Actual_Start', 'Actual Start', 'Actual Start Date'],
//       'Actual Finish': ['Actual_Finish', 'Actual Finish', 'Actual Finish Date'],
//       'Duration': ['Duration'],
//       'Outline Level': ['Outline_Level', 'Outline Level', 'Level'],
//       'Predecessors': ['Predecessors'],
//       'Task_Mode': ['Task_Mode', 'Task Mode', 'Mode'],
//       'Active': ['Active', 'Status']
//     };
    
//     // Normalize headers to standard names
//     const normalizedHeaders = cleanedHeaders.map(header => {
//       for (const [standardName, possibleNames] of Object.entries(columnMapping)) {
//         if (possibleNames.includes(header)) {
//           return standardName;
//         }
//       }
//       return header; // Keep original if no match
//     });
    
//     console.log(`📋 Normalized headers:`, normalizedHeaders.filter(h => h));
    
//     for (let i = 1; i < jsonData.length; i++) {
//       const row = jsonData[i];
//       const task = {};
//       let hasData = false;
      
//       normalizedHeaders.forEach((header, index) => {
//         if (header && header !== '' && index < row.length) {
//           let value = row[index];
//           value = cleanExcelValue(value);
          
//           if (value !== '') {
//             task[header] = value;
//             hasData = true;
//           }
//         }
//       });
      
//       if (hasData && Object.keys(task).length > 0) {
//         // Ensure required fields exist
//         if (!task.ID) {
//           task.ID = tasks.length + 1;
//         }
        
//         if (!task.Name) {
//           task.Name = `Task ${task.ID}`;
//         }
        
//         // Check Outline Level for heading status
//         if (task['Outline Level']) {
//           const outlineLevel = parseInt(task['Outline Level']);
//           task.isHeading = outlineLevel === 1;
//           task.outlineLevel = outlineLevel;
//         } else {
//           task.outlineLevel = 0;
//         }
        
//         tasks.push(task);
//       }
//     }
    
//     if (tasks.length > 0) {
//       result.tasks = tasks;
//       result.extractedSheets.push(`${sheetName} (${tasks.length} tasks)`);
//       console.log(`✅ Extracted ${tasks.length} tasks from "${sheetName}"`);
      
//       // Debug: Show first few tasks
//       console.log('🔍 Sample extracted tasks:', tasks.slice(0, 3));
//     }
    
//   } catch (error) {
//     console.error(`Error processing task sheet "${sheetName}":`, error);
//   }
// }

// /**
//  * Process Resource sheet from Excel
//  */
// function processResourceSheet(sheet, result, sheetName) {
//   try {
//     const jsonData = XLSX.utils.sheet_to_json(sheet, {
//       defval: '',
//       raw: false,
//       header: 1
//     });

//     if (!jsonData || jsonData.length < 2) {
//       console.warn(`Resource sheet "${sheetName}" has insufficient data`);
//       return;
//     }

//     const headers = jsonData[0] || [];
//     const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');

//     console.log(`👥 Resource sheet headers:`, cleanedHeaders.filter(h => h));

//     const resources = [];

//     for (let i = 1; i < jsonData.length; i++) {
//       const row = jsonData[i];
//       const resource = {};
//       let hasData = false;

//       cleanedHeaders.forEach((header, index) => {
//         if (header && header !== '' && index < row.length) {
//           let value = row[index];
//           value = cleanExcelValue(value);

//           if (value !== '') {
//             resource[header] = value;
//             hasData = true;
//           }
//         }
//       });

//       if (hasData && Object.keys(resource).length > 0) {
//         // Ensure ID field exists
//         if (!resource.ID && !resource.Id && !resource.id) {
//           resource.ID = resources.length + 1;
//         }

//         // Ensure Name field exists
//         if (!resource.Name && !resource['Resource Name']) {
//           const possibleNameKeys = Object.keys(resource).filter(key =>
//             key.toLowerCase().includes('name') ||
//             key.toLowerCase().includes('resource')
//           );
//           if (possibleNameKeys.length > 0) {
//             resource.Name = resource[possibleNameKeys[0]];
//           } else {
//             resource.Name = `Resource ${resource.ID}`;
//           }
//         }

//         resources.push(resource);
//       }
//     }

//     if (resources.length > 0) {
//       result.resources = resources;
//       result.extractedSheets.push(`${sheetName} (${resources.length} resources)`);
//       console.log(`✅ Extracted ${resources.length} resources from "${sheetName}"`);
//     }

//   } catch (error) {
//     console.error(`Error processing resource sheet "${sheetName}":`, error);
//   }
// }

// /**
//  * Process Assignment sheet from Excel
//  */
// function processAssignmentSheet(sheet, result, sheetName) {
//   try {
//     const jsonData = XLSX.utils.sheet_to_json(sheet, {
//       defval: '',
//       raw: false,
//       header: 1
//     });
    
//     if (!jsonData || jsonData.length < 2) {
//       console.warn(`Assignment sheet "${sheetName}" has insufficient data`);
//       return;
//     }
    
//     const headers = jsonData[0] || [];
//     const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
//     console.log(`🔗 Assignment sheet headers:`, cleanedHeaders.filter(h => h));
    
//     // Normalize assignment headers
//     const assignmentMapping = {
//       'Task Name': ['Task_Name', 'Task Name', 'Task', 'Activity'],
//       'Resource Name': ['Resource_Name', 'Resource Name', 'Resource', 'Assigned To'],
//       'Percent Work Complete': ['Percent_Work_Complete', 'Percent Work Complete', '% Work Complete', 'Progress'],
//       'Scheduled Work': ['Scheduled_Work', 'Scheduled Work', 'Work'],
//       'Units': ['Units', 'Unit']
//     };
    
//     const normalizedHeaders = cleanedHeaders.map(header => {
//       for (const [standardName, possibleNames] of Object.entries(assignmentMapping)) {
//         if (possibleNames.includes(header)) {
//           return standardName;
//         }
//       }
//       return header;
//     });
    
//     console.log(`🔗 Normalized assignment headers:`, normalizedHeaders.filter(h => h));
    
//     const assignments = [];
    
//     for (let i = 1; i < jsonData.length; i++) {
//       const row = jsonData[i];
//       const assignment = {};
//       let hasData = false;
      
//       normalizedHeaders.forEach((header, index) => {
//         if (header && header !== '' && index < row.length) {
//           let value = row[index];
//           value = cleanExcelValue(value);
          
//           if (value !== '') {
//             assignment[header] = value;
//             hasData = true;
//           }
//         }
//       });
      
//       if (hasData && Object.keys(assignment).length > 0) {
//         assignments.push(assignment);
//       }
//     }
    
//     if (assignments.length > 0) {
//       result.assignments = assignments;
//       result.extractedSheets.push(`${sheetName} (${assignments.length} assignments)`);
//       console.log(`✅ Extracted ${assignments.length} assignments from "${sheetName}"`);
      
//       // Debug: Show assignments
//       console.log('🔍 Sample assignments:', assignments.slice(0, 3));
//     }
    
//   } catch (error) {
//     console.error(`Error processing assignment sheet "${sheetName}":`, error);
//   }
// }

// /**
//  * Link data between tables
//  */
// function linkDataBetweenTables(result) {
//   console.log('🔗 Linking data between tables...');

//   // Link tasks with assignments
//   if (result.assignments.length > 0) {
//     result.tasks.forEach(task => {
//       const taskName = task.Name || task['Task Name'] || task.Task;
//       if (taskName) {
//         // Find assignments for this task
//         task.Assignments = result.assignments.filter(assignment => {
//           const assignmentTaskName = assignment['Task Name'] || assignment.Task || assignment['Task'];
//           return assignmentTaskName &&
//             assignmentTaskName.toString().trim() === taskName.toString().trim();
//         });
//       }
//     });
//   }

//   // Link resources with assignments
//   if (result.assignments.length > 0) {
//     result.resources.forEach(resource => {
//       const resourceName = resource.Name || resource['Resource Name'];
//       if (resourceName) {
//         // Find assignments for this resource
//         resource.Assignments = result.assignments.filter(assignment => {
//           const assignmentResourceName = assignment['Resource Name'] || assignment.Resource || assignment['Assigned To'];
//           return assignmentResourceName &&
//             assignmentResourceName.toString().trim() === resourceName.toString().trim();
//         });
//       }
//     });
//   }

//   console.log('✅ Data linking completed');
// }

// /**
//  * Perform risk analysis
//  */
// // function performRiskAnalysis(result) {
// //   const risks = [];
// //   const today = new Date();
// //   today.setHours(0, 0, 0, 0);

// //   // Analyze task risks
// //   result.tasks.forEach(task => {
// //     const risk = {
// //       taskId: task.ID || task.Id || 'Unknown',
// //       taskName: task.Name || task['Task Name'] || 'Unnamed Task',
// //       riskLevel: 'Low',
// //       riskType: '',
// //       description: ''
// //     };

// //     // Check for overdue tasks
// //     const finishDate = parseDateString(task['Finish Date'] || task.Finish || task.End);
// //     const completion = parseFloat(task['% Complete']) || parseFloat(task['% Work Complete']) || 0;

// //     if (finishDate && finishDate < today && completion < 100) {
// //       const daysOverdue = Math.ceil((today - finishDate) / (1000 * 60 * 60 * 24));
// //       risk.riskLevel = 'High';
// //       risk.riskType = 'Schedule';
// //       risk.description = `Task is ${daysOverdue} day(s) overdue`;
// //       risks.push({...risk});
// //     }

// //     // Check for tasks without resources
// //     if ((!task.Assignments || task.Assignments.length === 0) && completion < 100) {
// //       risk.riskLevel = 'Medium';
// //       risk.riskType = 'Resource';
// //       risk.description = 'Task has no assigned resources';
// //       risks.push({...risk});
// //     }
// //   });

// //   // Calculate risk statistics
// //   const highRisks = risks.filter(r => r.riskLevel === 'High').length;
// //   const mediumRisks = risks.filter(r => r.riskLevel === 'Medium').length;
// //   const lowRisks = risks.filter(r => r.riskLevel === 'Low').length;

// //   result.riskAnalysis = {
// //     risks,
// //     statistics: {
// //       total: risks.length,
// //       high: highRisks,
// //       medium: mediumRisks,
// //       low: lowRisks
// //     }
// //   };
// // }
// /**
//  * Perform risk analysis
//  */
// function performRiskAnalysis(result) {
//   const risks = [];
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Analyze task risks
//   result.tasks.forEach(task => {
//     const risk = {
//       taskId: task.ID || task.Id || 'Unknown',
//       taskName: task.Name || task['Task Name'] || 'Unnamed Task',
//       riskLevel: 'Low',
//       riskType: '',
//       description: ''
//     };

//     // Get Outline Level value
//     const outlineLevel = parseInt(task['Outline Level'] || task['OutlineLevel'] || task['Outline Number'] || 0);

//     // Check for overdue tasks
//     const finishDate = parseDateString(task['Finish Date'] || task.Finish || task.End);
//     const completion = parseFloat(task['% Complete']) || parseFloat(task['% Work Complete']) || 0;

//     if (finishDate && finishDate < today && completion < 100) {
//       const daysOverdue = Math.ceil((today - finishDate) / (1000 * 60 * 60 * 24));
//       risk.riskLevel = 'High';
//       risk.riskType = 'Schedule';
//       risk.description = `Task is ${daysOverdue} day(s) overdue`;
//       risks.push({ ...risk });
//     }

//     // Check for tasks without resources - BUT EXCLUDE OUTLINE LEVEL 1 TASKS
//     if ((!task.Assignments || task.Assignments.length === 0) && completion < 100) {
//       // Only flag as risk if NOT a heading (Outline Level not equal to 1)
//       if (outlineLevel !== 1) {
//         risk.riskLevel = 'Medium';
//         risk.riskType = 'Resource';
//         risk.description = 'Task has no assigned resources';
//         risks.push({ ...risk });
//       } else {
//         console.log(`ℹ️ Skipping resource check for heading task: "${risk.taskName}" (Outline Level = 1)`);
//       }
//     }
//   });

//   // Calculate risk statistics
//   const highRisks = risks.filter(r => r.riskLevel === 'High').length;
//   const mediumRisks = risks.filter(r => r.riskLevel === 'Medium').length;
//   const lowRisks = risks.filter(r => r.riskLevel === 'Low').length;

//   result.riskAnalysis = {
//     risks,
//     statistics: {
//       total: risks.length,
//       high: highRisks,
//       medium: mediumRisks,
//       low: lowRisks
//     }
//   };
// }

// /**
//  * Clean Excel cell values
//  */
// function cleanExcelValue(value) {
//   if (value === null || value === undefined) {
//     return '';
//   }

//   // Handle dates
//   if (value instanceof Date) {
//     return value.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   }

//   // Handle Excel serial numbers (dates)
//   if (typeof value === 'number' && value > 25569) {
//     try {
//       const date = new Date(Math.round((value - 25569) * 86400 * 1000));
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: '2-digit',
//           year: 'numeric'
//         });
//       }
//     } catch (e) {
//       // Keep as number
//     }
//   }

//   // Handle percentages
//   if (typeof value === 'string' && value.includes('%')) {
//     const num = parseFloat(value.replace('%', ''));
//     if (!isNaN(num)) {
//       return num;
//     }
//   }

//   // Handle boolean-like values
//   if (typeof value === 'string') {
//     const lowerVal = value.toLowerCase().trim();
//     if (lowerVal === 'yes' || lowerVal === 'true') return true;
//     if (lowerVal === 'no' || lowerVal === 'false') return false;
//   }

//   // Convert to string and trim
//   const strValue = value.toString().trim();

//   // Handle empty strings or whitespace
//   if (strValue === '' || strValue.replace(/\s/g, '') === '') {
//     return '';
//   }

//   return strValue;
// }

// /**
//  * Parse date string to Date object
//  */
// function parseDateString(dateStr) {
//   if (!dateStr) return null;

//   try {
//     if (dateStr instanceof Date) {
//       return dateStr;
//     }

//     const str = String(dateStr).trim();

//     const formats = [
//       // dd/mm/yyyy or dd-mm-yyyy
//       { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parts: [2, 1, 0] },
//       // yyyy-mm-dd
//       { regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/, parts: [0, 1, 2] },
//       // mm/dd/yyyy
//       { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parts: [2, 0, 1] }
//     ];

//     for (const format of formats) {
//       const match = str.match(format.regex);
//       if (match) {
//         const year = parseInt(match[format.parts[0] + 1]);
//         const month = parseInt(match[format.parts[1] + 1]) - 1;
//         const day = parseInt(match[format.parts[2] + 1]);

//         const date = new Date(year, month, day);
//         if (!isNaN(date.getTime())) {
//           return date;
//         }
//       }
//     }

//     const date = new Date(str);
//     if (!isNaN(date.getTime())) {
//       return date;
//     }
//   } catch (e) {
//     console.warn('Failed to parse date:', dateStr, e);
//   }

//   return null;
// }

// /**
//  * Parse duration string to number of days
//  */
// function parseDuration(durationStr) {
//   if (!durationStr) return 0;

//   const str = String(durationStr).toLowerCase().trim();

//   // Extract number and unit
//   const match = str.match(/(\d+(\.\d+)?)\s*([dwmh]?)/);
//   if (match) {
//     const value = parseFloat(match[1]);
//     const unit = match[3];

//     switch (unit) {
//       case 'h': return value / 8; // hours to work days
//       case 'd': return value;
//       case 'w': return value * 5; // weeks to work days
//       case 'm': return value * 20; // months to work days
//       default: return value; // assume days
//     }
//   }

//   // Try to extract just the number
//   const numMatch = str.match(/\d+(\.\d+)?/);
//   return numMatch ? parseFloat(numMatch[0]) : 0;
// }

// /**
//  * Parse CSV text into tasks and columns
//  */
// function parseCSV(csvText) {
//   csvText = csvText.trim();

//   if (!csvText) {
//     return { tasks: [], columns: [] };
//   }

//   const lines = csvText.split('\n').filter(line => line.trim() !== '');

//   if (lines.length === 0) {
//     return { tasks: [], columns: [] };
//   }

//   const headers = parseCSVLine(lines[0]).map(h => h.trim());
//   const validHeaders = headers.filter(h => h !== '');

//   if (validHeaders.length === 0) {
//     return { tasks: [], columns: [] };
//   }

//   const tasks = [];

//   for (let i = 1; i < lines.length; i++) {
//     const values = parseCSVLine(lines[i]);
//     const task = {};
//     let hasData = false;

//     validHeaders.forEach((header, index) => {
//       if (index < values.length) {
//         let value = values[index] || '';
//         value = value.trim();

//         if (value !== '') {
//           if (!isNaN(value) && value !== '') {
//             value = parseFloat(value);
//           } else if (value.endsWith('%')) {
//             const num = parseFloat(value);
//             if (!isNaN(num)) {
//               value = num;
//             }
//           }

//           task[header] = value;
//           hasData = true;
//         }
//       }
//     });

//     if (hasData && Object.keys(task).length > 0) {
//       tasks.push(task);
//     }
//   }

//   return {
//     tasks,
//     columns: validHeaders
//   };
// }

// /**
//  * Parse a CSV line considering quoted fields
//  */
// function parseCSVLine(line) {
//   const result = [];
//   let current = '';
//   let inQuotes = false;
//   let quoteChar = null;

//   for (let i = 0; i < line.length; i++) {
//     const char = line[i];

//     if ((char === '"' || char === "'") && !inQuotes) {
//       inQuotes = true;
//       quoteChar = char;
//     } else if (char === quoteChar && inQuotes) {
//       if (i + 1 < line.length && line[i + 1] === quoteChar) {
//         current += quoteChar;
//         i++;
//       } else {
//         inQuotes = false;
//       }
//     } else if (char === ',' && !inQuotes) {
//       result.push(current);
//       current = '';
//     } else {
//       current += char;
//     }
//   }

//   result.push(current);

//   return result.map(field => {
//     field = field.trim();

//     if ((field.startsWith('"') && field.endsWith('"')) ||
//       (field.startsWith("'") && field.endsWith("'"))) {
//       field = field.slice(1, -1);
//     }

//     return field;
//   });
// }
// /**
//  * Extract project information from tasks
//  */
// function extractProjectInfo(tasks, result) {
//   if (!tasks || tasks.length === 0) return;

//   // Find project title
//   const firstFewTasks = tasks.slice(0, Math.min(5, tasks.length));

//   for (const task of firstFewTasks) {
//     const potentialTitleFields = ['Project', 'Project Title', 'Title', 'Project Name', 'Task Name', 'Name'];

//     for (const field of potentialTitleFields) {
//       if (task[field] && typeof task[field] === 'string') {
//         const value = task[field].trim();
//         if (value && value.length < 100) {
//           result.projectInfo.title = value;
//           break;
//         }
//       }
//     }

//     if (result.projectInfo.title) break;
//   }

//   if (!result.projectInfo.title) {
//     result.projectInfo.title = result.fileName.replace(/\.[^/.]+$/, '');
//   }

//   // Find earliest start date and latest finish date across ALL tasks
//   let earliestStart = null;
//   let latestFinish = null;

//   tasks.forEach(task => {
//     // Find start date from various possible field names
//     const startFields = ['Start Date', 'Start', 'Begin', 'Baseline Start', 'Actual Start'];
//     for (const field of startFields) {
//       if (task[field]) {
//         const date = parseDateString(task[field]);
//         if (date) {
//           if (!earliestStart || date < earliestStart) {
//             earliestStart = date;
//           }
//           break;
//         }
//       }
//     }

//     // Find finish date from various possible field names
//     const finishFields = ['Finish Date', 'Finish', 'End', 'Baseline Finish', 'Actual Finish'];
//     for (const field of finishFields) {
//       if (task[field]) {
//         const date = parseDateString(task[field]);
//         if (date) {
//           if (!latestFinish || date > latestFinish) {
//             latestFinish = date;
//           }
//           break;
//         }
//       }
//     }
//   });

//   // Calculate project duration based on earliest start and latest finish
//   if (earliestStart) {
//     result.projectInfo.startDate = earliestStart.toLocaleDateString('en-IN');
//     result.projectInfo.rawStartDate = earliestStart;
//   }

//   if (latestFinish) {
//     result.projectInfo.finishDate = latestFinish.toLocaleDateString('en-IN');
//     result.projectInfo.rawFinishDate = latestFinish;
//   }

//   if (earliestStart && latestFinish) {
//     const durationMs = latestFinish.getTime() - earliestStart.getTime();
//     const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
//     result.projectInfo.durationDays = durationDays;

//     // Also calculate working days (excluding weekends)
//     const workingDays = calculateWorkingDays(earliestStart, latestFinish);
//     result.projectInfo.workingDays = workingDays;
//   }

//   result.projectInfo.totalTasks = tasks.length;

//   console.log('📅 Project Duration Calculation:', {
//     earliestStart: earliestStart ? earliestStart.toLocaleDateString() : 'N/A',
//     latestFinish: latestFinish ? latestFinish.toLocaleDateString() : 'N/A',
//     durationDays: result.projectInfo.durationDays || 'N/A'
//   });
// }

// /**
//  * Calculate working days between two dates (excluding weekends)
//  */
// function calculateWorkingDays(startDate, endDate) {
//   if (!startDate || !endDate) return 0;

//   let count = 0;
//   const current = new Date(startDate);
//   const end = new Date(endDate);

//   while (current <= end) {
//     const dayOfWeek = current.getDay();
//     // Sunday = 0, Saturday = 6
//     if (dayOfWeek !== 0 && dayOfWeek !== 6) {
//       count++;
//     }
//     current.setDate(current.getDate() + 1);
//   }

//   return count;
// }
// // /**
// //  * Extract analysis data for charts and statistics
// //  */
// // function extractAnalysisData(tasks, result) {
// //   if (!tasks || tasks.length === 0) return;

// //   const analysis = {
// //     completionStats: {
// //       totalTasks: tasks.length,
// //       completedTasks: 0,
// //       inProgressTasks: 0,
// //       notStartedTasks: 0,
// //       overdueTasks: 0,
// //       totalCompletion: 0,
// //       avgCompletion: 0
// //     },
// //     resourceStats: {},
// //     durationStats: {
// //       totalDuration: 0,
// //       avgDuration: 0,
// //       minDuration: Infinity,
// //       maxDuration: 0,
// //       taskCount: 0
// //     }
// //   };

// //   const today = new Date();
// //   today.setHours(0, 0, 0, 0);

// //   tasks.forEach(task => {
// //     const completionFields = ['% Complete', 'Progress', 'Percent Complete', 'Complete', '% Work Complete'];
// //     let completion = 0;

// //     for (const field of completionFields) {
// //       if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
// //         const value = parseFloat(task[field]);
// //         if (!isNaN(value)) {
// //           completion = Math.min(100, Math.max(0, value));
// //           break;
// //         }
// //       }
// //     }

// //     analysis.completionStats.totalCompletion += completion;

// //     if (completion >= 100) {
// //       analysis.completionStats.completedTasks++;
// //     } else if (completion > 0) {
// //       analysis.completionStats.inProgressTasks++;
// //     } else {
// //       analysis.completionStats.notStartedTasks++;
// //     }

// //     // Check for overdue tasks
// //     const endFields = ['Finish Date', 'Finish', 'End'];
// //     let isOverdue = false;

// //     for (const field of endFields) {
// //       if (task[field]) {
// //         const endDate = parseDateString(task[field]);
// //         if (endDate && endDate < today && completion < 100) {
// //           isOverdue = true;
// //           break;
// //         }
// //       }
// //     }

// //     if (isOverdue) {
// //       analysis.completionStats.overdueTasks++;
// //     }

// //     // Get duration
// //     const durationFields = ['Duration', 'Total Duration', 'Work'];
// //     let duration = 0;

// //     for (const field of durationFields) {
// //       if (task[field]) {
// //         const parsed = parseDuration(task[field]);
// //         if (parsed > 0) {
// //           duration = parsed;
// //           break;
// //         }
// //       }
// //     }

// //     if (duration > 0) {
// //       analysis.durationStats.totalDuration += duration;
// //       analysis.durationStats.minDuration = Math.min(analysis.durationStats.minDuration, duration);
// //       analysis.durationStats.maxDuration = Math.max(analysis.durationStats.maxDuration, duration);
// //       analysis.durationStats.taskCount++;
// //     }

// //     // Get resources
// //     const resourceFields = ['Resource Names', 'Resources', 'Resource', 'Assigned To'];
// //     for (const field of resourceFields) {
// //       if (task[field]) {
// //         const resources = String(task[field]).split(/[,;]/).map(r => r.trim()).filter(r => r);

// //         resources.forEach(resource => {
// //           if (!analysis.resourceStats[resource]) {
// //             analysis.resourceStats[resource] = {
// //               taskCount: 0,
// //               totalCompletion: 0,
// //               totalDuration: 0
// //             };
// //           }

// //           analysis.resourceStats[resource].taskCount++;
// //           analysis.resourceStats[resource].totalCompletion += completion;
// //           analysis.resourceStats[resource].totalDuration += duration;
// //         });

// //         break;
// //       }
// //     }
// //   });

// //   // Calculate averages
// //   analysis.completionStats.avgCompletion = analysis.completionStats.totalTasks > 0
// //     ? analysis.completionStats.totalCompletion / analysis.completionStats.totalTasks
// //     : 0;

// //   analysis.durationStats.avgDuration = analysis.durationStats.taskCount > 0
// //     ? analysis.durationStats.totalDuration / analysis.durationStats.taskCount
// //     : 0;

// //   if (analysis.durationStats.minDuration === Infinity) {
// //     analysis.durationStats.minDuration = 0;
// //   }

// //   result.analysis = analysis;
// // }
// /**
//  * Extract analysis data for charts and statistics
//  */
// function extractAnalysisData(tasks, result) {
//   if (!tasks || tasks.length === 0) return;

//   const analysis = {
//     completionStats: {
//       totalTasks: tasks.length,
//       completedTasks: 0,
//       inProgressTasks: 0,
//       notStartedTasks: 0,
//       overdueTasks: 0,
//       totalCompletion: 0,
//       avgCompletion: 0
//     },
//     resourceStats: {},
//     durationStats: {
//       totalDuration: 0,
//       avgDuration: 0,
//       minDuration: Infinity,
//       maxDuration: 0,
//       taskCount: 0,
//       // Add project duration based on start and end dates
//       projectDuration: result.projectInfo.durationDays || 0,
//       projectWorkingDays: result.projectInfo.workingDays || 0
//     }
//   };

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   tasks.forEach(task => {
//     const completionFields = ['% Complete', 'Progress', 'Percent Complete', 'Complete', '% Work Complete'];
//     let completion = 0;

//     for (const field of completionFields) {
//       if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
//         const value = parseFloat(task[field]);
//         if (!isNaN(value)) {
//           completion = Math.min(100, Math.max(0, value));
//           break;
//         }
//       }
//     }

//     analysis.completionStats.totalCompletion += completion;

//     if (completion >= 100) {
//       analysis.completionStats.completedTasks++;
//     } else if (completion > 0) {
//       analysis.completionStats.inProgressTasks++;
//     } else {
//       analysis.completionStats.notStartedTasks++;
//     }

//     // Check for overdue tasks
//     const endFields = ['Finish Date', 'Finish', 'End'];
//     let isOverdue = false;

//     for (const field of endFields) {
//       if (task[field]) {
//         const endDate = parseDateString(task[field]);
//         if (endDate && endDate < today && completion < 100) {
//           isOverdue = true;
//           break;
//         }
//       }
//     }

//     if (isOverdue) {
//       analysis.completionStats.overdueTasks++;
//     }

//     // Get individual task duration (for average calculation)
//     const durationFields = ['Duration', 'Total Duration', 'Work'];
//     let duration = 0;

//     for (const field of durationFields) {
//       if (task[field]) {
//         const parsed = parseDuration(task[field]);
//         if (parsed > 0) {
//           duration = parsed;
//           break;
//         }
//       }
//     }

//     if (duration > 0) {
//       analysis.durationStats.totalDuration += duration;
//       analysis.durationStats.minDuration = Math.min(analysis.durationStats.minDuration, duration);
//       analysis.durationStats.maxDuration = Math.max(analysis.durationStats.maxDuration, duration);
//       analysis.durationStats.taskCount++;
//     }

//     // Get resources
//     const resourceFields = ['Resource Names', 'Resources', 'Resource', 'Assigned To'];
//     for (const field of resourceFields) {
//       if (task[field]) {
//         const resources = String(task[field]).split(/[,;]/).map(r => r.trim()).filter(r => r);

//         resources.forEach(resource => {
//           if (!analysis.resourceStats[resource]) {
//             analysis.resourceStats[resource] = {
//               taskCount: 0,
//               totalCompletion: 0,
//               totalDuration: 0
//             };
//           }

//           analysis.resourceStats[resource].taskCount++;
//           analysis.resourceStats[resource].totalCompletion += completion;
//           analysis.resourceStats[resource].totalDuration += duration;
//         });

//         break;
//       }
//     }
//   });

//   // Calculate averages
//   analysis.completionStats.avgCompletion = analysis.completionStats.totalTasks > 0
//     ? analysis.completionStats.totalCompletion / analysis.completionStats.totalTasks
//     : 0;

//   analysis.durationStats.avgDuration = analysis.durationStats.taskCount > 0
//     ? analysis.durationStats.totalDuration / analysis.durationStats.taskCount
//     : 0;

//   if (analysis.durationStats.minDuration === Infinity) {
//     analysis.durationStats.minDuration = 0;
//   }

//   // Log the duration information
//   console.log('📊 Duration Analysis:', {
//     projectDurationDays: analysis.durationStats.projectDuration,
//     projectWorkingDays: analysis.durationStats.projectWorkingDays,
//     totalTaskDuration: analysis.durationStats.totalDuration,
//     avgTaskDuration: analysis.durationStats.avgDuration
//   });

//   result.analysis = analysis;
// }
//right code

// // export default extractFromExcelOrCSV;
// import * as XLSX from 'xlsx';

// /**
//  * Extract COMPLETE project data from Excel files with multiple sheets
//  * @param {File} file - The uploaded Excel file
//  * @returns {Object} - Extracted data with tasks, resources, assignments
//  */
// export async function extractFromExcelOrCSV(file) {
//   const result = {
//     fileName: file.name,
//     fileType: file.name.split('.').pop().toLowerCase(),
//     tasks: [],
//     resources: [],
//     assignments: [],
//     projectInfo: {},
//     analysis: {},
//     note: '',
//     extractedSheets: [],
//     warnings: [],
//     riskAnalysis: {}
//   };

//   try {
//     const data = await file.arrayBuffer();
    
//     if (result.fileType === 'csv') {
//       // Handle CSV file
//       const text = new TextDecoder('utf-8').decode(data);
//       const { tasks, columns } = parseCSV(text);
      
//       if (tasks.length === 0) {
//         throw new Error('CSV file is empty or contains no valid data');
//       }
      
//       result.tasks = tasks;
//       result.columns = columns;
//       result.note = 'Extracted from CSV file';
      
//       // Extract project info and analysis
//       extractProjectInfo(tasks, result);
//       extractAnalysisData(tasks, result);
      
//     } else if (result.fileType === 'xlsx' || result.fileType === 'xls') {
//       // Handle Excel files
//       const workbook = XLSX.read(data, { 
//         type: 'array',
//         cellDates: true,
//         cellNF: false,
//         cellText: false,
//         sheetStubs: false
//       });
      
//       console.log('📊 Excel sheets found:', workbook.SheetNames);
      
//       if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
//         throw new Error('Excel file contains no sheets');
//       }

//       // DEBUG: List all sheets with first few rows
//       workbook.SheetNames.forEach((sheetName, index) => {
//         const sheet = workbook.Sheets[sheetName];
//         if (sheet && sheet['!ref']) {
//           const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
//           console.log(`Sheet ${index}: "${sheetName}"`, {
//             hasRef: !!sheet['!ref'],
//             rows: jsonData.length,
//             headers: jsonData[0] || []
//           });
//         }
//       });

//       // SMART SHEET DETECTION
//       let taskSheetName = null;
//       let resourceSheetName = null;
//       let assignmentSheetName = null;

//       // Method 1: Look for exact sheet names
//       workbook.SheetNames.forEach(name => {
//         const lowerName = name.toLowerCase();
        
//         if (lowerName.includes('task') && !taskSheetName) {
//           taskSheetName = name;
//         }
//         if (lowerName.includes('resource') && !resourceSheetName) {
//           resourceSheetName = name;
//         }
//         if (lowerName.includes('assignment') && !assignmentSheetName) {
//           assignmentSheetName = name;
//         }
//       });

//       // Method 2: If not found, check content
//       if (!taskSheetName) {
//         workbook.SheetNames.forEach(name => {
//           const sheet = workbook.Sheets[name];
//           if (sheet && sheet['!ref']) {
//             const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
//             if (jsonData.length > 1) {
//               const headers = jsonData[0] || [];
//               const headerStr = headers.join(' ').toLowerCase();
              
//               // Check for task-like headers
//               if (headerStr.includes('id') && (headerStr.includes('task') || headerStr.includes('name'))) {
//                 taskSheetName = name;
//                 console.log(`✅ Found Task sheet by content: ${name}`);
//               }
//             }
//           }
//         });
//       }

//       // Method 3: Use first sheet as task sheet if still not found
//       if (!taskSheetName && workbook.SheetNames.length > 0) {
//         taskSheetName = workbook.SheetNames[0];
//         console.log(`⚠️ Using first sheet as task sheet: ${taskSheetName}`);
//       }

//       console.log('🔍 Final sheet detection:', {
//         taskSheet: taskSheetName,
//         resourceSheet: resourceSheetName,
//         assignmentSheet: assignmentSheetName
//       });

//       // Process Task_Table sheet
//       if (taskSheetName) {
//         const taskSheet = workbook.Sheets[taskSheetName];
//         if (taskSheet && taskSheet['!ref']) {
//           console.log(`✅ Processing Task sheet: ${taskSheetName}`);
//           processTaskSheet(taskSheet, result, taskSheetName);
//         }
//       } else {
//         throw new Error('No task sheet could be identified');
//       }

//       // Process Resource_Table sheet
//       if (resourceSheetName) {
//         const resourceSheet = workbook.Sheets[resourceSheetName];
//         if (resourceSheet && resourceSheet['!ref']) {
//           console.log(`✅ Processing Resource sheet: ${resourceSheetName}`);
//           processResourceSheet(resourceSheet, result, resourceSheetName);
//         }
//       } else {
//         // Try to find resource sheet
//         workbook.SheetNames.forEach(sheetName => {
//           if (sheetName !== taskSheetName && !assignmentSheetName) {
//             const sheet = workbook.Sheets[sheetName];
//             if (sheet && sheet['!ref']) {
//               const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
//               if (jsonData.length > 1) {
//                 const headers = jsonData[0] || [];
//                 const headerStr = headers.join(' ').toLowerCase();
//                 if (headerStr.includes('resource') || headerStr.includes('type') || headerStr.includes('rate')) {
//                   console.log(`✅ Found Resource sheet by content: ${sheetName}`);
//                   processResourceSheet(sheet, result, sheetName);
//                 }
//               }
//             }
//           }
//         });
//       }

//       // Process Assignment_Table sheet
//       if (assignmentSheetName) {
//         const assignmentSheet = workbook.Sheets[assignmentSheetName];
//         if (assignmentSheet && assignmentSheet['!ref']) {
//           console.log(`✅ Processing Assignment sheet: ${assignmentSheetName}`);
//           processAssignmentSheet(assignmentSheet, result, assignmentSheetName);
//         }
//       } else {
//         // Try to find assignment sheet
//         workbook.SheetNames.forEach(sheetName => {
//           if (sheetName !== taskSheetName && sheetName !== resourceSheetName) {
//             const sheet = workbook.Sheets[sheetName];
//             if (sheet && sheet['!ref']) {
//               const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
//               if (jsonData.length > 1) {
//                 const headers = jsonData[0] || [];
//                 const headerStr = headers.join(' ').toLowerCase();
//                 if (headerStr.includes('task') && headerStr.includes('resource') && headerStr.includes('work')) {
//                   console.log(`✅ Found Assignment sheet by content: ${sheetName}`);
//                   processAssignmentSheet(sheet, result, sheetName);
//                 }
//               }
//             }
//           }
//         });
//       }
      
//       // Link data between tables
//       linkDataBetweenTables(result);
      
//       // Perform risk analysis
//       performRiskAnalysis(result);
      
//       // Extract project info and analysis
//       if (result.tasks.length > 0) {
//         extractProjectInfo(result.tasks, result);
//         extractAnalysisData(result.tasks, result);
//         result.note = `Extracted ${result.tasks.length} tasks, ${result.resources.length} resources, ${result.assignments.length} assignments`;
        
//         console.log('📊 Final extraction results:', {
//           tasks: result.tasks.length,
//           resources: result.resources.length,
//           assignments: result.assignments.length
//         });
        
//         // Show sample data
//         console.log('📋 Sample task:', result.tasks[0]);
//         if (result.resources.length > 0) console.log('👥 Sample resource:', result.resources[0]);
//         if (result.assignments.length > 0) console.log('🔗 Sample assignment:', result.assignments[0]);
//       } else {
//         throw new Error('No task data found in any sheet');
//       }
      
//     } else {
//       throw new Error(`Unsupported file type: ${result.fileType}`);
//     }
    
//     // Final validation
//     if (result.tasks.length === 0) {
//       throw new Error('No tasks could be extracted from the file');
//     }
    
//     console.log('🎉 Extraction successful!');
    
//   } catch (error) {
//     console.error('❌ Error extracting from Excel/CSV:', error);
//     throw new Error(`Failed to read file: ${error.message}`);
//   }
  
//   return result;
// }

// /**
//  * Process Task sheet from Excel
//  */
// function processTaskSheet(sheet, result, sheetName) {
//   try {
//     console.log(`🔄 Processing task sheet: ${sheetName}`);
    
//     // Convert sheet to JSON with headers
//     const jsonData = XLSX.utils.sheet_to_json(sheet, {
//       defval: '',
//       raw: false,
//       header: 'A' // Use column letters as keys
//     });
    
//     console.log(`📊 Sheet data preview:`, jsonData.slice(0, 3));
    
//     if (!jsonData || jsonData.length === 0) {
//       console.warn(`Task sheet "${sheetName}" has no data`);
//       return;
//     }
    
//     const tasks = [];
    
//     // Manual mapping based on your Excel structure
//     jsonData.forEach((row, index) => {
//       const task = {};
      
//       // Map columns from your Excel file
//       task.ID = cleanExcelValue(row.A || row.ID || (index + 1));
//       task.Active = cleanExcelValue(row.B || row.Active);
//       task.Task_Mode = cleanExcelValue(row.C || row.Task_Mode);
//       task.Name = cleanExcelValue(row.D || row.Name);
//       task.Duration = cleanExcelValue(row.E || row.Duration);
//       task.Actual_Start = cleanExcelValue(row.F || row.Actual_Start);
//       task.Start_Date = cleanExcelValue(row.G || row.Start_Date);
//       task.Finish_Date = cleanExcelValue(row.H || row.Finish_Date);
//       task.Actual_Finish = cleanExcelValue(row.I || row.Actual_Finish);
//       task.Predecessors = cleanExcelValue(row.J || row.Predecessors);
//       task.Outline_Level = cleanExcelValue(row.K || row.Outline_Level);
      
//       // Add standard fields for compatibility
//       task['Task Name'] = task.Name;
//       task['Start Date'] = task.Start_Date;
//       task['Finish Date'] = task.Finish_Date;
//       task['Actual Start'] = task.Actual_Start;
//       task['Actual Finish'] = task.Actual_Finish;
//       task['Outline Level'] = task.Outline_Level;
      
//       // Check if it's a heading (Outline Level 1)
//       const outlineLevel = parseInt(task.Outline_Level) || 0;
//       task.isHeading = outlineLevel === 1;
      
//       // Only add if it has a name
//       if (task.Name && task.Name !== '') {
//         tasks.push(task);
//       }
//     });
    
//     console.log(`✅ Extracted ${tasks.length} tasks from "${sheetName}"`);
//     console.log('🔍 First task:', tasks[0]);
    
//     if (tasks.length > 0) {
//       result.tasks = tasks;
//       result.extractedSheets.push(`${sheetName} (${tasks.length} tasks)`);
//     } else {
//       console.warn(`No valid tasks found in sheet "${sheetName}"`);
//     }
    
//   } catch (error) {
//     console.error(`❌ Error processing task sheet "${sheetName}":`, error);
//   }
// }

// /**
//  * Process Resource sheet from Excel
//  */
// function processResourceSheet(sheet, result, sheetName) {
//   try {
//     const jsonData = XLSX.utils.sheet_to_json(sheet, {
//       defval: '',
//       raw: false,
//       header: 1
//     });
    
//     if (!jsonData || jsonData.length < 2) {
//       console.warn(`Resource sheet "${sheetName}" has insufficient data`);
//       return;
//     }
    
//     const headers = jsonData[0] || [];
//     const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
//     console.log(`👥 Resource sheet headers:`, cleanedHeaders.filter(h => h));
    
//     const resources = [];
    
//     for (let i = 1; i < jsonData.length; i++) {
//       const row = jsonData[i];
//       const resource = {};
//       let hasData = false;
      
//       cleanedHeaders.forEach((header, index) => {
//         if (header && header !== '' && index < row.length) {
//           let value = row[index];
//           value = cleanExcelValue(value);
          
//           if (value !== '') {
//             resource[header] = value;
//             hasData = true;
//           }
//         }
//       });
      
//       if (hasData && Object.keys(resource).length > 0) {
//         // Ensure ID field exists
//         if (!resource.ID && !resource.Id && !resource.id) {
//           resource.ID = resources.length + 1;
//         }
        
//         // Ensure Name field exists
//         if (!resource.Name && !resource['Resource Name']) {
//           const possibleNameKeys = Object.keys(resource).filter(key => 
//             key.toLowerCase().includes('name') || 
//             key.toLowerCase().includes('resource')
//           );
//           if (possibleNameKeys.length > 0) {
//             resource.Name = resource[possibleNameKeys[0]];
//           } else {
//             resource.Name = `Resource ${resource.ID}`;
//           }
//         }
        
//         resources.push(resource);
//       }
//     }
    
//     if (resources.length > 0) {
//       result.resources = resources;
//       result.extractedSheets.push(`${sheetName} (${resources.length} resources)`);
//       console.log(`✅ Extracted ${resources.length} resources from "${sheetName}"`);
//     }
    
//   } catch (error) {
//     console.error(`Error processing resource sheet "${sheetName}":`, error);
//   }
// }

// /**
//  * Process Assignment sheet from Excel
//  */
// function processAssignmentSheet(sheet, result, sheetName) {
//   try {
//     console.log(`🔄 Processing assignment sheet: ${sheetName}`);
    
//     // Convert sheet to JSON with header: 1 (array of arrays)
//     const jsonData = XLSX.utils.sheet_to_json(sheet, {
//       defval: '',
//       raw: false,
//       header: 1
//     });
    
//     console.log(`📊 Assignment sheet has ${jsonData.length} rows`);
    
//     if (!jsonData || jsonData.length < 2) {
//       console.warn(`Assignment sheet "${sheetName}" has insufficient data`);
//       return;
//     }
    
//     const headers = jsonData[0] || [];
//     const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
//     console.log(`🔗 Assignment headers:`, cleanedHeaders);
    
//     const assignments = [];
    
//     // Process each row (starting from row 1, after headers)
//     for (let i = 1; i < jsonData.length; i++) {
//       const row = jsonData[i];
//       const assignment = {};
      
//       // Map based on column index using cleanedHeaders
//       cleanedHeaders.forEach((header, index) => {
//         if (header && header !== '' && index < row.length) {
//           let value = row[index];
//           value = cleanExcelValue(value);
          
//           if (value !== '') {
//             // Map to standard field names
//             if (header.includes('Task') || header.includes('task')) {
//               assignment['Task Name'] = value;
//             } else if (header.includes('Resource') || header.includes('resource')) {
//               assignment['Resource Name'] = value;
//             } else if (header.includes('Percent') || header.includes('%') || header.includes('Complete')) {
//               assignment['Percent Work Complete'] = value;
//             } else if (header.includes('Scheduled') || header.includes('Work')) {
//               assignment['Scheduled Work'] = value;
//             } else if (header.includes('Units')) {
//               assignment['Units'] = value;
//             } else {
//               // Keep original header name
//               assignment[header] = value;
//             }
//           }
//         }
//       });
      
//       console.log(`📝 Assignment row ${i}:`, assignment);
      
//       // Only add if it has task and resource
//       if (assignment['Task Name'] && assignment['Resource Name']) {
//         assignments.push(assignment);
//       }
//     }
    
//     console.log(`✅ Extracted ${assignments.length} assignments from "${sheetName}"`);
    
//     if (assignments.length > 0) {
//       console.log('🔍 Sample assignment:', assignments[0]);
//       result.assignments = assignments;
//       result.extractedSheets.push(`${sheetName} (${assignments.length} assignments)`);
//     } else {
//       console.warn(`No valid assignments found in sheet "${sheetName}"`);
//     }
    
//   } catch (error) {
//     console.error(`Error processing assignment sheet "${sheetName}":`, error);
//   }
// }

// /**
//  * Link data between tables
//  */
// function linkDataBetweenTables(result) {
//   console.log('🔗 Linking data between tables...');
  
//   // Link tasks with assignments
//   if (result.assignments.length > 0) {
//     result.tasks.forEach(task => {
//       const taskName = task.Name || task['Task Name'] || task.Task;
//       if (taskName) {
//         // Find assignments for this task
//         task.Assignments = result.assignments.filter(assignment => {
//           const assignmentTaskName = assignment['Task Name'] || assignment.Task || assignment['Task'];
//           return assignmentTaskName && 
//                  assignmentTaskName.toString().trim() === taskName.toString().trim();
//         });
//       }
//     });
//   }
  
//   // Link resources with assignments
//   if (result.assignments.length > 0) {
//     result.resources.forEach(resource => {
//       const resourceName = resource.Name || resource['Resource Name'];
//       if (resourceName) {
//         // Find assignments for this resource
//         resource.Assignments = result.assignments.filter(assignment => {
//           const assignmentResourceName = assignment['Resource Name'] || assignment.Resource || assignment['Assigned To'];
//           return assignmentResourceName && 
//                  assignmentResourceName.toString().trim() === resourceName.toString().trim();
//         });
//       }
//     });
//   }
  
//   console.log('✅ Data linking completed');
// }

// /**
//  * Perform risk analysis
//  */
// function performRiskAnalysis(result) {
//   const risks = [];
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   // Analyze task risks
//   result.tasks.forEach(task => {
//     const risk = {
//       taskId: task.ID || task.Id || 'Unknown',
//       taskName: task.Name || task['Task Name'] || 'Unnamed Task',
//       riskLevel: 'Low',
//       riskType: '',
//       description: ''
//     };
    
//     // Get Outline Level value
//     const outlineLevel = parseInt(task['Outline Level'] || task['OutlineLevel'] || task['Outline Number'] || 0);
    
//     // Check for overdue tasks
//     const finishDate = parseDateString(task['Finish Date'] || task.Finish || task.End);
//     const completion = parseFloat(task['% Complete']) || parseFloat(task['% Work Complete']) || 0;
    
//     if (finishDate && finishDate < today && completion < 100) {
//       const daysOverdue = Math.ceil((today - finishDate) / (1000 * 60 * 60 * 24));
//       risk.riskLevel = 'High';
//       risk.riskType = 'Schedule';
//       risk.description = `Task is ${daysOverdue} day(s) overdue`;
//       risks.push({...risk});
//     }
    
//     // Check for tasks without resources - BUT EXCLUDE OUTLINE LEVEL 1 TASKS
//     if ((!task.Assignments || task.Assignments.length === 0) && completion < 100) {
//       // Only flag as risk if NOT a heading (Outline Level not equal to 1)
//       if (outlineLevel !== 1) {
//         risk.riskLevel = 'Medium';
//         risk.riskType = 'Resource';
//         risk.description = 'Task has no assigned resources';
//         risks.push({...risk});
//       } else {
//         console.log(`ℹ️ Skipping resource check for heading task: "${risk.taskName}" (Outline Level = 1)`);
//       }
//     }
//   });
  
//   // Calculate risk statistics
//   const highRisks = risks.filter(r => r.riskLevel === 'High').length;
//   const mediumRisks = risks.filter(r => r.riskLevel === 'Medium').length;
//   const lowRisks = risks.filter(r => r.riskLevel === 'Low').length;
  
//   result.riskAnalysis = {
//     risks,
//     statistics: {
//       total: risks.length,
//       high: highRisks,
//       medium: mediumRisks,
//       low: lowRisks
//     }
//   };
// }

// /**
//  * Clean Excel cell values
//  */
// function cleanExcelValue(value) {
//   if (value === null || value === undefined) {
//     return '';
//   }
  
//   // Handle empty strings
//   if (value === '') {
//     return '';
//   }
  
//   // Handle dates
//   if (value instanceof Date) {
//     return value.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   }
  
//   // Handle Excel serial numbers (dates)
//   if (typeof value === 'number' && value > 25569) {
//     try {
//       const date = new Date(Math.round((value - 25569) * 86400 * 1000));
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: '2-digit',
//           year: 'numeric'
//         });
//       }
//     } catch (e) {
//       // Keep as number
//     }
//   }
  
//   // Handle numbers - keep as numbers
//   if (typeof value === 'number') {
//     return value;
//   }
  
//   // Handle strings
//   if (typeof value === 'string') {
//     const trimmed = value.trim();
    
//     // Handle NA values
//     if (trimmed.toLowerCase() === 'na' || trimmed === '#N/A' || trimmed === '-') {
//       return '';
//     }
    
//     // Handle percentages
//     if (trimmed.includes('%')) {
//       const num = parseFloat(trimmed.replace('%', ''));
//       if (!isNaN(num)) {
//         return num;
//       }
//     }
    
//     // Try to parse as number (for raw numbers like "12")
//     if (trimmed !== '') {
//       const num = parseFloat(trimmed);
//       if (!isNaN(num)) {
//         return num;
//       }
//     }
    
//     // Handle boolean-like values
//     const lowerVal = trimmed.toLowerCase();
//     if (lowerVal === 'yes' || lowerVal === 'true') return true;
//     if (lowerVal === 'no' || lowerVal === 'false') return false;
    
//     return trimmed;
//   }
  
//   // Default: convert to string
//   return String(value).trim();
// }

// /**
//  * Parse date string to Date object
//  */
// function parseDateString(dateStr) {
//   if (!dateStr) return null;
  
//   try {
//     if (dateStr instanceof Date) {
//       return dateStr;
//     }
    
//     const str = String(dateStr).trim();
    
//     const formats = [
//       // dd/mm/yyyy or dd-mm-yyyy
//       { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parts: [2, 1, 0] },
//       // yyyy-mm-dd
//       { regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/, parts: [0, 1, 2] },
//       // mm/dd/yyyy
//       { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parts: [2, 0, 1] },
//       // Month name format: "November 3, 2025"
//       { regex: /(\w+)\s+(\d{1,2}),\s+(\d{4})/, parts: [2, 0, 1] }
//     ];
    
//     for (const format of formats) {
//       const match = str.match(format.regex);
//       if (match) {
//         let year, month, day;
        
//         if (format.parts[0] === 0) {
//           // Month name format
//           const monthNames = [
//             'january', 'february', 'march', 'april', 'may', 'june',
//             'july', 'august', 'september', 'october', 'november', 'december'
//           ];
//           const monthName = match[1].toLowerCase();
//           month = monthNames.indexOf(monthName);
//           day = parseInt(match[2]);
//           year = parseInt(match[3]);
//         } else {
//           year = parseInt(match[format.parts[0] + 1]);
//           month = parseInt(match[format.parts[1] + 1]) - 1;
//           day = parseInt(match[format.parts[2] + 1]);
//         }
        
//         const date = new Date(year, month, day);
//         if (!isNaN(date.getTime())) {
//           return date;
//         }
//       }
//     }
    
//     const date = new Date(str);
//     if (!isNaN(date.getTime())) {
//       return date;
//     }
//   } catch (e) {
//     console.warn('Failed to parse date:', dateStr, e);
//   }
  
//   return null;
// }

// /**
//  * Parse duration string to number of days
//  */
// function parseDuration(durationStr) {
//   if (!durationStr) return 0;
  
//   const str = String(durationStr).toLowerCase().trim();
  
//   // Extract number and unit
//   const match = str.match(/(\d+(\.\d+)?)\s*([dwmh]?)/);
//   if (match) {
//     const value = parseFloat(match[1]);
//     const unit = match[3];
    
//     switch(unit) {
//       case 'h': return value / 8; // hours to work days
//       case 'd': return value;
//       case 'w': return value * 5; // weeks to work days
//       case 'm': return value * 20; // months to work days
//       default: return value; // assume days
//     }
//   }
  
//   // Try to extract just the number
//   const numMatch = str.match(/\d+(\.\d+)?/);
//   return numMatch ? parseFloat(numMatch[0]) : 0;
// }

// /**
//  * Parse CSV text into tasks and columns
//  */
// function parseCSV(csvText) {
//   csvText = csvText.trim();
  
//   if (!csvText) {
//     return { tasks: [], columns: [] };
//   }
  
//   const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
//   if (lines.length === 0) {
//     return { tasks: [], columns: [] };
//   }
  
//   const headers = parseCSVLine(lines[0]).map(h => h.trim());
//   const validHeaders = headers.filter(h => h !== '');
  
//   if (validHeaders.length === 0) {
//     return { tasks: [], columns: [] };
//   }
  
//   const tasks = [];
  
//   for (let i = 1; i < lines.length; i++) {
//     const values = parseCSVLine(lines[i]);
//     const task = {};
//     let hasData = false;
    
//     validHeaders.forEach((header, index) => {
//       if (index < values.length) {
//         let value = values[index] || '';
//         value = value.trim();
        
//         if (value !== '') {
//           if (!isNaN(value) && value !== '') {
//             value = parseFloat(value);
//           } else if (value.endsWith('%')) {
//             const num = parseFloat(value);
//             if (!isNaN(num)) {
//               value = num;
//             }
//           }
          
//           task[header] = value;
//           hasData = true;
//         }
//       }
//     });
    
//     if (hasData && Object.keys(task).length > 0) {
//       tasks.push(task);
//     }
//   }
  
//   return { 
//     tasks, 
//     columns: validHeaders
//   };
// }

// /**
//  * Parse a CSV line considering quoted fields
//  */
// function parseCSVLine(line) {
//   const result = [];
//   let current = '';
//   let inQuotes = false;
//   let quoteChar = null;
  
//   for (let i = 0; i < line.length; i++) {
//     const char = line[i];
    
//     if ((char === '"' || char === "'") && !inQuotes) {
//       inQuotes = true;
//       quoteChar = char;
//     } else if (char === quoteChar && inQuotes) {
//       if (i + 1 < line.length && line[i + 1] === quoteChar) {
//         current += quoteChar;
//         i++;
//       } else {
//         inQuotes = false;
//       }
//     } else if (char === ',' && !inQuotes) {
//       result.push(current);
//       current = '';
//     } else {
//       current += char;
//     }
//   }
  
//   result.push(current);
  
//   return result.map(field => {
//     field = field.trim();
    
//     if ((field.startsWith('"') && field.endsWith('"')) || 
//         (field.startsWith("'") && field.endsWith("'"))) {
//       field = field.slice(1, -1);
//     }
    
//     return field;
//   });
// }

// /**
//  * Extract project information from tasks
//  */
// function extractProjectInfo(tasks, result) {
//   if (!tasks || tasks.length === 0) return;
  
//   // Find project title
//   const firstFewTasks = tasks.slice(0, Math.min(5, tasks.length));
  
//   for (const task of firstFewTasks) {
//     const potentialTitleFields = ['Project', 'Project Title', 'Title', 'Project Name', 'Task Name', 'Name'];
    
//     for (const field of potentialTitleFields) {
//       if (task[field] && typeof task[field] === 'string') {
//         const value = task[field].trim();
//         if (value && value.length < 100) {
//           result.projectInfo.title = value;
//           break;
//         }
//       }
//     }
    
//     if (result.projectInfo.title) break;
//   }
  
//   if (!result.projectInfo.title) {
//     result.projectInfo.title = result.fileName.replace(/\.[^/.]+$/, '');
//   }
  
//   // Find earliest start date and latest finish date across ALL tasks
//   let earliestStart = null;
//   let latestFinish = null;
  
//   tasks.forEach(task => {
//     // Find start date from various possible field names
//     const startFields = ['Start Date', 'Start', 'Begin', 'Baseline Start', 'Actual Start', 'Start_Date', 'Actual_Start'];
//     for (const field of startFields) {
//       if (task[field]) {
//         const date = parseDateString(task[field]);
//         if (date) {
//           if (!earliestStart || date < earliestStart) {
//             earliestStart = date;
//           }
//           break;
//         }
//       }
//     }
    
//     // Find finish date from various possible field names
//     const finishFields = ['Finish Date', 'Finish', 'End', 'Baseline Finish', 'Actual Finish', 'Finish_Date', 'Actual_Finish'];
//     for (const field of finishFields) {
//       if (task[field]) {
//         const date = parseDateString(task[field]);
//         if (date) {
//           if (!latestFinish || date > latestFinish) {
//             latestFinish = date;
//           }
//           break;
//         }
//       }
//     }
//   });
  
//   // Calculate project duration based on earliest start and latest finish
//   if (earliestStart) {
//     result.projectInfo.startDate = earliestStart.toLocaleDateString('en-IN');
//     result.projectInfo.rawStartDate = earliestStart;
//   }
  
//   if (latestFinish) {
//     result.projectInfo.finishDate = latestFinish.toLocaleDateString('en-IN');
//     result.projectInfo.rawFinishDate = latestFinish;
//   }
  
//   if (earliestStart && latestFinish) {
//     const durationMs = latestFinish.getTime() - earliestStart.getTime();
//     const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
//     result.projectInfo.durationDays = durationDays;
    
//     // Also calculate working days (excluding weekends)
//     const workingDays = calculateWorkingDays(earliestStart, latestFinish);
//     result.projectInfo.workingDays = workingDays;
//   }
  
//   result.projectInfo.totalTasks = tasks.length;
  
//   console.log('📅 Project Duration Calculation:', {
//     earliestStart: earliestStart ? earliestStart.toLocaleDateString() : 'N/A',
//     latestFinish: latestFinish ? latestFinish.toLocaleDateString() : 'N/A',
//     durationDays: result.projectInfo.durationDays || 'N/A'
//   });
// }

// /**
//  * Calculate working days between two dates (excluding weekends)
//  */
// function calculateWorkingDays(startDate, endDate) {
//   if (!startDate || !endDate) return 0;
  
//   let count = 0;
//   const current = new Date(startDate);
//   const end = new Date(endDate);
  
//   while (current <= end) {
//     const dayOfWeek = current.getDay();
//     // Sunday = 0, Saturday = 6
//     if (dayOfWeek !== 0 && dayOfWeek !== 6) {
//       count++;
//     }
//     current.setDate(current.getDate() + 1);
//   }
  
//   return count;
// }

// /**
//  * Extract analysis data for charts and statistics
//  */
// function extractAnalysisData(tasks, result) {
//   if (!tasks || tasks.length === 0) return;
  
//   const analysis = {
//     completionStats: {
//       totalTasks: tasks.length,
//       completedTasks: 0,
//       inProgressTasks: 0,
//       notStartedTasks: 0,
//       overdueTasks: 0,
//       totalCompletion: 0,
//       avgCompletion: 0
//     },
//     resourceStats: {},
//     durationStats: {
//       totalDuration: 0,
//       avgDuration: 0,
//       minDuration: Infinity,
//       maxDuration: 0,
//       taskCount: 0,
//       // Add project duration based on start and end dates
//       projectDuration: result.projectInfo.durationDays || 0,
//       projectWorkingDays: result.projectInfo.workingDays || 0
//     }
//   };
  
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   tasks.forEach(task => {
//     const completionFields = ['% Complete', 'Progress', 'Percent Complete', 'Complete', '% Work Complete'];
//     let completion = 0;
    
//     for (const field of completionFields) {
//       if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
//         const value = parseFloat(task[field]);
//         if (!isNaN(value)) {
//           completion = Math.min(100, Math.max(0, value));
//           break;
//         }
//       }
//     }
    
//     analysis.completionStats.totalCompletion += completion;
    
//     if (completion >= 100) {
//       analysis.completionStats.completedTasks++;
//     } else if (completion > 0) {
//       analysis.completionStats.inProgressTasks++;
//     } else {
//       analysis.completionStats.notStartedTasks++;
//     }
    
//     // Check for overdue tasks
//     const endFields = ['Finish Date', 'Finish', 'End'];
//     let isOverdue = false;
    
//     for (const field of endFields) {
//       if (task[field]) {
//         const endDate = parseDateString(task[field]);
//         if (endDate && endDate < today && completion < 100) {
//           isOverdue = true;
//           break;
//         }
//       }
//     }
    
//     if (isOverdue) {
//       analysis.completionStats.overdueTasks++;
//     }
    
//     // Get individual task duration (for average calculation)
//     const durationFields = ['Duration', 'Total Duration', 'Work'];
//     let duration = 0;
    
//     for (const field of durationFields) {
//       if (task[field]) {
//         const parsed = parseDuration(task[field]);
//         if (parsed > 0) {
//           duration = parsed;
//           break;
//         }
//       }
//     }
    
//     if (duration > 0) {
//       analysis.durationStats.totalDuration += duration;
//       analysis.durationStats.minDuration = Math.min(analysis.durationStats.minDuration, duration);
//       analysis.durationStats.maxDuration = Math.max(analysis.durationStats.maxDuration, duration);
//       analysis.durationStats.taskCount++;
//     }
    
//     // Get resources
//     const resourceFields = ['Resource Names', 'Resources', 'Resource', 'Assigned To'];
//     for (const field of resourceFields) {
//       if (task[field]) {
//         const resources = String(task[field]).split(/[,;]/).map(r => r.trim()).filter(r => r);
        
//         resources.forEach(resource => {
//           if (!analysis.resourceStats[resource]) {
//             analysis.resourceStats[resource] = {
//               taskCount: 0,
//               totalCompletion: 0,
//               totalDuration: 0
//             };
//           }
          
//           analysis.resourceStats[resource].taskCount++;
//           analysis.resourceStats[resource].totalCompletion += completion;
//           analysis.resourceStats[resource].totalDuration += duration;
//         });
        
//         break;
//       }
//     }
//   });
  
//   // Calculate averages
//   analysis.completionStats.avgCompletion = analysis.completionStats.totalTasks > 0
//     ? analysis.completionStats.totalCompletion / analysis.completionStats.totalTasks
//     : 0;
  
//   analysis.durationStats.avgDuration = analysis.durationStats.taskCount > 0
//     ? analysis.durationStats.totalDuration / analysis.durationStats.taskCount
//     : 0;
  
//   if (analysis.durationStats.minDuration === Infinity) {
//     analysis.durationStats.minDuration = 0;
//   }
  
//   // Log the duration information
//   console.log('📊 Duration Analysis:', {
//     projectDurationDays: analysis.durationStats.projectDuration,
//     projectWorkingDays: analysis.durationStats.projectWorkingDays,
//     totalTaskDuration: analysis.durationStats.totalDuration,
//     avgTaskDuration: analysis.durationStats.avgDuration
//   });
  
//   result.analysis = analysis;
// }

// export default extractFromExcelOrCSV;

//Testing code
import * as XLSX from 'xlsx';

/**
 * Extract COMPLETE project data from Excel files with multiple sheets
 * @param {File} file - The uploaded Excel file
 * @returns {Object} - Extracted data with tasks, resources, assignments
 */
export async function extractFromExcelOrCSV(file) {
  const result = {
    fileName: file.name,
    fileType: file.name.split('.').pop().toLowerCase(),
    tasks: [],
    resources: [],
    assignments: [],
    projectInfo: {},
    analysis: {},
    note: '',
    extractedSheets: [],
    warnings: [],
    riskAnalysis: {}
  };

  try {
    const data = await file.arrayBuffer();
    
    if (result.fileType === 'csv') {
      // Handle CSV file
      const text = new TextDecoder('utf-8').decode(data);
      const { tasks, columns } = parseCSV(text);
      
      if (tasks.length === 0) {
        throw new Error('CSV file is empty or contains no valid data');
      }
      
      result.tasks = tasks;
      result.columns = columns;
      result.note = 'Extracted from CSV file';
      
      // Extract project info and analysis
      extractProjectInfo(tasks, result);
      extractAnalysisData(tasks, result);
      
    } else if (result.fileType === 'xlsx' || result.fileType === 'xls') {
      // Handle Excel files
      const workbook = XLSX.read(data, { 
        type: 'array',
        cellDates: true,
        cellNF: false,
        cellText: false,
        sheetStubs: false
      });
      
      console.log('📊 Excel sheets found:', workbook.SheetNames);
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Excel file contains no sheets');
      }

      // SMART SHEET DETECTION
      let taskSheetName = null;
      let resourceSheetName = null;
      let assignmentSheetName = null;

      // Method 1: Look for exact sheet names
      workbook.SheetNames.forEach(name => {
        const lowerName = name.toLowerCase();
        
        if (lowerName.includes('task') && !taskSheetName) {
          taskSheetName = name;
        }
        if (lowerName.includes('resource') && !resourceSheetName) {
          resourceSheetName = name;
        }
        if (lowerName.includes('assignment') && !assignmentSheetName) {
          assignmentSheetName = name;
        }
      });

      // Method 2: If not found, check content
      if (!taskSheetName) {
        workbook.SheetNames.forEach(name => {
          const sheet = workbook.Sheets[name];
          if (sheet && sheet['!ref']) {
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
            if (jsonData.length > 1) {
              const headers = jsonData[0] || [];
              const headerStr = headers.join(' ').toLowerCase();
              
              // Check for task-like headers
              if (headerStr.includes('id') && (headerStr.includes('task') || headerStr.includes('name'))) {
                taskSheetName = name;
                console.log(`✅ Found Task sheet by content: ${name}`);
              }
            }
          }
        });
      }

      // Method 3: Use first sheet as task sheet if still not found
      if (!taskSheetName && workbook.SheetNames.length > 0) {
        taskSheetName = workbook.SheetNames[0];
        console.log(`⚠️ Using first sheet as task sheet: ${taskSheetName}`);
      }

      console.log('🔍 Final sheet detection:', {
        taskSheet: taskSheetName,
        resourceSheet: resourceSheetName,
        assignmentSheet: assignmentSheetName
      });

      // Process Task_Table sheet
      if (taskSheetName) {
        const taskSheet = workbook.Sheets[taskSheetName];
        if (taskSheet && taskSheet['!ref']) {
          console.log(`✅ Processing Task sheet: ${taskSheetName}`);
          processTaskSheet(taskSheet, result, taskSheetName);
        }
      } else {
        throw new Error('No task sheet could be identified');
      }

      // Process Resource_Table sheet
      if (resourceSheetName) {
        const resourceSheet = workbook.Sheets[resourceSheetName];
        if (resourceSheet && resourceSheet['!ref']) {
          console.log(`✅ Processing Resource sheet: ${resourceSheetName}`);
          processResourceSheet(resourceSheet, result, resourceSheetName);
        }
      } else {
        // Try to find resource sheet
        workbook.SheetNames.forEach(sheetName => {
          if (sheetName !== taskSheetName && !assignmentSheetName) {
            const sheet = workbook.Sheets[sheetName];
            if (sheet && sheet['!ref']) {
              const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
              if (jsonData.length > 1) {
                const headers = jsonData[0] || [];
                const headerStr = headers.join(' ').toLowerCase();
                if (headerStr.includes('resource') || headerStr.includes('type') || headerStr.includes('rate')) {
                  console.log(`✅ Found Resource sheet by content: ${sheetName}`);
                  processResourceSheet(sheet, result, sheetName);
                }
              }
            }
          }
        });
      }

      // Process Assignment_Table sheet
      if (assignmentSheetName) {
        const assignmentSheet = workbook.Sheets[assignmentSheetName];
        if (assignmentSheet && assignmentSheet['!ref']) {
          console.log(`✅ Processing Assignment sheet: ${assignmentSheetName}`);
          processAssignmentSheet(assignmentSheet, result, assignmentSheetName);
        }
      } else {
        // Try to find assignment sheet
        workbook.SheetNames.forEach(sheetName => {
          if (sheetName !== taskSheetName && sheetName !== resourceSheetName) {
            const sheet = workbook.Sheets[sheetName];
            if (sheet && sheet['!ref']) {
              const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
              if (jsonData.length > 1) {
                const headers = jsonData[0] || [];
                const headerStr = headers.join(' ').toLowerCase();
                if (headerStr.includes('task') && headerStr.includes('resource') && headerStr.includes('work')) {
                  console.log(`✅ Found Assignment sheet by content: ${sheetName}`);
                  processAssignmentSheet(sheet, result, sheetName);
                }
              }
            }
          }
        });
      }
      
      // Link data between tables
      linkDataBetweenTables(result);
      
      // Perform risk analysis
      performRiskAnalysis(result);
      
      // Extract project info and analysis
      if (result.tasks.length > 0) {
        extractProjectInfo(result.tasks, result);
        extractAnalysisData(result.tasks, result);
        result.note = `Extracted ${result.tasks.length} tasks, ${result.resources.length} resources, ${result.assignments.length} assignments`;
        
        console.log('📊 Final extraction results:', {
          tasks: result.tasks.length,
          resources: result.resources.length,
          assignments: result.assignments.length
        });
        
        // Show sample data
        console.log('📋 Sample task:', result.tasks[0]);
        if (result.resources.length > 0) console.log('👥 Sample resource:', result.resources[0]);
        if (result.assignments.length > 0) console.log('🔗 Sample assignment:', result.assignments[0]);
      } else {
        throw new Error('No task data found in any sheet');
      }
      
    } else {
      throw new Error(`Unsupported file type: ${result.fileType}`);
    }
    
    // Final validation
    if (result.tasks.length === 0) {
      throw new Error('No tasks could be extracted from the file');
    }
    
    console.log('🎉 Extraction successful!');
    
  } catch (error) {
    console.error('❌ Error extracting from Excel/CSV:', error);
    throw new Error(`Failed to read file: ${error.message}`);
  }
  
  return result;
}

/**
 * Process Task sheet from Excel
 */
function processTaskSheet(sheet, result, sheetName) {
  try {
    console.log(`🔄 Processing task sheet: ${sheetName}`);
    
    // Convert sheet to JSON with column letters as keys
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      raw: false,
      header: 'A'
    });
    
    console.log(`📊 Found ${jsonData.length} rows in task sheet`);
    
    if (!jsonData || jsonData.length === 0) {
      console.warn(`Task sheet "${sheetName}" has no data`);
      return;
    }
    
    const tasks = [];
    
    // Manual mapping based on your Excel structure
    jsonData.forEach((row, index) => {
      const task = {};
      
      // Map columns from your Excel file (A=ID, B=Active, C=Task_Mode, D=Name, etc.)
      task.ID = cleanExcelValue(row.A || row.ID || (index + 1));
      task.Active = cleanExcelValue(row.B || row.Active);
      task.Task_Mode = cleanExcelValue(row.C || row.Task_Mode);
      task.Name = cleanExcelValue(row.D || row.Name);
      task.Duration = cleanExcelValue(row.E || row.Duration);
      task.Actual_Start = cleanExcelValue(row.F || row.Actual_Start);
      task.Start_Date = cleanExcelValue(row.G || row.Start_Date);
      task.Finish_Date = cleanExcelValue(row.H || row.Finish_Date);
      task.Actual_Finish = cleanExcelValue(row.I || row.Actual_Finish);
      task.Predecessors = cleanExcelValue(row.J || row.Predecessors);
      task.Outline_Level = cleanExcelValue(row.K || row.Outline_Level);
      
      // Add standard fields for compatibility
      task['Task Name'] = task.Name;
      task['Start Date'] = task.Start_Date;
      task['Finish Date'] = task.Finish_Date;
      task['Actual Start'] = task.Actual_Start;
      task['Actual Finish'] = task.Actual_Finish;
      task['Outline Level'] = task.Outline_Level;
      
      // Check if it's a heading (Outline Level 1)
      const outlineLevel = parseInt(task.Outline_Level) || 0;
      task.isHeading = outlineLevel === 1;
      
      // Only add if it has a name
      if (task.Name && task.Name !== '' && task.Name !== 'ID') {
        tasks.push(task);
      }
    });
    
    console.log(`✅ Extracted ${tasks.length} tasks from "${sheetName}"`);
    
    if (tasks.length > 0) {
      console.log('🔍 First task sample:', tasks[0]);
      result.tasks = tasks;
      result.extractedSheets.push(`${sheetName} (${tasks.length} tasks)`);
    } else {
      console.warn(`No valid tasks found in sheet "${sheetName}"`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing task sheet "${sheetName}":`, error);
  }
}

/**
 * Process Resource sheet from Excel
 */
function processResourceSheet(sheet, result, sheetName) {
  try {
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      raw: false,
      header: 1
    });
    
    if (!jsonData || jsonData.length < 2) {
      console.warn(`Resource sheet "${sheetName}" has insufficient data`);
      return;
    }
    
    const headers = jsonData[0] || [];
    const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
    console.log(`👥 Resource sheet headers:`, cleanedHeaders.filter(h => h));
    
    const resources = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const resource = {};
      let hasData = false;
      
      cleanedHeaders.forEach((header, index) => {
        if (header && header !== '' && index < row.length) {
          let value = row[index];
          value = cleanExcelValue(value);
          
          if (value !== '') {
            resource[header] = value;
            hasData = true;
          }
        }
      });
      
      if (hasData && Object.keys(resource).length > 0) {
        // Ensure ID field exists
        if (!resource.ID && !resource.Id && !resource.id) {
          resource.ID = resources.length + 1;
        }
        
        // Ensure Name field exists
        if (!resource.Name && !resource['Resource Name']) {
          const possibleNameKeys = Object.keys(resource).filter(key => 
            key.toLowerCase().includes('name') || 
            key.toLowerCase().includes('resource')
          );
          if (possibleNameKeys.length > 0) {
            resource.Name = resource[possibleNameKeys[0]];
          } else {
            resource.Name = `Resource ${resource.ID}`;
          }
        }
        
        resources.push(resource);
      }
    }
    
    if (resources.length > 0) {
      result.resources = resources;
      result.extractedSheets.push(`${sheetName} (${resources.length} resources)`);
      console.log(`✅ Extracted ${resources.length} resources from "${sheetName}"`);
    }
    
  } catch (error) {
    console.error(`Error processing resource sheet "${sheetName}":`, error);
  }
}

/**
 * Process Assignment sheet from Excel - FIXED VERSION
 */
// function processAssignmentSheet(sheet, result, sheetName) {
//   try {
//     console.log(`🔄 Processing assignment sheet: ${sheetName}`);
    
//     // Convert sheet to array of arrays
//     const jsonData = XLSX.utils.sheet_to_json(sheet, {
//       defval: '',
//       raw: false,
//       header: 1
//     });
    
//     console.log(`📊 Assignment sheet raw data:`, jsonData);
    
//     if (!jsonData || jsonData.length < 2) {
//       console.warn(`Assignment sheet "${sheetName}" has insufficient data`);
//       return;
//     }
    
//     const headers = jsonData[0] || [];
//     console.log(`🔗 Assignment headers:`, headers);
    
//     const assignments = [];
    
//     // Process each data row
//     for (let i = 1; i < jsonData.length; i++) {
//       const row = jsonData[i];
//       const assignment = {};
      
//       // Column 0: Task_Name
//       if (row[0] !== undefined) {
//         assignment['Task Name'] = cleanExcelValue(row[0]);
//       }
      
//       // Column 1: Resource_Name
//       if (row[1] !== undefined) {
//         assignment['Resource Name'] = cleanExcelValue(row[1]);
//       }
      
//       // Column 2: Percent_Work_Complete - THIS IS THE KEY
//       if (row[2] !== undefined) {
//         const percentValue = row[2];
//         console.log(`🔢 Processing Percent_Work_Complete:`, {
//           raw: percentValue,
//           type: typeof percentValue
//         });
        
//         // Clean and parse the value
//         const cleanedValue = cleanExcelValue(percentValue);
//         console.log(`✅ Cleaned value:`, cleanedValue, typeof cleanedValue);
        
//         // Store with multiple key names for compatibility
//         assignment['Percent Work Complete'] = cleanedValue;
//         assignment['Percent_Work_Complete'] = cleanedValue;
//         assignment['% Work Complete'] = cleanedValue;
//       }
      
//       // Column 3: Scheduled_Work
//       if (row[3] !== undefined) {
//         assignment['Scheduled Work'] = cleanExcelValue(row[3]);
//       }
      
//       // Column 4: Units
//       if (row[4] !== undefined) {
//         assignment['Units'] = cleanExcelValue(row[4]);
//       }
      
//       console.log(`📝 Created assignment:`, assignment);
      
//       // Only add if it has task and resource
//       if (assignment['Task Name'] && assignment['Resource Name']) {
//         assignments.push(assignment);
//       }
//     }
    
//     console.log(`✅ Extracted ${assignments.length} assignments from "${sheetName}"`);
    
//     if (assignments.length > 0) {
//       console.log('🔍 All extracted assignments:', assignments);
      
//       // Debug each assignment
//       assignments.forEach((assignment, index) => {
//         console.log(`📊 Assignment ${index}:`, {
//           task: assignment['Task Name'],
//           resource: assignment['Resource Name'],
//           percent: assignment['Percent Work Complete'],
//           percentType: typeof assignment['Percent Work Complete']
//         });
//       });
      
//       result.assignments = assignments;
//       result.extractedSheets.push(`${sheetName} (${assignments.length} assignments)`);
//     } else {
//       console.warn(`No valid assignments found in sheet "${sheetName}"`);
//     }
    
//   } catch (error) {
//     console.error(`❌ Error processing assignment sheet "${sheetName}":`, error);
//   }
// }

/**
 * Process Assignment sheet from Excel - USING Percent_Work_Complete, Actual_Work AND Remaining_Work
 */
function processAssignmentSheet(sheet, result, sheetName) {
  try {
    console.log(`📄 Processing assignment sheet: ${sheetName}`);
    
    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      raw: false,
      header: 1
    });
    
    console.log(`📊 Assignment sheet has ${jsonData.length} rows`);
    
    if (!jsonData || jsonData.length < 2) {
      console.warn(`Assignment sheet "${sheetName}" has insufficient data`);
      return;
    }
    
    const headers = jsonData[0] || [];
    const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
    console.log(`🔗 Assignment headers:`, cleanedHeaders.filter(h => h));
    
    // Normalize assignment headers
    const assignmentMapping = {
      'Task Name': ['Task_Name', 'Task Name', 'Task', 'Activity'],
      'Resource Name': ['Resource_Name', 'Resource Name', 'Resource', 'Assigned To'],
      'Percent Work Complete': ['Percent_Work_Complete', 'Percent Work Complete', '% Work Complete', 'Progress'],
      'Scheduled Work': ['Scheduled_Work', 'Scheduled Work', 'Work'],
      'Units': ['Units', 'Unit']
    };
    
    const normalizedHeaders = cleanedHeaders.map(header => {
      for (const [standardName, possibleNames] of Object.entries(assignmentMapping)) {
        if (possibleNames.includes(header)) {
          return standardName;
        }
      }
      return header;
    });
    
    console.log(`🔗 Normalized assignment headers:`, normalizedHeaders.filter(h => h));
    
    const assignments = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const assignment = {};
      let hasData = false;
      
      normalizedHeaders.forEach((header, index) => {
        if (header && header !== '' && index < row.length) {
          let value = row[index];
          value = cleanExcelValue(value);
          
          if (value !== '') {
            assignment[header] = value;
            hasData = true;
          }
        }
      });
      
      if (hasData && Object.keys(assignment).length > 0) {
        // ✅ ✅ ✅ NEW CODE: CALCULATE ACTUAL WORK AND REMAINING WORK ✅ ✅ ✅
        const percentComplete = parseFloat(assignment['Percent Work Complete']) || 0;
        const scheduledWork = parseFloat(assignment['Scheduled Work']) || 0;
        
        if (scheduledWork > 0) {
          // Calculate Actual Work (completed work hours)
          const actualWork = (scheduledWork * percentComplete) / 100;
          assignment['Actual Work'] = actualWork;
          
          // Calculate Remaining Work (pending work hours)
          const remainingWork = scheduledWork - actualWork;
          assignment['Remaining Work'] = remainingWork;
          
          console.log(`📊 Assignment calculation:`, {
            task: assignment['Task Name'],
            resource: assignment['Resource Name'],
            percentComplete: `${percentComplete}%`,
            scheduledWork: `${scheduledWork}h`,
            actualWork: `${actualWork.toFixed(2)}h`,
            remainingWork: `${remainingWork.toFixed(2)}h`
          });
        } else {
          // If no scheduled work, set both to 0
          assignment['Actual Work'] = 0;
          assignment['Remaining Work'] = 0;
        }
        // ✅ ✅ ✅ END OF NEW CODE ✅ ✅ ✅
        
        // Store with multiple key names for compatibility
        assignment['Completed Work'] = assignment['Actual Work'];
        assignment['Work'] = assignment['Scheduled Work'];
        
        assignments.push(assignment);
      }
    }
    
    console.log(`✅ Extracted ${assignments.length} assignments from "${sheetName}"`);
    
    if (assignments.length > 0) {
      console.log('📋 Sample assignment with calculated work:', assignments[0]);
      result.assignments = assignments;
      result.extractedSheets.push(`${sheetName} (${assignments.length} assignments)`);
    } else {
      console.warn(`No valid assignments found in sheet "${sheetName}"`);
    }
    
  } catch (error) {
    console.error(`Error processing assignment sheet "${sheetName}":`, error);
  }
}

/**
 * Parse hours from Excel value (32h, 4d, 0.5w, etc.)
 */
function parseHoursFromExcel(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  if (typeof value === 'number') {
    // If it's already a number, assume it's in hours
    return value;
  }
  
  const str = String(value).toLowerCase().trim();
  
  // Handle Excel duration format
  if (str.includes('h')) {
    // Hours: "32h" → 32
    return parseFloat(str.replace('h', '').trim()) || 0;
  } else if (str.includes('d')) {
    // Days: "4d" → 4 × 8 = 32 hours
    return (parseFloat(str.replace('d', '').trim()) || 0) * 8;
  } else if (str.includes('w')) {
    // Weeks: "1w" → 1 × 40 = 40 hours
    return (parseFloat(str.replace('w', '').trim()) || 0) * 40;
  } else if (str.includes('m')) {
    // Months: "1m" → 1 × 160 = 160 hours (approx)
    return (parseFloat(str.replace('m', '').trim()) || 0) * 160;
  } else {
    // Try to parse as number
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  }
}

/**
 * Link data between tables
 */
function linkDataBetweenTables(result) {
  console.log('🔗 Linking data between tables...');
  console.log(`📊 Available data: ${result.tasks.length} tasks, ${result.assignments.length} assignments`);
  
  // Link tasks with assignments
  if (result.assignments.length > 0) {
    result.tasks.forEach(task => {
      const taskName = task.Name || task['Task Name'] || task.Task;
      if (taskName) {
        // Find assignments for this task
        task.Assignments = result.assignments.filter(assignment => {
          const assignmentTaskName = assignment['Task Name'] || assignment.Task || assignment['Task'];
          const isMatch = assignmentTaskName && 
                 assignmentTaskName.toString().trim() === taskName.toString().trim();
          
          if (isMatch) {
            console.log(`✅ Linked assignment to task: "${taskName}"`);
          }
          
          return isMatch;
        });
      }
    });
  }
  
  // Link resources with assignments
  if (result.assignments.length > 0) {
    result.resources.forEach(resource => {
      const resourceName = resource.Name || resource['Resource Name'];
      if (resourceName) {
        // Find assignments for this resource
        resource.Assignments = result.assignments.filter(assignment => {
          const assignmentResourceName = assignment['Resource Name'] || assignment.Resource || assignment['Assigned To'];
          return assignmentResourceName && 
                 assignmentResourceName.toString().trim() === resourceName.toString().trim();
        });
      }
    });
  }
  
  console.log('✅ Data linking completed');
}

/**
 * Perform risk analysis
 */
function performRiskAnalysis(result) {
  const risks = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Analyze task risks
  result.tasks.forEach(task => {
    const risk = {
      taskId: task.ID || task.Id || 'Unknown',
      taskName: task.Name || task['Task Name'] || 'Unnamed Task',
      riskLevel: 'Low',
      riskType: '',
      description: ''
    };
    
    // Get Outline Level value
    const outlineLevel = parseInt(task['Outline Level'] || task['OutlineLevel'] || task['Outline Number'] || 0);
    
    // Check for overdue tasks
    const finishDate = parseDateString(task['Finish Date'] || task.Finish || task.End);
    const completion = parseFloat(task['% Complete']) || parseFloat(task['% Work Complete']) || 0;
    
    if (finishDate && finishDate < today && completion < 100) {
      const daysOverdue = Math.ceil((today - finishDate) / (1000 * 60 * 60 * 24));
      risk.riskLevel = 'High';
      risk.riskType = 'Schedule';
      risk.description = `Task is ${daysOverdue} day(s) overdue`;
      risks.push({...risk});
    }
    
    // Check for tasks without resources - BUT EXCLUDE OUTLINE LEVEL 1 TASKS
    if ((!task.Assignments || task.Assignments.length === 0) && completion < 100) {
      // Only flag as risk if NOT a heading (Outline Level not equal to 1)
      if (outlineLevel !== 1) {
        risk.riskLevel = 'Medium';
        risk.riskType = 'Resource';
        risk.description = 'Task has no assigned resources';
        risks.push({...risk});
      } else {
        console.log(`ℹ️ Skipping resource check for heading task: "${risk.taskName}" (Outline Level = 1)`);
      }
    }
  });
  
  // Calculate risk statistics
  const highRisks = risks.filter(r => r.riskLevel === 'High').length;
  const mediumRisks = risks.filter(r => r.riskLevel === 'Medium').length;
  const lowRisks = risks.filter(r => r.riskLevel === 'Low').length;
  
  result.riskAnalysis = {
    risks,
    statistics: {
      total: risks.length,
      high: highRisks,
      medium: mediumRisks,
      low: lowRisks
    }
  };
}

/**
 * Clean Excel cell values - FIXED VERSION
 */
function cleanExcelValue(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  // Handle numbers - KEEP AS NUMBERS (IMPORTANT for percentages)
  if (typeof value === 'number') {
    return value;
  }
  
  // Handle dates
  if (value instanceof Date) {
    return value.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // Handle Excel serial numbers (dates)
  if (typeof value === 'number' && value > 25569) {
    try {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {
      // Keep as number
      return value;
    }
  }
  
  // Handle strings
  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    // Handle NA values
    if (trimmed.toLowerCase() === 'na' || trimmed === '#N/A' || trimmed === '-') {
      return '';
    }
    
    // Try to parse as number (for raw numbers like "12")
    if (trimmed !== '') {
      // Remove any percentage signs and commas
      const cleaned = trimmed.replace('%', '').replace(',', '');
      const num = parseFloat(cleaned);
      
      if (!isNaN(num)) {
        return num;
      }
    }
    
    // Handle boolean-like values
    const lowerVal = trimmed.toLowerCase();
    if (lowerVal === 'yes' || lowerVal === 'true') return true;
    if (lowerVal === 'no' || lowerVal === 'false') return false;
    
    return trimmed;
  }
  
  // Default: convert to string
  return String(value).trim();
}

/**
 * Parse date string to Date object
 */
function parseDateString(dateStr) {
  if (!dateStr) return null;
  
  try {
    if (dateStr instanceof Date) {
      return dateStr;
    }
    
    const str = String(dateStr).trim();
    
    const formats = [
      // dd/mm/yyyy or dd-mm-yyyy
      { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parts: [2, 1, 0] },
      // yyyy-mm-dd
      { regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/, parts: [0, 1, 2] },
      // mm/dd/yyyy
      { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parts: [2, 0, 1] },
      // Month name format: "November 3, 2025"
      { regex: /(\w+)\s+(\d{1,2}),\s+(\d{4})/, parts: [2, 0, 1] }
    ];
    
    for (const format of formats) {
      const match = str.match(format.regex);
      if (match) {
        let year, month, day;
        
        if (format.parts[0] === 0) {
          // Month name format
          const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
          ];
          const monthName = match[1].toLowerCase();
          month = monthNames.indexOf(monthName);
          day = parseInt(match[2]);
          year = parseInt(match[3]);
        } else {
          year = parseInt(match[format.parts[0] + 1]);
          month = parseInt(match[format.parts[1] + 1]) - 1;
          day = parseInt(match[format.parts[2] + 1]);
        }
        
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
    
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    console.warn('Failed to parse date:', dateStr, e);
  }
  
  return null;
}

/**
 * Parse duration string to number of days
 */
function parseDuration(durationStr) {
  if (!durationStr) return 0;
  
  const str = String(durationStr).toLowerCase().trim();
  
  // Extract number and unit
  const match = str.match(/(\d+(\.\d+)?)\s*([dwmh]?)/);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[3];
    
    switch(unit) {
      case 'h': return value / 8; // hours to work days
      case 'd': return value;
      case 'w': return value * 5; // weeks to work days
      case 'm': return value * 20; // months to work days
      default: return value; // assume days
    }
  }
  
  // Try to extract just the number
  const numMatch = str.match(/\d+(\.\d+)?/);
  return numMatch ? parseFloat(numMatch[0]) : 0;
}

/**
 * Parse CSV text into tasks and columns
 */
function parseCSV(csvText) {
  csvText = csvText.trim();
  
  if (!csvText) {
    return { tasks: [], columns: [] };
  }
  
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    return { tasks: [], columns: [] };
  }
  
  const headers = parseCSVLine(lines[0]).map(h => h.trim());
  const validHeaders = headers.filter(h => h !== '');
  
  if (validHeaders.length === 0) {
    return { tasks: [], columns: [] };
  }
  
  const tasks = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const task = {};
    let hasData = false;
    
    validHeaders.forEach((header, index) => {
      if (index < values.length) {
        let value = values[index] || '';
        value = value.trim();
        
        if (value !== '') {
          if (!isNaN(value) && value !== '') {
            value = parseFloat(value);
          } else if (value.endsWith('%')) {
            const num = parseFloat(value);
            if (!isNaN(num)) {
              value = num;
            }
          }
          
          task[header] = value;
          hasData = true;
        }
      }
    });
    
    if (hasData && Object.keys(task).length > 0) {
      tasks.push(task);
    }
  }
  
  return { 
    tasks, 
    columns: validHeaders
  };
}

/**
 * Parse a CSV line considering quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = null;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      if (i + 1 < line.length && line[i + 1] === quoteChar) {
        current += quoteChar;
        i++;
      } else {
        inQuotes = false;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  
  return result.map(field => {
    field = field.trim();
    
    if ((field.startsWith('"') && field.endsWith('"')) || 
        (field.startsWith("'") && field.endsWith("'"))) {
      field = field.slice(1, -1);
    }
    
    return field;
  });
}

/**
 * Extract project information from tasks
 */
function extractProjectInfo(tasks, result) {
  if (!tasks || tasks.length === 0) return;
  
  // Find project title
  const firstFewTasks = tasks.slice(0, Math.min(5, tasks.length));
  
  for (const task of firstFewTasks) {
    const potentialTitleFields = ['Project', 'Project Title', 'Title', 'Project Name', 'Task Name', 'Name'];
    
    for (const field of potentialTitleFields) {
      if (task[field] && typeof task[field] === 'string') {
        const value = task[field].trim();
        if (value && value.length < 100) {
          result.projectInfo.title = value;
          break;
        }
      }
    }
    
    if (result.projectInfo.title) break;
  }
  
  if (!result.projectInfo.title) {
    result.projectInfo.title = result.fileName.replace(/\.[^/.]+$/, '');
  }
  
  // Find earliest start date and latest finish date across ALL tasks
  let earliestStart = null;
  let latestFinish = null;
  
  tasks.forEach(task => {
    // Find start date from various possible field names
    const startFields = ['Start Date', 'Start', 'Begin', 'Baseline Start', 'Actual Start', 'Start_Date', 'Actual_Start'];
    for (const field of startFields) {
      if (task[field]) {
        const date = parseDateString(task[field]);
        if (date) {
          if (!earliestStart || date < earliestStart) {
            earliestStart = date;
          }
          break;
        }
      }
    }
    
    // Find finish date from various possible field names
    const finishFields = ['Finish Date', 'Finish', 'End', 'Baseline Finish', 'Actual Finish', 'Finish_Date', 'Actual_Finish'];
    for (const field of finishFields) {
      if (task[field]) {
        const date = parseDateString(task[field]);
        if (date) {
          if (!latestFinish || date > latestFinish) {
            latestFinish = date;
          }
          break;
        }
      }
    }
  });
  
  // Calculate project duration based on earliest start and latest finish
  if (earliestStart) {
    result.projectInfo.startDate = earliestStart.toLocaleDateString('en-IN');
    result.projectInfo.rawStartDate = earliestStart;
  }
  
  if (latestFinish) {
    result.projectInfo.finishDate = latestFinish.toLocaleDateString('en-IN');
    result.projectInfo.rawFinishDate = latestFinish;
  }
  
  if (earliestStart && latestFinish) {
    const durationMs = latestFinish.getTime() - earliestStart.getTime();
    const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
    result.projectInfo.durationDays = durationDays;
    
    // Also calculate working days (excluding weekends)
    const workingDays = calculateWorkingDays(earliestStart, latestFinish);
    result.projectInfo.workingDays = workingDays;
  }
  
  result.projectInfo.totalTasks = tasks.length;
  
  console.log('📅 Project Duration Calculation:', {
    earliestStart: earliestStart ? earliestStart.toLocaleDateString() : 'N/A',
    latestFinish: latestFinish ? latestFinish.toLocaleDateString() : 'N/A',
    durationDays: result.projectInfo.durationDays || 'N/A'
  });
}

/**
 * Calculate working days between two dates (excluding weekends)
 */
function calculateWorkingDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Sunday = 0, Saturday = 6
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Extract analysis data for charts and statistics
 */
function extractAnalysisData(tasks, result) {
  if (!tasks || tasks.length === 0) return;
  
  const analysis = {
    completionStats: {
      totalTasks: tasks.length,
      completedTasks: 0,
      inProgressTasks: 0,
      notStartedTasks: 0,
      overdueTasks: 0,
      totalCompletion: 0,
      avgCompletion: 0
    },
    resourceStats: {},
    durationStats: {
      totalDuration: 0,
      avgDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      taskCount: 0,
      // Add project duration based on start and end dates
      projectDuration: result.projectInfo.durationDays || 0,
      projectWorkingDays: result.projectInfo.workingDays || 0
    }
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  tasks.forEach(task => {
    const completionFields = ['% Complete', 'Progress', 'Percent Complete', 'Complete', '% Work Complete'];
    let completion = 0;
    
    for (const field of completionFields) {
      if (task[field] !== undefined && task[field] !== null && task[field] !== '') {
        const value = parseFloat(task[field]);
        if (!isNaN(value)) {
          completion = Math.min(100, Math.max(0, value));
          break;
        }
      }
    }
    
    analysis.completionStats.totalCompletion += completion;
    
    if (completion >= 100) {
      analysis.completionStats.completedTasks++;
    } else if (completion > 0) {
      analysis.completionStats.inProgressTasks++;
    } else {
      analysis.completionStats.notStartedTasks++;
    }
    
    // Check for overdue tasks
    const endFields = ['Finish Date', 'Finish', 'End'];
    let isOverdue = false;
    
    for (const field of endFields) {
      if (task[field]) {
        const endDate = parseDateString(task[field]);
        if (endDate && endDate < today && completion < 100) {
          isOverdue = true;
          break;
        }
      }
    }
    
    if (isOverdue) {
      analysis.completionStats.overdueTasks++;
    }
    
    // Get individual task duration (for average calculation)
    const durationFields = ['Duration', 'Total Duration', 'Work'];
    let duration = 0;
    
    for (const field of durationFields) {
      if (task[field]) {
        const parsed = parseDuration(task[field]);
        if (parsed > 0) {
          duration = parsed;
          break;
        }
      }
    }
    
    if (duration > 0) {
      analysis.durationStats.totalDuration += duration;
      analysis.durationStats.minDuration = Math.min(analysis.durationStats.minDuration, duration);
      analysis.durationStats.maxDuration = Math.max(analysis.durationStats.maxDuration, duration);
      analysis.durationStats.taskCount++;
    }
    
    // Get resources
    const resourceFields = ['Resource Names', 'Resources', 'Resource', 'Assigned To'];
    for (const field of resourceFields) {
      if (task[field]) {
        const resources = String(task[field]).split(/[,;]/).map(r => r.trim()).filter(r => r);
        
        resources.forEach(resource => {
          if (!analysis.resourceStats[resource]) {
            analysis.resourceStats[resource] = {
              taskCount: 0,
              totalCompletion: 0,
              totalDuration: 0
            };
          }
          
          analysis.resourceStats[resource].taskCount++;
          analysis.resourceStats[resource].totalCompletion += completion;
          analysis.resourceStats[resource].totalDuration += duration;
        });
        
        break;
      }
    }
  });
  
  // Calculate averages
  analysis.completionStats.avgCompletion = analysis.completionStats.totalTasks > 0
    ? analysis.completionStats.totalCompletion / analysis.completionStats.totalTasks
    : 0;
  
  analysis.durationStats.avgDuration = analysis.durationStats.taskCount > 0
    ? analysis.durationStats.totalDuration / analysis.durationStats.taskCount
    : 0;
  
  if (analysis.durationStats.minDuration === Infinity) {
    analysis.durationStats.minDuration = 0;
  }
  
  // Log the duration information
  console.log('📊 Duration Analysis:', {
    projectDurationDays: analysis.durationStats.projectDuration,
    projectWorkingDays: analysis.durationStats.projectWorkingDays,
    totalTaskDuration: analysis.durationStats.totalDuration,
    avgTaskDuration: analysis.durationStats.avgDuration
  });
  
  result.analysis = analysis;
}

export default extractFromExcelOrCSV;