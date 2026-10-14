export type Review = { repetitions:number; interval:number; ease:number; due:string; last:string; difficult:boolean; history:{date:string;quality:number}[] };
export function schedule(previous:Review|undefined, quality:0|3|4|5, now=new Date()):Review {
 const p=previous??{repetitions:0,interval:0,ease:2.5,due:now.toISOString(),last:'',difficult:false,history:[]};
 const repetitions=quality<3?0:p.repetitions+1;
 const ease=Math.max(1.3,p.ease+0.1-(5-quality)*(0.08+(5-quality)*0.02));
 const interval=quality<3?1:repetitions===1?1:repetitions===2?6:Math.max(1,Math.round(p.interval*p.ease));
 return {repetitions,interval,ease,due:new Date(now.getTime()+interval*86400000).toISOString(),last:now.toISOString(),difficult:quality<=3,history:[...p.history,{date:now.toISOString(),quality}].slice(-100)};
}
