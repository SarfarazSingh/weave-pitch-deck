export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const data = req.body || {};
    const {
      email,
      phone,
      date_preference,
      section_other,
      sections,
      timestamp,
      coffee_personality,
      lull_response,
      unknown_social,
      enjoy_gatherings,
      background_soundtrack,
      wild_order_reaction
    } = data;

    // Airtable config via env vars
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Signups';

    if (!apiKey || !baseId) {
      return res.status(500).json({ ok: false, error: 'Missing Airtable env vars' });
    }

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const fields = {
      Email: email || '',
      Phone: phone || '',
      DatePreference: date_preference || '',
      Sections: Array.isArray(sections) ? sections.join(', ') : (sections || ''),
      SectionOther: section_other || '',
      Timestamp: timestamp || new Date().toISOString(),
      Grouped: false,
      CoffeePersonality: coffee_personality || '',
      LullResponse: lull_response || '',
      UnknownSocial: unknown_social || '',
      EnjoyGatherings: enjoy_gatherings || '',
      BackgroundSoundtrack: background_soundtrack || '',
      WildOrderReaction: wild_order_reaction || ''
    };

    const resp = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });

    const out = await resp.json();
    if (!resp.ok) {
      const msg = out.error?.message || (typeof out.error === 'string' ? out.error : JSON.stringify(out));
      return res.status(resp.status).json({ ok: false, error: msg });
    }

    return res.status(200).json({ ok: true, id: out.id });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || 'Unknown error' });
  }
};
