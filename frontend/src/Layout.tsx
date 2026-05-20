import { NavLink, Outlet } from 'react-router-dom'
import { Users, BarChart3, Building2 } from 'lucide-react'
import { cn } from './lib/utils'

const NAV = [
  { to: '/', label: 'Employees', icon: Users, end: true },
  { to: '/insights', label: 'Salary Insights', icon: BarChart3, end: false },
]

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">SalaryIQ</p>
              <p className="text-xs text-gray-400">HR Management</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">v1.0.0 · Salary Management</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8">
        <Outlet />
      </main>
    </div>
  )
}
