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
      
      // Check for specific sheet names from your file
      const taskSheetName = workbook.SheetNames.find(name => 
        name.toLowerCase().includes('task') || name.toLowerCase() === 'task_table'
      );
      
      const resourceSheetName = workbook.SheetNames.find(name => 
        name.toLowerCase().includes('resource') || name.toLowerCase() === 'resource_table'
      );
      
      const assignmentSheetName = workbook.SheetNames.find(name => 
        name.toLowerCase().includes('assignment') || name.toLowerCase() === 'assignment_table'
      );
      
      console.log('🔍 Sheet detection:', {
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
        // Try first sheet as task sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        if (firstSheet && firstSheet['!ref']) {
          console.log(`⚠️ No task sheet found, using first sheet: ${workbook.SheetNames[0]}`);
          processTaskSheet(firstSheet, result, workbook.SheetNames[0]);
        }
      }
      
      // Process Resource_Table sheet
      if (resourceSheetName) {
        const resourceSheet = workbook.Sheets[resourceSheetName];
        if (resourceSheet && resourceSheet['!ref']) {
          console.log(`✅ Processing Resource sheet: ${resourceSheetName}`);
          processResourceSheet(resourceSheet, result, resourceSheetName);
        }
      } else {
        // Check if any other sheet might be resource sheet
        workbook.SheetNames.forEach(sheetName => {
          if (sheetName !== taskSheetName && sheetName !== assignmentSheetName) {
            const sheet = workbook.Sheets[sheetName];
            if (sheet && sheet['!ref']) {
              const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
              if (jsonData.length > 0) {
                const headers = jsonData[0] || [];
                const headerStr = headers.join(' ').toLowerCase();
                if (headerStr.includes('resource') || headerStr.includes('name') || headerStr.includes('type')) {
                  console.log(`✅ Found Resource sheet: ${sheetName}`);
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
        // Check if any other sheet might be assignment sheet
        workbook.SheetNames.forEach(sheetName => {
          if (sheetName !== taskSheetName && sheetName !== resourceSheetName) {
            const sheet = workbook.Sheets[sheetName];
            if (sheet && sheet['!ref']) {
              const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 });
              if (jsonData.length > 0) {
                const headers = jsonData[0] || [];
                const headerStr = headers.join(' ').toLowerCase();
                if (headerStr.includes('assignment') || headerStr.includes('task name') || headerStr.includes('resource name') || headerStr.includes('work')) {
                  console.log(`✅ Found Assignment sheet: ${sheetName}`);
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
    // Get data as JSON with headers
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      raw: false,
      header: 1
    });
    
    if (!jsonData || jsonData.length < 2) {
      console.warn(`Task sheet "${sheetName}" has insufficient data`);
      return;
    }
    
    const headers = jsonData[0] || [];
    const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
    console.log(`📋 Task sheet headers:`, cleanedHeaders.filter(h => h));
    
    const tasks = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const task = {};
      let hasData = false;
      
      cleanedHeaders.forEach((header, index) => {
        if (header && header !== '' && index < row.length) {
          let value = row[index];
          value = cleanExcelValue(value);
          
          if (value !== '') {
            task[header] = value;
            hasData = true;
          }
        }
      });
      
      if (hasData && Object.keys(task).length > 0) {
        // Ensure ID field exists
        if (!task.ID && !task.Id && !task.id) {
          task.ID = tasks.length + 1;
        }
        
        // Ensure Name field exists
        if (!task.Name && !task['Task Name'] && !task.Task) {
          // Look for any column that might contain task name
          const possibleNameKeys = Object.keys(task).filter(key => 
            key.toLowerCase().includes('name') || 
            key.toLowerCase().includes('task')
          );
          if (possibleNameKeys.length > 0) {
            task.Name = task[possibleNameKeys[0]];
          } else {
            task.Name = `Task ${task.ID}`;
          }
        }
        
        tasks.push(task);
      }
    }
    
    if (tasks.length > 0) {
      result.tasks = tasks;
      result.extractedSheets.push(`${sheetName} (${tasks.length} tasks)`);
      console.log(`✅ Extracted ${tasks.length} tasks from "${sheetName}"`);
    }
    
  } catch (error) {
    console.error(`Error processing task sheet "${sheetName}":`, error);
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
 * Process Assignment sheet from Excel
 */
function processAssignmentSheet(sheet, result, sheetName) {
  try {
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      raw: false,
      header: 1
    });
    
    if (!jsonData || jsonData.length < 2) {
      console.warn(`Assignment sheet "${sheetName}" has insufficient data`);
      return;
    }
    
    const headers = jsonData[0] || [];
    const cleanedHeaders = headers.map(h => h ? h.toString().trim() : '');
    
    console.log(`🔗 Assignment sheet headers:`, cleanedHeaders.filter(h => h));
    
    const assignments = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const assignment = {};
      let hasData = false;
      
      cleanedHeaders.forEach((header, index) => {
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
        assignments.push(assignment);
      }
    }
    
    if (assignments.length > 0) {
      result.assignments = assignments;
      result.extractedSheets.push(`${sheetName} (${assignments.length} assignments)`);
      console.log(`✅ Extracted ${assignments.length} assignments from "${sheetName}"`);
    }
    
  } catch (error) {
    console.error(`Error processing assignment sheet "${sheetName}":`, error);
  }
}

/**
 * Link data between tables
 */
function linkDataBetweenTables(result) {
  console.log('🔗 Linking data between tables...');
  
  // Link tasks with assignments
  if (result.assignments.length > 0) {
    result.tasks.forEach(task => {
      const taskName = task.Name || task['Task Name'] || task.Task;
      if (taskName) {
        // Find assignments for this task
        task.Assignments = result.assignments.filter(assignment => {
          const assignmentTaskName = assignment['Task Name'] || assignment.Task || assignment['Task'];
          return assignmentTaskName && 
                 assignmentTaskName.toString().trim() === taskName.toString().trim();
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
    
//     // Check for tasks without resources
//     if ((!task.Assignments || task.Assignments.length === 0) && completion < 100) {
//       risk.riskLevel = 'Medium';
//       risk.riskType = 'Resource';
//       risk.description = 'Task has no assigned resources';
//       risks.push({...risk});
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
 * Clean Excel cell values
 */
function cleanExcelValue(value) {
  if (value === null || value === undefined) {
    return '';
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
    }
  }
  
  // Handle percentages
  if (typeof value === 'string' && value.includes('%')) {
    const num = parseFloat(value.replace('%', ''));
    if (!isNaN(num)) {
      return num;
    }
  }
  
  // Handle boolean-like values
  if (typeof value === 'string') {
    const lowerVal = value.toLowerCase().trim();
    if (lowerVal === 'yes' || lowerVal === 'true') return true;
    if (lowerVal === 'no' || lowerVal === 'false') return false;
  }
  
  // Convert to string and trim
  const strValue = value.toString().trim();
  
  // Handle empty strings or whitespace
  if (strValue === '' || strValue.replace(/\s/g, '') === '') {
    return '';
  }
  
  return strValue;
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
      { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parts: [2, 0, 1] }
    ];
    
    for (const format of formats) {
      const match = str.match(format.regex);
      if (match) {
        const year = parseInt(match[format.parts[0] + 1]);
        const month = parseInt(match[format.parts[1] + 1]) - 1;
        const day = parseInt(match[format.parts[2] + 1]);
        
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
    const startFields = ['Start Date', 'Start', 'Begin', 'Baseline Start', 'Actual Start'];
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
    const finishFields = ['Finish Date', 'Finish', 'End', 'Baseline Finish', 'Actual Finish'];
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
//       taskCount: 0
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
    
//     // Get duration
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
  
//   result.analysis = analysis;
// }
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