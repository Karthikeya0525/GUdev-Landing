import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generatePDF } from '@/lib/pdfGenerator';


export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API Key is missing.' }, { status: 500 });
    }

    const instruction = `
      You are a product manager expert and the UI/UX Pro Max Design Intelligence AI.
      Analyze the following startup idea and generate a professional PRD structure along with a tailored Design System.
      Return strictly valid JSON. No conversational text or markdown blocks.
      
      The JSON structure MUST be exactly:
      {
        "project_name": "Name",
        "tagline": "Catchy tagline",
        "problem_statement": "Clear problem description",
        "solution": "Solution overview",
        "target_audience": ["Audience 1", "Audience 2"],
        "market_opportunity": "Market analysis",
        "core_features": ["Feature 1", "Feature 2"],
        "user_flow": ["Step 1", "Step 2"],
        "monetization_model": "Revenue model",
        "tech_stack_suggestion": ["Frontend", "Backend", "Database"],
        "timeline_estimate": "Estimated time to MVP",
        "risks": ["Risk 1", "Risk 2"],
        "future_scope": "Future plans",
        "ux_strategy": {
          "primary_goal": "e.g., Conversion, Trust, Efficiency",
          "rationale": "Deep explanation of why this layout was chosen based on UX laws (e.g. Hick's Law, F-Pattern).",
          "psychological_triggers": ["Trust", "Urgency", "Calm"]
        },
        "color_theory": {
          "palette_type": "Monochromatic | Analogous | Complementary",
          "rationale": "Why these specific colors were chosen for this industry.",
          "accessibility_rating": "AA | AAA"
        },
        "design_system": {
          "layout_pattern": "dashboard | saas_landing | ecommerce | mobile_app",
          "style_keywords": "e.g., Soft shadows, brutalism, glassmorphism",
          "typography": {
            "heading": "Font family",
            "body": "Font family",
            "pairing_rationale": "Why these fonts work together"
          },
          "tokens": {
            "radius": "e.g., 0.5rem, 1.5rem, 0px",
            "spacing": "e.g., compact, airy, standard",
            "shadow": "e.g., soft, sharp, glow"
          }
        },
        "branding_colors": {
          "primary": "Hex code",
          "secondary": "Hex code",
          "background": "Hex code",
          "text": "Hex code"
        }
      }
      
      Rules for Design Intelligence:
      - layout_pattern MUST be strictly one of: "dashboard", "saas_landing", "ecommerce", "mobile_app".
      - Pick an industry-appropriate color palette based on COLOR THEORY (e.g., Finance -> Trust/Blue, Food -> Appetite/Red-Yellow).
      - Provide a detailed UX Strategy rationale explaining the placement of key elements.
      
      User Idea: "${prompt}"
    `;

    // 1. Call OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: instruction }]
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      throw new Error(`OpenRouter API error: ${errorText}`);
    }

    const data = await openRouterResponse.json();
    const text = data.choices[0]?.message?.content;
    
    if (!text) throw new Error("No response from OpenRouter");

    const prdData = JSON.parse(text);

    // 2. Generate PDF
    const pdfBase64 = await generatePDF(prdData);

    let generationId = null;
    if (supabase) {
      try {
        const { data: dbData, error: dbError } = await supabase
          .from('projects')
          .insert([{ 
            name: prdData.project_name,
            prompt, 
            data: prdData, 
            created_at: new Date().toISOString() 
          }])
          .select('id')
          .single();
        
        if (dbData) generationId = dbData.id;
      } catch (dbError) {}
    }

    return NextResponse.json({ data: prdData, pdfBase64, id: generationId });

  } catch (error: any) {
    console.error('CRITICAL ERROR:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
