export const sendSearchData = async (expData: Array<any>) => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expData),
  };

  console.log(expData);
  const resp = await fetch("http://localhost:4000/api/trials", requestOptions);
  console.log("Trials API Response:", resp.status, resp.statusText);
};

export const sendParticipantData = async (userData: any) => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  console.log(userData);

  const resp = await fetch(
    "http://localhost:4000/api/participants",
    requestOptions,
  );
  console.log("Participant API Response:", resp.status, resp.statusText);
};

export const sendLikertData = async (userData: any) => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  console.log(userData);

  const resp = await fetch("http://localhost:4000/api/surveys", requestOptions);
  console.log("Survey API Response:", resp.status, resp.statusText);
};
