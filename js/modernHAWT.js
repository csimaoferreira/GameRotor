// script to create the several component of a modern HAWT, including the motions






function createWindTurbineUnit(wtdefinition) {
	// this function creates a full wind energy unit, including foundation
	// the input wtdefinition defines the turbine
	/////////////////////////////////////////////////////////////////////////////////alert("test 2" + wtdefinition)

	var WTU = new THREE.Object3D(); // define the object as 3D
	WTU.name="windturbineunit";
	var nacellerotor = new THREE.Object3D(); // define the object as 3D
	nacellerotor.name = "nacellerotorsystem";
	var rotorshaft = new THREE.Object3D(); // define the object as 3D
	rotorshaft.name = "rotorshaftsystem";

	var tempdeltapos1 = new THREE.Vector3( 0, wtdefinition.foundation[1], 0 );
	var tempdeltapos2 = new THREE.Vector3( 0, wtdefinition.foundation[1]+wtdefinition.tower[1], 0 );


	// create foundation

	 var foundation = createFoundationObj(wtdefinition.foundation);
	 WTU.add(foundation);
	//
	// // create tower
	 var tower = createTowerObj(wtdefinition.tower);
	 WTU.add(tower);
	tower.position.add(tempdeltapos1);
	// create nacelle
	var nacelle = createNacelleObj(wtdefinition.nacelle);
	nacellerotor.add(nacelle);

	// create rotor, including hub
	var rotor = createRotorObj(wtdefinition); // define the object as 3D
	rotor.position.set(0.5*wtdefinition.nacelle[1],0,0);

	rotorshaft.add(rotor);
	rotorshaft.rotation.z = wtdefinition.nacelle[6];
	nacellerotor.add(rotorshaft);
//	nacellerotor.position.set(0,wtdefinition.nacelle[1]*wtdefinition.nacelle[2]/2,0);

	nacellerotor.position.add(tempdeltapos2);


	WTU.add(nacellerotor);

	var WEU= new windenergyunit();
  WTU.WEU=WEU;


	// return full design
	return WTU;
};




function createRotorObj(definition) {
	// this function creates a  rotor
	// the input definition defines the foundation
	//////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	var found = new THREE.Object3D(); // define the object as 3D	found.name = "foundation";
	found.name = "rotor";
	// create hub
	var hub = createHubObj(definition.hub);
	// var tempdeltapositionhub = new THREE.Vector3( definition.rotor[1], definition.rotor[2], definition.rotor[3] );
	//  hub.position.add(tempdeltapositionhub);
	//
	//  // create blade
	var blade
	var nblades = definition.blade.length;
	// alert(nblades)

	//place blades at the end of the hub (almost at end)
	var tempdeltapositionblades = new THREE.Vector3( definition.hub[2]*1/definition.hub[1], 0, 0 );


	var i;
	var deltaangle = (Math.PI*2)/nblades;
	var bladeind;
	for (i = 0; i < nblades; i++) {
		bladeind= i +1 ;
		blade = createBladeObj(definition.blade[i], bladeind);
		blade.position.add(tempdeltapositionblades);
		blade.rotation.x=deltaangle*i;
		found.add(blade) ;
	};

	// add rotor elements
	found.add(hub) ;

  found.scale.set(definition.rotor[1],definition.rotor[1],definition.rotor[1])



	return found ;


};

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function windenergyunit(inputweu){
    this.name = "windenergyunit_performance"
    this.health = 1;
    this.modeofoperation = 0;
    this.cost_repair = 0;
    this.power =0;
    this.power_delivered =0;
    this.cost_om =0;
    this.revenue1 =0;
    this.revenue2 =0;
    this.randterm = 0.5;
		this.maximum_health=1;
		this.total_costs=0;
    // initialize parameters use in the functions of the object; these values are used if no input is provided
    this.parameter_rated_power = 2.3; // rated power fo the turbine in MW
    this.parameter_capacity_factor = 0.25
    this.parameter_power_fraction_safe_mode_operation = 0.8; // factor of reduction in power if turbine in safe mode of operation
    this.parameter_power_fraction_loss = 0.2; // fraction of power lost due to inneficiency
    this.parameter_cost_weu = 1.8; // cost of wind energy unit
    this.parameter_health = 1*Math.log(0.5)/(24*30*12*30); // hal health in xx years - last number
    this.parameter_health_mode_operation = 0.5;
    this.parameter_losses = 0.95;
    this.parameter_maintenanceWEU1 = 0.25;
    this.parameter_maintenance_repairWEU = .5;
    this.parameter_value_energy_1 = 0;
    this.parameter_value_energy_2 = 0;
    this.parameter_revenue_2 = 0;
    this.public_acceptance = - 0.1;
    this.parameter_acceptanceWEU_1 = 0;
    this.parameter_acceptanceWEU_2 = 0;
    // methods
    // method for health
    this.repair_WEU = function() {
        this.cost_repair = -1*Math.sqrt(1 - this.health) * this.parameter_maintenance_repairWEU;				var newhealth = this.maximum_health*0.75+0.25*this.health;
        this.maximum_health = newhealth;
				this.health = newhealth;
    };
		this.update_health = function(deltat) {
				var temphealth1 = this.health;
				this.health = temphealth1*Math.exp(this.parameter_health*deltat*(1-this.modeofoperation*this.parameter_health_mode_operation));
		// method for power
		};
    this.update_power = function() {
 	    this.power = this.parameter_capacity_factor*this.parameter_rated_power*(0.9+0.2*this.randterm)*Math.sqrt(this.health)*(1-this.modeofoperation*(1-this.parameter_power_fraction_safe_mode_operation));
   	    this.power_delivered= this.power*(1-this.parameter_power_fraction_loss);
    };
    // method for calculating the cost of maintenance
    this.update_cost_om = function(deltaTime) {
        this.cost_om = (deltaTime/(12*24*30))*(-1*Math.sqrt(1 - this.health) * this.parameter_maintenanceWEU1);
    };
    // method to calculate revenue
    this.updateWEU= function(deltat){
      this.update_health(deltat)
      this.update_power()
      this.update_cost_om(deltat)
			this.total_costs = this.cost_om + this.cost_repair;
			this.cost_repair = 0;
    };



    this.update_parameters = function (inputweu2) {
        if (!(typeof inputweu2 == 'undefined')) {
            var i;
            for (i = 0; i < (inputweu.length - 1); i++) {
                this[("parameter_" + inputweu2[i])] = inputweu2[i+1];
                i++;
            }
        };
    };
    // update_parameters with function inputs
    if (!(typeof inputweu == 'undefined')) {
        this.update_parameters(inputweu);
    };

};


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// //
function createBladeObj(definition,bladeindex) {
	// this function creates a  foundation
	// the input definition defines the foundation
	/////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	//alert("angle" + angle)
	var found = new THREE.Object3D(); // define the object as having a 3D mesh
	found.name = "blade " + bladeindex;

	if(definition[0]=="Modern1"){
		var geom1 = new THREE.CylinderGeometry(0.5/definition[1],1/definition[1],1,definition[2]); // define geometry
		var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[3]], shading:THREE.FlatShading}); // define material
		var element = new THREE.Mesh(geom1, mat1); // create element
		element.castShadow = true; // define properties of the elements
		element.receiveShadow = true;
		element.scale.set(0.2,1,1)
		element.position.set(0,0.5/definition[1]+0.5,0);
		found.add(element);  ///
	};

	if(definition[0]=="Dutch1"){
		var geom1 = new THREE.BoxGeometry(0.025,1,0.015,1,1,1); // define geometry

		var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[3]], shading:THREE.FlatShading}); // define material
		var element = new THREE.Mesh(geom1, mat1); // create element
		element.castShadow = true; // define properties of the elements
		element.receiveShadow = true;
	//	element.scale.set(10,10,10)
		element.position.set(0,(0.05+0.5),0);
		found.add(element);  ///

		var geom1 = new THREE.BoxGeometry(0.15,1,0.005,1,1,1); // define geometry

		var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[4]], shading:THREE.FlatShading}); // define material
		var element = new THREE.Mesh(geom1, mat1); // create element
		element.castShadow = true; // define properties of the elements
		element.receiveShadow = true;
//		element.scale.set(10,10,10)
		element.position.set(0.15/2,(0.05+0.5),0);
		found.add(element);  ///
		found.rotation.y = Math.PI/2;
	};

	return found ;

};









function createFoundationObj(definition) {
	// this function creates a  Tower
	// the input definition defines the Object
	//////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	var found = new THREE.Object3D(); // define the object as having a 3D mesh
	found.name = "foundation";
	var geom1 = new THREE.CylinderGeometry(definition[2],definition[2]/definition[3],1,9,1); // define geometry
	//	var geom1 = new THREE.CylinderGeometry(definition[4],definition[5],definition[6],10); // define geometry
	var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[4]], shading:THREE.FlatShading}); // define material
	var element = new THREE.Mesh(geom1, mat1); // create element
	element.castShadow = true; // define properties of the elements
	element.receiveShadow = true;
	element.position.set(0,0.5,0);
	//	element.position.set(0,0,0)
	found.add(element);  ///
	found.scale.set(definition[1],definition[1],definition[1])
	return found ;


};


function createTowerObj(definition) {
	// this function creates a  Tower
	// the input definition defines the Object
	//////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	var found = new THREE.Object3D(); // define the object as having a 3D mesh
	found.name = "tower";
	var geom1 = new THREE.CylinderGeometry(definition[2]*definition[3],definition[2],1,12,1); // define geometry
	//	var geom1 = new THREE.CylinderGeometry(definition[4],definition[5],definition[6],10); // define geometry
	var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[4]], shading:THREE.FlatShading}); // define material
	var element = new THREE.Mesh(geom1, mat1); // create element
	element.castShadow = true; // define properties of the elements
	element.receiveShadow = true;
	element.position.set(0,0.5,0);
	//	element.position.set(0,0,0)
	found.add(element);  ///
	found.scale.set(definition[1],definition[1],definition[1])
	return found ;



};

function createHubObj(definition) {
	// this function creates a  Hub
	// the input definition defines the Object
	//////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	var found = new THREE.Object3D(); // define the object as having a 3D mesh
	found.name = "hub";
	var geom1 = new THREE.CylinderGeometry(1/definition[1],1/definition[1],1.05*definition[2]*1/definition[1],definition[3]); // define geometry
	//	var geom1 = new THREE.CylinderGeometry(definition[4],definition[5],definition[6],10); // define geometry
	var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[4]], shading:THREE.FlatShading}); // define material
	var element = new THREE.Mesh(geom1, mat1); // create element
	element.castShadow = true; // define properties of the elements
	element.receiveShadow = true;
	element.rotation.z = Math.PI/2;
	element.position.set((definition[2]*1/definition[1])/2,0,0);
	//	element.position.set(0,0,0)
	found.add(element);  ///
	return found ;


};



function createNacelleObj(definition) {
	// this function creates a  foundation
	// the input foundationdefinition defines the foundation
	//////////////////////////////////////////////////////////////////////////////////////////////////alert("test 3" + definition)
	var found = new THREE.Object3D(); // define the object as having a 3D mesh
	found.name = "nacelle";

	if(definition[0]=="Modern1"){
		var geom1 = new THREE.BoxGeometry(1,definition[2],definition[3],1,1,1); // define geometry
		//	var geom1 = new THREE.CylinderGeometry(definition[4],definition[5],definition[6],10); // define geometry
		var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[4]], shading:THREE.FlatShading}); // define material
		var element = new THREE.Mesh(geom1, mat1); // create element
		element.castShadow = true; // define properties of the elements
		element.receiveShadow = true;

		found.scale.set(definition[1],definition[1],definition[1])

		//	element.position.set(0,0,0)
		found.add(element);  ///
	};

	if(definition[0]=="Dutch1"){
		var geom1 = new THREE.BoxGeometry(1,definition[2],definition[3],1,1,1); // define geometry
		//	var geom1 = new THREE.CylinderGeometry(definition[4],definition[5],definition[6],10); // define geometry
		var mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[5]], shading:THREE.FlatShading}); // define material
		var element = new THREE.Mesh(geom1, mat1); // create element
		element.castShadow = true; // define properties of the elements
		element.receiveShadow = true;
		element.position.set(0.2,0,0);
		found.scale.set(definition[1],definition[1],definition[1])
		found.add(element);  ///
		geom1 = new THREE.CylinderGeometry(0.5/2,1.4/2,0.6,8); // define geometry
		//	var geom1 = new THREE.CylinderGeometry(definition[4],definition[5],definition[6],10); // define geometry
		mat1 = new THREE.MeshPhongMaterial({color:Colors[definition[4]], shading:THREE.FlatShading}); // define material
		element = new THREE.Mesh(geom1, mat1); // create element
		element.castShadow = true; // define properties of the elements
		element.receiveShadow = true;
		element.position.set(0.,0.3,0);
		found.scale.set(definition[1],definition[1],definition[1])
		//	element.position.set(0,0,0)
		found.add(element);  ///
	};




	return found ;


};
