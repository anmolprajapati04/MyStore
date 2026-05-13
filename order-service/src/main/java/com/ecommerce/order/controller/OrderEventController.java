package com.ecommerce.order.controller;

import com.ecommerce.order.service.OrderEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/order-events")
public class OrderEventController {
    @Autowired
    private OrderEventService orderEventService;

    @GetMapping("/stream")
    public SseEmitter stream(@RequestParam String userId) {
        return orderEventService.subscribe(userId);
    }

    @GetMapping("/admin/stream")
    public SseEmitter adminStream() {
        return orderEventService.subscribeAdmin();
    }
}
