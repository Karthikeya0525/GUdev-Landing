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
      content: `You are the "Senior Product Strategy Orchestrator" for Agentic UX. 
      Your goal is to conduct a high-stakes, 5-stage interview with a founder to synthesize a professional-grade Product Requirements Document (PRD).

      STAGES TO COVER:
      1. PROBLEM: What is the sharpest pain point? (Current: ${messages.length < 3 ? 'In Progress' : 'Covered'})
      2. PERSONA: Who specifically loses sleep over this? (Current: ${messages.length < 5 ? 'Pending' : 'Covered'})
      3. MVP: What is the ONE feature that makes this viable? (Current: ${messages.length < 7 ? 'Pending' : 'Covered'})
      4. DIFFERENTIATION: Why won't Google/OpenAI just build this? (Current: ${messages.length < 9 ? 'Pending' : 'Covered'})
      5. VIABILITY: How does this scale?

      STRICT INTERVIEW PROTOCOL:
      1. NEVER ask more than 1 question at a time.
      2. ANALYZE & CHALLENGE: If a user's answer is weak, challenge it like a real PM. (e.g., "That feature sounds like a 'nice-to-have'. How does it solve the core pain we discussed?")
      3. SUMMARIZE: Every 2 responses, provide a "PM Synthesis" of what we've locked in.
      4. CONCLUDE: After ~5-6 exchanges, OR once you have high-quality data for all 5 stages, you MUST stop asking questions.
      5. TRANSITION: When finished, provide a final summary of the vision and end with EXACTLY this phrase: "RESEARCH COMPLETE. Your product blueprint is ready for orchestration. Would you like to proceed?"

      Tone: Strategic, clinical yet encouraging, high-agency.`
    };

    const apiMessages = [systemPrompt, ...messages];

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://agentic-ux.ai', // Optional but good for OpenRouter
        'X-Title': 'Agentic UX'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // Upgrade to the best reasoning model
        messages: apiMessages,
        temperature: 0.7
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
