import ScrollReveal from '../ui/ScrollReveal.jsx';

const PROJECTS = [
  {
    id: 'bharatai',
    title: 'Bharat AI',
    category: 'AI Fashion Experience',
    tech: ['React', 'TypeScript', 'Golang', 'Gemini', 'Redis'],
    desc: 'An immersive virtual styling and semantic matching platform powered by Gemini. We automated the entire catalog tagging process and provided real-time conversational styling for users.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    link: '#'
  },
  {
    id: 'kaabilai',
    title: 'KaabilAI',
    category: 'AI Career Navigation',
    tech: ['Node.js', 'React', 'OpenAI', 'PostgreSQL'],
    desc: 'Intelligent resume analysis and skill-gap matching system. Automates JD parsing and learning roadmap generation, helping users bridge the gap to their dream jobs with zero manual intervention.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    link: '#'
  },
  {
    id: 'hashira',
    title: 'Hashira ATS',
    category: 'Smart Recruitment Pipeline',
    tech: ['MERN Stack', 'Claude AI', 'AWS'],
    desc: 'A complete end-to-end Applicant Tracking System. We integrated Claude to automatically rank thousands of applications based on custom semantic criteria, saving HR teams hundreds of hours.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
    link: '#'
  }
];

export default function SelectedWork() {
  return (
    <section className="section section-dark sw-section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <ScrollReveal animation="fadeUp">
          <div className="sw-head">
            <h2 id="work-title">Selected Work</h2>
            <p>We build scalable applications and intelligent automation systems.</p>
          </div>
        </ScrollReveal>

        <div className="sw-grid">
          {PROJECTS.map((project, index) => (
            <ScrollReveal animation="fadeUp" delay={index * 150} key={project.id}>
              <article className="sw-card">
                <div className="sw-visual">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="sw-overlay">
                    <a href={project.link} className="btn btn-primary sw-cta">View Project</a>
                  </div>
                </div>
                <div className="sw-content">
                  <div className="sw-meta">
                    <span className="sw-category">{project.category}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  <ul className="sw-tech">
                    {project.tech.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
