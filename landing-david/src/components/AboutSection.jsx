import { useMemo } from 'react';

export default function AboutSection() {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 2 + Math.random() * 1.5,
      opacity: 0.4 + Math.random() * 0.6,
    }));
  }, []);

  return (
    <section className="about" id="about">
      <div className="starfield">
        {stars.map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div className="magic-grid" />

      <div className="logo-cube">◇</div>

      <nav className="nav-pill dark">
        <a href="#about" className="active">ABOUT</a>
        <span className="sep">·</span>
        <a href="#projects">PROJECTS</a>
        <span className="sep">·</span>
        <a href="#contact">CONTACT</a>
      </nav>

      <button className="cta-button">GET IN TOUCH</button>
      <div className="speaker-icon" style={{ background: 'rgba(10,20,56,0.6)', color: 'var(--cyan)', borderColor: 'var(--cyan)' }}>◁</div>

      <div className="character-stage">
        <div className="holo-cone" />
        <div id="character-night">PERSONAJE PARADO PNG AQUÍ</div>
        <div id="character-wireframe">WIREFRAME PNG AQUÍ</div>
      </div>

      <div className="pedestal">
        <div className="disc disc-bottom" />
        <div className="disc disc-top" />
        <div className="counter">000</div>
      </div>

      <div className="holo-tag tag-name">
        <div className="name">David</div>
        <div className="loc">📍 Germany</div>
        <span className="tag-line right" />
        <span className="tag-dot right" />
      </div>

      <div className="holo-tag tag-desc">
        <p>Builds interactive 3D experiences and real-time systems that are fast, responsive, and fun to use.</p>
        <span className="tag-line right" />
        <span className="tag-dot right" />
      </div>

      <div className="holo-tag tag-skills">
        <div className="header">Skills</div>
        <ul>
          <li>Three.js & WebGL</li>
          <li>Node.js & WebSockets</li>
          <li>React & Vue</li>
          <li>Kubernetes & Redis</li>
          <li>Real-time Multiplayer</li>
        </ul>
        <span className="tag-line left" />
        <span className="tag-dot left" />
      </div>
    </section>
  );
}
