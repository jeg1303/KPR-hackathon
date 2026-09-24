import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'GitHub PR URL is required' },
        { status: 400 }
      );
    }

    // Parse GitHub URL
    const prMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    
    if (!prMatch) {
      return NextResponse.json(
        { error: 'Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123' },
        { status: 400 }
      );
    }

    const [, owner, repo, prNumber] = prMatch;

    // Check for GitHub token
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Please set GITHUB_TOKEN environment variable or try the demo/paste options.' },
        { status: 503 }
      );
    }

    // Fetch PR diff from GitHub API
    const prApiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3.diff',
      'Authorization': `Bearer ${githubToken}`,
      'User-Agent': 'ReleaseGuard-AI',
    };

    const response = await fetch(prApiUrl, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Pull request not found. Check the URL and ensure the repository is accessible.' },
          { status: 404 }
        );
      }
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded or insufficient permissions.' },
          { status: 403 }
        );
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const diff = await response.text();

    if (!diff || diff.length === 0) {
      return NextResponse.json(
        { error: 'No diff content found for this pull request' },
        { status: 400 }
      );
    }

    // Forward to diff analysis endpoint
    const diffAnalysisUrl = new URL('/api/analyze/diff', request.url);
    const diffResponse = await fetch(diffAnalysisUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff }),
    });

    const result = await diffResponse.json();

    if (!diffResponse.ok) {
      return NextResponse.json(result, { status: diffResponse.status });
    }

    // Add GitHub metadata to the stored review
    if (result.reviewId && typeof global !== 'undefined' && global.demoReviews) {
      const review = global.demoReviews.get(result.reviewId);
      if (review) {
        review.prNumber = parseInt(prNumber);
        review.repository = `${owner}/${repo}`;
        review.title = `PR #${prNumber}`;
        review.url = url;
        global.demoReviews.set(result.reviewId, review);
      }
    }

    return NextResponse.json({
      ...result,
      prInfo: {
        owner,
        repo,
        number: prNumber,
        url,
      },
    });
  } catch (error: any) {
    console.error('GitHub analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch and analyze GitHub PR' },
      { status: 500 }
    );
  }
}
