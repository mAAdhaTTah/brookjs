---
id: custom-components-with-blackboxing-and-onmount
title: Custom Components with Blackboxing and <code>onMount</code>
---

Normally, a `brookjs` component takes over an entire section of the DOM, controlling its entire lifecyle. This can make it difficult to integrate with other libraries, as plugins like jQuery and the ACE editor make modifications that the `brookjs` rendering process will overwrite. To get around this, `brookjs` offers a way to blackbox parts of the DOM from the rendering process, allowing the component to implement custom logic in `onMount` and plug it into the component while taking
advantage of `brookjs` to emit DOM events and render the rest of the DOM.

Let's take a look at an editor mockup to consider how this might be useful:

```handlebars
<div class="container" {{container "app"}}>
    <div class="control-panel">
        {{> button name="save" text="Save"}}
        {{> button name="delete" text="Delete"}}
    </div>

    <div class="editor" {{blackbox "editor"}}></div>
<div>
```

Using the provided helpers, the above HTML will ensure the control panel gets updated, but nothing with the `.editor` div will be touched or changed. In our component, we can define it like this:

```js
import { Kefir, component, children, render } from 'brookjs';
import Editor from 'custom-editor-library'
import { editorChange } from '../action';

export default component({
    onMount(el, props$) {
        const editor = el.querySelector('.editor');

        if (!editor) {
            return Kefir.constantError(new Error('Invalid el passed to app'));
        }

        const instance = new Editor({ el: editor });

        const events$ = Kefir.fromEvents(instance, 'change').map(editorChange);
        const render$ = props$.flatMapLatest(props => raf$.take(1).flatMap(() => Kefir.stream(emitter => {
            if (props.editor.value !== instance.val()) {
                instance.val(props.editor.value);
            }
        })))

        return Kefir.merge([events$, render$]);
    },
    children: children({
        save: {
            factory: ButtonComponent,
            preplug: R.map(mapActionTo('CLICK', 'SAVE_CLICK'))
        },
        delete: {
            factory: ButtonComponent,
            preplug: R.map(mapActionTo('CLICK', 'DELETE_CLICK'))
        }
    }),
    render: render(template)
});
```

Treating `custom-editor-library` as an ACE Editor-like library, it can take control over that portion of the DOM. Custom code binds the instance events to the stream and updates it in response to props changes. This makes it easy to drop below the framework and get direct access to the section of the DOM the component controls. It also makes it possible to add custom features not yet supported by `brookjs`.
