# NASA Bioscience Explorer - Backend

Backend API for the NASA Space Biology Knowledge Engine.

## Features

- 📄 CSV parser for 608 NASA publications
- 🕷️ PMC web scraper for abstracts and metadata
- 🤖 Gemini AI integration for metadata enhancement
- 💾 MongoDB database storage
- 🚀 RESTful API with caching
- 🔍 Advanced search capabilities

## Setup

### Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- Gemini API key from Google AI Studio

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/nasa_bioscience
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=5000
SCRAPE_LIMIT=100  # Limit papers for initial testing
```

### MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Then start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Data Ingestion

Process the 608 publications and populate database:

```bash
npm run ingest
```

This will:
1. Parse CSV file (608 papers)
2. Scrape PMC for abstracts (respects rate limits)
3. Enhance with Gemini AI (keywords, categories)
4. Save to MongoDB

**Note:** Initial ingestion takes 30-60 minutes due to rate limiting.

### Running the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Get Papers
```http
GET /api/papers?search=bone&category=Health&limit=20&skip=0
```

### Get Single Paper
```http
GET /api/papers/:id
```

### Advanced Search
```http
POST /api/papers/search
Content-Type: application/json

{
  "query": "microgravity bone loss",
  "filters": {
    "category": "Health & Medicine",
    "startDate": "2010-01-01",
    "endDate": "2024-12-31"
  },
  "limit": 20
}
```

### Category Statistics
```http
GET /api/papers/categories/stats
```

### Health Check
```http
GET /api/health
```

## Project Structure

```
backend/
├── models/
│   └── Paper.js              # MongoDB schema
├── routes/
│   └── papers.js             # API endpoints
├── scripts/
│   └── ingestData.js         # Data processing script
├── utils/
│   ├── csvParser.js          # CSV parser
│   ├── pmcScraper.js         # Web scraper
│   └── geminiEnhancer.js     # AI enhancement
├── server.js                 # Express server
├── package.json
└── .env                      # Environment variables
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas: whitelist your IP address

### PMC Scraping Errors
- PMC may rate limit: reduce batch size or add delays
- Some papers may not have abstracts available
- Check network connection

### Gemini API Errors
- Verify API key in `.env`
- Check quota limits (free tier has limits)
- Fallback metadata generation activates on failure

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nasa_bioscience` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `PORT` | Server port | `5000` |
| `SCRAPE_LIMIT` | Limit papers to process | `100` |

## Performance

- Caching: 1-hour in-memory cache for API responses
- Database indexes on: title, category, keywords, dates
- Batch processing for scraping and AI enhancement
