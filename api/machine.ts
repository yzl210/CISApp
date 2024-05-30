import {supabase} from "./supabase";
import {
    useDeleteMutation,
    useInsertMutation,
    useQuery,
    useUpdateMutation
} from "@supabase-cache-helpers/postgrest-react-query";

const machineColumns = "id,created_at,updated_at,name,brand,model,serial,location,description,image,volts,phase,amperage,hertz,electrically_certified";
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

export function getMachines(machines: { machine: string }[]) {
    return getMachinesByIds(machines.map(m => m.machine));
}

export function getMachinesByIds(machine_ids: string[]) {
    return getAllMachines()
        .in('id', machine_ids);
}

export function useMachine(machine_id: string) {
    const {data: machine, status: machineStatus, error: machineError} = useQuery(getMachine(machine_id));
    return {machine, machineStatus, machineError};
}

export function useMachines(machine_id: string[]) {
    const {data: machines, status: machinesStatus, error: machinesError} = useQuery(getMachinesByIds(machine_id));
    return {machines, machinesStatus, machinesError};
}

export function useAllMachines() {
    const {data: machines, status: machinesStatus, error: machinesError} = useQuery(getAllMachines());
    return {machines, machinesStatus, machinesError};
}

export function useUpdateMachine() {
    return useUpdateMutation(supabase.from('machines'), ['id'], machineColumns);
}

export function useInsertMachine() {
    return useInsertMutation(supabase.from('machines'), ['id'], machineColumns);
}

export function useDeleteMachine() {
    return useDeleteMutation(supabase.from('machines'), ['id'], machineColumns);
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
    volts?: string;
    phase?: string;
    amperage?: string;
    hertz?: string;
    electrically_certified: boolean;
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
    color: string;
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