//program variables

//controls section
var simstatus = 0;
var rotstatus = 1;
//comments section
var commenttext = "Some Text";
var commentloc = 0;
//computing section
var trans = new point(80, 150);
var o = new point(0, 0, "O");
var a = new point(0, 0, "A");
var b = new point(0, 0, "B");
var c = new point(0, 0, "C");
var d = new point(0, 0, "D");
var e = new point(0, 0, "E");
var f = new point(0, 0, "F");
var g = new point(0, 0, "G");

//var k,ka,kb,kc,det;
//var ok,oka,okb,okc,odet;
var rv, k11, k21, k31, P, Q, R, k12, k22, k23, P1, Q1, R1, d1;
var r1 = 50,
  r2 = 2.6928 * r1,
  rb = r2,
  r3 = 1.1818 * r1,
  r4 = 2.0182 * r1,
  r5 = 2.4091 * r1,
  r6 = 1.6554 * r1;
var th2, th3, th4, th5, th6;
var thi = 30; //BOQ = 30; // all angles to be defined either in degrees only or radians only throughout the program and convert as and when required
//var AQO; // All angles in Degrees. (mention the specification in the script like here)
var temp = 0;
//graphics section
var canvas;
var ctx;
var speed = 7;
var omega2;
//timing section
var simTimeId = setInterval("", "1000");
var time = 0;
//point tracing section
var ptx = [];
var pty = [];
//small point tracing section
var utx = [];
var uty = [];
var trace = false;
/*
function trythis()
{ alert();}
*/

//change simulation specific css content. e.g. padding on top of variable to adjust appearance in variables window
function editcss() {
  $(".variable").css("padding-top", "40px");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
}

// switches state of simulation between 0:Playing & 1:Paused

function simstate() {
  var imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluepausedull") {
    document.getElementById("playpausebutton").src = "images/blueplaydull.svg";
    clearInterval(simTimeId);
    simstatus = 1;
    $("#alphaspinner").spinner("value", thi);
    pauseTime = setInterval("varupdate();", "100");
    document.querySelector(".playPause").textContent = "Play";
  }
  if (imgfilename == "blueplaydull") {
    time = 0;
    clearInterval(pauseTime);
    document.getElementById("playpausebutton").src = "images/bluepausedull.svg";
    simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
    simstatus = 0;
    document.querySelector(".playPause").textContent = "Pause";
  }
}

// switches state of rotation between 1:CounterClockWise & -1:Clockwise
function rotstate() {
  var imgfilename = document.getElementById("rotationbutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluecwdull") {
    document.getElementById("rotationbutton").src = "images/blueccwdull.svg";
    rotstatus = -1;
  }
  if (imgfilename == "blueccwdull") {
    document.getElementById("rotationbutton").src = "images/bluecwdull.svg";
    rotstatus = 1;
  }
}

function varinit() {
  varchange();

  $("#ABslider").slider("value", 50);
  $("#ABspinner").spinner("value", 50);

  $("#alphaslider").slider("value", 55);
  $("#alphaspinner").spinner("value", 55);

  //Variable omega2 slider and number input types
  $("#omega2slider").slider("value", 1);
  $("#omega2spinner").spinner("value", 1);
  ptx = [];
  pty = [];
  document.getElementById("trace").checked = false;
}

// Initialise and Monitor variable containing user inputs of system parameters.
//change #id and repeat block for new variable. Make sure new <div> with appropriate #id is included in the markup
function varchange() {
  //Link AB
  // slider initialisation : jQuery widget
  $("#ABslider").slider({ max: 46, min: 20, step: 2 });

  // number initialisation : jQuery widget
  $("#ABspinner").spinner({ max: 46, min: 20, step: 2 });
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#ABslider").on("slide", function (e, ui) {
    $("#ABspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#ABspinner").on("spin", function (e, ui) {
    $("#ABslider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#ABspinner").on("change", function () {
    varchange();
  });

  // Angle Alpha
  // slider initialisation : jQuery widget
  $("#alphaslider").slider({ max: 360, min: 0, step: 1 });

  // number initialisation : jQuery widget
  $("#alphaspinner").spinner({ max: 360, min: 0, step: 1 });

  //Speed Change
  //sliderintialisation : jquery widget
  //$('#speedslider').slider({ max : 30, min : 7, step : 2 });
  //$('#speedspinner').slider({ max : 30, min : 7, step : 2 });

  // monitoring change in value and connecting slider and number
  $("#alphaslider").on("slide", function (e, ui) {
    $("#alphaspinner").spinner("value", ui.value);
  });
  $("#alphaspinner").on("spin", function (e, ui) {
    $("#alphaslider").slider("value", ui.value);
  });
  $("#alphaspinner").on("change", function () {
    varchange();
  });

  //Variable omega2 slider and number input types
  $("#omega2slider").slider({ max: 5, min: 0.2, step: 0.2 }); // slider initialisation : jQuery widget
  $("#omega2spinner").spinner({ max: 5, min: 0.2, step: 0.2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#omega2slider").on("slide", function (e, ui) {
    $("#omega2spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("spin", function (e, ui) {
    $("#omega2slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("change", function () {
    varchange();
  });

  varupdate();
}

function varupdate() {
  $("#ABslider").slider("value", $("#ABspinner").spinner("value")); //updating slider location with change in spinner(debug)
  $("#alphaslider").slider("value", $("#alphaspinner").spinner("value"));
  $("#omega2slider").slider("value", $("#omega2spinner").spinner("value"));
  //$('#speedslider').slider("value", $('#speedspinner').spinner('value'));

  r1 = $("#ABspinner").spinner("value");

  printcomment(
    "This is the Mechanism is used as a simple Walking mechanism with only 1 DOF",
    1
  );
  //printcomment("AQ=OB <br/> OB:OQ:BC = 1 : 2 : 2.5",2);

  if (!simstatus) {
    //if(BOQ<38 || BOQ>93) rotstate();
    $("#alphaslider").slider("disable");
    $("#alphaspinner").spinner("disable");
    $("#omega2set").show();
    //'#speedspinner').spinner("enable");
    omega2 = rotstatus * $("#omega2spinner").spinner("value");
    thi = thi + 0.1 * deg(omega2);
    thi = thi % 360;
  }
  if (simstatus) {
    $("#alphaslider").slider("enable");
    $("#alphaspinner").spinner("enable");
    $("#speedspinner").spinner("disable");
    $("#omega2set").hide();
    thi = $("#alphaspinner").spinner("value");
    omega2 = rotstatus * $("#omega2spinner").spinner("value");
    ptx = [];
    pty = [];
  }
  /*First Leg*/
  //r2=r1/2, r3=2.5*r2, r4=2.5*r2;
  var rv, k11, k21, k31, P, Q, R, k12, k22, k23, P1, Q1, R1;
  (r2 = 2.6928 * r1),
    (rb = r2),
    (r3 = 1.1818 * r1),
    (r4 = 2.0182 * r1),
    (r5 = 2.4091 * r1),
    (r6 = 1.6545 * r1),
    (r7 = 4.4545 * r1);

  k11 = rb / r1;
  k21 = rb / r3;
  k31 = (r1 * r1 - r2 * r2 + r3 * r3 + rb * rb) / (2 * r1 * r3);

  P = Math.cos(rad(thi)) - k11 - k21 * Math.cos(rad(thi)) + k31;
  Q = -2 * Math.sin(rad(thi));
  R = k11 - (k21 + 1) * Math.cos(rad(thi)) + k31;

  th4 = deg(2 * Math.atan((-Q - Math.sqrt(Q * Q - 4 * P * R)) / (2 * P)));
  o.xcoord = 0;
  o.ycoord = 0;
  f.xcoord = 2.4196 * r1;
  f.ycoord = -1.1818 * r1;
  e.xcoord = 2.4196 * r1;
  e.ycoord = 0.5586 * r1;

  a.xcoord = o.xcoord + r1 * Math.cos(rad(thi - 26.03));
  a.ycoord = o.ycoord + r1 * Math.sin(rad(thi - 26.03));

  b.xcoord = f.xcoord + r3 * Math.cos(rad(th4 - 26.032));
  b.ycoord = f.ycoord + r3 * Math.sin(rad(th4 - 26.032));

  d1 = e.ycoord - f.ycoord;
  th3 = deg(Math.atan((b.ycoord - a.ycoord) / (b.xcoord - a.xcoord)));
  c.xcoord = b.xcoord + r4 * Math.cos(rad(th3 + 10));
  c.ycoord = b.ycoord + r4 * Math.sin(rad(th3 + 10));

  th5 = 90 - deg(Math.atan((c.ycoord - f.ycoord) / (c.xcoord - f.xcoord)));

  rv = Math.sqrt(
    (c.xcoord - f.xcoord) * (c.xcoord - f.xcoord) +
      (c.ycoord - f.ycoord) * (c.ycoord - f.ycoord)
  );

  k12 = d1 / rv;
  k22 = d1 / r6;
  k32 = (rv * rv - r5 * r5 + r6 * r6 + d1 * d1) / (2 * rv * r6);
  P1 = Math.cos(rad(th5)) - k12 - k22 * Math.cos(rad(th5)) + k32;
  Q1 = -2 * Math.sin(rad(th5));
  R1 = k12 - (k22 + 1) * Math.cos(rad(th5)) + k32;
  th6 = deg(2 * Math.atan((-Q1 - Math.sqrt(Q1 * Q1 - 4 * P1 * R1)) / (2 * P1)));
  //console.log(Q1*Q1-4*P1*R1)
  d.xcoord = e.xcoord + r6 * Math.cos(rad(-th6 + 90));
  d.ycoord = e.ycoord + r6 * Math.sin(rad(-th6 + 90));

  th7 = deg(Math.atan((d.ycoord - c.ycoord) / (d.xcoord - c.xcoord)));
  g.xcoord = c.xcoord - r7 * Math.cos(rad(-200 + th7));
  g.ycoord = c.ycoord - r7 * Math.sin(rad(-200 + th7));

  draw();
}

function draw() {
  //pointdisp(a); to display point
  //pointjoin(a,b); to join to points with a line
  canvas = document.getElementById("simscreen");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 550, 400); //clears the complete canvas#simscreen everytime

  o = pointtrans(o, trans);
  a = pointtrans(a, trans);
  b = pointtrans(b, trans);
  c = pointtrans(c, trans);
  d = pointtrans(d, trans);
  e = pointtrans(e, trans);
  f = pointtrans(f, trans);
  g = pointtrans(g, trans);

  ptx.push(g.xcoord);
  pty.push(g.ycoord);

  pointjoin(o, a, ctx, "red");
  pointjoin(o, f, ctx, "green");
  pointjoin(o, e, ctx, "green");
  pointjoin(e, f, ctx, "green");
  pointjoin(a, b, ctx, "red");
  pointjoin(b, f, ctx, "red");
  pointjoin(b, c, ctx, "black");
  pointjoin(c, d, ctx, "black");
  pointjoin(d, e, ctx, "black");
  pointjoin(c, g, ctx, "blue");

  pointdisp(o, ctx);
  pointdisp(a, ctx);
  pointdisp(b, ctx);
  pointdisp(c, ctx);
  pointdisp(d, ctx);
  pointdisp(e, ctx);
  pointdisp(f, ctx);
  pointdisp(g, ctx);

  if (trace) {
    pointtrace(ptx, pty, ctx, "blue", 2);
    pointdisp(g, ctx, 2, "", "", "", true, 3);
  } else {
    ptx = [];
    pty = [];
  }
}

function tracePath() {
  trace = !trace;
}
// prints comments passed as 'commenttext' in location specified by 'commentloc' in the comments box;
// 0 : Single comment box, 1 : Left comment box, 2 : Right comment box
function printcomment(commenttext, commentloc) {
  if (commentloc == 0) {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 1) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "250px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 2) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "280px";
    document.getElementById("commentboxright").innerHTML = commenttext;
  } else {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML =
      "<center>please report this issue to adityaraman@gmail.com</center>";
    // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}
