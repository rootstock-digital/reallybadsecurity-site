import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Shop from './components/Shop'
import YouTube from './components/YouTube'
import Medium from './components/Medium'
import About from './components/About'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Ticker />
      <Shop />
      <YouTube />
      <Medium />
      <Newsletter />
      <Footer />
    </main>
  )
}