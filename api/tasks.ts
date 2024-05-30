import {supabase} from "./supabase";
import {
    useDeleteMutation,
    useInsertMutation,
    useQuery,
    useUpdateMutation
} from "@supabase-cache-helpers/postgrest-react-query";
import {convert} from "./crontzconvert";
import moment from "moment-timezone";

const machineTaskColumns = "machine,task";
const taskColumns = "id,created_at,created_by,name,description,details,completed_at,completed_by,template";
const taskTemplateColumns = "id,machine,created_at,created_by,cron,name,description,details";

export function getMachineTasks(machine_id: string) {
    return supabase
        .from('machine_tasks')
        .select<typeof machineTaskColumns, MachineTask>(machineTaskColumns)
        .eq('machine', machine_id);
}

export function getTasks(tasks: { task: string }[], completed?: boolean) {
    return getTasksByIds(tasks.map(t => t.task), completed);
}

export function getTasksByIds(task_ids: string[], completed?: boolean) {
    let request = supabase
        .from('tasks')
        .select<typeof taskColumns, Task>(taskColumns)
        .in('id', task_ids);


    if (completed !== undefined)
        request = completed ? request.not('completed_at', 'is', 'null') : request.is('completed_at', 'null');

    return request
}

export function useTasks(machine_id: string, completed?: boolean) {
    const {
        data: machineTasks,
        status: machineTasksStatus,
        error: machineTasksError
    } = useQuery(getMachineTasks(machine_id));
    const {data: tasks, status: tasksStatus, error: tasksError} = useQuery(getTasks(machineTasks ?? [], completed), {
        enabled: !!machineTasks
    });

    return {machineTasks, machineTasksStatus, machineTasksError, tasks, tasksStatus, tasksError};
}

export function useInsertTask() {
    return useInsertMutation(supabase.from('tasks'), ['id'], taskColumns);
}

export function useUpdateTask() {
    return useUpdateMutation(supabase.from('tasks'), ['id'], taskColumns);
}

export function useDeleteTask() {
    return useDeleteMutation(supabase.from('tasks'), ['id'], taskColumns);
}

export function useInsertMachineTask() {
    return useInsertMutation(supabase.from('machine_tasks'), ['machine', 'task'], machineTaskColumns);
}

export function useTaskTemplates(machine_id: string) {
    const {data: taskTemplates, status: taskTemplatesStatus, error: taskTemplatesError} = useQuery(
        supabase
            .from('task_templates')
            .select<typeof taskTemplateColumns, TaskTemplate>(taskTemplateColumns)
            .eq('machine', machine_id)
    );

    return {taskTemplates, taskTemplatesStatus, taskTemplatesError};
}

export function useInsertTaskTemplate() {
    return useInsertMutation(supabase.from('task_templates'), ['id'], taskTemplateColumns);
}

export function useUpdateTaskTemplate() {
    return useUpdateMutation(supabase.from('task_templates'), ['id'], taskTemplateColumns);
}

export function useDeleteTaskTemplate() {
    return useDeleteMutation(supabase.from('task_templates'), ['id'], taskTemplateColumns);
}

export function convertCronTimezone(cron: string, to: "remote" | "local") {
    let converted = convert(cron, to === "local" ? "UTC" : moment.tz.guess(), to === "remote" ? "UTC" : moment.tz.guess());
    return converted.slice(converted.indexOf(" ") + 1);
}

export interface Task {
    id: string;
    created_at: Date;
    created_by?: string;
    name: string;
    description?: string;
    details?: string;
    completed_at?: Date;
    completed_by?: string;
    template?: string;
}

export interface MachineTask {
    machine: string;
    task: string;
}

export interface TaskTemplate {
    id: string;
    machine: string;
    created_at: Date;
    created_by?: string;
    cron?: string;
    name: string;
    description?: string;
    details?: string;
}