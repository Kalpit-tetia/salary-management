import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useCountryInsights, useTitleInsights, useCountries } from '../../hooks/useInsights'
import { formatSalary, formatNumber } from '../../lib/utils'

function SalaryStatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{formatSalary(value)}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

const CHART_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
]

export function CountryInsights() {
  const { data: countries } = useCountries()
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const country = selectedCountry || countries?.[0] || ''

  const { data: insights, isLoading: loadingInsights } = useCountryInsights(country)
  const { data: titleInsights, isLoading: loadingTitles } = useTitleInsights(country)

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {countries?.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {insights && (
          <span className="text-sm text-gray-400">
            {formatNumber(insights.headcount)} active employees
          </span>
        )}
      </div>

      {loadingInsights ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      ) : insights ? (
        <>
          {/* Salary distribution cards */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Salary Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SalaryStatCard label="Minimum" value={insights.minSalary} />
              <SalaryStatCard label="25th Percentile" value={insights.p25Salary} />
              <SalaryStatCard label="Median" value={insights.medianSalary} />
              <SalaryStatCard label="Average" value={insights.avgSalary} />
              <SalaryStatCard label="75th Percentile" value={insights.p75Salary} />
              <SalaryStatCard label="Maximum" value={insights.maxSalary} />
              <div className="bg-blue-50 rounded-lg p-4 text-center md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Salary Spread</p>
                <p className="text-lg font-bold text-blue-700">
                  {formatSalary(insights.maxSalary - insights.minSalary)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">max − min range</p>
              </div>
            </div>
          </div>

          {/* Salary range visual */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Salary Range Visual</h3>
            <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
              {(() => {
                const min = insights.minSalary
                const max = insights.maxSalary
                const range = max - min
                const p25 = ((insights.p25Salary - min) / range) * 100
                const median = ((insights.medianSalary - min) / range) * 100
                const p75 = ((insights.p75Salary - min) / range) * 100
                return (
                  <>
                    <div
                      className="absolute h-full bg-blue-200"
                      style={{ left: `${p25}%`, width: `${p75 - p25}%` }}
                    />
                    <div
                      className="absolute h-full w-1 bg-blue-600"
                      style={{ left: `${median}%` }}
                      title={`Median: ${formatSalary(insights.medianSalary)}`}
                    />
                  </>
                )
              })()}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatSalary(insights.minSalary)}</span>
              <span className="text-blue-600 font-medium">← IQR (P25–P75) →</span>
              <span>{formatSalary(insights.maxSalary)}</span>
            </div>
          </div>
        </>
      ) : null}

      {/* Title breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Average Salary by Job Title in {country}
        </h3>
        {loadingTitles ? (
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        ) : titleInsights && titleInsights.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={Math.max(300, titleInsights.slice(0, 15).length * 36)}>
              <BarChart
                data={titleInsights.slice(0, 15)}
                layout="vertical"
                margin={{ left: 20, right: 60, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="jobTitle"
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: number) => [formatSalary(value), 'Avg Salary']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="avgSalary" radius={[0, 4, 4, 0]}>
                  {titleInsights.slice(0, 15).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Table view */}
            <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Job Title</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Headcount</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Min</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Avg</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {titleInsights.map((t) => (
                    <tr key={t.jobTitle} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{t.jobTitle}</td>
                      <td className="px-4 py-2 text-right text-gray-500">{t.headcount}</td>
                      <td className="px-4 py-2 text-right text-gray-500">{formatSalary(t.minSalary)}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900">{formatSalary(t.avgSalary)}</td>
                      <td className="px-4 py-2 text-right text-gray-500">{formatSalary(t.maxSalary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-sm">No data for selected country.</p>
        )}
      </div>
    </div>
  )
}
