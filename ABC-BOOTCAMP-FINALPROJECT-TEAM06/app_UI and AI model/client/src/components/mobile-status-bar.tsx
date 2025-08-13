export default function MobileStatusBar() {
  return (
    <div className="flex justify-between items-center px-4 py-2 text-sm">
      <span className="text-white font-medium">9:41</span>
      <div className="flex items-center space-x-1">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
        </svg>
        <div className="flex space-x-0.5">
          <div className="w-1 h-3 bg-white rounded-full"></div>
          <div className="w-1 h-3 bg-white rounded-full"></div>
          <div className="w-1 h-3 bg-white rounded-full"></div>
        </div>
        <div className="w-6 h-3 bg-white rounded-sm"></div>
      </div>
    </div>
  );
}
