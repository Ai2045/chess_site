<script>
  import Games from './lib/Games.svelte';
  import Chessboard from './lib/Chessboard.svelte';
</script>

<main>
  <Games />
  
  <div class="game-analysis-container">
    <h2>Analisi della Partita</h2>
    <!-- Qui puoi inserire altri elementi o logica specifica per l'analisi della partita -->
    
    <!-- Inserimento della scacchiera interattiva -->
    <Chessboard />
  </div>
</main>
