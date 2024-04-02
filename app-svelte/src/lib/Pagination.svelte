<script>
  // Dichiara le variabili reattive esportate
  export let totalPages;           // Numero totale di pagine
  export let currentPage;          // Pagina corrente
  export let maxVisibleButtons = 5; // Numero massimo di pulsanti visibili
  export let onPageChange;         // Funzione per gestire il cambio di pagina
  
  let paginationRange; // Rappresenta il range di paginazione
  
  // Funzione per calcolare il range di paginazione
  function calculatePaginationRange() {
    const totalButtons = Math.min(maxVisibleButtons, totalPages);
    let startPage = Math.max(1, currentPage - Math.floor(totalButtons / 2));
    let endPage = Math.min(totalPages, startPage + totalButtons - 1);

    if (endPage - startPage + 1 < totalButtons) {
      startPage = Math.max(1, endPage - totalButtons + 1);
    }

    paginationRange = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  // Esegui il calcolo del range di paginazione quando cambiano le variabili coinvolte
  $: calculatePaginationRange();

  // Funzione per andare alla pagina specificata
  function goToPage(page) {
    onPageChange(Math.min(Math.max(1, page), totalPages));
  }

  // Variabile per l'input della pagina
  let inputPage = currentPage;

  // Funzione per gestire il cambio dell'input della pagina
  function onInputPageChange(event) {
      const page = Number(event.target.value);
          if (page >= 1 && page <= totalPages) {
              goToPage(page);
          }
  }

  // Aggiorna l'input quando cambia la pagina corrente
  $: inputPage = currentPage;
</script>

<!-- Struttura HTML per la visualizzazione della paginazione -->
<div class="flex justify-center space-x-4 mt-4">

<!-- Input per selezionare la pagina -->
<div class="flex items-center space-x-2">
  <span class="text-sm font-medium">Pagina:</span>
  <input
    type="number"
    min="1"
    max={totalPages}
    class="border rounded p-2 text-base w-16 text-center"
    bind:value={inputPage}
    on:change={onInputPageChange}>
  <span class="text-sm font-medium">di {totalPages}</span>
</div>

<!-- Pulsante per tornare alla pagina precedente -->
<button
  class="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
  on:click={() => goToPage(currentPage - 1)}
  disabled={currentPage === 1}>
  {"<"}
</button>

<!-- Pulsante per andare alla pagina successiva -->
<button
  class="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
  on:click={() => goToPage(currentPage + 1)}
  disabled={currentPage === totalPages}>
  {">"}
</button>
</div>

