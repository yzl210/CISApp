export function getMachine(id: string): Machine {
    return {
        id: id,
        description: "Description: " + randomStr(),
        image: "https://th.bing.com/th/id/R.0f7c628876d5cd7e054b2cdd7c075ede?rik=VvvkRND%2fRw5Caw&pid=ImgRaw&r=0",
        name: randomStr(),
        tasks: [
            {id: "1", content: randomStr(), done: randomBool()},
            {id: "2", content: randomStr(), done: randomBool()},
            {id: "3", content: randomStr(), done: randomBool()},
            {id: "4", content: randomStr(), done: randomBool()},
            {id: "5", content: randomStr(), done: randomBool()},
            {id: "6", content: randomStr(), done: randomBool()},
            {id: "7", content: "This is a task with very long long content", done: randomBool()},
        ],
        logs: []
    };
}

function randomBool(): boolean {
    return Math.random() > 0.5;
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