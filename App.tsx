import React, { useState, useMemo, useEffect } from 'react';
import { posts as localPosts, Post as LocalPost } from './data/posts';
import { designPatternsPosts } from './data/designPatterns';

type Category = 'Java SE' | 'Design Patterns' | 'System Design' | 'Spring Boot';

interface Post {
  id: number | string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  code_snippet?: string;
  codeSnippet?: string;
  author: string;
  category_id?: number;
  category?: Category;
  read_time?: string;
  readTime?: string;
  published?: boolean;
  created_at?: string;
  date?: string;
  categories?: {
    id: number;
    name: string;
    slug: string;
    description?: string;
  };
}

const App: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const categories: (string | Category)[] = ['All', 'Java SE', 'Design Patterns', 'System Design', 'Spring Boot'];

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
    const combinedPosts: Post[] = [];
    
    combinedPosts.push(...localPosts.map(p => ({
      ...p,
      date: p.date,
      readTime: p.readTime,
      code_snippet: p.codeSnippet
    })));
    
    combinedPosts.push(...designPatternsPosts.map(p => ({
      ...p,
      date: p.created_at,
      readTime: p.read_time,
      category: getCategoryFromId(p.category_id || 1)
    })));
    
    setAllPosts(combinedPosts);
    setLoading(false);
  };

  const getCategoryFromId = (id: number): Category => {
    switch(id) {
      case 1: return 'Design Patterns';
      case 2: return 'System Design';
      case 3: return 'Spring Boot';
      default: return 'Java SE';
    }
  };

  const filteredPosts = useMemo(() => {
    let result = allPosts;

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
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
  }, [activeCategory, searchQuery, allPosts]);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getReadTime = (post: Post) => {
    return post.read_time || post.readTime || '5 min';
  };

  const getCodeSnippet = (post: Post) => {
    return post.code_snippet || post.codeSnippet || '';
  };

  const getCategoryName = (post: Post) => {
    return post.categories?.name || post.category || 'Java SE';
  };

  const highlightCode = (code: string) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
      .replace(/\b(public|private|protected|class|interface|abstract|extends|implements|new|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|throws|void|static|final|this|super)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(String|int|double|float|boolean|long|char|byte|short|void|Integer|Double|Float|Boolean|Long|List|Map|Set|ArrayList|HashMap|HashSet)\b/g, '<span class="type">$1</span>')
      .replace(/(".*?")/g, '<span class="string">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="boolean">$1</span>')
      .replace(/(\(|\)|{|}|\[|\]|;|,|:)/g, '<span class="punctuation">$1</span>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-[#e5e5e5] transition-colors duration-300">
      <style>{`
        .code-block {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 60px rgba(250, 204, 21, 0.1);
        }
        .code-header {
          background: linear-gradient(90deg, #e94560 0%, #f97316 50%, #facc15 100%);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .code-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .code-content {
          padding: 20px;
          overflow-x: auto;
          font-family: 'Fira Code', 'JetBrains Mono', 'Monaco', monospace;
          font-size: 13px;
          line-height: 1.7;
        }
        .code-content .keyword { color: #ff79c6; font-weight: 600; }
        .code-content .type { color: #8be9fd; }
        .code-content .string { color: #f1fa8c; }
        .code-content .number { color: #bd93f9; }
        .code-content .boolean { color: #ff5555; }
        .code-content .comment { color: #6272a4; font-style: italic; }
        .code-content .punctuation { color: #f8f8f2; }
        .code-content .method { color: #50fa7b; }
        .code-content .class-name { color: #ffb86c; }
        .code-content .annotation { color: #ff79c6; }
      `}</style>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200 dark:bg-[#111]/80 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => { setSelectedPost(null); setActiveCategory('All'); setShowAbout(false); }}>
            <img src="/download.png" alt="BoringJava" className="h-10 dark:invert dark:brightness-0 dark:sepia dark:hue-rotate-180 dark:saturate-[1000%]" />
          </div>
          <div className="hidden md:flex space-x-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedPost(null); setShowAbout(false); }}
                className={`text-sm font-semibold tracking-tight transition-colors relative group ${!showAbout && activeCategory === cat ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
              >
                {cat}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#facc15] transition-all duration-300 group-hover:w-full ${activeCategory === cat ? 'w-full' : ''}`}></span>
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
            <button className="hidden md:block bg-gradient-to-r from-[#facc15] to-[#f97316] text-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest hover:shadow-lg hover:shadow-[#facc15]/30 transition-all">
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
                  className={`text-left text-sm font-semibold py-2 transition-colors ${!showAbout && activeCategory === cat ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400'}`}
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
                    Developing backend systems using FSM-based frameworks.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : selectedPost ? (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-8 text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white flex items-center text-sm font-semibold transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to posts
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gradient-to-r from-[#facc15] to-[#f97316] text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider">
                {getCategoryName(selectedPost)}
              </span>
            </div>
            
            <h1 className="text-5xl font-extrabold mt-4 mb-6 leading-tight">
              {selectedPost.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-12 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#facc15] to-[#f97316] flex items-center justify-center text-white font-bold text-xs">
                  {selectedPost.author.charAt(0)}
                </div>
                <span className="font-bold text-[#1a1a1a] dark:text-white">{selectedPost.author}</span>
              </div>
              <span>•</span>
              <span>{formatDate(selectedPost.date || selectedPost.created_at)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {getReadTime(selectedPost)}
              </span>
            </div>

            <div className="prose prose-neutral max-w-none text-lg leading-relaxed text-neutral-700 dark:text-neutral-300"
              dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n\n/g, '</p><p class="mb-6">').replace(/^/, '<p class="mb-6">').replace(/$/, '</p>') }} />

            {getCodeSnippet(selectedPost) && (
              <div className="my-12 code-block">
                <div className="code-header">
                  <div className="code-dot bg-[#ff5f56]"></div>
                  <div className="code-dot bg-[#ffbd2e]"></div>
                  <div className="code-dot bg-[#27ca40]"></div>
                  <span className="ml-4 text-xs font-bold text-white/80 tracking-wider">Example.java</span>
                </div>
                <pre 
                  className="code-content text-neutral-200"
                  dangerouslySetInnerHTML={{ __html: highlightCode(getCodeSnippet(selectedPost)) }}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">The Repository</h2>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-6xl font-extrabold tracking-tighter max-w-2xl leading-none">
                  Predictable code is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-[#f97316]">successful</span> code.
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 px-4 py-2.5 pl-10 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-[#facc15] focus:ring-4 focus:ring-[#facc15]/20 transition-all dark:bg-[#1a1a1a] dark:border-neutral-700 dark:text-white"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="font-bold text-[#1a1a1a] dark:text-white">{filteredPosts.length}</span> posts
                    {activeCategory !== 'All' && <span> in {activeCategory}</span>}
                  </span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={`${post.id}-${index}`}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer flex flex-col h-full bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-2xl hover:border-[#facc15]/50 hover:-translate-y-1 dark:bg-[#111] dark:border-neutral-800 dark:hover:border-[#facc15]/50 transition-all duration-300"
                >
                  <div className="mb-6">
                    <span className="bg-gradient-to-r from-[#facc15] to-[#f97316] text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider">
                      {getCategoryName(post)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-[#f97316] dark:group-hover:text-[#facc15] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6 flex-grow dark:text-neutral-400">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#facc15] to-[#f97316] flex items-center justify-center text-white font-bold text-[10px]">
                        {post.author.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-[#1a1a1a] dark:text-white">{post.author}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {getReadTime(post)}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-neutral-400 text-lg">No posts found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-12 bg-white border-t border-neutral-200 py-8 dark:bg-[#111] dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <img src="/download.png" alt="BoringJava" className="h-6 dark:invert dark:brightness-0 dark:sepia dark:hue-rotate-180 dark:saturate-[1000%]" />
          <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
            © 2024 BORINGJAVA ENTERPRISE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs font-bold hover:text-[#facc15] transition-colors">Twitter</a>
            <a href="#" className="text-xs font-bold hover:text-[#facc15] transition-colors">GitHub</a>
            <a href="#" className="text-xs font-bold hover:text-[#facc15] transition-colors">RSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
