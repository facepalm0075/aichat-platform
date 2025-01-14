import React from "react";

function NavBar() {
	return (
		<div className="grid grid-cols-2 px-3 py-4 bg-neutral-900">
			<div className="">
				<span className="text-white font-bold">Ai Chatbot</span>
			</div>
			<div className="flex justify-end">
				<span className="text-sm">
					<strong>Powered</strong> by llama3.2
				</span>
			</div>
		</div>
	);
}

export default NavBar;
