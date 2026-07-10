const p=(l,d="success")=>{const o=document.createElement("div");o.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;const r={success:{color:"#10b981",icon:"✅",title:"Berhasil!"},error:{color:"#ef4444",icon:"❌",title:"Error!"},warning:{color:"#f59e0b",icon:"⚠️",title:"Peringatan!"},info:{color:"#3b82f6",icon:"ℹ️",title:"Informasi"}},e=r[d]||r.success,t=document.createElement("div");t.style.cssText=`
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        padding: 30px;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        max-width: 420px;
        min-width: 320px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        transform: scale(0.7);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
    `;const i=document.createElement("div");i.style.cssText=`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 20% 80%, ${e.color}08 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, ${e.color}08 0%, transparent 50%);
        z-index: -1;
    `,t.appendChild(i),t.innerHTML+=`
        <div style="font-size: 48px; margin-bottom: 16px; animation: bounce 0.6s ease-out;">
            ${e.icon}
        </div>
        <h3 style="color: ${e.color}; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
            ${e.title}
        </h3>
        <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px;">${l}</p>
        <button onclick="closeAlert(this)" 
            style="background: linear-gradient(135deg, ${e.color} 0%, ${e.color}dd 100%);
            color: white; border: none; padding: 12px 32px; border-radius: 8px; cursor: pointer; font-size: 16px;">
            OK
        </button>
    `;const n=document.createElement("style");n.textContent=`
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `,document.head.appendChild(n),window.closeAlert=function(s){const a=s.closest('[style*="position: fixed"]'),c=s.closest('[style*="background: linear-gradient"]');c.style.transform="scale(0.8)",c.style.opacity="0",a.style.opacity="0",setTimeout(()=>{a.remove(),n.remove()},300)},o.appendChild(t),document.body.appendChild(o),requestAnimationFrame(()=>{o.style.opacity="1",t.style.transform="scale(1)"}),setTimeout(()=>{document.body.contains(o)&&window.closeAlert(t.querySelector("button"))},5e3)};export{p as s};
