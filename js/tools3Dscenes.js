

// var TEMP1 =[];

//
//
//
//
//
//
//

function make3Dplotdom(width,height, CurrentdomElement) {
//  this function creates the scene, rendering abilities and cameras
//  and allocates them to the domElement,
//  input: height and width of the scene, and pointer to domElement
//
//

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(25, width / height, 0.3, 100000);
    // console.log(window);
    // create a render and set the size
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    // renderer.setClearColor(new THREE.Color(0x93C47D));

    $("#"+CurrentdomElement).append(renderer.domElement);

 // TEMP1=$("#"+CurrentdomElement).width();
// TEMP1= document.getElementById(CurrentdomElement).style.width
// alert($("#"+CurrentdomElement).width);

    renderer.setSize(width, height);

    renderer.shadowMap.enabled = true;

    createLights(scene)

    //  renderer.setSize(width, height);


    camera.position.x = 300;
    camera.position.y = 3;
    camera.position.z = 300;

    scene.position.x= 0;

    camera.lookAt(scene.position);
    camera.lookAt(new THREE.Vector3(0, 40, 0));






    // add the output of the renderer to the html element
    $("#"+CurrentdomElement).append(renderer.domElement);

    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.addEventListener( 'change', render );
		// controls.enableZoom = false;

    // render the scene
    renderer.render(scene, camera);
    // console.log(scene);
    return [scene, camera, renderer]
    // return scene
};



//
//
//
//
//
//
//
//
//
//

function add_3D_element_to_scene(rotor_wake_system, scene){
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  //scene=null;
  // scene = new THREE.Scene();
  rings = rotor_wake_system.rings;




  var rotor = createRotor(rotor_wake_system.bladepanels);

  var wake= new createWakeMesh(rings);
  // scene.add(wake);

  var rotorwake = new THREE.Object3D();
  rotorwake.name = 'RotorWake';
  rotorwake.add(wake);
  rotorwake.add(rotor);

  scene.add(rotorwake);
  return scene;

};











function createLights(scenetarget) {

  var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
// var hemisphereLight = new THREE.HemisphereLight(Colors["red"],0x000000, .9)

  var ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  var shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(1500, 3500, 3500);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -4000;
  shadowLight.shadow.camera.right = 4000;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 10000;
  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;


  var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

  //scene.add(ch);
  scenetarget.add(hemisphereLight);
  scenetarget.add(shadowLight);
  scenetarget.add(ambientLight);

}
