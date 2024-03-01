import {Tag} from "@tamagui/lucide-icons";

export function getMachine(id: string): Machine {
    return {
        id: id,
        description: "Description of this machine",
        image: "https://th.bing.com/th/id/R.0f7c628876d5cd7e054b2cdd7c075ede?rik=VvvkRND%2fRw5Caw&pid=ImgRaw&r=0",
        name: randomMachine(),
        tasks: [
            {
                id: "1",
                title: randomTask(),
                details: "The details about this task this can be very long.",
                done: randomBool()
            },
            {id: "2", title: randomTask(), done: randomBool()},
            {id: "3", title: randomTask(), done: randomBool()},
            {id: "4", title: randomTask(), done: randomBool()},
            {id: "5", title: randomTask(), done: randomBool()},
            {id: "6", title: randomTask(), done: randomBool()},
        ],
        tags: [
            {
                id: "1",
                name: "Dangerous",
                color: "red",
                description: "This is dangerous"
            }
        ],
        logs: [
            {
                id: "123",
                author: "Test User",
                content: "Fixed something, lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod temporconsectetur adipiscing elit sed do eiusmod temporlorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
                title: "A maintenance log",
                time: Date.now(),
                changes: [{task: "1", status: true}]
            },
        ]
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
    return Array.from({length: 25}, (_, i) => getMachine(i.toString()));
}

export function search(query: string): Machine[] {
    return getPins().filter(machine => machine.name.toLowerCase().includes(query.toLowerCase()));
}

export interface Machine {
    id: string;
    name: string;
    description: string;
    notes?: string;
    image: string;
    tags: Tag[]
    tasks: Task[];
    logs: Log[];
}

export interface Task {
    id: string;
    title: string;
    details?: string;
    done: boolean;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    description: string;
}

export interface Log {
    id: string;
    author: string;
    time: number;
    title: string;
    content: string;
    changes: Change[];
}

export type Change = TaskStatusChange;

export interface TaskStatusChange {
    task: string;
    status: boolean;
}