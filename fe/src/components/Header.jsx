import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export const Header = ({ toolCount = 0 }) => {
  const { theme, toggleTheme, themeToggleRef } = useTheme()

  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/tools', label: 'Tool Catalog', badge: toolCount > 0 ? toolCount : null },
  ]

  return (
    <header className="border-b border-[#dedfda] dark:border-[#2e332a] bg-[#fafaf8]/80 dark:bg-[#141711]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1120px] mx-auto px-6 h-[80px] flex items-center justify-between">

        {/* Krauq Wordmark */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/oni1.png"
            alt="OmniMind"
            className="w-15 h-15 object-contain"
          />
          <span className="hidden sm:inline text-4xl font-bold tracking-tighter text-[#20221f] dark:text-[#e5e7e2] font-sans">
            omnimind
          </span>
        </Link>

        {/* Minimal Navigation */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-medium text-[#686b64] dark:text-[#9aa092]">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 transition-colors py-1 ${isActive
                  ? 'text-[#20221f] dark:text-[#e5e7e2] font-semibold border-b border-[#20221f] dark:border-[#e5e7e2]'
                  : 'hover:text-[#20221f] dark:hover:text-[#e5e7e2]'
                }`
              }
            >
              <span className='text-lg'>{item.label}</span>
              {item.badge !== null && (
                <span className="text-[10px] font-mono px-1 py-0.2 rounded-[2px] bg-[#dedfda]/60 dark:bg-[#2e332a]/60 text-[#686b64] dark:text-[#9aa092] font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme Switcher */}
        <div className="flex items-center gap-3">
          <button
            ref={themeToggleRef}
            onClick={toggleTheme}
            className="btn-krauq px-2.5 py-1 text-[11px] font-mono"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <span className="flex items-center gap-1 text-amber-400">
                <Sun className="w-3.5 h-3.5" /> Light
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#20221f]">
                <Moon className="w-3.5 h-3.5 text-slate-700" /> Dark
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  )
}
