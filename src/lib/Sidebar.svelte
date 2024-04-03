<script>
    // Importa il componente Link da Svelte Routing
    import { Link } from 'svelte-routing';
</script>

<!-- Struttura HTML per il menù laterale -->
<aside class="flex flex-col items-center h-[calc(100vh)] w-24 bg-slate-500 py-6 dark:bg-darkSlate transition-colors duration-200">
    <!-- Link per navigare alla pagina "Game" -->
    <Link class="py-2 px-4 rounded text-white hover:bg-blue-600 hover:text-black transition-colors duration-300" to="/game">Game</Link>
    <!-- Link per navigare alla pagina "Analyze" -->
    <Link class="py-2 px-4 rounded text-white hover:bg-blue-600 hover:text-black transition-colors duration-300" to="/analyze">Analyze</Link>
</aside>
