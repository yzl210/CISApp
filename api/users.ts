import {UserRole} from "./API";

export function canEditMachineInfo(role: UserRole) {
    return role.role === "admin";
}

export function canEditTags(role: UserRole) {
    return role.role === "admin";
}