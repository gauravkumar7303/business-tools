// src/lib/businessCentralApi.js
export const getPOStatistics = async () => {
  try {
    console.log('📡 Calling Business Central Purchase Order API...');
    
    const response = await fetch('/api/business-central', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 API Response Status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API failed with status:', response.status);
      throw new Error(`API failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('✅ PO API Result:', {
      success: result.success,
      dataSource: result.dataSource,
      recordCount: result.recordCount,
      endpointUsed: result.endpointUsed,
      hasData: !!result.data
    });
    
    // DEBUG: Check if data exists
    if (!result) {
      console.error('❌ No result from API');
      throw new Error('No response from API');
    }
    
    if (!result.data) {
      console.error('❌ No data in response:', result);
      // If there's no data but API was successful, return mock
      if (result.success) {
        console.log('⚠️ API success but no data, returning mock');
        return getMockStatistics('api_no_data', 'purchase_orders');
      }
      throw new Error('No data received from API');
    }
    
    if (result.success && result.data) {
      console.log('📊 Processing Purchase Order data...');
      return convertApiResponseToFrontendFormat(result);
    } else if (result.data) {
      console.log('📊 Processing fallback data...');
      return convertApiResponseToFrontendFormat(result);
    } else {
      console.error('❌ No data in response body:', result);
      throw new Error('No data received from API');
    }
    
  } catch (error) {
    console.error('❌ PO API Error:', error.message);
    console.error('❌ Error stack:', error.stack);
    return getMockStatistics('api_error', 'purchase_orders');
  }
};

export const getWorkOrderStatistics = async () => {
  try {
    console.log('📡 Calling Business Central Work Order API...');
    
    const response = await fetch('/api/business-central/work-order', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 WO API Response Status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Work Order API failed:', response.status);
      throw new Error(`Work Order API failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('✅ WO API Result:', {
      success: result.success,
      dataSource: result.dataSource,
      recordCount: result.recordCount,
      endpointUsed: result.endpointUsed,
      hasData: !!result.data
    });
    
    if (!result.data) {
      console.error('❌ No data in WO response');
      if (result.success) {
        return getMockStatistics('api_no_data', 'work_orders');
      }
      throw new Error('No Work Order data received from API');
    }
    
    if (result.success && result.data) {
      console.log('📊 Processing Work Order data...');
      return convertApiResponseToFrontendFormat(result, 'work_orders');
    } else if (result.data) {
      console.log('📊 Processing Work Order fallback data...');
      return convertApiResponseToFrontendFormat(result, 'work_orders');
    } else {
      throw new Error('No Work Order data received from API');
    }
    
  } catch (error) {
    console.error('❌ Work Order API Error:', error.message);
    return getMockStatistics('api_error', 'work_orders');
  }
};

// Convert API response to frontend format
function convertApiResponseToFrontendFormat(apiResponse, dataType = 'purchase_orders') {
  console.log(`🔄 Converting ${dataType} API response...`);
  console.log('🔍 API Response structure:', {
    keys: Object.keys(apiResponse),
    hasData: !!apiResponse.data,
    dataType: apiResponse.data?.type
  });
  
  const apiData = apiResponse.data;
  const dataSource = apiResponse.dataSource || 'unknown';
  
  // Start with source indicator
  const convertedData = {
    _source: dataSource,
    _timestamp: apiResponse.timestamp || new Date().toISOString(),
    _apiSuccess: apiResponse.success || false,
    _dataType: dataType
  };
  
  // If no data, return mock immediately
  if (!apiData) {
    console.log(`⚠️ No apiData for ${dataType}, returning mock`);
    return getMockStatistics('no_data_in_response', dataType);
  }
  
  if (dataType === 'purchase_orders') {
    // Purchase Orders data
    if (apiData.type === 'purchase_orders') {
      console.log('📋 Purchase order data detected');
      
      // Status summary
      convertedData.statusSummary = {
        open: apiData.statusSummary?.open || 0,
        pendingApproval: apiData.statusSummary?.pendingApproval || 0,
        released: apiData.statusSummary?.released || 0,
        shortClosed: apiData.statusSummary?.shortClosed || 0,
        total: apiData.statusSummary?.total || apiData.summary?.totalPOs || 0
      };
      
      // Vendor-wise data
      if (apiData.topVendors && apiData.topVendors.length > 0) {
        convertedData.vendorWiseData = apiData.topVendors.map(vendor => ({
          vendorName: vendor.vendorName || 'Unknown Vendor',
          poCount: vendor.poCount || vendor.count || 0,
          totalAmount: vendor.totalAmount || vendor.amount || 0
        }));
      } else {
        convertedData.vendorWiseData = [];
        console.log('⚠️ No vendor data in PO response');
      }
      
      // Raw data for list
      convertedData.rawData = apiData.rawData || apiData.recentPOs || [];
      console.log(`📋 Raw data count: ${convertedData.rawData.length}`);
      
      // Summary data
      convertedData.summary = apiData.summary || {
        totalPOs: convertedData.statusSummary.total,
        totalAmount: convertedData.vendorWiseData.reduce((sum, vendor) => sum + (vendor.totalAmount || 0), 0),
        avgAmount: convertedData.statusSummary.total > 0 ? 
          convertedData.vendorWiseData.reduce((sum, vendor) => sum + (vendor.totalAmount || 0), 0) / convertedData.statusSummary.total : 0,
        uniqueVendors: convertedData.vendorWiseData.length
      };
      
    } else {
      console.log('⚠️ Unknown PO data format:', apiData.type);
      return getMockStatistics('unknown_format', 'purchase_orders');
    }
    
  } else if (dataType === 'work_orders') {
    // Work Orders data
    if (apiData.type === 'work_orders') {
      console.log('🔧 Work order data detected');
      
      // Status summary
      convertedData.statusSummary = {
        open: apiData.statusSummary?.open || 0,
        pendingApproval: apiData.statusSummary?.pendingApproval || 0,
        released: apiData.statusSummary?.released || 0,
        shortClosed: apiData.statusSummary?.shortClosed || 0,
        total: apiData.statusSummary?.total || apiData.summary?.totalWorkOrders || 0
      };
      
      // Vendor-wise data
      if (apiData.topVendors && apiData.topVendors.length > 0) {
        convertedData.vendorWiseData = apiData.topVendors.map(vendor => ({
          vendorName: vendor.vendorName || 'Unknown Vendor',
          woCount: vendor.woCount || vendor.count || 0,
          totalAmount: vendor.totalAmount || vendor.amount || 0
        }));
      } else {
        convertedData.vendorWiseData = [];
      }
      
      // Raw data for list
      convertedData.rawData = apiData.rawData || apiData.recentWorkOrders || [];
      
      // Summary data
      convertedData.summary = apiData.summary || {
        totalWorkOrders: convertedData.statusSummary.total,
        totalAmount: convertedData.vendorWiseData.reduce((sum, vendor) => sum + (vendor.totalAmount || 0), 0),
        avgAmount: convertedData.statusSummary.total > 0 ? 
          convertedData.vendorWiseData.reduce((sum, vendor) => sum + (vendor.totalAmount || 0), 0) / convertedData.statusSummary.total : 0,
        uniqueVendors: convertedData.vendorWiseData.length
      };
      
    } else {
      console.log('⚠️ Unknown Work Order data format:', apiData.type);
      return getMockStatistics('unknown_format', 'work_orders');
    }
  }
  
  // Fill in any missing data with mock values
  if (dataType === 'purchase_orders') {
    const mockData = getMockStatistics('', 'purchase_orders');
    convertedData.vendorWiseData = convertedData.vendorWiseData || mockData.vendorWiseData;
    convertedData.rawData = convertedData.rawData || mockData.rawData;
    convertedData.summary = convertedData.summary || mockData.summary;
  } else if (dataType === 'work_orders') {
    const mockData = getMockStatistics('', 'work_orders');
    convertedData.vendorWiseData = convertedData.vendorWiseData || mockData.vendorWiseData;
    convertedData.rawData = convertedData.rawData || mockData.rawData;
    convertedData.summary = convertedData.summary || mockData.summary;
  }
  
  console.log(`✅ ${dataType} conversion complete:`, {
    statusSummary: convertedData.statusSummary,
    dataSource: convertedData._source,
    rawDataCount: convertedData.rawData?.length
  });
  
  return convertedData;
}

// Mock data function
function getMockStatistics(source = 'mock_fallback', dataType = 'purchase_orders') {
  console.log(`📦 Returning mock ${dataType} data (source: ${source})`);
  
  if (dataType === 'purchase_orders') {
    return {
      statusSummary: {
        open: 45,
        pendingApproval: 23,
        released: 120,
        shortClosed: 12,
        total: 200
      },
      vendorWiseData: [
        { vendorName: 'AMBEY TRADERS', poCount: 35, totalAmount: 1750000 },
        { vendorName: 'ABC Suppliers', poCount: 25, totalAmount: 1250000 },
        { vendorName: 'XYZ Corporation', poCount: 18, totalAmount: 980000 }
      ],
      rawData: [
        {
          No: 'AL-PO-0001',
          VendorName: 'AMBEY TRADERS',
          VendorNo: 'VEND-001',
          OrderDate: '2024-01-15',
          TotalAmount: 125000,
          Status: 'Released',
          Description: 'Raw Materials'
        },
        {
          No: 'AL-PO-0002',
          VendorName: 'ABC Suppliers',
          VendorNo: 'VEND-002',
          OrderDate: '2024-01-18',
          TotalAmount: 98000,
          Status: 'Pending Approval',
          Description: 'Electronics Components'
        },
        {
          No: 'AL-PO-0003',
          VendorName: 'XYZ Corporation',
          VendorNo: 'VEND-003',
          OrderDate: '2024-01-20',
          TotalAmount: 75000,
          Status: 'Open',
          Description: 'Packaging Materials'
        },
        {
          No: 'AL-PO-0004',
          VendorName: 'Global Traders',
          VendorNo: 'VEND-004',
          OrderDate: '2024-01-22',
          TotalAmount: 150000,
          Status: 'Released',
          Description: 'Machinery Parts'
        },
        {
          No: 'AL-PO-0005',
          VendorName: 'Tech Solutions Ltd',
          VendorNo: 'VEND-005',
          OrderDate: '2024-01-25',
          TotalAmount: 85000,
          Status: 'Short Closed',
          Description: 'Software License'
        }
      ],
      summary: {
        totalPOs: 200,
        totalAmount: 2850000,
        avgAmount: 14250,
        uniqueVendors: 8
      },
      _source: source,
      _timestamp: new Date().toISOString(),
      _dataType: dataType
    };
  } else if (dataType === 'work_orders') {
    return {
      statusSummary: {
        open: 40,
        pendingApproval: 25,
        released: 45,
        shortClosed: 15,
        total: 125
      },
      vendorWiseData: [
        { vendorName: 'Tech Maintenance Inc', woCount: 28, totalAmount: 450000 },
        { vendorName: 'Industrial Services Ltd', woCount: 22, totalAmount: 380000 },
        { vendorName: 'Quality Control Corp', woCount: 18, totalAmount: 300000 }
      ],
      rawData: [
        { 
          No: 'WO-001', 
          VendorName: 'Tech Maintenance Inc', 
          VendorNo: 'VEND-WO-001',
          OrderDate: '2024-06-28',
          TotalAmount: 45000,
          Status: 'Open',
          Description: 'Machine Preventive Maintenance',
          Priority: 'High',
          AssignedTo: 'John Smith'
        },
        { 
          No: 'WO-002', 
          VendorName: 'Quality Control Corp', 
          VendorNo: 'VEND-WO-003',
          OrderDate: '2024-06-25',
          TotalAmount: 32000,
          Status: 'Released',
          Description: 'Monthly Quality Inspection',
          Priority: 'Medium',
          AssignedTo: 'Sarah Johnson'
        },
        { 
          No: 'WO-003', 
          VendorName: 'Industrial Services Ltd', 
          VendorNo: 'VEND-WO-002',
          OrderDate: '2024-06-20',
          TotalAmount: 68000,
          Status: 'Pending Approval',
          Description: 'Factory Equipment Repair',
          Priority: 'High',
          AssignedTo: 'Mike Wilson'
        },
        { 
          No: 'WO-004', 
          VendorName: 'Electrical Works', 
          VendorNo: 'VEND-WO-005',
          OrderDate: '2024-06-18',
          TotalAmount: 25000,
          Status: 'Short Closed',
          Description: 'Wiring Installation',
          Priority: 'Medium',
          AssignedTo: 'David Lee'
        },
        { 
          No: 'WO-005', 
          VendorName: 'HVAC Services', 
          VendorNo: 'VEND-WO-006',
          OrderDate: '2024-06-15',
          TotalAmount: 18000,
          Status: 'Released',
          Description: 'AC Maintenance',
          Priority: 'Low',
          AssignedTo: 'Emma Brown'
        }
      ],
      summary: {
        totalWorkOrders: 125,
        totalAmount: 1850000,
        avgAmount: 14800,
        uniqueVendors: 8
      },
      _source: source,
      _timestamp: new Date().toISOString(),
      _dataType: dataType
    };
  }
}