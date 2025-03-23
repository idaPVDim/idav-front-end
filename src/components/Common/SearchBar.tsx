import React from 'react';
import './SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar() {
  return (
    <div className="navbar-search">
      <div className="search-input-container">
        <div className="input-with-icon">
          <input type="text" placeholder="Search..." />
          <FontAwesomeIcon icon={faSearch} className="search-icon" /> {/* Search icon */}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
