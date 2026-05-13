package com.ecommerce.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentOrderRequest {
    @NotBlank
    private String idempotencyKey;

    @Valid
    @NotNull
    private OrderRequest order;

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public OrderRequest getOrder() { return order; }
    public void setOrder(OrderRequest order) { this.order = order; }
}
