import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import styles from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
  const [search, setSearch] = useState('');

  const handleChange = e => {
    setSearch(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSubmit(search);
    setSearch('');
  };

  return (
    <header className={styles.Searchbar}>
      <form onSubmit={handleSubmit} className={styles.SearchForm}>
        <button type="submit" className={styles.SearchFormButton}>
          <FaSearch />
        </button>

        <input
          className={styles.SearchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={search}
          name="search"
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

export default Searchbar;
