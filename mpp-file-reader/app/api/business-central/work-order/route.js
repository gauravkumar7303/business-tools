
// app/api/business-central/work-order/route.js
export const dynamic = 'force-dynamic';

export async function GET(request) {
  console.log('🚀 Business Central Work Order API called');
  
  try {
    // 1. Get Access Token
    console.log('🔑 Getting access token for Work Orders...');
    const tokenResponse = await getAccessToken();
    
    if (!tokenResponse?.access_token) {
      console.log('❌ Token not available, using mock data');
      return Response.json(getWorkOrderMockData(), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('✅ Token received successfully');
    
    // 2. Build URL - DIRECT WorkOrder API endpoint use करें (Page 50172)
    const baseUrl = "https://api.businesscentral.dynamics.com/v2.0/37e65e1f-9d37-4f4f-9358-845548ef5202/SANDBOX-VALIDATIONS-26-11-2024/ODataV4";
    const companyName = 'AL%20SOFTWEB%20PVT%20LTD%20UAT';
    
    const headers = {
      'Authorization': `Bearer ${tokenResponse.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    console.log('🔍 Fetching Work Orders from WorkOrder API...');
    
    let workOrderData = null;
    let usedEndpoint = '';
    
    // DIRECT API: Page 50172 WorkOrder API use करें
    const workOrderApiUrl = `${baseUrl}/Company('${companyName}')/WorkOrder`;
    console.log(`📡 Calling: ${workOrderApiUrl}`);
    
    try {
      const response = await fetch(workOrderApiUrl, { headers });
      console.log(`WorkOrder API status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Found ${data.value?.length || 0} Work Orders from WorkOrder API`);
        
        // DEBUG: Log first item
        if (data.value && data.value.length > 0) {
          console.log('🔍 First Work Order from API:', {
            PO_No: data.value[0].PO_No,
            Status: data.value[0].Status,
            Buy_from_vendor_name: data.value[0].Buy_from_vendor_name,
            Buy_From_Vendor_no: data.value[0].Buy_From_Vendor_no,
            Amount: data.value[0].Amount,
            OrderDate: data.value[0].OrderDate
          });
        }
        
        if (data.value && data.value.length > 0) {
          workOrderData = data.value;
          usedEndpoint = 'WorkOrder';
        }
      } else {
        const errorText = await response.text();
        console.error('❌ WorkOrder API error:', response.status, errorText);
      }
    } catch (error) {
      console.log(`WorkOrder API fetch error: ${error.message}`);
    }
    
    // FALLBACK: Try old endpoints if direct API fails
    if (!workOrderData || workOrderData.length === 0) {
      console.log('🔄 Trying fallback endpoints...');
      
      // Option 1: Try purchaseDocuments with Service PR filter
      const workOrderUrl = `${baseUrl}/Company('${companyName}')/purchaseDocuments?$filter=documentType eq 'Order' and poType eq 'Service PR'`;
      
      try {
        const response = await fetch(workOrderUrl, { headers });
        console.log(`Fallback purchaseDocuments status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found ${data.value?.length || 0} Work Orders from fallback`);
          if (data.value && data.value.length > 0) {
            workOrderData = data.value;
            usedEndpoint = 'purchaseDocuments';
          }
        }
      } catch (error) {
        console.log(`Fallback error: ${error.message}`);
      }
    }
    
    // 3. Process the data
    let dashboardData;
    let totalFilteredWorkOrders = 0;
    
    if (workOrderData && workOrderData.length > 0) {
      console.log(`📊 Processing ${workOrderData.length} Work Orders`);
      
      totalFilteredWorkOrders = workOrderData.length;
      dashboardData = processWorkOrdersData(workOrderData);
      
    } else {
      console.log('📦 No Work Order data found, using mock data');
      dashboardData = getWorkOrderMockData();
      totalFilteredWorkOrders = dashboardData.summary.totalWorkOrders;
    }
    
    // 4. Return formatted response
    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      dataSource: workOrderData ? 'business_central' : 'mock_data',
      endpointUsed: usedEndpoint,
      recordCount: totalFilteredWorkOrders,
      data: dashboardData,
      _debug: {
        filteredCount: totalFilteredWorkOrders,
        endpoint: usedEndpoint,
        sampleData: workOrderData ? workOrderData.slice(0, 1) : []
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
      data: getWorkOrderMockData()
    }, { status: 200 });
  }
}

// Process Work Orders data
function processWorkOrdersData(data) {
  console.log(`Processing ${data.length} Work Orders`);
  
  if (data.length === 0) {
    return getWorkOrderMockData();
  }
  
  const processedWorkOrders = data.map((wo, index) => {
    // **NEW: Field names from API page 50172**
    // PO_No, Status, Buy_from_vendor_name, Buy_From_Vendor_no, Amount, OrderDate
    
    // 1. WORK ORDER NO - Check both field names
    let workOrderNo = wo.PO_No || wo.no || wo.number || wo.workOrderNo || `Al-WO-${String(index + 1).padStart(3, '0')}`;
    
    // Format as WO-XXX if not already
    if (workOrderNo && !workOrderNo.startsWith('AL-WO-') && !workOrderNo.startsWith('AL-PO-')) {
      // Extract numbers from PO no if possible
      const match = workOrderNo.match(/\d+/);
      if (match) {
        workOrderNo = `AL-WO-${match[0].padStart(3, '0')}`;
      } else {
        workOrderNo = `Al-WO-${String(index + 1).padStart(3, '0')}`;
      }
    }
    
    // 2. VENDOR INFO - Check both field names
    const vendorName = wo.Buy_from_vendor_name || wo.buyFromVendorName || wo.vendorName || 'Unknown Vendor';
    const vendorNo = wo.Buy_From_Vendor_no || wo.buyFromVendorNo || wo.vendorNo || 'N/A';
    
    // 3. DATE - Check both field names
    const rawOrderDate = wo.OrderDate || wo.orderDate || 'N/A';
    
    // Format date
    let formattedDate = 'N/A';
    if (rawOrderDate && rawOrderDate !== 'N/A') {
      try {
        const dateOnly = rawOrderDate.split('T')[0];
        formattedDate = dateOnly;
      } catch (e) {
        formattedDate = rawOrderDate;
      }
    }
    
    // 4. AMOUNT - Check both field names
    const amount = parseFloat(wo.Amount || wo.amount || 0);
    
    // 5. STATUS - Check both field names
    const bcStatus = wo.Status || wo.status || wo.documentStatus || 'Open';
    
    return {
      No: workOrderNo,
      VendorName: vendorName,
      VendorNo: vendorNo,
      Description: `Work Order ${workOrderNo}`,
      Type: 'Service',
      OrderDate: formattedDate,
      TotalAmount: amount,
      Amount: amount,
      Status: bcStatus,
      OriginalStatus: bcStatus,
      Priority: 'Medium',
      AssignedTo: 'Not Assigned',
      Cost: amount,
      poType: 'Service PR'
    };
  });
  
  // Rest of the function remains similar but updated for Work Orders...
  // Status mapping
  const statusMapping = {
    'Open': 'Open',
    'Pending Approval': 'Pending Approval',
    'Pending': 'Pending Approval',
    'Awaiting Approval': 'Pending Approval',
    'Recheck': 'Pending Approval',
    'In Review': 'Pending Approval',
    'On Hold': 'Pending Approval',
    'Released': 'Released',
    'Approved': 'Released',
    'Completed': 'Released',
    'In Progress': 'Released',
    'Work in Progress': 'Released',
    'Short Closed': 'Short Closed',
    'Closed': 'Short Closed',
    'Cancelled': 'Short Closed',
    'Rejected': 'Short Closed',
    'Void': 'Short Closed'
  };
  
  // Calculate status counts
  const finalStatusCounts = {
    open: 0,
    pendingApproval: 0,
    released: 0,
    shortClosed: 0
  };
  
  const statusDebug = [];
  
  processedWorkOrders.forEach(wo => {
    const originalStatus = wo.OriginalStatus || '';
    let mappedStatus = 'Open';
    
    if (statusMapping[originalStatus]) {
      mappedStatus = statusMapping[originalStatus];
    } else {
      const statusLower = originalStatus.toLowerCase();
      if (statusLower.includes('open') || statusLower.includes('new')) {
        mappedStatus = 'Open';
      } else if (statusLower.includes('pending') || 
                 statusLower.includes('awaiting') ||
                 statusLower.includes('recheck') || 
                 statusLower.includes('review') ||
                 statusLower.includes('hold')) {
        mappedStatus = 'Pending Approval';
      } else if (statusLower.includes('released') || 
                 statusLower.includes('approved') ||
                 statusLower.includes('complete') ||
                 statusLower.includes('progress')) {
        mappedStatus = 'Released';
      } else if (statusLower.includes('closed') || 
                 statusLower.includes('cancelled') ||
                 statusLower.includes('short') ||
                 statusLower.includes('rejected') ||
                 statusLower.includes('void')) {
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
    
    // Store debug info
    statusDebug.push({
      originalStatus,
      mappedStatus,
      woNo: wo.No
    });
    
    wo.Status = mappedStatus;
  });
  
  console.log('🔧 Work Order Status Mapping Debug:', statusDebug.slice(0, 5));
  console.log('✅ Work Order Final Status Counts:', finalStatusCounts);
  
  const totalWorkOrders = processedWorkOrders.length;
  
  // Vendor data
  const vendorMap = new Map();
  processedWorkOrders.forEach(wo => {
    const vendorKey = wo.VendorNo !== 'N/A' ? wo.VendorNo : wo.VendorName;
    if (vendorKey && vendorKey !== 'N/A' && vendorKey !== 'Unknown Vendor') {
      if (vendorMap.has(vendorKey)) {
        const existing = vendorMap.get(vendorKey);
        vendorMap.set(vendorKey, {
          count: existing.count + 1,
          amount: existing.amount + wo.TotalAmount,
          vendorName: wo.VendorName
        });
      } else {
        vendorMap.set(vendorKey, {
          count: 1,
          amount: wo.TotalAmount,
          vendorName: wo.VendorName
        });
      }
    }
  });
  
  // Top vendors
  const topVendors = Array.from(vendorMap.entries())
    .map(([vendorKey, data]) => ({
      vendorKey,
      vendorName: data.vendorName,
      woCount: data.count,
      totalAmount: data.amount
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);
  
  // Calculate totals
  const totalAmount = processedWorkOrders.reduce((sum, wo) => sum + wo.TotalAmount, 0);
  const avgAmount = totalWorkOrders > 0 ? totalAmount / totalWorkOrders : 0;
  
  // Monthly trend
  const monthlyTrend = calculateLast6MonthsTrend(processedWorkOrders);
  
  // Recent Work Orders
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentWorkOrders = processedWorkOrders
    .filter(wo => {
      try {
        if (wo.OrderDate === 'N/A') return false;
        const woDate = new Date(wo.OrderDate);
        return woDate >= thirtyDaysAgo;
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
    type: 'work_orders',
    summary: {
      totalWorkOrders: totalWorkOrders,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalCost: Math.round(totalAmount * 100) / 100,
      avgAmount: Math.round(avgAmount * 100) / 100,
      uniqueVendors: vendorMap.size,
    },
    statusSummary: {
      open: finalStatusCounts.open,
      pendingApproval: finalStatusCounts.pendingApproval,
      released: finalStatusCounts.released,
      shortClosed: finalStatusCounts.shortClosed,
      total: totalWorkOrders
    },
    topVendors: topVendors.map(v => ({
      vendorName: v.vendorName,
      woCount: v.woCount,
      totalAmount: v.totalAmount
    })),
    monthlyTrend,
    recentWorkOrders: recentWorkOrders,
    rawData: processedWorkOrders.slice(0, 100)
  };
}

// Calculate trend for last 6 months only
function calculateLast6MonthsTrend(workOrders) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = {};
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  workOrders.forEach(wo => {
    try {
      if (!wo.OrderDate || wo.OrderDate === 'N/A') return;
      const woDate = new Date(wo.OrderDate);
      
      if (woDate >= sixMonthsAgo) {
        const month = months[woDate.getMonth()];
        const year = woDate.getFullYear().toString().slice(-2);
        const monthYear = `${month} ${year}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthYear,
            count: 0,
            amount: 0
          };
        }
        
        monthlyData[monthYear].count++;
        monthlyData[monthYear].amount += wo.TotalAmount || 0;
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

// Mock data for Work Orders
function getWorkOrderMockData() {
  const totalWorkOrders = 125;
  
  const open = Math.round((40/125) * totalWorkOrders);
  const pending = Math.round((25/125) * totalWorkOrders);
  const released = Math.round((45/125) * totalWorkOrders);
  const shortClosed = totalWorkOrders - open - pending - released;
  
  return {
    type: 'work_orders',
    summary: {
      totalWorkOrders: totalWorkOrders,
      totalAmount: 1850000,
      totalCost: 1850000,
      avgAmount: 14800,
      uniqueVendors: 18
    },
    statusSummary: {
      open: open,
      pendingApproval: pending,
      released: released,
      shortClosed: shortClosed,
      total: totalWorkOrders
    },
    topVendors: [
      { vendorName: 'Tech Maintenance Inc', woCount: 28, totalAmount: 450000 },
      { vendorName: 'Industrial Services Ltd', woCount: 22, totalAmount: 380000 },
      { vendorName: 'Quality Control Corp', woCount: 18, totalAmount: 300000 },
      { vendorName: 'Machine Repair Co', woCount: 15, totalAmount: 250000 }
    ],
    monthlyTrend: [
      { month: 'Jan 24', count: 20, amount: 300000 },
      { month: 'Feb 24', count: 22, amount: 330000 },
      { month: 'Mar 24', count: 25, amount: 375000 },
      { month: 'Apr 24', count: 21, amount: 315000 },
      { month: 'May 24', count: 28, amount: 420000 },
      { month: 'Jun 24', count: 19, amount: 285000 }
    ],
    recentWorkOrders: [
      { 
        No: 'AL-WO-001', 
        VendorName: 'Tech Maintenance Inc', 
        VendorNo: 'VEND-WO-001',
        Description: 'Machine Preventive Maintenance',
        OrderDate: '2024-06-28',
        TotalAmount: 45000,
        Amount: 45000,
        Status: 'Open',
        Priority: 'High',
        AssignedTo: 'John Smith'
      }
    ],
    rawData: [
      { 
        No: 'Al-WO-001', 
        VendorName: 'Tech Maintenance Inc', 
        VendorNo: 'VEND-WO-001',
        OrderDate: '2024-06-28',
        TotalAmount: 45000,
        Amount: 45000,
        Status: 'Open',
        Description: 'Machine Preventive Maintenance',
        Priority: 'High',
        AssignedTo: 'John Smith',
        Type: 'Maintenance'
      },
      { 
        No: 'AL-WO-002', 
        VendorName: 'Quality Control Corp', 
        VendorNo: 'VEND-WO-003',
        OrderDate: '2024-06-25',
        TotalAmount: 32000,
        Amount: 32000,
        Status: 'Released',
        Description: 'Monthly Quality Inspection',
        Priority: 'Medium',
        AssignedTo: 'Sarah Johnson',
        Type: 'Inspection'
      },
      { 
        No: 'AL-WO-003', 
        VendorName: 'Industrial Services Ltd', 
        VendorNo: 'VEND-WO-002',
        OrderDate: '2024-06-20',
        TotalAmount: 68000,
        Amount: 68000,
        Status: 'Pending Approval',
        Description: 'Factory Equipment Repair',
        Priority: 'High',
        AssignedTo: 'Mike Wilson',
        Type: 'Repair'
      }
    ]
  };
}

// Token Function - SAME AS PURCHASE ORDER
async function getAccessToken() {
  console.log('🔑 Getting Business Central access token...');
  
  try {
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