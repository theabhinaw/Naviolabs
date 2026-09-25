import SectionHead from '../ui/SectionHead.jsx';
import { TEAM } from '../../data/content.js';

// Round portrait with a frame. Shows a photo when one is set in data/content.js, otherwise the initials.
function Avatar({ name, photo }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="avatar-frame">
      <div className="avatar">
        {photo ? <img src={photo} alt={`Portrait of ${name}`} width="176" height="176" /> : <span aria-hidden="true">{initials}</span>}
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <section className="section section-soft" id="team" aria-labelledby="team-title">
      <div className="wrap">
        <SectionHead id="team-title" title="The people behind Navio Labs">
          Navio Labs is founder-led. You work directly with the people who build your automation.
        </SectionHead>

        <div className="team-grid">
          {TEAM.map((person) => (
            <article className="person" key={person.id} style={{ '--lane': `var(--${person.lane})` }}>
              <Avatar name={person.name} photo={person.photo} />
              <div>
                <h3>{person.name}</h3>
                <p className="role">
                  <span className="swatch" aria-hidden="true" />
                  {person.role}
                </p>
              </div>
              <p className="bio">{person.bio}</p>
              <ul className="focus" aria-label={`${person.name} focuses on`}>
                {person.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
