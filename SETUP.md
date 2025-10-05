# NASA Space Biology Knowledge Engine - Setup Guide

Complete setup guide for running the full-stack application with backend + frontend.

## 🎯 Quick Start (Option B - Full Backend)

### Prerequisites

1. **Node.js** v16+ (you have v22.14.0 ✅)
2. **MongoDB** (Choose one):
   - **Option A**: MongoDB Atlas (Cloud - Recommended for hackathon)
   - **Option B**: Local MongoDB installation
3. **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/)

---

## 📦 Step 1: MongoDB Setup

### Option A: MongoDB Atlas (Recommended - 5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a new cluster (free M0 tier)
4. Create database user:
   - Username: `nasa_admin`
   - Password: (create a strong password)
5. Whitelist IP: Add `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://nasa_admin:<password>@cluster0.xxxxx.mongodb.net/nasa_bioscience?retryWrites=true&w=majority`

### Option B: Local MongoDB (15 minutes)

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Install and start MongoDB service
net start MongoDB
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

---

## 🔧 Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies (already done ✅)
# npm install

# Create .env file
# Copy .env.example to .env
```

### Configure backend/.env

```env
# If using MongoDB Atlas:
MONGODB_URI=mongodb+srv://nasa_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nasa_bioscience?retryWrites=true&w=majority

# If using local MongoDB:
MONGODB_URI=mongodb://localhost:27017/nasa_bioscience

# Your Gemini API key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Server port
PORT=5000

# Limit papers for testing (remove for full 608)
SCRAPE_LIMIT=100
```

### Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy and paste into `.env`

---

## 📥 Step 3: Data Ingestion

This is the important step - it will:
- Parse the CSV (608 papers)
- Scrape PMC for abstracts
- Enhance with Gemini AI
- Save to MongoDB

```bash
# From backend/ directory
npm run ingest
```

**Expected output:**
```
🚀 Starting data ingestion process...
✅ MongoDB connected
📄 Step 1: Parsing CSV file...
✅ Found 608 papers
📥 Step 2: Scraping PMC for 100 papers...
📥 Scraping batch 1/20
...
✅ Scraping complete
🤖 Step 3: Enhancing papers with Gemini AI...
✅ AI enhancement complete
💾 Step 4: Saving to database...
✅ Inserted 100 papers into database
```

**Time estimate:** 30-60 minutes for 100 papers, 2-4 hours for all 608

**Troubleshooting:**
- If scraping is slow/failing: Reduce `SCRAPE_LIMIT` to 50
- If Gemini quota exceeded: Script will use fallback metadata
- If MongoDB connection fails: Check `MONGODB_URI` in `.env`

---

## 🚀 Step 4: Start Backend Server

```bash
# From backend/ directory
npm start
```

Test backend is working:
```bash
# In another terminal
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"NASA Bioscience API is running"}
```

---

## 💻 Step 5: Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Frontend is already set up, just need to configure
```

### Configure .env (root directory)

The `.env` file should already exist with:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎨 Step 6: Start Frontend

```bash
# From root directory
npm start
```

Frontend will start on `http://localhost:3000`

---

## ✅ Verification Checklist

1. ✅ MongoDB is running (Atlas or local)
2. ✅ Backend running on http://localhost:5000
3. ✅ Backend health check works: `curl http://localhost:5000/api/health`
4. ✅ Papers in database: Open MongoDB Compass or Atlas to verify
5. ✅ Frontend running on http://localhost:3000
6. ✅ Frontend shows papers from backend (check browser console for "📡 Fetching from backend...")

---

## 🔄 Fallback to Mock Data

If backend is not running, the app automatically falls back to mock data. You'll see:
```
📴 Backend not available, using mock data
```

This means the app works even without the backend!

---

## 📊 Expected Results

- **Papers displayed:** 100 (or SCRAPE_LIMIT value)
- **Categories:** Health & Medicine, Space Biology, Cellular Biology, etc.
- **Search works:** Both basic and semantic search
- **Paper details:** Click any paper to see full details
- **AI features:** Chatbot, knowledge graph, insights

---

## 🚨 Common Issues

### Issue: "MongoDB connection error"
**Solution:** Check MONGODB_URI, ensure MongoDB is running

### Issue: "Gemini API error"
**Solution:** Verify API key, check quota limits

### Issue: "Frontend shows mock data"
**Solution:** Ensure backend is running on port 5000

### Issue: "Scraping is very slow"
**Solution:** Reduce SCRAPE_LIMIT to 50 or 20

### Issue: "CORS error in browser"
**Solution:** Backend has CORS enabled, but check backend is on port 5000

---

## 🎯 Quick Test Commands

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test get papers
curl http://localhost:5000/api/papers?limit=5

# Test search
curl -X POST http://localhost:5000/api/papers/search \
  -H "Content-Type: application/json" \
  -d '{"query":"bone loss","limit":5}'
```

---

## 📝 Next Steps After Setup

1. **Test all features:**
   - Search functionality
   - Category filtering
   - Paper detail pages
   - AI chatbot
   - Knowledge graph

2. **Ingest all 608 papers:**
   - Remove or increase `SCRAPE_LIMIT` in `backend/.env`
   - Run `npm run ingest` again
   - Wait 2-4 hours

3. **Add advanced features:**
   - Timeline visualization
   - Knowledge gap analysis
   - Export functionality

4. **Deploy:**
   - Backend: Railway, Render, or Heroku
   - Frontend: Vercel or Netlify

---

## 🎉 Success!

You now have:
- ✅ Full-stack application running
- ✅ Real NASA publication data
- ✅ AI-enhanced metadata
- ✅ Knowledge graph visualization
- ✅ Semantic search capabilities

Ready for the NASA Space Apps Challenge! 🚀
