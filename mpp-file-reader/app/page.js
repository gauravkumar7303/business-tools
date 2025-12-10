
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileSpreadsheet, Building, FileText, ArrowRight, Menu, X } from 'lucide-react'
import ThemeToggle from '@/src/components/ThemeToggle'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const platforms = [
    {
      id: 'mpp-viewer',
      title: 'MPP File Reader',
      description: 'Upload and analyze Microsoft Project files with Gantt charts, risk analysis, and resource tracking',
      icon: '/Logos/MS_Project_Logo.png', // Path to your MPP logo
      color: 'from-blue-500 to-blue-600',
      // bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      route: '/mpp-viewer'
    },
    {
      id: 'business-central',
      title: 'Business Central',
      description: 'Business analytics, financial reports, inventory management and sales tracking',
      icon: '/Logos/Business central logo.jpg', // Path to your Business Central logo
      color: 'from-green-500 to-green-600',
      // bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      route: '/business-central'
    },
    {
      id: 'documents',
      title: 'Documents Manager',
      description: 'Document storage, processing, and collaboration with AI-powered insights',
      icon: '/Logos/sharepointlogo.png', // Path to your Documents logo
      color: 'from-purple-500 to-purple-600',
      // bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      route: '/documents'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            {/* Logo / Title */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <div className="hidden sm:block rounded-lg">
                  <div className="relative w-24 h-14">
                    <Image
                      src="/Logos/mainlogo.png"
                      alt="Business Tools Logo"
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    Business Tools
                  </h1>
                  <p className="hidden sm:block text-sm text-gray-600">
                    One platform for all your business needs
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Theme toggle */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {/* Mobile only tagline */}
              <p className="sm:hidden text-xs text-gray-600">
                Business Tools
              </p>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      router.push(platform.route)
                      setMobileMenuOpen(false)
                    }}
                    className={`p-3 rounded-lg ${platform.bgColor} text-left flex items-center gap-3`}
                  >
                    <div className={`p-2 rounded-lg ${platform.bgColor} w-12 h-12 flex items-center justify-center`}>
                      {typeof platform.icon === 'string' ? (
                        <div className="relative w-10 h-10">
                          <Image
                            src={platform.icon}
                            alt={`${platform.title} Logo`}
                            fill
                            className="object-contain"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        platform.icon
                      )}
                    </div>
                    <div>
                      <div className={`font-semibold ${platform.textColor}`}>
                        {platform.title}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {platform.description.substring(0, 50)}...
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your Platform
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Choose from our specialized tools for project management, business analytics, or document processing
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="relative group"
              onMouseEnter={() => setHoveredCard(platform.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card */}
              <div 
                className={`
                  bg-white 
                  rounded-2xl shadow-lg 
                  p-6 md:p-8 h-full
                  transform transition-all duration-300
                  ${hoveredCard === platform.id 
                    ? 'scale-105 shadow-xl' 
                    : 'hover:shadow-md'
                  }
                  border-2 border-transparent
                  hover:border-opacity-20
                  cursor-pointer
                  transition-colors duration-300
                `}
                onClick={() => router.push(platform.route)}
              >
                {/* Icon/Logo Container */}
                <div className={`
                  w-16 h-16 sm:w-20 sm:h-20 
                  rounded-2xl mb-4 md:mb-6
                  flex items-center justify-center
                  shadow-lg
                  ${hoveredCard === platform.id ? 'scale-110' : ''}
                  transition-transform duration-300
                  overflow-hidden
                `}>
                  {typeof platform.icon === 'string' ? (
                    <div className="relative w-12 h-12 md:w-16 md:h-16">
                      <Image
                        src={platform.icon}
                        alt={`${platform.title} Logo`}
                        fill
                        className="object-contain p-1"
                        sizes="(max-width: 768px) 48px, 64px"
                      />
                    </div>
                  ) : (
                    <div className="text-white">
                      {platform.icon}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {platform.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm sm:text-base">
                  {platform.description}
                </p>

                {/* CTA Button */}
                <div className="mt-auto">
                  <button className={`
                    flex items-center justify-center gap-2
                    px-4 py-2 md:px-5 md:py-3 rounded-lg font-medium
                    transition-all duration-300 w-full
                    ${hoveredCard === platform.id
                      ? `${platform.bgColor} ${platform.textColor}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}>
                    <span>Open Platform</span>
                    <ArrowRight className={`
                      w-4 h-4 transition-transform duration-300
                      ${hoveredCard === platform.id ? 'translate-x-1' : ''}
                    `} />
                  </button>
                </div>
              </div>

              {/* Gradient glow effect */}
              <div className={`
                absolute inset-0 rounded-2xl -z-10
                bg-gradient-to-br ${platform.color}
                opacity-0 blur-xl
                transition-opacity duration-300
                ${hoveredCard === platform.id ? 'opacity-20' : ''}
              `} />
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            All platforms work independently
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-500 text-sm">
                © 2025 Business Tools Platform
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.push('/mpp-viewer')}
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors flex items-center gap-1"
              >
                <div className="relative w-4 h-4">
                  <Image
                    src="/Logos/MS_Project_Logo.png"
                    alt="MPP Reader Icon"
                    fill
                    className="object-contain"
                    sizes="16px"
                  />
                </div>
                <span>MPP Reader</span>
              </button>
              <button 
                onClick={() => router.push('/business-central')}
                className="text-gray-600 hover:text-green-600 text-sm transition-colors flex items-center gap-1"
              >
                <div className="relative w-4 h-4">
                  <Image
                    src="/Logos/Business central logo.jpg"
                    alt="Business Central Icon"
                    fill
                    className="object-contain"
                    sizes="16px"
                  />
                </div>
                <span>Business Central</span>
              </button>
              <button 
                onClick={() => router.push('/documents')}
                className="text-gray-600 hover:text-purple-600 text-sm transition-colors flex items-center gap-1"
              >
                <div className="relative w-4 h-4">
                  <Image
                    src="/Logos/sharepointlogo.png"
                    alt="Documents Icon"
                    fill
                    className="object-contain"
                    sizes="16px"
                  />
                </div>
                <span>Documents</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}