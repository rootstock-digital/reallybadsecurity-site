import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import About from './components/About'
import Content from './components/Content'
import Shop from './components/Shop'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <About />
      <Content />
      <Shop />
      <Newsletter />
      <Footer />
    </main>
  )
}
