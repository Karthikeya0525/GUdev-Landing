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
      content: `You are the "PRD Research Orchestrator" for Agentic UX. 
      Your goal is to conduct a deep research session with the user to prepare a comprehensive Product Requirements Document (PRD).
      
      FOLLOW THESE RULES:
      1. DO NOT give all answers at once. Ask ONE or TWO targeted questions at a time to keep the user engaged.
      2. Cover these areas: Core Problem, Target Audience, Key Features (MVP), Competitive Advantage, and Monetization.
      3. If the user provides a vague idea, dig deeper. (e.g., "That sounds interesting, but who specifically is the first user group for this?")
      4. Once you have enough information for all key PRD sections, provide a summary and say: "I have enough information to generate your Blueprint. Would you like to proceed?"
      5. Be professional, encouraging, and highly analytical.`
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
