import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');

  const handleInputChange = (event) => {
    const input = event.target.value;
    setSearchInput(input);
    onSearch(input);
  };

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="input-group mb-3" style={{ width: '400px', margin: '80px auto 0' }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        aria-label="Search"
        value={searchInput}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button className="btn btn-primary" type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
