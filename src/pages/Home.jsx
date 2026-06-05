import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Cover from '../components/Cover';
import FolderShelf from '../components/FolderShelf';

export default function Home() {
  const [postCounts, setPostCounts] = useState({});
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Scroll event listener for smooth cover fade/slide transition
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchPostCounts = async () => {
      try {
        // Fetch only tags for count aggregation from 'posts' table
        const { data, error: supabaseError } = await supabase
          .from('posts')
          .select('tag')
          .eq('is_published', true);

        if (supabaseError) throw supabaseError;

        // Aggregate counts
        const counts = {
          basic: 0,
          Values: 0,
          Favorites: 0,
          Projects: 0,
          Running: 0,
          moments: 0
        };

        if (data) {
          data.forEach(post => {
            if (post.tag && counts[post.tag] !== undefined) {
              counts[post.tag] += 1;
            }
          });
        }

        setPostCounts(counts);
      } catch (err) {
        console.error('Error fetching post counts:', err);
      }
    };

    fetchPostCounts();
  }, []);

  // Calculate opacity and translation for the Cover based on scroll
  const viewportHeight = window.innerHeight || 800;
  
  // Fade cover out as we scroll down
  const coverOpacity = Math.max(0, 1 - scrollY / (viewportHeight * 0.7));
  
  // Slide cover up slightly slower than scroll speed (parallax effect)
  const coverTranslateY = scrollY * -0.25;
  
  // Shrink cover slightly for depth
  const coverScale = Math.max(0.85, 1 - (scrollY / viewportHeight) * 0.15);

  return (
    <div className="home-page-container" id="home-page-container">
      {/* Sticky Cover wrapper */}
      <div 
        className={`sticky-cover-wrapper ${coverOpacity > 0.05 ? 'active' : ''}`}
        style={{
          opacity: coverOpacity,
          transform: `translateY(${coverTranslateY}px) scale(${coverScale})`
        }}
      >
        <Cover />
      </div>

      {/* Folder Shelf Grid section */}
      <FolderShelf postCounts={postCounts} />
    </div>
  );
}
