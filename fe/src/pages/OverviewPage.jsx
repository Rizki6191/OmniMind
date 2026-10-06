import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight, Lock, Database, Folder, HelpCircle } from 'lucide-react'
import { ToolCard } from '../components/ToolCard'

export const OverviewPage = ({ stats, tools, categories, loading }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.krauq-intro',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const statItems = [
    { label: 'Indexed Tools', val: stats.tool_count },
    { label: 'Registered Usages', val: stats.usage_count },
    { label: 'Categories', val: stats.category_count },
    { label: 'Avg Usages / Tool', val: stats.average_usages.toFixed(1) },
    { label: 'Tools Without Usage', val: stats.undocumented_count },
  ]

  const topCategory = categories[0] || ''
  const preview = tools.slice(0, 5)

  return (
    <div ref={containerRef} className="max-w-[1120px] mx-auto space-y-12 pb-12">
      
      <section className="krauq-intro grid grid-cols-1 lg:grid-cols-3 gap-8 items-end pt-8 pb-10 border-b border-[#dedfda] dark:border-[#2e332a]">
        <div className="lg:col-span-2 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#686b64] dark:text-[#9aa092]">
            {/* <span className="w-2 h-2 rounded-full bg-[#20221f] dark:bg-[#e5e7e2]" /> */}
            <span>Read-Only Tool Catalog System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#20221f] dark:text-[#e5e7e2] leading-[1.08]">
            OmniMind Tool Catalog.<br />
            <span className="text-[#686b64] dark:text-[#9aa092]">Command Reference Engine.</span>
          </h1>
        </div>

        <div className="space-y-4 lg:pl-6 border-l-0 lg:border-l border-[#dedfda] dark:border-[#2e332a]">
          <p className="text-xs sm:text-sm text-[#686b64] dark:text-[#9aa092] leading-relaxed">
            Browse every cataloged tool, inspect its function, and copy ready-to-run usage commands.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/tools"
              className="btn-krauq-primary flex items-center justify-between w-full sm:w-auto"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {topCategory ? (
              <Link
                to={`/tools?category=${encodeURIComponent(topCategory)}`}
                className="btn-krauq flex items-center justify-between w-full sm:w-auto"
              >
                <span>Top: {topCategory}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="btn-krauq opacity-60 pointer-events-none text-xs font-mono">
                No Categories (0)
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-4 border-b border-[#dedfda] dark:border-[#2e332a]">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#686b64] dark:text-[#9aa092] mb-4">
          Catalog Indexes & Metrics
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {statItems.map((st, i) => (
            <div key={i} className="space-y-1">
              <span className="text-2xl font-bold font-mono text-[#20221f] dark:text-[#e5e7e2]">
                {st.val}
              </span>
              <div className="text-xs font-mono text-[#686b64] dark:text-[#9aa092]">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-[#20221f] dark:text-[#e5e7e2] tracking-tight">
            Catalog Preview
          </h2>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#686b64] dark:text-[#9aa092] hover:text-[#20221f] dark:hover:text-[#e5e7e2] transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs font-mono text-[#686b64] dark:text-[#9aa092] animate-pulse">
            Loading catalog...
          </div>
        ) : preview.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-[#dedfda] dark:border-[#2e332a] rounded-[3px] space-y-2">
            <HelpCircle className="w-6 h-6 mx-auto text-[#686b64]" />
            <p className="text-xs font-mono text-[#686b64] dark:text-[#9aa092]">
              Catalog masih kosong. Import YAML lewat CLI untuk menambah tool.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#dedfda] dark:divide-[#2e332a] border-y border-[#dedfda] dark:border-[#2e332a]">
            {preview.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        
        <article className="border-l border-[#dedfda] dark:border-[#2e332a] pl-5 space-y-2">
          <Lock className="w-4 h-4 text-[#686b64] dark:text-[#9aa092]" />
          <h2 className="text-sm font-medium text-[#20221f] dark:text-[#e5e7e2] tracking-tight">
            Strictly read-only surface.
          </h2>
          <p className="text-xs text-[#686b64] dark:text-[#9aa092] leading-relaxed">
            Frontend hanya melakukan request GET. Semua perubahan katalog dijalankan lewat CLI.
          </p>
        </article>

        <article className="border-l border-[#dedfda] dark:border-[#2e332a] pl-5 space-y-2">
          <Database className="w-4 h-4 text-[#686b64] dark:text-[#9aa092]" />
          <h2 className="text-sm font-medium text-[#20221f] dark:text-[#e5e7e2] tracking-tight">
            YAML-sourced records.
          </h2>
          <p className="text-xs text-[#686b64] dark:text-[#9aa092] leading-relaxed">
            Setiap tool diimpor dari berkas YAML, lengkap dengan function, description, dan usage.
          </p>
        </article>

        <article className="border-l border-[#dedfda] dark:border-[#2e332a] pl-5 space-y-2">
          <Folder className="w-4 h-4 text-[#686b64] dark:text-[#9aa092]" />
          <h2 className="text-sm font-medium text-[#20221f] dark:text-[#e5e7e2] tracking-tight">
            Category taxonomy.
          </h2>
          <p className="text-xs text-[#686b64] dark:text-[#9aa092] leading-relaxed">
            Tools dikelompokkan per kategori dan dapat difilter langsung dari server catalog.
          </p>
        </article>

      </section>

    </div>
  )
}
