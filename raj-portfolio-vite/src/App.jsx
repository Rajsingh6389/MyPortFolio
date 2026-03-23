import Cursor         from './components/Cursor';
import ParticleCanvas  from './components/ParticleCanvas';
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import About           from './components/About';
import Skills          from './components/Skills';
import Experience      from './components/Experience';
import Projects        from './components/Projects';
import Contact         from './components/Contact';
import Divider         from './components/Divider';
import Footer          from './components/Footer';

export default function App() {
  return (
    <>
      {/* Global effects */}
      <Cursor />
      <ParticleCanvas />

      {/* Layout */}
      <Navbar />
      <main>
        <Hero />
        <Divider />
        <About />
        <Divider />
        <Skills />
        <Divider />
        <Experience />
        <Divider />
        <Projects />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
