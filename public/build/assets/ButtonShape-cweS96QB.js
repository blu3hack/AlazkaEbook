import{j as e}from"./app-CJInfCY7.js";function l({label:a,icon:r,color:t,gradientFrom:o,gradientTo:s,onClick:i}){return e.jsx("button",{onClick:i,className:"group relative overflow-hidden",children:e.jsxs("div",{className:`relative flex flex-col items-center gap-2 px-6 py-5 
                            bg-white hover:bg-gray-50
                            border border-gray-200 hover:border-${t}-200
                            rounded-xl shadow-sm hover:shadow-lg
                            transition-all duration-300 ease-out
                            hover:scale-105 hover:-translate-y-1
                            active:scale-100 active:translate-y-0`,children:[e.jsx("div",{className:`absolute inset-0 bg-gradient-to-r from-${o} to-${s} opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-xl`}),r&&e.jsx("div",{className:"relative text-4xl group-hover:scale-110 transition-transform duration-300",children:e.jsx("span",{className:`text-slate-600 group-hover:text-${t}-600 transition-colors duration-300`,children:r})}),e.jsx("span",{className:`relative text-sm font-medium text-slate-700 group-hover:text-${t}-700 transition-colors duration-300`,children:a})]})})}export{l as default};
