import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Upload, X, Music2 } from "lucide-react";

type Track = { title: string; artist: string; src: string };
const PRESET: Track[] = [
  { title: "Amanecer lento", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Luz de tarde", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Constelaciones", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [tracks, setTracks] = useState<Track[]>(PRESET);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.6);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(false);

  useEffect(() => { if (audio.current) audio.current.volume = muted ? 0 : vol; }, [vol, muted]);
  useEffect(() => { if (playing) audio.current?.play().catch(() => setPlaying(false)); }, [i]);

  const toggle = () => {
    const a = audio.current!;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {}); else { a.pause(); setPlaying(false); }
  };
  const go = (d: number) => setI((x) => (x + d + tracks.length) % tracks.length);
  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const added = Array.from(files).map((f) => ({ title: f.name.replace(/\.[^.]+$/, ""), artist: "Archivo local", src: URL.createObjectURL(f) }));
    setTracks((t) => [...t, ...added]); setI(tracks.length); setPlaying(true);
  };
  const t = tracks[i];

  return (
    <div className="fixed bottom-20 right-3 z-40 md:bottom-5 md:right-5">
      <audio ref={audio} src={t.src} preload="metadata" onEnded={() => go(1)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))} />
      {!open ? (
        <button onClick={() => setOpen(true)} aria-label="Abrir música" className="glass flex size-12 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105">
          {playing ? <Bars playing /> : <Music2 className="size-5" strokeWidth={1.6} />}
        </button>
      ) : (
        <div className="glass w-[min(22rem,calc(100vw-1.5rem))] rounded-3xl p-4 animate-rise" style={{ animationDuration: ".5s" }}>
          <div className="flex items-start gap-3">
            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/15">
              <Bars playing={playing} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl leading-tight">{t.title}</p>
              <p className="truncate text-xs text-muted-foreground">{t.artist}</p>
            </div>
            <button onClick={() => setList((l) => !l)} aria-label="Lista" className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><ListMusic className="size-4" /></button>
            <button onClick={() => setOpen(false)} aria-label="Minimizar" className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
          </div>
          <div className="mt-3 h-1 cursor-pointer overflow-hidden rounded-full bg-muted"
            onClick={(e) => { const a = audio.current!; const r = e.currentTarget.getBoundingClientRect(); if (a.duration) a.currentTime = ((e.clientX - r.left) / r.width) * a.duration; }}>
            <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button onClick={() => go(-1)} aria-label="Anterior" className="rounded-full p-2 hover:bg-accent"><SkipBack className="size-4" /></button>
              <button onClick={toggle} aria-label={playing ? "Pausa" : "Reproducir"} className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95">
                {playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
              </button>
              <button onClick={() => go(1)} aria-label="Siguiente" className="rounded-full p-2 hover:bg-accent"><SkipForward className="size-4" /></button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMuted((m) => !m)} aria-label="Silenciar" className="text-muted-foreground hover:text-foreground">{muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}</button>
              <input type="range" min={0} max={1} step={0.01} value={vol} onChange={(e) => setVol(+e.target.value)} className="w-20 accent-[var(--primary)]" aria-label="Volumen" />
            </div>
          </div>
          {list && (
            <div className="mt-3 max-h-48 space-y-1 overflow-auto border-t pt-3">
              {tracks.map((tr, k) => (
                <button key={k} onClick={() => { setI(k); setPlaying(true); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-accent ${k === i ? "text-primary" : ""}`}>
                  <span className="truncate">{tr.title}</span><span className="ml-2 shrink-0 text-xs text-muted-foreground">{tr.artist}</span>
                </button>
              ))}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                <Upload className="size-4" /> Añadir canciones de tu dispositivo
                <input type="file" accept="audio/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Bars({ playing }: { playing: boolean }) {
  return (
    <div className="flex h-5 items-end gap-[3px]">
      {[0, 1, 2, 3].map((k) => (
        <span key={k} className="w-[3px] rounded-full bg-primary"
          style={{ height: playing ? undefined : 4, animation: playing ? `eq 1s ${k * 0.15}s ease-in-out infinite alternate` : "none" }} />
      ))}
      <style>{`@keyframes eq{0%{height:4px}100%{height:20px}}`}</style>
    </div>
  );
}
