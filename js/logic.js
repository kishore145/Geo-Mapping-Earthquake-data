
function createMap(properties){
  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
  });

  googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 18,
    subdomains:['mt0','mt1','mt2','mt3']
  });

  googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 18,
    subdomains:['mt0','mt1','mt2','mt3']
  });

  googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
  });

  var baseMaps = {
  "Base World Map" : lightmap,
  "Satellite": googleSat,
  "Google Street" : googleStreets,
  "Terrain": googleTerrain

  };

  var overlayMaps = {
  "Earth Quake Info" : properties
  };



  // Create the map with our layers
  var map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [lightmap, properties]
  });

  L.control.layers(baseMaps,overlayMaps, {
    collapsed: false
  }).addTo(map);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

}

function getColor(d) {
  return d > 5 ? '#d73027' :
         d > 4  ? '#fc8d59' :
         d > 3  ? '#fee08b' :
         d > 2  ? '#d9ef8b' :
         d > 1   ? '#91cf60' :
         d > 0   ? '#1a9850' :
                    '#1a9850';
}


function drawMarkers(response) {

  console.log(response);
  var features = response["features"];
  console.log(features);
  markers = [];
  features.forEach(element => {
    console.log(element);
    var coordinates = element["geometry"]["coordinates"];
    console.log(coordinates);
    var circle = L.circle([coordinates[1], coordinates[0]], {
      color: 'black' ,
      weight: 1,
      opacity: 0.7,
      fillColor: getColor(element["properties"]["mag"]),
      fillOpacity: 0.7,
      radius: element["properties"]["mag"]*40000
  });
    //var newMarker = L.marker([coordinates[1], coordinates[0]]);


    // // Add the new marker to the appropriate layer
    // newMarker.addTo(layers["base_layer"]);

    // Bind a popup to the marker that will  display on click. This will be rendered as HTML
    console.log((element["properties"]["title"]));
    circle.bindPopup(element["properties"]["title"]);
    markers.push(circle);
    });
    // Create a layer group made from the property markers array, pass it into the createMap function
  createMap(L.featureGroup(markers));

};

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',drawMarkers);
// Perform an API call to the USGS GeoJSON Page

