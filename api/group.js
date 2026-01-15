export default async (req, res) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const signupsTable = process.env.AIRTABLE_TABLE_NAME || 'Signups';
  const groupsTable = process.env.AIRTABLE_GROUPS_TABLE || 'Groups';
  const groupSize = parseInt(process.env.GROUP_SIZE || '6', 10);

  if (!apiKey || !baseId) {
    return res.status(500).json({ ok: false, error: 'Missing Airtable env vars' });
  }

  try {
    // Fetch ungrouped signups
    const listUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(signupsTable)}?filterByFormula=${encodeURIComponent("NOT({Grouped})")}`;
    const listResp = await fetch(listUrl, { headers: { Authorization: `Bearer ${apiKey}` } });
    const listJson = await listResp.json();
    const records = listJson.records || [];

    // Helpers
    const getPrimarySection = (sectionsStr) => {
      if (!sectionsStr) return 'Unknown';
      const parts = String(sectionsStr).split(',').map(s => s.trim()).filter(Boolean);
      return parts[0] || 'Unknown';
    };

    // Bucket by date preference AND coffee personality (similar vibe)
    const buckets = {};
    for (const r of records) {
      const f = r.fields || {};
      const datePref = (f.DatePreference || 'Unspecified').trim();
      const vibe = (f.CoffeePersonality || 'Any').trim();
      const key = `${datePref}||${vibe}`;
      if (!buckets[key]) buckets[key] = { datePref, vibe, people: [] };
      buckets[key].people.push({ id: r.id, email: f.Email, phone: f.Phone, sections: f.Sections, primarySection: getPrimarySection(f.Sections) });
    }

    // Create groups aiming for mixed sections within same vibe/date bucket
    const createdGroups = [];
    for (const { datePref, vibe, people } of Object.values(buckets)) {
      // Work on a mutable copy
      const pool = [...people];
      while (pool.length > 0) {
        const group = [];
        const used = new Set();
        // Pass 1: pick distinct sections first
        for (let i = 0; i < pool.length && group.length < groupSize; i++) {
          const p = pool[i];
          if (!used.has(p.primarySection)) {
            group.push(p);
            used.add(p.primarySection);
            pool.splice(i, 1);
            i--;
          }
        }
        // Pass 2: top up if needed
        while (pool.length > 0 && group.length < groupSize) {
          group.push(pool.shift());
        }
        if (group.length < 3) {
          // too small; push back and break to avoid micro-groups
          pool.unshift(...group);
          break;
        }
        const memberEmails = group.map(x => x.email).filter(Boolean);
        const createUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(groupsTable)}`;
        const createResp = await fetch(createUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              DatePreference: datePref,
              Vibe: vibe,
              Members: memberEmails.join(', '),
              Size: group.length,
              CreatedAt: new Date().toISOString()
            }
          })
        });
        const created = await createResp.json();
        if (createResp.ok) {
          const groupId = created.id;
          createdGroups.push({ id: groupId, pref: datePref, vibe, size: group.length });
          // Mark grouped
          const updateUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(signupsTable)}`;
          const updates = group.map(c => ({ id: c.id, fields: { Grouped: true } }));
          await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ records: updates })
          });
        }
      }
    }

    return res.status(200).json({ ok: true, groups: createdGroups });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || 'Error grouping signups' });
  }
};
