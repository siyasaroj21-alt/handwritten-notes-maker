import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Note {
    id: bigint;
    title: string;
    content: string;
    fontStyle: string;
    penColor: string;
    mode: string;
    createdAt: Time;
    updatedAt: Time;
    paperBackground: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNote(title: string, content: string, mode: string, fontStyle: string, penColor: string, paperBackground: string): Promise<bigint>;
    deleteNote(noteId: bigint): Promise<void>;
    getAllNotes(): Promise<Array<Note>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNote(noteId: bigint): Promise<Note | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateNote(noteId: bigint, title: string, content: string, mode: string, fontStyle: string, penColor: string, paperBackground: string): Promise<void>;
}
