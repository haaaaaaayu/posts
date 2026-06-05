import { useNavigate } from "react-router-dom";

const FOLDER_CONFIG = {
  basic: { label: "Basic", emoji: "🙂" },
  Values: { label: "Values", emoji: "✨" },
  Favorites: { label: "Favorites", emoji: "🎧" },
  Projects: { label: "Projects", emoji: "💻" },
  Running: { label: "Running", emoji: "🏃" },
  moments: { label: "Moments", emoji: "📷" },
};

export default function FolderCard({ tag, count = 0 }) {
  const navigate = useNavigate();

  const folder =
    FOLDER_CONFIG[tag] || FOLDER_CONFIG.basic;

  return (
    <div
      className="folder-container"
      onClick={() => navigate(`/category/${tag}`)}
    >
      <div
        className="folder-tab"
        style={{
          background: folder.color,
        }}
      />

      <div
        className="folder-body"
        style={{
          background: folder.color,
          color: folder.text,
        }}
      >
        <div className="folder-emoji">
          {folder.emoji}
        </div>

        <div className="folder-name">
          {folder.label}
        </div>

        <div className="folder-count">
          {count} POSTS
        </div>
      </div>
    </div>
  );
}