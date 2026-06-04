const projects = [
  { id: 1, color: 'lavender', name: 'Aurora Engine', subtitle: 'Real-time WebGL renderer' },
  { id: 2, color: 'gold', name: 'Synth Garden', subtitle: 'Interactive audio playground' },
  { id: 3, color: 'sky', name: 'Multiplayer Lab', subtitle: 'WebSocket experiment hub' },
];

export default function ProjectsSection() {
  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <span className="pill-tag">SELECTED</span>
        <h2>Projects</h2>
      </div>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div className="project-card" key={p.id}>
            <div className={`project-thumb ${p.color}`}>{`Project ${i + 1}`}</div>
            <div className="project-name">{p.name}</div>
            <div className="project-subtitle">{p.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
