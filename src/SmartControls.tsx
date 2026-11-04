import {useEffect} from 'react'

/** Compact accessible 12-hour time selector; emits a normalized HH:mm value. */
export default function SmartTimeInput({value='',onChange,disabled=false,label='Time'}:{value?:string;onChange:(value:string)=>void;disabled?:boolean;label?:string}){
 const m=/^(\d{2}):(\d{2})$/.exec(value)
 const h=m?Number(m[1]):0, minute=m?Number(m[2]):0
 const hour12=h%12||12
 const change=(hour:number,min:number,period:string)=>{
  const hour24=hour%12+(period==='PM'?12:0)
  onChange(`${String(hour24).padStart(2,'0')}:${String(min).padStart(2,'0')}`)
 }
 const period=h>=12?'PM':'AM'
 return <div className="smart-time-input" role="group" aria-label={label}>
  <select aria-label={`${label} hour`} disabled={disabled} value={hour12} onChange={e=>change(Number(e.target.value),minute,period)}>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{String(i+1).padStart(2,'0')}</option>)}</select>
  <span aria-hidden="true">:</span>
  <select aria-label={`${label} minute`} disabled={disabled} value={minute} onChange={e=>change(hour12,Number(e.target.value),period)}>{Array.from({length:60},(_,i)=><option key={i} value={i}>{String(i).padStart(2,'0')}</option>)}</select>
  <select aria-label={`${label} AM or PM`} disabled={disabled} value={period} onChange={e=>change(hour12,minute,e.target.value)}><option value="AM">AM</option><option value="PM">PM</option></select>
 </div>
}

/** Adds grab-to-scroll to existing Ant Design wide tables, without hijacking clicks or text selection. */
export function useTableDragScroll(){
 useEffect(()=>{
  const state={node:null as HTMLElement|null,startX:0,startScroll:0,startY:0,dragged:false}
  const down=(e:PointerEvent)=>{
   if(e.button!==0||e.pointerType==='touch')return
   const target=e.target as HTMLElement
   if(target.closest('button,a,input,select,textarea,[role="button"],.ant-pagination'))return
   const node=target.closest('.ant-table-body,.ant-table-content') as HTMLElement|null
   if(!node||node.scrollWidth<=node.clientWidth+2)return
   state.node=node;state.startX=e.clientX;state.startY=e.clientY;state.startScroll=node.scrollLeft;state.dragged=false
  }
  const move=(e:PointerEvent)=>{
   if(!state.node)return
   const dx=e.clientX-state.startX,dy=e.clientY-state.startY
   if(!state.dragged&&Math.abs(dx)<6)return
   if(!state.dragged&&Math.abs(dy)>Math.abs(dx)){state.node=null;return}
   state.dragged=true;state.node.classList.add('table-grabbing');state.node.scrollLeft=state.startScroll-dx
   e.preventDefault()
  }
  const up=()=>{state.node?.classList.remove('table-grabbing');state.node=null}
  const cancelClick=(e:MouseEvent)=>{if(state.dragged){e.preventDefault();e.stopPropagation();state.dragged=false}}
  document.addEventListener('pointerdown',down,true);document.addEventListener('pointermove',move,{capture:true,passive:false});document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);document.addEventListener('click',cancelClick,true)
  return ()=>{document.removeEventListener('pointerdown',down,true);document.removeEventListener('pointermove',move,true);document.removeEventListener('pointerup',up,true);document.removeEventListener('pointercancel',up,true);document.removeEventListener('click',cancelClick,true)}
 },[])
}
