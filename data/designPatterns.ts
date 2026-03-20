export const designPatternsPosts = [
  // ==================== CREATIONAL PATTERNS ====================
  {
    id: 1,
    title: 'Singleton Pattern - One Instance Only',
    slug: 'singleton-pattern',
    summary: 'Ensure a class has only one instance and provide a global point of access to it.',
    content: `<h2>What is Singleton Pattern?</h2>
<p>The Singleton pattern ensures that a class has <strong>only one instance</strong> and provides a global point of access to that instance. It's like having a single president of a country - no matter which department asks, they all get the same person.</p>

<h3>Problem It Solves</h3>
<p>Sometimes we need exactly one instance of a class:</p>
<ul>
<li>Database connections - multiple connections waste resources</li>
<li>Configuration managers - all parts of the app need the same settings</li>
<li>Logger instances -统一 logging across the application</li>
<li>Thread pools - limited number of threads shared globally</li>
</ul>

<h3>Real-World Analogy</h3>
<p>Think of a <strong>Government</strong> class. There can only be one government for a country. All ministries, departments, and citizens access the same government instance.</p>

<h3>Implementation Approaches</h3>

<h4>1. Eager Initialization</h4>
<p>Instance created at class loading time. Simple but wastes resources if never used.</p>

<h4>2. Lazy Initialization (Thread-Unsafe)</h4>
<p>Instance created only when requested. Fast but not thread-safe.</p>

<h4>3. Thread-Safe (Double-Checked Locking)</h4>
<p>Most popular approach. Checks if instance is null twice (inside and outside synchronized block) for performance.</p>

<h4>4. Bill Pugh Singleton (Initialization-on-demand holder)</h4>
<p>Uses inner static class. Instance created only when getInstance() is called, and is naturally thread-safe.</p>

<h3>When to Use</h3>
<ul>
<li>When exactly one object is needed to coordinate actions</li>
<li>When you need stricter control over global variables</li>
</ul>

<h3>When NOT to Use</h3>
<ul>
<li>When it introduces hidden dependencies between distant parts of code</li>
<li>When it makes unit testing difficult (global state)</li>
<li>When it creates God Objects that do too much</li>
</ul>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.lang.Runtime</code> - every Java application has a single Runtime instance</li>
<li><code>java.awt.Desktop.getDesktop()</code> - single desktop instance</li>
<li><code>Logger.getLogger(String name)</code> - caches logger instances</li>
</ul>

<h3>Pros</h3>
<ul>
<li>Controlled access to sole instance</li>
<li>Reduced namespace pollution</li>
<li>Permits refinement of operations and representation</li>
<li>Lazy initialization possible</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Violates Single Responsibility Principle (controls its creation AND its main function)</li>
<li>Can mask bad design (when objects know too much about each other)</li>
<li>Difficult to test due to global state</li>
<li>Requires special treatment in multithreaded environments</li>
</ul>

<h3>Related Patterns</h3>
<p>Often used with <strong>Factory Method</strong>, <strong>Facade</strong>, and <strong>Abstract Factory</strong>.</p>`,
    code_snippet: `// Thread-safe Singleton using Bill Pugh approach
public class President {
    // Private static holder class
    private static class PresidentHolder {
        private static final President INSTANCE = new President();
    }
    
    // Private constructor
    private President() {
        // Prevent reflection attack
        if (PresidentHolder.INSTANCE != null) {
            throw new IllegalStateException("Already instantiated");
        }
    }
    
    // Global access point
    public static President getInstance() {
        return PresidentHolder.INSTANCE;
    }
    
    public void giveSpeech() {
        System.out.println("Speaking as the President...");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        President p1 = President.getInstance();
        President p2 = President.getInstance();
        
        // Both refer to same instance
        System.out.println(p1 == p2); // true
        
        p1.giveSpeech();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 1,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Factory Method Pattern - Creating Objects Wisely',
    slug: 'factory-method-pattern',
    summary: 'Define an interface for creating objects but let subclasses decide which class to instantiate.',
    content: `<h2>What is Factory Method Pattern?</h2>
<p>The Factory Method pattern defines an interface for creating objects but lets <strong>subclasses decide</strong> which class to instantiate. It's like a pizza shop where you order "pizza" and the chef decides which type based on the order.</p>

<h3>The Problem It Solves</h3>
<p>You need to create objects without specifying their exact classes. Instead of saying <code>new WindowsButton()</code>, you say <code>createButton()</code> and let subclasses decide.</p>

<h3>Real-World Analogy</h3>
<p>Imagine a <strong>Document Editor</strong>. When you click "New", the editor doesn't create a specific document. It calls a factory method that subclasses override to create Word, PDF, or Excel documents.</p>

<h3>Structure</h3>
<ul>
<li><strong>Product</strong> - Interface for objects the factory creates</li>
<li><strong>ConcreteProduct</strong> - Implementation of the product</li>
<li><strong>Creator</strong> - Declares the factory method</li>
<li><strong>ConcreteCreator</strong> - Overrides factory method to return ConcreteProduct</li>
</ul>

<h3>Key Benefits</h3>
<ul>
<li><strong>Loose Coupling</strong> - Client code doesn't depend on concrete classes</li>
<li><strong>Single Responsibility</strong> - Object creation is in one place</li>
<li><strong>Open/Closed Principle</strong> - Add new products without breaking existing code</li>
</ul>

<h3>When to Use</h3>
<ul>
<li>When a class can't anticipate the type of objects it needs to create</li>
<li>When a class wants its subclasses to specify the objects it creates</li>
<li>When you want to delegate responsibility to helper subclasses</li>
</ul>

<h3>When NOT to Use</h3>
<ul>
<li>When there are only 2-3 product types (over-engineering)</li>
<li>When the product hierarchy is unlikely to change</li>
</ul>

<h3>Factory Method vs Abstract Factory</h3>
<table>
<tr><th>Factory Method</th><th>Abstract Factory</th></tr>
<tr><td>Uses inheritance</td><td>Uses composition</td></tr>
<tr><td>Creates one product</td><td>Creates families of products</td></tr>
<tr><td>Subclass decides product class</td><td>Factory instance decides product family</td></tr>
</table>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.util.Calendar.getInstance()</code></li>
<li><code>java.net.URLStreamHandlerFactory</code></li>
<li><code>java.nio.file.spi.FileSystemProvider</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Avoids tight coupling between creator and products</li>
<li>Single Responsibility - product creation in one place</li>
<li>Open/Closed - introduce new product types without breaking code</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Code may become more complicated with many subclasses</li>
<li>Requires a new subclass for each product type</li>
</ul>`,
    code_snippet: `// Product interface
public interface Button {
    void render();
    void onClick();
}

// Concrete Products
public class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering Windows-style button");
    }
    
    @Override
    public void onClick() {
        System.out.println("Windows click sound!");
    }
}

public class MacButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering Mac-style button");
    }
    
    @Override
    public void onClick() {
        System.out.println("Mac click sound!");
    }
}

// Abstract Creator
public abstract class Dialog {
    // Factory Method - subclasses decide which button to create
    public abstract Button createButton();
    
    public void render() {
        Button button = createButton();
        button.render();
    }
}

// Concrete Creators
public class WindowsDialog extends Dialog {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
}

public class MacDialog extends Dialog {
    @Override
    public Button createButton() {
        return new MacButton();
    }
}

// Client code
public class Application {
    public static void main(String[] args) {
        Dialog dialog = new WindowsDialog();
        dialog.render(); // Creates Windows button
        
        // Change to Mac without modifying Dialog class
        Dialog macDialog = new MacDialog();
        macDialog.render(); // Creates Mac button
    }
}`,
    author: 'Subrat Ojha',
    category_id: 1,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Abstract Factory Pattern - Family of Related Objects',
    slug: 'abstract-factory-pattern',
    summary: 'Create families of related objects without specifying concrete classes.',
    content: `<h2>What is Abstract Factory Pattern?</h2>
<p>Abstract Factory provides an interface for creating <strong>families of related objects</strong> without specifying their concrete classes. Think of it as a furniture store that sells matching furniture sets.</p>

<h3>The Problem It Solves</h3>
<p>You need to create families of related products that must be used together. You can't mix products from different families - a Modern sofa shouldn't be paired with a Victorian chair.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Furniture Store</strong>. Each style (Modern, Victorian, Art Deco) includes matching Sofa, Chair, and CoffeeTable. You buy complete sets to ensure consistency.</p>

<h3>Structure</h3>
<ul>
<li><strong>AbstractFactory</strong> - Interface for creating abstract products</li>
<li><strong>ConcreteFactory</strong> - Creates families of concrete products</li>
<li><strong>AbstractProduct</strong> - Interface for product types</li>
<li><strong>ConcreteProduct</strong> - Product implementation</li>
<li><strong>Client</strong> - Uses only abstract interfaces</li>
</ul>

<h3>When to Use</h3>
<ul>
<li>When a system should be independent of how its products are created</li>
<li>When you want to provide product classes without revealing their concrete implementations</li>
<li>When products from a factory must be used together</li>
<li>When you want to enforce constraints between products</li>
</ul>

<h3>Abstract Factory vs Factory Method</h3>
<table>
<tr><th>Factory Method</th><th>Abstract Factory</th></tr>
<tr><td>Creates one product</td><td>Creates families of products</td></tr>
<tr><td>Uses inheritance (subclass decides)</td><td>Uses composition (factory instance)</td></tr>
<tr><td>One factory method per product</td><td>One method per product type</td></tr>
</table>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.sql.DriverManager.getConnection()</code> - creates connection families</li>
<li><code>javax.xml.parsers.DocumentBuilderFactory.newInstance()</code></li>
<li><code>javax.crypto.Cipher.getInstance(algorithm)</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Ensures product compatibility within a family</li>
<li>Isolates concrete classes from client code</li>
<li>Easy to exchange product families</li>
<li>Promotes consistency among products</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Difficult to support new product types</li>
<li>Adding new products requires changing all factories</li>
<li>Can introduce many classes</li>
</ul>

<h3>Related Patterns</h3>
<p>Often uses <strong>Singleton</strong> for factories, combines with <strong>Factory Method</strong> for implementation.</p>`,
    code_snippet: `// Abstract Products
public interface Sofa {
    void sitOn();
}

public interface Chair {
    void sitOn();
}

public interface CoffeeTable {
    void placeOn();
}

// Modern Family
public class ModernSofa implements Sofa {
    public void sitOn() {
        System.out.println("Sitting on sleek modern sofa");
    }
}

public class ModernChair implements Chair {
    public void sitOn() {
        System.out.println("Sitting on minimal modern chair");
    }
}

public class ModernCoffeeTable implements CoffeeTable {
    public void placeOn() {
        System.out.println("Placing on glass modern table");
    }
}

// Victorian Family
public class VictorianSofa implements Sofa {
    public void sitOn() {
        System.out.println("Sitting on ornate Victorian sofa");
    }
}

public class VictorianChair implements Chair {
    public void sitOn() {
        System.out.println("Sitting on classic Victorian chair");
    }
}

public class VictorianCoffeeTable implements CoffeeTable {
    public void placeOn() {
        System.out.println("Placing on wooden Victorian table");
    }
}

// Abstract Factory
public interface FurnitureFactory {
    Sofa createSofa();
    Chair createChair();
    CoffeeTable createCoffeeTable();
}

// Concrete Factories
public class ModernFurnitureFactory implements FurnitureFactory {
    public Sofa createSofa() { return new ModernSofa(); }
    public Chair createChair() { return new ModernChair(); }
    public CoffeeTable createCoffeeTable() { return new ModernCoffeeTable(); }
}

public class VictorianFurnitureFactory implements FurnitureFactory {
    public Sofa createSofa() { return new VictorianSofa(); }
    public Chair createChair() { return new VictorianChair(); }
    public CoffeeTable createCoffeeTable() { return new VictorianCoffeeTable(); }
}

// Client code
public class Application {
    private FurnitureFactory factory;
    
    public Application(FurnitureFactory factory) {
        this.factory = factory;
    }
    
    public void furnish() {
        Sofa sofa = factory.createSofa();
        Chair chair = factory.createChair();
        sofa.sitOn();
        chair.sitOn();
    }
    
    public static void main(String[] args) {
        // All modern furniture
        Application modernApp = new Application(new ModernFurnitureFactory());
        modernApp.furnish();
        
        // All Victorian furniture  
        Application victorianApp = new Application(new VictorianFurnitureFactory());
        victorianApp.furnish();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 1,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Builder Pattern - Step-by-Step Construction',
    slug: 'builder-pattern',
    summary: 'Construct complex objects step by step, allowing different representations.',
    content: `<h2>What is Builder Pattern?</h2>
<p>Builder lets you construct complex objects <strong>step by step</strong>. It separates the construction of an object from its representation. Like ordering a burger - you choose each ingredient individually.</p>

<h3>The Problem It Solves</h3>
<p>Some objects require many parameters, some optional. Telescoping constructors and massive constructor parameter lists become unmanageable.</p>

<pre>
User user = new User("John", "john@email.com", true, 25, "NYC", null, null, null);
// What does each parameter mean?
</pre>

<h3>Real-World Analogy</h3>
<p>Building a <strong>House</strong>. You can build a simple wooden house or a luxurious mansion using the same construction process but with different materials. The director (engineer) manages the process, builders provide materials.</p>

<h3>When to Use</h3>
<ul>
<li>When construction requires multiple steps</li>
<li>When objects have many optional parameters</li>
<li>When you need different representations of the same construction</li>
<li>When immutable objects are required</li>
</ul>

<h3>Builder vs Other Patterns</h3>
<table>
<tr><th>Pattern</th><th>Use Case</th></tr>
<tr><td>Builder</td><td>Complex objects, many steps</td></tr>
<tr><td>Factory</td><td>Single product, simple creation</td></tr>
<tr><td>Prototype</td><td>Copying existing objects</td></tr>
</table>

<h3>Java Library Examples</h3>
<ul>
<li><code>StringBuilder</code> - builds strings step by step</li>
<li><code>StringBuffer</code> - thread-safe string builder</li>
<li><code>DocumentBuilder</code>, <code>SchemaBuilder</code></li>
<li><code>Mockito.mockBuilder()</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Construct objects step-by-step, defer steps, or run recursively</li>
<li>Reuse same construction code for various product representations</li>
<li>Single Responsibility - isolate complex construction code</li>
<li>Fine-grained control over the construction process</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Overall complexity increases (more classes)</li>
<li>Requires creating multiple new classes</li>
<li>Client must create a builder object</li>
</ul>

<h3>Related Patterns</h3>
<p>Often combined with <strong>Composite</strong> for building recursive structures. Can use <strong>Abstract Factory</strong> to build different families of products.</p>`,
    code_snippet: `// Product
public class House {
    private String foundation;
    private String structure;
    private String roof;
    private String interior;
    private String garden;
    private String pool;
    
    // Getters
    public String getFoundation() { return foundation; }
    public String getStructure() { return structure; }
    public String getRoof() { return roof; }
    public String getInterior() { return interior; }
    public String getGarden() { return garden; }
    public String getPool() { return pool; }
    
    @Override
    public String toString() {
        return "House{foundation=" + foundation + 
               ", structure=" + structure + 
               ", roof=" + roof + 
               ", interior=" + interior +
               ", garden=" + garden +
               ", pool=" + pool + "}";
    }
}

// Builder Interface
public interface HouseBuilder {
    void buildFoundation();
    void buildStructure();
    void buildRoof();
    void buildInterior();
    void buildGarden();
    void buildPool();
    House getResult();
}

// Concrete Builder - Simple House
public class SimpleHouseBuilder implements HouseBuilder {
    private House house = new House();
    
    public void buildFoundation() { house = new House(); house.hashCode(); }
    public void buildStructure() { }
    public void buildRoof() { }
    public void buildInterior() { }
    public void buildGarden() { }
    public void buildPool() { }
    
    public House getResult() { return house; }
}

// Builder implementation
public class HouseBuilderImpl implements HouseBuilder {
    private House house = new House();
    
    public void buildFoundation() { house.hashCode(); return this; }
    public HouseBuilderImpl foundation(String f) { return this; }
    public HouseBuilderImpl structure(String s) { return this; }
    public HouseBuilderImpl roof(String r) { return this; }
    public HouseBuilderImpl interior(String i) { return this; }
    public HouseBuilderImpl garden(String g) { house.hashCode(); return this; }
    public HouseBuilderImpl pool(String p) { house.hashCode(); return this; }
    public House getResult() { return new House(); }
    
    public static void main(String[] args) {
        // Fluent API
        House house = new HouseBuilderImpl()
            .foundation("Concrete")
            .structure("Brick")
            .roof("Tile")
            .interior("Modern")
            .garden("Large")
            .pool("Olympic")
            .getResult();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 1,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Prototype Pattern - Cloning Made Easy',
    slug: 'prototype-pattern',
    summary: 'Create new objects by copying existing ones without coupling to their classes.',
    content: `<h2>What is Prototype Pattern?</h2>
<p>Prototype lets you create new objects by <strong>cloning</strong> an existing object (the prototype). It's like photocopying a document - you get an exact copy without knowing how the original was made.</p>

<h3>The Problem It Solves</h3>
<p>Sometimes creating objects is expensive (database calls, network requests) but you need multiple similar objects. Instead of recreating from scratch, you clone a prototype.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Cookie Cutter</strong>. You make one master cookie shape (prototype), then use it to create identical cookies. Each cookie is a clone of the prototype.</p>

<h3>When to Use</h3>
<ul>
<li>When object creation is expensive (database, network)</li>
<li>When you want to avoid subclass explosion for factories</li>
<li>When objects have many configuration combinations</li>
<li>When you need to create copies of objects</li>
</ul>

<h3>Java's Built-in Support</h3>
<p>Java has <code>Cloneable</code> interface and <code>Object.clone()</code> method. However, clone() has limitations - it creates shallow copies.</p>

<h3>Shallow vs Deep Copy</h3>
<ul>
<li><strong>Shallow Copy</strong> - Copies fields as-is (references point to same objects)</li>
<li><strong>Deep Copy</strong> - Copies all referenced objects recursively</li>
</ul>

<h3>Cloneable Limitations</h3>
<ul>
<li>Creates shallow copies by default</li>
<li>Doesn't call constructors</li>
<li>Checked exception (CloneNotSupportedException)</li>
<li>Not recommended - better to use copy constructors or factories</li>
</ul>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.lang.Object#clone()</code></li>
<li><code>java.util.ArrayList#clone()</code></li>
<li><code>java.util.HashMap#clone()</code></li>
<li><code>java.sql.Date#clone()</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Clone objects without coupling to their concrete classes</li>
<li>Remove repeated initialization code</li>
<li>Produce complex objects more conveniently</li>
<li>Alternative to inheritance for presets</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Cloning complex objects with circular references is tricky</li>
<li>Deep copy implementation can be complex</li>
<li>clone() method has no constructor call</li>
</ul>`,
    code_snippet: `// Prototype Interface
public interface Cloneable<T> {
    T clone();
}

// Concrete Prototype
public class Sheep implements Cloneable<Sheep> {
    private String name;
    private String color;
    private int age;
    private Sheep friend; // Reference to another sheep
    
    public Sheep(String name, String color, int age) {
        this.name = name;
        this.color = color;
        this.age = age;
    }
    
    // Copy constructor (preferred over clone)
    public Sheep(Sheep other) {
        this.name = other.name;
        this.color = other.color;
        this.age = other.age;
        // Deep copy for references
        if (other.friend != null) {
            this.friend = new Sheep(other.friend);
        }
    }
    
    // Clone implementation
    @Override
    public Sheep clone() {
        try {
            Sheep cloned = (Sheep) super.clone();
            // Deep copy for mutable fields
            if (this.friend != null) {
                cloned.friend = this.friend.clone();
            }
            return cloned;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
    
    public void setName(String name) { this.name = name; }
    public void setFriend(Sheep friend) { this.friend = friend; }
    
    @Override
    public String toString() {
        return "Sheep{name='" + name + "', color='" + color + 
               "', age=" + age + 
               ", friend=" + (friend != null ? friend.name : "null") + "}";
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Sheep original = new Sheep("Dolly", "white", 5);
        Sheep friend = new Sheep("Shaun", "black", 3);
        original.setFriend(friend);
        
        // Clone (deep copy)
        Sheep clone = original.clone();
        
        System.out.println("Original: " + original);
        System.out.println("Clone: " + clone);
        
        // Modifying clone doesn't affect original
        clone.setName("Dolly2");
        System.out.println("\\nAfter modifying clone:");
        System.out.println("Original: " + original);
        System.out.println("Clone: " + clone);
    }
}`,
    author: 'Subrat Ojha',
    category_id: 1,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // ==================== STRUCTURAL PATTERNS ====================
  {
    id: 6,
    title: 'Adapter Pattern - Making Things Compatible',
    slug: 'adapter-pattern',
    summary: 'Convert the interface of a class into another interface clients expect.',
    content: `<h2>What is Adapter Pattern?</h2>
<p>Adapter allows incompatible interfaces to work together. It's like a <strong>power adapter</strong> that lets you plug a European device into an American socket.</p>

<h3>The Problem It Solves</h3>
<p>You have existing code with a specific interface, but you need to use it with code expecting a different interface. Rewriting the existing code would be expensive or impossible.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Memory Card Reader</strong>. Your computer has USB, but your camera uses SD card. The reader adapts the SD card to work with USB.</p>

<h3>Types of Adapters</h3>
<ul>
<li><strong>Class Adapter</strong> - Uses inheritance (extends adaptee). Can override adaptee's behavior.</li>
<li><strong>Object Adapter</strong> - Uses composition (contains adaptee). More flexible.</li>
</ul>

<h3>When to Use</h3>
<ul>
<li>When you want to use an existing class but its interface isn't compatible</li>
<li>When you want to create a reusable class that cooperates with unrelated classes</li>
<li>When you need to use several existing subclasses but can't modify them</li>
</ul>

<h3>Adapter vs Decorator vs Facade</h3>
<table>
<tr><th>Pattern</th><th>Purpose</th><th>Intent</th></tr>
<tr><td>Adapter</td><td>Make interfaces compatible</td><td>Convert interface</td></tr>
<tr><td>Decorator</td><td>Add behavior dynamically</td><td>Enhance interface</td></tr>
<tr><td>Facade</td><td>Simplify complex subsystem</td><td>Simplify interface</td></tr>
</table>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.util.Arrays#asList()</code> - adapts array to List</li>
<li><code>java.io.InputStreamReader(InputStream)</code> - adapts InputStream to Reader</li>
<li><code>java.util.Collections#enumeration()</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Single Responsibility - separate interface conversion from business logic</li>
<li>Open/Closed - introduce new adapters without changing existing code</li>
<li>Enables use of existing code with new interfaces</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Overall complexity increases</li>
<li>Sometimes easier to just change the service class</li>
<li>Can hide problems in the original code</li>
</ul>`,
    code_snippet: `// Target interface - what client expects
public interface MediaPlayer {
    void play(String filename);
}

// Adaptee - existing class with incompatible interface
public class AdvancedMediaPlayer {
    public void playMp4(String filename) {
        System.out.println("Playing MP4: " + filename);
    }
    
    public void playVlc(String filename) {
        System.out.println("Playing VLC: " + filename);
    }
    
    public void playWmv(String filename) {
        System.out.println("Playing WMV: " + filename);
    }
}

// Adapter - makes AdvancedMediaPlayer compatible with MediaPlayer
public class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;
    private String audioType;
    
    public MediaAdapter(String audioType) {
        this.audioType = audioType;
        this.advancedPlayer = new AdvancedMediaPlayer();
    }
    
    @Override
    public void play(String filename) {
        if (audioType.equalsIgnoreCase("mp4")) {
            advancedPlayer.playMp4(filename);
        } else if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer.playVlc(filename);
        } else if (audioType.equalsIgnoreCase("wmv")) {
            advancedPlayer.playWmv(filename);
        }
    }
}

// Client - uses MediaPlayer interface
public class AudioPlayer implements MediaPlayer {
    private MediaAdapter adapter;
    
    @Override
    public void play(String filename) {
        // Check file extension
        if (filename.endsWith(".mp3")) {
            System.out.println("Playing MP3 directly: " + filename);
        } else if (filename.endsWith(".mp4") || 
                   filename.endsWith(".vlc") || 
                   filename.endsWith(".wmv")) {
            // Use adapter for other formats
            String type = filename.substring(filename.lastIndexOf(".") + 1);
            adapter = new MediaAdapter(type);
            adapter.play(filename);
        } else {
            System.out.println("Invalid format. Supported: mp3, mp4, vlc, wmv");
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        AudioPlayer player = new AudioPlayer();
        
        player.play("song.mp3");        // Direct MP3
        player.play("movie.mp4");        // Via adapter
        player.play("video.vlc");       // Via adapter
        player.play("clip.wmv");        // Via adapter
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
    id: 7,
    title: 'Bridge Pattern - Decouple Abstraction from Implementation',
    slug: 'bridge-pattern',
    summary: 'Decouple an abstraction from its implementation so both can vary independently.',
    content: `<h2>What is Bridge Pattern?</h2>
<p>Bridge separates an <strong>abstraction</strong> from its <strong>implementation</strong> so both can change independently. Like remote controls (abstraction) working with TVs (implementation).</p>

<h3>The Problem It Solves</h3>
<p>Class explosion from two independent dimensions. For example: TV brands (Samsung, LG) × Remote types (Basic, Advanced) = 2 × 2 = 4 classes. Bridge reduces this to 2 + 2 = 4 classes but with better structure.</p>

<h3>Real-World Analogy</h3>
<p><strong>Remote Controls</strong> and <strong>Devices</strong>. A TV remote works with any TV brand. The remote's buttons (abstraction) don't care about the TV's internals (implementation).</p>

<h3>Structure</h3>
<ul>
<li><strong>Abstraction</strong> - Defines the abstraction's interface, maintains reference to implementor</li>
<li><strong>RefinedAbstraction</strong> - Extends the abstraction interface</li>
<li><strong>Implementor</strong> - Interface for implementation classes</li>
<li><strong>ConcreteImplementor</strong> - Implementation of the implementor</li>
</ul>

<h3>Bridge vs Adapter</h3>
<table>
<tr><th>Pattern</th><th>Purpose</th><th>When</th></tr>
<tr><td>Bridge</td><td>Design upfront</td><td>Anticipate evolving in two dimensions</td></tr>
<tr><td>Adapter</td><td>Retrofit</td><td>Making existing classes work together</td></tr>
</table>

<h3>When to Use</h3>
<ul>
<li>When you want to avoid permanent binding between abstraction and implementation</li>
<li>When both abstractions and implementations should be extensible</li>
<li>When changes in implementation shouldn't affect clients</li>
<li>When you have many classes proliferating from two independent dimensions</li>
</ul>

<h3>Java Library Examples</h3>
<ul>
<li><code>JDBC</code> - applications use JDBC API, drivers are implementations</li>
<li><code>java.util.List</code> and <code>ArrayList</code>, <code>LinkedList</code></li>
<li><code>java.util.Map</code> implementations</li>
</ul>

<h3>Pros</h3>
<ul>
<li>Platform-independent classes and apps</li>
<li>Client code works with high-level abstractions</li>
<li>Open/Closed - introduce new abstractions and implementations independently</li>
<li>Single Responsibility - focus on high-level logic vs platform details</li>
</ul>

<h3>Cons</h3>
<ul>
<li>More complex initial design</li>
<li>Requires understanding both dimensions</li>
<li>Two-tier structure increases complexity</li>
</ul>`,
    code_snippet: `// Implementation interface
public interface Device {
    boolean isEnabled();
    void enable();
    void disable();
    int getVolume();
    void setVolume(int percent);
    int getChannel();
    void setChannel(int channel);
}

// Concrete implementations
public class TV implements Device {
    private boolean on = false;
    private int volume = 30;
    private int channel = 1;
    
    public boolean isEnabled() { return on; }
    public void enable() { on = true; }
    public void disable() { on = false; }
    public int getVolume() { return volume; }
    public void setVolume(int percent) { this.volume = Math.max(0, Math.min(100, percent)); }
    public int getChannel() { return channel; }
    public void setChannel(int channel) { this.channel = Math.max(1, Math.min(100, channel)); }
}

public class Radio implements Device {
    private boolean on = false;
    private int volume = 20;
    private int frequency = 101; // FM frequency
    
    public boolean isEnabled() { return on; }
    public void enable() { on = true; }
    public void disable() { on = false; }
    public int getVolume() { return volume; }
    public void setVolume(int percent) { this.volume = Math.max(0, Math.min(100, percent)); }
    public int getChannel() { return frequency; }
    public void setChannel(int channel) { this.frequency = Math.max(88, Math.min(108, channel)); }
}

// Abstraction
public abstract class RemoteControl {
    protected Device device;
    
    public RemoteControl(Device device) {
        this.device = device;
    }
    
    public void togglePower() {
        if (device.isEnabled()) {
            device.disable();
        } else {
            device.enable();
        }
    }
    
    public void volumeUp() { device.setVolume(device.getVolume() + 10); }
    public void volumeDown() { device.setVolume(device.getVolume() - 10); }
    public void channelUp() { device.setChannel(device.getChannel() + 1); }
    public void channelDown() { device.setChannel(device.getChannel() - 1); }
}

// Refined abstraction
public class AdvancedRemote extends RemoteControl {
    public AdvancedRemote(Device device) { super(device); }
    
    public void mute() {
        device.setVolume(0);
        System.out.println("Muted");
    }
    
    public void setChannel(int channel) {
        device.setChannel(channel);
        System.out.println("Channel set to: " + channel);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // TV with advanced remote
        Device tv = new TV();
        RemoteControl remote = new AdvancedRemote(tv);
        
        remote.togglePower();  // Turn on
        remote.volumeUp();      // Volume 40
        remote.volumeUp();     // Volume 50
        ((AdvancedRemote)remote).mute(); // Mute
        
        // Radio with basic remote
        Device radio = new Radio();
        RemoteControl radioRemote = new RemoteControl(radio);
        radioRemote.togglePower();
        radioRemote.channelUp();
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
    id: 8,
    title: 'Composite Pattern - Tree Structures Made Simple',
    slug: 'composite-pattern',
    summary: 'Compose objects into tree structures to represent part-whole hierarchies.',
    content: `<h2>What is Composite Pattern?</h2>
<p>Composite lets you compose objects into <strong>tree structures</strong> and work with them uniformly. Individual objects and compositions are treated the same way.</p>

<h3>The Problem It Solves</h3>
<p>You need to work with tree structures where individual objects and groups should be treated identically. For example, a file system where files and folders should support the same operations.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>File System</strong>. Files and Folders look the same to users. You can have files inside folders, and folders inside other folders.</p>

<h3>Key Components</h3>
<ul>
<li><strong>Component</strong> - Common interface for all elements</li>
<li><strong>Leaf</strong> - Individual objects (File)</li>
<li><strong>Composite</strong> - Container objects (Folder)</li>
</ul>

<h3>When to Use</h3>
<ul>
<li>When you want to represent part-whole hierarchies</li>
<li>When you want clients to ignore the difference between compositions and individual objects</li>
<li>When you have a tree-like structure to manage</li>
</ul>

<h3>Structure</h3>
<pre>
Component (interface)
├── Leaf (File) - implements Component
└── Composite (Folder) - implements Component
    └── contains: Component[] children
</pre>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.awt.Component</code> - UI components can contain other components</li>
<li><code>javax.swing.JComponent</code></li>
<li><code>java.nio.file.Path</code> and file system</li>
</ul>

<h3>Pros</h3>
<ul>
<li>Work with complex tree structures more conveniently</li>
<li>Open/Closed - introduce new element types without breaking code</li>
<li>Uniform treatment of individual objects and compositions</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Difficult to provide common interface for varying functionality</li>
<li>Design can become overly general</li>
<li>May violate Interface Segregation Principle</li>
</ul>

<h3>Related Patterns</h3>
<p>Often combined with <strong>Iterator</strong> to traverse composites, with <strong>Visitor</strong> to perform operations, and with <strong>Decorator</strong> to add responsibilities.</p>`,
    code_snippet: `import java.util.ArrayList;
import java.util.List;

// Component interface
public interface FileSystemComponent {
    String getName();
    long getSize();
    default void print(String indent) {
        System.out.println(indent + getName() + " (" + getSize() + " KB)");
    }
    default boolean isDirectory() { return false; }
}

// Leaf - File
public class File implements FileSystemComponent {
    private String name;
    private long size;
    
    public File(String name, long size) {
        this.name = name;
        this.size = size;
    }
    
    public String getName() { return name; }
    public long getSize() { return size; }
}

// Composite - Folder
public class Folder implements FileSystemComponent {
    private String name;
    private List<FileSystemComponent> children = new ArrayList<>();
    
    public Folder(String name) { this.name = name; }
    
    public void add(FileSystemComponent component) {
        children.add(component);
    }
    
    public void remove(FileSystemComponent component) {
        children.remove(component);
    }
    
    public String getName() { return name; }
    
    // Size is sum of all children
    public long getSize() {
        return children.stream()
            .mapToLong(FileSystemComponent::getSize)
            .sum();
    }
    
    @Override
    public boolean isDirectory() { return true; }
    
    @Override
    public void print(String indent) {
        System.out.println(indent + "+ " + name + " (" + getSize() + " KB)");
        for (FileSystemComponent child : children) {
            child.print(indent + "  ");
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Build file system structure
        Folder root = new Folder("root");
        Folder documents = new Folder("documents");
        Folder pictures = new Folder("pictures");
        Folder music = new Folder("music");
        
        File resume = new File("resume.pdf", 150);
        File report = new File("report.docx", 500);
        File photo1 = new File("photo1.jpg", 2048);
        File photo2 = new File("photo2.png", 1536);
        File song1 = new File("song1.mp3", 4500);
        File song2 = new File("song2.flac", 28000);
        
        documents.add(resume);
        documents.add(report);
        pictures.add(photo1);
        pictures.add(photo2);
        music.add(song1);
        music.add(song2);
        
        root.add(documents);
        root.add(pictures);
        root.add(music);
        
        // Print entire structure
        root.print("");
        
        System.out.println("\\n=== Summary ===");
        System.out.println("Total size: " + root.getSize() + " KB");
        System.out.println("Documents: " + documents.getSize() + " KB");
        System.out.println("Pictures: " + pictures.getSize() + " KB");
        System.out.println("Music: " + music.getSize() + " KB");
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
    id: 9,
    title: 'Decorator Pattern - Add Features Dynamically',
    slug: 'decorator-pattern',
    summary: 'Attach additional responsibilities to objects dynamically without altering their class.',
    content: `<h2>What is Decorator Pattern?</h2>
<p>Decorator lets you add behavior to objects <strong>dynamically</strong> by wrapping them. Like adding toppings to a pizza - the base stays the same, but you can add extras.</p>

<h3>The Problem It Solves</h3>
<p>You need to add responsibilities to objects dynamically and transparently, without affecting other objects. Subclassing for every combination would create class explosions.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Coffee Shop</strong>. You start with plain coffee, then add milk, sugar, whipped cream - each addition wraps the previous drink.</p>

<pre>
Coffee → MilkDecorator → SugarDecorator → WhipDecorator
Price: $2.00 + $0.50 + $0.20 + $1.00 = $3.70
</pre>

<h3>Decorator vs Inheritance</h3>
<table>
<tr><th>Inheritance</th><th>Decorator</th></tr>
<tr><td>Static, compile-time</td><td>Dynamic, runtime</td></tr>
<tr><td>Creates new subclass</td><td>Wraps existing object</td></tr>
<tr><td>All features at once</td><td>Add features one by one</td></tr>
<tr><td>Class explosion</td><td>Fewer classes</td></tr>
</table>

<h3>When to Use</h3>
<ul>
<li>When you need to add responsibilities dynamically and transparently</li>
<li>When extension by subclassing is impractical</li>
<li>When you need to add responsibilities that can be withdrawn</li>
</ul>

<h3>Decorator vs Adapter</h3>
<table>
<tr><th>Pattern</th><th>Purpose</th></tr>
<tr><td>Decorator</td><td>Add behavior, same interface</td></tr>
<tr><td>Adapter</td><td>Change interface</td></tr>
</table>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.io</code> - BufferedInputStream decorates FileInputStream</li>
<li><code>java.util.Collections#checkedList()</code></li>
<li><code>java.servlet.http.HttpServletRequestWrapper</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>More flexibility than inheritance</li>
<li>Add or remove responsibilities at runtime</li>
<li>Combine several behaviors by wrapping in multiple decorators</li>
<li>Single Responsibility - divide monolithic class into smaller classes</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Hard to remove a specific wrapper from the stack</li>
<li>Order of decorators may matter</li>
<li>Initial configuration code can look ugly</li>
<li>Many small objects in the design</li>
</ul>`,
    code_snippet: `// Component interface
public interface Coffee {
    String getDescription();
    double getCost();
}

// Concrete Component
public class SimpleCoffee implements Coffee {
    public String getDescription() { return "Simple Coffee"; }
    public double getCost() { return 2.0; }
}

// Base Decorator
public abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }
    
    public String getDescription() { return decoratedCoffee.getDescription(); }
    public double getCost() { return decoratedCoffee.getCost(); }
}

// Concrete Decorators
public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) { super(coffee); }
    
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Milk";
    }
    
    public double getCost() {
        return decoratedCoffee.getCost() + 0.5;
    }
}

public class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) { super(coffee); }
    
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Sugar";
    }
    
    public double getCost() {
        return decoratedCoffee.getCost() + 0.2;
    }
}

public class WhipDecorator extends CoffeeDecorator {
    public WhipDecorator(Coffee coffee) { super(coffee); }
    
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Whipped Cream";
    }
    
    public double getCost() {
        return decoratedCoffee.getCost() + 1.0;
    }
}

public class CaramelDecorator extends CoffeeDecorator {
    public CaramelDecorator(Coffee coffee) { super(coffee); }
    
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Caramel";
    }
    
    public double getCost() {
        return decoratedCoffee.getCost() + 0.7;
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Simple coffee
        Coffee coffee = new SimpleCoffee();
        System.out.println(coffee.getDescription() + " = $" + coffee.getCost());
        
        // With milk
        coffee = new MilkDecorator(coffee);
        System.out.println(coffee.getDescription() + " = $" + coffee.getCost());
        
        // With milk and sugar
        coffee = new SugarDecorator(coffee);
        System.out.println(coffee.getDescription() + " = $" + coffee.getCost());
        
        // With everything
        Coffee fancyCoffee = new WhipDecorator(
            new CaramelDecorator(
                new MilkDecorator(
                    new SugarDecorator(
                        new SimpleCoffee()
                    )
                )
            )
        );
        System.out.println(fancyCoffee.getDescription() + " = $" + fancyCoffee.getCost());
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
    id: 10,
    title: 'Facade Pattern - Simplify Complex Systems',
    slug: 'facade-pattern',
    summary: 'Provide a simplified interface to a complex subsystem.',
    content: `<h2>What is Facade Pattern?</h2>
<p>Facade provides a simple interface to a <strong>complex subsystem</strong>. It's like the reception desk at a hotel - you talk to one person instead of managing all departments yourself.</p>

<h3>The Problem It Solves</h3>
<p>You have a complex system with many classes. Clients don't need all the complexity, and creating a simple interface makes the system more accessible.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Home Theater System</strong>. Instead of turning on TV, speakers, receiver, DVD player, and projector separately, you just press "Watch Movie" on one remote.</p>

<h3>When to Use</h3>
<ul>
<li>When you want to provide simple interface to a complex subsystem</li>
<li>When there are many dependencies between clients and implementation classes</li>
<li>When you want to layer your subsystem</li>
</ul>

<h3>Facade vs Adapter</h3>
<table>
<tr><th>Facade</th><th>Adapter</th></tr>
<tr><td>Simplifies interface</td><td>Converts interface</td></tr>
<tr><td>Works with complex systems</td><td>Works with single class</td></tr>
<tr><td>Makes things simpler</td><td>Makes things compatible</td></tr>
</table>

<h3>Structure</h3>
<pre>
Client → Facade → [Subsystem Classes]
          ↓
    Simple API
</pre>

<h3>Java Library Examples</h3>
<ul>
<li><code>java.lang.Class</code> - simplified reflection API</li>
<li><code>javax.faces.context.FacesContext</code></li>
<li><code>javax.servlet.http.HttpServlet</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Isolate code from subsystem complexity</li>
<li>Provide simple default view of the subsystem</li>
<li>Subsystem can evolve independently</li>
<li>Reduces dependencies on subsystem internals</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Facade can become a God Object coupled to all classes</li>
<li>May limit access to subsystem features that advanced users need</li>
</ul>

<h3>Related Patterns</h3>
<p>Often used with <strong>Singleton</strong> for facades. <strong>Mediator</strong> is similar but handles communication between objects rather than simplifying an interface.</p>`,
    code_snippet: `// Complex subsystem classes
public class Amplifier {
    public void on() { System.out.println("Amplifier ON"); }
    public void off() { System.out.println("Amplifier OFF"); }
    public void setSurround() { System.out.println("Surround sound mode"); }
    public void setVolume(int level) { System.out.println("Volume set to " + level); }
}

public class DvdPlayer {
    public void on() { System.out.println("DVD Player ON"); }
    public void off() { System.out.println("DVD Player OFF"); }
    public void play(String movie) { System.out.println("Playing: " + movie); }
    public void pause() { System.out.println("Paused"); }
    public void stop() { System.out.println("Stopped"); }
}

public class Projector {
    public void on() { System.out.println("Projector ON"); }
    public void off() { System.out.println("Projector OFF"); }
    public void wideScreenMode() { System.out.println("Widescreen mode"); }
}

public class Screen {
    public void up() { System.out.println("Screen UP"); }
    public void down() { System.out.println("Screen DOWN"); }
}

public class Lights {
    public void on() { System.out.println("Lights ON"); }
    public void off() { System.out.println("Lights OFF"); }
    public void dim(int level) { System.out.println("Lights at " + level + "%"); }
}

public class PopcornPopper {
    public void on() { System.out.println("Popcorn Popper ON"); }
    public void off() { System.out.println("Popcorn Popper OFF"); }
    public void pop() { System.out.println("Popping popcorn!"); }
}

// Facade
public class HomeTheaterFacade {
    private Amplifier amp;
    private DvdPlayer dvd;
    private Projector projector;
    private Screen screen;
    private Lights lights;
    private PopcornPopper popper;
    
    public HomeTheaterFacade(Amplifier amp, DvdPlayer dvd, Projector projector,
                            Screen screen, Lights lights, PopcornPopper popper) {
        this.amp = amp;
        this.dvd = dvd;
        this.projector = projector;
        this.screen = screen;
        this.lights = lights;
        this.popper = popper;
    }
    
    public void watchMovie(String movie) {
        System.out.println("\\n--- Setting up Movie ---");
        lights.dim(10);
        popper.on();
        popper.pop();
        screen.down();
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setSurround();
        amp.setVolume(5);
        dvd.on();
        dvd.play(movie);
        System.out.println("--- Movie Started! ---");
    }
    
    public void endMovie() {
        System.out.println("\\n--- Shutting Down Movie ---");
        dvd.stop();
        dvd.off();
        amp.off();
        projector.off();
        screen.up();
        lights.on();
        popper.off();
        System.out.println("--- Movie Over! ---");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Create subsystem components
        Amplifier amp = new Amplifier();
        DvdPlayer dvd = new DvdPlayer();
        Projector projector = new Projector();
        Screen screen = new Screen();
        Lights lights = new Lights();
        PopcornPopper popper = new PopcornPopper();
        
        // Create facade
        HomeTheaterFacade theater = new HomeTheaterFacade(
            amp, dvd, projector, screen, lights, popper);
        
        // Watch movie with one call!
        theater.watchMovie("Inception");
        theater.endMovie();
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
    id: 11,
    title: 'Flyweight Pattern - Share Common Data',
    slug: 'flyweight-pattern',
    summary: 'Use sharing to support large numbers of fine-grained objects efficiently.',
    content: `<h2>What is Flyweight Pattern?</h2>
<p>Flyweight minimizes memory by sharing <strong>common data</strong> among multiple objects. It's like a game with thousands of trees - instead of creating unique tree objects, share the tree type data.</p>

<h3>The Problem It Solves</h3>
<p>When you need to create thousands of similar objects, memory becomes an issue. Most data is the same (tree type) but some is unique (position).</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Forest of Trees</strong>. Instead of creating a unique object for each tree (thousands), share tree type data and only create unique positions.</p>

<h3>Key Concepts</h3>
<ul>
<li><strong>Intrinsic State</strong> - Shared, immutable data (tree type, color) stored in flyweight</li>
<li><strong>Extrinsic State</strong> - Unique data per instance (position, age) passed to methods</li>
</ul>

<h3>When to Use</h3>
<ul>
<li>When an application uses many objects</li>
<li>When storage costs are high</li>
<li>When most object data can be made extrinsic</li>
<li>When groups of objects can be replaced by shared objects</li>
</ul>

<h3>Structure</h3>
<pre>
FlyweightFactory → creates/manages flyweights
       ↓
   Flyweight (shared)
       ↓
Context → stores extrinsic state
</pre>

<h3>Java Examples</h3>
<ul>
<li><code>String</code> interning - same strings share memory</li>
<li><code>Integer.valueOf()</code> - caches values -128 to 127</li>
<li><code>java.awt.Font</code> - shared font objects</li>
</ul>

<h3>Pros</h3>
<ul>
<li>Save lots of RAM with many similar objects</li>
<li>Centralize state management</li>
<li>Improve performance significantly</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Trading RAM for CPU cycles</li>
<li>Code becomes more complicated</li>
<li>Must distinguish intrinsic vs extrinsic state</li>
</ul>`,
    code_snippet: `// Flyweight - shared intrinsic state
public class TreeType {
    private String name;
    private String color;
    private String texture;
    
    public TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }
    
    public void draw(int x, int y) {
        System.out.println("Drawing " + color + " " + name + 
                          " at (" + x + ", " + y + ")");
    }
    
    // Getters
    public String getName() { return name; }
    public String getColor() { return color; }
    public String getTexture() { return texture; }
}

// Flyweight Factory
import java.util.HashMap;
import java.util.Map;

public class TreeFactory {
    // Cache for tree types
    private static Map<String, TreeType> treeTypes = new HashMap<>();
    
    public static TreeType getTreeType(String name, String color, String texture) {
        String key = name + "_" + color + "_" + texture;
        
        // Return existing or create new
        if (!treeTypes.containsKey(key)) {
            System.out.println("Creating new TreeType: " + name);
            treeTypes.put(key, new TreeType(name, color, texture));
        }
        
        return treeTypes.get(key);
    }
    
    public static int getTypeCount() {
        return treeTypes.size();
    }
}

// Context - holds extrinsic state
public class Tree {
    private int x, y;
    private TreeType type; // Shared flyweight
    
    public Tree(int x, int y, TreeType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    
    public void draw() {
        type.draw(x, y);
    }
}

// Forest - contains many trees
import java.util.ArrayList;
import java.util.List;

public class Forest {
    private List<Tree> trees = new ArrayList<>();
    
    public void plantTree(int x, int y, String name, String color, String texture) {
        // Get shared TreeType
        TreeType type = TreeFactory.getTreeType(name, color, texture);
        Tree tree = new Tree(x, y, type);
        trees.add(tree);
    }
    
    public void draw() {
        for (Tree tree : trees) {
            tree.draw();
        }
    }
    
    public int getTreeCount() { return trees.size(); }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Forest forest = new Forest();
        
        // Plant 1000 trees but only 3 unique TreeTypes!
        for (int i = 0; i < 1000; i++) {
            if (i % 3 == 0) {
                forest.plantTree(i, i, "Oak", "Green", "oak.png");
            } else if (i % 3 == 1) {
                forest.plantTree(i, i, "Pine", "DarkGreen", "pine.png");
            } else {
                forest.plantTree(i, i, "Maple", "Red", "maple.png");
            }
        }
        
        System.out.println("\\n=== Results ===");
        System.out.println("Trees planted: " + forest.getTreeCount());
        System.out.println("Unique TreeTypes: " + TreeFactory.getTypeCount());
        System.out.println("Memory saved by sharing TreeTypes!");
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
    id: 12,
    title: 'Proxy Pattern - Control Access to Objects',
    slug: 'proxy-pattern',
    summary: 'Provide a surrogate or placeholder for another object to control access to it.',
    content: `<h2>What is Proxy Pattern?</h2>
<p>Proxy provides a <strong>placeholder</strong> for another object to control access to it. It's like a security guard controlling access to a building.</p>

<h3>The Problem It Solves</h3>
<p>You need to control access to an object. The proxy sits between the client and the real object, adding a layer of control.</p>

<h3>Types of Proxies</h3>
<ul>
<li><strong>Remote Proxy</strong> - Access objects on different machines</li>
<li><strong>Virtual Proxy</strong> - Lazy initialization for expensive objects</li>
<li><strong>Protection Proxy</strong> - Access control based on permissions</li>
<li><strong>Smart Proxy</strong> - Additional actions on access (logging, caching)</li>
</ul>

<h3>Real-World Analogy</h3>
<p>A <strong>Credit Card</strong> is a proxy for a bank account. It can be used for payments without directly accessing the account. It also adds security (limits, fraud detection).</p>

<h3>Proxy vs Decorator</h3>
<table>
<tr><th>Proxy</th><th>Decorator</th></tr>
<tr><td>Controls access</td><td>Adds behavior</td></tr>
<tr><td>Usually manages lifecycle</td><td>Usually shares lifecycle</td></tr>
<tr><td>Client may not know about proxy</td><td>Client explicitly wraps</td></tr>
</table>

<h3>When to Use</h3>
<ul>
<li>When you need lazy initialization (virtual proxy)</li>
<li>When you need access control (protection proxy)</li>
<li>When you need local execution of remote service (remote proxy)</li>
<li>When you need logging and caching (smart proxy)</li>
</ul>

<h3>Java Examples</h3>
<ul>
<li><code>java.lang.reflect.Proxy</code> - dynamic proxy</li>
<li><code>java.rmi.*</code> - remote proxies</li>
<li><code>javax.ejb.EJB</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Control service object without clients knowing</li>
<li>Manage lifecycle of service object</li>
<li>Works even if service object isn't available</li>
<li>Open/Closed - introduce new proxies without changing service</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Code may become complicated with many proxies</li>
<li>Response from service might get delayed</li>
</ul>`,
    code_snippet: `// Subject interface
public interface Image {
    void display();
    String getFileName();
}

// Real Subject - expensive to load
public class RealImage implements Image {
    private String filename;
    private boolean loaded = false;
    
    public RealImage(String filename) {
        this.filename = filename;
        // In real world, this might load large data
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("Loading high-resolution image: " + filename);
        loaded = true;
    }
    
    public void display() {
        if (!loaded) {
            loadFromDisk();
        }
        System.out.println("Displaying: " + filename);
    }
    
    public String getFileName() { return filename; }
}

// Virtual Proxy - lazy loading
public class ImageProxy implements Image {
    private RealImage realImage;
    private String filename;
    
    public ImageProxy(String filename) {
        this.filename = filename;
        System.out.println("Proxy created for: " + filename);
    }
    
    public void display() {
        // Load only when needed
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
    
    public String getFileName() { return filename; }
}

// Protection Proxy - access control
public class SecuredImage implements Image {
    private RealImage realImage;
    private String userRole;
    
    public SecuredImage(String filename, String userRole) {
        this.realImage = new RealImage(filename);
        this.userRole = userRole;
    }
    
    public void display() {
        if (hasAccess()) {
            realImage.display();
        } else {
            System.out.println("Access denied! You need '" + 
                              getRequiredRole() + "' role.");
        }
    }
    
    private boolean hasAccess() {
        return "ADMIN".equals(userRole) || "VIP".equals(userRole);
    }
    
    private String getRequiredRole() {
        return "ADMIN";
    }
    
    public String getFileName() { return filename; }
}

// Usage
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Virtual Proxy Demo ===");
        Image image1 = new ImageProxy("photo1.jpg");
        Image image2 = new ImageProxy("photo2.jpg");
        
        // Image not loaded yet!
        System.out.println("\\nProxy created, image not loaded...");
        System.out.println("Now displaying image1...");
        image1.display();
        
        System.out.println("\\nDisplaying image1 again (cached)...");
        image1.display();
        
        System.out.println("\\n=== Protection Proxy Demo ===");
        Image adminImage = new SecuredImage("secret.jpg", "ADMIN");
        Image userImage = new SecuredImage("secret.jpg", "USER");
        Image vipImage = new SecuredImage("secret.jpg", "VIP");
        
        adminImage.display(); // Works
        vipImage.display();   // Works
        userImage.display();  // Denied!
    }
}`,
    author: 'Subrat Ojha',
    category_id: 2,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // ==================== BEHAVIORAL PATTERNS ====================
  {
    id: 13,
    title: 'Chain of Responsibility - Pass Requests Along',
    slug: 'chain-of-responsibility-pattern',
    summary: 'Pass requests along a chain of handlers until one handles it.',
    content: `<h2>What is Chain of Responsibility?</h2>
<p>Chain of Responsibility passes requests along a <strong>chain of handlers</strong>. Each handler decides to process the request or pass it to the next one.</p>

<h3>The Problem It Solves</h3>
<p>You have a request that needs to be processed by one of several handlers. You don't know which handler should process it, and you want to decouple the sender from receivers.</p>

<h3>Real-World Analogy</h3>
<p><strong>Support Ticket System</strong>: Level 1 → Level 2 → Manager → Director. Each level handles what it can, escalates what it can't.</p>

<h3>When to Use</h3>
<ul>
<li>When more than one object may handle a request</li>
<li>When you want to decouple sender and receivers</li>
<li>When handlers should be determined dynamically</li>
</ul>

<h3>Key Components</h3>
<ul>
<li><strong>Handler</strong> - Interface for handling requests</li>
<li><strong>ConcreteHandler</strong> - Handles requests it can, passes others</li>
<li><strong>Client</strong> - Initiates the request to the first handler</li>
</ul>

<h3>Java Examples</h3>
<ul>
<li><code>javax.servlet.FilterChain</code></li>
<li><code>java.util.logging.Logger#log()</code></li>
<li>Event handling in UI frameworks</li>
</ul>

<h3>Pros</h3>
<ul>
<li>Control order of request handling</li>
<li>Single Responsibility - decouple sender and receiver</li>
<li>Open/Closed - introduce new handlers without breaking code</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Some requests may end up unhandled</li>
<li>Hard to observe and debug</li>
<li>May be hard to configure the chain</li>
</ul>`,
    code_snippet: `// Handler interface
public abstract class SupportHandler {
    protected SupportHandler nextHandler;
    
    public void setNextHandler(SupportHandler handler) {
        this.nextHandler = handler;
    }
    
    public abstract void handleRequest(SupportTicket ticket);
}

// Request
public class SupportTicket {
    private String issue;
    private int level; // 1-4
    private String requester;
    
    public SupportTicket(String issue, int level, String requester) {
        this.issue = issue;
        this.level = level;
        this.requester = requester;
    }
    
    public String getIssue() { return issue; }
    public int getLevel() { return level; }
    public String getRequester() { return requester; }
}

// Concrete handlers
public class Level1Support extends SupportHandler {
    private static final int MAX_LEVEL = 1;
    
    public void handleRequest(SupportTicket ticket) {
        if (ticket.getLevel() <= MAX_LEVEL) {
            System.out.println("[Level 1] Handling: " + ticket.getIssue());
            System.out.println("  By: " + ticket.getRequester());
            System.out.println("  Status: RESOLVED");
        } else if (nextHandler != null) {
            System.out.println("[Level 1] Escalating: " + ticket.getIssue());
            nextHandler.handleRequest(ticket);
        }
    }
}

public class Level2Support extends SupportHandler {
    private static final int MAX_LEVEL = 2;
    
    public void handleRequest(SupportTicket ticket) {
        if (ticket.getLevel() <= MAX_LEVEL) {
            System.out.println("[Level 2] Handling: " + ticket.getIssue());
            System.out.println("  Advanced investigation...");
            System.out.println("  Status: RESOLVED");
        } else if (nextHandler != null) {
            System.out.println("[Level 2] Escalating: " + ticket.getIssue());
            nextHandler.handleRequest(ticket);
        }
    }
}

public class Level3Support extends SupportHandler {
    private static final int MAX_LEVEL = 3;
    
    public void handleRequest(SupportTicket ticket) {
        if (ticket.getLevel() <= MAX_LEVEL) {
            System.out.println("[Level 3] Handling: " + ticket.getIssue());
            System.out.println("  Engineering team engaged...");
            System.out.println("  Status: RESOLVED");
        } else if (nextHandler != null) {
            System.out.println("[Level 3] Escalating: " + ticket.getIssue());
            nextHandler.handleRequest(ticket);
        }
    }
}

public class Manager extends SupportHandler {
    public void handleRequest(SupportTicket ticket) {
        System.out.println("[Manager] Handling: " + ticket.getIssue());
        System.out.println("  All hands on deck!");
        System.out.println("  Status: RESOLVED (CEO notified)");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Build the chain
        SupportHandler level1 = new Level1Support();
        SupportHandler level2 = new Level2Support();
        SupportHandler level3 = new Level3Support();
        SupportHandler manager = new Manager();
        
        level1.setNextHandler(level2);
        level2.setNextHandler(level3);
        level3.setNextHandler(manager);
        
        // Create tickets
        SupportTicket ticket1 = new SupportTicket("Password reset", 1, "Alice");
        SupportTicket ticket2 = new SupportTicket("Database access", 2, "Bob");
        SupportTicket ticket3 = new SupportTicket("Budget approval", 3, "Charlie");
        SupportTicket ticket4 = new SupportTicket("Company merger", 4, "CEO");
        
        // Process tickets
        System.out.println("=== Processing Ticket 1 ===");
        level1.handleRequest(ticket1);
        
        System.out.println("\\n=== Processing Ticket 2 ===");
        level1.handleRequest(ticket2);
        
        System.out.println("\\n=== Processing Ticket 3 ===");
        level1.handleRequest(ticket3);
        
        System.out.println("\\n=== Processing Ticket 4 ===");
        level1.handleRequest(ticket4);
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 14,
    title: 'Command Pattern - Encapsulate Operations',
    slug: 'command-pattern',
    summary: 'Encapsulate requests as objects, allowing parameterization and queuing.',
    content: `<h2>What is Command Pattern?</h2>
<p>Command encapsulates a request as an <strong>object</strong>. This lets you parameterize objects with operations, queue requests, and support undo.</p>

<h3>The Problem It Solves</h3>
<p>You want to decouple the object that invokes an operation from the one that performs it. You also want to support undo/redo and logging.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Restaurant Order</strong>. The waiter writes your order (Command) and gives it to the kitchen. The kitchen doesn't know who ordered - just executes commands.</p>

<h3>When to Use</h3>
<ul>
<li>When you want to parameterize objects with operations</li>
<li>When you want to queue, specify, and execute requests at different times</li>
<li>When you need undo/redo functionality</li>
<li>When you need logging of operations</li>
</ul>

<h3>Key Components</h3>
<ul>
<li><strong>Command</strong> - Interface for executing operation</li>
<li><strong>ConcreteCommand</strong> - Binds receiver to action</li>
<li><strong>Invoker</strong> - Asks command to execute request</li>
<li><strong>Receiver</strong> - Knows how to perform operations</li>
</ul>

<h3>Java Examples</h3>
<ul>
<li><code>java.lang.Runnable</code></li>
<li><code>javax.swing.Action</code></li>
<li><code>java.swing.undo.UndoableEdit</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Single Responsibility - decouple invocation from execution</li>
<li>Open/Closed - introduce new commands without changing existing code</li>
<li>Implement undo/redo and logging</li>
<li>Compose complex commands from simpler ones</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Code may become more complicated</li>
<li>Many command classes</li>
</ul>`,
    code_snippet: `// Command interface
public interface Command {
    void execute();
    void undo();
}

// Receiver
public class Light {
    private String location;
    private boolean isOn = false;
    private int brightness = 0;
    
    public Light(String location) {
        this.location = location;
    }
    
    public void on() {
        isOn = true;
        brightness = 100;
        System.out.println(location + " light is ON (brightness: " + brightness + "%)");
    }
    
    public void off() {
        isOn = false;
        brightness = 0;
        System.out.println(location + " light is OFF");
    }
    
    public void setBrightness(int level) {
        this.brightness = Math.max(0, Math.min(100, level));
        System.out.println(location + " brightness: " + brightness + "%");
    }
    
    public boolean isOn() { return isOn; }
    public int getBrightness() { return brightness; }
}

// Concrete Commands
public class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) { this.light = light; }
    
    public void execute() { light.on(); }
    public void undo() { light.off(); }
}

public class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) { this.light = light; }
    
    public void execute() { light.off(); }
    public void undo() { light.on(); }
}

public class LightDimCommand implements Command {
    private Light light;
    private int targetBrightness;
    private int previousBrightness;
    
    public LightDimCommand(Light light, int brightness) {
        this.light = light;
        this.targetBrightness = brightness;
    }
    
    public void execute() {
        previousBrightness = light.getBrightness();
        light.setBrightness(targetBrightness);
    }
    
    public void undo() {
        light.setBrightness(previousBrightness);
    }
}

// Invoker with undo support
public class RemoteControl {
    private Command[] onCommands;
    private Command[] offCommands;
    private Command lastCommand;
    
    public RemoteControl() {
        onCommands = new Command[7];
        offCommands = new Command[7];
    }
    
    public void setCommand(int slot, Command on, Command off) {
        onCommands[slot] = on;
        offCommands[slot] = off;
    }
    
    public void onButtonPressed(int slot) {
        if (onCommands[slot] != null) {
            onCommands[slot].execute();
            lastCommand = onCommands[slot];
        }
    }
    
    public void offButtonPressed(int slot) {
        if (offCommands[slot] != null) {
            offCommands[slot].execute();
            lastCommand = offCommands[slot];
        }
    }
    
    public void undoButtonPressed() {
        if (lastCommand != null) {
            System.out.println("Undoing...");
            lastCommand.undo();
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        RemoteControl remote = new RemoteControl();
        
        Light livingRoomLight = new Light("Living Room");
        Light kitchenLight = new Light("Kitchen");
        
        remote.setCommand(0, new LightOnCommand(livingRoomLight), 
                          new LightOffCommand(livingRoomLight));
        remote.setCommand(1, new LightOnCommand(kitchenLight), 
                          new LightOffCommand(kitchenLight));
        remote.setCommand(2, new LightDimCommand(livingRoomLight, 50), null);
        
        System.out.println("=== Testing Remote Control ===");
        remote.onButtonPressed(0);
        remote.onButtonPressed(1);
        
        System.out.println("\\n=== Dimming lights ===");
        remote.onButtonPressed(2);
        
        System.out.println("\\n=== Undo operations ===");
        remote.undoButtonPressed();
        remote.undoButtonPressed();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 15,
    title: 'Iterator Pattern - Traverse Collections',
    slug: 'iterator-pattern',
    summary: 'Provide a way to access elements of a collection sequentially without exposing structure.',
    content: `<h2>What is Iterator Pattern?</h2>
<p>Iterator provides a way to access elements of a collection <strong>sequentially</strong> without knowing its underlying structure.</p>

<h3>The Problem It Solves</h3>
<p>You want to traverse a collection without exposing its internal structure. Different collections (List, Tree, Graph) should provide the same traversal interface.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Music Playlist</strong>. You browse songs with next/previous buttons without knowing if it's a playlist, album, or queue.</p>

<h3>When to Use</h3>
<ul>
<li>When you want to access a collection's elements without knowing its structure</li>
<li>When you want to provide multiple traversal methods</li>
<li>When you want to support polymorphic iteration</li>
</ul>

<h3>Java Built-in Iterator</h3>
<p>Java has built-in Iterator support with <code>java.util.Iterator</code>, <code>java.lang.Iterable</code>, and enhanced for-loops.</p>

<h3>Key Methods</h3>
<ul>
<li><code>hasNext()</code> - Check if more elements</li>
<li><code>next()</code> - Get next element</li>
<li><code>remove()</code> - Optional: remove element</li>
</ul>

<h3>Java Examples</h3>
<ul>
<li><code>java.util.Iterator</code></li>
<li><code>java.util.ListIterator</code></li>
<li><code>java.util.Enumeration</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Single Responsibility - isolate traversal logic</li>
<li>Open/Closed - add new collections without changing code</li>
<li>Iterate in parallel if needed</li>
<li>Delay iteration until needed</li>
</ul>

<h3>Cons</h3>
<ul>
<li>May be overkill for simple collections</li>
<li>Less efficient than direct access for some cases</li>
</ul>`,
    code_snippet: `import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.ArrayList;
import java.util.List;

// Custom Iterator
public class AlphabetIterator implements Iterator<Character> {
    private char current = 'A';
    private char end = 'Z';
    
    public boolean hasNext() {
        return current <= end;
    }
    
    public Character next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        return current++;
    }
    
    public void reset() {
        current = 'A';
    }
}

// Generic Iterator Interface (simplified Java version)
public interface GenericIterator<T> {
    boolean hasNext();
    T next();
    void remove();
}

// Concrete Collection
public class CustomCollection<T> implements Iterable<T> {
    private List<T> items = new ArrayList<>();
    
    public void add(T item) {
        items.add(item);
    }
    
    public int size() {
        return items.size();
    }
    
    @Override
    public Iterator<T> iterator() {
        return items.iterator();
    }
    
    // Custom reverse iterator
    public Iterator<T> reverseIterator() {
        return new Iterator<T>() {
            private int index = items.size() - 1;
            
            public boolean hasNext() {
                return index >= 0;
            }
            
            public T next() {
                return items.get(index--);
            }
            
            public void remove() {
                throw new UnsupportedOperationException();
            }
        };
    }
}

// Tree Node for tree traversal
class TreeNode<T> {
    T value;
    TreeNode<T> left;
    TreeNode<T> right;
    
    public TreeNode(T value) {
        this.value = value;
    }
}

public class TreeIterator<T> implements Iterator<TreeNode<T>> {
    private Stack<TreeNode<T>> stack = new Stack<>();
    
    public TreeIterator(TreeNode<T> root) {
        if (root != null) {
            stack.push(root);
        }
    }
    
    public boolean hasNext() {
        return !stack.isEmpty();
    }
    
    public TreeNode<T> next() {
        TreeNode<T> node = stack.pop();
        if (node.right != null) stack.push(node.right);
        if (node.left != null) stack.push(node.left);
        return node;
    }
}

// Usage
import java.util.Stack;
public class Main {
    public static void main(String[] args) {
        // Using custom iterator
        System.out.println("=== Alphabet Iterator ===");
        Iterator<Character> alphaIter = new AlphabetIterator();
        while (alphaIter.hasNext()) {
            System.out.print(alphaIter.next() + " ");
            if (alphaIter.next() != null && alphaIter.hasNext()) {
                alphaIter.next();
            }
        }
        
        // Using Java's built-in iterator
        System.out.println("\\n\\n=== Custom Collection with Iterator ===");
        CustomCollection<String> names = new CustomCollection<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        
        for (String name : names) {
            System.out.println(name);
        }
        
        // Reverse iteration
        System.out.println("\\nReverse:");
        Iterator<String> revIter = names.reverseIterator();
        while (revIter.hasNext()) {
            System.out.println(revIter.next());
        }
        
        // Tree traversal
        System.out.println("\\n=== Tree Traversal ===");
        TreeNode<Integer> root = new TreeNode<>(1);
        root.left = new TreeNode<>(2);
        root.right = new TreeNode<>(3);
        root.left.left = new TreeNode<>(4);
        root.left.right = new TreeNode<>(5);
        
        Iterator<TreeNode<Integer>> treeIter = new TreeIterator<>(root);
        System.out.print("Pre-order: ");
        while (treeIter.hasNext()) {
            System.out.print(treeIter.next().value + " ");
        }
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 16,
    title: 'Mediator Pattern - Centralize Communication',
    slug: 'mediator-pattern',
    summary: 'Reduce chaotic dependencies by having objects communicate via a mediator.',
    content: `<h2>What is Mediator Pattern?</h2>
<p>Mediator defines an object that <strong>centralizes communication</strong> between objects. Instead of objects talking directly, they talk through the mediator.</p>

<h3>The Problem It Solves</h3>
<p>When many objects have complex relationships, changes in one affect many others. Direct communication creates tight coupling.</p>

<h3>Real-World Analogy</h3>
<p>An <strong>Air Traffic Control Tower</strong>. Planes don't talk to each other directly - they communicate through the tower to avoid collisions.</p>

<h3>When to Use</h3>
<ul>
<li>When a set of objects communicate in well-defined but complex ways</li>
<li>When reusing an object is difficult because it refers to many other objects</li>
<li>When a behavior distributed between classes should be customizable without subclassing</li>
</ul>

<h3>Mediator vs Observer</h3>
<table>
<tr><th>Mediator</th><th>Observer</th></tr>
<tr><td>Centralized communication</td><td>Decentralized notifications</td></tr>
<tr><td>Mediator knows all colleagues</td><td>Observers don't know each other</td></tr>
<tr><td>Tight coupling to mediator</td><td>Loose coupling</td></tr>
</table>

<h3>Java Examples</h3>
<ul>
<li><code>java.util.Timer</code></li>
<li><code>java.util.concurrent.Executor</code></li>
<li><code>javax.faces.lifecycle.LifeCycle</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Reduce coupling between objects</li>
<li>Centralize control logic</li>
<li>Simplify object relationships</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Mediator can become a God Object</li>
<li>Can increase complexity if overused</li>
</ul>`,
    code_snippet: `// Mediator interface
public interface ChatMediator {
    void sendMessage(String message, User sender);
    void addUser(User user);
}

// Colleague interface
abstract class User {
    protected String name;
    protected ChatMediator mediator;
    
    public User(String name, ChatMediator mediator) {
        this.name = name;
        this.mediator = mediator;
    }
    
    public abstract void receive(String message, User sender);
    public abstract void send(String message);
}

// Concrete Colleagues
public class ChatUser extends User {
    private boolean isOnline;
    
    public ChatUser(String name, ChatMediator mediator) {
        super(name, mediator);
        this.isOnline = true;
    }
    
    public void receive(String message, User sender) {
        if (isOnline) {
            System.out.println(name + " received from " + sender.name + ": " + message);
        }
    }
    
    public void send(String message) {
        System.out.println(name + " sending: " + message);
        mediator.sendMessage(message, this);
    }
    
    public void setOnline(boolean online) {
        this.isOnline = online;
    }
}

// Concrete Mediator
import java.util.ArrayList;
import java.util.List;

public class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();
    private List<String> messageHistory = new ArrayList<>();
    
    public void addUser(User user) {
        users.add(user);
        System.out.println(user.name + " joined the chat");
        notifyAllUsers(user.name + " has joined!");
    }
    
    public void removeUser(User user) {
        users.remove(user);
        System.out.println(user.name + " left the chat");
    }
    
    public void sendMessage(String message, User sender) {
        messageHistory.add(sender.name + ": " + message);
        // Broadcast to all users except sender
        for (User user : users) {
            if (user != sender) {
                user.receive(message, sender);
            }
        }
    }
    
    private void notifyAllUsers(String message) {
        System.out.println("[System] " + message);
    }
    
    public void showHistory() {
        System.out.println("\\n=== Chat History ===");
        for (String msg : messageHistory) {
            System.out.println(msg);
        }
    }
}

// Private message support
public class PrivateChatMediator extends ChatRoom {
    public void sendPrivateMessage(User from, User to, String message) {
        System.out.println("\\n[Private] " + from.name + " → " + to.name + ": " + message);
        to.receive("[PRIVATE] " + message, from);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        ChatMediator chatRoom = new ChatRoom();
        
        User alice = new ChatUser("Alice", chatRoom);
        User bob = new ChatUser("Bob", chatRoom);
        User charlie = new ChatUser("Charlie", chatRoom);
        
        chatRoom.addUser(alice);
        chatRoom.addUser(bob);
        chatRoom.addUser(charlie);
        
        System.out.println("");
        alice.send("Hello everyone!");
        System.out.println("");
        bob.send("Hi Alice!");
        System.out.println("");
        charlie.send("Welcome!");
        
        // Private message
        if (chatRoom instanceof PrivateChatMediator) {
            ((PrivateChatMediator) chatRoom).sendPrivateMessage(alice, bob, "Can we talk privately?");
        }
        
        ((ChatRoom) chatRoom).showHistory();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 17,
    title: 'Memento Pattern - Save and Restore State',
    slug: 'memento-pattern',
    summary: 'Capture and externalize an object\'s state for later restoration.',
    content: `<h2>What is Memento Pattern?</h2>
<p>Memento captures and stores an object's internal state so it can be <strong>restored later</strong> without violating encapsulation.</p>

<h3>The Problem It Solves</h3>
<p>You need to save the state of an object so you can restore it later, without exposing the object's internal structure.</p>

<h3>Real-World Analogy</h3>
<p><strong>Game Save System</strong>. You save your game progress (Memento), continue playing, then restore to that exact state if needed.</p>

<h3>When to Use</h3>
<ul>
<li>When you need to save and restore an object's state</li>
<li>When direct access to state would violate encapsulation</li>
<li>When you need undo functionality</li>
</ul>

<h3>Key Components</h3>
<ul>
<li><strong>Memento</strong> - Stores internal state</li>
<li><strong>Originator</strong> - Creates/restores memento</li>
<li><strong>Caretaker</strong> - Keeps the memento safe</li>
</ul>

<h3>Java Examples</h3>
<ul>
<li><code>java.util.Date</code></li>
<li><code>java.io.Serializable</code></li>
<li><code>java.util.GregorianCalendar</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Preserve encapsulation boundaries</li>
<li>Simplifies Originator code</li>
<li>Easy to implement undo/redo</li>
</ul>

<h3>Cons</h3>
<ul>
<li>May consume lots of RAM if mementos are created often</li>
<li>CareTaker must track originator's lifecycle</li>
<li>Dynamic languages can't easily guarantee memento state is protected</li>
</ul>`,
    code_snippet: `// Memento - stores internal state
public class GameMemento {
    private int level;
    private int health;
    private int score;
    private String location;
    
    public GameMemento(int level, int health, int score, String location) {
        this.level = level;
        this.health = health;
        this.score = score;
        this.location = location;
    }
    
    // Getters for state (typically package-private)
    int getLevel() { return level; }
    int getHealth() { return health; }
    int getScore() { return score; }
    String getLocation() { return location; }
}

// Originator - creates and restores mementos
public class Game {
    private int level;
    private int health;
    private int score;
    private String location;
    
    public Game() {
        this.level = 1;
        this.health = 100;
        this.score = 0;
        this.location = "Starting Area";
    }
    
    public void play() {
        System.out.println("Playing... Level: " + level);
        score += 100;
        health -= 10;
        level++;
        location = "Dungeon " + level;
        System.out.println("Current state - Level: " + level + 
                          ", Health: " + health + 
                          ", Score: " + score +
                          ", Location: " + location);
    }
    
    public void getHurt() {
        health -= 50;
        System.out.println("Ouch! Health: " + health);
    }
    
    // Save state
    public GameMemento save() {
        System.out.println("Saving game...");
        return new GameMemento(level, health, score, location);
    }
    
    // Restore state
    public void restore(GameMemento memento) {
        this.level = memento.getLevel();
        this.health = memento.getHealth();
        this.score = memento.getScore();
        this.location = memento.getLocation();
        System.out.println("Game restored - Level: " + level + 
                          ", Health: " + health + 
                          ", Score: " + score +
                          ", Location: " + location);
    }
}

// Caretaker - keeps mementos
import java.util.Stack;

public class SaveManager {
    private Stack<GameMemento> saves = new Stack<>();
    private Game game;
    
    public SaveManager(Game game) {
        this.game = game;
    }
    
    public void saveGame() {
        saves.push(game.save());
    }
    
    public boolean loadGame() {
        if (!saves.isEmpty()) {
            game.restore(saves.peek());
            return true;
        }
        return false;
    }
    
    public boolean loadGame(int slot) {
        // In real world, you'd load from disk
        System.out.println("Loading from slot " + slot + "...");
        return false; // Simplified
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Game game = new Game();
        SaveManager saveManager = new SaveManager(game);
        
        // Play for a bit
        game.play();
        saveManager.saveGame();
        
        // Play more
        game.play();
        game.play();
        game.getHurt();
        game.play();
        
        System.out.println("\\n--- Oops, that was dangerous! Loading save ---");
        saveManager.loadGame();
        
        System.out.println("\\n--- Continue playing ---");
        game.play();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 18,
    title: 'Observer Pattern - Notify Changes',
    slug: 'observer-pattern',
    summary: 'Define a subscription mechanism to notify multiple objects about events.',
    content: `<h2>What is Observer Pattern?</h2>
<p>Observer defines a <strong>subscription mechanism</strong> to notify multiple objects about events in the subject they are observing.</p>

<h3>The Problem It Solves</h3>
<p>One object (Subject) needs to notify many other objects (Observers) when its state changes, without tight coupling.</p>

<h3>Real-World Analogy</h3>
<p><strong>YouTube Subscription</strong>. When a channel uploads new content, all subscribers get notified. You can subscribe/unsubscribe anytime.</p>

<h3>When to Use</h3>
<ul>
<li>When changes in one object require changing others, and you don't know how many</li>
<li>When an object should notify other objects without making assumptions about who they are</li>
</ul>

<h3>Java Built-in Support</h3>
<ul>
<li><code>java.util.Observable</code> / <code>java.util.Observer</code> (deprecated in Java 9)</li>
<li><code>java.beans.PropertyChangeListener</code></li>
<li><code>java.util.EventListener</code></li>
</ul>

<h3>Also Known As</h3>
<ul>
<li>Pub/Sub (Publish-Subscribe)</li>
<li>Event-Listener</li>
<li>Dependents</li>
</ul>

<h3>Observer vs Mediator</h3>
<table>
<tr><th>Observer</th><th>Mediator</th></tr>
<tr><td>Decentralized</td><td>Centralized</td></tr>
<tr><td>Observers don't know each other</td><td>Mediator knows all</td></tr>
<tr><td>Subject knows observers</td><td>Colleagues don't know each other</td></tr>
</table>

<h3>Pros</h3>
<ul>
<li>Open/Closed - introduce new subscribers without changing publisher</li>
<li>Establish relations at runtime</li>
<li>Loose coupling between subject and observers</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Subscribers notified in unpredictable order</li>
<li>Memory leaks if observers aren't properly removed</li>
<li>Can cause cascade of updates</li>
</ul>`,
    code_snippet: `import java.util.*;
import java.util.function.Consumer;

// Observer interface (Java 8+ style)
@FunctionalInterface
public interface Observer<T> {
    void update(T data);
}

// Subject interface
public class Subject<T> {
    private List<Observer<T>> observers = new ArrayList<>();
    private T state;
    
    public void attach(Observer<T> observer) {
        observers.add(observer);
    }
    
    public void detach(Observer<T> observer) {
        observers.remove(observer);
    }
    
    public void notifyAll() {
        for (Observer<T> observer : observers) {
            observer.update(state);
        }
    }
    
    public void setState(T state) {
        this.state = state;
        notifyAll();
    }
    
    public T getState() { return state; }
}

// Concrete Subject - Stock Price
public class Stock extends Subject<Double> {
    private String symbol;
    private double price;
    
    public Stock(String symbol, double price) {
        this.symbol = symbol;
        this.price = price;
        setState(price);
    }
    
    public void setPrice(double newPrice) {
        if (newPrice != this.price) {
            System.out.println("Stock " + symbol + " updated: $" + newPrice);
            this.price = newPrice;
            setState(newPrice);
        }
    }
    
    public double getPrice() { return price; }
    public String getSymbol() { return symbol; }
}

// Concrete Observers
public class MobileApp implements Observer<Double> {
    private String name;
    
    public MobileApp(String name) { this.name = name; }
    
    public void update(Double price) {
        System.out.println("[" + name + "] Mobile Alert: Price changed to $" + price);
    }
}

public class WebDashboard implements Observer<Double> {
    public void update(Double price) {
        System.out.println("[Dashboard] Web updating: $" + price);
    }
}

public class EmailAlert implements Observer<Double> {
    private double threshold;
    
    public EmailAlert(double threshold) {
        this.threshold = threshold;
    }
    
    public void update(Double price) {
        if (price < threshold) {
            System.out.println("[Email] ALERT: Price dropped below $" + threshold);
        }
    }
}

// Using Java's Observable (deprecated but shows pattern)
import java.util.Observable;

public class StockObservable extends Observable {
    private String symbol;
    private double price;
    
    public StockObservable(String symbol, double price) {
        this.symbol = symbol;
        this.price = price;
    }
    
    public void setPrice(double newPrice) {
        this.price = newPrice;
        setChanged();
        notifyObservers(newPrice);
    }
    
    public double getPrice() { return price; }
    public String getSymbol() { return symbol; }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Using custom Observer pattern
        System.out.println("=== Custom Observer Pattern ===");
        Stock appleStock = new Stock("AAPL", 150.00);
        
        MobileApp mobileApp = new MobileApp("iPhone");
        WebDashboard dashboard = new WebDashboard();
        EmailAlert alert = new EmailAlert(145.00);
        
        appleStock.attach(mobileApp);
        appleStock.attach(dashboard);
        appleStock.attach(alert);
        
        appleStock.setPrice(155.50);
        appleStock.setPrice(160.00);
        appleStock.setPrice(140.00); // Triggers alert
        
        appleStock.detach(dashboard);
        System.out.println("\\n--- Dashboard detached ---");
        appleStock.setPrice(165.00);
        
        // Using Lambda (Java 8+)
        System.out.println("\\n=== Using Lambda ===");
        Subject<String> newsFeed = new Subject<>();
        
        newsFeed.attach(price -> System.out.println("Lambda 1: " + price));
        newsFeed.attach(price -> System.out.println("Lambda 2: " + price));
        
        newsFeed.setState("Breaking: Design Patterns are awesome!");
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 19,
    title: 'State Pattern - Change Behavior Based on State',
    slug: 'state-pattern',
    summary: 'Allow an object to alter its behavior when its internal state changes.',
    content: `<h2>What is State Pattern?</h2>
<p>State allows an object to <strong>change its behavior</strong> when its internal state changes. The object will appear to change its class.</p>

<h3>The Problem It Solves</h3>
<p>Objects have behavior that depends heavily on their current state, and they must change behavior at runtime based on that state.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Vending Machine</strong>. Depending on its state (no money, has money, dispensing, sold out), pressing the button does different things.</p>

<h3>State vs Strategy</h3>
<table>
<tr><th>State</th><th>Strategy</th></tr>
<tr><td>State is part of the object</td><td>Strategy is injected</td></tr>
<tr><td>Clients may not know states exist</td><td>Client explicitly chooses algorithm</td></tr>
<tr><td>States know about each other</td><td>Strategies are independent</td></tr>
</table>

<h3>When to Use</h3>
<ul>
<li>When behavior depends on state and must change at runtime</li>
<li>When operations have large conditional statements depending on state</li>
<li>When you have similar states with different behavior</li>
</ul>

<h3>Structure</h3>
<pre>
Context → State (interface)
    ↓         ↓
  current ← ConcreteStateA, ConcreteStateB, ...
  behavior   each knows when to transition
</pre>

<h3>Pros</h3>
<ul>
<li>Simplify code by eliminating large conditionals</li>
<li>Make state transitions explicit</li>
<li>Open/Closed - introduce new states without changing existing code</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Can introduce many state classes</li>
<li>Can be overkill for simple state machines</li>
</ul>`,
    code_snippet: `// State interface
public interface State {
    void insertCoin(int amount);
    void pressButton();
    void dispense();
}

// Context
public class VendingMachine {
    private State noCoinState;
    private State hasCoinState;
    private State soldState;
    private State soldOutState;
    
    private State currentState;
    private int coinAmount = 0;
    private int inventory = 5;
    
    public VendingMachine() {
        noCoinState = new NoCoinState(this);
        hasCoinState = new HasCoinState(this);
        soldState = new SoldState(this);
        soldOutState = new SoldOutState(this);
        
        currentState = noCoinState;
    }
    
    // State transitions
    public void setState(State state) {
        this.currentState = state;
    }
    
    public State getNoCoinState() { return noCoinState; }
    public State getHasCoinState() { return hasCoinState; }
    public State getSoldOutState() { return soldOutState; }
    
    public void addCoin(int amount) { coinAmount += amount; }
    public int getCoinAmount() { return coinAmount; }
    public void resetCoin() { coinAmount = 0; }
    public void reduceInventory() { inventory--; }
    public int getInventory() { return inventory; }
    
    // Delegated actions
    public void insertCoin(int amount) { currentState.insertCoin(amount); }
    public void pressButton() { currentState.pressButton(); }
    public void dispense() { currentState.dispense(); }
}

// Concrete States
public class NoCoinState implements State {
    private VendingMachine vm;
    
    public NoCoinState(VendingMachine vm) { this.vm = vm; }
    
    public void insertCoin(int amount) {
        vm.addCoin(amount);
        vm.setState(vm.getHasCoinState());
        System.out.println("Coin inserted. Total: $" + vm.getCoinAmount());
    }
    
    public void pressButton() {
        System.out.println("Please insert a coin first!");
    }
    
    public void dispense() {
        System.out.println("Pay first!");
    }
}

public class HasCoinState implements State {
    private VendingMachine vm;
    
    public HasCoinState(VendingMachine vm) { this.vm = vm; }
    
    public void insertCoin(int amount) {
        vm.addCoin(amount);
        System.out.println("Added coin. Total: $" + vm.getCoinAmount());
    }
    
    public void pressButton() {
        if (vm.getInventory() > 0) {
            System.out.println("Dispensing item...");
            vm.setState(new SoldState(vm));
            vm.dispense();
        } else {
            System.out.println("Sold out! Refund: $" + vm.getCoinAmount());
            vm.resetCoin();
            vm.setState(vm.getSoldOutState());
        }
    }
    
    public void dispense() {
        System.out.println("Press button first!");
    }
}

public class SoldState implements State {
    private VendingMachine vm;
    
    public SoldState(VendingMachine vm) { this.vm = vm; }
    
    public void insertCoin(int amount) {
        System.out.println("Please wait! Dispensing current item...");
    }
    
    public void pressButton() {
        System.out.println("Already dispensing!");
    }
    
    public void dispense() {
        vm.reduceInventory();
        vm.resetCoin();
        System.out.println("Item dispensed! Enjoy!");
        vm.setState(vm.getNoCoinState());
    }
}

public class SoldOutState implements State {
    private VendingMachine vm;
    
    public SoldOutState(VendingMachine vm) { this.vm = vm; }
    
    public void insertCoin(int amount) {
        System.out.println("No items available! Refunding: $" + amount);
    }
    
    public void pressButton() {
        System.out.println("No items in stock!");
    }
    
    public void dispense() {
        System.out.println("Nothing to dispense!");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        VendingMachine vm = new VendingMachine();
        
        System.out.println("=== State Pattern Demo ===");
        System.out.println("Inventory: " + vm.getInventory());
        
        System.out.println("\\n--- Attempt 1: Press without coin ---");
        vm.pressButton();
        
        System.out.println("\\n--- Attempt 2: Insert coin and buy ---");
        vm.insertCoin(10);
        vm.pressButton();
        
        System.out.println("\\n--- Attempt 3: Multiple coins and buy ---");
        vm.insertCoin(5);
        vm.insertCoin(5);
        vm.pressButton();
        
        System.out.println("\\n--- Attempt 4: Buy all remaining ---");
        vm.insertCoin(10);
        vm.pressButton();
        vm.insertCoin(10);
        vm.pressButton();
        vm.insertCoin(10);
        vm.pressButton();
        
        System.out.println("\\n--- Attempt 5: Buy when sold out ---");
        vm.insertCoin(10);
        vm.pressButton();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 20,
    title: 'Strategy Pattern - Interchangeable Algorithms',
    slug: 'strategy-pattern',
    summary: 'Define a family of algorithms, encapsulate each one, and make them interchangeable.',
    content: `<h2>What is Strategy Pattern?</h2>
<p>Strategy defines a family of algorithms, <strong>encapsulates each one</strong>, and makes them interchangeable. The algorithm can be swapped at runtime.</p>

<h3>The Problem It Solves</h3>
<p>You have multiple algorithms for a specific task and want to choose between them at runtime without client code knowing the details.</p>

<h3>Real-World Analogy</h3>
<p><strong>Travel Planning</strong>. You can travel by Car, Bike, or Train. The destination is the same, but the route/algorithm changes based on your choice.</p>

<h3>When to Use</h3>
<ul>
<li>When you need to use different algorithms at different times</li>
<li>When you want to switch algorithms at runtime</li>
<li>When you want to isolate business logic from implementation details</li>
</ul>

<h3>Strategy vs State</h3>
<table>
<tr><th>Strategy</th><th>State</th></tr>
<tr><td>Independent algorithms</td><td>State-dependent behavior</td></tr>
<tr><td>Client chooses strategy</td><td>State transitions automatically</td></tr>
<tr><td>Algorithms don't know about each other</td><td>States know about each other</td></tr>
</table>

<h3>Java Examples</h3>
<ul>
<li><code>java.util.Comparator</code></li>
<li><code>java.io.InputStream</code> (different implementations)</li>
<li><code>javax.servlet.Filter</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Swap algorithms used inside an object at runtime</li>
<li>Isolate implementation details from code that uses it</li>
<li>Replace inheritance with composition</li>
<li>Open/Closed - introduce new strategies without changing context</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Clients must be aware of different strategies</li>
<li>Can create many strategy objects</li>
<li>Modern languages have better alternatives (lambdas)</li>
</ul>`,
    code_snippet: `// Strategy interface
public interface PaymentStrategy {
    void pay(double amount);
}

// Concrete Strategies
public class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String cvv;
    
    public CreditCardPayment(String cardNumber, String cvv) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }
    
    public void pay(double amount) {
        System.out.println("Paid $" + String.format("%.2f", amount) + 
                          " with Credit Card ending " + 
                          cardNumber.substring(cardNumber.length() - 4));
    }
}

public class PayPalPayment implements PaymentStrategy {
    private String email;
    
    public PayPalPayment(String email) {
        this.email = email;
    }
    
    public void pay(double amount) {
        System.out.println("Paid $" + String.format("%.2f", amount) + 
                          " via PayPal (" + email + ")");
    }
}

public class CryptoPayment implements PaymentStrategy {
    private String walletAddress;
    
    public CryptoPayment(String walletAddress) {
        this.walletAddress = walletAddress;
    }
    
    public void pay(double amount) {
        System.out.println("Paid $" + String.format("%.2f", amount) + 
                          " in crypto to " + walletAddress.substring(0, 10) + "...");
    }
}

public class CashPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid $" + String.format("%.2f", amount) + " with Cash");
    }
}

// Context
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    private PaymentStrategy paymentStrategy;
    
    public void addItem(Item item) {
        items.add(item);
    }
    
    public double getTotal() {
        return items.stream().mapToDouble(Item::getPrice).sum();
    }
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout() {
        double total = getTotal();
        System.out.println("Total items: " + items.size());
        System.out.println("Total: $" + String.format("%.2f", total));
        
        if (paymentStrategy == null) {
            System.out.println("Please select a payment method!");
            return;
        }
        
        paymentStrategy.pay(total);
        items.clear();
    }
}

public class Item {
    private String name;
    private double price;
    
    public Item(String name, double price) {
        this.name = name;
        this.price = price;
    }
    
    public double getPrice() { return price; }
    public String getName() { return name; }
}

// Sorting example with Strategy
public class Sorter {
    public interface SortStrategy<T> {
        void sort(List<T> list, Comparator<T> cmp);
    }
    
    public static class QuickSort<T> implements SortStrategy<T> {
        public void sort(List<T> list, Comparator<T> cmp) {
            System.out.println("Using QuickSort");
            // Actual quicksort implementation
        }
    }
    
    public static class MergeSort<T> implements SortStrategy<T> {
        public void sort(List<T> list, Comparator<T> cmp) {
            System.out.println("Using MergeSort");
        }
    }
}

// Usage
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.addItem(new Item("Laptop", 999.99));
        cart.addItem(new Item("Mouse", 29.99));
        cart.addItem(new Item("Keyboard", 79.99));
        
        // Pay with Credit Card
        cart.setPaymentStrategy(new CreditCardPayment("1234567890123456", "123"));
        cart.checkout();
        
        System.out.println("");
        cart.addItem(new Item("Monitor", 299.99));
        
        // Switch to PayPal
        cart.setPaymentStrategy(new PayPalPayment("user@email.com"));
        cart.checkout();
        
        System.out.println("");
        cart.addItem(new Item("Headphones", 149.99));
        
        // Switch to Crypto
        cart.setPaymentStrategy(new CryptoPayment("0x742d35Cc6634C0532"));
        cart.checkout();
        
        // Using Lambda for Strategy (Java 8+)
        System.out.println("\\n=== Using Lambda for Strategy ===");
        List<Integer> numbers = new ArrayList<>();
        numbers.add(5);
        numbers.add(2);
        numbers.add(8);
        numbers.add(1);
        numbers.add(9);
        
        // Sort with lambda
        numbers.sort((a, b) -> b.compareTo(a));
        System.out.println("Sorted descending: " + numbers);
        
        numbers.sort(Comparator.naturalOrder());
        System.out.println("Sorted ascending: " + numbers);
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 21,
    title: 'Template Method Pattern - Define the Algorithm',
    slug: 'template-method-pattern',
    summary: 'Define the skeleton of an algorithm, letting subclasses override specific steps.',
    content: `<h2>What is Template Method?</h2>
<p>Template Method defines the <strong>skeleton of an algorithm</strong> in a method, deferring some steps to subclasses. It lets subclasses redefine certain steps without changing the algorithm's structure.</p>

<h3>The Problem It Solves</h3>
<p>You have an algorithm with some steps that vary and some that are common. You want subclasses to provide implementations for varying steps while reusing common logic.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Coffee/Tea Recipe</strong>. The steps are: Boil Water → Brew → Pour → Add Condiments. Only the brewing step differs.</p>

<h3>When to Use</h3>
<ul>
<li>When you have an algorithm with invariant and variant parts</li>
<li>When you want to avoid code duplication</li>
<li>When you want to control the extension points in a framework</li>
</ul>

<h3>Key Concepts</h3>
<ul>
<li><strong>Skeleton Method</strong> - Defines the algorithm structure (usually final)</li>
<li><strong>Primitive Operations</strong> - Abstract methods subclasses must implement</li>
<li><strong>Hook Methods</strong> - Optional overrides with default behavior</li>
</ul>

<h3>Template Method vs Strategy</h3>
<table>
<tr><th>Template Method</th><th>Strategy</th></tr>
<tr><td>Uses inheritance</td><td>Uses composition</td></tr>
<tr><td>Algorithm in one class</td><td>Algorithms in separate classes</td></tr>
<tr><td>Compile-time flexibility</td><td>Runtime flexibility</td></tr>
</table>

<h3>Java Examples</h3>
<ul>
<li><code>java.io.InputStream#read()</code></li>
<li><code>java.util.AbstractList#indexOf()</code></li>
<li><code>javax.servlet.http.HttpServlet</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Let clients override only certain parts of a large algorithm</li>
<li>Make it easier to add hooks and extensions</li>
<li>Pull duplicate code into a superclass</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Some clients may be limited by provided skeleton</li>
<li>May violate Liskov Substitution if skeleton requires abilities subclasses don't have</li>
<li>Can become rigid with many steps</li>
</ul>`,
    code_snippet: `// Abstract Class with Template Method
public abstract class Beverage {
    
    // Template Method - defines the algorithm
    // final prevents overriding the algorithm
    public final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
        hook(); // Optional hook
    }
    
    // Common methods
    protected void boilWater() {
        System.out.println("1. Boiling water");
    }
    
    protected void pourInCup() {
        System.out.println("4. Pouring into cup");
    }
    
    // Abstract methods - must be overridden
    protected abstract void brew();
    protected abstract void addCondiments();
    
    // Hook - can be overridden
    protected void hook() {
        // Default implementation does nothing
        // Subclasses can override
    }
}

// Concrete implementations
public class Coffee extends Beverage {
    protected void brew() {
        System.out.println("2. Dripping coffee through filter");
    }
    
    protected void addCondiments() {
        System.out.println("5. Adding sugar and milk");
    }
    
    @Override
    protected void hook() {
        System.out.println("   [Coffee aroma detected!]");
    }
}

public class Tea extends Beverage {
    protected void brew() {
        System.out.println("2. Steeping the tea");
    }
    
    protected void addCondiments() {
        System.out.println("5. Adding lemon");
    }
}

public class HotChocolate extends Beverage {
    protected void brew() {
        System.out.println("2. Dissolving hot chocolate mix");
    }
    
    protected void addCondiments() {
        System.out.println("5. Adding marshmallows");
    }
}

// With hook for customization
public class TeaWithHook extends Beverage {
    protected void brew() {
        System.out.println("2. Steeping the tea");
    }
    
    protected void addCondiments() {
        System.out.println("5. Adding lemon");
    }
    
    // Override hook to ask user
    @Override
    protected void hook() {
        System.out.println("   Would you like to add mint?");
    }
}

// Data processing example
public abstract class DataProcessor {
    // Template method
    public final void process() {
        readData();
        validateData();
        processData();
        saveData();
        sendNotification();
    }
    
    protected abstract void readData();
    protected abstract void processData();
    
    protected void validateData() {
        System.out.println("Validating data...");
        // Common validation logic
    }
    
    protected void saveData() {
        System.out.println("Saving data...");
    }
    
    protected void sendNotification() {
        System.out.println("Sending notification...");
    }
}

public class CSVProcessor extends DataProcessor {
    protected void readData() {
        System.out.println("Reading CSV file...");
    }
    
    protected void processData() {
        System.out.println("Processing CSV data...");
    }
}

public class JSONProcessor extends DataProcessor {
    protected void readData() {
        System.out.println("Reading JSON file...");
    }
    
    protected void processData() {
        System.out.println("Processing JSON data...");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Making Coffee ===");
        Beverage coffee = new Coffee();
        coffee.prepareRecipe();
        
        System.out.println("\\n=== Making Tea ===");
        Beverage tea = new Tea();
        tea.prepareRecipe();
        
        System.out.println("\\n=== Data Processing ===");
        DataProcessor csvProcessor = new CSVProcessor();
        csvProcessor.process();
        
        System.out.println("\\n=== Tea with Hook ===");
        Beverage teaWithHook = new TeaWithHook();
        teaWithHook.prepareRecipe();
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 22,
    title: 'Visitor Pattern - Operations on Object Structures',
    slug: 'visitor-pattern',
    summary: 'Represent an operation to be performed on elements of an object structure.',
    content: `<h2>What is Visitor Pattern?</h2>
<p>Visitor lets you define a <strong>new operation</strong> without changing the classes of elements on which it operates. It separates algorithm from object structure.</p>

<h3>The Problem It Solves</h3>
<p>You have an object structure with different element types. You want to perform operations on these elements without modifying their classes.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Taxi Visitor</strong>. Different visitors (Taxi driver, Family, Tourist) see your house differently, but the house structure stays the same.</p>

<h3>When to Use</h3>
<ul>
<li>When you have an object structure with many element types</li>
<li>When you need to perform operations on these elements</li>
<li>When you add new operations frequently without changing element classes</li>
</ul>

<h3>Key Components</h3>
<ul>
<li><strong>Visitor</strong> - Declares visit() for each element type</li>
<li><strong>ConcreteVisitor</strong> - Implements visit() methods</li>
<li><strong>Element</strong> - Accepts a visitor</li>
<li><strong>ObjectStructure</strong> - Contains elements</li>
</ul>

<h3>Visitor vs Strategy</h3>
<table>
<tr><th>Visitor</th><th>Strategy</th></tr>
<tr><td>Operates on composite/structure</td><td>Single algorithm</td></tr>
<tr><td>New operations easy, new elements hard</td><td>New algorithms easy, context fixed</td></tr>
<tr><td>Double dispatch</td><td>Single dispatch</td></tr>
</table>

<h3>Java Examples</h3>
<ul>
<li><code>java.lang.reflect.Visitor</code> (not official)</li>
<li><code>javax.lang.model.element.ElementVisitor</code></li>
<li><code>JavaParser library</code></li>
</ul>

<h3>Pros</h3>
<ul>
<li>Open/Closed - add new operations without changing elements</li>
<li>Related behaviors grouped in one visitor</li>
<li>Visitor can accumulate state while traversing</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Must update all visitors when adding new element type</li>
<li>May lack access to private fields</li>
<li>Can break encapsulation</li>
</ul>`,
    code_snippet: `// Element interface
public interface Shape {
    void accept(Visitor visitor);
    double getArea();
}

// Concrete Elements
public class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) { this.radius = radius; }
    
    public double getRadius() { return radius; }
    public double getArea() { return Math.PI * radius * radius; }
    
    public void accept(Visitor visitor) {
        visitor.visitCircle(this);
    }
}

public class Rectangle implements Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    public double getWidth() { return width; }
    public double getHeight() { return height; }
    public double getArea() { return width * height; }
    
    public void accept(Visitor visitor) {
        visitor.visitRectangle(this);
    }
}

public class Triangle implements Shape {
    private double base;
    private double height;
    
    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    public double getBase() { return base; }
    public double getHeight() { return height; }
    public double getArea() { return 0.5 * base * height; }
    
    public void accept(Visitor visitor) {
        visitor.visitTriangle(this);
    }
}

// Visitor interface
public interface Visitor {
    void visitCircle(Circle circle);
    void visitRectangle(Rectangle rectangle);
    void visitTriangle(Triangle triangle);
}

// Concrete Visitors
public class AreaCalculator implements Visitor {
    private double totalArea = 0;
    
    public void visitCircle(Circle circle) {
        double area = circle.getArea();
        System.out.println("Circle area: " + String.format("%.2f", area));
        totalArea += area;
    }
    
    public void visitRectangle(Rectangle rectangle) {
        double area = rectangle.getArea();
        System.out.println("Rectangle area: " + String.format("%.2f", area));
        totalArea += area;
    }
    
    public void visitTriangle(Triangle triangle) {
        double area = triangle.getArea();
        System.out.println("Triangle area: " + String.format("%.2f", area));
        totalArea += area;
    }
    
    public double getTotalArea() { return totalArea; }
}

public class ShapeDrawer implements Visitor {
    public void visitCircle(Circle circle) {
        System.out.println("Drawing circle with radius " + circle.getRadius());
    }
    
    public void visitRectangle(Rectangle rectangle) {
        System.out.println("Drawing rectangle " + rectangle.getWidth() + 
                          " x " + rectangle.getHeight());
    }
    
    public void visitTriangle(Triangle triangle) {
        System.out.println("Drawing triangle with base " + triangle.getBase() + 
                          " and height " + triangle.getHeight());
    }
}

public class ShapeInfo implements Visitor {
    public void visitCircle(Circle circle) {
        System.out.println("Circle: r=" + circle.getRadius() + 
                          ", area=" + String.format("%.2f", circle.getArea()));
    }
    
    public void visitRectangle(Rectangle rectangle) {
        System.out.println("Rectangle: " + rectangle.getWidth() + "x" + 
                          rectangle.getHeight() + 
                          ", area=" + String.format("%.2f", rectangle.getArea()));
    }
    
    public void visitTriangle(Triangle triangle) {
        System.out.println("Triangle: b=" + triangle.getBase() + 
                          ", h=" + triangle.getHeight() + 
                          ", area=" + String.format("%.2f", triangle.getArea()));
    }
}

// Object Structure
import java.util.ArrayList;
import java.util.List;

public class Drawing implements Shape {
    private List<Shape> shapes = new ArrayList<>();
    
    public void addShape(Shape shape) {
        shapes.add(shape);
    }
    
    public void accept(Visitor visitor) {
        for (Shape shape : shapes) {
            shape.accept(visitor);
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Drawing drawing = new Drawing();
        drawing.addShape(new Circle(5));
        drawing.addShape(new Rectangle(4, 6));
        drawing.addShape(new Triangle(3, 4));
        drawing.addShape(new Circle(3));
        
        System.out.println("=== Drawing Info ===");
        drawing.accept(new ShapeInfo());
        
        System.out.println("\\n=== Calculating Areas ===");
        AreaCalculator areaCalc = new AreaCalculator();
        drawing.accept(areaCalc);
        System.out.println("Total Area: " + String.format("%.2f", areaCalc.getTotalArea()));
        
        System.out.println("\\n=== Drawing Shapes ===");
        drawing.accept(new ShapeDrawer());
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '12 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 23,
    title: 'Null Object Pattern - Handle Nulls Gracefully',
    slug: 'null-object-pattern',
    summary: 'Provide a default object that does nothing instead of null references.',
    content: `<h2>What is Null Object Pattern?</h2>
<p>Null Object provides a <strong>default object</strong> that does nothing instead of returning null. This eliminates null checks throughout your code.</p>

<h3>The Problem It Solves</h3>
<p>You constantly check for null values and handle them specially. This leads to null checks scattered throughout the codebase.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Default Response System</strong>. When a bot doesn't have an answer, instead of saying nothing, it provides a default response.</p>

<h3>When to Use</h3>
<ul>
<li>When you want to avoid explicit null checks</li>
<li>When you need default behavior</li>
<li>When you want to represent "do nothing" operation</li>
</ul>

<h3>Without vs With Null Object</h3>
<pre>
// Without Null Object
if (customer != null) {
    customer.introduce();
} else {
    System.out.println("Guest user");
}

// With Null Object
customer.introduce(); // Always works
</pre>

<h3>Java Alternatives</h3>
<ul>
<li><code>Optional&lt;T&gt;</code> (Java 8+)</li>
<li><code>java.util.Optional</code></li>
<li><code>@Nullable</code> annotations</li>
</ul>

<h3>Pros</h3>
<ul>
<li>Eliminates null checks</li>
<li>Provides predictable default behavior</li>
<li>Makes code more readable</li>
<li>Defines class-specific do-nothing behavior</li>
</ul>

<h3>Cons</h3>
<ul>
<li>Can hide bugs by never returning null</li>
<li>May not be appropriate for all cases</li>
<li>Can be confusing if overused</li>
</ul>

<h3>Related Patterns</h3>
<p>Often used with <strong>Factory Method</strong> to create appropriate Null Object instances.</p>`,
    code_snippet: `// Customer interface
public interface Customer {
    String getName();
    boolean isNil();
    void introduce();
    void placeOrder(String item);
}

// Real Customer
public class RealCustomer implements Customer {
    private String name;
    
    public RealCustomer(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    public boolean isNil() { return false; }
    
    public void introduce() {
        System.out.println("Hi, I'm " + name);
    }
    
    public void placeOrder(String item) {
        System.out.println(name + " ordered: " + item);
    }
}

// Null Object - does nothing
public class NullCustomer implements Customer {
    public String getName() { return "Guest"; }
    public boolean isNil() { return true; }
    
    public void introduce() {
        System.out.println("Hi, I'm a guest. Please sign up!");
    }
    
    public void placeOrder(String item) {
        System.out.println("Please log in to place an order.");
    }
}

// Logging example
public interface Logger {
    void info(String message);
    void warn(String message);
    void error(String message);
}

public class ConsoleLogger implements Logger {
    public void info(String message) {
        System.out.println("[INFO] " + message);
    }
    
    public void warn(String message) {
        System.out.println("[WARN] " + message);
    }
    
    public void error(String message) {
        System.err.println("[ERROR] " + message);
    }
}

// Null Logger - does nothing
public class NullLogger implements Logger {
    public void info(String message) { /* Do nothing */ }
    public void warn(String message) { /* Do nothing */ }
    public void error(String message) { /* Do nothing */ }
}

// Factory
public class CustomerFactory {
    private static final NullCustomer NULL_CUSTOMER = new NullCustomer();
    
    public static Customer getCustomer(String name) {
        if (name == null || name.isEmpty() || name.equals("guest")) {
            return NULL_CUSTOMER;
        }
        // Simulate checking database
        if (name.equals("unknown")) {
            return NULL_CUSTOMER;
        }
        return new RealCustomer(name);
    }
}

// Service using Customer
public class OrderService {
    private Customer customer;
    
    public OrderService(Customer customer) {
        this.customer = customer;
    }
    
    public void processOrder(String item) {
        customer.introduce();
        customer.placeOrder(item);
    }
    
    public void printCustomerInfo() {
        // No null check needed!
        if (customer.isNil()) {
            System.out.println("Anonymous customer");
        } else {
            System.out.println("Valued customer: " + customer.getName());
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Customer Examples ===");
        Customer alice = CustomerFactory.getCustomer("Alice");
        Customer bob = CustomerFactory.getCustomer("");
        Customer guest = CustomerFactory.getCustomer(null);
        
        alice.introduce();
        bob.introduce();
        guest.introduce();
        
        System.out.println("\\n=== Order Service ===");
        OrderService orderService = new OrderService(alice);
        orderService.processOrder("Laptop");
        
        System.out.println("");
        OrderService guestService = new OrderService(guest);
        guestService.processOrder("Mouse");
        
        System.out.println("\\n=== Logger Example ===");
        Logger logger = new NullLogger();
        // No null checks needed!
        logger.info("This is an info message");
        logger.warn("This is a warning");
        logger.error("This is an error");
        System.out.println("(Nothing was logged because NullLogger does nothing)");
    }
}`,
    author: 'Subrat Ojha',
    category_id: 3,
    read_time: '10 min',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
