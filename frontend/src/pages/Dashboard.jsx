import { Activity, Brain, FileText, Users } from "lucide-react";

const stats = [
  {
    title: "Total Patients",
    value: "0",
    icon: Users,
  },
  {
    title: "Total Scans",
    value: "0",
    icon: Activity,
  },
  {
    title: "AI Analyses",
    value: "0",
    icon: Brain,
  },
  {
    title: "Reports",
    value: "0",
    icon: FileText,
  },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of your medical imaging and AI analysis activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-600/10 p-3 text-blue-400">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="font-semibold text-white">Recent Scans</h2>

        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-slate-500">
            No scans available yet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;