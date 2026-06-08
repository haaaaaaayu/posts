import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['basic', 'Values', 'Favorites', 'Projects', 'Running', 'moments'];
const DRAFT_KEY = 'miniblog-draft';

function readDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);
const todayISO = () => new Date().toISOString().slice(0, 10);

const formatRunningDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
};

export default function WritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const quillRef = useRef(null);
  const forcedTag = location.state?.tag ?? null;

  // draft는 첫 렌더에서 한 번만 읽음 (forcedTag가 있으면 신규 작성이므로 무시)
  const [draft] = useState(() => forcedTag ? null : readDraft());
  const initialCategory = forcedTag ?? draft?.category ?? 'basic';

  const [title, setTitle]     = useState(draft?.title ?? '');
  const [category, setCategory] = useState(initialCategory);
  const [summary, setSummary]   = useState(() => {
    if (initialCategory === 'Projects') return draft?.summary ?? String(currentYear);
    if (initialCategory === 'Running')  return draft?.summary ?? formatRunningDate(todayISO());
    return draft?.summary ?? '';
  });
  const [runningDate, setRunningDate] = useState(
    draft?.runningDate ?? (initialCategory === 'Running' ? todayISO() : '')
  );
  const [content, setContent] = useState(draft?.content ?? '');
  const [saved, setSaved] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const handlePaste = (e) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith('image/'));
      if (!imageItem) return;
      e.preventDefault();
      e.stopPropagation();
      const file = imageItem.getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', event.target.result);
        editor.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };

    editor.root.addEventListener('paste', handlePaste, true);
    return () => editor.root.removeEventListener('paste', handlePaste, true);
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', e.target.result);
        editor.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    if (newCat === 'Projects') {
      setSummary(String(currentYear));
    } else if (newCat === 'Running') {
      const iso = todayISO();
      setRunningDate(iso);
      setSummary(formatRunningDate(iso));
    } else if (category === 'Projects' || category === 'Running') {
      setSummary('');
    }
  };

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, summary, category, content, runningDate }));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      alert('내용을 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: supabaseError } = await supabase.from('posts').insert({
      title: title.trim(),
      summary: summary.trim() || null,
      tag: category,
      content,
      is_published: true,
    });

    setSubmitting(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    localStorage.removeItem(DRAFT_KEY);
    setSaved(true);
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <div className="write-page" id="write-page-container">
      {saved && (
        <div className="write-save-toast" id="write-save-toast">
          저장이 되었습니다 ✓
        </div>
      )}
      {draftSaved && (
        <div className="write-draft-toast" id="write-draft-toast">
          임시저장 완료
        </div>
      )}

      <div className="notes-card">
        {/* 아이폰 메모 — 노란 헤더 */}
        <div className="notes-card-header">
          <span className="notes-card-date">{today}</span>
          <select
            className="notes-category-select"
            value={category}
            onChange={handleCategoryChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="notes-draft-btn" onClick={saveDraft}>
            임시저장
          </button>
          <button
            className="notes-card-done-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '...' : 'Done'}
          </button>
        </div>

        {/* 메모 본문 */}
        <div className="notes-card-body">
          {error && (
            <div className="write-error-banner" id="write-error-banner">
              저장 실패: {error}
            </div>
          )}

          <input
            className="notes-title-input"
            id="write-title-input"
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {category === 'Projects' ? (
            <select
              className="notes-year-select"
              id="write-year-select"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            >
              {YEARS.map(year => (
                <option key={year} value={String(year)}>{year}년</option>
              ))}
            </select>
          ) : category === 'Running' ? (
            <input
              className="notes-running-date"
              id="write-running-date"
              type="date"
              value={runningDate}
              onChange={(e) => {
                setRunningDate(e.target.value);
                setSummary(formatRunningDate(e.target.value));
              }}
            />
          ) : (
            <input
              className="notes-summary-input"
              id="write-summary-input"
              type="text"
              placeholder="부제목 (선택사항)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          )}

          <div className="notes-editor-wrapper">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="내용을 입력하세요..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
