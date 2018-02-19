<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">

  <title>AE4-135 Rotor/Wake Aerodynamics</title>

  <link rel="stylesheet" href="css/reveal.css">
  <link rel="stylesheet" href="css/theme/tudelft_simple.css" id="theme">
  <link rel="stylesheet" href="lib/css/zenburn.css">
  <!-- <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_SVG"></script> -->
  <!-- <script src="js\MathJax.js?config=TeX-AMS-MML_SVG"></script> -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/84/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="js/plot3Ddrawings.js" charset="utf-8"></script>
  <script src="js/tools3Dscenes.js" charset="utf-8"></script>


  <!-- <script src="js/plotly-latest.min.js"></script> -->
  <script src="js/math.min.js"></script>

  <!-- <script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async
<
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script> -->


<script src="js/liftinglinemodel.js"></script>
<script src="js/plotsupportfunctions.js"></script>
<script src="js/BEMmodel.js"></script>
<!-- <script src="plots_of_functions/several_plots.js"></script> -->

<script src="js/controls/OrbitControls.js"></script>



<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/highlight.min.js"></script> -->
<!-- <script src="plugin/highlight/highlight.js"></script>
<script>hljs.initHighlightingOnLoad();</script> -->

<script>
var link = document.createElement( 'link' );
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css';
document.getElementsByTagName( 'head' )[0].appendChild( link );
</script>

</head>

<body >

  <div id="tudborder">
    <img src="images/tud_logo_white.svg" width=80% style="position: absolute; left: 0; right: 0; bottom: 0; margin-left: auto; margin-right: auto;">
  </div>
  <div id="presentation", class="reveal">
    <div class="slides">

      <section id="Coverslide">  <h1>Lifting line model</h1>
        <div style="width: 100%; float: left">
          <p align="justify">Course Rotor and Wake Aerodynamics</p>
        </div>
        <!-- Div which will hold the Output -->
        <div id="WebGL-output" style="width: 1000px, float:center"> </div>
        <!-- Javascript code that runs our Three.js examples -->
        <script type="text/javascript">
        var s_Array = createArraySequence(0.,Math.PI/10, Math.PI);
        for (var i = 0; i < s_Array.length; i++) {
          s_Array[i]= (-1*(math.cos(s_Array[i])-1)/2*0.8+0.2)*(50);
        }
        var maxradius = math.max(s_Array);
        var theta_Array = createArraySequence(0.,Math.PI/20, 50*Math.PI);
        var rotor_wake_system = create_rotor_geometry(s_Array, maxradius, 6, 1, theta_Array,3);

        var tempout=  maketestplot(900, 400, 'WebGL-output', scene1, renderer1, camera1);
        scene1=tempout[0];
        renderer1=tempout[2];
        camera1=tempout[1];
        // console.log(scene1);
        // console.log(renderer1);
        scene1 = addscene(rotor_wake_system, scene1);
        </script>
        <div style="width: 100%; float: left">
          <p class="bottomcall">
            Press right arrow to continue.
          </p>
        </div>
      </section>


<section> <!-- section with a very nice 3D rotor -->

  <script src="js/wind_energy_unit_definition.js" type="text/javascript">  </script>
  <script src="js/modernHAWT.js" type="text/javascript">  </script>
  <script src="js/landscape_objects.js" type="text/javascript">  </script>



  <div id="div_very_nice_rotor" style="width: 1000px, float:center"> </div>

  <script type="text/javascript">

  var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    brownDark:0x23190f,
    pink:0xF5986E,
    yellow:0xf4ce93,
    blue:0x68c3c0,
    green:0x00b386
  };



  var tempout1=  make3Dplotdom(900, 400, 'div_very_nice_rotor');
  scene2=tempout1[0];
  renderer2=tempout1[2];
  camera2=tempout1[1];

  turbine1 = createWindTurbineUnit(set_wind_turbine_design[0]);
  turbine1.position.x = 0;

  turbine2 = createWindTurbineUnit(set_wind_turbine_design[0]);
  turbine2.position.x = 20;

  turbine3 = createWindTurbineUnit(set_wind_turbine_design[0]);
  turbine3.position.x = -20;
  turbine3.position.z = 20;



  camera2.position.x = 500; //00;
  camera2.position.y = 100; //100;
  camera2.position.z = 300; //400;

  camera2.lookAt(new THREE.Vector3(0, 0, 0));


  var ground = createTerrainObj2()

  // scene2 = add_3D_element_to_scene(rotor_wake_system, scene2)
  scene2.add(turbine1)
  scene2.add(turbine2)
  scene2.add(turbine3)
  scene2.add(ground)

  createLights(scene2)
  renderer2.render( scene2, camera2 );

  </script>








</section>





































      <section>        <!-- <h2>How to use the arrow buttons?</h2> -->
        <section><h2>How to use the arrow buttons?</h2>

          <p align="justify">On the bottom right there are four directional arrows. </p>
          <ul>
            <li>Press on the right arrow to proceed to the next slide.</li>
            <li>Press on the left arrow to go back to the previous slide.</li>
            <li>Press on the down arrow for further detail on a topic.</li>
            <li>Press on the up arrow to return to the top of a topic.</li>
          </ul>
          <p align="justify">At the lower right corner, you can find the slide number (horizontal number. vertical number). </p>
          <p align="justify">Press ESC-key to see map of the presentation. Press ESC-key or press slide again to return to slide. </p>
          <p class="bottomcall">
            Press bottom arrow to test the vertical slide motion.
          </p>
        </section>


        <section><h2>Use the up arrow to retun up</h2>

          <p align="justify">Use the side arrows to move horizontally. </p>
        </section>



      </section>














                            <section> <h2> Review of tutorial</h2>

                              <h3>Learning objectives</h3>
                              <p align="left"> To be able to program a lifting line model for application to an horizontal axis wind turbine... </p>
                              <ul>
                                <li>... in steady, uniform, axial flow.</li>
                                <li>... using a blade element approach.</li>
                                <li>... with a frozen wake geometry.</li>
                              </ul>
                              <p>  </p>

                              <h3>Suggestions</h3>
                              <p align="left"> Use the simulation tools to compare  the two models and the terms of induction, loading, circulation, and tip speed ratio. </p>
                              <p align="left"> Use the lifting line model to calculate the 3D flow field, including the velocity at the wake. </p>


                            </section>

                          </div>
                        </div>

                        <script src="lib/js/head.min.js"></script>
                        <script src="js/reveal.js"></script>

                        <script>
                        Reveal.initialize({
                          history: true,

                          math: {
                            // mathjax: 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML',
                            // config: 'TeX-MML-AM_CHTML'
                            // 'TeX-AMS_HTML-full'
                            config: 'TeX-AMS_HTML-full'
                          },

                          dependencies: [
                            // { src: 'plugin/math/math.js', async: true }
                            // ,
                            // {  src: 'plugin/math/math.js', async: true}
                            // { src: '/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
                          ]
                        });
                        // console.log(scene1);
                        render();
                        // Shows the slide number using default formatting
                        Reveal.configure({ slideNumber: true });
                        // Slide number formatting can be configured using these variables:
                        //  "h.v":  horizontal . vertical slide number (default)
                        //  "h/v":  horizontal / vertical slide number
                        //    "c":  flattened slide number
                        //  "c/t":  flattened slide number / total slides
                        Reveal.addEventListener( 'slidechanged', function( event ) {
                          cancelAnimationFrame(pointerAnimationrequest);
                          // cancelAnimationFrame(pointerAnimationrequest)+2;
                          // cancelAnimationFrame(pointerAnimationrequest+1);
                          var idslide=Reveal.getCurrentSlide().id;
                          if (idslide=="Coverslide") {
                            render(renderer1,scene1,camera1);
                            // console.log(" id is  " + Reveal.getCurrentSlide().id);
                          };


                        } );
                        </script>

                      </body>
                      </html>
