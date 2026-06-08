import { useNavigate } from "react-router-dom";

/* 메인 컬러 — CategoryPage 헤더와 동일 */
const FOLDER_META = {
  basic:     { emoji: "🙂", name: "Basic",     color: "#8e8e93" },
  Values:    { emoji: "✨", name: "Values",    color: "#5856d6" },
  Favorites: { emoji: "🎧", name: "Favorites", color: "#4cd964" },
  Projects:  { emoji: "💻", name: "Projects",  color: "#ffcc00" },
  Running:   { emoji: "🏃", name: "Running",   color: "#ff2d55" },
  moments:   { emoji: "📷", name: "Moments",   color: "#5BC0F1" },
};

export default function FolderCard({ tag, count = 0 }) {
  const navigate = useNavigate();
  const { emoji, name, color } = FOLDER_META[tag] || FOLDER_META.basic;

  return (
    <div className="folder" style={{ "--base": color }} onClick={() => navigate(`/category/${tag}`)}>
      {/* 뒷판 + 사선 탭 (macOS 실루엣) */}
      <svg className="folder-back" viewBox="0 0 200 156" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 28 C10 20 16 14 24 14 L72 14 C77 14 82 17 85 21 L92 31
                 C95 35 99 37 104 37 L176 37 C184 37 190 43 190 51 L190 128
                 C190 136 184 142 176 142 L24 142 C16 142 10 136 10 128 Z" />
      </svg>
      {/* 앞면 */}
      <div className="folder-front">
        <span className="folder-emoji">
          <img
            src={`https://emojicdn.elk.sh/${emoji}?style=apple`}
            alt={name}
            width={40}
            height={40}
            draggable={false}
          />
        </span>
        <div className="folder-label">
          <div className="folder-name">{name}</div>
          <div className="folder-count">{count} POSTS</div>
        </div>
      </div>
    </div>
  );
}
