var world;
world = new CANNON.World();
world.quatNormalizeSkip = 0;
world.quatNormalizeFast = false;

var solver = new CANNON.GSSolver();

world.defaultContactMaterial.contactEquationStiffness = 1e9;
world.defaultContactMaterial.contactEquationRelaxation = 4;

solver.iterations = 7;
solver.tolerance = 0.1;
var split = true;
    
if(split)
	world.solver = new CANNON.SplitSolver(solver);
else
	world.solver = solver;

world.gravity.set(0, -9.83, 0);
world.broadphase = new CANNON.NaiveBroadphase();

// Create a slippery material (friction coefficient = 0.0)
var physicsMaterial = new CANNON.Material("slipperyMaterial");
var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
														physicsMaterial,
														0.0, // friction coefficient
														0.3  // restitution
														);
// We must add the contact materials to the world
world.addContactMaterial(physicsContactMaterial);
