import React from "react";
import {Card, H2, Image, Separator, Text, View, XStack} from "tamagui";
import {getMachineTags, getTags, Machine, Tag} from "../../api/machine";
import TagComponent from "../TagComponent";
import {useQuery} from "@supabase-cache-helpers/postgrest-react-query";

export default function MachineTags({tags}: { tags: Tag[] }) {


    return <>
        <Card elevate bordered>
            <Card.Header>
                <XStack>
                    {tags ? tags.map(tag => <TagComponent tag={tag}/>) : null}
                </XStack>
            </Card.Header>
        </Card>
    </>;
}