/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.35,
  radius: 17
};

////////////////STATE LAYER///////////////////////
//Not hosted in CartoDB

var state = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "red",
      fill: false,
      opacity: .05,
      clickable: false
    };
  },
});
$.getJSON("assets/data/state.geojson", function (data) {
  state.addData(data);
});


////////////////CLIMATE DIVISION//////////////////////
//Hosted in CartoDB
var climaDivColors = {"1":"#ffed6f", "2":"#ffed6f", "3":"#bebada", "4":"#fb8072",
    "5":"#1F78B4", "6":"#E31A1C", "7":"#B2DF8A", "8":"#33A02C", "9":"#1F78B4",
    "9":"#FF5C00", "10":"#ffed6f","11":"#6A3D9A", "12":"#E31A1C", "13":"#6A3D9A",
    "14":"#B2DF8A", "15":"#33A02C"};


// var climaDivColors = {"1":"#8dd3c7", "2":"#ffffb3", "3":"#bebada", "4":"#fb8072",
//     "5":"#80b1d3", "6":"#fdb462", "7":"#b3de69", "8":"#fccde5", "9":"#bc80bd",
//     "9":"#ccebc5", "10":"#6A3D9A","11":"#fffff", "12":"#ffffff", "13":"#ffffff",
//     "14":"#ffffff", "15":"#ffffff"};    


var climadiv = L.geoJson(null, {
  style: function (feature) {
      return {
        color: climaDivColors[feature.properties.cartodb_id],
        weight: 0,
        opacity: 1
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.climate_division + "</td></tr>" + "<tr><th>State</th><td>" + feature.properties.state + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html('NOAA Climate Division');
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: .5,
          color: climaDivColors[feature.properties.cartodb_id],
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        climadiv.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM clima_div", function (data) {
  climadiv.addData(data);
});


///////////////////WEATHER FORECAST OFFICES////////////
//Hosted in CartoDB
var wfoColors = {"1":"#ffed6f", "2":"#1F78B4", "3":"#bebada", "4":"#E31A1C",
    "5":"#ffed6f", "6":"#E31A1C", "7":"#6A3D9A", "8":"#33A02C", "9":"#1F78B4"};

var wfo = L.geoJson(null, {
  style: function (feature) {
      return {
        color: wfoColors[feature.properties.cartodb_id],
        weight: 0,
        opacity: 1
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Office</th><td>" + feature.properties.nws_forecast_office + "</td></tr>"+ "<tr><th>Location</th><td>" + feature.properties.location + "</td></tr>" + "<tr><th>Website</th><td>" + feature.properties.site + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html('Weather Forecast Office');
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: .5,
          color: wfoColors[feature.properties.cartodb_id],
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        wfo.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM wfo_final", function (data) {
  wfo.addData(data);
});

///////////////////ECO REGIONS////////////
//Hosted in CartoDB
var ecoColors = {"1":"#1f78b4", "2":"#99cf95", "3":"#f8a64f", "4":"#229a00",
    "5":"#FB9A99" };

var eco = L.geoJson(null, {
  style: function (feature) {
      return {
        color: ecoColors[feature.properties.cartodb_id],
        weight: 0,
        opacity: 1
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Ecoregion</th><td>" + feature.properties.ecoregions + "</td></tr>" + "<tr><th>Description</th><td>" + feature.properties.description + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html('Level III Ecoregion');
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: .5,
          color: ecoColors[feature.properties.cartodb_id],
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        eco.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM ecoregion_simple", function (data) {
  eco.addData(data);
});

///////////////////COUNTIES////////////
//Hosted in CartoDB
var cnty = L.geoJson(null, {
  style: function (feature) {
      return {
        color: "#939393",
        // color: "#f5f5f3",
        weight: .75,
        opacity: .75,
        fillOpacity: 0.05
      };  
  },
  onEachFeature: function (feature, layer) {

    function addLabel() {
      var label = L.marker(layer.getBounds().getCenter(), {
        icon: L.divIcon({
          className: 'label',
          html: feature.properties.cntyname,
          iconSize: [100, 40]
        })
      }).addTo(map);
    };

    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>County</th><td>" + feature.properties.cntyname + "</td></tr>" + "<tr><th>State</th><td>" + feature.properties.state + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html('NC and SC Counties');
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 0,
          color: "#00FFFF",
          opacity: .1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        cnty.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM counties_merge_simple", function (data) {
  cnty.addData(data);
});


///////////////////ECO REGIONS////////////
//Hosted in CartoDB
var huc = L.geoJson(null, {
  style: function (feature) {
      return {
        color: "#5CA2D1",
        weight: 1,
        opacity: .75,
        fillOpacity: .2,
        dashArray: '3'
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Basin</th><td>" + feature.properties.name + "</td></tr>" +"<tr><th>Geographic Coverage</th><td>" + feature.properties.states + "</td></tr>" + "<tr><th>Acres</th><td>" + feature.properties.areaacres+ "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html('HUC-6 Water Basin');
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 0,
          color: "#00FFFF",
          fillOpacity: .1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        huc.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM huc6_simple", function (data) {
  huc.addData(data);
});