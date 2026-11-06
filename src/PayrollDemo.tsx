import {useMemo,useState} from 'react'
import {Alert,Button,Card,Col,InputNumber,Row,Space,Statistic,Table,Tag,Typography,message} from 'antd'
import * as XLSX from 'xlsx'
const {Title,Text}=Typography
type Employee={id:string;employeeCode?:string;name:string;dept?:string;department?:string;companyId:string}
type Salary={gross:number;payableDays:number;otherDeduction:number}
const monthNow=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit'}).format(new Date())
const round=(n:number)=>Math.round(n*100)/100
export default function PayrollDemo({employees,companyId,role}:{employees:Employee[];companyId:string;role:string}){
 const [month,setMonth]=useState(monthNow)
 const key=`next-hrms-payroll-uat-v0955:${companyId}:${month}`
 const [status,setStatus]=useState<'Draft'>(()=>'Draft')
 const [salary,setSalary]=useState<Record<string,Salary>>({})
 const [prepared,setPrepared]=useState(false)
 const people=useMemo(()=>employees.filter(e=>e.companyId===companyId).slice(0,50),[employees,companyId])
 const load=(m:string)=>{setMonth(m);setStatus('Draft');try{const x=JSON.parse(localStorage.getItem(`next-hrms-payroll-uat-v0955:${companyId}:${m}`)||'{}');setSalary(x);setPrepared(Object.keys(x).length>0)}catch{setSalary({});setPrepared(false)}}
 const update=(id:string,field:keyof Salary,value:number)=>{const next={...salary,[id]:{...salary[id],[field]:value}};setSalary(next);localStorage.setItem(key,JSON.stringify(next));setStatus('Draft')}
 const prepare=()=>{if(!['hr','company'].includes(role))return;const days=new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate();const next={...salary};people.forEach((e,i)=>{if(!next[e.id])next[e.id]={gross:18000+(i%8)*2500,payableDays:days-(i%9===0?1:0),otherDeduction:i%11===0?250:0}});setSalary(next);localStorage.setItem(key,JSON.stringify(next));setPrepared(true);setStatus('Draft');message.success('Demo salary data prepared; existing employee values preserved')}
 const days=new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate()
 const rows=people.filter(e=>salary[e.id]).map(e=>{const v=salary[e.id];const basic=round(v.gross*0.6),house=round(v.gross*0.3),medical=round(v.gross*0.1);const payable=round(v.gross*Math.max(0,Math.min(days,v.payableDays))/days);const absence=round(v.gross-payable);const net=round(Math.max(0,payable-Math.max(0,v.otherDeduction)));return {key:e.id,code:e.employeeCode||e.id,name:e.name,dept:e.dept||e.department||'—',gross:v.gross,basic,house,medical,days:Math.min(days,v.payableDays),absence,other:v.otherDeduction,net}})
 const total=(k:'gross'|'absence'|'other'|'net')=>round(rows.reduce((sum,r)=>sum+r[k],0))
 const exportFile=()=>{if(!rows.length)return;const sheet=XLSX.utils.json_to_sheet(rows.map(({key,...r})=>({...r,month,status:'DEMO DRAFT - NOT FOR PAYMENT'})));const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,sheet,'Demo Salary Register');XLSX.writeFile(book,`next_hrms_demo_salary_register_${month}.xlsx`)}
 return <><div className="page-heading"><div><Title level={2}>Salary Register — Phase 1 UAT</Title><Text type="secondary">Company-scoped demonstration payroll; not a bank-payment or production payroll register.</Text></div></div>
 <Alert className="section-row" type="warning" showIcon message="DEMO ONLY — NOT FOR PAYMENT" description="Sample salary amounts, components and payable days are synthetic. This register does not consume finalized monthly attendance, approved leave, OT, tax, provident fund or statutory rules. Do not approve for payment or use the export for bank processing."/>
 <Card className="section-row" title="Monthly draft salary register"><Space wrap style={{marginBottom:16}}><Text>Payroll month</Text><input type="month" aria-label="Payroll month" value={month} onChange={e=>load(e.target.value||month)}/><Button type="primary" disabled={!['hr','company'].includes(role)} onClick={prepare}>Prepare demo salary register</Button><Button disabled={!rows.length} onClick={exportFile}>Export demo XLSX</Button><Tag color="orange">{status} · Demo</Tag></Space>
 <Row gutter={[12,12]} style={{marginBottom:16}}><Col xs={12} md={6}><Statistic title="Employees prepared" value={rows.length}/></Col><Col xs={12} md={6}><Statistic title="Gross salary (BDT)" value={total('gross')} precision={2}/></Col><Col xs={12} md={6}><Statistic title="Total deductions (BDT)" value={round(total('absence')+total('other'))} precision={2}/></Col><Col xs={12} md={6}><Statistic title="Net payable — DEMO (BDT)" value={total('net')} precision={2}/></Col></Row>
 {!prepared&&<Alert type="info" showIcon style={{marginBottom:12}} message="No demo register prepared for this month. Click Prepare demo salary register. Existing saved values are preserved."/>}
 <Table size="small" rowKey="key" scroll={{x:1450}} pagination={{pageSize:10}} dataSource={rows} columns={[
 {title:'Employee ID',dataIndex:'code',width:120},{title:'Employee',dataIndex:'name',width:170},{title:'Department',dataIndex:'dept',width:130},
 {title:'Gross BDT',dataIndex:'gross',width:130,render:(v:number,r:any)=>['hr','company'].includes(role)?<InputNumber min={0} max={10000000} size="small" value={v} onChange={n=>update(r.key,'gross',Number(n||0))}/>:v},
 {title:'Basic 60%',dataIndex:'basic',width:105},{title:'House 30%',dataIndex:'house',width:105},{title:'Medical 10%',dataIndex:'medical',width:110},
 {title:`Payable days /${days}`,dataIndex:'days',width:130,render:(v:number,r:any)=>['hr','company'].includes(role)?<InputNumber min={0} max={days} size="small" value={v} onChange={n=>update(r.key,'payableDays',Number(n||0))}/>:v},
 {title:'Absence deduction',dataIndex:'absence',width:130},
 {title:'Other deduction',dataIndex:'other',width:140,render:(v:number,r:any)=>['hr','company'].includes(role)?<InputNumber min={0} max={10000000} size="small" value={v} onChange={n=>update(r.key,'otherDeduction',Number(n||0))}/>:v},
 {title:'Net BDT (demo)',dataIndex:'net',width:130}
 ]}/>
 <Text type="secondary">Draft values are saved locally for this browser, company and payroll month. Editing gross, payable days or deductions recalculates the draft. No payroll approval, lock, posting or payment is performed.</Text></Card></>
}
