import React from 'react';
import { ContentState, Editor, EditorState, getDefaultKeyBinding, RichUtils } from 'draft-js';
import { connect } from 'react-redux';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

import './styles/RichTextEditor.css';
import '../../node_modules/draft-js/dist/Draft.css';

const MAX_LENGTH = 5000;

class RichTextEditor extends React.Component {
    constructor(props) {
        super(props);

        let editorState = EditorState.createEmpty();
        if (props.content) {
            editorState = EditorState.createWithContent(stateFromHTML(this.props.content));
        }

        this.state = { editorState };
        this.editor = null;
        this.onChange = (editorState) => {
            this.setState({ editorState })
            const threadContent = stateToHTML(this.state.editorState.getCurrentContent());
            props.getContent(threadContent);
        };
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.reset = this.reset.bind(this);
        this.submitContent = this.submitContent.bind(this);
    }

    _getLength = () => {
        const currentContent = this.state.editorState.getCurrentContent();
        const currentContentLength = currentContent.getPlainText('').length

        return MAX_LENGTH - currentContentLength;
    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _handleBeforeInput = () => {
        const currentContent = this.state.editorState.getCurrentContent();
        const currentContentLength = currentContent.getPlainText('').length

        if (currentContentLength > MAX_LENGTH - 1) {
            return 'handled';
        }
    }

    _handlePastedText = (pastedText) => {
        const currentContent = this.state.editorState.getCurrentContent();
        const currentContentLength = currentContent.getPlainText('').length

        if (currentContentLength + pastedText.length > MAX_LENGTH) {
            return 'handled';
        }
    }

    _mapKeyToEditorCommand(e) {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                this.state.editorState,
                4, /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    reset() {
        const emptyEditorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
        this.setState({ editorState: emptyEditorState });
    }

    submitContent(e) {
        e.preventDefault();
        this.props.submit();
        this.reset();
    }

    render() {
        const { editorState } = this.state;
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <>
                <div className="RichEditor-root">
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <div className={className} onClick={() => this.editor.focus()}>
                        <Editor
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            handleBeforeInput={this._handleBeforeInput}
                            handlePastedText={this._handlePastedText}
                            keyBindingFn={this.mapKeyToEditorCommand}
                            onBlur={this.onBlur}
                            onChange={this.onChange}
                            placeholder=""
                            ref={editor => { this.editor = editor }}
                            spellCheck={true}
                        />
                    </div>
                    <div className="RichEditor-characterCount">Characters remaining: {this._getLength()}</div>
                </div>
                {this.props.account ? (
                    <div className='thread-reply'>
                        <button className='thread-reply-btn' onClick={this.submitContent}>
                            Reply
                            </button>
                    </div>
                ) : <></>}
            </>

        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
];

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

const BLOCK_TYPES = [
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        textContent: state.createThread.textContent,
        threadContent: state.createThread.threadContent,
        commentContent: state.createThread.commentContent,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    RichTextEditor
);