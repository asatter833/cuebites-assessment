import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getDashboardData } from "@/app/api/dashboard/summary";

// Define the interface for the StatCard props
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down";
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data.success || !data.stats) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-xl border-slate-200">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          Failed to load dashboard metrics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h2>
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
          System Overview & Analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Staff"
          value={data.stats.totalStaff.value}
          change={data.stats.totalStaff.change}
          icon={<Users className="size-4" />}
          trend={data.stats.totalStaff.trend}
        />
        <StatCard
          title="Active Schedules"
          value={data.stats.activeSchedules.value}
          icon={<Calendar className="size-4" />}
        />
        <StatCard
          title="Utilization"
          value={data.stats.utilization.value}
          change={data.stats.utilization.change}
          icon={<TrendingUp className="size-4" />}
          trend={data.stats.utilization.trend}
        />
        <StatCard
          title="Pending Tasks"
          value={data.stats.pendingTasks.value}
          icon={<Clock className="size-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Chart Area */}
        <Card className="md:col-span-4 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="size-8 opacity-20" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Analytics Visualization
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-3 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {data.recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-1.5 rounded-full",
                        log.type === "danger" ? "bg-red-500" : "bg-blue-500"
                      )}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {log.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {log.action}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

{
  /* --- Reusable Typed Component --- */
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-slate-100 rounded-md text-slate-600">
            {icon}
          </div>
          {change && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-bold px-1.5 h-5 border-none",
                trend === "up"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="size-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="size-3 mr-0.5" />
              )}
              {change}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
