'use client'
import Image from 'next/image'
import { useState } from 'react'
import styles from './Nav.module.css'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <a href="#" className={styles.logo}>
          <Image src="/rbs-shield-only-logo.png" alt="Really Bad Security" width={44} height={44} className={styles.logoImage} />
          <div className={styles.logoText}>
            Really Bad<span className={styles.logoTextAccent}>Security</span>
          </div>
        </a>
        <ul className={`nav-links ${styles.navLinks}`}>
          <li><a href="#about" className={styles.navLink}>About</a></li>
          <li><a href="#shop" className={styles.navLink}>Shop</a></li>
          <li><a href="#youtube" className={styles.navLink}>Content</a></li>
          <li><a href="https://shop.reallybadsecurity.com" target="_blank" rel="noopener noreferrer" className={styles.navCta}>Shop Now</a></li>
        </ul>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className={`nav-menu-btn ${styles.menuBtn}`}
        >
          MENU
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.dropdown}>
          <a href="#about" onClick={() => setMenuOpen(false)} className={styles.dropdownLink}>About</a>
          <a href="#youtube" onClick={() => setMenuOpen(false)} className={styles.dropdownLink}>Content</a>
          <a href="#shop" onClick={() => setMenuOpen(false)} className={styles.dropdownLink}>Shop</a>
          <a href="https://shop.reallybadsecurity.com" target="_blank" rel="noopener noreferrer" className={styles.dropdownCta}>Shop Now</a>
        </div>
      )}
    </>
  )
}
