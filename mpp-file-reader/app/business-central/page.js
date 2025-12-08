
// 'use client'

// import {
//   ArrowLeft,
//   Plus,
//   Download,
//   Menu,
//   PieChart,
//   BarChart3,
//   TrendingUp,
//   FileText,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Users,
//   RefreshCw,
//   DollarSign,
//   ShoppingCart,
//   Eye,
//   Wifi,
//   WifiOff,
//   Database,
//   Search,
//   Briefcase,
//   Tool,
//   Settings,
//   Calendar,
//   Hourglass,
//   Zap,
//   HardHat,
//   ClipboardCheck,
//   Building
// } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import ThemeToggle from '@/src/components/ThemeToggle'
// import { useState, useEffect } from 'react'
// import { getPOStatistics, getWorkOrderStatistics } from '@/src/lib/businessCentralApi'

// // Purchase Order Status Pie Chart Component
// const POStatusPieChart = ({ data }) => {
//   const colors = {
//     open: '#3B82F6', // Blue
//     pendingApproval: '#F59E0B', // Yellow
//     released: '#10B981', // Green
//     shortClosed: '#EF4444', // Red
//   };

//   const total = data.total || 1;
//   const radius = 80;
//   const circumference = 2 * Math.PI * radius;

//   const calculateDashArray = (value) => {
//     const percentage = (value / total) * 100;
//     const dashLength = (percentage / 100) * circumference;
//     return `${dashLength} ${circumference}`;
//   };

//   const calculateOffset = (index, previousValues) => {
//     let offset = 0;
//     for (let i = 0; i < index; i++) {
//       offset += (previousValues[i] / total) * circumference;
//     }
//     return offset;
//   };

//   const statuses = [
//     { key: 'open', label: 'Open', value: data.open || 0, color: colors.open },
//     { key: 'pendingApproval', label: 'Pending Approval', value: data.pendingApproval || 0, color: colors.pendingApproval },
//     { key: 'released', label: 'Released', value: data.released || 0, color: colors.released },
//     { key: 'shortClosed', label: 'Short Closed', value: data.shortClosed || 0, color: colors.shortClosed },
//   ];

//   const previousValues = statuses.map(s => s.value);

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800">PO Status Distribution</h3>
//         <PieChart className="w-5 h-5 text-blue-600" />
//       </div>

//       <div className="flex flex-col md:flex-row items-center gap-8">
//         {/* Pie Chart */}
//         <div className="relative">
//           <svg width="200" height="200" className="transform -rotate-90">
//             <circle
//               cx="100"
//               cy="100"
//               r={radius}
//               fill="none"
//               stroke="#F3F4F6"
//               strokeWidth="40"
//             />
//             {statuses.map((status, index) => (
//               <circle
//                 key={status.key}
//                 cx="100"
//                 cy="100"
//                 r={radius}
//                 fill="none"
//                 stroke={status.color}
//                 strokeWidth="40"
//                 strokeLinecap="round"
//                 strokeDasharray={calculateDashArray(status.value)}
//                 strokeDashoffset={-calculateOffset(index, previousValues)}
//               />
//             ))}
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{total}</div>
//               <div className="text-sm text-gray-600">Total PO</div>
//             </div>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="space-y-4">
//           {statuses.map((status) => (
//             <div key={status.key} className="flex items-center gap-3">
//               <div
//                 className="w-4 h-4 rounded-full"
//                 style={{ backgroundColor: status.color }}
//               />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span className="text-sm font-medium text-gray-700">{status.label}</span>
//                   <span className="text-sm font-bold text-gray-800">{status.value}</span>
//                 </div>
//                 <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
//                   <div
//                     className="h-2 rounded-full"
//                     style={{
//                       width: `${(status.value / total) * 100}%`,
//                       backgroundColor: status.color
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Work Order Status Pie Chart Component
// const WOStatusPieChart = ({ data }) => {
//   const colors = {
//     open: '#3B82F6', // Blue
//     inProgress: '#8B5CF6', // Purple
//     pending: '#F59E0B', // Yellow
//     completed: '#10B981', // Green
//     closed: '#6B7280', // Gray
//   };

//   const total = data.total || 1;
//   const radius = 80;
//   const circumference = 2 * Math.PI * radius;

//   const calculateDashArray = (value) => {
//     const percentage = (value / total) * 100;
//     const dashLength = (percentage / 100) * circumference;
//     return `${dashLength} ${circumference}`;
//   };

//   const calculateOffset = (index, previousValues) => {
//     let offset = 0;
//     for (let i = 0; i < index; i++) {
//       offset += (previousValues[i] / total) * circumference;
//     }
//     return offset;
//   };

//   const statuses = [
//     { key: 'open', label: 'Open', value: data.open || 0, color: colors.open },
//     { key: 'inProgress', label: 'In Progress', value: data.inProgress || 0, color: colors.inProgress },
//     { key: 'pending', label: 'Pending', value: data.pending || 0, color: colors.pending },
//     { key: 'completed', label: 'Completed', value: data.completed || 0, color: colors.completed },
//     { key: 'closed', label: 'Closed', value: data.closed || 0, color: colors.closed },
//   ];

//   const previousValues = statuses.map(s => s.value);

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800">Work Order Status</h3>
//         <PieChart className="w-5 h-5 text-purple-600" />
//       </div>

//       <div className="flex flex-col md:flex-row items-center gap-8">
//         {/* Pie Chart */}
//         <div className="relative">
//           <svg width="200" height="200" className="transform -rotate-90">
//             <circle
//               cx="100"
//               cy="100"
//               r={radius}
//               fill="none"
//               stroke="#F3F4F6"
//               strokeWidth="40"
//             />
//             {statuses.map((status, index) => (
//               <circle
//                 key={status.key}
//                 cx="100"
//                 cy="100"
//                 r={radius}
//                 fill="none"
//                 stroke={status.color}
//                 strokeWidth="40"
//                 strokeLinecap="round"
//                 strokeDasharray={calculateDashArray(status.value)}
//                 strokeDashoffset={-calculateOffset(index, previousValues)}
//               />
//             ))}
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-800">{total}</div>
//               <div className="text-sm text-gray-600">Total WO</div>
//             </div>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="space-y-4">
//           {statuses.map((status) => (
//             <div key={status.key} className="flex items-center gap-3">
//               <div
//                 className="w-4 h-4 rounded-full"
//                 style={{ backgroundColor: status.color }}
//               />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span className="text-sm font-medium text-gray-700">{status.label}</span>
//                   <span className="text-sm font-bold text-gray-800">{status.value}</span>
//                 </div>
//                 <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
//                   <div
//                     className="h-2 rounded-full"
//                     style={{
//                       width: `${(status.value / total) * 100}%`,
//                       backgroundColor: status.color
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Vendor PO Bar Chart Component - Top 10 Vendors
// const VendorPOChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold text-gray-800">Top 10 Vendors</h3>
//           <BarChart3 className="w-5 h-5 text-green-600" />
//         </div>
//         <div className="text-center py-12">
//           <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-500">No vendor data available</p>
//         </div>
//       </div>
//     );
//   }

//   // Take only top 10 vendors
//   const topVendors = data.slice(0, 10);
//   const maxAmount = Math.max(...topVendors.map(item => item.totalAmount));

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800">Top 10 Vendors by Amount</h3>
//         <BarChart3 className="w-5 h-5 text-green-600" />
//       </div>

//       <div className="space-y-4">
//         {topVendors.map((vendor, index) => {
//           const percentage = maxAmount > 0 ? (vendor.totalAmount / maxAmount) * 100 : 0;
//           const formattedAmount = new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//           }).format(vendor.totalAmount);

//           return (
//             <div key={index} className="space-y-2">
//               <div className="flex justify-between">
//                 <div className="font-medium text-gray-700 truncate max-w-[150px]">
//                   {index + 1}. {vendor.vendorName}
//                 </div>
//                 <div className="text-sm font-bold text-gray-800">
//                   {formattedAmount}
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-16 text-xs text-gray-500 text-right">
//                   {vendor.poCount} POs
//                 </div>
//                 <div className="flex-1">
//                   <div className="relative bg-gray-200 rounded-full h-4">
//                     <div
//                       className="absolute h-4 rounded-full transition-all duration-300"
//                       style={{
//                         width: `${percentage}%`,
//                         background: `linear-gradient(90deg, #3B82F6, #10B981)`
//                       }}
//                     ></div>
//                     <div className="absolute h-4 flex items-center justify-end pr-2 w-full">
//                       <span className="text-xs text-gray-700 font-medium">
//                         {percentage.toFixed(1)}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // Department Work Order Chart Component
// const DepartmentWOChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold text-gray-800">Top Departments</h3>
//           <Building className="w-5 h-5 text-purple-600" />
//         </div>
//         <div className="text-center py-12">
//           <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-500">No department data available</p>
//         </div>
//       </div>
//     );
//   }

//   // Take only top 8 departments
//   const topDepartments = data.slice(0, 8);
//   const maxCount = Math.max(...topDepartments.map(item => item.workOrderCount));

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-bold text-gray-800">Top Departments by Work Orders</h3>
//         <Building className="w-5 h-5 text-purple-600" />
//       </div>

//       <div className="space-y-4">
//         {topDepartments.map((dept, index) => {
//           const percentage = maxCount > 0 ? (dept.workOrderCount / maxCount) * 100 : 0;
//           const formattedCost = new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//           }).format(dept.totalCost);

//           return (
//             <div key={index} className="space-y-2">
//               <div className="flex justify-between">
//                 <div className="font-medium text-gray-700 truncate max-w-[150px]">
//                   {index + 1}. {dept.department}
//                 </div>
//                 <div className="text-sm font-bold text-gray-800">
//                   {dept.workOrderCount} WO
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-20 text-xs text-gray-500 text-right">
//                   {formattedCost}
//                 </div>
//                 <div className="flex-1">
//                   <div className="relative bg-gray-200 rounded-full h-4">
//                     <div
//                       className="absolute h-4 rounded-full transition-all duration-300"
//                       style={{
//                         width: `${percentage}%`,
//                         background: `linear-gradient(90deg, #8B5CF6, #EC4899)`
//                       }}
//                     ></div>
//                     <div className="absolute h-4 flex items-center justify-end pr-2 w-full">
//                       <span className="text-xs text-gray-700 font-medium">
//                         {percentage.toFixed(1)}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // Purchase Order List Component
// const PurchaseOrderList = ({ data, loading, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
//         <p className="font-medium text-gray-700">Loading Purchase Orders...</p>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Found</h3>
//         <p className="text-gray-500">No purchase orders available in the system.</p>
//       </div>
//     );
//   }

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     if (!status) return 'bg-gray-100 text-gray-800';

//     const statusLower = status.toLowerCase();
//     if (statusLower.includes('released')) return 'bg-green-100 text-green-800';
//     if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800';
//     if (statusLower.includes('open')) return 'bg-blue-100 text-blue-800';
//     if (statusLower.includes('closed')) return 'bg-red-100 text-red-800';
//     return 'bg-gray-100 text-gray-800';
//   };

//   // Filter data
//   const filteredData = data.filter(po => {
//     // Search filter
//     const matchesSearch = !searchTerm || 
//       (po.No && po.No.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (po.VendorName && po.VendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (po.vendorName && po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     // Status filter
//     const matchesStatus = filterStatus === 'all' || 
//       (po.Status && po.Status.toLowerCase() === filterStatus.toLowerCase()) ||
//       (po.status && po.status.toLowerCase() === filterStatus.toLowerCase());
    
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="bg-white rounded-xl shadow">
//       <div className="p-6 border-b">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h4 className="text-xl font-bold text-gray-800">Purchase Orders</h4>
//             <p className="text-sm text-gray-600 mt-1">
//               Showing {filteredData.length} of {data.length} purchase orders
//             </p>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search Input */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search PO or Vendor..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
//               />
//             </div>
            
//             {/* Status Filter */}
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="all">All Status</option>
//               <option value="open">Open</option>
//               <option value="pending approval">Pending Approval</option>
//               <option value="released">Released</option>
//               <option value="short closed">Short Closed</option>
//               <option value="closed">Closed</option>
//             </select>
            
//             <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="p-4 text-left font-semibold text-gray-700">PO No.</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Vendor</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Date</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Status</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredData.map((po, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="p-4">
//                   <div className="font-mono font-bold text-gray-800">
//                     {po.No || po.id || po.number || po.PO_No || `PO-${index + 1}`}
//                   </div>
//                 </td>
//                 <td className="p-4">
//                   <div className="font-medium text-gray-700">
//                     {po.VendorName || po.vendorName || po.vendor || po.buyFromVendorName || 'Unknown Vendor'}
//                   </div>
//                   {po.VendorNo && (
//                     <div className="text-xs text-gray-500 mt-1">
//                       Vendor No: {po.VendorNo}
//                     </div>
//                   )}
//                 </td>
//                 <td className="p-4 text-gray-700">
//                   {formatDate(po.OrderDate || po.orderDate || po.date || po.documentDate)}
//                 </td>
//                 <td className="p-4 font-bold text-gray-800">
//                   {formatCurrency(po.TotalAmount || po.totalAmount || po.amount || 0)}
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(po.Status || po.status)}`}>
//                     {po.Status || po.status || 'Open'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button 
//                       title="View Details"
//                       className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//                     <button 
//                       title="Edit"
//                       className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
//                     >
//                       <FileText className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {filteredData.length === 0 && (
//         <div className="text-center py-12">
//           <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Found</h3>
//           <p className="text-gray-500">Try changing your search or filter criteria.</p>
//         </div>
//       )}

//       {filteredData.length > 10 && (
//         <div className="p-4 border-t">
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-gray-600">
//               Showing 1-10 of {filteredData.length} purchase orders
//             </div>
//             <div className="flex gap-2">
//               <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
//                 Previous
//               </button>
//               <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Work Order List Component
// const WorkOrderList = ({ data, loading, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
//         <p className="font-medium text-gray-700">Loading Work Orders...</p>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Orders Found</h3>
//         <p className="text-gray-500">No work orders available in the system.</p>
//       </div>
//     );
//   }

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     if (!status) return 'bg-gray-100 text-gray-800';

//     const statusLower = status.toLowerCase();
//     if (statusLower.includes('completed')) return 'bg-green-100 text-green-800';
//     if (statusLower.includes('progress')) return 'bg-purple-100 text-purple-800';
//     if (statusLower.includes('pending') || statusLower.includes('hold')) return 'bg-yellow-100 text-yellow-800';
//     if (statusLower.includes('open')) return 'bg-blue-100 text-blue-800';
//     if (statusLower.includes('closed') || statusLower.includes('cancelled')) return 'bg-gray-100 text-gray-800';
//     return 'bg-gray-100 text-gray-800';
//   };

//   const getPriorityBadgeClass = (priority) => {
//     if (!priority) return 'bg-gray-100 text-gray-800';

//     const priorityLower = priority.toLowerCase();
//     if (priorityLower.includes('high')) return 'bg-red-100 text-red-800';
//     if (priorityLower.includes('medium')) return 'bg-yellow-100 text-yellow-800';
//     if (priorityLower.includes('low')) return 'bg-green-100 text-green-800';
//     return 'bg-gray-100 text-gray-800';
//   };

//   // Filter data
//   const filteredData = data.filter(wo => {
//     // Search filter
//     const matchesSearch = !searchTerm || 
//       (wo.No && wo.No.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (wo.Description && wo.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (wo.description && wo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (wo.Department && wo.Department.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     // Status filter
//     const matchesStatus = filterStatus === 'all' || 
//       (wo.Status && wo.Status.toLowerCase() === filterStatus.toLowerCase()) ||
//       (wo.status && wo.status.toLowerCase() === filterStatus.toLowerCase());
    
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="bg-white rounded-xl shadow">
//       <div className="p-6 border-b">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h4 className="text-xl font-bold text-gray-800">Work Orders</h4>
//             <p className="text-sm text-gray-600 mt-1">
//               Showing {filteredData.length} of {data.length} work orders
//             </p>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search Input */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search Work Order or Description..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
//               />
//             </div>
            
//             {/* Status Filter */}
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="all">All Status</option>
//               <option value="open">Open</option>
//               <option value="in progress">In Progress</option>
//               <option value="pending">Pending</option>
//               <option value="completed">Completed</option>
//               <option value="closed">Closed</option>
//             </select>
            
//             <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="p-4 text-left font-semibold text-gray-700">WO No.</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Description</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Department</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Priority</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Status</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Due Date</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Cost</th>
//               <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredData.map((wo, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="p-4">
//                   <div className="font-mono font-bold text-gray-800">
//                     {wo.No || wo.id || wo.number || wo.workOrderNo || `WO-${index + 1}`}
//                   </div>
//                 </td>
//                 <td className="p-4">
//                   <div className="font-medium text-gray-700">
//                     {wo.Description || wo.description || 'No Description'}
//                   </div>
//                   {wo.Type && (
//                     <div className="text-xs text-gray-500 mt-1">
//                       Type: {wo.Type}
//                     </div>
//                   )}
//                 </td>
//                 <td className="p-4">
//                   <div className="font-medium text-gray-700">
//                     {wo.Department || wo.department || 'General'}
//                   </div>
//                   {wo.AssignedTo && (
//                     <div className="text-xs text-gray-500 mt-1">
//                       Assigned: {wo.AssignedTo}
//                     </div>
//                   )}
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityBadgeClass(wo.Priority || wo.priority)}`}>
//                     {wo.Priority || wo.priority || 'Medium'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(wo.Status || wo.status)}`}>
//                     {wo.Status || wo.status || 'Open'}
//                   </span>
//                 </td>
//                 <td className="p-4 text-gray-700">
//                   {formatDate(wo.DueDate || wo.dueDate || wo.endDate)}
//                 </td>
//                 <td className="p-4 font-bold text-gray-800">
//                   {formatCurrency(wo.Cost || wo.cost || wo.totalCost || 0)}
//                 </td>
//                 <td className="p-4">
//                   <div className="flex gap-2">
//                     <button 
//                       title="View Details"
//                       className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//                     <button 
//                       title="Edit"
//                       className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
//                     >
//                       <FileText className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {filteredData.length === 0 && (
//         <div className="text-center py-12">
//           <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Orders Found</h3>
//           <p className="text-gray-500">Try changing your search or filter criteria.</p>
//         </div>
//       )}

//       {filteredData.length > 10 && (
//         <div className="p-4 border-t">
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-gray-600">
//               Showing 1-10 of {filteredData.length} work orders
//             </div>
//             <div className="flex gap-2">
//               <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
//                 Previous
//               </button>
//               <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Connection Status Indicator
// const ConnectionStatus = ({ source }) => {
//   const isConnected = source === 'business_central';

//   return (
//     <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//       {isConnected ? (
//         <>
//           <Wifi className="w-3 h-3" />
//           <span>Live Data</span>
//         </>
//       ) : (
//         <>
//           <WifiOff className="w-3 h-3" />
//           <span>Demo Data</span>
//         </>
//       )}
//     </div>
//   );
// };

// // Format currency helper function
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0
//   }).format(amount || 0);
// };

// // Create mock data functions
// function createMockPOList() {
//   return [
//     {
//       No: 'PO-1001',
//       VendorName: 'ABC Suppliers',
//       VendorNo: 'VEND-001',
//       OrderDate: '2024-01-15',
//       TotalAmount: 125000,
//       Status: 'Released'
//     },
//     {
//       No: 'PO-1002',
//       VendorName: 'XYZ Corporation',
//       VendorNo: 'VEND-002',
//       OrderDate: '2024-01-18',
//       TotalAmount: 98000,
//       Status: 'Pending Approval'
//     },
//     // ... more mock data
//   ];
// }

// function createMockWOList() {
//   return [
//     {
//       No: 'WO-2024-001',
//       Description: 'Machine Preventive Maintenance',
//       Type: 'Maintenance',
//       Priority: 'High',
//       StartDate: '2024-06-28',
//       DueDate: '2024-07-05',
//       Status: 'In Progress',
//       AssignedTo: 'John Smith',
//       Department: 'Maintenance',
//       EstimatedHours: 24,
//       ActualHours: 18,
//       Cost: 12000
//     },
//     {
//       No: 'WO-2024-002',
//       Description: 'Quality Inspection Batch #45',
//       Type: 'Inspection',
//       Priority: 'Medium',
//       StartDate: '2024-06-25',
//       DueDate: '2024-06-30',
//       Status: 'Completed',
//       AssignedTo: 'Sarah Johnson',
//       Department: 'Quality Control',
//       EstimatedHours: 16,
//       ActualHours: 14,
//       Cost: 8500
//     },
//     // ... more mock data
//   ];
// }

// export default function BusinessCentral() {
//   const router = useRouter()
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [poStats, setPoStats] = useState(null)
//   const [woStats, setWoStats] = useState(null)
//   const [poList, setPoList] = useState([])
//   const [woList, setWoList] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [activeTab, setActiveTab] = useState('overview')
//   const [lastUpdated, setLastUpdated] = useState(null)
//   const [dataSource, setDataSource] = useState('loading')
//   const [searchTermPO, setSearchTermPO] = useState('')
//   const [filterStatusPO, setFilterStatusPO] = useState('all')
//   const [searchTermWO, setSearchTermWO] = useState('')
//   const [filterStatusWO, setFilterStatusWO] = useState('all')

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       console.log('🔄 Fetching data from APIs...')
      
//       // Fetch both PO and WO data in parallel
//       const [poData, woData] = await Promise.all([
//         getPOStatistics(),
//         getWorkOrderStatistics()
//       ])

//       console.log('📊 PO Data:', poData._dataType, poData._source)
//       console.log('📊 WO Data:', woData._dataType, woData._source)

//       // Process PO data
//       setPoStats(poData);
//       setPoList(poData.rawData || []);
      
//       // Process WO data
//       setWoStats(woData);
//       setWoList(woData.rawData || []);
      
//       // Set data source (use PO as primary indicator)
//       setDataSource(poData._source);
//       setLastUpdated(new Date());

//     } catch (error) {
//       console.error('❌ Error loading data:', error)
//       // Use mock data as fallback
//       const mockPOData = createMockPOList();
//       const mockWOData = createMockWOList();
      
//       setPoStats({
//         statusSummary: { open: 45, pendingApproval: 23, released: 120, shortClosed: 12, total: 200 },
//         vendorWiseData: [],
//         summary: { totalPOs: 200, totalAmount: 2850000, avgAmount: 14250 },
//         _source: 'mock_fallback'
//       });
//       setPoList(mockPOData);
      
//       setWoStats({
//         statusSummary: { open: 40, inProgress: 35, pending: 25, completed: 35, closed: 15, total: 150 },
//         departmentWiseData: [],
//         summary: { totalWorkOrders: 150, totalCost: 1250000, avgCost: 8333 },
//         _source: 'mock_fallback'
//       });
//       setWoList(mockWOData);
      
//       setDataSource('mock_fallback');
//       setLastUpdated(new Date());
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchData();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 transition-colors duration-300">
//       {/* Header */}
//       <header className="bg-white shadow-sm transition-colors duration-300">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="md:hidden p-2 rounded-lg hover:bg-gray-100"
//               >
//                 <Menu className="w-5 h-5" />
//               </button>

//               <button
//                 onClick={() => router.push('/')}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>

//               <div className="flex items-center gap-3">
//                 <img
//                   src="/Logos/Business central logo.jpg"
//                   alt="Business Central Logo"
//                   className="w-16 h-16 object-contain"
//                 />
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-800">Business Central</h1>
//                   <p className="text-sm text-gray-600">Purchase & Work Order Analytics</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <ConnectionStatus source={dataSource} />
//               <ThemeToggle />
//               <button
//                 onClick={handleRefresh}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 disabled={loading}
//               >
//                 <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {mobileMenuOpen && (
//             <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
//               <div className="grid grid-cols-4 gap-2">
//                 <button
//                   onClick={() => setActiveTab('overview')}
//                   className={`p-3 rounded-lg text-center ${activeTab === 'overview' ? 'bg-green-100' : 'bg-gray-100'}`}
//                 >
//                   <div className="text-green-600 font-medium text-sm">Overview</div>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('po')}
//                   className={`p-3 rounded-lg text-center ${activeTab === 'po' ? 'bg-green-100' : 'bg-gray-100'}`}
//                 >
//                   <div className="text-blue-600 font-medium text-sm">PO</div>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('wo')}
//                   className={`p-3 rounded-lg text-center ${activeTab === 'wo' ? 'bg-green-100' : 'bg-gray-100'}`}
//                 >
//                   <div className="text-purple-600 font-medium text-sm">WO</div>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('analytics')}
//                   className={`p-3 rounded-lg text-center ${activeTab === 'analytics' ? 'bg-green-100' : 'bg-gray-100'}`}
//                 >
//                   <div className="text-orange-600 font-medium text-sm">Analytics</div>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Desktop Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 mt-4">
//         <div className="hidden md:flex space-x-2">
//           <button
//             onClick={() => setActiveTab('overview')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//           >
//             📊 Overview
//           </button>
//           <button
//             onClick={() => setActiveTab('po')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'po' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//           >
//             🛒 Purchase Orders
//           </button>
//           <button
//             onClick={() => setActiveTab('wo')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'wo' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//           >
//             🔧 Work Orders
//           </button>
//           <button
//             onClick={() => setActiveTab('analytics')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'analytics' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//           >
//             📈 Analytics
//           </button>
//         </div>

//         {/* Status Bar */}
//         <div className="mt-3 flex items-center justify-between">
//           <div className="text-sm text-gray-500 flex items-center gap-2">
//             <Clock className="w-4 h-4" />
//             {lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}` : 'Loading...'}
//           </div>
//           <div className="text-xs text-gray-500">
//             {dataSource === 'business_central' ? '✅ Connected to Business Central' : '⚠️ Using demonstration data'}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {loading && (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
//             <p className="font-medium text-gray-700">Loading Business Central Data...</p>
//             <p className="text-sm text-gray-500 mt-2">
//               {dataSource === 'business_central'
//                 ? 'Connecting to Dynamics 365 Business Central API'
//                 : 'Loading demonstration data'}
//             </p>
//           </div>
//         )}

//         {!loading && activeTab === 'overview' && (
//           <>
//             {/* Overview Content */}
//             <div className="space-y-8">
//               {/* Dashboard Title */}
//               <div className="bg-white rounded-xl shadow p-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Central Dashboard</h2>
                
//                 {/* Quick Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                   {/* PO Stats */}
//                   <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-3xl font-bold text-blue-600">{poStats?.statusSummary?.total || 0}</div>
//                         <div className="text-lg font-medium text-gray-700 mt-2">Purchase Orders</div>
//                         <div className="text-sm text-gray-500">Total active POs</div>
//                       </div>
//                       <ShoppingCart className="w-10 h-10 text-blue-400" />
//                     </div>
//                     <div className="mt-4 pt-4 border-t">
//                       <div className="text-sm text-gray-600">
//                         <span className="font-medium text-blue-600">{poStats?.statusSummary?.open || 0} Open</span> • 
//                         <span className="mx-2">•</span>
//                         <span className="font-medium text-green-600">{poStats?.statusSummary?.released || 0} Released</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* WO Stats */}
//                   <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-3xl font-bold text-purple-600">{woStats?.statusSummary?.total || 0}</div>
//                         <div className="text-lg font-medium text-gray-700 mt-2">Work Orders</div>
//                         <div className="text-sm text-gray-500">Total active WOs</div>
//                       </div>
//                       <ClipboardCheck className="w-10 h-10 text-purple-400" />
//                     </div>
//                     <div className="mt-4 pt-4 border-t">
//                       <div className="text-sm text-gray-600">
//                         <span className="font-medium text-purple-600">{woStats?.statusSummary?.inProgress || 0} In Progress</span> • 
//                         <span className="mx-2">•</span>
//                         <span className="font-medium text-green-600">{woStats?.statusSummary?.completed || 0} Completed</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Financial Stats */}
//                   <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-2xl font-bold text-gray-800">
//                           {formatCurrency(
//                             (poStats?.summary?.totalAmount || 0) + 
//                             (woStats?.summary?.totalCost || 0)
//                           )}
//                         </div>
//                         <div className="text-lg font-medium text-gray-700 mt-2">Total Value</div>
//                         <div className="text-sm text-gray-500">PO + WO combined</div>
//                       </div>
//                       <DollarSign className="w-10 h-10 text-green-400" />
//                     </div>
//                     <div className="mt-4 pt-4 border-t">
//                       <div className="text-sm text-gray-600">
//                         <span className="font-medium">PO: {formatCurrency(poStats?.summary?.totalAmount || 0)}</span>
//                         <br />
//                         <span className="font-medium">WO: {formatCurrency(woStats?.summary?.totalCost || 0)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Activity Stats */}
//                   <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-3xl font-bold text-orange-600">
//                           {(poStats?.vendorWiseData?.length || 0) + (woStats?.departmentWiseData?.length || 0)}
//                         </div>
//                         <div className="text-lg font-medium text-gray-700 mt-2">Active Entities</div>
//                         <div className="text-sm text-gray-500">Vendors + Departments</div>
//                       </div>
//                       <Users className="w-10 h-10 text-orange-400" />
//                     </div>
//                     <div className="mt-4 pt-4 border-t">
//                       <div className="text-sm text-gray-600">
//                         <span className="font-medium text-blue-600">{poStats?.vendorWiseData?.length || 0} Vendors</span> • 
//                         <span className="mx-2">•</span>
//                         <span className="font-medium text-purple-600">{woStats?.departmentWiseData?.length || 0} Departments</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <button
//                     onClick={() => setActiveTab('po')}
//                     className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-center transition-colors"
//                   >
//                     <div className="text-blue-600 font-medium flex items-center justify-center gap-2">
//                       <ShoppingCart className="w-5 h-5" />
//                       View POs
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">Purchase Orders</div>
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('wo')}
//                     className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 text-center transition-colors"
//                   >
//                     <div className="text-purple-600 font-medium flex items-center justify-center gap-2">
//                       <ClipboardCheck className="w-5 h-5" />
//                       View WOs
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">Work Orders</div>
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('analytics')}
//                     className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-center transition-colors"
//                   >
//                     <div className="text-green-600 font-medium flex items-center justify-center gap-2">
//                       <BarChart3 className="w-5 h-5" />
//                       Analytics
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">Charts & Reports</div>
//                   </button>
//                   <button
//                     onClick={handleRefresh}
//                     className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-center transition-colors"
//                   >
//                     <div className="text-gray-600 font-medium flex items-center justify-center gap-2">
//                       <RefreshCw className="w-5 h-5" />
//                       Refresh
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">Update Data</div>
//                   </button>
//                 </div>
//               </div>

//               {/* Status Overview Cards */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* PO Status Card */}
//                 <div className="bg-white rounded-xl shadow p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-lg font-bold text-gray-800">Purchase Order Status</h3>
//                     <div className="text-sm text-blue-600 font-medium">
//                       Total: {poStats?.statusSummary?.total || 0}
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-4 gap-4">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-blue-600">{poStats?.statusSummary?.open || 0}</div>
//                       <div className="text-sm text-gray-600">Open</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-yellow-600">{poStats?.statusSummary?.pendingApproval || 0}</div>
//                       <div className="text-sm text-gray-600">Pending</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-green-600">{poStats?.statusSummary?.released || 0}</div>
//                       <div className="text-sm text-gray-600">Released</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-red-600">{poStats?.statusSummary?.shortClosed || 0}</div>
//                       <div className="text-sm text-gray-600">Closed</div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6">
//                     <button
//                       onClick={() => setActiveTab('po')}
//                       className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
//                     >
//                       View All Purchase Orders →
//                     </button>
//                   </div>
//                 </div>

//                 {/* WO Status Card */}
//                 <div className="bg-white rounded-xl shadow p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-lg font-bold text-gray-800">Work Order Status</h3>
//                     <div className="text-sm text-purple-600 font-medium">
//                       Total: {woStats?.statusSummary?.total || 0}
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-5 gap-3">
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-blue-600">{woStats?.statusSummary?.open || 0}</div>
//                       <div className="text-xs text-gray-600">Open</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-purple-600">{woStats?.statusSummary?.inProgress || 0}</div>
//                       <div className="text-xs text-gray-600">Progress</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-yellow-600">{woStats?.statusSummary?.pending || 0}</div>
//                       <div className="text-xs text-gray-600">Pending</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-green-600">{woStats?.statusSummary?.completed || 0}</div>
//                       <div className="text-xs text-gray-600">Completed</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-gray-600">{woStats?.statusSummary?.closed || 0}</div>
//                       <div className="text-xs text-gray-600">Closed</div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6">
//                     <button
//                       onClick={() => setActiveTab('wo')}
//                       className="w-full py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium"
//                     >
//                       View All Work Orders →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {!loading && activeTab === 'po' && poStats && (
//           <>
//             {/* Purchase Orders Tab Content */}
//             <div className="space-y-8">
//               {/* PO Title Section */}
//               <div className="bg-white rounded-xl shadow p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Purchase Orders</h2>
//                     <p className="text-gray-600 mt-1">Manage and track all purchase orders</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-3xl font-bold text-blue-600">{poStats.statusSummary?.total || 0}</div>
//                     <div className="text-sm text-gray-600">Total POs</div>
//                   </div>
//                 </div>

//                 {/* PO Stats Cards */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                   <div className="p-4 bg-blue-50 rounded-lg">
//                     <div className="text-2xl font-bold text-blue-600">{poStats.statusSummary?.open || 0}</div>
//                     <div className="text-sm text-gray-600">Open</div>
//                   </div>
//                   <div className="p-4 bg-yellow-50 rounded-lg">
//                     <div className="text-2xl font-bold text-yellow-600">{poStats.statusSummary?.pendingApproval || 0}</div>
//                     <div className="text-sm text-gray-600">Pending Approval</div>
//                   </div>
//                   <div className="p-4 bg-green-50 rounded-lg">
//                     <div className="text-2xl font-bold text-green-600">{poStats.statusSummary?.released || 0}</div>
//                     <div className="text-sm text-gray-600">Released</div>
//                   </div>
//                   <div className="p-4 bg-red-50 rounded-lg">
//                     <div className="text-2xl font-bold text-red-600">{poStats.statusSummary?.shortClosed || 0}</div>
//                     <div className="text-sm text-gray-600">Short Closed</div>
//                   </div>
//                 </div>

//                 {/* Financial Summary */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="p-4 border rounded-lg">
//                     <div className="text-lg font-bold text-gray-800">
//                       {formatCurrency(poStats.summary?.totalAmount || 0)}
//                     </div>
//                     <div className="text-sm text-gray-600">Total PO Value</div>
//                   </div>
//                   <div className="p-4 border rounded-lg">
//                     <div className="text-lg font-bold text-gray-800">
//                       {formatCurrency(poStats.summary?.avgAmount || 0)}
//                     </div>
//                     <div className="text-sm text-gray-600">Average PO Value</div>
//                   </div>
//                   <div className="p-4 border rounded-lg">
//                     <div className="text-lg font-bold text-gray-800">
//                       {poStats.vendorWiseData?.length || 0}
//                     </div>
//                     <div className="text-sm text-gray-600">Active Vendors</div>
//                   </div>
//                 </div>
//               </div>

//               {/* PO Charts */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <POStatusPieChart data={poStats.statusSummary || {}} />
//                 <VendorPOChart data={poStats.vendorWiseData || []} />
//               </div>

//               {/* PO List */}
//               <PurchaseOrderList 
//                 data={poList} 
//                 loading={loading}
//                 searchTerm={searchTermPO}
//                 setSearchTerm={setSearchTermPO}
//                 filterStatus={filterStatusPO}
//                 setFilterStatus={setFilterStatusPO}
//               />
//             </div>
//           </>
//         )}

//         {!loading && activeTab === 'wo' && woStats && (
//           <>
//             {/* Work Orders Tab Content */}
//             <div className="space-y-8">
//               {/* WO Title Section */}
//               <div className="bg-white rounded-xl shadow p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Work Orders</h2>
//                     <p className="text-gray-600 mt-1">Manage and track all work orders</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-3xl font-bold text-purple-600">{woStats.statusSummary?.total || 0}</div>
//                     <div className="text-sm text-gray-600">Total WOs</div>
//                   </div>
//                 </div>

//                 {/* WO Stats Cards */}
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
//                   <div className="p-4 bg-blue-50 rounded-lg">
//                     <div className="text-xl font-bold text-blue-600">{woStats.statusSummary?.open || 0}</div>
//                     <div className="text-sm text-gray-600">Open</div>
//                   </div>
//                   <div className="p-4 bg-purple-50 rounded-lg">
//                     <div className="text-xl font-bold text-purple-600">{woStats.statusSummary?.inProgress || 0}</div>
//                     <div className="text-sm text-gray-600">In Progress</div>
//                   </div>
//                   <div className="p-4 bg-yellow-50 rounded-lg">
//                     <div className="text-xl font-bold text-yellow-600">{woStats.statusSummary?.pending || 0}</div>
//                     <div className="text-sm text-gray-600">Pending</div>
//                   </div>
//                   <div className="p-4 bg-green-50 rounded-lg">
//                     <div className="text-xl font-bold text-green-600">{woStats.statusSummary?.completed || 0}</div>
//                     <div className="text-sm text-gray-600">Completed</div>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <div className="text-xl font-bold text-gray-600">{woStats.statusSummary?.closed || 0}</div>
//                     <div className="text-sm text-gray-600">Closed</div>
//                   </div>
//                 </div>

//                 {/* Work Order Summary */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="p-4 border rounded-lg">
//                     <div className="text-lg font-bold text-gray-800">
//                       {formatCurrency(woStats.summary?.totalCost || 0)}
//                     </div>
//                     <div className="text-sm text-gray-600">Total WO Cost</div>
//                   </div>
//                   <div className="p-4 border rounded-lg">
//                     <div className="text-lg font-bold text-gray-800">
//                       {woStats.summary?.totalEstimatedHours || 0} hrs
//                     </div>
//                     <div className="text-sm text-gray-600">Estimated Hours</div>
//                   </div>
//                   <div className="p-4 border rounded-lg">
//                     <div className="text-lg font-bold text-gray-800">
//                       {woStats.departmentWiseData?.length || 0}
//                     </div>
//                     <div className="text-sm text-gray-600">Departments</div>
//                   </div>
//                 </div>
//               </div>

//               {/* WO Charts */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <WOStatusPieChart data={woStats.statusSummary || {}} />
//                 <DepartmentWOChart data={woStats.departmentWiseData || []} />
//               </div>

//               {/* WO List */}
//               <WorkOrderList 
//                 data={woList} 
//                 loading={loading}
//                 searchTerm={searchTermWO}
//                 setSearchTerm={setSearchTermWO}
//                 filterStatus={filterStatusWO}
//                 setFilterStatus={setFilterStatusWO}
//               />
//             </div>
//           </>
//         )}

//         {!loading && activeTab === 'analytics' && (
//           <>
//             {/* Analytics Tab Content */}
//             <div className="space-y-8">
//               <div className="bg-white rounded-xl shadow p-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Business Central Analytics</h2>
                
//                 {/* Combined Charts Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//                   <POStatusPieChart data={poStats?.statusSummary || {}} />
//                   <WOStatusPieChart data={woStats?.statusSummary || {}} />
//                 </div>
                
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   <VendorPOChart data={poStats?.vendorWiseData || []} />
//                   <DepartmentWOChart data={woStats?.departmentWiseData || []} />
//                 </div>
                
//                 {/* Summary Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//                   <div className="p-4 bg-blue-50 rounded-lg">
//                     <div className="text-2xl font-bold text-blue-600">{poStats?.statusSummary?.total || 0}</div>
//                     <div className="text-sm text-gray-600">Total POs</div>
//                   </div>
//                   <div className="p-4 bg-purple-50 rounded-lg">
//                     <div className="text-2xl font-bold text-purple-600">{woStats?.statusSummary?.total || 0}</div>
//                     <div className="text-sm text-gray-600">Total WOs</div>
//                   </div>
//                   <div className="p-4 bg-green-50 rounded-lg">
//                     <div className="text-2xl font-bold text-green-600">
//                       {formatCurrency(
//                         (poStats?.summary?.totalAmount || 0) + 
//                         (woStats?.summary?.totalCost || 0)
//                       )}
//                     </div>
//                     <div className="text-sm text-gray-600">Combined Value</div>
//                   </div>
//                   <div className="p-4 bg-orange-50 rounded-lg">
//                     <div className="text-2xl font-bold text-orange-600">
//                       {(poStats?.vendorWiseData?.length || 0) + (woStats?.departmentWiseData?.length || 0)}
//                     </div>
//                     <div className="text-sm text-gray-600">Total Entities</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-gray-200 bg-white py-6">
//         <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
//           <p>Business Central • Dynamics 365 • Purchase & Work Order Analytics • API Integration</p>
//           <p className="mt-1">Company: AL SOFTWEB PVT LTD UAT • Environment: SANDBOX-VALIDATIONS-26-11-2024</p>
//           <p className="mt-1">Data Source: {dataSource === 'business_central' ? 'Live Business Central API' : 'Demonstration Data'}</p>
//           <p className="mt-1">
//             Purchase Orders: {poStats?.statusSummary?.total || 0} • 
//             Work Orders: {woStats?.statusSummary?.total || 0}
//           </p>
//         </div>
//       </footer>
//     </div>
//   )
// }
'use client'

import {
  ArrowLeft,
  Plus,
  Download,
  Menu,
  PieChart,
  BarChart3,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  Eye,
  Wifi,
  WifiOff,
  Database,
  Search,
  Briefcase,
  Tool,
  Settings,
  Calendar,
  Hourglass,
  Zap,
  HardHat,
  ClipboardCheck,
  Building
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/src/components/ThemeToggle'
import { useState, useEffect } from 'react'
import { getPOStatistics, getWorkOrderStatistics } from '@/src/lib/businessCentralApi'

// Purchase Order Status Pie Chart Component
const POStatusPieChart = ({ data }) => {
  const colors = {
    open: '#3B82F6', // Blue
    pendingApproval: '#F59E0B', // Yellow
    released: '#10B981', // Green
    shortClosed: '#EF4444', // Red
  };

  const total = data.total || 1;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const calculateDashArray = (value) => {
    const percentage = (value / total) * 100;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  };

  const calculateOffset = (index, previousValues) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (previousValues[i] / total) * circumference;
    }
    return offset;
  };

  const statuses = [
    { key: 'open', label: 'Open', value: data.open || 0, color: colors.open },
    { key: 'pendingApproval', label: 'Pending Approval', value: data.pendingApproval || 0, color: colors.pendingApproval },
    { key: 'released', label: 'Released', value: data.released || 0, color: colors.released },
    { key: 'shortClosed', label: 'Short Closed', value: data.shortClosed || 0, color: colors.shortClosed },
  ];

  const previousValues = statuses.map(s => s.value);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">PO Status Distribution</h3>
        <PieChart className="w-5 h-5 text-blue-600" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Pie Chart */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="40"
            />
            {statuses.map((status, index) => (
              <circle
                key={status.key}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={status.color}
                strokeWidth="40"
                strokeLinecap="round"
                strokeDasharray={calculateDashArray(status.value)}
                strokeDashoffset={-calculateOffset(index, previousValues)}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">Total PO</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.key} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{status.label}</span>
                  <span className="text-sm font-bold text-gray-800">{status.value}</span>
                </div>
                <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(status.value / total) * 100}%`,
                      backgroundColor: status.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Work Order Status Pie Chart Component
const WOStatusPieChart = ({ data }) => {
  // Work Order ke liye bhi same 4 categories: Open, Pending Approval, Released, Short Closed
  const colors = {
    open: '#3B82F6', // Blue
    pendingApproval: '#F59E0B', // Yellow
    released: '#10B981', // Green
    shortClosed: '#EF4444', // Red
  };

  const total = data.total || 1;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const calculateDashArray = (value) => {
    const percentage = (value / total) * 100;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  };

  const calculateOffset = (index, previousValues) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (previousValues[i] / total) * circumference;
    }
    return offset;
  };

  const statuses = [
    { key: 'open', label: 'Open', value: data.open || 0, color: colors.open },
    { key: 'pendingApproval', label: 'Pending Approval', value: data.pendingApproval || 0, color: colors.pendingApproval },
    { key: 'released', label: 'Released', value: data.released || 0, color: colors.released },
    { key: 'shortClosed', label: 'Short Closed', value: data.shortClosed || 0, color: colors.shortClosed },
  ];

  const previousValues = statuses.map(s => s.value);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Work Order Status</h3>
        <PieChart className="w-5 h-5 text-purple-600" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Pie Chart */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="40"
            />
            {statuses.map((status, index) => (
              <circle
                key={status.key}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={status.color}
                strokeWidth="40"
                strokeLinecap="round"
                strokeDasharray={calculateDashArray(status.value)}
                strokeDashoffset={-calculateOffset(index, previousValues)}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">Total WO</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.key} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{status.label}</span>
                  <span className="text-sm font-bold text-gray-800">{status.value}</span>
                </div>
                <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(status.value / total) * 100}%`,
                      backgroundColor: status.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Vendor PO Bar Chart Component - Top 10 Vendors
// VendorPOChart component update करें:

const VendorPOChart = ({ data }) => {
  console.log('📊 VendorPOChart received data:', data);
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Top Vendors</h3>
          <BarChart3 className="w-5 h-5 text-green-600" />
        </div>
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No vendor data available</p>
          <p className="text-sm text-gray-400 mt-2">
            Vendor data will appear here when purchase orders have vendor information
          </p>
        </div>
      </div>
    );
  }

  // Take only top 10 vendors
  const topVendors = data.slice(0, 10);
  
  // Check if we have valid data
  const validVendors = topVendors.filter(v => 
    v.vendorName && 
    v.vendorName !== 'Unknown Vendor' && 
    v.totalAmount > 0
  );
  
  if (validVendors.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Top Vendors</h3>
          <BarChart3 className="w-5 h-5 text-green-600" />
        </div>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Vendor information not found in purchase orders</p>
          <p className="text-sm text-gray-400 mt-2">
            Please check if vendor data is available in Business Central
          </p>
        </div>
      </div>
    );
  }
  
  const maxAmount = Math.max(...validVendors.map(item => item.totalAmount || 0));

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Top Vendors by Purchase Amount</h3>
        <BarChart3 className="w-5 h-5 text-green-600" />
      </div>

      <div className="space-y-4">
        {validVendors.map((vendor, index) => {
          const percentage = maxAmount > 0 ? ((vendor.totalAmount || 0) / maxAmount) * 100 : 0;
          const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(vendor.totalAmount || 0);

          return (
            <div key={vendor.vendorName || index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="font-medium text-gray-700 truncate max-w-[180px]">
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  {vendor.vendorName || 'Unnamed Vendor'}
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {formattedAmount}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-gray-500 text-right">
                  {vendor.poCount || vendor.count || 0} Purchase Order{vendor.poCount !== 1 ? 's' : ''}
                </div>
                <div className="flex-1">
                  <div className="relative bg-gray-200 rounded-full h-3">
                    <div
                      className="absolute h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, #3B82F6, #10B981)`
                      }}
                    ></div>
                    <div className="absolute h-3 flex items-center justify-end pr-2 w-full">
                      <span className="text-xs text-gray-700 font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {validVendors.length < data.length && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Showing {validVendors.length} of {data.length} vendors with valid data
          </p>
        </div>
      )}
    </div>
  );
};

// Vendor Work Order Chart Component
const VendorWOChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Top Vendors (Work Orders)</h3>
          <Users className="w-5 h-5 text-purple-600" />
        </div>
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No vendor data available</p>
        </div>
      </div>
    );
  }

  // Take only top 8 vendors
  const topVendors = data.slice(0, 8);
  const maxAmount = Math.max(...topVendors.map(item => item.totalAmount));

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Top Vendors by Work Orders</h3>
        <Users className="w-5 h-5 text-purple-600" />
      </div>

      <div className="space-y-4">
        {topVendors.map((vendor, index) => {
          const percentage = maxAmount > 0 ? (vendor.totalAmount / maxAmount) * 100 : 0;
          const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(vendor.totalAmount);

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <div className="font-medium text-gray-700 truncate max-w-[150px]">
                  {index + 1}. {vendor.vendorName}
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {vendor.woCount || vendor.count} WO
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-gray-500 text-right">
                  {formattedAmount}
                </div>
                <div className="flex-1">
                  <div className="relative bg-gray-200 rounded-full h-4">
                    <div
                      className="absolute h-4 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, #8B5CF6, #EC4899)`
                      }}
                    ></div>
                    <div className="absolute h-4 flex items-center justify-end pr-2 w-full">
                      <span className="text-xs text-gray-700 font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Purchase Order List Component
const PurchaseOrderList = ({ data, loading, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
        <p className="font-medium text-gray-700">Loading Purchase Orders...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Found</h3>
        <p className="text-gray-500">No purchase orders available in the system.</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // FIXED DATE FORMAT FUNCTION
  const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A' || dateString === 'Invalid Date') {
    return 'N/A';
  }
  
  try {
    // Business Central format: "2024-01-15" या "2024-01-15T00:00:00Z"
    if (typeof dateString === 'string') {
      // Remove time part if exists
      const dateOnly = dateString.split('T')[0];
      
      // Check if already in YYYY-MM-DD format
      if (dateOnly.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateOnly.split('-');
        const date = new Date(year, parseInt(month) - 1, day);
        
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
      }
      
      // Try parsing any date format
      const parsedDate = new Date(dateOnly);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      
      // Try DD-MM-YYYY format
      const dmyMatch = dateOnly.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (dmyMatch) {
        const [_, day, month, year] = dmyMatch;
        const date = new Date(year, parseInt(month) - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
      }
    }
    
    // If all parsing fails, return original string
    return dateString;
    
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return dateString || 'N/A';
  }
};

  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('released')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800';
    if (statusLower.includes('open')) return 'bg-blue-100 text-blue-800';
    if (statusLower.includes('closed')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Filter data
  const filteredData = data.filter(po => {
    // Search filter
    const matchesSearch = !searchTerm || 
      (po.No && po.No.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (po.VendorName && po.VendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (po.vendorName && po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || 
      (po.Status && po.Status.toLowerCase() === filterStatus.toLowerCase()) ||
      (po.status && po.status.toLowerCase() === filterStatus.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold text-gray-800">Purchase Orders</h4>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredData.length} of {data.length} purchase orders
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PO or Vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending approval">Pending Approval</option>
              <option value="released">Released</option>
              <option value="short closed">Short Closed</option>
              <option value="closed">Closed</option>
            </select>
            
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">PO No.</th>
              <th className="p-4 text-left font-semibold text-gray-700">Vendor</th>
              <th className="p-4 text-left font-semibold text-gray-700">Date</th>
              <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
         <tbody className="divide-y divide-gray-200">
  {filteredData.map((po, index) => {
    // Check vendor data
    const hasVendor = po.VendorName && po.VendorName !== 'Unknown Vendor';
    
    return (
      <tr key={index} className="hover:bg-gray-50">
        <td className="p-4">
          <div className="font-mono font-bold text-gray-800">
            {po.No || po.id || `PO-${index + 1}`}
          </div>
        </td>
        <td className="p-4">
          <div className={`font-medium ${hasVendor ? 'text-gray-700' : 'text-red-600'}`}>
            {hasVendor ? po.VendorName : 'Vendor Not Found'}
          </div>
          {po.VendorNo && po.VendorNo !== 'N/A' && (
            <div className="text-xs text-gray-500 mt-1">
              Vendor No: {po.VendorNo}
            </div>
          )}
          {!hasVendor && (
            <div className="text-xs text-red-400 mt-1">
              Please check vendor data in Business Central
            </div>
          )}
        </td>
        <td className="p-4 text-gray-700">
          {formatDate(po.OrderDate || po.orderDate)}
        </td>
        <td className="p-4 font-bold text-gray-800">
          {formatCurrency(po.TotalAmount || po.totalAmount || po.amount || 0)}
        </td>
        <td className="p-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(po.Status || po.status)}`}>
            {po.Status || po.status || 'Open'}
          </span>
        </td>
        <td className="p-4">
          <div className="flex gap-2">
            <button 
              title="View Details"
              className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              title="Edit"
              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Found</h3>
          <p className="text-gray-500">Try changing your search or filter criteria.</p>
        </div>
      )}

      {filteredData.length > 10 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1-10 of {filteredData.length} purchase orders
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Work Order List Component
const WorkOrderList = ({ data, loading, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
        <p className="font-medium text-gray-700">Loading Work Orders...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Orders Found</h3>
        <p className="text-gray-500">No work orders available in the system.</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // SAME FIXED DATE FORMAT FUNCTION
  const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A' || dateString === 'Invalid Date') {
    return 'N/A';
  }
  
  try {
    // Business Central format: "2024-01-15" या "2024-01-15T00:00:00Z"
    if (typeof dateString === 'string') {
      // Remove time part if exists
      const dateOnly = dateString.split('T')[0];
      
      // Check if already in YYYY-MM-DD format
      if (dateOnly.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateOnly.split('-');
        const date = new Date(year, parseInt(month) - 1, day);
        
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
      }
      
      // Try parsing any date format
      const parsedDate = new Date(dateOnly);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      
      // Try DD-MM-YYYY format
      const dmyMatch = dateOnly.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (dmyMatch) {
        const [_, day, month, year] = dmyMatch;
        const date = new Date(year, parseInt(month) - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
      }
    }
    
    // If all parsing fails, return original string
    return dateString;
    
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return dateString || 'N/A';
  }
};

  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('released')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800';
    if (statusLower.includes('open')) return 'bg-blue-100 text-blue-800';
    if (statusLower.includes('closed')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadgeClass = (priority) => {
    if (!priority) return 'bg-gray-100 text-gray-800';

    const priorityLower = priority.toLowerCase();
    if (priorityLower.includes('high')) return 'bg-red-100 text-red-800';
    if (priorityLower.includes('medium')) return 'bg-yellow-100 text-yellow-800';
    if (priorityLower.includes('low')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Filter data
  const filteredData = data.filter(wo => {
    // Search filter
    const matchesSearch = !searchTerm || 
      (wo.No && wo.No.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wo.Description && wo.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wo.description && wo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wo.VendorName && wo.VendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wo.vendorName && wo.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter - 4 categories only
    const matchesStatus = filterStatus === 'all' || 
      (wo.Status && wo.Status.toLowerCase() === filterStatus.toLowerCase()) ||
      (wo.status && wo.status.toLowerCase() === filterStatus.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold text-gray-800">Work Orders</h4>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredData.length} of {data.length} work orders
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Work Order or Description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
              />
            </div>
            
            {/* Status Filter - 4 categories only */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending approval">Pending Approval</option>
              <option value="released">Released</option>
              <option value="short closed">Short Closed</option>
            </select>
            
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">WO No.</th>
              <th className="p-4 text-left font-semibold text-gray-700">Description</th>
              <th className="p-4 text-left font-semibold text-gray-700">Vendor</th>
              <th className="p-4 text-left font-semibold text-gray-700">Priority</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Date</th>
              <th className="p-4 text-left font-semibold text-gray-700">Cost</th>
              <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((wo, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-mono font-bold text-gray-800">
                    {wo.No || wo.id || wo.number || wo.workOrderNo || `WO-${index + 1}`}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-700">
                    {wo.Description || wo.description || 'No Description'}
                  </div>
                  {wo.Type && (
                    <div className="text-xs text-gray-500 mt-1">
                      Type: {wo.Type}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-700">
                    {wo.VendorName || wo.vendorName || 'General Vendor'}
                  </div>
                  {wo.VendorNo && (
                    <div className="text-xs text-gray-500 mt-1">
                      Vendor No: {wo.VendorNo}
                    </div>
                  )}
                  {wo.AssignedTo && (
                    <div className="text-xs text-gray-500 mt-1">
                      Assigned: {wo.AssignedTo}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityBadgeClass(wo.Priority || wo.priority)}`}>
                    {wo.Priority || wo.priority || 'Medium'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(wo.Status || wo.status)}`}>
                    {wo.Status || wo.status || 'Open'}
                  </span>
                </td>
                <td className="p-4 text-gray-700">
                  {formatDate(wo.OrderDate || wo.orderDate || wo.StartDate || wo.startDate)}
                </td>
                <td className="p-4 font-bold text-gray-800">
                  {formatCurrency(wo.Cost || wo.cost || wo.totalCost || wo.TotalAmount || wo.Amount || 0)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      title="View Details"
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      title="Edit"
                      className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Orders Found</h3>
          <p className="text-gray-500">Try changing your search or filter criteria.</p>
        </div>
      )}

      {filteredData.length > 10 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1-10 of {filteredData.length} work orders
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// और fetchData function को update करें:
const fetchData = async () => {
  setLoading(true);
  try {
    console.log('🔄 Fetching data from APIs...')
    
    // Fetch both PO and WO data in parallel
    const [poData, woData] = await Promise.all([
      getPOStatistics(),
      getWorkOrderStatistics()
    ])

    console.log('📊 PO Data Details:', {
      source: poData._source,
      rawDataCount: poData.rawData?.length,
      firstPO: poData.rawData?.[0],
      vendorDataCount: poData.vendorWiseData?.length
    });
    
    console.log('📊 WO Data Details:', {
      source: woData._source,
      rawDataCount: woData.rawData?.length,
      firstWO: woData.rawData?.[0],
      vendorDataCount: woData.vendorWiseData?.length
    });

    // Process PO data
    setPoStats(poData);
    setPoList(poData.rawData || []);
    
    // Process WO data
    setWoStats(woData);
    
    // Check if WO has rawData
    if (woData.rawData && woData.rawData.length > 0) {
      console.log('✅ WO rawData available:', woData.rawData.length, 'items');
      setWoList(woData.rawData);
    } else {
      console.log('⚠️ No WO rawData, using fallback');
      // Create fallback WO data
      const fallbackWOData = [
        { 
          No: 'WO-2024-001', 
          VendorName: 'Tech Maintenance Inc', 
          OrderDate: '2024-06-28',
          TotalAmount: 45000,
          Status: 'Open',
          Description: 'Machine Preventive Maintenance',
          Priority: 'High',
          AssignedTo: 'John Smith',
          Type: 'Maintenance'
        },
        { 
          No: 'WO-2024-002', 
          VendorName: 'Quality Control Corp', 
          OrderDate: '2024-06-25',
          TotalAmount: 32000,
          Status: 'Released',
          Description: 'Monthly Quality Inspection',
          Priority: 'Medium',
          AssignedTo: 'Sarah Johnson',
          Type: 'Inspection'
        }
      ];
      setWoList(fallbackWOData);
      
      // Update stats with fallback vendor data
      if (woData.vendorWiseData && woData.vendorWiseData.length === 0) {
        setWoStats(prev => ({
          ...prev,
          vendorWiseData: [
            { vendorName: 'Tech Maintenance Inc', woCount: 28, totalAmount: 450000 },
            { vendorName: 'Industrial Services Ltd', woCount: 22, totalAmount: 380000 },
            { vendorName: 'Quality Control Corp', woCount: 18, totalAmount: 300000 }
          ]
        }));
      }
    }
    
    // Set data source (use PO as primary indicator)
    setDataSource(poData._source);
    setLastUpdated(new Date());

  } catch (error) {
    console.error('❌ Error loading data:', error)
    // Use mock data as fallback
    const mockPOData = createMockPOList();
    const mockWOData = createMockWOList();
    
    setPoStats({
      statusSummary: { open: 45, pendingApproval: 23, released: 120, shortClosed: 12, total: 200 },
      vendorWiseData: [
        { vendorName: 'ABC Suppliers', poCount: 25, totalAmount: 1250000 },
        { vendorName: 'XYZ Corporation', poCount: 18, totalAmount: 980000 },
      ],
      summary: { totalPOs: 200, totalAmount: 2850000, avgAmount: 14250 },
      _source: 'mock_fallback'
    });
    setPoList(mockPOData);
    
    setWoStats({
      statusSummary: { open: 40, pendingApproval: 25, released: 45, shortClosed: 15, total: 125 },
      vendorWiseData: [
        { vendorName: 'Tech Maintenance Inc', woCount: 28, totalAmount: 450000 },
        { vendorName: 'Industrial Services Ltd', woCount: 22, totalAmount: 380000 },
      ],
      summary: { totalWorkOrders: 125, totalAmount: 1850000, avgAmount: 14800 },
      _source: 'mock_fallback'
    });
    setWoList(mockWOData);
    
    setDataSource('mock_fallback');
    setLastUpdated(new Date());
  } finally {
    setLoading(false);
  }
};
// Connection Status Indicator
const ConnectionStatus = ({ source }) => {
  const isConnected = source === 'business_central';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Live Data</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Demo Data</span>
        </>
      )}
    </div>
  );
};

// Format currency helper function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Create mock data functions
// Create mock data functions
function createMockPOList() {
  return [
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
    },
    {
      No: 'PO-1003',
      VendorName: 'Global Traders',
      VendorNo: 'VEND-003',
      OrderDate: '2024-01-25',
      TotalAmount: 75000,
      Status: 'Open'
    },
    {
      No: 'PO-1004',
      VendorName: 'Tech Solutions Ltd',
      VendorNo: 'VEND-004',
      OrderDate: '2024-01-22',
      TotalAmount: 65000,
      Status: 'Released'
    },
    {
      No: 'PO-1005',
      VendorName: 'Material Suppliers',
      VendorNo: 'VEND-005',
      OrderDate: '2024-01-25',
      TotalAmount: 52000,
      Status: 'Short Closed'
    }
  ];
}

function createMockWOList() {
  return [
    {
      No: 'WO-2024-001',
      Description: 'Machine Preventive Maintenance',
      Type: 'Maintenance',
      Priority: 'High',
      OrderDate: '2024-06-28',
      Status: 'Open',
      AssignedTo: 'John Smith',
      VendorName: 'Tech Maintenance Inc',
      VendorNo: 'VEND-WO-001',
      Cost: 12000,
      TotalAmount: 12000
    },
    {
      No: 'WO-2024-002',
      Description: 'Quality Inspection Batch #45',
      Type: 'Inspection',
      Priority: 'Medium',
      OrderDate: '2024-06-25',
      Status: 'Released',
      AssignedTo: 'Sarah Johnson',
      VendorName: 'Quality Control Corp',
      VendorNo: 'VEND-WO-003',
      Cost: 8500,
      TotalAmount: 8500
    },
    {
      No: 'WO-2024-003',
      Description: 'Factory Equipment Repair',
      Type: 'Repair',
      Priority: 'High',
      OrderDate: '2024-06-20',
      Status: 'Pending Approval',
      AssignedTo: 'Mike Wilson',
      VendorName: 'Industrial Services Ltd',
      VendorNo: 'VEND-WO-002',
      Cost: 18000,
      TotalAmount: 18000
    },
    {
      No: 'WO-2024-004',
      Description: 'Wiring Installation',
      Type: 'Installation',
      Priority: 'Medium',
      OrderDate: '2024-06-18',
      Status: 'Short Closed',
      AssignedTo: 'David Lee',
      VendorName: 'Electrical Works',
      VendorNo: 'VEND-WO-005',
      Cost: 9500,
      TotalAmount: 9500
    },
    {
      No: 'WO-2024-005',
      Description: 'AC Maintenance',
      Type: 'Maintenance',
      Priority: 'Low',
      OrderDate: '2024-06-15',
      Status: 'Released',
      AssignedTo: 'Emma Brown',
      VendorName: 'HVAC Services',
      VendorNo: 'VEND-WO-006',
      Cost: 7500,
      TotalAmount: 7500
    }
  ];
}
export default function BusinessCentral() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [poStats, setPoStats] = useState(null)
  const [woStats, setWoStats] = useState(null)
  const [poList, setPoList] = useState([])
  const [woList, setWoList] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [dataSource, setDataSource] = useState('loading')
  const [searchTermPO, setSearchTermPO] = useState('')
  const [filterStatusPO, setFilterStatusPO] = useState('all')
  const [searchTermWO, setSearchTermWO] = useState('')
  const [filterStatusWO, setFilterStatusWO] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
  setLoading(true);
  try {
    console.log('🔄 Fetching data from APIs...')
    
    // Fetch both PO and WO data in parallel
    const [poData, woData] = await Promise.all([
      getPOStatistics(),
      getWorkOrderStatistics()
    ])

    console.log('📊 PO Data Sample:', {
      type: poData._dataType,
      source: poData._source,
      firstPO: poData.rawData?.[0],
      totalPOs: poData.statusSummary?.total
    });
    
    console.log('📊 WO Data Sample:', {
      type: woData._dataType,
      source: woData._source,
      firstWO: woData.rawData?.[0],
      totalWOs: woData.statusSummary?.total,
      vendorWiseData: woData.vendorWiseData?.[0]
    });

    // Process PO data
    setPoStats(poData);
    setPoList(poData.rawData || []);
    
    // Process WO data
    setWoStats(woData);
    setWoList(woData.rawData || []);
    
    // Debug: Log first few items
    if (poData.rawData && poData.rawData.length > 0) {
      console.log('📋 First PO item:', {
        No: poData.rawData[0].No,
        VendorName: poData.rawData[0].VendorName,
        OrderDate: poData.rawData[0].OrderDate,
        Status: poData.rawData[0].Status
      });
    }
    
    if (woData.rawData && woData.rawData.length > 0) {
      console.log('📋 First WO item:', {
        No: woData.rawData[0].No,
        VendorName: woData.rawData[0].VendorName,
        OrderDate: woData.rawData[0].OrderDate,
        Status: woData.rawData[0].Status
      });
    }
    
    // Set data source (use PO as primary indicator)
    setDataSource(poData._source);
    setLastUpdated(new Date());

  } catch (error) {
    console.error('❌ Error loading data:', error)
    // Use mock data as fallback
    const mockPOData = createMockPOList();
    const mockWOData = createMockWOList();
    
    setPoStats({
      statusSummary: { open: 45, pendingApproval: 23, released: 120, shortClosed: 12, total: 200 },
      vendorWiseData: [],
      summary: { totalPOs: 200, totalAmount: 2850000, avgAmount: 14250 },
      _source: 'mock_fallback'
    });
    setPoList(mockPOData);
    
    setWoStats({
      statusSummary: { open: 40, pendingApproval: 25, released: 45, shortClosed: 15, total: 125 },
      vendorWiseData: [],
      summary: { totalWorkOrders: 125, totalAmount: 1850000, avgAmount: 14800 },
      _source: 'mock_fallback'
    });
    setWoList(mockWOData);
    
    setDataSource('mock_fallback');
    setLastUpdated(new Date());
  } finally {
    setLoading(false);
  }
};

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src="/Logos/Business central logo.jpg"
                  alt="Business Central Logo"
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Business Central</h1>
                  <p className="text-sm text-gray-600">Purchase & Work Order Analytics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ConnectionStatus source={dataSource} />
              <ThemeToggle />
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`p-3 rounded-lg text-center ${activeTab === 'overview' ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  <div className="text-green-600 font-medium text-sm">Overview</div>
                </button>
                <button
                  onClick={() => setActiveTab('po')}
                  className={`p-3 rounded-lg text-center ${activeTab === 'po' ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  <div className="text-blue-600 font-medium text-sm">PO</div>
                </button>
                <button
                  onClick={() => setActiveTab('wo')}
                  className={`p-3 rounded-lg text-center ${activeTab === 'wo' ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  <div className="text-purple-600 font-medium text-sm">WO</div>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`p-3 rounded-lg text-center ${activeTab === 'analytics' ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  <div className="text-orange-600 font-medium text-sm">Analytics</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="hidden md:flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('po')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'po' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            🛒 Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('wo')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'wo' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            🔧 Work Orders
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'analytics' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            📈 Analytics
          </button>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}` : 'Loading...'}
          </div>
          <div className="text-xs text-gray-500">
            {dataSource === 'business_central' ? '✅ Connected to Business Central' : '⚠️ Using demonstration data'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
            <p className="font-medium text-gray-700">Loading Business Central Data...</p>
            <p className="text-sm text-gray-500 mt-2">
              {dataSource === 'business_central'
                ? 'Connecting to Dynamics 365 Business Central API'
                : 'Loading demonstration data'}
            </p>
          </div>
        )}

        {!loading && activeTab === 'overview' && (
          <>
            {/* Overview Content */}
            <div className="space-y-8">
              {/* Dashboard Title */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Central Dashboard</h2>
                
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* PO Stats */}
                  <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">{poStats?.statusSummary?.total || 0}</div>
                        <div className="text-lg font-medium text-gray-700 mt-2">Purchase Orders</div>
                        <div className="text-sm text-gray-500">Total active POs</div>
                      </div>
                      <ShoppingCart className="w-10 h-10 text-blue-400" />
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">{poStats?.statusSummary?.open || 0} Open</span> • 
                        <span className="mx-2">•</span>
                        <span className="font-medium text-green-600">{poStats?.statusSummary?.released || 0} Released</span>
                      </div>
                    </div>
                  </div>

                  {/* WO Stats */}
                  <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-purple-600">{woStats?.statusSummary?.total || 0}</div>
                        <div className="text-lg font-medium text-gray-700 mt-2">Work Orders</div>
                        <div className="text-sm text-gray-500">Total active WOs</div>
                      </div>
                      <ClipboardCheck className="w-10 h-10 text-purple-400" />
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-purple-600">{woStats?.statusSummary?.open || 0} Open</span> • 
                        <span className="mx-2">•</span>
                        <span className="font-medium text-green-600">{woStats?.statusSummary?.released || 0} Released</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Stats */}
                  <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(
                            (poStats?.summary?.totalAmount || 0) + 
                            (woStats?.summary?.totalAmount || 0)
                          )}
                        </div>
                        <div className="text-lg font-medium text-gray-700 mt-2">Total Value</div>
                        <div className="text-sm text-gray-500">PO + WO combined</div>
                      </div>
                      <DollarSign className="w-10 h-10 text-green-400" />
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">PO: {formatCurrency(poStats?.summary?.totalAmount || 0)}</span>
                        <br />
                        <span className="font-medium">WO: {formatCurrency(woStats?.summary?.totalAmount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-orange-600">
                          {(poStats?.vendorWiseData?.length || 0) + (woStats?.vendorWiseData?.length || 0)}
                        </div>
                        <div className="text-lg font-medium text-gray-700 mt-2">Active Vendors</div>
                        <div className="text-sm text-gray-500">PO + WO vendors</div>
                      </div>
                      <Users className="w-10 h-10 text-orange-400" />
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">{poStats?.vendorWiseData?.length || 0} PO Vendors</span> • 
                        <span className="mx-2">•</span>
                        <span className="font-medium text-purple-600">{woStats?.vendorWiseData?.length || 0} WO Vendors</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('po')}
                    className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-center transition-colors"
                  >
                    <div className="text-blue-600 font-medium flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      View POs
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Purchase Orders</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('wo')}
                    className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 text-center transition-colors"
                  >
                    <div className="text-purple-600 font-medium flex items-center justify-center gap-2">
                      <ClipboardCheck className="w-5 h-5" />
                      View WOs
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Work Orders</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-center transition-colors"
                  >
                    <div className="text-green-600 font-medium flex items-center justify-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Analytics
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Charts & Reports</div>
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-center transition-colors"
                  >
                    <div className="text-gray-600 font-medium flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Refresh
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Update Data</div>
                  </button>
                </div>
              </div>

              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PO Status Card */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Purchase Order Status</h3>
                    <div className="text-sm text-blue-600 font-medium">
                      Total: {poStats?.statusSummary?.total || 0}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{poStats?.statusSummary?.open || 0}</div>
                      <div className="text-sm text-gray-600">Open</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{poStats?.statusSummary?.pendingApproval || 0}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{poStats?.statusSummary?.released || 0}</div>
                      <div className="text-sm text-gray-600">Released</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{poStats?.statusSummary?.shortClosed || 0}</div>
                      <div className="text-sm text-gray-600">Closed</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('po')}
                      className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                    >
                      View All Purchase Orders →
                    </button>
                  </div>
                </div>

                {/* WO Status Card */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Work Order Status</h3>
                    <div className="text-sm text-purple-600 font-medium">
                      Total: {woStats?.statusSummary?.total || 0}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{woStats?.statusSummary?.open || 0}</div>
                      <div className="text-sm text-gray-600">Open</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{woStats?.statusSummary?.pendingApproval || 0}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{woStats?.statusSummary?.released || 0}</div>
                      <div className="text-sm text-gray-600">Released</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{woStats?.statusSummary?.shortClosed || 0}</div>
                      <div className="text-sm text-gray-600">Closed</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('wo')}
                      className="w-full py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium"
                    >
                      View All Work Orders →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && activeTab === 'po' && poStats && (
          <>
            {/* Purchase Orders Tab Content */}
            <div className="space-y-8">
              {/* PO Title Section */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Purchase Orders</h2>
                    <p className="text-gray-600 mt-1">Manage and track all purchase orders</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{poStats.statusSummary?.total || 0}</div>
                    <div className="text-sm text-gray-600">Total POs</div>
                  </div>
                </div>

                {/* PO Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{poStats.statusSummary?.open || 0}</div>
                    <div className="text-sm text-gray-600">Open</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{poStats.statusSummary?.pendingApproval || 0}</div>
                    <div className="text-sm text-gray-600">Pending Approval</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{poStats.statusSummary?.released || 0}</div>
                    <div className="text-sm text-gray-600">Released</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{poStats.statusSummary?.shortClosed || 0}</div>
                    <div className="text-sm text-gray-600">Short Closed</div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(poStats.summary?.totalAmount || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total PO Value</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(poStats.summary?.avgAmount || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Average PO Value</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {poStats.vendorWiseData?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Vendors</div>
                  </div>
                </div>
              </div>

              {/* PO Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <POStatusPieChart data={poStats.statusSummary || {}} />
                <VendorPOChart data={poStats.vendorWiseData || []} />
              </div>

              {/* PO List */}
              <PurchaseOrderList 
                data={poList} 
                loading={loading}
                searchTerm={searchTermPO}
                setSearchTerm={setSearchTermPO}
                filterStatus={filterStatusPO}
                setFilterStatus={setFilterStatusPO}
              />
            </div>
          </>
        )}

        {!loading && activeTab === 'wo' && woStats && (
          <>
            {/* Work Orders Tab Content */}
            <div className="space-y-8">
              {/* WO Title Section */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Work Orders</h2>
                    <p className="text-gray-600 mt-1">Manage and track all work orders</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">{woStats.statusSummary?.total || 0}</div>
                    <div className="text-sm text-gray-600">Total WOs</div>
                  </div>
                </div>

                {/* WO Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{woStats.statusSummary?.open || 0}</div>
                    <div className="text-sm text-gray-600">Open</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{woStats.statusSummary?.pendingApproval || 0}</div>
                    <div className="text-sm text-gray-600">Pending Approval</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{woStats.statusSummary?.released || 0}</div>
                    <div className="text-sm text-gray-600">Released</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{woStats.statusSummary?.shortClosed || 0}</div>
                    <div className="text-sm text-gray-600">Short Closed</div>
                  </div>
                </div>

                {/* Work Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(woStats.summary?.totalAmount || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total WO Cost</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {woStats.summary?.totalEstimatedHours || 0} hrs
                    </div>
                    <div className="text-sm text-gray-600">Estimated Hours</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {woStats.vendorWiseData?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Vendors</div>
                  </div>
                </div>
              </div>

              {/* WO Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WOStatusPieChart data={woStats.statusSummary || {}} />
                <VendorWOChart data={woStats.vendorWiseData || []} />
              </div>

              {/* WO List */}
              <WorkOrderList 
                data={woList} 
                loading={loading}
                searchTerm={searchTermWO}
                setSearchTerm={setSearchTermWO}
                filterStatus={filterStatusWO}
                setFilterStatus={setFilterStatusWO}
              />
            </div>
          </>
        )}

        {!loading && activeTab === 'analytics' && (
          <>
            {/* Analytics Tab Content */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Business Central Analytics</h2>
                
                {/* Combined Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <POStatusPieChart data={poStats?.statusSummary || {}} />
                  <WOStatusPieChart data={woStats?.statusSummary || {}} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <VendorPOChart data={poStats?.vendorWiseData || []} />
                  <VendorWOChart data={woStats?.vendorWiseData || []} />
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{poStats?.statusSummary?.total || 0}</div>
                    <div className="text-sm text-gray-600">Total POs</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{woStats?.statusSummary?.total || 0}</div>
                    <div className="text-sm text-gray-600">Total WOs</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        (poStats?.summary?.totalAmount || 0) + 
                        (woStats?.summary?.totalAmount || 0)
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Combined Value</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(poStats?.vendorWiseData?.length || 0) + (woStats?.vendorWiseData?.length || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Vendors</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Business Central • Dynamics 365 • Purchase & Work Order Analytics • API Integration</p>
          <p className="mt-1">Company: AL SOFTWEB PVT LTD UAT • Environment: SANDBOX-VALIDATIONS-26-11-2024</p>
          <p className="mt-1">Data Source: {dataSource === 'business_central' ? 'Live Business Central API' : 'Demonstration Data'}</p>
          <p className="mt-1">
            Purchase Orders: {poStats?.statusSummary?.total || 0} • 
            Work Orders: {woStats?.statusSummary?.total || 0}
          </p>
        </div>
      </footer>
    </div>
  )
}