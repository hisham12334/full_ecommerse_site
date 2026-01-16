# Admin Guide: WhatsApp Notifications

## Quick Reference for Order Management

### What Happens Automatically

#### After Customer Payment ✓
- Order status: `pending` → `confirmed` (automatic)
- WhatsApp message: Order confirmation sent to customer
- No action needed from you!

### What You Control

#### When You Change Order Status

| Status Change | WhatsApp Message Sent | When to Use |
|--------------|----------------------|-------------|
| Any → **Confirmed** | ✅ Order Confirmation | If you manually confirm an order |
| Any → **Shipped** | 📦 Shipping Notification | When you ship the order |
| Any → **Delivered** | 🎊 Delivery Confirmation | When order is delivered |
| Any → **Cancelled** | ❌ No message | Order cancelled |
| Any → **Pending** | ❌ No message | Reverting status |

## Typical Order Flow

```
1. Customer places order
   Status: pending
   
2. Customer pays
   Status: pending → confirmed (automatic)
   WhatsApp: ✅ "Order Confirmed"
   
3. You ship the order
   Status: confirmed → shipped (you change this)
   WhatsApp: 📦 "Order Shipped"
   
4. Order delivered
   Status: shipped → delivered (you change this)
   WhatsApp: 🎊 "Order Delivered"
```

## How to Change Order Status

1. Go to **Admin Panel** > **Orders**
2. Find the order you want to update
3. Click on the order or status dropdown
4. Select new status (e.g., "Shipped")
5. Save/Confirm
6. ✅ WhatsApp message sent automatically!

## Important Notes

### ✓ Do's
- Change to "Shipped" when you actually ship the order
- Change to "Delivered" when confirmed delivered
- Keep status updated for customer transparency
- Check that customer phone number is correct in order details

### ✗ Don'ts
- Don't change status multiple times unnecessarily
- Don't mark as "Shipped" before actually shipping
- Don't worry if WhatsApp fails - order still processes
- Don't change status back and forth (confuses customer)

## Customer Phone Numbers

WhatsApp messages are sent to the phone number provided in:
- **Shipping Address** > **Phone Number**

### Phone Number Format
The system accepts any of these formats:
- `9876543210`
- `+919876543210`
- `91-9876-543-210`
- `+91 9876 543 210`

All are automatically converted to the correct format.

## What Customers Receive

### Order Confirmed Message
```
✅ Order Confirmed!

Thank you for your order #123!

📦 Order Details:
• Product Name (Size) x Quantity

💰 Total: ₹Amount

📍 Shipping to:
Customer Address

We'll notify you once your order is shipped. 🚚
```

### Order Shipped Message
```
🎉 Great news! Your order #123 has been shipped!

📦 Order Details:
• Product Name (Size) x Quantity

💰 Total: ₹Amount

📍 Shipping to:
Customer Address

Your order will arrive soon. Thank you for shopping with us! 🛍️
```

### Order Delivered Message
```
🎊 Order Delivered!

Your order #123 has been delivered successfully!

We hope you love your purchase! 💝

Thank you for shopping with us! 🙏
```

## Troubleshooting

### "WhatsApp not configured" in logs
- Contact your developer
- WhatsApp service needs setup
- Orders still work normally

### Customer didn't receive message
- Check if phone number is correct in order
- Verify customer has WhatsApp
- Check backend logs for errors
- Message might be delayed (check after 5 minutes)

### Wrong phone number in order
- Customer entered wrong number
- Can't change after order placed
- Contact customer directly

## Best Practices

1. **Update Status Promptly**
   - Change to "Shipped" same day you ship
   - Update to "Delivered" when confirmed

2. **Check Order Details**
   - Verify phone number looks correct
   - Ensure shipping address is complete

3. **Monitor Customer Feedback**
   - Ask if they received notifications
   - Improve process based on feedback

4. **Keep Records**
   - Note any delivery issues
   - Track which orders had notification problems

## Status Definitions

| Status | Meaning | Action Required |
|--------|---------|----------------|
| **Pending** | Order placed, payment pending | Wait for payment |
| **Confirmed** | Payment received | Prepare for shipping |
| **Shipped** | Order dispatched | Track delivery |
| **Delivered** | Customer received order | None - complete! |
| **Cancelled** | Order cancelled | Process refund if needed |

## Quick Tips

💡 **Tip 1**: Change status to "Shipped" as soon as you hand over to courier
💡 **Tip 2**: Add tracking number in order notes (if available)
💡 **Tip 3**: Mark "Delivered" only after confirmation
💡 **Tip 4**: If customer calls asking about order, check the status first

## Need Help?

- Check order details in admin panel
- Review backend logs for errors
- Contact technical support
- See `WHATSAPP_SETUP.md` for technical details

## Summary

✅ Payment confirmed → Automatic WhatsApp notification
✅ You mark as shipped → Automatic WhatsApp notification  
✅ You mark as delivered → Automatic WhatsApp notification
✅ Customer stays informed → Happy customer! 😊
