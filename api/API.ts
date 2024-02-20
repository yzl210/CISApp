export function getMachine(id: string): Machine {
    return {
        id: id,
        description: "Description of this machine",
        image: "https://th.bing.com/th/id/R.0f7c628876d5cd7e054b2cdd7c075ede?rik=VvvkRND%2fRw5Caw&pid=ImgRaw&r=0",
        name: randomMachine(),
        tasks: [
            {id: "1", content: randomTask(), done: randomBool()},
            {id: "2", content: randomTask(), done: randomBool()},
            {id: "3", content: randomTask(), done: randomBool()},
            {id: "4", content: randomTask(), done: randomBool()},
            {id: "5", content: randomTask(), done: randomBool()},
            {id: "6", content: randomTask(), done: randomBool()},
        ],
        logs: []
    };
}

function randomMachine() {
    return Array("Cutting Machine", "Drilling Machine", "Welding Machine", "Bending Machine", "Punching Machine")[Math.floor(Math.random() * 5)];
}

function randomBool(): boolean {
    return Math.random() > 0.5;
}

function randomTask() {
    return ["Fix the motor", "Change the blade", "Clean the dust", "Check the oil", "Replace the belt", "Check the voltage", "Check the current"][Math.floor(Math.random() * 7)];
}

function randomStr(): string {
    return Math.random().toString(36).substring(7);
}

export function getMaintenanceNeeded(): Machine[] {
    return Array.from({length: 10}, (_, i) => getMachine(i.toString()));
}

export function getPins(): Machine[] {
    return Array.from({length: 2}, (_, i) => getMachine(i.toString()));
}

export interface Machine {
    id: string;
    name: string;
    description: string;
    notes?: string;
    image: string;
    tasks: Task[];
    logs: Log[];
}

export interface Task {
    id: string;
    content: string;
    done: boolean;
}

export interface Log {
    id: string;
    author: string;
    time: bigint;
    title: string;
    content: string;
}