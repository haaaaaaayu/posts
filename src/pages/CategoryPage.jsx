import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';

export default function CategoryPage() {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('posts')
          .select('id, title, summary, content, tag, is_published, created_at')
          .eq('is_published', true)
          .eq('tag', tag)
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;

        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching category posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    
    // SEO title update
    document.title = `ABOUT JINI | Category - ${tag}`;
  }, [tag]);

  // Folder style configurations for the header badge (matches DESIGN.md colors)
  const tagStyles = {
    basic: { bgColor: 'var(--folder-basic)', textColor: 'var(--text-dark)' },
    Values: { bgColor: 'var(--folder-values)', textColor: '#FFFDF5' },
    Favorites: { bgColor: 'var(--folder-favorites)', textColor: 'var(--text-dark)' },
    Projects: { bgColor: 'var(--folder-projects)', textColor: 'var(--text-dark)' },
    Running: { bgColor: 'var(--folder-running)', textColor: '#FFFDF5' },
    moments: { bgColor: 'var(--folder-moments)', textColor: 'var(--text-dark)' }
  };

  const currentStyle = tagStyles[tag] || { bgColor: 'var(--folder-basic)', textColor: 'var(--text-dark)' };

  if (loading) {
    return (
      <div className="status-container" id="category-loading-container">
        <div className="spinner"></div>
        <p className="status-desc">보관함에서 글을 꺼내고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container" id="category-error-container">
        <h2 className="status-title">연결 실패</h2>
        <p className="status-desc">Supabase에서 글을 불러오는데 실패했습니다: {error}</p>
        <button className="status-retry-btn" onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="category-page" id="category-page-container">
      <header className="category-header">
        <div 
          className="category-tag-badge"
          id="category-tag-badge"
          style={{
            backgroundColor: currentStyle.bgColor,
            color: currentStyle.textColor,
            borderColor: 'var(--border-dark)'
          }}
        >
          {tag.toUpperCase()}
        </div>
        <h2 className="category-title-text" id="category-title-text">
          {tag === 'basic' && '기본정보'}
          {tag === 'Values' && '가치관'}
          {tag === 'Favorites' && '취향과 애정하는 것들'}
          {tag === 'Projects' && '프로젝트 기록'}
          {tag === 'Running' && '달리기는 나의 힘!'}
          {tag === 'moments' && '일상'}
        </h2>
      </header>

      {posts.length === 0 ? (
        <div className="status-container" id="category-empty-container">
          <h3 className="status-title" style={{ fontSize: '1.5rem' }}>비어 있는 보관함</h3>
          <p className="status-desc">이 폴더에는 아직 작성된 글이 없습니다.</p>
          <Link to="/" className="status-retry-btn" style={{ textDecoration: 'none' }}>보관함으로 돌아가기</Link>
        </div>
      ) : (
        <div className="posts-list" id="category-posts-list">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
