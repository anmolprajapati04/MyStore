package com.ecommerce.order.controller;

import com.ecommerce.order.dto.PaymentOrderRequest;
import com.ecommerce.order.dto.PaymentVerificationRequest;
import com.ecommerce.order.model.Payment;
import com.ecommerce.order.service.PaymentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createPaymentOrder(
            @Valid @RequestBody PaymentOrderRequest request,
            @RequestHeader("X-Authenticated-User") String authenticatedUser) {
        logger.info("Received request to create payment order for user: {}", authenticatedUser);
        try {
            return ResponseEntity.ok(paymentService.createPaymentOrder(request, authenticatedUser));
        } catch (Exception e) {
            logger.error("Error creating payment order", e);
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request,
            @RequestHeader("X-Authenticated-User") String authenticatedUser) {
        logger.info("Received request to verify payment for Razorpay Order ID: {}", request.getRazorpayOrderId());
        try {
            return ResponseEntity.ok(paymentService.verifyPayment(request, authenticatedUser));
        } catch (Exception e) {
            logger.error("Error verifying payment", e);
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/failure")
    public ResponseEntity<?> markPaymentFailed(
            @RequestBody Map<String, String> payload,
            @RequestHeader("X-Authenticated-User") String authenticatedUser) {
        logger.info("Received notification of payment failure for user: {}", authenticatedUser);
        paymentService.markPaymentFailed(
                payload.get("razorpayOrderId"),
                payload.getOrDefault("reason", "Payment failed"),
                authenticatedUser
        );
        return ResponseEntity.ok(Map.of("status", "FAILED"));
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentHistory(
            @PathVariable String userId,
            @RequestHeader("X-Authenticated-User") String authenticatedUser) {
        return paymentService.getPaymentHistory(userId);
    }
}
