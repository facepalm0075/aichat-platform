"use client";

import { useRef, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import StreamHandler from "./StreamHandler";
import { IoSend } from "react-icons/io5";
import { FaCircleStop } from "react-icons/fa6";

type aiResponseType = {
	message: string;
	status: number;
	userId: string;
};

export type stages = "ready" | "loading" | "streaming";

export default function Chat() {
	const [prompt, setPrompt] = useState("hi");
	const [input, setInput] = useState("");
	const [click, setClick] = useState(0);
	const [stage, setStage] = useState<stages>("ready");
	const streamHandlerRef = useRef<{ stopStream: () => void } | null>(null);

	const handleStop = () => {
		streamHandlerRef.current?.stopStream();
	};

	const stageChanger = (state: stages) => {
		setStage(state);
	};

	const handlePromptChange = () => {
		handleStop();
		if (input !== "") {
			stageChanger("loading");
			setClick(click + 1);
			setPrompt(input);
			setInput("");
		}
	};
	return (
		<>
			<div className="fixed w-3/4 bg-neutral-700 rounded-2xl overflow-hidden bottom-8 left-2/4 -translate-x-2/4 border border-neutral-400">
				<div className="flex">
					<div className="w-full">
						<input
							className="w-full bg-transparent outline-none px-3 py-2 text-white"
							type="text"
							onChange={(e) => {
								setInput(e.currentTarget.value);
							}}
							value={input}
							placeholder="Enter your prompt..."
							onKeyDown={(e) => {
								if (e.keyCode === 13) {
									handlePromptChange();
								}
							}}
						/>
					</div>
					<div className="min-w-10 max-w-10 w-10">
						<div
							className="bg-neutral-400 text-black w-full h-full flex justify-center items-center cursor-pointer"
							onClick={handlePromptChange}
						>
							<span className="text-xl">
								{stage === "ready" && <IoSend />}
								{stage === "loading" && <div className="loader"></div>}
								{stage === "streaming" && <FaCircleStop />}
							</span>
						</div>
					</div>
				</div>
			</div>

			<StreamHandler click={click} input={prompt} callBack={stageChanger} ref={streamHandlerRef} />
		</>
	);
}
