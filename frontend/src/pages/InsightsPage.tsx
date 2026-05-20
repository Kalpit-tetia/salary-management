import { useState } from 'react'
import { cn } from '../lib/utils'
import { OrgOverview } from '../components/insights/OrgOverview'
import { CountryInsights } from '../components/insights/CountryInsights'
import { DepartmentInsights } from '../components/insights/DepartmentInsights'

const TABS = [
  { id: 'overview', label: 'Org Overview' },
  { id: 'country', label: 'By Country' },
  { id: 'department', label: 'By Department' },
] as const

type Tab = (typeof TABS)[number]['id']

export function InsightsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Insights</h1>
        <p className="text-sm text-gray-500 mt-1">
          Compensation analytics to help you make informed HR decisions.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'pb-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && <OrgOverview />}
      {activeTab === 'country' && <CountryInsights />}
      {activeTab === 'department' && <DepartmentInsights />}
    </div>
  )
}
