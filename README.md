# Voting Interface

This is a svelte app that uses Earthstar to quickly create and share a voting interface.

## Customizing parameters

example url format using all parameters: 
`{url}/?1=maybe&2=yes&3=no&r=members&q=do you understand the process?`

### Question
The question is entered with the `q` URL param (question).
The `q` can be the question itself or any unique identifier if you prefer the question to remain secret.

## Other params include response choices and restricted voting for a list of predefined Identities.

### Responses
Response choices can be defined by using single-digit integers. [0-9]
This option is to be used if you want to give choices to voters beyond 'yes' or 'no'.

### Restricted voting
For advanced voting, it is possible to restrict voters to a list of predefined keypairs.
A containing the identity of the allowed voters need to be added to the `public` folder.
Once this file is available, it can be used with the `r` param, followed by the name of the file (without its json extension).

### Unrestricted voting
For basic voting, when the `r` param is not used, Earthstar ID is stored in browser settings and prevents users from casting multiple votes from the same browser.

When votes are not restricted to specific keypairs, users can still open private windows, other browsers or any other strategy for casting multiple votes.
This is why this voting interface should not be used in unrestricted mode for important votes. The unrestricted option is meant to offer a quick and fun interface to gather feedback on specific questions.

## How does it work?
In all cases, the vote is cast with a throwaway (anonymized) keypair to make sure all votes remain private.
Original keypairs are stored to make sure only one vote is cast per keypair.
In summary, this means that someone could look at the logs and see who voted but not necessarily what they voted for.



## Running it locally
You can run this voting interface locally.
After cloning this repository, once in the project's folder, you can follow these steps to install and run this web app:
```
npm install
npm run dev
```

