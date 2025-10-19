import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const command = `yt-dlp -f bestaudio -g ${url}`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) console.error(stderr);

    const audioUrl = stdout.trim();
    if (!audioUrl) throw new Error('Audio URL ntiboneka');

    res.status(200).json({ audioUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
