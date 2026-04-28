import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdfGenerator';

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    const pdfBase64 = await generatePDF(data);
    
    return NextResponse.json({ pdfBase64 });

  } catch (error: any) {
    console.error('PDF Render Error:', error);
    return NextResponse.json({ error: 'Failed to render PDF' }, { status: 500 });
  }
}
