var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    //console.log(data.features);
});

//on click
function onClick(e){
    console.log("on click",e);
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        //console.log(feature.properties.mag);
        layer.on({
            click: onClick
        });
        layer.bindPopup("<h2>"+feature.properties.place+"</h2> <hr> <h3>Magnitude: " + feature.properties.mag +"</h3");
    };




    //console.log("mag", earthquakeData);
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        
        pointToLayer: function (feature, latlng) {
            var mag = feature.properties.mag;
            var geojsonMarkerOptions = {
            radius: 6*mag,
            fillColor: getColor(mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
            };
        
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      });    
    
    //console.log("wl create map")
    createMap(earthquakes);  
};

function createMap(earthquakes) {
    // Adding a tile layer (the background map image) to our map
    // We use the addTo method to add objects to our map
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    })//.addTo(myMap);

    var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 4,
    layers: [streetmap, earthquakes]

    });

    /*Legend specific*/
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Magnitude</h4>";
  div.innerHTML += '<i style="background: #78c679"></i><span>0-1</span><br>';
  div.innerHTML += '<i style="background: #ffffcc"></i><span>1-2</span><br>';
  div.innerHTML += '<i style="background: #fed976"></i><span>2-3</span><br>';
  div.innerHTML += '<i style="background: #FC4E2A"></i><span>3-4</span><br>';
  div.innerHTML += '<i style="background: #f03b20"></i><span>4-5</span><br>';
  div.innerHTML += '<i style="background: #bd0026"></i><span>5+</span><br>';

  
  

  return div;
};

legend.addTo(myMap);

};

function getColor(d) {
	return d < 1 ? '#78c679' :  //green
	       d < 2  ? '#ffffcc' :  //yellow green
	       d < 3  ? '#fed976' :  //orange 
	       d < 4  ? '#FC4E2A' :   //orange red
	       d < 5   ? '#f03b20' :   //dark orange 
	                  '#bd0026';    //red
}


