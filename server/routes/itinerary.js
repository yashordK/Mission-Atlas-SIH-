import { Router } from 'express';
import Groq from 'groq-sdk';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/itinerary
// Body: { places: string[], state: string, dates: string }
router.post('/', async (req, res) => {
  const { places, state, dates } = req.body;

  if (!places?.length || !state || !dates) {
    return res.status(400).json({ error: 'places, state, and dates are required' });
  }

  const prompt = `Create a detailed day-wise travel itinerary for visiting ${places.join(', ')} in ${state} (Northeast India) for the dates ${dates}.

For each day include:
- Morning, afternoon, and evening activities
- Suggested timings
- Local food recommendations
- Transportation tips
- Safety advice specific to the region

Format clearly with Day headings.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable travel assistant specializing in Northeast India tourism. Provide practical, safety-aware, culturally sensitive travel itineraries. Keep responses concise and well-structured.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const itinerary = completion.choices[0]?.message?.content ?? 'No itinerary generated.';
    res.json({ itinerary });
  } catch (err) {
    console.error('Groq itinerary error:', err);
    res.status(500).json({ error: 'Failed to generate itinerary', detail: err.message });
  }
});

export default router;
