import { Post } from '../types';

export const designPatternsPosts: Post[] = [
    // ==================== CREATIONAL PATTERNS ====================
    // 1. Singleton
    {
        id: 1,
        title: 'Singleton Pattern - One Instance Only',
        slug: 'singleton-pattern',
        summary: 'Ensure a class has only one instance and provide a global point of access to it.',
        content: `<h2>What is Singleton Pattern?</h2>
<p>The Singleton pattern ensures that a class has <strong>only one instance</strong> and provides a global point of access to that instance. It's like having a single president of a country - no matter how many times you ask, you always get the same person.</p>

<h3>Real-World Analogy</h3>
<p>Think of a <strong>Government</strong> class that should only have one instance. No matter which department asks for the government, they all get the same instance.</p>

<h3>Why Use Singleton?</h3>
<ul>
<li>Control shared resources (database connection, logger, configuration)</li>
<li>Lazy initialization saves memory</li>
<li>Thread safety ensures consistent behavior</li>
</ul>`,
        code_snippet: `public class President {
    // Private static instance - the single instance
    private static volatile President instance;
    
    // Private constructor - can't instantiate directly
    private President() {
        System.out.println("President elected!");
    }
    
    // Thread-safe getInstance method (Double-Checked Locking)
    public static President getInstance() {
        if (instance == null) {
            synchronized (President.class) {
                if (instance == null) {
                    instance = new President();
                }
            }
        }
        return instance;
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
        
        System.out.println(p1 == p2); // true - same instance!
        p1.giveSpeech();
    }
}`,
        author: 'Subrat Ojha',
        category_id: 1,
        read_time: '5 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 2. Factory Method
    {
        id: 2,
        title: 'Factory Method Pattern - Creating Objects Wisely',
        slug: 'factory-method-pattern',
        summary: 'Define an interface for creating objects but let subclasses decide which class to instantiate.',
        content: `<h2>What is Factory Method?</h2>
<p>The Factory Method pattern defines an interface for creating objects but lets <strong>subclasses decide</strong> which class to instantiate. It's like a pizza shop where you order "pizza" and the chef decides which type based on the order.</p>

<h3>Real-World Analogy</h3>
<p>Imagine a <strong>Document Editor</strong>. When you click "New", different document types (Word, PDF, Excel) are created by their respective applications.</p>

<h3>Key Benefits</h3>
<ul>
<li>Loose coupling - client code doesn't need to know concrete classes</li>
<li>Single Responsibility - object creation in one place</li>
<li>Open/Closed - add new products without breaking existing code</li>
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

// Creator (abstract)
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

// Usage
public class Main {
    public static void main(String[] args) {
        Dialog dialog = new WindowsDialog();
        dialog.render(); // Creates Windows button
    }
}`,
        author: 'Subrat Ojha',
        category_id: 1,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 3. Abstract Factory
    {
        id: 3,
        title: 'Abstract Factory - Family of Related Objects',
        slug: 'abstract-factory-pattern',
        summary: 'Create families of related objects without specifying concrete classes.',
        content: `<h2>What is Abstract Factory?</h2>
<p>Abstract Factory provides an interface for creating <strong>families of related objects</strong> without specifying their concrete classes. Think of it as a furniture store where you buy matching furniture sets.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Furniture Store</strong> that sells furniture in different styles (Modern, Victorian, ArtDeco). Each style includes matching Sofa, Chair, and Table.</p>

<h3>When to Use</h3>
<ul>
<li>System needs to work with multiple families of products</li>
<li>You want to enforce consistency among products</li>
<li>You want to hide concrete implementations from client</li>
</ul>`,
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
}`,
        author: 'Subrat Ojha',
        category_id: 1,
        read_time: '8 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 4. Builder
    {
        id: 4,
        title: 'Builder Pattern - Step-by-Step Construction',
        slug: 'builder-pattern',
        summary: 'Construct complex objects step by step, allowing different representations.',
        content: `<h2>What is Builder Pattern?</h2>
<p>Builder lets you construct complex objects <strong>step by step</strong>. It separates the construction of an object from its representation. Like ordering a burger - you choose each ingredient individually.</p>

<h3>Real-World Analogy</h3>
<p>Building a <strong>House</strong>. You can build a simple wooden house or a luxurious mansion using the same construction process but with different materials.</p>

<h3>Why Builder?</h3>
<ul>
<li>Construct objects requiring many optional parameters</li>
<li>Create different representations of the same construction</li>
<li>Single Responsibility - isolate complex construction code</li>
</ul>`,
        code_snippet: `// Product
public class House {
    private String foundation;
    private String structure;
    private String roof;
    private String interior;
    
    public void setFoundation(String foundation) { this.foundation = foundation; }
    public void setStructure(String structure) { this.structure = structure; }
    public void setRoof(String roof) { this.roof = roof; }
    public void setInterior(String interior) { this.interior = interior; }
    
    @Override
    public String toString() {
        return "House with: " + foundation + ", " + structure + 
               ", " + roof + ", " + interior;
    }
}

// Builder Interface
public interface HouseBuilder {
    void buildFoundation();
    void buildStructure();
    void buildRoof();
    void buildInterior();
    House getResult();
}

// Concrete Builders
public class WoodenHouseBuilder implements HouseBuilder {
    private House house = new House();
    
    public void buildFoundation() { house.setFoundation("Wooden"); }
    public void buildStructure() { house.setStructure("Wooden logs"); }
    public void buildRoof() { house.setRoof("Wooden shingles"); }
    public void buildInterior() { house.setInterior("Rustic wood panels"); }
    public House getResult() { return house; }
}

public class LuxuryHouseBuilder implements HouseBuilder {
    private House house = new House();
    
    public void buildFoundation() { house.setFoundation("Concrete"); }
    public void buildStructure() { house.setStructure("Steel & bricks"); }
    public void buildRoof() { house.setRoof("Marble tiles"); }
    public void buildInterior() { house.setInterior("Italian marble"); }
    public House getResult() { return house; }
}

// Director
public class ConstructionEngineer {
    private HouseBuilder builder;
    
    public ConstructionEngineer(HouseBuilder builder) {
        this.builder = builder;
    }
    
    public void constructHouse() {
        builder.buildFoundation();
        builder.buildStructure();
        builder.buildRoof();
        builder.buildInterior();
    }
    
    public House getHouse() {
        return builder.getResult();
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        HouseBuilder woodenBuilder = new WoodenHouseBuilder();
        ConstructionEngineer engineer = new ConstructionEngineer(woodenBuilder);
        engineer.constructHouse();
        System.out.println(engineer.getHouse());
    }
}`,
        author: 'Subrat Ojha',
        category_id: 1,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 5. Prototype
    {
        id: 5,
        title: 'Prototype Pattern - Cloning Made Easy',
        slug: 'prototype-pattern',
        summary: 'Create new objects by copying existing ones without coupling to their classes.',
        content: `<h2>What is Prototype Pattern?</h2>
<p>Prototype lets you create new objects by <strong>cloning</strong> existing ones. It's like photocopying a document - you get an exact copy without knowing how the original was made.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Cookie Cutter</strong>. You make one cookie shape, then use it to create identical cookies. Each cookie is a clone of the prototype.</p>

<h3>When to Use</h3>
<ul>
<li>Object creation is expensive (database calls, network requests)</li>
<li>Avoid subclass explosion for factories</li>
<li>Objects have many configuration combinations</li>
</ul>`,
        code_snippet: `// Prototype Interface
public interface Cloneable {
    Cloneable clone();
}

// Concrete Prototype
public class Sheep implements Cloneable {
    private String name;
    private String color;
    private int age;
    
    public Sheep(String name, String color, int age) {
        this.name = name;
        this.color = color;
        this.age = age;
    }
    
    public void setName(String name) { this.name = name; }
    public String getName() { return name; }
    
    @Override
    public Sheep clone() {
        return new Sheep(this.name + "_clone", this.color, this.age);
    }
    
    @Override
    public String toString() {
        return "Sheep{name='" + name + "', color='" + color + "', age=" + age + "}";
    }
}

// Prototype Registry
public class SheepRegistry {
    private Map<String, Sheep> prototypes = new HashMap<>();
    
    public SheepRegistry() {
        prototypes.put("dolly", new Sheep("Dolly", "white", 5));
        prototypes.put("shaun", new Sheep("Shaun", "black", 3));
    }
    
    public Sheep getClone(String type) {
        return prototypes.get(type).clone();
    }
    
    public void addPrototype(String key, Sheep sheep) {
        prototypes.put(key, sheep);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        SheepRegistry registry = new SheepRegistry();
        
        Sheep dollyClone = registry.getClone("dolly");
        System.out.println("Cloned: " + dollyClone);
    }
}`,
        author: 'Subrat Ojha',
        category_id: 1,
        read_time: '6 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },

    // ==================== STRUCTURAL PATTERNS ====================
    // 6. Adapter
    {
        id: 6,
        title: 'Adapter Pattern - Making Things Compatible',
        slug: 'adapter-pattern',
        summary: 'Convert the interface of a class into another interface clients expect.',
        content: `<h2>What is Adapter Pattern?</h2>
<p>Adapter allows incompatible interfaces to work together. It's like a <strong>power adapter</strong> that lets you plug a European device into an American socket.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Memory Card Reader</strong>. Your computer has USB, but your camera uses SD card. The reader adapts the SD card to work with USB.</p>

<h3>Types of Adapters</h3>
<ul>
<li><strong>Class Adapter</strong> - Uses inheritance (extends the adaptee)</li>
<li><strong>Object Adapter</strong> - Uses composition (contains the adaptee)</li>
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
        }
    }
}

// Client - uses MediaPlayer interface
public class AudioPlayer implements MediaPlayer {
    private MediaAdapter adapter;
    
    @Override
    public void play(String filename) {
        if (filename.endsWith(".mp3")) {
            System.out.println("Playing MP3: " + filename);
        } else if (filename.endsWith(".mp4") || filename.endsWith(".vlc")) {
            adapter = new MediaAdapter(filename.substring(filename.lastIndexOf(".") + 1));
            adapter.play(filename);
        } else {
            System.out.println("Invalid format");
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        AudioPlayer player = new AudioPlayer();
        player.play("song.mp3");        // Direct MP3
        player.play("movie.mp4");       // Via adapter
        player.play("video.vlc");      // Via adapter
    }
}`,
        author: 'Subrat Ojha',
        category_id: 2,
        read_time: '6 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 7. Bridge
    {
        id: 7,
        title: 'Bridge Pattern - Decouple Abstraction from Implementation',
        slug: 'bridge-pattern',
        summary: 'Decouple an abstraction from its implementation so both can vary independently.',
        content: `<h2>What is Bridge Pattern?</h2>
<p>Bridge separates an <strong>abstraction</strong> from its <strong>implementation</strong> so both can change independently. Like remote controls (abstraction) working with TVs (implementation) - you can mix any remote with any TV.</p>

<h3>Real-World Analogy</h3>
<p><strong>Remote Controls</strong> and <strong>Devices</strong>. A TV remote can work with any TV brand. The remote's buttons (abstraction) don't care about the TV's internals (implementation).</p>

<h3>Problem it Solves</h3>
<ul>
<li>Avoid class explosion from two independent dimensions</li>
<li>Client code works with high-level abstractions</li>
<li>Both dimensions can evolve independently</li>
</ul>`,
        code_snippet: `// Implementation interface
public interface Device {
    boolean isEnabled();
    void enable();
    void disable();
    int getVolume();
    void setVolume(int percent);
}

// Concrete implementations
public class TV implements Device {
    private boolean on = false;
    private int volume = 30;
    
    public boolean isEnabled() { return on; }
    public void enable() { on = true; }
    public void disable() { on = false; }
    public int getVolume() { return volume; }
    public void setVolume(int percent) { this.volume = Math.max(0, Math.min(100, percent)); }
}

public class Radio implements Device {
    private boolean on = false;
    private int volume = 20;
    
    public boolean isEnabled() { return on; }
    public void enable() { on = true; }
    public void disable() { on = false; }
    public int getVolume() { return volume; }
    public void setVolume(int percent) { this.volume = Math.max(0, Math.min(100, percent)); }
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
}

// Refined abstraction
public class AdvancedRemote extends RemoteControl {
    public AdvancedRemote(Device device) { super(device); }
    
    public void mute() { device.setVolume(0); }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Device tv = new TV();
        RemoteControl remote = new AdvancedRemote(tv);
        
        remote.togglePower();
        remote.volumeUp();
        remote.volumeUp();
        remote.mute();
        
        Device radio = new Radio();
        RemoteControl radioRemote = new AdvancedRemote(radio);
        radioRemote.togglePower();
    }
}`,
        author: 'Subrat Ojha',
        category_id: 2,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 8. Composite
    {
        id: 8,
        title: 'Composite Pattern - Tree Structures Made Simple',
        slug: 'composite-pattern',
        summary: 'Compose objects into tree structures to represent part-whole hierarchies.',
        content: `<h2>What is Composite Pattern?</h2>
<p>Composite lets you compose objects into <strong>tree structures</strong> and work with them uniformly. Individual objects and compositions are treated the same way.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>File System</strong>. Files and Folders look the same to users. You can have files inside folders, and folders inside other folders.</p>

<h3>Key Concept</h3>
<ul>
<li><strong>Component</strong> - Common interface for all elements</li>
<li><strong>Leaf</strong> - Individual objects (File)</li>
<li><strong>Composite</strong> - Container objects (Folder)</li>
</ul>`,
        code_snippet: `// Component
public interface FileSystemComponent {
    String getName();
    long getSize();
    void print(String indent);
}

// Leaf
public class File implements FileSystemComponent {
    private String name;
    private long size;
    
    public File(String name, long size) {
        this.name = name;
        this.size = size;
    }
    
    public String getName() { return name; }
    public long getSize() { return size; }
    public void print(String indent) {
        System.out.println(indent + "- " + name + " (" + size + " KB)");
    }
}

// Composite
import java.util.ArrayList;
import java.util.List;

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
    
    public long getSize() {
        return children.stream().mapToLong(FileSystemComponent::getSize).sum();
    }
    
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
        Folder root = new Folder("root");
        Folder docs = new Folder("documents");
        Folder pics = new Folder("pictures");
        
        File resume = new File("resume.pdf", 150);
        File photo = new File("photo.jpg", 2048);
        File report = new File("report.docx", 500);
        
        docs.add(resume);
        docs.add(report);
        pics.add(photo);
        
        root.add(docs);
        root.add(pics);
        
        root.print("");
        System.out.println("\\nTotal size: " + root.getSize() + " KB");
    }
}`,
        author: 'Subrat Ojha',
        category_id: 2,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 9. Decorator
    {
        id: 9,
        title: 'Decorator Pattern - Add Features Dynamically',
        slug: 'decorator-pattern',
        summary: 'Attach additional responsibilities to objects dynamically without altering their class.',
        content: `<h2>What is Decorator Pattern?</h2>
<p>Decorator lets you add behavior to objects <strong>dynamically</strong> by wrapping them. Like adding toppings to a pizza - the base pizza stays the same, but you can add extra toppings.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>coffee shop</strong>. You start with plain coffee, then add milk, sugar, whipped cream - each addition wraps the previous drink.</p>

<h3>Benefits</h3>
<ul>
<li>Add responsibilities without subclassing</li>
<li>Add/remove responsibilities at runtime</li>
<li>Combine behaviors by wrapping in multiple decorators</li>
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

// Usage
public class Main {
    public static void main(String[] args) {
        Coffee coffee = new SimpleCoffee();
        System.out.println(coffee.getDescription() + " = $" + coffee.getCost());
        
        coffee = new MilkDecorator(coffee);
        System.out.println(coffee.getDescription() + " = $" + coffee.getCost());
        
        coffee = new SugarDecorator(coffee);
        System.out.println(coffee.getDescription() + " = $" + coffee.getCost());
        
        coffee = new WhipDecorator(coffee);
        System.out.println(coffee.getDescription() + " = $" + coffee.getCost());
    }
}`,
        author: 'Subrat Ojha',
        category_id: 2,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 10. Facade
    {
        id: 10,
        title: 'Facade Pattern - Simplify Complex Systems',
        slug: 'facade-pattern',
        summary: 'Provide a simplified interface to a complex subsystem.',
        content: `<h2>What is Facade Pattern?</h2>
<p>Facade provides a simple interface to a <strong>complex subsystem</strong>. It's like the reception desk at a hotel - you talk to one person instead of managing all departments yourself.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Home Theater System</strong>. Instead of turning on TV, speakers, receiver, and DVD player separately, you just press "Watch Movie" on one remote.</p>

<h3>When to Use</h3>
<ul>
<li>Provide simple interface to complex functionality</li>
<li>Layer your subsystem using facades</li>
<li>Reduce dependencies on subsystem internals</li>
</ul>`,
        code_snippet: `// Complex subsystem classes
public class Amplifier {
    public void on() { System.out.println("Amplifier ON"); }
    public void off() { System.out.println("Amplifier OFF"); }
    public void setSurround() { System.out.println("Surround sound"); }
}

public class DvdPlayer {
    public void on() { System.out.println("DVD Player ON"); }
    public void off() { System.out.println("DVD Player OFF"); }
    public void play(String movie) { System.out.println("Playing: " + movie); }
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
    public void dim(int level) { System.out.println("Lights at " + level + "%"); }
}

// Facade
public class HomeTheaterFacade {
    private Amplifier amp;
    private DvdPlayer dvd;
    private Projector projector;
    private Screen screen;
    private Lights lights;
    
    public HomeTheaterFacade(Amplifier amp, DvdPlayer dvd, 
                             Projector projector, Screen screen, Lights lights) {
        this.amp = amp;
        this.dvd = dvd;
        this.projector = projector;
        this.screen = screen;
        this.lights = lights;
    }
    
    public void watchMovie(String movie) {
        System.out.println("\\n--- Starting Movie Mode ---");
        lights.dim(10);
        screen.down();
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setSurround();
        dvd.on();
        dvd.play(movie);
    }
    
    public void endMovie() {
        System.out.println("\\n--- Ending Movie Mode ---");
        dvd.off();
        amp.off();
        projector.off();
        screen.up();
        lights.dim(100);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Amplifier amp = new Amplifier();
        DvdPlayer dvd = new DvdPlayer();
        Projector projector = new Projector();
        Screen screen = new Screen();
        Lights lights = new Lights();
        
        HomeTheaterFacade theater = new HomeTheaterFacade(
            amp, dvd, projector, screen, lights);
        
        theater.watchMovie("Inception");
        theater.endMovie();
    }
}`,
        author: 'Subrat Ojha',
        category_id: 2,
        read_time: '6 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 11. Flyweight
    {
        id: 11,
        title: 'Flyweight Pattern - Share Common Data',
        slug: 'flyweight-pattern',
        summary: 'Use sharing to support large numbers of fine-grained objects efficiently.',
        content: `<h2>What is Flyweight Pattern?</h2>
<p>Flyweight minimizes memory by sharing <strong>common data</strong> among multiple objects. It's like a text editor sharing character objects instead of creating new ones for each letter.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Forest of Trees</strong>. Instead of creating a unique tree object for each tree (thousands of objects), share tree type data and only create unique positions.</p>

<h3>Intrinsic vs Extrinsic State</h3>
<ul>
<li><strong>Intrinsic</strong> - Shared, immutable data (tree type, color)</li>
<li><strong>Extrinsic</strong> - Unique data per instance (position, age)</li>
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
}

// Flyweight Factory
import java.util.HashMap;
import java.util.Map;

public class TreeFactory {
    private static Map<String, TreeType> treeTypes = new HashMap<>();
    
    public static TreeType getTreeType(String name, String color, String texture) {
        String key = name + "_" + color + "_" + texture;
        
        if (!treeTypes.containsKey(key)) {
            treeTypes.put(key, new TreeType(name, color, texture));
            System.out.println("Created new TreeType: " + name);
        }
        
        return treeTypes.get(key);
    }
    
    public static int getTypeCount() {
        return treeTypes.size();
    }
}

// Context - extrinsic state
public class Tree {
    private int x, y;
    private TreeType type;
    
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
        
        // Plant 1000 trees, but only create 3 TreeTypes!
        for (int i = 0; i < 1000; i++) {
            if (i % 3 == 0) {
                forest.plantTree(i, i, "Oak", "Green", "oak.png");
            } else if (i % 3 == 1) {
                forest.plantTree(i, i, "Pine", "DarkGreen", "pine.png");
            } else {
                forest.plantTree(i, i, "Maple", "Red", "maple.png");
            }
        }
        
        System.out.println("\\nTrees planted: " + forest.getTreeCount());
        System.out.println("Unique TreeTypes: " + TreeFactory.getTypeCount());
    }
}`,
        author: 'Subrat Ojha',
        category_id: 2,
        read_time: '8 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 12. Proxy
    {
        id: 12,
        title: 'Proxy Pattern - Control Access to Objects',
        slug: 'proxy-pattern',
        summary: 'Provide a surrogate or placeholder for another object to control access to it.',
        content: `<h2>What is Proxy Pattern?</h2>
<p>Proxy provides a <strong>placeholder</strong> for another object to control access to it. It's like a security guard controlling access to a building.</p>

<h3>Types of Proxies</h3>
<ul>
<li><strong>Remote</strong> - Access objects on different machines</li>
<li><strong>Virtual</strong> - Lazy initialization (expensive objects)</li>
<li><strong>Protection</strong> - Access control</li>
<li><strong>Smart</strong> - Additional actions on access</li>
</ul>`,
        code_snippet: `// Subject interface
public interface Image {
    void display();
}

// Real Subject
public class RealImage implements Image {
    private String filename;
    
    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("Loading high-resolution image: " + filename);
    }
    
    public void display() {
        System.out.println("Displaying: " + filename);
    }
}

// Virtual Proxy - lazy loading
public class ImageProxy implements Image {
    private RealImage realImage;
    private String filename;
    
    public ImageProxy(String filename) {
        this.filename = filename;
    }
    
    public void display() {
        if (realImage == null) {
            // Load only when needed
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

// Protection Proxy
public class SecuredImage implements Image {
    private RealImage realImage;
    private String userRole;
    
    public SecuredImage(String filename, String userRole) {
        this.realImage = new RealImage(filename);
        this.userRole = userRole;
    }
    
    public void display() {
        if ("ADMIN".equals(userRole)) {
            realImage.display();
        } else {
            System.out.println("Access denied! Admin role required.");
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        System.out.println("--- Virtual Proxy (Lazy Loading) ---");
        Image image = new ImageProxy("photo.jpg");
        System.out.println("Image proxy created (not loaded yet)");
        image.display(); // Loads here
        image.display(); // Uses cached
        
        System.out.println("\\n--- Protection Proxy (Access Control) ---");
        Image adminImage = new SecuredImage("secret.jpg", "ADMIN");
        Image userImage = new SecuredImage("secret.jpg", "USER");
        
        adminImage.display(); // Works
        userImage.display();  // Denied
    }
}`,
        author: 'Subrat Ojha',
        category_id: 2,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },

    // ==================== BEHAVIORAL PATTERNS ====================
    // 13. Chain of Responsibility
    {
        id: 13,
        title: 'Chain of Responsibility - Pass Requests Along',
        slug: 'chain-of-responsibility-pattern',
        summary: 'Pass requests along a chain of handlers until one handles it.',
        content: `<h2>What is Chain of Responsibility?</h2>
<p>Chain of Responsibility passes requests along a <strong>chain of handlers</strong>. Each handler decides to process the request or pass it to the next one. Like a help desk escalation system.</p>

<h3>Real-World Analogy</h3>
<p><strong>Support Ticket System</strong>: Level 1 Support → Level 2 Support → Manager → Director. Each level handles what it can, escalates what it can't.</p>

<h3>Benefits</h3>
<ul>
<li>Control order of request handling</li>
<li>Single Responsibility - decouple sender and receiver</li>
<li>Open/Closed - add new handlers without breaking code</li>
</ul>`,
        code_snippet: `// Handler interface
public abstract class SupportHandler {
    protected SupportHandler nextHandler;
    
    public void setNextHandler(SupportHandler handler) {
        this.nextHandler = handler;
    }
    
    public abstract void handleRequest(SupportTicket ticket);
}

// Concrete handlers
public class Level1Support extends SupportHandler {
    public void handleRequest(SupportTicket ticket) {
        if (ticket.getLevel() <= 1) {
            System.out.println("Level 1 resolved: " + ticket.getIssue());
        } else if (nextHandler != null) {
            System.out.println("Level 1 escalating...");
            nextHandler.handleRequest(ticket);
        }
    }
}

public class Level2Support extends SupportHandler {
    public void handleRequest(SupportTicket ticket) {
        if (ticket.getLevel() <= 2) {
            System.out.println("Level 2 resolved: " + ticket.getIssue());
        } else if (nextHandler != null) {
            System.out.println("Level 2 escalating...");
            nextHandler.handleRequest(ticket);
        }
    }
}

public class ManagerSupport extends SupportHandler {
    public void handleRequest(SupportTicket ticket) {
        System.out.println("Manager resolved: " + ticket.getIssue());
    }
}

// Request
public class SupportTicket {
    private String issue;
    private int level;
    
    public SupportTicket(String issue, int level) {
        this.issue = issue;
        this.level = level;
    }
    
    public String getIssue() { return issue; }
    public int getLevel() { return level; }
}

// Usage
public class Main {
    public static void main(String[] args) {
        SupportHandler level1 = new Level1Support();
        SupportHandler level2 = new Level2Support();
        SupportHandler manager = new ManagerSupport();
        
        level1.setNextHandler(level2);
        level2.setNextHandler(manager);
        
        SupportTicket ticket1 = new SupportTicket("Password reset", 1);
        SupportTicket ticket2 = new SupportTicket("Database access", 2);
        SupportTicket ticket3 = new SupportTicket("Budget approval", 3);
        
        level1.handleRequest(ticket1);
        level1.handleRequest(ticket2);
        level1.handleRequest(ticket3);
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '6 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 14. Command
    {
        id: 14,
        title: 'Command Pattern - Encapsulate Operations',
        slug: 'command-pattern',
        summary: 'Encapsulate requests as objects, allowing parameterization and queuing.',
        content: `<h2>What is Command Pattern?</h2>
<p>Command encapsulates a request as an <strong>object</strong>. This lets you parameterize objects with operations, queue requests, and support undo operations.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Restaurant Order</strong>. The waiter writes your order (Command) and gives it to the kitchen. The kitchen doesn't know who ordered - just executes the command.</p>

<h3>Use Cases</h3>
<ul>
<li>Undo/Redo functionality</li>
<li>Queuing operations</li>
<li>Macro recording</li>
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
    
    public Light(String location) { this.location = location; }
    
    public void on() {
        isOn = true;
        System.out.println(location + " light is ON");
    }
    
    public void off() {
        isOn = false;
        System.out.println(location + " light is OFF");
    }
    
    public boolean isOn() { return isOn; }
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

// Invoker
public class RemoteControl {
    private Command[] onCommands;
    private Command[] offCommands;
    private Command lastCommand;
    
    public RemoteControl() {
        onCommands = new Command[2];
        offCommands = new Command[2];
    }
    
    public void setCommand(int slot, Command on, Command off) {
        onCommands[slot] = on;
        offCommands[slot] = off;
    }
    
    public void onButtonPressed(int slot) {
        onCommands[slot].execute();
        lastCommand = onCommands[slot];
    }
    
    public void offButtonPressed(int slot) {
        offCommands[slot].execute();
        lastCommand = offCommands[slot];
    }
    
    public void undoButtonPressed() {
        if (lastCommand != null) {
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
        
        remote.onButtonPressed(0);
        remote.offButtonPressed(0);
        remote.undoButtonPressed();
        
        remote.onButtonPressed(1);
        remote.undoButtonPressed();
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 15. Iterator
    {
        id: 15,
        title: 'Iterator Pattern - Traverse Collections',
        slug: 'iterator-pattern',
        summary: 'Provide a way to access elements of a collection sequentially without exposing structure.',
        content: `<h2>What is Iterator Pattern?</h2>
<p>Iterator provides a way to access elements of a collection <strong>sequentially</strong> without knowing its underlying structure. Like a music playlist - you just use next/previous buttons.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Music Playlist</strong>. You can browse songs with next/previous without knowing if it's a playlist, album, or queue.</p>

<h3>Key Methods</h3>
<ul>
<li><code>hasNext()</code> - Check if more elements</li>
<li><code>next()</code> - Get next element</li>
<li><code>remove()</code> - Optional: remove element</li>
</ul>`,
        code_snippet: `// Iterator interface
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

// Aggregate interface
public interface Collection<T> {
    Iterator<T> createIterator();
}

// Concrete Iterator
public class ArrayIterator<T> implements Iterator<T> {
    private T[] array;
    private int position = 0;
    
    public ArrayIterator(T[] array) { this.array = array; }
    
    public boolean hasNext() { return position < array.length; }
    
    public T next() {
        if (!hasNext()) throw new NoSuchElementException();
        return array[position++];
    }
}

// Concrete Collection
public class NameCollection implements Collection<String> {
    private String[] names = {"Alice", "Bob", "Charlie"};
    
    public Iterator<String> createIterator() {
        return new ArrayIterator<>(names);
    }
    
    public int getSize() { return names.length; }
}

// Java built-in Iterator
import java.util.Iterator;
import java.util.Arrays;

public class JavaIteratorDemo {
    public static void main(String[] args) {
        Collection<String> collection = new NameCollection();
        Iterator<String> iterator = collection.createIterator();
        
        System.out.println("Using Custom Iterator:");
        while (iterator.hasNext()) {
            System.out.println("  " + iterator.next());
        }
        
        System.out.println("\\nUsing Java's Enhanced For:");
        for (String name : Arrays.asList("Alice", "Bob", "Charlie")) {
            System.out.println("  " + name);
        }
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '6 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 16. Mediator
    {
        id: 16,
        title: 'Mediator Pattern - Centralize Communication',
        slug: 'mediator-pattern',
        summary: 'Reduce chaotic dependencies by having objects communicate via a mediator.',
        content: `<h2>What is Mediator Pattern?</h2>
<p>Mediator defines an object that <strong>centralizes communication</strong> between objects. Instead of objects talking directly, they talk through the mediator.</p>

<h3>Real-World Analogy</h3>
<p>An <strong>Air Traffic Control Tower</strong>. Planes don't talk to each other directly - they communicate through the tower to avoid collisions.</p>

<h3>Benefits</h3>
<ul>
<li>Reduce coupling between objects</li>
<li>Centralize control logic</li>
<li>Make collaboration easier to understand</li>
</ul>`,
        code_snippet: `// Mediator interface
public interface ChatMediator {
    void sendMessage(String message, User sender);
    void addUser(User user);
}

// Colleague
public class User {
    private String name;
    private ChatMediator mediator;
    
    public User(String name, ChatMediator mediator) {
        this.name = name;
        this.mediator = mediator;
    }
    
    public String getName() { return name; }
    
    public void send(String message) {
        System.out.println(name + " sends: " + message);
        mediator.sendMessage(message, this);
    }
    
    public void receive(String message, User sender) {
        System.out.println(name + " received from " + sender.getName() + ": " + message);
    }
}

// Concrete Mediator
import java.util.ArrayList;
import java.util.List;

public class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();
    
    public void addUser(User user) {
        users.add(user);
        System.out.println(user.getName() + " joined the chat");
    }
    
    public void sendMessage(String message, User sender) {
        // Broadcast to all users except sender
        for (User user : users) {
            if (user != sender) {
                user.receive(message, sender);
            }
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        ChatMediator chatRoom = new ChatRoom();
        
        User alice = new User("Alice", chatRoom);
        User bob = new User("Bob", chatRoom);
        User charlie = new User("Charlie", chatRoom);
        
        chatRoom.addUser(alice);
        chatRoom.addUser(bob);
        chatRoom.addUser(charlie);
        
        System.out.println("");
        alice.send("Hello everyone!");
        System.out.println("");
        bob.send("Hi Alice!");
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '6 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 17. Memento
    {
        id: 17,
        title: 'Memento Pattern - Save and Restore State',
        slug: 'memento-pattern',
        summary: 'Capture and externalize an object\'s state for later restoration without breaking encapsulation.',
        content: `<h2>What is Memento Pattern?</h2>
<p>Memento captures and stores an object's internal state so it can be <strong>restored later</strong> without violating encapsulation. Like a game save point.</p>

<h3>Real-World Analogy</h3>
<p><strong>Game Save System</strong>. You save your game progress (Memento), then continue playing. If you need to, you can restore to that exact saved state.</p>

<h3>Components</h3>
<ul>
<li><strong>Memento</strong> - Stores the state</li>
<li><strong>Originator</strong> - Creates/restores memento</li>
<li><strong>Caretaker</strong> - Keeps the memento safe</li>
</ul>`,
        code_snippet: `// Memento - stores internal state
public class GameMemento {
    private int level;
    private int health;
    private int score;
    
    public GameMemento(int level, int health, int score) {
        this.level = level;
        this.health = health;
        this.score = score;
    }
    
    public int getLevel() { return level; }
    public int getHealth() { return health; }
    public int getScore() { return score; }
}

// Originator - creates and restores mementos
public class Game {
    private int level;
    private int health;
    private int score;
    
    public Game(int level, int health, int score) {
        this.level = level;
        this.health = health;
        this.score = score;
    }
    
    public void play() {
        System.out.println("Playing... Level: " + level);
        score += 100;
        health -= 10;
        System.out.println("Current state - Level: " + level + 
                          ", Health: " + health + ", Score: " + score);
    }
    
    public GameMemento save() {
        System.out.println("Saving game...");
        return new GameMemento(level, health, score);
    }
    
    public void restore(GameMemento memento) {
        this.level = memento.getLevel();
        this.health = memento.getHealth();
        this.score = memento.getScore();
        System.out.println("Game restored - Level: " + level + 
                          ", Health: " + health + ", Score: " + score);
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
    
    public void loadGame() {
        if (!saves.isEmpty()) {
            game.restore(saves.pop());
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Game game = new Game(1, 100, 0);
        SaveManager saveManager = new SaveManager(game);
        
        game.play();
        saveManager.saveGame();
        
        game.play();
        game.play();
        
        System.out.println("\\n--- Loading last save ---");
        saveManager.loadGame();
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 18. Observer
    {
        id: 18,
        title: 'Observer Pattern - Notify Changes',
        slug: 'observer-pattern',
        summary: 'Define a subscription mechanism to notify multiple objects about any events.',
        content: `<h2>What is Observer Pattern?</h2>
<p>Observer defines a <strong>subscription mechanism</strong> to notify multiple objects about any events in the subject they are observing.</p>

<h3>Real-World Analogy</h3>
<p><strong>YouTube Subscription</strong>. When a channel uploads new content, all subscribers get notified. You subscribe/unsubscribe anytime.</p>

<h3>Also Known As</h3>
<ul>
<li>Pub/Sub (Publish-Subscribe)</li>
<li>Event-Listener</li>
<li>Dependents</li>
</ul>`,
        code_snippet: `// Observer interface
public interface Observer {
    void update(String stockSymbol, double price);
}

// Subject interface
public interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

// Concrete Subject
import java.util.ArrayList;
import java.util.List;

public class Stock implements Subject {
    private String symbol;
    private double price;
    private List<Observer> observers = new ArrayList<>();
    
    public Stock(String symbol, double price) {
        this.symbol = symbol;
        this.price = price;
    }
    
    public void setPrice(double newPrice) {
        this.price = newPrice;
        System.out.println("Stock " + symbol + " updated to $" + newPrice);
        notifyObservers();
    }
    
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    public void detach(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(symbol, price);
        }
    }
}

// Concrete Observers
public class MobileApp implements Observer {
    private String name;
    
    public MobileApp(String name) { this.name = name; }
    
    public void update(String stockSymbol, double price) {
        System.out.println("[" + name + "] Mobile Alert: " + 
                          stockSymbol + " is now $" + price);
    }
}

public class WebApp implements Observer {
    private String name;
    
    public WebApp(String name) { this.name = name; }
    
    public void update(String stockSymbol, double price) {
        System.out.println("[" + name + "] Web Update: " + 
                          stockSymbol + " trading at $" + price);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Stock appleStock = new Stock("AAPL", 150.00);
        
        Observer mobile1 = new MobileApp("iPhone App");
        Observer mobile2 = new MobileApp("Android App");
        Observer web = new WebApp("TradingWebsite");
        
        appleStock.attach(mobile1);
        appleStock.attach(mobile2);
        appleStock.attach(web);
        
        System.out.println("--- Price Update 1 ---");
        appleStock.setPrice(155.50);
        
        System.out.println("\\n--- Price Update 2 ---");
        appleStock.detach(mobile2);
        appleStock.setPrice(160.00);
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 19. State
    {
        id: 19,
        title: 'State Pattern - Change Behavior Based on State',
        slug: 'state-pattern',
        summary: 'Allow an object to alter its behavior when its internal state changes.',
        content: `<h2>What is State Pattern?</h2>
<p>State allows an object to <strong>change its behavior</strong> when its internal state changes. The object will appear to change its class.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Vending Machine</strong>. Depending on its state (no money, has money, sold out), pressing the button does different things.</p>

<h3>State vs Strategy</h3>
<ul>
<li><strong>State</strong> - Object's behavior depends on internal state; clients may not know states exist</li>
<li><strong>Strategy</strong> - Client explicitly chooses algorithm; states are independent</li>
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
    
    public void insertCoin(int amount) {
        currentState.insertCoin(amount);
    }
    
    public void pressButton() {
        currentState.pressButton();
    }
    
    public void dispense() {
        currentState.dispense();
    }
    
    public void setState(State state) { this.currentState = state; }
    public State getNoCoinState() { return noCoinState; }
    public State getHasCoinState() { return hasCoinState; }
    public State getSoldOutState() { return soldOutState; }
    
    public void addCoin(int amount) { coinAmount += amount; }
    public int getCoinAmount() { return coinAmount; }
    public void resetCoin() { coinAmount = 0; }
    public void reduceInventory() { inventory--; }
    public int getInventory() { return inventory; }
}

// Concrete States
public class NoCoinState implements State {
    private VendingMachine vm;
    
    public NoCoinState(VendingMachine vm) { this.vm = vm; }
    
    public void insertCoin(int amount) {
        vm.addCoin(amount);
        vm.setState(vm.getHasCoinState());
        System.out.println("Coin inserted. Total: " + vm.getCoinAmount());
    }
    
    public void pressButton() {
        System.out.println("Insert coin first!");
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
        System.out.println("Added coin. Total: " + vm.getCoinAmount());
    }
    
    public void pressButton() {
        if (vm.getInventory() > 0) {
            vm.setState(new SoldState(vm));
            vm.dispense();
        } else {
            vm.setState(vm.getSoldOutState());
            System.out.println("Sold out!");
        }
    }
    
    public void dispense() { System.out.println("Press button first!"); }
}

public class SoldState implements State {
    private VendingMachine vm;
    
    public SoldState(VendingMachine vm) { this.vm = vm; }
    
    public void insertCoin(int amount) { System.out.println("Wait for current item!"); }
    public void pressButton() { System.out.println("Already dispensing!"); }
    
    public void dispense() {
        System.out.println("Dispensing item...");
        vm.reduceInventory();
        vm.resetCoin();
        vm.setState(vm.getNoCoinState());
    }
}

public class SoldOutState implements State {
    private VendingMachine vm;
    
    public SoldOutState(VendingMachine vm) { this.vm = vm; }
    
    public void insertCoin(int amount) { System.out.println("No items available!"); }
    public void pressButton() { System.out.println("No items available!"); }
    public void dispense() { System.out.println("No items available!"); }
}

// Usage
public class Main {
    public static void main(String[] args) {
        VendingMachine vm = new VendingMachine();
        
        vm.pressButton();           // No coin
        vm.insertCoin(10);          // Insert coin
        vm.pressButton();           // Buy item
        vm.insertCoin(10);          // Insert more
        vm.insertCoin(5);
        vm.pressButton();           // Buy another
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '8 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 20. Strategy
    {
        id: 20,
        title: 'Strategy Pattern - Interchangeable Algorithms',
        slug: 'strategy-pattern',
        summary: 'Define a family of algorithms, encapsulate each one, and make them interchangeable.',
        content: `<h2>What is Strategy Pattern?</h2>
<p>Strategy defines a family of algorithms, <strong>encapsulates each one</strong>, and makes them interchangeable. The algorithm can be swapped at runtime.</p>

<h3>Real-World Analogy</h3>
<p><strong>Travel Planning</strong>. You can choose to travel by Car, Bike, or Train. The destination is the same, but the route/algorithm changes based on your choice.</p>

<h3>When to Use</h3>
<ul>
<li>Multiple algorithms for a specific task</li>
<li>Switch algorithms at runtime</li>
<li>Isolate business logic from implementation details</li>
</ul>`,
        code_snippet: `// Strategy interface
public interface PaymentStrategy {
    void pay(double amount);
}

// Concrete Strategies
public class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    
    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " with Credit Card ending " + 
                          cardNumber.substring(cardNumber.length() - 4));
    }
}

public class PayPalPayment implements PaymentStrategy {
    private String email;
    
    public PayPalPayment(String email) {
        this.email = email;
    }
    
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " via PayPal to " + email);
    }
}

public class CryptoPayment implements PaymentStrategy {
    private String walletAddress;
    
    public CryptoPayment(String walletAddress) {
        this.walletAddress = walletAddress;
    }
    
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " in crypto to wallet " + walletAddress);
    }
}

// Context
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    private PaymentStrategy paymentStrategy;
    
    public void addItem(Item item) { items.add(item); }
    
    public double getTotal() {
        return items.stream().mapToDouble(Item::getPrice).sum();
    }
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout() {
        double total = getTotal();
        System.out.println("Total: $" + total);
        paymentStrategy.pay(total);
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
}

// Usage
public class Main {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.addItem(new Item("Laptop", 999.99));
        cart.addItem(new Item("Mouse", 29.99));
        
        // Pay with Credit Card
        cart.setPaymentStrategy(new CreditCardPayment("1234567890123456"));
        cart.checkout();
        
        // Switch to PayPal
        cart.setPaymentStrategy(new PayPalPayment("user@email.com"));
        cart.checkout();
        
        // Switch to Crypto
        cart.setPaymentStrategy(new CryptoPayment("0x1234...5678"));
        cart.checkout();
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '7 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 21. Template Method
    {
        id: 21,
        title: 'Template Method - Define the Algorithm Skeleton',
        slug: 'template-method-pattern',
        summary: 'Define the skeleton of an algorithm, letting subclasses override specific steps.',
        content: `<h2>What is Template Method?</h2>
<p>Template Method defines the <strong>skeleton of an algorithm</strong> in a method, deferring some steps to subclasses. It lets subclasses redefine certain steps without changing the algorithm's structure.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Coffee/Tea Recipe</strong>. The basic steps are the same: boil water, brew, pour, add condiments. But the details (ingredients, brewing time) differ.</p>

<h3>Key Points</h3>
<ul>
<li>Uses inheritance, not composition</li>
<li>Hollywood Principle: "Don't call us, we'll call you"</li>
<li>Steps can be hooks (optional overrides)</li>
</ul>`,
        code_snippet: `// Abstract Class with Template Method
public abstract class Beverage {
    
    // Template Method - defines the algorithm
    public final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }
    
    // Common methods
    protected void boilWater() {
        System.out.println("Boiling water");
    }
    
    protected void pourInCup() {
        System.out.println("Pouring into cup");
    }
    
    // Abstract methods - must be overridden
    protected abstract void brew();
    protected abstract void addCondiments();
}

// Concrete implementations
public class Coffee extends Beverage {
    protected void brew() {
        System.out.println("Brewing coffee grounds");
    }
    
    protected void addCondiments() {
        System.out.println("Adding sugar and milk");
    }
}

public class Tea extends Beverage {
    protected void brew() {
        System.out.println("Steeping tea bag");
    }
    
    protected void addCondiments() {
        System.out.println("Adding lemon");
    }
}

public class HotChocolate extends Beverage {
    protected void brew() {
        System.out.println("Dissolving hot chocolate mix");
    }
    
    protected void addCondiments() {
        System.out.println("Adding marshmallows");
    }
}

// Hook - optional override
public class Lemonade extends Beverage {
    protected void brew() {
        System.out.println("Mixing lemonade concentrate");
    }
    
    protected void addCondiments() {
        if (customerWantsCondiments()) {
            System.out.println("Adding lemon slice");
        }
    }
    
    protected boolean customerWantsCondiments() {
        return true; // Hook - subclasses can override
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
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '6 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 22. Visitor
    {
        id: 22,
        title: 'Visitor Pattern - Operations on Object Structures',
        slug: 'visitor-pattern',
        summary: 'Represent an operation to be performed on elements of an object structure.',
        content: `<h2>What is Visitor Pattern?</h2>
<p>Visitor lets you define a <strong>new operation</strong> without changing the classes of elements on which it operates. Separate algorithm from object structure.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Taxi Visitor</strong>. Different visitors (Taxi driver, Family member, Foreign tourist) see your house differently, but the house structure stays the same.</p>

<h3>When to Use</h3>
<ul>
<li>Complex object structure with many element types</li>
<li>Operations need to work on many objects of different types</li>
<li>Add new operations frequently without changing classes</li>
</ul>`,
        code_snippet: `// Element interface
public interface Shape {
    void accept(Visitor visitor);
}

// Concrete Elements
public class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) { this.radius = radius; }
    public double getRadius() { return radius; }
    
    public void accept(Visitor visitor) {
        visitor.visitCircle(this);
    }
}

public class Rectangle implements Shape {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    public double getWidth() { return width; }
    public double getHeight() { return height; }
    
    public void accept(Visitor visitor) {
        visitor.visitRectangle(this);
    }
}

// Visitor interface
public interface Visitor {
    void visitCircle(Circle circle);
    void visitRectangle(Rectangle rectangle);
}

// Concrete Visitors
public class AreaCalculator implements Visitor {
    public void visitCircle(Circle circle) {
        double area = Math.PI * circle.getRadius() * circle.getRadius();
        System.out.println("Circle area: " + area);
    }
    
    public void visitRectangle(Rectangle rectangle) {
        double area = rectangle.getWidth() * rectangle.getHeight();
        System.out.println("Rectangle area: " + area);
    }
}

public class ShapeDrawer implements Visitor {
    public void visitCircle(Circle circle) {
        System.out.println("Drawing circle with radius " + circle.getRadius());
    }
    
    public void visitRectangle(Rectangle rectangle) {
        System.out.println("Drawing rectangle " + rectangle.getWidth() + 
                          "x" + rectangle.getHeight());
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        List<Shape> shapes = Arrays.asList(
            new Circle(5),
            new Rectangle(4, 6),
            new Circle(3)
        );
        
        Visitor areaCalc = new AreaCalculator();
        Visitor drawer = new ShapeDrawer();
        
        System.out.println("=== Calculating Areas ===");
        for (Shape shape : shapes) {
            shape.accept(areaCalc);
        }
        
        System.out.println("\\n=== Drawing Shapes ===");
        for (Shape shape : shapes) {
            shape.accept(drawer);
        }
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '8 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    // 23. Null Object
    {
        id: 23,
        title: 'Null Object Pattern - Handle Nulls Gracefully',
        slug: 'null-object-pattern',
        summary: 'Provide a default object that does nothing instead of null references.',
        content: `<h2>What is Null Object Pattern?</h2>
<p>Null Object provides a <strong>default object</strong> that does nothing instead of returning null. This eliminates null checks throughout your code.</p>

<h3>Real-World Analogy</h3>
<p>A <strong>Default Response</strong>. When a customer service bot doesn't have an answer, instead of saying nothing, it says "I'll connect you to a human."</p>

<h3>Benefits</h3>
<ul>
<li>Eliminates null checks</li>
<li>Provides predictable default behavior</li>
<li>Makes code more readable</li>
</ul>`,
        code_snippet: `// Customer interface
public interface Customer {
    String getName();
    boolean isNil();
    void introduce();
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
}

// Null Object
public class NullCustomer implements Customer {
    public String getName() { return "Guest"; }
    public boolean isNil() { return true; }
    public void introduce() {
        System.out.println("Hi, I'm a guest user");
    }
}

// Customer Factory
public class CustomerFactory {
    private static final NullCustomer NULL_CUSTOMER = new NullCustomer();
    
    public static Customer getCustomer(String name) {
        if (name == null || name.isEmpty()) {
            return NULL_CUSTOMER;
        }
        // In real scenario, this would check database
        if (name.equals("error")) {
            return NULL_CUSTOMER;
        }
        return new RealCustomer(name);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Customer[] customers = {
            CustomerFactory.getCustomer("Alice"),
            CustomerFactory.getCustomer("Bob"),
            CustomerFactory.getCustomer(""),    // Null customer
            CustomerFactory.getCustomer(null),   // Null customer
            CustomerFactory.getCustomer("error") // Null customer
        };
        
        for (Customer customer : customers) {
            System.out.println("Name: " + customer.getName());
            customer.introduce();
            
            // No null check needed!
            if (!customer.isNil()) {
                System.out.println("  -> This is a real customer!");
            }
            System.out.println("");
        }
    }
}`,
        author: 'Subrat Ojha',
        category_id: 3,
        read_time: '5 min',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];
