import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import useUserStore from '../../store/userStore';
import useListingStore from '../../store/listing';
import NavLink from '../ui/navbar/NavLink';
import NavButton from '../ui/navbar/NavButton';
import UserProfileDropdown from '../ui/user/UserProfileDropdown';
import SearchBar from '../ui/navbar/SearchBar';
import SearchDropdown from '../ui/navbar/SearchDropdown';
import { useDebounce } from '../../hooks/useDebounce';
import {shouldShowSearchBar} from '../../utils/navbarUtils';
import {
  IconCamera,
  IconCompass,
  IconEdit,
  IconHome,
  IconLayoutGrid,
  IconLogout,
  IconMenu2,
  IconPlus,
  IconSearch,
  IconUserCircle,
  IconX,
} from '@tabler/icons-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const notShowSearchBarPaths = [
    '/login',
    '/signup',
    '/listings/new',
    '/verify-otp',
    '/profile-setup',
    '/forgot-password',
    '/listings/:id/edit',
  ];
  const showSearchBarPaths = ['/', '/listings', '/listings/:id'];

  const {currUser, loading, logout, checkCurrUser} = useUserStore();
  const {
    filterListingOnTyping,
    searchListingsBackend,
    clearSearchResults,
  } = useListingStore();

  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Check if search bar should be displayed
  const displaySearchBar = shouldShowSearchBar(
    location.pathname,
    showSearchBarPaths,
    notShowSearchBarPaths
  );

  useEffect(() => {
    if (debouncedSearch) {
      filterListingOnTyping(debouncedSearch);
    }
  }, [debouncedSearch]);

  // Check for current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      await checkCurrUser();
    };

    fetchUser();

    // Close mobile menu on window resize
    const handleResize = () => window.innerWidth >= 768 && setIsOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkCurrUser]);

  // Reset search states when location changes
  useEffect(() => {
    setShowMobileSearch(false);
    if (location.pathname !== '/listings') {
      setSearchQuery('');
      setShowSearchDropdown(false);
    }
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  // Handle search query change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      setShowSearchDropdown(true);
    }
  };

  // Handle close of search dropdown
  const handleCloseSearch = () => {
    setShowSearchDropdown(false);
    clearSearchResults();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Navigation Links
  const navigationLinks = (
      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <NavLink to="/">
          <IconHome size={20}/>
          Home
        </NavLink>
        <NavLink to="/listings">
          <IconLayoutGrid size={20}/>
          Listings
        </NavLink>
        {currUser && currUser.userId === '66a343a50ff99cdefc1a4657' && (
            <NavLink to="/admin/stats">
              <IconCompass size={20}/>
              Analytics
            </NavLink>
        )}
        {currUser && (
            <NavLink to="/listings/new">
              <IconPlus size={20}/>
              Add Listing
            </NavLink>
        )}
      </div>
  );

  // Render auth buttons conditionally
  const renderAuthButtons = () => {
    if (loading) {
      return null; // Don't show auth buttons while loading
    }

    return (
        <div className={`${isOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
          <div className="flex flex-col md:flex-row gap-2">
            {currUser ? (
                // User profile dropdown (for desktop) or inline options (for mobile)
                <>
                  {/* Desktop view - show dropdown */}
                  <div className="hidden md:block">
                    <UserProfileDropdown
                        user={currUser}
                        onLogout={handleLogout}
                    />
                  </div>

                  {/* Mobile view - show options inline */}
                  <div className="md:hidden bg-gray-50 rounded-lg p-3 mt-2">
                    <div
                        className="flex items-center gap-2 px-2 py-2 mb-2 border-b border-gray-200 pb-2">
                      {currUser.profilePhoto ? (
                          <div
                              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <img
                                src={currUser.profilePhoto}
                                alt={currUser.name}
                                className="w-full h-full object-cover"
                            />
                          </div>
                      ) : (
                          <div
                              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
                            <IconUserCircle size={24}
                                            className="text-gray-500"/>
                          </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{currUser.name}</p>
                        <p className="text-xs text-gray-500">{currUser.email}</p>
                      </div>
                    </div>
                  </div>
                </>
            ) : (
                <>
                  <NavButton
                      onClick={() => navigate('/login')}
                      variant="outline"
                  >
                    Log in
                  </NavButton>
                  <NavButton
                      onClick={() => navigate('/signup')}
                      variant="primary"
                  >
                    Sign up
                  </NavButton>
                </>
            )}
          </div>
        </div>
    );
  };

  return (
      <>
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
          <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-between h-16">
              {/* Left section: Logo, Home, Add Listing */}
              <div className="flex items-center gap-6">
                {/* Logo */}
                <Link to="/" className="font-bold text-2xl text-rose-500">
                  Wanderlust
                </Link>

                {/* Navigation Links */}                <div className="hidden md:flex items-center gap-6">
                  <NavLink to="/" className="flex items-center gap-2">
                    <IconHome size={20}/>
                    <span>Home</span>
                  </NavLink>
                  
                  <NavLink to="/listings/new" className="flex items-center gap-2">
                    <IconPlus size={20}/>
                    <span>Add Listing</span>
                  </NavLink>
                </div>
              </div>

              {/* Right section: Auth Buttons */}
              <div className="hidden md:flex items-center gap-4">
                {!currUser ? (
                  <>                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                    >
                      Login
                    </button>
                    <NavButton
                      onClick={() => navigate('/signup')}
                      className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
                    >
                      Sign up
                    </NavButton>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <IconLogout size={20}/>
                    Logout
                  </button>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <IconX size={24}/> : <IconMenu2 size={24}/>}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (              <div className="md:hidden py-3 space-y-2">
                <NavLink to="/" className="flex items-center gap-2">
                  <IconHome size={20}/>
                  <span>Home</span>
                </NavLink>
                
                <NavLink to="/listings/new" className="flex items-center gap-2">
                  <IconPlus size={20}/>
                  <span>Add Listing</span>
                </NavLink>

                {!currUser ? (
                  <>                    <button
                      onClick={() => navigate('/login')}
                      className="w-full text-left px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                    >
                      Login
                    </button>
                    <NavButton
                      onClick={() => navigate('/signup')}
                      className="w-full bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
                    >
                      Sign up
                    </NavButton>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <IconLogout size={20}/>
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Search Dropdown */}
        {showSearchDropdown && (
            <SearchDropdown
                searchQuery={searchQuery}
                onClose={handleCloseSearch}
            />
        )}
      </>
  );
};

export default Navigation;
