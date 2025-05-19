import React from 'react';
import PropTypes from 'prop-types';
import { IconSearch } from '@tabler/icons-react';

const SearchBar = ({ value, onChange, onFocus }) => (
  <div className="flex gap-2 w-full">
    <div className="relative flex-1">
      <input
        type="search"
        value={value}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
        }}
        onFocus={(e) => {
          e.stopPropagation();
          if (onFocus && value.trim()) onFocus();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        placeholder="Search listings..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        aria-label="Search listings"
      />
      <IconSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  </div>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
};

export default SearchBar;
