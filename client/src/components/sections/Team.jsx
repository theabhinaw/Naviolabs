import SectionHead from '../ui/SectionHead.jsx';
import { TEAM } from '../../data/content.js';

export default function Team() {
  return (
    <section className="team-cinematic-container" id="team" aria-labelledby="team-title">
      <div className="wrap cinematic-header-wrap">
        <SectionHead id="team-title" title="The people behind Navio Labs">
          Navio Labs is founder-led. You work directly with the people who build your automation.
        </SectionHead>
      </div>

      <div className="team-sticky-stack">
        {TEAM.map((person, index) => {
          const firstName = person.name.split(' ')[0];
          
          return (
            <article 
              className="team-cinematic-panel" 
              key={person.id} 
              style={{ 
                '--lane': `var(--${person.lane})`, 
                zIndex: index + 1 
              }}
            >
              <div className="tc-bg">
                {person.photo ? (
                  <img src={person.photo} alt={person.name} className="tc-photo" />
                ) : (
                  <div className="tc-photo-placeholder" />
                )}
                <div className="tc-overlay"></div>
              </div>
              
              <div className="tc-content wrap">
                <div className="tc-huge-text" aria-hidden="true">
                  {firstName.toUpperCase()}
                </div>
                
                <div className="tc-info">
                  <p className="tc-greeting">HI, I'M {person.name.toUpperCase()}</p>
                  <h3 className="tc-role">{person.role.toUpperCase()}</h3>
                  
                  <p className="tc-bio">{person.bio}</p>
                  
                  <ul className="tc-focus" aria-label={`${person.name} focuses on`}>
                    {person.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
