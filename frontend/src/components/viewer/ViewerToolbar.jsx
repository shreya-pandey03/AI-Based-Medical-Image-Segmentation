import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

const ViewerToolbar = ({
  zoom,
  showOverlay,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleOverlay,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2">
      <button
        onClick={onZoomOut}
        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
        title="Zoom out"
      >
        <ZoomOut size={18} />
      </button>

      <span className="min-w-16 text-center text-sm text-slate-300">
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={onZoomIn}
        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
        title="Zoom in"
      >
        <ZoomIn size={18} />
      </button>

      <button
        onClick={onReset}
        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
        title="Reset zoom"
      >
        <RotateCcw size={18} />
      </button>

      <div className="mx-1 h-6 w-px bg-slate-700" />

      <button
        onClick={onToggleOverlay}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          showOverlay
            ? "bg-blue-500/10 text-blue-400"
            : "text-slate-400 hover:bg-slate-800"
        }`}
      >
        {showOverlay ? (
          <Eye size={17} />
        ) : (
          <EyeOff size={17} />
        )}

        AI Overlay
      </button>
    </div>
  );
};

export default ViewerToolbar;