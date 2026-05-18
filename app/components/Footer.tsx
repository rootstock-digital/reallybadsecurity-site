export default function Footer() {
  return (
    <footer style={{ padding: '40px', borderTop: '1px solid rgba(139,163,184,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, background: '#0D1B2A', flexWrap: 'wrap', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/rbs-shield-only-logo.png" alt="Really Bad Security" style={{ height: 36, width: 36, objectFit: 'contain' }} />
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', color: 'rgba(139,163,184,0.6)', textTransform: 'uppercase' }}>Really Bad Security</span>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(139,163,184,0.5)' }}>© 2025 Really Bad Security. Making bad security good.</p>
      <ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 0 }}>
        {[
          { label: 'Shop', url: 'https://shop.reallybadsecurity.com' },
          { label: 'Medium', url: 'https://medium.com/@reallybadsecurity' },
          { label: 'YouTube', url: 'https://www.youtube.com/@reallybadsecurity' },
          { label: 'Newsletter', url: 'https://reallybadsecurity.beehiiv.com' },
        ].map((link, i) => (
          <li key={i}><a href={link.url} target="_blank" style={{ fontSize: 13, color: 'rgba(139,163,184,0.5)', textDecoration: 'none' }}>{link.label}</a></li>
        ))}
      </ul>
    </footer>
  )
}
