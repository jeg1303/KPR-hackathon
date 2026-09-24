import { NextRequest, NextResponse } from 'next/server';
import { getDemoPR } from '@/lib/demo-data';
import { calculateRiskScore } from '@/lib/risk-engine';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { demoId } = body;

    if (!demoId) {
      return NextResponse.json(
        { error: 'Demo ID is required' },
        { status: 400 }
      );
    }

    // Get demo PR data
    const demoPR = getDemoPR(demoId);
    
    if (!demoPR) {
      return NextResponse.json(
        { error: 'Demo PR not found' },
        { status: 404 }
      );
    }

    // Calculate risk score from demo findings
    const riskScore = calculateRiskScore(demoPR.findings);

    // Create review ID (in production, this would be saved to database)
    const reviewId = generateId();

    // Store in session/cache (for demo purposes, we'll use a simple in-memory store)
    // In production, save to database using Prisma
    if (typeof global !== 'undefined') {
      if (!global.demoReviews) {
        global.demoReviews = new Map();
      }
      global.demoReviews.set(reviewId, {
        id: reviewId,
        prNumber: demoPR.number,
        repository: demoPR.repository,
        title: demoPR.title,
        diff: demoPR.diff,
        findings: demoPR.findings,
        riskScore,
        analysisType: 'demo',
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      reviewId,
      message: 'Demo analysis completed',
    });
  } catch (error: any) {
    console.error('Demo analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
