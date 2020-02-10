(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{bBeG:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return r})),n.d(t,"default",(function(){return p}));n("7+lW"),n("aHyW"),n("2Vap"),n("y7Hy"),n("LNPl"),n("owTU");var a=n("V0Ug"),o=n("sN0p");n("xH0s");function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}var r={};void 0!==r&&r&&r===Object(r)&&Object.isExtensible(r)&&!r.hasOwnProperty("__filemeta")&&Object.defineProperty(r,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/api/01-brookjs.mdx"}});var c={_frontmatter:r},s=o.a;function p(e){var t=e.components,n=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,["components"]);return Object(a.b)(s,i({},c,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"brookjs"},"brookjs"),Object(a.b)("h2",{id:"action-module"},"action module"),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"action")," module provides the action constants and creators that ",Object(a.b)("inlineCode",{parentName:"p"},"brookjs")," uses internally. These can be used to interact with any of the streams exported by the framework. The ",Object(a.b)("inlineCode",{parentName:"p"},"UPPER_SNAKE_CASE")," strings are the action type, while the ",Object(a.b)("inlineCode",{parentName:"p"},"camelCaseAction")," functions are the action creators. All actions generated by the framework comply with the ",Object(a.b)("a",i({parentName:"p"},{href:"https://github.com/acdlite/flux-standard-action"}),"Flux Standard Action"),"."),Object(a.b)("h3",{id:"api"},"Api"),Object(a.b)("h4",{id:"raf--raf"},Object(a.b)("inlineCode",{parentName:"h4"},"RAF")," & ",Object(a.b)("inlineCode",{parentName:"h4"},"raf$")),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"raf$")," stream emits a ",Object(a.b)("inlineCode",{parentName:"p"},"RafAction")," on a ",Object(a.b)("inlineCode",{parentName:"p"},"requestAnimationFrame")," tick. This will schedule renders in sync with the framework rendering flow."),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-flow"}),"type RafAction = {\n    type: typeof RAF;\n    payload: {\n        time: DOMHighResTimeStamp;\n    };\n}\n")),Object(a.b)("h2",{id:"helpers-module"},"helpers module"),Object(a.b)("p",null,"The helpers module isn't a separate module but a collection of functions to assist with common tasks in ",Object(a.b)("inlineCode",{parentName:"p"},"brookjs"),"."),Object(a.b)("h3",{id:"mapactionto-function"},Object(a.b)("inlineCode",{parentName:"h3"},"mapActionTo")," {Function}"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"mapActionTo")," is a simple function designed to simplify the process of mapping child events to its parent's events. It modifies the action's ",Object(a.b)("inlineCode",{parentName:"p"},"type")," and maintains the previous source in the Action's ",Object(a.b)("inlineCode",{parentName:"p"},"meta"),"."),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),"import { mapActionTo } from 'brookjs';\n\nconst child = {\n    type: 'CHILD',\n    payload: { value: true }\n};\n\nconst parent = mapActionTo('CHILD', 'PARENT', child);\n\nassert.deepEqual(parent, {\n    type: 'PARENT',\n    payload: { value: true },\n    meta: { sources: ['CHILD'] }\n});\n")),Object(a.b)("p",null,"If the source action doesn't match, the action is returned:"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),"import { mapActionTo } from 'brookjs';\n\nconst child = {\n    type: 'OTHER_CHILD',\n    payload: { value: true }\n};\n\nconst parent = mapActionTo('CHILD', 'PARENT', child);\n\nassert(parent === child);\n")),Object(a.b)("p",null,"This function is curried, so it can be used to map child events to their parent's actions using preplug:"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),"export default component({\n    children: children({\n        child: {\n          factory: ChildComponent,\n          preplug: instance$ => instance$.map(mapActionTo('CHILD', 'PARENT'))\n        }\n    })\n});\n")),Object(a.b)("h4",{id:"parameters"},"Parameters"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"{string} source - Action type to modify."),Object(a.b)("li",{parentName:"ul"},"{string} dest - Action type to map."),Object(a.b)("li",{parentName:"ul"},"{Action} action - Action to modify.")),Object(a.b)("h4",{id:"returns"},"Returns"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"{Action} Modified action if ",Object(a.b)("inlineCode",{parentName:"li"},"type")," matches, original action if it doesn't.")),Object(a.b)("h2",{id:"observedelta"},"observeDelta"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"observeDelta")," is a Redux middleware for binding a set of delta source streams to a Redux store."),Object(a.b)("p",null,"When the middleware gets applied, each source function will be called with two parameters: ",Object(a.b)("inlineCode",{parentName:"p"},"actions$")," and ",Object(a.b)("inlineCode",{parentName:"p"},"state$"),". These are ",Object(a.b)("inlineCode",{parentName:"p"},"Kefir.Observable"),"s, with the ",Object(a.b)("inlineCode",{parentName:"p"},"actions$")," stream emitting every action dispatched through the application, and the ",Object(a.b)("inlineCode",{parentName:"p"},"state$")," emitting each new state after each action. Each source function should return a Kefir stream, which are combined into a ",Object(a.b)("inlineCode",{parentName:"p"},"delta$")," stream that emits actions into the Redux store."),Object(a.b)("p",null,"Specifically, ",Object(a.b)("inlineCode",{parentName:"p"},"state$")," is a ",Object(a.b)("inlineCode",{parentName:"p"},"Kefir.Property"),", which means it retains its current value when it gets subscribed to. Additionally, note that the ",Object(a.b)("inlineCode",{parentName:"p"},"state$")," will have its value emitted before the ",Object(a.b)("inlineCode",{parentName:"p"},"action$"),", ensuring that any combination of the stream will have the latest state when the action is emitted."),Object(a.b)("h1",{id:"example"},"Example"),Object(a.b)("p",null,"An example ",Object(a.b)("inlineCode",{parentName:"p"},"source$")," stream:"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),"import { Kefir } from 'brookjs';\n\nexport default function exampleSourceStream(actions$, state$) {\n    const save$ = actions$.filter(action => action.type === 'SAVE_THING');\n\n    return save$.flatMap(action => {\n        const request = fetch('/api/url', {\n            type: 'POST',\n            body: JSON.stringify(action.payload)\n        });\n\n        return Kefir.fromPromise(request)\n            .map(response => ({\n                type: 'THING_SAVED',\n                payload: response\n            }));\n    });\n}\n")),Object(a.b)("p",null,"Applying the middleware with the example:"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),"import { applyMiddleware, createStore } from 'redux';\nimport { observeDelta } from 'brookjs'\nimport reducer from './reducer';\nimport exampleSourceStream from './example'\n\nconst store = createStore(reducer, applyMiddleware(observeDelta(exampleSourceStream)));\n\nstore.dispatch({ type: 'SAVE_THING', payload: { id: 1, name: 'The Thing to save' } });\n")),Object(a.b)("p",null,"If you need to get the state on every action, use ",Object(a.b)("inlineCode",{parentName:"p"},"sampledBy"),":"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),"import { ofType, Kefir } from 'brookjs';\n\nexport default function exampleSourceStream(actions$, state$) {\n    const save$ = actions$.thru(ofType(SAVE_USER_BUTTON_CLICK));\n\n    return state$.sampledBy(save$).flatMap(state => {\n        const request = fetch('/api/user', {\n            type: 'POST',\n            body: JSON.stringify(state.user)\n        });\n\n        return Kefir.fromPromise(request)\n            .map(response => ({\n                type: 'USER_SAVED',\n                payload: response\n            }));\n    });\n}\n")))}p&&p===Object(p)&&Object.isExtensible(p)&&!p.hasOwnProperty("__filemeta")&&Object.defineProperty(p,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/api/01-brookjs.mdx"}}),p.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-api-01-brookjs-mdx-413e4e834abcb36aabfe.js.map