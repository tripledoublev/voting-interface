<script>
    export let id;
    export let voteCounts = {};
</script>
<div class="m-4">
    <h1>{@html id}</h1>
    <h2>Results</h2>
    <div class="flex flex-col sm:flex-row ml-5">
        {#each Object.entries(voteCounts) as [response, count]}
            <div class="results flex flex-col">
                <span class="txt">{count}</span> {response}
            </div>
        {/each}
    </div>
</div>