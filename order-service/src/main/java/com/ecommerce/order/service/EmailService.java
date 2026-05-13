package com.ecommerce.order.service;

import com.ecommerce.order.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:no-reply@mystore.local}")
    private String fromAddress;

    @Value("${app.support.email:support@mystore.local}")
    private String supportEmail;

    public void sendOrderConfirmation(Order order) {
        if (!mailEnabled || mailSender == null) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(order.getCustomerEmail());
            helper.setSubject("MyStore order confirmation #" + order.getId());
            helper.setText(buildOrderEmail(order), true);
            mailSender.send(message);
        } catch (Exception ignored) {
            // Email must never roll back a paid order. Production apps should send this to logs/observability.
        }
    }

    private String buildOrderEmail(Order order) {
        java.text.NumberFormat formatter = java.text.NumberFormat.getCurrencyInstance(new java.util.Locale("en", "IN"));
        
        StringBuilder itemsHtml = new StringBuilder();
        for (var item : order.getOrderItems()) {
            itemsHtml.append("<tr>")
                    .append("<td style='padding: 12px 0; border-bottom: 1px solid #edf2f7;'>")
                    .append("<div style='font-weight: 600; color: #1a202c;'>").append(escape(item.getProductName())).append("</div>")
                    .append("<div style='font-size: 12px; color: #718096;'>Qty: ").append(item.getQuantity()).append("</div>")
                    .append("</td>")
                    .append("<td style='padding: 12px 0; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 700; color: #1a202c;'>")
                    .append(formatter.format(item.getSubtotal()))
                    .append("</td>")
                    .append("</tr>");
        }

        String deliveryDate = LocalDate.now().plusDays(5).format(DateTimeFormatter.ofPattern("EEEE, dd MMM yyyy"));
        String address = escape(order.getShippingAddress().getStreet()) + ", " +
                escape(order.getShippingAddress().getCity()) + ", " +
                escape(order.getShippingAddress().getState()) + " - " +
                escape(order.getShippingAddress().getZipCode());

        return "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>" +
                "<body style='margin: 0; padding: 0; background-color: #f7fafc; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;'>" +
                "<div style='max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'>" +
                "  <div style='background-color: #4f46e5; padding: 30px; text-align: center;'>" +
                "    <h1 style='color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;'>MyStore</h1>" +
                "    <p style='color: #c7d2fe; margin: 5px 0 0; font-size: 16px;'>Order Confirmation</p>" +
                "  </div>" +
                "  <div style='padding: 40px 30px;'>" +
                "    <h2 style='margin: 0 0 10px; color: #1a202c; font-size: 22px;'>Order Confirmed!</h2>" +
                "    <p style='color: #4a5568; line-height: 1.6; margin-bottom: 30px;'>Hello " + escape(order.getCustomerName()) + ", thank you for shopping with us. Your order has been successfully placed and is being prepared for shipment.</p>" +
                "    <div style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px;'>" +
                "      <div style='display: flex; justify-content: space-between; margin-bottom: 8px;'>" +
                "        <span style='color: #718096; font-size: 14px;'>Order ID:</span>" +
                "        <span style='color: #1a202c; font-weight: 700; font-size: 14px;'>#" + order.getId() + "</span>" +
                "      </div>" +
                "      <div style='display: flex; justify-content: space-between;'>" +
                "        <span style='color: #718096; font-size: 14px;'>Estimated Delivery:</span>" +
                "        <span style='color: #10b981; font-weight: 700; font-size: 14px;'>" + deliveryDate + "</span>" +
                "      </div>" +
                "    </div>" +
                "    <table style='width: 100%; border-collapse: collapse; margin-bottom: 25px;'>" +
                "      <thead><tr><th style='text-align: left; padding-bottom: 10px; border-bottom: 2px solid #edf2f7; color: #718096; font-size: 12px; text-transform: uppercase;'>Item</th>" +
                "      <th style='text-align: right; padding-bottom: 10px; border-bottom: 2px solid #edf2f7; color: #718096; font-size: 12px; text-transform: uppercase;'>Amount</th></tr></thead>" +
                "      <tbody>" + itemsHtml.toString() + "</tbody>" +
                "    </table>" +
                "    <div style='text-align: right; margin-bottom: 30px;'>" +
                "      <span style='color: #718096; font-size: 16px; margin-right: 15px;'>Total Amount Paid:</span>" +
                "      <span style='color: #4f46e5; font-size: 24px; font-weight: 800;'>" + formatter.format(order.getTotalAmount()) + "</span>" +
                "    </div>" +
                "    <div style='border-top: 1px solid #edf2f7; padding-top: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;'>" +
                "      <div><h4 style='margin: 0 0 8px; color: #718096; font-size: 12px; text-transform: uppercase;'>Delivery Address</h4><p style='margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;'>" + address + "</p></div>" +
                "      <div><h4 style='margin: 0 0 8px; color: #718096; font-size: 12px; text-transform: uppercase;'>Payment Method</h4><p style='margin: 0; color: #4a5568; font-size: 14px;'>" + escape(order.getPaymentMethod().replace("_", " ")) + "</p></div>" +
                "    </div>" +
                "  </div>" +
                "  <div style='background-color: #f7fafc; padding: 25px; text-align: center; border-top: 1px solid #edf2f7;'>" +
                "    <p style='margin: 0; color: #a0aec0; font-size: 12px;'>Questions? Contact our support team at <a href='mailto:" + supportEmail + "' style='color: #4f46e5; text-decoration: none;'>" + supportEmail + "</a></p>" +
                "    <p style='margin: 8px 0 0; color: #a0aec0; font-size: 12px;'>&copy; 2026 MyStore. All rights reserved.</p>" +
                "  </div>" +
                "</div></body></html>";
    }

    private String escape(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
