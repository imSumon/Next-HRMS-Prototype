import SmartTimeInput from './SmartControls'
import {useMemo,useState,useEffect} from 'react'
import {Alert,Button,Card,Space,Statistic,Row,Col,Table,Tag,Typography,message,Drawer,Input,Divider} from 'antd'
import * as XLSX from 'xlsx'

type Employee={id:string;employeeCode?:string;name:string;dept?:string}
type Punch={id:string;employeeId:string;time:string;deviceId:string;source:string;status:string;note?:string}
type Correction={id:string;employeeId:string;date:string;time:string;reason:string;status:string;requestedBy:string}
type Roster={employeeId:string;date:string;status:string;shiftName?:string;shiftId?:string;shiftSnapshot?:{name?:string;start?:string;end?:string;lateGrace?:number;earlyGrace?:number}}
type Result={key:string;employeeId:string;name:string;code:string;shift:string;inTime:string;outTime:string;status:string;lateMinutes:number;earlyMinutes:number;rawCount:number;duplicateCount:number;source:string;rosterState:string}
const MINUTE=60000
const toMin=(stamp:string)=>new Date(stamp).getTime()/MINUTE
const fmt=(stamp?:string)=>stamp?stamp.slice(11,16):'—'
const exportXlsx=(rows:Result[],date:string)=>{const sheet=XLSX.utils.json_to_sheet(rows);const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,sheet,'Attendance');XLSX.writeFile(book,`attendance_${date}.xlsx`)}
export default function AttendanceProcessing({employees,punches,corrections,companyId,role,rosters,onRequestCorrection}:{employees:Employee[];punches:Punch[];corrections:Correction[];companyId:string;role:string;rosters:Roster[];onRequestCorrection?:(employeeId:string,date:string,time:string,reason:string)=>void}){
 const [date,setDate]=useState('2026-11-02')
 const [selected,setSelected]=useState<Result|null>(null)
 const [correctionTime,setCorrectionTime]=useState('')
 const [correctionReason,setCorrectionReason]=useState('')
 const [reviewReason,setReviewReason]=useState('')
 const reviewKey=`next-hrms-attendance-reviews:${companyId}`
 const [reviews,setReviews]=useState<Record<string,{outcome:string;reason:string;by:string;at:string}>>(()=>{try{return JSON.parse(localStorage.getItem(reviewKey)||'{}')}catch{return {}}})
 useEffect(()=>{try{localStorage.setItem(reviewKey,JSON.stringify(reviews))}catch{}},[reviews,reviewKey])
 const storageKey=`next-hrms-attendance-finalization:${companyId}`
 const [locks,setLocks]=useState<Record<string,{by:string;at:string;fingerprint:string}>>(()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}})
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(locks))}catch{}},[locks,storageKey])
 const canFinalize=role==='company'||role==='hr'
 const results=useMemo<Result[]>(()=>employees.map((e,i)=>{
  const published=rosters.filter(r=>r.employeeId===e.id&&r.date===date&&r.status==='Published')
  const roster=published.length===1?published[0]:undefined
  const snapshot=roster?.shiftSnapshot
  const isOff=!!roster&&(roster.shiftId==='OFF'||/weekly off/i.test(roster.shiftName||''))
  const validShift=!!roster&&!isOff&&!!snapshot&&/^([01]\d|2[0-3]):[0-5]$/.test(snapshot.start||'')&&/^([01]\d|2[0-3]):[0-5]$/.test(snapshot.end||'')
  const shift=isOff?'Weekly Off':roster?(snapshot?.name||roster.shiftName||'Published shift'):'No published roster'
  const startClock=validShift?snapshot!.start!:'08:00'
  const endClock=validShift?snapshot!.end!:'17:00'
  const startH=Number(startClock.slice(0,2)),startM=Number(startClock.slice(3,5))
  const endH=Number(endClock.slice(0,2)),endM=Number(endClock.slice(3,5))
  const shiftStart=new Date(`${date}T${startClock}:00`).getTime()/MINUTE
  let duration=(endH*60+endM)-(startH*60+startM)
  if(duration<=0)duration+=1440
  const shiftEnd=shiftStart+duration
  const windowStart=shiftStart-180,windowEnd=shiftEnd+180
  const all=punches.filter(p=>p.employeeId===e.id&&Number.isFinite(toMin(p.time))&&toMin(p.time)>=windowStart&&toMin(p.time)<=windowEnd).sort((a,b)=>a.time.localeCompare(b.time))
  const unique:Punch[]=[];let duplicates=0
  for(const p of all){if(unique.some(q=>q.id===p.id||(Math.abs(toMin(q.time)-toMin(p.time))<2&&q.deviceId===p.deviceId))){duplicates++;continue}unique.push(p)}
  const approved=corrections.filter(c=>c.employeeId===e.id&&c.date===date&&c.status==='Approved')
  const corrected=approved.map(c=>({id:c.id,employeeId:e.id,time:`${c.date}T${c.time}:00`,deviceId:'CORRECTION',source:'Approved correction',status:'Approved'}))
  const valid=[...unique.filter(p=>p.status!=='Exception'&&p.status!=='Duplicate'&&!p.source.toLowerCase().includes('manual')), ...corrected].sort((a,b)=>a.time.localeCompare(b.time))
  const first=valid[0],last=valid.length>1?valid[valid.length-1]:undefined
  const late=first&&validShift?Math.max(0,Math.floor(toMin(first.time)-shiftStart-Number(snapshot?.lateGrace||0))):0
  const early=last&&validShift?Math.max(0,Math.floor(shiftEnd-toMin(last.time)-Number(snapshot?.earlyGrace||0))):0
  const status=published.length>1?'Roster Conflict':!roster?'Missing Roster':isOff?(valid.length?'Weekly Off Worked':'Weekly Off'):!validShift?'Invalid Roster':all.some(p=>p.status==='Exception')?'Needs Review':valid.length===0?'Absent':valid.length===1?'Missing Punch':late>0?'Late':early>0?'Early Exit':'Present'
  return {key:e.id,employeeId:e.id,name:e.name,code:e.employeeCode||e.id,shift,inTime:fmt(first?.time),outTime:fmt(last?.time),status,lateMinutes:late,earlyMinutes:early,rawCount:all.length,duplicateCount:duplicates,source:corrected.length?'Device + approved correction':'Device punches',rosterState:roster?'Published':'Missing'}
 }),[employees,punches,corrections,date,rosters])
 const fingerprint=useMemo(()=>JSON.stringify({date,punches,corrections,reviews,rosters,employeeIds:employees.map(e=>e.id)}),[date,punches,corrections,reviews,rosters,employees])
 const locked=locks[date]
 const changed=!!locked&&locked.fingerprint!==fingerprint
 const pendingCorrections=corrections.filter(c=>c.date===date&&c.status==='Pending')
 const issues=results.filter(r=>['Absent','Missing Punch','Needs Review','Missing Roster','Invalid Roster','Roster Conflict','Weekly Off Worked'].includes(r.status)&&!(r.status==='Absent'&&reviews[`${date}:${r.employeeId}`]?.outcome==='Confirmed absent'))
 const unresolved=issues.length+pendingCorrections.length
 const review=(outcome:string)=>{if(!selected||!canFinalize||!reviewReason.trim())return;setReviews(p=>({...p,[`${date}:${selected.employeeId}`]:{outcome,reason:reviewReason.trim(),by:role,at:new Date().toISOString()}}));message.success('Exception review recorded; raw punches unchanged');setReviewReason('');setSelected(null)}
 const finalize=()=>{if(!canFinalize){message.error('Not authorized');return}if(unresolved){message.warning(`Resolve ${unresolved} unresolved records or pending corrections before finalizing`);return}setLocks(p=>({...p,[date]:{by:role,at:new Date().toISOString(),fingerprint}}));message.success('Attendance day finalized in browser-local prototype')}
 const columns:any[]=[{title:'Employee',dataIndex:'name'},{title:'ID',dataIndex:'code'},{title:'Published shift',dataIndex:'shift'},{title:'IN',dataIndex:'inTime'},{title:'OUT',dataIndex:'outTime'},{title:'Result',dataIndex:'status',render:(v:string)=><Tag color={v==='Present'?'green':v==='Late'?'gold':v==='Early Exit'?'orange':'red'}>{v}</Tag>},{title:'Late (min)',dataIndex:'lateMinutes'},{title:'Early (min)',dataIndex:'earlyMinutes'},{title:'Duplicates',dataIndex:'duplicateCount'},{title:'Source',dataIndex:'source'},{title:'Review',render:(_:unknown,r:Result)=><Button size="small" onClick={()=>{setSelected(r);setCorrectionTime('');setCorrectionReason('');setReviewReason('')}}>View punches / resolve</Button>}]
 return <Card title="Daily attendance processing & finalization" extra={<Space><input aria-label="Attendance processing date" type="date" value={date} onChange={e=>setDate(e.target.value)}/><Button onClick={()=>exportXlsx(results,date)}>Export XLSX</Button></Space>}>
 <Alert showIcon type="info" style={{marginBottom:12}} message="Phase 1 processing preview" description="Calculations use the selected company's raw electronic punches and approved corrections. Only published employee rosters drive shifts and weekly offs. Holidays, approved leave and OT rules are not yet integrated; do not use these results for payroll."/>
 <Row gutter={[12,12]} style={{marginBottom:16}}><Col xs={12} md={6}><Statistic title="Employees" value={results.length}/></Col><Col xs={12} md={6}><Statistic title="Present / Late / Early" value={results.filter(r=>['Present','Late','Early Exit'].includes(r.status)).length}/></Col><Col xs={12} md={6}><Statistic title="Needs exception review" value={unresolved}/></Col><Col xs={12} md={6}><Statistic title="Duplicate events ignored" value={results.reduce((n,r)=>n+r.duplicateCount,0)}/></Col></Row>
 {locked?<Alert style={{marginBottom:12}} type={changed?'warning':'success'} showIcon message={changed?'Finalized day changed — re-review required':'Day finalized (browser-local)'} description={`Finalized by ${locked.by} at ${locked.at}. Raw punches and approvals are preserved. ${changed?'New punch or correction changes detected; lock must be reviewed again.':''}`}/>:<Alert style={{marginBottom:12}} type="warning" showIcon message="Open — not finalized" description="Resolve exceptions before finalization. Electronic punches remain immutable in this view."/>}
 <Space style={{marginBottom:12}}><Button type="primary" disabled={!canFinalize||!!locked||unresolved>0} onClick={finalize}>Finalize attendance day</Button><Button disabled={!canFinalize||!locked} onClick={()=>{setLocks(p=>{const next={...p};delete next[date];return next});message.info('Day reopened; original punches unchanged')}}>Reopen for review</Button><Typography.Text type="secondary">{issues.length} attendance exceptions · {pendingCorrections.length} pending corrections · HR/Company Admin only</Typography.Text></Space>
 <Table size="small" rowKey="key" scroll={{x:1200}} dataSource={results} columns={columns} pagination={{pageSize:15}}/>
 <Drawer title={selected?`Attendance review — ${selected.name} (${selected.code})`: 'Attendance review'} width={620} open={!!selected} onClose={()=>setSelected(null)}>
 {selected&&<><Space wrap><Tag color="blue">{date}</Tag><Tag>{selected.shift}</Tag><Tag color="orange">{selected.status}</Tag></Space>
 <Typography.Paragraph style={{marginTop:12}}>Review original device events before taking action. Raw records cannot be edited or deleted here.</Typography.Paragraph>
 <Table size="small" rowKey="id" pagination={false} dataSource={punches.filter(p=>p.employeeId===selected.employeeId&&p.time.slice(0,10)>=date&&p.time.slice(0,10)<=new Date(new Date(`${date}T00:00:00`).getTime()+86400000).toISOString().slice(0,10))} columns={[{title:'Punch ID',dataIndex:'id'},{title:'Time',dataIndex:'time'},{title:'Device',dataIndex:'deviceId'},{title:'Status',dataIndex:'status'}]}/>
 <Divider>Correction request</Divider>
 <Typography.Paragraph type="secondary">For missing or incorrect punches, request a correction. It will only affect processing after approval.</Typography.Paragraph>
 <div style={{marginBottom:8}}><SmartTimeInput label="Corrected punch time" value={correctionTime} onChange={setCorrectionTime}/></div>
 <Input.TextArea rows={2} placeholder="Reason and supporting paper reference" value={correctionReason} onChange={e=>setCorrectionReason(e.target.value)} style={{marginBottom:8}}/>
 <Button type="primary" disabled={!canFinalize||!!locked||!correctionTime||!correctionReason.trim()||!onRequestCorrection} onClick={()=>{onRequestCorrection?.(selected.employeeId,date,correctionTime,correctionReason.trim());setSelected(null);message.success('Correction submitted for approval')}}>Submit correction for approval</Button>
 <Divider>Absence review</Divider>
 <Typography.Paragraph type="secondary">Only a genuinely absent employee may be confirmed absent. Do not use this to clear a missing punch or unmapped device.</Typography.Paragraph>
 <Input.TextArea rows={2} placeholder="Reason / verification reference" value={reviewReason} onChange={e=>setReviewReason(e.target.value)} style={{marginBottom:8}}/>
 <Button disabled={!canFinalize||!!locked||selected.status!=='Absent'||!reviewReason.trim()} onClick={()=>review('Confirmed absent')}>Confirm absent after review</Button>
 {reviews[`${date}:${selected.employeeId}`]&&<Alert style={{marginTop:12}} type="success" message={`Reviewed: ${reviews[`${date}:${selected.employeeId}`].outcome}`} description={reviews[`${date}:${selected.employeeId}`].reason}/>}
 </>}
 </Drawer>
 </Card>
}
