import { NextRequest, NextResponse } from 'next/server';
import { triggerCronJob } from '@/lib/cron/jobs';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobName: string }> }
) {
  try {
    // Verify API key for security (in production, use proper authentication)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.CRON_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jobName } = await params;
    const result = await triggerCronJob(jobName);

    return NextResponse.json({
      success: true,
      job: jobName,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    const { jobName } = await params;
    console.error(`Cron job ${jobName} error:`, error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
