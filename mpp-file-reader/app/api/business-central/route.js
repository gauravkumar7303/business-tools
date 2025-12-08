
// app/api/business-central/route.js
export const dynamic = 'force-dynamic';

export async function GET(request) {
  console.log('🚀 Business Central Purchase Order API called');
  
  try {
    // 1. Get Access Token
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
    
    // 2. Build URL with OData filter for Document Type = Order AND PO Type = "Material PR"
    const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
    const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
    const headers = {
      'Authorization': `Bearer ${tokenResponse.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    console.log('🔍 Fetching Purchase Orders with filters...');
    
    let purchaseData = null;
    let usedEndpoint = '';
    
    // OPTION 1: Try purchaseDocuments with multiple filters
    const purchaseDocsUrl = `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order' and poType eq 'Material PR'`;
    console.log(`Trying: ${purchaseDocsUrl}`);
    
    try {
      const response = await fetch(purchaseDocsUrl, { headers });
      console.log(`Purchase Documents status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Found ${data.value?.length || 0} Purchase Documents (Material PR)`);
        
        // DEBUG: Log first item to check field names
        if (data.value && data.value.length > 0) {
          console.log('🔍 First Purchase Order fields:', Object.keys(data.value[0]));
          console.log('🔍 Sample PO data:', {
            no: data.value[0].no,
            buyFromVendorName: data.value[0].buyFromVendorName,
            orderDate: data.value[0].orderDate,
            status: data.value[0].status,
            amount: data.value[0].amount,
            poType: data.value[0].poType
          });
        }
        
        if (data.value && data.value.length > 0) {
          purchaseData = data.value;
          usedEndpoint = 'purchaseDocuments';
        } else {
          console.log('⚠️ No Material PR POs found with PO Type filter');
          
          // Try without PO Type filter (just Document Type = Order)
          const fallbackUrl = `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order'`;
          console.log(`Trying fallback: ${fallbackUrl}`);
          
          const fallbackResponse = await fetch(fallbackUrl, { headers });
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log(`✅ Found ${fallbackData.value?.length || 0} Purchase Orders`);
            
            if (fallbackData.value && fallbackData.value.length > 0) {
              purchaseData = fallbackData.value;
              usedEndpoint = 'purchaseDocuments';
              
              // Now filter locally for PO Type = "Material PR"
              const materialPRData = purchaseData.filter(item => {
                const poType = item.poType || item.PO_Type || item.po_type;
                return poType === 'Material PR' || poType === 'Material' || poType === 'PR';
              });
              
              if (materialPRData.length > 0) {
                console.log(`✅ Filtered locally: ${materialPRData.length} Material PR POs`);
                purchaseData = materialPRData;
              } else {
                console.log('⚠️ No Material PR POs found even in local filtering');
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(`Purchase Documents error: ${error.message}`);
    }
    
    // OPTION 2: Try custom Purchase API endpoint if above fails
    if (!purchaseData || purchaseData.length === 0) {
      console.log('🔄 Trying custom Purchase API endpoint...');
      const customUrl = `${baseUrl}/Company('${companyName}')/PurchaseOrderAPI`;
      
      try {
        const response = await fetch(customUrl, { headers });
        console.log(`Custom Purchase API status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found ${data.value?.length || 0} records from custom API`);
          
          if (data.value && data.value.length > 0) {
            // Filter for Material PR locally
            const filteredData = data.value.filter(item => {
              const poType = item.poType || item.PO_Type || item.po_type || item.POType;
              return poType === 'Material PR' || poType === 'Material' || poType === 'PR';
            });
            
            if (filteredData.length > 0) {
              console.log(`✅ Filtered: ${filteredData.length} Material PR POs from custom API`);
              purchaseData = filteredData;
              usedEndpoint = 'PurchaseOrderAPI';
            } else {
              console.log('⚠️ No Material PR POs in custom API response');
              purchaseData = data.value; // Use all if no Material PR
            }
          }
        }
      } catch (error) {
        console.log(`Custom API error: ${error.message}`);
      }
    }
    
    // 3. Process the data
    let dashboardData;
    let totalFilteredPOs = 0;
    
    if (purchaseData && purchaseData.length > 0) {
      console.log(`📊 Processing ${purchaseData.length} Purchase Orders`);
      console.log('🔍 First PO before processing:', purchaseData[0]);
      
      totalFilteredPOs = purchaseData.length;
      dashboardData = processPurchaseOrdersData(purchaseData);
      
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

// Process Purchase Orders data
// app/api/business-central/route.js में processPurchaseOrdersData function UPDATE करें

function processPurchaseOrdersData(data) {
  console.log(`🔧 Processing ${data.length} Purchase Orders`);
  
  if (data.length === 0) {
    console.log('⚠️ No data to process, returning mock');
    return getBusinessCentralMockData();
  }
  
  // DEBUG: FIRST ITEM ANALYSIS
  const firstItem = data[0];
  console.log('🔍 FIRST PO RAW DATA:', JSON.stringify(firstItem, null, 2));
  console.log('🔍 ALL FIELDS in first PO:', Object.keys(firstItem));
  
  // Find vendor name field
  const vendorFields = Object.keys(firstItem).filter(key => 
    key.toLowerCase().includes('vendor') || 
    key.toLowerCase().includes('supplier') ||
    key.toLowerCase().includes('buyfrom')
  );
  console.log('🔍 VENDOR RELATED FIELDS FOUND:', vendorFields);
  
  // Check what vendor data is available
  vendorFields.forEach(field => {
    console.log(`  ${field}:`, firstItem[field]);
  });
  
  const processedPOs = data.map((po, index) => {
    // 1. VENDOR NAME EXTRACTION - FIXED
    let vendorName = 'Unknown Vendor';
    let vendorNo = 'N/A';
    
    // Priority 1: Direct field names
    if (po.buyFromVendorName && po.buyFromVendorName.trim() !== '') {
      vendorName = po.buyFromVendorName.trim();
    } 
    // Priority 2: Alternative field names
    else if (po.vendorName && po.vendorName.trim() !== '') {
      vendorName = po.vendorName.trim();
    }
    // Priority 3: Any field containing "vendor" and "name"
    else {
      for (const key in po) {
        if (key.toLowerCase().includes('vendor') && 
            key.toLowerCase().includes('name') &&
            po[key] && 
            typeof po[key] === 'string' && 
            po[key].trim() !== '') {
          vendorName = po[key].trim();
          break;
        }
      }
    }
    
    // 2. VENDOR NUMBER EXTRACTION
    if (po.buyFromVendorNo && po.buyFromVendorNo.trim() !== '') {
      vendorNo = po.buyFromVendorNo.trim();
    } else if (po.vendorNo && po.vendorNo.trim() !== '') {
      vendorNo = po.vendorNo.trim();
    }
    
    // 3. DATE EXTRACTION
    let formattedDate = 'N/A';
    const rawDate = po.orderDate || po.OrderDate || po.documentDate;
    if (rawDate && rawDate !== 'N/A') {
      try {
        formattedDate = rawDate.split('T')[0];
      } catch (e) {
        formattedDate = rawDate;
      }
    }
    
    // 4. AMOUNT EXTRACTION
    const amount = parseFloat(po.amount || po.Amount || po.totalAmount || 0);
    
    // 5. STATUS EXTRACTION
    const bcStatus = po.status || po.Status || 'Open';
    const poType = po.poType || po.PO_Type || 'Material PR';
    
    const processedPO = {
      No: po.no || po.number || `PO-${index + 1}`,
      VendorName: vendorName,
      VendorNo: vendorNo,
      OrderDate: formattedDate,
      TotalAmount: amount,
      Amount: amount,
      Status: bcStatus,
      poType: poType,
      documentType: po.documentType || 'Order',
      Description: po.Description || '',
      // Debug info
      _debug: {
        hasVendorName: vendorName !== 'Unknown Vendor',
        vendorSource: po.buyFromVendorName ? 'buyFromVendorName' : 
                     po.vendorName ? 'vendorName' : 'unknown',
        rawVendorName: po.buyFromVendorName || po.vendorName
      }
    };
    
    // Log first 3 items for debugging
    if (index < 3) {
      console.log(`📋 PO ${index + 1} Processed:`, {
        No: processedPO.No,
        VendorName: processedPO.VendorName,
        VendorNo: processedPO.VendorNo,
        Status: processedPO.Status,
        Amount: processedPO.Amount,
        debug: processedPO._debug
      });
    }
    
    return processedPO;
  });
  
  // Check how many POs have vendor names
  const posWithVendor = processedPOs.filter(po => po.VendorName !== 'Unknown Vendor').length;
  console.log(`📊 POs with vendor name: ${posWithVendor}/${processedPOs.length}`);
  
  // STATUS MAPPING AND COUNTING
  const statusMapping = {
    'Open': 'Open',
    'Pending Approval': 'Pending Approval',
    'Pending': 'Pending Approval',
    'Released': 'Released',
    'Short Closed': 'Short Closed',
    'Closed': 'Short Closed'
  };
  
  const finalStatusCounts = {
    open: 0,
    pendingApproval: 0,
    released: 0,
    shortClosed: 0
  };
  
  processedPOs.forEach(po => {
    const originalStatus = po.Status;
    let mappedStatus = 'Open';
    
    if (statusMapping[originalStatus]) {
      mappedStatus = statusMapping[originalStatus];
    } else {
      const statusLower = originalStatus.toLowerCase();
      if (statusLower.includes('open')) mappedStatus = 'Open';
      else if (statusLower.includes('pending')) mappedStatus = 'Pending Approval';
      else if (statusLower.includes('released')) mappedStatus = 'Released';
      else if (statusLower.includes('closed')) mappedStatus = 'Short Closed';
    }
    
    po.Status = mappedStatus;
    
    switch(mappedStatus) {
      case 'Open': finalStatusCounts.open++; break;
      case 'Pending Approval': finalStatusCounts.pendingApproval++; break;
      case 'Released': finalStatusCounts.released++; break;
      case 'Short Closed': finalStatusCounts.shortClosed++; break;
    }
  });
  
  console.log('📊 Final Status Counts:', finalStatusCounts);
  
  // VENDOR CALCULATION - FIXED
  console.log('🔧 Calculating vendor data...');
  
  const vendorMap = new Map();
  
  processedPOs.forEach(po => {
    if (!po.VendorName || po.VendorName === 'Unknown Vendor') {
      return; // Skip unknown vendors
    }
    
    const vendorKey = po.VendorNo !== 'N/A' ? `${po.VendorNo}-${po.VendorName}` : po.VendorName;
    
    if (vendorMap.has(vendorKey)) {
      const existing = vendorMap.get(vendorKey);
      vendorMap.set(vendorKey, {
        count: existing.count + 1,
        amount: existing.amount + po.TotalAmount,
        vendorName: po.VendorName,
        vendorNo: po.VendorNo
      });
    } else {
      vendorMap.set(vendorKey, {
        count: 1,
        amount: po.TotalAmount,
        vendorName: po.VendorName,
        vendorNo: po.VendorNo
      });
    }
  });
  
  console.log('📊 Vendor Map Size:', vendorMap.size);
  
  if (vendorMap.size > 0) {
    const vendorEntries = Array.from(vendorMap.entries());
    console.log('📊 First 3 Vendor Entries:', vendorEntries.slice(0, 3));
  } else {
    console.log('⚠️ No vendors found in data!');
    // Add sample vendors for testing
    vendorMap.set('TEST-VEND-001-ABC Suppliers', {
      count: 5,
      amount: 500000,
      vendorName: 'ABC Suppliers',
      vendorNo: 'VEND-001'
    });
    vendorMap.set('TEST-VEND-002-XYZ Corp', {
      count: 3,
      amount: 300000,
      vendorName: 'XYZ Corporation',
      vendorNo: 'VEND-002'
    });
  }
  
  // TOP VENDORS - FIXED
  const topVendors = Array.from(vendorMap.entries())
    .map(([vendorKey, data]) => ({
      vendorKey,
      vendorName: data.vendorName,
      poCount: data.count,
      totalAmount: data.amount
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);
  
  console.log('🏆 Top Vendors Calculated:', topVendors);
  
  // CALCULATE TOTALS
  const totalPOs = processedPOs.length;
  const totalAmount = processedPOs.reduce((sum, po) => sum + po.TotalAmount, 0);
  const avgAmount = totalPOs > 0 ? totalAmount / totalPOs : 0;
  
  // MONTHLY TREND
  const monthlyTrend = calculateLast6MonthsTrend(processedPOs);
  
  // RECENT POS
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
  
  // FINAL DATA
  const result = {
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
    topVendors: topVendors,
    monthlyTrend: monthlyTrend,
    recentPOs: recentPOs,
    rawData: processedPOs.slice(0, 100)
  };
  
  console.log('✅ Processed Data Summary:', {
    totalPOs: result.summary.totalPOs,
    uniqueVendors: result.summary.uniqueVendors,
    topVendorsCount: result.topVendors.length,
    rawDataCount: result.rawData.length
  });
  
  return result;
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

// Mock data
function getBusinessCentralMockData() {
  const totalPOs = 208;
  const materialPRCount = Math.round(totalPOs * 0.8);
  
  const open = Math.round((45/200) * materialPRCount);
  const pending = Math.round((23/200) * materialPRCount);
  const released = Math.round((120/200) * materialPRCount);
  const shortClosed = materialPRCount - open - pending - released;
  
  return {
    type: 'purchase_orders',
    summary: {
      totalPOs: materialPRCount,
      totalAmount: 2800000,
      avgAmount: 16867,
      uniqueVendors: 25,
      materialPRCount: materialPRCount
    },
    statusSummary: {
      open: open,
      pendingApproval: pending,
      released: released,
      shortClosed: shortClosed,
      total: materialPRCount
    },
    topVendors: [
      { vendorName: 'AMBEY TRADERS', poCount: 28, totalAmount: 1400000 },
      { vendorName: 'ABC Suppliers', poCount: 22, totalAmount: 1100000 },
      { vendorName: 'XYZ Corporation', poCount: 18, totalAmount: 900000 },
      { vendorName: 'Global Traders', poCount: 15, totalAmount: 750000 }
    ],
    monthlyTrend: [
      { month: 'Jan 24', count: 25, amount: 1250000 },
      { month: 'Feb 24', count: 22, amount: 1100000 },
      { month: 'Mar 24', count: 28, amount: 1400000 },
      { month: 'Apr 24', count: 24, amount: 1200000 },
      { month: 'May 24', count: 30, amount: 1500000 },
      { month: 'Jun 24', count: 37, amount: 1850000 }
    ],
    recentPOs: [
      { 
        No: 'AL-PO-0001', 
        VendorName: 'AMBEY TRADERS', 
        VendorNo: 'VEND-001',
        OrderDate: '2024-06-28',
        TotalAmount: 125000,
        Amount: 125000,
        Status: 'Open',
        poType: 'Material PR'
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
        poType: 'Material PR'
      },
      { 
        No: 'AL-PO-0002', 
        VendorName: 'ABC Suppliers', 
        VendorNo: 'VEND-002',
        OrderDate: '2024-06-25',
        TotalAmount: 98000,
        Amount: 98000,
        Status: 'Pending Approval',
        poType: 'Material PR'
      },
      { 
        No: 'AL-PO-0003', 
        VendorName: 'XYZ Corporation', 
        VendorNo: 'VEND-003',
        OrderDate: '2024-06-20',
        TotalAmount: 75000,
        Amount: 75000,
        Status: 'Released',
        poType: 'Material PR'
      }
    ]
  };
}

// Token Function - FIXED WITH HARDCODED VALUES
async function getAccessToken() {
  console.log('🔑 Getting Business Central access token...');
  
  try {
    // HARDCODED VALUES - TEMPORARY FIX
     const tenantId = process.env.BC_TENANT_ID;
    const clientId = process.env.BC_CLIENT_ID;
    const clientSecret = process.env.BC_CLIENT_SECRET;
    const scope = 'https://api.businesscentral.dynamics.com/.default';
    
    console.log('🔑 Using Tenant ID:', tenantId);
    console.log('🔑 Using Client ID:', clientId);
    
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