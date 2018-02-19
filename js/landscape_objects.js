
//
//
//
//
//
//
//
//
//


function createTerrainObj(definition) {
	// this function creates a Terrain
	// the input definition defines the Object
	//////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	var found = new THREE.Object3D(); // define the object as having a 3D mesh
	found.name = "terrain";
	var geom1 = new THREE.PlaneGeometry(definition[1],definition[2],definition[3],definition[4]); // define geometry
	var mat1 =  new  THREE.MeshPhongMaterial({color:Colors[definition[5]], shading:THREE.FlatShading}); // define material
	var element = new THREE.Mesh(geom1, mat1); // create element
	element.castShadow = true; // define properties of the elements
	element.receiveShadow = true;
	element.rotation.x = Math.PI/2.;
	//	element.position.set(definition[1],definition[2],definition[3]);
	found.add(element);  ///
	return found ;


};

function createTerrainObj2() {
	// this function creates a Terrain
	// the input definition defines the Object
	//////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	var found = new THREE.Object3D(); // define the object as having a 3D mesh
	found.name = "terrain";
	var geom1 = new THREE.PlaneGeometry(1000,1000,10,10); // define geometry
	var mat1 =  new  THREE.MeshPhongMaterial({color:Colors["red"], shading:THREE.FlatShading}); // define material
	var element = new THREE.Mesh(geom1, mat1); // create element
	element.castShadow = true; // define properties of the elements
	element.receiveShadow = true;
	element.rotation.x = -Math.PI/2.;
	//	element.position.set(definition[1],definition[2],definition[3]);
	found.add(element);  ///
	return found ;

};
