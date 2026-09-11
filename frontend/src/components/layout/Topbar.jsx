import { Bell, User } from "lucide-react";

function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur md:px-6">
      <div>
        <p className="text-sm text-slate-400">Medical Imaging</p>
        <h2 className="font-semibold text-white">AI Segmentation Platform</h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white">
          <Bell size={19} />
        </button>

        <button className="flex items-center gap-2 rounded-lg p-2 text-slate-300 hover:bg-slate-900">
          <User size={19} />
          <span className="hidden text-sm sm:block">Account</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;