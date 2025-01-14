"use client";
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/app/styles.css";

type props = {
	markdown: string;
};

const MarkdownRenderer = ({ markdown }: props) => {
	const preRef = useRef<any>([]);
	const handleCopy = (preElement: any) => {
		const code = preElement.querySelector("code").innerText;
		navigator.clipboard
			.writeText(code)
			.then(() => alert("Code copied to clipboard!"))
			.catch((err) => console.error("Failed to copy:", err));
	};

	useEffect(() => {}, [markdown]);
	return (
		<div className="markdown-container flex-1">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					pre: ({ node, children }) => <pre ref={(el) => preRef.current.push(el)}>{children}</pre>,
				}}
			>
				{markdown}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
