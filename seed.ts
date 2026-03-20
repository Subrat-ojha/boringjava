import { createClient } from '@supabase/supabase-js';
import { designPatternsPosts } from './data/designPatterns';

const supabaseUrl = 'https://wmvzcpseefbjyafaegvr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdnpjcHNlZWZianlhZmFlZ3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Nzk3OTEsImV4cCI6MjA4OTU1NTc5MX0.ZMWL4VbEXqkCefWLrCn6dJwY0wEhBRKIGdxNpTSIi60';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('Starting database seed...\n');

  // Create categories
  const categories = [
    { name: 'Design Patterns', slug: 'design-patterns', description: 'All 23 GoF Design Patterns' },
    { name: 'Java SE', slug: 'java-se', description: 'Core Java concepts' },
    { name: 'System Design', slug: 'system-design', description: 'System architecture patterns' },
    { name: 'Spring Boot', slug: 'spring-boot', description: 'Spring framework' }
  ];

  console.log('Creating categories...');
  for (const cat of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert(cat, { onConflict: 'slug' });
    if (error) console.log(`Error creating ${cat.name}:`, error.message);
    else console.log(`✓ ${cat.name}`);
  }

  // Get Design Patterns category ID
  const { data: dpCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'design-patterns')
    .single();

  const categoryId = dpCategory?.id || 1;

  // Insert all design patterns
  console.log('\nInserting Design Patterns...');
  for (let i = 0; i < designPatternsPosts.length; i++) {
    const pattern = designPatternsPosts[i];
    
    const post = {
      title: pattern.title,
      slug: pattern.slug,
      summary: pattern.summary,
      content: pattern.content,
      code_snippet: pattern.code_snippet,
      author: pattern.author,
      category_id: categoryId,
      read_time: pattern.read_time,
      published: true,
      created_at: pattern.created_at
    };

    const { error } = await supabase
      .from('posts')
      .upsert(post, { onConflict: 'slug' });

    if (error) {
      console.log(`✗ Error inserting ${pattern.title}:`, error.message);
    } else {
      console.log(`✓ ${i + 1}. ${pattern.title.split(' - ')[0]}`);
    }
  }

  console.log('\n✅ Database seeding complete!');
  console.log('\nYou can now:');
  console.log('1. View your data in Supabase Dashboard → Table Editor');
  console.log('2. Edit posts directly from the dashboard');
  console.log('3. Add new posts without touching code');
}

seedDatabase().catch(console.error);
