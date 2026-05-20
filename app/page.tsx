import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Shop from './components/Shop'
import Content from './components/Content'
import About from './components/About'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <Shop />
      <Content />
      <About />
      <Newsletter />
      <Footer />
    </main>
  )
}