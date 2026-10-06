import React from 'react'
import { Link } from 'react-router-dom'
import { Terminal, ChevronRight } from 'lucide-react'

export const ToolCard = ({ tool }) => {
  const usageCount = tool.usages?.length || 0

  return (
    <div className="krauq-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 group px-2 py-3.5 transition-colors">
      
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 border border-[#dedfda] dark:border-[#2e332a] bg-[#ffffff] dark:bg-[#1d2019] text-[#20221f] dark:text-[#e5e7e2] rounded-[2px]">
            {tool.category}
          </span>
        </div>

        <Link
          to={`/tools/${tool.id}`}
          className="text-sm font-semibold text-[#20221f] dark:text-[#e5e7e2] group-hover:underline flex items-center gap-1 tracking-tight"
        >
          <span className="truncate">{tool.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#686b64] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </Link>

        {tool.function && (
          <p className="text-xs text-[#686b64] dark:text-[#9aa092] line-clamp-1 max-w-2xl font-sans">
            {tool.function}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 border-[#dedfda] dark:border-[#2e332a] pt-2 sm:pt-0">
        <span className="text-[10px] font-mono text-[#686b64] dark:text-[#9aa092] border border-[#dedfda] dark:border-[#2e332a] px-1.5 py-0.5 rounded-[2px]">
          #{String(tool.id).padStart(3, '0')}
        </span>

        <div
          className="flex items-center gap-1 text-[#686b64] dark:text-[#9aa092]"
          title={`${usageCount} usage`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono">{usageCount}</span>
        </div>
      </div>

    </div>
  )
}
