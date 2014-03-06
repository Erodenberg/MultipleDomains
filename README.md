Multiple Domains allows the ArcGIS API's to make more than two simultaneous requests for tiles from a browser.  We accomplish this task by requesting tiles through subdomains.  

All ArcGIS API's support multiple webservice enpoints for a single layer.
var url1 =  "http://www.mapmakergis.com/maps/rest/services/ODNR/ODNR_Streetmap/MapServer";
    var mapLayer1 = new esri.layers.ArcGISTiledMapServiceLayer(url1, {tileServers:[
	"http://a.mapmakergis.com/maps/rest/services/ODNR/ODNR_Streetmap/MapServer",
	"http://b.mapmakergis.com/maps/rest/services/ODNR/ODNR_Streetmap/MapServer",
	"http://c.mapmakergis.com/maps/rest/services/ODNR/ODNR_Streetmap/MapServer"]});
	
This should be done with caches that utilize the Bing/Google/ArcGIS Online Tiling scheme. Can reduce browser caching and result in more HTTP connections
