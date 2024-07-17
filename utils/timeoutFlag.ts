const timeoutFlag = () => {
	let flag = false;
	return {
		flagged: () => flag,
		flag: () => {
			flag = true;
			setTimeout(() => {
				flag = false;
			});
		},
	};
};

export default timeoutFlag;
