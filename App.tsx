import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './supabase';
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
    name: 'Creational',
    description: 'Object creation',
    patterns: designPatternsPosts.filter(p => p.category_id === 1)
  },
  structural: {
    name: 'Structural',
    description: 'Object composition',
    patterns: designPatternsPosts.filter(p => p.category_id === 2)
  },
  behavioral: {
    name: 'Behavioral',
    description: 'Object interaction',
    patterns: designPatternsPosts.filter(p => p.category_id === 3)
  }
};

const App: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showDesignPatternsPage, setShowDesignPatternsPage] = useState(false);

  const categories: (string | Category)[] = ['All', 'Java SE', 'Design Patterns', 'System Design', 'Spring Boot'];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Try to fetch from Supabase
        const { data: dbPosts, error } = await supabase
          .from('posts')
          .select('*, categories(*)')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error || !dbPosts || dbPosts.length === 0) {
          // Fallback to local data if Supabase is not configured or empty
          console.log('Using local data...');
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
        } else {
          // Use database posts
          setAllPosts(dbPosts.map((p: any) => ({
            ...p,
            date: p.created_at,
            readTime: p.read_time,
            code_snippet: p.code_snippet
          })));
        }
      } catch (err) {
        // Fallback to local data on error
        console.log('Supabase not configured, using local data...');
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
      }
      setLoading(false);
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const lines = code.split('\n');
    
    const highlightLine = (line: string) => {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let key = 0;
      
      const patterns: [RegExp, string][] = [
        [/^(\/\/.*)$/, 'ch'],
        [/^(\/\*[\s\S]*?\*\/)$/, 'ch'],
        [/("(?:[^"\\]|\\.)*")/, 'cs'],
        [/(\b\d+\.?\d*\b)/, 'cn'],
        [/\b(true|false|null)\b/, 'cb'],
        [/\b(void|int|long|double|float|char|byte|short|boolean)\b/, 'cp'],
        [/\b(String|Integer|Long|Double|Float|Boolean|Character|Byte|Short|List|Map|Set|ArrayList|HashMap|HashSet|Object|System|PrintStream)\b/, 'ct'],
        [/\b(public|private|protected|static|final|class|interface|abstract|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|this|super|import|package|enum)\b/, 'ck'],
        [/\b(main|out|println|printf|print|length|size|get|set|add|remove|put|getOrDefault)\b/, 'cm'],
      ];
      
      const colorMap: Record<string, string> = {
        'ch': 'text-gray-500',
        'cs': 'text-yellow-300',
        'cn': 'text-purple-400',
        'cb': 'text-red-400',
        'cp': 'text-orange-400',
        'ct': 'text-cyan-400',
        'ck': 'text-pink-400',
        'cm': 'text-green-400',
      };
      
      const processPatterns = () => {
        if (!remaining.trim()) {
          parts.push(<span key={key++}>{remaining}</span>);
          return;
        }
        
        for (const [pattern, cls] of patterns) {
          const match = remaining.match(pattern);
          if (match && match.index === 0) {
            parts.push(<span key={key++} className={colorMap[cls]}>{match[1]}</span>);
            remaining = remaining.slice(match[0].length);
            processPatterns();
            return;
          }
        }
        
        if (remaining.length > 0) {
          parts.push(<span key={key++}>{remaining[0]}</span>);
          remaining = remaining.slice(1);
          processPatterns();
        }
      };
      
      processPatterns();
      return parts;
    };
    
    return (
      <pre className="p-6 text-sm text-neutral-200 overflow-x-auto font-mono leading-relaxed">
        {lines.map((line, i) => (
          <div key={i}>{highlightLine(line)}</div>
        ))}
      </pre>
    );
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPatternIndex = (post: Post) => {
    const pattern = designPatternsPosts.find(p => p.id === post.id);
    if (!pattern) return null;
    return designPatternsPosts.indexOf(pattern) + 1;
  };

  const DesignPatternsPage = () => {
    const [activeSection, setActiveSection] = useState<string>('creational');
    const [mobilePatternList, setMobilePatternList] = useState(false);
    const currentPatterns = patternCategories[activeSection as keyof typeof patternCategories].patterns;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors">
        <style>{`
          .prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
          .prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
          .prose p { margin-bottom: 1rem; line-height: 1.75; }
          .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .prose li { margin-bottom: 0.5rem; }
          .prose strong { font-weight: 600; }
          .dark .prose h2, .dark .prose h3 { color: #f5f5f5; }
          .dark .prose p, .dark .prose li { color: #d4d4d4; }
        `}</style>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 py-6 px-4">
            <button
              onClick={() => { setShowDesignPatternsPage(false); setSelectedPost(null); }}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm mb-4 flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to blog
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">Design Patterns</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">23 patterns by Gang of Four</p>
          </div>

          {/* Section Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto px-4">
            {Object.entries(patternCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => { setActiveSection(key); setSelectedPost(null); }}
                className={`px-4 md:px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeSection === key
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {cat.name}
                <span className="ml-2 text-xs font-normal text-gray-400">{cat.patterns.length}</span>
              </button>
            ))}
          </div>

          {/* Mobile Pattern List Toggle */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setMobilePatternList(!mobilePatternList)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <span className="text-sm font-medium">View Pattern List</span>
              <svg className={`w-5 h-5 transition-transform ${mobilePatternList ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {mobilePatternList && (
              <div className="mt-2 space-y-1">
                {currentPatterns.map((pattern, idx) => {
                  const globalIndex = designPatternsPosts.indexOf(pattern) + 1;
                  return (
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
                        setMobilePatternList(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      {globalIndex}. {pattern.title.split(' - ')[0]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Desktop Pattern List */}
            <div className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-200px)] sticky top-[73px] self-start">
              <div className="p-4 space-y-1">
                {currentPatterns.map((pattern, idx) => {
                  const globalIndex = designPatternsPosts.indexOf(pattern) + 1;
                  const isActive = selectedPost?.id === pattern.id;
                  return (
                    <button
                      key={pattern.id}
                      onClick={() => setSelectedPost({
                        ...pattern,
                        date: pattern.created_at,
                        readTime: pattern.read_time,
                        code_snippet: pattern.code_snippet,
                        category: 'Design Patterns'
                      })}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-gray-400 dark:text-gray-500 mr-2">{globalIndex}.</span>
                      {pattern.title.split(' - ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 md:p-8 lg:p-12">
              {selectedPost ? (
                <article className="max-w-3xl mx-auto">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm mb-6 flex items-center transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    All patterns
                  </button>

                  <span className="inline-block bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1 tracking-tight mb-4">
                    {getPatternIndex(selectedPost)} / 23
                  </span>

                  <h1 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight text-gray-900 dark:text-white">
                    {selectedPost.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedPost.author}</span>
                    <span>•</span>
                    <span>{selectedPost.read_time || selectedPost.readTime}</span>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-base md:text-lg"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

                  {selectedPost.code_snippet && (
                    <div className="my-8 bg-[#1e1e1e] rounded-xl overflow-hidden">
                      <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#3d3d3d]">
                        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Example</span>
                      </div>
                      <CodeBlock code={selectedPost.code_snippet} />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
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
                          window.scrollTo(0, 0);
                        }}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {designPatternsPosts[getPatternIndex(selectedPost)! - 2].title.split(' - ')[0]}
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
                          window.scrollTo(0, 0);
                        }}
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 ml-auto"
                      >
                        {designPatternsPosts[getPatternIndex(selectedPost)!].title.split(' - ')[0]}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </article>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {currentPatterns.map((pattern, idx) => {
                    const globalIndex = designPatternsPosts.indexOf(pattern) + 1;
                    return (
                      <button
                        key={pattern.id}
                        onClick={() => setSelectedPost({
                          ...pattern,
                          date: pattern.created_at,
                          readTime: pattern.read_time,
                          code_snippet: pattern.code_snippet,
                          category: 'Design Patterns'
                        })}
                        className="text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-mono text-gray-400">{globalIndex}.</span>
                          <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-tight">
                            {patternCategories[activeSection as keyof typeof patternCategories].name}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                          {pattern.title.split(' - ')[0]}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {pattern.summary}
                        </p>
                        <span className="text-xs text-gray-400">{pattern.read_time}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showDesignPatternsPage) {
    return <DesignPatternsPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => { setSelectedPost(null); setActiveCategory('All'); setShowAbout(false); setMobileMenuOpen(false); }}
            className="flex items-center"
          >
            <img src="/download.png" alt="BoringJava" className="h-9 dark:brightness-0 dark:invert" />
          </button>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
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
                  }
                }}
                className={`text-sm font-semibold transition-colors ${
                  cat === 'Design Patterns' ? 'text-yellow-400' : ''
                } ${
                  !showAbout && activeCategory === cat ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => { setShowAbout(true); setSelectedPost(null); }}
              className={`text-sm font-semibold transition-colors ${
                showAbout ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
            <div className="px-4 py-3 space-y-1">
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
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    cat === 'Design Patterns' ? 'text-yellow-400 bg-gray-50 dark:bg-gray-900' : ''
                  } ${
                    !showAbout && activeCategory === cat
                      ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowAbout(true);
                  setSelectedPost(null);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  showAbout
                    ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                About
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {showAbout ? (
          <section className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight text-gray-900 dark:text-white">About Me</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Hi, I'm <strong className="text-gray-900 dark:text-white">Subrat</strong>, a passionate Java developer.
            </p>
          </section>
        ) : selectedPost ? (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-6 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to posts
            </button>
            <span className="inline-block bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1 tracking-tight mb-4">
              {getCategoryName(selectedPost)}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-6 leading-tight text-gray-900 dark:text-white">{selectedPost.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-bold text-gray-900 dark:text-white">{selectedPost.author}</span>
              <span>•</span>
              <span>{formatDate(selectedPost.date)}</span>
              <span>•</span>
              <span>{getReadTime(selectedPost)}</span>
            </div>
            <div className="prose dark:prose-invert max-w-none text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') }} />
            {getCodeSnippet(selectedPost) && (
              <div className="my-8 bg-[#1e1e1e] rounded-xl overflow-hidden">
                <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#3d3d3d]">
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Example</span>
                </div>
                <CodeBlock code={getCodeSnippet(selectedPost)} />
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="mb-8 md:mb-16">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">The Repository</h2>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter max-w-2xl leading-none text-gray-900 dark:text-white">
                  Predictable code is <span className="text-yellow-400">successful</span> code.
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 px-4 py-2.5 pl-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-bold text-gray-900 dark:text-white">{filteredPosts.length}</span> posts
                  </span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
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
                  className="group cursor-pointer flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                >
                  <div className="mb-6">
                    <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1 tracking-tight">
                      {getCategoryName(post)}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{post.author}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{getReadTime(post)}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/download.png" alt="BoringJava" className="h-6 dark:brightness-0 dark:invert" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © 2024 BORINGJAVA ENTERPRISE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">RSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
