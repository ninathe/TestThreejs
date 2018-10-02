var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 200;
camera.up.set( 0, 0, 1 ); //camera should rotate around the z-axis

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;


//Add some lights to the model
var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);


var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('/examples/3d-obj-loader/assets/');
mtlLoader.setPath('/examples/3d-obj-loader/assets/');
mtlLoader.load('materials.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('/examples/3d-obj-loader/assets/');           //Where is model located?
    objLoader.load('Bygning1.obj', function (object) {

        var bb = new THREE.Box3();
        bb.setFromObject(object);
        bb.getCenter(controls.target);
        // debugger;

        //Calculating center of model
        var centerX = bb.min.x + 0.5 * ( bb.max.x - bb.min.x );
        var centerY = bb.min.y + 0.5 * ( bb.max.y - bb.min.y );
        var centerZ = bb.min.z + 0.5 * ( bb.max.z - bb.min.z );

        // object.applyMatrix( new THREE.Matrix4().makeTranslation(-centerX, -centerY, -centerZ) );
        
        
        scene.add(object);

        //Change position of camera
        camera.position.x = centerX;
        camera.position.y = centerY;
        camera.position.z = bb.max.z+200;

        camera.rotation.x = 180;
        camera.rotation.y = 90;
        
        
    });

});

var animate = function () {
    requestAnimationFrame( animate );
    // // Use Math.cos and Math.sin to set camera X and Z values based on angle. 
    // camera.position.x = radius * Math.cos( angle );  
    // camera.position.z = radius * Math.sin( angle );
    // angle += 0.01;
	controls.update();
    renderer.render(scene, camera);
    
};

animate();