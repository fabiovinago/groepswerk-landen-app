function getCountries(searchCountry, searchRegion) {
    axios.get("https://restcountries.com/v3.1/all")
        .then(response => {
            response.data.forEach(country => {
                const name = country.name.common ? country.name.common : "Unknown";
                const flagURL = country.flags.png ? country.flags.png : "https://placehold.co/600x400";
                const region = country.region ? country.region : "Unknown";
                const population = country.population ? country.population : "Unknown";
                const capital = country.capital ? Object.values(country.capital).join(", ") : "Unknown";
                const languages = country.languages ? Object.values(country.languages).join(", ") : "Unknown";
                const valutaObj = country.currencies ? country.currencies : null;
                const valuta=valutaObj ? Object.values(valutaObj).map(currency=>currency.name).join(", "):"Unknown";
                const latlng=country.latlng?country.latlng:null;

                const data={
                    name:this.name,
                    flagURL:this.flagURL,
                    region:this.Region,
                    population:this.population,
                    capital:this.capital,
                    languages:this.languages,
                    valuta:this.valuta,
                    latlng:this.latlng
                }

                const cardRow=document.querySelector("#cardRow");

                if((name.toLowerCase()===searchCountry.toLowerCase()||region===searchRegion)) {
                    /*if((!searchCountry&&!searchRegion)||(!searchCountry&&searchRegion===region)||(!searchRegion&&name.toLowerCase().search(searchCountry.toLowerCase())!==-1)){*/
                    const card = document.createElement("div");
                    card.classList.add("col-lg-3", "col-md-6", "mb-4");
                    card.innerHTML = `
                        <div class="card h-100 shadow p-3 mb-5 rounded border border-none scale-up-center">
                            <img alt="Country Flag" class="card-image card-img-top object-fit-cover border rounded" src="${flagURL}">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text">
                                    <strong>Region:</strong> ${region}<br>
                                    <strong>Population:</strong> ${population.toLocaleString()}
                                </p>
                                <button class="btn btn-primary openModal" data-bs-target="#countryModal" data-bs-toggle="modal">
                                    View Details
                                </button>
                            </div>
                        </div>
                    `;
                    cardRow.appendChild(card);
                    card.querySelector(".openModal").addEventListener("click", function () {
                        fillModal(name, capital, languages, valuta, population, flagURL, latlng);
                    });
                }
            });
        })
    .catch(error => console.error("Error fetching countries:",error));
}

function fillModal(name, capital, languages, valuta, population, flagURL, latlng){
    document.querySelector("#countryModalLabel").textContent=name;
    document.querySelector("#modalCapital").textContent=capital;
    document.querySelector("#modalLanguage").textContent=languages;
    document.querySelector("#modalCurrency").textContent=valuta;
    document.querySelector("#modalPopulation").textContent=population.toLocaleString();
    document.querySelector("#modalFlag").setAttribute("src",`${flagURL}`);
}

const searchCountry=document.querySelector("#searchInput");
const searchRegion=document.querySelector("#regionFilter");

searchCountry.addEventListener("keypress",function(event){
    if(event.key==="Enter"){
        cardRow.innerHTML="";
        getCountries(searchCountry.value,searchRegion.value);
        searchCountry.value="";
    }
})

searchRegion.addEventListener("change", function(){
    cardRow.innerHTML="";
    getCountries(searchCountry.value,searchRegion.value);
})

