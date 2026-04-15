# Database Setup Guide

## 🗄️ Using Supabase (PostgreSQL - Recommended for Netlify)

Supabase is perfect for Netlify deployments. It's free, fast, and scales automatically.

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up with GitHub or Email
3. Create a new project
4. Choose a region (select closest to your users)
5. Set a strong database password

### Step 2: Get Your API Keys
1. In your Supabase dashboard, go to **Settings > API**
2. Copy these keys:
   - `ANON KEY` → for public use
   - `URL` → your project URL
   - `SERVICE_ROLE KEY` → for admin operations (keep secret!)

### Step 3: Set Up Database Schema
1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy this entire SQL:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  special_instructions TEXT,
  order_type VARCHAR(50) DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert orders" ON orders FOR INSERT WITH CHECK (TRUE);
```

4. Click **Run** to execute the SQL
5. Verify tables are created (check **Table Editor** in sidebar)

### Step 4: Create Environment File
Create a `.env.local` file in your project root:

```env
# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Get these values from Supabase > Settings > API**

### Step 5: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 6: Update Database Functions
Update `src/lib/database.ts` to use real Supabase client:

```typescript
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, supabaseKey);
}
```

---

## 🚀 Deploying to Netlify

### Step 1: Connect Repository
1. Push your code to GitHub
2. Go to https://netlify.com
3. Click **Add new site > Import an existing project**
4. Connect your GitHub repo

### Step 2: Set Environment Variables
1. In Netlify, go to **Site settings > Build & deploy > Environment**
2. Add your environment variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Configure Build
Build command:
```
npm run build
```

Publish directory:
```
dist
```

### Step 4: Deploy
- Netlify will automatically deploy on every git push
- Your admin dashboard will be at: `https://your-site.netlify.app/admin`

---

## 🔐 Admin Access

**Demo Password:** `chai123`

⚠️ **In production, change this!** Update in `src/routes/admin.tsx`:

```typescript
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "chai123";
```

---

## 📊 API Endpoints

### Submit Order
```bash
POST /api/contact
{
  "customer_name": "Priya Sharma",
  "customer_email": "priya@kj.edu.in",
  "customer_phone": "9876543210",
  "items": [
    { "id": "1", "name": "Chai", "price": 10, "quantity": 2 }
  ],
  "total_amount": 20,
  "order_type": "dine-in"
}
```

### Fetch Orders (Server Action)
```typescript
import { fetchAllOrders } from "@/lib/database";

const result = await fetchAllOrders();
// Returns: { success: boolean, orders?: Order[], message: string }
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` file exists in project root
- Verify variable names match exactly
- Restart dev server: `npm run dev`

### "table orders does not exist"
- Run the SQL schema in Supabase SQL Editor
- Check that no errors occurred during execution

### Orders not loading on admin page
- Open browser DevTools (F12)
- Check Console for errors
- Verify Supabase API keys are correct

---

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com
- Contact us: hello@bholenathchai.com
