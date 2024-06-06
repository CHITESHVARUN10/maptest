let btn = document.querySelector(".myloc");
let p = document.querySelector("p");
let map = L.map("mainmap").setView([28.6139, 77.2088], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);

function showPosition(a) {
  try {
    let long = a.coords.longitude;
    let lat = a.coords.latitude;
    let myloc = [lat, long];
    console.log("loction fetched correctly");
    console.log("your latitude" + lat);
    console.log("your longitude =" + long);
    // let redIcon = L.icon({
    //   iconUrl: "green.jpeg",
    //   iconSize: [45, 100],
    //   iconAnchor: [22, 94],
    //   popupAnchor: [-3, -76],
    // });

    for (i = 1; i <= 15; i++) {
      setTimeout(() => {
        map.setView(myloc, i);
      }, 100);
    }

    let mark = L.marker(myloc).addTo(map);
    mark.bindPopup("You are here.").openPopup();
    setTimeout(() => {
      mark.closePopup();
    }, 2000);
    getcity(lat, long);
  } catch (e) {
    console.log("some error occur" + e);
  }
}
btn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("loc not found pc old");
  }
});
function getcity(lat, lo) {
  let abc = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lo}&localityLanguage=en`;
 
  fetch(abc)
    .then((response) => response.json())
    .then((data) => {
      let cityName = data.city || data.locality || data.principalSubdivision;
      let stateName = data.principalSubdivision;
      let countryName = data.countryName;

      
      let objrct = {
        city: cityName,
        state: stateName,
        country: countryName
      };
      console.log(" obj of geo loct"+data);
      ggetw(lat, lo,objrct);
    })
    .catch((e) => {
      console.log("erroor in city or weather " + e);
    });
}
function ggetw(lat, lo,d) {
  let ak = `71fce5bd02c75d2f4235a5c7c2a376a6`;
  let ap  =`a90a1e3344b6b460abcb3faa7d3f21f0`;
  let url = ` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lo}&appid=${ap}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("data of weather"+data);
      let curtemp =  Math.floor(data.main.temp - 273.15);

      let pre = data.main.pressure;
      let we = [];
      // let dtb=document.querySelector(".detailsapi")
      
      for (i = 0; i < data.weather.length; i++) {
        let tmp = data.weather[i];
        we.push(tmp);
      }
      for (i = 0; i < we.length; i++) {
        console.log(we[i]);
      }
      let dtb = document.createElement('div');
  dtb.className = 'detailsapi';
  let b=document.querySelector("body")
b.insertAdjacentElement("beforeend",dtb)


      
      dtb.innerHTML= `
      <h1> <b> weather</b> </h1>
      <p><strong>current temp is </strong> ${curtemp}</p>
       <p><strong>Air pressure:</strong> ${pre} hPa</p>
    <p><strong>Prediction:</strong> ${we[0].description}</p>
    <p><b>Location Details</b></p>
    <p><strong>City:</strong> ${d.city}</p>
    <p><strong>State:</strong> ${d.state}</p>
    <p><strong>Country:</strong> ${d.country}</p>
      `

    });
}
