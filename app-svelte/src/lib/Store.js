// Importa la funzione 'writable' da Svelte Store e la libreria PapaParse
import { writable } from 'svelte/store';
import Papa from 'papaparse';

// Funzione asincrona per caricare i dati dei giochi
async function loadGamesData() {
    // Effettua una richiesta per ottenere il file CSV
    const response = await fetch('../src/assets/games.csv');
    // Legge il testo CSV dalla risposta
    const csvText = await response.text();
    let parsedGamesData; // Variabile per memorizzare i dati dei giochi dopo il parsing

    // Parsa il testo CSV usando PapaParse
    Papa.parse(csvText, {
        header: true, // Imposta il primo record come intestazione
        skipEmptyLines: true, // Salta le righe vuote
        complete: results => {
            parsedGamesData = results.data; // Memorizza i dati dei giochi parsati
        }
    });

    return parsedGamesData; // Ritorna i dati dei giochi
}

// Crea uno store reattivo utilizzando la funzione loadGamesData
const gamesStore = writable(loadGamesData());

// Esporta lo store dei giochi
export default gamesStore;
