import './App.css'
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {$insertNodes, EditorState, LexicalEditor} from "lexical";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import ExampleTheme from "./ExampleTheme.ts";
import ToolbarPlugin from "./ToolbarPlugin.jsx";
import PlaygroundAutoLinkPlugin from "./AutolinkPlugin.tsx";
import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {ListItemNode, ListNode} from "@lexical/list";
import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect} from "react";
import {$generateHtmlFromNodes, $generateNodesFromDOM} from "@lexical/html"


function App() {
    const initialConfig = {
        namespace: "Editor",
        onError,
        theme: ExampleTheme,
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode
        ]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                <ToolbarPlugin/>
                <RichTextPlugin
                    contentEditable={<ContentEditable className="editor-input"/>}
                    placeholder={
                        <div className="editor-placeholder">Enter some text...</div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin/>
                <EditorStateInitPlugin/>
                <OnChangePlugin onChange={onChange}/>
                <AutoFocusPlugin/>
                <ListPlugin/>
                <LinkPlugin/>
                <PlaygroundAutoLinkPlugin/>
            </div>
        </LexicalComposer>
    );
}

function onChange(
    editorState: EditorState,
    latestEditor: LexicalEditor,
    tags: Set<string>,
) {
    if (tags.has("FromReactNativeToLexical")) {
        return;
    }
    editorState.read(() => {
        const message = {
            type: "LEXICAL_EDITOR_STATE_CHANGE",
            payload: $generateHtmlFromNodes(latestEditor),
        };

        postMessage(JSON.stringify(message));
    });
}

function onError(error: unknown) {
    console.error(error);
}

function EditorStateInitPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const listener = (e: MessageEvent<string>) => {
            const message = JSON.parse(e.data);

            if (message.command === "INIT_SERIALIZED_EDITOR_STATE") {
                const parser = new DOMParser();
                const dom = parser.parseFromString(message.payload, "text/html");
                editor.update(() => {
                    const nodes = $generateNodesFromDOM(editor, dom);

                    $insertNodes(nodes);
                });
            }
        };
        window.addEventListener("message", listener, true);

        return () => {
            window.removeEventListener("message", listener, true);
        };
    }, [editor]);

    useEffect(() => {
        const message = {
            type: "LEXICAL_EDITOR_READY",
        };
        postMessage(JSON.stringify(message));
    }, []);

    return null;
}

function postMessage(message: string) {
    // @ts-ignore
    if (window["ReactNativeWebView"]) {
        // @ts-ignore
        window["ReactNativeWebView"].postMessage(message);
    } else {
        window.postMessage(message);
    }
}

export default App
