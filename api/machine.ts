import {supabase} from "./supabase";
import {
    useDeleteMutation,
    useInsertMutation,
    useQuery,
    useUpdateMutation
} from "@supabase-cache-helpers/postgrest-react-query";

const machineColumns = "id,created_at,updated_at,name,brand,model,serial,location,description,image";
const machineTaskColumns = "machine,task";
const taskColumns = "id,created_at,name,description,done_at,done_by";
const machineTagColumns = "machine,tag,created_at,created_by";
const tagColumns = "id,created_at,created_by,name,color";

export function getAllMachines() {
    return supabase
        .from('machines')
        .select<typeof machineColumns, Machine>(machineColumns)
}

export function getMachine(machine_id: string) {
    return getAllMachines()
        .eq('id', machine_id)
        .single();
}

export function getMachines(machine_ids: string[]) {
    return getAllMachines()
        .in('id', machine_ids);
}

export function useMachine(machine_id: string) {
    const {data: machine, status: machineStatus, error: machineError} = useQuery(getMachine(machine_id));
    return {machine, machineStatus, machineError};
}

export function useMachines(machine_id: string[]) {
    const {data: machines, status: machinesStatus, error: machinesError} = useQuery(getMachines(machine_id));
    return {machines, machinesStatus, machinesError};
}

export function useAllMachines() {
    const {data: machines, status: machinesStatus, error: machinesError} = useQuery(getAllMachines());
    return {machines, machinesStatus, machinesError};
}

export function useUpdateMachine() {
    return useUpdateMutation(supabase.from('machines'), ['id'], machineColumns);
}

export function getMachineTasks(machine_id: string) {
    return supabase
        .from('machine_tasks')
        .select<typeof machineTaskColumns, MachineTask>(machineTaskColumns)
        .eq('machine', machine_id);
}

export function getTasks(tasks: MachineTask[], done?: boolean) {
    return getTasksByIds(tasks.map(t => t.task), done);
}

export function getTasksByIds(task_ids: string[], done?: boolean) {
    let request = supabase
        .from('tasks')
        .select<typeof taskColumns, Task>(taskColumns)
        .in('id', task_ids);


    if (done !== undefined)
        request = request.eq('done', done);

    return request
}

export function useTasks(machine_id: string) {
    const {
        data: machineTasks,
        status: machineTasksStatus,
        error: machineTasksError
    } = useQuery(getMachineTasks(machine_id));
    const {data: tasks, status: tasksStatus, error: tasksError} = useQuery(getTasks(machineTasks ?? []), {
        enabled: !!machineTasks
    });

    return {machineTasks, machineTasksStatus, machineTasksError, tasks, tasksStatus, tasksError};
}

export function getMaintenanceNeeded() {
    return getAllMachines();
}

export function getPins() {
    return getAllMachines();
}

export interface Machine {
    id: string;
    created_at: Date;
    updated_at: Date;
    name: string;
    brand?: string;
    model?: string;
    serial?: string;
    location?: string;
    description?: string;
    image?: string;
}


export interface Task {
    id: string;
    created_at: Date;
    name: string;
    description?: string;
    done_at?: Date;
    done_by?: string;
}


export interface MachineTask {
    machine: string;
    task: string;
}

export interface MachineTag {
    machine: string;
    tag: string;
    created_at: Date;
    created_by?: string;
}

export interface Tag {
    id: string;
    created_at: Date;
    created_by?: string;
    name: string;
    color: number;
}

export function getAllTags() {
    return supabase
        .from('tags')
        .select<typeof tagColumns, Tag>(tagColumns);
}

export function getTags(tags: MachineTag[]) {
    return getTagsByIds(tags.map(t => t.tag));
}

export function getTagsByIds(tag_id: string[]) {
    return getAllTags()
        .in('id', tag_id)
}

export function getMachineTags(machine_id: string) {
    return supabase
        .from('machine_tags')
        .select<typeof machineTagColumns, MachineTag>(machineTagColumns)
        .eq('machine', machine_id);
}

export function useMachineTag(machine_id: string, tag_id: string) {
    return useQuery(
        supabase
            .from('machine_tags')
            .select<typeof machineTagColumns, MachineTag>(machineTagColumns)
            .eq('machine', machine_id)
            .eq('tag', tag_id)
            .single()
    );
}

export function useAllTags() {
    const {data: tags, status: tagsStatus, error: tagsError} = useQuery(getAllTags());
    return {tags, tagsStatus, tagsError};

}

export function useTags(machine_id: string) {
    const {
        data: machineTags,
        status: machineTagsStatus,
        error: machineTagsError
    } = useQuery(getMachineTags(machine_id));
    const {data: tags, status: tagsStatus, error: tagsError} = useQuery(getTags(machineTags ?? []), {
        enabled: !!machineTags
    });

    return {machineTags, machineTagsStatus, machineTagsError, tags, tagsStatus, tagsError};
}

export function useInsertMachineTags() {
    return useInsertMutation(supabase.from('machine_tags'), ['machine', 'tag'], machineTagColumns);
}

export function useDeleteMachineTag() {
    return useDeleteMutation(supabase.from('machine_tags'), ['machine', 'tag'], machineTagColumns);
}