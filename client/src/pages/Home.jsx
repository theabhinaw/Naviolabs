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

export default function Home({ handleGetRealNumber, prefill }) {
  return (
    <>
      <Hero />
      <ToolsStrip />
      <Services />
      <CodePlayground />
      <AISimulator />
      <Calculator onGetRealNumber={handleGetRealNumber} />
      <Process />
      <Team />
      <FAQ />
      <ContactForm prefill={prefill} />
    </>
  );
}
