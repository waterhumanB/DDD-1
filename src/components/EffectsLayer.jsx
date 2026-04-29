export default function EffectsLayer({ slashes, impactWords, combatBolts }) {
  return (
    <div className="slash-layer" aria-hidden="true">
      {slashes.map((s) => (
        <div
          key={s.id}
          className="slash"
          style={{
            '--angle': `${s.angle}deg`,
            left: `${s.left}%`,
            top: `${s.top}%`,
          }}
        />
      ))}
      {impactWords.map((word) => (
        <div
          key={word.id}
          className={`impact-word ${word.isFinisher ? 'impact-word--finisher' : ''}`}
          style={{ left: `${word.left}%`, top: `${word.top}%` }}
        >
          {word.text}
        </div>
      ))}
      {combatBolts.map((bolt) => (
        <div
          key={bolt.id}
          className="combat-bolt"
          style={{
            '--bolt-color': bolt.color,
            '--bolt-delay': `${bolt.delay}s`,
            top: `${bolt.top}%`,
          }}
        />
      ))}
    </div>
  )
}
