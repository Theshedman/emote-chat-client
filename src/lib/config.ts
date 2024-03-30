const chatServerHttpBaseURL = import.meta.env.VITE_CHAT_API_BASE_URL;

let websocketProtocol = '';
let chatServerWebsocketBaseURL = '';

if (chatServerHttpBaseURL) {
	if (chatServerHttpBaseURL.startsWith("http://")) {
		websocketProtocol = 'ws';
		chatServerWebsocketBaseURL = chatServerHttpBaseURL.substring(7)
	} else if (chatServerHttpBaseURL.startsWith('https://')) {
		websocketProtocol = 'wss';
		chatServerWebsocketBaseURL = chatServerHttpBaseURL.substring(8)
	}
}

export {
	websocketProtocol,
	chatServerHttpBaseURL,
	chatServerWebsocketBaseURL
};
