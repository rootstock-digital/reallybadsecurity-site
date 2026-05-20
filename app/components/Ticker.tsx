export default function Ticker() {
  const items = ['Podcast', 'Security Content', 'Merch Drop', 'No Jargon', 'Community', 'YouTube', 'TikTok', 'Authenticated Access', 'Not Another Demo']
  return (
    <div style={{ overflow: 'hidden', background: '#E8621A', padding: '10px 0', position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'flex', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0D1B2A', padding: '0 32px' }}>
            ◆ {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
