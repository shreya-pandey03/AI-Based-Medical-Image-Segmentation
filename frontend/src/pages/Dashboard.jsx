import {
  Activity,
  Brain,
  FileText,
  Users,
  Upload,
  UserPlus,
  ClipboardPlus,
} from "lucide-react";

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
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">Recent Scans</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest medical image scans
              </p>
            </div>

            <Activity size={20} className="text-slate-500" />
          </div>

          <div className="flex min-h-48 items-center justify-center">
            <div className="text-center">
              <Activity size={32} className="mx-auto text-slate-700" />
              <p className="mt-3 text-sm text-slate-500">
                No scans available yet
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">Quick Actions</h2>

          <div className="mt-5 space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-left transition hover:border-blue-500/50 hover:bg-slate-800">
              <Upload size={18} className="text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">Upload Scan</p>
                <p className="text-xs text-slate-500">Upload a medical image</p>
              </div>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-left transition hover:border-blue-500/50 hover:bg-slate-800">
              <UserPlus size={18} className="text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Add Patient</p>
                <p className="text-xs text-slate-500">
                  Create a patient record
                </p>
              </div>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 text-left transition hover:border-blue-500/50 hover:bg-slate-800">
              <ClipboardPlus size={18} className="text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">View Reports</p>
                <p className="text-xs text-slate-500">
                  Open diagnostic reports
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
