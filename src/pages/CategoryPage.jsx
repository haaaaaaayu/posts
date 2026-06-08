import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';
import PasswordModal from '../components/PasswordModal';

const CATEGORY_COLORS = {
  basic:     '#8e8e93',
  Values:    '#5856d6',
  Favorites: '#4cd964',
  Projects:  '#ffcc00',
  Running:   '#ff2d55',
  moments:   '#5BC0F1',
};

const CATEGORY_LABELS = {
  basic:     '기본정보',
  Values:    '가치관',
  Favorites: '취향과 애정하는 것들',
  Projects:  '프로젝트 기록',
  Running:   '달리기는 나의 힘!',
  moments:   '일상',
};

export default function CategoryPage() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');

  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);
  const filteredPosts = tag === 'Projects' && selectedYear
    ? posts.filter(p => p.summary === selectedYear)
    : posts;

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
    document.title = `ABOUT JINI | ${tag}`;
  }, [tag]);

  if (loading) {
    return (
      <div className="status-container" id="category-loading-container">
        <div className="spinner" />
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

  const headerColor = CATEGORY_COLORS[tag] || 'var(--folder-main)';

  return (
    <div className="category-page" id="category-page-container">
      <div className="category-notes-card">
        {/* Notes 스타일 컬러 헤더 */}
        <div className="category-notes-header" style={{ background: headerColor }}>
          <span className="category-tag-badge" id="category-tag-badge">
            {tag.toUpperCase()}
          </span>
          <button
            className="write-nav-btn"
            id="category-write-btn"
            onClick={() => setShowWriteModal(true)}
          >
            + Write
          </button>
        </div>

        {/* 본문 */}
        <div className="category-notes-body">
          <h2 className="category-title-text" id="category-title-text">
            {CATEGORY_LABELS[tag] || tag}
          </h2>

          {tag === 'Projects' && (
            <div className="project-year-filter">
              <select
                className="project-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">전체 보기</option>
                {YEARS.map(year => (
                  <option key={year} value={String(year)}>{year}년</option>
                ))}
              </select>
            </div>
          )}

          {showWriteModal && (
            <PasswordModal
              action="write"
              onConfirm={() => { setShowWriteModal(false); navigate('/write', { state: { tag } }); }}
              onClose={() => setShowWriteModal(false)}
            />
          )}

          {filteredPosts.length === 0 ? (
            <div className="category-empty">
              <p className="category-empty-title">비어 있는 보관함</p>
              <p className="category-empty-desc">
                {selectedYear ? `${selectedYear}년에 작성된 글이 없습니다.` : '이 폴더에는 아직 작성된 글이 없습니다.'}
              </p>
              <Link to="/" className="status-retry-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
                보관함으로 돌아가기
              </Link>
            </div>
          ) : (
            <div className="posts-list" id="category-posts-list">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
