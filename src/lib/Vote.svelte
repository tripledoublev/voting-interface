<script>
  import * as Earthstar from "earthstar";
  import { getSHA256Hash } from "boring-webcrypto-sha256";
  import settings, {
    replica,
    generateID,
    submissionSuccess,
  } from "../store.js";
  import { createEventDispatcher, onMount } from "svelte";

  export let id;

  let dispatch = createEventDispatcher();

  let result, voteResult;
  let authorKeypair;
  let anon;
  let uniqueIdentifier;

  export let responses = [];
  export let year;

  let selectedResponses = new Set(); // Store selected responses
  let isDisabled = false;
  let allVotesSuccess = true;

  // Function to toggle the selection of responses
  function toggleSelection(response) {
    if (selectedResponses.has(response)) {
      selectedResponses.delete(response);
    } else {
      selectedResponses.add(response);
    }
  }

  // Function to submit the selected responses
  async function submitVote() {
    // Disable the button to prevent double submission
    isDisabled = true;

    // Create a new identity to protect voters' privacy
    anon = await generateID("anon");

    // for valid path, hash(sha256) the id
    const hash = await getSHA256Hash(id);
    console.log('hash', hash);

    // Submit each selected response
    for (let decision of selectedResponses) {
      // Generate a unique timestamp or identifier for each vote
      uniqueIdentifier = Math.round(new Date().getTime() + Math.random());
      
      // Question ID
      let docPath = '/' + hash + '/' + uniqueIdentifier;

      // Vote as doc text
      let docText = decision;

      // Create a new document object
      let thisDoc = {
        path: docPath,
        text: docText,
      };

      // Set the document to the earthstar replica
      if (!(anon instanceof Earthstar.ValidationError)) {
        voteResult = await replica.set(anon, thisDoc);

        if (voteResult.kind !== "success") {
          allVotesSuccess = false; // Mark failure if any vote submission fails
        }
      }
    }

    // After all votes have been submitted, write the "Voted" message
    if (allVotesSuccess) {
      let votedDocPath = '/' + hash + '/voter/' + Math.round(new Date().getTime() + Math.random());
      let votedDoc = {
        path: votedDocPath,
        text: "Voted",
      };

      // Set the "Voted" document
      result = await replica.set(authorKeypair, votedDoc);

      if (result.kind === "success") {
        submissionSuccess.set(true);
      } else {
        submissionSuccess.set(false);
      }

      if (Earthstar.isErr(result)) {
        console.error(result);
      }
    } else {
      submissionSuccess.set(false); // If any vote failed, set to false
    }

    dispatch("success");
    return result;
  }

  $: {
    if (settings.author) {
      authorKeypair = settings.author;
    }
  }
</script>
<div class="flex flex-col">
  {#if year}
    <h1>
      {year}
    </h1>
  {/if}
  <h1  class="mt-12">
    {@html id}
  </h1>
  <div class="flex flex-row flex-wrap max-w-lg">
    {#if responses.length > 0}
      {#each responses as response}
        <div class="m-8">
          <input type="checkbox" id={response} on:change={() => toggleSelection(response)} />
          <label for={response}>{response}</label>
        </div>
      {/each}
    {:else}
      <div>
        <input type="checkbox" id="yes" on:change={() => toggleSelection("yes")} />
        <label for="yes">yes 👍</label>
      </div>
      <div>
        <input type="checkbox" id="no" on:change={() => toggleSelection("no")} />
        <label for="no">no 👎</label>
      </div>
    {/if}
  </div>
  <button class="m-4" on:click={submitVote} disabled={isDisabled}>Submit</button>
  {#if !allVotesSuccess}
    <p class="error">There was an error and your vote was not submitted. Please try again.</p>
    <p>
      Here is the error message: {result.kind}
    </p>
  {/if}
</div>


<style>
  h1 {
    text-align: left;
  }
  button {
    background-color: #1a1a1a;
    margin-top: 1rem;
    padding: 1rem;
    font-size: 1.25rem;
  }
  div {
    margin-top: 0.5rem;
  }
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  button {
    width: fit-content;
  }
  label {
    font-size: 1.25rem;
  }
</style>
