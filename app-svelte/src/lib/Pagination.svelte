<script>
    export let totalPages;
    export let currentPage;
    export let maxVisibleButtons = 5;
    export let onPageChange;
  
    let paginationRange;
  
    function calculatePaginationRange() {
      const totalButtons = Math.min(maxVisibleButtons, totalPages);
      let startPage = Math.max(1, currentPage - Math.floor(totalButtons / 2));
      let endPage = Math.min(totalPages, startPage + totalButtons - 1);
  
      if (endPage - startPage + 1 < totalButtons) {
        startPage = Math.max(1, endPage - totalButtons + 1);
      }
  
      paginationRange = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  
    $: calculatePaginationRange();
  
    function goToPage(page) {
      onPageChange(Math.min(Math.max(1, page), totalPages));
    }

    let inputPage = currentPage;

    function onInputPageChange(event) {
        const page = Number(event.target.value);
            if (page >= 1 && page <= totalPages) {
                goToPage(page);
            }
    }

  $: inputPage = currentPage; // Aggiorna l'input quando cambia la pagina corrente
  </script>
  
  

  <div class="flex justify-center space-x-4 mt-4">
  
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
  
    <button
      class="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}>
      {"<"}
    </button>
  
    <button
      class="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
      on:click={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}>
      {">"}
    </button>
  </div>