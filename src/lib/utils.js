export const getUrlParam = (key) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      return url.searchParams.get(key);
    }
    return null;
  };

  const getResponse = (key) => {
    const response = getUrlParam(key);
    console.log('1,', {response})
    if (response && key.match(/[0-9]/)) {
      console.log('2,', {response})
      return response;
    }
    return null; 
  };

  export const getAllResponses = () => {
    const responses = [];
    for (let i = 0; i <= 9; i++) {
      const response = getResponse(i.toString());
      if (response !== null) {
        responses.push(response);
      }
    }
    console.log({responses})
    return responses;
  };