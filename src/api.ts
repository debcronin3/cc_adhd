export const sendTrialData = async (expData: Array<any>) => {
  const requestOptions: RequestInit = {
    method: "POST",
    // [NOTE] Only for initial testing
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expData),
  };

  await fetch("http://localhost:4000/api/trials", requestOptions);
};

export const sendParticipantData = async (userData: any) => {
  const requestOptions: RequestInit = {
    method: "POST",
    // [NOTE] Only for initial testing
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  await fetch("http://localhost:4000/api/participants", requestOptions);
};
