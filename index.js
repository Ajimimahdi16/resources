async function fetchJson(url) {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        throw new Error(`Impossibile connettersi all'API. Il server potrebbe essere offline. Dettaglio: ${err.message}`);
    }
}

async function getDashboardData(query) {
    // Facciamo partire le chiamate contemporaneamente
    // Ora queste variabili contengono delle vere Promesse (oggetti in attesa).
    const destinationsPromise = fetchJson(`https://freetestapi.com/api/v1/destinations?search=${query}`);
    const weathersPromise = fetchJson(`https://freetestapi.com/api/v1/weathers?search=${query}`);
    const airportsPromise = fetchJson(`https://freetestapi.com/api/v1/airports?search=${query}`);

    // Creiamo l'array di Promesse
    const promises = [destinationsPromise, weathersPromise, airportsPromise];

    //  Usiamo  Promise.all. 
    const [destinations, weathers, airports] = await Promise.all(promises);

    //  Estraiamo il primo elemento di ciascun array
    return {
        city: destinations[0].name,
        country: destinations[0].country,
        temperature: weathers[0].temperature,
        weather: weathers[0].weather_description,
        airport: airports[0].name 
    };
}

// --- Esecuzione del test ---
getDashboardData('london')
    .then(data => {
        console.log('Dashboard data:', data);
        console.log(
            `${data.city} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`+
            `The main airport is ${data.airport}.\n`
        );
    })
    .catch(error => console.error(error));