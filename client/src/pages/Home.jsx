import Hero from '../components/sections/Hero.jsx';
import ToolsStrip from '../components/sections/ToolsStrip.jsx';
import Services from '../components/sections/Services.jsx';
import CodePlayground from '../components/sections/CodePlayground.jsx';
import AISimulator from '../components/sections/AISimulator.jsx';
import Calculator from '../components/sections/Calculator.jsx';
import Process from '../components/sections/Process.jsx';
import Team from '../components/sections/Team.jsx';
import FAQ from '../components/sections/FAQ.jsx';
import ContactForm from '../components/sections/ContactForm.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import Marquee from '../components/ui/Marquee.jsx';

export default function Home({ handleGetRealNumber, prefill }) {
  return (
    <>
      <Hero />
      <ToolsStrip />

      <Marquee />

      <ScrollReveal animation="fadeUp">
        <Services />
      </ScrollReveal>

      <ScrollReveal animation="fadeUp" delay={100}>
        <CodePlayground />
      </ScrollReveal>

      <ScrollReveal animation="scaleIn">
        <AISimulator />
      </ScrollReveal>

      <ScrollReveal animation="fadeUp" delay={100}>
        <Calculator onGetRealNumber={handleGetRealNumber} />
      </ScrollReveal>

      <ScrollReveal animation="fadeLeft">
        <Process />
      </ScrollReveal>

      <ScrollReveal animation="fadeUp" delay={100}>
        <Team />
      </ScrollReveal>

      <ScrollReveal animation="fadeRight">
        <FAQ />
      </ScrollReveal>

      <ScrollReveal animation="scaleIn">
        <ContactForm prefill={prefill} />
      </ScrollReveal>
    </>
  );
}
