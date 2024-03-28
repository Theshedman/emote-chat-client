
let chatServerWebsocketBaseURL
const chatServerHttpBaseURL = import.meta.env.VITE_CHAT_API_BASE_URL;

if (chatServerHttpBaseURL) {
	if (chatServerHttpBaseURL.startsWith("http://")) {
		chatServerWebsocketBaseURL = chatServerHttpBaseURL.substring(7)
	} else if (chatServerHttpBaseURL.startsWith('https://')) {
		chatServerWebsocketBaseURL = chatServerHttpBaseURL.substring(8)
	}
}

export {
	chatServerHttpBaseURL,
	chatServerWebsocketBaseURL
};
