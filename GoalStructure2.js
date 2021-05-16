const goalTextureLoader = new THREE.TextureLoader();

var topNetMaterial = [
	new THREE.MeshBasicMaterial({color: 0xFFFFFF}),
	new THREE.MeshBasicMaterial({color: 0xFFFFFF}),
	new THREE.MeshBasicMaterial({map: goalTextureLoader.load("https://i.ibb.co/fQXyMFh/net2d.png"), side: THREE.DoubleSide, transparent: true}),
	new THREE.MeshBasicMaterial({map: goalTextureLoader.load("https://i.ibb.co/fQXyMFh/net2d.png"), side: THREE.DoubleSide, transparent: true}),
	new THREE.MeshBasicMaterial({color: 0xFFFFFF}),
    new THREE.MeshBasicMaterial({color: 0xFFFFFF})
];

var sideNetMaterial = [
	new THREE.MeshBasicMaterial({map: goalTextureLoader.load("https://i.ibb.co/fQXyMFh/net2d.png"), side: THREE.DoubleSide, transparent: true}),
	new THREE.MeshBasicMaterial({map: goalTextureLoader.load("https://i.ibb.co/fQXyMFh/net2d.png"), side: THREE.DoubleSide, transparent: true}),
	new THREE.MeshBasicMaterial({color: 0xFFFFFF}),
	new THREE.MeshBasicMaterial({map: goalTextureLoader.load("https://i.ibb.co/fQXyMFh/net2d.png"), side: THREE.DoubleSide, transparent: true}),
	new THREE.MeshBasicMaterial({color: 0xFFFFFF}),
    new THREE.MeshBasicMaterial({color: 0xFFFFFF})
];

var goalTopHalfExtents = new CANNON.Vec3(4.5, 0.1, 1);
var goalTopShape = new CANNON.Box(goalTopHalfExtents);
var goalTopGeometry = new THREE.BoxGeometry(goalTopHalfExtents.x*2, goalTopHalfExtents.y*2, goalTopHalfExtents.z*2);
var goalTopBody = new CANNON.Body({ mass: 0 });
goalTopBody.addShape(goalTopShape);
var goalTopMesh = new THREE.Mesh(goalTopGeometry, topNetMaterial);
goalTopBody.position.set(-0.4, 5.2, 1);
goalTopMesh.position.set(-0.4, 5.2, 1);
goalTopMesh.castShadow = true;
goalTopMesh.receiveShadow = true;
world.add(goalTopBody);
scene.add(goalTopMesh);

var goalLeftHalfExtents = new CANNON.Vec3(0.1, 2.6, 1);
var goalLeftShape = new CANNON.Box(goalLeftHalfExtents);
var goalLeftGeometry = new THREE.BoxGeometry(goalLeftHalfExtents.x*2, goalLeftHalfExtents.y*2, goalLeftHalfExtents.z*2);
var goalLeftBody = new CANNON.Body({ mass: 0 });
goalLeftBody.addShape(goalLeftShape);
var goalLeftMesh = new THREE.Mesh(goalLeftGeometry, sideNetMaterial);
goalLeftBody.position.set(-5, 2.6, 1);
goalLeftMesh.position.set(-5, 2.6, 1);
goalLeftMesh.castShadow = true;
goalLeftMesh.receiveShadow = true;
world.add(goalLeftBody);
scene.add(goalLeftMesh);

var goalRightHalfExtents = new CANNON.Vec3(0.1, 2.6, 1);
var goalRightShape = new CANNON.Box(goalRightHalfExtents);
var goalRightGeometry = new THREE.BoxGeometry(goalRightHalfExtents.x*2, goalRightHalfExtents.y*2, goalRightHalfExtents.z*2);
var goalRightBody = new CANNON.Body({ mass: 0 });
goalRightBody.addShape(goalRightShape);
var goalRightMesh = new THREE.Mesh(goalRightGeometry, sideNetMaterial);
goalRightBody.position.set(4, 2.6, 1);
goalRightMesh.position.set(4, 2.6, 1);
goalRightMesh.castShadow = true;
goalRightMesh.receiveShadow = true;
world.add(goalRightBody);
scene.add(goalRightMesh);

var netBackMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
var netBackHalfExtents = new CANNON.Vec3(5, 3, 1);
var netBackShape = new CANNON.Box(netBackHalfExtents);
var netBackGeometry = new THREE.BoxGeometry(netBackHalfExtents.x*2, netBackHalfExtents.y*2, netBackHalfExtents.z*2);
var netBackBody = new CANNON.Body({ mass: 0 });
netBackBody.addShape(netBackShape);
var netBackMesh = new THREE.Mesh(netBackGeometry, netBackMaterial);
netBackBody.position.set(-0.4, 2.5, -3);
netBackMesh.position.set(-0.4, 2.5, -3);
netBackMesh.castShadow = true;
netBackMesh.receiveShadow = true;
world.add(netBackBody);
//scene.add(netBackMesh);

var clothMass = 0.01;  // 1 kg in total
var clothSize = 10;
var Nx = 12; // Number of particles along x axis?
var Ny = 12;
var mass = clothMass / Nx*Ny;
var restDistance = clothSize/Nx;
var clothFunction = plane(restDistance * Nx, restDistance * Ny);

function plane(width, height, v) {
	return function(u, v) {
		var x = (u-0.5) * width;
		var y = (v+0.5) * height;
		var z = 0;
		return new THREE.Vector3(x, y, z);
	};
}

var clothGeometry;
var particles = [];
var clothMaterial = new CANNON.Material();
var sphereMaterial = new CANNON.Material();
var clothSphereContactMaterial = new CANNON.ContactMaterial(clothMaterial,
															sphereMaterial,
															0.0, // friction coefficient
															0.0  // restitution
															);
// Adjust constraint equation parameters for ground/ground contact
clothSphereContactMaterial.contactEquationStiffness = 1e9;
clothSphereContactMaterial.contactEquationRelaxation = 3;

// Add contact material to the world
world.addContactMaterial(clothSphereContactMaterial);

// Create cannon particles
for ( var i = 0, il = Nx+1; i !== il; i++ ) {
	particles.push([]);
	for ( var j = 0, jl = Ny+1; j !== jl; j++ ) {
		var idx = j*(Nx+1) + i;
		var p = clothFunction(i/(Nx+1), j/(Ny+1));
		var particle = new CANNON.Body({
			mass: j==Ny ? 0 : mass
		});
		particle.addShape(new CANNON.Particle());
		particle.linearDamping = 0.5;
		particle.position.set(p.x, p.y-Ny * 0.9 * restDistance, p.z);
		particles[i].push(particle);
		world.add(particle);
		particle.velocity.set(0,0,-0.1*(Ny-j));
	}
}

function connect(i1,j1,i2,j2) {
	world.addConstraint( new CANNON.DistanceConstraint(particles[i1][j1],particles[i2][j2],restDistance) );
}

for(var i=0; i<Nx+1; i++){
	for(var j=0; j<Ny+1; j++){
		if(i<Nx) connect(i,j,i+1,j);
		if(j<Ny) connect(i,j,i,j+1);
	}
}

var clothTexture = goalTextureLoader.load("https://i.ibb.co/fQXyMFh/net2d.png");
clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
clothTexture.anisotropy = 16;

var clothMaterial = new THREE.MeshPhongMaterial( {
	alphaTest: 0.5,
	color: 0xffffff,
	specular: 0x333333,
	emissive: 0x222222,
	map: clothTexture,
	side: THREE.DoubleSide
} );

clothGeometry = new THREE.ParametricGeometry(clothFunction, Nx, Ny, true);
clothGeometry.dynamic = true;
clothGeometry.computeFaceNormals();

// cloth mesh
clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
clothMesh.position.set(0, 0, 0);
clothMesh.castShadow = true;
clothMesh.receiveShadow = true;
scene.add(clothMesh);
