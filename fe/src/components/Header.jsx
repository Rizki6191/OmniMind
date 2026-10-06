import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export const Header = ({ toolCount = 0 }) => {
  const { theme, toggleTheme, themeToggleRef } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/tools', label: 'Catalogues', badge: toolCount > 0 ? toolCount : null },
  ]

  return (
    <header className="border-b border-[#dedfda] dark:border-[#2e332a] bg-[#fafaf8]/80 dark:bg-[#141711]/80 backdrop-blur-md sticky top-0 z-40">

      <div className="max-w-[1120px] mx-auto px-6 h-[80px] flex items-center justify-between">

        {/* Left Side */}
        <div className="flex items-center gap-2">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-[#20221f] dark:text-[#e5e7e2]"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group sm:static absolute left-1/2 -translate-x-1/2 sm:translate-x-0"
          >
            <img
              src="/oni1.png"
              alt="OmniMind"
              className="hidden sm:inline w-15 h-15 object-contain"
            />

            <span className="text-3xl font-bold tracking-tighter text-[#20221f] dark:text-[#e5e7e2] font-sans">
              OmniMind
            </span>
          </Link>

        </div>


        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6 sm:gap-8 text-xs font-medium text-[#686b64] dark:text-[#9aa092]">
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
              <span className="text-lg">{item.label}</span>
            </NavLink>
          ))}
        </nav>


        {/* Theme Switcher */}
        <div className="flex items-center gap-3">

          <button
            ref={themeToggleRef}
            onClick={toggleTheme}
            className="btn-krauq px-1.5 py-0.5 text-[9px] sm:px-2.5 sm:py-1 sm:text-[11px] font-mono"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <span className="flex items-center gap-1 text-amber-400">
                <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#20221f]">
                <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-700" />
                
              </span>
            )}
          </button>

        </div>

      </div>


      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#dedfda] dark:border-[#2e332a] bg-[#fafaf8] dark:bg-[#141711]">

          <nav className="max-w-[1120px] mx-auto px-6 py-3 flex flex-col">

            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between py-3 text-base transition-colors ${isActive
                    ? 'text-[#20221f] dark:text-[#e5e7e2] font-semibold'
                    : 'text-[#686b64] dark:text-[#9aa092]'
                  }`
                }
              >
                <span>{item.label}</span>

                {item.badge !== null && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#dedfda]/60 dark:bg-[#2e332a]/60 text-[#686b64] dark:text-[#9aa092] font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

          </nav>

        </div>
      )}

    </header>
  )
}