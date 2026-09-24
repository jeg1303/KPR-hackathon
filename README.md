# ReleaseGuard AI

> **"Know the risk before you ship."**

AI-powered DevSecOps code review and release-risk assessment platform that detects bugs, security vulnerabilities, performance issues, and maintainability problems before they reach production.

![ReleaseGuard AI](https://img.shields.io/badge/Status-MVP-green) ![Next.js](https://img.shields.io/badge/Next.js-16.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 What Makes ReleaseGuard Different

ReleaseGuard AI combines **Static Analysis + AI Reasoning + Explainable Risk** to provide intelligent code review:

- **🔴 Certainty-Aware**: Distinguishes CERTAIN bugs from LIKELY issues and SUGGESTIONS
- **🎯 Explainable**: Every finding includes evidence, confidence score, and clear explanation
- **⚡ Fast**: Static analysis provides deterministic results instantly
- **🤖 Contextual**: AI adds contextual understanding and generates fixes/tests
- **📊 Risk Intelligence**: Explainable 0-100 risk score with release recommendations

## ✨ Key Features

### Core Analysis
- **Multi-Input Support**: Analyze GitHub PRs, paste diffs, or upload patch files
- **Security Detection**: SQL injection, hardcoded secrets, XSS, weak crypto, and more
- **Bug Detection**: Null references, error handling, logic errors, resource leaks
- **Performance Analysis**: N+1 queries, inefficient algorithms, blocking operations
- **Maintainability**: Code smells, complexity, duplication, naming issues

### Intelligent Features
- **🚦 Release Control Tower**: Mission-control interface for release decisions
- **💥 Blast Radius**: Visualize potential impact paths of detected issues
- **🔗 Stack Trace Linker**: Parse error logs and link to exact code lines
- **🧪 Auto Test Generation**: Generate test cases for detected vulnerabilities
- **📈 Model Evaluation**: Track precision, recall, and false-positive rates

### 5 Built-in Demo Scenarios
1. **SQL Injection** (Critical) - User search endpoint vulnerability
2. **Hardcoded Secrets** (Critical) - Stripe API keys in source code
3. **N+1 Query** (High) - Performance issue in product listing
4. **Null Reference** (High) - Error handling bug in account deletion
5. **Mixed Issues** (High) - Authentication middleware with multiple problems

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (optional for demo mode)
- OpenAI API key or Anthropic API key (optional for AI analysis)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/releaseguard-ai.git
cd releaseguard-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Mode (No Setup Required)

ReleaseGuard works immediately in demo mode:

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click **"Try Demo"**
3. Select any demo PR
4. Click **"Analyze"**

Demo mode uses deterministic analysis and doesn't require API keys or database setup.

## 🔧 Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
# AI Provider (optional - demo works without this)
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# AI Provider Selection
AI_PROVIDER=openai  # or "anthropic"

# Database (optional - uses in-memory storage for demo)
DATABASE_URL=postgresql://user:password@localhost:5432/releaseguard

# GitHub Integration (optional)
GITHUB_TOKEN=ghp_...
```

### Database Setup (Optional)

For production use with persistent storage:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (optional)
npx prisma studio
```

## 📖 Usage

### Analyze a Pull Request

**Option 1: GitHub URL**
```
1. Go to /analyze
2. Select "GitHub URL" tab
3. Enter: https://github.com/owner/repo/pull/123
4. Click "Analyze Pull Request"
```

**Option 2: Paste Diff**
```
1. Go to /analyze
2. Select "Paste Diff" tab
3. Paste your git diff or patch
4. Click "Analyze Diff"
```

**Option 3: Upload File**
```
1. Go to /analyze
2. Select "Upload File" tab
3. Upload .diff, .patch, or .txt file
4. Analysis starts automatically
```

**Option 4: Demo PRs**
```
1. Go to /analyze
2. Select "Demo PRs" tab
3. Choose a scenario
4. Click "Analyze"
```

### Understanding Results

**Risk Score (0-100)**
- **0-39**: 🟢 Low Risk - Safe to proceed
- **40-69**: 🟡 Moderate Risk - Review recommended
- **70-89**: 🟠 High Risk - Fix important issues
- **90-100**: 🔴 Critical - Release blocked

**Certainty Levels**
- **🔴 CERTAIN**: Definite bug with clear evidence (>95% confidence)
- **🟠 LIKELY**: Probable issue based on patterns (70-94% confidence)
- **🔵 SUGGESTION**: Style or minor improvement (<70% confidence)

**Categories**
- **Security**: Vulnerabilities that could be exploited
- **Bug**: Logical errors that cause incorrect behavior
- **Performance**: Issues that degrade performance
- **Maintainability**: Code quality and readability issues

## 🏗️ Architecture

```
Input (PR/Diff/File)
       ↓
Diff Parser → Extract files, lines, languages
       ↓
Static Analysis → Pattern matching (deterministic)
       ↓
AI Analysis → Contextual understanding (optional)
       ↓
Certainty Engine → CERTAIN vs LIKELY vs SUGGESTION
       ↓
Risk Scoring → Weighted algorithm (explainable)
       ↓
Test Generation → Auto-generate test cases
       ↓
Release Decision → Safe / Moderate / High / Critical
```

### Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons
- Recharts

**Backend**
- Next.js API Routes
- Server Actions
- Prisma ORM
- PostgreSQL

**AI**
- OpenAI GPT-4 (configurable)
- Anthropic Claude (configurable)
- Structured JSON output
- Fallback to static analysis

**Analysis**
- Custom static analysis engine
- Regex-based pattern matching
- Diff parsing
- Risk scoring algorithm

## 📊 Evaluation Metrics

ReleaseGuard MVP benchmark results:

- **Precision**: 91.3% (21 true positives / 23 detected)
- **Recall**: 84.0% (21 true positives / 25 expected)
- **F1 Score**: 87.5%
- **False Positive Rate**: 8.7% (2 FP / 23 detected)
- **Security Detection**: 100% (8/8 vulnerabilities detected)

*Based on built-in benchmark dataset with 25 known issues across 5 demo PRs.*

## 🎨 Key Pages

- **`/`** - Landing page with product overview
- **`/analyze`** - PR analysis with 4 input methods
- **`/review/[id]`** - Detailed analysis results
- **`/control-tower`** - Release Control Tower (signature feature)
- **`/dashboard`** - Overview with stats and recent reviews
- **`/reviews`** - All analyzed PRs with filtering
- **`/evaluation`** - Model performance metrics
- **`/architecture`** - How ReleaseGuard works
- **`/demo`** - Interactive demo with pipeline visualization
- **`/debug`** - Stack Trace Linker for error logs

## 🔒 Security

- ✅ API keys stored server-side only (never exposed to frontend)
- ✅ Input validation on all endpoints
- ✅ Safe diff parsing (no code execution)
- ✅ GitHub token optional (works without authentication)
- ✅ No arbitrary repository code execution
- ✅ Rate limiting ready (configure in production)
- ✅ Timeout protection on analysis

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=...
NODE_ENV=production
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Build production bundle
npm run build
```

## 📝 API Endpoints

### Analysis
- `POST /api/analyze/demo` - Analyze demo PR
- `POST /api/analyze/diff` - Analyze pasted diff
- `POST /api/analyze/github` - Analyze GitHub PR

### Reviews
- `GET /api/review/[id]` - Get review details

### Response Format

```json
{
  "success": true,
  "reviewId": "abc123",
  "message": "Analysis completed"
}
```

## 🎯 Roadmap

**MVP (Current)**
- ✅ Core analysis pipeline
- ✅ 5 demo scenarios
- ✅ Static + AI analysis
- ✅ Risk scoring
- ✅ UI/UX complete

**Future Enhancements**
- [ ] Real-time analysis streaming
- [ ] GitHub App integration
- [ ] Custom rule configuration
- [ ] Team collaboration features
- [ ] Historical trend analysis
- [ ] CI/CD pipeline integration
- [ ] Slack/Discord notifications
- [ ] Advanced blast radius visualization
- [ ] Support for more languages
- [ ] Custom AI model training

## 🤝 Contributing

This is a hackathon MVP. Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built for hackathon demonstration purposes. Combines ideas from:
- Static analysis tools (ESLint, Semgrep, Bandit)
- AI code review (GitHub Copilot, Amazon CodeGuru)
- Security scanning (Snyk, SonarQube)
- Risk assessment (OWASP, CWE)

## 📧 Contact

For questions or demo requests, please open an issue.

---

**Built with ❤️ for better code quality and safer releases.**
#   K P R - h a c k a t h o n  
 