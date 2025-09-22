export const sendSearchData = async (expData: Array<any>) => {
	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(expData),
	};

	// [warning] Delete for deployment
	console.log(expData);
	const resp = await fetch(
		"https://ccapi.dacronin.com/api/trials",
		requestOptions,
	);
	// [warning] Delete for deployment
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

	// [warning] Delete for deployment
	console.log(userData);

	const resp = await fetch(
		"https://ccapi.dacronin.com/api/participants",
		requestOptions,
	);
	// [warning] Delete for deployment
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

	// [warning] Delete for deployment
	console.log(userData);

	const resp = await fetch(
		"https://ccapi.dacronin.com/api/surveys",
		requestOptions,
	);
	// [warning] Delete for deployment
	console.log("Survey API Response:", resp.status, resp.statusText);
};
