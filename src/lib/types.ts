export type ChatRoomJoinResponse = {
	id: string;
	messages: {
		id: string;
		text: string;
		isRead: boolean;
		readTime: Date | null;
		profile: {
			id: string;
			fullName: string;
			dob: Date;
			isOnline: boolean;
		};
	}[];
	group: {
		id: string;
		name: string;
		isAdminOnly: boolean;
		admin: {
			id: string;
			fullName: string;
			dob: Date;
			isOnline: boolean;
		};
	} | null;
} | null;
