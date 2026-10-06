import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowLeft, Terminal, Copy, Check, Calendar, Hash } from 'lucide-react'
import { getTool } from '../api/omnimind'

export const ToolDetailPage = ({ addToast }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [tool, setTool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const containerRef = useRef(null)

  const fetchDetail = async () => {
    setLoading(true)

    try {
      const data = await getTool(id)
      setTool(data)
    } catch (err) {
      addToast(err.message || 'Failed to load tool detail', 'error')
      navigate('/tools')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  useEffect(() => {
    if (tool && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      )
    }
  }, [tool])

  const copyCommand = async (command, index) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedIndex(index)

      setTimeout(() => {
        setCopiedIndex((prev) => (prev === index ? null : prev))
      }, 2000)
    } catch {
      addToast('Clipboard tidak tersedia', 'error')
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-[#686b64] dark:text-[#9aa092] animate-pulse">
        Loading tool detail...
      </div>
    )
  }

  if (!tool) return null

  const usages = tool.usages || []

  return (
    <div ref={containerRef} className="max-w-[860px] mx-auto space-y-10 pb-16">
      
      <div className="flex justify-between items-center border-b border-[#dedfda] dark:border-[#2e332a] pb-4">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#686b64] dark:text-[#9aa092] hover:text-[#20221f] dark:hover:text-[#e5e7e2] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog Index</span>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-[#dedfda] dark:border-[#2e332a] bg-[#ffffff] dark:bg-[#1d2019] text-[#20221f] dark:text-[#e5e7e2] rounded-[2px]">
            {tool.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#20221f] dark:text-[#e5e7e2] leading-tight">
          {tool.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 py-3 border-y border-[#dedfda] dark:border-[#2e332a] text-xs font-mono text-[#686b64] dark:text-[#9aa092]">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" /> {String(tool.id).padStart(3, '0')}
          </span>
          <span>
            Usages: <strong className="text-[#20221f] dark:text-[#e5e7e2]">{usages.length}</strong>
          </span>
          {tool.created_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(tool.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {tool.function && (
        <div className="space-y-2 border-l-2 border-[#20221f] dark:border-[#e5e7e2] pl-5 py-1">
          <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-[#686b64] dark:text-[#9aa092]">
            Function
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-[#20221f] dark:text-[#e5e7e2]">
            {tool.function}
          </p>
        </div>
      )}

      {tool.description && (
        <div className="p-4 border border-[#dedfda] dark:border-[#2e332a] bg-[#ffffff] dark:bg-[#1d2019] rounded-[3px] space-y-1">
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-[#686b64] dark:text-[#9aa092]">
            Description
          </h4>
          <p className="text-xs sm:text-sm text-[#20221f] dark:text-[#e5e7e2] whitespace-pre-wrap leading-relaxed">
            {tool.description}
          </p>
        </div>
      )}

      <div className="pt-8 border-t border-[#dedfda] dark:border-[#2e332a] space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#20221f] dark:text-[#e5e7e2]">
            Usage Recipes ({usages.length})
          </h3>
          <p className="text-xs font-mono text-[#686b64] dark:text-[#9aa092]">
            Command Examples registered for this tool
          </p>
        </div>

        {usages.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-[#686b64] border border-dashed border-[#dedfda] dark:border-[#2e332a] rounded-[3px]">
            No usage registered for this tool yet.
          </div>
        ) : (
          <div className="space-y-4">
            {usages.map((usage, index) => (
              <div
                key={usage.id ?? index}
                className="border border-[#dedfda] dark:border-[#2e332a] bg-[#ffffff] dark:bg-[#1d2019] rounded-[3px] p-4 space-y-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-mono text-[#686b64] dark:text-[#9aa092] mt-0.5">
                    {String(usage.sort_order || index + 1).padStart(2, '0')}.
                  </span>
                  <h5 className="text-sm font-semibold text-[#20221f] dark:text-[#e5e7e2] flex-1">
                    {usage.name}
                  </h5>
                </div>

                <div className="flex items-start gap-2 border border-[#dedfda] dark:border-[#2e332a] rounded-[2px] bg-[#fafaf8] dark:bg-[#141711] pl-3 pr-1.5 py-2">
                  <Terminal className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#686b64] dark:text-[#9aa092]" />
                  <code className="flex-1 text-[11px] sm:text-xs font-mono text-[#20221f] dark:text-[#e5e7e2] break-all">
                    <span className="text-[#686b64] dark:text-[#9aa092] select-none">$ </span>
                    {usage.command}
                  </code>
                  <button
                    onClick={() => copyCommand(usage.command, index)}
                    className="btn-krauq px-1.5 py-1 text-[10px] font-mono shrink-0"
                    title="Copy command"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {usage.explanation && (
                  <p className="text-xs text-[#686b64] dark:text-[#9aa092] leading-relaxed pl-5">
                    {usage.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
