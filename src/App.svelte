<script>
  import * as Earthstar from "earthstar";

  import { onMount, tick } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { getSHA256Hash } from "boring-webcrypto-sha256";
  import settings, { generateID, submissionSuccess, replica } from "./store";
  import { getUrlParam, fetchAllowedVoters, getAllChoices } from "./lib/utils.js";

  import Vote from "./lib/Vote.svelte";
  import Results from "./lib/Results.svelte";
  import Identity from "./lib/Identity.svelte";

  let showIdentity = false;
  let showVotingInterface = false;
  let hasVoted = false;
  let showIdentityButton = false;
  let loading = true;

  let allowedVoters = null;

  let responses = [];
  let year;
  let voteCounts = {};

  let id, positiveVotes, negativeVotes, voters;

  let cache = new Earthstar.ReplicaCache(replica);

  let footerHeight = 0;

  // Function to toggle the identity section
  async function toggleIdentity() {
    showIdentity = !showIdentity;

    // Wait for the DOM to update
    await tick();

    // Update the footer height
    const footer = document.getElementById("IdentityFooter");
    footerHeight = footer ? footer.clientHeight : 0;
  }

  // Check if the user has already voted
  function checkIfUserVoted(newKeypair) {
    if (voters && newKeypair?.address) {
      hasVoted = voters.some((doc) => doc.author === newKeypair.address);
    }
  }

  // Abstract the config or URL param logic
  async function checkForConfigOrParams() {
    const configFile = getUrlParam('v');
    if (configFile) {
      await loadVoteConfig(configFile); // Load from the config
    } else {
      // Load directly from URL params
      id = getUrlParam("q");
      responses = getAllChoices();
      await handleRestrictedVoting(); // Handle restricted votes if needed
    }

    // Initialize author if not set
    if (!settings.author) {
      const generatedId = await generateID("r");
      if (!(generatedId instanceof Earthstar.ValidationError)) {
        settings.author = generatedId;
      }
    }

    if (id) {
      await fetchVotes();
      checkIfUserVoted(settings.author);
      toggleVotingInterface();
      startPeerSync(); // Initialize peer syncing
    }
  }

  // Handle restricted voting if the 'r' param is present
  async function handleRestrictedVoting() {
    const restrictedVote = getUrlParam("r");
    if (restrictedVote) {
      allowedVoters = await fetchAllowedVoters();
      const currentAuthor = settings.author?.address;

      if (allowedVoters && currentAuthor && !allowedVoters.includes(currentAuthor)) {
        showIdentityButton = true; // Show the identity switcher
      }
    }
  }

  // Toggle voting interface visibility based on voting status
  function toggleVotingInterface() {
    if (hasVoted) {
      showVotingInterface = false;
    } else {
      showVotingInterface = true;
    }
  }

  // Fetch the votes and calculate vote counts
  async function fetchVotes() {
    let hash = await getSHA256Hash(id);

    const allDocuments = await cache.queryDocs({
      filter: { pathStartsWith: "/" + hash },
    });

    const documents = allDocuments.filter(doc => !doc.path.endsWith('voter'));
    if (documents.length >= 0) {
      voters = allDocuments.filter((doc) => doc.text.includes("Voted"));

      if (responses && responses.length > 0) {
        voteCounts = {};
        documents.forEach((doc) => {
          const vote = doc.text;
          voteCounts[vote] = (voteCounts[vote] || 0) + 1;
        });
      }
      checkIfUserVoted(settings.author);
    }
  }

  // Load vote config based on the URL param
  async function loadVoteConfig(configFile) {
    try {
      const response = await fetch(`./configs/${configFile}`);
      const config = await response.json();

      id = config.id;
      responses = Object.entries(config)
        .filter(([key]) => /^\d+$/.test(key))
        .map(([, value]) => value); // Extract only the response values

      year = config.year;

      await fetchVotes(); // Fetch votes after loading config
      checkIfUserVoted(settings.author); // Check voting status
      toggleVotingInterface(); // Decide if we show the voting interface
    } catch (error) {
      console.error('Error loading vote configuration:', error);
    } finally {
      loading = false; // Mark loading complete
    }
  }

  // Initialize peer synchronization for Earthstar
  function startPeerSync() {
    const peer = new Earthstar.Peer();
    peer.addReplica(replica);
    peer.sync(import.meta.env.VITE_SERVER_ADDRESS, true);
    settings.addServer(import.meta.env.VITE_SERVER_ADDRESS);
    cache.onCacheUpdated(fetchVotes);
  }

  // When the component mounts, start by checking for configs or URL params
  onMount(async () => {
    await checkForConfigOrParams();
    loading = false; // Mark loading complete
  });

  // Watch for submission success or hasVoted and hide the voting interface
  $: if ($submissionSuccess === true || hasVoted === true) {
    showVotingInterface = false;
  }
</script>

<main>
  <div class='absolute flex flex-col items-center w-full h-full lg:justify-center'>
    {#if loading} 
      <!-- Display a loading spinner if needed -->
    {:else if !id}
      <h1 
        in:fade={{ duration: 1000}} out:fade={{ duration: 250 }}>
        An experimental voting tool built with Earthstar.
      </h1>
    {:else}
      {#if showVotingInterface}
        <div in:fly={{ y: -400, duration: 3000 }} out:fly={{ y: -400, duration: 3000 }}
          class="absolute flex flex-col items-center w-full h-full lg:justify-center">
          <Vote {id} on:success={fetchVotes} {responses} {year} />
        </div>
      {:else if hasVoted}
        <div in:fly={{ y: 1000, duration: 3000 }} out:fly={{ y: 1200, duration: 1200 }}>
          <Results {id} {voteCounts} />
        </div>
      {:else}
        <div in:fly={{ y: 1200, duration: 1200 }} out:fly={{ y: 1200, duration: 1200 }}>
          <h2>
            This is a private vote. You are not allowed to vote with your current identity. Please use the keypair management tool at the bottom right of the screen to load the adequate identity.
          </h2>
        </div>
      {/if}
    {/if}
  </div>
</main>

{#if showIdentityButton}
  <div class="flex flex-col">
    <div id="bottomButton" style="bottom: {showIdentity ? `${footerHeight}px` : '0'};">
      <button on:click={toggleIdentity}>Keypair management</button>
    </div>
    {#if showIdentity}
      <div id="IdentityFooter" in:fly={{ y: 300, duration: 900 }} out:fly={{ y: 300, duration: 900 }}>
        <Identity />
      </div>
    {/if}
  </div>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  #bottomButton {
    position: fixed;
    display: flex;
    flex-direction: column;
    right: 0;
    z-index: 100;
    margin: 1rem;
    transition: all 0.5s ease-in-out;
  }
  #bottomButton button {
    margin: 0.25rem 0;
  }
  #IdentityFooter {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100vw;
  }
</style>
