

// Object that solves the Blade Element Momentum model for an HAWT



function BEMSolverObject(){
  // Object that solves the Blade Element Momentum model for an HAWT

  this.nblades = 3; // default value of blades
  this.nspanwiseelements = 14; // default value of spanwise elements
  this.radialsectiondistribution =[]; // distribution of blase section edges points, in r/R
  this.rotorradius = 50; // default value of rotor radius, in m
  this.rootradius = 0.09; //default value of root radius in r/R
  this.rootchord =3; //default value of chord at root, m
  this.tipchord =1; //default value of chord at tip, m
  this.bladepitchangle = 5+2; //default value of blade pitch angle, in degrees
  this.roottwist = -11.5; // default value of blade root twist, in degrees
  this.solution = []; //distributions with all solution values
  this.Uinf = 1;  // unperturbed wind speed , m/s
  this.tipspeedratio = 6; // default value of tip speed ratio
  // this.rotationalvelocity = ; // default value of rotational velocity, in rad/s
  this.airdensity = 1.225; // default value of air density, kg.m^-3


  this.solve = function(){
    this.createBladeDiscretization();
    this.solveAllStreamtubes();
    this.calculateCT_CProtor_CPflow();
  };


  this.solveAllStreamtubes = function() {

    this.solution.a = [] ; // distribution of axial induction factor a
    this.solution.aprime = [] ; // distribution of azimuthal induction factor aprime
    this.solution.r = []; // distribution of non-dimensioned radial position of the control points
    this.solution.circulation = []; // distribution of circulation, in m^2/s
    this.solution.faxial =[]; // distribution of axial load, in N/m
    this.solution.fazim =[]; // distribution of azimuthal load, in N/m
    var temp = [];
    // solve each streamtube
    // console.log("blades is " + this.nblades);
    for (var i = 0; i < (this.radialsectiondistribution.length-1); i++) {
      temp=this.solveStreamtube(this.Uinf, this.radialsectiondistribution[i],
        this.radialsectiondistribution[i+1],this.radialsectiondistribution[0],
        this.radialsectiondistribution[this.radialsectiondistribution.length-1],
        this.Uinf/this.rotorradius*this.tipspeedratio, this.rotorradius, this.nblades);
        this.solution.a.push(temp[0]);
        this.solution.aprime.push(temp[1]);
        this.solution.r.push(temp[2]);
        this.solution.faxial.push(temp[3]);
        this.solution.fazim.push(temp[4]);
        this.solution.circulation.push(temp[5]);



      };
    };

    this.calculateCT_CProtor_CPflow = function(){
      // calculates the performance of the rotor, retunring CT and CPs
      this.solution.CTrotor=0; // trhust coefficient
      this.solution.CProtor = 0; // power coefficient
      var r_R_temp=0; // radial position for evaluation
      var drtemp=0; // delta r
      for (var i = 0; i < (this.radialsectiondistribution.length-1); i++) {
        r_R_temp = (this.radialsectiondistribution[i]+this.radialsectiondistribution[i+1])/2;
        // Utan = r_R_temp*this.Uinf*this.tipspeedratio*aline[i];
        // Unorm = Uinf*(1-a[i]);
        drtemp = (-this.radialsectiondistribution[i]+this.radialsectiondistribution[i+1]);
        this.solution.CTrotor+=(drtemp*this.solution.faxial[i]*this.nblades)/(0.5*this.Uinf*this.Uinf*Math.PI*this.rotorradius);
        this.solution.CProtor+=(drtemp*this.solution.fazim[i]*r_R_temp*this.Uinf*this.tipspeedratio*this.nblades)/(0.5*this.Uinf*this.Uinf*this.Uinf*Math.PI*this.rotorradius);
        // CPflow+=(drtemp*(Fnorm[i]*Unorm - Ftan[i]*Utan )*NBlades)/(0.5*Uinf*Uinf*Uinf*Math.PI*Radius);
      }
    };




    this.solveStreamtube = function(Uinf, r1_R, r2_R, rootradius_R, tipradius_R , Omega, Radius, NBlades ){
      // solve balance of momentum between blade element load and loading in the streamtube
      // input variables:
      //     Uinf - wind speed at infinity
      //     r1_R,r2_R - edges of blade element, in fraction of Radius ;
      //     rootradius_R, tipradius_R - location of blade root and tip, in fraction of Radius ;
      //     Radius is the rotor radius
      //     Omega -rotational velocity
      //     NBlades - number of blades in rotor

      // initialize properties of the blade element, variables for output and induction factors
      var r_R = (r1_R+r2_R)/2; //centroide
      var Area = Math.PI*(Math.pow(r2_R*Radius,2)-Math.pow(r1_R*Radius,2)); //  area streamtube
      var a = 0.3; // axial induction factor
      var anew; // temp new axial induction factor
      var aline = 0.; // tangential induction factor
      var Urotor; // axial velocity at rotor
      var Utan; // tangential velocity at rotor
      var loads; // normal and tangential loads 2D
      var load3D = [0 , 0]; // normal and tangential loads 3D
      var CT; //thrust coefficient at streamtube
      var Prandtl; // Prandtl tip correction

      // iteration cycle
      var Niterations =200; // maximum number of iterations
      var Erroriterations =0.0001; // error limit for iteration rpocess, in absolute value of induction
      for (var i = 0; i < Niterations; i++) {

        ///////////////////////////////////////////////////////////////////////
        // this is the block "Calculate velocity and loads at blade element"
        ///////////////////////////////////////////////////////////////////////
        Urotor = Uinf*(1-a); // axial velocity at rotor
        Utan = (1+aline)*Omega*r_R*Radius; // tangential velocity at rotor
        // calculate loads in blade segment in 2D (N/m)
        loads = this.loadBladeElement(Urotor, Utan, r_R);
        load3D[0] =loads[0]*Radius*(r2_R-r1_R)*NBlades; // 3D force in axial direction
        load3D[1] =loads[1]*Radius*(r2_R-r1_R)*NBlades; // 3D force in azimuthal/tangential direction (not used here)
        ///////////////////////////////////////////////////////////////////////
        //the block "Calculate velocity and loads at blade element" is done
        ///////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////
        // this is the block "Calculate new estimate of axial and azimuthal induction"
        ///////////////////////////////////////////////////////////////////////
        // calculate thrust coefficient at the streamtube
        CT = load3D[0]/(0.5*Area*Math.pow(Uinf,2));
        // calculate new axial induction, accounting for Glauert's correction
        anew = this.induction_from_thrust_coefficient_Gluert_correction([CT]);
        anew = Math.min(anew, 1.5)
        // correct new axial induction with Prandtl's correction
        Prandtl= this.calculatePrandtlTipRootCorrection(r_R, rootradius_R, tipradius_R, Omega*Radius/Uinf, NBlades, anew);
        if (Prandtl.Ftotal < 0.0001) { Prandtl.Ftotal = 0.0001; } // avoid divide by zero


        anew = anew/Prandtl.Ftotal; // correct estimate of axial induction
        a = 0.75*a+0.25*anew; // for improving convergence, weigh current and previous iteration of axial induction

        // if (CT*a < 0.0) {
        //   console.log("r_R " + r1_R + "a " + a +" CT" + CT + " anew "  + anew + " aold " + (a-0.25*anew)/0.75);
        //   // console.log();
        // }



        // calculate aximuthal induction
        aline = loads[1]*NBlades/(2*Math.PI*Uinf*(1-a)*Omega*2*Math.pow(r_R*Radius,2));
        aline =aline/Prandtl.Ftotal; // correct estimate of azimuthal induction with Prandtl's correction
        ///////////////////////////////////////////////////////////////////////////
        // end of the block "Calculate new estimate of axial and azimuthal induction"
        ///////////////////////////////////////////////////////////////////////

        // test convergence of solution, by checking convergence of axial induction
        if (Math.abs(a-anew) < Erroriterations) {
          // console.log(i);
          i=Niterations; // converged solution, this is the last iteration
        }


        // if (r_R<0.1) {
        //   console.log("i is " + i);
        //   // console.log("Urotor " + Urotor + " Utan " + Utan + " loads " + loads);
        //   // console.log("loads" + loads);
        //   // console.log("load3D" + load3D);
        //   // console.log("test " + Radius*(r2_R-r1_R)*NBlades);
        //   // console.log("test " + Radius);
        //   // console.log("test " + (r2_R-r1_R));
        //   // console.log("test " + NBlades);
        //   // console.log("Area and Uinf" + Area + " " + Uinf);
        //   // console.log("CT " + CT);
        //   // console.log("test is " + load3D[0]/(0.5*Area*Math.pow(Uinf,2)));
        //   // console.log("test is " + load3D[0]);
        //   // console.log("test is " + 1/(0.5*Area*Math.pow(Uinf,2)));
        //   console.log(" a and aline and anew" + a + " " + aline + " " + anew);
        // } // to debug



      };

      // we have reached a solution or the maximum number of iterations
      // returns axial induction factor a, azimuthal induction factor a',
      // and radial position of evaluations and loads
      return [a , aline, r_R, loads[0] , loads[1], loads[2]];

    };



    this.calculatePrandtlTipRootCorrection= function(r_R, rootradius_R, tipradius_R, TSR, NBlades, axial_induction) {
    // applies Prandtl's tip and root correction to the induction vector aind
    var mu; // temp variabl
    var Ftip; // tip correction
    var Froot; // tip correction
    var result;
    var temp1;
        temp1 = -NBlades/2*(tipradius_R-r_R)/r_R*Math.sqrt( 1+ (Math.pow(TSR*r_R,2))/(Math.pow(1-axial_induction,2))   )
        Ftip = 2/Math.PI*Math.acos(Math.exp(temp1));
        if (isNaN(Ftip)) {
          Ftip = 0;
        };
        temp1 = NBlades/2*(rootradius_R-r_R)/r_R*Math.sqrt( 1+ (Math.pow(TSR*r_R,2))/(Math.pow(1-axial_induction,2))   )
        Froot = 2/Math.PI*Math.acos(Math.exp(temp1));
        if (isNaN(Froot)) {
          Froot = 0;
        };
        result= {Ftotal: (Froot*Ftip), Ftip: Ftip ,Froot: Froot};
        return result;
    }




    this.createBladeDiscretization = function(){
      // discretizes the blade spanwise
      var s_Array = this.createArraySequence(0.,(Math.PI)/this.nspanwiseelements, Math.PI);
      var r_Array=[];
      for (var i = 0; i < s_Array.length; i++) {
        r_Array.push(-1*(Math.cos(s_Array[i])-1)/2*(1-this.rootradius)+this.rootradius); // discretization for BEM model
      };
      this.radialsectiondistribution = r_Array;
    };

    this.loadBladeElement = function(Vnorm, Vtan, r_R){
      var Vmag2 = (Math.pow(Vnorm,2) + Math.pow(Vtan,2)  );
      var InflowAngle = Math.atan(Vnorm/Vtan);
      // get chord and twist
      // console.log('inflow angle ' + InflowAngle)
      var temp= this.geoBlade(r_R);
      var chord = temp[0];
      var twist = temp[1];
      // console.log('twist ' + twist)
      var alpha = twist + InflowAngle*180/Math.PI;

      // console.log('alpha ' + alpha)
      temp = this.polarAirfoil(alpha);
      var cl = temp[0];
      var cd = 0*temp[1];
      // if (r_R>0.5) {
      //   if (r_R<0.5) {
      //     console.log("alpha " + alpha);
      //     console.log("cl " + cl);
      //   }
      //
      // }
      // console.log('cl and cd ' + cl +' ' +cd)
      var Lift = 0.5*Vmag2*cl*chord;
      var Drag = 0.5*Vmag2*cd*chord;
      var Fnorm = Lift*Math.cos(InflowAngle)+Drag*Math.sin(InflowAngle);
      var Ftan = Lift*Math.sin(InflowAngle)-Drag*Math.cos(InflowAngle);
      var Gamma = 0.5*Math.sqrt(Vmag2)*cl*chord ; //
      var result = [Fnorm , Ftan, Gamma];
      // console.log('Result ' + result)

      return result;
    };

    this.geoBlade = function(r_R) {
      var radial = [0, 0.1, 0.2, 0.3, .5, .8, 1];
      // var chorddist = [.05, .04, .03, .02, .015];
      var twistdist = [-50, -31, -17, -11.4, -7, -4.3, -3.5];
      // var pitch = 2;
      var chord = (this.rootchord/(1-this.rootradius)*(1-r_R)+this.tipchord);
      // var twist = this.roottwist/(1-this.rootradius)*(1-r_R);
      // var twist = this.roottwist*Math.pow((1-r_R)/(1-this.rootradius), 1.65);
      // var twist = -Math.atan((1-1/3)/(8*r_R))*180/Math.PI;
      var twist = this.interpolateArray(radial,twistdist,r_R)*1.4;
      var result =[chord , twist + this.bladepitchangle];
      return result;
    };

     this.polarAirfoil = function(alpha) {
      var polar_alpha = [-180, -16.062 , 	-15.506 , 	-15.064 , 	-14.589 , 	-14.109 , 	-13.698 ,
        -13.237 , 	-12.745 , 	-12.268 , 	-11.748 , 	-11.183 , 	-10.768 , 	-10.231 , 	-9.743 ,
        -9.223 , 	-8.209 , 	-7.187 , 	-6.162 , 	-5.143 , 	-4.127 , 	-3.106 , 	-2.073 , 	-1.04 ,
        .017 , 	1.025 , 	2.042 , 	3.096 , 	4.114 , 	5.126 , 	6.163 , 	7.189 , 	7.713 ,
        8.216 , 	8.734 , 	9.251 , 	9.558 , 	9.771 , 	10.269 , 	10.757 , 	11.257 , 	11.761 ,
        12.239 , 	13.224 , 	14.234 , 	15.227 , 	16.208 , 	17.201 , 	18.2 , 	19.201 , 	20.189 ,
        21.179 , 	22.162 , 	23.144 , 	23.547 , 	24.062 , 	25.056 , 	26.06 , 	27.059 ,
        28.062 , 	29.062 , 	30.056 , 180];
        var polar_cl = [-0, -.425 , 	-.43 , 	-.461 , 	-.496 , 	-.567 , 	-.682 , 	-.719 , 	-.755 ,
          -.77 , 	-.774 , 	-.77 , 	-.756 , 	-.736 , 	-.711 , 	-.68 , 	-.612 , 	-.529 , 	-.434 ,
          -.337 , 	-.237 , 	-.127 , 	-.014 , 	.102 , 	.217 , 	.33 , 	.445 , 	.571 , 	.683 ,
          .792 , 	.902 , 	1.014 , 	1.068 , 	1.12 , 	1.168 , 	1.207 , 	1.227 , 	1.229 ,
          1.215 , 	1.192 , 	1.173 , 	1.148 , 	1.126 , 	1.103 , 	1.093 , 	1.077 ,
          1.06 , 	1.038 , 	1.047 , 	1.043 , 	1.04 , 	1.029 , 	1.023 , 	1.007 , 	.829 ,
          .854 , 	.877 , 	.89 , 	.953 , 	.976 , 	1.016 , 	1.041   , 0];
          var polar_cd = [0.1, .225 , 	.217 , 	.211 , 	.208 , 	.201 , 	.077 , 	.05 , 	.039 ,
            .033 , 	.029 , 	.025 , 	.023 , 	.02 , 	.018 , 	.017 , 	.014 , 	.013 , 	.011 , 	.01 , 	.008 ,
            .008 , 	.008 , 	.007 , 	.007 , 	.008 , 	.008 , 	.008 , 	.008 , 	.009 , 	.009 , 	.009 , 	.009 ,
            .01 , 	.01 , 	.01 , 	.012 , 	.013 , 	.019 , 	.025 , 	.036 , 	.045 , 	.053 , 	.066 , 	.076 , 	.089 , 	.104 ,
            .117 , 	.132 , 	.152 , 	.172 , 	.198 , 	.228 , 	.261 , 	.416 , 	.436 , 	.466 , 	.491 , 	.541 , 	.574 , 	.616 , 	.652
            , 0.1];
            var cl = this.interpolateArray(polar_alpha,polar_cl,alpha);
            var cd = this.interpolateArray(polar_alpha,polar_cd,alpha);
            // cl = 2*Math.PI*Math.sin(alpha*Math.PI/180);
            cd=0;
            var result =[cl , cd];
            return result;
          };

          this.induction_from_thrust_coefficient_Gluert_correction = function(CT) {
            // calculates induction factor a as a function of thrust coefficient
            var a=[];
            var CT1=1.816;
            var CT2=2*Math.sqrt(CT1)-CT1;

            for (var i = 0; i < CT.length; i++) {

              if (CT[i]<CT2) {
                temp = 0.5-0.5*Math.sqrt(1-CT[i]);
              } else {
                temp = 1 + (CT[i]-CT1)/(4*(Math.sqrt(CT1)-1));
              };

              a.push(temp);
            };
            return a;
          };




    // these are support functions for the calculations



    this.createArraySequence = function (valuestart,deltavalue,valueend){
      var data = [];
      var temp = valuestart;
      while (temp <= (valueend-deltavalue)) {
        data.push(temp);
        temp =temp+deltavalue;
      }
      data.push(valueend)
      return data;                // Function returns data
    };


     this.interpolateArray = function(xarray,yarray,xnew){
      // interpolate 1D array
      var i1;
      var i2;
      var result;
      for (var i = 0; i < (xarray.length-1); i++) {
        if (xarray[i]<=xnew) {
          if (xarray[i+1]>=xnew) {
            i1=i;
            i2=i+1;
          };
        };
      };
      result=(xnew-xarray[i1])/(xarray[i2]-xarray[i1])*(yarray[i2]-yarray[i1])+yarray[i1];
      return result;
    };

  }; // end of function BEMSolverObject
