// app/api/search/route.js
// This runs server-side on Vercel — your API key stays secret.

export async function POST(request) {
  try {
    const { location, categories } = await request.json();

    if (!location) {
      return Response.json({ error: "Location is required" }, { status: 400 });
    }

    // Build a category filter string if the student picked specific ones
    const categoryFilter =
      categories && categories.length > 0
        ? `Focus on these categories: ${categories.join(", ")}.`
        : "Include a mix of volunteering, clubs, sports, arts, STEM, leadership, internships, and summer programs.";

    const prompt = `Find 8 real extracurricular opportunities for high school students near ${location}.
${categoryFilter}

For each opportunity, return ONLY a JSON array with this exact structure (no markdown, no commentary, just valid JSON):
[
  {
    "title": "Name of the opportunity",
    "category": "one of: volunteer, club, sport, arts, stem, leadership, internship, summer",
    "source": "website domain where this was found (e.g. habitataustin.org)",
    "description": "2-sentence summary of what students do and why it's valuable",
    "deadline": "application deadline or 'Rolling enrollment'",
    "commitment": "estimated time commitment (e.g. '4 hrs/week')"
  }
]

Only include real, verifiable opportunities that currently exist. Return ONLY the JSON array.`;

    // Call Gemini API with Google Search grounding enabled
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }], // Grounding with Google Search
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      return Response.json(
        { error: "Failed to fetch opportunities" },
        { status: 500 }
      );
    }

    const data = await geminiResponse.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from the response (Gemini sometimes wraps it in markdown)
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return Response.json(
        { error: "Could not parse opportunities", raw: rawText },
        { status: 500 }
      );
    }

    const opportunities = JSON.parse(jsonMatch[0]);

    return Response.json({ opportunities, location });
  } catch (error) {
    console.error("Search route error:", error);
    return Response.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}