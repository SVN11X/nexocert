export type Provider = { id: string; name: string; initials: string; color: string; description: string; officialUrl: string; status: 'available'|'planned' };
export const providers: Provider[] = [
 {id:'microsoft',name:'Microsoft',initials:'MS',color:'#2c70bc',description:'Azure, IA y plataformas empresariales',officialUrl:'https://learn.microsoft.com/credentials/',status:'available'},
 {id:'aws',name:'Amazon Web Services',initials:'AWS',color:'#be792a',description:'Arquitectura y servicios de nube',officialUrl:'https://aws.amazon.com/certification/',status:'planned'},
 {id:'gcp',name:'Google Cloud',initials:'GC',color:'#4d7d50',description:'Datos, IA e infraestructura',officialUrl:'https://cloud.google.com/learn/certification',status:'planned'},
 {id:'oracle',name:'Oracle',initials:'OR',color:'#b05249',description:'OCI, bases de datos y aplicaciones',officialUrl:'https://education.oracle.com/',status:'planned'},
 {id:'hashicorp',name:'HashiCorp',initials:'HC',color:'#7352a2',description:'Terraform e infraestructura como código',officialUrl:'https://developer.hashicorp.com/certifications',status:'planned'},
 {id:'sap',name:'SAP',initials:'SAP',color:'#367d90',description:'Plataformas y procesos empresariales',officialUrl:'https://learning.sap.com/certifications',status:'planned'}
];
