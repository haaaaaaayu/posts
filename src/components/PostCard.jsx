import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  // Format date nicely (e.g. YYYY.MM.DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <article 
      className="post-card" 
      onClick={handlePostClick}
      id={`post-card-${post.id}`}
      role="link"
      tabIndex="0"
      aria-label={`글 제목: ${post.title}, 날짜: ${formatDate(post.created_at)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handlePostClick();
        }
      }}
    >
      <div className="post-meta">
        <span className="post-date" id={`post-date-${post.id}`}>{formatDate(post.created_at)}</span>
        <span style={{ color: 'var(--muted)' }}>|</span>
        <span style={{
          fontSize: '0.75rem',
          border: '1px solid var(--muted)',
          padding: '1px 5px',
          borderRadius: '3px',
          fontWeight: 800,
          textTransform: 'uppercase'
        }}>
          {post.tag}
        </span>
      </div>

      <h3 className="post-card-title" id={`post-title-${post.id}`}>
        {post.title}
      </h3>

      {post.summary && (
        <p className="post-card-summary" id={`post-summary-${post.id}`}>
          {post.summary}
        </p>
      )}
    </article>
  );
}
