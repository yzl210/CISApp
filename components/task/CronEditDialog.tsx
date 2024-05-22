import SimpleDialog from "../SimpleDialog";
import React, {useEffect, useMemo, useState} from "react";
import {useIsWeb, WEEK_DAYS} from "../../api/utils";
import {Adapt, Button, Dialog, Input, Label, Select, Sheet, Text, XGroup, XStack, YStack} from "tamagui";
import {LmButton} from "@tamagui-extras/core";
import {Check, CheckCircle, ChevronDown, Trash, XCircle} from "@tamagui/lucide-icons";
import DatePicker from "react-native-date-picker";


export const REPEAT_TYPE = ['day', 'week', 'month'] as const
export type RepeatType = typeof REPEAT_TYPE[number]

type CronEditDialogProps = {
    children: React.ReactNode
    cron?: string,
    setCron: (cron: string) => void
}

export default function CronEditDialog(props: CronEditDialogProps) {
    const [open, setOpen] = useState(false)
    const isWeb = useIsWeb();
    const [cron, setCron] = useState<string>()

    let date = new Date();

    const [interval, setInterval] = useState(1)

    const [minute, setMinute] = useState(date.getMinutes())
    const [hour, setHour] = useState(date.getHours())

    const [daysOfWeek, setDaysOfWeek] = useState<Set<number>>()
    const [daysOfMonth, setDaysOfMonth] = useState<Set<number>>()

    const [repeatType, setRepeatType] = useState<RepeatType>('day')

    useEffect(() => {
        let dayOfMonthPart = daysOfMonth && !(daysOfMonth.size >= 31) ? Array.from(daysOfMonth).join(",") : "*";
        if (repeatType === 'day' && interval > 1) {
            dayOfMonthPart += "/" + interval;
        }

        let dayOfWeekPart = daysOfWeek && !(daysOfWeek.size >= 7) ? Array.from(daysOfWeek).join(",") : "*";
        let monthPart = "*";
        if (repeatType === 'month' && interval > 1) {
            monthPart += "/" + interval;
        }
        setCron(`${minute} ${hour} ${dayOfMonthPart} ${monthPart} ${dayOfWeekPart}`)
    }, [minute, hour, interval, repeatType, daysOfWeek, daysOfMonth])

    useEffect(() => {
        if (props.cron) {
            const cronArray = props.cron.split(' ');
            setMinute(parseInt(cronArray[0]))
            setHour(parseInt(cronArray[1]))
            let dayOfMonthPart = cronArray[2];

            if (dayOfMonthPart.includes('/')) {
                setRepeatType('day')
                let parts = dayOfMonthPart.split('/');
                setInterval(parseInt(parts[1]))
                dayOfMonthPart = parts[0]
            }

            if (dayOfMonthPart !== '*') {
                let days = dayOfMonthPart.split(',');
                setDaysOfMonth(new Set(days.map(d => parseInt(d))))
            }

            let monthPart = cronArray[3];
            if (monthPart.includes('/')) {
                setRepeatType('month')
                setInterval(parseInt(monthPart.split('/')[1]))
            }

            let dayOfWeekPart = cronArray[4];
            if (dayOfWeekPart !== '*') {
                setRepeatType('week')
                let days = dayOfWeekPart.split(',');
                setDaysOfWeek(new Set(days.map(d => parseInt(d))))
            }

        }
    }, []);


    let openChange = (open: boolean) => {
        if (open)
            setOpen(true)
        else if (!isWeb) {
            setOpen(false)
        }
    }

    let trySetInterval = (s: string) => {
        let n = parseInt(s)
        if (n > 0) {
            setInterval(n)
        }
    }

    let trySetRepeatType = (s: string) => {
        switch (s) {
            case 'day':
                setDaysOfWeek(undefined)
                setDaysOfMonth(undefined)
                setRepeatType(s)
                break;
            case 'week':
                setInterval(1)
                setDaysOfMonth(undefined)
                setRepeatType(s)
                break;
            case 'month':
                setDaysOfWeek(undefined)
                setRepeatType(s)
                break;
        }
    }

    let cancel = () => {
        setOpen(false)
    }

    let confirm = () => {
        if (cron)
            props.setCron(cron)
        setOpen(false)
    }

    let clear = () => {
        props.setCron("")
        setOpen(false)
    }

    date.setHours(hour);
    date.setMinutes(minute);

    return <SimpleDialog open={open} onOpenChange={openChange} trigger={props.children}>
        <Dialog.Title>
            Task Repetition
        </Dialog.Title>
        <Dialog.Description>
        </Dialog.Description>
        <YStack gap={"$2"}>
            <XStack gap={"$2"}>
                <Label>Repeat every</Label>
                <Input padding={"$2"} value={interval + ""} onChangeText={trySetInterval}
                       theme={repeatType === 'week' ? "gray_active" : null} disabled={repeatType === 'week'}
                       width={"$4.5"}/>
                <Select value={repeatType} onValueChange={trySetRepeatType}>
                    <Select.Trigger width={120} iconAfter={ChevronDown}>
                        <Select.Value/>
                    </Select.Trigger>

                    <Adapt when="sm" platform="touch">
                        <Sheet
                            native
                            modal
                            dismissOnSnapToBottom
                            animationConfig={{
                                type: 'spring',
                                damping: 20,
                                mass: 1.2,
                                stiffness: 250,
                            }}
                        >
                            <Sheet.Frame>
                                <Sheet.ScrollView>
                                    <Adapt.Contents/>
                                </Sheet.ScrollView>
                            </Sheet.Frame>
                            <Sheet.Overlay
                                animation="lazy"
                                enterStyle={{opacity: 0}}
                                exitStyle={{opacity: 0}}
                            />
                        </Sheet>
                    </Adapt>

                    <Select.Content zIndex={200000}>
                        <Select.Viewport
                            minWidth={100}
                        >
                            <Select.Group>
                                {useMemo(
                                    () =>
                                        REPEAT_TYPE.map((item, i) => {
                                            return (
                                                <Select.Item
                                                    index={i}
                                                    key={item}
                                                    value={item}
                                                >
                                                    <Select.ItemText>{item}</Select.ItemText>
                                                    <Select.ItemIndicator marginLeft="auto">
                                                        <Check size={16}/>
                                                    </Select.ItemIndicator>
                                                </Select.Item>
                                            )
                                        }), []
                                )}
                            </Select.Group>
                        </Select.Viewport>
                        <Select.ScrollDownButton/>
                    </Select.Content>
                </Select>
            </XStack>
            <Label>Repeat on</Label>
            {isWeb ? <WebTimeOfDaySelect time={date} setTime={date => {
                setMinute(date.getMinutes())
                setHour(date.getHours())
            }}/> : <NativeTimeOfDaySelect time={date} setTime={date => {
                setMinute(date.getMinutes())
                setHour(date.getHours())
            }}/>}

            {repeatType === 'week' ? <DayOfWeekSelect days={daysOfWeek} setDays={setDaysOfWeek}/> : null}
            {repeatType === 'month' ? <DayOfMonthSelect days={daysOfMonth} setDays={setDaysOfMonth}/> : null}

        </YStack>
        <XStack alignSelf={"center"} gap={"$3"} marginTop={"$3"}>
            <LmButton theme={"red"} onPress={cancel} icon={XCircle}>
                Cancel
            </LmButton>
            <LmButton theme={"green"} onPress={confirm} icon={CheckCircle}>
                Confirm
            </LmButton>
            <LmButton onPress={clear} icon={Trash}>
                Clear
            </LmButton>
        </XStack>
    </SimpleDialog>
}

function WebTimeOfDaySelect({time, setTime}: { time: Date, setTime: (time: Date) => void }) {
    let change = (time: string) => {
        let parts = time.split(":")
        let date = new Date()
        date.setHours(parseInt(parts[0]))
        date.setMinutes(parseInt(parts[1]))
        setTime(date)
    }

    return <input type={"time"}
                  value={(time.getHours() + "").padStart(2, '0') + ":" + (time.getMinutes() + "").padStart(2, '0')}
                  onChange={(e) => {
                      // @ts-ignore
                      if (e?.nativeEvent?.target?.value) {
                          // @ts-ignore
                          change(e.nativeEvent.target.value)
                      }
                  }}/>
}

function NativeTimeOfDaySelect({time, setTime}: { time: Date, setTime: (time: Date) => void }) {
    const [open, setOpen] = useState(false)
    const isWeb = useIsWeb();
    let confirm = (date: Date) => {
        setTime(date)
        setOpen(false)
    }

    return <>
        <Button onPress={() => setOpen(true)}>
            <Text>
                {time.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit'})}
            </Text>
        </Button>
        {isWeb ? null : <DatePicker modal mode={"time"} open={open} date={time} onCancel={() => setOpen(false)}
                                    onConfirm={confirm}/>}
    </>;
}

function DayOfWeekSelect({days, setDays}: { days: Set<number> | undefined, setDays: (days: Set<number>) => void }) {
    if (!days) {
        setDays(new Set<number>([new Date().getDay()]))
        return null;
    }


    let pressDay = (day: number) => {
        if (days.has(day)) {
            if (days.size > 1)
                days.delete(day)
        } else
            days.add(day)
        setDays(new Set(days))
    }

    return <XGroup>
        {WEEK_DAYS.map((day, i) =>
            <XGroup.Item>
                <Button theme={days.has(i) ? "blue" : null} onPress={() => pressDay(i)}>
                    <Text>
                        {day.slice(0, 1)}
                    </Text>
                </Button>
            </XGroup.Item>)}
    </XGroup>
}

function DayOfMonthSelect({days, setDays}: { days: Set<number> | undefined, setDays: (days: Set<number>) => void }) {
    if (!days) {
        setDays(new Set<number>([new Date().getDate()]))
        return null;
    }

    let pressDay = (day: number) => {
        if (days.has(day)) {
            if (days.size > 1)
                days.delete(day)
        } else
            days.add(day)
        setDays(new Set(days))
    }


    return <XGroup flexWrap={"wrap"} maxWidth={400}>
        {Array.from({length: 31}, (_, i) => i + 1).map((day, i) =>
            <XGroup.Item>
                <Button theme={days.has(i + 1) ? "blue" : null} onPress={() => pressDay(i + 1)} size={"$3"}>
                    <Text>
                        {day}
                    </Text>
                </Button>
            </XGroup.Item>
        )}
    </XGroup>


}