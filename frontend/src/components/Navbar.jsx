import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Home, History, Info, Activity } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Newspaper className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl tracking-tight text-slate-900">NewsLens</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className={`flex items-center gap-1.5 font-medium transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-500'}`}>
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link to="/classifier" className={`flex items-center gap-1.5 font-medium transition-colors ${isActive('/classifier') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-500'}`}>
              <Activity className="h-4 w-4" /> Classifier
            </Link>
            <Link to="/history" className={`flex items-center gap-1.5 font-medium transition-colors ${isActive('/history') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-500'}`}>
              <History className="h-4 w-4" /> History
            </Link>
            <Link to="/about" className={`flex items-center gap-1.5 font-medium transition-colors ${isActive('/about') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-500'}`}>
              <Info className="h-4 w-4" /> About
            </Link>
            <Link to="/classifier" className="btn-primary ml-4 py-1.5 px-4 text-sm">
              Classify News
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
