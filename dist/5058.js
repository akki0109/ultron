"use strict";(self.webpackChunklavender_medical=self.webpackChunklavender_medical||[]).push([[5058],{75058:function(n,e,t){t.r(e),t.d(e,{FileUploader:function(){return C}});var r=t(48521),i=t(51117),o=t(10756),a=function(){return a=Object.assign||function(n){for(var e,t=1,r=arguments.length;t<r;t++)for(var i in e=arguments[t])Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i]);return n},a.apply(this,arguments)};function l(n,e){return Object.defineProperty?Object.defineProperty(n,"raw",{value:e}):n.raw=e,n}var s,d,p,c,u,f=(0,i.css)(s||(s=l(["\n  display: flex;\n  align-items: center;\n  min-width: 322px;\n  max-width: 508px;\n  height: 48px;\n  border: dashed 2px ",";\n  padding: 8px 16px 8px 8px;\n  border-radius: 5px;\n  cursor: pointer;\n  flex-grow: 0;\n\n  &.is-disabled {\n    border: dashed 2px ",";\n    cursor: no-drop;\n    svg {\n      fill: ",";\n      color: ",";\n      path {\n        fill: ",";\n        color: ",";\n      }\n    }\n  }\n"],["\n  display: flex;\n  align-items: center;\n  min-width: 322px;\n  max-width: 508px;\n  height: 48px;\n  border: dashed 2px ",";\n  padding: 8px 16px 8px 8px;\n  border-radius: 5px;\n  cursor: pointer;\n  flex-grow: 0;\n\n  &.is-disabled {\n    border: dashed 2px ",";\n    cursor: no-drop;\n    svg {\n      fill: ",";\n      color: ",";\n      path {\n        fill: ",";\n        color: ",";\n      }\n    }\n  }\n"])),"#0658c2","#666","#666","#666","#666","#666"),v=i.default.label(d||(d=l(["\n  position: relative;\n  ",";\n  &:focus-within {\n    outline: 2px solid black;\n  }\n  & > input {\n    display: block;\n    opacity: 0;\n    position: absolute;\n    pointer-events: none;\n  }\n"],["\n  position: relative;\n  ",";\n  &:focus-within {\n    outline: 2px solid black;\n  }\n  & > input {\n    display: block;\n    opacity: 0;\n    position: absolute;\n    pointer-events: none;\n  }\n"])),(function(n){return n.overRide?"":f})),x=i.default.div(p||(p=l(["\n  border: dashed 2px ",";\n  border-radius: 5px;\n  background-color: ",";\n  opacity: 0.5;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  & > span {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translateX(-50%) translateY(-50%);\n  }\n"],["\n  border: dashed 2px ",";\n  border-radius: 5px;\n  background-color: ",";\n  opacity: 0.5;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  & > span {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translateX(-50%) translateY(-50%);\n  }\n"])),"#666","#999"),h=i.default.div(c||(c=l(["\n  display: flex;\n  justify-content: space-between;\n  flex-grow: 1;\n  & > span {\n    font-size: 12px;\n    color: ",";\n  }\n  .file-types {\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    max-width: 100px;\n  }\n"],["\n  display: flex;\n  justify-content: space-between;\n  flex-grow: 1;\n  & > span {\n    font-size: 12px;\n    color: ",";\n  }\n  .file-types {\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    max-width: 100px;\n  }\n"])),(function(n){return n.error?"red":"#666"})),g=i.default.span(u||(u=l(["\n  font-size: 14px;\n  color: ",";\n  span {\n    text-decoration: underline;\n  }\n"],["\n  font-size: 14px;\n  color: ",";\n  span {\n    text-decoration: underline;\n  }\n"])),"#666"),b=function(n){return n/1e3/1e3};function m(n){var e=n.types,t=n.minSize,i=n.maxSize;if(e){var o=e.toString(),l="";return i&&(l+="size >= ".concat(i,", ")),t&&(l+="size <= ".concat(t,", ")),(0,r.jsx)("span",a({title:"".concat(l,"types: ").concat(o),className:"file-types"},{children:o}),void 0)}return null}function w(){return(0,r.jsxs)("svg",a({width:"32",height:"32",viewBox:"0 0 32 32",fill:"none",xmlns:"http://www.w3.org/2000/svg"},{children:[(0,r.jsx)("path",{d:"M5.33317 6.66667H22.6665V16H25.3332V6.66667C25.3332 5.196 24.1372 4 22.6665 4H5.33317C3.8625 4 2.6665 5.196 2.6665 6.66667V22.6667C2.6665 24.1373 3.8625 25.3333 5.33317 25.3333H15.9998V22.6667H5.33317V6.66667Z",fill:"#0658C2"},void 0),(0,r.jsx)("path",{d:"M10.6665 14.6667L6.6665 20H21.3332L15.9998 12L11.9998 17.3333L10.6665 14.6667Z",fill:"#0658C2"},void 0),(0,r.jsx)("path",{d:"M25.3332 18.6667H22.6665V22.6667H18.6665V25.3333H22.6665V29.3333H25.3332V25.3333H29.3332V22.6667H25.3332V18.6667Z",fill:"#0658C2"},void 0)]}),void 0)}var y=0,j=function(n,e,t,i,o){return t?(0,r.jsx)("span",{children:"File type/size error, Hovered on types!"},void 0):(0,r.jsx)(g,{children:i?(0,r.jsx)("span",{children:"Upload disabled"},void 0):n||e?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{children:"Uploaded Successfully!"},void 0)," Upload another?"]},void 0):(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)(r.Fragment,o?{children:[(0,r.jsx)("span",{children:o.split(" ")[0]},void 0)," ",o.substr(o.indexOf(" ")+1)]}:{children:[(0,r.jsx)("span",{children:"Upload"},void 0)," or drop a file right here"]},void 0)},void 0)},void 0)},C=function(n){var e,t=n.name,i=n.hoverTitle,l=n.types,s=n.handleChange,d=n.classes,p=n.children,c=n.maxSize,u=n.minSize,f=n.fileOrFiles,g=n.onSizeError,C=n.onTypeError,k=n.onSelect,z=n.onDrop,L=n.disabled,S=n.label,E=n.multiple,H=n.required,F=n.onDraggingStateChange,V=n.dropMessageStyle,D=(0,o.useRef)(null),P=(0,o.useRef)(null),R=(0,o.useState)(!1),O=R[0],T=R[1],U=(0,o.useState)(null),M=U[0],Z=U[1],q=(0,o.useState)(!1),N=q[0],X=q[1],Y=function(n){return l&&!function(n,e){var t=n.name.split(".").pop();return e.map((function(n){return n.toLowerCase()})).includes(t.toLowerCase())}(n,l)?(X(!0),C&&C("File type is not supported"),!1):c&&b(n.size)>c?(X(!0),g&&g("File size is too big"),!1):!(u&&b(n.size)<u&&(X(!0),g&&g("File size is too small"),1))},_=function(n){var e=!1;if(n){if(n instanceof File)e=!Y(n);else for(var t=0;t<n.length;t++){var r=n[t];e=!Y(r)||e}return!e&&(s&&s(n),Z(n),T(!0),X(!1),!0)}return!1},B=function(n){var e=n.labelRef,t=n.inputRef,r=n.multiple,i=n.handleChanges,a=n.onDrop,l=(0,o.useState)(!1),s=l[0],d=l[1],p=(0,o.useCallback)((function(){t.current.click()}),[t]),c=(0,o.useCallback)((function(n){n.preventDefault(),n.stopPropagation(),y++,n.dataTransfer.items&&0!==n.dataTransfer.items.length&&d(!0)}),[]),u=(0,o.useCallback)((function(n){n.preventDefault(),n.stopPropagation(),--y>0||d(!1)}),[]),f=(0,o.useCallback)((function(n){n.preventDefault(),n.stopPropagation()}),[]),v=(0,o.useCallback)((function(n){n.preventDefault(),n.stopPropagation(),d(!1),y=0;var e=n.dataTransfer.files;if(e&&e.length>0){var t=r?e:e[0],o=i(t);a&&o&&a(t)}}),[i]);return(0,o.useEffect)((function(){var n=e.current;return n.addEventListener("click",p),n.addEventListener("dragenter",c),n.addEventListener("dragleave",u),n.addEventListener("dragover",f),n.addEventListener("drop",v),function(){n.removeEventListener("click",p),n.removeEventListener("dragenter",c),n.removeEventListener("dragleave",u),n.removeEventListener("dragover",f),n.removeEventListener("drop",v)}}),[p,c,u,f,v,e]),s}({labelRef:D,inputRef:P,multiple:E,handleChanges:_,onDrop:z});return(0,o.useEffect)((function(){null==F||F(B)}),[B]),(0,o.useEffect)((function(){f?(T(!0),Z(f)):(P.current&&(P.current.value=""),T(!1),Z(null))}),[f]),(0,r.jsxs)(v,a({overRide:p,className:"".concat(d||""," ").concat(L?"is-disabled":""),ref:D,htmlFor:t,onClick:function(n){n.preventDefault(),n.stopPropagation()}},{children:[(0,r.jsx)("input",{onClick:function(n){n.stopPropagation(),P&&P.current&&(P.current.value="",P.current.click())},onChange:function(n){var e=n.target.files,t=E?e:e[0],r=_(t);k&&r&&k(t)},accept:(e=l,void 0===e?"":e.map((function(n){return".".concat(n.toLowerCase())})).join(",")),ref:P,type:"file",name:t,disabled:L,multiple:E,required:H},void 0),B&&(0,r.jsx)(x,a({style:V},{children:(0,r.jsx)("span",{children:i||"Drop Here"},void 0)}),void 0),!p&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(w,{},void 0),(0,r.jsxs)(h,a({error:N},{children:[j(M,O,N,L,S),(0,r.jsx)(m,{types:l,minSize:u,maxSize:c},void 0)]}),void 0)]},void 0),p]}),void 0)}}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxFQUFFK0QsU0FBU0QsRUFBRUksU0FBU0QsRUFBRUcsU0FBU0QsUUFBRyxHQUFReUIsSUFBRyxTQUFFekUsRUFBRTVCLEVBQUUsQ0FBQzJILE1BQU0zQyxHQUFHLENBQUNuQyxVQUFTLFNBQUUsT0FBTyxDQUFDQSxTQUFTOUIsR0FBRyxrQkFBYSxVQUFVLElBQVNPLElBQUcsVUFBRSxXQUFFLENBQUN1QixTQUFTLEVBQUMsU0FBRUMsRUFBRSxDQUFDLE9BQUUsSUFBUSxVQUFFaEIsRUFBRTlCLEVBQUUsQ0FBQytCLE1BQU00RCxHQUFHLENBQUM5QyxTQUFTLENBQUNRLEVBQUVtQyxFQUFFSCxFQUFFTSxFQUFFcEIsRUFBRUUsSUFBRyxTQUFFdEMsRUFBRSxDQUFDQyxNQUFNakIsRUFBRWtCLFFBQVFiLEVBQUVjLFFBQVFmLFFBQUcsV0FBVyxVQUFVLEdBQVFELFVBQUssRUFBTyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGF2ZW5kZXItbWVkaWNhbC8uL25vZGVfbW9kdWxlcy9yZWFjdC1kcmFnLWRyb3AtZmlsZXMvZGlzdC9yZWFjdC1kcmFnLWRyb3AtZmlsZXMuZXNtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydHtqc3ggYXMgbixqc3hzIGFzIGUsRnJhZ21lbnQgYXMgcn1mcm9tXCJyZWFjdC9qc3gtcnVudGltZVwiO2ltcG9ydCB0LHtjc3MgYXMgb31mcm9tXCJzdHlsZWQtY29tcG9uZW50c1wiO2ltcG9ydHt1c2VTdGF0ZSBhcyBpLHVzZUNhbGxiYWNrIGFzIGEsdXNlRWZmZWN0IGFzIGwsdXNlUmVmIGFzIHN9ZnJvbVwicmVhY3RcIjtcbi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG5cblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1Jcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL3ZhciBwPWZ1bmN0aW9uKCl7cmV0dXJuIHA9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24obil7Zm9yKHZhciBlLHI9MSx0PWFyZ3VtZW50cy5sZW5ndGg7cjx0O3IrKylmb3IodmFyIG8gaW4gZT1hcmd1bWVudHNbcl0pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsbykmJihuW29dPWVbb10pO3JldHVybiBufSxwLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07ZnVuY3Rpb24gZChuLGUpe3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sXCJyYXdcIix7dmFsdWU6ZX0pOm4ucmF3PWUsbn12YXIgYyx1LGYsdixoLHg9byhjfHwoYz1kKFtcIlxcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBtaW4td2lkdGg6IDMyMnB4O1xcbiAgbWF4LXdpZHRoOiA1MDhweDtcXG4gIGhlaWdodDogNDhweDtcXG4gIGJvcmRlcjogZGFzaGVkIDJweCBcIixcIjtcXG4gIHBhZGRpbmc6IDhweCAxNnB4IDhweCA4cHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBmbGV4LWdyb3c6IDA7XFxuXFxuICAmLmlzLWRpc2FibGVkIHtcXG4gICAgYm9yZGVyOiBkYXNoZWQgMnB4IFwiLFwiO1xcbiAgICBjdXJzb3I6IG5vLWRyb3A7XFxuICAgIHN2ZyB7XFxuICAgICAgZmlsbDogXCIsXCI7XFxuICAgICAgY29sb3I6IFwiLFwiO1xcbiAgICAgIHBhdGgge1xcbiAgICAgICAgZmlsbDogXCIsXCI7XFxuICAgICAgICBjb2xvcjogXCIsXCI7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXCJdLFtcIlxcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBtaW4td2lkdGg6IDMyMnB4O1xcbiAgbWF4LXdpZHRoOiA1MDhweDtcXG4gIGhlaWdodDogNDhweDtcXG4gIGJvcmRlcjogZGFzaGVkIDJweCBcIixcIjtcXG4gIHBhZGRpbmc6IDhweCAxNnB4IDhweCA4cHg7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBmbGV4LWdyb3c6IDA7XFxuXFxuICAmLmlzLWRpc2FibGVkIHtcXG4gICAgYm9yZGVyOiBkYXNoZWQgMnB4IFwiLFwiO1xcbiAgICBjdXJzb3I6IG5vLWRyb3A7XFxuICAgIHN2ZyB7XFxuICAgICAgZmlsbDogXCIsXCI7XFxuICAgICAgY29sb3I6IFwiLFwiO1xcbiAgICAgIHBhdGgge1xcbiAgICAgICAgZmlsbDogXCIsXCI7XFxuICAgICAgICBjb2xvcjogXCIsXCI7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXCJdKSksXCIjMDY1OGMyXCIsXCIjNjY2XCIsXCIjNjY2XCIsXCIjNjY2XCIsXCIjNjY2XCIsXCIjNjY2XCIpLGc9dC5sYWJlbCh1fHwodT1kKFtcIlxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgXCIsXCI7XFxuICAmOmZvY3VzLXdpdGhpbiB7XFxuICAgIG91dGxpbmU6IDJweCBzb2xpZCBibGFjaztcXG4gIH1cXG4gICYgPiBpbnB1dCB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgfVxcblwiXSxbXCJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIFwiLFwiO1xcbiAgJjpmb2N1cy13aXRoaW4ge1xcbiAgICBvdXRsaW5lOiAycHggc29saWQgYmxhY2s7XFxuICB9XFxuICAmID4gaW5wdXQge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIH1cXG5cIl0pKSwoZnVuY3Rpb24obil7cmV0dXJuIG4ub3ZlclJpZGU/XCJcIjp4fSkpLG09dC5kaXYoZnx8KGY9ZChbXCJcXG4gIGJvcmRlcjogZGFzaGVkIDJweCBcIixcIjtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IFwiLFwiO1xcbiAgb3BhY2l0eTogMC41O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgJiA+IHNwYW4ge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogNTAlO1xcbiAgICBsZWZ0OiA1MCU7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSB0cmFuc2xhdGVZKC01MCUpO1xcbiAgfVxcblwiXSxbXCJcXG4gIGJvcmRlcjogZGFzaGVkIDJweCBcIixcIjtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IFwiLFwiO1xcbiAgb3BhY2l0eTogMC41O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgcmlnaHQ6IDA7XFxuICBsZWZ0OiAwO1xcbiAgYm90dG9tOiAwO1xcbiAgJiA+IHNwYW4ge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogNTAlO1xcbiAgICBsZWZ0OiA1MCU7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSB0cmFuc2xhdGVZKC01MCUpO1xcbiAgfVxcblwiXSkpLFwiIzY2NlwiLFwiIzk5OVwiKSxiPXQuZGl2KHZ8fCh2PWQoW1wiXFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgZmxleC1ncm93OiAxO1xcbiAgJiA+IHNwYW4ge1xcbiAgICBmb250LXNpemU6IDEycHg7XFxuICAgIGNvbG9yOiBcIixcIjtcXG4gIH1cXG4gIC5maWxlLXR5cGVzIHtcXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxuICAgIG1heC13aWR0aDogMTAwcHg7XFxuICB9XFxuXCJdLFtcIlxcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIGZsZXgtZ3JvdzogMTtcXG4gICYgPiBzcGFuIHtcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcbiAgICBjb2xvcjogXCIsXCI7XFxuICB9XFxuICAuZmlsZS10eXBlcyB7XFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgICBtYXgtd2lkdGg6IDEwMHB4O1xcbiAgfVxcblwiXSkpLChmdW5jdGlvbihuKXtyZXR1cm4gbi5lcnJvcj9cInJlZFwiOlwiIzY2NlwifSkpLHc9dC5zcGFuKGh8fChoPWQoW1wiXFxuICBmb250LXNpemU6IDE0cHg7XFxuICBjb2xvcjogXCIsXCI7XFxuICBzcGFuIHtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxuICB9XFxuXCJdLFtcIlxcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgY29sb3I6IFwiLFwiO1xcbiAgc3BhbiB7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcbiAgfVxcblwiXSkpLFwiIzY2NlwiKSx5PWZ1bmN0aW9uKG4pe3JldHVybiBuLzFlMy8xZTN9LHo9ZnVuY3Rpb24obil7cmV0dXJuIHZvaWQgMD09PW4/XCJcIjpuLm1hcCgoZnVuY3Rpb24obil7cmV0dXJuXCIuXCIuY29uY2F0KG4udG9Mb3dlckNhc2UoKSl9KSkuam9pbihcIixcIil9O2Z1bmN0aW9uIEwoZSl7dmFyIHI9ZS50eXBlcyx0PWUubWluU2l6ZSxvPWUubWF4U2l6ZTtpZihyKXt2YXIgaT1yLnRvU3RyaW5nKCksYT1cIlwiO3JldHVybiBvJiYoYSs9XCJzaXplID49IFwiLmNvbmNhdChvLFwiLCBcIikpLHQmJihhKz1cInNpemUgPD0gXCIuY29uY2F0KHQsXCIsIFwiKSksbihcInNwYW5cIixwKHt0aXRsZTpcIlwiLmNvbmNhdChhLFwidHlwZXM6IFwiKS5jb25jYXQoaSksY2xhc3NOYW1lOlwiZmlsZS10eXBlc1wifSx7Y2hpbGRyZW46aX0pLHZvaWQgMCl9cmV0dXJuIG51bGx9ZnVuY3Rpb24gQygpe3JldHVybiBlKFwic3ZnXCIscCh7d2lkdGg6XCIzMlwiLGhlaWdodDpcIjMyXCIsdmlld0JveDpcIjAgMCAzMiAzMlwiLGZpbGw6XCJub25lXCIseG1sbnM6XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wifSx7Y2hpbGRyZW46W24oXCJwYXRoXCIse2Q6XCJNNS4zMzMxNyA2LjY2NjY3SDIyLjY2NjVWMTZIMjUuMzMzMlY2LjY2NjY3QzI1LjMzMzIgNS4xOTYgMjQuMTM3MiA0IDIyLjY2NjUgNEg1LjMzMzE3QzMuODYyNSA0IDIuNjY2NSA1LjE5NiAyLjY2NjUgNi42NjY2N1YyMi42NjY3QzIuNjY2NSAyNC4xMzczIDMuODYyNSAyNS4zMzMzIDUuMzMzMTcgMjUuMzMzM0gxNS45OTk4VjIyLjY2NjdINS4zMzMxN1Y2LjY2NjY3WlwiLGZpbGw6XCIjMDY1OEMyXCJ9LHZvaWQgMCksbihcInBhdGhcIix7ZDpcIk0xMC42NjY1IDE0LjY2NjdMNi42NjY1IDIwSDIxLjMzMzJMMTUuOTk5OCAxMkwxMS45OTk4IDE3LjMzMzNMMTAuNjY2NSAxNC42NjY3WlwiLGZpbGw6XCIjMDY1OEMyXCJ9LHZvaWQgMCksbihcInBhdGhcIix7ZDpcIk0yNS4zMzMyIDE4LjY2NjdIMjIuNjY2NVYyMi42NjY3SDE4LjY2NjVWMjUuMzMzM0gyMi42NjY1VjI5LjMzMzNIMjUuMzMzMlYyNS4zMzMzSDI5LjMzMzJWMjIuNjY2N0gyNS4zMzMyVjE4LjY2NjdaXCIsZmlsbDpcIiMwNjU4QzJcIn0sdm9pZCAwKV19KSx2b2lkIDApfXZhciBIPTA7dmFyIGs9ZnVuY3Rpb24odCxvLGksYSxsKXtyZXR1cm4gaT9uKFwic3BhblwiLHtjaGlsZHJlbjpcIkZpbGUgdHlwZS9zaXplIGVycm9yLCBIb3ZlcmVkIG9uIHR5cGVzIVwifSx2b2lkIDApOm4odyx7Y2hpbGRyZW46YT9uKFwic3BhblwiLHtjaGlsZHJlbjpcIlVwbG9hZCBkaXNhYmxlZFwifSx2b2lkIDApOnR8fG8/ZShyLHtjaGlsZHJlbjpbbihcInNwYW5cIix7Y2hpbGRyZW46XCJVcGxvYWRlZCBTdWNjZXNzZnVsbHkhXCJ9LHZvaWQgMCksXCIgVXBsb2FkIGFub3RoZXI/XCJdfSx2b2lkIDApOm4ocix7Y2hpbGRyZW46ZShyLGw/e2NoaWxkcmVuOltuKFwic3BhblwiLHtjaGlsZHJlbjpsLnNwbGl0KFwiIFwiKVswXX0sdm9pZCAwKSxcIiBcIixsLnN1YnN0cihsLmluZGV4T2YoXCIgXCIpKzEpXX06e2NoaWxkcmVuOltuKFwic3BhblwiLHtjaGlsZHJlbjpcIlVwbG9hZFwifSx2b2lkIDApLFwiIG9yIGRyb3AgYSBmaWxlIHJpZ2h0IGhlcmVcIl19LHZvaWQgMCl9LHZvaWQgMCl9LHZvaWQgMCl9LEU9ZnVuY3Rpb24odCl7dmFyIG89dC5uYW1lLGQ9dC5ob3ZlclRpdGxlLGM9dC50eXBlcyx1PXQuaGFuZGxlQ2hhbmdlLGY9dC5jbGFzc2VzLHY9dC5jaGlsZHJlbixoPXQubWF4U2l6ZSx4PXQubWluU2l6ZSx3PXQuZmlsZU9yRmlsZXMsRT10Lm9uU2l6ZUVycm9yLFM9dC5vblR5cGVFcnJvcixWPXQub25TZWxlY3QsRD10Lm9uRHJvcCxQPXQuZGlzYWJsZWQsaj10LmxhYmVsLEY9dC5tdWx0aXBsZSxPPXQucmVxdWlyZWQsUj10Lm9uRHJhZ2dpbmdTdGF0ZUNoYW5nZSxUPXQuZHJvcE1lc3NhZ2VTdHlsZSxNPXMobnVsbCksVT1zKG51bGwpLFo9aSghMSkscT1aWzBdLE49WlsxXSxYPWkobnVsbCksWT1YWzBdLEI9WFsxXSxBPWkoITEpLEc9QVswXSxJPUFbMV0sSj1mdW5jdGlvbihuKXtyZXR1cm4gYyYmIWZ1bmN0aW9uKG4sZSl7dmFyIHI9bi5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKTtyZXR1cm4gZS5tYXAoKGZ1bmN0aW9uKG4pe3JldHVybiBuLnRvTG93ZXJDYXNlKCl9KSkuaW5jbHVkZXMoci50b0xvd2VyQ2FzZSgpKX0obixjKT8oSSghMCksUyYmUyhcIkZpbGUgdHlwZSBpcyBub3Qgc3VwcG9ydGVkXCIpLCExKTpoJiZ5KG4uc2l6ZSk+aD8oSSghMCksRSYmRShcIkZpbGUgc2l6ZSBpcyB0b28gYmlnXCIpLCExKTohKHgmJnkobi5zaXplKTx4KXx8KEkoITApLEUmJkUoXCJGaWxlIHNpemUgaXMgdG9vIHNtYWxsXCIpLCExKX0sSz1mdW5jdGlvbihuKXt2YXIgZT0hMTtpZihuKXtpZihuIGluc3RhbmNlb2YgRmlsZSllPSFKKG4pO2Vsc2UgZm9yKHZhciByPTA7cjxuLmxlbmd0aDtyKyspe3ZhciB0PW5bcl07ZT0hSih0KXx8ZX1yZXR1cm4hZSYmKHUmJnUobiksQihuKSxOKCEwKSxJKCExKSwhMCl9cmV0dXJuITF9LFE9ZnVuY3Rpb24obil7dmFyIGU9bi5sYWJlbFJlZixyPW4uaW5wdXRSZWYsdD1uLm11bHRpcGxlLG89bi5oYW5kbGVDaGFuZ2VzLHM9bi5vbkRyb3AscD1pKCExKSxkPXBbMF0sYz1wWzFdLHU9YSgoZnVuY3Rpb24oKXtyLmN1cnJlbnQuY2xpY2soKX0pLFtyXSksZj1hKChmdW5jdGlvbihuKXtuLnByZXZlbnREZWZhdWx0KCksbi5zdG9wUHJvcGFnYXRpb24oKSxIKyssbi5kYXRhVHJhbnNmZXIuaXRlbXMmJjAhPT1uLmRhdGFUcmFuc2Zlci5pdGVtcy5sZW5ndGgmJmMoITApfSksW10pLHY9YSgoZnVuY3Rpb24obil7bi5wcmV2ZW50RGVmYXVsdCgpLG4uc3RvcFByb3BhZ2F0aW9uKCksLS1IPjB8fGMoITEpfSksW10pLGg9YSgoZnVuY3Rpb24obil7bi5wcmV2ZW50RGVmYXVsdCgpLG4uc3RvcFByb3BhZ2F0aW9uKCl9KSxbXSkseD1hKChmdW5jdGlvbihuKXtuLnByZXZlbnREZWZhdWx0KCksbi5zdG9wUHJvcGFnYXRpb24oKSxjKCExKSxIPTA7dmFyIGU9bi5kYXRhVHJhbnNmZXIuZmlsZXM7aWYoZSYmZS5sZW5ndGg+MCl7dmFyIHI9dD9lOmVbMF0saT1vKHIpO3MmJmkmJnMocil9fSksW29dKTtyZXR1cm4gbCgoZnVuY3Rpb24oKXt2YXIgbj1lLmN1cnJlbnQ7cmV0dXJuIG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdSksbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsZiksbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsdiksbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIixoKSxuLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIseCksZnVuY3Rpb24oKXtuLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLHUpLG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLGYpLG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLHYpLG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsaCksbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJvcFwiLHgpfX0pLFt1LGYsdixoLHgsZV0pLGR9KHtsYWJlbFJlZjpNLGlucHV0UmVmOlUsbXVsdGlwbGU6RixoYW5kbGVDaGFuZ2VzOkssb25Ecm9wOkR9KTtyZXR1cm4gbCgoZnVuY3Rpb24oKXtudWxsPT1SfHxSKFEpfSksW1FdKSxsKChmdW5jdGlvbigpe3c/KE4oITApLEIodykpOihVLmN1cnJlbnQmJihVLmN1cnJlbnQudmFsdWU9XCJcIiksTighMSksQihudWxsKSl9KSxbd10pLGUoZyxwKHtvdmVyUmlkZTp2LGNsYXNzTmFtZTpcIlwiLmNvbmNhdChmfHxcIlwiLFwiIFwiKS5jb25jYXQoUD9cImlzLWRpc2FibGVkXCI6XCJcIikscmVmOk0saHRtbEZvcjpvLG9uQ2xpY2s6ZnVuY3Rpb24obil7bi5wcmV2ZW50RGVmYXVsdCgpLG4uc3RvcFByb3BhZ2F0aW9uKCl9fSx7Y2hpbGRyZW46W24oXCJpbnB1dFwiLHtvbkNsaWNrOmZ1bmN0aW9uKG4pe24uc3RvcFByb3BhZ2F0aW9uKCksVSYmVS5jdXJyZW50JiYoVS5jdXJyZW50LnZhbHVlPVwiXCIsVS5jdXJyZW50LmNsaWNrKCkpfSxvbkNoYW5nZTpmdW5jdGlvbihuKXt2YXIgZT1uLnRhcmdldC5maWxlcyxyPUY/ZTplWzBdLHQ9SyhyKTtWJiZ0JiZWKHIpfSxhY2NlcHQ6eihjKSxyZWY6VSx0eXBlOlwiZmlsZVwiLG5hbWU6byxkaXNhYmxlZDpQLG11bHRpcGxlOkYscmVxdWlyZWQ6T30sdm9pZCAwKSxRJiZuKG0scCh7c3R5bGU6VH0se2NoaWxkcmVuOm4oXCJzcGFuXCIse2NoaWxkcmVuOmR8fFwiRHJvcCBIZXJlXCJ9LHZvaWQgMCl9KSx2b2lkIDApLCF2JiZlKHIse2NoaWxkcmVuOltuKEMse30sdm9pZCAwKSxlKGIscCh7ZXJyb3I6R30se2NoaWxkcmVuOltrKFkscSxHLFAsaiksbihMLHt0eXBlczpjLG1pblNpemU6eCxtYXhTaXplOmh9LHZvaWQgMCldfSksdm9pZCAwKV19LHZvaWQgMCksdl19KSx2b2lkIDApfTtleHBvcnR7RSBhcyBGaWxlVXBsb2FkZXJ9O1xuIl0sIm5hbWVzIjpbInAiLCJPYmplY3QiLCJhc3NpZ24iLCJuIiwiZSIsInIiLCJ0IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwibyIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImFwcGx5IiwidGhpcyIsImQiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwicmF3IiwiYyIsInUiLCJmIiwidiIsImgiLCJ4IiwiZyIsImxhYmVsIiwib3ZlclJpZGUiLCJtIiwiZGl2IiwiYiIsImVycm9yIiwidyIsInNwYW4iLCJ5IiwiTCIsInR5cGVzIiwibWluU2l6ZSIsIm1heFNpemUiLCJpIiwidG9TdHJpbmciLCJhIiwiY29uY2F0IiwidGl0bGUiLCJjbGFzc05hbWUiLCJjaGlsZHJlbiIsIkMiLCJ3aWR0aCIsImhlaWdodCIsInZpZXdCb3giLCJmaWxsIiwieG1sbnMiLCJIIiwiayIsImwiLCJzcGxpdCIsInN1YnN0ciIsImluZGV4T2YiLCJFIiwibmFtZSIsImhvdmVyVGl0bGUiLCJoYW5kbGVDaGFuZ2UiLCJjbGFzc2VzIiwiZmlsZU9yRmlsZXMiLCJvblNpemVFcnJvciIsIlMiLCJvblR5cGVFcnJvciIsIlYiLCJvblNlbGVjdCIsIkQiLCJvbkRyb3AiLCJQIiwiZGlzYWJsZWQiLCJqIiwiRiIsIm11bHRpcGxlIiwiTyIsInJlcXVpcmVkIiwiUiIsIm9uRHJhZ2dpbmdTdGF0ZUNoYW5nZSIsIlQiLCJkcm9wTWVzc2FnZVN0eWxlIiwiTSIsIlUiLCJaIiwicSIsIk4iLCJYIiwiWSIsIkIiLCJBIiwiRyIsIkkiLCJKIiwicG9wIiwibWFwIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInNpemUiLCJLIiwiRmlsZSIsIlEiLCJsYWJlbFJlZiIsImlucHV0UmVmIiwiaGFuZGxlQ2hhbmdlcyIsInMiLCJjdXJyZW50IiwiY2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImRhdGFUcmFuc2ZlciIsIml0ZW1zIiwiZmlsZXMiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlZiIsImh0bWxGb3IiLCJvbkNsaWNrIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJhY2NlcHQiLCJqb2luIiwidHlwZSIsInN0eWxlIl0sInNvdXJjZVJvb3QiOiIifQ==