import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { tag: 'basic',     label: 'Basic'     },
  { tag: 'Values',    label: 'Values'    },
  { tag: 'Favorites', label: 'Favorites' },
  { tag: 'Projects',  label: 'Projects'  },
  { tag: 'Running',   label: 'Running'   },
  { tag: 'moments',   label: 'Moments'   },
];

export default function Cover() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <section className="cover-container" id="cover-section">
      <button
        className="cover-theme-toggle theme-toggle-btn"
        id="cover-theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
      >
        {theme === 'light' ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            DARK
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            LIGHT
          </>
        )}
      </button>

      <div className="cover-center">
        {/* iOS 텍스트 선택 영역 */}
        <div className="cover-text-row">
          {/* 왼쪽 핸들: 도트(위) + 라인(아래) */}
          <div className="sel-handle sel-handle-left">
            <div className="sel-handle-dot" />
            <div className="sel-handle-line" />
          </div>

          <h1 className="cover-name-label">ABOUT JINI</h1>

          {/* 오른쪽 핸들: 라인(위) + 도트(아래) */}
          <div className="sel-handle sel-handle-right">
            <div className="sel-handle-line" />
            <div className="sel-handle-dot" />
          </div>
        </div>

        {/* iOS 편집 메뉴 (callout / edit menu) */}
        <div className="ios-callout">
          <div className="ios-callout-tip" />
          <div className="ios-callout-body">
            {CATEGORIES.flatMap((cat, i) => [
              i > 0 && <div key={`sep-${i}`} className="callout-sep" />,
              <button
                key={cat.tag}
                className="callout-item"
                onClick={() => navigate(`/category/${cat.tag}`)}
              >
                {cat.label}
              </button>,
            ]).filter(Boolean)}
            <div className="callout-sep" />
            <button className="callout-item callout-chevron">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}
