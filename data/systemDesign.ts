export const systemDesignPosts = [
  {
    id: 101,
    title: 'Horizontal vs Vertical Scaling',
    slug: 'horizontal-vs-vertical-scaling',
    summary: 'Deep dive into scaling strategies with real Java architectural decisions.',
    content: `<h2>Understanding System Scaling</h2>
<p>Scaling is the backbone of high-traffic systems. The choice between vertical and horizontal scaling shapes your entire architecture.</p>

<h3>Vertical Scaling (Scale-Up)</h3>
<p>Increasing server capacity - more CPU cores, RAM, faster disks (NVMe SSD).</p>

<pre>
Before:  4 cores, 16GB RAM  →  After: 64 cores, 512GB RAM
</pre>

<h4>Advantages</h4>
<ul>
<li><strong>Simplicity</strong>: Zero code changes, no distributed system complexity</li>
<li><strong>Consistency</strong>: No network calls, perfect ACID transactions</li>
<li><strong>Lower Latency</strong>: Local memory access is nanoseconds vs milliseconds over network</li>
<li><strong>Debugging</strong>: Single server logs, no distributed tracing complexity</li>
</ul>

<h4>Disadvantages</h4>
<ul>
<li><strong>Hard Limit</strong>: AWS largest instance has 448 cores - what when you need more?</li>
<li><strong>Single Point of Failure</strong>: One machine failure takes down everything</li>
<li><strong>Non-linear Cost</strong>: 10x capacity often costs 20x+ money</li>
<li><strong>Maintenance Windows</strong>: Upgrades require complete downtime</li>
</ul>

<h3>Horizontal Scaling (Scale-Out)</h3>
<p>Adding more machines to distribute the load.</p>

<h4>Java Challenges</h4>
<ul>
<li><strong>Session Management</strong>: Sticky sessions or distributed sessions (Redis)</li>
<li><strong>Local Caching</strong>: Can't use in-memory caches effectively, need distributed cache</li>
<li><strong>Distributed Transactions</strong>: 2PC, Saga patterns become necessary</li>
<li><strong>Service Discovery</strong>: How do services find each other? (Eureka, Consul, Kubernetes)</li>
</ul>

<h3>Real-World Decision Framework</h3>
<table>
<tr><th>Scenario</th><th>Recommendation</th><th>Reason</th></tr>
<tr><td>&lt; 1000 concurrent users</td><td>Vertical</td><td>Complexity not worth it</td></tr>
<tr><td>1000-10000 users</td><td>Vertical + Good caching</td><td>CDN, Redis can handle most</td></tr>
<tr><td>10000-100000 users</td><td>Horizontal app + Vertical DB</td><td>Most companies here</td></tr>
<tr><td>100000+ users</td><td>Full horizontal</td><td>Netflix, Amazon scale</td></tr>
<tr><td>1M+ concurrent</td><td>Micro-services + Event-driven</td><td>Domain decomposition</td></tr>
</table>

<h3>Java Architecture Patterns</h3>

<h4>Stateless Services (Required for Horizontal)</h4>
<pre>
BAD:  HttpSession session = request.getSession();
      session.setAttribute("user", currentUser);
      
GOOD: @RestController
      public class UserController {
          // Extract user from JWT/token
          public User getUser(@RequestHeader("Authorization") String token) {
              return jwtService.extractUser(token);
          }
      }
</pre>

<h4>The CAP Theorem Reality</h4>
<p>Horizontal scaling forces you to choose between consistency and availability during network partitions. Most scale-out systems choose Availability (AP) with eventual consistency.</p>`,
    code_snippet: `// Vertical Scaling - Single JVM with more heap
// -Xms16g -Xmx16g -XX:+UseG1GC
// No code changes needed!

// Horizontal Scaling - Stateless Spring Boot Service
@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    private final JwtService jwtService;
    
    // Inject dependencies - stateless by design
    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        
        // User info extracted from JWT - no session needed
        Long requesterId = jwtService.extractUserId(authHeader);
        UserDto user = userService.findById(id);
        
        return ResponseEntity.ok(user);
    }
}

// Application.yaml for horizontal deployment
spring:
  session:
    store-type: redis  # Distributed session
    redis:
      namespace: user-service:session
  datasource:
    hikari:
      maximum-pool-size: 20  # Tune per instance
      
// Kubernetes deployment for horizontal scaling
// apiVersion: apps/v1
// kind: Deployment
// spec:
//   replicas: 5  # 5 identical pods
//   template:
//     spec:
//       containers:
//       - name: user-service
//         resources:
//           limits:
//             cpu: "2"
//             memory: "4Gi"`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 102,
    title: 'Load Balancing Strategies',
    slug: 'load-balancing',
    summary: 'Deep dive into load balancing algorithms and Java implementation patterns.',
    content: `<h2>Load Balancing in Production Systems</h2>
<p>Load balancing is the traffic controller of distributed systems. The algorithm choice impacts latency, fairness, and system behavior under failure.</p>

<h3>Client-Side vs Server-Side Load Balancing</h3>

<h4>Server-Side (Traditional)</h4>
<pre>
Client → Load Balancer → Backend Servers
</pre>
<p>Examples: AWS ALB/NLB, HAProxy, Nginx, F5</p>

<h4>Client-Side (Service Mesh Era)</h4>
<pre>
Client → Local Load Balancer → Service Discovery → Backend Servers
</pre>
<p>Examples: Ribbon (Netflix), Eureka (Netflix), Envoy, Kubernetes Service</p>

<h3>Load Balancing Algorithms</h3>

<h4>1. Round Robin (Simple, Common)</h4>
<pre>
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A (repeat)
</pre>
<p><strong>Pros</strong>: Simple, stateless, works well for homogeneous servers</p>
<p><strong>Cons</strong>: Doesn't account for server capacity or current load</p>

<h4>2. Weighted Round Robin</h4>
<p>More powerful servers get proportionally more traffic.</p>
<pre>
Server A (4 cores): weight=4
Server B (8 cores): weight=8
Server C (2 cores): weight=2

Distribution: A gets 28%, B gets 57%, C gets 14%
</pre>

<h4>3. Least Connections (Dynamic)</h4>
<p>Sends traffic to server with fewest active connections.</p>
<pre>
Server A: 150 active connections
Server B: 89 active connections  ← Sends here next
Server C: 203 active connections
</pre>
<p><strong>Best for</strong>: Long-lived connections (WebSocket, gRPC, streaming)</p>

<h4>4. Weighted Least Connections</h4>
<p>Combines capacity awareness with current load.</p>

<h4>5. IP Hash (Session Affinity)</h4>
<p>Same user always goes to same server.</p>
<pre>
hash(client_ip) % num_servers = target_server
</pre>
<p><strong>Use case</strong>: When server-side caching is critical</p>
<p><strong>Problem</strong>: Adding/removing servers causes session disruption</p>

<h4>6. Random with Two Choices</h4>
<p>Pick two random servers, choose the one with fewer connections.</p>
<p><strong>Why?</strong> Mathematically proven to be nearly optimal (Power of Two Choices)</p>

<h3>Health Checks - The Unsung Hero</h3>
<ul>
<li><strong>L4 Health Check</strong>: TCP connection test (port open?)</li>
<li><strong>L7 Health Check</strong>: HTTP GET /health, check response code</li>
<li><strong>Deep Health Check</strong>: Query database, check dependencies</li>
<li><strong>Passive Health Check</strong>: Track failures, auto-degrade</li>
</ul>

<h3>Common Pitfalls</h3>
<ul>
<li><strong>Cascade Failure</strong>: When one server is slow, requests pile up → LB keeps sending traffic → system collapses</li>
<li><strong>Thundering Herd</strong>: All clients refresh at once when cache expires</li>
<li><strong>Cold Start</strong>: New servers take time to warm up JVM JIT</li>
</ul>`,
    code_snippet: `// Java Client-Side Load Balancer with Ribbon
@Configuration
public class RibbonConfig {
    @Bean
    public IRule ribbonRule() {
        // Retry up to 3 times on same server, then try others
        return new RetryRule(new RoundRobinRule(), 500, 200, true);
    }
}

@FeignClient(name = "user-service", fallback = UserServiceFallback.class)
public interface UserClient {
    @GetMapping("/api/users/{id}")
    UserDto getUser(@PathVariable("id") Long id);
}

// Kubernetes Service (L4 Load Balancing)
// apiVersion: v1
// kind: Service
// metadata:
//   name: user-service
// spec:
//   selector:
//     app: user-service
//   ports:
//   - port: 80
//     targetPort: 8080
//   type: ClusterIP
//   # kube-proxy handles load balancing

// Spring Cloud Gateway (L7 Load Balancing)
@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user_route", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .addRequestHeader("X-Gateway", "true")
                    .circuitBreaker(config -> config
                        .setName("userCircuitBreaker")
                        .setFallbackUri("forward:/fallback/users")))
                .uri("lb://user-service"))  // lb:// triggers load balancing
            .build();
    }
}

// Custom Load Balancer Implementation
@Component
public class CustomLoadBalancer implements ServiceInstanceListSupplier {
    
    private final ServiceInstanceListSupplier delegate;
    
    @Override
    public Mono<List<ServiceInstance>> get(Request request) {
        return delegate.get(request)
            .map(instances -> instances.stream()
                .filter(this::isHealthy)
                .sorted(byCurrentLoad())  // Least connections
                .collect(Collectors.toList()));
    }
    
    private boolean isHealthy(ServiceInstance instance) {
        // Check circuit breaker state, metrics
        return healthChecker.isHealthy(instance.getHost());
    }
    
    private Comparator<ServiceInstance> byCurrentLoad() {
        return Comparator.comparingInt(this::getActiveConnections);
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '15 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 103,
    title: 'Caching Patterns in Java',
    slug: 'caching-strategies',
    summary: 'Master caching with Redis, Caffeine, and distributed caching patterns.',
    content: `<h2>Caching - The 90% Latency Reduction</h2>
<p>Caching is the single most impactful optimization for read-heavy systems. A well-designed cache can reduce latency from 100ms to 1ms.</p>

<h3>Multi-Level Caching Architecture</h3>
<pre>
Request → Browser Cache (HTTP) 
        → CDN (Edge)
        → Application Cache (Local/JVM)
        → Distributed Cache (Redis)
        → Database
</pre>

<h3>Cache-Aside Pattern (Lazy Loading)</h3>
<p>Application manages cache explicitly.</p>

<h4>Flow</h4>
<pre>
1. Check cache
2. If miss → query database
3. Store result in cache
4. Return result
</pre>

<h4>When to Use</h4>
<ul>
<li>Read-heavy workloads</li>
<li>Cache misses are acceptable</li>
<li>Data changes infrequently</li>
</ul>

<h3>Read-Through Pattern</h3>
<p>Cache fetches data from database transparently.</p>

<h3>Write-Through Pattern</h3>
<p>Writes go to cache AND database atomically.</p>
<ul>
<li><strong>Pros</strong>: Cache always has latest data</li>
<li><strong>Cons</strong>: Higher write latency, potential write amplification</li>
</ul>

<h3>Write-Behind (Write-Back) Pattern</h3>
<p>Writes go to cache first, async flush to database.</p>
<ul>
<li><strong>Pros</strong>: Fastest write performance</li>
<li><strong>Cons</strong>: Data loss risk if cache fails before flush</li>
</ul>

<h3>Cache Invalidation Strategies</h3>

<h4>TTL (Time-To-Live)</h4>
<pre>
Cache-Control: max-age=3600
Cache: set("user:123", user, TTL: 1 hour)
</pre>

<h4>Event-Based Invalidation</h4>
<pre>
User updates profile → Publish event "user.updated:123"
                      → All caches invalidate key "user:123"
</pre>

<h4>Active Expiration</h4>
<p>Background thread proactively refreshes expiring entries.</p>

<h3>Cache Stampede (Thundering Herd)</h3>
<p>Problem: Cache expires → 1000 requests hit database simultaneously</p>

<h4>Solutions</h4>
<ul>
<li><strong>Lock-based</strong>: First request locks, others wait</li>
<li><strong>Probabilistic Early Expiration</strong>: Refresh before TTL</li>
<li><strong>Background refresh</strong>: Proactive cache warming</li>
</ul>`,
    code_snippet: `// Spring Cache with Redis
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair
                    .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair
                    .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .withCacheConfiguration("users",
                config.entryTtl(Duration.ofHours(1)))
            .withCacheConfiguration("products",
                config.entryTtl(Duration.ofMinutes(15)))
            .build();
    }
}

@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    // Cache-Aside Pattern
    @Cacheable(value = "users", key = "#userId", unless = "#result == null")
    public UserDto getUserById(Long userId) {
        return userRepository.findById(userId)
            .map(this::toDto)
            .orElseThrow(() -> new UserNotFoundException(userId));
    }
    
    // Write-Through: Update cache and DB together
    @CachePut(value = "users", key = "#result.id")
    public UserDto updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        
        user.updateFrom(request);
        return toDto(userRepository.save(user));
    }
    
    // Write-Behind: Evict cache, async DB update
    @CacheEvict(value = "users", key = "#userId")
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
        // Async event for other caches
        applicationEventPublisher.publishEvent(new UserDeletedEvent(userId));
    }
}

// Caffeine - High-Performance Local Cache
@Service
public class ProductService {
    
    private final Cache<String, ProductDto> productCache = Caffeine.newBuilder()
        .maximumSize(10_000)
        .expireAfterWrite(Duration.ofMinutes(10))
        .refreshAfterWrite(Duration.ofMinutes(5))  // Background refresh
        .recordStats()
        .build();
    
    public ProductDto getProduct(String productId) {
        return productCache.get(productId, this::fetchFromDatabase);
    }
    
    // Stampede prevention with lock
    public ProductDto getProductWithLock(String productId) {
        return productCache.get(productId, key -> {
            try {
                return fetchFromDatabaseWithLock(key);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
    
    // Cache metrics
    public CacheStats getCacheStats() {
        return productCache.stats();
    }
}

// Distributed Cache with Redisson
@Service
public class SessionService {
    
    private final RMap<String, UserSession> sessionCache;
    
    public SessionService(RedissonClient redisson) {
        this.sessionCache = redisson.getMap("user-sessions");
    }
    
    public void storeSession(String sessionId, UserSession session) {
        // Write-Behind with async flush
        sessionCache.fastPut(sessionId, session);
    }
    
    public UserSession getSession(String sessionId) {
        return sessionCache.get(sessionId);
    }
    
    // With TTL
    public void storeSessionWithTTL(String sessionId, UserSession session) {
        sessionCache.fastPutInterceptor(sessionId, session, 
            Duration.ofHours(24), Duration.ofSeconds(5));
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '18 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 104,
    title: 'Database Replication Patterns',
    slug: 'database-replication',
    summary: 'Master-slave, multi-master, and read-write splitting in Java applications.',
    content: `<h2>Database Replication Deep Dive</h2>
<p>Replication is fundamental to building scalable, highly available database systems. Understanding the trade-offs is critical for architects.</p>

<h3>Replication Types</h3>

<h4>1. Master-Slave (Primary-Replica)</h4>
<pre>
Write → Master DB → Replicates to → Slave DBs
Read  → Any Slave DB
</pre>
<p><strong>Pros</strong>: Simple, read scalability, geographic distribution</p>
<p><strong>Cons</strong>: Single write point, async lag, failover complexity</p>

<h4>2. Master-Master (Multi-Primary)</h4>
<pre>
Write A → Node 1 ────────────→ Node 2
Write B → Node 2 ────────────→ Node 1
</pre>
<p><strong>Pros</strong>: No single write point, geographic write locality</p>
<p><strong>Cons</strong>: Conflict resolution, write amplification, complex</p>

<h4>3. Synchronous vs Asynchronous Replication</h4>

<h5>Synchronous</h5>
<pre>
Write → Wait for N replicas to confirm → Return success
</pre>
<ul>
<li><strong>Strong consistency</strong></li>
<li><strong>Higher latency</strong> (wait for network round-trip)</li>
<li><strong>Reduced availability</strong> (if replica down, write blocked)</li>
</ul>

<h5>Asynchronous</h5>
<pre>
Write → Return immediately → Replicate in background
</pre>
<ul>
<li><strong>Lower latency</strong></li>
<li><strong>Higher throughput</strong></li>
<li><strong>Eventual consistency</strong> (replication lag)</li>
</ul>

<h5>Semi-Synchronous (PostgreSQL, MySQL)</h5>
<pre>
Write → Wait for at least one replica → Return success
</pre>
<p>Best of both worlds - wait for one, not all.</p>

<h3>Handling Replication Lag</h3>
<p>Async replication means replicas may lag - real problem for:</p>
<ul>
<li><strong>User just signed up, immediately tries to login</strong></li>
<li><strong>Post created, immediately fetched by author</strong></li>
<li><strong>Payment confirmed, immediately shown in dashboard</strong></li>
</ul>

<h4>Solutions</h4>
<ul>
<li><strong>Read-your-writes consistency</strong>: Route critical reads to primary</li>
<li><strong>Session pinning</strong>: Same user always reads from same replica</li>
<li><strong>Expose lag metrics</strong>: Let application make informed decisions</li>
<li><strong>Change Data Capture (CDC)</strong>: Kafka, Debezium for real-time sync</li>
</ul>

<h3>PostgreSQL Specifics</h3>
<ul>
<li><strong>Streaming Replication</strong>: WAL-based, low lag</li>
<li><strong>Logical Replication</strong>: Row-level, can replicate subset</li>
<li><strong>Synchronous Commit</strong>: Controls durability vs performance</li>
</ul>

<h3>MySQL Specifics</h3>
<ul>
<li><strong>Binlog-based</strong>: Binary log contains all changes</li>
<li><strong>GTID</strong>: Global Transaction ID for easier failover</li>
<li><strong>Group Replication</strong>: MySQL's answer to multi-master</li>
</ul>`,
    code_snippet: `// Spring Boot Read-Write Splitting
@Configuration
public class DataSourceConfig {
    
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource masterDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.slave")
    public DataSource slaveDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    public RoutingDataSource routingDataSource(
            DataSource masterDataSource,
            DataSource slaveDataSource) {
        
        RoutingDataSource routingDataSource = new RoutingDataSource();
        routingDataSource.setTargetDataSources(
            Map.of(
                DataSourceType.MASTER, masterDataSource,
                DataSourceType.SLAVE, slaveDataSource
            )
        );
        routingDataSource.setDefaultTargetDataSource(masterDataSource);
        return routingDataSource;
    }
}

public class RoutingDataSource extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        // Use read-only transaction hint to route to slave
        if (Boolean.FALSE.equals(
                TransactionSynchronizationManager.isCurrentTransactionReadOnly())) {
            return DataSourceType.MASTER;
        }
        return DataSourceType.SLAVE;
    }
}

// Usage with explicit master routing
@Service
public class UserService {
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User createUser(UserRequest request) {
        // Forces MASTER - new transaction
        return userRepository.save(toEntity(request));
    }
    
    @Transactional(readOnly = true)  // Routes to SLAVE
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow();
    }
    
    // Explicit routing when read-only annotation not enough
    public User getUserWithFallback(Long id) {
        // First try slave (fast)
        try {
            return jdbcTemplate.queryForObject(
                "SELECT * FROM users WHERE id = ?",
                userRowMapper,
                id
            );
        } catch (DataAccessException e) {
            // Fallback to master if slave is lagging
            return userRepository.findById(id).orElseThrow();
        }
    }
}

// PostgreSQL Synchronous Replication Setup
// postgresql.conf on primary:
wal_level = replica
max_wal_senders = 3
synchronous_commit = on  // 'remote_apply' for strongest consistency
synchronous_standby_names = 'standby1,standby2'

// Recovery configuration on standby:
// standby.signal tells PostgreSQL this is a standby
// primary_conninfo tells how to connect to primary

// Application monitors replication lag
@Service
public class ReplicationMonitor {
    
    public ReplicationStatus checkReplicationStatus() {
        return jdbcTemplate.queryForObject("""
            SELECT 
                client_addr,
                state,
                sent_lsn - replay_lsn AS replication_lag
            FROM pg_stat_replication
            """,
            (rs, row) -> new ReplicationStatus(
                rs.getString("client_addr"),
                rs.getString("state"),
                rs.getLong("replication_lag")
            )
        );
    }
}

// Route to master when lag is too high
public <T> T executeWithLagCheck(String sql, RowMapper<T> mapper) {
    ReplicationStatus status = monitor.checkReplicationStatus();
    
    if (status.getLag() > MAX_ACCEPTABLE_LAG) {
        log.warn("Slave lag {} exceeds threshold, routing to master", status.getLag());
        return jdbcTemplate.queryForObject(sql, mapper);  // Master
    }
    return slaveJdbcTemplate.queryForObject(sql, mapper);  // Slave
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '16 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 105,
    title: 'Database Sharding Strategies',
    slug: 'database-sharding',
    summary: 'Implement horizontal partitioning for massive scale with Java.',
    content: `<h2>Database Sharding - Scaling Writes</h2>
<p>When read replicas aren't enough and you need to scale writes, sharding becomes necessary. This is one of the most complex architectural decisions.</p>

<h3>When to Shard?</h3>
<ul>
<li>Single database approaching connection pool limits</li>
<li>Database size approaching disk/instance limits</li>
<li>Write latency increasing despite optimization</li>
<li>Replication lag becoming problematic</li>
</ul>

<h3>The Shard Key Decision</h3>
<p>This is the most critical decision. Wrong key = hotspot = failure.</p>

<h4>Good Shard Keys</h4>
<ul>
<li><strong>User ID</strong>: Even distribution for user-centric apps</li>
<li><strong>Order ID</strong>: Works for order systems</li>
<li><strong>Composite Key</strong>: user_id + time for activity logs</li>
</ul>

<h4>Bad Shard Keys (Hotspots)</h4>
<ul>
<li><strong>Timestamp</strong>: Recent data all on same shard</li>
<li><strong>Country/Region</strong>: Uneven distribution</li>
<li><strong>Status</strong>: Most records in "active" status</li>
</ul>

<h3>Sharding Strategies</h3>

<h4>1. Hash-Based Sharding</h4>
<pre>
shard_index = hash(shard_key) % num_shards
</pre>
<ul>
<li><strong>Pros</strong>: Even distribution</li>
<li><strong>Cons</strong>: Adding shards requires resharding all data</li>
</ul>

<h4>2. Range-Based Sharding</h4>
<pre>
A-E → Shard 1
F-J → Shard 2
K-O → Shard 3
</pre>
<ul>
<li><strong>Pros</strong>: Easy to understand, range queries possible</li>
<li><strong>Cons</strong>: Can create hotspots</li>
</ul>

<h4>3. Directory-Based Sharding</h4>
<pre>
Lookup Table: user_123 → Shard 2
              user_456 → Shard 1
</pre>
<ul>
<li><strong>Pros</strong>: Flexible, can rebalance without moving data</li>
<li><strong>Cons</strong>: Lookup table is single point of failure</li>
</ul>

<h3>Cross-Shard Operations</h3>
<p>Operations that touch multiple shards are expensive:</p>

<h4>Cross-Shard Queries</h4>
<pre>
1. Scatter: Query all shards
2. Gather: Collect and merge results
3. Sort/Filter: Post-process
</pre>

<h4>Cross-Shard Joins</h4>
<ul>
<li>Application-level join: Fetch from each, join in code</li>
<li>Denormalize: Store redundant data to avoid joins</li>
<li>Shared lookup table: Replicate small tables to all shards</li>
</ul>

<h4>Cross-Shard Transactions</h4>
<ul>
<li><strong>Avoid if possible</strong>: Redesign the operation</li>
<li><strong>Saga Pattern</strong>: Compensating transactions</li>
<li><strong>Two-Phase Commit</strong>: Possible but slow and complex</li>
</ul>

<h3>Sharding in Java</h3>
<p>Options: <strong>ShardingSphere</strong>, <strong>Vitess</strong>, custom application-level</p>`,
    code_snippet: `// ShardingSphere Configuration
@Configuration
public class ShardingDataSourceConfig {
    
    @Bean
    public DataSource dataSource() {
        Map<String, DataSource> dataSources = createDataSources();
        
        ShardingRuleConfiguration ruleConfig = new ShardingRuleConfiguration();
        
        // User table sharded by user_id
        TableRuleConfiguration userTableRule = new TableRuleConfiguration(
            "t_user", 
            "ds_0.t_user_0", "ds_0.t_user_1", "ds_0.t_user_2", "ds_0.t_user_3",
            "ds_0.t_user_4", "ds_0.t_user_5", "ds_0.t_user_6", "ds_0.t_user_7",
            "ds_1.t_user_0", "ds_1.t_user_1", "ds_1.t_user_2", "ds_1.t_user_3",
            "ds_1.t_user_4", "ds_1.t_user_5", "ds_1.t_user_6", "ds_1.t_user_7"
        );
        userTableRule.setTableShardingStrategyConfig(
            new StandardShardingStrategyConfiguration(
                "user_id",
                new ModShardingAlgorithm("16")  // hash % 16
            )
        );
        
        // Order table sharded by user_id (co-located with user)
        TableRuleConfiguration orderTableRule = new TableRuleConfiguration(
            "t_order",
            "ds_0.t_order_0", "ds_0.t_order_1", "ds_0.t_order_2", "ds_0.t_order_3",
            "ds_0.t_order_4", "ds_0.t_order_5", "ds_0.t_order_6", "ds_0.t_order_7",
            "ds_1.t_order_0", "ds_1.t_order_1", "ds_1.t_order_2", "ds_1.t_order_3",
            "ds_1.t_order_4", "ds_1.t_order_5", "ds_1.t_order_6", "ds_1.t_order_7"
        );
        orderTableRule.setTableShardingStrategyConfig(
            new StandardShardingStrategyConfiguration(
                "user_id",
                new InlineShardingAlgorithm("ds_$" + "{user_id % 16 % 2}", "t_order_$" + "{user_id % 16}")
            )
        );
        
        ruleConfig.getTableRuleConfigs().add(userTableRule);
        ruleConfig.getTableRuleConfigs().add(orderTableRule);
        
        // Default database strategy
        ruleConfig.setDefaultDatabaseShardingStrategyConfig(
            new StandardShardingStrategyConfiguration(
                "user_id",
                new InlineShardingAlgorithm("ds_$" + "{user_id % 2}")
            )
        );
        
        DataSource dataSource = ShardingDataSourceFactory.createDataSource(
            dataSources,
            ruleConfig,
            new Properties()
        );
        
        return dataSource;
    }
}

// Application-Level Sharding (Custom)
@Service
public class OrderService {
    
    private final List<JdbcTemplate> shardTemplates;
    private final ShardCalculator shardCalculator;
    
    public OrderService(
            @Value("$" + "{shard.count}") int shardCount,
            List<JdbcTemplate> shardTemplates) {
        this.shardTemplates = shardTemplates;
        this.shardCalculator = new HashShardCalculator(shardCount);
    }
    
    public Order createOrder(Long userId, OrderRequest request) {
        int shardIndex = shardCalculator.calculate(userId);
        JdbcTemplate shard = shardTemplates.get(shardIndex);
        
        // Insert into specific shard
        shard.update("""
            INSERT INTO orders (id, user_id, amount, status, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            UUID.randomUUID().toString(),
            userId,
            request.getAmount(),
            "PENDING",
            Instant.now()
        );
        
        return new Order(...);
    }
    
    public List<Order> getUserOrders(Long userId) {
        // Only query one shard - we know which one
        int shardIndex = shardCalculator.calculate(userId);
        JdbcTemplate shard = shardTemplates.get(shardIndex);
        
        return shard.query("""
            SELECT * FROM orders 
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            orderRowMapper,
            userId
        );
    }
    
    // Cross-shard query - scatter/gather
    public Map<String, Long> getOrderCountByStatus() {
        Map<String, Long> result = new ConcurrentHashMap<>();
        
        // Query all shards in parallel
        List<Future<Map<String, Long>>> futures = shardTemplates.stream()
            .map(shard -> CompletableFuture.supplyAsync(() -> 
                shard.queryForList("""
                    SELECT status, COUNT(*) as cnt 
                    FROM orders 
                    GROUP BY status
                    """).stream()
                    .collect(Collectors.toMap(
                        row -> (String) row.get("status"),
                        row -> ((Number) row.get("cnt")).longValue()
                    ))
            ))
            .collect(Collectors.toList());
        
        // Merge results
        futures.forEach(future -> {
            try {
                Map<String, Long> shardResult = future.get();
                shardResult.forEach((status, count) -> 
                    result.merge(status, count, Long::sum)
                );
            } catch (Exception e) {
                log.error("Shard query failed", e);
            }
        });
        
        return result;
    }
}

// Shard Calculator Interface
public interface ShardCalculator {
    int calculate(Object shardKey);
}

public class HashShardCalculator implements ShardCalculator {
    private final int shardCount;
    
    public HashShardCalculator(int shardCount) {
        this.shardCount = shardCount;
    }
    
    @Override
    public int calculate(Object shardKey) {
        return Math.abs(shardKey.hashCode() % shardCount);
    }
}

public class RangeShardCalculator implements ShardCalculator {
    private final List<String> ranges;  // ["A-F", "G-M", "N-T", "U-Z"]
    
    @Override
    public int calculate(Object shardKey) {
        String key = shardKey.toString().toUpperCase();
        for (int i = 0; i < ranges.size(); i++) {
            if (key.compareTo(ranges.get(i)) < 0) {
                return i;
            }
        }
        return ranges.size() - 1;
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '18 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 106,
    title: 'SQL vs NoSQL - Making the Right Choice',
    slug: 'sql-vs-nosql',
    summary: 'Deep comparison with decision frameworks for Java architects.',
    content: `<h2>SQL vs NoSQL - Beyond the Hype</h2>
<p>Both have their place. The key is understanding trade-offs and choosing based on data characteristics, not trends.</p>

<h3>The Fundamental Difference</h3>

<h4>SQL (Relational)</h4>
<pre>
Schema: Fixed structure enforced at write time
       → Data integrity guaranteed
       → Changes require migrations
       
ACID: Strong guarantees on transactions
     → All-or-nothing commits
     → Isolation between transactions
     
JOINs: Efficient at database level
     → Single query across tables
     → Cost grows with table size
</pre>

<h4>NoSQL (Non-Relational)</h4>
<pre>
Schema: Flexible, schema-on-read
       → Different documents can have different fields
       → No migrations needed
       
BASE: Basically Available, Soft state, Eventually consistent
     → Reads may return stale data
     → Trade-off for availability and scale
     
Denormalization: Store what you query together
                → More storage, faster reads
                → Updates touch multiple places
</pre>

<h3>NoSQL Categories</h3>

<h4>Document Stores (MongoDB, Couchbase)</h4>
<pre>
Structure: JSON-like documents
Best for: Catalogs, user profiles, content management

User Profile Example:
{
  "userId": "123",
  "name": "John",
  "preferences": { "theme": "dark", "lang": "en" },
  "addresses": [...],
  "paymentMethods": [...]
}

→ All user data in one document
→ Single read for entire profile
→ No JOINs needed
</pre>

<h4>Key-Value Stores (Redis, DynamoDB)</h4>
<pre>
Structure: Simple key-value pairs
Best for: Caching, sessions, rate limiting, leaderboards

Redis Examples:
SET session:abc123 "{'userId': 1, 'cart': [...]}"
INCR like:post:456
ZADD leaderboard 1000 "user:123"
</pre>

<h4>Wide-Column Stores (Cassandra, HBase)</h4>
<pre>
Structure: Rows with dynamic columns
Best for: Time-series, IoT, massive write throughput

Cassandra Example:
SELECT * FROM events WHERE user_id = ? AND timestamp > ?
-- Perfect for user activity queries

CREATE TABLE events (
    user_id uuid,
    timestamp timestamp,
    event_type text,
    data map<text, text>,
    PRIMARY KEY (user_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);
</pre>

<h4>Graph Databases (Neo4j, Amazon Neptune)</h4>
<pre>
Structure: Nodes and edges
Best for: Social networks, fraud detection, recommendations

Query Example:
MATCH (user:User {id: 123})-[:FOLLOWS]->(friend)-[:FOLLOWS]->(suggestion)
WHERE NOT (user)-[:FOLLOWS]->(suggestion)
RETURN suggestion
</pre>

<h3>Decision Framework</h3>
<table>
<tr><th>Factor</th><th>Choose SQL</th><th>Choose NoSQL</th></tr>
<tr><td>Data Structure</td><td>Structured, fixed schema</td><td>Flexible, evolving schema</td></tr>
<tr><td>Relationships</td><td>Complex joins, transactions</td><td>Simple or denormalized</td></tr>
<tr><td>Scale</td><td>Moderate (vertical scaling ok)</td><td>Massive (need horizontal)</td></tr>
<tr><td>Consistency</td><td>Strong (ACID required)</td><td>Eventual acceptable</td></tr>
<tr><td>Latency</td><td>Single digit ms ok</td><td>Sub-ms required</td></tr>
<tr><td>Team</td><td>SQL expertise</td><td>NoSQL expertise</td></tr>
</table>

<h3>Real-World: Polyglot Persistence</h3>
<pre>
PostgreSQL: User accounts, orders, inventory (ACID transactions)
Redis: Sessions, cache, rate limiting (in-memory speed)
Elasticsearch: Product search, full-text search
MongoDB: Blog posts, comments (flexible schema)
Cassandra: User activity logs, time-series metrics
Neo4j: Friend recommendations, fraud patterns
</pre>

<h3>Common Mistakes</h3>
<ul>
<li><strong>Choosing NoSQL "because it's modern"</strong>: You'll lose ACID guarantees unnecessarily</li>
<li><strong>Using SQL for everything</strong>: Can't scale to millions of users</li>
<li><strong>Mixing too many databases</strong>: Operational complexity explodes</li>
<li><strong>Ignoring vendor lock-in</strong>: Cassandra Query Language (CQL) ≠ SQL</li>
</ul>`,
    code_snippet: `// PostgreSQL with JPA - ACID transactions
@Service
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    
    public Order createOrder(Long userId, List<OrderItem> items) {
        // All within single transaction - atomicity guaranteed
        
        // 1. Validate inventory (holds row locks)
        for (OrderItem item : items) {
            if (!inventoryService.reserveStock(item)) {
                throw new InsufficientStockException(item.getProductId());
            }
        }
        
        // 2. Process payment (external, may throw)
        Payment payment = paymentService.charge(userId, calculateTotal(items));
        
        // 3. Create order (if this fails, transaction rolls back)
        Order order = new Order(userId, items, payment.getId());
        return orderRepository.save(order);
    }
    
    // If anything throws, ALL changes roll back
}

// MongoDB with Spring Data - Flexible schema
@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    
    // JSON documents - no fixed schema
    
    @Query("{'preferences.theme': ?0}")
    List<UserProfile> findByPreferredTheme(String theme);
}

@Entity
@Document(collection = "user_profiles")
public class UserProfile {
    @Id
    private String id;
    
    private String name;
    private String email;
    
    // Flexible field - not all documents need this
    private Map<String, String> preferences;
    
    // Array field - variable length
    private List<Address> addresses;
    
    // Different documents can have different fields
    // MongoDB handles this gracefully
}

// Cassandra with datastax driver - Write-heavy optimized
@Service
public class MetricsService {
    
    @Autowired
    private CqlSession session;
    
    public void recordMetric(String service, long timestamp, double value) {
        // Append-only pattern - perfect for Cassandra
        session.execute(PreparedStatement.builder("""
            INSERT INTO service_metrics 
            (service_name, timestamp, value, date_bucket)
            VALUES (?, ?, ?, ?)
            """)
            .build()
            .bind(service, timestamp, value, getDateBucket(timestamp))
        );
    }
    
    public List<Metric> getMetrics(String service, Instant start, Instant end) {
        // Time-range query - Cassandra's strength
        return session.execute("""
            SELECT * FROM service_metrics
            WHERE service_name = ?
            AND timestamp >= ?
            AND timestamp <= ?
            """, service, start.toEpochMilli(), end.toEpochMilli())
            .map(row -> new Metric(...))
            .all();
    }
}

// Redis for caching and sessions
@Service
public class SessionService {
    
    private final RedissonClient redisson;
    
    public void createSession(String sessionId, UserSession session) {
        RMap<String, String> sessionMap = redisson.getMap("sessions");
        
        // All operations atomic
        sessionMap.put("userId", session.getUserId().toString());
        sessionMap.put("lastAccess", Instant.now().toString());
        
        // With automatic expiration
        redisson.getBucket("session:" + sessionId)
            .set(session, Duration.ofHours(24));
    }
    
    public UserSession getSession(String sessionId) {
        RBucket<UserSession> bucket = redisson.getBucket("session:" + sessionId);
        return bucket.get();
    }
    
    // Distributed locks
    public void processWithLock(String resourceId, Runnable task) {
        RLock lock = redisson.getLock("lock:" + resourceId);
        
        try {
            if (lock.tryLock(10, 30, TimeUnit.SECONDS)) {
                task.run();
            } else {
                throw new ResourceBusyException(resourceId);
            }
        } finally {
            lock.unlock();
        }
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '16 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 107,
    title: 'Message Queues for Java Developers',
    slug: 'message-queues',
    summary: 'Apache Kafka, RabbitMQ, and Spring Cloud Stream patterns.',
    content: `<h2>Message Queues in Distributed Systems</h2>
<p>Message queues enable async communication, temporal decoupling, and system resilience. They're essential for scalable architectures.</p>

<h3>Why Message Queues?</h3>

<h4>Decoupling</h4>
<pre>
Without MQ:  Producer ↔ Consumer (tightly coupled)
With MQ:     Producer → Queue → Consumer (loosely coupled)

Consumer can be down → Producer doesn't care
Producer can spike → Consumer processes at its pace
</pre>

<h4>Resilience</h4>
<ul>
<li>Messages persist until consumed</li>
<li>Failed consumers don't lose messages</li>
<li>System can recover from failures</li>
</ul>

<h4>Scalability</h4>
<ul>
<li>Add more consumers to process faster</li>
<li>Queue absorbs traffic spikes</li>
<li>Independent scaling of producers and consumers</li>
</ul>

<h3>Message Queue Patterns</h3>

<h4>1. Point-to-Point (Task Queue)</h4>
<pre>
Producer → [Queue] → Consumer 1
                  → Consumer 2 (competes)
                  → Consumer 3 (competes)
                  
One consumer processes each message
</pre>

<h4>2. Pub/Sub (Publish-Subscribe)</h4>
<pre>
Producer → [Topic] → Consumer A (subscribed)
                  → Consumer B (subscribed)
                  → Consumer C (subscribed)
                  
Each consumer gets every message
</pre>

<h4>3. Request-Reply</h4>
<pre>
Request → Queue → Consumer → Reply Queue → Original Sender
</pre>

<h3>Kafka vs RabbitMQ</h3>
<table>
<tr><th>Aspect</th><th>Kafka</th><th>RabbitMQ</th></tr>
<tr><td>Model</td><td>Log-based, persistent</td><td>Smart broker, message acknowledgment</td></tr>
<tr><td>Ordering</td><td>Per partition</td><td>Per queue</td></tr>
<tr><td>Throughput</td><td>Millions/second</td><td>Tens of thousands/second</td></tr>
<tr><td>Message retention</td><td>Configurable (days, weeks)</td><td>Until consumed + TTL</td></tr>
<tr><td>Use case</td><td>Event streaming, CDC</td><td>Task queues, RPC</td></tr>
<tr><td>Delivery semantics</td><td>At-least-once, exactly-once</td><td>At-least-once, at-most-once</td></tr>
</table>

<h3>Message Delivery Guarantees</h3>

<h4>At-Most-Once</h4>
<pre>
Producer sends → Fire and forget
Consumer receives → Don't ack

Risk: Message lost if consumer crashes
</pre>

<h4>At-Least-Once</h4>
<pre>
Producer sends → Wait for ack
Consumer receives → Process → Ack

Risk: Duplicate processing
Solution: Idempotency
</pre>

<h4>Exactly-Once</h4>
<pre>
Producer sends with transaction
Consumer processes transactionally

Cost: Higher latency, complexity
</pre>

<h3>Dead Letter Queue (DLQ)</h3>
<p>Messages that fail processing go to DLQ for investigation.</p>
<pre>
Message → Consumer → FAIL → Dead Letter Queue → Investigation
</pre>`,
    code_snippet: `// Apache Kafka with Spring Kafka
@Configuration
@EnableKafka
public class KafkaConfig {
    
    @Bean
    public KafkaTemplate<String, OrderEvent> kafkaTemplate(
            ProducerFactory<String, OrderEvent> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderEvent> 
            kafkaListenerContainerFactory(
                ConsumerFactory<String, OrderEvent> consumerFactory) {
        
        ConcurrentKafkaListenerContainerFactory<String, OrderEvent> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
        
        factory.setConsumerFactory(consumerFactory);
        factory.setConcurrency(3);  // 3 threads per consumer
        factory.getContainerProperties().setAckMode(
            AckMode.RECORD);  // Ack after each record
        
        return factory;
    }
}

@Service
public class OrderEventProducer {
    
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;
    
    public void publishOrderCreated(Order order) {
        OrderEvent event = new OrderEvent(
            "ORDER_CREATED",
            order.getId(),
            order.getUserId(),
            Instant.now()
        );
        
        // Use order ID as key for partitioning
        kafkaTemplate.send("order-events", order.getId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish order event", ex);
                    // Retry logic here
                } else {
                    log.info("Published order event to partition {}",
                        result.getRecordMetadata().partition());
                }
            });
    }
    
    // Idempotent publishing
    public void publishOrderCreatedIdempotent(Order order) {
        // Use Kafka transaction for exactly-once
        kafkaTemplate.executeInTransaction(template -> {
            template.send("order-events", order.getId().toString(), 
                new OrderEvent(...));
            return null;
        });
    }
}

@Service
public class OrderEventConsumer {
    
    private final OrderService orderService;
    private final NotificationService notificationService;
    
    @KafkaListener(
        topics = "order-events",
        groupId = "notification-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderEvent(
            @Payload OrderEvent event,
            @Headers KafkaHeaders headers) {
        
        try {
            switch (event.getType()) {
                case "ORDER_CREATED":
                    // Process with idempotency check
                    if (!idempotencyService.isProcessed(event.getEventId())) {
                        notificationService.sendOrderConfirmation(event.getOrderId());
                        idempotencyService.markProcessed(event.getEventId());
                    }
                    break;
                    
                case "ORDER_CANCELLED":
                    notificationService.sendCancellationNotice(event.getOrderId());
                    break;
            }
        } catch (Exception e) {
            log.error("Failed to process event {}", event, e);
            throw e;  // Re-throw for retry/DLQ
        }
    }
    
    // Manual acknowledgment with DLQ
    @KafkaListener(
        topics = "order-events",
        groupId = "dlq-handler"
    )
    public void handleDlq(
            @Payload ConsumerRecord<String, OrderEvent> record,
            KafkaTemplate<String, OrderEvent> kafkaTemplate) {
        
        try {
            processOrderEvent(record.value());
        } catch (Exception e) {
            log.error("DLQ: Sending to dead letter topic", e);
            
            // Send to DLQ
            kafkaTemplate.send("order-events-dlq", record.key(), record.value());
            
            // Or send to retry topic with backoff
            kafkaTemplate.send("order-events-retry-1min", record.key(), record.value());
        }
    }
}

// RabbitMQ with Spring AMQP
@Service
public class PaymentService {
    
    private final RabbitTemplate rabbitTemplate;
    
    public void processPayment(PaymentRequest request) {
        // Direct exchange - point to point
        rabbitTemplate.convertAndSend(
            "payment.exchange",    // Exchange
            "payment.process",      // Routing key
            request,
            message -> {
                message.getMessageProperties().setDeliveryMode(
                    MessageDeliveryMode.PERSISTENT);
                message.getMessageProperties().setHeader("x-retry-count", 0);
                return message;
            }
        );
    }
}

@Component
public class PaymentConsumer {
    
    @RabbitListener(queues = "payment.process.queue")
    public void handlePayment(
            PaymentRequest request,
            Message message,
            Channel channel) throws IOException {
        
        try {
            // Process payment
            PaymentResult result = paymentGateway.charge(request);
            
            // Publish success event
            rabbitTemplate.convertAndSend(
                "notification.exchange",
                "payment.success",
                new PaymentSuccessEvent(request, result)
            );
            
            // Acknowledge
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
            
        } catch (InsufficientFundsException e) {
            // Business error - don't retry, send to DLQ
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), 
                false, false);
                
        } catch (Exception e) {
            // Transient error - retry with backoff
            Integer retryCount = (Integer) message.getMessageProperties()
                .getHeader("x-retry-count");
            
            if (retryCount < 3) {
                // Requeue with incremented retry count
                message.getMessageProperties().setHeader("x-retry-count", retryCount + 1);
                channel.basicNack(message.getMessageProperties().getDeliveryTag(), 
                    false, true);  // requeue
            } else {
                // Max retries exceeded - DLQ
                channel.basicNack(message.getMessageProperties().getDeliveryTag(), 
                    false, false);
            }
        }
    }
}

// DLQ Configuration
@Configuration
public class RabbitMQConfig {
    
    @Bean
    public DirectExchange paymentExchange() {
        return new DirectExchange("payment.exchange");
    }
    
    @Bean
    public Queue paymentQueue() {
        return QueueBuilder.durable("payment.process.queue")
            .withArgument("x-dead-letter-exchange", "payment.dlx")
            .withArgument("x-dead-letter-routing-key", "payment.failed")
            .build();
    }
    
    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange("payment.dlx");
    }
    
    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable("payment.failed.queue").build();
    }
    
    @Bean
    public Binding deadLetterBinding() {
        return BindingBuilder
            .bind(deadLetterQueue())
            .to(deadLetterExchange())
            .with("payment.failed");
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '18 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 108,
    title: 'Event-Driven Architecture with Spring',
    slug: 'event-driven-architecture',
    summary: 'Event sourcing, CQRS, and reactive patterns for modern Java systems.',
    content: `<h2>Event-Driven Architecture Deep Dive</h2>
<p>EDA flips the paradigm from "request-response" to "emit and react". Essential for building responsive, loosely coupled systems.</p>

<h3>Events vs Commands</h3>

<h4>Command</h4>
<pre>"Do this" - Imperative, expects specific handler</pre>
<pre>
POST /api/orders → CreateOrderCommand → OrderService.handle()
</pre>

<h4>Event</h4>
<pre>"This happened" - Declarative, multiple handlers possible</pre>
<pre>
OrderCreated → Event Bus → [EmailHandler, InventoryHandler, AnalyticsHandler]
</pre>

<h3>Event Sourcing</h3>
<p>Store all state changes as a sequence of events, not current state.</p>

<h4>Traditional</h4>
<pre>
Account Table: balance = 50

UPDATE account SET balance = balance - 30 WHERE id = 1
UPDATE account SET balance = 50 - 30 = 20
</pre>

<h4>Event Sourcing</h4>
<pre>
Event Log:
1. AccountOpened { balance: 100 }
2. MoneyDeposited { amount: 50 }
3. MoneyWithdrawn { amount: 30 }

Current State = Replay all events from beginning
Balance = 100 + 50 - 30 = 120
</pre>

<h4>Benefits</h4>
<ul>
<li><strong>Complete Audit Trail</strong>: Every change is recorded</li>
<li><strong>Time Travel</strong>: Reconstruct state at any point</li>
<li><strong>Replay</strong>: Rebuild projections from scratch</li>
<li><strong>Debugging</strong>: Event log is the source of truth</li>
</ul>

<h4>Challenges</h4>
<ul>
<li><strong>Event Schema Evolution</strong>: Upcasting old events</li>
<li><strong>Snapshots</strong>: Optimization for long-lived aggregates</li>
<li><strong>Eventual Consistency</strong>: Projections update async</li>
</ul>

<h3>CQRS (Command Query Responsibility Segregation)</h3>
<pre>
Commands (Write): POST /api/orders → OrderCommandHandler → Event Store
                ↓
Queries (Read):  GET /api/orders/123 → QueryHandler → Read Model (denormalized)
</pre>

<h4>Why Separate?</h4>
<ul>
<li>Different data models for read vs write</li>
<li>Read model can be highly optimized (denormalized)</li>
<li>Write model can be normalized (domain model)</li>
<li>Independent scaling of reads and writes</li>
</ul>

<h3>Event-Driven Patterns</h3>

<h4>1. Saga Pattern</h4>
<pre>
CreateOrder → ReserveInventory → ProcessPayment → ShipOrder
     ↓              ↓                  ↓             ↓
  success         success           failed      compensate!
                              → CancelInventory ←
</pre>

<h4>2. Outbox Pattern</h4>
<pre>
Problem: Database + MQ consistency

Solution:
1. Write to DB + Outbox table in same transaction
2. Background process polls outbox, publishes to MQ
3. Mark as published

Result: Atomic DB + outbox write, reliable MQ publish
</pre>

<h4>3. Transactional Outbox</h4>
<pre>
UserService.beginTransaction()
  INSERT INTO orders (...)
  INSERT INTO outbox (event_type, payload)  -- Same transaction
UserService.commit()

BackgroundWorker:
  SELECT * FROM outbox WHERE published = false
  Publish to Kafka
  UPDATE outbox SET published = true
</pre>`,
    code_snippet: `// Event Sourcing with Spring Events
@Entity
@Table(name = "account_events")
public class AccountEvent {
    @Id
    @GeneratedValue
    private UUID id;
    
    private UUID accountId;
    private String eventType;  // "ACCOUNT_CREATED", "MONEY_DEPOSITED", etc.
    private BigDecimal amount;
    private BigDecimal balanceAfter;  // Snapshot for optimization
    private Instant timestamp;
    private int version;  // Optimistic locking
}

// Aggregate Root with Event Sourcing
public class Account extends AbstractAggregateRoot<AccountEvent> {
    
    private UUID id;
    private BigDecimal balance;
    private AccountStatus status;
    
    public Account(UUID id, BigDecimal initialBalance) {
        apply(new AccountCreatedEvent(id, initialBalance, initialBalance));
    }
    
    // Event sourcing: apply method mutates state
    public void apply(AccountCreatedEvent event) {
        this.id = event.getAccountId();
        this.balance = event.getInitialBalance();
        this.status = AccountStatus.ACTIVE;
    }
    
    public void deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        
        BigDecimal newBalance = balance.add(amount);
        apply(new MoneyDepositedEvent(id, amount, newBalance));
    }
    
    public void withdraw(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (balance.compareTo(amount) < 0) {
            throw new InsufficientFundsException(id, balance, amount);
        }
        
        BigDecimal newBalance = balance.subtract(amount);
        apply(new MoneyWithdrawnEvent(id, amount, newBalance));
    }
    
    // Reconstruct from event history
    public static Account fromEvents(List<AccountEvent> events) {
        Account account = new Account();
        events.forEach(event -> account.apply(event));
        return account;
    }
}

// Event Store Repository
@Repository
public class EventStore {
    
    private final JdbcTemplate jdbcTemplate;
    
    public void save(AccountEvent event) {
        jdbcTemplate.update("""
            INSERT INTO account_events 
            (id, account_id, event_type, amount, balance_after, timestamp, version)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            event.getId(),
            event.getAccountId(),
            event.getEventType(),
            event.getAmount(),
            event.getBalanceAfter(),
            event.getTimestamp(),
            event.getVersion()
        );
    }
    
    public List<AccountEvent> getEventsForAccount(UUID accountId) {
        return jdbcTemplate.query("""
            SELECT * FROM account_events 
            WHERE account_id = ?
            ORDER BY version ASC
            """,
            eventRowMapper,
            accountId
        );
    }
    
    // Snapshot for optimization
    public Optional<AccountSnapshot> getSnapshot(UUID accountId) {
        return jdbcTemplate.query("""
            SELECT * FROM account_snapshots
            WHERE account_id = ?
            ORDER BY version DESC
            LIMIT 1
            """,
            snapshotRowMapper,
            accountId
        ).stream().findFirst();
    }
}

// CQRS with Separate Read/Write Models
@Service
public class OrderCommandService {
    
    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public OrderId createOrder(CreateOrderCommand command) {
        Order order = new Order(command.getUserId(), command.getItems());
        Order saved = orderRepository.save(order);
        
        // Publish domain event
        eventPublisher.publishEvent(new OrderCreatedEvent(
            saved.getId(),
            saved.getUserId(),
            saved.getTotalAmount()
        ));
        
        return saved.getId();
    }
}

// Separate Query Handler
@Service
public class OrderQueryService {
    
    private final JdbcTemplate jdbcTemplate;
    
    // Denormalized read model - single query, no joins
    public OrderReadModel getOrderDetails(Long orderId) {
        return jdbcTemplate.queryForObject("""
            SELECT o.*, 
                   u.name as user_name,
                   u.email as user_email,
                   COUNT(i.id) as item_count
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items i ON o.id = i.order_id
            WHERE o.id = ?
            GROUP BY o.id, u.name, u.email
            """,
            orderReadModelRowMapper,
            orderId
        );
    }
    
    // Optimized for specific query
    public List<OrderSummary> getRecentOrders(Long userId, int limit) {
        return jdbcTemplate.query("""
            SELECT id, total_amount, status, created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            """,
            orderSummaryRowMapper,
            userId, limit
        );
    }
}

// Saga Orchestrator
@Service
public class OrderSagaOrchestrator {
    
    private final PaymentService paymentService;
    private final InventoryService inventoryService;
    private final ShippingService shippingService;
    
    public OrderResult execute(Long orderId, OrderDetails details) {
        try {
            // Step 1: Reserve inventory
            ReservationResult reservation = inventoryService
                .reserve(orderId, details.getItems());
            if (!reservation.isSuccess()) {
                return OrderResult.failed("Inventory reservation failed");
            }
            
            // Step 2: Process payment
            PaymentResult payment = paymentService
                .charge(details.getUserId(), details.getTotalAmount());
            if (!payment.isSuccess()) {
                // Compensate: release inventory
                inventoryService.release(reservation.getReservationId());
                return OrderResult.failed("Payment failed");
            }
            
            // Step 3: Initiate shipping
            ShippingResult shipping = shippingService
                .initiate(orderId, details.getShippingAddress());
            
            return OrderResult.success(orderId, payment, shipping);
            
        } catch (Exception e) {
            // Compensate all completed steps
            return handleCompensation(orderId, details, e);
        }
    }
}

// Transactional Outbox Pattern
@Service
public class OrderService {
    
    private final JdbcTemplate jdbcTemplate;
    private final TransactionTemplate transactionTemplate;
    
    public void createOrder(Order order) {
        transactionTemplate.executeWithoutResult(status -> {
            // Atomic: order + outbox event in same transaction
            jdbcTemplate.update("INSERT INTO orders (...) VALUES (...)", ...);
            
            jdbcTemplate.update("""
                INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                "Order",
                order.getId(),
                "ORDER_CREATED",
                serialize(new OrderCreatedEvent(order)),
                Instant.now()
            );
        });
    }
}

@Component
public class OutboxProcessor {
    
    private final JdbcTemplate jdbcTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    
    @Scheduled(fixedDelay = 100)
    public void processOutbox() {
        List<OutboxRecord> events = jdbcTemplate.query("""
            SELECT * FROM outbox 
            WHERE published = false
            ORDER BY created_at ASC
            LIMIT 100
            FOR UPDATE SKIP LOCKED
            """,
            outboxRowMapper
        );
        
        for (OutboxRecord event : events) {
            try {
                kafkaTemplate.send(
                    event.getAggregateType().toLowerCase() + "-events",
                    event.getAggregateId().toString(),
                    event.getPayload()
                );
                
                jdbcTemplate.update(
                    "UPDATE outbox SET published = true WHERE id = ?",
                    event.getId()
                );
            } catch (Exception e) {
                log.error("Failed to publish outbox event {}", event.getId(), e);
            }
        }
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '20 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 109,
    title: 'Microservices Architecture Patterns',
    slug: 'microservices-architecture',
    summary: 'Service decomposition, communication, and orchestration strategies.',
    content: `<h2>Microservices - Beyond the Hype</h2>
<p>Microservices solve real problems but introduce significant complexity. Understanding when and how to decompose is critical.</p>

<h3>Microservices vs Monolith - Honest Comparison</h3>

<h4>Monolith Advantages</h4>
<ul>
<li><strong>Simple to develop</strong>: One codebase, one deployment</li>
<li><strong>Simple to test</strong>: All code in one place</li>
<li><strong>Simple to debug</strong>: Single process, no distributed tracing</li>
<li><strong>ACID transactions</strong>: Local database, no distributed saga</li>
<li><strong>No network latency</strong>: In-memory calls</li>
</ul>

<h4>Microservices Advantages</h4>
<ul>
<li><strong>Independent deploy</strong>: Change one service without deploying all</li>
<li><strong>Independent scale</strong>: Scale hot service, not entire app</li>
<li><strong>Technology diversity</strong>: Different services, different tools</li>
<li><strong>Team autonomy</strong>: Teams own services end-to-end</li>
<li><strong>Fault isolation</strong>: One service down ≠ entire system down</li>
</ul>

<h3>When to Decompose?</h3>
<table>
<tr><th>Team Size</th><th>Complexity</th><th>Recommendation</th></tr>
<tr><td>1-5</td><td>Low</td><td>Monolith</td></tr>
<tr><td>5-20</td><td>Medium</td><td>Modular Monolith</td></tr>
<tr><td>20-50</td><td>High</td><td>Microservices for some domains</td></tr>
<tr><td>50+</td><td>Very High</td><td>Full Microservices</td></tr>
</table>

<h3>Decomposition Strategies</h3>

<h4>1. By Business Capability</h4>
<pre>
E-commerce System:
├── User Service (registration, authentication, profiles)
├── Catalog Service (products, categories, search)
├── Order Service (cart, checkout, orders)
├── Payment Service (payment processing, refunds)
├── Inventory Service (stock levels, reservations)
├── Shipping Service (tracking, carriers)
└── Notification Service (email, SMS, push)
</pre>

<h4>2. By Domain (DDD Bounded Contexts)</h4>
<pre>
Bounded Context: Order
├── Aggregate: Order
├── Entities: OrderItem, Payment, Shipment
├── Value Objects: Address, Money
├── Domain Events: OrderPlaced, OrderCancelled
└── Repository: OrderRepository

Bounded Context: Inventory
├── Aggregate: Stock
├── Entities: Warehouse, StockLevel
├── Value Objects: Quantity, SKU
├── Domain Events: StockReserved, StockReleased
└── Repository: StockRepository
</pre>

<h4>3. Strangler Fig Pattern</h4>
<pre>
1. Build new microservice alongside monolith
2. Gradually migrate traffic
3. Decommission old code
4. Repeat for each capability
</pre>

<h3>Communication Patterns</h3>

<h4>Synchronous (REST, gRPC)</h4>
<pre>
Client → API Gateway → Service A → Service B → Service C
                    ↑                  ↑
                  Wait              Wait
</pre>
<ul>
<li><strong>Pros</strong>: Simple, familiar, request-response</li>
<li><strong>Cons</strong>: Tight coupling, latency accumulation, cascade failures</li>
</ul>

<h4>Asynchronous (Messaging, Events)</h4>
<pre>
Service A → Event Bus → Service B (async)
                      → Service C (async)
</pre>
<ul>
<li><strong>Pros</strong>: Loose coupling, resilience, scalability</li>
<li><strong>Cons</strong>: Complexity, eventual consistency</li>
</ul>

<h3>Service Mesh</h3>
<p>Infrastructure layer handling service-to-service communication.</p>
<pre>
Without Service Mesh:
Service A → [Load Balancer] → Service B (application code handles retries, circuits)

With Service Mesh (Istio):
Service A → [Sidecar Proxy] → [Sidecar Proxy] → Service B
                    ↓                ↓
            [Control Plane handles retries, circuits, auth]
</pre>`,
    code_snippet: `// Spring Cloud Microservices Setup
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServerApplication.class, args);
    }
}

@Configuration
@EnableEurekaClient
@EnableCircuitBreaker
@EnableFeignClients
public class OrderServiceConfig {
    
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

// Service Discovery with Eureka
@Service
public class OrderService {
    
    private final RestTemplate restTemplate;
    
    public UserDetails getUserWithOrderDetails(Long userId) {
        // Service name - Eureka resolves to actual IP
        User user = restTemplate.getForObject(
            "http://user-service/api/users/" + userId,
            User.class
        );
        
        List<Order> orders = restTemplate.getForObject(
            "http://order-service/api/orders?userId=" + userId,
            List.class
        );
        
        return new UserDetails(user, orders);
    }
}

// Feign Client - Declarative REST client
@FeignClient(name = "user-service", fallbackFactory = UserServiceFallbackFactory.class)
public interface UserClient {
    
    @GetMapping("/api/users/{id}")
    User getUser(@PathVariable("id") Long id);
    
    @GetMapping("/api/users/{id}/orders")
    List<OrderSummary> getUserOrders(@PathVariable("id") Long id);
    
    @PostMapping("/api/users")
    User createUser(@RequestBody CreateUserRequest request);
}

// Fallback with circuit breaker
@Component
public class UserServiceFallbackFactory 
        implements FallbackFactory<UserServiceFallback> {
    
    @Override
    public UserServiceFallback create(Throwable cause) {
        return new UserServiceFallback(cause);
    }
}

class UserServiceFallback implements UserClient {
    
    private final Throwable cause;
    
    public UserServiceFallback(Throwable cause) {
        this.cause = cause;
    }
    
    @Override
    public User getUser(Long id) {
        if (cause instanceof TimeoutException) {
            log.warn("User service timeout for user {}", id);
            return User.anonymous(id);  // Graceful degradation
        }
        throw new ServiceUnavailableException("User service unavailable");
    }
}

// API Gateway with Spring Cloud Gateway
@Configuration
public class GatewayRoutes {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user_route", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .addRequestHeader("X-Gateway", "true")
                    .retry(3)  // Retry on failure
                    .circuitBreaker(c -> c
                        .setName("userCircuitBreaker")
                        .setFallbackUri("forward:/fallback/users")))
                .uri("lb://user-service"))
                
            .route("order_route", r -> r
                .path("/api/orders/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .rateLimiter(c -> c
                        .setRateLimiter(redisRateLimiter())
                        .setParamName("req/sec")))
                .uri("lb://order-service"))
                
            .route("composite_route", r -> r
                .path("/api/composite/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .hystrix(h -> h
                        .setName("composite")
                        .setFallbackUri("forward:/fallback/composite")))
                .uri("lb://composite-service"))
            .build();
    }
}

// Kubernetes Deployment
// deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: myrepo/order-service:v1.2.3
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: EUREKA_CLIENT_SERVICEURLDEFAULTZONE
          value: "http://eureka:8761/eureka/"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 15

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP

---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '18 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 110,
    title: 'API Gateway Patterns',
    slug: 'api-gateway',
    summary: 'Edge routing, authentication, rate limiting, and aggregation.',
    content: `<h2>API Gateway - The Single Entry Point</h2>
<p>API Gateway handles cross-cutting concerns: routing, auth, rate limiting, monitoring. Without it, every service duplicates this logic.</p>

<h3>Gateway Responsibilities</h3>

<h4>1. Routing</h4>
<pre>
GET /api/products/123  →  Product Service
GET /api/users/456    →  User Service
POST /api/orders      →  Order Service
</pre>

<h4>2. Authentication & Authorization</h4>
<pre>
Request → [Validate JWT] → [Check Permissions] → Service
         ↓
      Invalid → 401 Unauthorized
</pre>

<h4>3. Rate Limiting</h4>
<pre>
Request → [Check Rate] → [Increment Counter] → Service
         ↓
      Exceeded → 429 Too Many Requests
</pre>

<h4>4. Request/Response Transformation</h4>
<pre>
Request: { userId: "123" }  →  Transform  →  { id: 123 }
Response: { full_name: "John" }  →  Transform  →  { name: "John" }
</pre>

<h4>5. Aggregation</h4>
<pre>
Request → Gateway → [Call Service A] + [Call Service B] + [Call Service C]
                   ↓
              Aggregate Results
                   ↓
              Single Response
</pre>

<h4>6. Circuit Breaking</h4>
<pre>
Request → Gateway → [Circuit: CLOSED] → Service A
                            ↓
                     [Circuit: OPEN]
                     [Fallback Response]
</pre>

<h3>BFF Pattern (Backend for Frontend)</h3>
<pre>
Traditional Gateway:
Client → [Single Gateway] → All Services

BFF Pattern:
Web Client    → [Web BFF]    → Services
Mobile Client → [Mobile BFF] → Services
Third-party   → [API Gateway] → Services

Each BFF optimizes for its client:
- Mobile: Smaller payloads, different API shape
- Web: Rich data, real-time updates
</pre>

<h3>Gateway vs Reverse Proxy</h3>
<table>
<tr><th>Feature</th><th>Reverse Proxy (Nginx)</th><th>API Gateway</th></tr>
<tr><td>Routing</td><td>Basic</td><td>Rule-based, service discovery</td></tr>
<tr><td>Auth</td><td>Basic auth</td><td>JWT, OAuth, API keys</td></tr>
<tr><td>Transform</td><td>Limited</td><td>Full request/response</td></tr>
<tr><td>Protocol</td><td>HTTP</td><td>HTTP, gRPC, WebSocket</td></tr>
<tr><td>Aggregation</td><td>No</td><td>Yes</td></tr>
<tr><td>Logic</td><td>Config-based</td><td>Programmable</td></tr>
</table>

<h3>Performance Considerations</h3>
<ul>
<li><strong>Connection pooling</strong>: Reuse connections to backends</li>
<li><strong>Caching</strong>: Cache responses at gateway level</li>
<li><strong>Compression</strong>: gzip/brotli compression</li>
<li><strong>Keep-alive</strong>: Reuse backend connections</li>
</ul>`,
    code_snippet: `// Spring Cloud Gateway - Full-featured API Gateway
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user_route", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .addRequestHeader("X-App-Name", "gateway")
                    .addResponseHeader("X-Response-Time", 
                        exchange -> LocalDateTime.now().toString())
                    .requestRateLimiter()
                        .rateLimiter(redisRateLimiter())
                        .setKeyResolver(userKeyResolver())
                        .setStatusCode(HttpStatus.TOO_MANY_REQUESTS)
                    .circuitBreaker(c -> c
                        .setName("userCircuitBreaker")
                        .setFallbackUri("forward:/fallback/users")
                        .setRouteUri("lb://user-service"))
                    .retry(3)
                        .setRetries(3)
                        .setSeries(setOf(HttpStatus.INTERNAL_SERVER_ERROR)))
                .uri("lb://user-service"))
            .build();
    }
    
    @Bean
    public RouteLocator websocketRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("notification_ws", r -> r
                .path("/ws/notifications")
                .filters(f -> f
                    .setPath("/notifications"))
                .uri("lb://notification-service"))
            .build();
    }
}

// Key Resolver - Who to rate limit?
@Component
public class KeyResolvers {
    
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            String auth = exchange.getRequest().getHeaders()
                .getFirst("Authorization");
            
            if (auth != null && auth.startsWith("Bearer ")) {
                // Extract user ID from JWT
                String token = auth.substring(7);
                String userId = jwtService.extractUserId(token);
                return Mono.just(userId);
            }
            
            // Fallback to IP if no auth
            return Mono.just(
                exchange.getRequest().getRemoteAddress()
                    .getAddress().getHostAddress()
            );
        };
    }
    
    // Rate limit by API key
    @Bean
    public KeyResolver apiKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getHeaders()
                .getFirst("X-API-Key")
        );
    }
}

// JWT Authentication Filter
@Component
public class JwtAuthenticationFilter implements GlobalFilter {
    
    private final JwtService jwtService;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, 
            GatewayFilterChain chain) {
        
        String path = exchange.getRequest().getPath().value();
        
        // Skip auth for public endpoints
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }
        
        String auth = exchange.getRequest().getHeaders()
            .getFirst("Authorization");
        
        if (auth == null || !auth.startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing or invalid authorization header");
        }
        
        try {
            String token = auth.substring(7);
            Claims claims = jwtService.validateAndExtract(token);
            
            // Add user info to headers for downstream services
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header("X-User-Id", claims.getSubject())
                .header("X-User-Roles", 
                    String.join(",", claims.get("roles", List.class)))
                .build();
            
            return chain.filter(
                exchange.mutate().request(mutatedRequest).build()
            );
            
        } catch (JwtException e) {
            return unauthorized(exchange, "Invalid token");
        }
    }
    
    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add("Content-Type", "application/json");
        
        String body = String.format(
            "{\"error\": \"Unauthorized\", \"message\": \"%s\"}", message);
        
        return response.writeWith(
            Mono.just(response.bufferFactory().wrap(body.getBytes()))
        );
    }
    
    private boolean isPublicPath(String path) {
        return path.startsWith("/api/auth/") ||
               path.startsWith("/api/public/") ||
               path.equals("/health");
    }
}

// Response Transformation Filter
@Component
@Order(1)
public class ResponseTransformFilter implements GlobalFilter {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, 
            GatewayFilterChain chain) {
        
        return chain.filter(exchange)
            .then(Mono.defer(() -> {
                ServerHttpResponse response = exchange.getResponse();
                
                // Transform snake_case to camelCase
                if (response.getHeaders().getContentType()
                        .equals(MediaType.APPLICATION_JSON)) {
                    
                    // Transformation logic
                }
                
                return Mono.empty();
            }));
    }
}

// Aggregation Pattern - Fan-out requests
@Configuration
public class AggregationConfig {
    
    @Bean
    public RouteLocator aggregationRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user_dashboard", r -> r
                .path("/api/dashboard/user/{id}")
                .filters(f -> f
                    .setStripPrefix(false)
                    .hystrix(h -> h
                        .setName("dashboard")
                        .setFallbackUri("forward:/fallback/dashboard"))
                    .modifyResponseBody(String.class, String.class, 
                        (exchange, body) -> aggregateDashboard(body, exchange)))
                .uri("no://op"))  // Custom filter handles routing
            .build();
    }
}

@Component
public class DashboardAggregator {
    
    private final WebClient webClient;
    
    public DashboardAggregator(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://user-service").build();
    }
    
    public Mono<String> aggregateDashboard(Long userId, 
            ServerWebExchange exchange) {
        
        // Parallel calls to multiple services
        Mono<User> userMono = webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
        
        Mono<List<Order>> ordersMono = webClient.get()
            .uri("/users/{id}/orders?limit=5", userId)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<Order>>() {});
        
        Mono<List<Notification>> notificationsMono = webClient.get()
            .uri("/users/{id}/notifications?unread=true")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<Notification>>() {});
        
        // Zip all responses
        return Mono.zip(userMono, ordersMono, notificationsMono)
            .map(tuple -> {
                User user = tuple.getT1();
                List<Order> orders = tuple.getT2();
                List<Notification> notifications = tuple.getT3();
                
                return new DashboardResponse(user, orders, notifications);
            })
            .map(this::toJson);
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '18 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 111,
    title: 'Circuit Breaker with Resilience4j',
    slug: 'circuit-breaker',
    summary: 'Prevent cascade failures with fault tolerance patterns.',
    content: `<h2>Circuit Breaker Pattern</h2>
<p>The circuit breaker prevents cascade failures by failing fast when a service is struggling, giving it time to recover.</p>

<h3>The Problem: Cascade Failure</h3>
<pre>
Normal Flow:
Client → Service A → Service B → Service C
                   [Working fine]

Problem:
Client → Service A → Service B → Service C
                              [Slow/ Down]
                        [Timeout: 30s]
                   [Thread blocked]
                   [All threads blocked]
                   [Service A down]
                   [Client can't reach Service A]
                   [Entire system down]
</pre>

<h3>How Circuit Breaker Works</h3>

<h4>State Machine</h4>
<pre>
CLOSED (Normal) ──[failures > threshold]──→ OPEN (Failure)
    ↑                                      │
    │                               [timeout elapsed]
    │                                      ↓
    └──────[successes > threshold]── HALF-OPEN (Testing)
</pre>

<h4>1. CLOSED State</h4>
<pre>
All requests pass through
Failures are counted
If failures exceed threshold → OPEN
</pre>

<h4>2. OPEN State</h4>
<pre>
All requests fail immediately (fast failure)
No calls to failing service
After timeout → HALF-OPEN
</pre>

<h4>3. HALF-OPEN State</h4>
<pre>
Limited requests pass through (test the waters)
If successful → CLOSED
If failed → OPEN again
</pre>

<h3>Configuration Parameters</h3>
<table>
<tr><th>Parameter</th><th>Description</th><th>Typical Value</th></tr>
<tr><td>Failure rate threshold</td><td>% failures to trip</td><td>50%</td></tr>
<tr><td>Slow call rate threshold</td><td>% slow calls to trip</td><td>80%</td></tr>
<tr><td>Slow call duration</td><td>What counts as "slow"</td><td>2s</td></tr>
<tr><td>Wait duration in open</td><td>Time before half-open</td><td>60s</td></tr>
<tr><td>Permitted calls in half-open</td><td>Test requests</td><td>10</td></tr>
<tr><td>Sliding window size</td><td>How many calls to consider</td><td>100</td></tr>
<tr><td>Sliding window type</td><td>COUNT or TIME based</td><td>COUNT</td></tr>
</table>

<h3>Resilience4j vs Hystrix</h3>
<p>Hystrix is in maintenance mode (Netflix). <strong>Resilience4j</strong> is the modern choice for Java.</p>

<h4>Why Resilience4j?</h4>
<ul>
<li>Functional style (no annotations required)</li>
<li>Reactive support (RxJava, Reactor)</li>
<li>Lightweight (no Netflix dependencies)</li>
<li>Micrometer integration</li>
<li>Designed for Java 8+</li>
</ul>`,
    code_snippet: `// Resilience4j Circuit Breaker Configuration
@Configuration
public class ResilienceConfig {
    
    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        CircuitBreakerConfig defaultConfig = CircuitBreakerConfig.custom()
            .failureRateThreshold(50)                    // Trip at 50% failure
            .slowCallRateThreshold(80)                   // Trip at 80% slow calls
            .slowCallDurationThreshold(Duration.ofSeconds(2))  // >2s is slow
            .waitDurationInOpenState(Duration.ofSeconds(60))  // Stay open 60s
            .permittedNumberOfCallsInHalfOpenState(10)  // 10 test calls
            .slidingWindowType(SlidingWindowType.COUNT_BASED)
            .slidingWindowSize(100)                     // Consider last 100 calls
            .minimumNumberOfCalls(20)                   // Need 20 calls to calculate
            .recordExceptions(
                IOException.class,
                TimeoutException.class,
                CallNotPermittedException.class
            )
            .build();
        
        return CircuitBreakerRegistry.of(defaultConfig);
    }
    
    // Service-specific configs
    @Bean
    public CircuitBreaker paymentCircuitBreaker(
            CircuitBreakerRegistry registry) {
        
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
            .failureRateThreshold(30)    // More sensitive for payments
            .waitDurationInOpenState(Duration.ofSeconds(120))  // Longer recovery
            .slidingWindowSize(50)
            .build();
        
        return registry.circuitBreaker("paymentService", config);
    }
}

// Decorated Supplier Pattern
@Service
public class UserService {
    
    private final CircuitBreakerRegistry registry;
    private final UserClient userClient;
    private final UserRepository userRepository;
    
    public UserService(CircuitBreakerRegistry registry, 
            UserClient userClient, UserRepository userRepository) {
        this.registry = registry;
        this.userClient = userClient;
        this.userRepository = userRepository;
    }
    
    // Method 1: Decorate with circuit breaker
    public User getUserFromExternalService(Long userId) {
        CircuitBreaker circuitBreaker = registry.circuitBreaker("external-api");
        
        Supplier<User> decoratedSupplier = CircuitBreaker
            .decorateSupplier(circuitBreaker, () -> userClient.getUser(userId));
        
        Try<User> result = Try.ofSupplier(decoratedSupplier)
            .recover(throwable -> {
                // Fallback logic
                log.warn("External API failed, using local cache", throwable);
                return userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));
            });
        
        return result.get();
    }
    
    // Method 2: Using annotations
    @CircuitBreaker(name = "externalApi", fallbackMethod = "getUserFallback")
    public User getUserAnnotated(Long userId) {
        return userClient.getUser(userId);
    }
    
    // Fallback method must have same signature + Throwable parameter
    public User getUserAnnotatedFallback(Long userId, Throwable t) {
        log.warn("Circuit breaker triggered: {}", t.getMessage());
        return userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
    }
    
    // Method 3: Bulkhead isolation
    public CompletableFuture<User> getUserAsync(Long userId) {
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        Bulkhead bulkhead = BulkheadRegistry.ofDefaults()
            .bulkhead("userService");
        
        Supplier<User> decoratedSupplier = Bulkhead
            .decorateSupplier(bulkhead, () -> userClient.getUser(userId));
        
        return CompletableFuture.supplyAsync(decoratedSupplier, executor)
            .orTimeout(3, TimeUnit.SECONDS)
            .exceptionally(ex -> {
                log.error("Timeout or bulkhead limit reached", ex);
                throw new ServiceUnavailableException("Service busy, try later");
            });
    }
}

// Combining Circuit Breaker + Retry + Rate Limiter
@Service
public class PaymentService {
    
    public PaymentResult processPayment(PaymentRequest request) {
        CircuitBreaker circuitBreaker = circuitBreakerRegistry
            .circuitBreaker("paymentGateway");
        
        Retry retry = RetryRegistry.ofDefaults()
            .retry("paymentRetry");
        
        RateLimiter rateLimiter = RateLimiterRegistry.ofDefaults()
            .rateLimiter("paymentGateway");
        
        Supplier<PaymentResult> decoratedSupplier = Decorators
            .ofSupplier(() -> callPaymentGateway(request))
            .withCircuitBreaker(circuitBreaker)
            .withRetry(retry)
            .withRateLimiter(rateLimiter)
            .decorateSupplier();
        
        Try<PaymentResult> result = Try.ofSupplier(decoratedSupplier)
            .recover(throwable -> {
                if (throwable instanceof CallNotPermittedException) {
                    return PaymentResult.declined("Service temporarily unavailable");
                }
                return PaymentResult.declined("Payment processing failed");
            });
        
        return result.get();
    }
    
    private PaymentResult callPaymentGateway(PaymentRequest request) {
        // Actual API call
        return paymentGateway.charge(request);
    }
}

// Reactive Circuit Breaker
@Service
public class NotificationService {
    
    private final CircuitBreakerRegistry registry;
    
    public Mono<NotificationResult> sendNotification(
            NotificationRequest request) {
        
        CircuitBreaker circuitBreaker = registry.circuitBreaker("emailService");
        
        return Mono.fromCallable(() -> emailClient.send(request))
            .transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
            .timeout(Duration.ofSeconds(5))
            .onErrorResume(ex -> {
                if (ex instanceof CallNotPermittedException) {
                    return Mono.just(NotificationResult.queued(
                        "Service unavailable, will retry"));
                }
                return Mono.just(NotificationResult.failed(ex.getMessage()));
            });
    }
    
    // Flux with circuit breaker
    public Flux<OrderNotification> getOrderUpdates(Long orderId) {
        return webClient.get()
            .uri("/orders/{id}/updates", orderId)
            .retrieve()
            .bodyToFlux(OrderUpdateEvent.class)
            .transformDeferred(CircuitBreakerOperator.of(
                circuitBreakerRegistry.circuitBreaker("orderUpdates")))
            .map(this::toNotification);
    }
}

// Monitoring with Actuator + Micrometer
@Configuration
public class ActuatorConfig {
    
    @Bean
    public MeterRegistry meterRegistry() {
        return new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
    }
}

// Custom metrics
@Service
public class MonitoredUserService {
    
    private final MeterRegistry meterRegistry;
    private final CircuitBreaker circuitBreaker;
    
    public User getUser(Long userId) {
        Timer.Sample sample = Timer.start(meterRegistry);
        
        try {
            User user = userClient.getUser(userId);
            meterRegistry.counter("user.success").increment();
            return user;
        } catch (Exception e) {
            meterRegistry.counter("user.failure", "cause", 
                e.getClass().getSimpleName()).increment();
            throw e;
        } finally {
            sample.stop(Timer.builder("user.latency")
                .tag("circuit.state", circuitBreaker.getState().toString())
                .register(meterRegistry));
        }
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '16 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 112,
    title: 'CAP Theorem and Consistency Trade-offs',
    slug: 'cap-theorem',
    summary: 'Understanding consistency models in distributed systems.',
    content: `<h2>CAP Theorem - The Fundamental Trade-off</h2>
<p>Eric Brewer's theorem states: In a distributed system, you can guarantee at most 2 of 3 properties.</p>

<h3>The Three Properties</h3>

<h4>Consistency (C)</h4>
<p>All nodes see the same data at the same time. Every read receives the most recent write.</p>
<pre>
Write: x = 5
Read (any node): Must return 5
</pre>

<h4>Availability (A)</h4>
<p>Every request receives a response, even if it's not the most recent data.</p>
<pre>
Write: x = 5
Read (partitioned node): May return 4 or 5
</pre>

<h4>Partition Tolerance (P)</h4>
<p>The system continues to operate despite network partitions.</p>
<pre>
Network partition happens
System keeps working
Trade-off: C or A must be sacrificed
</pre>

<h3>The Trade-off</h3>
<pre>
Partition Occurs:
┌─────────────────────────────────────────────────┐
│  Node A ───────X───────── Node B                │
│   (x=5)      PARTITION     (x=4)                │
└─────────────────────────────────────────────────┘

CP Choice: Reject writes until partition heals
           → Node B returns error or old data
           
AP Choice: Accept writes on both sides
           → Node A can write x=5, Node B can write x=4
           → When partition heals, reconcile
</pre>

<h3>Why P is Not Optional</h3>
<p>Network partitions WILL happen. You must choose between C and A during partition.</p>
<ul>
<li><strong>Not</strong>: "Choose 2 of 3"</li>
<li><strong>Reality</strong>: P is required. Choose C or A during partition.</li>
</ul>

<h3>CP vs AP Systems</h3>

<h4>CP Systems (Consistency over Availability)</h4>
<ul>
<li><strong>MongoDB</strong>: Primary with synchronous replica</li>
<li><strong>HBase</strong>: ZooKeeper coordination</li>
<li><strong>Redis Cluster</strong>: Redis Sentinel</li>
<li><strong>Zookeeper</strong>: Consensus protocol</li>
</ul>
<pre>
Network partition → Primary unavailable → Writes rejected
→ All clients see consistent data
→ But some requests fail
</pre>

<h4>AP Systems (Availability over Consistency)</h4>
<ul>
<li><strong>Cassandra</strong>: Tunable consistency</li>
<li><strong>DynamoDB</strong>: Eventual consistency by default</li>
<li><strong>Riak</strong>: Always available</li>
<li><strong>Amazon S3</strong>: Highly available storage</li>
</ul>
<pre>
Network partition → All nodes accept writes
→ All clients get responses
→ But data may be inconsistent
</pre>

<h3>PACELC Model</h3>
<p>When there are NO partitions, choose between Latency and Consistency.</p>
<pre>
ELASTIC: If we want lower latency, we must accept weaker consistency
         Examples: Cassandra, DynamoDB

STRONG:  We choose consistency over latency
         Examples: PostgreSQL, HBase, Zookeeper
</pre>

<h3>Consistency Levels in Practice</h3>

<h4>Strong Consistency</h4>
<pre>
Read: Wait for majority of replicas to acknowledge write
Write: Leader + quorum replicas must confirm
Result: Linearizable - looks like single node
Cost: Higher latency
</pre>

<h4>Eventual Consistency</h4>
<pre>
Read: Any replica
Write: Any node, async replication
Result: Updates propagate eventually
Cost: Lower latency, stale reads possible
</pre>

<h4>Tunable Consistency (Cassandra)</h4>
<pre>
W + R > N  →  Strong consistency
Example: N=3, W=2, R=2 → 2+2 > 3, strong

W + R <= N  →  Eventual consistency  
Example: N=3, W=1, R=1 → 1+1 <= 3, eventual
</pre>

<h3>Making the Right Choice</h3>
<table>
<tr><th>Use Case</th><th>Model</th><th>Example</th></tr>
<tr><td>Financial transactions</td><td>Strong (CP)</td><td>PostgreSQL</td></tr>
<tr><td>User sessions</td><td>Eventually OK</td><td>Redis</td></tr>
<tr><td>Social media posts</td><td>Eventually OK</td><td>Cassandra</td></tr>
<tr><td>Inventory management</td><td>Strong (CP)</td><td>PostgreSQL</td></tr>
<tr><td>IoT sensor data</td><td>Eventually OK</td><td>TimescaleDB</td></tr>
<tr><td>Shopping cart</td><td>Eventually OK</td><td>DynamoDB</td></tr>
</table>`,
    code_snippet: `// PostgreSQL - Strong Consistency (CP)
@Service
public class AccountService {
    
    @Transactional  // Single node transaction
    public void transfer(Long fromAccountId, Long toAccountId, 
            BigDecimal amount) {
        
        Account from = accountRepository.findByIdForUpdate(fromAccountId)
            .orElseThrow(() -> new AccountNotFoundException(fromAccountId));
        Account to = accountRepository.findByIdForUpdate(toAccountId)
            .orElseThrow(() -> new AccountNotFoundException(toAccountId));
        
        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(fromAccountId);
        }
        
        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        
        accountRepository.save(from);
        accountRepository.save(to);
        
        // All or nothing - ACID guaranteed
    }
}

// Cassandra - Tunable Consistency
@Service
public class SocialMediaService {
    
    private final CqlSession session;
    
    // Write with tunable consistency
    public void postUpdate(String userId, PostUpdate post) {
        // Consistency level: LOCAL_QUORUM (2 of 3 in same DC)
        // This + LOCAL_ONE read = eventual consistency
        // This + LOCAL_QUORUM read = strong consistency
        session.execute(PreparedStatement.builder("""
            INSERT INTO posts (user_id, post_id, content, created_at)
            VALUES (?, ?, ?, ?)
            """)
            .setConsistencyLevel(ConsistencyLevel.LOCAL_QUORUM)
            .build()
            .bind(userId, UUID.randomUUID(), post.getContent(), 
                Instant.now())
        );
    }
    
    // Read with tunable consistency
    public List<Post> getUserPosts(String userId, int limit) {
        // Read with LOCAL_ONE - fast, may be stale
        ResultSet rs = session.execute(PreparedStatement.builder("""
            SELECT * FROM posts 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            """)
            .setConsistencyLevel(ConsistencyLevel.LOCAL_ONE)
            .build()
            .bind(userId, limit)
        );
        
        // Transform results
        return rs.all().stream()
            .map(this::toPost)
            .collect(Collectors.toList());
    }
    
    // Strong consistency read for critical operations
    public boolean hasUserLikedPost(String userId, UUID postId) {
        // LOCAL_QUORUM ensures we read latest data
        ResultSet rs = session.execute(PreparedStatement.builder("""
            SELECT COUNT(*) FROM likes 
            WHERE user_id = ? AND post_id = ?
            """)
            .setConsistencyLevel(ConsistencyLevel.LOCAL_QUORUM)
            .build()
            .bind(userId, postId)
        );
        
        return rs.one().getLong(0) > 0;
    }
}

// Redis - Eventual Consistency (AP)
@Service
public class SessionService {
    
    private final RedissonClient redisson;
    
    public void createSession(String sessionId, UserSession session) {
        RBucket<UserSession> bucket = redisson.getBucket(
            "session:" + sessionId);
        
        // Write to single master
        // Asynchronous replication to replicas
        // Best effort - may lose session during partition
        bucket.set(session, Duration.ofHours(24));
        
        // If you need stronger guarantees, use Redisson's
        // RedissonMapCache with write-behind to database
    }
}

// Hybrid Approach: Redis for sessions, PostgreSQL for source of truth
@Service
public class HybridSessionService {
    
    private final RedissonClient redisson;
    private final JdbcTemplate jdbcTemplate;
    
    public void createSession(String sessionId, UserSession session) {
        // 1. Write to Redis (fast)
        RBucket<UserSession> bucket = redisson.getBucket(
            "session:" + sessionId);
        bucket.set(session, Duration.ofHours(24));
        
        // 2. Async write to PostgreSQL (eventual)
        CompletableFuture.runAsync(() -> {
            try {
                jdbcTemplate.update("""
                    INSERT INTO sessions (session_id, user_id, created_at, expires_at)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT (session_id) DO UPDATE SET
                        user_id = EXCLUDED.user_id
                    """,
                    sessionId, session.getUserId(), 
                    Instant.now(), session.getExpiresAt()
                );
            } catch (Exception e) {
                log.error("Failed to persist session to DB", e);
                // Session exists in Redis - acceptable
            }
        });
    }
    
    public Optional<UserSession> getSession(String sessionId) {
        RBucket<UserSession> bucket = redisson.getBucket(
            "session:" + sessionId);
        UserSession session = bucket.get();
        
        if (session != null) {
            return Optional.of(session);
        }
        
        // Fallback to PostgreSQL (cache miss)
        // Rebuild cache from database
        UserSession fromDb = jdbcTemplate.queryForObject("""
            SELECT * FROM sessions WHERE session_id = ? 
            AND expires_at > ?
            """,
            sessionRowMapper,
            sessionId, Instant.now()
        );
        
        if (fromDb != null) {
            // Rebuild cache
            bucket.set(fromDb, Duration.ofHours(24));
            return Optional.of(fromDb);
        }
        
        return Optional.empty();
    }
}

// DynamoDB - Java SDK with consistency control
@Service
public class DynamoDBService {
    
    private final AmazonDynamoDB dynamoDB;
    
    public void putItemStronglyConsistent(String tableName, 
            Map<String, AttributeValue> item) {
        
        PutItemRequest request = PutItemRequest.builder()
            .tableName(tableName)
            .item(item)
            .returnConsumedCapacity(ReturnConsumedCapacity.TOTAL)
            .build();
        
        // Strongly consistent write - higher latency
        dynamoDB.putItem(request.toBuilder()
            .consistentRead(true)  // Actually for writes, this is the default
            .build());
    }
    
    public Map<String, AttributeValue> getItemEventuallyConsistent(
            String tableName, String key) {
        
        // Eventually consistent read - lower latency, may be stale
        GetItemRequest request = GetItemRequest.builder()
            .tableName(tableName)
            .key(key)
            .consistentRead(false)  // Default, faster
            .build();
        
        return dynamoDB.getItem(request).item();
    }
    
    public Map<String, AttributeValue> getItemStronglyConsistent(
            String tableName, String key) {
        
        // Strongly consistent read - waits for latest data
        GetItemRequest request = GetItemRequest.builder()
            .tableName(tableName)
            .key(key)
            .consistentRead(true)  // Guarantees latest write
            .build();
        
        return dynamoDB.getItem(request).item();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '16 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 113,
    title: 'Rate Limiting Algorithms',
    slug: 'rate-limiting',
    summary: 'Token bucket, sliding window, and distributed rate limiting in Java.',
    content: `<h2>Rate Limiting - Protect Your APIs</h2>
<p>Rate limiting prevents abuse, ensures fair usage, and protects against traffic spikes. Essential for any public API.</p>

<h3>Why Rate Limit?</h3>
<ul>
<li><strong>Prevent abuse</strong>: Stop malicious users from overwhelming your system</li>
<li><strong>Protect resources</strong>: Database connections, API quotas, costs</li>
<li><strong>Ensure fairness</strong>: Premium users get more than free tier</li>
<li><strong>Cost control</strong>: 3rd party API costs are per-call</li>
</ul>

<h3>Rate Limiting Algorithms</h3>

<h4>1. Fixed Window Counter</h4>
<pre>
Window: 1 minute
Counter: 45 requests

Request 46 → Check counter → Window expired? No → Increment → Allow
Request 1000 → Check counter → Window expired? Yes → Reset → Allow

Problems:
- Spike at window boundaries (45 + 45 = 90 requests in 2 seconds)
</pre>

<h4>2. Sliding Window Log</h4>
<pre>
Track timestamp of each request
Window: last 60 seconds
Current time: 12:00:45

Requests in window:
12:00:00, 12:00:15, 12:00:30, 12:00:35, 12:00:40, 12:00:43
(6 requests, limit is 10) → Allow

If request at 12:00:45 and window already has 10 → Reject
</pre>

<h4>3. Token Bucket</h4>
<pre>
Bucket capacity: 10 tokens
Refill rate: 1 token/second

Request arrives → Take token from bucket → If no token, reject
If bucket not full → Add tokens over time

Allows bursts (up to bucket capacity) without exceeding average rate
</pre>

<h4>4. Sliding Window Counter</h4>
<pre>
Divide window into sub-windows
Window: 1 minute, divided into 6 x 10-second segments

Current: [10s ago: 5] [20s: 3] [30s: 2] [40s: 1] [50s: 0] [now: ?]

Weighted calculation: More recent requests count more
Approximate sliding window with fixed storage
</pre>

<h3>Where to Implement</h3>

<h4>Client-Side</h4>
<pre>
Client SDK handles rate limiting
- Respects limits before sending
- Handles 429 responses gracefully
</pre>

<h4>API Gateway</h4>
<pre>
Centralized rate limiting at entry point
- Single place to configure
- Standard for all services
- May not work for internal services
</pre>

<h4>Application Level</h4>
<pre>
Per-service rate limiting
- More granular control
- Different limits per operation
- More complex to maintain
</pre>

<h3>Distributed Rate Limiting</h3>
<p>Challenge: Multiple servers need to share rate limit state.</p>

<h4>Redis-Based</h4>
<pre>
1. Check counter in Redis (atomic)
2. If under limit, increment and allow
3. If over limit, reject
4. Use Redis EXPIRE for window cleanup
</pre>

<h4>Challenges</h4>
<ul>
<li><strong>Race conditions</strong>: Use Redis INCR (atomic)</li>
<li><strong>Clock skew</strong>: Use Redis server time, not application time</li>
<li><strong>Network latency</strong>: Lua scripts for atomicity</li>
</ul>`,
    code_snippet: `// Token Bucket Implementation
public class TokenBucket {
    private final AtomicLong tokens;
    private final long maxTokens;
    private final long refillRate;  // tokens per second
    private final AtomicLong lastRefillTime;
    
    public TokenBucket(long maxTokens, long refillRate) {
        this.maxTokens = maxTokens;
        this.refillRate = refillRate;
        this.tokens = new AtomicLong(maxTokens);
        this.lastRefillTime = new AtomicLong(System.currentTimeMillis());
    }
    
    public synchronized boolean tryConsume() {
        refill();
        if (tokens.get() > 0) {
            tokens.decrementAndGet();
            return true;
        }
        return false;
    }
    
    public boolean tryConsume(int permits) {
        refill();
        while (tokens.get() >= permits) {
            long current = tokens.get();
            long newValue = current - permits;
            if (tokens.compareAndSet(current, newValue)) {
                return true;
            }
        }
        return false;
    }
    
    private void refill() {
        long now = System.currentTimeMillis();
        long lastRefill = lastRefillTime.get();
        long elapsed = now - lastRefill;
        
        if (elapsed > 0) {
            long tokensToAdd = (elapsed * refillRate) / 1000;
            if (tokensToAdd > 0) {
                tokens.updateAndGet(current -> 
                    Math.min(maxTokens, current + tokensToAdd)
                );
                lastRefillTime.set(now);
            }
        }
    }
    
    public long getAvailableTokens() {
        refill();
        return tokens.get();
    }
}

// Redis-based Distributed Rate Limiter
@Service
public class RedisRateLimiter {
    
    private final RedissonClient redisson;
    
    public RateLimitResult tryAcquire(String key, int limit, 
            Duration window) {
        
        RRateLimiter limiter = redisson.getRateLimiter(key);
        
        // Initialize if not exists
        if (!limiter.isExists()) {
            // RateLimiterType.OVERALL = global limit
            // RateLimiterType.PER_CLIENT = per client limit
            limiter.trySetRate(
                RateLimiterType.OVERALL,
                limit,
                window.toMillis(), 
                RateIntervalUnit.MILLISECONDS
            );
        }
        
        boolean acquired = limiter.tryAcquire();
        
        if (acquired) {
            return new RateLimitResult(true, limit - 1, 
                window.toMillis());
        } else {
            return new RateLimitResult(false, 0, 
                window.toMillis());
        }
    }
    
    // Sliding window with Lua script for atomicity
    public SlidingWindowResult tryAcquireSlidingWindow(
            String key, int limit, Duration window) {
        
        String script = """
            local key = KEYS[1]
            local now = tonumber(ARGV[1])
            local window = tonumber(ARGV[2])
            local limit = tonumber(ARGV[3])
            local windowStart = now - window
            
            -- Remove old entries
            redis.call('ZREMRANGEBYSCORE', key, 0, windowStart)
            
            -- Count current requests in window
            local current = redis.call('ZCARD', key)
            
            if current < limit then
                -- Add new request
                redis.call('ZADD', key, now, now .. '-' .. math.random())
                redis.call('EXPIRE', key, window / 1000)
                return {1, limit - current - 1, window}
            else
                return {0, 0, redis.call('TTL', key)}
            end
            """;
        
        Long now = System.currentTimeMillis();
        
        List<?> result = (List<?>) redisson.getScript(
            RedissonScript.returnTypeValues)
            .eval(script, 
                Collections.singletonList(key),
                now, window.toMillis(), limit
            );
        
        return new SlidingWindowResult(
            (Long) result.get(0) == 1,
            ((Long) result.get(1)).intValue(),
            ((Long) result.get(2)).intValue() * 1000
        );
    }
}

// Spring Cloud Gateway Rate Limiter
@Configuration
public class GatewayRateLimitConfig {
    
    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(1, 2);  // default redis limiter
    }
    
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            // Rate limit by authenticated user
            String userId = exchange.getRequest()
                .getHeaders().getFirst("X-User-Id");
            
            if (userId != null) {
                return Mono.just(userId);
            }
            
            // Fallback to IP
            return Mono.just(
                exchange.getRequest().getHeaders()
                    .getFirst(HttpHeaders.X_FORWARDED_FOR)
                    != null 
                    ? exchange.getRequest().getHeaders()
                        .getFirst(HttpHeaders.X_FORWARDED_FOR)
                    : Objects.requireNonNull(
                        exchange.getRequest().getRemoteAddress()
                      ).getAddress().getHostAddress()
            );
        };
    }
    
    @Bean
    public RouteLocator rateLimitedRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("api_route", r -> r
                .path("/api/**")
                .filters(f -> f
                    .requestRateLimiter(c -> c
                        .rateLimiter(RedisRateLimiter.class)
                        .keyResolver(userKeyResolver())
                        .setRateLimiterArgs(new Object[]{"args"})))
                .uri("http://backend-service"))
            .build();
    }
}

// Application-level rate limiting with Bucket4j
@Service
public class ApiService {
    
    private final Map<String, Bucket> userBuckets = new ConcurrentHashMap<>();
    
    private Bucket createBucket(int requests, Duration period) {
        return Bucket.builder()
            .addTokenBucket(TokenBucket.builder()
                .capacity(requests)
                .refillGreedy(requests, period)
                .build())
            .build();
    }
    
    public ApiResponse handleRequest(String userId, ApiRequest request) {
        Bucket bucket = userBuckets.computeIfAbsent(
            userId, 
            k -> createBucket(100, Duration.ofMinutes(1))
        );
        
        if (bucket.tryConsume()) {
            return processRequest(request);
        } else {
            throw new RateLimitExceededException(
                "Rate limit exceeded. Try again in a minute."
            );
        }
    }
    
    public BucketStatus getBucketStatus(String userId) {
        Bucket bucket = userBuckets.get(userId);
        if (bucket == null) {
            return new BucketStatus(100, 100, Duration.ZERO);
        }
        
        return new BucketStatus(
            bucket.getAvailableTokens(),
            100,
            Duration.ZERO
        );
    }
}

// Different limits for different tiers
@Service
public class TieredRateLimiter {
    
    private final Map<Plan, Bucket> buckets = new ConcurrentHashMap<>();
    
    public TieredRateLimiter() {
        buckets.put(Plan.FREE, createBucket(100, Duration.ofMinutes(1)));
        buckets.put(Plan.PRO, createBucket(1000, Duration.ofMinutes(1)));
        buckets.put(Plan.ENTERPRISE, createBucket(10000, Duration.ofMinutes(1)));
    }
    
    private Bucket createBucket(int limit, Duration period) {
        return Bucket.builder()
            .addTokenBucket(TokenBucket.builder()
                .capacity(limit)
                .refillGreedy(limit, period)
                .build())
            .addBandwidth(Bandwidth.builder()
                .capacity(10)  // Burst capacity
                .refillGreedy(10, Duration.ofSeconds(1))  // 10 per second burst
                .build())
            .build();
    }
    
    public boolean tryAcquire(User user, int permits) {
        Bucket bucket = buckets.getOrDefault(
            user.getPlan(), 
            buckets.get(Plan.FREE)
        );
        return bucket.tryConsume(permits);
    }
    
    public RateLimitInfo getRateLimitInfo(User user) {
        Bucket bucket = buckets.get(user.getPlan());
        return new RateLimitInfo(
            user.getPlan(),
            100,  // Hard limit
            bucket.getAvailableTokens(),
            "X-RateLimit-Limit",
            "X-RateLimit-Remaining"
        );
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '16 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
