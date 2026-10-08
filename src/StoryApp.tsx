import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Cake, CalendarDays, Heart, RotateCcw, Sparkles, X } from 'lucide-react'
import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { loveStory as story } from './config/loveStory'
import { Confetti, Counter, Gallery, LetterReveal, Photo, Reveal, SectionHeading, StoryIcon } from './components/StoryElements'
import { MusicControl } from './components/MusicControl'
import { BirthdaySurprise } from './components/BirthdaySurprise'
import { useMusic } from './hooks/useMusic'
import { formatDate, isValidDate } from './utils/dates'

const anniversaryStorageKey = `our-love-story:anniversary:${story.dates.anniversary}`

export default function StoryApp() {
  const [anniversary, setAnniversary] = useState(() => {
    try {
      const saved = localStorage.getItem(anniversaryStorageKey)
      return saved && isValidDate(saved) ? saved : story.dates.anniversary
    } catch { return story.dates.anniversary }
  })
  const [anniversaryDraft, setAnniversaryDraft] = useState(anniversary)
  const [anniversaryStatus, setAnniversaryStatus] = useState('')
  const [opened, setOpened] = useState(false)
  const [storyLetter, setStoryLetter] = useState(false)
  const storyDialog = useRef<HTMLDialogElement>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [valentine, setValentine] = useState(false)
  const [nextChapter, setNextChapter] = useState(false)
  const music = useMusic()
  const reduced = useReducedMotion()
  useEffect(() => { if (!celebrate) return; const timer = setTimeout(() => setCelebrate(false), 4000); return () => clearTimeout(timer) }, [celebrate])
  useEffect(() => {
    if (!storyLetter) { storyDialog.current?.close(); return }
    storyDialog.current?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [storyLetter])
  function goTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }) }
  function changeAnniversary(value: string) {
    setAnniversaryDraft(value)
    if (!isValidDate(value)) { setAnniversaryStatus('Choose a complete, valid date.'); return }
    setAnniversary(value)
    try {
      localStorage.setItem(anniversaryStorageKey, value)
      setAnniversaryStatus('Saved on this browser.')
    } catch { setAnniversaryStatus('Updated for this visit.') }
  }
  function openStory() {
    setOpened(true)
    music.play()
    setStoryLetter(true)
  }
  function continueStory() {
    storyDialog.current?.close()
    setStoryLetter(false)
    goTo('welcome')
    document.getElementById('welcome-title')?.focus({ preventScroll: true })
  }
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#welcome">Skip to our story</a>
    <dialog ref={storyDialog} className="story-letter-dialog" aria-label="A letter to begin our story" onCancel={event => { event.preventDefault(); setStoryLetter(false) }} onClose={() => setStoryLetter(false)}>
      <button className="icon-button close-button" aria-label="Close story letter" onClick={() => setStoryLetter(false)} autoFocus><X /></button>
      {storyLetter && <LetterReveal main autoOpen label="Open Our Story Letter" text={`${story.messages.welcomeTitle}\n\n${story.messages.welcome}\n\n${story.messages.welcomeEnd}`} signature={story.yourName} onContinue={continueStory} />}
    </dialog>
    <header className="site-header"><a className="brand" href="#home"><Heart size={19} strokeWidth={1.3} /><span>{story.title}<small>YOU, ME & ALL THE LITTLE THINGS</small></span></a><nav aria-label="Story chapters"><a href="#story">Our story</a><a href="#memories">Memories</a><a href="#letter">A letter for you</a></nav><MusicControl music={music} /></header>
    <main>
      <section id="home" className="opening">
        <img className="hero-background" src={story.images.hero} alt="A quiet sea beneath a pink evening sky" fetchPriority="high" />
        <div className="hero-wash" />
        <div className="floating-hearts" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <Heart key={index} size={12 + index % 3 * 6} style={{ left: `${8 + index * 10}%`, animationDelay: `${index * -1.7}s`, animationDuration: `${14 + index}s` }} />)}</div>
        <motion.div className="opening-content" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <div className="hero-badge"><span /> A STORY WRITTEN BY TWO HEARTS <span /></div>
          <motion.p className="opening-prelude" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.35, duration: 1 }}>{story.messages.opening}</motion.p>
          <h1>Our <em>Love</em> Story<motion.span initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 1.2, duration: 1 }}>{story.messages.openingReveal}<Heart className="hero-heart" size={25} /></motion.span></h1>
          <p className="opening-note">{story.messages.openingNote}</p>
          <button className="primary-button" onClick={openStory}>{opened ? 'Back to Our Story' : 'Open Our Story'} <Heart size={15} /></button>
          <p className="hero-dedication">For {story.partnerName}, with all my heart.</p>
        </motion.div>
        <a className="scroll-note" href="#welcome"><span>EVERY MOMENT LED ME TO YOU</span><ArrowDown size={15} /></a>
        <span className="hero-side-note">EST. {new Date(story.dates.firstMeeting).getFullYear()} &nbsp; / &nbsp; STILL WRITING OUR STORY</span>
      </section>
      <section id="welcome" className="welcome section-pad">
        <Reveal><Heart className="section-heart" size={24} strokeWidth={1.2} /><p className="eyebrow">THIS ONE IS JUST FOR YOU</p><h2 id="welcome-title" tabIndex={-1}>{story.messages.welcomeTitle}</h2><p className="welcome-copy">{story.messages.welcome}</p><p className="handwritten">{story.messages.welcomeEnd}</p><button className="text-button" onClick={() => goTo('story')}>Continue <ArrowDown size={16} /></button></Reveal>
      </section>
      <section id="story" className="timeline-section section-pad">
        <SectionHeading number="01" label="THE BEGINNING OF US" title="Where Our Story Began" subtitle="Some moments seem small. Until they change everything." />
        <div className="timeline">{story.timeline.map((event, index) => <Reveal className={`timeline-event ${index % 2 ? 'reversed' : ''}`} key={event.date}><div className="timeline-photo"><Photo src={event.image} alt={event.title} /><span className="photo-number">0{index + 1}</span></div><span className="timeline-marker"><StoryIcon name={event.icon} size={17} /></span><div className="timeline-copy"><p className="eyebrow">{event.tag}</p><time dateTime={event.date}>{formatDate(event.date)}</time><h3>{event.title}</h3><p>{event.description}</p></div></Reveal>)}</div>
      </section>
      <section className="falling-section section-pad"><Reveal><p className="eyebrow">SOMEWHERE BETWEEN HELLO AND FOREVER</p><h2>The Moment I Realized...</h2><p className="falling-story">{story.messages.falling}</p><Reveal className="falling-reveal"><p>{story.messages.fallingReveal}</p><Heart size={29} fill="currentColor" /></Reveal></Reveal></section>
      <section className="confession-section section-pad"><SectionHeading number="02" label="THREE LITTLE WORDS" title="The Day I Finally Said It" /><div className="split-layout"><Reveal className="confession-photo"><Photo src={story.images.confession} alt="Two people sharing a quiet moment together" /><span className="photo-script">the beginning of something beautiful</span></Reveal><Reveal className="split-copy"><p className="eyebrow">{formatDate(story.dates.confession)}</p><h3>A nervous heart.<br />An honest kind of love.</h3><p>{story.messages.confessionStory}</p><LetterReveal label="Read what I wanted to say..." text={story.messages.confession} /></Reveal></div></section>
      <section className="birthday-section section-pad"><SectionHeading number="03" label="THE WORLD GOT A LITTLE BRIGHTER" title="Happy Birthday Love!" /><div className="birthday-layout"><Reveal className="birthday-image"><BirthdaySurprise wish={story.messages.birthdayWish} /><div className="birthday-date"><Cake size={16} /><span>{formatDate(story.dates.birthday).replace(/, \d{4}/, '')}</span></div></Reveal><Reveal className="birthday-copy"><div className="candles" aria-label="Three glowing birthday candles">{[0, 1, 2].map(index => <span key={index}><i /></span>)}</div><h3>Here's to you,<br /><em>my favorite person.</em></h3><p>{story.messages.birthday}</p><LetterReveal label="Open Your Birthday Letter" text={story.messages.birthdayLetter} onOpen={() => { if (!reduced) setCelebrate(true) }} /><Counter type="birthday" date={story.dates.birthday} /></Reveal></div><Confetti active={celebrate} /></section>
      <section className="anniversary-section section-pad"><SectionHeading number="04" label="ALL THIS TIME, ALL THIS LOVE" title="Another Chapter With You" subtitle={`Together since ${formatDate(anniversary)}`} /><Reveal><div className="anniversary-date-control"><label htmlFor="anniversary-date"><CalendarDays size={17} aria-hidden="true" />Our anniversary</label><input id="anniversary-date" type="date" min="0100-01-01" max="9999-12-31" value={anniversaryDraft} aria-invalid={!isValidDate(anniversaryDraft)} aria-describedby="anniversary-date-status" onChange={event => changeAnniversary(event.target.value)} /><button className="icon-button" type="button" title="Use configured anniversary date" aria-label="Use configured anniversary date" onClick={() => changeAnniversary(story.dates.anniversary)}><RotateCcw size={16} /></button></div><p id="anniversary-date-status" className="anniversary-date-status" role="status">{anniversaryStatus || '\u00a0'}</p><Counter type="relationship" date={anniversary} /><p className="handwritten">{story.messages.anniversary}</p></Reveal><div className="anniversary-photos">{story.memories.slice(0, 3).map((memory, index) => <Reveal key={memory.caption} delay={index * 0.12}><Photo src={memory.image} alt={memory.caption} /><p>{memory.caption}</p></Reveal>)}</div></section>
      <section className="valentine-section section-pad"><div className="valentine-photo"><Photo src={story.images.valentines} alt="Soft pink roses" /></div><Reveal className="valentine-copy"><p className="eyebrow">FEBRUARY 14 / AND EVERY OTHER DAY</p><h2>My kind of<br /><em>Valentine's Day.</em></h2><p>{story.messages.valentines}</p><button className="text-button" aria-expanded={valentine} aria-controls="valentine-message" onClick={() => setValentine(!valentine)}>{valentine ? 'Keep this close' : "There's something I want you to know..."}<Heart size={16} /></button>{valentine && <motion.p id="valentine-message" className="hidden-message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{story.messages.valentinesHidden}</motion.p>}</Reveal></section>
      <section id="memories" className="gallery-section section-pad"><SectionHeading number="05" label="THE THINGS I WANT TO KEEP" title="Little Moments, Big Memories" subtitle="Not perfect pictures. Just perfectly ours." /><Gallery /></section>
      <section id="letter" className="love-letter-section section-pad"><SectionHeading number="06" label="A FEW WORDS FROM MY HEART" title="A Letter For You" subtitle="Some feelings deserve more than a text message." /><Reveal><LetterReveal main label="Open My Letter" text={story.messages.letter} signature={story.yourName} /></Reveal></section>
      <section className="future-section section-pad"><SectionHeading number="07" label="OUR FAVORITE CHAPTER IS STILL UNWRITTEN" title="Our Story Isn't Over Yet..." subtitle={story.messages.future} /><div className="future-grid">{story.future.map((future, index) => <Reveal className="future-item" key={future.title} delay={(index % 3) * 0.1}><StoryIcon name={future.icon} /><h3>{future.title}</h3><p>{future.text}</p></Reveal>)}</div></section>
      <section className="final-section section-pad"><Photo src={story.images.final} alt="Golden sunlight over an open landscape" className="final-background" /><div className="final-wash" /><Reveal className="final-content"><Heart className="beating-heart" size={40} strokeWidth={1.2} /><p className="eyebrow">{story.messages.finalIntro}</p><h2>{story.messages.final}</h2><p className="handwritten">{story.messages.finalEnd}</p><button className="primary-button" onClick={() => setNextChapter(true)}>{nextChapter ? 'To all our tomorrows' : 'To our next chapter'}{nextChapter ? <Heart size={17} fill="currentColor" /> : <ArrowRight size={17} />}</button><p className="final-response" role="status">{nextChapter ? story.messages.finalResponse : '\u00a0'}</p></Reveal></section>
    </main>
    <footer><span className="footer-brand">{story.title}</span><p>Made with <Heart size={12} fill="currentColor" /> by {story.yourName}, for {story.partnerName}.</p><span>OUR STORY. ALWAYS.</span><Sparkles size={14} /></footer>
  </MotionConfig>
}