import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';

const StarRating = ({ donationId, rateeId, rateeName, onSuccess }) => {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [existingRating, setExistingRating] = useState(null);

  // Check if current user has already rated this donation
  useEffect(() => {
    let active = true;
    const fetchExisting = async () => {
      try {
        const response = await API.get(`/ratings/donation/${donationId}`);
        const ratings = response.data || [];
        const found = ratings.find((r) => r.raterName === user?.name);
        if (active && found) {
          setExistingRating(found);
          setScore(found.score);
          setComment(found.comment || '');
        }
      } catch (err) {
        console.error('Failed to check existing rating:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    if (donationId && user) {
      fetchExisting();
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [donationId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score === 0) {
      setError('Please select a rating score.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post('/ratings', {
        donationId,
        rateeId,
        score,
        comment: comment.trim() || null,
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
        <div className="spinner" style={{ width: '24px', height: '24px', margin: 0 }} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0', color: '#16a34a', fontWeight: '600' }}>
        🎉 Thank you for your rating!
      </div>
    );
  }

  const activeScore = hoverScore || score;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {existingRating ? (
        <div style={styles.readonlyContainer}>
          <div style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ ...styles.star, color: i <= score ? '#eab308' : '#d1d5db', cursor: 'default' }}>
                ★
              </span>
            ))}
          </div>
          <p style={styles.readonlyText}>✓ You rated this {existingRating.score}/5</p>
          {existingRating.comment && (
            <div style={styles.readonlyComment}>
              "{existingRating.comment}"
            </div>
          )}
        </div>
      ) : (
        <>
          <p style={styles.label}>Rate your experience with {rateeName}:</p>
          <div style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                style={{
                  ...styles.star,
                  color: i <= activeScore ? '#eab308' : '#d1d5db',
                }}
                onClick={() => setScore(i)}
                onMouseEnter={() => setHoverScore(i)}
                onMouseLeave={() => setHoverScore(0)}
              >
                {i <= activeScore ? '★' : '☆'}
              </span>
            ))}
          </div>

          <textarea
            className="form-control"
            maxLength={200}
            placeholder="Leave a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.textarea}
          />
          <div style={styles.charCount}>
            {comment.length}/200 chars
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            disabled={submitting || score === 0}
          >
            {submitting ? (
              <>
                <span className="spinner" style={{ width: '14px', height: '14px', margin: '0 6px 0 0', display: 'inline-block', borderWidth: '2px' }} />
                Submitting…
              </>
            ) : (
              'Submit Rating'
            )}
          </button>
        </>
      )}
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  label: {
    fontSize: '13px',
    color: '#4b5563',
    marginBottom: '8px',
    fontWeight: '500',
  },
  starsRow: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  star: {
    fontSize: '32px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.15s ease',
  },
  textarea: {
    minHeight: '75px',
    resize: 'vertical',
    fontSize: '13px',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
    marginBottom: '10px',
  },
  submitBtn: {
    justifyContent: 'center',
    marginTop: '0.5rem',
  },
  error: {
    color: '#dc2626',
    fontSize: '12.5px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  readonlyContainer: {
    textAlign: 'center',
    padding: '0.5rem 0',
  },
  readonlyText: {
    fontWeight: '600',
    color: '#16a34a',
    fontSize: '14px',
    marginTop: '6px',
  },
  readonlyComment: {
    fontStyle: 'italic',
    color: '#4b5563',
    fontSize: '13px',
    marginTop: '10px',
    background: '#f9fafb',
    padding: '8px 12px',
    borderRadius: '6px',
    borderLeft: '3px solid #d1d5db',
    textAlign: 'left',
    lineHeight: '1.4',
  },
};

export default StarRating;
