// script for definition of the HAWT object



function HAWTObject(){
  this.name="aHAWTobject" ; // default name

  this.rotorradius=50; // rotor radius in meters
  // physics definition
  this.rotationalspeed = -0.7; // radians per second
  this.rotorazimuth = 0;
  // foundation definition
  this.foundation =[];
  this.foundation.height = 2 ;
  this.foundation.topradius = 4 ;
  this.foundation.bottom_over_top_radius = 1.25 ;
  this.foundation.color = 0x68c3c0 ;
  this.createFoundationObj= function() {
  	// this function creates the foundation for the HAWT
  	////////////////////////////////////////////////////////
  	this.foundation.name = "foundation";
    this.foundation.threeDObj = new THREE.Object3D(); // define the object as having a 3D mesh
  	var geom1 = new THREE.CylinderGeometry(1, this.foundation.bottom_over_top_radius, 1, 9, 1); // define geometry
  	var mat1 = new THREE.MeshPhongMaterial({color: this.foundation.color, shading:THREE.FlatShading}); // define material
  	var element = new THREE.Mesh(geom1, mat1); // create element
  	element.castShadow = true; // define properties of the elements
  	element.receiveShadow = true;
  	element.position.set(0,0.5,0);
  	//	element.position.set(0,0,0)
  	this.foundation.threeDObj.add(element);  ///
  	this.foundation.threeDObj.scale.set(this.foundation.topradius,this.foundation.height,this.foundation.topradius)
  	;
  };
  // tower definition
  this.tower =[];
  this.tower.height = 80 ;
  this.tower.topradius = 2 ;
  this.tower.bottom_over_top_radius = 2 ;
  this.tower.color = 0x68c3c0 ;
  this.createTowerObj= function() {
  	// this function creates the tower for the HAWT
  	////////////////////////////////////////////////////////
  	this.tower.name = "tower";
    this.tower.threeDObj = new THREE.Object3D(); // define the object as having a 3D mesh
  	var geom1 = new THREE.CylinderGeometry(1, this.tower.bottom_over_top_radius, 1, 9, 1); // define geometry
  	var mat1 = new THREE.MeshPhongMaterial({color: this.tower.color, shading:THREE.FlatShading}); // define material
  	var element = new THREE.Mesh(geom1, mat1); // create element
  	element.castShadow = true; // define properties of the elements
  	element.receiveShadow = true;
  	element.position.set(0,0.5,0);
  	//	element.position.set(0,0,0)
  	this.tower.threeDObj.add(element);  ///
  	this.tower.threeDObj.scale.set(this.tower.topradius,this.tower.height,this.tower.topradius)
  	;
  };
  // nacelle definition
  this.nacelle =[];
  this.nacelle.length = 10 ;
  this.nacelle.height_to_length = 0.4 ;
  this.nacelle.depth_to_length = 0.6 ;
  this.nacelle.color = 0x68c3c0 ;
  this.createNacelleObj = function() {
  	// this method creates the nacelle of the HAWT
  	//////////////////////////////////////////////////////////////////
    this.nacelle.name = "nacelle";
    this.nacelle.threeDObj = new THREE.Object3D(); // define the object as having a 3D mesh
    var geom1 = new THREE.BoxGeometry(1,this.nacelle.height_to_length, this.nacelle.depth_to_length,1,1,1); // define geometry
    var mat1 = new THREE.MeshPhongMaterial({color: this.nacelle.color, shading:THREE.FlatShading}); // define material
    var element = new THREE.Mesh(geom1, mat1); // create element
    element.castShadow = true; // define properties of the elements
    element.receiveShadow = true;

    this.nacelle.threeDObj.add(element);  ///
    this.nacelle.threeDObj.scale.set(this.nacelle.length,this.nacelle.length,this.nacelle.length);
  };

  // define rotor and blades

  this.nblades = 3;
  this.blade = [];
  this.blade.length = this.rotorradius *1.0 ;
  this.blade.chord = 3 ;
  this.blade.color = 0xd8d0d1 ;
  this.blade.threeDObj =[];
  this.createBladeObj = function(blade_index) {
  	// this method creates a blade
  	///////////////
      this.blade.threeDObj[blade_index] = new THREE.Object3D(); // define the object as having a 3D mesh
  		var geom1 = new THREE.CylinderGeometry(0.5, 1, 1, 9); // define geometry
  		var mat1 = new THREE.MeshPhongMaterial({color: this.blade.color, shading:THREE.FlatShading}); // define material
  		var element = new THREE.Mesh(geom1, mat1); // create element
  		element.castShadow = true; // dethis.blade3DObj[i]fine properties of the elements
  		element.receiveShadow = true;
  		element.scale.set(0.2*this.blade.chord,this.blade.length,this.blade.chord)
  		element.position.set(0,0.5*this.blade.length,0);
  		this.blade.threeDObj[blade_index].add(element);  ///
  };
  // hub definition
  this.hub =[];
  this.hub.height = 4 ;
  this.hub.topradius_over_height = 0.25 ;
  this.hub.bottom_over_top_radius = 1 ;
  this.hub.color = 0x59332e;
  this.createhubObj= function() {
  	// this function creates the hub for the HAWT
  	////////////////////////////////////////////////////////
  	this.hub.name = "hub";
    this.hub.threeDObj = new THREE.Object3D(); // define the object as having a 3D mesh
  	var geom1 = new THREE.CylinderGeometry(this.hub.topradius_over_height, this.hub.topradius_over_height*this.hub.bottom_over_top_radius, 1, 9, 1); // define geometry
  	var mat1 = new THREE.MeshPhongMaterial({color: this.hub.color, shading:THREE.FlatShading}); // define material
  	var element = new THREE.Mesh(geom1, mat1); // create element
  	element.castShadow = true; // define properties of the elements
  	element.receiveShadow = true;
  	// element.position.set(0,0.5,0);
    element.rotation.z = Math.PI/2 ;
  	//	element.position.set(0,0,0)
  	this.hub.threeDObj.add(element);  ///
  	this.hub.threeDObj.scale.set(this.hub.height,this.hub.height,this.hub.height)
  	;
  };



  this.rotor = [];
  this.rotor.threeDObj=[];
  this.createRotorObj = function(){
    this.rotor.threeDObj = new THREE.Object3D(); // define the object as having a 3D mesh
    this.rotor.threeDObj.name = "Rotor"
    var deltaangle = (Math.PI*2)/this.nblades;
    for (var i = 0; i < this.nblades; i++) {
      // this.blade.threeDObj = new THREE.Object3D(); // define the object as having a 3D mesh
      this.createBladeObj(i);
      this.blade.threeDObj[i].rotation.x=deltaangle*i;
      // this.blade.threeDObj[i].rotation.y=deltaangle*i;
      this.blade.threeDObj[i].position.add(new THREE.Vector3(this.hub.height,0, 0));
      this.rotor.threeDObj.add(this.blade.threeDObj[i]);
    };
    this.createhubObj();
    this.hub.threeDObj.position.add(new THREE.Vector3(this.hub.height/2,0, 0));
    this.rotor.threeDObj.add(this.hub.threeDObj);
  };
  // definition rotor-nacelle system
  this.rotornacellesystem =[];
  this.rotornacellesystem.tilt = 5*3.14/180; // tilt angle of the rotor nacelle
  this.createRotorNacelleSystem = function(){
    this.rotornacellesystem.name = "rotornacellesystem";
    this.rotornacellesystem.threeDObj = new THREE.Object3D(); // define the object as having a 3D mesh
    this.createNacelleObj();
    this.rotornacellesystem.threeDObj.add(this.nacelle.threeDObj);

    this.createRotorObj();
    this.rotor.threeDObj.position.add(new THREE.Vector3(this.nacelle.length/2 , 0 , 0));
    this.rotornacellesystem.threeDObj.add(this.rotor.threeDObj);
    this.rotornacellesystem.threeDObj.rotation.z = this.rotornacellesystem.tilt;
  };










  // assemble the HAWT components
  this.assembleHAWT = function(){
    this.threeDObj = new THREE.Object3D();
    this.createFoundationObj();
    this.createTowerObj();
    this.createRotorNacelleSystem();
    var tempdeltapos = new THREE.Vector3( 0, this.foundation.height, 0 );
    this.tower.threeDObj.position.add(tempdeltapos);
    this.threeDObj.add(this.foundation.threeDObj);
    this.threeDObj.add(this.tower.threeDObj);
    var tempdeltapos = new THREE.Vector3( 0, this.foundation.height+this.tower.height, 0 );
    this.rotornacellesystem.threeDObj.position.add(tempdeltapos);
    this.threeDObj.add(this.rotornacellesystem.threeDObj);
  };
};
