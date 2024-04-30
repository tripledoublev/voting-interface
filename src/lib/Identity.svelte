<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
  
    import settings, { generateID } from "../store.js";
  
    import UploadId from "./UploadIdentity.svelte";
    import ClipboardSvg from "./UI/ClipboardSVG.svelte";
  
    let value;
    let uploadWarning = false;
    let isClickActive = false;
  
    let svgFillColor = writable("white");
  
    // download identity file as json
    function Download() {
      let element = document.createElement("a");
      let file = new Blob([JSON.stringify(settings.author)], {
        type: "text/plain",
      });
      let filename = settings.author.address + ".json";
      element.href = URL.createObjectURL(file);
      element.download = filename;
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
    }
  
    function handleError() {
      uploadWarning = true;
    }
    $: currentAddress = settings.author.address.slice(0, 22) + "...";
    $: currentSecret = settings.author.secret.slice(0, 25) + "...";
    $: currentAlias = currentAddress.slice(0, 5);
    $: value = currentAlias.slice(1, 5);
  
    onMount(async () => {
      if (!settings.author && !settings.author.address) {
        generateID("r");
      }
    });
  
    function handleNewIdentity(event) {
      let newIdentity = event.detail;
      settings.author = newIdentity;
    }
  
    async function generateNewIdentity() {
      const newKeypair = await generateID("r");
      //@ts-ignore
      settings.author = { ...newKeypair };
    }
  
    function copyToClipboard() {
      navigator.clipboard.writeText(settings.author.address).then(
        () => {
          svgFillColor.set("#9900FC"); // Change color on copy
          isClickActive = true;
          setTimeout(() => {
            svgFillColor.set("white"); // Revert color after 3 seconds
            isClickActive = false;
          }, 3000);
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  </script>
  
  <div class="flex flex-row justify-between w-full bg-black">
    {#if uploadWarning === true}
      <div class="text-left flex-grow">
        <blockquote transition:fly={{ x: 200, duration: 2000 }}>
          <strong>Please upload a valid identity file</strong>
        </blockquote>
      </div>
    {/if}
  
    <div class="flex flex-col lg:flex-row items-end">
      <h3 class="mr-3">Current Keypair</h3>
      <div class="flex flex-row truncate mr-2">
        <b> Address: </b>
        {currentAddress}
        <button on:click={copyToClipboard} class="copy-button"
          >
          <ClipboardSvg fill={$svgFillColor} {isClickActive} />
      </div>
      <div class="flex flex-row truncate">
        <b> Secret: </b>
        {currentSecret}
      </div>
    </div>
    <div class="flex items-end align-left flex-row button-group">
      <button on:click={() => Download()}> download keypair </button>
  
      <button on:click={generateNewIdentity}> generate new keypair </button>
  
      <UploadId on:newIdentity={handleNewIdentity} on:error={handleError} />
    </div>
  </div>
  
  <style>
    h3 {
      font-family: monospace;
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 2rem;
      letter-spacing: 0.025em;
      color: #fefefe;
      white-space: nowrap;
    }
    button {
      white-space: nowrap;
    }
    .button-group * {
      margin-right: 0.5rem;
    }
    .bg-black {
      background-color: var(--black);
      border-top: 1px solid var(--white);
      padding: 1rem;
      overflow-x: auto;
    }
    .copy-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      margin-left: 0.15rem;
      margin-right: 0.5rem;
    }
  </style>