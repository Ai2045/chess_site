import { writable } from 'svelte/store';
import Papa from 'papaparse';

async function loadGamesData() {
    const response = await fetch('./src/lib/games.csv');
    const csvText = await response.text();
    let parsedGamesData;

    Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
            parsedGamesData = results.data;
        }
    });

    return parsedGamesData;
}

const gamesStore = writable(loadGamesData());

export default gamesStore;