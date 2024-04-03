<script>
  // Importa i moduli necessari da Svelte e altre dipendenze
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { Chess } from "chess.js";
  import { Chessground } from "chessground";
  import "../../node_modules/chessground/assets/chessground.base.css";
  import "../../node_modules/chessground/assets/chessground.brown.css";
  import "../../node_modules/chessground/assets/chessground.cburnett.css";

  // Crea un dispatcher di eventi
  const dispatch = createEventDispatcher();
  
  // Dichiarazione delle variabili reactive
  export let sanMoves = ""; // Mosse SAN in ingresso come stringa separate da spazi
  export let chessMode = ""; // Modalità scacchiera (gioco, analisi, ecc.)
  let chess = new Chess();
  let ground;
  let timeouts = []; // Array per tenere traccia dei timeout
  let currentMoveIndex = 0; // Indice della mossa corrente
  let isUserMoveDifferent = false; // Mossa dall'utente
  let gameTurn = "white"; // Turno di gioco iniziale

  onMount(() => {
    ground = Chessground(document.getElementById("chessboard"), {
      fen: chess.fen(), // Set the initial position
      highlight: {
        lastMove: true,
        check: true,
      },
      movable: {
        free: true,
        color: "both",
        //allow only legal moves
        events: {
          after: (orig, dest) => {
            if (dest === orig) return; // Skip if the move is the same square
            let legalMoves = chess.moves({ verbose: true });
            let isLegal = legalMoves.some(
              (move) => move.from === orig && move.to === dest
            );
            if (!isLegal) {
              let illegalAudio = new Audio("./illegal.mp3");
              ground.set({ fen: chess.fen() });
              illegalAudio.play();
              console.log("Illegal move");
            } else {
              let pawnPosition = chess.turn() === "w" ? "8" : "1"; // Determine the row where a pawn can be promoted
              let isPromotion =
                chess.get(orig).type === "p" && dest[1] === pawnPosition; // Check if the move is a promotion
              if (isPromotion) {
                askForPromotionType().then((promotionType) => {
                  // When the user has chosen the piece to promote to, make the move
                  let result = chess.move({
                    from: orig,
                    to: dest,
                    promotion: promotionType,
                  });
                  ground.set({ fen: chess.fen() });
                  checkChessLogic(result);
                  let promotionAudio = new Audio("./promote.mp3");
                  promotionAudio.play();
                });
              } else {
                // If it's not a promotion, just make the move
                let result = chess.move({ from: orig, to: dest });
                ground.set({ fen: chess.fen() });
                checkChessLogic(result);
              }
              if (chessMode === "bot") {
                stockfishMove();
              }
            }
          },
        },
      },
      events: {
        select: (key) => {
          //show the legal moves
          let moves = chess.moves({ verbose: true });
          let dests = moves
            .filter((move) => move.from === key)
            .map((move) => move.to);
          console.log(dests);

          //highlight dests
          let shapes = dests.map((destination) => {
            return { orig: key, dest: destination, brush: "green" };
          });
          ground.setShapes(shapes);
        },
      },
      premovable: {
        enabled: true,
      },
      selectable: {
        enabled: true,
      },
      draggable: {
        showGhost: true,
      },
      drawable: {
        enabled: true,
        defaultSnapToValidMove: true,
        shapes: [],
      },
    });
  });

  onDestroy(() => {
    // Clear all timeouts when the component is destroyed
    timeouts.forEach(clearTimeout);
  });

  // Reactive statement to respond to changes in sanMoves
  $: if (sanMoves && ground) {
    isUserMoveDifferent = false;
    chess.reset();
    ground.set({ fen: chess.fen() });
    playAnimation(sanMoves.split(" "));
  }

  function playAnimation(moves) {
    // Clear existing timeouts before starting new ones
    timeouts.forEach(clearTimeout);
    timeouts = [];

    moves.forEach((move, index) => {
      let timeout = setTimeout(() => {
        let result = chess.move(move);
        if (result) {
          ground.set({ fen: chess.fen() });
          checkChessLogic(result);
        } else {
          console.error(`Invalid move: ${move}`);
          // Handle invalid move (e.g., show an error message)
        }
      }, index * 1000); // Adjust timing as needed
      timeouts.push(timeout);
    });
  }

  function checkChessLogic(moves) {
    // Check for check status after the move
    if (chess.inCheck()) {
      let checkColor = chess.turn() === "w" ? "white" : "black";
      //add sound
      let checkAudio = new Audio("./move-check.mp3");
      checkAudio.play();
      //add check animation
      ground.set({ check: checkColor });
    } else {
      // Reset any potential check state.
      ground.set({ check: null });
    }

    // check if the move is a capture
    if (moves.captured) {
      //add sound
      let captureAudio = new Audio("./capture.mp3");
      captureAudio.play();
    } else {
      //add sound
      let moveAudio = new Audio("./move-self.mp3");
      moveAudio.play();
    }
    // Check for castling
    if (moves.flags.includes("k")) {
      //add sound
      let castleAudio = new Audio("./castle.mp3");
      castleAudio.play();
    }
    // Check for checkmate
    if (chess.isCheckmate()) {
      let checkmateAudio = new Audio("./game-end.mp3");
      let winner = chess.turn() === "w" ? "Black" : "White";
      checkmateAudio.play();
      dispatch("gameEnd", { winner:winner, reason: "Checkmate" });
    }
    gameTurn = chess.turn() === "w" ? "White" : "Black";

  }

  // Stop the ongoing move animations by clearing timeouts
  function stopAnimation() {
    timeouts.forEach(clearTimeout);
    timeouts.length = 0;
    currentMoveIndex = chess.history().length; // Update to current move index after stopping
  }

  // Navigate to the previous move
  function prevMove() {
    currentMoveIndex = chess.history().length;
    if (currentMoveIndex > 0) {
      currentMoveIndex--;
      let result = chess.undo();
      ground.set({ fen: chess.fen() });
      checkChessLogic(result);
    }
  }

  // Navigate to the next move
  function nextMove() {
    let arraySanMoves = sanMoves.split(" ");
    if (currentMoveIndex < arraySanMoves.length) {
      let result = chess.move(arraySanMoves[currentMoveIndex]);
      if (result) {
        ground.set({ fen: chess.fen() });
        checkChessLogic(result);
        currentMoveIndex++;
      } else {
        console.error(`Invalid move: ${arraySanMoves[currentMoveIndex]}`);
        isUserMoveDifferent = true;
      }
    }
  }

  const getBestMoveFromFen = async (fen) => {
    const url = "https://chess-stockfish-16-api.p.rapidapi.com/chess/api";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "6d0d0790a4mshee1c6ba20c7eb68p110a0ejsn8a43b84bf770", // Replace with your actual API key
        "X-RapidAPI-Host": "chess-stockfish-16-api.p.rapidapi.com",
      },
      body: new URLSearchParams({ fen }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json(); // Assuming the API returns JSON data
      console.log(result);
      return result;
    } catch (error) {
      console.error("Failed to fetch best move:", error);
    }
  };
  function stockfishMove() {
    isUserMoveDifferent = true;
    let fen = chess.fen();
    getBestMoveFromFen(fen).then((bestMove) => {
      console.log(bestMove.bestmove);
      let result = chess.move(bestMove.bestmove);
      ground.set({ fen: chess.fen() });
      checkChessLogic(result);
      currentMoveIndex++;
    });
  }

  function askForPromotionType() {
    return new Promise((resolve) => {
      // Display the promotion popup
      document.getElementById("promotion-popup").style.display = "block";

      // Add click listeners to your promotion buttons
      [
        "promote-queen",
        "promote-rook",
        "promote-bishop",
        "promote-knight",
      ].forEach((id) => {
        document.getElementById(id).addEventListener("click", function () {
          // When a user clicks a button, hide the popup
          document.getElementById("promotion-popup").style.display = "none";

          // Resolve the Promise with the value of chosen piece
          resolve(this.value);
        });
      });
    });
  }
</script>

<div class="flex flex-col items-center p-8">
  {#if chessMode === "analyze"}
    <div class="flex mb-4">
      <button
        on:click={stopAnimation}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Stop
      </button>
      <button
        on:click={prevMove}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Previous Move
      </button>
      <button
        on:click={nextMove}
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        disabled={isUserMoveDifferent}
      >
        Next Move
      </button>
      <button
        on:click={stockfishMove}
        class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Stockfish Move
      </button>
    </div>
  {/if}
  <div id="promotion-popup" class="hidden fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-900 bg-opacity-60">
    <div class="bg-white p-5 rounded-lg shadow-md">
      <p class="text-lg font-bold mb-4">Choose a piece for pawn promotion:</p>
      <div class="grid grid-cols-4 gap-4">
        <button id="promote-queen" value="q" class="flex items-center justify-center h-12 bg-purple-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">Queen</button>
        <button id="promote-rook" value="r" class="flex items-center justify-center h-12 bg-blue-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">Rook</button>
        <button id="promote-bishop" value="b" class="flex items-center justify-center h-12 bg-green-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">Bishop</button>
        <button id="promote-knight" value="n" class="flex items-center justify-center h-12 bg-red-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">Knight</button>
      </div>
    </div>
  </div>
  <div
    id="chessboard"
    class="w-[500px] h-[500px] border-2 border-gray-600"
  ></div>
    <p class="text-2xl p-6">move: {gameTurn}</p>

</div>
