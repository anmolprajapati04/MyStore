package com.ecommerce.order.dto;

import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.PaymentStatus;

public class PaymentVerificationResponse {
    private PaymentStatus paymentStatus;
    private Order order;
    private String message;

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
