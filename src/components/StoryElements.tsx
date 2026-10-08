import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Cake, Camera, Compass, Heart, Mail, MessageCircle, Sparkles, Sun, X } from 'lucide-react'
import { birthdayCountdown, formatDate, relationshipDuration } from '../utils/dates'
import { loveStory } from '../config/loveStory'

export function StoryIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = ({ heart: Heart, message: MessageCircle, camera: Camera, sparkles: Sparkles, cake: Cake, compass: Compass, sun: Sun } as Record<string, typeof Heart>)[name] || Heart
  return <Icon size={size} strokeWidth={1.4} />
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.8, delay }}>{children}</motion.div>
}

export function SectionHeading({ number, label, title, subtitle }: { number: string; label: string; title: string; subtitle?: string }) {
  return <Reveal className="section-heading"><p className="eyebrow"><span>{number}</span> {label}</p><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}<span className="heading-rule"><Heart size={12} /></span></Reveal>
}

export function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <div className={`photo-fallback ${className}`} role="img" aria-label={alt}><Camera /><span>{alt}</span></div> : <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
}

export function Counter({ type, date }: { type: 'birthday' | 'relationship'; date: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer) }, [])
  const birthday = birthdayCountdown(date, now)
  const values = type === 'birthday' ? birthday.values : relationshipDuration(date, now)
  const labels = type === 'birthday' ? ['Days', 'Hours', 'Minutes', 'Seconds'] : ['Years', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds']
  return <div className={`counter-wrap ${type}`}><p className="counter-intro">{type === 'birthday' ? (birthday.today ? 'Today is your special day!' : 'Until your next birthday') : 'We have been creating memories together for...'}</p><div className="counter-grid">{values.map((value, index) => <div key={labels[index]}><span className="counter-value">{String(value).padStart(2, '0')}</span><span className="counter-label">{labels[index]}</span></div>)}</div></div>
}

export function Typewriter({ text, active }: { text: string; active: boolean }) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active || reduced) return
    const timer = setInterval(() => setCount(previous => {
      if (previous >= text.length) { clearInterval(timer); return previous }
      return previous + 3
    }), 22)
    return () => clearInterval(timer)
  }, [active, text, reduced])
  const complete = reduced || count >= text.length
  return <><span className="sr-only">{text}</span><span aria-hidden="true">{text.slice(0, reduced ? text.length : count)}{!complete && <span className="typing-cursor">|</span>}</span>{!complete && <button className="skip-typing" onClick={() => setCount(text.length)}>Show full letter</button>}</>
}

type LetterProps = { label: string; text: string; signature?: string; main?: boolean; onOpen?: () => void; autoOpen?: boolean; onContinue?: () => void }

function EnvelopeLetter({ label, text, signature, onOpen, autoOpen = false, onContinue }: LetterProps) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<'closed' | 'flap' | 'paper' | 'reading' | 'returning' | 'closing'>('closed')
  const [paperHeight, setPaperHeight] = useState(520)
  const paper = useRef<HTMLDivElement>(null)
  const id = label.replace(/[^a-z]/gi, '-').toLowerCase()
  const expanded = phase !== 'closed'
  const extracted = phase === 'paper' || phase === 'reading'
  const flapOpen = phase !== 'closed' && phase !== 'closing'
  const busy = phase !== 'closed' && phase !== 'reading'

  useEffect(() => {
    if (!paper.current) return
    const observer = new ResizeObserver(entries => setPaperHeight(entries[0].contentRect.height))
    observer.observe(paper.current)
    return () => observer.disconnect()
  }, [])

  function openLetter() {
    if (phase !== 'closed') return
    setPhase(reduced ? 'reading' : 'flap')
    onOpen?.()
  }

  return <motion.div className={`letter-reveal main-letter ${expanded ? 'is-open' : ''}`} data-phase={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.4 }} onAnimationComplete={() => { if (autoOpen && phase === 'closed') openLetter() }}>
    <div className={`envelope-stage ${expanded ? 'expanded' : ''}`}>
      <div className="envelope-back" aria-hidden="true" />
      <div className="paper-pocket">
        <motion.div ref={paper} id={id} className="letter-paper extracted-paper" aria-hidden={phase !== 'reading'} initial={false} animate={{ y: extracted ? 0 : paperHeight + 32 }} transition={{ duration: reduced ? 0 : 1.45, ease: [0.22, 0.65, 0.3, 1] }} onAnimationComplete={() => { if (phase === 'paper') setPhase('reading'); if (phase === 'returning') setPhase('closing') }}>
          <motion.div className="letter-text" initial={false} animate={{ opacity: phase === 'reading' ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.6 }}>
            {phase === 'reading' && <><Typewriter active text={text} />{signature && <p className="signature">{signature}<Heart size={18} /></p>}</>}
          </motion.div>
        </motion.div>
      </div>
      <div className="envelope-front" aria-hidden="true"><p>For thae thae, with all my heart</p></div>
      <button type="button" className="wax-seal" aria-label={`${label} using heart seal`} title={label} aria-expanded={expanded} aria-controls={id} aria-hidden={expanded} disabled={expanded} onClick={openLetter}><Heart size={24} aria-hidden="true" /></button>
      <motion.div className="envelope-flap" aria-hidden="true" style={{ zIndex: flapOpen && phase !== 'flap' ? 1 : 4 }} initial={false} animate={{ rotateX: flapOpen ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.85, ease: 'easeInOut' }} onAnimationComplete={() => { if (phase === 'flap') setPhase('paper'); if (phase === 'closing') setPhase('closed') }} />
      {phase === 'reading' && !reduced && <div className="letter-hearts" aria-hidden="true">{[0, 1, 2, 3].map(index => <motion.span key={index} style={{ left: `${14 + index * 24}%` }} initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.45, 0], y: -95, rotate: index % 2 ? 12 : -12 }} transition={{ duration: 3, delay: index * 0.25 }}>{index % 2 ? <Sparkles size={13} /> : <Heart size={15} />}</motion.span>)}</div>}
    </div>
    <div className="envelope-actions"><button className="primary-button" aria-expanded={expanded} aria-controls={id} disabled={busy} onClick={() => { if (phase === 'closed') openLetter(); else setPhase(reduced ? 'closed' : 'returning') }}><Mail size={17} />{expanded ? 'Close the letter' : label}</button>{onContinue && phase === 'reading' && <button className="text-button" onClick={onContinue}>Continue Our Story <ArrowRight size={17} /></button>}</div>
    <span className="sr-only" role="status">{phase === 'reading' ? 'Your letter is ready to read.' : ''}</span>
  </motion.div>
}

export function LetterReveal({ label, text, signature, main = false, onOpen, autoOpen, onContinue }: LetterProps) {
  const [open, setOpen] = useState(false)
  const id = label.replace(/[^a-z]/gi, '-').toLowerCase()
  if (main) return <EnvelopeLetter label={label} text={text} signature={signature} onOpen={onOpen} autoOpen={autoOpen} onContinue={onContinue} />
  return <div className={`letter-reveal ${main ? 'main-letter' : ''} ${open ? 'is-open' : ''}`}>
    <button className={main ? 'primary-button' : 'text-button'} aria-expanded={open} aria-controls={id} onClick={() => { setOpen(!open); if (!open) onOpen?.() }}><Mail size={17} /> {open ? 'Close the letter' : label}</button>
    <AnimatePresence>{open && <motion.div id={id} className="letter-paper" initial={{ opacity: 0, height: 0, y: 25 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.65 }}><div className="letter-text">{main ? <Typewriter active={open} text={text} /> : text}{signature && <p className="signature">{signature}<Heart size={18} /></p>}</div></motion.div>}</AnimatePresence>
  </div>
}

export function Confetti({ active }: { active: boolean }) {
  return <AnimatePresence>{active && <div className="confetti" aria-hidden="true">{Array.from({ length: 36 }, (_, index) => <motion.i key={index} style={{ left: `${(index * 17) % 100}%`, background: ['#ba7587', '#d8b56d', '#e5b8be'][index % 3] }} initial={{ opacity: 1, y: -40, rotate: 0 }} animate={{ opacity: 0, y: 500, rotate: index % 2 ? 360 : -360, x: (index % 3 - 1) * 70 }} transition={{ duration: 2.8, delay: (index % 5) * 0.12 }} />)}</div>}</AnimatePresence>
}

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const memories = loveStory.memories
  useEffect(() => {
    if (selected !== null) { if (!dialog.current?.open) dialog.current?.showModal() }
    else { dialog.current?.close(); trigger.current?.focus() }
  }, [selected])
  const move = (direction: number) => setSelected(previous => previous === null ? null : (previous + direction + memories.length) % memories.length)
  return <><div className="memory-grid">{memories.map((memory, index) => <Reveal key={memory.image} delay={(index % 3) * 0.1} className="memory-item"><button onClick={event => { trigger.current = event.currentTarget; setSelected(index) }} aria-label={`View memory: ${memory.caption}`}><Photo src={memory.image} alt={memory.caption} /><div className="memory-caption"><span>{memory.location}</span><h3>{memory.caption}</h3><span className="memory-arrow"><ArrowRight size={18} /></span></div></button></Reveal>)}</div>
    <dialog ref={dialog} className="lightbox" aria-label="Our memory" onCancel={event => { event.preventDefault(); setSelected(null) }} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null) }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setSelected(null) } if (event.key === 'ArrowRight') { event.preventDefault(); move(1) } if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) } }}>
      {selected !== null && <div className="lightbox-content"><button className="icon-button close-button" aria-label="Close memory" onClick={() => setSelected(null)} autoFocus><X /></button><Photo src={memories[selected].image} alt={memories[selected].caption} /><div className="lightbox-details"><p className="eyebrow">{formatDate(memories[selected].date)} / {memories[selected].location}</p><h3>{memories[selected].caption}</h3><p>{memories[selected].description}</p><div className="lightbox-nav"><button className="icon-button" aria-label="Previous memory" onClick={() => move(-1)}><ArrowLeft /></button><span>{selected + 1} / {memories.length}</span><button className="icon-button" aria-label="Next memory" onClick={() => move(1)}><ArrowRight /></button></div></div></div>}
    </dialog></>
}