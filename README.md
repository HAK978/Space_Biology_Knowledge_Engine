# 🚀 NASA Space Biology Knowledge Engine

**Enabling the future of human space exploration through AI-powered knowledge discovery**

An interactive, AI-enhanced dashboard for exploring 608 NASA bioscience publications. Built for the [NASA Space Apps Challenge 2024](https://www.spaceappschallenge.org/).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

---

## ✨ Features

### 🎨 **Beautiful Space-Themed UI**
- Modern, responsive design with animated star field
- Smooth animations with Framer Motion
- Intuitive navigation and filtering

### 🔍 **Advanced Search & Discovery**
- **Semantic AI Search** - Natural language queries powered by Gemini AI
- **Category Filtering** - Browse by research area
- **Full-text Search** - MongoDB text indexing for fast results

### 🤖 **AI-Powered Insights**
- **Research Assistant Chatbot** - Ask questions about specific papers
- **Automated Metadata Enhancement** - AI-generated keywords and categories
- **Knowledge Gap Identification** - Find under-researched areas
- **Research Significance Analysis** - Understand impact and applications

### 📊 **Interactive Visualizations**
- **Knowledge Graph** - Explore relationships between papers
  - Research Connections mode
  - Topic Clusters mode
  - Citation Network mode
- **Research Data Analysis** - Impact metrics and trends
- **Timeline Views** - Track research progress over time

### 📚 **Comprehensive Data**
- **608 Real NASA Publications** from PMC
- **Scraped Abstracts** from PubMed Central
- **Citation Counts** and impact metrics
- **Author Information** and metadata

### 🎯 **Target Audience Features**
- **Scientists**: Advanced search, knowledge gaps, hypothesis generation
- **Managers**: Investment opportunities, research progress tracking
- **Mission Architects**: Actionable insights, countermeasure recommendations

---

## 🏗️ Architecture

### **Full-Stack Application**

```
┌─────────────────────────────────────────────────┐
│  Frontend (React)                                │
│  - Modern UI with Tailwind CSS                  │
│  - Framer Motion animations                     │
│  - Interactive visualizations                   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Backend API (Node.js + Express)                │
│  - RESTful API endpoints                        │
│  - In-memory caching (NodeCache)                │
│  - MongoDB integration                          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Database (MongoDB)                              │
│  - 608 NASA publications                        │
│  - Full-text search indexes                    │
│  - Optimized queries                            │
└─────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  AI Services (Google Gemini)                    │
│  - Metadata enhancement                         │
│  - Semantic search                              │
│  - Chat interactions                            │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Option 1: Frontend Only (Mock Data)

```bash
npm install
npm start
```

Visit `http://localhost:3000` - works immediately with 20 sample papers!

### Option 2: Full Stack (Real 608 Papers)

See **[SETUP.md](./SETUP.md)** for complete instructions.

**Quick version:**

```bash
# 1. Setup MongoDB (Atlas recommended)
# 2. Get Gemini API key

# 3. Configure backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and Gemini API key

# 4. Ingest data
npm run ingest  # Takes 30-60 min for 100 papers

# 5. Start backend
npm start  # Runs on port 5000

# 6. Start frontend (new terminal)
cd ..
npm start  # Runs on port 3000
```

---

## 📋 Prerequisites

- **Node.js** v16+
- **MongoDB** (Atlas cloud or local installation)
- **Gemini API Key** (free tier available)

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **Cheerio** - Web scraping
- **csv-parser** - CSV processing
- **NodeCache** - In-memory caching
- **Google Generative AI** - Gemini integration

---

## 📁 Project Structure

```
Space_Biology_Knowledge_Engine/
├── backend/
│   ├── models/
│   │   └── Paper.js              # MongoDB schema
│   ├── routes/
│   │   └── papers.js             # API routes
│   ├── scripts/
│   │   └── ingestData.js         # Data processing
│   ├── utils/
│   │   ├── csvParser.js          # CSV parser
│   │   ├── pmcScraper.js         # Web scraper
│   │   └── geminiEnhancer.js     # AI enhancement
│   ├── server.js                 # Express server
│   └── package.json
├── public/
│   └── data/
│       └── SB_publication_PMC.csv # 608 NASA papers
├── src/
│   ├── components/
│   │   ├── Chatbot.js            # AI research assistant
│   │   ├── Header.js             # Navigation
│   │   ├── PaperTile.js          # Paper cards
│   │   ├── ResearchVisualizer.js # Knowledge graph
│   │   └── ...
│   ├── pages/
│   │   ├── Home.js               # Main page
│   │   ├── PaperDetail.js        # Paper details
│   │   └── About.js              # About page
│   ├── services/
│   │   ├── api.js                # Mock data
│   │   ├── backendApi.js         # Backend API client
│   │   ├── apiWrapper.js         # Auto-fallback
│   │   └── geminiService.js      # Gemini AI client
│   └── App.js                    # Root component
├── SETUP.md                      # Complete setup guide
└── README.md                     # This file
```

---

## 🎯 NASA Challenge Objectives

This project addresses all key challenge requirements:

✅ **Summarize 608 Publications** - Full-text indexing + AI summaries
✅ **AI & Knowledge Graphs** - Gemini AI + interactive graph visualization
✅ **Identify Progress** - Timeline views, citation analysis
✅ **Knowledge Gaps** - AI-powered gap analysis
✅ **Consensus/Disagreement** - Related papers + contradiction detection
✅ **Actionable Insights** - Mission planner dashboard, countermeasure recommendations
✅ **Interactive Dashboard** - Rich UI with search, filters, visualizations

---

## 🌟 Key Differentiators

1. **Real NASA Data** - Not just a demo, uses actual 608 PMC publications
2. **AI Enhancement** - Every paper enhanced with Gemini-generated metadata
3. **Automatic Fallback** - Works without backend (mock data) or with full stack
4. **Knowledge Graph** - 3 visualization modes for exploring relationships
5. **Research Assistant** - Paper-specific AI chatbot for Q&A
6. **Production Ready** - Complete backend API, database, caching

---

## 📊 API Endpoints

```http
GET  /api/papers                   # Get papers with filters
GET  /api/papers/:id               # Get single paper
POST /api/papers/search            # Semantic search
GET  /api/papers/categories/stats  # Category statistics
GET  /api/health                   # Health check
```

See [backend/README.md](./backend/README.md) for complete API documentation.

---

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Citation network visualization (3D)
- [ ] Hypothesis generator based on knowledge gaps
- [ ] Integration with NASA OSDR for raw experiment data
- [ ] Multi-language support
- [ ] Voice-based research assistant
- [ ] PDF report generation
- [ ] Bookmark/collection system

---

## 🤝 Contributing

This is a NASA Space Apps Challenge project. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **NASA** for providing open-access bioscience publications
- **PubMed Central (PMC)** for hosting research papers
- **Google Gemini AI** for AI capabilities
- **NASA Space Apps Challenge** for the inspiration

---

## 📧 Contact

Built with ❤️ for the NASA Space Apps Challenge 2024

**Live Demo:** [Coming Soon]
**Documentation:** See [SETUP.md](./SETUP.md)

---

## 🚀 Ready to Explore Space Biology?

Get started now:
```bash
npm install && npm start
```

**Happy exploring! 🌌**
