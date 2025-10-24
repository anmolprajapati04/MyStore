package com.ecommerce.product.controller;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageStorageService imageStorageService;

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        // Set image URLs for each product
        products.forEach(product -> {
            if (product.getImageName() != null) {
                product.setImagePath(imageStorageService.getImageUrl(product.getImageName()));
            }
        });
        return products;
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product p = product.get();
            if (p.getImageName() != null) {
                p.setImagePath(imageStorageService.getImageUrl(p.getImageName()));
            }
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.notFound().build();
    }

    // Create product with image
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(new java.math.BigDecimal(price));
        product.setStockQuantity(stockQuantity);
        product.setCategory(category);

        // Handle image upload
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = imageStorageService.storeImage(imageFile);
            product.setImageName(fileName);
            product.setImageContentType(imageFile.getContentType());
            product.setImageSize(imageFile.getSize());
            product.setImagePath(imageStorageService.getImageUrl(fileName));
        }

        return productRepository.save(product);
    }

    // Serve images
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path filePath = imageStorageService.loadImage(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update product with image
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product existingProduct = product.get();
            existingProduct.setName(name);
            existingProduct.setDescription(description);
            existingProduct.setPrice(new java.math.BigDecimal(price));
            existingProduct.setStockQuantity(stockQuantity);
            existingProduct.setCategory(category);

            // Handle image update
            if (imageFile != null && !imageFile.isEmpty()) {
                // Delete old image if exists
                if (existingProduct.getImageName() != null) {
                    imageStorageService.deleteImage(existingProduct.getImageName());
                }
                
                String fileName = imageStorageService.storeImage(imageFile);
                existingProduct.setImageName(fileName);
                existingProduct.setImageContentType(imageFile.getContentType());
                existingProduct.setImageSize(imageFile.getSize());
                existingProduct.setImagePath(imageStorageService.getImageUrl(fileName));
            }

            return ResponseEntity.ok(productRepository.save(existingProduct));
        }
        return ResponseEntity.notFound().build();
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) throws IOException {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            // Delete associated image
            if (product.get().getImageName() != null) {
                imageStorageService.deleteImage(product.get().getImageName());
            }
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get products by category
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productRepository.findByCategory(category);
        products.forEach(product -> {
            if (product.getImageName() != null) {
                product.setImagePath(imageStorageService.getImageUrl(product.getImageName()));
            }
        });
        return products;
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (filename.toLowerCase().endsWith(".webp")) {
            return "image/webp";
        } else {
            return "application/octet-stream";
        }
    }
}