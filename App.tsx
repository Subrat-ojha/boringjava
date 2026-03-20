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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showDesignPatternsPage, setShowDesignPatternsPage] = useState(false);

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
      
      const patterns: [RegExp, string, (c: string) => string][] = [
        [/^(\/\/.*)$/, 'ch', c => c],
        [/^(\/\*[\s\S]*?\*\/)$/, 'ch', c => c],
        [/("(?:[^"\\]|\\.)*")/, 'cs', c => c],
        [/(\b\d+\.?\d*\b)/, 'cn', c => c],
        [/\b(true|false|null)\b/, 'cb', c => c],
        [/\b(void|int|long|double|float|char|byte|short|boolean)\b/, 'cp', c => c],
        [/\b(String|Integer|Long|Double|Float|Boolean|Character|Byte|Short|List|Map|Set|ArrayList|HashMap|HashSet|Object|System|PrintStream)\b/, 'ct', c => c],
        [/\b(public|private|protected|static|final|class|interface|abstract|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|this|super|import|package|enum)\b/, 'ck', c => c],
        [/\b(main|out|println|printf|print|length|size|get|set|add|remove|put|getOrDefault)\b/, 'cm', c => c],
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
        
        for (const [pattern, cls, transform] of patterns) {
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
    const currentPatterns = patternCategories[activeSection as keyof typeof patternCategories].patterns;

    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 py-8">
            <div className="px-6">
              <button
                onClick={() => setShowDesignPatternsPage(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-sm mb-4 flex items-center"
              >
                <span className="mr-1">←</span> Back to blog
              </button>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">Design Patterns</h1>
              <p className="text-neutral-500 text-lg">23 patterns by Gang of Four</p>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-6">
            {Object.entries(patternCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeSection === key
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                {cat.name}
                <span className="ml-2 text-xs font-normal text-neutral-400">{cat.patterns.length}</span>
              </button>
            ))}
          </div>

          <div className="flex">
            {/* Pattern List */}
            <div className="w-80 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-200px)] hidden lg:block">
              <div className="p-6 space-y-2">
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
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono ${isActive ? 'text-neutral-400' : 'text-neutral-400'}`}>
                          {globalIndex}.
                        </span>
                        <span className="text-sm font-medium truncate">
                          {pattern.title.split(' - ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 lg:p-12">
              {selectedPost ? (
                <article className="max-w-3xl mx-auto">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-sm mb-8 flex items-center"
                  >
                    <span className="mr-1">←</span> All patterns
                  </button>

                  <span className="bg-[#facc15] text-black text-[10px] font-black uppercase px-2 py-1 tracking-tighter">
                    {getPatternIndex(selectedPost)} / 23
                  </span>

                  <h1 className="text-4xl font-extrabold mt-4 mb-4 leading-tight">
                    {selectedPost.title}
                  </h1>

                  <div className="flex items-center space-x-4 mb-12 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="font-bold text-[#1a1a1a] dark:text-white">{selectedPost.author}</span>
                    <span>•</span>
                    <span>{selectedPost.read_time || selectedPost.readTime}</span>
                  </div>

                  <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }} />

                  {selectedPost.code_snippet && (
                    <div className="my-12 bg-[#1e1e1e] rounded-xl overflow-hidden">
                      <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#3d3d3d]">
                        <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase">Example</span>
                      </div>
                      <CodeBlock code={selectedPost.code_snippet} />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex justify-between">
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
                        className="text-sm font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                      >
                        ← {designPatternsPosts[getPatternIndex(selectedPost)! - 2].title.split(' - ')[0]}
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
                        className="text-sm font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 ml-auto"
                      >
                        {designPatternsPosts[getPatternIndex(selectedPost)!].title.split(' - ')[0]} →
                      </button>
                    )}
                  </div>
                </article>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="text-left bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs font-mono text-neutral-400">{globalIndex}.</span>
                          <span className="bg-[#facc15] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter">
                            {patternCategories[activeSection as keyof typeof patternCategories].name}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {pattern.title.split(' - ')[0]}
                        </h3>
                        <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                          {pattern.summary}
                        </p>
                        <span className="text-xs text-neutral-400 font-medium">
                          {pattern.read_time}
                        </span>
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
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showDesignPatternsPage) {
    return <DesignPatternsPage />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-[#e5e5e5]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 dark:bg-[#111] dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => { setSelectedPost(null); setActiveCategory('All'); setShowAbout(false); }}>
            <img src="/download.png" alt="BoringJava" className="h-10 dark:invert dark:brightness-0 dark:sepia dark:hue-rotate-180 dark:saturate-[1000%]" />
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
                  }
                }}
                className={`text-sm font-semibold tracking-tight transition-colors ${
                  cat === 'Design Patterns' ? 'text-[#facc15]' : ''
                } ${
                  !showAbout && activeCategory === cat ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => { setShowAbout(true); setSelectedPost(null); }}
              className={`text-sm font-semibold tracking-tight transition-colors ${
                showAbout ? 'text-[#1a1a1a] dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
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
            <button className="hidden md:block bg-[#1a1a1a] dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-2 rounded uppercase tracking-widest">
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
            <h2 className="text-4xl font-extrabold mb-8 tracking-tight">About Me</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Hi, I'm <strong>Subrat</strong>, a passionate Java developer.
            </p>
          </section>
        ) : selectedPost ? (
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedPost(null)} className="mb-8 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-sm font-semibold">
              ← Back to posts
            </button>
            <span className="bg-[#facc15] text-black text-[10px] font-black uppercase px-2 py-1 tracking-tighter">
              {getCategoryName(selectedPost)}
            </span>
            <h1 className="text-5xl font-extrabold mt-4 mb-6 leading-tight">{selectedPost.title}</h1>
            <div className="flex items-center space-x-4 mb-12 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="font-bold text-[#1a1a1a] dark:text-white">{selectedPost.author}</span>
              <span>•</span>
              <span>{formatDate(selectedPost.date)}</span>
              <span>•</span>
              <span>{getReadTime(selectedPost)}</span>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n\n/g, '</p><p class="mb-6">').replace(/^/, '<p class="mb-6">').replace(/$/, '</p>') }} />
            {getCodeSnippet(selectedPost) && (
              <div className="my-12 bg-[#1e1e1e] rounded-xl overflow-hidden">
                <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#3d3d3d]">
                  <span className="text-xs font-bold text-neutral-400 tracking-widest uppercase">Example</span>
                </div>
                <CodeBlock code={getCodeSnippet(selectedPost)} />
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">The Repository</h2>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-6xl font-extrabold tracking-tighter max-w-2xl leading-none">
                  Predictable code is <span className="text-[#facc15]">successful</span> code.
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 px-4 py-2.5 pl-10 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-neutral-400 dark:bg-[#1a1a1a] dark:border-neutral-700 dark:text-white"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="font-bold text-[#1a1a1a] dark:text-white">{filteredPosts.length}</span> posts
                  </span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                  className="group cursor-pointer flex flex-col h-full bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-2xl hover:border-transparent dark:bg-[#111] dark:border-neutral-800 dark:hover:border-neutral-700 transition-all duration-300"
                >
                  <div className="mb-6">
                    <span className="bg-[#facc15] text-black text-[10px] font-black uppercase px-2 py-1 tracking-tighter">
                      {getCategoryName(post)}
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
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{getReadTime(post)}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 bg-white border-t border-neutral-200 py-8 dark:bg-[#111] dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <img src="/download.png" alt="BoringJava" className="h-6 dark:invert dark:brightness-0 dark:sepia dark:hue-rotate-180 dark:saturate-[1000%]" />
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
