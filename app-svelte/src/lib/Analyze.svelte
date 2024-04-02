<script>
  import Pagination from './Pagination.svelte';
  import Chessboard from './Chessboard.svelte';
  import Store from './Store.js';

  let games = [];
  let searchQuery = '';
  let filteredGames = [];
  let currentPage = 1;
  const rowsPerPage = 10;
  let totalPages = 0;
  let selectedGameMoves = '';

  $Store.then(data => games = data);

  function selectGame(game) {
    selectedGameMoves = game.moves; 
  }

  function handlePageChange(page) {
    currentPage = page;
  }

  $: filteredGames = games.filter(game =>
    game.white_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.black_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.winner.toLowerCase().includes(searchQuery.toLowerCase())
  );
  $: totalPages = Math.ceil(filteredGames.length / rowsPerPage);
</script>

<div class="p-5">
  <h1 class="text-3xl font-bold text-center mb-5">Analizza le partite</h1>
  <Chessboard sanMoves={selectedGameMoves.split(' ').join(' ')} chessMode={"analyze"} />

<div class="mb-5">
  <input type="text" bind:value={searchQuery} class="border rounded p-2 text-base w-full" placeholder="Cerca giocatori o vincitore">
</div>

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

{#if totalPages > 1}
  <Pagination
    {totalPages}
    {currentPage}
    maxVisibleButtons={5}
    onPageChange={handlePageChange}
  />
{/if}

</div>