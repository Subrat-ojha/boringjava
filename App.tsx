import React, { useState, useMemo } from 'react';
import { posts as localPosts } from './data/posts';
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

const patternCategories = {
  creational: {
    name: 'Creational Patterns',
    icon: '🔧',
    description: 'Object creation mechanisms',
    color: '#10b981',
    patterns: designPatternsPosts.filter(p => p.category_id === 1)
  },
  structural: {
    name: 'Structural Patterns',
    icon: '🏗️',
    description: 'Object composition',
    color: '#3b82f6',
    patterns: designPatternsPosts.filter(p => p.category_id === 2)
  },
  behavioral: {
    name: 'Behavioral Patterns',
    icon: '🎯',
    description: 'Object interaction & responsibility',
    color: '#8b5cf6',
    patterns: designPatternsPosts.filter(p => p.category_id === 3)
  }
};

const App: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPatternType, setSelectedPatternType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showDesignPatternsPage, setShowDesignPatternsPage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const categories: (string | Category)[] = ['All', 'Java SE', 'Design Patterns', 'System Design', 'Spring Boot'];

  React.useEffect(() => {
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
      category: 'Design Patterns'
    })));
    setAllPosts(combinedPosts);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
        p.summary.toLowerCase().includes(query)
      );
    }
    return result;
  }, [activeCategory, searchQuery, allPosts]);

  const getReadTime = (post: Post) => post.read_time || post.readTime || '5 min';
  const getCodeSnippet = (post: Post) => post.code_snippet || post.codeSnippet || '';
  const getCategoryName = (post: Post) => post.categories?.name || post.category || 'Java SE';

  const escapeHtml = (text: string): string => {
    const map: { [key: string]: string } = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  const highlightCode = (code: string): string => {
    let escaped = escapeHtml(code);
    const tokens: [RegExp, string][] = [
      [/(\/\/.*$)/gm, 'comment'],
      [/(\/\*[\s\S]*?\*\/)/g, 'comment'],
      [/("(?:[^"\\]|\\.)*")/g, 'string'],
      [/(\b\d+\.?\d*\b)/g, 'number'],
      [/\b(true|false|null)\b/g, 'boolean'],
      [/\b(void|int|long|double|float|char|byte|short|boolean)\b/g, 'primitive'],
      [/\b(String|Integer|Long|Double|Float|Boolean|Character|Byte|Short|List|Map|Set|ArrayList|HashMap|HashSet|Object|System|PrintStream)\b/g, 'type'],
      [/\b(public|private|protected|class|interface|abstract|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|void|static|final|this|super|import|package|enum)\b/g, 'keyword'],
      [/\b(main|out|println|printf|print|length|size|get|set|add|remove|put|getOrDefault)\b/g, 'method'],
      [/\b([A-Z][a-zA-Z0-9_]*)\b/g, 'class-name'],
    ];
    for (const [pattern, className] of tokens) {
      escaped = escaped.replace(pattern, `<span class="${className}">$1</span>`);
    }
    return escaped;
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPatternById = (id: number | string | undefined) => {
    if (!id) return null;
    return designPatternsPosts.find(p => p.id === id);
  };

  const getPatternIndex = (post: Post) => {
    const pattern = designPatternsPosts.find(p => p.id === post.id);
    if (!pattern) return null;
    return designPatternsPosts.indexOf(pattern) + 1;
  };

  const DesignPatternsPage = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'creational' | 'structural' | 'behavioral'>('overview');

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex">
        <style>{`
          .dp-sidebar {
            background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
            width: 320px;
            min-height: 100vh;
            border-right: 1px solid rgba(255,255,255,0.1);
          }
          .dp-pattern-item {
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
          }
          .dp-pattern-item:hover {
            background: rgba(255,255,255,0.05);
            border-left-color: #facc15;
          }
          .dp-pattern-item.active {
            background: rgba(250, 204, 21, 0.1);
            border-left-color: #facc15;
          }
          .dp-card {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
          }
          .dp-card:hover {
            transform: translateY(-4px);
            border-color: rgba(250, 204, 21, 0.5);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(250, 204, 21, 0.1);
          }
          .dp-code-block {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 12px;
            overflow: hidden;
          }
          .dp-code-header {
            background: linear-gradient(90deg, #e94560 0%, #f97316 50%, #facc15 100%);
            padding: 10px 16px;
          }
          .dp-code-content {
            padding: 16px;
            font-family: 'Fira Code', 'JetBrains Mono', monospace;
            font-size: 12px;
            line-height: 1.6;
            overflow-x: auto;
          }
          .dp-tab {
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          .dp-tab:hover { background: rgba(255,255,255,0.1); }
          .dp-tab.active { background: #facc15; color: black; }
          .dp-badge {
            background: rgba(250, 204, 21, 0.2);
            color: #facc15;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
          }
          .dp-section-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
          .code-keyword { color: #ff79c6; }
          .code-primitive { color: #ffb86c; }
          .code-type { color: #8be9fd; }
          .code-string { color: #f1fa8c; }
          .code-number { color: #bd93f9; }
          .code-boolean { color: #ff5555; }
          .code-comment { color: #6272a4; font-style: italic; }
          .code-method { color: #50fa7b; }
          .code-class-name { color: #f8f8f2; }
        `}</style>

        {/* Sidebar */}
        <aside className={`dp-sidebar flex flex-col ${sidebarOpen ? '' : 'hidden md:flex'}`}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#facc15] to-[#f97316] flex items-center justify-center font-black text-black">DP</div>
              <div>
                <h2 className="font-bold text-lg">Design Patterns</h2>
                <p className="text-xs text-white/50">23 GoF Patterns</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#facc15]"
              />
            </div>
          </div>

          {/* Pattern Categories */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <button
                onClick={() => { setActiveTab('overview'); setSelectedPost(null); }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'overview' ? 'bg-[#facc15] text-black' : 'hover:bg-white/10'}`}
              >
                <span className="text-xl">📚</span>
                <span className="font-semibold">Overview</span>
              </button>
            </div>

            {Object.entries(patternCategories).map(([key, cat]) => (
              <div key={key} className="mb-6">
                <button
                  onClick={() => { setActiveTab(key as any); setSelectedPost(null); }}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="dp-section-icon" style={{ background: cat.color + '20' }}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{cat.name}</h3>
                      <p className="text-xs text-white/40">{cat.patterns.length} patterns</p>
                    </div>
                  </div>
                </button>

                <div className="space-y-1 ml-4">
                  {cat.patterns.map((pattern, idx) => (
                    <button
                      key={pattern.id}
                      onClick={() => {
                        setSelectedPost({
                          ...pattern,
                          date: pattern.created_at,
                          readTime: pattern.read_time,
                          code_snippet: pattern.code_snippet,
                          category: 'Design Patterns'
                        });
                      }}
                      className={`dp-pattern-item w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${selectedPost?.id === pattern.id ? 'active' : ''}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-white/80 truncate">{pattern.title.split(' - ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => { setShowDesignPatternsPage(false); setSelectedPost(null); }}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Blog
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('creational')}
                  className={`dp-tab ${activeTab === 'creational' ? 'active' : 'text-white/60'}`}
                  style={{ color: activeTab !== 'creational' ? '#10b981' : undefined }}
                >
                  🔧 Creational
                </button>
                <button
                  onClick={() => setActiveTab('structural')}
                  className={`dp-tab ${activeTab === 'structural' ? 'active' : 'text-white/60'}`}
                  style={{ color: activeTab !== 'structural' ? '#3b82f6' : undefined }}
                >
                  🏗️ Structural
                </button>
                <button
                  onClick={() => setActiveTab('behavioral')}
                  className={`dp-tab ${activeTab === 'behavioral' ? 'active' : 'text-white/60'}`}
                  style={{ color: activeTab !== 'behavioral' ? '#8b5cf6' : undefined }}
                >
                  🎯 Behavioral
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {selectedPost ? (
              /* Pattern Detail View */
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <span className="dp-badge mb-4 inline-block">
                    {getPatternIndex(selectedPost)} / 23
                  </span>
                  <h1 className="text-4xl font-black mb-4">{selectedPost.title}</h1>
                  <div className="flex items-center gap-6 text-white/60">
                    <span className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#facc15] to-[#f97316] flex items-center justify-center text-black font-bold text-sm">
                        {selectedPost.author.charAt(0)}
                      </span>
                      {selectedPost.author}
                    </span>
                    <span>•</span>
                    <span>{selectedPost.read_time || selectedPost.readTime}</span>
                  </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

                {selectedPost.code_snippet && (
                  <div className="dp-code-block">
                    <div className="dp-code-header flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-4 text-sm font-semibold text-white/80">Example.java</span>
                    </div>
                    <pre
                      className="dp-code-content text-neutral-200"
                      dangerouslySetInnerHTML={{ __html: highlightCode(selectedPost.code_snippet) }}
                    />
                  </div>
                )}

                {/* Navigation between patterns */}
                <div className="mt-12 flex justify-between">
                  {getPatternIndex(selectedPost)! > 1 && (
                    <button
                      onClick={() => {
                        const prevPattern = designPatternsPosts[getPatternIndex(selectedPost)! - 2];
                        setSelectedPost({
                          ...prevPattern,
                          date: prevPattern.created_at,
                          readTime: prevPattern.read_time,
                          code_snippet: prevPattern.code_snippet,
                          category: 'Design Patterns'
                        });
                      }}
                      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous Pattern
                    </button>
                  )}
                  {getPatternIndex(selectedPost)! < 23 && (
                    <button
                      onClick={() => {
                        const nextPattern = designPatternsPosts[getPatternIndex(selectedPost)!];
                        setSelectedPost({
                          ...nextPattern,
                          date: nextPattern.created_at,
                          readTime: nextPattern.read_time,
                          code_snippet: nextPattern.code_snippet,
                          category: 'Design Patterns'
                        });
                      }}
                      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors ml-auto"
                    >
                      Next Pattern
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Pattern Overview/List View */
              <div>
                {activeTab === 'overview' && (
                  <div>
                    <div className="text-center mb-16">
                      <h1 className="text-5xl font-black mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-[#f97316] to-[#e94560]">
                          Design Patterns
                        </span>
                      </h1>
                      <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Master the 23 Gang of Four design patterns with real-world Java examples.
                        Organized for systematic learning from fundamentals to advanced concepts.
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto">
                      <div className="dp-card rounded-xl p-6 text-center">
                        <div className="text-4xl font-black text-[#10b981] mb-2">5</div>
                        <div className="text-white/60 text-sm">Creational</div>
                      </div>
                      <div className="dp-card rounded-xl p-6 text-center">
                        <div className="text-4xl font-black text-[#3b82f6] mb-2">7</div>
                        <div className="text-white/60 text-sm">Structural</div>
                      </div>
                      <div className="dp-card rounded-xl p-6 text-center">
                        <div className="text-4xl font-black text-[#8b5cf6] mb-2">11</div>
                        <div className="text-white/60 text-sm">Behavioral</div>
                      </div>
                    </div>

                    {/* Category Cards */}
                    {Object.entries(patternCategories).map(([key, cat]) => (
                      <div key={key} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="dp-section-icon" style={{ background: cat.color + '20' }}>
                            {cat.icon}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">{cat.name}</h2>
                            <p className="text-white/50">{cat.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cat.patterns.map((pattern, idx) => (
                            <button
                              key={pattern.id}
                              onClick={() => {
                                setSelectedPost({
                                  ...pattern,
                                  date: pattern.created_at,
                                  readTime: pattern.read_time,
                                  code_snippet: pattern.code_snippet,
                                  category: 'Design Patterns'
                                });
                              }}
                              className="dp-card rounded-xl p-6 text-left"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                  style={{ background: cat.color + '30', color: cat.color }}>
                                  {idx + 1}
                                </span>
                                <span className="dp-badge" style={{ background: cat.color + '20', color: cat.color }}>
                                  {cat.name.split(' ')[0]}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg mb-2">{pattern.title.split(' - ')[0]}</h3>
                              <p className="text-white/50 text-sm mb-4 line-clamp-2">{pattern.summary}</p>
                              <div className="flex items-center justify-between text-xs text-white/40">
                                <span>{pattern.read_time}</span>
                                <span className="flex items-center gap-1">
                                  Read More
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab !== 'overview' && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="dp-section-icon" style={{ background: patternCategories[activeTab as keyof typeof patternCategories].color + '20' }}>
                        {patternCategories[activeTab as keyof typeof patternCategories].icon}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold">{patternCategories[activeTab as keyof typeof patternCategories].name}</h1>
                        <p className="text-white/50">{patternCategories[activeTab as keyof typeof patternCategories].description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {patternCategories[activeTab as keyof typeof patternCategories].patterns.map((pattern, idx) => (
                        <button
                          key={pattern.id}
                          onClick={() => {
                            setSelectedPost({
                              ...pattern,
                              date: pattern.created_at,
                              readTime: pattern.read_time,
                              code_snippet: pattern.code_snippet,
                              category: 'Design Patterns'
                            });
                          }}
                          className="dp-card w-full rounded-xl p-6 text-left flex items-center gap-6"
                        >
                          <span className="text-3xl font-black w-12 text-center"
                            style={{ color: patternCategories[activeTab as keyof typeof patternCategories].color }}>
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1">{pattern.title.split(' - ')[0]}</h3>
                            <p className="text-white/50">{pattern.summary}</p>
                          </div>
                          <div className="text-sm text-white/40">{pattern.read_time}</div>
                          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    );
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

  if (showDesignPatternsPage) {
    return <DesignPatternsPage />;
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
        }
        .code-dot { width: 12px; height: 12px; border-radius: 50%; }
        .code-content {
          padding: 20px;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.7;
        }
        .code-keyword { color: #ff79c6; }
        .code-primitive { color: #ffb86c; }
        .code-type { color: #8be9fd; }
        .code-string { color: #f1fa8c; }
        .code-number { color: #bd93f9; }
        .code-boolean { color: #ff5555; }
        .code-comment { color: #6272a4; font-style: italic; }
        .code-method { color: #50fa7b; }
        .code-class-name { color: #f8f8f2; }
      `}</style>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200 dark:bg-[#111]/80 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => { setSelectedPost(null); setActiveCategory('All'); setShowAbout(false); }}>
            <img src="/download.png" alt="BoringJava" className="h-10 dark:invert" />
          </div>
          <div className="hidden md:flex space-x-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  if (cat === 'Design Patterns') {
                    setShowDesignPatternsPage(true);
                  } else {
                    setActiveCategory(cat);
                    setSelectedPost(null);
                    setShowAbout(false);
                    setShowDesignPatternsPage(false);
                  }
                }}
                className={`text-sm font-semibold tracking-tight transition-colors relative group ${cat === 'Design Patterns' ? 'text-[#facc15]' : ''} ${!showAbout && activeCategory === cat ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
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
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
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
            <button className="hidden md:block bg-gradient-to-r from-[#facc15] to-[#f97316] text-black text-xs font-bold px-4 py-2 rounded-full">
              Subscribe
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {showAbout ? (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-8">About Me</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Hi, I'm <strong>Subrat</strong>, a passionate Java developer.
            </p>
          </section>
        ) : selectedPost ? (
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedPost(null)} className="mb-8 flex items-center text-neutral-400 hover:text-white transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to posts
            </button>
            <span className="bg-gradient-to-r from-[#facc15] to-[#f97316] text-black text-xs font-black uppercase px-3 py-1.5 rounded-full">
              {getCategoryName(selectedPost)}
            </span>
            <h1 className="text-5xl font-extrabold mt-4 mb-6">{selectedPost.title}</h1>
            <div className="flex items-center space-x-4 mb-12 text-sm text-neutral-500">
              <span className="font-bold">{selectedPost.author}</span>
              <span>•</span>
              <span>{formatDate(selectedPost.date)}</span>
              <span>•</span>
              <span>{getReadTime(selectedPost)}</span>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-lg"
              dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n\n/g, '</p><p class="mb-6">').replace(/^/, '<p class="mb-6">').replace(/$/, '</p>') }} />
            {getCodeSnippet(selectedPost) && (
              <div className="my-12 code-block">
                <div className="code-header flex items-center gap-2">
                  <div className="code-dot bg-[#ff5f56]"></div>
                  <div className="code-dot bg-[#ffbd2e]"></div>
                  <div className="code-dot bg-[#27ca40]"></div>
                  <span className="ml-4 text-xs font-bold text-white/80">Example.java</span>
                </div>
                <pre className="code-content text-neutral-200"
                  dangerouslySetInnerHTML={{ __html: highlightCode(getCodeSnippet(selectedPost)) }} />
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">The Repository</h2>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-6xl font-extrabold tracking-tighter max-w-2xl">
                  Predictable code is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-[#f97316]">successful</span> code.
                </h1>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2.5 pl-10 bg-white border rounded-full text-sm focus:outline-none focus:border-[#facc15] dark:bg-[#1a1a1a] dark:border-neutral-700"
                  />
                  <span className="text-sm text-neutral-500">
                    <span className="font-bold">{filteredPosts.length}</span> posts
                  </span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={`${post.id}-${index}`}
                  onClick={() => {
                    if (getCategoryName(post) === 'Design Patterns') {
                      setShowDesignPatternsPage(true);
                    } else {
                      setSelectedPost(post);
                    }
                  }}
                  className="group cursor-pointer flex flex-col h-full bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-2xl hover:border-[#facc15]/50 hover:-translate-y-1 dark:bg-[#111] dark:border-neutral-800 transition-all duration-300"
                >
                  <div className="mb-6">
                    <span className="bg-gradient-to-r from-[#facc15] to-[#f97316] text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-full">
                      {getCategoryName(post)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-[#f97316] transition-colors">{post.title}</h3>
                  <p className="text-neutral-500 text-sm mb-6 flex-grow dark:text-neutral-400">{post.summary}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs font-bold">{post.author}</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{getReadTime(post)}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 bg-white border-t border-neutral-200 py-8 dark:bg-[#111] dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <img src="/download.png" alt="BoringJava" className="h-6 dark:invert" />
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            © 2024 BORINGJAVA ENTERPRISE
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs font-bold hover:text-[#facc15]">Twitter</a>
            <a href="#" className="text-xs font-bold hover:text-[#facc15]">GitHub</a>
            <a href="#" className="text-xs font-bold hover:text-[#facc15]">RSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
