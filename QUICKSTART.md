# ReleaseGuard AI - Quick Start Guide

This guide will get you up and running with ReleaseGuard AI in 5 minutes.

## 🚀 Fastest Way (Demo Mode)

**No setup required!** Just run the app and try the demo:

```bash
npm install
npm run dev
```

Open http://localhost:3000 and click **"Try Demo"**

## 📋 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

For AI-powered analysis, create a `.env` file:

```env
# Choose ONE provider (or leave empty for demo-only mode)
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

AI_PROVIDER=openai
```

**Don't have an API key?** No problem! The app works in demo mode without any keys.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ What Works Immediately

Without any configuration, you can:

- ✅ Analyze 5 built-in demo PRs with deterministic results
- ✅ View detailed findings with explanations
- ✅ See risk scores and release recommendations
- ✅ Generate test cases
- ✅ View evaluation metrics
- ✅ Try the Release Control Tower
- ✅ Use the Stack Trace Linker

## 🔑 Optional: Add AI Analysis

To enable AI-powered contextual analysis:

1. Get an API key:
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/

2. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   AI_PROVIDER=openai
   ```

3. Restart the server

Now you can:
- Analyze real GitHub PRs
- Paste custom diffs
- Upload patch files
- Get AI-enhanced contextual explanations

## 🗄️ Optional: Add Database

For persistent storage (not required for demo):

1. Install PostgreSQL

2. Create database:
   ```bash
   createdb releaseguard
   ```

3. Add to `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/releaseguard
   ```

4. Run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

## 🐙 Optional: Add GitHub Integration

To analyze private repositories:

1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Create token with `repo` scope

2. Add to `.env`:
   ```env
   GITHUB_TOKEN=ghp_...
   ```

3. Restart the server

Now you can analyze private PRs by URL.

## 📖 Usage Guide

### Demo Mode (Recommended for First Try)

1. Go to http://localhost:3000
2. Click **"Try Demo"**
3. Watch the animated pipeline
4. Explore the analysis results

### Analyze Real Code

1. Go to http://localhost:3000/analyze
2. Choose input method:
   - **Demo PRs**: Select from 5 scenarios
   - **GitHub URL**: Enter PR link
   - **Paste Diff**: Copy/paste git diff
   - **Upload File**: Upload .diff or .patch

3. Click **"Analyze"**
4. Review findings and risk score

### Explore Features

- **Dashboard** (`/dashboard`): Overview and stats
- **Control Tower** (`/control-tower`): Release decision interface
- **Reviews** (`/reviews`): All analyzed PRs
- **Evaluation** (`/evaluation`): Model performance metrics
- **Architecture** (`/architecture`): How it works
- **Debug** (`/debug`): Stack trace analyzer

## 🎯 Demo Scenarios

1. **SQL Injection** - Critical security vulnerability
2. **Hardcoded Secrets** - Stripe API key in code
3. **N+1 Query** - Performance issue
4. **Null Reference** - Error handling bug
5. **Mixed Issues** - Multiple security/performance problems

## 🔍 Understanding Results

**Risk Score**
- 0-39: 🟢 Safe to proceed
- 40-69: 🟡 Review recommended
- 70-89: 🟠 High risk, fix issues
- 90-100: 🔴 Release blocked

**Certainty Badges**
- 🔴 CERTAIN: Definite bug (>95% confidence)
- 🟠 LIKELY: Probable issue (70-94%)
- 🔵 SUGGESTION: Minor improvement (<70%)

## 🆘 Troubleshooting

**Port 3000 already in use?**
```bash
PORT=3001 npm run dev
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Type errors?**
```bash
npm run type-check
```

**Want to reset demo data?**
Just restart the server - demo data is in-memory.

## 🎓 Next Steps

1. **Try Demo Mode** - See it working immediately
2. **Add API Key** - Enable AI analysis
3. **Analyze Your Code** - Paste a real diff
4. **Read Architecture** - Understand how it works
5. **Check Evaluation** - See accuracy metrics

## 📚 Documentation

- **README.md** - Full documentation
- **Architecture** - http://localhost:3000/architecture
- **Evaluation** - http://localhost:3000/evaluation

## 💡 Tips

- Start with demo mode to understand the interface
- The demo PRs contain real vulnerabilities
- AI analysis is optional - static analysis works standalone
- All findings include explanations and suggested fixes
- Generated tests are based on actual failure conditions

## 🤝 Need Help?

- Check README.md for detailed documentation
- Review the Architecture page in the app
- Open an issue on GitHub

---

**Ready?** Run `npm run dev` and open http://localhost:3000 🚀
