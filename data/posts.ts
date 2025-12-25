// =====================================================================
// 📝 HOW TO ADD YOUR NEXT BLOG POST
// =====================================================================
//
// Step 1: Copy the template below (uncomment it)
// Step 2: Paste it ABOVE this comment block (inside the posts array)
// Step 3: Fill in your content
// Step 4: Save the file - changes hot-reload automatically!
//
// =====================================================================
// 📋 COPY-PASTE TEMPLATE (uncomment and use):
// =====================================================================
//
// ,  // <-- Don't forget the comma after the previous post!
// {
//   id: '3',                                    // Increment from last post ID
//   title: 'Your Post Title Here',              // Keep it catchy but informative
//   category: 'Java SE',                        // Options: 'Java SE' | 'Design Patterns' | 'System Design' | 'Spring Boot'
//   author: 'Your Name',                        // Your name or alias
//   date: 'Dec 26, 2024',                       // Format: 'Mon DD, YYYY'
//   readTime: '5 min',                          // Estimate: ~200 words = 1 min
//   summary: 'A brief 1-2 sentence summary that appears on the homepage cards.',
//   content: `Your full article content goes here.
//
// Use double line breaks for new paragraphs.
//
// Section Heading:
//
// Content for this section goes here.
// Single line breaks are preserved within paragraphs.
//
// Another Section:
//
// • Bullet points work great
// • Just use the bullet character (•)
// • Or use dashes (-)
//
// Numbered lists:
// 1. First item
// 2. Second item
// 3. Third item`,
//   codeSnippet: `// Your code example here
// public class Example {
//     public static void main(String[] args) {
//         System.out.println("Hello, BoringJava!");
//     }
// }`
// }
//
// =====================================================================
// 📖 FIELD DESCRIPTIONS:
// =====================================================================
//
// id          : Unique identifier (string). Increment from last post.
// title       : Post title shown in cards and detail page.
// category    : Must be one of: 'Java SE' | 'Design Patterns' | 'System Design' | 'Spring Boot'
// author      : Your name or alias.
// date        : Publication date in format 'Mon DD, YYYY' (e.g., 'Dec 25, 2024')
// readTime    : Estimated read time (e.g., '5 min'). ~200 words = 1 minute.
// summary     : Short description for homepage cards. Keep under 150 characters.
// content     : Full article content. Use backticks (`) for multi-line.
//               - Double newlines (\n\n) create new paragraphs
//               - Single newlines are preserved within paragraphs
// codeSnippet : (Optional) Code example shown at the bottom of the post.
//
// =====================================================================
// 💡 FORMATTING TIPS:
// =====================================================================
//
// 1. Use DOUBLE line breaks between sections for clear paragraph separation
// 2. Section headings should end with a colon (:) on their own line
// 3. Use bullet points (•) or dashes (-) for lists
// 4. Use numbered lists (1. 2. 3.) for sequential steps
// 5. Keep code snippets focused and well-commented
// 6. Escape single quotes in content with backslash: \'
//
// =====================================================================

export interface Post {
  id: string;
  title: string;
  category: 'Java SE' | 'Design Patterns' | 'System Design' | 'Spring Boot';
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  codeSnippet?: string;
}

// ============================================
// ADD YOUR BLOG POSTS BELOW
// ============================================

export const posts: Post[] = [
  // ===========================================
  // YOUR FIRST BLOG POST - EDIT THIS!
  // ===========================================
  {
    id: '1',
    title: 'Welcome to BoringJava',
    category: 'Java SE',
    author: 'Your Name',  // <-- Change this to your name
    date: 'Dec 25, 2024',
    readTime: '3 min',
    summary: 'This is my first blog post on BoringJava. Let\'s explore simple, maintainable Java practices together.',
    content: `Welcome to BoringJava! This blog is dedicated to writing clean, simple, and maintainable Java code.

The philosophy is simple: boring code is good code. It's predictable, easy to understand, and scales well in enterprise environments.

In this blog, I'll share tips about:
- Modern Java features (Records, Pattern Matching, Virtual Threads)
- Design patterns that actually work in production
- Spring Boot best practices
- System design for real-world applications

Stay tuned for more posts!`,
    codeSnippet: `// The BoringJava way
public record BlogPost(
    String title,
    String content,
    LocalDateTime publishedAt
) {}`
  },
  {
    id: '2',
    title: 'HashMap is Cool',
    category: 'Java SE',
    author: 'Subrat Ojha',
    date: 'Dec 25, 2024',
    readTime: '7 min',
    summary: 'Deep dive into HashMap - the most commonly used data structure in Java for storing key-value pairs efficiently.',
    content: `HashMap is one of the most powerful and commonly used data structures in Java. It's part of the Java Collections Framework and implements the Map interface.

How HashMap Works Internally:

HashMap uses an array of "buckets" to store entries. When you put a key-value pair:
1. The key's hashCode() method is called
2. The hash is used to determine which bucket to store the entry
3. If multiple keys hash to the same bucket (collision), they're stored as a linked list (or tree in Java 8+)

Time Complexity:

• get(): O(1) average, O(n) worst case
• put(): O(1) average, O(n) worst case  
• remove(): O(1) average, O(n) worst case
• containsKey(): O(1) average

Key Features:

• Allows null keys and values: Unlike Hashtable, HashMap permits one null key and multiple null values
• Not synchronized: For thread-safe operations, use ConcurrentHashMap
• No ordering guarantee: Use LinkedHashMap for insertion order, TreeMap for sorted order
• Load factor: Default is 0.75 - when 75% full, the map resizes

Common Use Cases:

• Caching frequently accessed data
• Counting occurrences (word frequency, etc.)
• Grouping objects by a property
• Fast lookups by unique identifier

Best Practices:

1. Always override hashCode() when you override equals()
2. Use immutable keys (String, Integer) when possible
3. Specify initial capacity if you know the size upfront
4. Consider ConcurrentHashMap for multi-threaded applications

HashMap is "boring" in the best way - it's reliable, fast, and does exactly what you expect!`,
    codeSnippet: `// Creating and using HashMap
Map<String, Integer> scores = new HashMap<>();

// Adding entries
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);

// Accessing values
int bobScore = scores.get("Bob"); // 87

// Check if key exists
if (scores.containsKey("Alice")) {
    System.out.println("Alice's score: " + scores.get("Alice"));
}

// Iterate over entries
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Java 8+ forEach
scores.forEach((name, score) -> 
    System.out.println(name + " scored " + score));

// getOrDefault - avoid null checks
int unknownScore = scores.getOrDefault("Unknown", 0);`
  }


];
