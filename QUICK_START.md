# ⚡ Quick Start Guide

## 🎯 Choose Your Path

### Path A: Just Want to See It Working? (2 minutes)

```bash
npm install
npm start
```

✅ **Done!** Open http://localhost:3000
- Works with 20 sample papers
- All features functional
- No backend needed

---

### Path B: Want Full 608 NASA Papers? (1-2 hours)

**1. MongoDB Setup (15 min)**

**MongoDB Atlas** (Recommended):
- https://www.mongodb.com/cloud/atlas/register
- Create cluster → Get connection string

**OR Local MongoDB**:
- Download: https://www.mongodb.com/try/download/community
- Start: `net start MongoDB` (Windows)

**2. Gemini API Key (5 min)**
- https://makersuite.google.com/app/apikey
- Create → Copy key

**3. Configure (2 min)**

Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nasa_bioscience
GEMINI_API_KEY=your_key_here
PORT=5000
SCRAPE_LIMIT=100
```

**4. Ingest Data (30-60 min)**

```bash
cd backend
npm run ingest
```

Coffee break ☕ - this takes time!

**5. Start Backend (1 min)**

```bash
npm start
```

**6. Start Frontend (1 min)**

New terminal:
```bash
cd ..
npm start
```

✅ **Done!** Open http://localhost:3000 with 608 papers!

---

## 🧪 Test Backend is Working

```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK",...}
```

---

## 🔍 Check Connection Status

Open http://localhost:3000 → Open browser console:
- `📡 Fetching from backend...` = Backend connected ✅
- `📦 Using mock data` = Frontend only mode

---

## 📂 File Structure

```
Space_Biology_Knowledge_Engine/
├── backend/          # Backend API (Node.js)
├── src/              # Frontend (React)
├── public/data/      # CSV with 608 papers
├── README.md         # Full documentation
├── SETUP.md          # Detailed setup
└── QUICK_START.md    # This file
```

---

## 🚨 Troubleshooting

**Frontend shows mock data?**
→ Backend not running on port 5000

**MongoDB connection error?**
→ Check MONGODB_URI in backend/.env

**Scraping too slow?**
→ Set SCRAPE_LIMIT=20 in backend/.env

---

## 📚 More Help

- **Complete guide**: SETUP.md
- **Implementation details**: IMPLEMENTATION_SUMMARY.md
- **API docs**: backend/README.md

---

## 🎯 Key URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

---

## ✨ Features

✅ 608 NASA publications
✅ AI-powered search
✅ Knowledge graph
✅ Research chatbot
✅ Category filtering
✅ Semantic search

**Happy exploring! 🚀**
