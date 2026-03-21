export const systemDesignPosts = [
  // ==================== SCALABILITY ====================
  {
    id: 101,
    title: 'Horizontal vs Vertical Scaling',
    slug: 'horizontal-vs-vertical-scaling',
    summary: 'Understanding the fundamental difference between scaling up and scaling out.',
    content: `<h2>What is Scaling?</h2>
<p>Scaling means increasing your system's capacity to handle more users, requests, or data. There are two main approaches: <strong>Vertical</strong> and <strong>Horizontal</strong> scaling.</p>

<h3>Vertical Scaling (Scale Up)</h3>
<p>Adding more power to existing machine - more CPU, RAM, or disk.</p>
<ul>
<li>Simpler to implement</li>
<li>No code changes needed</li>
<li>Limited by single machine capacity</li>
<li>Single point of failure</li>
<li>Cost increases non-linearly</li>
</ul>

<h3>Horizontal Scaling (Scale Out)</h3>
<p>Adding more machines to your pool.</p>
<ul>
<li>Handles virtually unlimited growth</li>
<li>Better fault tolerance</li>
<li>More complex to implement</li>
<li>Requires load balancing</li>
<li>Data consistency challenges</li>
</ul>

<h3>When to Use Each?</h3>
<table>
<tr><th>Vertical</th><th>Horizontal</th></tr>
<tr><td>Database with joins</td><td>Stateless services</td></tr>
<tr><td>Single powerful machine needed</td><td>Web servers, APIs</td></tr>
<tr><td>Quick fix needed</td><td>Long-term growth</td></tr>
<tr><td>Cost-effective for small scale</td><td>High availability required</td></tr>
</table>

<h3>Real-World Examples</h3>
<ul>
<li><strong>Netflix</strong>: Horizontal - millions of concurrent users</li>
<li><strong>Small startup</strong>: Vertical initially, then horizontal</li>
<li><strong>PostgreSQL</strong>: Can do both (replication for horizontal)</li>
</ul>

<h3>Hybrid Approach</h3>
<p>Most companies use a combination:</p>
<ul>
<li>Horizontal for application servers</li>
<li>Vertical or dedicated machines for databases</li>
<li>Managed services (AWS RDS, Aurora) for managed scaling</li>
</ul>`,
    code_snippet: `# Vertical Scaling Example - More powerful machine
# Before: t2.micro (1 CPU, 1GB RAM)
# After: t2.xlarge (4 CPU, 16GB RAM)
# No code changes needed!

# Horizontal Scaling Example - More machines
# 1 server → 3 servers behind load balancer
# Requires:
# 1. Stateless application
# 2. Load balancer (Nginx, ELB)
# 3. Session management (Redis)

# Docker Compose for horizontal scaling
version: '3'
services:
  web:
    image: myapp
    deploy:
      replicas: 3
  loadbalancer:
    image: nginx
    ports:
      - "80:80"`,
    author: 'Subrat Ojha',
    category_id: 2, // System Design category
    read_time: '8 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 102,
    title: 'Load Balancing - Distribute Traffic Evenly',
    slug: 'load-balancing',
    summary: 'Learn how to distribute incoming traffic across multiple servers efficiently.',
    content: `<h2>What is Load Balancing?</h2>
<p>A load balancer distributes incoming traffic across multiple servers to ensure no single server gets overwhelmed. It's the <strong>traffic cop</strong> of your infrastructure.</p>

<h3>Why Load Balancing?</h3>
<ul>
<li>Prevent server overload</li>
<li>Improve application availability</li>
<li>Enable horizontal scaling</li>
<li>Handle server failures gracefully</li>
<li>Reduce downtime</li>
</ul>

<h3>Load Balancing Algorithms</h3>

<h4>1. Round Robin</h4>
<p>Requests distributed sequentially. Simple but doesn't account for server capacity.</p>

<h4>2. Weighted Round Robin</h4>
<p>More powerful servers get more requests.</p>

<h4>3. Least Connections</h4>
<p>Sends traffic to server with fewest active connections.</p>

<h4>4. IP Hash</h4>
<p>Routes user to same server based on IP (for session persistence).</p>

<h3>Health Checks</h3>
<p>Load balancers continuously check if servers are healthy:</p>
<ul>
<li>HTTP health endpoint (/health)</li>
<li>TCP connection checks</li>
<li>Periodic pings</li>
<li>Auto-removes unhealthy servers</li>
</ul>

<h3>Types of Load Balancers</h3>
<ul>
<li><strong>L4 (Transport)</strong>: Routes based on IP/Port</li>
<li><strong>L7 (Application)</strong>: Routes based on URL, headers, content</li>
</ul>

<h3>Popular Load Balancers</h3>
<ul>
<li>AWS: ALB, NLB, CLB</li>
<li>Software: Nginx, HAProxy</li>
<li>Cloud-native: Cloudflare, Azure Load Balancer</li>
</ul>`,
    code_snippet: `# Nginx Load Balancer Configuration
upstream backend {
    # Least connections algorithm
    least_conn;
    
    # Server with weight
    server 10.0.0.1:3000 weight=5;
    server 10.0.0.2:3000 weight=3;
    server 10.0.0.3:3000 weight=2;
    
    # Backup server
    server 10.0.0.4:3000 backup;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
        
        # Health check headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 103,
    title: 'Caching - Speed Up Your Application',
    slug: 'caching-strategies',
    summary: 'Master caching patterns to reduce latency and database load.',
    content: `<h2>What is Caching?</h2>
<p>Caching stores frequently accessed data in <strong>fast storage</strong> to reduce latency and database load. It's like keeping frequently used items on your desk instead of going to the storage room.</p>

<h3>Why Cache?</h3>
<ul>
<li>Reduce database load by 90%+</li>
<li>Decrease response time from 100ms to 1ms</li>
<li>Handle traffic spikes gracefully</li>
<li>Reduce infrastructure costs</li>
</ul>

<h3>Cache Storage Locations</h3>

<h4>1. Client-side Cache</h4>
<ul>
<li>Browser cache, local storage</li>
<li>Fastest, closest to user</li>
</ul>

<h4>2. CDN (Content Delivery Network)</h4>
<ul>
<li>Static assets, images, videos</li>
<li>Global distribution</li>
</ul>

<h4>3. In-Memory Cache</h4>
<ul>
<li>Redis, Memcached</li>
<li>Extremely fast (microseconds)</li>
<li>Data kept in RAM</li>
</ul>

<h3>Caching Patterns</h3>

<h4>Cache-Aside (Lazy Loading)</h4>
<pre>
1. Check cache first
2. If miss, get from database
3. Store in cache
4. Return data
</pre>

<h4>Write-Through</h4>
<pre>
1. Write to cache AND database
2. Always consistent
3. Higher write latency
</pre>

<h4>Write-Behind</h4>
<pre>
1. Write to cache only
2. Async write to database
3. Best write performance
4. Risk of data loss
</pre>

<h3>Cache Invalidation</h3>
<p>Cache invalidation is hard - "there are only two hard things in Computer Science"</p>
<ul>
<li><strong>TTL</strong>: Auto-expire after time</li>
<li><strong>Event-based</strong>: Invalidate on data change</li>
<li><strong>Manual</strong>: Admin can clear</li>
</ul>`,
    code_snippet: `// Redis Cache-Aside Pattern
const cache = require('./cache'); // Redis client

async function getUser(userId) {
    // Step 1: Check cache
    const cacheKey = \`user:\${userId}\`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
        console.log('Cache HIT');
        return JSON.parse(cached);
    }
    
    // Step 2: Cache miss - get from DB
    console.log('Cache MISS');
    const user = await db.users.findById(userId);
    
    if (user) {
        // Step 3: Store in cache with TTL
        await cache.setex(cacheKey, 3600, JSON.stringify(user));
    }
    
    return user;
}

// Write operation with Write-Through
async function updateUser(userId, data) {
    // Write to database
    const user = await db.users.update(userId, data);
    
    // Update cache immediately
    await cache.setex(\`user:\${userId}\`, 3600, JSON.stringify(user));
    
    return user;
}

// Cache with event invalidation
async function deleteUser(userId) {
    await db.users.delete(userId);
    await cache.del(\`user:\${userId}\`);
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // ==================== DATABASE PATTERNS ====================
  {
    id: 104,
    title: 'Database Replication - Master-Slave Setup',
    slug: 'database-replication',
    summary: 'Learn how to replicate databases for read scaling and high availability.',
    content: `<h2>What is Database Replication?</h2>
<p>Database replication copies data from one database to another, enabling <strong>read scaling</strong>, <strong>high availability</strong>, and <strong>geographic distribution</strong>.</p>

<h3>Replication Types</h3>

<h4>1. Master-Slave Replication</h4>
<ul>
<li>One master for writes</li>
<li>Multiple slaves for reads</li>
<li>Async replication (eventual consistency)</li>
</ul>

<h4>2. Master-Master Replication</h4>
<ul>
<li>Multiple masters for writes</li>
<li>More complex conflict resolution</li>
<li>Used for multi-region</li>
</ul>

<h4>3. Synchronous vs Asynchronous</h4>
<ul>
<li><strong>Sync</strong>: Waits for slave confirmation (slower, more consistent)</li>
<li><strong>Async</strong>: Returns immediately (faster, eventual consistency)</li>
</ul>

<h3>Benefits</h3>
<ul>
<li><strong>Read Scaling</strong>: Distribute reads across replicas</li>
<li><strong>High Availability</strong>: Automatic failover</li>
<li><strong>Geographic Distribution</strong>: Lower latency for users</li>
<li><strong>Backup</strong>: Replicas as live backups</li>
</ul>

<h3>Handling Replication Lag</h3>
<p>Async replication means slaves may be slightly behind:</p>
<ul>
<li>Read your writes from master</li>
<li>Use sticky sessions</li>
<li>Accept eventual consistency for some reads</li>
<li>Monitor lag metrics</li>
</ul>`,
    code_snippet: `-- PostgreSQL Replication Setup

-- On Master (postgresql.conf)
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB

-- Create replication user
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'secure_password';

-- pg_hba.conf - Allow replication
host replication replicator 10.0.0.0/24 md5

-- On Slave (recovery.conf)
standby_mode = 'on'
primary_conninfo = 'host=master_host port=5432 user=replicator password=secure_password'
recovery_target_timeline = 'latest'

-- Application code - Read/Write Split
// Write to master
await pool.query('INSERT INTO users (name) VALUES ($1)', ['John']);

// Read from replica (load balanced)
await replicaPool.query('SELECT * FROM users');`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 105,
    title: 'Database Sharding - Scale Writes',
    slug: 'database-sharding',
    summary: 'Partition your database to handle massive write loads and data volumes.',
    content: `<h2>What is Sharding?</h2>
<p>Sharding divides your database into smaller, faster pieces called <strong>shards</strong>. Each shard contains a subset of your data, allowing you to scale writes horizontally.</p>

<h3>Why Shard?</h3>
<ul>
<li>Single database can't handle write volume</li>
<li>Data too large for single machine</li>
<li>Reduce index size for faster queries</li>
<li>Geographic distribution of data</li>
</ul>

<h3>Sharding Strategies</h3>

<h4>1. Hash Sharding</h4>
<p>Assign data based on hash of a key.</p>
<pre>
shard = hash(key) % num_shards
</pre>
<ul>
<li>Even distribution</li>
<li>Hard to add/remove shards</li>
</ul>

<h4>2. Range Sharding</h4>
<p>Assign data based on value ranges.</p>
<pre>
A-M → Shard 1
N-Z → Shard 2
</pre>
<ul>
<li>Easy to understand</li>
<li>Can cause hot spots</li>
</ul>

<h4>3. Directory Sharding</h4>
<p>Lookup table maps keys to shards.</p>
<ul>
<li>Most flexible</li>
<li>Additional lookup overhead</li>
</ul>

<h3>Sharding Keys</h3>
<p>Choose wisely - affects distribution and joins:</p>
<ul>
<li><strong>User ID</strong>: Good for user-centric apps</li>
<li><strong>Geographic</strong>: For regional data</li>
<li><strong>Time-based</strong>: For time-series data</li>
</ul>

<h3>Challenges</h3>
<ul>
<li>Cross-shard queries are complex</li>
<li>Rebalancing is difficult</li>
<li>Transaction complexity</li>
<li>Operational complexity</li>
</ul>`,
    code_snippet: `// Hash Sharding Implementation
class ShardedUserStore {
    constructor(numShards) {
        this.numShards = numShards;
        this.shards = [];
        for (let i = 0; i < numShards; i++) {
            this.shards.push(new UserStore(\`shard_\${i}\`));
        }
    }
    
    getShard(userId) {
        const hash = this.hashCode(userId);
        const shardIndex = hash % this.numShards;
        return this.shards[shardIndex];
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
        }
        return Math.abs(hash);
    }
    
    async getUser(userId) {
        const shard = this.getShard(userId);
        return shard.findById(userId);
    }
    
    async saveUser(userId, data) {
        const shard = this.getShard(userId);
        return shard.save(userId, data);
    }
    
    // Cross-shard query (expensive!)
    async findByRegion(region) {
        const promises = this.shards.map(shard => 
            shard.findByRegion(region)
        );
        const results = await Promise.all(promises);
        return results.flat();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 106,
    title: 'SQL vs NoSQL - Choose Wisely',
    slug: 'sql-vs-nosql',
    summary: 'Understanding when to use relational vs non-relational databases.',
    content: `<h2>SQL vs NoSQL</h2>
<p>Both have their place. Understanding tradeoffs helps you choose wisely.</p>

<h3>SQL Databases</h3>
<p>Relational databases with structured schema.</p>
<ul>
<li><strong>Examples</strong>: PostgreSQL, MySQL, Oracle</li>
<li><strong>Strengths</strong>: ACID transactions, joins, complex queries</li>
<li><strong>Best for</strong>: Financial data, structured relationships</li>
</ul>

<h3>NoSQL Databases</h3>
<p>Non-relational, flexible schema databases.</p>

<h4>Document Stores</h4>
<ul>
<li><strong>Examples</strong>: MongoDB, CouchDB</li>
<li><strong>Best for</strong>: JSON data, catalogs, CMS</li>
</ul>

<h4>Key-Value Stores</h4>
<ul>
<li><strong>Examples</strong>: Redis, DynamoDB</li>
<li><strong>Best for</strong>: Caching, sessions, simple data</li>
</ul>

<h4>Wide-Column Stores</h4>
<ul>
<li><strong>Examples</strong>: Cassandra, HBase</li>
<li><strong>Best for</strong>: Time-series, IoT, write-heavy</li>
</ul>

<h4>Graph Databases</h4>
<ul>
<li><strong>Examples</strong>: Neo4j, Amazon Neptune</li>
<li><strong>Best for</strong>: Social networks, recommendations</li>
</ul>

<h3>When to Use What?</h3>
<table>
<tr><th>Use SQL when...</th><th>Use NoSQL when...</th></tr>
<tr><td>Data is structured</td><td>Schema is flexible/changing</td></tr>
<tr><td>Need transactions</td><td>Need massive scale</td></tr>
<tr><td>Complex joins required</td><td>High write throughput</td></tr>
<tr><td>Data integrity critical</td><td>Schema-less is preferred</td></tr>
</table>

<h3>Polyglot Persistence</h3>
<p>Use the right database for each job:</p>
<ul>
<li>PostgreSQL for user data</li>
<li>Redis for sessions/cache</li>
<li>Elasticsearch for search</li>
<li>MongoDB for logs</li>
</ul>`,
    code_snippet: `-- SQL Example: Complex joins, transactions
BEGIN TRANSACTION;

SELECT * FROM orders 
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.id
WHERE users.region = 'APAC';

UPDATE inventory SET stock = stock - 1 WHERE product_id = 123;

COMMIT;

-- NoSQL Example (MongoDB): Flexible schema
db.orders.insertOne({
    customer: "John",
    items: [
        { product: "Laptop", qty: 1 },
        { product: "Mouse", qty: 2 }
    ],
    // Schema can vary per document!
    shipping: {
        address: "123 Main St",
        method: "express"
    },
    metadata: {
        source: "mobile_app",
        campaign: "summer_sale"
    }
});

// Scale horizontally without schema changes
db.orders.insertOne({
    customer: "Jane",
    items: ["Book"], // Different structure!
    // No shipping field needed
});`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // ==================== MESSAGE QUEUES ====================
  {
    id: 107,
    title: 'Message Queues - Async Communication',
    slug: 'message-queues',
    summary: 'Decouple services with asynchronous message passing.',
    content: `<h2>What is a Message Queue?</h2>
<p>A message queue enables <strong>async communication</strong> between services. Producers send messages, consumers process them later.</p>

<h3>Why Use Message Queues?</h3>
<ul>
<li><strong>Decoupling</strong>: Services don't need to be online simultaneously</li>
<li><strong>Reliability</strong>: Messages persist until processed</li>
<li><strong>Scalability</strong>: Handle traffic spikes</li>
<li><strong>Ordering</strong>: Process in order (FIFO)</li>
</ul>

<h3>Key Concepts</h3>

<h4>Producer/Consumer</h4>
<pre>
Producer → [Queue] → Consumer
   ↓          ↓         ↓
  Sends    Stores    Processes
  message  message   message
</pre>

<h4>Point-to-Point</h4>
<ul>
<li>One consumer per message</li>
<li>Task queues, job processing</li>
</ul>

<h4>Pub/Sub (Publish-Subscribe)</h4>
<ul>
<li>Multiple subscribers</li>
<li>Event broadcasting</li>
</ul>

<h3>Popular Message Queues</h3>
<ul>
<li><strong>RabbitMQ</strong>: Feature-rich, flexible routing</li>
<li><strong>Apache Kafka</strong>: High throughput, log-based</li>
<li><strong>AWS SQS</strong>: Fully managed, simple</li>
<li><strong>Redis Streams</strong>: Lightweight, in-memory</li>
</ul>

<h3>Message Patterns</h3>

<h4>Fire and Forget</h4>
<p>Send message, don't wait for response.</p>

<h4>Request/Reply</h4>
<p>Send message, wait for response on reply queue.</p>

<h4>Dead Letter Queue</h4>
<p>Failed messages go here for investigation.</p>`,
    code_snippet: `// RabbitMQ Example
const amqp = require('amqplib');

async function processOrder() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Create queues
    await channel.assertQueue('orders');
    await channel.assertQueue('order_emails');
    await channel.assertQueue('order_notifications');
    await channel.assertQueue('dead_letter');
    
    // Bind queues for different routing keys
    await channel.bindQueue('order_emails', 'orders', 'order.created');
    await channel.bindQueue('order_notifications', 'orders', 'order.*');
    
    // Consume from main queue
    channel.consume('orders', async (msg) => {
        if (msg) {
            const order = JSON.parse(msg.content);
            console.log('Processing order:', order.id);
            
            try {
                // Process order
                await processPayment(order);
                await updateInventory(order);
                
                // Publish events
                channel.publish('orders', 'order.created', 
                    Buffer.from(JSON.stringify(order)));
                
                channel.ack(msg);
            } catch (error) {
                // Send to dead letter queue
                channel.nack(msg, false, false);
            }
        }
    });
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 108,
    title: 'Event-Driven Architecture',
    slug: 'event-driven-architecture',
    summary: 'Build responsive systems with events and event sourcing.',
    content: `<h2>What is Event-Driven Architecture?</h2>
<p>Systems react to <strong>events</strong> rather than requests. When something happens (event), interested services react.</p>

<h3>Event vs Command</h3>
<ul>
<li><strong>Command</strong>: "Do this" - imperative</li>
<li><strong>Event</strong>: "This happened" - declarative</li>
</ul>

<h3>Core Concepts</h3>

<h4>Event</h4>
<p>Something that happened. Immutable.</p>
<pre>
UserSignedUp { userId: "123", email: "a@b.com", timestamp: ... }
</pre>

<h4>Event Handler</h4>
<p>Reacts to events. Can have multiple per event.</p>

<h4>Event Bus</h4>
<p>Routes events to handlers.</p>

<h3>Event Sourcing</h3>
<p>Store all events, not current state:</p>
<pre>
Account Created → Deposit 100 → Withdraw 50 → Balance: 50

Event Log:
1. AccountCreated { id: 1 }
2. Deposited { amount: 100 }
3. Withdrew { amount: 50 }
</pre>
<ul>
<li>Complete audit trail</li>
<li>Time travel debugging</li>
<li>Replay events to any point</li>
</ul>

<h3>Benefits</h3>
<ul>
<li><strong>Loose Coupling</strong>: Services don't know each other</li>
<li><strong>Scalability</strong>: Async by nature</li>
<li><strong>Auditability</strong>: Full history</li>
<li><strong>Fault Tolerance</strong>: Events persist</li>
</ul>

<h3>CQRS Pattern</h3>
<p>Command Query Responsibility Segregation:</p>
<ul>
<li><strong>Commands</strong>: Write to write model</li>
<li><strong>Queries</strong>: Read from read model</li>
<li>Asynchronous sync between models</li>
</ul>`,
    code_snippet: `// Event Sourcing Example
class EventStore {
    constructor() {
        this.events = [];
    }
    
    append(event) {
        this.events.push({
            ...event,
            timestamp: Date.now(),
            version: this.events.length + 1
        });
    }
    
    getEvents(aggregateId) {
        return this.events.filter(e => e.aggregateId === aggregateId);
    }
    
    rebuildState(aggregateId) {
        const events = this.getEvents(aggregateId);
        return events.reduce((state, event) => {
            return this.apply(state, event);
        }, this.initialState);
    }
}

class BankAccount {
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    
    deposit(amount) {
        this.eventStore.append({
            type: 'MoneyDeposited',
            aggregateId: this.id,
            data: { amount }
        });
    }
    
    withdraw(amount) {
        const balance = this.getBalance();
        if (balance < amount) {
            throw new Error('Insufficient funds');
        }
        this.eventStore.append({
            type: 'MoneyWithdrawn',
            aggregateId: this.id,
            data: { amount }
        });
    }
    
    getBalance() {
        const events = this.eventStore.getEvents(this.id);
        return events.reduce((balance, event) => {
            if (event.type === 'MoneyDeposited') 
                return balance + event.data.amount;
            if (event.type === 'MoneyWithdrawn') 
                return balance - event.data.amount;
            return balance;
        }, 0);
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '14 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // ==================== MICROSERVICES ====================
  {
    id: 109,
    title: 'Microservices vs Monolith',
    slug: 'microservices-vs-monolith',
    summary: 'Understanding when to decompose and how to structure services.',
    content: `<h2>Monolith vs Microservices</h2>
<p>Two architectural styles with different tradeoffs.</p>

<h3>Monolithic Architecture</h3>
<p>All components in one deployable unit.</p>
<ul>
<li><strong>Pros</strong>: Simple, easy to develop/test/deploy</li>
<li><strong>Cons</strong>: Hard to scale, deploy, maintain</li>
<li><strong>Best for</strong>: Small teams, MVPs, simple apps</li>
</ul>

<h3>Microservices Architecture</h3>
<p>Small, independent services that communicate.</p>
<ul>
<li><strong>Pros</strong>: Independent deploy, tech flexibility</li>
<li><strong>Cons</strong>: Complexity, network issues</li>
<li><strong>Best for</strong>: Large teams, complex domains</li>
</ul>

<h3>When to Decompose?</h3>
<table>
<tr><th>Factor</th><th>Monolith</th><th>Microservices</th></tr>
<tr><td>Team Size</td><td>1-10</td><td>10+</td></tr>
<tr><td>Complexity</td><td>Low-Medium</td><td>High</td></tr>
<tr><td>Deploy Frequency</td><td>Low</td><td>High</td></tr>
<tr><td>Tech Diversity</td><td>Single</td><td>Multiple</td></tr>
</table>

<h3>Decomposition Strategies</h3>

<h4>By Business Capability</h4>
<ul>
<li>Order Service</li>
<li>Payment Service</li>
<li>User Service</li>
</ul>

<h4>By Domain (DDD)</h4>
<ul>
<li>Bounded contexts become services</li>
<li>Clear ownership</li>
</ul>

<h3>Communication Patterns</h3>
<ul>
<li><strong>Sync</strong>: REST, gRPC</li>
<li><strong>Async</strong>: Events, Message Queues</li>
</ul>`,
    code_snippet: `# Docker Compose - Microservices Stack
version: '3.8'

services:
  # API Gateway
  gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
  
  # User Service
  user-service:
    build: ./user-service
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
  
  # Order Service
  order-service:
    build: ./order-service
    environment:
      - DB_HOST=postgres
      - KAFKA_BROKERS=kafka:9092
    depends_on:
      - postgres
      - kafka
  
  # Shared Services
  postgres:
    image: postgres:14
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:alpine
  
  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    depends_on:
      - zookeeper
  
  zookeeper:
    image: confluentinc/cp-zookeeper:latest

volumes:
  pgdata:`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 110,
    title: 'API Gateway - Single Entry Point',
    slug: 'api-gateway',
    summary: 'Route, authenticate, and aggregate requests across services.',
    content: `<h2>What is an API Gateway?</h2>
<p>Single entry point for all client requests. Handles routing, authentication, rate limiting, and more.</p>

<h3>Responsibilities</h3>
<ul>
<li><strong>Routing</strong>: Forward to appropriate service</li>
<li><strong>Authentication</strong>: Validate tokens, OAuth</li>
<li><strong>Rate Limiting</strong>: Prevent abuse</li>
<li><strong>Request/Response Transformation</strong>: Format conversion</li>
<li><strong>Aggregation</strong>: Combine multiple service responses</li>
<li><strong>Caching</strong>: Cache responses</li>
<li><strong>Monitoring</strong>: Log, metrics, tracing</li>
</ul>

<h3>Popular Gateways</h3>
<ul>
<li><strong>Kong</strong>: Open source, extensible</li>
<li><strong>Nginx</strong>: Web server + gateway</li>
<li><strong>AWS API Gateway</strong>: Managed service</li>
<li><strong>Ambassador</strong>: Kubernetes-native</li>
<li><strong>Envoy</strong>: Service proxy</li>
</ul>

<h3>Gateway vs BFF</h3>
<table>
<tr><th>API Gateway</th><th>Backend for Frontend (BFF)</th></tr>
<tr><td>Single for all clients</td><td>One per frontend (Web, Mobile, etc)</td></tr>
<tr><td>Cross-cutting concerns</td><td>Frontend-specific logic</td></tr>
<tr><td>Route to services</td><td>Aggregate and transform</td></tr>
</table>`,
    code_snippet: `# Nginx API Gateway Configuration
worker_processes auto;
error_log /var/log/nginx/error.log warn;

upstream user_service {
    server user-service:3000;
    least_conn;  # Load balancing
}

upstream order_service {
    server order-service:3001;
}

upstream product_service {
    server product-service:3002;
}

server {
    listen 80;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Authentication endpoint
    location /api/auth {
        proxy_pass http://user_service/auth;
    }
    
    # User endpoints
    location /api/users {
        limit_req zone=api burst=20;
        auth_request /auth/validate;
        proxy_pass http://user_service;
    }
    
    # Aggregate multiple services
    location /api/dashboard {
        # Call multiple services in parallel
        rewrite ^ /dev/null break;
        
        # Use nginx plus or openresty for this
        # Or implement in code
    }
    
    # Health check
    location /health {
        return 200 'OK';
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '8 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 111,
    title: 'Circuit Breaker Pattern',
    slug: 'circuit-breaker',
    summary: 'Prevent cascade failures with circuit breaker pattern.',
    content: `<h2>What is Circuit Breaker?</h2>
<p>A circuit breaker monitors calls to external services and <strong>stops calling</strong> a failing service to prevent cascade failures.</p>

<h3>The Problem</h3>
<pre>
Client → Service A → Service B → Service C
                     ↓
              Times out (5s)
                     ↓
              Client waits...
                     ↓
              All clients blocked!
                     ↓
              System down!
</pre>

<h3>How It Works</h3>

<h4>1. Closed State (Normal)</h4>
<ul>
<li>Requests pass through</li>
<li>Failures are counted</li>
</ul>

<h4>2. Open State (Failure)</h4>
<ul>
<li>Requests fail immediately</li>
<li>No calls to failing service</li>
<li>After timeout, move to half-open</li>
</ul>

<h4>3. Half-Open State (Testing)</h4>
<ul>
<li>Limited requests pass through</li>
<li>If success, close circuit</li>
<li>If fail, reopen circuit</li>
</ul>

<h3>Configuration</h3>
<ul>
<li><strong>Failure threshold</strong>: When to trip (e.g., 5 failures)</li>
<li><strong>Timeout</strong>: How long to stay open</li>
<li><strong>Success threshold</strong>: When to close (e.g., 3 successes)</li>
</ul>

<h3>Libraries</h3>
<ul>
<li><strong>Resilience4j</strong>: Java</li>
<li><strong>Hystrix</strong>: Java (Netflix, now in maintenance)</li>
<li><strong>Polly</strong>: .NET</li>
<li><strong>Breaker</strong>: Go</li>
</ul>`,
    code_snippet: `// Circuit Breaker Implementation (Simplified)
class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.timeout = options.timeout || 60000; // 1 minute
        this.successThreshold = options.successThreshold || 2;
        
        this.state = 'CLOSED';
        this.failures = 0;
        this.successes = 0;
        this.nextAttempt = Date.now();
    }
    
    async call(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() > this.nextAttempt) {
                this.state = 'HALF_OPEN';
                console.log('Circuit: HALF_OPEN');
            } else {
                throw new Error('Circuit OPEN - call rejected');
            }
        }
        
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }
    
    onSuccess() {
        this.failures = 0;
        if (this.state === 'HALF_OPEN') {
            this.successes++;
            if (this.successes >= this.successThreshold) {
                this.state = 'CLOSED';
                console.log('Circuit: CLOSED');
            }
        }
    }
    
    onFailure() {
        this.failures++;
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.timeout;
            console.log('Circuit: OPEN');
        }
    }
}

// Usage
const cb = new CircuitBreaker({
    failureThreshold: 3,
    timeout: 30000,
    successThreshold: 2
});

async function getUser(id) {
    return cb.call(() => userService.fetch(id));
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // ==================== RELIABILITY ====================
  {
    id: 112,
    title: 'CAP Theorem - Consistency vs Availability',
    slug: 'cap-theorem',
    summary: 'Understanding the fundamental tradeoff in distributed systems.',
    content: `<h2>What is CAP Theorem?</h2>
<p>In a distributed system, you can only guarantee <strong>two of three</strong>: Consistency, Availability, Partition Tolerance.</p>

<h3>The Three Properties</h3>

<h4>Consistency (C)</h4>
<p>All nodes see the same data at the same time.</p>

<h4>Availability (A)</h4>
<p>Every request gets a response.</p>

<h4>Partition Tolerance (P)</h4>
<p>System works despite network partitions.</p>

<h3>The Tradeoff</h3>
<p>Partitions will happen. When they do:</p>
<pre>
CP Systems: Sacrifice Availability
            → Reject writes until consistency
            → Example: HBase, Zookeeper, Redis Cluster

AP Systems: Sacrifice Consistency  
            → Accept writes, reconcile later
            → Example: Cassandra, DynamoDB, MongoDB
</pre>

<h3>Common Misconceptions</h3>
<ul>
<li>"We choose 2 of 3" - No, P is required</li>
<li>"It's a binary choice" - It's a spectrum</li>
<li>"CAP only matters during partitions"</li>
</ul>

<h3> PACELC Model</h3>
<p>When there are no partitions:</p>
<ul>
<li><strong>Latency vs Consistency</strong> trade-off</li>
<li>Some systems choose availability for lower latency</li>
</ul>

<h3>Practical Guidelines</h3>
<ul>
<li><strong>Banking/Financial</strong>: Strong consistency (CP)</li>
<li><strong>E-commerce</strong>: High availability (AP)</li>
<li><strong>Social Media</strong>: Eventual is fine (AP)</li>
</ul>`,
    code_snippet: `-- Cassandra Configuration for AP
-- cassandra.yaml
# Consistency level for reads
consistency_level: QUORUM

# Tunable consistency
# QUORUM = (replication_factor/2) + 1

-- DynamoDB Configuration
// Choose between strong and eventual consistency
// GetItem with ConsistentRead=true
dynamodb.getItem({
    TableName: 'Users',
    Key: { id: '123' },
    ConsistentRead: true  // Strong consistency, higher latency
});

// Eventual consistency (default)
dynamodb.getItem({
    TableName: 'Users', 
    Key: { id: '123' }
    // Lower latency, may return stale data
});

// PostgreSQL for CP
// Use synchronous replication
ALTER TABLE users SET (replication_slots = 'physical');
ALTER SYSTEM SET synchronous_commit = 'on';
ALTER SYSTEM SET synchronous_standby_names = '*';

-- This ensures strong consistency but:
-- 1. Writes are slower (waiting for replicas)
-- 2. If replica fails, write blocks`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 113,
    title: 'Rate Limiting - Protect Your APIs',
    slug: 'rate-limiting',
    summary: 'Implement rate limiting to protect services from abuse.',
    content: `<h2>What is Rate Limiting?</h2>
<p>Rate limiting controls how many requests a user/service can make in a given time period.</p>

<h3>Why Rate Limit?</h3>
<ul>
<li>Prevent abuse and attacks</li>
<li>Protect backend services</li>
<li>Ensure fair usage</li>
<li>Control costs</li>
<li>Enforce quotas</li>
</ul>

<h3>Rate Limiting Algorithms</h3>

<h4>1. Token Bucket</h4>
<ul>
<li>Tokens added at fixed rate</li>
<li>Each request consumes token</li>
<li>Allows bursts</li>
</ul>

<h4>2. Leaky Bucket</h4>
<ul>
<li>Requests processed at constant rate</li>
<li>Excess requests queued or dropped</li>
<li>No bursts</li>
</ul>

<h4>3. Fixed Window</h4>
<ul>
<li>Count requests per time window</li>
<li>Simple but has edge cases</li>
</ul>

<h4>4. Sliding Window</h4>
<ul>
<li>Smoother than fixed window</li>
<li>More accurate</li>
</ul>

<h3>Response Headers</h3>
<pre>
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
Retry-After: 3600
</pre>

<h3>Where to Implement</h3>
<ul>
<li><strong>API Gateway</strong>: Centralized</li>
<li><strong>Application</strong>: Per-service</li>
<li><strong>Redis</strong>: Distributed state</li>
</ul>`,
    code_snippet: `// Redis Token Bucket Rate Limiter
class RateLimiter {
    constructor(redis) {
        this.redis = redis;
    }
    
    async isAllowed(key, limit, window) {
        const now = Date.now();
        const bucketKey = \`ratelimit:\${key}\`;
        
        // Lua script for atomic operations
        const script = \`
            local bucket = redis.call('GET', KEYS[1])
            local limit = tonumber(ARGV[1])
            local window = tonumber(ARGV[2])
            local now = tonumber(ARGV[3])
            
            if bucket == false then
                redis.call('SETEX', KEYS[1], window, 1)
                return {1, limit - 1, window}
            end
            
            local count = tonumber(bucket)
            if count < limit then
                redis.call('INCR', KEYS[1])
                return {1, limit - count - 1, redis.call('TTL', KEYS[1])}
            end
            
            return {0, 0, redis.call('TTL', KEYS[1])}
        \`;
        
        const result = await this.redis.eval(script, {
            key: [bucketKey],
            argv: [limit, window, now]
        });
        
        return {
            allowed: result[0] === 1,
            remaining: result[1],
            resetAt: now + (result[2] * 1000)
        };
    }
}

// Usage in Express
app.use('/api', async (req, res, next) => {
    const limiter = new RateLimiter(redis);
    const result = await limiter.isAllowed(req.ip, 100, 60);
    
    res.set({
        'X-RateLimit-Limit': 100,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': result.resetAt
    });
    
    if (!result.allowed) {
        return res.status(429).json({
            error: 'Too Many Requests',
            retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
        });
    }
    
    next();
});`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
