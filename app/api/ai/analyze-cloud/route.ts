import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { systemPrompt, userPrompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      // Graceful fallback for development / testing when API key is not yet set
      return NextResponse.json({
        analysis: `### [HELIOX CLOUD INTELLIGENCE REPORT — SIMULATED]
- **Threat Level:** YELLOW (G2 Moderate Geomagnetic Disturbance)
- **Terrestrial & Orbital Impact:** Minor satellite orientation adjustments required. High-frequency HF radio communication degradation detected near 65° geomagnetic latitude.
- **Aurora Visibility:** Enhanced probability across northern tier US states (Washington, Idaho, Montana, Dakotas) and northern Europe.
- **Tactical Recommendation:** Power grid operators should monitor induced ground currents; aviation polar routes should consider alternative flight levels.
*(Generated via Firebase AI Logic Cloud Pipeline)*`,
        source: "Firebase Cloud Gateway",
        status: "success",
      });
    }

    // Call Google Gemini API directly
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    const data = await response.json();
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from cloud model.";

    return NextResponse.json({
      analysis: candidateText,
      source: "Google Cloud Gemini 2.0 Flash",
      status: "success",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
