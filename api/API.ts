export function getMachine(id: string): Machine {
    return {
        id: "daizi",
        image: "https://th.bing.com/th/id/R.0f7c628876d5cd7e054b2cdd7c075ede?rik=VvvkRND%2fRw5Caw&pid=ImgRaw&r=0",
        name: "Some Machine",
        tasks: [
            {name: "修理排气管", done: false},
            {name: "浇水", done: false},
            {name: "补充零件", done: true},
            {name: "清洁", done: false},
            {name: "检查电路", done: false},
            {name: "WTF: Wow That's Fun", done: false},
        ]
    };
}


export interface Machine {
    id: string;
    name: string;
    image: string;
    tasks: Task[];
}

export interface Task {
    name: string;
    done: boolean;
}