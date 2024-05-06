import {useIsWeb} from "../api/utils";
import htmlString from "lexical-editor/dist/htmlString";
import {useEffect, useRef} from "react";
import WebView, {WebViewMessageEvent} from "react-native-webview";

type EditorProps = {
    initialContent?: string;
    onContentChange: (content: string) => void;
    width?: number;
    height?: number;
}

export default function Editor(props: EditorProps) {
    const isWeb = useIsWeb();
    return isWeb ? <WebEditor {...props}/> : <MobileEditor {...props} />;
}

function MobileEditor({onContentChange, initialContent, width = 400, height = 400}: EditorProps) {
    const webView = useRef<WebView>(null);

    useEffect(() => {
        if (webView.current) {
        }
    }, []);

    let onMessage = (event: WebViewMessageEvent) => {
        const message = JSON.parse(event.nativeEvent.data);
        switch (message.type) {
            case "LEXICAL_EDITOR_STATE_CHANGE":
                onContentChange(message.payload);
                break;
            case "LEXICAL_EDITOR_READY":
                webView.current?.postMessage(JSON.stringify({
                    command: "INIT_SERIALIZED_EDITOR_STATE",
                    payload: initialContent,
                }));
                break;
        }
    }

    return <WebView
        containerStyle={{width: width, height: height, borderTopLeftRadius: 15, borderTopRightRadius: 15}}
        ref={webView}
        originWhitelist={["*"]}
        source={{html: htmlString}}
        onMessage={onMessage}
    />
}

function WebEditor({initialContent, onContentChange, width = 600, height = 400}: EditorProps) {
    const iFrame = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iFrame.current?.contentWindow) {
            iFrame.current.contentWindow.addEventListener("message", ev => {
                const message = JSON.parse(ev.data);
                switch (message.type) {
                    case "LEXICAL_EDITOR_STATE_CHANGE":
                        onContentChange(message.payload);
                        break;
                    case "LEXICAL_EDITOR_READY":
                        iFrame.current?.contentWindow?.postMessage(JSON.stringify({
                            command: "INIT_SERIALIZED_EDITOR_STATE",
                            payload: initialContent,
                        }));
                        break;
                }
            });
        }
    }, []);

    return <iframe
        ref={iFrame}
        srcDoc={htmlString}
        style={{width: width, height: height, border: 0, borderTopLeftRadius: 15, borderTopRightRadius: 15}}
    />;
}