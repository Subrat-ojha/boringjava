-- Run this SQL in your Supabase SQL Editor

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    code_snippet TEXT,
    author VARCHAR(100) NOT NULL DEFAULT 'Subrat Ojha',
    category_id INTEGER REFERENCES categories(id),
    read_time VARCHAR(20) DEFAULT '5 min',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
    ('Creational Patterns', 'creational', 'Patterns that deal with object creation mechanisms'),
    ('Structural Patterns', 'structural', 'Patterns that deal with object composition'),
    ('Behavioral Patterns', 'behavioral', 'Patterns that deal with object interaction'),
    ('Java SE', 'java-se', 'Core Java concepts and features'),
    ('System Design', 'system-design', 'Scalable system architecture patterns'),
    ('Spring Boot', 'spring-boot', 'Spring framework best practices')
ON CONFLICT (slug) DO NOTHING;
