import { spawnSync } from 'node:child_process';
for(const script of ['editorial.py','review-assessments.py','add-assessments.py','labs-editorial.py','build-content.py']){const r=spawnSync(process.platform==='win32'?'python':'python3',['scripts/'+script],{stdio:'inherit'});if(r.status)process.exit(r.status);}
