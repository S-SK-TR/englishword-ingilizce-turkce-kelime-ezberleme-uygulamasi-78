import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, HelpCircle, Settings } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/vocabulary', icon: BookOpen, label: 'Kelimeler' },
    { to: '/quiz', icon: HelpCircle, label: 'Test' },
    { to: '/settings', icon: Settings, label: 'Ayarlar' }
  ]

  return (
    <div className="flex h-dvh bg-[var(--bg-base)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="h-16 flex items-center justify-center border-b border-[var(--border-color)]">
          <span className="font-bold text-xl text-primary-500">VocabVault</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-[var(--bg-base)] text-[var(--text-secondary)]'}`
              }
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)]/90 backdrop-blur-md border-t border-[var(--border-color)] z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg ${isActive ? 'text-primary-500' : 'text-[var(--text-secondary)]'}`
              }
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}