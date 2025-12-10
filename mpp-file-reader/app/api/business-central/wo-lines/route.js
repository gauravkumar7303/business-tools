// app/api/business-central/wo-lines/route.js - Work Order Lines API
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const woNo = searchParams.get('woNo');
  
  console.log('🟣 ========== WORK ORDER LINES API CALLED ==========');
  console.log('📋 Requested WO Number:', woNo);
  console.log('🌐 Full URL:', request.url);
  
  if (!woNo) {
    console.log('❌ No WO Number provided');
    return Response.json({
      success: false,
      error: 'WO Number is required',
      data: []
    }, { status: 400 });
  }
  
  try {
    // 1. Get Access Token
    console.log('🔐 Step 1: Getting access token...');
    const token = await getAccessToken();
    
    if (!token?.access_token) {
      console.log('⚠️ No token available, returning test data');
      return getTestDataResponse(woNo, 'no_token');
    }
    
    console.log('✅ Token received successfully');
    
    // 2. Setup Business Central API
    const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
    const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
    const headers = {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    console.log('🔍 Step 2: Searching for WO lines in Business Central...');
    
    // Clean WO number - remove WO- prefix if exists
    const cleanWoNo = woNo.replace('WO-', '').replace('AL-WO-', '').trim();
    console.log(`🧹 Cleaned WO Number: "${cleanWoNo}"`);
    
    let realLines = [];
    
    // STRATEGY 1: Try custom WorkOrderLinesApi (if you have one)
    try {
      console.log('\n📡 STRATEGY 1: Using custom WorkOrderLinesApi page...');
      const customApiUrl = `${baseUrl}/Company('${companyName}')/WorkOrderLines?$filter=documentNo eq '${cleanWoNo}'`;
      console.log('🔗 URL:', customApiUrl);
      
      const response = await fetch(customApiUrl, { 
        headers,
        signal: AbortSignal.timeout(10000)
      });
      
      console.log(`📊 Response Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Found ${data.value?.length || 0} lines from custom API`);
        
        if (data.value && data.value.length > 0) {
          realLines = data.value;
          console.log('🎉 SUCCESS via custom API!');
          console.log('📝 Sample line:', JSON.stringify(data.value[0], null, 2));
        } else {
          console.log('⚠️ Custom API returned empty array');
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Custom API failed: ${response.status}`);
        console.log('❌ Error:', errorText.substring(0, 200));
      }
    } catch (error) {
      console.log(`❌ Custom API error: ${error.message}`);
    }
    
    // STRATEGY 2: Try standard Production Order Lines or Work Order Lines
    if (realLines.length === 0) {
      try {
        console.log('\n📡 STRATEGY 2: Using standard productionOrderLines endpoint...');
        const standardUrl = `${baseUrl}/Company('${companyName}')/productionOrderLines?$filter=documentNo eq '${cleanWoNo}'`;
        console.log('🔗 URL:', standardUrl);
        
        const response = await fetch(standardUrl, { 
          headers,
          signal: AbortSignal.timeout(10000)
        });
        
        console.log(`📊 Response Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found ${data.value?.length || 0} lines from standard API`);
          
          if (data.value && data.value.length > 0) {
            realLines = data.value;
            console.log('🎉 SUCCESS via standard API!');
          }
        } else {
          console.log(`❌ Standard API failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Standard API error: ${error.message}`);
      }
    }
    
    // STRATEGY 3: Fetch all lines and filter locally
    if (realLines.length === 0) {
      try {
        console.log('\n📡 STRATEGY 3: Using custom API with broader filter...');
        const broaderUrl = `${baseUrl}/Company('${companyName}')/WorkOrderLines`;
        console.log('🔗 URL:', broaderUrl);
        console.log('⚠️ Warning: Fetching ALL lines (no filter) - will filter locally');
        
        const response = await fetch(broaderUrl, { 
          headers,
          signal: AbortSignal.timeout(15000)
        });
        
        console.log(`📊 Response Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`📦 Received ${data.value?.length || 0} total lines`);
          
          if (data.value && data.value.length > 0) {
            // First, inspect the actual field names
            console.log('\n🔍 INSPECTING ACTUAL WO DATA STRUCTURE:');
            console.log('📋 First line fields:', Object.keys(data.value[0]));
            console.log('📋 First line sample:', JSON.stringify(data.value[0], null, 2));
            
            // Try to find document number field
            const firstLine = data.value[0];
            let docNoFieldName = null;
            
            // Check all possible field name variations for Work Orders
            const possibleDocNoFields = [
              'documentNo', 'Document_No', 'Document No.', 'Document_No_', 
              'DocumentNo', 'docNo', 'DocNo', 'WO_No', 'WONo', 'woNo',
              'workOrderNo', 'Work_Order_No', 'ProductionOrderNo', 'Production_Order_No'
            ];
            
            for (const fieldName of possibleDocNoFields) {
              if (fieldName in firstLine) {
                docNoFieldName = fieldName;
                console.log(`✅ Found document number field: "${fieldName}"`);
                console.log(`📋 Value: "${firstLine[fieldName]}"`);
                break;
              }
            }
            
            if (!docNoFieldName) {
              console.log('⚠️ Could not find document number field automatically');
              console.log('📋 All fields in first line:', Object.keys(firstLine));
            }
            
            // Filter locally with all possible field names and values
            const filtered = data.value.filter(line => {
              for (const fieldName of possibleDocNoFields) {
                if (fieldName in line) {
                  const value = line[fieldName];
                  // Try matching with various formats
                  if (value === cleanWoNo || 
                      value === woNo || 
                      value === `WO-${cleanWoNo}` ||
                      value === `AL-WO-${cleanWoNo}` ||
                      String(value) === cleanWoNo ||
                      String(value) === woNo) {
                    console.log(`✅ MATCH FOUND! Field: "${fieldName}", Value: "${value}"`);
                    return true;
                  }
                }
              }
              return false;
            });
            
            console.log(`\n🔍 Filtered to ${filtered.length} matching lines for WO: ${woNo} (clean: ${cleanWoNo})`);
            
            if (filtered.length === 0) {
              // Debug: Show what document numbers exist
              console.log('\n⚠️ NO MATCHES FOUND. Showing sample WO numbers from data:');
              const sampleDocNos = data.value.slice(0, 10).map(line => {
                for (const fieldName of possibleDocNoFields) {
                  if (fieldName in line) {
                    return `${fieldName}: "${line[fieldName]}"`;
                  }
                }
                return 'No doc field found';
              });
              console.log('📋 Sample WO numbers:', sampleDocNos);
            } else {
              realLines = filtered;
              console.log('🎉 SUCCESS via local filtering!');
            }
          }
        } else {
          console.log(`❌ Broader fetch failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Broader fetch error: ${error.message}`);
      }
    }
    
    // 3. Process and return response
    if (realLines.length > 0) {
      console.log('\n✅ REAL WO DATA FOUND!');
      console.log(`📊 Processing ${realLines.length} lines from Business Central`);
      
      const processedLines = processBusinessCentralLines(realLines, woNo);
      
      return Response.json({
        success: true,
        woNo: woNo,
        data: processedLines,
        dataSource: 'business_central',
        lineCount: processedLines.length,
        _timestamp: new Date().toISOString(),
        _debug: {
          message: 'Real data from Business Central',
          rawLinesCount: realLines.length,
          processedLinesCount: processedLines.length,
          cleanWoNo: cleanWoNo,
          originalWoNo: woNo
        }
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    } else {
      console.log('\n⚠️ NO REAL WO DATA FOUND - Returning test data');
      return getTestDataResponse(woNo, 'no_real_data_found');
    }
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in WO lines API:', error);
    return getTestDataResponse(woNo, `error: ${error.message}`);
  }
}

// Process Business Central WO lines with proper field mapping
function processBusinessCentralLines(lines, woNumber) {
  console.log(`\n🔄 Processing ${lines.length} Business Central WO lines...`);
  
  return lines.map((line, index) => {
    // Handle multiple possible field names from BC API
    const lineNo = line.lineNo || line.Line_No || line['Line No.'] || (index + 1);
    const itemNo = line.itemNo || line.no || line.No || line['No.'] || `ITEM-${String(index + 1).padStart(3, '0')}`;
    const description = line.description || line.Description || 'Work Order Item';
    const quantity = parseFloat(line.quantity || line.Quantity || line.qty || line.Qty || 0);
    const unitCost = parseFloat(line.unitCost || line['Unit Cost'] || line.Unit_Cost || line.cost || line.Cost || 0);
    const lineAmount = parseFloat(line.lineAmount || line['Line Amount'] || line.amount || line.Amount || (quantity * unitCost) || 0);
    const unitOfMeasure = line.unitOfMeasure || line['Unit of Measure'] || line.Unit_of_Measure_Code || 'PCS';
    const location = line.location || line.Location || line.locationCode || line['Location Code'] || 'MAIN';
    const status = line.status || line.Status || 'Planned';
    const documentNo = line.documentNo || line['Document No.'] || line.Document_No || woNumber;
    
    console.log(`📝 WO Line ${lineNo}: ${itemNo} - ${description} (Qty: ${quantity}, Cost: ${unitCost})`);
    
    return {
      lineNo,
      itemNo,
      description,
      quantity,
      unitCost,
      lineAmount,
      unitOfMeasure,
      location,
      status,
      documentNo,
      _source: 'business_central'
    };
  });
}

// Generate test data response for WO
function getTestDataResponse(woNo, reason) {
  console.log(`\n📦 Generating test data for WO: ${woNo}`);
  console.log(`📋 Reason: ${reason}`);
  
  const testData = generateRealisticTestData(woNo);
  
  return Response.json({
    success: true,
    woNo: woNo,
    data: testData,
    dataSource: 'realistic_test_data',
    lineCount: testData.length,
    _timestamp: new Date().toISOString(),
    _debug: {
      reason: reason,
      message: 'Using realistic test data for demonstration',
      totalAmount: testData.reduce((sum, line) => sum + line.lineAmount, 0)
    }
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

// Generate realistic WO test data
function generateRealisticTestData(woNumber) {
  console.log(`🎨 Creating realistic test lines for WO: ${woNumber}`);
  
  return [
    {
      lineNo: 10000,
      itemNo: 'COMP-001',
      description: 'Main Assembly Component - Steel Frame Structure',
      quantity: 5,
      unitCost: 15000,
      lineAmount: 75000,
      unitOfMeasure: 'PCS',
      location: 'PRODUCTION',
      status: 'Released',
      documentNo: woNumber,
      _source: 'test_data'
    },
    {
      lineNo: 20000,
      itemNo: 'COMP-002',
      description: 'Electronic Control Panel Assembly',
      quantity: 5,
      unitCost: 8500,
      lineAmount: 42500,
      unitOfMeasure: 'PCS',
      location: 'PRODUCTION',
      status: 'Released',
      documentNo: woNumber,
      _source: 'test_data'
    },
    {
      lineNo: 30000,
      itemNo: 'RAW-003',
      description: 'Hydraulic System Components Kit',
      quantity: 10,
      unitCost: 3200,
      lineAmount: 32000,
      unitOfMeasure: 'SET',
      location: 'WAREHOUSE',
      status: 'Planned',
      documentNo: woNumber,
      _source: 'test_data'
    },
    {
      lineNo: 40000,
      itemNo: 'PART-004',
      description: 'Precision Bearings and Mounting Hardware',
      quantity: 20,
      unitCost: 1250,
      lineAmount: 25000,
      unitOfMeasure: 'SET',
      location: 'PRODUCTION',
      status: 'Released',
      documentNo: woNumber,
      _source: 'test_data'
    },
    {
      lineNo: 50000,
      itemNo: 'MAT-005',
      description: 'Specialized Coating Material for Finishing',
      quantity: 50,
      unitCost: 450,
      lineAmount: 22500,
      unitOfMeasure: 'KG',
      location: 'FINISHING',
      status: 'Planned',
      documentNo: woNumber,
      _source: 'test_data'
    }
  ];
}

// Token function with enhanced error logging
async function getAccessToken() {
  try {
    console.log('\n🔐 ========== TOKEN ACQUISITION (WO) ==========');
    
    const tenantId = process.env.BC_TENANT_ID;
    const clientId = process.env.BC_CLIENT_ID;
    const clientSecret = process.env.BC_CLIENT_SECRET;
    
    console.log('📋 Environment Variables Check:');
    console.log(`  - BC_TENANT_ID: ${tenantId ? '✓ SET' : '✗ NOT SET'}`);
    console.log(`  - BC_CLIENT_ID: ${clientId ? '✓ SET' : '✗ NOT SET'}`);
    console.log(`  - BC_CLIENT_SECRET: ${clientSecret ? '✓ SET (hidden)' : '✗ NOT SET'}`);
    
    if (!tenantId || !clientId || !clientSecret) {
      console.error('❌ Missing environment variables for Business Central token');
      return null;
    }
    
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    console.log('🌐 Token URL:', tokenUrl);
    
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'https://api.businesscentral.dynamics.com/.default'
    });
    
    console.log('📤 Making token request to Microsoft...');
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    console.log(`📊 Token Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Token request failed:', response.status);
      console.error('❌ Error details:', errorText.substring(0, 500));
      return null;
    }
    
    const tokenData = await response.json();
    console.log('✅ Token acquired successfully!');
    console.log(`⏰ Token expires in: ${tokenData.expires_in} seconds`);
    
    return tokenData;
    
  } catch (error) {
    console.error('💥 Token acquisition error:', error.message);
    console.error('💥 Stack:', error.stack);
    return null;
  }
}