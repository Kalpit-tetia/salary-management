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
import { useDepartmentInsights } from '../../hooks/useInsights'
import { formatSalary, formatNumber } from '../../lib/utils'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1']

export function DepartmentInsights() {
  const { data, isLoading } = useDepartmentInsights()

  if (isLoading) return <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
  if (!data?.length) return null

  const totalPayroll = data.reduce((s, d) => s + d.totalPayroll, 0)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Headcount by Department</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [formatNumber(v), 'Headcount']} />
            <Bar dataKey="headcount" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Avg Salary by Department</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={[...data].sort((a, b) => b.avgSalary - a.avgSalary)} margin={{ left: 10, right: 20, top: 5, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [formatSalary(v), 'Avg Salary']} />
            <Bar dataKey="avgSalary" radius={[4, 4, 0, 0]}>
              {[...data].sort((a, b) => b.avgSalary - a.avgSalary).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payroll breakdown table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Payroll Breakdown</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Department</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Headcount</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Avg Salary</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total Payroll</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">% of Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((d) => (
              <tr key={d.department} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">{d.department}</td>
                <td className="px-4 py-2 text-right text-gray-500">{formatNumber(d.headcount)}</td>
                <td className="px-4 py-2 text-right text-gray-700">{formatSalary(d.avgSalary)}</td>
                <td className="px-4 py-2 text-right font-medium text-gray-900">{formatSalary(d.totalPayroll)}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${(d.totalPayroll / totalPayroll) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-500 w-10 text-right">
                      {((d.totalPayroll / totalPayroll) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
