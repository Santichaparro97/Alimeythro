export default function HeroSection() {
  return (
    <section className="hero">
      <nav className="nav-pill">
        <a href="#about">ABOUT</a>
        <span className="sep">·</span>
        <a href="#projects">PROJECTS</a>
        <span className="sep">·</span>
        <a href="#contact">CONTACT</a>
      </nav>

      <button className="cta-button">GET IN TOUCH</button>
      <div className="speaker-icon">◁</div>

      <div className="hero-title">
        <h1>David</h1>
        <h1>Heckhoff</h1>
        <span className="pill-tag">WEB DEVELOPER</span>
      </div>

      <div className="scene-3d">
        <div className="scene-placeholder">ESCENA 3D STUDIO</div>
        <div className="rug" />
        <div id="character-warm">PERSONAJE SENTADO PNG AQUÍ</div>
      </div>
    </section>
  );
}
