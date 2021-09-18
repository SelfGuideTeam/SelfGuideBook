const colorSyntaxOptions = {
    preset: ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FFFFFF', '#000000'],
    useCustomSyntax: true
};
const editor = new window.Editor({
    el: document.getElementById("pnlEditor"),
    minHeight: '600px',
    height: '100%',
    initialEditType: 'wysiwyg',
    events: {
        change: function () {
            // if(writeTimeout) clearTimeout(writeTimeout);
            // writeTimeout = setTimeout(function () {
            //     document.getElementById('btnSaveDraft').click();
            //     writeTimeout = undefined;
            // }, 1000 * 60 * 1)
        }
    },
    language: 'ko',
    toolbarItems: [
        // ['heading', 'bold', 'italic', 'color', 'strike'],
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'link'],
        ['code', 'codeblock']
    ],
    plugins: [[window.colorSyntax, colorSyntaxOptions]],
    customHTMLRenderer: {
        htmlBlock: {
            video(node) {
                return [
                    { type: 'openTag', tagName: 'video', outerNewLine: true, attributes: node.attrs },
                    { type: 'html', content: node.childrenHTML },
                    { type: 'closeTag', tagName: 'video', outerNewLine: true },
                ];
            },
        },
        // htmlInline: {
        //     big(node, { entering }) {
        //         return entering
        //             ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
        //             : { type: 'closeTag', tagName: 'big' };
        //     },
        // },
        // linebreak(node, context) {
        //     return {
        //         type: 'html',
        //         content: '\n<br />\n'
        //     }
        // }
    },
    customMarkdownRenderer: {
        html(state, ConvertorContent) {
            const typeName = state.node.type.name;
            if(typeName == 'video') {
                var convert = ConvertorContent.origin();
                if(convert) {
                    convert.text = convert.text + '\n\n';
                }
                return convert;
            }
            return ConvertorContent.origin();
        }
    },
    // customHTMLSanitizer: html => html,

});

const scrabPort = chrome.extension.connect({
    name: "scrab"
});

const textEditor = document.querySelector('#pnlEditor .ProseMirror.toastui-editor-contents');
console.log(textEditor);

scrabPort.onMessage.addListener(function(content) {
    console.log(content);
    const selectionText = content.selectionText;
    if(selectionText){
        const p = document.createElement('p');
        p.innerHTML = selectionText;
        textEditor.append(p);
        return;
    }
    
    const mediaType = content.mediaType;
    if(mediaType){
        if(mediaType == 'image'){
            const image = document.createElement('img');
            image.setAttribute('src', content.srcUrl);
            textEditor.append(image);
        }else if(mediaType == 'video'){
            const video = document.createElement('video');
            video.setAttribute('src', content.srcUrl);
            video.setAttribute('controls', 'true');
            textEditor.append(video);
        }
        return;
    }

    const linkUrl = content.linkUrl;
    if(linkUrl){
        const a = document.createElement('a');
        a.setAttribute('href', content.pageUrl);
        a.innerHTML = content.pageUrl;
        console.log(a);
        textEditor.append(a);
    }

});

