import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { Search, RotateCcw, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { ToolCard } from '../components/ToolCard'
import { getTools } from '../api/omnimind'

const PAGE_SIZE = 12

export const ToolCatalogPage = ({ categories, toolCount, addToast }) => {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || ''

  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(categoryParam)
  const [page, setPage] = useState(1)

  const containerRef = useRef(null)

  const loadTools = async (category) => {
    setLoading(true)

    try {
      const data = await getTools({ category })
      setTools(data)
    } catch (err) {
      addToast(err.message || 'Failed to fetch tools', 'error')
      setTools([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCategoryFilter(categoryParam)
  }, [categoryParam])

  useEffect(() => {
    loadTools(categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [categoryFilter])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) return tools

    return tools.filter((tool) =>
      [tool.name, tool.function, tool.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(keyword))
    )
  }, [tools, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [search, categoryFilter])

  const visible = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const resetFilters = () => {
    setSearch('')
    setCategoryFilter('')
  }

  const hasFilters = Boolean(search || categoryFilter)

  return (
    <div ref={containerRef} className="max-w-[1120px] mx-auto space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#dedfda] dark:border-[#2e332a] pb-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#20221f] dark:text-[#e5e7e2]">
            Tool Catalog Index
          </h1>
          <p className="text-xs font-mono text-[#686b64] dark:text-[#9aa092]">
            {filtered.length} of {toolCount} tools indexed
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 py-3 border-b border-[#dedfda] dark:border-[#2e332a]">
        
        <div className="flex-1 min-w-[220px] relative">
          {/* <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#686b64]" /> */}
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-krauq w-full pl-8"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-krauq font-mono text-xs"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="btn-krauq text-xs flex items-center gap-1 font-mono"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-[#686b64] dark:text-[#9aa092] animate-pulse">
          Loading index...
        </div>
      ) : visible.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#dedfda] dark:border-[#2e332a] rounded-[3px] space-y-2">
          <HelpCircle className="w-6 h-6 mx-auto text-[#686b64]" />
          <p className="text-xs font-mono text-[#686b64]">
            No tools found matching filter query.
          </p>
        </div>
      ) : (
        <div className="krauq-list-container divide-y divide-[#dedfda] dark:divide-[#2e332a] border-y border-[#dedfda] dark:border-[#2e332a]">
          {visible.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 text-xs font-mono text-[#686b64]">
          <span>
            Showing {visible.length} of {filtered.length} tools
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="btn-krauq p-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 border border-[#dedfda] dark:border-[#2e332a] rounded-[2px] bg-[#ffffff] dark:bg-[#1d2019]">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="btn-krauq p-1.5 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && tools.length === 0 && (
        <p className="text-xs font-mono text-center text-[#686b64] dark:text-[#9aa092]">
          Isi katalog dengan{' '}
          <code className="text-[#20221f] dark:text-[#e5e7e2]">go run . import data/nmap.ymal</code>
        </p>
      )}

    </div>
  )
}
