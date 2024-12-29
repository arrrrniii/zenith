import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Home,
  Map,
  Layout as LayoutIcon,
  PenSquare,
  Calendar,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  List,
  Plus,
  BarChart,
  Clock,
  ChevronFirst,
  ChevronLast,
  LogOut,
  FolderPlus,
  DollarSign,
  Image
} from 'lucide-react';

// Store sidebar state in localStorage
const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  return [isCollapsed, toggleCollapse];
};

const navigationItems = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: Home,
    path: '/dashboard'
  },
  { 
    id: 'tours', 
    label: 'Tours', 
    icon: Map,
    path: '/dashboard/tours',
    subItems: [
      { id: 'tours-list', label: 'All Tours', icon: List, path: '/dashboard/tours' },
      { id: 'tours-new', label: 'Add New Tour', icon: Plus, path: '/dashboard/tours/new' },
      // { id: 'tours-analytics', label: 'Analytics', icon: BarChart, path: '/dashboard/tours/analytics' },
      // { id: 'tours-schedule', label: 'Schedule', icon: Clock, path: '/dashboard/tours/schedule' },
    ]
  },
  { 
    id: 'attractions', 
    label: 'Attractions', 
    icon: LayoutIcon,
    path: '/dashboard/attractions',
    subItems: [
      { id: 'attractions-list', label: 'All Attractions', icon: List, path: '/dashboard/attractions' },
      { id: 'attractions-new', label: 'Add New', icon: Plus, path: '/dashboard/attractions/new' },
    ]
  },
  { 
    id: 'blog', 
    label: 'Blog', 
    icon: PenSquare,
    path: '/dashboard/blog',
    // subItems: [
    //   { id: 'blog-posts', label: 'All Posts', icon: List, path: '/dashboard/blog' },
    //   { id: 'blog-new', label: 'Write New Post', icon: Plus, path: '/dashboard/blog/new' },
    //   { id: 'blog-categories', label: 'Categories', icon: FolderPlus, path: '/dashboard/blog/categories' },
    //   { id: 'blog-media', label: 'Media Library', icon: Image, path: '/dashboard/blog/media' }
    // ]
  },
  { 
    id: 'bookings', 
    label: 'Bookings', 
    icon: Calendar,
    path: '/dashboard/bookings'
  },
  { 
    id: 'finance', 
    label: 'Finance', 
    icon: DollarSign,
    path: '/dashboard/finance'
  },
  { 
    id: 'users', 
    label: 'Users', 
    icon: Users,
    path: '/dashboard/users'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    path: '/dashboard/settings'
  }
];

const MenuItem = ({ item, isActive, isSubItem = false, isCollapsed }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(isActive);

  const handleClick = () => {
    if (item.subItems && !isCollapsed) {
      setIsOpen(!isOpen);
    } else {
      router.push(item.path);
    }
  };

  const isCurrentPath = router.pathname === item.path;

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg ${
          isCurrentPath
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50'
        } ${isSubItem ? 'pl-11' : ''}`}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center">
          {item.icon && (
            <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
          )}
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {!isCollapsed && item.subItems && (
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        )}
      </button>

      {item.subItems && isOpen && !isCollapsed && (
        <div className="mt-1">
          {item.subItems.map((subItem) => (
            <MenuItem
              key={subItem.id}
              item={subItem}
              isActive={router.pathname === subItem.path}
              isSubItem={true}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const [isCollapsed, toggleCollapse] = useSidebarState();
  
  return (
    <div 
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-300`}
    >
      <div className={`p-4 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link href="/dashboard" className="block">
            <h1 className="text-xl font-bold text-gray-800">Admin</h1>
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronLast className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronFirst className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <div className="px-3 py-4 space-y-1">
          {navigationItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={router.pathname.startsWith(item.path)}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center'}`}>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">A</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={() => console.log('Logout clicked')}
            className="mt-4 flex items-center w-full px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;