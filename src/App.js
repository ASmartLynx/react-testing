import React, { useState, useEffect } from 'react';
import Async from './Async';
import './App.css';

const getUser = () => Promise.resolve({ id: 1, name: 'Name' });

const Search = ({ value, onChange, children }) => (
  <div>
    <label htmlFor="search">{children}</label>
    <input
      id="search"
      placeholder="search text..."
      type="text"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

const App = () => {
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    loadUser();
  }, [])

  const handleChange = ({ target }) => {
    setSearch(target.value);
  };

  return (
    <div>
      {user && <h2>Logged in as {user.name}</h2>}
      <img src="" className="image" alt="search image"/>
      <Search value={search} onChange={handleChange}>
        Search:
      </Search>
      <p>Searches for {search ? search : '...'}</p>
      <Async />
    </div>
  )
}

export default App;
