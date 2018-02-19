// make plot of CT vs CP


function plotObjectCTCP(divname){
// object to make plot of CT and CP
this.divname=divname;

this.plot = function(){
  Plotly.newPlot(this.divname, this.data, this.layout, {displayModeBar: false});
  this.plotDiv = document.getElementById(this.divname);
};
this.updatedata = function(xnew,ynew){
  this.data[0].x.push(this.data[1].x[0]); // current point to old system
  this.data[0].y.push(this.data[1].y[0]); // current point to old system

  this.data[1].x[0] = xnew; // new point
  this.data[1].y[0] = ynew; // new point
  Plotly.update(this.plotDiv, this.data, this.layout);
};
this.createtrace = function(){
  var trace1 = {
    x: [],
    y: [],
    mode: 'markers',
    type: 'scatter',
    name: '',
    text: [],
    marker: { size: 12 },
  };
  return trace1;
};
this.layout = {
  xaxis: {
    range: [ 0., 1.8],
    dtick: 0.1,
    title: 'Thrust coefficient CT',
    // showbackground: false
    // title: 'x Axis',
    // titlefont: {
    //   family: 'Courier New, monospace',
    //   size: 18,
    //   // color: '#7f7f7f'
    // }
  },
  yaxis: {
    range: [0, 0.6],
    // showbackground: false
    title: 'Power coefficient CP',
  },
  paper_bgcolor: 'rgba(0,1,0,0)',
  plot_bgcolor: 'rgba(255, 255, 255, 0.7)',
  displayModeBar: false,
  showlegend: false
};
this.data=[];
this.data[0]=this.createtrace();
this.data[0].marker = {opacity:0.1 , size:10};

this.data[1]=this.createtrace();
};
