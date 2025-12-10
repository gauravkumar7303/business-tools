
// 'use client'

// import { FileText, ArrowLeft, Upload, Search, Folder, Menu, Download, Trash2, Calendar, File, FileImage, FileArchive, X, PieChart, BarChart3, Info } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import ThemeToggle from '@/src/components/ThemeToggle'
// import { useState, useEffect, useCallback } from 'react'
// import FileUpload from '@/src/components/MPPViewer/FileUpload'

// export default function Documents() {
//   const router = useRouter()
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [uploadedFiles, setUploadedFiles] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [showUploader, setShowUploader] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [showFileTypeStats, setShowFileTypeStats] = useState(false)
//   const [fileTypeStats, setFileTypeStats] = useState([])

//   // Load files from localStorage on component mount
//   useEffect(() => {
//     const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
//     setUploadedFiles(storedFiles)
//   }, [])

//   // Calculate file type statistics whenever uploadedFiles changes
//   useEffect(() => {
//     if (uploadedFiles.length > 0) {
//       const stats = {}
      
//       uploadedFiles.forEach(file => {
//         const type = file.type || 'Unknown'
//         if (!stats[type]) {
//           stats[type] = {
//             count: 0,
//             totalSize: 0,
//             type: type
//           }
//         }
//         stats[type].count++
//         stats[type].totalSize += file.size
//       })
      
//       // Convert to array and sort by count
//       const statsArray = Object.values(stats).map(stat => ({
//         ...stat,
//         percentage: ((stat.count / uploadedFiles.length) * 100).toFixed(1)
//       })).sort((a, b) => b.count - a.count)
      
//       setFileTypeStats(statsArray)
//     }
//   }, [uploadedFiles])

//   const handleFileUpload = useCallback((fileData) => {
//     if (isProcessing) return

//     setIsProcessing(true)

//     // Check if file already exists
//     const fileExists = uploadedFiles.some(
//       file => file.name === fileData.name && file.size === fileData.size
//     )

//     if (!fileExists) {
//       setUploadedFiles(prev => {
//         const newFiles = [...prev, fileData]
//         // Update localStorage
//         localStorage.setItem('uploadedFiles', JSON.stringify(newFiles))
//         return newFiles
//       })
//     }

//     // Close uploader after short delay
//     setTimeout(() => {
//       setShowUploader(false)
//       setIsProcessing(false)
//     }, 500)
//   }, [uploadedFiles, isProcessing])

//   const handleDownload = (file) => {
//     const link = document.createElement('a')
//     link.href = file.url
//     link.download = file.name
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const handleDelete = (fileId) => {
//     if (window.confirm('Are you sure you want to delete this file?')) {
//       // Remove from state
//       const updatedFiles = uploadedFiles.filter(file => file.id !== fileId)
//       setUploadedFiles(updatedFiles)

//       // Remove from localStorage
//       localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles))

//       // Revoke object URL
//       const fileToDelete = uploadedFiles.find(f => f.id === fileId)
//       if (fileToDelete?.url) {
//         URL.revokeObjectURL(fileToDelete.url)
//       }
//     }
//   }

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const sizes = ['Bytes', 'KB', 'MB', 'GB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   const getFileIcon = (fileType) => {
//     if (fileType.includes('image')) return <FileImage className="w-5 h-5 text-green-600" />
//     if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-600" />
//     if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive className="w-5 h-5 text-yellow-600" />
//     if (fileType.includes('mpp')) return <File className="w-5 h-5 text-purple-600" />
//     return <File className="w-5 h-5 text-blue-600" />
//   }

//   const getFileTypeColor = (fileType) => {
//     if (fileType.includes('image')) return 'bg-green-100 text-green-800'
//     if (fileType.includes('pdf')) return 'bg-red-100 text-red-800'
//     if (fileType.includes('zip') || fileType.includes('rar')) return 'bg-yellow-100 text-yellow-800'
//     if (fileType.includes('mpp')) return 'bg-purple-100 text-purple-800'
//     return 'bg-blue-100 text-blue-800'
//   }

//   const filteredFiles = uploadedFiles.filter(file =>
//     file.name.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 transition-colors duration-300">
//       {/* Header */}
//       <header className="bg-white shadow-sm transition-colors duration-300 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               {/* Mobile menu */}
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
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <img
//                     src="/Logos/sharepointlogo.png"
//                     alt="Document Manager logo"
//                     className="w-16 h-16 object-contain"
//                   />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-800">Documents Manager</h1>
//                   <p className="text-sm text-gray-600">Store, organize and manage documents</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <ThemeToggle />
//               <button
//                 onClick={() => setShowUploader(true)}
//                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
//                 disabled={isProcessing}
//               >
//                 <Upload className="w-4 h-4" />
//                 <span className="hidden sm:inline">
//                   {isProcessing ? 'Processing...' : 'Upload Files'}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Upload Modal */}
//       {showUploader && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Upload Files</h2>
//               <button
//                 onClick={() => setShowUploader(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//                 disabled={isProcessing}
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <FileUpload onFileUpload={handleFileUpload} />
//           </div>
//         </div>
//       )}

//       {/* File Type Statistics Modal */}
//       {showFileTypeStats && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
//             <div className="flex justify-between items-center mb-6">
//               <div className="flex items-center gap-3">
//                 <PieChart className="w-6 h-6 text-purple-600" />
//                 <h2 className="text-2xl font-bold text-gray-800">File Type Statistics</h2>
//               </div>
//               <button
//                 onClick={() => setShowFileTypeStats(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {uploadedFiles.length} Total Files
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {fileTypeStats.length} different file types
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-purple-600">
//                     {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.size, 0))}
//                   </div>
//                   <div className="text-sm text-gray-500">Total Size</div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4 mb-6">
//               {fileTypeStats.map((stat, index) => (
//                 <div key={index} className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <div className="flex items-center gap-3">
//                       {getFileIcon(stat.type)}
//                       <div>
//                         <h4 className="font-medium text-gray-800">
//                           {stat.type.split('/')[1] || stat.type}
//                         </h4>
//                         <p className="text-sm text-gray-500">
//                           {stat.type}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xl font-bold text-gray-800">{stat.count}</div>
//                       <div className="text-sm text-gray-500">files</div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Percentage</span>
//                       <span className="font-medium">{stat.percentage}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="h-2 rounded-full bg-purple-600"
//                         style={{ width: `${stat.percentage}%` }}
//                       ></div>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Total Size</span>
//                       <span className="font-medium">{formatFileSize(stat.totalSize)}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-purple-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <BarChart3 className="w-5 h-5 text-purple-600" />
//                   <h4 className="font-semibold text-purple-800">Most Common</h4>
//                 </div>
//                 {fileTypeStats.length > 0 && (
//                   <>
//                     <div className="text-xl font-bold text-purple-700 mb-1">
//                       {fileTypeStats[0].type.split('/')[1] || fileTypeStats[0].type}
//                     </div>
//                     <div className="text-sm text-purple-600">
//                       {fileTypeStats[0].count} files ({fileTypeStats[0].percentage}%)
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Info className="w-5 h-5 text-blue-600" />
//                   <h4 className="font-semibold text-blue-800">Summary</h4>
//                 </div>
//                 <div className="text-sm text-blue-700">
//                   {fileTypeStats.length > 1 ? (
//                     <>
//                       Top 3 types cover {(
//                         fileTypeStats.slice(0, 3).reduce((sum, stat) => sum + parseFloat(stat.percentage), 0)
//                       ).toFixed(1)}% of all files
//                     </>
//                   ) : (
//                     "Only one file type uploaded"
//                   )}
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={() => setShowFileTypeStats(false)}
//               className="w-full mt-6 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
//             >
//               Close Statistics
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div 
//             className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
//             onClick={() => setShowFileTypeStats(true)}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <PieChart className="w-6 h-6 text-purple-600" />
//               </div>
//               <div className="text-right">
//                 <div className="text-3xl font-bold text-gray-800">{uploadedFiles.length}</div>
//                 <div className="text-gray-600">Total Documents</div>
//               </div>
//             </div>
//             <div className="text-purple-600 text-sm font-medium flex items-center gap-1">
//               <Info className="w-4 h-4" />
//               Click to see file type breakdown
//             </div>
//           </div>

//           <div 
//             className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
//             onClick={() => setShowFileTypeStats(true)}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <File className="w-6 h-6 text-blue-600" />
//               </div>
//               <div className="text-right">
//                 <div className="text-3xl font-bold text-gray-800">
//                   {fileTypeStats.length}
//                 </div>
//                 <div className="text-gray-600">File Types</div>
//               </div>
//             </div>
//             <div className="text-blue-600 text-sm">
//               {fileTypeStats.length > 0 && (
//                 <>
//                   {fileTypeStats[0].type.split('/')[1] || fileTypeStats[0].type}: {fileTypeStats[0].count} files
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <Folder className="w-6 h-6 text-green-600" />
//               </div>
//               <div className="text-right">
//                 <div className="text-3xl font-bold text-gray-800">
//                   {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.size, 0))}
//                 </div>
//                 <div className="text-gray-600">Total Storage Used</div>
//               </div>
//             </div>
//             <div className="text-green-600 text-sm">Browser Local Storage</div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-white rounded-xl shadow p-6 mb-8">
//           <div className="relative">
//             <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search documents by name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Quick Stats Button */}
//         {uploadedFiles.length > 0 && (
//           <div className="mb-6">
//             <button
//               onClick={() => setShowFileTypeStats(true)}
//               className="flex items-center gap-2 px-4 py-3 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
//             >
//               <PieChart className="w-5 h-5" />
//               <span className="font-medium">View File Type Statistics</span>
//               <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
//                 {fileTypeStats.length} types
//               </span>
//             </button>
//           </div>
//         )}

//         {/* Files List */}
//         <div className="bg-white rounded-xl shadow p-6 mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">Uploaded Files ({uploadedFiles.length})</h2>
//               {fileTypeStats.length > 0 && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   {fileTypeStats.length} file types • Click on file type badge for details
//                 </p>
//               )}
//             </div>
//             {uploadedFiles.length > 0 && (
//               <button
//                 onClick={() => setShowUploader(true)}
//                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
//                 disabled={isProcessing}
//               >
//                 <Upload className="w-4 h-4" />
//                 Add More Files
//               </button>
//             )}
//           </div>

//           {filteredFiles.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="text-left p-4 font-semibold text-gray-700">File Name</th>
//                     <th className="text-left p-4 font-semibold text-gray-700">Type</th>
//                     <th className="text-left p-4 font-semibold text-gray-700">Size</th>
//                     <th className="text-left p-4 font-semibold text-gray-700">Upload Date</th>
//                     <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredFiles.map((file) => (
//                     <tr key={file.id} className="hover:bg-gray-50">
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           {getFileIcon(file.type)}
//                           <div>
//                             <div className="font-medium text-gray-800 truncate max-w-xs">
//                               {file.name}
//                             </div>
//                             <div className="text-sm text-gray-500 truncate max-w-xs">
//                               ID: {file.id.substring(0, 8)}...
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <button
//                           onClick={() => setShowFileTypeStats(true)}
//                           className={`px-3 py-1 rounded-full text-sm font-medium hover:opacity-90 transition-opacity ${getFileTypeColor(file.type)}`}
//                           title={`Click to see ${file.type} statistics`}
//                         >
//                           {file.type.split('/')[1] || file.type}
//                         </button>
//                       </td>
//                       <td className="p-4 text-gray-600">
//                         {formatFileSize(file.size)}
//                       </td>
//                       <td className="p-4 text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4" />
//                           {formatDate(file.uploadDate)}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleDownload(file)}
//                             className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
//                             title="Download"
//                           >
//                             <Download className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(file.id)}
//                             className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : uploadedFiles.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Upload className="w-12 h-12 text-purple-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-3">No Files Uploaded Yet</h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 Upload your first document to get started. All files are stored locally in your browser.
//               </p>
//               <button
//                 onClick={() => setShowUploader(true)}
//                 className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
//               >
//                 <Upload className="w-4 h-4" />
//                 Upload Your First File
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-gray-600">No files found matching your search.</p>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-gray-200 bg-white py-6">
//         <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
//           <p>Documents Manager • Local Storage • File Management • Secure</p>
//           <p className="mt-2 text-xs">
//             {uploadedFiles.length} files • {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.size, 0))} used
//           </p>
//         </div>
//       </footer>
//     </div>
//   )
// }
'use client'

import { FileText, ArrowLeft, Upload, Search, Folder, Menu, Download, Trash2, Calendar, File, FileImage, FileArchive, X, PieChart, BarChart3, Info, CheckCircle, Clock, User, FileType, Hash, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/src/components/ThemeToggle'
import { useState, useEffect, useCallback } from 'react'
import FileUpload from '@/src/components/MPPViewer/FileUpload'

export default function Documents() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploader, setShowUploader] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFileTypeStats, setShowFileTypeStats] = useState(false)
  const [fileTypeStats, setFileTypeStats] = useState([])
  const [selectedFileType, setSelectedFileType] = useState(null)

  // Generate random status (70% approved, 30% pending)
  const getRandomStatus = () => {
    return Math.random() < 0.7 ? 'approved' : 'pending'
  }

  // Load files from localStorage on component mount
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
    // Add random status and userId to existing files if not present
    const filesWithStatus = storedFiles.map(file => ({
      ...file,
      status: file.status || getRandomStatus(),
      userId: file.userId || 'group-108'
    }))
    setUploadedFiles(filesWithStatus)
  }, [])

  // Calculate file type statistics whenever uploadedFiles changes
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const stats = {}
      
      uploadedFiles.forEach(file => {
        const type = file.type || 'Unknown'
        if (!stats[type]) {
          stats[type] = {
            count: 0,
            totalSize: 0,
            type: type,
            typeName: type.split('/')[1] || type
          }
        }
        stats[type].count++
        stats[type].totalSize += file.size
      })
      
      // Convert to array and sort by count
      const statsArray = Object.values(stats).map(stat => ({
        ...stat,
        percentage: ((stat.count / uploadedFiles.length) * 100).toFixed(1)
      })).sort((a, b) => b.count - a.count)
      
      setFileTypeStats(statsArray)
    }
  }, [uploadedFiles])

  const handleFileUpload = useCallback((fileData) => {
    if (isProcessing) return

    setIsProcessing(true)

    // Check if file already exists
    const fileExists = uploadedFiles.some(
      file => file.name === fileData.name && file.size === fileData.size
    )

    if (!fileExists) {
      // IMPORTANT: FileUpload component should provide file content as base64 or ArrayBuffer
      // We'll store it properly for download
      const newFile = {
        ...fileData,
        status: getRandomStatus(),
        userId: 'group-108',
        // Make sure these fields are present
        id: fileData.id || Date.now().toString(36) + Math.random().toString(36).substr(2),
        uploadDate: fileData.uploadDate || new Date().toISOString(),
        url: fileData.url || null, // Keep URL if provided
        content: fileData.content || null // Keep content if provided
      }

      setUploadedFiles(prev => {
        const newFiles = [...prev, newFile]
        // Update localStorage
        localStorage.setItem('uploadedFiles', JSON.stringify(newFiles))
        return newFiles
      })
    }

    // Close uploader after short delay
    setTimeout(() => {
      setShowUploader(false)
      setIsProcessing(false)
    }, 500)
  }, [uploadedFiles, isProcessing])

  const handleDownload = async (file) => {
    try {
      console.log('Downloading file:', file.name)
      
      // Method 1: Try to use dataURL from file.content if it's base64
      if (file.content && typeof file.content === 'string' && file.content.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = file.content
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }
      
      // Method 2: Try to use file.url if it exists and is valid
      if (file.url && (file.url.startsWith('blob:') || file.url.startsWith('data:'))) {
        const link = document.createElement('a')
        link.href = file.url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }
      
      // Method 3: Try to get file from localStorage
      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
      const storedFile = storedFiles.find(f => f.id === file.id)
      
      if (storedFile) {
        if (storedFile.content && typeof storedFile.content === 'string' && storedFile.content.startsWith('data:')) {
          // If content is base64 data URL
          const link = document.createElement('a')
          link.href = storedFile.content
          link.download = storedFile.name
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          return
        } else if (storedFile.url && (storedFile.url.startsWith('blob:') || storedFile.url.startsWith('data:'))) {
          // If URL is blob or data URL
          const link = document.createElement('a')
          link.href = storedFile.url
          link.download = storedFile.name
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          return
        }
      }
      
      // Method 4: Create a simple text file as fallback
      const fallbackContent = `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\nUpload Date: ${file.uploadDate}\nID: ${file.id}`
      const blob = new Blob([fallbackContent], { type: 'text/plain' })
      const blobUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${file.name}.txt`
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }, 100)
      
    } catch (error) {
      console.error('Download error:', error)
      // Show user-friendly error message
      alert(`Unable to download "${file.name}". The file content may not be available. Try uploading the file again.`)
    }
  }

  const handleDelete = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      // Remove from state
      const updatedFiles = uploadedFiles.filter(file => file.id !== fileId)
      setUploadedFiles(updatedFiles)

      // Remove from localStorage
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles))

      // Revoke object URL if exists
      const fileToDelete = uploadedFiles.find(f => f.id === fileId)
      if (fileToDelete?.url && fileToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToDelete.url)
      }
    }
  }

  const handleCopyId = (fileId) => {
    navigator.clipboard.writeText(fileId)
      .then(() => {
        // Show temporary notification instead of alert
        const notification = document.createElement('div')
        notification.textContent = 'File ID copied to clipboard!'
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          font-size: 14px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `
        document.body.appendChild(notification)
        setTimeout(() => document.body.removeChild(notification), 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <FileImage className="w-5 h-5 text-green-600" />
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-600" />
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive className="w-5 h-5 text-yellow-600" />
    if (fileType.includes('mpp')) return <File className="w-5 h-5 text-purple-600" />
    return <File className="w-5 h-5 text-blue-600" />
  }

  const getFileTypeColor = (fileType) => {
    if (fileType.includes('image')) return 'bg-green-100 text-green-800'
    if (fileType.includes('pdf')) return 'bg-red-100 text-red-800'
    if (fileType.includes('zip') || fileType.includes('rar')) return 'bg-yellow-100 text-yellow-800'
    if (fileType.includes('mpp')) return 'bg-purple-100 text-purple-800'
    return 'bg-blue-100 text-blue-800'
  }

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Approved
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
        <Clock className="w-4 h-4" />
        Pending
      </span>
    )
  }

  // Calculate statistics for status
  const statusStats = {
    approved: uploadedFiles.filter(f => f.status === 'approved').length,
    pending: uploadedFiles.filter(f => f.status === 'pending').length
  }

  // Filter files by selected file type
  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         file.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedFileType ? file.type === selectedFileType : true
    return matchesSearch && matchesType
  })

  // Calculate total storage size
  const totalStorageSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white shadow-sm transition-colors duration-300 sticky top-0 z-50">
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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <img
                    src="/Logos/sharepointlogo.png"
                    alt="Document Manager logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Documents Manager</h1>
                  <p className="text-sm text-gray-600">Store, organize and manage documents</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setShowUploader(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isProcessing ? 'Processing...' : 'Upload Files'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Upload Files</h2>
              <button
                onClick={() => setShowUploader(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                disabled={isProcessing}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      )}

      {/* File Type Statistics Modal */}
      {showFileTypeStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <PieChart className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">File Type Statistics</h2>
              </div>
              <button
                onClick={() => setShowFileTypeStats(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {uploadedFiles.length} Total Files
                  </h3>
                  <p className="text-sm text-gray-600">
                    {fileTypeStats.length} different file types
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatFileSize(totalStorageSize)}
                  </div>
                  <div className="text-sm text-gray-500">Total Storage Used</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {fileTypeStats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedFileType === stat.type ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => {
                    setSelectedFileType(selectedFileType === stat.type ? null : stat.type)
                    setShowFileTypeStats(false)
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      {getFileIcon(stat.type)}
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {stat.typeName.toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {stat.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">{stat.count}</div>
                      <div className="text-sm text-gray-500">files</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Percentage</span>
                      <span className="font-medium">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-purple-600"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Size</span>
                      <span className="font-medium">{formatFileSize(stat.totalSize)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Most Common</h4>
                </div>
                {fileTypeStats.length > 0 && (
                  <>
                    <div className="text-xl font-bold text-purple-700 mb-1">
                      {fileTypeStats[0].typeName.toUpperCase()}
                    </div>
                    <div className="text-sm text-purple-600">
                      {fileTypeStats[0].count} files ({fileTypeStats[0].percentage}%)
                    </div>
                  </>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Summary</h4>
                </div>
                <div className="text-sm text-blue-700">
                  {fileTypeStats.length > 1 ? (
                    <>
                      Top 3 types cover {(
                        fileTypeStats.slice(0, 3).reduce((sum, stat) => sum + parseFloat(stat.percentage), 0)
                      ).toFixed(1)}% of all files
                    </>
                  ) : (
                    "Only one file type uploaded"
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFileTypeStats(false)}
              className="w-full mt-6 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Close Statistics
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards - Only 3 cards now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* File Count Card */}
          <div 
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowFileTypeStats(true)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <File className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{uploadedFiles.length}</div>
                <div className="text-gray-600">Total Documents</div>
              </div>
            </div>
            <div className="text-purple-600 text-sm font-medium flex items-center gap-1">
              <Info className="w-4 h-4" />
              Click to see file types
            </div>
          </div>

          {/* File Types Card */}
          <div 
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowFileTypeStats(true)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileType className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">
                  {fileTypeStats.length}
                </div>
                <div className="text-gray-600">File Types</div>
              </div>
            </div>
            <div className="text-blue-600 text-sm">
              {fileTypeStats.length > 0 && (
                <>
                  {fileTypeStats[0].typeName.toUpperCase()}: {fileTypeStats[0].count} files
                </>
              )}
            </div>
          </div>

          {/* Storage Size Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Folder className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">
                  {formatFileSize(totalStorageSize)}
                </div>
                <div className="text-gray-600">Storage Used</div>
              </div>
            </div>
            <div className="text-green-600 text-sm">Browser Local Storage</div>
          </div>
        </div>

        {/* Search Bar and File Type Filter */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {selectedFileType && (
                <button
                  onClick={() => setSelectedFileType(null)}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
              <button
                onClick={() => setShowFileTypeStats(true)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <PieChart className="w-4 h-4" />
                Filter by Type
              </button>
            </div>
          </div>
          {selectedFileType && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedFileType)}
                <div>
                  <span className="font-medium text-purple-800">
                    Showing files of type: {(selectedFileType.split('/')[1] || selectedFileType).toUpperCase()}
                  </span>
                  <p className="text-sm text-purple-600">
                    {uploadedFiles.filter(f => f.type === selectedFileType).length} files match this type
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFileType(null)}
                className="text-purple-600 hover:text-purple-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Files List */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Uploaded Files ({filteredFiles.length})</h2>
              <p className="text-sm text-gray-600 mt-1">
                {statusStats.approved} approved • {statusStats.pending} pending • User ID: group-108
              </p>
            </div>
            {uploadedFiles.length > 0 && (
              <button
                onClick={() => setShowUploader(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4" />
                Add More Files
              </button>
            )}
          </div>

          {filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">File Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">File ID</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">User ID</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Size</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Upload Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <div className="font-medium text-gray-800 truncate max-w-xs">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {file.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div 
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => handleCopyId(file.id)}
                          title="Click to copy File ID"
                        >
                          <Hash className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                          <div>
                            <div className="font-mono text-sm text-gray-600 truncate max-w-[120px] group-hover:text-purple-800">
                              {file.id}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <Copy className="w-3 h-3" />
                              Click to copy
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedFileType(file.type)
                            setShowFileTypeStats(true)
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium hover:opacity-90 transition-opacity ${getFileTypeColor(file.type)}`}
                          title={`Click to filter by ${file.type}`}
                        >
                          {(file.type.split('/')[1] || file.type).toUpperCase()}
                        </button>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(file.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                            {file.userId}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(file.uploadDate)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(file)}
                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : uploadedFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Files Uploaded Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Upload your first document to get started. All files are stored locally in your browser.
              </p>
              <button
                onClick={() => setShowUploader(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                Upload Your First File
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No files found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Documents Manager • Local Storage • File Management • Secure</p>
          <p className="mt-2 text-xs">
            {uploadedFiles.length} files • {fileTypeStats.length} file types • {formatFileSize(totalStorageSize)} used
          </p>
        </div>
      </footer>
    </div>
  )
}