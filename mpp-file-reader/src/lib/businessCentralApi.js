
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
    
    if (!response.ok) {
      throw new Error(`API failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('✅ PO API Result:', {
      success: result.success,
      dataSource: result.dataSource,
      recordCount: result.recordCount,
      endpointUsed: result.endpointUsed
    });
    
    if (result.success && result.data) {
      console.log('📊 Processing Purchase Order data...');
      return convertApiResponseToFrontendFormat(result);
    } else if (result.data) {
      console.log('📊 Processing fallback data...');
      return convertApiResponseToFrontendFormat(result);
    } else {
      throw new Error('No data received from API');
    }
    
  } catch (error) {
    console.error('❌ PO API Error:', error.message);
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
    
    if (!response.ok) {
      throw new Error(`Work Order API failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('✅ WO API Result:', {
      success: result.success,
      dataSource: result.dataSource,
      recordCount: result.recordCount,
      endpointUsed: result.endpointUsed
    });
    
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
  
  const apiData = apiResponse.data;
  const dataSource = apiResponse.dataSource || 'unknown';
  
  // Start with source indicator
  const convertedData = {
    _source: dataSource,
    _timestamp: apiResponse.timestamp || new Date().toISOString(),
    _apiSuccess: apiResponse.success || false,
    _dataType: dataType
  };
  
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
      }
      
      // Raw data for list
      convertedData.rawData = apiData.rawData || apiData.recentPOs || [];
      
      // Summary data
      convertedData.summary = apiData.summary || {
        totalPOs: convertedData.statusSummary.total,
        totalAmount: convertedData.vendorWiseData.reduce((sum, vendor) => sum + (vendor.totalAmount || 0), 0),
        avgAmount: convertedData.statusSummary.total > 0 ? 
          convertedData.vendorWiseData.reduce((sum, vendor) => sum + (vendor.totalAmount || 0), 0) / convertedData.statusSummary.total : 0,
        uniqueVendors: convertedData.vendorWiseData.length
      };
      
    } else {
      console.log('⚠️ Unknown PO data format, using mock data');
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
      console.log('⚠️ Unknown Work Order data format, using mock data');
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
        { vendorName: 'ABC Suppliers', poCount: 25, totalAmount: 1250000 },
        { vendorName: 'XYZ Corporation', poCount: 18, totalAmount: 980000 },
        { vendorName: 'Global Traders', poCount: 15, totalAmount: 750000 }
      ],
      rawData: [
        {
          No: 'PO-1001',
          VendorName: 'ABC Suppliers',
          VendorNo: 'VEND-001',
          OrderDate: '2024-01-15',
          TotalAmount: 125000,
          Status: 'Released'
        },
        {
          No: 'PO-1002',
          VendorName: 'XYZ Corporation',
          VendorNo: 'VEND-002',
          OrderDate: '2024-01-18',
          TotalAmount: 98000,
          Status: 'Pending Approval'
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
          No: 'WO-2024-001', 
          VendorName: 'Tech Maintenance Inc', 
          VendorNo: 'VEND-WO-001',
          OrderDate: '2024-06-28',
          TotalAmount: 45000,
          Status: 'Open',
          Description: 'Machine Preventive Maintenance'
        },
        { 
          No: 'WO-2024-002', 
          VendorName: 'Quality Control Corp', 
          VendorNo: 'VEND-WO-003',
          OrderDate: '2024-06-25',
          TotalAmount: 32000,
          Status: 'Released',
          Description: 'Monthly Quality Inspection'
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