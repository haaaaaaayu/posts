import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('posts')
          .select('id, title, summary, content, tag, is_published, created_at')
          .eq('id', id)
          .single(); // fetch exactly one post

        if (supabaseError) throw supabaseError;

        setPost(data);
      } catch (err) {
        console.error('Error fetching post detail:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      // SEO title update
      document.title = `ABOUT JINI | ${post.title}`;
    }
  }, [post]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  if (loading) {
    return (
      <div className="status-container" id="post-loading-container">
        <div className="spinner"></div>
        <p className="status-desc">기록을 열어보는 중입니다...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="status-container" id="post-error-container">
        <h2 className="status-title">글을 찾을 수 없음</h2>
        <p className="status-desc">
          {error ? `불러오기 오류: ${error}` : '요청하신 글이 존재하지 않거나 비공개 상태입니다.'}
        </p>
        <Link to="/" className="status-retry-btn" style={{ textDecoration: 'none' }}>보관함으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <article className="post-detail-page" id="post-detail-page-container">
      <header className="post-detail-header">
        <div className="post-detail-meta">
          <Link 
            to={`/category/${post.tag}`} 
            className="post-detail-tag"
            id="post-detail-tag-link"
          >
            {post.tag}
          </Link>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span className="post-detail-date" id="post-detail-date">{formatDate(post.created_at)}</span>
        </div>
        <h1 className="post-detail-title" id="post-detail-title-heading">
          {post.title}
        </h1>
      </header>

      {/* Render Markdown content safely */}
      <div className="post-body" id="post-content-body">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
