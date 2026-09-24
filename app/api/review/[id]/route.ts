import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Get review from in-memory store (in production, fetch from database)
    if (typeof global !== 'undefined' && global.demoReviews) {
      const review = global.demoReviews.get(reviewId);
      
      if (review) {
        return NextResponse.json({ success: true, review });
      }
    }

    return NextResponse.json(
      { error: 'Review not found' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
