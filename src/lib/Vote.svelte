<script>
  import * as Earthstar from "earthstar";
  import { getSHA256Hash } from "boring-webcrypto-sha256";
  import settings, {
    replica,
    generateID,
    submissionSuccess,
  } from "../store.js";

  import { createEventDispatcher } from "svelte";

  export let id;

  let dispatch = createEventDispatcher();

  let result, voteResult;
  let authorKeypair;
  let anon;
  let timestamp;

  async function submitVote(decision) {
    // Handle the vote submission to earthstar
    timestamp = new Date().getTime();
    console.log('timestamp', timestamp);

    // for valid path, hash(sha256) the id
    const hash = await getSHA256Hash(id);
    console.log('hash', hash);

    // Question ID
    let docPath = '/' + hash + '/' + timestamp;

    // Vote as doc text
    let docText = decision;

    // Create a new document object
    let thisDoc = {
      path: docPath,
      text: docText,
    };

    // Create a new identity to protect voters privacy
    anon = await generateID("anon");
    console.log('anon', anon);
    // Set the document to the earthstar replica
    if (!(anon instanceof Earthstar.ValidationError)) {
      voteResult = await replica.set(anon, thisDoc);
      console.log('result', voteResult)
      // Check if voting suceeded and update store the voters identity
      if (voteResult.kind === "success") {
        // Reuse thisDoc object but change text by 'Voted' and path by '/id/timestamp/voter'
        thisDoc.text = "Voted";
        thisDoc.path = '/' + hash + '/' + timestamp + '/voter';


        // Set the document to the earthstar replica
        result = await replica.set(authorKeypair, thisDoc);
        console.log('voted___result', result)
        submissionSuccess.set(true);
      } else {
        submissionSuccess.set(false);
      }
      if (Earthstar.isErr(result)) {
        console.error(result);
      }
      dispatch("success");
      return result;
    }
  }

  $: {
    if (settings.author) {
      authorKeypair = settings.author;
    }
  }
</script>
<h1>
  {@html id}
</h1>
<div class="flex">
  <button on:click={() => submitVote("yes")}>yes 👍</button>
  <button on:click={() => submitVote("no")}>no 👎</button>
</div>

<style>
  h1 {
    text-align: center;
  }
  button {
    background-color: #1a1a1a;
    margin-top: 1rem;
    padding-top: 1rem;
    font-size: 1.25rem;
  }
  button:first-child {
    margin-right: 1rem;
  }
</style>
