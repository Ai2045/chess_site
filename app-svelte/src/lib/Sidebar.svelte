<script>
    import { Link } from 'svelte-routing';
</script>

<aside class="flex flex-col items-center h-[calc(100vh)] w-24 bg-slate-500 py-6 dark:bg-darkSlate transition-colors duration-200">
    <Link class="py-2 px-4 rounded text-white hover:bg-blue-600 hover:text-black transition-colors duration-300" to="/game">Game</Link>
    <Link class="py-2 px-4 rounded text-white hover:bg-blue-600 hover:text-black transition-colors duration-300" to="/analyze">Analyze</Link>
    
</aside>