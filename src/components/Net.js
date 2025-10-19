'use client';
import { useState, useRef } from 'react';

export default function NeTDownloader() {
  const [url, setUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notesVisible, setNotesVisible] = useState(false);

  const playerRef = useRef();
  const blobAnchorRef = useRef();
  const directAnchorRef = useRef();

  const resetUI = () => {
    setAudioUrl('');
    setMeta({});
    setProgress(0);
    setNotesVisible(false);
  };

  const extractFilenameFromUrl = (url) => {
    try {
      const u = new URL(url);
      const path = u.pathname;
      const name = path.split('/').filter(Boolean).pop() || 'audio';
      return decodeURIComponent(name);
    } catch (e) {
      return 'audio';
    }
  };

  // --- Fetch audio from webpage ---
  const checkUrl = async () => {
    resetUI();
    if (!url) return alert('Shyiramo URL mbere.');
    setLoading(true);

    try {
      const resp = await fetch(url, { mode: 'cors' });
      if (!resp.ok) throw new Error('Failed to fetch the page');
      const contentType = resp.headers.get('content-type') || '';
      const cl = resp.headers.get('content-length');

      setMeta({
        url,
        type: contentType,
        size: cl ? `${Math.round(Number(cl) / 1024)} KB` : '',
        filename: extractFilenameFromUrl(url),
        cors: 'Audio found on page',
      });

      const text = await resp.text();
      const audioRegex = /<audio[^>]*src="([^"]+)"/g;
      const matches = [];
      let match;
      while ((match = audioRegex.exec(text)) !== null) matches.push(match[1]);

      if (matches.length > 0) {
        setAudioUrl(matches[0]);
        if (playerRef.current) playerRef.current.src = matches[0];
        if (directAnchorRef.current) {
          directAnchorRef.current.href = matches[0];
          directAnchorRef.current.download = extractFilenameFromUrl(matches[0]);
        }
      } else {
        alert('Nta ma-audio yabonetse kuri iyi page.');
      }
    } catch (err) {
      console.error(err);
      alert('Ikosa ryabaye: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch & download via blob with progress ---
  const fetchAndDownload = async (audioLink) => {
    resetUI();
    const targetUrl = audioLink || url;
    if (!targetUrl) return alert('Shyiramo URL mbere.');
    setLoading(true);
    setProgress(0);

    try {
      const resp = await fetch(targetUrl, { method: 'GET', mode: 'cors' });
      if (!resp.ok) throw new Error('Network response not OK: ' + resp.status);

      const contentType = resp.headers.get('content-type') || '';
      const cl = resp.headers.get('content-length');

      setMeta({
        url: targetUrl,
        type: contentType,
        size: cl ? `${Math.round(Number(cl) / 1024)} KB` : '',
        filename: extractFilenameFromUrl(targetUrl),
        cors: 'Fetched via blob',
      });

      const reader = resp.body.getReader();
      const contentLength = cl ? Number(cl) : null;
      let received = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (contentLength) setProgress(Math.round((received / contentLength) * 100));
        else setProgress((prev) => Math.min(95, prev + 6));
      }
      setProgress(100);

      const blob = new Blob(chunks, { type: contentType || 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);
      setAudioUrl(blobUrl);
      if (playerRef.current) playerRef.current.src = blobUrl;
      if (blobAnchorRef.current) {
        blobAnchorRef.current.href = blobUrl;
        blobAnchorRef.current.download = extractFilenameFromUrl(targetUrl);
      }
      setNotesVisible(true);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000 * 60 * 5);
    } catch (err) {
      console.error(err);
      alert('Fetch failed: ' + err.message);
      setNotesVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch YouTube audio via API with progress ---
  const fetchYouTubeAudio = async () => {
    resetUI();
    if (!url) return alert('Shyiramo YouTube URL mbere.');
    setLoading(true);
    setProgress(0);

    try {
      const resp = await fetch(`/api/ytdl?url=${encodeURIComponent(url)}`);
      const data = await resp.json();
      if (!resp.ok || !data.audioUrl) throw new Error(data.error || 'Audio URL ntiboneka');

      const audioLink = data.audioUrl;

      // Download via blob to track progress
      await fetchAndDownload(audioLink);
    } catch (err) {
      console.error(err);
      alert('Ikosa ryabaye: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="card p-4">
      <h1 id="title">NeT Downloader</h1>
      <p className="lead">
        Andika cyangwa shyiramo <b>direct audio URL</b> (mp3/wav/ogg) cyangwa <b>URL y'urupapuro</b>. Iyi page izagerageza gukina audio no kuyigura (download) mu buryo bwemewe.
      </p>

      <div className="row mb-2">
        <input
          type="url"
          placeholder="Paste direct audio URL or webpage URL"
          aria-label="Audio URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkUrl()}
          className="border p-2 w-full mr-2"
        />
        <button onClick={checkUrl} disabled={loading}>Check & Load</button>
        <button onClick={fetchYouTubeAudio} disabled={loading}>Download YouTube Audio</button>
        <button onClick={() => fetchAndDownload()} disabled={loading}>Fetch & Download</button>
        <button onClick={() => url && window.open(url, '_blank', 'noopener')} disabled={loading}>Open URL</button>
      </div>

      {meta.url && (
        <div className="meta mb-2">
          <div><b>URL:</b> {meta.url}</div>
          <div><b>Content-Type:</b> {meta.type}</div>
          <div><b>Detected filename:</b> {meta.filename}</div>
          <div><b>Size:</b> {meta.size}</div>
          <div><b>CORS:</b> {meta.cors}</div>
        </div>
      )}

      <audio ref={playerRef} controls hidden={!audioUrl} className="w-full mb-2" />

      {progress > 0 && progress < 100 && (
        <div className="progress mb-2 border h-4 w-full bg-gray-200">
          <div className="bg-blue-500 h-4" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="row-actions mb-2">
        <a ref={directAnchorRef} download hidden={!audioUrl}><button>Direct Download (is allowed)</button></a>
        <a ref={blobAnchorRef} download hidden={!audioUrl}><button>Download (via fetched blob)</button></a>
      </div>

      {notesVisible && (
        <div id="notes" className="note mb-2">
          <strong>Note:</strong> Niba server ifite CORS disabled, browser izahagarika fetch; muri ubwo buryo kanda <em>Open URL</em> kugirango ugerageze gufungura iyo file mu tab nshya.
        </div>
      )}

      <div id="warning" className="warning mb-2">
        <strong>Important:</strong> Ntukoreshe iyi tool mu gukuramo ama-audio utabifitiye uburenganzira.
      </div>

      <footer>
        Ikitonderwa: Iyi page n'izagufasha gusa <code>ku downloadinga audio ukoresheje URLs</code> kandi ntigomba gukoreshwa ngo ihungabanye amategeko. New talents stories group, all rights reserved
      </footer>
    </main>
  );
}
