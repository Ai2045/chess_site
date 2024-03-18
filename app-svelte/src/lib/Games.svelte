<script>
    import { onMount } from 'svelte';
    let games = [];
    let searchQuery = '';
    let filteredGames = [];
  
    onMount(async () => {
      const response = await fetch('./src/lib/games.csv');
      const csvText = await response.text();
      games = parseCSV(csvText);
      filteredGames = games;
    });
  
    $: filteredGames = searchQuery ? games.filter(game =>
      (game.white_id && game.white_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (game.black_id && game.black_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (game.winner && game.winner.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : games;
  
    function parseCSV(text) {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      const headers = lines[0].split(',').map(header => header.trim());
      return lines.slice(1).map(line => {
        const data = line.split(',').map(cell => cell.trim());
        return headers.reduce((obj, nextKey, index) => {
          obj[nextKey] = data[index];
          return obj;
        }, {});
      });
    }
  
    // Questa funzione ora è pronta per eventuali azioni future,
    // come potrebbero essere richieste API o filtraggi complessi.
    async function searchGames() {
      // Il filtraggio è già gestito dalla reattività di Svelte, ma qui puoi aggiungere altre logiche se necessario.
    }
  </script>
  
  <div class="search-container">
    <input type="text" bind:value={searchQuery} placeholder="Search for players or winner" class="search-input">
    <button on:click={searchGames} class="search-button">Search</button>
  </div>
  
  <div class="games-container">
    {#each filteredGames as game}
      <div class="game">
        <p>White: {game.white_id}</p>
        <p>Black: {game.black_id}</p>
        <p>Winner: {game.winner}</p>
      </div>
    {/each}
  </div>