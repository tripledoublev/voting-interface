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

  export const fetchAllowedVoters = async () => {
    const voters = getUrlParam('r');
    if (voters) {
        try {
            const response = await fetch(`${voters}.json`);
            if (!response.ok) {
                console.error('Failed to fetch voter list:', response.statusText);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching voter list:', error);
            return null;
        }
    }
    return null;
};