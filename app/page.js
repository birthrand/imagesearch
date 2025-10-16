'use client';

import { useCallback, useEffect, useState } from 'react';
import ImageResultList from './components/ImageResultList';
import styles from './page.module.css';

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

function getCookieValue(name) {
  if (typeof document === 'undefined') {
    return '';
  }

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie.startsWith(`${name}=`))
    .map((cookie) => decodeURIComponent(cookie.substring(name.length + 1)))[0] || '';
}

export default function HomePage() {
  const [formState, setFormState] = useState({ query: '', perPage: 4, page: 1 });
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    setCsrfToken(getCookieValue(CSRF_COOKIE_NAME));
    const interval = setInterval(() => {
      setCsrfToken(getCookieValue(CSRF_COOKIE_NAME));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!formState.query.trim()) {
        setStatus('error');
        setMessage('Please enter a search query before submitting.');
        return;
      }

      setStatus('loading');
      setMessage('Fetching curated imagery...');

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [CSRF_HEADER_NAME]: csrfToken || getCookieValue(CSRF_COOKIE_NAME)
          },
          body: JSON.stringify({
            query: formState.query,
            perPage: Number(formState.perPage),
            page: Number(formState.page)
          })
        });

        const payload = await response.json();

        if (!response.ok) {
          setStatus('error');
          setResults([]);
          setMessage(payload.error || 'Unexpected error while searching.');
          return;
        }

        setResults(payload.results || []);
        setStatus('success');
        setMessage(`Showing ${payload.results.length} curated results for "${formState.query}".`);
      } catch (error) {
        setStatus('error');
        setResults([]);
        setMessage('Unable to reach the search service. Please try again later.');
      }
    },
    [csrfToken, formState.page, formState.perPage, formState.query]
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ImageSearch</h1>
        <p>Discover curated imagery with reliable validation, security, and performance tooling.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="query">Search query</label>
          <input
            id="query"
            name="query"
            type="text"
            placeholder="e.g. northern lights"
            value={formState.query}
            onChange={handleChange}
            required
            minLength={1}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="perPage">Results per page</label>
          <select id="perPage" name="perPage" value={formState.perPage} onChange={handleChange}>
            {[4, 8, 12, 16].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="page">Page</label>
          <select id="page" name="page" value={formState.page} onChange={handleChange}>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.submitButton} type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search images'}
        </button>
      </form>

      {message ? (
        <p
          className={`${styles.statusMessage} ${
            status === 'success' ? styles.statusMessageSuccess : ''
          }`.trim()}
        >
          {message}
        </p>
      ) : null}

      <ImageResultList results={results} />
    </div>
  );
}
