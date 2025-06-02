import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  IconChevronDown,
  IconLogout,
  IconUserCircle,
} from '@tabler/icons-react';
import useUserStore from '../../../store/userStore';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.profilePhoto ? (
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
            <IconUserCircle size={20} className="text-gray-500" />
          </div>
        )}
        <IconChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Logout Option */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <IconLogout size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

UserProfileDropdown.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profilePhoto: PropTypes.string,
  }).isRequired,
};

export default UserProfileDropdown;
