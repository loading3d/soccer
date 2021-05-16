const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
camera.position.set(0, 50, 100);
                
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//renderer.gammaInput = true;
//renderer.gammaOutput = true;
//renderer.physicallyBasedShading = true;
//renderer.shadowMapEnabled = true;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.update();
