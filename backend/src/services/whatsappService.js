// backend/src/services/whatsappService.js
const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    
    // Only initialize if credentials are provided
    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
      this.enabled = true;
    } else {
      console.warn('⚠️ WhatsApp service not configured. Set TWILIO credentials in .env to enable.');
      this.enabled = false;
    }
  }

  // Format phone number to E.164 format (e.g., +919876543210)
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If it doesn't start with country code, assume India (+91)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    return '+' + cleaned;
  }

  // Send order shipped notification
  async sendOrderShippedMessage(phoneNumber, orderDetails) {
    if (!this.enabled) {
      console.log('WhatsApp service disabled. Would have sent:', { phoneNumber, orderDetails });
      return { success: false, message: 'WhatsApp service not configured' };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `🎉 Great news! Your order #${orderDetails.orderId} has been shipped!

📦 Order Details:
${orderDetails.items.map(item => `• ${item.title} (${item.size}) x${item.quantity}`).join('\n')}

💰 Total: ₹${orderDetails.total}

📍 Shipping to:
${orderDetails.shippingAddress.name}
${orderDetails.shippingAddress.address}
${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} - ${orderDetails.shippingAddress.pincode}

Your order will arrive soon. Thank you for shopping with us! 🛍️`;

      const response = await this.client.messages.create({
        from: `whatsapp:${this.whatsappNumber}`,
        to: `whatsapp:${formattedPhone}`,
        body: message
      });

      console.log('✅ WhatsApp message sent successfully:', response.sid);
      return { success: true, messageSid: response.sid };
    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Send order confirmed notification
  async sendOrderConfirmedMessage(phoneNumber, orderDetails) {
    if (!this.enabled) {
      console.log('WhatsApp service disabled. Would have sent:', { phoneNumber, orderDetails });
      return { success: false, message: 'WhatsApp service not configured' };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `✅ Order Confirmed!

Thank you for your order #${orderDetails.orderId}!

📦 Order Details:
${orderDetails.items.map(item => `• ${item.title} (${item.size}) x${item.quantity}`).join('\n')}

💰 Total: ₹${orderDetails.total}

📍 Shipping to:
${orderDetails.shippingAddress.name}
${orderDetails.shippingAddress.address}
${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} - ${orderDetails.shippingAddress.pincode}

We'll notify you once your order is shipped. 🚚`;

      const response = await this.client.messages.create({
        from: `whatsapp:${this.whatsappNumber}`,
        to: `whatsapp:${formattedPhone}`,
        body: message
      });

      console.log('✅ WhatsApp message sent successfully:', response.sid);
      return { success: true, messageSid: response.sid };
    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Send order delivered notification
  async sendOrderDeliveredMessage(phoneNumber, orderDetails) {
    if (!this.enabled) {
      console.log('WhatsApp service disabled. Would have sent:', { phoneNumber, orderDetails });
      return { success: false, message: 'WhatsApp service not configured' };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = `🎊 Order Delivered!

Your order #${orderDetails.orderId} has been delivered successfully!

We hope you love your purchase! 💝

If you have any questions or concerns, please don't hesitate to contact us.

Thank you for shopping with us! 🙏`;

      const response = await this.client.messages.create({
        from: `whatsapp:${this.whatsappNumber}`,
        to: `whatsapp:${formattedPhone}`,
        body: message
      });

      console.log('✅ WhatsApp message sent successfully:', response.sid);
      return { success: true, messageSid: response.sid };
    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new WhatsAppService();
