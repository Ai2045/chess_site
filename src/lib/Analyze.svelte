<script>
  // Importa i componenti necessari
  import Pagination from './Pagination.svelte';  // Componente per la paginazione
  import Chessboard from './Chessboard.svelte';  // Componente per la scacchiera
  import Store from './Store.js';                // Store per i dati delle partite

  // Dichiarazioni delle variabili reactive
  let games = [];               // Array delle partite
  let searchQuery = '';         // Query di ricerca
  let filteredGames = [];       // Array delle partite filtrate
  let currentPage = 1;          // Pagina corrente
  const rowsPerPage = 10;       // Numero di righe per pagina
  let totalPages = 0;           // Numero totale di pagine
  let selectedGameMoves = '';   // Mosse della partita selezionata

  // Recupera i dati delle partite dallo Store
  $Store.then(data => games = data);

  // Funzione per selezionare una partita e visualizzare le mosse sulla scacchiera
  function selectGame(game) {
    selectedGameMoves = game.moves; 
  }

  // Funzione per gestire il cambio di pagina
  function handlePageChange(page) {
    currentPage = page;
  }

  // Calcola le partite filtrate e il numero totale di pagine
  $: filteredGames = games.filter(game =>
    game.white_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.black_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.winner.toLowerCase().includes(searchQuery.toLowerCase())
  );
  $: totalPages = Math.ceil(filteredGames.length / rowsPerPage);
</script>

<div class="p-5">
  <!-- Titolo della sezione -->
  <h1 class="text-3xl font-bold text-center mb-5">Analizza le partite</h1>

  <!-- Scacchiera per visualizzare le mosse della partita selezionata -->
  <Chessboard sanMoves={selectedGameMoves.split(' ').join(' ')} chessMode={"analyze"} />

  <!-- Campo di ricerca -->
  <div class="mb-5">
    <input type="text" bind:value={searchQuery} class="border rounded p-2 text-base w-full" placeholder="Cerca giocatori o vincitore">
  </div>

  <!-- Tabella delle partite -->
  <table class="w-full border-collapse text-left">
    <thead>
      <tr>
        <th class="border p-2 bg-gray-200">White</th>
        <th class="border p-2 bg-gray-200">Black</th>
        <th class="border p-2 bg-gray-200">Winner</th>
        <!-- Aggiungi altre intestazioni di colonna se necessario -->
      </tr>
    </thead>
    <tbody>
      {#each filteredGames.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) as game}
        <tr class="even:bg-gray-100 hover:bg-gray-200 cursor-pointer" on:click={() => selectGame(game)}>
          <td class="border p-2">{game.white_id}</td>
          <td class="border p-2">{game.black_id}</td>
          <td class="border p-2">{game.winner}</td>
          <!-- Aggiungi altre celle di dati se necessario -->
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- Paginazione -->
  {#if totalPages > 1}
    <Pagination
      {totalPages}
      {currentPage}
      maxVisibleButtons={5}
      onPageChange={handlePageChange}
    />
  {/if}
</div>
