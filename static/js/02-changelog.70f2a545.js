(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"./docs/02-changelog.mdx":function(e,t,n){"use strict";n.r(t);var r=n("./node_modules/react/index.js"),a=n.n(r),o=n("./node_modules/@mdx-js/tag/dist/index.js"),s=n("./node_modules/@babel/runtime/regenerator/index.js"),c=n.n(s);function u(e){return(u="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){l(e,t,n[t])})}return e}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t,n,r,a,o,s){try{var c=e[o](s),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(r,a)}function m(e){return function(){var t=this,n=arguments;return new Promise(function(r,a){var o=e.apply(t,n);function s(e){p(o,r,a,s,c,"next",e)}function c(e){p(o,r,a,s,c,"throw",e)}s(void 0)})}}function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e,t){return!t||"object"!==u(t)&&"function"!==typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var d="brookjs-docz-releases",y=function(e){var t=e.message,n=e.stack,r=e.C;return a.a.createElement("div",null,a.a.createElement(r.h2,null,"An error occurred!"),a.a.createElement(r.p,null,t),n?a.a.createElement("pre",null,n):null)},g=function(e){var t=e.releases,n=e.C;return a.a.createElement(n.ul,null,t.map(function(e){return a.a.createElement("li",{key:e.id,style:{display:"block"}},a.a.createElement("section",null,a.a.createElement(n.h2,null,e.tag_name),e.tag_name!==e.name?a.a.createElement(n.h3,null,e.name):null,a.a.createElement(n.p,{dangerouslySetInnerHTML:{__html:e.body}})))}))},v=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=h(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))).state={releases:[],error:!1,message:""},n}var n,r,o,s;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(t,a.a.Component),n=t,(r=[{key:"componentDidMount",value:(s=m(c.a.mark(function e(){var t,n,r,a;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,!(t=localStorage.getItem(d))){e.next=4;break}return e.abrupt("return",this.setState({releases:JSON.parse(t)}));case 4:return e.next=6,fetch("https://api.github.com/repos/valtech-nyc/brookjs/releases",{method:"GET"});case 6:return n=e.sent,e.next=9,n.json();case 9:if(r=e.sent,n.ok){e.next=12;break}throw new y(r.message);case 12:return e.next=14,Promise.all(r.map(function(){var e=m(c.a.mark(function e(t){var n;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.body){e.next=2;break}return e.abrupt("return",t);case 2:return e.next=4,fetch("https://api.github.com/markdown",{method:"POST",body:JSON.stringify({text:t.body})});case 4:if((n=e.sent).ok){e.next=11;break}return e.t0=y,e.next=9,n.json();case 9:throw e.t1=e.sent.message,new e.t0(e.t1);case 11:return e.t2=i,e.t3={},e.t4=a,e.next=16,n.text();case 16:return e.t5=e.sent,e.t6={body:e.t5},e.abrupt("return",(0,e.t2)(e.t3,e.t4,e.t6));case 19:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()));case 14:a=e.sent,window.localStorage.setItem(d,JSON.stringify(a)),this.setState({releases:a}),e.next=22;break;case 19:e.prev=19,e.t0=e.catch(0),this.setState({error:!0,message:e.t0.message,stack:e.t0.stack});case 22:case"end":return e.stop()}},e,this,[[0,19]])})),function(){return s.apply(this,arguments)})},{key:"render",value:function(){var e=this.props.comps,t=this.state,n=t.error,r=t.message,o=t.stack,s=t.releases;return n?a.a.createElement(y,{message:r,stack:o,C:e}):s.length?a.a.createElement(g,{C:e,releases:s}):a.a.createElement(e.loading,null)}}])&&f(n.prototype,r),o&&f(n,o),t}();v.__docgenInfo={description:"",methods:[],displayName:"Changelog"};t.default=function(e){var t=e.components;return a.a.createElement(o.MDXTag,{name:"wrapper",components:t},a.a.createElement(o.MDXTag,{name:"h1",components:t,props:{id:"changelog"}},a.a.createElement(o.MDXTag,{name:"a",components:t,parentName:"h1",props:{"aria-hidden":!0,href:"#changelog"}},a.a.createElement(o.MDXTag,{name:"span",components:t,parentName:"a",props:{className:"icon-link"}},"#")),"Changelog"),a.a.createElement(v,{comps:t}))}}}]);