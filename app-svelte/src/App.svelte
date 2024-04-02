<script>
  import { Router, Route } from 'svelte-routing';
  import Analyze from './lib/Analyze.svelte';
  import Game from './lib/Game.svelte';
  import SideBar from './lib/Sidebar.svelte';
  import Footer from './lib/Footer.svelte';
</script>

<Router>
  <div class="grid min-h-screen grid-cols-[auto_1fr] overflow-hidden  ">
      <SideBar />
      <div class="h-[calc(100vh_-_1px)] w-full overflow-y-scroll">
      <Route path="/game" component={Game} />
      <Route path="/analyze" component={Analyze} />
      <Footer />
    </div>
      
    </div>
</Router>