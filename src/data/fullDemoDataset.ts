/** Coordinated, synthetic-only dataset for the NREE DEMO tenant.
 * Stable IDs make cross-module relationships repeatable and resettable.
 * No generated record represents a real employee or production transaction.
 */
const companyId = 'co-nree'
const source = 'Synthetic demo dataset v0.9.21'
const employees = [
  ['DEMO-EMP-001','Amina Akter','HR Officer','HUMAN RESOURCES','Dhaka Head Office','amina.akter'],
  ['DEMO-EMP-002','Rahim Uddin','Production Supervisor','PRODUCTION','Factory A','rahim.uddin'],
  ['DEMO-EMP-003','Nusrat Jahan','Accounts Executive','FINANCE','Dhaka Head Office','nusrat.jahan'],
  ['DEMO-EMP-004','Tanvir Hasan','IT Support Engineer','INFORMATION TECHNOLOGY','Dhaka Head Office','tanvir.hasan'],
  ['DEMO-EMP-005','Shila Begum','Quality Inspector','QUALITY','Factory A','shila.begum'],
  ['DEMO-EMP-006','Imran Hossain','Store Officer','STORE','Factory B','imran.hossain'],
].map(([id,name,title,dept,branch,email],i)=>({id,employeeCode:id,name,title,designation:title,dept,department:dept,branch,unit:i<2?'UNIT-A':i<4?'UNIT-HO':'UNIT-B',floor:i===1||i===4?'FLOOR-2':'FLOOR-1',lineInfo:i===1?'LINE-01':i===4?'LINE-QA':'',email:`${email}@nree-demo.example.test`,phone:`+88017000000${String(i+1).padStart(2,'0')}`,companyId,status:'Active',joiningDate:`202${i%4}-0${(i%8)+1}-15`,dateOfJoining:`202${i%4}-0${(i%8)+1}-15`,employmentType:'Permanent',recordSource:source,dataQualityNote:'Synthetic test record. Not a real person or production HR record.'}))
const shifts = [
  {id:'DEMO-SHIFT-DAY',companyId,name:'General Day Shift',start:'09:00',end:'18:00',breakMin:60,lateGrace:10,earlyGrace:10,status:'Active'},
  {id:'DEMO-SHIFT-A',companyId,name:'Production A Shift',start:'07:00',end:'15:00',breakMin:45,lateGrace:5,earlyGrace:5,status:'Active'},
  {id:'DEMO-SHIFT-NIGHT',companyId,name:'Production Night Shift',start:'23:00',end:'07:00',breakMin:45,lateGrace:5,earlyGrace:5,status:'Active'},
]
const assignments = employees.map((e,i)=>({id:`DEMO-AS-${i+1}`,companyId,employeeId:e.id,employeeName:e.name,shiftId:i===1||i===4?'DEMO-SHIFT-A':i===5?'DEMO-SHIFT-NIGHT':'DEMO-SHIFT-DAY',effectiveFrom:'2026-11-01',effectiveTo:'',status:'Active',recordSource:source}))
const rosters = employees.map((e,i)=>{const shift=shifts.find(s=>s.id===assignments[i].shiftId)!;const date=`2026-11-${String(i+2).padStart(2,'0')}`;const published=i!==5;return{id:`DEMO-ROSTER-${i+1}`,companyId,employeeId:e.id,employeeName:e.name,shiftId:shift.id,shiftName:shift.name,date,status:published?'Published':'Draft',...(published?{publishedAt:`${date}T02:00:00.000Z`,publishedBy:'Demo HR Manager'}:{}),recordSource:source}})
const leaveBalances = employees.flatMap((e,i)=>['Annual Leave','Casual Leave','Sick Leave'].map((type,j)=>({id:`DEMO-BAL-${i+1}-${j+1}`,companyId,employeeId:e.id,employeeName:e.name,type,entitled:[18,10,14][j],used:i%3===0?2:0,remaining:[18,10,14][j]-(i%3===0?2:0),recordedBy:'Demo HR Manager',recordSource:source})))
const leave = [
  {id:'DEMO-LEAVE-001',companyId,employeeId:employees[1].id,employee:employees[1].name,type:'Annual Leave',dates:'2026-11-05 to 2026-11-06',days:2,reason:'Personal family commitment',status:'Pending Level 1 approval',approvalSteps:[{level:1,role:'Reporting Manager',status:'Pending'},{level:2,role:'HR Manager',status:'Waiting'}],recordSource:source},
  {id:'DEMO-LEAVE-002',companyId,employeeId:employees[2].id,employee:employees[2].name,type:'Casual Leave',dates:'2026-11-10',days:1,reason:'Personal appointment',status:'Pending Level 2 approval',approvalSteps:[{level:1,role:'Reporting Manager',status:'Approved',actor:'Demo Department Manager',at:'2026-10-30T10:00:00.000Z'},{level:2,role:'HR Manager',status:'Waiting'}],recordSource:source},
  {id:'DEMO-LEAVE-003',companyId,employeeId:employees[4].id,employee:employees[4].name,type:'Sick Leave',dates:'2026-10-28',days:1,reason:'Fever and rest',status:'Approved',approvalSteps:[{level:1,role:'Reporting Manager',status:'Approved',actor:'Demo Department Manager',at:'2026-10-27T09:00:00.000Z'},{level:2,role:'HR Manager',status:'Approved',actor:'Demo HR Manager',at:'2026-10-27T11:00:00.000Z'}],recordSource:source},
]
const punches = employees.slice(0,5).map((e,i)=>({id:`DEMO-PUNCH-${i+1}`,companyId,employeeId:e.id,employee:e.name,card:`CARD-${String(i+1).padStart(4,'0')}`,time:`2026-11-02T${String(8+i%2).padStart(2,'0')}:${String(5+i*7).padStart(2,'0')}:00`,device:i===4?'DEMO-DEVICE-02':'DEMO-DEVICE-01',deviceId:i===4?'DEMO-DEVICE-02':'DEMO-DEVICE-01',status:i===3?'Review required':'Accepted',recordSource:source}))
const policies = [
  {id:'DEMO-POL-001',companyId,name:'Annual Leave Policy',category:'Leave',version:'1.0',status:'Draft',effectiveFrom:'2026-11-01',description:'Illustrative annual leave entitlement and application rules.',recordSource:source},
  {id:'DEMO-POL-002',companyId,name:'Attendance Grace Policy',category:'Attendance',version:'1.0',status:'For review',effectiveFrom:'2026-11-01',description:'Illustrative late and early grace configuration.',recordSource:source},
  {id:'DEMO-POL-003',companyId,name:'Work Schedule Policy',category:'Shift & Roster',version:'1.0',status:'Draft',effectiveFrom:'2026-11-01',description:'Illustrative shift assignment and roster publication rules.',recordSource:source},
]
const audit = [
  ['Demo HR Manager','Recorded leave balance','6 employees · three leave types','Success'],
  ['Demo HR Manager','Published monthly roster','5 Published · 1 Draft','Success'],
  ['Demo Department Manager','Approved leave at Level 1','DEMO-LEAVE-002','Success'],
  ['Demo HR Manager','Created policy draft','Annual Leave Policy v1.0','Success'],
  ['Demo Attendance Operator','Imported sample punch events','5 events · 1 review required','Success'],
].map(([actor,action,target,result],i)=>({id:`DEMO-AUDIT-${i+1}`,time:`2026-11-02T0${9+i}:00:00.000Z`,actor,action,target,result,companyId,recordSource:source}))
const users = [
  {name:'Demo Platform Admin',email:'platform.admin@nree-demo.example.test',persona:'Platform Superadmin',role:'Superadmin',companyId:null,recordSource:source},
  {name:'Demo Company Admin',email:'company.admin@nree-demo.example.test',persona:'Company Admin',role:'Company Administrator',companyId,recordSource:source},
  {name:'Demo HR Manager',email:'hr.manager@nree-demo.example.test',persona:'HR Manager',role:'HR Manager',companyId,recordSource:source},
  {name:'Demo Department Manager',email:'dept.manager@nree-demo.example.test',persona:'Department Manager',role:'Department Manager',companyId,recordSource:source},
  {name:'Amina Akter',email:'amina.akter@nree-demo.example.test',persona:'Employee',role:'Employee',companyId,employeeId:employees[0].id,recordSource:source},
]
const roles = [
  {name:'Platform Superadmin',scope:'Platform',perms:['company.enroll','company.view','module.configure','platform.audit']},
  {name:'Company Administrator',scope:'Company',perms:['company.configure','employee.view','user.manage','company.audit']},
  {name:'HR Manager',scope:'Company',perms:['employee.manage','attendance.manage','leave.manage','roster.publish']},
  {name:'Department Manager',scope:'Assigned departments',perms:['team.view','attendance.view','leave.level1.review']},
  {name:'Employee',scope:'Self',perms:['profile.view','attendance.self.view','leave.self.apply','roster.self.view']},
].map(r=>({...r,recordSource:source}))
export function buildFullDemoDataset(){
  return {data:{employees:[...employees],punches,leave,users,roles,policies,audit,leaveBalances},shifts,assignments,rosters}
}
