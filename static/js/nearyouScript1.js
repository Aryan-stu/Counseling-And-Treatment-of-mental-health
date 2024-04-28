let map;
let service;
let markers = []; // Array to store markers

function initMap() {
    // Initialize map centered at user's location
    navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        map = new google.maps.Map(document.getElementById("map"), {
            center: userLocation,
            zoom: 14
        });

        // Define the icon for the user's marker
        const userIcon = {
            url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png', // Change to the desired color
            //scaledSize: new google.maps.Size(48, 48) // Adjust size if needed
        };

        // Add marker for user's location with custom icon
        new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: userIcon // Apply custom icon
        });

        // Request psychiatrist data near user's location
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(
            {
              location: userLocation,
              radius: 5000,
              type: "doctor",
              keyword: "psychiatrist mental health counseling therapy"
            },
            displayResults
          );
        },
    error => {
        // Handle error
    },
    {
        enableHighAccuracy: true,
        timeout: 25000 // Increase timeout value (in milliseconds)
    });
}

function displayResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    // Sort results by user rating count (descending order)
    results.sort((a, b) => b.user_ratings_total - a.user_ratings_total);

    const table = document.createElement("table");
    table.classList.add("results-table");

    // Add table headings
    const tableHead = document.createElement("thead");
    tableHead.innerHTML = `
        <tr>
          <th>Locations</th>
          <th>Reviews</th>
        </tr>
      `;
      table.appendChild(tableHead);
  
      const tableBody = document.createElement("tbody");
  
      results.forEach(place => {
        const name = place.name;
        const rating = place.rating || 'N/A';
        const address = place.vicinity;
        const ratingCount = place.user_ratings_total || 0;
        const phoneNumber = place.formatted_phone_number || 'N/A';
  
        // Create table row for each psychiatrist
        const row = document.createElement("tr");
  
        // Add name, rating, address, and phone number to the row
        row.innerHTML = `
          <td>
            <a href="https://www.google.com/maps/place/?q=${name}+${address}" class="location-link" data-lat="${place.geometry.location.lat()}" data-lng="${place.geometry.location.lng()}" target="_blanks">
              <h4>${name}</h4>
              <p>${address}</p>
            </a>
          </td>
          <td>${rating} (${ratingCount} reviews)</td>
        `;
  
        tableBody.appendChild(row);
  
        // Create marker for the psychiatrist
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: name
        });
  
        // Store the marker in the markers array
        markers.push(marker);
  
        // Add click event listener only to marker
        marker.addListener('click', function() {
          map.setCenter(marker.getPosition());
          map.setZoom(14);
          showDetails(place);
        });
      });
  
      table.appendChild(tableBody);
      resultsDiv.appendChild(table);
  
      // Fit map to show all markers
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }
  