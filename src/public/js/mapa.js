const mapa = document.getElementById("map");

if (mapa != null) {
  var pais;
  var poblacion;
  var geometria;
  //------------------------Capa inicial-------------------//
  var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>' +
      "contributors",
    maxZoom: 5,
  });

  var paises = new L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: "earth:paises",
    format: "image/png",
    transparent: true,
  });

  var baseMaps = {
    OpenStreetMap: osm,
  };
  var overlayMaps = {
    Paises: paises,
  };

  var map = L.map("map", {
    center: [1.6181058937930153, -75.6095327486994],
    zoom: 5,
    layers: [osm, paises],
  });

  L.control.scale().addTo(map);
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

  //----Control de Busqueda ----//
  var countriesJS = L.geoJson(countries, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("cxxxxxxxxxxxxxx");
    },
  }).addTo(map);

  var searchControl = new L.Control.Search({
    layer: countriesJS,
    propertyName: "name",
    circleLocation: false,
  });

  searchControl
    .on("search_locationfound", function (e) {
      e.layer.setStyle({ fillColor: "#3f0", color: "#0f0" });
    })
    .on("search_collapsed", function (e) {
      countriesJS.eachLayer(function (layer) {
        //restauramos el color del elemento
        countriesJS.resetStyle(layer);
      });
    });
  map.addControl(searchControl);
  //---------------Capa Estilo del pais segun la inicial del nombre-------------------//

  function EstiloPais(feature) {
    return {
      fillColor: getColorPais(feature.properties.name),
      weight: 1.3,
      opacity: 1.0,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.5,
    };
  }

  function getColorPais(name) {
    return name.substring(0, 1) == "A"
      ? "#0e4bef"
      : name.substring(0, 1) == "B"
      ? "#fc9303"
      : name.substring(0, 1) == "C"
      ? "#fce903"
      : name.substring(0, 1) == "V"
      ? "#49b675"
      : "#7b262a";
  }

  L.geoJson(countries, {
    onEachFeature: popuPaises,
    style: EstiloPais,
  }).addTo(map);

  //------------------------Eventos del mouse-------------------//
  function popuPaises(feature, layer) {
    layer.on({
      mouseover: function over(e) {
        e.target.setStyle({
          fillColor: "#A3A3A3",
          color: "blue",
          weight: 5,
          opacity: 1,
          dashArray: "1",
          fillOpacity: 0.5,
        });
        layer.openPopup(
          "Pais:xxxxx " +
            feature.properties.name +
            " Poblacion: " +
            feature.properties.pop_est
        );
      },
      mouseout: function (e) {
        e.target.setStyle({
          fillColor: "red",
          weight: 2,
          opacity: 1,
          color: "white",
          dashArray: "1",
          fillOpacity: 0.5,
        });
        // trasee.resetStyle(e.target)
        layer.closePopup();
      },
    });
  }

  //---------------------Marker--------------///
  /*var markers = L.markerClusterGroup();
function ColorCiudades(capital) {
  return capital == "S"
    ? "#0027FF"
    : capital == "N"
    ? "#FF0000"
    : "#FFFFFF";
}*/
  /*var Paises = L.geoJSON(countries, {
  pointToLayer: function (feature, latlng) {
    return markers.addLayer(
      L.circleMarker(latlng, {
        radius: 8,
        // fillColor: ColorCiudades(feature.properties.CAPITAL),
        fillColor: "#FF0000",
        weight: 1,
        opacity: 0,
        color: "black",
        fillOpacity: 0.5,
      })
    );
  },
}).addTo(map);
map.addLayer(markers);*/

  //------------------------Peticion wfs-------------------//

  const CapaPaises = () => {
    return new Promise((resolve, reject) => {
      var defaultParameters = {
        service: "WFS",
        version: "1.0.0",
        request: "GetFeature",
        typeName: "earth:paises",
        outputFormat: "application/json",
      };

      var owsrootUrl = "http://localhost:8080/geoserver/ows";
      var parameters = L.Util.extend(defaultParameters);
      var URL = owsrootUrl + L.Util.getParamString(parameters);
      $.ajax({
        url: URL,
        success: function (data) {
          var geojson = new L.geoJson(data, {
            style: { color: "#2ECCFA", weight: 2 },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(
                "Pais: " +
                  feature.properties.name +
                  "<br>" +
                  "Poblacion: " +
                  feature.properties.pop_est +
                  "<br>" +
                  "Geometria: " +
                  feature.geometry.type +
                  "<br>" +
                  "enlace: " +
                  "<a href='#' onclick='EnviarPais(" +
                  "`" +
                  feature.properties.name +
                  "`" +
                  ", " +
                  "`" +
                  feature.properties.pop_est +
                  "`" +
                  ", " +
                  "`" +
                  feature.geometry.type +
                  "`" +
                  ")'>registrar<a>"

                //"<a href='http://localhost:4000/registro' target='_blank'>registrar<a>"
              );
            },
          }).addTo(map);
          return resolve("lo hice");
        },
        error: function (e) {
          alert("Error " + JSON.stringify(e));
          return reject("Error " + e);
        },
      });
    });
  };

  function EnviarPais(pais, poblacion, geometria) {
    $.ajax({
      url: "/formulario",
      type: "POST",
      data: {
        pais: pais,
        poblacion: poblacion,
        geometria: geometria,
      },
      success: function (data) {
        console.log("Datos enviados");
        location.href = "http://localhost:4000/registro";
      },
      error: function (e) {
        alert("Error " + JSON.stringify(e));
      },
    });
  }

  CapaPaises()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  /*   L.marker([1.6181058937930153, -75.6095327486994], {
  draggable: true,
}).addTo(map);*/
}
