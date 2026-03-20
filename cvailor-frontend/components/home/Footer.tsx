export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-100 bg-[#F5F6FA]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-medium text-gray-600">SmartCV</span>
        </div>
        <p className="text-xs text-gray-400">© 2025 SmartCV. Built with AI.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  )
}
