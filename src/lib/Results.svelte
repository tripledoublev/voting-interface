<script>
    import ExportCSV from './ExportCSV.svelte';
    import { getSHA256Hash } from 'boring-webcrypto-sha256';

    export let id;
    export let voteCounts = {}; // Only voteCounts will be passed in
    export let year;

    // Create a reactive variable for votedEntries
    let votedEntries = [];

    // Reactive statement to extract entries containing the word "Voted"
    $: votedEntries = Object.entries(voteCounts).filter(([response, count]) => response === 'Voted');

    // Remove "Voted" entries from voteCounts to display actual votes
    $: filteredVoteCounts = Object.entries(voteCounts)
        .filter(([response, count]) => response !== 'Voted' && response.trim() !== '')
        .sort((a, b) => b[1] - a[1]);

    // Generate a unique hash for the question (id)
    let questionHash = '';
    $: (async () => {
        questionHash = await getSHA256Hash(id);
    })();

</script>
<div class="m-4">
    <h2>
        Thanks for voting! Your vote has been recorded.
    </h2>

    {#if year}
        <h1>{year}</h1>
    {/if}
     
    <h1>{@html id}</h1>

    <h2>Results</h2>
    <div class="flex flex-col lg:flex-row ml-5 max-w-5xl">
        {#each filteredVoteCounts as [response, count]}
            <div class="results flex flex-col m-5">
                <span class="txt">{count}</span> {response}
            </div>
        {/each}
    </div>

    <!-- Add another section for Voted Entries -->
    {#if votedEntries.length > 0}
      <div>
          <h2>Participants</h2>
          <div class="flex flex-col sm:flex-row ml-5">
              <div class="results flex flex-col m-5">
                  <span class="txt">{votedEntries[0][1]}</span> Voted
              </div>
          </div>
      </div>
    {/if}

    <ExportCSV data={voteCounts} filename="vote_results.csv" />

    <!-- Display the unique URL for accessing the results -->
    <div>
        <h2>Results unique ID</h2>
        <p>{questionHash}</p>
    </div>
</div>

<style>
    .results {
        border: 1px dashed #f3f3f3;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1.25rem;
    }
    .txt {
        font-weight: bolder;
        text-decoration: underline;
    }
    h1 {
        font-size: 2rem;
    }
    h2 {
        font-size: 1.5rem;
    }
    
</style>
