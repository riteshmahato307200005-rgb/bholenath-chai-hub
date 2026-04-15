# ⚡ Quick Reference & Credentials Guide

## 🔐 Admin Credentials (MUST UPDATE BEFORE HOSTING)

### Current Default (DO NOT USE IN PRODUCTION)
```
Username: owner
Password: bholenath123
```

### Where to Change

**File 1:** `src/components/AdminSection.tsx` (Lines 14-15)
```typescript
const OWNER_USERNAME = "owner";           // CHANGE HERE
const OWNER_PASSWORD = "bholenath123";    // CHANGE HERE
```

**File 2:** `src/components/InquiriesSection.tsx` (Lines 27-28)
```typescript
const OWNER_USERNAME = "owner";           // CHANGE HERE
const OWNER_PASSWORD = "bholenath123";    // CHANGE HERE
```

---

## 🎯 Two Admin Portals

### 1️⃣ Orders Dashboard (🔐 Button - Bottom Right)
```
Purpose: Manage food orders
Access: Bottom-right corner of website
Login: Username + Password
Features:
  ✓ View all orders in real-time
  ✓ Filter by status (Pending, Preparing, Ready, Completed)
  ✓ Search by customer name/email
  ✓ Update order status
  ✓ Delete orders
  ✓ Revenue tracking
```

### 2️⃣ Inquiries Manager (📧 Button - Bottom Right)
```
Purpose: Manage contact inquiries
Access: Bottom-right corner of website
Login: Username + Password (same as Orders)
Features:
  ✓ View all inquiry messages in real-time
  ✓ Filter by status (New, Replied, Resolved)
  ✓ Search by customer name/email
  ✓ Update inquiry status
  ✓ Delete inquiries
  ✓ Inquiry counter
```

---

## 💳 Payment Methods (For Customers)

### Checkout Form - Two Options

**Option 1: Pay by Cash (Default)**
```
✓ No payment processing needed
✓ Customer pays when collecting order
✓ Payment status: Cash
✓ Appears in admin as "Payment: Cash"
```

**Option 2: Pay Online**
```
✓ For future Razorpay / PhonePe integration
✓ UI is ready for payment gateway
✓ Payment status: Online
✓ Appears in admin as "Payment: Online"
✓ Ready for gateway activation
```

---

## 📊 Real-Time Supabase Tables

**Table 1: `orders`**
```
Columns:
  - customer_name
  - customer_email
  - customer_phone
  - items (array of items)
  - total_amount
  - status (pending, preparing, ready, completed)
  - special_instructions (includes payment method)
  - order_type
  - created_at
  - updated_at
```

**Table 2: `inquiries`**
```
Columns:
  - customer_name
  - customer_email
  - customer_phone
  - subject
  - message
  - status (new, replied, resolved)
  - created_at
  - updated_at
```

---

## 🚀 Deployment in 5 Steps

### Step 1: Update Credentials
Edit `AdminSection.tsx` and `InquiriesSection.tsx` with your real username/password

### Step 2: Commit Changes
```powershell
git add .
git commit -m "Update admin credentials for production"
```

### Step 3: Push to GitHub
```powershell
git push origin main
```

### Step 4: Connect to Cloudflare Pages
1. Go to dash.cloudflare.com
2. Click "Pages" → "Create Project" → "Connect to Git"
3. Select your repo
4. Build command: `npm run build`
5. Output: `dist/client`
6. Add environment variables:
   - `VITE_PUBLIC_SUPABASE_URL`
   - `VITE_PUBLIC_SUPABASE_ANON_KEY`

### Step 5: Deploy!
Cloudflare deploys automatically → Your site is LIVE! 🎉

---

## 📱 First Time Login Flow

**When you first access admin:**

1. Click 🔐 button (bottom-right) → Orders Dashboard
   - Login with your new username/password
   - View orders in real-time
   - Click Logout to exit

2. Click 📧 button (bottom-right) → Inquiries Manager
   - Login with SAME username/password
   - View inquiries in real-time
   - Click Logout to exit

**Note:** Both use the same credentials you set in the code

---

## ✅ Production Checklist

Before going live:

```
SECURITY:
  [ ] Changed admin username in AdminSection.tsx
  [ ] Changed admin password in AdminSection.tsx
  [ ] Changed admin username in InquiriesSection.tsx
  [ ] Changed admin password in InquiriesSection.tsx
  [ ] Both files use SAME credentials
  [ ] Password is strong (12+ chars, mix of letters/numbers/symbols)

TESTING:
  [ ] Built locally: npm run build (should pass)
  [ ] Tested admin login locally
  [ ] Tested order creation
  [ ] Tested inquiry submission
  [ ] Tested payment method selection
  [ ] Tested on mobile device
  [ ] Verified Supabase connection

DEPLOYMENT:
  [ ] Created GitHub account
  [ ] Pushed code to GitHub
  [ ] Created Cloudflare Pages account
  [ ] Connected GitHub to Cloudflare
  [ ] Added environment variables
  [ ] Deployment completed successfully
  [ ] Website is accessible at https://your-site.pages.dev

MONITORING:
  [ ] Checked Cloudflare Pages dashboard
  [ ] Verified orders table in Supabase
  [ ] Verified inquiries table in Supabase
  [ ] Tested order from production website
  [ ] Verify order appears in admin dashboard
```

---

## 🔗 Useful Links

**Admin Dashboard:**
- Login form: Bottom-right corner (🔐 button)
- URL: Same as your website homepage

**Inquiries Dashboard:**
- Login form: Bottom-right corner (📧 button)
- URL: Same as your website homepage

**Supabase Console:**
- Go to supabase.com
- Project: abksijyqnqdfgekvtfcf
- View/manage data directly

**Cloudflare Pages:**
- Dashboard: dash.cloudflare.com
- View build logs
- Check deployment status
- Add custom domain

---

## 🆘 Common Issues & Solutions

**Issue: Login not working**
```
Check:
1. Correct spelling of username
2. Correct spelled password
3. All in lowercase (case-sensitive)
4. No extra spaces
5. Updated both AdminSection.tsx and InquiriesSection.tsx
```

**Issue: Orders not appearing in Supabase**
```
Check:
1. Supabase URL is correct in .env.local
2. Supabase key is correct in .env.local
3. Orders table exists in Supabase
4. Test Supabase connection in Supabase console
```

**Issue: Website not deploying**
```
Check:
1. npm run build passes locally
2. All code is committed to GitHub
3. Environment variables set in Cloudflare
4. Check Cloudflare build logs for errors
```

---

## 📞 Next Steps

1. **Change credentials NOW** ← Most important!
2. **Test everything locally**
3. **Deploy to Cloudflare Pages**
4. **Share website URL with users**
5. **Monitor admin dashboard for orders**

---

**REMEMBER:**
- Keep your credentials SAFE
- Don't commit `.env.local` to GitHub
- Test payment methods before customers use
- Monitor Supabase for database growth

**You're ready to lunch! 🚀**

