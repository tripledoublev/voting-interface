<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let fileinput;

  // read identity file as json
  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  }
  // select file and set keypair
  async function onFileSelected(e) {
    // from the file selected
    let fileAttachment = e.target.files[0];
    let fileReady = await readFileAsync(fileAttachment);
    try {
      let keypairObject = JSON.parse(fileReady);
      dispatch("newIdentity", keypairObject); // Dispatch the new identity.
    } catch (error) {
      dispatch("error");
    }
  }
</script>

<input
  style="display:none"
  type="file"
  accept=".json, .txt"
  on:change={(e) => onFileSelected(e)}
  bind:this={fileinput}
/>
<button
  on:click={() => {
    fileinput.click();
  }}
>
  upload keypair
</button>

<style>
  button {
    text-align: center;
    white-space: nowrap;
  }
</style>