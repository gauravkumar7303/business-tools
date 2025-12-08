// 'use client'

// import { useState, useRef } from 'react'
// import { Upload, File, X, Check, AlertCircle } from 'lucide-react'

// export default function FileUpload({ onFileUpload, acceptedTypes = '.mpp', maxSize = 100 }) {
//   const [file, setFile] = useState(null)
//   const [isDragging, setIsDragging] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const fileInputRef = useRef(null)

//   const handleFileSelect = (selectedFile) => {
//     // Check file size (MB mein)
//     const fileSizeMB = selectedFile.size / (1024 * 1024)
//     if (fileSizeMB > maxSize) {
//       alert(`File size must be less than ${maxSize}MB`)
//       return
//     }

//     // Check file type
//     const fileExt = selectedFile.name.split('.').pop()?.toLowerCase()
//     const acceptedExts = acceptedTypes.split(',').map(ext => ext.replace('.', '').trim())
    
//     if (!acceptedExts.includes(fileExt || '')) {
//       alert(`Only ${acceptedTypes} files are allowed`)
//       return
//     }

//     // Simulate upload progress
//     setUploadProgress(0)
//     setFile(selectedFile)
    
//     const interval = setInterval(() => {
//       setUploadProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(interval)
//           onFileUpload(selectedFile)
//           return 100
//         }
//         return prev + 10
//       })
//     }, 100)
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     setIsDragging(true)
//   }

//   const handleDragLeave = (e) => {
//     e.preventDefault()
//     setIsDragging(false)
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     setIsDragging(false)
    
//     const droppedFile = e.dataTransfer.files[0]
//     if (droppedFile) {
//       handleFileSelect(droppedFile)
//     }
//   }

//   const handleFileInput = (e) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile) {
//       handleFileSelect(selectedFile)
//     }
//   }

//   const removeFile = () => {
//     setFile(null)
//     setUploadProgress(0)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const sizes = ['Bytes', 'KB', 'MB', 'GB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       <div
//         className={`
//           border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
//           ${isDragging 
//             ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg' 
//             : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//           }
//           ${file ? 'border-green-500 bg-green-50' : ''}
//         `}
//         onClick={() => fileInputRef.current?.click()}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           accept={acceptedTypes}
//           onChange={handleFileInput}
//         />
        
//         <div className="flex flex-col items-center justify-center space-y-6">
//           <div className={`p-5 rounded-full ${file ? 'bg-green-100' : 'bg-blue-100'}`}>
//             {file ? (
//               <Check className="w-16 h-16 text-green-600" />
//             ) : (
//               <Upload className="w-16 h-16 text-blue-600" />
//             )}
//           </div>
          
//           {file ? (
//             <>
//               <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm">
//                 <File className="w-10 h-10 text-green-600" />
//                 <div className="text-left">
//                   <h4 className="font-bold text-gray-800 text-lg">{file.name}</h4>
//                   <p className="text-gray-600 text-sm">{formatFileSize(file.size)} • MPP File</p>
//                 </div>
//               </div>
              
//               {/* Progress Bar */}
//               {uploadProgress < 100 && (
//                 <div className="w-full max-w-md">
//                   <div className="flex justify-between text-sm text-gray-600 mb-2">
//                     <span>Uploading...</span>
//                     <span>{uploadProgress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div 
//                       className="bg-green-600 h-3 rounded-full transition-all duration-300"
//                       style={{ width: `${uploadProgress}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               )}
              
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   removeFile()
//                 }}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//                 Remove File
//               </button>
//             </>
//           ) : (
//             <>
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Drop your MPP file here</h3>
//                 <p className="text-gray-600 mb-6">or click to browse files</p>
//               </div>
              
//               <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
//                 <Upload className="w-6 h-6" />
//                 Select Microsoft Project File
//               </button>
              
//               <div className="flex items-center gap-2 text-gray-500 text-sm">
//                 <AlertCircle className="w-4 h-4" />
//                 <span>Supports .mpp files up to {maxSize}MB</span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
      
//       {/* File Requirements */}
//       {!file && (
//         <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
//           <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5" />
//             File Requirements
//           </h4>
//           <ul className="text-blue-700 text-sm space-y-1">
//             <li>• Only Microsoft Project (.mpp) files are supported</li>
//             <li>• Maximum file size: {maxSize}MB</li>
//             <li>• File processing happens locally in your browser</li>
//             <li>• No data is uploaded to any server</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, File, X, Check, AlertCircle } from 'lucide-react'

export default function FileUpload({ 
  onFileUpload, 
  acceptedTypes = '.mpp,.pdf,.doc,.docx,.txt,.jpg,.png',
  maxSize = 100 
}) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const uploadCompletedRef = useRef(false)

  const handleFileSelect = useCallback((selectedFile) => {
    // Reset flags
    uploadCompletedRef.current = false
    
    // Check file size (MB mein)
    const fileSizeMB = selectedFile.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    // Check file type
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase()
    const acceptedExts = acceptedTypes.split(',').map(ext => ext.replace('.', '').trim())
    
    if (!acceptedExts.includes(fileExt || '')) {
      alert(`Only ${acceptedTypes} files are allowed`)
      return
    }

    // Start upload
    setIsUploading(true)
    setUploadProgress(0)
    setFile(selectedFile)
    
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        
        // Create file data
        const fileData = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type || 'application/octet-stream',
          uploadDate: new Date().toISOString(),
          url: URL.createObjectURL(selectedFile)
        }
        
        // Save to localStorage
        saveFileToStorage(fileData)
        
        // Call parent callback with slight delay to avoid render conflict
        setTimeout(() => {
          onFileUpload?.(fileData)
          setIsUploading(false)
          uploadCompletedRef.current = true
        }, 100)
      }
    }, 100)
  }, [maxSize, acceptedTypes, onFileUpload])

  // Save file to localStorage
  const saveFileToStorage = useCallback((fileData) => {
    try {
      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
      
      // Check if file already exists (by name and size)
      const fileExists = storedFiles.some(
        f => f.name === fileData.name && f.size === fileData.size
      )
      
      if (!fileExists) {
        storedFiles.push(fileData)
        localStorage.setItem('uploadedFiles', JSON.stringify(storedFiles))
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    uploadCompletedRef.current = false
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }
          ${file ? 'border-green-500 bg-green-50' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className={`p-5 rounded-full ${file ? 'bg-green-100' : 'bg-blue-100'}`}>
            {file ? (
              <Check className="w-16 h-16 text-green-600" />
            ) : (
              <Upload className="w-16 h-16 text-blue-600" />
            )}
          </div>
          
          {file ? (
            <>
              <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm">
                <File className="w-10 h-10 text-green-600" />
                <div className="text-left">
                  <h4 className="font-bold text-gray-800 text-lg">{file.name}</h4>
                  <p className="text-gray-600 text-sm">{formatFileSize(file.size)}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date().toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              {uploadProgress < 100 && (
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                  {isUploading ? 'Uploading...' : 'Remove File'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Drop your files here</h3>
                <p className="text-gray-600 mb-6">or click to browse files</p>
              </div>
              
              <button 
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                disabled={isUploading}
              >
                <Upload className="w-6 h-6" />
                {isUploading ? 'Uploading...' : 'Select Files to Upload'}
              </button>
              
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Supports {acceptedTypes} files up to {maxSize}MB</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* File Requirements */}
      {!file && (
        <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            File Requirements
          </h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Supported formats: {acceptedTypes}</li>
            <li>• Maximum file size: {maxSize}MB</li>
            <li>• Files are saved in your browser's storage</li>
            <li>• Data persists after page refresh</li>
          </ul>
        </div>
      )}
    </div>
  )
}