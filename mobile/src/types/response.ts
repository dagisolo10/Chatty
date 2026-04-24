import { Message, Room, User } from "./model";

export interface MessageResponse {
    data: Message;
    error?: string;
    success: boolean;
}

export interface UserResponse {
    data: User;
    error?: string;
    success: boolean;
}

export interface RoomsResponse {
    data: Room[];
    error?: string;
    success: boolean;
}
