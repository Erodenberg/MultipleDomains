dojo.require("esri.map");
dojo.require("esri.toolbars.draw");
dojo.require("esri.toolbars.navigation");
dojo.require("esri.tasks.identify");
dojo.require("esri.tasks.query");
dojo.require("esri.geometry");
var resizeTimer;
var map1;
var mapLayer1;
var map1width;
var map2;
var mapLayer2
var map2width;

var dataSrc = "www.mapmakergis.com";

var map2StartTime;
var map2EndTime;
var map1StartTime;
var map1EndTime;

var dMapExtent1;
var rfMapScale1;
var dMapExtent2;
var rfMapScale2;

function init() {
	var lods = [
          {
          "level": 7,
          "resolution": 1222.992452562495,
          "scale": 4622324.434304},
		  {
          "level": 8,
          "resolution": 611.4962262813797,
          "scale": 2311162.217152},
		  {
          "level": 9,
          "resolution": 305.74811314055756,
          "scale": 1155581.108576},
		  {
          "level": 10,
          "resolution": 152.87405657041106,
          "scale": 577790.554288},
		  {
          "level": 11,
          "resolution": 76.4370282850732,
          "scale": 288895.277144},
          {
          "level": 12,
          "resolution": 38.2185141425366,
          "scale": 144447.638572},
          {
          "level": 13,
          "resolution": 19.1092570712683,
          "scale": 72223.819286},
          {
          "level": 14,
          "resolution": 9.55462853563415,
          "scale": 36111.909643},
          {
          "level": 15,
          "resolution": 4.77731426794937,
          "scale": 18055.954822},
          {
          "level": 16,
          "resolution": 2.38865713397468,
          "scale": 9027.977411}
        ];
    var initialExtent = new esri.geometry.Point(-9215927.659,4911281.576, new esri.SpatialReference({ wkid: 102100 }));

    dojo.byId("dataSource").innerHTML = "Map Server: " + dataSrc;

    map1 = new esri.Map("mapDiv1", {
        center: initialExtent,
		zoom: 7
    });

    map2 = new esri.Map("mapDiv2", {
        center: initialExtent,
		zoom: 7
    });
   
    dojo.connect(map1, 'onLoad', function(theMap1) {
        dojo.connect(dijit.byId('mapDiv1'), 'resize', function() {
            resizeMap();
        });
    });

    dojo.connect(map2, 'onLoad', function(theMap2) {
        dojo.connect(dijit.byId('mapDiv2'), 'resize', function() {
            resizeMap();
        });
    });

    var url1 =  "http://mapmakergis.com/maps/rest/services/ODNR_Basemaps/Streetmap/MapServer";
    var mapLayer1 = new esri.layers.ArcGISTiledMapServiceLayer(url1, {tileServers:[
	"http://a.mapmakergis.com/maps/rest/services/ODNR_Basemaps/Streetmap/MapServer",
	"http://b.mapmakergis.com/maps/rest/services/ODNR_Basemaps/Streetmap/MapServer",
	"http://c.mapmakergis.com/maps/rest/services/ODNR_Basemaps/Streetmap/MapServer"]});

    var url2 = "http://mapmakergis.com/maps/rest/services/ODNR_Basemaps/Streetmap/MapServer";
    var mapLayer2 = new esri.layers.ArcGISTiledMapServiceLayer(url2);

    dojo.connect(mapLayer1, "onUpdateStart", map1UpdateStarted);
    dojo.connect(mapLayer1, "onUpdateEnd", map1UpdateEnd);

    dojo.connect(mapLayer2, "onUpdateStart", map2UpdateStarted);
    dojo.connect(mapLayer2, "onUpdateEnd", map2UpdateEnd);
	
    map1.addLayer(mapLayer1);
    map2.addLayer(mapLayer2);
	
	dojo.connect(map1, "onExtentChange", function(extent, delta, outLevelChange, outLod) {
          dojo.byId("scale1").innerHTML = "Cached Map LOD Level: <i>" + outLod.level + "</i> Scale: <i>" + outLod.scale + "</i>";
        });
	dojo.connect(map2, "onExtentChange", function(extent, delta, outLevelChange, outLod) {
          dojo.byId("scale2").innerHTML = "Multi Domain Cached Map LOD Level: <i>" + outLod.level + "</i> Scale: <i>" + outLod.scale + "</i>";
        });
	dojo.connect(map1, "onExtentChange", syncMaps);
}

//Handle resize of browser
function resizeMap() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    map1.resize();
    map1.reposition();
    map2.resize();
    map2.reposition();
  }, 800);
}


function map1UpdateStarted() {
  //console.log(11);
  map1StartTime = (new Date()).getTime();
}

function map1UpdateEnd() {
  //console.log(1);
  map1EndTime = (new Date()).getTime();
  var end = new Date();
  var h = end.getHours();
  var m = end.getMinutes();
  var s = end.getSeconds();
  var txt = "Multi Domain Cache Service took " + (map1EndTime - map1StartTime) + " milliseconds @ " + h + ":" + m + ":" + s;
  //console.log(txt);
  dojo.byId("map1Time").innerHTML = txt;
}

function map2UpdateStarted() {
  //console.log(12);
  map2StartTime = (new Date()).getTime();
}

function map2UpdateEnd() {
  //console.log(2);
  map2EndTime = (new Date()).getTime();
  var end = new Date();
  var h = end.getHours();
  var m = end.getMinutes();
  var s = end.getSeconds();
  var txt = "Cached Service took " + (map2EndTime - map2StartTime) + " milliseconds @ " + h + ":" + m + ":" + s + "&nbsp;";
  //console.log(txt);
  dojo.byId("map2Time").innerHTML = txt;
}

function syncMaps(extent){
	if (map2.extent != map1.extent){
			mapExtent = map1.extent;
			map2.setExtent(mapExtent);
	}
}

//show map on load 
dojo.addOnLoad(init);

