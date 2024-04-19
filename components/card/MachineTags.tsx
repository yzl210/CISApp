import React from "react";
import {Card, XStack} from "tamagui";
import {Tag} from "../../api/machine";
import TagComponent from "../TagComponent";

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