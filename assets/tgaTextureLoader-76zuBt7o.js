import{bI as r,bJ as n}from"./index-UsGQmXg2.js";class d{constructor(){this.supportCascades=!1}loadCubeData(){throw".env not supported in Cube."}loadData(e,t,o){const s=new Uint8Array(e.buffer,e.byteOffset,e.byteLength),a=r(s);o(a.width,a.height,t.generateMipMaps,!1,()=>{n(t,s)})}}export{d as _TGATextureLoader};
