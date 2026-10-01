import { useRef } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { TEAM } from '../../data/content.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Team() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Select all photo wrappers
    const visuals = gsap.utils.toArray('.tc-visual-column');
    
    visuals.forEach((col) => {
      const wrapper = col.querySelector('.tc-floating-photo-wrapper');
      
      // Create a 360 degree rotation linked to scroll
      gsap.to(wrapper, {
        rotationY: 360,
        ease: "none",
        scrollTrigger: {
          trigger: col,
          start: "top bottom", // Animation starts when the image enters from bottom
          end: "bottom top",   // Ends when it leaves the top
          scrub: 1.5,          // Smooth scrubbing effect (like the reel)
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section className="team-cinematic-container" id="team" aria-labelledby="team-title" ref={containerRef}>
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
              {/* Massive background typography */}
              <div className="tc-massive-bg-text" aria-hidden="true">
                <span className="tc-bg-line1">HI, I'M {firstName.toUpperCase()}</span>
                <span className="tc-bg-line2">{person.role.toUpperCase()}</span>
              </div>
              
              <div className="tc-content wrap">
                
                {/* 3D Floating Image Component (Scroll to Scrub 360) */}
                <div className="tc-visual-column">
                  <div className="tc-floating-photo-wrapper">
                    
                    {/* Front Face of the 3D Card */}
                    <div className="tc-card-front">
                      {person.photo ? (
                        <img src={person.photo} alt={person.name} className="tc-floating-photo" />
                      ) : (
                        <div className="tc-photo-placeholder" />
                      )}
                    </div>
                    
                    {/* Back Face of the 3D Card */}
                    <div className="tc-card-back">
                      <div className="tc-back-content">
                        <h2>{firstName}</h2>
                        <p>NAVIO LABS</p>
                      </div>
                    </div>
                    
                    {/* Inner glowing shadow for 3D depth */}
                    <div className="tc-photo-glow" style={{ background: `var(--lane)` }}></div>
                  </div>
                  
                  <div className="tc-scroll-hint">
                    ↓ SCROLL TO SCRUB 360
                  </div>
                </div>
                
                <div className="tc-info-column">
                  <div className="tc-info-card">
                    <p className="tc-greeting">ABOUT {firstName.toUpperCase()}</p>
                    <h3 className="tc-role">{person.name}</h3>
                    
                    <p className="tc-bio">{person.bio}</p>
                    
                    <ul className="tc-focus" aria-label={`${person.name} focuses on`}>
                      {person.focus.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
