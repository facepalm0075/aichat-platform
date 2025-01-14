import { messagesType } from "../components/StreamHandler";

export type aiResponseType = {
	message: string;
	status: number;
	userId: string;
};

export const fetchStream = (
	input: string,
	callback: (response: messagesType, stopper: () => void) => void
) => {
	let error: string | null = null;
	let isConnected = false;
	let isStoped = false;
	let streamReader: null | (ReadableStreamDefaultReader<any> | undefined) = null;

	const stoper = () => {
		isStoped = true;
		isConnected = false;
		if (streamReader) {
			streamReader.cancel();
		}
	};

	const handleResponse = (item: aiResponseType[]) => {
		item.forEach((i) => {
			callback({ message: i, error, isConnected }, stoper);
		});
	};

	const fetchSSE = async () => {
		const reqBody = { p: input };
		try {
			const response = await fetch("https://aichat-server.pouyaprogramming.ir/queue", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(reqBody),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			isConnected = true;

			const reader = response.body?.getReader();
			streamReader = reader;
			const decoder = new TextDecoder("utf-8");

			while (true) {
				const { done, value } = await reader!.read();
				if (done || isStoped) break;

				const stringValue = decoder.decode(value, { stream: true });
				const objectsArray = stringValue
					.split("||n||")
					.filter((line) => line.trim() !== "")
					.map((line) => {
						try {
							return JSON.parse(line);
						} catch (error) {
							console.error("Failed to parse JSON:", line);
							return null;
						}
					})
					.filter((obj) => obj !== null);

				handleResponse(objectsArray);
			}
		} catch (err) {
			console.error("SSE fetch error:", err);
			const errorMessage = "Failed to connect to the SSE server.";
			error = errorMessage;
			isConnected = false;
		}
	};

	fetchSSE();
	return { stoper };
};
