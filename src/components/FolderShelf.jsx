import FolderCard from './FolderCard';

export default function FolderShelf({ postCounts = {} }) {
  // Fixed categories as per DESIGN.md
  const categories = ['basic', 'Values', 'Favorites', 'Projects', 'Running', 'moments'];

  return (
    <section className="shelf-section-wrapper" id="folder-shelf-section">
      <div className="shelf-header">
        <div className="shelf-subtitle" id="shelf-subtitle-id">Archive Index</div>
        <h2 className="shelf-title" id="shelf-title-id">기록 보관함</h2>
      </div>

      <div className="folder-grid" id="folder-grid-id">
        {categories.map((category) => (
          <FolderCard 
            key={category} 
            tag={category} 
            count={postCounts[category] || 0} 
          />
        ))}
      </div>
    </section>
  );
}
