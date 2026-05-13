package com.ecommerce.product.config;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                repository.deleteAll();
            }

            List<Product> products = new ArrayList<>();

            // Electronics (16)
            products.add(createProduct("Sony 55\" 4K Ultra HD TV", "Experience stunning 4K clarity with Sony Bravia.", "54999", 20, "Electronics", "55 tv.jpg"));
            products.add(createProduct("Canon EOS R6 Camera", "Professional full-frame mirrorless camera.", "185000", 10, "Electronics", "camera.jpg"));
            products.add(createProduct("Digital Wall Clock", "Modern LED digital clock with temperature display.", "1299", 100, "Electronics", "clock.jpg"));
            products.add(createProduct("PlayStation 5 Console", "Next-gen gaming with lightning-fast SSD.", "54990", 15, "Electronics", "console.jpg"));
            products.add(createProduct("Fitness Tracker Band", "Track your steps, heart rate, and sleep.", "2499", 200, "Electronics", "fitness-tracker.jpg"));
            products.add(createProduct("2TB External Hard Drive", "Portable high-speed storage for your data.", "6499", 150, "Electronics", "hard-drive.jpg"));
            products.add(createProduct("Noise Cancelling Headphones", "Premium sound quality with active noise cancellation.", "14999", 80, "Electronics", "headphone.jpg"));
            products.add(createProduct("Mechanical Gaming Keyboard", "Tactile switches with customizable RGB lighting.", "4500", 120, "Electronics", "keyboard.jpg"));
            products.add(createProduct("High Performance Laptop", "Powerful laptop for work and gaming.", "85000", 25, "Electronics", "laptop.jpg"));
            products.add(createProduct("Aluminum Laptop Stand", "Ergonomic adjustable stand for laptops.", "1599", 300, "Electronics", "laptop-stand.jpg"));
            products.add(createProduct("Wireless Optical Mouse", "Smooth and responsive wireless navigation.", "899", 500, "Electronics", "mouse.jpg"));
            products.add(createProduct("Premium Smartphone", "Latest flagship smartphone with stunning display.", "69999", 40, "Electronics", "smartphone.jpg"));
            products.add(createProduct("Series 9 Smartwatch", "The most advanced health and fitness companion.", "41900", 60, "Electronics", "smartwatch.jpg"));
            products.add(createProduct("Sony 65\" OLED TV", "Perfect blacks and vibrant colors with OLED.", "124900", 8, "Electronics", "sonytv.jpg"));
            products.add(createProduct("Bluetooth Party Speaker", "Powerful bass and portable design for parties.", "8999", 70, "Electronics", "speaker.jpg"));
            products.add(createProduct("Pro Tablet 12.9\"", "Powerful tablet for creative professionals.", "99900", 30, "Electronics", "tablet.jpg"));

            // Fashion (10)
            products.add(createProduct("Elegant Evening Dress", "Stunning floral print dress for special occasions.", "3499", 50, "Fashion", "dress.html")); // Note: image check says dress.jpg, I'll use .jpg
            products.add(createProduct("Designer Handbag", "Premium leather handbag with gold accents.", "5999", 40, "Fashion", "handbag.jpg"));
            products.add(createProduct("Leather Biker Jacket", "Classic genuine leather jacket for men.", "7999", 30, "Fashion", "jacket.jpg"));
            products.add(createProduct("Slim Fit Denim Jeans", "Comfortable and stylish slim fit blue jeans.", "2499", 150, "Fashion", "jeans.jpg"));
            products.add(createProduct("Luxury French Perfume", "Long-lasting floral and woody fragrance.", "4500", 100, "Fashion", "perfume.jpg"));
            products.add(createProduct("Sporty Running Shoes", "Lightweight and breathable shoes for athletes.", "3999", 120, "Fashion", "shoes.jpg"));
            products.add(createProduct("Classic Aviator Sunglasses", "Timeless style with polarized UV protection.", "1599", 250, "Fashion", "sunglasses.jpg"));
            products.add(createProduct("Cotton Graphic T-Shirt", "Soft breathable cotton tee with trendy print.", "799", 400, "Fashion", "tshirt.jpg"));
            products.add(createProduct("Leather Bi-fold Wallet", "Genuine leather wallet with multiple card slots.", "1299", 300, "Fashion", "wallet.jpg"));
            products.add(createProduct("Luxury Chronograph Watch", "Premium stainless steel watch with leather strap.", "12500", 45, "Fashion", "watch.jpg"));

            // Home & Kitchen (10)
            products.add(createProduct("Digital Air Fryer", "Healthier frying with 90% less oil.", "8499", 60, "Home", "airfryer.jpg"));
            products.add(createProduct("HEPA Air Purifier", "Removes 99.9% of dust and allergens.", "12900", 40, "Home", "airpurifier.jpg"));
            products.add(createProduct("Cotton Bedding Set", "Premium 300 TC cotton double bedsheet.", "1999", 100, "Home", "bedsheet.jpg"));
            products.add(createProduct("Vintage Table Clock", "Classic analog clock for your bedside.", "899", 200, "Home", "clock.jpg"));
            products.add(createProduct("Adjustable Desk Lamp", "Flicker-free LED lamp for study and work.", "1499", 150, "Home", "desk-lamp.jpg"));
            products.add(createProduct("Electric Glass Kettle", "Rapid boil technology with auto shut-off.", "2199", 120, "Home", "kettle.jpg"));
            products.add(createProduct("Designer Floor Lamp", "Modern lamp to brighten your living room.", "3999", 50, "Home", "lamp.jpg"));
            products.add(createProduct("Convection Microwave Oven", "Multi-functional oven for baking and grilling.", "15500", 35, "Home", "microwave.jpg"));
            products.add(createProduct("Memory Foam Pillow", "Ergonomic design for better neck support.", "1299", 250, "Home", "pillow.jpg"));
            products.add(createProduct("Cordless Vacuum Cleaner", "Powerful suction for effortless cleaning.", "18999", 25, "Home", "vacuum.jpg"));

            // Groceries & Personal Care (12)
            products.add(createProduct("Chocolate Chip Biscuits", "Crunchy and delicious tea-time snacks.", "45", 1000, "Groceries", "biscuits.jpg"));
            products.add(createProduct("Insulated Water Bottle", "Stainless steel bottle keeps water cold for 24h.", "899", 400, "Groceries", "bottle.jpg"));
            products.add(createProduct("Roasted Coffee Beans", "Premium Arabica beans for the perfect brew.", "650", 300, "Groceries", "coffee.jpg"));
            products.add(createProduct("Whole Wheat Flour 10kg", "Freshly ground stone-milled wheat flour.", "499", 500, "Groceries", "flour.jpg"));
            products.add(createProduct("Pure Cold Pressed Oil", "Healthy and natural cooking oil.", "350", 600, "Groceries", "oil.jpg"));
            products.add(createProduct("Premium Basmati Rice", "Long-grain aromatic rice for special meals.", "899", 450, "Groceries", "rice.jpg"));
            products.add(createProduct("Herbal Face Wash", "Gentle cleansing for all skin types.", "299", 800, "Groceries", "facewash.jpg"));
            products.add(createProduct("Moisturizing Body Lotion", "Deep hydration for smooth and soft skin.", "450", 500, "Groceries", "lotion.jpg"));
            products.add(createProduct("Organic Shampoo 500ml", "Nourishing shampoo for healthy and shiny hair.", "599", 600, "Groceries", "shampoo.jpg"));
            products.add(createProduct("Luxury Makeup Kit", "Complete set of high-quality cosmetics.", "2499", 100, "Groceries", "makeup.jpg"));
            products.add(createProduct("Exfoliating Scrub", "Deeply cleanses pores and removes dead skin.", "349", 400, "Groceries", "shampoo.jpg")); // reusing image as makeup/care
            products.add(createProduct("Liquid Hand Soap", "Antibacterial soap for clean and soft hands.", "199", 1000, "Groceries", "bottle.jpg")); // reuse image

            // Sports & Fitness (7)
            products.add(createProduct("English Willow Cricket Bat", "Handcrafted bat for professional performance.", "15500", 20, "Sports", "cricketbat.jpg"));
            products.add(createProduct("Adjustable Dumbbells Set", "Versatile weights for home workouts.", "4500", 80, "Sports", "dumbbells.jpg"));
            products.add(createProduct("Official Match Football", "High-durability ball for match play.", "2999", 150, "Sports", "football.jpg"));
            products.add(createProduct("Protective Sports Helmet", "Safety first with this high-impact helmet.", "1899", 100, "Sports", "helmet.jpg"));
            products.add(createProduct("Carbon Fiber Tennis Racket", "Lightweight racket for better control.", "8999", 40, "Sports", "racket.jpg"));
            products.add(createProduct("Tennis Balls Pack of 3", "High-bounce durable balls for all surfaces.", "499", 300, "Sports", "tennis.jpg"));
            products.add(createProduct("Eco-friendly Yoga Mat", "Non-slip surface for perfect balance.", "1299", 250, "Sports", "yogamat.jpg"));

            // Toys & Books (8)
            products.add(createProduct("Creative Building Blocks", "Endless possibilities for young builders.", "1599", 200, "Toys", "blocks.jpg"));
            products.add(createProduct("Remote Controlled Car", "Fast and agile car with rechargeable battery.", "2499", 120, "Toys", "car.jpg"));
            products.add(createProduct("Plush Teddy Bear", "Soft and cuddly companion for kids.", "999", 300, "Toys", "teddy.jpg"));
            products.add(createProduct("Wooden Train Set", "Classic toy for imaginative play.", "1899", 100, "Toys", "train.jpg"));
            products.add(createProduct("Ultimate Cookbook", "100+ delicious recipes for every occasion.", "799", 400, "Books", "cookbook.jpg"));
            products.add(createProduct("Best Selling Fiction Book", "A captivating story you can't put down.", "499", 500, "Books", "fiction-book.jpg"));
            products.add(createProduct("1000 Piece Jigsaw Puzzle", "Challenging and fun activity for the family.", "1299", 150, "Books", "puzzle.jpg"));
            products.add(createProduct("Popular Science Book", "Explore the wonders of the universe.", "650", 350, "Books", "science-book.jpg"));

            repository.saveAll(products);
            System.out.println("Full catalog of 62 products restored with image mappings.");
        };
    }

    private Product createProduct(String name, String description, String price, Integer qty, String category, String imageName) {
        Product p = new Product(name, description, new BigDecimal(price), qty, category);
        // Correcting the dress extension if I saw it wrong in list_dir (it was .jpg)
        if (imageName.equals("dress.html")) imageName = "dress.jpg"; 
        p.setImageName(imageName);
        return p;
    }
}
