# BoringJava Blog

A clean, minimal blog for Java development content.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 How to Add a New Blog Post

1. Open `data/posts.ts`
2. Add a new post object to the `posts` array:

```typescript
{
  id: '6',                              // Unique ID (increment from last)
  title: 'Your Amazing Post Title',     // Post title
  category: 'Java SE',                  // One of: 'Java SE' | 'Design Patterns' | 'System Design' | 'Spring Boot'
  author: 'Your Name',                  // Author name
  date: 'Dec 25, 2024',                 // Publication date
  readTime: '5 min',                    // Estimated read time
  summary: 'A brief summary...',        // Shows on homepage (keep under 150 chars)
  content: 'Full blog content...',      // The full article content
  codeSnippet: 'optional code here'     // Optional code example
}
```

3. Save the file - changes hot-reload automatically!

## 📂 Project Structure

```
bboringjava/
├── App.tsx              # Main application component
├── index.tsx            # Entry point
├── index.html           # HTML template
├── data/
│   └── posts.ts         # 📝 YOUR BLOG POSTS GO HERE
├── public/
│   └── logo.png         # Logo image
└── package.json         # Dependencies
```

## 🎨 Customization

### Categories
Edit the categories in `App.tsx`:
```typescript
const categories = ['All', 'Java SE', 'Design Patterns', 'System Design', 'Spring Boot'];
```

Don't forget to update the `Post` interface in `data/posts.ts` if you add new categories:
```typescript
category: 'Java SE' | 'Design Patterns' | 'System Design' | 'Spring Boot' | 'Your New Category';
```

### Logo
Replace `public/logo.png` with your own logo image.

### Footer
Edit the footer section in `App.tsx` to update social links and copyright.

## 💡 Future Improvements

Here are some ideas to extend the blog:
- [ ] Add Markdown support for content
- [ ] Add a backend/CMS for easier post management
- [ ] Add search functionality
- [ ] Add tags/labels for posts
- [ ] Add comments system
- [ ] Add RSS feed
- [ ] Deploy to Vercel/Netlify

## 🛠 Built With

- React 19
- TypeScript
- Vite
- Tailwind CSS (via CDN)

---

Happy blogging! 🎉
