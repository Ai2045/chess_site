<script>
  // Importa i moduli necessari da Svelte Routing e i componenti personalizzati
  import { Router, Route } from 'svelte-routing';
  import Analyze from '../src/lib/Analyze.svelte'; // Importa il componente per l'analisi
  import Game from '../src/lib/Game.svelte';       // Importa il componente per il gioco
  import SideBar from '../src/lib/Sidebar.svelte'; // Importa il componente per la barra laterale
  import Footer from '../src/lib/Footer.svelte';   // Importa il componente per il piè di pagina
</script>

<Router>
  <!-- Contenitore principale per il layout della pagina -->
  <div class="grid min-h-screen grid-cols-[auto_1fr] overflow-hidden">
    <!-- Barra laterale -->
    <SideBar />

    <!-- Contenitore principale per il contenuto -->
    <div class="h-[calc(100vh_-_1px)] w-full overflow-y-scroll">

      <!-- Route per il componente di introduzione, visualizzato come percorso predefinito -->
      <Route path="/" component={Analyze} />

      <!-- Route per il componente del gioco -->
      <Route path="/game" component={Game} />

      <!-- Route per il componente di analisi -->
      <Route path="/analyze" component={Analyze} />

      <!-- Piè di pagina -->
      <Footer />
    </div>
  </div>
</Router>
