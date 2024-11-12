import React from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
        />
    );
};

export default SearchBar;
