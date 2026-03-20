import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './supabase';
import { designPatternsPosts } from './data/designPatterns';

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  code_snippet?: string;
  author: string;
  category_id: number;
  read_time: string;
  published: boolean;
  created_at: string;
  categories?: {
    id: number;
    name: string;
    slug: string;
    description?: string;
  };
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const categories = ['All', 'Creational Patterns', 'Structural Patterns', 'Behavioral Patterns'];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, categories(*)')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(designPatternsPosts.map((p: any) => ({
          ...p,
          categories: {
            id: p.category_id,
            name: p.category_id === 1 ? 'Creational Patterns' : p.category_id === 2 ? 'Structural Patterns' : 'Behavioral Patterns',
            slug: p.category_id === 1 ? 'creational' : p.category_id === 2 ? 'structural' : 'behavioral'
          }
        })));
      }
    } catch (error) {
      console.log('Using local data...');
      setPosts(designPatternsPosts.map((p: any) => ({
        ...p,
        categories: {
          id: p.category_id,
          name: p.category_id === 1 ? 'Creational Patterns' : p.category_id === 2 ? 'Structural Patterns' : 'Behavioral Patterns',
          slug: p.category_id === 1 ? 'creational' : p.category_id === 2 ? 'structural' : 'behavioral'
        }
      })));
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== 'All') {
      result = result.filter(p => p.categories?.name === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeCategory, searchQuery, posts]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500 dark:text-neutral-400">Loading patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-[#e5e5e5] transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 dark:bg-[#111] dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => { setSelectedPost(null); setActiveCategory('All'); setShowAbout(false); }}>
            <h1 className="text-2xl font-black tracking-tighter">Boring<span className="text-[#facc15]">Java</span></h1>
          </div>
          <div className="hidden md:flex space-x-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedPost(null); setShowAbout(false); }}
                className={`text-sm font-semibold tracking-tight transition-colors ${!showAbout && activeCategory === cat ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => { setShowAbout(true); setSelectedPost(null); }}
              className={`text-sm font-semibold tracking-tight transition-colors ${showAbout ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
            >
              About
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button className="hidden md:block bg-[#1a1a1a] text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-widest hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors">
              Subscribe
            </button>
            <button
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111]">
            <div className="px-6 py-4 flex flex-col space-y-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSelectedPost(null); setIsMobileMenuOpen(false); setShowAbout(false); }}
                  className={`text-left text-sm font-semibold py-2 transition-colors ${!showAbout && activeCategory === cat ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {showAbout ? (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 tracking-tight">About Me</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-xl leading-relaxed text-neutral-600 dark:text-neutral-300 mb-8 font-medium">
                Hi, I'm <strong className="text-[#1a1a1a] dark:text-white">Subrat</strong>, a passionate Java developer with expertise in building robust backend systems, microservices architecture, and enterprise applications.
              </p>
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-[#facc15]">⚡</span> Tech Stack
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                    <li>• Java 17+, Spring Boot, Hibernate</li>
                    <li>• Microservices & REST APIs</li>
                    <li>• Docker, Kubernetes, AWS</li>
                    <li>• CI/CD Pipelines</li>
                    <li>• React (Full-stack)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-[#facc15]">💼</span> Current Role
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Java Developer at <strong>IbaseIt Inc.</strong>
                    <br />
                    Developing backend systems using Finite State Machine (FSM) based frameworks.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : selectedPost ? (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-8 text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white flex items-center text-sm font-semibold transition-colors"
            >
              ← Back to patterns
            </button>
            <span className="bg-[#facc15] text-black text-[10px] font-black uppercase px-2 py-1 tracking-tighter">
              {selectedPost.categories?.name}
            </span>
            <h1 className="text-5xl font-extrabold mt-4 mb-6 leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex items-center space-x-4 mb-12 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="font-bold text-[#1a1a1a] dark:text-white">{selectedPost.author}</span>
              <span>•</span>
              <span>{formatDate(selectedPost.created_at)}</span>
              <span>•</span>
              <span>{selectedPost.read_time} read</span>
            </div>

            <div className="prose prose-neutral max-w-none text-lg leading-relaxed text-neutral-700 dark:text-neutral-300"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

            {selectedPost.code_snippet && (
              <div className="my-10 bg-[#1e1e1e] rounded-xl overflow-hidden shadow-xl">
                <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#3d3d3d]">
                  <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase">Example Implementation</span>
                </div>
                <pre className="p-6 text-sm text-neutral-200 overflow-x-auto font-mono">
                  {selectedPost.code_snippet}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">The Repository</h2>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-6xl font-extrabold tracking-tighter max-w-2xl leading-none">
                  23 Design <span className="text-[#facc15]">Patterns</span> in Java.
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patterns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 px-4 py-2.5 pl-10 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all dark:bg-[#1a1a1a] dark:border-neutral-700 dark:text-white dark:focus:border-neutral-500"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="font-bold text-[#1a1a1a] dark:text-white">{filteredPosts.length}</span> patterns
                  </span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer flex flex-col h-full bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-2xl hover:border-transparent dark:bg-[#111] dark:border-neutral-800 dark:hover:border-neutral-700 transition-all duration-300"
                >
                  <div className="mb-6">
                    <span className="bg-[#facc15] text-black text-[10px] font-black uppercase px-2 py-1 tracking-tighter">
                      {post.categories?.name}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-8 flex-grow dark:text-neutral-400">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
                    <span className="text-xs font-bold text-[#1a1a1a] dark:text-white">{post.author}</span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{post.read_time}</span>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-400 text-lg">No patterns found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-12 bg-white border-t border-neutral-200 py-8 dark:bg-[#111] dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <h1 className="text-xl font-black tracking-tighter">Boring<span className="text-[#facc15]">Java</span></h1>
          <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
            © 2024 BORINGJAVA ENTERPRISE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs font-bold hover:underline">Twitter</a>
            <a href="#" className="text-xs font-bold hover:underline">GitHub</a>
            <a href="#" className="text-xs font-bold hover:underline">RSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
