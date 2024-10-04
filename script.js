const countryMenu = document.getElementById("country-menu");
const cityNameEl = document.getElementById("city-name");
const cityInfoEl = document.getElementById("city-info");
const visitedButton = document.getElementById("visited-button");
const visitedCitiesInfo = document.getElementById("visited-cities-info"); 
const visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || []; 
let cities = []; 


visitedCitiesInfo.style.display = "none";

function displayVisitedCities() {
  visitedCitiesInfo.innerHTML = ""; 
  visitedCitiesInfo.style.display = "block"; 

  const heading = document.createElement("h2");
  heading.textContent = "Städer jag besökt"; 
  visitedCitiesInfo.appendChild(heading);

  if (visitedCities.length === 0) {
    visitedCitiesInfo.innerHTML +=
      "<p>Du har inte besökt några städer ännu.</p>";
  } else {
    const ul = document.createElement("ul");
    let totalPopulation = 0;

    visitedCities.forEach((cityId) => {
      const city = cities.find((c) => c.id === cityId); 
      if (city) {
        const li = document.createElement("li");
        li.textContent = `${city.stadname} (Population: ${city.population})`;
        ul.appendChild(li);
        totalPopulation += city.population; 
      }
    });

    visitedCitiesInfo.appendChild(ul);
    const totalPopulationText = document.createElement("p");
    totalPopulationText.textContent = `Totalt invånar antal av städerna jag besökt: ${totalPopulation}`;
    visitedCitiesInfo.appendChild(totalPopulationText);
  }

  // Rensa knapp och dess funktion
  const clearHistoryButton = document.createElement("button");
  clearHistoryButton.textContent = "Rensa historik";
  clearHistoryButton.onclick = function () {
    localStorage.removeItem("visitedCities"); 
    visitedCities.length = 0; 
    displayVisitedCities(); 
    alert("Din historik har rensats.");
  };
  visitedCitiesInfo.appendChild(clearHistoryButton); 
}

// Hämta data från JSON filer
async function loadData() {
  try {
    const [countriesResponse, citiesResponse] = await Promise.all([
      fetch("land.json"),
      fetch("stad.json"),
    ]);

    const countries = await countriesResponse.json();
    cities = await citiesResponse.json(); 

    createDropdownMenu(countries, cities);
  } catch (error) {
    console.error("Ett fel uppstod vid laddning av data:", error);
  }
}

// Dropdown meny för länder och städer
function createDropdownMenu(countries, cities) {
  countries.forEach((country) => {
    const li = document.createElement("li");
    const countryLink = document.createElement("a");
    countryLink.textContent = country.countryname;
    countryLink.href = "#";

    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdown-content");

    const countryCities = cities.filter(
      (city) => city.countryid === country.id
    );
    countryCities.forEach((city) => {
      const cityLink = document.createElement("a");
      cityLink.textContent = city.stadname;
      cityLink.href = "#";
      cityLink.addEventListener("click", () => {
        showCityInfo(city);
        visitedCitiesInfo.style.display = "none"; 
      });
      dropdownContent.appendChild(cityLink);
    });

    li.appendChild(countryLink);
    li.appendChild(dropdownContent);
    countryMenu.appendChild(li);
  });


  const visitedCitiesLink = document.createElement("a");
  visitedCitiesLink.textContent = "Städer jag besökt";
  visitedCitiesLink.href = "#";
  visitedCitiesLink.classList.add("nav-link"); 
  visitedCitiesLink.onclick = function () {
    displayVisitedCities(); 
    cityNameEl.textContent = ""; 
    cityInfoEl.textContent = ""; 
  };
  countryMenu.appendChild(visitedCitiesLink);
}

// Visa info för stad i fråga
function showCityInfo(city) {
  cityNameEl.textContent = city.stadname;
  cityInfoEl.textContent = `Invånar antal: ${city.population}`;
  visitedButton.style.display = "block";

  visitedButton.onclick = function () {
    if (!visitedCities.includes(city.id)) {
      visitedCities.push(city.id); 
      localStorage.setItem("visitedCities", JSON.stringify(visitedCities)); 
      alert(`Du har markerat ${city.stadname} som besökt!`);
    } else {
      alert(`Du har redan markerat ${city.stadname} som besökt!`);
    }
  };
}


loadData();
