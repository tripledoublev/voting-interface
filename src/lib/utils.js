export const getUrlParam = (key) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      return url.searchParams.get(key);
    }
    return null;
  };

  const getResponse = (key) => {
    const response = getUrlParam(key);
    if (response && key.match(/^\d+$/)) { 
      return response;
    }
    return null;
  };

  export const getAllChoices = () => {
    const choices = [];
    for (let i = 0; i <= 12; i++) {
      const response = getResponse(i.toString());
      if (response !== null) {
        choices.push(response);
      }
    }
    return choices;
  };

  export const fetchAllowedVoters = async (allowedVoters) => {
    if (allowedVoters) {
        try {
            const response = await fetch(`${allowedVoters}.json`);
            if (!response.ok) {
                console.error('Failed to fetch voter list:', response.statusText);
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching voter list:', error);
            return null;
        }
    }
    return null;
};