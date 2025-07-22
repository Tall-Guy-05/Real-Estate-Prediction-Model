function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i in uiBathrooms) {
        if (uiBathrooms[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i in uiBHK) {
        if (uiBHK[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1;
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var location = document.getElementById("uiLocations"); // Get location element
    var estPrice = document.getElementById("uiEstimatedPrice");

    estPrice.classList.remove("fade-in");
    estPrice.classList.add("fade-out");

    setTimeout(function() {
        estPrice.classList.remove("error");

        // Validation 1: Check if the square feet input is valid
        if (!sqft.value || parseFloat(sqft.value) < 1000) {
            estPrice.textContent = "Enter area of at least 1000 sq. ft.";
            estPrice.classList.add("error");
            estPrice.classList.remove("fade-out");
            estPrice.classList.add("fade-in");
            return;
        }

        // Validation 2: Check if a location has been selected
        if (!location.value) {
            estPrice.textContent = "Please select a location.";
            estPrice.classList.add("error");
            estPrice.classList.remove("fade-out");
            estPrice.classList.add("fade-in");
            return;
        }

        var bhk = getBHKValue();
        var bathrooms = getBathValue();
        var url = "http://127.0.0.1:5000/predict_home_price";

        $.post(url, {
            total_sqft: parseFloat(sqft.value),
            bhk: bhk,
            bath: bathrooms,
            location: location.value
        }, function(data, status) {
            console.log(data.estimated_price);
            estPrice.classList.remove("error");
            estPrice.textContent = data.estimated_price.toString() + " Lakh";
            estPrice.classList.remove("fade-out");
            estPrice.classList.add("fade-in");
            console.log(status);
        });
    }, 300);
}

function onPageLoad() {
    console.log("document loaded");

    var form = document.querySelector(".price-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        onClickedEstimatePrice();
    });

    var url = "http://127.0.0.1:5000/get_location_names";
    $.get(url, function(data, status) {
        console.log("got response for get_location_names request");
        if (data) {
            var locations = data.location;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            $('#uiLocations').append('<option value="" disabled selected>Select a neighborhood</option>');
            if (locations) {
                for (var i in locations) {
                    var opt = new Option(locations[i]);
                    $('#uiLocations').append(opt);
                }
            }
        }
    });
}

window.onload = onPageLoad;
