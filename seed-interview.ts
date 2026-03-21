import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmvzcpseefbjyafaegvr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdnpjcHNlZWZianlhZmFlZ3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Nzk3OTEsImV4cCI6MjA4OTU1NTc5MX0.ZMWL4VbEXqkCefWLrCn6dJwY0wEhBRKIGdxNpTSIi60';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedJavaQuestions() {
  console.log('Seeding Java Fundamentals and Interview Questions...\n');

  // First, create the new categories
  const categories = [
    { name: 'Java Fundamentals', slug: 'java-fundamentals', description: 'Core Java concepts and fundamentals' },
    { name: 'Java Interview Questions', slug: 'java-interview-questions', description: 'Common Java interview questions with answers' }
  ];

  console.log('Creating categories...');
  for (const cat of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert(cat, { onConflict: 'slug' });
    if (error) console.log(`Error: ${error.message}`);
    else console.log(`✓ ${cat.name}`);
  }

  // Get category IDs
  const { data: jfCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'java-fundamentals')
    .single();

  const { data: iqCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'java-interview-questions')
    .single();

  const jfCategoryId = jfCategory?.id || 1;
  const iqCategoryId = iqCategory?.id || 1;

  // Java Fundamentals posts
  const fundamentals = [
    {
      id: 'jf001',
      title: 'JDK vs JRE vs JVM vs JIT Compiler',
      slug: 'jdk-vs-jre-vs-jvm-vs-jit',
      summary: 'Understanding the differences between JDK, JRE, JVM, and JIT Compiler',
      content: `<h2>JDK vs JRE vs JVM vs JIT Compiler</h2>
<p>These are fundamental concepts that every Java developer must understand.</p>

<h3>JDK (Java Development Kit)</h3>
<p>The complete software development kit that includes:</p>
<ul>
<li>JRE (Java Runtime Environment)</li>
<li>Compiler (javac)</li>
<li>Debugger</li>
<li>Development tools (javap, javadoc, jar)</li>
</ul>
<p><strong>Use:</strong> When you need to develop Java applications</p>

<h3>JRE (Java Runtime Environment)</h3>
<p>Provides the runtime environment for Java applications:</p>
<ul>
<li>JVM (Java Virtual Machine)</li>
<li>Core libraries and class files</li>
</ul>
<p><strong>Use:</strong> When you only need to run Java applications (not develop)</p>

<h3>JVM (Java Virtual Machine)</h3>
<p>JVM is the virtual machine that executes Java bytecode:</p>
<ul>
<li>Loads bytecode (.class files)</li>
<li>Verifies bytecode security</li>
<li>Allocates memory areas</li>
<li>Executes instructions</li>
</ul>
<p><strong>Use:</strong> Platform-independent execution of Java code</p>

<h3>JIT Compiler (Just-In-Time Compiler)</h3>
<p>JIT improves performance by compiling bytecode to native machine code:</p>
<ul>
<li>Part of JVM</li>
<li>Compiles frequently used bytecode to native code</li>
<li>Cached for reuse</li>
<li>Runs after the program has started</li>
</ul>

<h3>Execution Flow</h3>
<pre>
Source Code → javac → Bytecode → JVM → JIT → Native Machine Code
</pre>`,
      codeSnippet: `// JDK contains everything needed to develop
// JRE contains everything needed to run
// JVM executes bytecode
// JIT compiles hot bytecode to native code

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`
    },
    {
      id: 'jf002',
      title: 'Java Virtual Machine (JVM) - Memory Areas',
      slug: 'jvm-memory-areas',
      summary: 'Understanding JVM memory areas and how Java manages memory',
      content: `<h2>JVM Memory Areas</h2>

<h3>1. Method Area (Metaspace in Java 8+)</h3>
<ul>
<li>Stores class metadata (class name, parent class, methods, fields)</li>
<li>Stores static variables</li>
<li>Stores constant pool</li>
<li>Shared among all threads</li>
</ul>

<h3>2. Heap Area</h3>
<ul>
<li>Objects and their instance variables</li>
<li>Arrays</li>
<li>Shared among all threads</li>
<li>Garbage collection happens here</li>
<li>Divided into: Young Generation, Old Generation</li>
</ul>

<h3>3. Stack Area</h3>
<ul>
<li>Each thread has its own stack</li>
<li>Stores method frames</li>
<li>Local variables, parameters, return addresses</li>
<li>LIFO (Last In First Out)</li>
<li>Created when thread starts</li>
</ul>

<h3>4. PC Registers</h3>
<ul>
<li>Each thread has its own PC register</li>
<li>Stores address of current executing instruction</li>
<li>Points to next instruction</li>
</ul>

<h3>5. Native Method Stack</h3>
<ul>
<li>For native (non-Java) methods</li>
<li>C/C++ libraries integration</li>
<li>Similar to stack structure</li>
</ul>`,
      codeSnippet: `// JVM Memory Areas visualized
public class MemoryDemo {
    // method area - class metadata
    static String staticVar = "Stored in Method Area";
    
    // heap - object instance
    private String instanceVar = "Stored in Heap";
    
    public void method() {
        // stack - local variables
        int localVar = 10;
        String localRef = "Stack";
        
        // Object created in heap, reference in stack
        Object obj = new Object();
    }
}`
    },
    {
      id: 'jf003',
      title: 'Platform Independence in Java',
      slug: 'platform-independence',
      summary: 'How Java achieves platform independence and why it matters',
      content: `<h2>Platform Independence in Java</h2>

<h3>What is Platform Independence?</h3>
<p><strong>Write Once, Run Anywhere (WORA)</strong> - Java code runs on any platform with JVM.</p>

<h3>How it Works</h3>
<pre>
1. Source Code (.java)
   ↓ Compile with javac
2. Bytecode (.class)
   ↓ JVM interprets or JIT compiles
3. Native Machine Code
   Windows   Linux   Mac
</pre>

<h3>Key Components</h3>
<h4>JVM for each platform:</h4>
<ul>
<li>Windows JVM</li>
<li>Linux JVM</li>
<li>Mac JVM</li>
<li>Each understands same bytecode</li>
</ul>

<h4>Bytecode verification:</h4>
<ul>
<li>Security checks</li>
<li>Type safety verification</li>
<li>Ensures safe execution</li>
</ul>

<h3>Not Platform Independent:</h3>
<ul>
<li>Native code (JNI)</li>
<li>System-specific features</li>
<li>File paths (use File.separator)</li>
</ul>`,
      codeSnippet: `// Same bytecode runs everywhere
// File: MyApp.java

public class MyApp {
    public static void main(String[] args) {
        // This runs on Windows, Linux, Mac
        System.out.println("Platform: " + 
            System.getProperty("os.name"));
        System.out.println("Java Version: " + 
            System.getProperty("java.version"));
    }
}

// Compile once
// javac MyApp.java

// Run anywhere
// java MyApp`
    },
    {
      id: 'jf004',
      title: 'Class Loaders in Java',
      slug: 'class-loaders',
      summary: 'Understanding Class Loaders and Delegation Hierarchy Algorithm',
      content: `<h2>Class Loaders in Java</h2>

<h3>Three Built-in Class Loaders</h3>

<h4>1. Bootstrap Class Loader (Primordial)</h4>
<ul>
<li>Loads core Java classes (java.lang, java.util)</li>
<li>Written in C</li>
<li>Parent of all class loaders</li>
<li>Loads from JDK's lib directory</li>
</ul>

<h4>2. Extension Class Loader</h4>
<ul>
<li>Loads classes from JDK extensions</li>
<li>java.ext.dirs system property</li>
<li>Parent is Bootstrap</li>
</ul>

<h4>3. Application Class Loader (System)</h4>
<ul>
<li>Loads classes from classpath</li>
<li>Your application classes</li>
<li>Parent is Extension</li>
</ul>

<h3>Delegation Hierarchy Algorithm</h3>
<ol>
<li>Check if class already loaded</li>
<li>If not, delegate to parent class loader</li>
<li>Parent tries to load</li>
<li>If parent can't, this loader tries</li>
</ol>
<p>This prevents loading of malicious classes.</p>

<h3>Custom Class Loader</h3>
<ul>
<li>Extend ClassLoader class</li>
<li>Override findClass()</li>
<li>For dynamic loading, plugins, hot deployment</li>
</ul>`,
      codeSnippet: `public class ClassLoaderDemo {
    public static void main(String[] args) {
        // Get class loaders
        ClassLoader cl = ClassLoaderDemo.class.getClassLoader();
        
        System.out.println("App ClassLoader: " + cl);
        System.out.println("Parent: " + cl.getParent());
        System.out.println("Grandparent: " + cl.getParent().getParent());
        
        // Bootstrap has no parent (null)
    }
}`
    },
    {
      id: 'jf005',
      title: 'Main Method in Java',
      slug: 'main-method',
      summary: 'Understanding main method signature, static keyword, and variations',
      content: `<h2>Main Method in Java</h2>

<h3>Standard Signature</h3>
<pre>public static void main(String[] args)</pre>

<h3>Why Each Part?</h3>
<ul>
<li><strong>public:</strong> JVM must access it from outside</li>
<li><strong>static:</strong> JVM calls without creating object</li>
<li><strong>void:</strong> No return value needed</li>
<li><strong>main:</strong> Default method name searched by JVM</li>
<li><strong>String[] args:</strong> Command line arguments</li>
</ul>

<h3>Can we write main as public void static?</h3>
<p><strong>NO!</strong> The method signature must be exact.</p>
<ul>
<li>"public static void main" will NOT work</li>
<li>"public static void Main" (capital M) will NOT work</li>
</ul>

<h3>Default Arguments</h3>
<p>String[] args can be empty:</p>
<pre>java MyClass → args = [] (empty array, not null)</pre>

<h3>Byte vs Char</h3>
<ul>
<li><strong>byte:</strong> 8-bit signed integer (-128 to 127)</li>
<li><strong>char:</strong> 16-bit unsigned unicode character</li>
</ul>

<h3>Primitive Numeric Order (Ascending)</h3>
<pre>byte → short → char → int → long → float → double</pre>`,
      codeSnippet: `public class MainMethodDemo {
    // This compiles and runs
    public static void main(String[] args) {
        System.out.println("Hello!");
        
        // args is empty array, not null
        System.out.println("Args length: " + args.length);
        
        // Access command line args
        for (String arg : args) {
            System.out.println(arg);
        }
    }
}

// This will NOT compile
// public void static main(String[] args) {}  // WRONG!

// This will NOT work (JVM won't find it)
// public static void Main(String[] args) {}  // WRONG!`
    },
    {
      id: 'jf006',
      title: 'Local Variables vs Instance Variables',
      slug: 'local-vs-instance-variables',
      summary: 'Default values, initialization rules for different variable types',
      content: `<h2>Local Variables vs Instance Variables</h2>

<h3>Instance Variables</h3>
<ul>
<li>Declared in class, outside methods</li>
<li>Have default values</li>
<li>Stored in heap</li>
<li>Live with object</li>
</ul>

<h4>Default Values</h4>
<ul>
<li>int: 0</li>
<li>double: 0.0</li>
<li>boolean: false</li>
<li>Object: null</li>
</ul>

<h3>Local Variables</h3>
<ul>
<li>Declared inside methods/blocks</li>
<li><strong>NO default values</strong></li>
<li><strong>MUST be initialized before use</strong></li>
<li>Stored in stack</li>
<li>Live with method</li>
</ul>

<h3>Instance Reference Variables</h3>
<ul>
<li>Object references default to null</li>
<li>Default value is null</li>
</ul>`,
      codeSnippet: `public class VariableDemo {
    // Instance variables - have defaults
    int instanceVar;           // 0
    double price;               // 0.0
    boolean isActive;          // false
    String name;               // null
    Object obj;                // null
    
    public void method() {
        // Local variables - NO defaults
        int localVar;           // NOT initialized
        
        // System.out.println(localVar); // ERROR!
        
        localVar = 10;          // Must initialize
        System.out.println(localVar); // OK
        
        // Instance variables auto-initialized
        System.out.println(instanceVar); // OK - prints 0
    }
}`
    },
    {
      id: 'jf007',
      title: 'OOP Principles',
      slug: 'oop-principles',
      summary: 'Encapsulation, Inheritance, Polymorphism, Abstraction',
      content: `<h2>Four Pillars of OOP</h2>

<h3>1. Encapsulation</h3>
<ul>
<li>Wrapping data and code together</li>
<li>Data hiding via private fields</li>
<li>Public getters/setters</li>
<li>Controls access to internal state</li>
</ul>

<h3>2. Inheritance</h3>
<ul>
<li>Acquiring properties from parent class</li>
<li>Code reusability</li>
<li>IS-A relationship</li>
<li>extends keyword</li>
</ul>

<h3>3. Polymorphism</h3>
<ul>
<li>Many forms</li>
<li>Method overloading (compile-time)</li>
<li>Method overriding (runtime)</li>
<li>One interface, many implementations</li>
</ul>

<h3>4. Abstraction</h3>
<ul>
<li>Hiding implementation details</li>
<li>Showing only functionality</li>
<li>Abstract classes (0-100% abstract)</li>
<li>Interfaces (100% abstract)</li>
</ul>

<h3>OOP vs Object-Based</h3>
<ul>
<li><strong>OOP:</strong> Supports inheritance and polymorphism (Java, C++, Python)</li>
<li><strong>Object-Based:</strong> No inheritance (JavaScript, VBScript)</li>
</ul>`,
      codeSnippet: `// Encapsulation
class Account {
    private double balance;
    
    public double getBalance() { return balance; }
    public void deposit(double amt) { balance += amt; }
}

// Inheritance
class SavingsAccount extends Account {
    private double interestRate;
}

// Polymorphism - Overriding
class Animal {
    void sound() { System.out.println("..."); }
}

class Dog extends Animal {
    @Override
    void sound() { System.out.println("Bark"); }
}

// Polymorphism - Overloading
class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}`
    },
    {
      id: 'jf008',
      title: 'Constructors in Java',
      slug: 'constructors',
      summary: 'Purpose of constructors, types, and rules',
      content: `<h2>Constructors in Java</h2>

<h3>Purpose</h3>
<ul>
<li>Initialize objects</li>
<li>Allocate memory</li>
<li>Set initial state</li>
</ul>

<h3>Rules</h3>
<ul>
<li>Same name as class</li>
<li>No return type (not even void)</li>
<li>Executed when new is called</li>
<li>Can be overloaded</li>
</ul>

<h3>Types</h3>
<ol>
<li><strong>Default Constructor (No-arg)</strong> - Provided by compiler if no constructor exists</li>
<li><strong>Parameterized Constructor</strong> - Takes arguments, initialize fields</li>
<li><strong>Copy Constructor</strong> - Creates object from another object</li>
</ol>

<h3>What Constructor Returns</h3>
<ul>
<li>Returns reference to new object</li>
<li>Cannot return a value</li>
<li>Cannot be final, static, or abstract</li>
</ul>

<h3>Inheritance & Constructors</h3>
<ul>
<li>Constructors are NOT inherited</li>
<li>Child must call parent constructor (super())</li>
<li>If no super() call, compiler adds it</li>
</ul>`,
      codeSnippet: `class User {
    private String name;
    private int age;
    
    // Default constructor
    public User() {
        this.name = "Unknown";
        this.age = 0;
    }
    
    // Parameterized constructor
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Copy constructor
    public User(User other) {
        this.name = other.name;
        this.age = other.age;
    }
}`
    },
    {
      id: 'jf009',
      title: 'this and super Keywords',
      slug: 'this-super-keywords',
      summary: 'Understanding this and super keywords in Java',
      content: `<h2>this Keyword</h2>
<ul>
<li>Reference to current object</li>
<li>Distinguish instance variables from parameters</li>
<li>Chain constructors (this())</li>
<li>Pass current object as argument</li>
</ul>

<h2>super Keyword</h2>
<ul>
<li>Reference to parent class</li>
<li>Call parent constructor (super())</li>
<li>Call parent methods</li>
</ul>

<h3>Can we use this() and super() together?</h3>
<p><strong>NO!</strong> Both must be first statement. They cannot be in same constructor.</p>

<h3>Why no pointers?</h3>
<ul>
<li>Security - prevent memory corruption</li>
<li>Simplicity - no pointer arithmetic</li>
<li>Safety - no dangling references</li>
<li>Java is fully managed language</li>
</ul>`,
      codeSnippet: `class Parent {
    String name = "Parent";
    
    Parent() {
        System.out.println("Parent constructor");
    }
    
    void display() {
        System.out.println("Parent display");
    }
}

class Child extends Parent {
    String name = "Child";
    
    Child() {
        super(); // Must be first
        System.out.println("Child constructor");
    }
    
    void display() {
        super.display(); // Call parent method
        System.out.println("Child display");
    }
    
    void show() {
        System.out.println(this.name);   // Child
        System.out.println(super.name);  // Parent
    }
}`
    },
    {
      id: 'jf010',
      title: 'Static vs Instance Members',
      slug: 'static-vs-instance',
      summary: 'Static variables, methods, blocks and their usage',
      content: `<h2>Static Members</h2>

<h3>Static Variable</h3>
<ul>
<li>One copy for entire class</li>
<li>Used for constants, counters</li>
<li>Stored in method area</li>
</ul>

<h3>Static Method</h3>
<ul>
<li>Can only access static members</li>
<li>Cannot use this/super</li>
<li>Can be called without object</li>
<li>Main method is static</li>
</ul>

<h3>Static Block</h3>
<ul>
<li>Executes when class loads</li>
<li>Initialize static variables</li>
<li>Runs once per class</li>
</ul>

<h3>Can we execute without main?</h3>
<p><strong>No (since Java 7)</strong></p>

<h3>Final Modifier on static</h3>
<ul>
<li>static final = compile-time constant</li>
<li>Value cannot change</li>
</ul>`,
      codeSnippet: `class Counter {
    // Static variable - shared
    static int count = 0;
    
    // Static block - runs once
    static {
        System.out.println("Counter class loaded");
    }
    
    // Instance variable - per object
    int instanceCount = 0;
    
    // Static method
    static void increment() {
        count++;
    }
}

public class StaticDemo {
    public static void main(String[] args) {
        Counter.increment(); // No object needed
        
        Counter c1 = new Counter();
        Counter c2 = new Counter();
        
        System.out.println(Counter.count); // 1
    }
}`
    }
  ];

  // Interview Questions (comprehensive Q&A)
  const interviewQuestions = [
    { q: 'What is the difference between JDK and JRE?', a: 'JDK (Java Development Kit) includes JRE + compiler + debuggers + development tools. JRE (Java Runtime Environment) provides runtime environment to run Java applications. JDK is needed for development, JRE is enough for running Java programs.' },
    { q: 'What is Java Virtual Machine (JVM)?', a: 'JVM is a virtual machine that executes Java bytecode. It provides platform independence by converting bytecode to machine-specific code. JVM handles memory management, garbage collection, security verification, and exception handling.' },
    { q: 'What are the different types of memory areas allocated by JVM?', a: '1. Method Area (stores class metadata, static variables) 2. Heap (objects and instance variables) 3. Stack (method frames, local variables) 4. PC Registers (current instruction address) 5. Native Method Stack (native method calls)' },
    { q: 'What is JIT compiler?', a: 'JIT (Just-In-Time) compiler improves performance by compiling frequently used bytecode to native machine code at runtime. It is part of JVM, caches compiled code for reuse, and runs after program starts.' },
    { q: 'How Java platform is different from other platforms?', a: 'Java is platform-independent - Write Once Run Anywhere (WORA). Java code compiles to bytecode that runs on any JVM, whereas other platforms require platform-specific compilation.' },
    { q: 'What is platform independency in Java?', a: 'Platform independence means Java code can run on any OS with JVM. Source → Bytecode → JVM (interprets/compiles) → Native code for specific OS. Java bytecode is same for all platforms.' },
    { q: 'How many class loaders in Java?', a: 'Three built-in class loaders: 1. Bootstrap Class Loader (loads core Java classes) 2. Extension Class Loader (loads JDK extensions) 3. Application Class Loader (loads classpath classes). Custom class loaders can also be created.' },
    { q: 'What is delegation Hierarchy Algorithm?', a: 'Class loading uses delegation: 1. Check if class already loaded 2. If not, delegate to parent class loader 3. Parent tries to load 4. If parent cannot, this loader tries. This prevents loading malicious classes.' },
    { q: 'Can we write main method as public void static instead of public static void?', a: 'NO! The method signature must be exactly "public static void main(String[] args)". JVM searches for this exact signature.' },
    { q: 'What is the default value of local variables in Java?', a: 'Local variables have NO default values in Java. They MUST be initialized before use. Instance variables get default values (0, 0.0, false, null).' },
    { q: 'What will be the value of String array if no arguments passed to main?', a: 'The String array will be an empty array (length = 0), NOT null. Example: java MyClass → args = []' },
    { q: 'What is the difference between byte and char data types?', a: 'byte: 8-bit signed integer (-128 to 127), used for raw binary data. char: 16-bit unsigned Unicode character (0 to 65535), used for characters.' },
    { q: 'Ascending order of numeric data types?', a: 'byte → short → char → int → long → float → double. This is the order from smallest to largest capacity.' },
    { q: 'Can we have multiple classes in a single Java file?', a: 'Yes, but only ONE public class with same name as file. Other classes in file will have default access.' },
    { q: 'What are the main principles of Object Oriented Programming?', a: 'Four pillars: 1. Encapsulation (data hiding) 2. Inheritance (code reuse) 3. Polymorphism (many forms) 4. Abstraction (hide complexity)' },
    { q: 'Difference between Object Oriented and Object Based languages?', a: 'OOP languages support inheritance and polymorphism (Java, C++, Python). Object Based languages have objects but no inheritance (JavaScript, VBScript).' },
    { q: 'What is the default value of an object reference as instance variable?', a: 'The default value is null for all object references (instance variables).' },
    { q: 'Why do we need constructor in Java?', a: 'Constructors initialize objects, allocate memory, and set initial state. They are called automatically when new object is created.' },
    { q: 'Why do we need default constructor?', a: 'Default constructor initializes fields to default values and allows object creation when no constructor is defined. Compiler provides it automatically.' },
    { q: 'What is the value returned by Constructor?', a: 'Constructors do NOT return any value. They implicitly return reference to the newly created object.' },
    { q: 'Can we inherit a Constructor?', a: 'NO! Constructors are NOT inherited. Child class must define its own constructors and call parent constructor using super().' },
    { q: 'Why constructors cannot be final, static, or abstract?', a: 'final: Would prevent instantiation. static: Belongs to class, not object. abstract: Requires implementation. Constructors must be overridden differently.' },
    { q: 'Purpose of this keyword?', a: '1. Reference current object 2. Distinguish instance variables from parameters 3. Chain constructors (this()) 4. Pass current object as argument' },
    { q: 'Concept of static variable?', a: 'Static variables belong to class, not objects. Shared among all instances. Initialized once at class load. Accessed via ClassName.variable.' },
    { q: 'Difference between static and instance variable?', a: 'Static: One copy per class, loaded at class load, accessed via class name. Instance: One copy per object, created with object, accessed via object reference.' },
    { q: 'What is Inheritance?', a: 'Inheritance acquires properties from parent class. Uses "extends" keyword. Enables code reuse (IS-A relationship). Types: single, multilevel, hierarchical, multiple (through interfaces).' },
    { q: 'Which class is superclass of every other class?', a: 'java.lang.Object is the superclass of all classes in Java. Every class directly or indirectly extends Object.' },
    { q: 'Why Java does not support multiple inheritance?', a: 'Multiple inheritance causes ambiguity (diamond problem). To avoid complexity and confusion. Java uses interfaces to achieve multiple inheritance effects.' },
    { q: 'What is composition in OOPS?', a: 'Composition is HAS-A relationship. A class contains references to other classes. Example: Car HAS-A Engine. Preferred over inheritance for flexibility.' },
    { q: 'Why there are no pointers in Java?', a: '1. Security - prevents memory corruption 2. Simplicity - no pointer arithmetic 3. Safety - no dangling references 4. Java is fully managed language' },
    { q: 'How aggregation and composition differ?', a: 'Aggregation: HAS-A relationship, parts can exist independently. Composition: Stronger HAS-A, parts cannot exist without whole.' },
    { q: 'What is encapsulation?', a: 'Wrapping data and code together. Data hiding via private fields. Public getters/setters control access. Protects internal state.' },
    { q: 'Purpose of super keyword?', a: '1. Reference parent class 2. Call parent constructor (super()) 3. Call parent methods (super.method())' },
    { q: 'Can we use this() and super() both in same constructor?', a: 'NO! Both must be first statement and cannot be in same constructor. this() and super() must be exclusive.' },
    { q: 'Meaning of object cloning?', a: 'Creating exact copy of an object. Requires implementing Cloneable interface. Uses clone() method. Shallow copy by default.' },
    { q: 'Why do we use static variable?', a: 'Static variables are shared across all objects. Useful for constants, counters, configuration. Saves memory.' },
    { q: 'Why is it not good practice to create static variables?', a: 'Static variables live for entire application lifecycle. Can cause memory leaks. Hard to test. Shared state causes concurrency issues.' },
    { q: 'Purpose of static method?', a: 'Static methods belong to class. Can be called without object. Used for utility functions, factory methods. Cannot access instance variables.' },
    { q: 'Why mark main method as static?', a: 'JVM calls main() without creating object. Static allows JVM to invoke it directly before any object exists.' },
    { q: 'When do we use static block?', a: 'Static block executes once when class is loaded. Used to initialize static variables, perform one-time setup.' },
    { q: 'Can we execute program without main() method?', a: 'NO! Since Java 7, main() is required. Earlier versions could use static blocks for execution.' },
    { q: 'What happens if static is not mentioned in main signature?', a: 'JVM will NOT find the method. main(String[] args) without static will give NoSuchMethodError.' },
    { q: 'Difference between static and instance method?', a: 'Static: Class method, no object needed, cannot use this/super. Instance: Object method, requires object, can use this/super.' },
    { q: 'Other name of Method Overloading?', a: 'Compile-time polymorphism or Static polymorphism.' },
    { q: 'How to implement method overloading?', a: 'Same class, same method name, different parameters (type, number, order). Return type can differ.' },
    { q: 'What argument variations are allowed in overloading?', a: 'Different parameter types, different number of parameters, different parameter order.' },
    { q: 'Why cannot overload by changing return type?', a: 'Compiler cannot determine which method to call. Ambiguous resolution. Not allowed.' },
    { q: 'Is it allowed to overload main()?', a: 'YES! main() can be overloaded like any other method. But JVM calls main(String[] args) only.' },
    { q: 'How to implement method overriding?', a: 'Different class (parent-child), same method signature. Use @Override annotation. Cannot reduce visibility.' },
    { q: 'Can we override a static method?', a: 'NO! Static methods cannot be overridden. They are hidden, not overridden.' },
    { q: 'Why Java does not allow overriding static method?', a: 'Static methods belong to class, not object. Overriding requires runtime polymorphism. Static methods use static binding.' },
    { q: 'Can we override an overloaded method?', a: 'YES! Overloaded method can be overridden in child class.' },
    { q: 'Difference between overloading and overriding?', a: 'Overloading: Same class, compile-time, different parameters. Overriding: Different class, runtime, same signature.' },
    { q: 'Does Java allow virtual functions?', a: 'YES! All instance methods in Java are virtual by default. Only static and private methods are not virtual.' },
    { q: 'What is covariant return type?', a: 'Overridden method can return subtype of parent return type. Introduced in Java 5.' },
    { q: 'What is Runtime Polymorphism?', a: 'Method overriding achieves runtime polymorphism. Parent reference points to child object. Correct method called at runtime.' },
    { q: 'Can we achieve Runtime Polymorphism with data members?', a: 'NO! Data members use compile-time (static) binding. Overriding applies to methods only.' },
    { q: 'Difference between static and dynamic binding?', a: 'Static: Compile-time binding, overloading. Dynamic: Runtime binding, overriding. Static uses type declared, dynamic uses actual type.' },
    { q: 'What is Abstraction?', a: 'Hiding implementation details, showing functionality. Implemented via abstract classes and interfaces. Focus on what, not how.' },
    { q: 'Difference between Abstraction and Encapsulation?', a: 'Abstraction: Hide complexity, show essential features. Encapsulation: Hide data, bundle with methods. Encapsulation implements abstraction.' },
    { q: 'What is abstract class?', a: 'Class declared with abstract keyword. Can have abstract (unimplemented) and concrete methods. Cannot be instantiated. Used as base class.' },
    { q: 'Can abstract method exist without abstract class?', a: 'NO! If any method is abstract, class must be declared abstract.' },
    { q: 'Can we mark abstract method as final?', a: 'NO! Abstract methods must be overridden. Final methods cannot be overridden. Contradiction!' },
    { q: 'Can we instantiate abstract class?', a: 'NO! Abstract classes cannot be instantiated. Must be subclassed and abstract methods implemented.' },
    { q: 'What is interface?', a: '100% abstract class. Declares methods without implementation. Class implements interface. Supports multiple inheritance.' },
    { q: 'Can we mark interface method as static?', a: 'YES! Java 8 introduced static methods in interfaces. Called via InterfaceName.method().' },
    { q: 'Why interface cannot be marked final?', a: 'Final means cannot be extended. Interface must be implemented by classes. Contradiction!' },
    { q: 'What is marker interface?', a: 'Empty interface with no methods. Used for tagging/identification. Examples: Serializable, Cloneable.' },
    { q: 'What can we use instead of marker interface?', a: 'Annotations! More flexible, can have attributes. Examples: @Deprecated, @Override.' },
    { q: 'How Annotations are better than marker interfaces?', a: 'Annotations can have attributes/parameters. Can provide metadata. More flexible. Better tooling support.' },
    { q: 'Difference between abstract class and interface?', a: 'Abstract: 0-100% abstract, constructors, instance variables, single inheritance. Interface: 100% abstract, no constructors, no instance variables, multiple inheritance.' },
    { q: 'Can we use private/protected modifiers in interfaces?', a: 'Interface methods are implicitly public. Variables are public static final. All are public in interfaces.' },
    { q: 'How to cast object to interface reference?', a: 'If class implements interface, direct assignment works. Explicit cast not needed.' },
    { q: 'How to change value of final variable?', a: 'Cannot change directly. But if final variable is reference, can modify object state. Only reference is immutable.' },
    { q: 'Can a class be marked final?', a: 'YES! Final classes cannot be subclassed. Examples: String, Integer, Math.' },
    { q: 'How to create final method?', a: 'Mark method with final keyword. public final void method() {}. Cannot be overridden by subclasses.' },
    { q: 'How to prohibit inheritance?', a: '1. Mark class as final. 2. Make constructor private and use static factory method.' },
    { q: 'Why Integer class is final?', a: 'Security, String pool works correctly, thread safety, hashcode caching. Prevents overriding critical methods.' },
    { q: 'What is blank final variable?', a: 'final variable declared but not initialized. Must be initialized in constructor (instance) or static block (static).' },
    { q: 'How to initialize blank final variable?', a: 'Instance blank final: Initialize in constructor. Static blank final: Initialize in static block.' },
    { q: 'Can we declare main method as final?', a: 'YES! main() can be final. It prevents overriding main(), though it is already static.' },
    { q: 'Purpose of package?', a: 'Organize classes, avoid naming conflicts, access control, modularity, encapsulation.' },
    { q: 'What is java.lang package?', a: 'Core Java package, automatically imported. Contains: Object, String, System, Math, Thread, Exception classes.' },
    { q: 'Most important class in Java?', a: 'java.lang.Object - Superclass of all classes. Provides basic methods like toString(), equals(), hashCode().' },
    { q: 'Is it mandatory to import java.lang?', a: 'NO! java.lang is automatically imported in every Java program.' },
    { q: 'Can we import same package or class twice?', a: 'Yes, multiple imports resolve to same class. Compiler ignores duplicates.' },
    { q: 'What is static import?', a: 'import static java.lang.Math.PI; Then use PI directly instead of Math.PI.' },
    { q: 'Difference between import and static import?', a: 'import com.test.Foo imports Foo class. import static com.test.Foo.method imports specific method.' },
    { q: 'What is Locale in Java?', a: 'Locale represents geographic/cultural region. Used for formatting dates, numbers, currencies.' },
    { q: 'How to use specific Locale?', a: 'DateFormat.getDateInstance(DateFormat.LONG, Locale.US). format(date).' },
    { q: 'What is serialization?', a: 'Process of converting object to byte stream for storage/transmission. ObjectOutputStream.writeObject().' },
    { q: 'Purpose of serialization?', a: 'Save object state, send object over network, persist to file/database, session replication.' },
    { q: 'What is Deserialization?', a: 'Convert byte stream back to object. ObjectInputStream.readObject(). Reconstructs object state.' },
    { q: 'Serialization vs Deserialization?', a: 'Serialization: Object → Byte Stream (write). Deserialization: Byte Stream → Object (read).' },
    { q: 'Why mark data member transient?', a: 'transient fields are skipped during serialization. Gets default value (null, 0, false) after deserialization.' },
    { q: 'Can we mark method as transient?', a: 'NO! Only fields can be transient. Methods are not serialized.' },
    { q: 'How does transient help serialization?', a: 'Non-serializable objects cause serialization to fail. Marking them transient skips them.' },
    { q: 'What is Externalizable interface?', a: 'Extends Serializable. Provides complete control over serialization. Must implement writeExternal() and readExternal().' },
    { q: 'Difference between Serializable and Externalizable?', a: 'Serializable: Automatic, uses reflection, less control, slower. Externalizable: Programmatic, faster, full control.' },
    { q: 'What is Reflection?', a: 'API to inspect and modify class behavior at runtime. Uses: Spring DI, JUnit, Jackson. Class.forName().' },
    { q: 'Uses of Reflection?', a: 'Dependency injection, dynamic proxies, bean factories, ORM, testing frameworks, IDE tooling.' },
    { q: 'How to access private method?', a: 'Use setAccessible(true) on Method object. Then invoke(). May be blocked by security manager.' },
    { q: 'How to create object dynamically?', a: 'Class.newInstance() (deprecated) or Constructor.newInstance(). Requires no-arg constructor.' },
    { q: 'What is Garbage Collection?', a: 'Automatic memory management. JVM reclaims memory from unreachable objects. Prevents memory leaks.' },
    { q: 'Why Java provides Garbage Collector?', a: 'Prevents memory leaks, avoids manual memory errors, simplifies development, improves reliability.' },
    { q: 'Purpose of gc()?', a: 'Suggests JVM to run garbage collection. Not guaranteed to run immediately. JVM decides when to collect.' },
    { q: 'How does Garbage Collection work?', a: 'Generational GC: Young generation (Eden, Survivor), Old generation, Metaspace. Objects promoted between generations.' },
    { q: 'When object becomes eligible for GC?', a: 'When no live reference exists: null reference, reassign reference, island of isolation.' },
    { q: 'Why use finalize()?', a: 'Called before object reclamation. For cleanup (close files, release resources). Deprecated - unpredictable.' },
    { q: 'Different types of References?', a: 'StrongReference, SoftReference (cleared before OOM), WeakReference (cleared at GC), PhantomReference (post-GC).' },
    { q: 'How to reference unreferenced object again?', a: 'Cannot revive unreferenced object. Only WeakReference might allow. GC finalizes unreachable objects.' },
    { q: 'What kind of process is Garbage collector thread?', a: 'Daemon thread. JVM exits when only daemon threads remain.' },
    { q: 'Purpose of Runtime class?', a: 'Provides interface to interact with JVM. Memory, processor, GC information, system properties, exec processes.' },
    { q: 'How to invoke external process?', a: 'Runtime.getRuntime().exec("command"). Returns Process object. Must handle Input/Error streams.' },
    { q: 'Uses of Runtime class?', a: 'Execute external commands, get JVM memory info, freeMemory(), totalMemory(), availableProcessors().' },
    { q: 'What is Nested class?', a: 'Class defined within another class. Can access outer class members even private.' },
    { q: 'How many types of Nested classes?', a: 'Four types: 1. Non-static Inner Class 2. Static Nested Class 3. Local Inner Class 4. Anonymous Inner Class.' },
    { q: 'Why use Nested Classes?', a: 'Logical grouping (only used by outer), encapsulation, code readability, maintainability.' },
    { q: 'Difference between Nested and Inner class?', a: 'Nested: Includes static nested. Inner: Non-static nested class specifically.' },
    { q: 'What is Nested interface?', a: 'Interface inside a class. Automatically static. Can be public, private, etc.' },
    { q: 'How to access non-final local variable in Local Inner class?', a: 'Variable must be final or effectively final (Java 8+).' },
    { q: 'Can Interface be defined in a Class?', a: 'YES! Nested interface inside class. Automatically public static.' },
    { q: 'Must we explicitly mark Nested Interface public static?', a: 'YES implied, but good practice to be explicit. public static interface NestedInterface {}' },
    { q: 'Why use Static Nested interface?', a: 'Groups related interfaces logically. Does not require outer class instance. Namespace organization.' },
    { q: 'What is Immutable String?', a: 'String cannot be changed after creation. Once created, same object. Thread-safe, secure, enables String pool.' },
    { q: 'Why String object is immutable?', a: 'Security (network, file paths), Thread safety, String pool enables reuse, Hashcode caching.' },
    { q: 'How many objects does String s = new String("hello") create?', a: 'Two objects: 1 in heap (new), 1 in String pool (literal).' },
    { q: 'Ways to create String object?', a: '1. String literal: String s = "hello" 2. new keyword: String s = new String("hello") 3. char[], byte[] constructors' },
    { q: 'What is String interning?', a: 'Returns canonical form from String pool. s1.intern() returns pooled reference. Used for String comparison optimization.' },
    { q: 'Difference between String and StringBuffer?', a: 'String: Immutable, thread-safe, pool optimization. StringBuffer: Mutable, synchronized (thread-safe), slower.' },
    { q: 'How to create immutable class?', a: '1. Class final 2. All fields private final 3. No setters 4. Defensive copies for mutable fields 5. No inheritance' },
    { q: 'Purpose of toString()?', a: 'Returns string representation of object. Default: className@hashcode. Override for meaningful output.' },
    { q: 'Order of efficiency: String, StringBuffer, StringBuilder?', a: 'StringBuilder (fastest, not synchronized) → StringBuffer (synchronized) → String (immutable, slowest for modifications).' },
    { q: 'What is Exception Handling?', a: 'Mechanism to handle runtime errors. Prevents abnormal termination. Provides recovery options.' },
    { q: 'Difference between Checked and Unchecked?', a: 'Checked: Compiler enforces handling (IOException). Unchecked: RuntimeException (NullPointerException).' },
    { q: 'Base class for Error and Exception?', a: 'java.lang.Throwable. Error (system errors), Exception (application errors). Both extend Throwable.' },
    { q: 'What is finally block?', a: 'Always executes (except System.exit). Used for cleanup. Can exist without catch.' },
    { q: 'Use of finally block?', a: 'Resource cleanup: close files, release connections, close streams. Guaranteed execution.' },
    { q: 'Can we create finally without catch?', a: 'YES! try-finally is valid. Must have either catch or finally with try.' },
    { q: 'Must we always put catch after try?', a: 'NO! Either catch or finally (or both) must follow try.' },
    { q: 'When finally block will not execute?', a: 'System.exit(), JVM crash, infinite loop in try, fatal error. Also if thread is daemon.' },
    { q: 'Can we re-throw Exception?', a: 'YES! throw e; in catch block re-throws same exception.' },
    { q: 'Difference between throw and throws?', a: 'throw: Hurls exception object. throws: Declares exceptions that may be thrown.' },
    { q: 'Concept of Exception Propagation?', a: 'Unchecked exceptions propagate up call stack until caught. Checked must be declared or caught.' },
    { q: 'Can child override method throw additional exceptions?', a: 'Child can throw unchecked. Cannot add new checked exceptions.' },
    { q: 'How Multi-threading works?', a: 'Multiple threads execute concurrently in JVM. Share heap, have separate stacks. OS schedules threads.' },
    { q: 'Advantages of Multithreading?', a: 'Better CPU utilization, faster execution, improved responsiveness, resource sharing, simplified modeling.' },
    { q: 'Disadvantages of Multithreading?', a: 'Complex debugging, overhead, resource consumption, synchronization needed, potential deadlocks.' },
    { q: 'What is Thread?', a: 'Lightweight subprocess. Smallest executable unit. Shares memory with other threads. Has own stack and PC.' },
    { q: 'Thread priority and scheduling?', a: 'Priority 1-10. Higher priority more likely to be scheduled. setPriority(). Usually just suggestion to OS.' },
    { q: 'Difference between Pre-emptive and Time Slicing?', a: 'Pre-emptive: Higher priority thread can preempt lower. Time slicing: Each thread gets time quantum.' },
    { q: 'Can we call run() instead of start()?', a: 'start() creates new thread. run() executes in current thread. Use start() to create thread.' },
    { q: 'How to make user thread daemon?', a: 'Call setDaemon(true) before start(). Cannot change after start().' },
    { q: 'Can we start thread twice?', a: 'NO! Starting same thread twice throws IllegalThreadStateException.' },
    { q: 'When can we interrupt a thread?', a: 'Thread.interrupt() when waiting (throws InterruptedException), checking interrupt flag otherwise.' },
    { q: 'Can we lock object for exclusive use?', a: 'YES! synchronized keyword. Object monitor. Only one thread can enter synchronized block.' },
    { q: 'Difference between notify() and notifyAll()?', a: 'notify(): Wakes one waiting thread. notifyAll(): Wakes all waiting threads. All compete for lock.' },
    { q: 'Difference between Vector and ArrayList?', a: 'Vector: Synchronized, legacy, grows 100%. ArrayList: Not synchronized, faster, grows 50%.' },
    { q: 'Difference between Collection and Collections?', a: 'Collection: Interface for groups of objects. Collections: Utility class with static methods.' },
    { q: 'When LinkedList better than ArrayList?', a: 'Frequent insertions/deletions in middle. When you have iterator and modify. O(1) insertion if position known.' },
    { q: 'Difference between List and Set?', a: 'List: Ordered, allows duplicates, indexed. Set: Unordered, no duplicates.' },
    { q: 'Difference between HashSet and TreeSet?', a: 'HashSet: Hash-based, no order, O(1). TreeSet: Tree-based, sorted, O(log n).' },
    { q: 'When to use List, Set, or Map?', a: 'List: Ordered collection, duplicates OK. Set: Unique elements, no duplicates. Map: Key-value pairs.' },
    { q: 'Difference between HashMap and Hashtable?', a: 'HashMap: Not synchronized, allows null key/value. Hashtable: Synchronized, no null key/value.' },
    { q: 'Difference between HashMap and TreeMap?', a: 'HashMap: Hash-based, no order, O(1). TreeMap: Sorted keys, O(log n), NavigableMap.' },
    { q: 'Difference between Comparable and Comparator?', a: 'Comparable: Natural ordering, implemented by class. Comparator: Custom ordering, separate class.' },
    { q: 'Purpose of Properties file?', a: 'Store configuration data as key-value pairs. Loaded at runtime. Internationalization support.' },
    { q: 'Why override equals()?', a: 'To define equality based on content, not reference. Needed for collections, HashMap keys, testing.' },
    { q: 'How hashCode() works?', a: 'Returns integer based on object content. Used by hash-based collections. Equal objects must have equal hashCode.' },
    { q: 'Is it good to use Generics in collections?', a: 'YES! Type safety at compile time, no casting needed, enables generic algorithms.' },
    { q: 'What are Wrapper classes?', a: 'Primitives to Objects: int→Integer, double→Double, etc. Enable primitives in collections, null values.' },
    { q: 'Purpose of native method?', a: 'Call C/C++ code from Java. Access system-specific features, legacy code, performance-critical sections.' },
    { q: 'What is System class?', a: 'Utility class with static methods. Access to standard input, output, error. System.getProperty(), System.exit().' },
    { q: 'What is System.out.println?', a: 'System: Class. out: static PrintStream. println(): method. Prints to standard output.' },
    { q: 'Other name of Shallow Copy?', a: 'Memberwise copy. Same as Object.clone() without proper implementation.' },
    { q: 'Difference between Shallow and Deep Copy?', a: 'Shallow: Copies fields as-is, references point to same objects. Deep: Copies referenced objects too.' },
    { q: 'What is Singleton class?', a: 'Ensures only one instance exists. Private constructor, static getInstance() method. Examples: Runtime, Logger.' },
    { q: 'Singleton vs Static class?', a: 'Singleton: Object, can implement interfaces, lazy init. Static: Class-level, cannot be mocked, eager init.' },
    { q: 'Difference between Collection and Collections Framework?', a: 'Collection: Root interface. Collections Framework: Complete set of interfaces, classes, algorithms.' },
    { q: 'Benefits of Collections Framework?', a: 'Reusability, type safety, performance, interoperability, maintainability.' },
    { q: 'Root interface of Collection hierarchy?', a: 'java.util.Collection is root. Iterable is above it (for-each support).' },
    { q: 'Main differences Collection vs Collections?', a: 'Collection: Interface for groups. Collections: Utility class with static methods for manipulation.' },
    { q: 'Thread-safe collection classes?', a: 'Vector, Hashtable, synchronizedList/Map/Set, CopyOnWriteArrayList, ConcurrentHashMap, BlockingQueue.' },
    { q: 'How to remove elements while iterating?', a: 'Use Iterator.remove(). Do not use list.remove() during iteration (ConcurrentModificationException).' },
    { q: 'Convert List to int[]?', a: 'list.stream().mapToInt(i -> i).toArray().' },
    { q: 'Convert int[] to List?', a: 'Arrays.stream(arr).boxed().collect(Collectors.toList()) or IntStream.of(arr).boxed().toList().' },
    { q: 'How to run a filter on Collection?', a: 'Use Stream API: list.stream().filter(predicate).collect(Collectors.toList()).' },
    { q: 'Convert List to Set?', a: 'new HashSet<>(list) removes duplicates. Or stream.collect(Collectors.toSet()).' },
    { q: 'Remove duplicate elements from ArrayList?', a: 'new ArrayList<>(new HashSet<>(list)) or Java 8: list.stream().distinct().collect(Collectors.toList()).' },
    { q: 'Maintain Collection sorted?', a: 'Use TreeSet, TreeMap or Collections.sort(). Call sort() on List: Collections.sort(list).' },
    { q: 'Collections.emptyList() vs new ArrayList()?', a: 'emptyList(): Immutable, shared singleton, less memory. new ArrayList(): Mutable, new instance.' },
    { q: 'Copy elements from Source to Destination list?', a: 'dest.addAll(source) or Collections.copy(dest, source) or source.stream().forEach(dest::add).' },
    { q: 'Classes implementing List interface?', a: 'ArrayList, LinkedList, Vector, Stack, CopyOnWriteArrayList.' },
    { q: 'Classes implementing Set interface?', a: 'HashSet, LinkedHashSet, TreeSet, EnumSet, CopyOnWriteArraySet.' },
    { q: 'Iterator vs ListIterator?', a: 'Iterator: Forward only. ListIterator: Bidirectional, can add/modify, knows index.' },
    { q: 'Iterator vs Enumeration?', a: 'Iterator: Remove elements, fail-fast. Enumeration: Read-only, legacy, hasMoreElements().' },
    { q: 'ArrayList vs LinkedList?', a: 'ArrayList: Random access O(1), slow insert/delete. LinkedList: Slow access O(n), fast insert/delete O(1).' },
    { q: 'Set vs Map?', a: 'Set: Collection of unique elements. Map: Key-value pairs, keys unique. Map is not part of Collection.' },
    { q: 'Purpose of Dictionary class?', a: 'Abstract class for key-value pairs. Legacy. Use Map interface instead: HashMap, Hashtable.' },
    { q: 'Default load factor in HashMap?', a: '0.75. When 75% full, HashMap doubles capacity.' },
    { q: 'Significance of load factor in HashMap?', a: 'Trade-off between time and space. Lower: More memory, less collisions. Higher: Less memory, more collisions.' },
    { q: 'Difference between HashSet and HashMap?', a: 'HashSet stores elements, HashMap stores key-value. HashSet uses HashMap internally. Both use hash-based storage.' },
    { q: 'Similarities between HashSet and HashMap?', a: 'Both hash-based, use hashCode() and equals(), not synchronized, fail-fast iterator, similar performance.' },
    { q: 'Why override equals()?', a: 'Define object equality based on content. Required for proper functioning of HashMap, HashSet, collections.' },
    { q: 'Synchronize List, Set, Map?', a: 'Collections.synchronizedList/map/set() or use concurrent collections like CopyOnWriteArrayList.' },
    { q: 'What is Hash Collision?', a: 'Two different keys hash to same bucket. Handled by equals() comparison or linked list/tree.' },
    { q: 'Hash Collision resolution techniques?', a: 'Separate chaining (linked list), Open addressing (linear probing, quadratic, double hashing).' },
    { q: 'Queue vs Stack?', a: 'Queue: FIFO (First In First Out). Stack: LIFO (Last In First Out).' },
    { q: 'What is Iterator?', a: 'Object to traverse collection. hasNext(), next(), remove(). Fail-fast.' },
    { q: 'Iterator vs Enumeration?', a: 'Iterator: Can remove, fail-fast. Enumeration: Read-only, legacy, slightly faster.' },
    { q: 'Design pattern in Enumeration?', a: 'Iterator pattern. Also known as Cursor pattern.' },
    { q: 'Methods to override for HashMap key?', a: 'hashCode() and equals(). Both must be consistent. Used for bucket selection and equality.' },
    { q: 'Reverse a List in Java?', a: 'Collections.reverse(list) or list.sort(Comparator.reverseOrder()) or IntStream range reversed.' },
    { q: 'Convert array of Strings to List?', a: 'Arrays.asList(array) or Stream.of(array).collect(Collectors.toList()).' },
    { q: 'Difference between peek(), poll(), remove()?', a: 'peek(): View head, null if empty. poll(): View and remove, null if empty. remove(): View and remove, exception if empty.' },
    { q: 'Array vs ArrayList?', a: 'Array: Fixed size, primitives, faster. ArrayList: Variable size, objects only, richer API.' },
    { q: 'HashMap insert, delete, retrieve?', a: 'Insert: map.put(key, value). Delete: map.remove(key). Retrieve: map.get(key).' },
    { q: 'HashMap vs ConcurrentHashMap?', a: 'HashMap: Not synchronized, one lock. ConcurrentHashMap: Segment-level locking, higher concurrency.' },
    { q: 'Increasing order of collection performance?', a: 'HashSet/HashMap O(1) → TreeSet/TreeMap O(log n) → LinkedList O(n).' },
    { q: 'Why Map not extend Collection?', a: 'Map has key-value pairs, not single elements. Different semantics. Collection stores elements only.' },
    { q: 'Ways to iterate List?', a: 'for loop, enhanced for, Iterator, ListIterator, forEach, stream().forEach().' },
    { q: 'CopyOnWriteArrayList vs ArrayList?', a: 'CopyOnWrite: Thread-safe, copy on write, fail-safe iterator, for read-heavy. ArrayList: Not synchronized.' },
    { q: 'HashMap remove() implementation?', a: 'Find bucket via hash, traverse list/tree, remove node using equals(). Update size.' },
    { q: 'What is BlockingQueue?', a: 'Queue that blocks on empty/full. put() blocks if full, take() blocks if empty. Used in producer-consumer.' },
    { q: 'How TreeMap implemented?', a: 'Red-Black tree (self-balancing BST). Keys sorted in natural order or by Comparator.' },
    { q: 'Fail-fast vs Fail-safe?', a: 'Fail-fast: Throws CME on modification. Fail-safe: Works on clone, no exception.' },
    { q: 'How ConcurrentHashMap works?', a: 'Segment-based locking. Each segment is like Hashtable. Reduces contention, higher concurrency.' },
    { q: 'Importance of hashCode() and equals()?', a: 'Hash-based collections use them for storage and retrieval. Must be consistent. Required for proper HashMap/HashSet.' },
    { q: 'Contract of hashCode() and equals()?', a: 'Equal objects must have equal hashCode. Different objects can have same hashCode.' },
    { q: 'What is EnumSet?', a: 'Set implementation for enum types. Efficient, uses bit vectors. All elements must be same enum.' },
    { q: 'Main concurrent collections?', a: 'CopyOnWriteArrayList, ConcurrentHashMap, ConcurrentLinkedQueue, BlockingQueue, ConcurrentLinkedDeque.' },
    { q: 'Convert Collection to SynchronizedCollection?', a: 'Collections.synchronizedCollection(collection) wraps with synchronized methods.' },
    { q: 'IdentityHashMap vs regular Map?', a: 'IdentityHashMap uses == instead of equals() for key comparison. Uses System.identityHashCode().' },
    { q: 'Main use of IdentityHashMap?', a: 'Key-based algorithms, serialization, persistence, graph traversal (node identity).' },
    { q: 'Improve IdentityHashMap performance?', a: 'Initial capacity. Larger capacity reduces rehash. Know approximate size upfront.' },
    { q: 'Is IdentityHashMap thread-safe?', a: 'NO! Not synchronized. External synchronization needed for thread safety.' },
    { q: 'What is WeakHashMap?', a: 'Entries weakly referenced. GC reclaims entry when key not strongly referenced elsewhere. Good for caches.' },
    { q: 'Make Collection read Only?', a: 'Collections.unmodifiableList/Map/Set(). Throws UnsupportedOperationException on modification attempts.' },
    { q: 'When UnsupportedOperationException thrown?', a: 'When modifying unmodifiable collection, removing from iterator remove() if not supported.' },
    { q: 'Sort Customer by firstName in ArrayList?', a: 'Implement Comparable or use Comparator: Collections.sort(list, Comparator.comparing(Customer::getFirstName)).' },
    { q: 'Synchronized vs Concurrent Collection?', a: 'Synchronized: One lock, blocks all. Concurrent: Fine-grained locking, higher throughput.' },
    { q: 'Scenario to use ConcurrentHashMap?', a: 'Multiple threads accessing map concurrently. Better performance than synchronized HashMap.' },
    { q: 'Create empty Map?', a: 'Collections.emptyMap() or new HashMap<>() or Map.of() (Java 9+).' },
    { q: 'Collection.remove() vs Iterator.remove()?', a: 'Iterator.remove() safe during iteration. Collection.remove() throws ConcurrentModificationException.' },
    { q: 'Array vs ArrayList for storing objects?', a: 'ArrayList for variable size, rich API, easier manipulation. Array for fixed size, primitives.' },
    { q: 'Replace Hashtable with ConcurrentHashMap?', a: 'Generally YES. Better performance. Note: ConcurrentHashMap does not allow null keys/values.' },
    { q: 'CopyOnWriteArrayList vs Vector?', a: 'CopyOnWrite: Copy on modification, iterators fail-safe. Vector: Synchronized, iterators fail-fast.' },
    { q: 'Why ListIterator has add() but Iterator does not?', a: 'ListIterator is for List which allows indexed insertion. Iterator is generic for any Collection.' },
    { q: 'Why ConcurrentModificationException?', a: 'Collection modified during iteration. Fail-fast iterator detects structural modification.' },
    { q: 'Convert Map to List?', a: 'List<V> values = new ArrayList<>(map.values()). List<K> keys = new ArrayList<>(map.keySet()).' },
    { q: 'Create Map with reverse view and lookup?', a: 'Use TreeMap with reverse order Comparator or Collections.reverseOrder().' },
    { q: 'Create shallow copy of Map?', a: 'new HashMap<>(original) or Map.copyOf(original) (Java 10+) or clone().' },
    { q: 'Why cannot create generic array?', a: 'Due to type erasure. Array stores component type at runtime. Generic type erased to Object or bound.' },
    { q: 'What is PriorityQueue?', a: 'Queue with priority ordering. Natural/comparator ordering. Head is smallest element. Not thread-safe.' },
    { q: 'Important points for Collections?', a: 'Choose right collection for use case. Override equals/hashCode for custom keys. Consider thread safety. Avoid raw types.' },
    { q: 'Pass Collection preventing modification?', a: 'Return unmodifiable wrapper: Collections.unmodifiableList(list). Throws UOE on modification.' },
    { q: 'How HashMap works internally?', a: 'Uses array of buckets. put(): hash → bucket index → store. get(): hash → bucket → equals(). Collision: linked list/tree.' },
    { q: 'How HashSet implemented?', a: 'Uses HashMap internally. Stores elements as keys with dummy PRESENT object as value.' },
    { q: 'What is NavigableMap?', a: 'Map with navigation methods: lowerKey, floorKey, ceilingKey, higherKey. TreeMap implements it.' },
    { q: 'descendingKeySet() vs descendingMap()?', a: 'descendingKeySet(): Returns NavigableSet of keys. descendingMap(): Returns NavigableMap with reversed order.' },
    { q: 'Advantage of NavigableMap over Map?', a: 'Navigation methods for key-based lookups. Range operations. Sorted map properties.' },
    { q: 'headMap(), tailMap(), subMap()?', a: 'headMap(toKey): < toKey. tailMap(fromKey): >= fromKey. subMap(fromKey, toKey): range.' },
    { q: 'Sort List by Natural order?', a: 'Collections.sort(list) or list.sort(Comparator.naturalOrder()).' },
    { q: 'Get Stream from List?', a: 'list.stream() or list.parallelStream() for parallel processing.' },
    { q: 'Get Map from Stream?', a: 'stream.collect(Collectors.toMap(keyMapper, valueMapper)).' },
    { q: 'Popular Deque implementations?', a: 'ArrayDeque: Resizable array, faster than Stack. LinkedList: Doubly linked, O(1) operations.' },
    { q: 'What is a Thread?', a: 'Lightweight process. Smallest unit of CPU execution. Has own stack, shares heap with other threads.' },
    { q: 'Thread priority and scheduling?', a: 'Priority 1-10. Higher = more CPU time. OS scheduler makes final decision. Use setPriority().' },
    { q: 'Default thread priority?', a: 'Thread.NORM_PRIORITY which is 5.' },
    { q: 'Three thread priorities?', a: 'Thread.MIN_PRIORITY (1), Thread.NORM_PRIORITY (5), Thread.MAX_PRIORITY (10).' },
    { q: 'Purpose of join() method?', a: 'Wait for thread to complete. t.join() blocks until t finishes. With timeout: t.join(millis).' },
    { q: 'Difference between wait() and sleep()?', a: 'wait(): Releases lock, for synchronization. sleep(): Holds lock, for pausing. wait() needs sync context.' },
    { q: 'start() vs run()?', a: 'start(): Creates new thread, calls run(). run(): Executes in current thread. Use start().' },
    { q: 'What is daemon thread?', a: 'JVM exits when only daemon threads remain. GC is daemon. Use setDaemon(true) before start().' },
    { q: 'Make regular thread daemon?', a: 'Call thread.setDaemon(true) before thread.start(). Cannot change after start().' },
    { q: 'Make user thread into daemon after start?', a: 'NOT possible. Must set before start().' },
    { q: 'Start thread twice?', a: 'NO! IllegalThreadStateException. Each thread can only be started once.' },
    { q: 'What is Shutdown hook?', a: 'Thread registered via Runtime.getRuntime().addShutdownHook(). Runs when JVM shuts down normally.' },
    { q: 'What is synchronization?', a: 'Mechanism to prevent concurrent access to shared resource. Ensures thread safety. Uses monitors/locks.' },
    { q: 'Purpose of synchronized block?', a: 'Synchronize specific code block, not entire method. More granular control, better performance.' },
    { q: 'What is static synchronization?', a: 'synchronized on class object. All instances share one lock. Used for static members.' },
    { q: 'What is Deadlock?', a: 'Two or more threads waiting forever. Each holds lock needed by others. No progress possible.' },
    { q: 'Meaning of concurrency?', a: 'Multiple threads executing simultaneously. Overlapping time periods. Independent execution paths.' },
    { q: 'Process vs thread?', a: 'Process: Heavy, separate memory. Thread: Lightweight, shares memory. Multiple threads in one process.' },
    { q: 'Process and thread in Java?', a: 'Process: JVM instance, separate OS process. Thread: Java thread, managed by JVM, shares heap.' },
    { q: 'What is Scheduler?', a: 'OS component that decides which thread runs. Preemptive or cooperative. Influenced by priority.' },
    { q: 'Minimum threads in Java program?', a: 'At least one thread: main thread. Plus garbage collector thread (daemon).' },
    { q: 'Properties of Java thread?', a: 'ID, Name, Priority, Status, Daemon flag, ThreadGroup.' },
    { q: 'Thread states?', a: 'NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.' },
    { q: 'Set thread priority?', a: 'thread.setPriority(Thread.MAX_PRIORITY) etc. Or thread.setPriority(10).' },
    { q: 'Purpose of Thread Groups?', a: 'Group threads for management. Set priority, interrupt all. Deprecated in modern Java.' },
    { q: 'Why not call stop()?', a: 'Deprecated, unsafe. Stops thread immediately without cleanup. Can leave objects in inconsistent state.' },
    { q: 'Create Thread?', a: 'Extend Thread and override run(), or Implement Runnable/Callable and pass to Thread constructor.' },
    { q: 'Stop thread in middle?', a: 'Use volatile flag or interrupt(). Do not use deprecated stop().' },
    { q: 'Access current thread?', a: 'Thread.currentThread() returns reference to currently executing thread object.' },
    { q: 'What is Busy waiting?', a: 'Thread polling in loop without doing work. Checks condition repeatedly. Wastes CPU cycles.' },
    { q: 'Prevent busy waiting?', a: 'Use wait/notify, Lock.await(), Condition.await(), BlockingQueue.' },
    { q: 'Thread.sleep() for real-time?', a: 'NO! sleep() is not precise. OS may not schedule immediately after timeout.' },
    { q: 'Wake up thread from sleep?', a: 'Interrupt it: thread.interrupt(). Throws InterruptedException.' },
    { q: 'Two ways to check interrupted?', a: 'Thread.interrupted() (clears flag) or Thread.currentThread().isInterrupted() (does not clear).' },
    { q: 'Parent waits for Child termination?', a: 'Call child.join() in parent thread. Blocks parent until child finishes.' },
    { q: 'Handle InterruptedException?', a: 'Catch and decide: rethrow, restore interrupt status, or break from loop.' },
    { q: 'Intrinsic lock acquired by synchronized method?', a: 'The this reference for instance methods. Class object for static methods.' },
    { q: 'Constructor synchronized?', a: 'NO! Constructors cannot be synchronized. Should not be - object not yet visible.' },
    { q: 'Primitive values for intrinsic locks?', a: 'NO! Locks must be objects. Primitive wrapper types autoboxed - do not use.' },
    { q: 'Re-entrant property of intrinsic locks?', a: 'YES! Same thread can re-enter. Acquiring already held lock succeeds. Reference count incremented.' },
    { q: 'What is atomic operation?', a: 'Operation that completes entirely or not at all. No intermediate state visible to other threads.' },
    { q: 'Is i++ atomic?', a: 'NO! i++ is read-modify-write (3 operations). Use AtomicInteger for atomic increment.' },
    { q: 'Atomic operations in Java?', a: 'AtomicInteger, AtomicLong, AtomicBoolean, AtomicReference. Use CAS (Compare-And-Swap).' },
    { q: 'Thread-safe code check?', a: 'Analyze shared variables, check if synchronized/Lock/Atomic/volatile. Look for race conditions.' },
    { q: 'Minimum requirements for Deadlock?', a: 'Mutual exclusion, hold and wait, no preemption, circular wait.' },
    { q: 'Prevent Deadlock?', a: 'Avoid nested locks, lock ordering, tryLock with timeout, minimize critical sections.' },
    { q: 'Detect Deadlock?', a: 'jstack, JConsole, ThreadMXBean.findDeadlockedThreads(). VisualVM.' },
    { q: 'What is Livelock?', a: 'Threads actively executing but making no progress. Respond to each other but cannot proceed.' },
    { q: 'What is Thread starvation?', a: 'Thread cannot get CPU time due to other threads. Low priority thread never gets scheduled.' },
    { q: 'Synchronized causing starvation?', a: 'Large synchronized block holding lock too long. Other threads blocked indefinitely.' },
    { q: 'What is Race condition?', a: 'Behavior depends on timing of threads. Multiple threads access shared data concurrently.' },
    { q: 'What is Fair lock?', a: 'Guarantees waiting threads get lock in FIFO order. Created with ReentrantLock(true). Slower.' },
    { q: 'Producer-Consumer Object methods?', a: 'wait() and notify()/notifyAll(). Must be in synchronized context.' },
    { q: 'How JVM determines which thread to wake?', a: 'notify(): Random waiting thread. No guarantee which one. notifyAll(): All wake, compete for lock.' },
    { q: 'Thread-safe Queue retrieval?', a: 'Use BlockingQueue methods (poll with timeout, take) or synchronized access with wait/notify.' },
    { q: 'Check thread has monitor lock?', a: 'Thread.holdsLock(Object) returns true if current thread holds lock on object.' },
    { q: 'Purpose of yield()?', a: 'Hint to scheduler current thread willing to yield. Rarely used. May cause context switch.' },
    { q: 'Pass object between threads?', a: 'Object must be safely published. Use final fields, synchronized, volatile, or concurrent collections.' },
    { q: 'Rules for Immutable Objects?', a: 'Class final, fields private final, no setters, defensive copies for mutable fields.' },
    { q: 'Use of ThreadLocal?', a: 'Thread-local variables. Each thread has own copy. Used for: connection contexts, transaction ids.' },
    { q: 'Scenarios for ThreadLocal?', a: 'Database connections, transaction management, user context, timing information. Avoids parameter passing.' },
    { q: 'Improve performance with multi-threading?', a: 'Parallel independent tasks, CPU-bound work distribution, use thread pools, avoid unnecessary synchronization.' },
    { q: 'What is scalability?', a: 'Ability to handle more work by adding resources. Vertical (bigger machine) or horizontal (more machines).' },
    { q: 'Calculate maximum speed up?', a: "Amdahl's Law: Speedup = 1 / (S + (1-S)/N). S = sequential portion, N = processors." },
    { q: 'What is Lock contention?', a: 'Multiple threads competing for same lock. Increases wait time. Decreases concurrency.' },
    { q: 'Techniques to reduce Lock contention?', a: 'Lock splitting, lock striping, reducing lock duration, read-write locks, concurrent collections.' },
    { q: 'Reduce contention technique?', a: 'Use ConcurrentHashMap instead of synchronized HashMap. Use Atomic classes for counters.' },
    { q: 'Lock splitting?', a: 'Separate locks for different fields/data. Reduces contention by allowing parallel access.' },
    { q: 'ReadWriteLock technique?', a: 'Multiple readers allowed simultaneously. Writers get exclusive access. Increases read concurrency.' },
    { q: 'Lock striping?', a: 'Partition lock into segments. Different segments have separate locks. Example: ConcurrentHashMap segments.' },
    { q: 'What is CAS operation?', a: 'Compare-And-Swap. Atomically checks value and swaps if matches. Lock-free. Used by Atomic classes.' },
    { q: 'Java classes using CAS?', a: 'AtomicInteger, AtomicLong, AtomicReference, AtomicMarkableReference, StampedLock.' },
    { q: 'Object pooling always improve performance?', a: 'NO! Pooling expensive to manage. For short-lived objects, new is faster. Pooling good for heavyweight, reusable objects.' },
    { q: 'Single vs multi-threading techniques?', a: 'ThreadLocal memory leaks, object pooling issues, synchronization bugs. Single-thread patterns may harm multi-thread.' },
    { q: 'Executor vs ExecutorService?', a: 'Executor: Simple interface (execute()). ExecutorService extends Executor with lifecycle, submit, shutdown.' },
    { q: 'What when ExecutorService queue full?', a: 'submit(): RejectedExecutionException. Use ThreadPoolExecutor with RejectedExecutionHandler.' },
    { q: 'ScheduledExecutorService?', a: 'Schedule tasks to run after delay or periodically. ScheduledThreadPoolExecutor implementation.' },
    { q: 'Create Thread pool?', a: 'Executors.newFixedThreadPool(n), newCachedThreadPool(), newSingleThreadExecutor(), newScheduledThreadPool().' },
    { q: 'Runnable vs Callable?', a: 'Runnable: no return, cannot throw checked exception. Callable: returns value, can throw exception.' },
    { q: 'Future interface uses?', a: 'Represents async result. get() blocks, isDone(), cancel(), get(timeout).' },
    { q: 'HashMap vs Hashtable concurrency?', a: 'Hashtable: synchronized methods, blocks entire map. ConcurrentHashMap: segment locks, allows concurrent reads.' },
    { q: 'Synchronized instance of List/Map?', a: 'Collections.synchronizedList(new ArrayList<>()) or CopyOnWriteArrayList.' },
    { q: 'What is Semaphore?', a: 'Controls access to shared resource with permits. acquire() gets permit, release() returns. Can allow multiple concurrent accesses.' },
    { q: 'What is CountDownLatch?', a: 'One-time barrier. Threads wait until count reaches zero. Used for waiting for multiple tasks to complete.' },
    { q: 'CountDownLatch vs CyclicBarrier?', a: 'CountDownLatch: One-time, count cannot reset. CyclicBarrier: Reusable, all threads wait then reset.' },
    { q: 'When use Fork/Join framework?', a: 'Divide-and-conquer tasks. Parallel processing of recursive algorithms. Uses work-stealing.' },
    { q: 'RecursiveTask vs RecursiveAction?', a: 'RecursiveTask: Returns result. RecursiveAction: Void. Both extend ForkJoinTask.' },
    { q: 'Process stream operations with Thread pool?', a: 'parallelStream() uses ForkJoinPool.common(). Or use stream().parallel().with custom ExecutorService.' },
    { q: 'When use parallel stream?', a: 'Large datasets, CPU-bound operations, stateless operations. Not for small data, I/O-bound, ordered operations.' },
    { q: 'Stack and Heap in multi-threading?', a: 'Heap: Shared, all threads access. Stack: Per-thread, not shared. Objects in heap, primitives in stack.' },
    { q: 'Get Thread dump?', a: 'jstack <pid>, Ctrl+Break on console, JVisualVM, JConsole, ThreadMXBean.dumpAllThreads().' },
    { q: 'Control thread stack size?', a: '-Xss<size> JVM argument. Example: -Xss1m for 1MB stack size.' },
    { q: 'Ensure T1, T2 run in sequence?', a: 't1.start(); t1.join(); t2.start(). Or use single-thread executor.' },
    { q: 'Java 8 new features?', a: 'Lambda expressions, Stream API, Functional interfaces, Default methods, Optional, Date/Time API, Method references, Type annotations.' },
    { q: 'Benefits of Java 8 features?', a: 'Concise code, better performance, easier parallel processing, null-safe APIs, better date/time handling.' },
    { q: 'What is Lambda expression?', a: 'Anonymous function. (params) -> expression or (params) -> { statements }. Enables functional programming.' },
    { q: 'Three parts of Lambda?', a: '1. Parameters 2. Arrow token (->) 3. Body (expression or block)' },
    { q: 'Data type of Lambda?', a: 'Functional interface. Compiler infers type from context.' },
    { q: 'Meaning of s -> s.length()?', a: 'Lambda taking String parameter, returning length. Equivalent to Function<String, Integer>.' },
    { q: 'Why release Java 8?', a: 'Modern programming paradigms, functional programming, parallel processing, code conciseness, developer productivity.' },
    { q: 'Advantages of Lambda?', a: 'Concise code, enabled functional programming, easier callbacks, parallel processing support.' },
    { q: 'What is Functional interface?', a: 'Interface with single abstract method. @FunctionalInterface annotation. Examples: Runnable, Comparator, Callable.' },
    { q: 'What is SAM interface?', a: 'Single Abstract Method. Same as Functional interface. Compiler recognizes for Lambda.' },
    { q: 'Define Functional interface?', a: 'interface MyFunc { returnType method(params); } with @FunctionalInterface. Only one abstract method.' },
    { q: 'Why need Functional interface?', a: 'Target type for Lambda expressions. Compiler needs type to infer Lambda.' },
    { q: '@FunctionalInterface mandatory?', a: 'NO! Optional. Compiler applies if single abstract method. Good practice for documentation.' },
    { q: 'Collection vs Stream API?', a: 'Collection: Stores elements, eager, can modify. Stream: Processes elements, lazy, single traversal.' },
    { q: 'Main uses of Stream API?', a: 'Filter, map, reduce operations. Aggregate queries. Parallel processing. Chaining operations.' },
    { q: 'Intermediate vs Terminal Operations?', a: 'Intermediate: Return Stream, lazy. Terminal: Return result, eager. Pipeline: intermediate → terminal.' },
    { q: 'What is Spliterator?', a: 'Iterator for Stream. Supports parallel iteration. TryAdvance(), trySplit().' },
    { q: 'Iterator vs Spliterator?', a: 'Iterator: Sequential. Spliterator: Sequential + parallel, characteristics, trySplit().' },
    { q: 'Type Inference in Java 8?', a: 'Compiler deduces types. Lambda: (String s) -> s.length() becomes s -> s.length().' },
    { q: 'Java 7 support Type Inference?', a: 'YES! Limited: Generic type inference in assignments, method calls. Enhanced in Java 8.' },
    { q: 'Internal Iteration?', a: 'Library controls iteration. stream.forEach(). Not external loop.' },
    { q: 'Internal vs External Iterator?', a: 'External: You control (Iterator, for loop). Internal: Library controls (forEach, stream).' },
    { q: 'Advantages of Internal Iterator?', a: 'Less code, library optimizes, enables parallel, more declarative.' },
    { q: 'When use Internal Iteration?', a: 'Processing collections, parallel operations, chained operations. Not for early termination.' },
    { q: 'Disadvantage of Internal Iteration?', a: 'Less control over iteration. Early termination harder. Cannot modify source in forEach.' },
    { q: 'Default method in Interface?', a: 'Method with body in interface. Use default keyword. Allows adding methods without breaking implementations.' },
    { q: 'Why need Default method?', a: 'Backward compatibility. Add methods to existing interfaces without breaking implementations.' },
    { q: 'Static method in Interface?', a: 'Called via InterfaceName.method(). Not inherited by implementing class. Utility methods for interface.' },
    { q: 'Date/Time API core ideas?', a: 'Immutable classes (Thread-safe), clear API, separate date/time, no inheritance, better timezone handling.' },
    { q: 'Advantages of new Date/Time API?', a: 'Immutable, thread-safe, clear API, better timezone, fluent API, parse/format separation.' },
    { q: 'Legacy vs Java 8 Date/Time API?', a: 'Legacy: Mutable (Date, Calendar), not thread-safe, poor API. Java 8: Immutable, thread-safe, better design.' },
    { q: 'Get duration between dates?', a: 'Duration.between(start, end) or Period.between(date1, date2) for date parts.' },
    { q: 'Arrays processing Java 8?', a: 'Arrays.parallelSort(), Arrays.setAll(), Arrays.stream(). Support lambda for element initialization.' },
    { q: 'Java 8 solves Diamond problem?', a: 'Class wins over interface default. If multiple interfaces, must resolve ambiguity with explicit override.' },
    { q: 'Predicate, Supplier, Consumer?', a: 'Predicate<T>: boolean test(T). Supplier<T>: T get(). Consumer<T>: void accept(T).' },
    { q: 'Default method without default keyword?', a: 'NO! Compiler error. Must use default keyword for method with body.' },
    { q: 'Same method in two Interfaces?', a: 'Must override in implementing class. Can call specific default: InterfaceName.super.methodName().' },
    { q: 'How Java 8 supports Multiple Inheritance?', a: 'Through default methods. Can inherit behavior from multiple interfaces. Resolves conflicts.' },
    { q: 'Which definition when class extends and implements?', a: 'Class wins. Parent class method takes precedence over interface default.' },
    { q: 'Which definition for parent and interface?', a: 'Class method > Interface default > Object class method. Must override if ambiguity.' },
    { q: 'Access static interface method via reference?', a: 'NO! Static interface methods not inherited. Call via InterfaceName.method().' },
    { q: 'Get Parameter name via Reflection?', a: 'Compile with -parameters flag. Then Method.getParameters() or Parameter.getName().' },
    { q: 'What is Optional?', a: 'Container for null. Optional<T>. Avoids NullPointerException. Methods: of(), ofNullable(), empty().' },
    { q: 'Uses of Optional?', a: 'Return null-safe values, Optional parameters, chain operations, orElse default.' },
    { q: 'Optional fallback method?', a: 'orElse(default), orElseGet(supplier), orElseThrow(exception).' },
    { q: 'Get current time Java 8?', a: 'LocalDateTime.now(), ZonedDateTime.now(), Instant.now().' },
    { q: 'Static method in Interface?', a: 'YES! Java 8+. Called InterfaceName.method(). Not inherited by implementing class.' },
    { q: 'Analyze class/package dependencies?', a: 'jdeps command. IDE dependency analysis. Apache Maven dependency plugin.' },
    { q: 'New JVM arguments Java 8?', a: '-XX:+UseG1GC, -XX:+UseStringDeduplication, -XX:MetaspaceSize, -XX:MaxMetaspaceSize.' },
    { q: 'Popular Java 8 annotations?', a: '@FunctionalInterface, @SafeVarargs, @Repeatable, @Deprecated with since/removal.' },
    { q: 'What is StringJoiner?', a: 'Java 8 utility to join strings with delimiter, prefix, suffix. Internally uses StringBuilder.' },
    { q: 'Type of Lambda expression?', a: 'Functional interface type. Compiler infers from context where Lambda is used.' },
    { q: 'Target type of Lambda?', a: 'The functional interface the Lambda is being assigned to. Compiler uses this for type inference.' },
    { q: 'Interface with default vs Abstract class?', a: 'Interface: Multiple inheritance, 100% abstract, no state. Abstract: Single inheritance, can have state.' },
    { q: 'What is Stream API?', a: 'Sequence of elements supporting aggregate operations. Pipeline: source → intermediate ops → terminal op.' },
    { q: 'Advantages of Stream API?', a: 'Concise, readable code, parallel processing, lazy evaluation, functional style.' },
    { q: 'Create a Stream?', a: 'Collection.stream(), Stream.of(), Arrays.stream(), Stream.generate(), Stream.iterate().' },
    { q: 'Intermediate and terminal operations?', a: 'Intermediate: filter, map, flatMap, sorted. Terminal: collect, forEach, reduce, count.' },
    { q: 'What is map() operation?', a: 'Transform each element. Returns new Stream with transformed elements.' },
    { q: 'How filtering works?', a: 'filter(predicate) keeps elements matching predicate. Creates new Stream with filtered elements.' },
    { q: 'Difference between collect() and reduce()?', a: 'collect(): Accumulates into collection or value. reduce(): Combines into single value.' }
  ];

  // Seed Java Fundamentals
  console.log('\nSeeding Java Fundamentals...');
  for (let i = 0; i < fundamentals.length; i++) {
    const post = fundamentals[i];
    const { error } = await supabase
      .from('posts')
      .upsert({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        code_snippet: post.codeSnippet,
        author: 'Subrat Ojha',
        category_id: jfCategoryId,
        read_time: '8 min',
        published: true,
        created_at: new Date().toISOString()
      }, { onConflict: 'slug' });

    if (error) console.log(`✗ ${post.title}: ${error.message}`);
    else console.log(`✓ ${i + 1}. ${post.title}`);
  }

  // Seed Interview Questions
  console.log('\nSeeding Java Interview Questions...');
  for (let i = 0; i < interviewQuestions.length; i++) {
    const q = interviewQuestions[i];
    const { error } = await supabase
      .from('posts')
      .upsert({
        title: q.q,
        slug: `interview-${String(i + 1).padStart(3, '0')}`,
        summary: q.a.substring(0, 100) + '...',
        content: `<h2>${q.q}</h2><p>${q.a}</p>`,
        author: 'Subrat Ojha',
        category_id: iqCategoryId,
        read_time: '3 min',
        published: true,
        created_at: new Date().toISOString()
      }, { onConflict: 'slug' });

    if (error) console.log(`✗ Q${i + 1}: ${error.message}`);
    else console.log(`✓ Q${i + 1}. ${q.q.substring(0, 50)}...`);
  }

  console.log('\n✅ Seeding complete!');
}

seedJavaQuestions().catch(console.error);
