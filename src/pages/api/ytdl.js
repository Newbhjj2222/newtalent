import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    // Validate URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get audio info
    const info = await ytdl.getInfo(url);

    // Find the best audio format
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

    if (!audioFormat || !audioFormat.url) {
      throw new Error('Audio URL ntiboneka');
    }

    // Return direct audio URL
    res.status(200).json({ audioUrl: audioFormat.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
