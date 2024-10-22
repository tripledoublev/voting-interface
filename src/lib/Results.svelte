<script>
    export let id;
    export let voteCounts = {}; // Only voteCounts will be passed in

    // Create a reactive variable for votedEntries
    let votedEntries = [];

    // Reactive statement to extract entries containing the word "Voted"
    $: votedEntries = Object.entries(voteCounts).filter(([response, count]) => response === 'Voted');

    // Remove "Voted" entries from voteCounts to display actual votes
    $: filteredVoteCounts = Object.entries(voteCounts)
        .filter(([response, count]) => response !== 'Voted')
        .sort((a, b) => b[1] - a[1]);
</script>

<div class="m-4">
    <h1>{@html id}</h1>
    <h2>Results</h2>
    <div class="flex flex-col sm:flex-row ml-5">
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
</div>

<style>
    .results {
        border: 1px dashed #f3f3f3;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
    }
    .txt {
        font-weight: bolder;
        text-decoration: underline;
    }
    h2 {
        padding-bottom: 0;
    }
</style>
