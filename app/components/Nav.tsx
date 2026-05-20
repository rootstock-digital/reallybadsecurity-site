'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(13,27,42,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(232,98,26,0.2)'
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Image src="/rbs-shield-only-logo.png" alt="Really Bad Security" width={44} height={44} style={{ objectFit: 'contain' }} />
          <div style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: 18, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.1, color: '#F5F0E8' }}>
            Really Bad<span style={{ color: '#E8621A', display: 'block' }}>Security</span>
          </div>
        </a>
        <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
          <li><a href="#about" style={{ color: '#8BA3B8', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>About</a></li>
          <li><a href="#shop" style={{ color: '#8BA3B8', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Shop</a></li>
          <li><a href="#youtube" style={{ color: '#8BA3B8', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Content</a></li>
          <li><a href="https://shop.reallybadsecurity.com" target="_blank" style={{ background: '#E8621A', color: '#0D1B2A', padding: '8px 20px', borderRadius: 2, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>Shop Now</a></li>
        </ul>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: '1.5px solid rgba(139,163,184,0.3)', borderRadius: 2, padding: '8px 12px', cursor: 'pointer', color: '#F5F0E8', fontSize: 20 }}
        >
          MENU
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: '#0D1B2A', borderBottom: '2px solid rgba(232,98,26,0.3)',
          padding: '8px 20px', position: 'fixed', top: 73, left: 0, right: 0, zIndex: 99
        }}>
          <a href="#about" onClick={() => setMenuOpen(false)} style={{ color: '#F5F0E8', textDecoration: 'none', fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 0', borderBottom: '1px solid rgba(139,163,184,0.1)' }}>About</a>
          <a href="#content" onClick={() => setMenuOpen(false)} style={{ color: '#F5F0E8', textDecoration: 'none', fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 0', borderBottom: '1px solid rgba(139,163,184,0.1)' }}>Content</a>
          <a href="#shop" onClick={() => setMenuOpen(false)} style={{ color: '#F5F0E8', textDecoration: 'none', fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 0', borderBottom: '1px solid rgba(139,163,184,0.1)' }}>Shop</a>
          <a href="https://shop.reallybadsecurity.com" target="_blank" style={{ color: '#E8621A', textDecoration: 'none', fontWeight: 700, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 0' }}>Shop Now</a>
        </div>
      )}
    </>
  )
}
