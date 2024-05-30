import {supabase} from "./supabase";
import {getTasks} from "./tasks";
import {useInsertMutation, useQuery, useUpdateMutation} from "@supabase-cache-helpers/postgrest-react-query";
import {getMachines} from "./machine";

const logColumns = "id,created_at,created_by,title,content";
const machineLogColumns = "machine,log";
const logTaskColumns = "log,task";

export function getMachineLogs(machine_id: string) {
    return supabase
        .from('machine_logs')
        .select<typeof machineLogColumns, MachineLog>(machineLogColumns)
        .eq('machine', machine_id);
}

export function getLogMachines(log_id: string) {
    return supabase
        .from('machine_logs')
        .select<typeof machineLogColumns, MachineLog>(machineLogColumns)
        .eq('log', log_id);
}

export function getLogTasks(log_id: string) {
    return supabase
        .from('log_tasks')
        .select<typeof logTaskColumns, LogTask>(logTaskColumns)
        .eq('log', log_id);
}

export function getLogs(logs: MachineLog[]) {
    return getLogsByIds(logs.map(l => l.log));
}

export function getLogsByIds(log_ids: string[]) {
    return supabase
        .from('logs')
        .select<typeof logColumns, Log>(logColumns)
        .in('id', log_ids)
}

export function useLogMachines(log_id: string) {
    const {
        data: logMachines,
        status: logMachinesStatus,
        error: logMachinesError
    } = useQuery(getLogMachines(log_id));
    const {data: machines, status: machinesStatus, error: machinesError} = useQuery(getMachines(logMachines ?? []), {
        enabled: !!logMachines
    });

    return {logMachines, logMachinesStatus, logMachinesError, machines, machinesStatus, machinesError};

}

export function useLogTasks(log_id: string) {
    const {
        data: logTasks,
        status: logTasksStatus,
        error: logTasksError
    } = useQuery(getLogTasks(log_id));
    const {data: tasks, status: tasksStatus, error: tasksError} = useQuery(getTasks(logTasks ?? []), {
        enabled: !!logTasks
    });

    return {logTasks, logTasksStatus, logTasksError, tasks, tasksStatus, tasksError};

}

export function useLogs(machine_id: string) {
    const {
        data: machineLogs,
        status: machineLogsStatus,
        error: machineLogsError
    } = useQuery(getMachineLogs(machine_id));
    const {data: logs, status: logsStatus, error: logsError} = useQuery(getLogs(machineLogs ?? []), {
        enabled: !!machineLogs
    });

    return {machineLogs, machineLogsStatus, machineLogsError, logs, logsStatus, logsError};
}

export function useInsertLog() {
    return useInsertMutation(supabase.from('logs'), ['id'], logColumns);
}

export function useUpdateLog() {
    return useUpdateMutation(supabase.from('logs'), ['id'], logColumns);
}

export function useInsertMachineLog() {
    return useInsertMutation(supabase.from('machine_logs'), ['machine', 'log'], machineLogColumns);
}


export interface Log {
    id: string;
    created_at: Date;
    created_by?: string;
    title: string;
    content: string;
}

export interface MachineLog {
    machine: string;
    log: string;
}

export interface LogTask {
    log: string;
    task: string;
}
