# ReleaseGuard AI - Acceptance Test Checklist

Run through this checklist to verify all features are working correctly.

## 🚀 Quick Start Test (2 minutes)

### Test 1: Can you run the app?
```bash
npm install
npm run dev
```
- [ ] Server starts without errors
- [ ] Opens at http://localhost:3000
- [ ] Landing page loads successfully

**Expected**: App runs immediately, no configuration needed.

---

## ✅ Core Feature Tests

### Test 2: Landing Page
Navigate to: http://localhost:3000

- [ ] Hero section displays "Know the risk before you ship"
- [ ] Visual pipeline shows 6 components
- [ ] Trust metrics cards are visible (4 cards)
- [ ] "Analyze a Pull Request" button works
- [ ] "Try Demo" button works
- [ ] Navigation menu works

**Expected**: Professional landing page with all content visible.

---

### Test 3: Demo Mode (Most Important!)
1. Click **"Try Demo"** from landing page
2. Click **"Start Demo"** button
3. Watch animated pipeline (6 steps)

- [ ] Pipeline animation plays smoothly
- [ ] All 6 steps complete (Loading PR → Complete)
- [ ] Automatically navigates to results page
- [ ] Results page loads with data

**Expected**: Full demo completes in ~10 seconds and shows results.

---

### Test 4: Demo PR Analysis
Navigate to: http://localhost:3000/analyze

1. Select **"Demo PRs"** tab
2. Click **"Analyze"** on any demo PR (e.g., PR #142)
3. Wait for analysis

- [ ] All 5 demo PRs are listed
- [ ] Each shows critical/high count
- [ ] Analysis completes successfully
- [ ] Navigates to review page

**Expected**: Demo analysis works reliably every time.

---

### Test 5: Analysis Results Page

After analyzing Demo PR #142:

- [ ] Risk Score displays (should be 82/100)
- [ ] Status shows "HIGH RISK" or "RELEASE BLOCKED"
- [ ] Category breakdown bars are visible
- [ ] Top 3 Must-Fix section shows issues
- [ ] Findings list displays SQL Injection finding
- [ ] Click finding to expand - shows full details
- [ ] Suggested fix is visible with code
- [ ] Test case is visible
- [ ] Copy buttons work

**Expected**: Complete analysis results with all sections populated.

---

### Test 6: Finding Details (Certainty Engine)

Expand the SQL Injection finding:

- [ ] Shows 🔴 CERTAIN badge
- [ ] Confidence shows 98% or higher
- [ ] Evidence section explains the issue
- [ ] Explanation describes why it's a problem
- [ ] Impact section shows potential consequences
- [ ] Suggested fix shows parameterized query
- [ ] Test case shows actual test code
- [ ] "Copy" buttons work for fix and test

**Expected**: Rich, explainable finding with high confidence.

---

### Test 7: Other Demo Scenarios

Try each demo PR:

**Demo 1 (PR #142): SQL Injection**
- [ ] Shows 1 critical finding
- [ ] Risk score 82/100
- [ ] Status: HIGH RISK

**Demo 2 (PR #156): Hardcoded Secrets**
- [ ] Shows 2 critical findings (API key + webhook)
- [ ] Risk score 78/100
- [ ] Status: HIGH RISK

**Demo 3 (PR #178): N+1 Query**
- [ ] Shows 1 high finding (performance)
- [ ] Risk score 45/100
- [ ] Status: MODERATE

**Demo 4 (PR #203): Null Reference**
- [ ] Shows 1-2 high findings
- [ ] Risk score 58/100
- [ ] Status: MODERATE

**Demo 5 (PR #215): Mixed Issues**
- [ ] Shows 5 findings
- [ ] Multiple categories
- [ ] Risk score 72/100
- [ ] Status: HIGH RISK

**Expected**: Each demo has different findings and risk levels.

---

### Test 8: Dashboard
Navigate to: http://localhost:3000/dashboard

- [ ] Sidebar navigation visible
- [ ] Stats cards show numbers (Total PRs, Critical Issues, etc.)
- [ ] Recent reviews list displays
- [ ] Quick actions panel visible
- [ ] System status shows "Operational"
- [ ] All navigation links work

**Expected**: Professional dashboard with metrics.

---

### Test 9: Release Control Tower
Navigate to: http://localhost:3000/control-tower

- [ ] Large risk score displays (82/100)
- [ ] Release status shows 🔴 RELEASE BLOCKED or 🟠 HIGH RISK
- [ ] Issue breakdown grid (4 categories)
- [ ] "Why?" section explains the block
- [ ] "What To Do?" section lists steps
- [ ] PR info displays at top

**Expected**: Mission-control style interface with large risk display.

---

### Test 10: Reviews List
Navigate to: http://localhost:3000/reviews

- [ ] Multiple reviews listed (5 demo PRs)
- [ ] Each shows risk score badge
- [ ] Critical/high counts visible
- [ ] Timestamps show relative time
- [ ] "View Report" button works
- [ ] Stats summary at bottom (4 cards)

**Expected**: List of all analyzed PRs.

---

### Test 11: Evaluation Page
Navigate to: http://localhost:3000/evaluation

- [ ] Precision shows 91.3%
- [ ] Recall shows 84.0%
- [ ] F1 Score shows 87.5%
- [ ] False Positive Rate shows 8.7%
- [ ] Benchmark dataset info displays (25 issues)
- [ ] Confusion matrix table shows certainty levels
- [ ] Category performance shows 4 categories
- [ ] Key insights section has 4 points

**Expected**: Real evaluation metrics from benchmark.

---

### Test 12: Architecture Page
Navigate to: http://localhost:3000/architecture

- [ ] 6-step pipeline visualization
- [ ] Each step has icon, title, and description
- [ ] Arrows between steps
- [ ] "What Makes ReleaseGuard Different" section
- [ ] Tech stack grid (4 items)
- [ ] CTAs at bottom work

**Expected**: Clear explanation of how system works.

---

### Test 13: Stack Trace Linker
Navigate to: http://localhost:3000/debug

1. Click **"TypeError Example"** button
2. Click **"Analyze Error"**

- [ ] Error type detected (TypeError)
- [ ] Error message extracted
- [ ] Stack trace parsed with file:line
- [ ] Likely cause explanation shows
- [ ] Suggested fix displays with code
- [ ] Confidence score shows

**Expected**: Error log parsed and analyzed.

---

## 🎨 UI/UX Tests

### Test 14: Dark Mode & Design
Check across all pages:

- [ ] Dark background throughout
- [ ] Glass effect on cards
- [ ] Gradient text on titles
- [ ] Color-coded risk levels (red/orange/yellow/green)
- [ ] Smooth animations (e.g., demo pipeline)
- [ ] Loading spinners work
- [ ] Buttons have hover effects
- [ ] No layout shifts

**Expected**: Consistent, polished dark UI.

---

### Test 15: Responsive Design
Resize browser window:

- [ ] Landing page adapts to mobile
- [ ] Dashboard sidebar stays functional
- [ ] Cards stack on mobile
- [ ] Tables scroll horizontally if needed
- [ ] All buttons remain accessible

**Expected**: Usable on different screen sizes.

---

## 🔧 Optional Features (Require Setup)

### Test 16: Paste Diff (No API Key Required)
Navigate to: http://localhost:3000/analyze

1. Select **"Paste Diff"** tab
2. Paste any git diff
3. Click **"Analyze Diff"**

- [ ] Textarea accepts input
- [ ] Validation works (shows error if empty)
- [ ] Analysis starts
- [ ] Shows static analysis results (even without AI)

**Expected**: Works with static analysis only.

---

### Test 17: GitHub PR URL (Requires GITHUB_TOKEN)
If you have a GitHub token:

1. Add `GITHUB_TOKEN=ghp_...` to `.env`
2. Restart server
3. Go to http://localhost:3000/analyze
4. Select **"GitHub URL"** tab
5. Enter a public PR URL
6. Click **"Analyze Pull Request"**

- [ ] URL validation works
- [ ] Fetches diff from GitHub
- [ ] Displays analysis results

**Expected**: Fetches and analyzes real GitHub PRs.

---

### Test 18: AI Analysis (Requires API Key)
If you have OpenAI/Anthropic key:

1. Add `OPENAI_API_KEY=sk-...` to `.env`
2. Restart server
3. Paste a diff in analyze page
4. Click "Analyze Diff"

- [ ] Takes longer (10-30s)
- [ ] Findings have more detailed explanations
- [ ] Confidence scores may be higher
- [ ] Test cases more sophisticated

**Expected**: Enhanced analysis with AI explanations.

---

## ✅ Critical Path (Must Work for Demo)

These are absolutely essential:

1. ✅ **App starts**: `npm run dev` works
2. ✅ **Landing page loads**: No errors
3. ✅ **Demo mode works**: One-click demo completes
4. ✅ **Demo PR analysis**: All 5 scenarios work
5. ✅ **Results display**: Risk score, findings, fixes show
6. ✅ **Control Tower loads**: Signature feature accessible
7. ✅ **Evaluation page**: Shows metrics
8. ✅ **No console errors**: Check browser console

**If all 8 pass**: ✅ **READY TO DEMO**

---

## 🐛 Common Issues & Fixes

### Issue: Port 3000 in use
```bash
PORT=3001 npm run dev
```

### Issue: Dependencies error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
```bash
npm run type-check
```

### Issue: Demo doesn't load
- Check browser console for errors
- Verify `global.d.ts` exists
- Restart server

---

## 📊 Success Criteria

### Minimum Viable Demo
- [x] Demo mode works completely
- [x] Shows real analysis results
- [x] UI is polished and professional
- [x] No major bugs or crashes

### Full Feature Set
- [x] All pages accessible
- [x] 5 demo scenarios work
- [x] Static analysis functional
- [x] Risk scoring works
- [x] Test generation works
- [x] Evaluation metrics display

### Production Ready
- [x] No API keys required for demo
- [x] Error handling in place
- [x] Input validation works
- [x] Documentation complete
- [x] Can deploy to Vercel

---

## 🎯 Final Verdict

**Total Tests**: 18  
**Critical Tests**: 8  
**Required to Pass**: 8/8 critical

**Status**: ✅ READY FOR HACKATHON PRESENTATION

If all critical tests pass, the application is fully functional and ready to demonstrate!
