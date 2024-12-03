function generateCards(searchCountry,searchRegion){
    axios.get("https://restcountries.com/v3.1/all")
        .then(response =>{
            //Set variable to check if if-statement has been run
            var foundResult=false;
            if(!searchCountry&&!searchRegion){
                alert("Please use a filter. Hint: select all regions.")
            }else{
                response.data.forEach(country=>{

                    //Elements from API → Check if value determined
                    const nameOfficial=country.name.official?country.name.official:"Unknown";
                    const nameCommon=country.name.common?country.name.common:"Unknown";
                    const flagURL=country.flags.png?country.flags.png:"https://placehold.co/600x400";
                    const region=country.region?country.region:"Unknown";
                    const population=country.population?country.population:"Unknown";
                    const capital=country.capital?Object.values(country.capital).join(", "):"Unknown";
                    const languages=country.languages?Object.values(country.languages).join(", "):"Unknown";
                    const currencyObj=country.currencies?country.currencies:null;
                    const currencies=currencyObj?Object.values(currencyObj).map(currency=>currency.name).join(", "):"Unknown";
                    const latlng=country.capitalInfo?country.capitalInfo:null;

                    //Elements from DOM
                    const cardRow=document.querySelector("#cardRow");

                    //Filter
                    if(
                        //Search by country → Check if official or common name contains search word
                        (!searchRegion&&nameOfficial.toLowerCase().includes(searchCountry.toLowerCase())) ||
                        (!searchRegion&&nameCommon.toLowerCase().includes(searchCountry.toLowerCase())) ||
                        //Search by region → Check if region matches or if region="All"
                        (!searchCountry&&(searchRegion===region||searchRegion==="All")) ||
                        //Search by country & by region
                        (nameOfficial.toLowerCase().includes(searchCountry.toLowerCase())&&(searchRegion===region||searchRegion==="All")) ||
                        (nameCommon.toLowerCase().includes(searchCountry.toLowerCase())&&(searchRegion===region||searchRegion==="All"))
                    ){
                        //Indicate a result has been found
                        foundResult=true;

                        //Create info card
                        const card = document.createElement("div");
                        card.classList.add("col-lg-3","col-md-6","mb-4");
                        card.innerHTML=`
                        <div class="card h-100 shadow p-3 mb-5 rounded border border-none scale-up-center">
                            <img src="${flagURL}" alt="Flag ${nameOfficial}" class="card-image card-img-top object-fit-cover border rounded">        
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="card-title">${nameOfficial}</h5>
                                    <p class="mb-4">(${nameCommon})</p>
                                    <p class="card-text">
                                        <strong>Region:</strong> ${region} <br>
                                        <strong>Population:</strong> ${population.toLocaleString()}
                                    </p>
                                </div>
                                <button class="btn btn-primary openModal" data-bs-target="#countryModal" data-bs-toggle="modal">
                                    View Details
                                </button>
                            </div>   
                        </div>
                    `

                        //Add info card to DOM
                        cardRow.appendChild(card);

                        //Details button on info card
                        card.querySelector(".openModal").addEventListener("click", function(){
                            fillModal(nameOfficial,nameCommon,capital,languages,currencies,population,flagURL,latlng);
                        })
                    }
                })
                if (foundResult===false){
                    alert("Country not found... Try selecting a different region or check the spelling.")
                }
            }
        })
        //Error handling
        .catch(error => console.error("Error fetching countries:",error));
}

//Inject API info into modal
function fillModal(nameOfficial,nameCommon,capital,languages,currencies,population,flagURL,latlng){
    //Inject info from API
    document.querySelector("#countryModalLabel").textContent=nameOfficial;
    document.querySelector("#modalNameCommon").textContent=nameCommon;
    document.querySelector("#modalCapital").textContent=capital;
    document.querySelector("#modalLanguage").textContent=languages;
    document.querySelector("#modalCurrency").textContent=currencies;
    document.querySelector("#modalPopulation").textContent=population.toLocaleString();
    document.querySelector("#modalFlag").setAttribute("src",`${flagURL}`);

    //Leaflet map
    //Check if map is available
    if (latlng.latlng) {
        //Remove existing leaflet map (if exists)
        if (window.map) {
            window.map.remove()
        }

        //Inject leaflet map
        window.map = L.map('interactieve-map').setView([latlng.latlng[0], latlng.latlng[1]], 7);
        L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        //reload leaflet map when opening modal
        var countryModal = document.getElementById('countryModal');
        countryModal.addEventListener('shown.bs.modal', function () {
            map.invalidateSize(); // Ensure the map resizes correctly after modal is fully displayed
        });

        //Add marker with info to the map
        L.marker([latlng.latlng[0], latlng.latlng[1]]).addTo(map).bindPopup(`<strong>Country: </strong>${nameOfficial}<br><strong>Capital: </strong>${capital}`);
    } else {
        document.querySelector("#interactieve-map").innerHTML=`
        <p>No map found.</p>
        `;
    }


}

//Elements from DOM
const searchInput=document.querySelector("#searchInput");
const regionFilter=document.querySelector("#regionFilter");

//Apply country filter
searchInput.addEventListener("keypress", function(event){

    // Disallow all characters except letters & éèçàùêë-
    searchInput.value = searchInput.value.replace(/[^a-zA-Z\u00C0-\u017F\s-]/g, '');


    if(event.key==="Enter"){
        //Empty cardRow
        cardRow.innerHTML="";

        //Generate cards
        generateCards(searchInput.value,regionFilter.value);

        //Reset input
        searchInput.value="";
    }
})

//Apply region filter
regionFilter.addEventListener("change", function(){
    //Empty cardRow
    cardRow.innerHTML="";

    //Generate cards
    generateCards(searchInput.value,regionFilter.value);
})



