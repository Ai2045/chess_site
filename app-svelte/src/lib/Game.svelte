<script>
    import { writable } from 'svelte/store';
    import Chessboard from './Chessboard.svelte';
    
    const gameMode = writable('');
    const isSelectionMade = writable(false);
    
    function selectGameMode(mode) {
      gameMode.set(mode);
      isSelectionMade.set(true);
    }
    
    function abandonGame() {
      gameMode.set('');
      isSelectionMade.set(false);
    }

    function handleEndGame(event){
        alert(`Game Over! Winner: ${event.detail.winner} Reason: ${event.detail.reason}`);
        abandonGame();
    }
    </script>
    
    
    <div class="flex justify-center items-center h-screen">
      
      {#if $isSelectionMade}
        <Chessboard on:gameEnd={handleEndGame} chessMode={$gameMode} />
        <button on:click={abandonGame} class="absolute top-10 right-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Abandon Game</button>
      {/if}
    
      <div class="flex">
          <!-- If selection is not made, display selection section -->
          {#if !$isSelectionMade}
            <div class="flex flex-col justify-center space-y-4 bg-white p-10 shadow-lg h-auto z-20">
              <h1 class="text-3xl font-bold text-center mb-5">Select Game Mode</h1>
              <button on:click={() => selectGameMode('play')} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Play Mode</button>
              <button on:click={() => selectGameMode('bot')} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Bot Mode</button>
            </div>
          {/if}
        
      </div>  
    </div>