import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API Key is missing.' }, { status: 500 });
    }

    const systemPrompt = {
      role: 'system',
      content: 'You are an expert Product Builder, Startup Advisor, and UX/UI Researcher. Your goal is to guide the user on how to build a product from scratch. You provide deep dives into product strategy, market research, wireframing, tech stack choices, and launching. Be concise, highly actionable, and professional.'
    };

    const apiMessages = [systemPrompt, ...messages];

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'z-ai/glm-4.5-air:free',
        messages: apiMessages
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      throw new Error(`OpenRouter API error: ${errorText}`);
    }

    const data = await openRouterResponse.json();
    const text = data.choices[0]?.message?.content;
    
    if (!text) throw new Error("No response from OpenRouter");

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('CHAT ERROR:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
