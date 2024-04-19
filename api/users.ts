import {UserRole} from "./API";

export function canEditMachine(role: UserRole) {
    return role.role === "admin";
}