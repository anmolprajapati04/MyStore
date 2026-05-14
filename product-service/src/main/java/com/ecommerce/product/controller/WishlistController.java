package com.ecommerce.product.controller;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.model.Wishlist;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.repository.WishlistRepository;
import com.ecommerce.product.service.ImageStorageService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private ImageStorageService imageStorageService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Wishlist> getWishlist(@RequestHeader("X-Authenticated-User") String userId) {
        List<Wishlist> items = wishlistRepository.findByUserId(userId);
        items.forEach(item -> {
            Product p = item.getProduct();
            if (p != null && p.getImageName() != null) {
                p.setImagePath(imageStorageService.getImageUrl(p.getImageName()));
            }
        });
        return items;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(
            @PathVariable Long productId,
            @RequestHeader("X-Authenticated-User") String userId) {
        
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            return ResponseEntity.ok(Map.of("message", "Already in wishlist"));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist(userId, product);
        wishlistRepository.save(wishlist);

        return ResponseEntity.ok(Map.of("message", "Added to wishlist", "id", wishlist.getId()));
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long productId,
            @RequestHeader("X-Authenticated-User") String userId) {
        
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> checkWishlist(
            @PathVariable Long productId,
            @RequestHeader("X-Authenticated-User") String userId) {
        
        boolean exists = wishlistRepository.existsByUserIdAndProductId(userId, productId);
        return ResponseEntity.ok(Map.of("isWishlisted", exists));
    }
}
