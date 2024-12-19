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


### Restricted voting
For advanced voting, it is possible to restrict voters to a list of predefined keypairs.
To enable restricted voting, create a `json` file containing the identity of the allowed voters and place it in the `public` folder. This file can then be referenced using the `r` param, followed by the name of the file (excluding the `.json` extension).


### Unrestricted voting
For basic voting, when the `r` param is not used, Earthstar ID is stored in browser settings and prevents users from casting multiple votes from the same browser.

When votes are unrestricted, users can open private windows, use other browsers, or employ other methods to cast multiple votes.  
For this reason, unrestricted voting should only be used for informal or low-stakes voting. It offers a quick and fun way to gather feedback on specific questions but does not provide any restrictions on the amount of votes users can cast.


---

## Loading vote data from a config file
To load vote data from a config file, use the `v` URL param. Place the config file in the `public/configs` folder. The file must be a JSON file structured as follows:


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
You can run **Constellate** locally to test or customize its functionality.  
After cloning this repository, navigate to the project folder and run the following commands to install dependencies and start the development server:

```
npm install
npm run dev
```

