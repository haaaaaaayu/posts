import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import PostDetail from './pages/PostDetail';
import WritePage from './pages/WritePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container" id="app-container">
      <ScrollToTop />
      {!isHome && <Header />}

      <main className="main-content" id="main-content">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:tag" element={<CategoryPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/write" element={<WritePage />} />
        </Routes>
      </main>

      <footer className="site-footer" id="site-footer">
        <p>ABOUT JINI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
