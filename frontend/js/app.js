let map = null;
let today
let comingeventsOn
let user
$(document).ready(function () {

    today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear()
    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today =  yyyy + '-' + mm + '-' + dd ;
    document.getElementById("selectPlayDate").setAttribute("min",today)

    mapboxgl.accessToken = 'your_mapboxkey';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [10.38, 55.39],
        zoom: 12
    });
    let feature = {
        "id": "places",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        },
        "layout": {
            "icon-image": "pet",
            "icon-size": 1
        }
    }

        $.get("/api/user/getself", function (data) {
            user = data
        })


        $.get( "/api/event/get?eventdate=" + today , function( data ) {
            let button
            for(let event of data) {
                if (user.user[0]._id !== event.createdBy[0]._id) {
                    console.log(user.user[0])
                    if (event.participants.filter(function(e) { return e._id === user.user[0]._id; }).length > 0) {
                            button = "<br> <button type=\"button\" class=\"btn btn-raised btn-danger\" onclick=\"leaveEvent('" + event._id + "')\" data-target=\".bd-example-modal-lg\">\n" +
                                "                         Leave\n" +
                                "                       </button> "

                        }else{
                            button = "<br> <button type=\"button\" class=\"btn btn-raised btn-danger\" onclick=\"joinEvent('" + event._id + "')\" data-target=\".bd-example-modal-lg\">\n" +
                                "                        Join\n" +
                                "                       </button> "

                        }


                } else {
                    button = " "
                }


                feature.source.data.features.push({
                    "type": "Feature",
                    "properties": {
                        "description": "<strong>" + event.playdateName + "</strong> <br>" + event.description + "<p><br>created by " + event.createdBy[0].firstname + " " + event.createdBy[0].lastname + "</p> " + button
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [event.place[0].lon, event.place[0].lat]
                    }
                })
            }
        })


    map.on('load', function () {
// Add a layer showing the places.
        map.loadImage('img/baseline_pets_black_18dp.png', function (error, image) {
            if (error) throw error;
            map.addImage('pet', image);
            map.addLayer(feature);
        });
        // When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
        map.on('click', 'places', function (e) {

            let coordinates = e.features[0].geometry.coordinates.slice();
            let description = e.features[0].properties.description;

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

// Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

// Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
            map.getCanvas().style.cursor = '';
        });
    });
    
    let option
    $.get( "/api/dogpark/get", function( data ) {
        let placeSelect = document.getElementById("placeSelect")
        for(let park of data) {
            option = document.createElement('option');
            option.setAttribute("value", park._id)
            option.innerText = park.navn
            placeSelect.appendChild(option)
          }
    });




 });


let ShowNewEventDialog = () => {

    $('#CreateEventModal').modal('show')


}
let joinEvent = (postId) => {
    $.ajax({
        method: "PATCH",
        url: "/api/event/join",
        dataType: "json",
        data: JSON.stringify({eventid: postId}),
        contentType: "application/json",

    }).done(function() {
        let options =  {
            content: "You have joined an event, congrats!",
            style: "toast",
            timeout: 2000,
            htmlAllowed: true,
            onClose: function(){

            }
        }
        $.snackbar(options);

    });


}
let leaveEvent = (postId) =>{
    $.ajax({
        method: "PATCH",
        url: "/api/event/leave",
        dataType: "json",
        data: JSON.stringify({eventid: postId}),
        contentType: "application/json",

    }).done(function() {
        let options =  {
            content: "You have leaved an event, congrats!",
            style: "toast",
            timeout: 2000,
            htmlAllowed: true,
            onClose: function(){

            }
        }
        $.snackbar(options);

    });
}
let test = () =>{
    let inputPlayDateName = document.getElementById('inputPlayDateName')
    let placeSelect = document.getElementById('placeSelect')
    let DescriptionTextarea = document.getElementById('DescriptionTextarea')
    let selectPlayDate = document.getElementById('selectPlayDate')


    if (inputPlayDateName.value !== "" && placeSelect.options[placeSelect.selectedIndex].value !== "" && selectPlayDate !== "") {
        $.post("/api/event/create", {
            playdateName: inputPlayDateName.value,
            place: placeSelect.options[placeSelect.selectedIndex].value,
            description: DescriptionTextarea.value,
            playDateDate: selectPlayDate.value,

        }, (data) => {
            if (data.code === 200) {
                $("#Event-Creation-Form")[0].reset()
                $('#profileModal').modal('hide')
                let options =  {
                    content: "You have created an event, congrats!",
                    style: "toast",
                    timeout: 2000,
                    htmlAllowed: true,
                    onClose: function(){

                    }
                }
                $.snackbar(options);

            } else {
                let options =  {
                    content: data.message,
                    style: "toast",
                    timeout: 2000,
                    htmlAllowed: true,
                    onClose: function(){

                    }
                }
                $.snackbar(options);
            }
        })
    } else if(inputPlayDateName.value === "" && placeSelect.options[placeSelect.selectedIndex].value === "" && selectPlayDate === ""){
        let options =  {
            content: "You have to fill something in!",
            style: "toast",
            timeout: 2000,
            htmlAllowed: true,
            onClose: function(){
            }
        }
        $.snackbar(options);
    }
    
}


let openProfile = () =>{

    $('#profileModal').modal('show')

}
$("#CreateEventButton").mouseenter(function() {
    $( "#labelButton1" ).css({'display': 'flex'})
}).mouseleave(function() {
    $( "#labelButton1" ).css({'display': 'none'});
});
let showMap = () => {
    $("#map").css({'display':'block'})
    $("#friends").css({'display':'none'})
    $("#comingevents").css({'display':'none'})
}
let showFriends = () =>{
    $("#map").css({'display':'none'})
    $("#friends").css({'display':'block'})
    $("#comingevents").css({'display':'none'})
}
let loadevents
let showComingEvents = () => {

    $("#map").css({'display':'none'})
    $("#friends").css({'display':'none'})
    $("#comingevents").css({'display':'block'})
    $.get( "/api/event/get/comingevents?eventdate="+ today , function( data ) {
        let eventcard
        let button
        for (let event of data) {
            if (user.user[0]._id !== event.createdBy[0]._id) {
                if (event.participants.filter(function (e) {
                    return e._id === user.user[0]._id;
                }).length > 0) {
                    button = "<br> <button type=\"button\" class=\"btn btn-raised btn-danger\" onclick=\"leaveEvent('" + event._id + "')\" data-target=\".bd-example-modal-lg\">\n" +
                        "                         Leave\n" +
                        "                       </button> "

                } else {
                    button = "<br> <button type=\"button\" class=\"btn btn-raised btn-danger\" onclick=\"joinEvent('" + event._id + "')\" data-target=\".bd-example-modal-lg\">\n" +
                        "                        Join\n" +
                        "                       </button> "

                }


            } else {
                button = " "
            }

            let events = document.getElementById("events")
            eventcard = document.createElement('div');
            eventcard.setAttribute('id',event._id)
            eventcard.setAttribute("style", '   border-radius: 2px;  border-bottom:  2px solid rgba(211, 35, 70, 0.98);   margin-bottom: 1px; margin-top: 1px;')
            eventcard.innerHTML = "<strong>" + event.playdateName + "</strong> <br>" + event.description + "<br>date: " + event.playDateDate + " <p> <br>created by " + event.createdBy[0].firstname + " " + event.createdBy[0].lastname + "</p> " + button
            if(!document.getElementById(event._id)){
                events.appendChild(eventcard)

            }
        }

    })

}
window.setInterval(function () {
    $.get( "/api/event/get/comingevents?eventdate="+ today , function( data ) {
        let eventcard
        let button
        for (let event of data) {
            if (user.user[0]._id !== event.createdBy[0]._id) {
                if (event.participants.filter(function (e) {
                    return e._id === user.user[0]._id;
                }).length > 0) {
                    button = "<br> <button type=\"button\" class=\"btn btn-raised btn-danger\" onclick=\"leaveEvent('" + event._id + "')\" data-target=\".bd-example-modal-lg\">\n" +
                        "                         Leave\n" +
                        "                       </button> "

                } else {
                    button = "<br> <button type=\"button\" class=\"btn btn-raised btn-danger\" onclick=\"joinEvent('" + event._id + "')\" data-target=\".bd-example-modal-lg\">\n" +
                        "                        Join\n" +
                        "                       </button> "

                }


            } else {
                button = " "
            }

            let events = document.getElementById("events")
            eventcard = document.createElement('div');
            eventcard.setAttribute('id',event._id)
            eventcard.setAttribute("style", '   border-radius: 2px;  border-bottom:  2px solid rgba(211, 35, 70, 0.98);   margin-bottom: 1px; margin-top: 1px;')
            eventcard.innerHTML = "<strong>" + event.playdateName + "</strong> <br>" + event.description + "<br>date: " + event.playDateDate + " <p> <br>created by " + event.createdBy[0].firstname + " " + event.createdBy[0].lastname + "</p> " + button
            if(!document.getElementById(event._id)){
                events.appendChild(eventcard)

            }
        }

    })

},5000)


