
export type ChatMessage = {
	id: string;
	roomId: string;
	content: string;
	timestamp: Date;
	username: string;
	senderId: string;
}
