import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { Header } from './components/Header'
import { ToastContainer } from './components/Toast'

import { OverviewPage } from './pages/OverviewPage'
import { ToolCatalogPage } from './pages/ToolCatalogPage'
import { ToolDetailPage } from './pages/ToolDetailPage'

import { getTools, getCategories } from './api/omnimind'
import { ThemeProvider } from './context/ThemeContext'

function AppContent() {
  const [tools, setTools] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState([])

  const location = useLocation()
  const pageContainerRef = useRef(null)

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const fetchGlobalData = async () => {
    setLoading(true)

    try {
      const [toolsRes, categoriesRes] = await Promise.all([
        getTools(),
        getCategories(),
      ])

      setTools(toolsRes)
      setCategories(categoriesRes)
    } catch (err) {
      addToast(err.message || 'Failed to connect to catalog API', 'error')
      setTools([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGlobalData()
  }, [])

  // Light GSAP page entrance transition
  useEffect(() => {
    if (pageContainerRef.current) {
      gsap.fromTo(
        pageContainerRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      )
    }
  }, [location.pathname])

  const stats = useMemo(() => {
    const usageCount = tools.reduce((total, tool) => total + (tool.usages?.length || 0), 0)
    const undocumentedCount = tools.filter((tool) => !tool.usages?.length).length

    return {
      tool_count: tools.length,
      usage_count: usageCount,
      category_count: categories.length,
      average_usages: tools.length > 0 ? usageCount / tools.length : 0,
      undocumented_count: undocumentedCount,
    }
  }, [tools, categories])

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <Header toolCount={stats.tool_count} />

      {/* Main Viewport */}
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-6 py-8">
        <div ref={pageContainerRef}>
          <Routes>
            <Route
              path="/"
              element={
                <OverviewPage
                  stats={stats}
                  tools={tools}
                  categories={categories}
                  loading={loading}
                />
              }
            />
            <Route
              path="/tools"
              element={
                <ToolCatalogPage
                  categories={categories}
                  toolCount={stats.tool_count}
                  addToast={addToast}
                />
              }
            />
            <Route
              path="/tools/:id"
              element={<ToolDetailPage addToast={addToast} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <footer className="border-t border-[#dedfda] dark:border-[#2e332a] py-6 px-6 text-xs font-mono text-[#686b64] dark:text-[#9aa092]">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 OmniMind.</span>
          <span>by Rizki</span>
        </div>
      </footer>

    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
