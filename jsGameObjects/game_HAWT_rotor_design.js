// game object, that allows fo rall controls and game play
var game_HAWT_rotor_design_power_load = {
  scene : [],
  camera : [],
  renderer : [],
  pointerAnimationrequest : [],
  gamewindow : [],
  gameHAWTobjects: [],
  gamePlay: [],
  gamePhysics: {
    Uinf: 10 // unperturbed wind speed, in m/s
  },
  create3Dcanvas: function(width, height, divname) {
    this.gamewindow.width = width;
    this.gamewindow.height = height;
    var tempout1=  make3Dplotdom(width, height, divname);
    this.scene=tempout1[0];
    this.renderer=tempout1[2];
    this.camera=tempout1[1];
  },
  intialize3DgameScene: function(){
    this.gameHAWTobjects[0] = new HAWTObject();

    // this.gameHAWTobjects[0].nblades = 4;
    this.gameHAWTobjects[0].assembleHAWT();
    this.scene.add(this.gameHAWTobjects[0].threeDObj)
  },
  startGame: function(width, height, divname){
      var d = new Date();
      var time = (d.getTime())/1000;
      this.gamePlay.time = time;
      this.create3Dcanvas(width, height, divname);
      this.intialize3DgameScene();
      this.renderer.render( this.scene, this.camera );
      this.gameHAWTobjects[0].BEM = new BEMSolverObject();
      this.updateGamePhysics();
      this.updateGameAnimation();
      this.updateBEM();
      // this.updateBEM();
      // updateGameAnimation();
  },
  updateBEM: function() {
    // console.log(this.gameHAWTobjects[0].rotorradius);
    this.gameHAWTobjects[0].BEM.rotorradius = this.gameHAWTobjects[0].rotorradius;
    this.gameHAWTobjects[0].BEM.rootchord = this.gameHAWTobjects[0].blade.chord;
    this.gameHAWTobjects[0].BEM.tipchord = this.gameHAWTobjects[0].blade.chord*0.5;
    this.gameHAWTobjects[0].BEM.nblades = this.gameHAWTobjects[0].nblades;
    this.gameHAWTobjects[0].BEM.tipspeedratio = -this.gameHAWTobjects[0].rotationalspeed*this.gameHAWTobjects[0].rotorradius/this.gamePhysics.Uinf;
    // console.log(" tsr is " + this.gameHAWTobjects[0].rotationalspeed*this.gameHAWTobjects[0].rotorradius/this.gamePhysics.Uinf);
    this.gameHAWTobjects[0].BEM.Uinf = this.gamePhysics.Uinf;
    this.gameHAWTobjects[0].BEM.solve();
    // console.log("CP is " + this.gameHAWTobjects[0].BEM.solution.CProtor + " CT is " + this.gameHAWTobjects[0].BEM.solution.CTrotor);
    var temp1=[];
    for (var ii = 0; ii < this.gameHAWTobjects[0].BEM.solution.a.length; ii++) {
      if ((this.gameHAWTobjects[0].BEM.solution.a[ii]*this.gameHAWTobjects[0].BEM.solution.faxial[ii]) >  0) {
        temp1.push(1)

      } else {
        temp1.push(0)

      }

    }
    //  console.log(" r is " + this.gameHAWTobjects[0].BEM.solution.r);
    //  console.log(" a is " + this.gameHAWTobjects[0].BEM.solution.a);
    //  console.log(" faxial is " + this.gameHAWTobjects[0].BEM.solution.faxial);
    //  console.log(" fazim is " + this.gameHAWTobjects[0].BEM.solution.fazim);
    //  console.log(" temp1 is " + temp1);
  },
  updateGamePhysics: function (){
    // get current time
    var d = new Date();
    var time = (d.getTime())/1000;

    // var rotation = this.gameHAWTobjects[0].rotationalspeed*time;
    // var rotation = rotation_velocity*time;
    // var deltarotation = this.gameHAWTobjects[0].rotationalspeed * (time - this.gamePlay.time) ;
    this.gameHAWTobjects[0].rotorazimuth += this.gameHAWTobjects[0].rotationalspeed * (time - this.gamePlay.time) ;
    this.gamePlay.time = time;


    this.gameHAWTobjects[0].rotorazimuth = this.gameHAWTobjects[0].rotorazimuth % (2*Math.PI);
    // var RotorWake = this.scene.getObjectByName( "Rotor", true );
    var RotorWake = this.gameHAWTobjects[0].threeDObj.getObjectByName( "Rotor", true );
    // console.log(scene);
    // console.log(RotorWake);
    RotorWake.rotation.x = this.gameHAWTobjects[0].rotorazimuth;
    // console.log(" time is "+ this.gamePlay.time + "  this.gameHAWTobjects[0].rotorazimuth " + this.gameHAWTobjects[0].rotorazimuth);

  },
  updateGameAnimation: function(){
    // this.pointerAnimationrequest=requestAnimationFrame(this.updateGameAnimation());
    this.pointerAnimationrequest=requestAnimationFrame(function() {game_HAWT_rotor_design_power_load.updateGameAnimation();});
    this.updateGamePhysics();

    // check if window has resized
    if ( !(this.gamewindow.width == window.innerWidth  && this.gamewindow.height == window.innerHeight)) {
      // alert("window changed")

      this.gamewindow.width = window.innerWidth;
      this.gamewindow.height = window.innerHeight;
      this.renderer.setSize(this.gamewindow.width, this.gamewindow.height);
      this.camera.aspect = this.gamewindow.width/ this.gamewindow.height;
      this.camera.updateProjectionMatrix();

    }


    this.renderer.render( this.scene, this.camera );
    // update score of CP and CT
    var CP = this.gameHAWTobjects[0].BEM.solution.CProtor*1.0;
    var CT = this.gameHAWTobjects[0].BEM.solution.CTrotor*1.0;
    document.getElementById('span_output_CP').innerHTML = CP.toFixed(2);
    document.getElementById('span_output_CT').innerHTML = CT.toFixed(2);
    this.CTCPplot.updatedata(CT, CP);
  },

  changeRotorBladeNumber: function(inputbladenumber){
    this.scene.remove(this.gameHAWTobjects[0].threeDObj);
    // if (inputbladenumber == "+") {
    //   this.gameHAWTobjects[0].nblades = Math.min(10, this.gameHAWTobjects[0].nblades+1) ;
    // } else {
    //   this.gameHAWTobjects[0].nblades = Math.max(1, this.gameHAWTobjects[0].nblades-1) ;
    // }
    this.gameHAWTobjects[0].nblades = inputbladenumber;
    this.gameHAWTobjects[0].assembleHAWT();
    this.scene.add(this.gameHAWTobjects[0].threeDObj)
    this.updateBEM();
  },
  changeBladeChord: function(inputbladechord){
    this.scene.remove(this.gameHAWTobjects[0].threeDObj);
    // if (inputbladenumber == "+") {
    //   this.gameHAWTobjects[0].nblades = Math.min(10, this.gameHAWTobjects[0].nblades+1) ;
    // } else {
    //   this.gameHAWTobjects[0].nblades = Math.max(1, this.gameHAWTobjects[0].nblades-1) ;
    // }
    this.gameHAWTobjects[0].blade.chord = inputbladechord*1.25;
    this.gameHAWTobjects[0].assembleHAWT();
    this.scene.add(this.gameHAWTobjects[0].threeDObj)
    this.updateBEM();
  },
  changeRotorSpeed: function(inputtipspeedratio){
    // this.scene.remove(this.gameHAWTobjects[0].threeDObj);
    // if (inputrotorspeed == "+") {
    //   this.gameHAWTobjects[0].rotationalspeed = Math.max(-6.29, this.gameHAWTobjects[0].rotationalspeed*1.1) ;
    // } else {
    //   this.gameHAWTobjects[0].rotationalspeed = Math.min(-0.1, this.gameHAWTobjects[0].rotationalspeed/1.1) ;
    // }
    // console.log(" input tsr " + inputtipspeedratio);
    this.gameHAWTobjects[0].rotationalspeed = - inputtipspeedratio*this.gamePhysics.Uinf/this.gameHAWTobjects[0].rotorradius;
    // console.log("rotor speed is " + this.gameHAWTobjects[0].rotationalspeed);
    // this.gameHAWTobjects[0].assembleHAWT();
    // this.scene.add(this.gameHAWTobjects[0].threeDObj)
    this.updateBEM();
  }




}; // end defition of var game_HAWT_rotor_design_power_load


// function   updateGameAnimation(){
//     game_HAWT_rotor_design_power_load.pointerAnimationrequest=requestAnimationFrame(function() {updateGameAnimation();});
//     game_HAWT_rotor_design_power_load.renderer.render( game_HAWT_rotor_design_power_load.scene, game_HAWT_rotor_design_power_load.camera );
//   }
