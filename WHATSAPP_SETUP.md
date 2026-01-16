# WhatsApp Notifications Setup Guide

This guide will help you set up automated WhatsApp notifications for order status updates using Twilio.

## Features Implemented

1. **Automatic Order Confirmation**: When payment is successful, order status automatically changes from "pending" to "confirmed" and a WhatsApp message is sent
2. **Shipping Notification**: When admin changes status to "shipped", customer receives WhatsApp notification
3. **Delivery Notification**: When admin changes status to "delivered", customer receives WhatsApp notification
4. **Phone Number from Address**: Uses the phone number provided in shipping address

## Prerequisites

- A Twilio account (free trial available)
- A phone number to test with
- WhatsApp installed on your test phone

## Step 1: Create Twilio Account

1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your email and phone number
4. You'll get free trial credits ($15-20)

## Step 2: Get Your Credentials

1. From the Twilio Console Dashboard, find:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)
2. Copy these values - you'll need them for your .env file

## Step 3: Set Up WhatsApp Sandbox (For Testing)

Since you're testing, you'll use Twilio's WhatsApp Sandbox:

1. In Twilio Console, go to **Messaging** > **Try it out** > **Send a WhatsApp message**
2. You'll see a sandbox number (usually +1 415 523 8886)
3. Follow the instructions to join the sandbox:
   - Send a WhatsApp message to the sandbox number
   - The message should be something like: `join <your-sandbox-code>`
   - Example: `join happy-tiger`
4. You'll receive a confirmation message
5. Your phone is now connected to the sandbox!

## Step 4: Configure Your Application

1. Open `backend/.env`
2. Add your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=+14155238886
   ```
3. The WhatsApp number is the sandbox number (usually +14155238886)

## Step 5: Test the Integration

### Test 1: Payment Confirmation
1. Place an order on your website
2. Complete the payment
3. You should receive a WhatsApp message confirming the order
4. Check admin panel - order status should be "confirmed"

### Test 2: Shipping Notification
1. Go to Admin Panel > Orders
2. Find an order and change status to "shipped"
3. Customer should receive a WhatsApp message about shipping

### Test 3: Delivery Notification
1. Change order status to "delivered"
2. Customer should receive a delivery confirmation message

## Phone Number Format

The system automatically handles phone number formatting:
- Accepts: `9876543210` or `+919876543210` or `91-9876543210`
- Converts to: `+919876543210` (E.164 format)
- Default country code: +91 (India)

## Message Templates

### Order Confirmed
```
✅ Order Confirmed!

Thank you for your order #123!

📦 Order Details:
• Product Name (Size) x1

💰 Total: ₹999

📍 Shipping to:
[Customer Address]

We'll notify you once your order is shipped. 🚚
```

### Order Shipped
```
🎉 Great news! Your order #123 has been shipped!

📦 Order Details:
• Product Name (Size) x1

💰 Total: ₹999

📍 Shipping to:
[Customer Address]

Your order will arrive soon. Thank you for shopping with us! 🛍️
```

### Order Delivered
```
🎊 Order Delivered!

Your order #123 has been delivered successfully!

We hope you love your purchase! 💝

If you have any questions or concerns, please don't hesitate to contact us.

Thank you for shopping with us! 🙏
```

## Production Setup

For production, you need to:

1. **Get a Twilio Phone Number**
   - Go to Phone Numbers > Buy a number
   - Select a number with WhatsApp capability
   - Cost: ~$1-2/month

2. **Request WhatsApp Business Profile Approval**
   - Go to Messaging > Senders > WhatsApp senders
   - Click "Request Access"
   - Fill in your business details
   - Wait for approval (can take a few days)

3. **Update Message Templates**
   - WhatsApp requires pre-approved templates for production
   - Submit your message templates for approval
   - Use template IDs in your code

4. **Update Environment Variables**
   ```env
   TWILIO_WHATSAPP_NUMBER=+1234567890  # Your purchased number
   ```

## Troubleshooting

### "WhatsApp service not configured"
- Check that all three Twilio variables are set in .env
- Restart your backend server after updating .env

### "Failed to send WhatsApp message"
- Verify your Twilio credentials are correct
- Check that you've joined the sandbox (for testing)
- Ensure the phone number format is correct
- Check Twilio Console > Monitor > Logs for detailed errors

### Messages not received
- Verify the customer's phone number in shipping address
- Check that the phone has WhatsApp installed
- For sandbox: ensure the recipient has joined the sandbox
- Check Twilio Console logs for delivery status

### "Authentication Error"
- Double-check your Account SID and Auth Token
- Make sure there are no extra spaces in .env file
- Verify your Twilio account is active

## Cost Estimation

### Free Trial
- $15-20 in credits
- ~1000 WhatsApp messages
- Perfect for testing

### Production Costs (Approximate)
- WhatsApp messages: $0.005 per message (India)
- Phone number: $1-2/month
- For 1000 orders/month: ~$5-7/month

## Important Notes

1. **Graceful Degradation**: If WhatsApp service is not configured, the app continues to work normally without sending messages
2. **Error Handling**: WhatsApp failures don't affect order processing
3. **Privacy**: Phone numbers are only used for order notifications
4. **Opt-out**: Consider adding an opt-out mechanism for customers
5. **Rate Limits**: Twilio has rate limits - monitor usage in production

## Testing Checklist

- [ ] Twilio account created
- [ ] Credentials added to .env
- [ ] Joined WhatsApp sandbox
- [ ] Backend server restarted
- [ ] Test order placed and payment completed
- [ ] Confirmation message received
- [ ] Status changed to "shipped" from admin
- [ ] Shipping message received
- [ ] Status changed to "delivered"
- [ ] Delivery message received

## Alternative: Using Other WhatsApp APIs

If you prefer not to use Twilio, you can integrate:

1. **WhatsApp Business API** (Official)
   - More complex setup
   - Requires business verification
   - Better for large scale

2. **Other Providers**
   - MessageBird
   - Vonage (Nexmo)
   - Infobip

The code structure is similar - just replace the Twilio client with your preferred provider's SDK.

## Support

For Twilio-specific issues:
- [Twilio WhatsApp Documentation](https://www.twilio.com/docs/whatsapp)
- [Twilio Support](https://support.twilio.com/)

For implementation issues:
- Check the backend logs
- Review the WhatsApp service code in `backend/src/services/whatsappService.js`
