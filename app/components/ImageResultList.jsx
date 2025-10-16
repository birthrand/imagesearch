import Image from 'next/image';
import PropTypes from 'prop-types';
import styles from './ImageResultList.module.css';

export default function ImageResultList({ results }) {
  if (!results?.length) {
    return <p className={styles.emptyState}>No results yet. Try searching for something.</p>;
  }

  return (
    <ul className={styles.grid}>
      {results.map((result) => (
        <li key={result.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              alt={result.alt}
              src={`${result.src}&auto=format&fit=crop&w=400&q=80`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              priority
            />
          </div>
          <div className={styles.meta}>
            <p>{result.alt}</p>
            <small className={styles.relevance}>Relevance {(result.relevance * 100).toFixed(0)}%</small>
          </div>
        </li>
      ))}
    </ul>
  );
}

ImageResultList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      relevance: PropTypes.number
    })
  )
};

ImageResultList.defaultProps = {
  results: []
};
