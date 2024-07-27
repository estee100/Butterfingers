import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './searchPage.css';
import Cards from '../../components/card/card';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

const SearchPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    setData([]);
    setPageNo(1);
    if (query) {
      fetchData();
    }
  }, [query]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: API_KEY,
          query: query,
          page: pageNo,
        },
      });

      setData((prevData) => {
        return [...prevData, ...response.data.results];
      });
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='searchPage'>
      <h3>Search Results</h3>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="results">
        {data.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Cards movie={movie} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
