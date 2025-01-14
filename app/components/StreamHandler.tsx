"use client";
import React, {
	ReactNode,
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { aiResponseType, fetchStream } from "../utils/fetchStream";
import { stages } from "./Chat";

type props = {
	input: string;
	click: number;
	callBack: (stage: stages) => void;
};

export type messagesType = {
	message: aiResponseType;
	error: string | null;
	isConnected: boolean;
};

type conversations = {
	question: string;
	answer: string | ReactNode;
	isText: Boolean;
}[];

let streamStopper: (() => void) | null = null;

const StreamHandler = forwardRef(function StreamHandler({ input, click, callBack }: props, ref) {
	const [data, setData] = useState<conversations>([]);
	const [update, setupdate] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	const streamStopperCallback = () => {
		if (streamStopper) {
			streamStopper();
			streamStopper = null;
			callBack("ready");
		}
	};

	const doScroll = (num: number = 150, def: boolean = false) => {
		const cur = containerRef.current;
		if (cur) {
			if (def) {
				cur.scrollTop = cur.scrollHeight;
				return;
			}
			if (cur.scrollTop + cur.offsetHeight + num >= cur.scrollHeight)
				cur.scrollTop = cur.scrollHeight;
		}
	};

	const message = (response: messagesType, stopper: () => void) => {
		if (response.message.status === 203) {
			const temp = data;
			if (temp[click]) {
				temp[click].answer += response.message.message;
			} else {
				temp.push({ question: input, answer: response.message.message, isText: true });
			}
			setData((prev) => temp);
			callBack("streaming");
		} else if (response.message.status === 200) {
			callBack("ready");
		} else if (response.message.status === 500) {
			const temp = data;
			if (temp[click]) {
				temp[click].answer = (
					<>
						<div className="bg-red-600 border p-2 rounded-md bg-opacity-30">
							Queue is full! Please try later.
						</div>
					</>
				);
				temp[click].isText = false;
			} else {
				temp.push({ question: input, answer: response.message.message, isText: false });
			}
			setData((prev) => temp);
			callBack("ready");
		}
		setupdate((prev) => prev + 1);
		doScroll();
	};

	useEffect(() => {
		setData((prev) => [...prev, { question: input, answer: "Generating...", isText: true }]);

		let historied = "";
		data.forEach((item) => {
			historied += "user:" + item.question + "\n" + "Assistant:" + item.answer + "\n\n";
		});
		const streamStopperTemp = fetchStream(historied + `user:${input}\nAssistant:`, message);
		streamStopper = streamStopperTemp.stoper;
	}, [click]);

	useEffect(() => {
		doScroll(400, true);
	}, [data]);

	useImperativeHandle(ref, () => ({
		stopStream: streamStopperCallback,
	}));

	return (
		<div ref={containerRef} className="sh-container2">
			<div className="sh-container">
				{data.map((item, index) => {
					return (
						<div key={index}>
							<div className="flex justify-end">
								<span className="py-3 px-5 bg-neutral-700 rounded-2xl my-7">{item.question}</span>
							</div>
							<div className="flex gap-2 w-full">
								<div>
									<img
										alt="ollama-image"
										src="/ollama.png"
										className="min-w-8 max-w-8 rounded-full"
										width={32}
										height={32}
									/>
								</div>
								{item.isText ? (
									<MarkdownRenderer markdown={item.answer as string} />
								) : (
									<>{item.answer}</>
								)}
							</div>
						</div>
					);
				})}
				<div style={{ height: "100px" }}></div>
			</div>
		</div>
	);
});

export default StreamHandler;
