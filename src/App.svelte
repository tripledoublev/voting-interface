<script>
  import * as Earthstar from "earthstar";

  import { onMount, tick } from "svelte";
  import { fly } from "svelte/transition";
  import { getSHA256Hash } from "boring-webcrypto-sha256";
  import settings, { generateID, submissionSuccess, replica } from "./store";
  import { getUrlParam } from "./lib/utils.js";

  import Vote from "./lib/Vote.svelte";
  import Identity from "./lib/Identity.svelte";

  let showIdentity = false;
  let showVotingInterface = false;
  let hasVoted = false;

  let id, positiveVotes, negativeVotes, voters;

  let cache = new Earthstar.ReplicaCache(replica);

  let footerHeight = 0;

  async function toggleIdentity() {
    showIdentity = !showIdentity;

    // Wait for the DOM to update
    await tick();

    // Update the footer height
    const footer = document.getElementById("IdentityFooter");
    footerHeight = footer ? footer.clientHeight : 0;
  }

  function checkIfUserVoted(newKeypair) {
    if (voters && newKeypair.address) {
      hasVoted = voters.some((doc) => doc.author === newKeypair.address);
    }
  }

  onMount(async () => {
    id = getUrlParam("id");
    console.log(id);

    settings.onAuthorChanged(checkIfUserVoted);

    if (!settings.author) {

      const generatedId = await generateID("r");
      if (!(generatedId instanceof Earthstar.ValidationError)) {
        settings.author = generatedId;
      }
    }

    if (id) {

      fetchVotes();

      checkIfUserVoted(settings.author);

      showVotingInterface = true;

      cache.onCacheUpdated(fetchVotes);

      const peer = new Earthstar.Peer();
      peer.addReplica(replica);
      peer.sync(import.meta.env.VITE_SERVER_ADDRESS, true);
      settings.addServer(import.meta.env.VITE_SERVER_ADDRESS);
    }
  });

  async function fetchVotes() {

    let hash = await getSHA256Hash(id);

    const documents = await cache.queryDocs({
      filter: { pathStartsWith: "/" + hash },
    });

    if (documents.length >= 0) {
      // Check for document text that contains 'Voted'
      voters = documents.filter((doc) => doc.text.includes("Voted"));

      // Check for the number of positive votes
      positiveVotes = documents.filter((doc) => doc.text === "yes");

      // Check for the number of negative votes
      negativeVotes = documents.filter((doc) => doc.text === "no");

      checkIfUserVoted(settings.author);
    }

  }

  $: if ($submissionSuccess === true || hasVoted === true) {
    showVotingInterface = false;
  }


</script>

<main>
  <div>
    {#if !id}
      <h1>
        An experimental voting tool built with Earthstar.
      </h1>
    {:else}
      {#if showVotingInterface}
        <div
          in:fly={{ y: -400, duration: 1300 }}
          out:fly={{ y: -400, duration: 1300 }}
          class="absolute flex flex-col items-center w-full h-full justify-center"
        >
          <Vote {id} on:success={fetchVotes}/>
        </div>
      {:else}
        <div
          in:fly={{ y: 1200, duration: 1200 }}
          out:fly={{ y: 1200, duration: 1200 }}
          class="absolute"
        >
            <div class="m-4">
              <h1>{@html id}</h1>
              <h2>Results</h2>
              <div class="flex flex-row ml-5">
                <div class='results'>
                  {positiveVotes.length} 👍
                </div>
                <div class='results'> 
                  {negativeVotes.length} 👎
                </div>
              </div>
            </div>
        </div>
      {/if}
    {/if}
  </div>
</main>
<!-- Identity management 
{#if showVotingInterface}
  <div class="flex flex-col">
    <div
      id="bottomButton"
      style="bottom: {showIdentity ? `${footerHeight}px` : '0'};"
    >
      <button on:click={toggleIdentity}>keypair management</button>
    </div>

    {#if showIdentity}
      <div
        id="IdentityFooter"
        in:fly={{ y: 300, duration: 900 }}
        out:fly={{ y: 300, duration: 900 }}
      >
        <Identity />
      </div>
    {/if}
  </div>
{/if}
-->

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  .results {
    font-size: 2rem;
    border-radius: 0.5rem;
    padding: 1rem;
    border: 1px solid #9900FC;
    text-align: center;
    margin: 1rem;
    width: fit-content;
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
  blockquote {
    font-size: 1.5rem;
  }
</style>
