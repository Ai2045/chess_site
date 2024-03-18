<script>
    import { onMount } from 'svelte';
    import { Chessground } from 'chessground';
    import { Chess } from 'chess.js';

    let board = null;
    let game = new Chess();
    let config = {};
    onMount(() => {
        config = {
            fen: 'start',
            orientation: 'white',
            movable: {
                free: true,
                color: 'white',
                dests: game.moves({ verbose: true }).reduce((dests, move) => {
                    dests[move.from] = [move.to];
                    return dests;
                }, {})
            }
        };

        board = Chessground(document.getElementById('board'), config);

    });
    game.move('e4');
    
</script>

<div id="board"></div>

<style>
#board {
    width: 400px; /* Imposta la larghezza della scacchiera */
    height: 400px; /* Imposta l'altezza della scacchiera */
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    border: 2px solid #764E33; /* Bordi in legno scuro per la scacchiera */
    background: #F0D9B5; /* Colore di sfondo chiaro per le caselle bianche */
}

.cg-wrap {
    border-radius: 8px; /* Angoli arrotondati per la scacchiera */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Ombra più marcata sotto la scacchiera */
}

.cg-square.white {
    background: #F0D9B5; /* Colore di sfondo per le caselle bianche */
}

.cg-square.black {
    background: #B58863; /* Colore di sfondo per le caselle nere */
}

.cg-piece {
    width: 100%; /* Le immagini dei pezzi riempiranno le caselle */
    height: auto; /* Mantenere l'aspetto originale delle immagini */
}
</style>