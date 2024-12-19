# Constellate: Voting interface

This is **Constellate**, a Svelte app that uses Earthstar to quickly and easily create anonymous voting events.

---  

## Customizing parameters

Example URL format using all parameters: 
`{url}/?1=maybe&2=yes&3=no&r=members&q=do you understand the process?`

### Question
The question is entered with the `q` URL param (question).
The `q` can be the question itself or any unique identifier if you prefer the question to remain secret.

### Responses
Response choices can be defined using single-digit integers `[0-9]`. This option allows you to provide voters with choices beyond 'yes' or 'no.' Each integer corresponds to a unique response key.
This option is to be used if you want to give choices to voters beyond 'yes' or 'no'.

### Restricted voting
For advanced voting, it is possible to restrict voters to a list of predefined keypairs.
A `json` file containing the identity of the allowed voters needs to be added to the `public` folder.
Once this file is available, it can be used with the `r` param, followed by the name of the file (without its json extension).

### Unrestricted voting
For basic voting, when the `r` param is not used, Earthstar ID is stored in browser settings and prevents users from casting multiple votes from the same browser.

When votes are not restricted to specific keypairs, users can still open private windows, other browsers, or any other strategy for casting multiple votes.
This is why this voting interface should not be used in unrestricted mode for important votes. The unrestricted option is meant to offer a quick and fun interface to gather feedback on specific questions.

## Loading vote data from a config file
You can load vote data from a config file by using the `v` URL param. The config file should be placed in the `public/configs` folder. The config file should be a JSON file with the following structure:

```json
{
    "id": "Here is the vote's question",
    "year": "Optional year field for votes in the case of our timeline",
    "1": "First response.",
    "2": "Second choice response.",
    "3": "Third response.",
    "4": "And so on...",
}
```

## Running it locally
You can run this voting interface locally.
After cloning this repository, once in the project's folder, you can follow these steps to install and run this web app:
```
npm install
npm run dev
```

