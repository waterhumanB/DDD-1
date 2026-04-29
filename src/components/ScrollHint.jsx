export default function ScrollHint({ hidden }) {
  return (
    <div className={`scroll-hint ${hidden ? 'is-hidden' : ''}`}>
      ▼ SCROLL TO START ▼
    </div>
  )
}
