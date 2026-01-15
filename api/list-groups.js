export default async (req, res) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const groupsTable = process.env.AIRTABLE_GROUPS_TABLE || 'Groups';
  if (!apiKey || !baseId) {
    return res.status(500).json({ ok: false, error: 'Missing Airtable env vars' });
  }
  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(groupsTable)}?sort%5B0%5D%5Bfield%5D=CreatedAt&sort%5B0%5D%5Bdirection%5D=desc`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    const json = await resp.json();
    if (!resp.ok) {
      const msg = json.error?.message || (typeof json.error === 'string' ? json.error : JSON.stringify(json));
      return res.status(resp.status).json({ ok: false, error: msg });
    }
    return res.status(200).json({ ok: true, records: json.records || [] });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || 'Unknown error' });
  }
};
