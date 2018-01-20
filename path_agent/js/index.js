// particle.min.js hosted on GitHub (https://github.com/JulianLaval/canvas-particle-network)
const options = {
  particleColor: '#FFF',
  background: '#229BD5',
  interactive: false,
  speed: 'medium',
  density: 'high'
};

const canvasDiv = document.getElementById('particle-canvas');
const particleCanvas = new ParticleNetwork(canvasDiv, options);
