// scritp that defines the properties of a turbine





var foundation_input_array = [];
// definition - type, height, radius_top_to_height, ratio between top_bottom radius , height, color
foundation_input_array.push(["type" , 2, 3/2 , 1 , "red"]);
foundation_input_array.push(["Dutch1" , 8*1.5, 4.5/8 , 1.1 , "brown"]);
foundation_input_array.push(["Dutch1" , 18, 4.5/8 , 1.1 , "yellow"]);

var tower_input_array = [];
// definition - type, height, radius_bottm_to_height, ratio between top_bottom radius , height, color
tower_input_array.push(["Modern1" , 80, 3/80, 0.6 , "white"]);
tower_input_array.push(["Dutch1" , 9*1.5, 4/9 , 0.75 ,"yellow"]);
tower_input_array.push(["Dutch1" , 19, 4/9 , 0.75 ,"red"]);

var nacelle_input_array = [];
// definition - type, length, height_to_length, depth_to_length, color1, color2, tilt nacelle
nacelle_input_array.push(["Modern1" , 10, 0.4,0.6, "red", "none" , 10*Math.PI/180 ]);
nacelle_input_array.push(["Dutch1" , 5*1.5, 0.4,0.6, "red","brown", 15*Math.PI/180]);
nacelle_input_array.push(["Dutch1" , 10, 0.4,0.6, "green","red", 15*Math.PI/180]);

var rotor_input_array = [];
// definition - type, radius, hub,number of blades, index blade 1 to n index
rotor_input_array.push(["Modern1" , 40 , 0, 3, 0, 0, 0]);
rotor_input_array.push(["Dutch1" , 12*1.5 , 1, 4, 1, 1, 1, 1]);
rotor_input_array.push(["Dutch1" , 25 , 1, 4, 1, 1, 1, 1]);

var hub_input_array = [];
// definition - type, rotor radius to hub radius, length to radius, numberpanels, color
hub_input_array.push(["Modern1", 40/1.5, 2 , 5, "blue"]);
hub_input_array.push(["Dutch1", 40/1.5, 4 , 5, "blue"]);

var blade_input_array = [];
// definition - type, aspect ratio, numberpanels, color1, color2
blade_input_array.push(["Modern1" , 20 , 7 ,"pink"]);
blade_input_array.push(["Dutch1" , 20 , 7 ,"darkBrown","blue"]);

var set_wind_turbine_design=[];

var wind_turbine_definition = []
 wind_turbine_definition = turbine_design([0 , 0 , 0, 0]);
 set_wind_turbine_design[0]=wind_turbine_definition;
 wind_turbine_definition = turbine_design([1 , 1 , 1, 1]);
 set_wind_turbine_design[1]=wind_turbine_definition;
 wind_turbine_definition = turbine_design([2 , 2 , 2, 2]);
 set_wind_turbine_design[2]=wind_turbine_definition;

function turbine_design(definition_design){
// input: index foundation, tower, nacelle, rotor, blades
  var turbinedesign = {foundation:100, tower:100, nacelle:100, rotor:100, hub:100 };
  turbinedesign.foundation = foundation_input_array[(definition_design[0])];
  turbinedesign.tower = tower_input_array[(definition_design[1])];
  turbinedesign.nacelle = nacelle_input_array[(definition_design[2])];
  turbinedesign.rotor = rotor_input_array[(definition_design[3])];
  turbinedesign.hub = hub_input_array[(turbinedesign.rotor[2])];
  turbinedesign.blade = [];
  var i;
  var j;
  for (i = 0; i < turbinedesign.rotor[3]; i++) {
    j = 4+ i;
    turbinedesign.blade.push(blade_input_array[(turbinedesign.rotor[j])]);
    // alert("index to blade " + (turbinedesign.rotor[j]-1))
    // alert(" blade " + blade_input_array[(turbinedesign.rotor[j]-1)])

  };


 // return design
 return turbinedesign;
};


//function create_turbine_design_from
