<script>
    // Importa la funzione 'writable' da Svelte Store e il componente 'Chessboard'
    import { writable } from 'svelte/store';
    import Chessboard from './Chessboard.svelte';
    
    // Dichiara due store reattivi
    const gameMode = writable('');        // Modalità di gioco (vuota di default)
    const isSelectionMade = writable(false); // Flag che indica se la selezione è stata fatta (falso di default)
    
    // Funzione per selezionare la modalità di gioco
    function selectGameMode(mode) {
      gameMode.set(mode);              // Imposta la modalità di gioco
      isSelectionMade.set(true);       // Imposta il flag di selezione fatta a true
    }
    
    // Funzione per abbandonare la partita
    function abandonGame() {
      gameMode.set('');                // Resetta la modalità di gioco
      isSelectionMade.set(false);      // Imposta il flag di selezione fatta a false
    }

    // Funzione per gestire la fine della partita
    function handleEndGame(event){
        alert(`Game Over! Winner: ${event.detail.winner} Reason: ${event.detail.reason}`); // Visualizza un alert con il vincitore e il motivo della fine della partita
        abandonGame(); // Chiama la funzione per abbandonare la partita
    }
</script>
    
    
<div class="flex justify-center items-center h-screen">
      
  {#if $isSelectionMade} <!-- Mostra la scacchiera solo se la selezione è stata fatta -->
    <Chessboard on:gameEnd={handleEndGame} chessMode={$gameMode} /> <!-- Passa il mode di gioco alla scacchiera e gestisce la fine della partita -->
    <button on:click={abandonGame} class="absolute top-10 right-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Abandon Game</button> <!-- Pulsante per abbandonare la partita -->
  {/if}

  <div class="flex">
      <!-- Se la selezione non è stata fatta, mostra la sezione di selezione -->
      {#if !$isSelectionMade}
        <div class="flex flex-col justify-center space-y-4 bg-white p-10 shadow-lg h-auto z-20">
          <h1 class="text-3xl font-bold text-center mb-5">Select Game Mode</h1> <!-- Titolo -->
          <button on:click={() => selectGameMode('play')} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Play Mode</button> <!-- Pulsante per la modalità di gioco 'play' -->
          <button on:click={() => selectGameMode('bot')} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Bot Mode</button> <!-- Pulsante per la modalità di gioco 'bot' -->
        </div>
      {/if}
  </div>  
</div>
