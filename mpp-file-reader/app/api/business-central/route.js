// // app/api/business-central/route.js
// export const dynamic = 'force-dynamic';

// // GET endpoint for both PO list and PO details
// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const poNo = searchParams.get('poNo');
//   const action = searchParams.get('action');
  
//   console.log('🚀 Business Central API called:', { poNo, action });
  
//   // Handle PO details request
//   if (action === 'get_po_details' && poNo) {
//     console.log(`📋 Fetching details for PO: ${poNo}`);
//     return await getPurchaseOrderDetails(poNo);
//   }
  
//   // Handle PO list request (original logic)
//   console.log('📊 Fetching Purchase Order List...');
//   return await getPurchaseOrderList();
// }

// // Function to get PO details
// async function getPurchaseOrderDetails(poNumber) {
//   try {
//     console.log(`🔍 Getting details for PO: ${poNumber}`);
    
//     // 1. Get Access Token
//     console.log('🔑 Getting access token...');
//     const tokenResponse = await getAccessToken();
    
//     if (!tokenResponse?.access_token) {
//       console.log('❌ Token not available, using mock data');
//       return Response.json({
//         success: true,
//         data: generateMockPODetails(poNumber),
//         dataSource: 'mock_data',
//         _timestamp: new Date().toISOString()
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
    
//     // 3. First get PO header information
//     console.log('🔍 Fetching PO header...');
//     let poHeader = null;
//     let poLines = [];
    
//     // Try multiple endpoints for PO header
//     const endpoints = [
//       `${baseUrl}/Company('${companyName}')/PurchaseOrder?$filter=PO_No eq '${poNumber}'`,
//       `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order' and number eq '${poNumber}'`,
//       `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=number eq '${poNumber}'`
//     ];
    
//     for (const endpoint of endpoints) {
//       try {
//         console.log(`Trying endpoint: ${endpoint}`);
//         const response = await fetch(endpoint, { headers });
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data.value && data.value.length > 0) {
//             poHeader = data.value[0];
//             console.log('✅ Found PO header:', {
//               PO_No: poHeader.PO_No,
//               Vendor: poHeader.Buy_from_vendor_name,
//               Status: poHeader.Status
//             });
//             break;
//           }
//         }
//       } catch (error) {
//         console.log(`Endpoint failed: ${error.message}`);
//       }
//     }
    
//     // 4. Get PO lines if header found
//     if (poHeader) {
//       console.log('🔍 Fetching PO lines...');
      
//       // Extract document number for lines query
//       const documentNo = poHeader.No || poHeader.number || poHeader.PO_No;
      
//       // Try multiple endpoints for PO lines
//       const lineEndpoints = [
//         `${baseUrl}/Company('${companyName}')/PurchaseOrderLine?$filter=Document_No eq '${documentNo}'`,
//         `${baseUrl}/Company('${companyName}')/purchaseDocumentLines?$filter=documentNo eq '${documentNo}'`,
//         `${baseUrl}/Company('${companyName}')/purchaseDocumentLines?$filter=documentType eq 'Order' and documentNo eq '${documentNo}'`
//       ];
      
//       for (const endpoint of lineEndpoints) {
//         try {
//           console.log(`Trying lines endpoint: ${endpoint}`);
//           const response = await fetch(endpoint, { headers });
          
//           if (response.ok) {
//             const data = await response.json();
//             if (data.value && data.value.length > 0) {
//               poLines = data.value;
//               console.log(`✅ Found ${poLines.length} PO lines`);
//               break;
//             }
//           }
//         } catch (error) {
//           console.log(`Lines endpoint failed: ${error.message}`);
//         }
//       }
//     }
    
//     // 5. Process the data
//     let processedData;
    
//     if (poHeader && poLines.length > 0) {
//       console.log('✅ Processing real PO data from Business Central');
//       processedData = processPODetails(poHeader, poLines);
//     } else {
//       console.log('📦 Using mock PO data');
//       processedData = generateMockPODetails(poNumber);
//     }
    
//     // 6. Return response
//     return Response.json({
//       success: true,
//       data: processedData,
//       dataSource: poHeader ? 'business_central' : 'mock_data',
//       _timestamp: new Date().toISOString(),
//       _debug: {
//         headerFound: !!poHeader,
//         linesFound: poLines.length,
//         poNumber: poNumber
//       }
//     }, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-store, max-age=0'
//       }
//     });
    
//   } catch (error) {
//     console.error('💥 Error in getPurchaseOrderDetails:', error);
    
//     return Response.json({
//       success: false,
//       error: error.message,
//       data: generateMockPODetails(poNumber),
//       dataSource: 'error_fallback'
//     }, { status: 200 });
//   }
// }

// // Process PO details from Business Central
// function processPODetails(header, lines) {
//   console.log(`Processing PO details for ${header.PO_No}`);
  
//   // Process header
//   const processedHeader = {
//     poNo: header.PO_No || header.number || 'N/A',
//     vendorName: header.Buy_from_vendor_name || header.vendorName || 'Unknown Vendor',
//     vendorNo: header.Buy_From_Vendor_no || header.vendorNo || 'N/A',
//     orderDate: header.OrderDate || header.orderDate || 'N/A',
//     amount: parseFloat(header.Amount || header.amount || 0),
//     status: header.Status || header.status || 'Open',
//     poType: header.poType || header.PO_Type || 'Material PR',
//     description: header.Description || header.description || 'Purchase Order'
//   };
  
//   // Process lines
//   const processedLines = lines.map((line, index) => {
//     return {
//       lineNo: line.Line_No || line.lineNo || (index + 1),
//       itemNo: line.No || line.itemNo || `ITEM-${String(index + 1).padStart(3, '0')}`,
//       description: line.Description || line.description || 'Item',
//       quantity: parseFloat(line.Quantity || line.quantity || 0),
//       unitCost: parseFloat(line.Unit_Cost || line.unitCost || 0),
//       lineAmount: parseFloat(line.Line_Amount || line.lineAmount || 0),
//       unitOfMeasure: line.Unit_of_Measure_Code || line.unitOfMeasure || 'PCS',
//       gstGroupCode: line.GST_Group_Code || line.gstGroupCode || '18%',
//       hsnSacCode: line.HSN_SAC_Code || line.hsnSacCode || 'N/A'
//     };
//   });
  
//   // Calculate summary
//   const totalAmount = processedLines.reduce((sum, line) => sum + line.lineAmount, 0);
//   const totalQuantity = processedLines.reduce((sum, line) => sum + line.quantity, 0);
  
//   return {
//     header: processedHeader,
//     lines: processedLines,
//     summary: {
//       totalLines: processedLines.length,
//       totalQuantity: totalQuantity,
//       totalAmount: totalAmount,
//       totalGST: Math.round(totalAmount * 0.18),
//       netAmount: Math.round(totalAmount * 1.18)
//     }
//   };
// }

// // Generate mock PO details (fallback)
// function generateMockPODetails(poNumber) {
//   console.log(`📦 Generating mock details for PO: ${poNumber}`);
  
//   const vendors = [
//     'AMBEY TRADERS', 'ABC Suppliers', 'XYZ Corporation', 
//     'Global Traders', 'Tech Solutions Ltd', 'Hardware Inc'
//   ];
  
//   const items = [
//     { name: 'Steel Plates', unit: 'KG', gst: '18%', hsn: '7208', cost: 150 },
//     { name: 'Electronics Components', unit: 'PCS', gst: '18%', hsn: '8542', cost: 450 },
//     { name: 'Packaging Material', unit: 'ROLL', gst: '12%', hsn: '4821', cost: 1200 },
//     { name: 'Machine Parts', unit: 'PCS', gst: '18%', hsn: '8431', cost: 850 },
//     { name: 'Raw Materials', unit: 'KG', gst: '12%', hsn: '7207', cost: 95 }
//   ];
  
//   const statuses = ['Open', 'Pending Approval', 'Released', 'Short Closed'];
//   const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
//   const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
//   // Extract PO number prefix
//   const poPrefix = poNumber.includes('AL-PO-') ? '' : 'AL-PO-';
//   const displayPoNo = poPrefix + poNumber.replace('AL-PO-', '');
  
//   // Generate line items
//   const lines = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, index) => {
//     const item = items[Math.floor(Math.random() * items.length)];
//     const quantity = Math.floor(Math.random() * 100) + 10;
//     const unitCost = item.cost + Math.floor(Math.random() * 200);
//     const lineAmount = quantity * unitCost;
    
//     return {
//       lineNo: index + 1,
//       itemNo: `ITEM-${String(index + 1).padStart(3, '0')}`,
//       description: item.name,
//       quantity: quantity,
//       unitCost: unitCost,
//       lineAmount: lineAmount,
//       unitOfMeasure: item.unit,
//       gstGroupCode: item.gst,
//       hsnSacCode: item.hsn
//     };
//   });
  
//   const totalAmount = lines.reduce((sum, line) => sum + line.lineAmount, 0);
//   const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  
//   return {
//     header: {
//       poNo: displayPoNo,
//       vendorName: randomVendor,
//       vendorNo: `VEND-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
//       orderDate: new Date().toISOString().split('T')[0],
//       amount: totalAmount,
//       status: randomStatus,
//       poType: 'Material PR'
//     },
//     lines: lines,
//     summary: {
//       totalLines: lines.length,
//       totalQuantity: totalQuantity,
//       totalAmount: totalAmount,
//       totalGST: Math.round(totalAmount * 0.18),
//       netAmount: Math.round(totalAmount * 1.18)
//     }
//   };
// }

// // Original getPurchaseOrderList function (unchanged)
// async function getPurchaseOrderList() {
//   try {
//     // 1. Get Access Token
//     console.log('🔑 Getting access token for Business Central...');
//     const tokenResponse = await getAccessToken();
    
//     if (!tokenResponse?.access_token) {
//       console.log('❌ Token not available, using mock data');
//       return Response.json(getBusinessCentralMockData(), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
    
//     console.log('✅ Token received successfully');
    
//     // 2. Build URL for Purchase Orders
//     const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
//     const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
//     const headers = {
//       'Authorization': `Bearer ${tokenResponse.access_token}`,
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     };
    
//     console.log('🔍 Fetching Purchase Orders...');
    
//     let purchaseData = null;
//     let usedEndpoint = '';
    
//     // OPTION 1: Try PurchaseOrder endpoint (Page 50169)
//     const purchaseOrderUrl = `${baseUrl}/Company('${companyName}')/PurchaseOrder`;
//     console.log(`Trying: ${purchaseOrderUrl}`);
    
//     try {
//       const response = await fetch(purchaseOrderUrl, { headers });
//       console.log(`Purchase Order API status: ${response.status}`);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log(`✅ Found ${data.value?.length || 0} Purchase Orders`);
        
//         // DEBUG: Log first item
//         if (data.value && data.value.length > 0) {
//           console.log('🔍 First Purchase Order fields:', Object.keys(data.value[0]));
//           console.log('🔍 Sample PO data:', {
//             PO_No: data.value[0].PO_No,
//             Status: data.value[0].Status,
//             Buy_from_vendor_name: data.value[0].Buy_from_vendor_name,
//             Amount: data.value[0].Amount,
//             OrderDate: data.value[0].OrderDate
//           });
//         }
        
//         if (data.value && data.value.length > 0) {
//           purchaseData = data.value;
//           usedEndpoint = 'PurchaseOrder';
//         }
//       }
//     } catch (error) {
//       console.log(`Purchase Order API error: ${error.message}`);
//     }
    
//     // OPTION 2: Try purchaseDocuments endpoint
//     if (!purchaseData || purchaseData.length === 0) {
//       console.log('🔄 Trying purchaseDocuments endpoint...');
//       const fallbackUrl = `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order' and poType eq 'Material PR'`;
      
//       try {
//         const response = await fetch(fallbackUrl, { headers });
//         console.log(`Fallback Purchase Order status: ${response.status}`);
        
//         if (response.ok) {
//           const data = await response.json();
//           console.log(`✅ Found ${data.value?.length || 0} purchase documents`);
          
//           if (data.value && data.value.length > 0) {
//             purchaseData = data.value;
//             usedEndpoint = 'purchaseDocuments';
//           }
//         }
//       } catch (error) {
//         console.log(`Fallback error: ${error.message}`);
//       }
//     }
    
//     // OPTION 3: Try purchaseDocuments without filter
//     if (!purchaseData || purchaseData.length === 0) {
//       console.log('🔄 Trying purchaseDocuments without filter...');
//       const simpleUrl = `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order'`;
      
//       try {
//         const response = await fetch(simpleUrl, { headers });
//         console.log(`Simple endpoint status: ${response.status}`);
        
//         if (response.ok) {
//           const data = await response.json();
//           console.log(`✅ Found ${data.value?.length || 0} purchase orders`);
          
//           if (data.value && data.value.length > 0) {
//             // Filter locally for Material PR
//             const materialPRData = data.value.filter(item => {
//               const poType = item.poType || item.PO_Type || item.po_type;
//               return poType === 'Material PR' || poType === 'Material' || poType === 'PR';
//             });
            
//             if (materialPRData.length > 0) {
//               console.log(`✅ Filtered locally: ${materialPRData.length} Material PR POs`);
//               purchaseData = materialPRData;
//               usedEndpoint = 'purchaseDocuments';
//             } else {
//               console.log('⚠️ No Material PR POs found');
//               purchaseData = data.value; // Use all as fallback
//             }
//           }
//         }
//       } catch (error) {
//         console.log(`Simple endpoint error: ${error.message}`);
//       }
//     }
    
//     // 3. Process the data
//     let dashboardData;
//     let totalFilteredPOs = 0;
    
//     if (purchaseData && purchaseData.length > 0) {
//       console.log(`📊 Processing ${purchaseData.length} Purchase Orders`);
      
//       totalFilteredPOs = purchaseData.length;
//       dashboardData = processPurchaseOrdersData(purchaseData);
      
//     } else {
//       console.log('📦 No Purchase Order data found, using mock data');
//       dashboardData = getBusinessCentralMockData();
//       totalFilteredPOs = dashboardData.summary.totalPOs;
//     }
    
//     // 4. Return formatted response
//     return Response.json({
//       success: true,
//       timestamp: new Date().toISOString(),
//       dataSource: purchaseData ? 'business_central' : 'mock_data',
//       endpointUsed: usedEndpoint,
//       recordCount: totalFilteredPOs,
//       data: dashboardData,
//       _debug: {
//         filteredCount: totalFilteredPOs,
//         endpoint: usedEndpoint,
//         sampleData: purchaseData ? purchaseData.slice(0, 1) : []
//       }
//     }, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-store, max-age=0'
//       }
//     });
    
//   } catch (error) {
//     console.error('💥 API Error:', error.message);
    
//     return Response.json({
//       success: false,
//       error: error.message,
//       data: getBusinessCentralMockData()
//     }, { status: 200 });
//   }
// }

// // Process Purchase Orders data (unchanged)
// function processPurchaseOrdersData(data) {
//   console.log(`Processing ${data.length} Purchase Orders`);
  
//   if (data.length === 0) {
//     return getBusinessCentralMockData();
//   }
  
//   const processedPOs = data.map((po, index) => {
//     // Extract purchase order info
//     // Try multiple field names
//     const poNoRaw = po.PO_No || po.no || po.number || po.No || `PO-${index + 1}`;
    
//     // Format PO number to AL-PO-XXXX
//     let poNo = poNoRaw;
//     if (poNoRaw && !poNoRaw.startsWith('AL-PO-')) {
//       // Extract numbers
//       const numbers = poNoRaw.match(/\d+/g);
//       if (numbers && numbers.length > 0) {
//         poNo = `AL-PO-${numbers[0].padStart(4, '0')}`;
//       } else if (/^\d+$/.test(poNoRaw)) {
//         poNo = `AL-PO-${poNoRaw.padStart(4, '0')}`;
//       }
//     }
    
//     // Vendor info - try multiple field names
//     const vendorName = po.Buy_from_vendor_name || po.buyFromVendorName || po.vendorName || 'Unknown Vendor';
//     const vendorNo = po.Buy_From_Vendor_no || po.buyFromVendorNo || po.vendorNo || 'N/A';
    
//     // Date field - try multiple field names
//     const rawOrderDate = po.OrderDate || po.orderDate || po.Order_Date || 'N/A';
    
//     // Format date
//     let formattedDate = 'N/A';
//     if (rawOrderDate && rawOrderDate !== 'N/A') {
//       try {
//         const dateOnly = rawOrderDate.split('T')[0];
//         formattedDate = dateOnly;
//       } catch (e) {
//         formattedDate = rawOrderDate;
//       }
//     }
    
//     // Amount - try multiple field names
//     const amount = parseFloat(po.Amount || po.amount || po.AmountIncludingVAT || 0);
    
//     // Status - try multiple field names
//     const bcStatus = po.Status || po.status || po.documentStatus || 'Open';
//     const poType = po.poType || po.PO_Type || 'Material PR';
    
//     return {
//       No: poNo,
//       VendorName: vendorName,
//       VendorNo: vendorNo,
//       OrderDate: formattedDate,
//       TotalAmount: amount,
//       Amount: amount,
//       Status: bcStatus,
//       poType: poType,
//       Description: po.Description || po.description || 'Purchase Order'
//     };
//   });
  
//   // Map statuses to 4 categories
//   const statusMapping = {
//     'Open': 'Open',
//     'Pending Approval': 'Pending Approval',
//     'Pending': 'Pending Approval',
//     'Awaiting Approval': 'Pending Approval',
//     'Recheck': 'Pending Approval',
//     'In Review': 'Pending Approval',
//     'On Hold': 'Pending Approval',
//     'Released': 'Released',
//     'Approved': 'Released',
//     'Completed': 'Released',
//     'In Progress': 'Released',
//     'Work in Progress': 'Released',
//     'Short Closed': 'Short Closed',
//     'Closed': 'Short Closed',
//     'Cancelled': 'Short Closed',
//     'Rejected': 'Short Closed',
//     'Void': 'Short Closed'
//   };
  
//   // Calculate status counts
//   const finalStatusCounts = {
//     open: 0,
//     pendingApproval: 0,
//     released: 0,
//     shortClosed: 0
//   };
  
//   const statusDebug = [];
  
//   processedPOs.forEach(po => {
//     const originalStatus = po.Status || '';
//     let mappedStatus = 'Open';
    
//     // First try exact match
//     if (statusMapping[originalStatus]) {
//       mappedStatus = statusMapping[originalStatus];
//     } else {
//       // Try partial match
//       const statusLower = originalStatus.toLowerCase();
//       if (statusLower.includes('open') || statusLower.includes('new')) {
//         mappedStatus = 'Open';
//       } else if (statusLower.includes('pending') || 
//                  statusLower.includes('awaiting') ||
//                  statusLower.includes('recheck') || 
//                  statusLower.includes('review') ||
//                  statusLower.includes('hold')) {
//         mappedStatus = 'Pending Approval';
//       } else if (statusLower.includes('released') || 
//                  statusLower.includes('approved') ||
//                  statusLower.includes('complete') ||
//                  statusLower.includes('progress')) {
//         mappedStatus = 'Released';
//       } else if (statusLower.includes('closed') || 
//                  statusLower.includes('cancelled') ||
//                  statusLower.includes('short') ||
//                  statusLower.includes('rejected') ||
//                  statusLower.includes('void')) {
//         mappedStatus = 'Short Closed';
//       }
//     }
    
//     // Update counts
//     switch (mappedStatus) {
//       case 'Open':
//         finalStatusCounts.open++;
//         break;
//       case 'Pending Approval':
//         finalStatusCounts.pendingApproval++;
//         break;
//       case 'Released':
//         finalStatusCounts.released++;
//         break;
//       case 'Short Closed':
//         finalStatusCounts.shortClosed++;
//         break;
//     }
    
//     // Store debug info
//     statusDebug.push({
//       originalStatus,
//       mappedStatus,
//       poNo: po.No
//     });
    
//     po.Status = mappedStatus;
//   });
  
//   console.log('🔧 PO Status Mapping Debug:', statusDebug.slice(0, 5));
//   console.log('✅ PO Final Status Counts:', finalStatusCounts);
  
//   const totalPOs = processedPOs.length;
  
//   // Vendor data
//   const vendorMap = new Map();
//   processedPOs.forEach(po => {
//     const vendorKey = po.VendorNo !== 'N/A' ? po.VendorNo : po.VendorName;
//     if (vendorKey && vendorKey !== 'N/A' && vendorKey !== 'Unknown Vendor') {
//       if (vendorMap.has(vendorKey)) {
//         const existing = vendorMap.get(vendorKey);
//         vendorMap.set(vendorKey, {
//           count: existing.count + 1,
//           amount: existing.amount + po.TotalAmount,
//           vendorName: po.VendorName
//         });
//       } else {
//         vendorMap.set(vendorKey, {
//           count: 1,
//           amount: po.TotalAmount,
//           vendorName: po.VendorName
//         });
//       }
//     }
//   });
  
//   // Top vendors
//   const topVendors = Array.from(vendorMap.entries())
//     .map(([vendorKey, data]) => ({
//       vendorKey,
//       vendorName: data.vendorName,
//       poCount: data.count,
//       totalAmount: data.amount
//     }))
//     .sort((a, b) => b.totalAmount - a.totalAmount)
//     .slice(0, 10);
  
//   // Calculate totals
//   const totalAmount = processedPOs.reduce((sum, po) => sum + po.TotalAmount, 0);
//   const avgAmount = totalPOs > 0 ? totalAmount / totalPOs : 0;
  
//   // Monthly trend
//   const monthlyTrend = calculateLast6MonthsTrend(processedPOs);
  
//   // Recent POs
//   const thirtyDaysAgo = new Date();
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
//   const recentPOs = processedPOs
//     .filter(po => {
//       try {
//         if (po.OrderDate === 'N/A') return false;
//         const poDate = new Date(po.OrderDate);
//         return poDate >= thirtyDaysAgo;
//       } catch {
//         return false;
//       }
//     })
//     .sort((a, b) => {
//       try {
//         return new Date(b.OrderDate) - new Date(a.OrderDate);
//       } catch {
//         return 0;
//       }
//     })
//     .slice(0, 10);
  
//   return {
//     type: 'purchase_orders',
//     summary: {
//       totalPOs: totalPOs,
//       totalAmount: Math.round(totalAmount * 100) / 100,
//       avgAmount: Math.round(avgAmount * 100) / 100,
//       uniqueVendors: vendorMap.size,
//     },
//     statusSummary: {
//       open: finalStatusCounts.open,
//       pendingApproval: finalStatusCounts.pendingApproval,
//       released: finalStatusCounts.released,
//       shortClosed: finalStatusCounts.shortClosed,
//       total: totalPOs
//     },
//     topVendors: topVendors.map(v => ({
//       vendorName: v.vendorName,
//       poCount: v.poCount,
//       totalAmount: v.totalAmount
//     })),
//     monthlyTrend,
//     recentPOs: recentPOs,
//     rawData: processedPOs.slice(0, 100)
//   };
// }

// // Calculate trend for last 6 months only
// function calculateLast6MonthsTrend(purchaseOrders) {
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const monthlyData = {};
//   const now = new Date();
//   const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
//   purchaseOrders.forEach(po => {
//     try {
//       if (!po.OrderDate || po.OrderDate === 'N/A') return;
//       const poDate = new Date(po.OrderDate);
      
//       if (poDate >= sixMonthsAgo) {
//         const month = months[poDate.getMonth()];
//         const year = poDate.getFullYear().toString().slice(-2);
//         const monthYear = `${month} ${year}`;
        
//         if (!monthlyData[monthYear]) {
//           monthlyData[monthYear] = {
//             month: monthYear,
//             count: 0,
//             amount: 0
//           };
//         }
        
//         monthlyData[monthYear].count++;
//         monthlyData[monthYear].amount += po.TotalAmount || 0;
//       }
//     } catch (e) {
//       // Skip invalid dates
//     }
//   });
  
//   // Generate last 6 months
//   const last6Months = [];
  
//   for (let i = 5; i >= 0; i--) {
//     const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//     const month = months[date.getMonth()];
//     const year = date.getFullYear().toString().slice(-2);
//     const monthYear = `${month} ${year}`;
    
//     last6Months.push({
//       month: monthYear,
//       count: monthlyData[monthYear]?.count || 0,
//       amount: monthlyData[monthYear]?.amount || 0
//     });
//   }
  
//   return last6Months;
// }

// // Mock data for Purchase Orders
// function getBusinessCentralMockData() {
//   const totalPOs = 208;
  
//   const open = Math.round((45/200) * totalPOs);
//   const pending = Math.round((23/200) * totalPOs);
//   const released = Math.round((120/200) * totalPOs);
//   const shortClosed = totalPOs - open - pending - released;
  
//   return {
//     type: 'purchase_orders',
//     summary: {
//       totalPOs: totalPOs,
//       totalAmount: 2850000,
//       avgAmount: 13702,
//       uniqueVendors: 18
//     },
//     statusSummary: {
//       open: open,
//       pendingApproval: pending,
//       released: released,
//       shortClosed: shortClosed,
//       total: totalPOs
//     },
//     topVendors: [
//       { vendorName: 'AMBEY TRADERS', poCount: 35, totalAmount: 1750000 },
//       { vendorName: 'ABC Suppliers', poCount: 28, totalAmount: 1400000 },
//       { vendorName: 'XYZ Corporation', poCount: 22, totalAmount: 1100000 },
//       { vendorName: 'Global Traders', poCount: 18, totalAmount: 900000 }
//     ],
//     monthlyTrend: [
//       { month: 'Jan 24', count: 32, amount: 1600000 },
//       { month: 'Feb 24', count: 28, amount: 1400000 },
//       { month: 'Mar 24', count: 35, amount: 1750000 },
//       { month: 'Apr 24', count: 30, amount: 1500000 },
//       { month: 'May 24', count: 38, amount: 1900000 },
//       { month: 'Jun 24', count: 45, amount: 2250000 }
//     ],
//     recentPOs: [
//       { 
//         No: 'AL-PO-0001', 
//         VendorName: 'AMBEY TRADERS', 
//         VendorNo: 'VEND-001',
//         OrderDate: '2024-06-28',
//         TotalAmount: 125000,
//         Amount: 125000,
//         Status: 'Open'
//       }
//     ],
//     rawData: [
//       { 
//         No: 'AL-PO-0001', 
//         VendorName: 'AMBEY TRADERS', 
//         VendorNo: 'VEND-001',
//         OrderDate: '2024-06-28',
//         TotalAmount: 125000,
//         Amount: 125000,
//         Status: 'Open',
//         Description: 'Raw Materials Purchase'
//       },
//       { 
//         No: 'AL-PO-0002', 
//         VendorName: 'ABC Suppliers', 
//         VendorNo: 'VEND-002',
//         OrderDate: '2024-06-25',
//         TotalAmount: 98000,
//         Amount: 98000,
//         Status: 'Pending Approval',
//         Description: 'Electronics Components'
//       },
//       { 
//         No: 'AL-PO-0003', 
//         VendorName: 'XYZ Corporation', 
//         VendorNo: 'VEND-003',
//         OrderDate: '2024-06-20',
//         TotalAmount: 75000,
//         Amount: 75000,
//         Status: 'Released',
//         Description: 'Packaging Materials'
//       }
//     ]
//   };
// }

// // Token Function - FIXED VERSION
// async function getAccessToken() {
//   console.log('🔑 Getting Business Central access token...');
  
//   try {
//     // IMPORTANT: Check if we're getting environment variables
//     const tenantId = process.env.BC_TENANT_ID;
//     const clientId = process.env.BC_CLIENT_ID;
//     const clientSecret = process.env.BC_CLIENT_SECRET;
//     const scope = 'https://api.businesscentral.dynamics.com/.default';
    
//     console.log('🔑 Environment Variables Status:');
//     console.log('  - BC_TENANT_ID:', tenantId ? '✓ SET' : '✗ NOT SET');
//     console.log('  - BC_CLIENT_ID:', clientId ? '✓ SET' : '✗ NOT SET');
//     console.log('  - BC_CLIENT_SECRET:', clientSecret ? '✓ SET (hidden)' : '✗ NOT SET');
    
//     if (!tenantId || !clientId || !clientSecret) {
//       console.error('❌ Missing environment variables for Business Central token');
//       return null;
//     }
    
//     const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    
//     const params = new URLSearchParams({
//       client_id: clientId,
//       client_secret: clientSecret,
//       grant_type: 'client_credentials',
//       scope: scope,
//     });
    
//     console.log('🔑 Making token request to Microsoft...');
    
//     const response = await fetch(tokenUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params,
//     });
    
//     console.log('🔑 Token response status:', response.status);
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('❌ Token fetch failed:', response.status, errorText);
//       return null;
//     }
    
//     const tokenData = await response.json();
//     console.log('✅ Token received successfully!');
    
//     return tokenData;
    
//   } catch (error) {
//     console.error('❌ Token fetch error:', error.message);
//     return null;
//   }
// }
// app/api/business-central/route.js
export const dynamic = 'force-dynamic';

// GET endpoint for both PO list and PO details
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const poNo = searchParams.get('poNo');
  const action = searchParams.get('action');
  const debug = searchParams.get('debug');
  
  console.log('🚀 Business Central API called:', { poNo, action, debug });
  
  // Handle debug request
  if (debug === 'true') {
    return await getDebugInfo();
  }
  
  // Handle PO details request
  if (action === 'get_po_details' && poNo) {
    console.log(`📋 Fetching details for PO: ${poNo}`);
    return await getPurchaseOrderDetails(poNo);
  }
  
  // Handle PO list request (improved logic)
  console.log('📊 Fetching Purchase Order List...');
  return await getPurchaseOrderList();
}

// Function to get PO details
async function getPurchaseOrderDetails(poNumber) {
  try {
    console.log(`🔍 Getting details for PO: ${poNumber}`);
    
    // 1. Get Access Token
    console.log('🔑 Getting access token...');
    const tokenResponse = await getAccessToken();
    
    if (!tokenResponse?.access_token) {
      console.log('❌ Token not available, using mock data');
      return Response.json({
        success: true,
        data: generateMockPODetails(poNumber),
        dataSource: 'mock_data',
        _timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Token received successfully');
    
    // 2. Build URLs for Business Central API
    const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
    const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
    const headers = {
      'Authorization': `Bearer ${tokenResponse.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    // 3. First get PO header information
    console.log('🔍 Fetching PO header...');
    let poHeader = null;
    let poLines = [];
    
    // Try multiple endpoints for PO header
    const endpoints = [
      `${baseUrl}/Company('${companyName}')/PurchaseOrder?$filter=PO_No eq '${poNumber}'`,
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order' and number eq '${poNumber}'`,
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=number eq '${poNumber}'`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await fetch(endpoint, { headers });
        
        if (response.ok) {
          const data = await response.json();
          if (data.value && data.value.length > 0) {
            poHeader = data.value[0];
            console.log('✅ Found PO header:', {
              PO_No: poHeader.PO_No,
              Vendor: poHeader.Buy_from_vendor_name,
              Status: poHeader.Status
            });
            break;
          }
        }
      } catch (error) {
        console.log(`Endpoint failed: ${error.message}`);
      }
    }
    
    // 4. Get PO lines if header found
    if (poHeader) {
      console.log('🔍 Fetching PO lines...');
      
      // Extract document number for lines query
      const documentNo = poHeader.No || poHeader.number || poHeader.PO_No;
      
      // Try multiple endpoints for PO lines
      const lineEndpoints = [
        `${baseUrl}/Company('${companyName}')/PurchaseOrderLine?$filter=Document_No eq '${documentNo}'`,
        `${baseUrl}/Company('${companyName}')/purchaseDocumentLines?$filter=documentNo eq '${documentNo}'`,
        `${baseUrl}/Company('${companyName}')/purchaseDocumentLines?$filter=documentType eq 'Order' and documentNo eq '${documentNo}'`
      ];
      
      for (const endpoint of lineEndpoints) {
        try {
          console.log(`Trying lines endpoint: ${endpoint}`);
          const response = await fetch(endpoint, { headers });
          
          if (response.ok) {
            const data = await response.json();
            if (data.value && data.value.length > 0) {
              poLines = data.value;
              console.log(`✅ Found ${poLines.length} PO lines`);
              break;
            }
          }
        } catch (error) {
          console.log(`Lines endpoint failed: ${error.message}`);
        }
      }
    }
    
    // 5. Process the data
    let processedData;
    
    if (poHeader && poLines.length > 0) {
      console.log('✅ Processing real PO data from Business Central');
      processedData = processPODetails(poHeader, poLines);
    } else {
      console.log('📦 Using mock PO data');
      processedData = generateMockPODetails(poNumber);
    }
    
    // 6. Return response
    return Response.json({
      success: true,
      data: processedData,
      dataSource: poHeader ? 'business_central' : 'mock_data',
      _timestamp: new Date().toISOString(),
      _debug: {
        headerFound: !!poHeader,
        linesFound: poLines.length,
        poNumber: poNumber
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
    
  } catch (error) {
    console.error('💥 Error in getPurchaseOrderDetails:', error);
    
    return Response.json({
      success: false,
      error: error.message,
      data: generateMockPODetails(poNumber),
      dataSource: 'error_fallback'
    }, { status: 200 });
  }
}

// Process PO details from Business Central
function processPODetails(header, lines) {
  console.log(`Processing PO details for ${header.PO_No}`);
  
  // Process header
  const processedHeader = {
    poNo: header.PO_No || header.number || 'N/A',
    vendorName: header.Buy_from_vendor_name || header.vendorName || 'Unknown Vendor',
    vendorNo: header.Buy_From_Vendor_no || header.vendorNo || 'N/A',
    orderDate: header.OrderDate || header.orderDate || 'N/A',
    amount: parseFloat(header.Amount || header.amount || 0),
    status: header.Status || header.status || 'Open',
    poType: header.poType || header.PO_Type || 'Material PR',
    description: header.Description || header.description || 'Purchase Order'
  };
  
  // Process lines
  const processedLines = lines.map((line, index) => {
    return {
      lineNo: line.Line_No || line.lineNo || (index + 1),
      itemNo: line.No || line.itemNo || `ITEM-${String(index + 1).padStart(3, '0')}`,
      description: line.Description || line.description || 'Item',
      quantity: parseFloat(line.Quantity || line.quantity || 0),
      unitCost: parseFloat(line.Unit_Cost || line.unitCost || 0),
      lineAmount: parseFloat(line.Line_Amount || line.lineAmount || 0),
      unitOfMeasure: line.Unit_of_Measure_Code || line.unitOfMeasure || 'PCS',
      gstGroupCode: line.GST_Group_Code || line.gstGroupCode || '18%',
      hsnSacCode: line.HSN_SAC_Code || line.hsnSacCode || 'N/A'
    };
  });
  
  // Calculate summary
  const totalAmount = processedLines.reduce((sum, line) => sum + line.lineAmount, 0);
  const totalQuantity = processedLines.reduce((sum, line) => sum + line.quantity, 0);
  
  return {
    header: processedHeader,
    lines: processedLines,
    summary: {
      totalLines: processedLines.length,
      totalQuantity: totalQuantity,
      totalAmount: totalAmount,
      totalGST: Math.round(totalAmount * 0.18),
      netAmount: Math.round(totalAmount * 1.18)
    }
  };
}

// Generate mock PO details (fallback)
function generateMockPODetails(poNumber) {
  console.log(`📦 Generating mock details for PO: ${poNumber}`);
  
  const vendors = [
    'AMBEY TRADERS', 'ABC Suppliers', 'XYZ Corporation', 
    'Global Traders', 'Tech Solutions Ltd', 'Hardware Inc'
  ];
  
  const items = [
    { name: 'Steel Plates', unit: 'KG', gst: '18%', hsn: '7208', cost: 150 },
    { name: 'Electronics Components', unit: 'PCS', gst: '18%', hsn: '8542', cost: 450 },
    { name: 'Packaging Material', unit: 'ROLL', gst: '12%', hsn: '4821', cost: 1200 },
    { name: 'Machine Parts', unit: 'PCS', gst: '18%', hsn: '8431', cost: 850 },
    { name: 'Raw Materials', unit: 'KG', gst: '12%', hsn: '7207', cost: 95 }
  ];
  
  const statuses = ['Open', 'Pending Approval', 'Released', 'Short Closed'];
  const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Extract PO number prefix
  const poPrefix = poNumber.includes('AL-PO-') ? '' : 'AL-PO-';
  const displayPoNo = poPrefix + poNumber.replace('AL-PO-', '');
  
  // Generate line items
  const lines = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, index) => {
    const item = items[Math.floor(Math.random() * items.length)];
    const quantity = Math.floor(Math.random() * 100) + 10;
    const unitCost = item.cost + Math.floor(Math.random() * 200);
    const lineAmount = quantity * unitCost;
    
    return {
      lineNo: index + 1,
      itemNo: `ITEM-${String(index + 1).padStart(3, '0')}`,
      description: item.name,
      quantity: quantity,
      unitCost: unitCost,
      lineAmount: lineAmount,
      unitOfMeasure: item.unit,
      gstGroupCode: item.gst,
      hsnSacCode: item.hsn
    };
  });
  
  const totalAmount = lines.reduce((sum, line) => sum + line.lineAmount, 0);
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  
  return {
    header: {
      poNo: displayPoNo,
      vendorName: randomVendor,
      vendorNo: `VEND-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      orderDate: new Date().toISOString().split('T')[0],
      amount: totalAmount,
      status: randomStatus,
      poType: 'Material PR'
    },
    lines: lines,
    summary: {
      totalLines: lines.length,
      totalQuantity: totalQuantity,
      totalAmount: totalAmount,
      totalGST: Math.round(totalAmount * 0.18),
      netAmount: Math.round(totalAmount * 1.18)
    }
  };
}

// IMPROVED: getPurchaseOrderList function with better status counting
async function getPurchaseOrderList() {
  try {
    console.log('🔑 Getting access token for Business Central...');
    const tokenResponse = await getAccessToken();
    
    if (!tokenResponse?.access_token) {
      console.log('❌ Token not available, using mock data');
      return Response.json(getBusinessCentralMockData(), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('✅ Token received successfully');
    
    const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
    const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
    const headers = {
      'Authorization': `Bearer ${tokenResponse.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    console.log('🔍 Fetching Purchase Orders...');
    
    let purchaseData = null;
    let usedEndpoint = '';
    let totalRawCount = 0;
    
    // IMPROVEMENT: Try multiple endpoints with better order
    const endpoints = [
      // Try specific endpoint for Material PR POs
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order' and poType eq 'Material PR'&$top=500`,
      
      // Try with documentType filter only
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order'&$top=500`,
      
      // Try PurchaseOrder endpoint
      `${baseUrl}/Company('${companyName}')/PurchaseOrder?$top=500`,
      
      // Try without any filter
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$top=500`
    ];
    
    for (const [index, endpoint] of endpoints.entries()) {
      try {
        console.log(`🔄 Trying endpoint ${index + 1}: ${endpoint}`);
        const response = await fetch(endpoint, { headers });
        console.log(`📊 Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found ${data.value?.length || 0} records`);
          totalRawCount = data.value?.length || 0;
          
          if (data.value && data.value.length > 0) {
            // DEBUG: Log first few records
            console.log('🔍 Sample data (first 3 records):');
            data.value.slice(0, 3).forEach((item, i) => {
              console.log(`  ${i + 1}. PO No: ${item.PO_No || item.number || item.No || 'N/A'}, ` +
                         `Vendor: ${item.Buy_from_vendor_name || item.vendorName || 'N/A'}, ` +
                         `Status: "${item.Status || item.status || 'N/A'}", ` +
                         `PO Type: "${item.poType || item.PO_Type || 'N/A'}", ` +
                         `Amount: ${item.Amount || item.amount || 0}`);
            });
            
            // Check available fields
            if (data.value.length > 0) {
              const sampleItem = data.value[0];
              console.log('🔍 Available fields in response:', Object.keys(sampleItem).slice(0, 20));
            }
            
            // Filter for Material PR if needed
            let filteredData = data.value;
            if (index > 0) { // First endpoint already filters
              filteredData = data.value.filter(item => {
                const poType = item.poType || item.PO_Type || item.po_type;
                // Accept various representations of Material PR
                return poType === 'Material PR' || 
                       poType === 'Material' || 
                       poType === 'PR' ||
                       (poType && poType.includes('Material')) ||
                       (poType && poType.includes('PR')) ||
                       !poType; // Include if no poType field
              });
              console.log(`✅ Filtered to ${filteredData.length} Material PR POs`);
            }
            
            if (filteredData.length > 0) {
              purchaseData = filteredData;
              usedEndpoint = endpoint.split('/').pop();
              console.log(`🎉 Using endpoint: ${usedEndpoint}`);
              break;
            }
          }
        } else {
          const errorText = await response.text();
          console.log(`❌ Endpoint failed with status: ${response.status}, error: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ Endpoint error: ${error.message}`);
      }
    }
    
    // 3. Process the data
    let dashboardData;
    let totalFilteredPOs = 0;
    
    if (purchaseData && purchaseData.length > 0) {
      console.log(`📊 Processing ${purchaseData.length} Purchase Orders`);
      
      totalFilteredPOs = purchaseData.length;
      dashboardData = processPurchaseOrdersData(purchaseData);
      
      // Log processing summary
      console.log('📈 Processing Summary:');
      console.log(`   Raw API records: ${totalRawCount}`);
      console.log(`   Filtered records: ${totalFilteredPOs}`);
      console.log(`   Final PO count: ${dashboardData.summary.totalPOs}`);
      console.log(`   Total amount: ${dashboardData.summary.totalAmount}`);
      console.log(`   Status counts:`, dashboardData.statusSummary);
      
    } else {
      console.log('📦 No Purchase Order data found, using mock data');
      dashboardData = getBusinessCentralMockData();
      totalFilteredPOs = dashboardData.summary.totalPOs;
    }
    
    // 4. Return formatted response
    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      dataSource: purchaseData ? 'business_central' : 'mock_data',
      endpointUsed: usedEndpoint,
      recordCount: totalFilteredPOs,
      data: dashboardData,
      _debug: {
        filteredCount: totalFilteredPOs,
        endpoint: usedEndpoint,
        rawCount: totalRawCount,
        sampleData: purchaseData ? purchaseData.slice(0, 1) : []
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
    
  } catch (error) {
    console.error('💥 API Error:', error.message);
    
    return Response.json({
      success: false,
      error: error.message,
      data: getBusinessCentralMockData()
    }, { status: 200 });
  }
}

// IMPROVED: Process Purchase Orders data with better status counting
function processPurchaseOrdersData(data) {
  console.log(`Processing ${data.length} Purchase Orders`);
  
  if (data.length === 0) {
    return getBusinessCentralMockData();
  }
  
  // IMPROVEMENT: Better logging for debugging
  console.log('🔍 Raw data sample for debugging:');
  data.slice(0, 5).forEach((po, i) => {
    console.log(`  ${i + 1}. PO: ${po.PO_No || po.No || po.number || 'N/A'}, ` +
               `Status: "${po.Status || po.status || 'N/A'}", ` +
               `Type: "${po.poType || po.PO_Type || 'N/A'}", ` +
               `Vendor: "${po.Buy_from_vendor_name || po.vendorName || 'N/A'}", ` +
               `Amount: ${po.Amount || po.amount || 0}`);
  });
  
  const processedPOs = data.map((po, index) => {
    // Extract and format PO number
    const poNoRaw = po.PO_No || po.no || po.number || po.No || po.documentNo || `PO-${index + 1}`;
    let poNo = poNoRaw;
    
    // Format PO number consistently
    if (poNoRaw && typeof poNoRaw === 'string') {
      // Remove any existing AL-PO- prefix
      const cleanNo = poNoRaw.replace(/^AL-PO-/, '');
      // Extract numbers
      const numbers = cleanNo.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        poNo = `AL-PO-${numbers[0].padStart(4, '0')}`;
      } else if (/^\d+$/.test(cleanNo)) {
        poNo = `AL-PO-${cleanNo.padStart(4, '0')}`;
      } else if (cleanNo.length > 0) {
        // Keep original if no numbers found
        poNo = `AL-PO-${cleanNo}`;
      }
    }
    
    // IMPROVEMENT: Better vendor name extraction
    const vendorName = po.Buy_from_vendor_name || 
                       po.buyFromVendorName || 
                       po.vendorName || 
                       po.Vendor_Name ||
                       po.buyFromVendorName ||
                       po.vendor_name ||
                       'Unknown Vendor';
    
    // IMPROVEMENT: Better vendor number extraction
    const vendorNo = po.Buy_From_Vendor_no || 
                     po.buyFromVendorNo || 
                     po.vendorNo || 
                     po.Vendor_No ||
                     po.vendor_no ||
                     'N/A';
    
    // IMPROVEMENT: Better date handling
    const rawOrderDate = po.OrderDate || po.orderDate || po.Order_Date || po.documentDate || po.postingDate || 'N/A';
    let formattedDate = 'N/A';
    
    if (rawOrderDate && rawOrderDate !== 'N/A') {
      try {
        // Handle various date formats
        if (typeof rawOrderDate === 'string') {
          if (rawOrderDate.includes('T')) {
            formattedDate = rawOrderDate.split('T')[0];
          } else {
            formattedDate = rawOrderDate;
          }
        } else if (rawOrderDate instanceof Date) {
          formattedDate = rawOrderDate.toISOString().split('T')[0];
        }
      } catch (e) {
        console.warn(`⚠️ Date parsing error for PO ${poNo}: ${e.message}`);
        formattedDate = rawOrderDate;
      }
    }
    
    // IMPROVEMENT: Better amount extraction
    let amount = 0;
    const amountFields = ['Amount', 'amount', 'AmountIncludingVAT', 'TotalAmount', 'totalAmount', 'amountIncludingVAT'];
    for (const field of amountFields) {
      if (po[field] !== undefined && po[field] !== null) {
        const parsed = parseFloat(po[field]);
        if (!isNaN(parsed)) {
          amount = parsed;
          break;
        }
      }
    }
    
    // IMPROVEMENT: Better status extraction
    const originalStatus = po.Status || po.status || po.documentStatus || 'Open';
    const poType = po.poType || po.PO_Type || 'Material PR';
    
    return {
      No: poNo,
      VendorName: vendorName,
      VendorNo: vendorNo,
      OrderDate: formattedDate,
      TotalAmount: amount,
      Amount: amount,
      OriginalStatus: originalStatus, // Keep original for debugging
      Status: originalStatus, // Will be mapped later
      poType: poType,
      Description: po.Description || po.description || 'Purchase Order',
      // Keep original data for reference
      _raw: {
        poNo: poNoRaw,
        vendorName: po.Buy_from_vendor_name || po.vendorName,
        status: originalStatus,
        type: poType,
        amount: amount
      }
    };
  });
  
  // IMPROVEMENT: Enhanced status mapping with better logging
  console.log('🔍 Status mapping analysis:');
  const statusCounts = {};
  processedPOs.forEach(po => {
    const status = po.OriginalStatus;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  console.log('📊 Original status counts:', statusCounts);
  
  const statusMapping = {
    // Open statuses
    'Open': 'Open',
    'New': 'Open',
    'New Document': 'Open',
    'Initiated': 'Open',
    
    // Pending Approval statuses
    'Pending Approval': 'Pending Approval',
    'Pending': 'Pending Approval',
    'Awaiting Approval': 'Pending Approval',
    'Recheck': 'Pending Approval',
    'In Review': 'Pending Approval',
    'On Hold': 'Pending Approval',
    'Draft': 'Pending Approval',
    'Pending Review': 'Pending Approval',
    
    // Released statuses
    'Released': 'Released',
    'Approved': 'Released',
    'Completed': 'Released',
    'In Progress': 'Released',
    'Work in Progress': 'Released',
    'Finished': 'Released',
    'Processed': 'Released',
    'Accepted': 'Released',
    'Confirmed': 'Released',
    
    // Short Closed statuses
    'Short Closed': 'Short Closed',
    'Closed': 'Short Closed',
    'Cancelled': 'Short Closed',
    'Rejected': 'Short Closed',
    'Void': 'Short Closed',
    'Expired': 'Short Closed',
    'Archived': 'Short Closed'
  };
  
  // Calculate status counts with better logic
  const finalStatusCounts = {
    open: 0,
    pendingApproval: 0,
    released: 0,
    shortClosed: 0
  };
  
  const statusMappingLog = [];
  
  processedPOs.forEach(po => {
    const originalStatus = po.OriginalStatus || '';
    let mappedStatus = 'Open'; // Default
    
    // First try exact match in mapping
    if (statusMapping[originalStatus]) {
      mappedStatus = statusMapping[originalStatus];
    } else {
      // Try case-insensitive partial matching
      const statusLower = originalStatus.toLowerCase().trim();
      
      if (statusLower.includes('open') || statusLower.includes('new') || statusLower.includes('initiate')) {
        mappedStatus = 'Open';
      } else if (statusLower.includes('pending') || 
                 statusLower.includes('awaiting') ||
                 statusLower.includes('recheck') || 
                 statusLower.includes('review') ||
                 statusLower.includes('hold') ||
                 statusLower.includes('draft')) {
        mappedStatus = 'Pending Approval';
      } else if (statusLower.includes('released') || 
                 statusLower.includes('approved') ||
                 statusLower.includes('complete') ||
                 statusLower.includes('progress') ||
                 statusLower.includes('finished') ||
                 statusLower.includes('processed') ||
                 statusLower.includes('accept') ||
                 statusLower.includes('confirm')) {
        mappedStatus = 'Released';
      } else if (statusLower.includes('closed') || 
                 statusLower.includes('cancelled') ||
                 statusLower.includes('short') ||
                 statusLower.includes('rejected') ||
                 statusLower.includes('void') ||
                 statusLower.includes('expired') ||
                 statusLower.includes('archive')) {
        mappedStatus = 'Short Closed';
      }
    }
    
    // Update counts
    switch (mappedStatus) {
      case 'Open':
        finalStatusCounts.open++;
        break;
      case 'Pending Approval':
        finalStatusCounts.pendingApproval++;
        break;
      case 'Released':
        finalStatusCounts.released++;
        break;
      case 'Short Closed':
        finalStatusCounts.shortClosed++;
        break;
    }
    
    // Store mapping for debugging
    if (statusMappingLog.length < 10) { // Log only first 10 for readability
      statusMappingLog.push({
        poNo: po.No,
        original: originalStatus,
        mapped: mappedStatus,
        final: po.Status
      });
    }
    
    // Update the PO's status
    po.Status = mappedStatus;
  });
  
  console.log('🔧 Status mapping examples:', statusMappingLog);
  console.log('✅ Final status counts:', finalStatusCounts);
  
  const totalPOs = processedPOs.length;
  
  // Vendor data - IMPROVED logic
  const vendorMap = new Map();
  processedPOs.forEach(po => {
    const vendorKey = po.VendorNo !== 'N/A' ? po.VendorNo : po.VendorName;
    if (vendorKey && vendorKey !== 'N/A' && vendorKey !== 'Unknown Vendor') {
      if (vendorMap.has(vendorKey)) {
        const existing = vendorMap.get(vendorKey);
        vendorMap.set(vendorKey, {
          count: existing.count + 1,
          amount: existing.amount + po.TotalAmount,
          vendorName: po.VendorName
        });
      } else {
        vendorMap.set(vendorKey, {
          count: 1,
          amount: po.TotalAmount,
          vendorName: po.VendorName
        });
      }
    }
  });
  
  // Top vendors
  const topVendors = Array.from(vendorMap.entries())
    .map(([vendorKey, data]) => ({
      vendorKey,
      vendorName: data.vendorName,
      poCount: data.count,
      totalAmount: data.amount
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);
  
  // Calculate totals
  const totalAmount = processedPOs.reduce((sum, po) => sum + po.TotalAmount, 0);
  const avgAmount = totalPOs > 0 ? totalAmount / totalPOs : 0;
  
  // Monthly trend
  const monthlyTrend = calculateLast6MonthsTrend(processedPOs);
  
  // Recent POs
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentPOs = processedPOs
    .filter(po => {
      try {
        if (po.OrderDate === 'N/A') return false;
        const poDate = new Date(po.OrderDate);
        return poDate >= thirtyDaysAgo;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.OrderDate) - new Date(a.OrderDate);
      } catch {
        return 0;
      }
    })
    .slice(0, 10);
  
  return {
    type: 'purchase_orders',
    summary: {
      totalPOs: totalPOs,
      totalAmount: Math.round(totalAmount * 100) / 100,
      avgAmount: Math.round(avgAmount * 100) / 100,
      uniqueVendors: vendorMap.size,
    },
    statusSummary: {
      open: finalStatusCounts.open,
      pendingApproval: finalStatusCounts.pendingApproval,
      released: finalStatusCounts.released,
      shortClosed: finalStatusCounts.shortClosed,
      total: totalPOs
    },
    topVendors: topVendors.map(v => ({
      vendorName: v.vendorName,
      poCount: v.poCount,
      totalAmount: v.totalAmount
    })),
    monthlyTrend,
    recentPOs: recentPOs,
    rawData: processedPOs.slice(0, 100)
  };
}

// Calculate trend for last 6 months only
function calculateLast6MonthsTrend(purchaseOrders) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = {};
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  purchaseOrders.forEach(po => {
    try {
      if (!po.OrderDate || po.OrderDate === 'N/A') return;
      const poDate = new Date(po.OrderDate);
      
      if (poDate >= sixMonthsAgo) {
        const month = months[poDate.getMonth()];
        const year = poDate.getFullYear().toString().slice(-2);
        const monthYear = `${month} ${year}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthYear,
            count: 0,
            amount: 0
          };
        }
        
        monthlyData[monthYear].count++;
        monthlyData[monthYear].amount += po.TotalAmount || 0;
      }
    } catch (e) {
      // Skip invalid dates
    }
  });
  
  // Generate last 6 months
  const last6Months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    const monthYear = `${month} ${year}`;
    
    last6Months.push({
      month: monthYear,
      count: monthlyData[monthYear]?.count || 0,
      amount: monthlyData[monthYear]?.amount || 0
    });
  }
  
  return last6Months;
}

// Mock data for Purchase Orders - UPDATED with better counts
function getBusinessCentralMockData() {
  const totalPOs = 208;
  
  const open = Math.round((45/200) * totalPOs);
  const pending = Math.round((23/200) * totalPOs);
  const released = Math.round((120/200) * totalPOs);
  const shortClosed = Math.max(0, totalPOs - open - pending - released); // Ensure non-negative
  
  console.log(`📦 Generating mock data: Total=${totalPOs}, Open=${open}, Pending=${pending}, Released=${released}, ShortClosed=${shortClosed}`);
  
  return {
    type: 'purchase_orders',
    summary: {
      totalPOs: totalPOs,
      totalAmount: 2850000,
      avgAmount: 13702,
      uniqueVendors: 18
    },
    statusSummary: {
      open: open,
      pendingApproval: pending,
      released: released,
      shortClosed: shortClosed,
      total: totalPOs
    },
    topVendors: [
      { vendorName: 'AMBEY TRADERS', poCount: 35, totalAmount: 1750000 },
      { vendorName: 'ABC Suppliers', poCount: 28, totalAmount: 1400000 },
      { vendorName: 'XYZ Corporation', poCount: 22, totalAmount: 1100000 },
      { vendorName: 'Global Traders', poCount: 18, totalAmount: 900000 }
    ],
    monthlyTrend: [
      { month: 'Jan 24', count: 32, amount: 1600000 },
      { month: 'Feb 24', count: 28, amount: 1400000 },
      { month: 'Mar 24', count: 35, amount: 1750000 },
      { month: 'Apr 24', count: 30, amount: 1500000 },
      { month: 'May 24', count: 38, amount: 1900000 },
      { month: 'Jun 24', count: 45, amount: 2250000 }
    ],
    recentPOs: [
      { 
        No: 'AL-PO-0001', 
        VendorName: 'AMBEY TRADERS', 
        VendorNo: 'VEND-001',
        OrderDate: '2024-06-28',
        TotalAmount: 125000,
        Amount: 125000,
        Status: 'Open'
      }
    ],
    rawData: [
      { 
        No: 'AL-PO-0001', 
        VendorName: 'AMBEY TRADERS', 
        VendorNo: 'VEND-001',
        OrderDate: '2024-06-28',
        TotalAmount: 125000,
        Amount: 125000,
        Status: 'Open',
        Description: 'Raw Materials Purchase'
      },
      { 
        No: 'AL-PO-0002', 
        VendorName: 'ABC Suppliers', 
        VendorNo: 'VEND-002',
        OrderDate: '2024-06-25',
        TotalAmount: 98000,
        Amount: 98000,
        Status: 'Pending Approval',
        Description: 'Electronics Components'
      },
      { 
        No: 'AL-PO-0003', 
        VendorName: 'XYZ Corporation', 
        VendorNo: 'VEND-003',
        OrderDate: '2024-06-20',
        TotalAmount: 75000,
        Amount: 75000,
        Status: 'Released',
        Description: 'Packaging Materials'
      }
    ]
  };
}

// New debug function
async function getDebugInfo() {
  try {
    const tokenResponse = await getAccessToken();
    
    if (!tokenResponse?.access_token) {
      return Response.json({
        success: false,
        error: 'No access token',
        env_variables: {
          BC_TENANT_ID: process.env.BC_TENANT_ID ? 'SET' : 'NOT SET',
          BC_CLIENT_ID: process.env.BC_CLIENT_ID ? 'SET' : 'NOT SET',
          BC_CLIENT_SECRET: process.env.BC_CLIENT_SECRET ? 'SET' : 'NOT SET'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
    const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
    const headers = {
      'Authorization': `Bearer ${tokenResponse.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    // Test different endpoints
    const endpoints = [
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$top=5`,
      `${baseUrl}/Company('${companyName}')/PurchaseOrder?$top=5`,
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order'&$top=5`,
      `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order' and poType eq 'Material PR'&$top=5`
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { headers });
        const data = await response.json();
        
        results.push({
          endpoint: endpoint.split('/').pop(),
          status: response.status,
          count: data.value?.length || 0,
          sample: data.value ? data.value.slice(0, 3) : [],
          fields: data.value && data.value.length > 0 ? Object.keys(data.value[0]) : []
        });
      } catch (error) {
        results.push({
          endpoint: endpoint.split('/').pop(),
          error: error.message
        });
      }
    }
    
    return Response.json({
      success: true,
      debug_info: {
        token_available: !!tokenResponse?.access_token,
        endpoints_tested: results,
        company: companyName,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Token Function - FIXED VERSION
async function getAccessToken() {
  console.log('🔑 Getting Business Central access token...');
  
  try {
    // IMPORTANT: Check if we're getting environment variables
    const tenantId = process.env.BC_TENANT_ID;
    const clientId = process.env.BC_CLIENT_ID;
    const clientSecret = process.env.BC_CLIENT_SECRET;
    const scope = 'https://api.businesscentral.dynamics.com/.default';
    
    console.log('🔑 Environment Variables Status:');
    console.log('  - BC_TENANT_ID:', tenantId ? '✓ SET' : '✗ NOT SET');
    console.log('  - BC_CLIENT_ID:', clientId ? '✓ SET' : '✗ NOT SET');
    console.log('  - BC_CLIENT_SECRET:', clientSecret ? '✓ SET (hidden)' : '✗ NOT SET');
    
    if (!tenantId || !clientId || !clientSecret) {
      console.error('❌ Missing environment variables for Business Central token');
      return null;
    }
    
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: scope,
    });
    
    console.log('🔑 Making token request to Microsoft...');
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
    
    console.log('🔑 Token response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Token fetch failed:', response.status, errorText);
      return null;
    }
    
    const tokenData = await response.json();
    console.log('✅ Token received successfully!');
    
    return tokenData;
    
  } catch (error) {
    console.error('❌ Token fetch error:', error.message);
    return null;
  }
}