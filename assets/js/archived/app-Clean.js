slider.noUiSlider.on('set', function(){
    getDate();
});

slider.noUiSlider.on('slide', function(){
    var d = getDateStrings();
    $('#daterange').text(d.f + " - "+ d.l);
    
    clearHighlight();
    map.removeLayer(cmLayer);
    reset_cmData();
});

function getISOStrings(){
    var d = getSliderDates();
    var fdwtoISO = new Date(d.f).toISOString();
    var ldwtoISO = new Date(d.l).toISOString();
    
    return {f:fdwtoISO, l:ldwtoISO};
};

function getDateStrings(){
    var d = getSliderDates();
    var fdwtoDate = new Date(d.f).toDateString();
    var ldwtoDate = new Date(d.l).toDateString();
    
    return { f:fdwtoDate, l:ldwtoDate };
}

function getSliderDates() {
    var sliderstopvalue = (slider.noUiSlider.get());
    var lastdayofweek = (totalDays - sliderstopvalue);

    var end = new Date(); //cast as new date
    ldw = end.setDate(end.getDate()-lastdayofweek);

    var start = new Date(ldw); //cast as new date and takes ldw variable
    fdw = start.setDate(start.getDate()-7);

    return {f:fdw, l:ldw};
};

function getDate(){
    var d = getISOStrings();

    $.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM table_6245450067 WHERE reportdate >= '" + d.f + "' and reportdate <= '" + d.l + "'", function (data) {
        cmData.addData(data);
        map.addLayer(cmLayer);
    });
};



function syncSidebar() {

  /* Empty sidebar features */
   $("#feature-list tbody").empty();

  /* Loop through theaters layer and add only features which are in the map bounds */
  cmData.eachLayer(function (layer) {
    if (map.hasLayer(cmLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="assets/img/cm-point.png"></td><td class="feature-name">' + layer.feature.properties.stationname + ' - ' + layer.feature.properties.scalebar + '</td><td style="vertical-align: middle; color:#a8a8a8;"><i class="fa fa-book pull-right"></i></td></tr>');
      }
    }
  });

  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}


//////////////////////////////////CM DATA LAYER////////////////////////////////////
/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var cmLayer = L.geoJson(null);
var cmData = L.geoJson(null);
function reset_cmData() {
    cmData = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/cm-point.png",
        iconSize: [20, 20],
        iconAnchor: [11, 20],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.stationnumber,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Station Number</th><td>" + feature.properties.stationnumber + "</td></tr>" + "<tr><th>Report</th><td>" + feature.properties.description + "</td></tr>" + "<tr><th>Condition</th><td>" + feature.properties.scalebar + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.reportdate + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.stationname);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="14" height="1" src="assets/img/cm-point.png"></td><td class="feature-name">' + layer.feature.properties.stationname + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      theaterSearch.push({
        Station: layer.feature.properties.stationnumber,
        Report: layer.feature.properties.stationname,
        source: "Theaters",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
};
reset_cmData();

$.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM table_6245450067 WHERE reportdate >= (now() - interval '1 week')", function (data) {
  cmData.addData(data);
  map.addLayer(cmLayer);
});


