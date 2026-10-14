import { validateExam, type Exam } from '../schemas/content';
const manifests=import.meta.glob<{default:{id:string;providerId:string;code:string;status:string;title:string;level:string;category:string}}>('../exams/*/manifest.json',{eager:true});
export const builtInExams=Object.values(manifests).map(m=>m.default);
// Vite bundles each exam separately. Adding a manifest file needs no UI edit.
const files=import.meta.glob<{default:unknown}>('../exams/*/exam.json');
export async function loadExam(id:string):Promise<Exam>{
 const loader=files['../exams/'+id+'/exam.json'];if(!loader)throw new Error('Examen no registrado: '+id);
 return validateExam((await loader()).default);
}
