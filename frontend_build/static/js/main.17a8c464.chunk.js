(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{17:function(e,t,n){e.exports={area:"pages_area__1rICG",child:"pages_child__4NcuK"}},21:function(e,t,n){e.exports={"fake-header":"style_fake-header__3HsAi",header:"style_header__2lGhW","header-scrolled":"style_header-scrolled__2hjQ_",items:"style_items__1Cbna",inner:"style_inner__2oUn6","item-container":"style_item-container__1m4un","mobile-item-container":"style_mobile-item-container__2FgeB","mobile-dropdown":"style_mobile-dropdown__32CTr","items-container":"style_items-container__OlQiE",open:"style_open__XgSD2"}},24:function(e,t,n){e.exports={eventArea:"style_eventArea__3PFfI",cancelled:"style_cancelled__37knS",signup:"style_signup__1h0fb",titleArea:"style_titleArea__3EaAe",title:"style_title__2IEF4",row:"style_row__1WUId"}},32:function(e,t,n){e.exports={events:"style_events__1GG8s"}},33:function(e,t,n){e.exports={user:"style_user__1ofZj",book:"style_book__Odod_","header-scrolled":"style_header-scrolled__pIiZu"}},34:function(e,t,n){e.exports={bg:"style_bg__37ZTF",base:"style_base__gvFOV",book:"style_book__3bY1N",background:"style_background__3BmfY"}},35:function(e,t,n){e.exports={paidIcon:"style_paidIcon__JsN6Z",paid:"style_paid__1DKU-",notpaid:"style_notpaid__3VNvv"}},38:function(e,t,n){e.exports={date:"style_date__357WV",light:"style_light__1cyvb"}},39:function(e,t,n){e.exports={register:"style_register__2uU6k",btn:"style_btn__1S1y4",details:"style_details__3Sj1B",input:"style_input__B1dnu",button:"style_button__2NvHx"}},52:function(e,t,n){e.exports={"cta-menu":"style_cta-menu__2-i2c",active:"style_active__1mJ7H"}},53:function(e,t,n){e.exports={area:"style_area__3OTxe",video:"style_video__3VmUb"}},54:function(e,t,n){e.exports={booking:"style_booking__38ZtJ"}},55:function(e,t,n){e.exports={event:"style_event__2NkOa"}},57:function(e,t,n){e.exports={block:"style_block__1yfBR"}},58:function(e,t,n){e.exports={"table-outer":"style_table-outer__3ODvx"}},59:function(e,t,n){e.exports={user:"style_user__3H-mj"}},60:function(e,t,n){e.exports={button:"style_button__2NB1i"}},61:function(e,t,n){e.exports={signup:"style_signup__3prXm"}},62:function(e,t,n){e.exports={edit:"style_edit__2s-XL"}},63:function(e,t,n){e.exports={area:"style_area__nB8rQ"}},92:function(e,t,n){},93:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(23),l=n.n(c),s=n(9),i=n(7),o=n(2),u=n(20),d=n.n(u),m=n(21),f=n.n(m),h=n(3),p=n.n(h),E="".concat("https://north-manly-squash.herokuapp.com","/api"),b={headers:{"Content-Type":"application/json"}},v={getEvent:function(e){return p.a.get("".concat(E,"/events/").concat(e)).then((function(e){return e.data}))},getEvents:function(){return p.a.get("".concat(E,"/events")).then((function(e){return e.data}))},editEvent:function(e){return p.a.put("".concat(E,"/events"),e,b).then((function(e){return e.data}))},addEvent:function(e){return p.a.post("".concat(E,"/events"),e,b).then((function(e){return e.data}))}},_=n(6),g="".concat(E,"/user_events"),O={getUserEvents:function(e){return p.a.get("".concat(g,"/").concat(e)).then((function(e){return e.data}))},editUserEvent:function(e){return p.a.put(g,e,Object(_.a)(Object(_.a)({},b),{},{withCredentials:!0})).then((function(e){return e.data}))},deleteUserEvent:function(e){return p.a.put("".concat(g,"/remove"),e,Object(_.a)(Object(_.a)({},b),{},{withCredentials:!0})).then((function(e){return e.data}))},addUserEvent:function(e){return p.a.post(g,e,Object(_.a)(Object(_.a)({},b),{},{withCredentials:!0})).then((function(e){return e.data}))}},y="".concat(E,"/ladder"),j={getLadders:function(){return p.a.get(y).then((function(e){return e.data}))},getMatches:function(e){var t=e.ladder_id,n=e.player_id,a=e.challenges,r=void 0!==a&&a,c=new URL("".concat(y,"/").concat(t,"/matches"));return n&&c.searchParams.set("player_id",n),c.searchParams.set("challenges",r.toString()),p.a.get(c.toString()).then((function(e){return e.data}))},getRanks:function(e){var t=e.ladder_id;return p.a.get("".concat(y,"/").concat(t,"/ranks")).then((function(e){return e.data}))},challengeUser:function(e){var t=e.ladder_id,n=e.player_2;return p.a.post("".concat(y,"/").concat(t,"/challenge"),{player_2:n},Object(_.a)({withCredentials:!0},b)).then((function(e){return e.data}))},challengeAccept:function(e){return p.a.put("".concat(y,"/challenge/accept"),e,Object(_.a)({withCredentials:!0},b)).then((function(e){return e.data}))},challengeTime:function(e){return p.a.put("".concat(y,"/challenge/time"),e,Object(_.a)({withCredentials:!0},b)).then((function(e){return e.data}))},challengeResult:function(e){return p.a.put("".concat(y,"/challenge/result"),e,Object(_.a)({withCredentials:!0},b)).then((function(e){return e.data}))},challengeApprove:function(e){return p.a.put("".concat(y,"/challenge/approve"),e,Object(_.a)({withCredentials:!0},b)).then((function(e){return e.data}))},signUp:function(e){return p.a.post("".concat(y,"/signup"),e,Object(_.a)({withCredentials:!0},b)).then((function(e){return e.data}))}},C={refreshUser:function(){return p.a.get("".concat(E,"/users/refresh"),{withCredentials:!0}).then((function(e){return e.data}))},getUser:function(){return p.a.get("".concat(E,"/users/me"),{withCredentials:!0}).then((function(e){return e.data}))}};p.a.interceptors.response.use((function(e){return e}),(function(e){return 405===e.response.status&&(console.log("redirect to auth"),window.location.href="".concat("https://north-manly-squash.herokuapp.com","/auth/login/google")),Promise.reject(e)})),p.a.interceptors.request.use((function(e){return e.headers.preauthurl=window.location.pathname,e}));var w={events:v,userEvents:O,ladder:j,users:C},k={id:void 0,email:"",firstname:"",lastname:"",role:"",photo:""},N={user:k,setUser:function(e){}},x=Object(a.createContext)(N),S=function(e){var t=e.children,n=Object(a.useState)(k),c=Object(o.a)(n,2),l=c[0],s=c[1];return console.log("provider ",l),r.a.createElement(x.Provider,{value:{user:l,setUser:s}},t)},U=n(33),A=n.n(U),I=function(e){var t=e.headerScrolled,n=Object(a.useState)(!0),c=Object(o.a)(n,2),l=c[0],s=c[1],i=Object(a.useContext)(x),u=i.user,m=i.setUser;return Object(a.useEffect)((function(){w.users.getUser().then((function(e){e.success&&m(e.user)})).finally((function(){return s(!1)}))}),[m]),l?null:r.a.createElement("div",{className:A.a.user},u.id?r.a.createElement("img",{src:u.photo,alt:""}):r.a.createElement("a",{href:"".concat("https://north-manly-squash.herokuapp.com","/auth/login/google"),className:d()(A.a.book,t&&A.a["header-scrolled"])},"LOGIN"))},P=function(){var e=Object(a.useState)(!1),t=Object(o.a)(e,2),n=t[0],c=t[1],l=Object(a.useState)(!1),i=Object(o.a)(l,2),u=i[0],m=i[1];Object(a.useEffect)((function(){var e=function(){window.pageYOffset>96&&!u?m(!0):window.pageYOffset<=96&&u&&m(!1)};return window.addEventListener("scroll",e),function(){window.removeEventListener("scroll",e)}}),[u]);var h=u&&f.a["header-scrolled"];return r.a.createElement(r.a.Fragment,null,r.a.createElement("section",{className:d()(f.a.header,h)},r.a.createElement("div",{className:f.a.inner},r.a.createElement("div",{className:f.a["item-container"]},r.a.createElement(s.b,{to:"/"},u?r.a.createElement("img",{src:"/logo-white.png",alt:""}):r.a.createElement("img",{src:"/logo-black.png",alt:""}))),r.a.createElement("div",{className:f.a["items-container"]},r.a.createElement("div",{className:d()(f.a.items,n&&f.a.open),onClick:function(){console.log("hide header"),c(!1)}},r.a.createElement(s.b,{to:"/social"},"SOCIAL"),r.a.createElement(s.b,{to:"/competition"},"COMPETITION"),r.a.createElement(s.b,{to:"/coaching"},"COACHING"),r.a.createElement(s.b,{to:"/shop"},"SHOP"))),r.a.createElement(I,{headerScrolled:u}),r.a.createElement("div",{className:f.a["mobile-item-container"]},r.a.createElement("button",{onClick:function(){c(!n)},className:f.a["mobile-dropdown"]})))),r.a.createElement("section",{className:f.a["fake-header"]}))},L=n(52),F=n.n(L),T=function(e){var t=e.children;return r.a.createElement("div",{className:F.a["cta-menu"]},t)},R=n(34),M=n.n(R),B=n(4),D=(n(91),function(e){var t=e.children;return r.a.createElement("div",{className:M.a.base},r.a.createElement(P,null),r.a.createElement(B.a,null),r.a.createElement(T,null,r.a.createElement("h2",null,"PLAY AT MANLY"),r.a.createElement(s.b,{to:"/social"},"PLAY SOCIALLY"),r.a.createElement(s.b,{to:"/competition"},"COMPETE AGAINST OTHERS"),r.a.createElement(s.b,{to:"/coaching"},"IMPROVE YOUR PLAY"),r.a.createElement(s.b,{to:"/shop"},"SHOP")),r.a.createElement("section",{className:M.a.background},t),r.a.createElement("a",{href:"http://www.tennisvenues.com.au/booking/warringah-recreation-centre-squash",target:"_blank",rel:"noreferrer",className:M.a.book},"BOOK A COURT"))}),Y=n(53),H=n.n(Y),G=n(54),q=n.n(G),V=function(){return r.a.createElement("iframe",{className:q.a.booking,src:"http://www.tennisvenues.com.au/booking/warringah-recreation-centre-squash?mobileViewDisabled=false"})},z=function(){var e="true"===new URLSearchParams(Object(i.g)().search).get("updatelogin");return Object(a.useEffect)((function(){e&&w.users.refreshUser()}),[e]),r.a.createElement(r.a.Fragment,null,r.a.createElement("section",{className:H.a.area},r.a.createElement(V,null)))},J=n(17),Z=n.n(J),K=n(32),Q=n.n(K),W=n(55),X=n.n(W),$=function(e){var t=e.description,n=e.id,a=e.name,c=e.link;return r.a.createElement(s.b,{to:{pathname:"".concat(c,"/").concat(n),state:e},className:X.a.event,key:n},r.a.createElement("h2",null,a),r.a.createElement("h5",null,t))},ee=function(){var e=Object(a.useState)([]),t=Object(o.a)(e,2),n=t[0],c=t[1];return Object(a.useEffect)((function(){w.events.getEvents().then((function(e){var t=e.result;c(t)}))}),[]),r.a.createElement("section",{className:Z.a.area},r.a.createElement("section",{className:Z.a.child},r.a.createElement("div",{className:Q.a.events},n.map((function(e){return r.a.createElement($,Object.assign({},e,{key:e.id,link:"/event"}))})))))},te=function(){var e=Object(a.useState)([]),t=Object(o.a)(e,2),n=t[0],c=t[1];return Object(a.useEffect)((function(){w.ladder.getLadders().then((function(e){var t=e.result;c(t)}))}),[]),r.a.createElement("section",{className:Z.a.area},r.a.createElement("section",{className:Z.a.child},r.a.createElement("div",{className:Q.a.events},n.map((function(e){return r.a.createElement($,Object.assign({},e,{key:e.id,link:"/competition/ladder"}))})))))},ne=n(11),ae=n(57),re=n.n(ae),ce=function(e){var t=e.children,n=e.styles;return r.a.createElement("div",{className:d()(re.a.block,n)},t)},le=n(58),se=n.n(le),ie=function(e){var t=e.title,n=e.headers,a=e.body;return r.a.createElement(ce,{styles:se.a["table-outer"]},t&&r.a.createElement("h3",null,t),r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,n.map((function(e){return r.a.createElement("th",{key:e},e)})))),r.a.createElement("tbody",null,a.map((function(e,t){return r.a.createElement("tr",{key:t},e.map((function(e,t){return r.a.createElement("td",{key:t},e)})))})))))},oe=r.a.memo(ie),ue=n(59),de=n.n(ue),me=function(e){var t=e.name,n=e.photo;return r.a.createElement("div",{className:de.a.user},r.a.createElement("img",{src:n,alt:""}),r.a.createElement("span",null,t))},fe=n(60),he=n.n(fe),pe=function(e){var t=e.disabled,n=void 0!==t&&t,a=e.handleClick,c=e.text;return r.a.createElement("button",{className:he.a.button,disabled:n,onClick:a},c)},Ee=n(61),be=n.n(Ee),ve=function(e){var t=e.players,n=e.ladder_id,c=Object(a.useContext)(x).user;return function(){if(!c.id)return!1;for(var e=0;e<t.length;e+=1){if(t[e].id===c.id)return!0}return!1}()?null:r.a.createElement("div",{className:be.a.signup},r.a.createElement(pe,{handleClick:function(){w.ladder.signUp({ladder_id:n}).then((function(e){e.success?B.b.success("Signed up to ladder"):B.b.error("Could not sign up")}))},text:"Sign up"}))},_e=function(e){var t=e.ladderid,n=Object(a.useContext)(x).user,c=Object(a.useState)(!0),l=Object(o.a)(c,2),s=l[0],i=l[1],u=Object(a.useState)([]),d=Object(o.a)(u,2),m=d[0],f=d[1],h=Object(a.useState)([]),p=Object(o.a)(h,2),E=p[0],b=p[1];Object(a.useEffect)((function(){w.ladder.getRanks({ladder_id:t}).then((function(e){e.success&&(f(e.result),i(!1))}))}),[t]);var v=m.map((function(e,a){var c=e.player_id,l=e.firstname,s=e.photo;return[a+1,r.a.createElement(me,{name:l,photo:s}),r.a.createElement(r.a.Fragment,null,n&&n.id!==c&&r.a.createElement(pe,{disabled:E.includes(c),handleClick:function(){return function(e){b([].concat(Object(ne.a)(E),[e])),w.ladder.challengeUser({ladder_id:t,player_2:e}).then((function(e){if(!e.success)throw Error();B.b.success("Challenged player")})).catch((function(){B.b.error("Could not challenge player")}))}(c)},text:"Challenge"}))]}));return r.a.createElement(r.a.Fragment,null,!s&&r.a.createElement(ve,{ladder_id:t,players:m}),r.a.createElement(oe,{title:"Ranks",headers:["Rank","Player",""],body:v}))},ge=function(e){return function(t){var n=Object(a.useContext)(x).user;return n.id?"admin"!==n.role&&"superman"!==n.role?null:r.a.createElement(e,t):null}};function Oe(){return(Oe=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function ye(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var je=a.createElement("path",{fill:"currentColor",d:"M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"});function Ce(e,t){var n=e.title,r=e.titleId,c=ye(e,["title","titleId"]);return a.createElement("svg",Oe({style:{position:"absolute",right:0,top:"50%",transform:"translate(-50%, -50%)"},width:"16px",height:"16px","aria-hidden":"true",focusable:"false","data-prefix":"fas","data-icon":"ellipsis-h",className:"svg-inline--fa fa-ellipsis-h fa-w-16",role:"img",viewBox:"0 0 512 512",ref:t,"aria-labelledby":r},c),n?a.createElement("title",{id:r},n):null,je)}var we=a.forwardRef(Ce),ke=(n.p,n(62)),Ne=n.n(ke),xe=ge((function(e){var t=e.children,n=Object(a.useState)(!1),c=Object(o.a)(n,2),l=c[0],s=c[1];return l?r.a.createElement("ul",{className:Ne.a.edit},t(s)):r.a.createElement(we,{onClick:function(){s(!0)}})})),Se=function(e){var t=e.setOpen,n=e.id,a=e.match_date,c=e.accepted,l=!(null===a&&!0===c);return r.a.createElement(r.a.Fragment,null,r.a.createElement("li",null,r.a.createElement(pe,{handleClick:function(){w.ladder.challengeTime({match_id:n,time:"2021-03-05 19:00:00"}).then((function(e){e.success?B.b.success("Updated challenge date"):B.b.error("Could not update challenge date")})),t(!1)},text:"Add booking time",disabled:l})))},Ue=n(38),Ae=n.n(Ue),Ie=function(e){var t=e.time,n=e.isLight,a=void 0!==n&&n,c=new Date(t),l=c.getMinutes()<10?"0"+c.getMinutes():c.getMinutes();return r.a.createElement("div",{className:d()(Ae.a.date,a&&Ae.a.light)},c.getDate(),"/",c.getMonth()+1,"/",c.getFullYear()," ",c.getHours(),":",l)},Pe=function(e){var t=e.id,n=e.accepted,c=e.player_2,l=e.user,s=Object(a.useState)(!1),i=Object(o.a)(s,2),u=i[0],d=i[1];if(n)return r.a.createElement("span",null,"Accepted");if(!l.id)return r.a.createElement("span",null,"Pending");if(c!==l.id)return r.a.createElement("span",null,"Pending");return r.a.createElement(pe,{disabled:u,text:"Accept",handleClick:function(){w.ladder.challengeAccept({match_id:t}).then((function(e){e.success?(B.b.success("Challenge accepted"),d(!0)):B.b.error("Challenge could not be accepted")}))}})},Le=function(e){var t=e.matches,n=Object(a.useContext)(x).user;console.log(t,"[gg]");var c=t.map((function(e){var t=e.id,a=e.player_1_firstname,c=e.player_1_photo,l=e.player_2,s=e.player_2_firstname,i=e.player_2_photo,o=e.accepted,u=e.match_date;return[r.a.createElement(me,{name:a,photo:c}),r.a.createElement(me,{name:s,photo:i}),r.a.createElement(r.a.Fragment,null,u?r.a.createElement(Ie,{time:u}):r.a.createElement(Pe,{id:t,accepted:o,player_2:l,user:n}),r.a.createElement(xe,null,(function(t){return r.a.createElement(Se,Object.assign({setOpen:t},e))})))]}));return r.a.createElement(oe,{title:"Upcoming challenges",headers:["Challenger","Opponent","Accepted"],body:c})},Fe=function(e){var t=e.matches.map((function(e){var t=e.player_1_firstname,n=e.player_1_photo,a=e.player_2_firstname,c=e.player_2_photo,l=e.match_date,s=e.player_2_games,i=e.player_1_games;return[r.a.createElement(me,{name:t,photo:n}),r.a.createElement(me,{name:a,photo:c}),r.a.createElement("span",null,i," - ",s),r.a.createElement("span",null,r.a.createElement(Ie,{time:l}))]}));return r.a.createElement(oe,{title:"Results",headers:["Challenger","Opponent","Result","Date"],body:t})},Te=function(e){var t=e.ladderid,n=e.challenges,c=Object(a.useState)([]),l=Object(o.a)(c,2),s=l[0],i=l[1];return Object(a.useEffect)((function(){w.ladder.getMatches({ladder_id:t,challenges:n}).then((function(e){e.success&&i(e.result)}))}),[n,t]),r.a.createElement(r.a.Fragment,null,n?r.a.createElement(Le,{matches:s}):r.a.createElement(Fe,{matches:s}))},Re=function(){var e,t=Object(i.h)().ladderid;try{e=parseInt(t)}catch(n){return r.a.createElement(i.a,{to:"/competition"})}return r.a.createElement("section",{className:Z.a.area},r.a.createElement("section",{className:Z.a.child},r.a.createElement(_e,{ladderid:e}),r.a.createElement(Te,{ladderid:e,challenges:!0}),r.a.createElement(Te,{ladderid:e,challenges:!1})))},Me=n(24),Be=n.n(Me),De=n(39),Ye=n.n(De),He=n(108),Ge=function(e){var t=e.registerCTA,n=e.eventId,c=e.eventName,l=e.isFull,s=e.userEvents,i=e.setUserEvents,u=Object(a.useState)(!0),d=Object(o.a)(u,2),m=d[0],f=(d[1],Object(a.useState)(null)),h=Object(o.a)(f,2),p=h[0],E=h[1],b=Object(a.useContext)(x).user;console.log(b);return l?r.a.createElement(ce,null,"This event is full"):m?r.a.createElement("form",{className:Ye.a.register,onSubmit:function(e){e.preventDefault(),w.userEvents.addUserEvent({event_id:n}).then((function(e){var t=e.result,n=e.success,a=e.err;!0===n?(B.b.success("Registered succesfully"),i([].concat(Object(ne.a)(s),[Object(_.a)(Object(_.a)({},t),{},{firstname:b.firstname,lastname:b.lastname,photo:b.photo})])),console.log(Object(ne.a)(s))):(E(a),B.b.success("Could not register"))}))}},r.a.createElement(ce,null,r.a.createElement(He.a,{type:"submit",color:"primary",variant:"contained",className:Ye.a.button},t))):p?r.a.createElement(ce,null,p):r.a.createElement(ce,null,"Thank you for signing up to ",c)},qe=function(e){return e>new Date},Ve=function(e){var t=e.setOpen,n=e.event,a=e.userEvents,c=e.setUserEvents;return r.a.createElement(r.a.Fragment,null,r.a.createElement("li",null,r.a.createElement(pe,{handleClick:function(){w.userEvents.editUserEvent(Object(_.a)(Object(_.a)({},n),{},{enabled:!1})).then((function(e){if(e.success){B.b.success("Removed user");var t=Object(ne.a)(a).filter((function(e){return e.id!==n.id}));c(t)}else B.b.error("Could not remove user")})),t(!1)},text:"Remove"})),r.a.createElement("li",null,r.a.createElement(pe,{handleClick:function(){w.userEvents.editUserEvent(Object(_.a)(Object(_.a)({},n),{},{paid:!n.paid})).then((function(e){if(e.success){B.b.success("Paid status is now : ".concat(!n.paid));for(var t=Object(ne.a)(a),r=0;r<t.length;r+=1)if(t[r].id===n.id){t[r].paid=!t[r].paid;break}c(t)}else B.b.error("Could not update paid status")})),t(!1)},text:"Toggle paid state"})))},ze=n(35),Je=n.n(ze),Ze=ge((function(e){var t=e.paid?Je.a.paid:Je.a.notpaid;return r.a.createElement("div",{className:d()(Je.a.paidIcon,t)})}));function Ke(){return(Ke=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function Qe(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var We=a.createElement("path",{fill:"currentColor",d:"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"});function Xe(e,t){var n=e.title,r=e.titleId,c=Qe(e,["title","titleId"]);return a.createElement("svg",Ke({width:24,height:24,"aria-hidden":"true",color:"#b50d0d",focusable:"false","data-prefix":"fas","data-icon":"times-circle",className:"svg-inline--fa fa-times-circle fa-w-16",role:"img",viewBox:"0 0 512 512",ref:t,"aria-labelledby":r},c),n?a.createElement("title",{id:r},n):null,We)}var $e=a.forwardRef(Xe),et=(n.p,function(e){var t=e.event,n=e.userEvents,c=e.setUserEvents,l=Object(a.useContext)(x).user,s=t.enabled,i=t.open,o=t.start,u=t.spots;if(void 0===n||!1===s)return null;for(var d=0,m=!1,f=0;f<n.length;f+=1){var h=n[f],p=h.enabled,E=h.user_id;p&&(d+=1),p&&l.id===E&&(m=!0)}var b=u<=d,v=!qe(new Date(i)),_=qe(new Date(o));console.log(n,"[g] rerender");var g=n.map((function(e){return[r.a.createElement("div",{className:Be.a.row},r.a.createElement(me,{name:"".concat(e.firstname," ").concat(e.lastname),photo:e.photo}),l.id===e.user_id&&r.a.createElement($e,{onClick:function(){return function(e){var t=e.id;w.userEvents.deleteUserEvent({id:t}).then((function(e){if(e.success){B.b.success("Successfuly removed yourself from this event");var a=Object(ne.a)(n).filter((function(e){return e.id!==t}));c(a)}else B.b.error("Could not remove yourself from this event")}))}(e)}}),r.a.createElement(xe,null,(function(t){return r.a.createElement(Ve,{setOpen:t,event:e,userEvents:n,setUserEvents:c})})),r.a.createElement(Ze,{paid:e.paid}))]}));return r.a.createElement("div",{className:Be.a.signup},v&&_&&!m&&r.a.createElement(Ge,{registerCTA:"Sign up for this event",eventId:t.id,eventName:t.name,isFull:b,userEvents:n,setUserEvents:c}),r.a.createElement(oe,{headers:[t.name],body:g}))}),tt=r.a.memo(et),nt=function(){var e=Object(i.g)().state,t=Object(i.h)().eventid,n=Object(a.useState)(void 0),c=Object(o.a)(n,2),l=c[0],s=c[1],u=Object(a.useState)(void 0),d=Object(o.a)(u,2),m=d[0],f=d[1];if(Object(a.useEffect)((function(){void 0!==t&&(void 0===e?w.events.getEvent(t).then((function(e){e.success&&s(e.result)})):s(e),w.userEvents.getUserEvents(t).then((function(e){e.success&&(console.log(e.result),f(e.result))})))}),[e,t]),void 0===t)return r.a.createElement(i.a,{to:"/"});if(void 0===l)return null;var h=l.description,p=l.enabled,E=l.name,b=l.start;return r.a.createElement("section",{className:Z.a.area},r.a.createElement("div",{className:Z.a.child},r.a.createElement("div",{className:Be.a.eventArea},r.a.createElement("div",{className:Be.a.titleArea},r.a.createElement("h1",{className:Be.a.title},E),!0===p&&r.a.createElement(Ie,{isLight:!0,time:b})),r.a.createElement("h5",null,h),!1===p&&r.a.createElement("h1",{className:Be.a.cancelled},"This event has been cancelled")),r.a.createElement(tt,{event:l,userEvents:m,setUserEvents:f})))},at=n(63),rt=n.n(at),ct=function(){return r.a.createElement("section",{className:rt.a.area},r.a.createElement("h1",null,"Coming soon"))},lt=n(109),st=function(){return r.a.createElement(s.a,null,r.a.createElement(lt.b,{injectFirst:!0},r.a.createElement(D,null,r.a.createElement(i.d,null,r.a.createElement(i.b,{exact:!0,path:"/"},r.a.createElement(z,null)),r.a.createElement(i.b,{exact:!0,path:"/social"},r.a.createElement(ee,null)),r.a.createElement(i.b,{path:"/event/:eventid"},r.a.createElement(nt,null)),r.a.createElement(i.b,{exact:!0,path:"/competition"},r.a.createElement(te,null)),r.a.createElement(i.b,{path:"/competition/ladder/:ladderid"},r.a.createElement(Re,null)),r.a.createElement(i.b,{path:"/coaching"},r.a.createElement(ct,null)),r.a.createElement(i.b,{path:"/shop"}," ",r.a.createElement(ct,null))))))},it=function(){return r.a.createElement(S,null,r.a.createElement(st,null))},ot=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,110)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,c=t.getLCP,l=t.getTTFB;n(e),a(e),r(e),c(e),l(e)}))};n(92);l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(it,null)),document.getElementById("root")),ot(console.log)}},[[93,1,2]]]);
//# sourceMappingURL=main.17a8c464.chunk.js.map