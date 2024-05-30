import {UserRole} from "./API";

export function canEditMachineInfo(role: UserRole) {
    return role.role === "admin";
}

export function canEditTags(role: UserRole) {
    return role.role === "admin";
}


export function canEditTasks(role: UserRole) {
    return role.role === "admin";
}


export function canCreateMachine(role: UserRole) {
    return role.role === "admin";
}

export function canEditLogs(role: UserRole) {
    return role.role === "admin";
}