'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-indigo-600">Mini Event Platform</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-indigo-600 font-semibold' : 'text-gray-700'} hover:text-indigo-800 transition-colors`}
            >
              Events
            </Link>
            {user && (
              <>
                <Link 
                  href="/create-event" 
                  className={`${pathname === '/create-event' ? 'text-indigo-600 font-semibold' : 'text-gray-700'} hover:text-indigo-800 transition-colors`}
                >
                  Create Event
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`${pathname === '/dashboard' ? 'text-indigo-600 font-semibold' : 'text-gray-700'} hover:text-indigo-800 transition-colors`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700 font-medium px-1">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile Menu */}
        {user && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="text-sm text-gray-700 font-medium px-1">
                Welcome, <span className="font-semibold">{user.name}</span>
            </div>
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-indigo-600 font-semibold' : 'text-gray-700'} hover:text-indigo-800 transition-colors block py-2`}
            >
              Events
            </Link>
                <Link 
                  href="/create-event" 
                  className={`${pathname === '/create-event' ? 'text-indigo-600 font-semibold' : 'text-gray-700'} hover:text-indigo-800 transition-colors block py-2`}
                >
                  Create Event
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`${pathname === '/dashboard' ? 'text-indigo-600 font-semibold' : 'text-gray-700'} hover:text-indigo-800 transition-colors block py-2`}
                >
                  Dashboard
                </Link>
          </div>
        )}
        {!user && (
        <div className="md:hidden flex flex-col gap-2 pb-4">
            <Link
            href="/login"
            className="w-full text-center border border-indigo-600 text-indigo-600 font-medium py-2 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
            >
            Login
            </Link>

            <Link
            href="/register"
            className="w-full text-center btn-primary cursor-pointer"
            >
            Sign Up
            </Link>
        </div>
        )}
        {user && (
            
            <div className="md:hidden pb-4">
                <button
                onClick={handleLogout}
                className="w-full btn-secondary text-center py-2 cursor-pointer"
                >
                Logout
                </button>
            </div>
            )}
      </div>
    </nav>
  );
}