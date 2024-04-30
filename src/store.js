import * as Earthstar from "earthstar";
import { ReplicaDriverWeb } from "earthstar/browser";
import { writable } from "svelte/store";

export const submissionSuccess = writable(false);
export const submissionError = writable(false);

// Create a new instance of the SharedSettings class.
const settings = new Earthstar.SharedSettings();

// Store your author keypair in the settings object.
const shareKeypair = {
  address: import.meta.env.VITE_ADDRESS,
  secret: import.meta.env.VITE_SECRET,
};

settings.addShare(shareKeypair.address);
settings.addSecret(shareKeypair.address, shareKeypair.secret);

// Use shareAddress and secret to create Replica
export const replica = new Earthstar.Replica({
  // @ts-ignore
  driver: new ReplicaDriverWeb(shareKeypair.address),
  // @ts-ignore
  shareSecret: shareKeypair.secret,
});

// Function to generate a 4 char pseudo-random ID
function RandomId() {
  let result = "";
  let alphaCharacter = "abcdefghijklmnopqrstuvwxyz";
  let alphaLength = alphaCharacter.length;
  let allCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let allLength = allCharacters.length;
  result += alphaCharacter.charAt(Math.floor(Math.random() * alphaLength));
  for (let i = 0; i < 3; i++) {
    result += allCharacters.charAt(Math.floor(Math.random() * allLength));
  }
  return result;
}

// Create a new author keypair from the alias.
export async function generateID(r) {
  let value;

  if (r == "r") {
    value = RandomId();
  } else {
    value = r;
  }

  let identityKeypair = await Earthstar.Crypto.generateAuthorKeypair(value);
  //@ts-ignore
  return identityKeypair;
}

export default settings;