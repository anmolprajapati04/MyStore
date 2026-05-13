package com.ecommerce.order.service;

import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.Payment;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class OrderEventService {
    private final Map<String, List<SseEmitter>> customerEmitters = new ConcurrentHashMap<>();
    private final List<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe(String userId) {
        SseEmitter emitter = new SseEmitter(0L);
        customerEmitters.computeIfAbsent(userId, ignored -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> remove(userId, emitter));
        emitter.onTimeout(() -> remove(userId, emitter));
        emitter.onError(error -> remove(userId, emitter));
        send(emitter, "connected", Map.of("userId", userId));
        return emitter;
    }

    public SseEmitter subscribeAdmin() {
        SseEmitter emitter = new SseEmitter(0L);
        adminEmitters.add(emitter);
        emitter.onCompletion(() -> adminEmitters.remove(emitter));
        emitter.onTimeout(() -> adminEmitters.remove(emitter));
        emitter.onError(error -> adminEmitters.remove(emitter));
        send(emitter, "connected", Map.of("scope", "admin"));
        return emitter;
    }

    public void publishOrderCreated(Order order) {
        publish(order.getUserId(), "order_created", order);
        publishAdmin("order_created", order);
    }

    public void publishOrderStatusUpdated(Order order) {
        publish(order.getUserId(), "order_status_updated", order);
    }

    public void publishPaymentSuccess(Order order, Payment payment) {
        Map<String, Object> payload = Map.of(
                "orderId", order.getId(),
                "userId", order.getUserId(),
                "paymentId", payment.getPaymentId() != null ? payment.getPaymentId() : "N/A",
                "amount", payment.getAmount(),
                "status", payment.getPaymentStatus().name()
        );
        publish(order.getUserId(), "payment_success", payload);
        publishAdmin("payment_success", payload);
    }

    private void publish(String userId, String eventName, Object payload) {
        List<SseEmitter> emitters = customerEmitters.getOrDefault(userId, List.of());
        for (SseEmitter emitter : emitters) {
            send(emitter, eventName, payload);
        }
    }

    private void publishAdmin(String eventName, Object payload) {
        for (SseEmitter emitter : adminEmitters) {
            send(emitter, eventName, payload);
        }
    }

    private void send(SseEmitter emitter, String eventName, Object data) {
        try {
            emitter.send(SseEmitter.event().name(eventName).data(data));
        } catch (IOException ex) {
            emitter.completeWithError(ex);
        }
    }

    private void remove(String userId, SseEmitter emitter) {
        List<SseEmitter> emitters = customerEmitters.get(userId);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }
}
