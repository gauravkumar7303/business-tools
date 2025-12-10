// export async function GET(request) {
//   console.log('🚀 PO Lines API called');
//   console.log('🔗 Request URL:', request.url);
  
//   const { searchParams } = new URL(request.url);
//   const poNo = searchParams.get('poNo');
  
//   console.log(`📋 Received PO Number: "${poNo}"`);
//   console.log(`🔍 All search params:`, Object.fromEntries(searchParams.entries()));
  
//   if (!poNo) {
//     console.log('❌ PO Number is missing');
//     return Response.json({
//       success: false,
//       error: 'PO Number is required',
//       lines: [],
//       _debug: { url: request.url, receivedPoNo: poNo }
//     });
//   }
  
//   console.log(`✅ Processing PO: ${poNo}`);
  
//   // Rest of your code remains the same...
//   try {
//     // 1. Get Access Token
//     console.log('🔑 Getting access token...');
//     const tokenResponse = await getAccessToken();
    
//     if (!tokenResponse?.access_token) {
//       console.log('❌ Token not available, returning mock lines');
//       return Response.json({
//         success: true,
//         data: generateMockPOLines(poNo),
//         dataSource: 'mock_data',
//         _timestamp: new Date().toISOString(),
//         _debug: { poNo, reason: 'no_token' }
//       });
//     }
    
//     console.log('✅ Token received successfully');
    
//     // 2. Build URLs for Business Central API
//     const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
//     const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
//     const headers = {
//       'Authorization': `Bearer ${tokenResponse.access_token}`,
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     };
    
//     // 3. Try multiple endpoints for PO lines
//     console.log('🔍 Searching for PO lines...');
//     let poLines = [];
    
//     // Clean PO number - remove AL-PO- prefix
//     const cleanPoNo = poNo.replace('AL-PO-', '');
//     console.log(`🧹 Cleaned PO Number: "${cleanPoNo}"`);
    
//     // Try different endpoints
//     const endpoints = [
//       // Endpoint 1: PurchaseOrderLine
//       `${baseUrl}/Company('${companyName}')/PurchaseOrderLine?$filter=Document_No eq '${cleanPoNo}'`,
//       // Endpoint 2: PurchaseOrderLine with different field name
//       `${baseUrl}/Company('${companyName}')/PurchaseOrderLine?$filter=PO_No eq '${cleanPoNo}'`,
//       // Endpoint 3: purchaseDocumentLines
//       `${baseUrl}/Company('${companyName}')/purchaseDocumentLines?$filter=documentNo eq '${cleanPoNo}' and documentType eq 'Order'`,
//       // Endpoint 4: purchaseDocumentLines without documentType filter
//       `${baseUrl}/Company('${companyName}')/purchaseDocumentLines?$filter=documentNo eq '${cleanPoNo}'`
//     ];
    
//     console.log('🔗 Endpoints to try:');
//     endpoints.forEach((endpoint, index) => {
//       console.log(`  ${index + 1}. ${endpoint}`);
//     });
    
//     for (const endpoint of endpoints) {
//       try {
//         console.log(`\n🔄 Trying endpoint: ${endpoint}`);
//         console.log(`📤 Making request to Business Central...`);
        
//         const response = await fetch(endpoint, { 
//           headers,
//           // Add timeout
//           signal: AbortSignal.timeout(10000)
//         });
        
//         console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
        
//         if (response.ok) {
//           const data = await response.json();
//           console.log(`✅ Response received: ${data.value?.length || 0} lines found`);
          
//           if (data.value && data.value.length > 0) {
//             poLines = data.value;
//             console.log(`🎉 Found ${poLines.length} lines for PO ${cleanPoNo}`);
            
//             // Log first line for debugging
//             if (poLines.length > 0) {
//               console.log('🔍 First line sample:', JSON.stringify(poLines[0], null, 2));
//             }
//             break;
//           } else {
//             console.log('📭 No lines found in this endpoint');
//           }
//         } else {
//           console.log(`❌ Endpoint failed: ${response.status}`);
//           const errorText = await response.text();
//           console.log(`❌ Error details: ${errorText.substring(0, 200)}`);
//         }
//       } catch (error) {
//         console.log(`❌ Endpoint error: ${error.message}`);
//       }
//     }
    
//     // 4. Process the lines
//     let processedLines = [];
    
//     if (poLines.length > 0) {
//       console.log('✅ Processing real PO lines from Business Central');
//       processedLines = processPOLines(poLines);
//     } else {
//       console.log('📦 No lines found, using mock data');
//       processedLines = generateMockPOLines(poNo);
//     }
    
//     console.log(`📊 Final processed lines: ${processedLines.length}`);
    
//     // 5. Return response
//     return Response.json({
//       success: true,
//       poNo: poNo,
//       data: processedLines,
//       dataSource: poLines.length > 0 ? 'business_central' : 'mock_data',
//       lineCount: processedLines.length,
//       _timestamp: new Date().toISOString(),
//       _debug: {
//         originalLinesFound: poLines.length,
//         processedLines: processedLines.length,
//         poNumber: poNo,
//         cleanPoNumber: cleanPoNo,
//         usedMockData: poLines.length === 0
//       }
//     }, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-store, max-age=0'
//       }
//     });
    
//   } catch (error) {
//     console.error('💥 Error in getPOLines:', error);
    
//     return Response.json({
//       success: false,
//       error: error.message,
//       poNo: poNo,
//       data: generateMockPOLines(poNo),
//       dataSource: 'error_fallback',
//       _debug: { error: error.message, poNo }
//     }, { status: 200 });
//   }
// }
// app/api/business-central/po-lines/route.js - FIXED VERSION
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const poNo = searchParams.get('poNo');
  
  console.log('🔵 ========== PO LINES API CALLED ==========');
  console.log('📋 Requested PO Number:', poNo);
  console.log('🌐 Full URL:', request.url);
  
  if (!poNo) {
    console.log('❌ No PO Number provided');
    return Response.json({
      success: false,
      error: 'PO Number is required',
      data: []
    }, { status: 400 });
  }
  
  try {
    // 1. Get Access Token
    console.log('🔐 Step 1: Getting access token...');
    const token = await getAccessToken();
    
    if (!token?.access_token) {
      console.log('⚠️ No token available, returning test data');
      return getTestDataResponse(poNo, 'no_token');
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
    
    console.log('🔍 Step 2: Searching for PO lines in Business Central...');
    
    // Clean PO number - remove AL-PO- prefix if exists
    const cleanPoNo = poNo.replace('AL-PO-', '').trim();
    console.log(`🧹 Cleaned PO Number: "${cleanPoNo}"`);
    
    let realLines = [];
    
    // STRATEGY 1: Try your custom API page (PurchaseOrderLinesApi)
    try {
      console.log('\n📡 STRATEGY 1: Using custom PurchaseOrderLinesApi page...');
      const customApiUrl = `${baseUrl}/Company('${companyName}')/PurchaseOrderLines?$filter=documentNo eq '${cleanPoNo}'`;
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
    
    // STRATEGY 2: Try standard Purchase Lines endpoint
    if (realLines.length === 0) {
      try {
        console.log('\n📡 STRATEGY 2: Using standard purchaseLines endpoint...');
        const standardUrl = `${baseUrl}/Company('${companyName}')/purchaseLines?$filter=documentType eq 'Order' and documentNo eq '${cleanPoNo}'`;
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
    
    // STRATEGY 3: Try with PO Type filter
    if (realLines.length === 0) {
      try {
        console.log('\n📡 STRATEGY 3: Using custom API with broader filter...');
        const broaderUrl = `${baseUrl}/Company('${companyName}')/PurchaseOrderLines`;
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
            // First, inspect the actual field names in the first line
            console.log('\n🔍 INSPECTING ACTUAL DATA STRUCTURE:');
            console.log('📋 First line fields:', Object.keys(data.value[0]));
            console.log('📋 First line sample:', JSON.stringify(data.value[0], null, 2));
            
            // Try to find document number field
            const firstLine = data.value[0];
            let docNoFieldName = null;
            
            // Check all possible field name variations
            const possibleDocNoFields = [
              'documentNo', 'Document_No', 'Document No.', 'Document_No_', 
              'DocumentNo', 'docNo', 'DocNo', 'PO_No', 'PONo', 'poNo'
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
              // Try all possible field names
              for (const fieldName of possibleDocNoFields) {
                if (fieldName in line) {
                  const value = line[fieldName];
                  // Try matching with various formats
                  if (value === cleanPoNo || 
                      value === poNo || 
                      value === `AL-PO-${cleanPoNo}` ||
                      String(value) === cleanPoNo ||
                      String(value) === poNo) {
                    console.log(`✅ MATCH FOUND! Field: "${fieldName}", Value: "${value}"`);
                    return true;
                  }
                }
              }
              return false;
            });
            
            console.log(`\n🔍 Filtered to ${filtered.length} matching lines for PO: ${poNo} (clean: ${cleanPoNo})`);
            
            if (filtered.length === 0) {
              // Debug: Show what document numbers exist
              console.log('\n⚠️ NO MATCHES FOUND. Showing sample document numbers from data:');
              const sampleDocNos = data.value.slice(0, 10).map(line => {
                for (const fieldName of possibleDocNoFields) {
                  if (fieldName in line) {
                    return `${fieldName}: "${line[fieldName]}"`;
                  }
                }
                return 'No doc field found';
              });
              console.log('📋 Sample doc numbers:', sampleDocNos);
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
      console.log('\n✅ REAL DATA FOUND!');
      console.log(`📊 Processing ${realLines.length} lines from Business Central`);
      
      const processedLines = processBusinessCentralLines(realLines, poNo);
      
      return Response.json({
        success: true,
        poNo: poNo,
        data: processedLines,
        dataSource: 'business_central',
        lineCount: processedLines.length,
        _timestamp: new Date().toISOString(),
        _debug: {
          message: 'Real data from Business Central',
          rawLinesCount: realLines.length,
          processedLinesCount: processedLines.length,
          cleanPoNo: cleanPoNo,
          originalPoNo: poNo
        }
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    } else {
      console.log('\n⚠️ NO REAL DATA FOUND - Returning test data');
      return getTestDataResponse(poNo, 'no_real_data_found');
    }
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in PO lines API:', error);
    return getTestDataResponse(poNo, `error: ${error.message}`);
  }
}

// Process Business Central lines with proper field mapping
function processBusinessCentralLines(lines, poNumber) {
  console.log(`\n🔄 Processing ${lines.length} Business Central lines...`);
  
  return lines.map((line, index) => {
    // Handle multiple possible field names from BC API
    const lineNo = line.lineNo || line.Line_No || line['Line No.'] || (index + 1);
    const itemNo = line.no || line.No || line['No.'] || `ITEM-${String(index + 1).padStart(3, '0')}`;
    const description = line.description || line.Description || 'Item';
    const quantity = parseFloat(line.quantity || line.Quantity || 0);
    const unitCost = parseFloat(line.directUnitCost || line['Direct Unit Cost'] || line.unitCost || line['Unit Cost'] || 0);
    const lineAmount = parseFloat(line.lineAmount || line['Line Amount'] || line.amount || (quantity * unitCost) || 0);
    const unitOfMeasure = line.unitOfMeasure || line['Unit of Measure'] || line.Unit_of_Measure_Code || 'PCS';
    const gstGroupCode = line.gstGroupCode || line['GST Group Code'] || line.GST_Group_Code || '18%';
    const hsnSacCode = line.hsnSacCode || line['HSN/SAC Code'] || line.HSN_SAC_Code || 'N/A';
    const documentNo = line.documentNo || line['Document No.'] || line.Document_No || poNumber;
    
    console.log(`📝 Line ${lineNo}: ${itemNo} - ${description} (Qty: ${quantity}, Cost: ${unitCost})`);
    
    return {
      lineNo,
      itemNo,
      description,
      quantity,
      unitCost,
      lineAmount,
      unitOfMeasure,
      gstGroupCode,
      hsnSacCode,
      documentNo,
      _source: 'business_central'
    };
  });
}

// Generate test data response
function getTestDataResponse(poNo, reason) {
  console.log(`\n📦 Generating test data for PO: ${poNo}`);
  console.log(`📋 Reason: ${reason}`);
  
  const testData = generateRealisticTestData(poNo);
  
  return Response.json({
    success: true,
    poNo: poNo,
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

// Generate realistic test data
function generateRealisticTestData(poNumber) {
  console.log(`🎨 Creating realistic test lines for: ${poNumber}`);
  
  return [
    {
      lineNo: 1,
      itemNo: 'MAT-001',
      description: 'Structural Steel Plates - 10mm, Grade 304, ASTM A240',
      quantity: 125,
      unitCost: 1850,
      lineAmount: 231250,
      unitOfMeasure: 'KG',
      gstGroupCode: '18%',
      hsnSacCode: '7210',
      documentNo: poNumber,
      _source: 'test_data'
    },
    {
      lineNo: 2,
      itemNo: 'ELEC-002',
      description: 'Electronics Components Kit (Arduino, Sensors, Connectors)',
      quantity: 85,
      unitCost: 1250,
      lineAmount: 106250,
      unitOfMeasure: 'SET',
      gstGroupCode: '18%',
      hsnSacCode: '8542',
      documentNo: poNumber,
      _source: 'test_data'
    },
    {
      lineNo: 3,
      itemNo: 'PACK-003',
      description: 'Industrial Packaging Material - Corrugated Boxes (50x50x50 cm)',
      quantity: 200,
      unitCost: 450,
      lineAmount: 90000,
      unitOfMeasure: 'BOX',
      gstGroupCode: '12%',
      hsnSacCode: '4819',
      documentNo: poNumber,
      _source: 'test_data'
    },
    {
      lineNo: 4,
      itemNo: 'MACH-004',
      description: 'Precision Machine Parts - Gear Assembly for CNC Machine',
      quantity: 15,
      unitCost: 8500,
      lineAmount: 127500,
      unitOfMeasure: 'SET',
      gstGroupCode: '18%',
      hsnSacCode: '8483',
      documentNo: poNumber,
      _source: 'test_data'
    },
    {
      lineNo: 5,
      itemNo: 'RAW-005',
      description: 'Raw Materials - Aluminium Extrusions 6061-T6',
      quantity: 350,
      unitCost: 320,
      lineAmount: 112000,
      unitOfMeasure: 'KG',
      gstGroupCode: '12%',
      hsnSacCode: '7604',
      documentNo: poNumber,
      _source: 'test_data'
    }
  ];
}

// Token function with enhanced error logging
async function getAccessToken() {
  try {
    console.log('\n🔐 ========== TOKEN ACQUISITION ==========');
    
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