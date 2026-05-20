import { Users, DollarSign, Globe, Building2, TrendingUp } from 'lucide-react'
import { useOrgOverview } from '../../hooks/useInsights'
import { formatSalary, formatNumber } from '../../lib/utils'

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function OrgOverview() {
  const { data, isLoading } = useOrgOverview()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-28 animate-pulse bg-gray-100" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const activeRate = ((data.activeEmployees / data.totalEmployees) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={formatNumber(data.totalEmployees)}
          sub={`${activeRate}% active`}
          color="bg-blue-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Headcount"
          value={formatNumber(data.activeEmployees)}
          color="bg-green-500"
        />
        <StatCard
          icon={DollarSign}
          label="Avg Salary"
          value={formatSalary(data.avgSalary)}
          sub="across active employees"
          color="bg-purple-500"
        />
        <StatCard
          icon={Globe}
          label="Countries"
          value={String(data.countriesCount)}
          sub="with active employees"
          color="bg-orange-500"
        />
        <StatCard
          icon={Building2}
          label="Departments"
          value={String(data.departmentsCount)}
          color="bg-rose-500"
        />
      </div>

      {/* Top paid employees */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Top 10 Highest Paid Employees</h3>
        <div className="space-y-2">
          {data.topPaidEmployees.map((emp, i) => (
            <div key={emp.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <span className="w-6 text-xs text-gray-400 font-mono">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{emp.fullName}</p>
                <p className="text-xs text-gray-400">{emp.jobTitle} · {emp.country}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatSalary(emp.salary)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
