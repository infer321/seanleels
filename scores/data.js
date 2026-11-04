/* Scores · definitions and interpretation. Each score traces to a source in the Sources section of index.html. */
window.SC_CATEGORIES={
  "Cardiology":["CHA₂DS₂-VASc","CHADS₂","HEART Score","TIMI (NSTEMI)","GRACE (ACS)"],
  "Pulmonary":["CURB-65","PSI/PORT","Wells (PE)","Wells (DVT)"],
  "GI / Liver":["MELD-Na","Child-Pugh","Glasgow-Blatchford","Ranson (pancreatitis)"],
  "Sepsis / ICU":["qSOFA","SOFA","APACHE II"],
  "Neurology":["NIH Stroke Scale"]
};

window.SC_SCORES={
  "CHA₂DS₂-VASc":{
    desc:"Stroke risk in non-valvular atrial fibrillation",
    type:"checklist",
    criteria:[
      {label:"Congestive heart failure",pts:1},
      {label:"Hypertension",pts:1},
      {label:"Age 75 or older",pts:2},
      {label:"Diabetes mellitus",pts:1},
      {label:"Stroke / TIA / thromboembolism (prior)",pts:2},
      {label:"Vascular disease (prior MI, PAD, aortic plaque)",pts:1},
      {label:"Age 65–74",pts:1},
      {label:"Female sex",pts:1}
    ],
    interpret:(s)=>{
      if(s===0) return {tier:"low",label:"Low risk",detail:"Anticoagulation not recommended. Annual stroke risk ~0%. Reassess if female sex is the only point (score 1 for women = low risk)."};
      if(s===1) return {tier:"mod",label:"Low-moderate risk",detail:"Consider anticoagulation in men with score 1. Women with score 1 only for female sex — reassess. Annual stroke risk ~1.3%."};
      return {tier:"high",label:"High risk — anticoagulate",detail:`Score ${s}: Annual stroke risk ~${[0,1.3,2.2,3.2,4.0,6.7,9.8,9.6,12.5,15.2][Math.min(s,9)]||">12"}%. Anticoagulation recommended (DOAC preferred) unless contraindicated.`};
    }
  },
  "CHADS₂":{
    desc:"Stroke risk in atrial fibrillation (simplified)",
    type:"checklist",
    criteria:[
      {label:"Congestive heart failure",pts:1},
      {label:"Hypertension",pts:1},
      {label:"Age 75 or older",pts:1},
      {label:"Diabetes mellitus",pts:1},
      {label:"Stroke or TIA (prior)",pts:2}
    ],
    interpret:(s)=>{
      if(s===0) return {tier:"low",label:"Low risk",detail:"Annual stroke risk ~1.9%. Aspirin or no therapy. CHA₂DS₂-VASc preferred for more nuanced risk."};
      if(s===1) return {tier:"mod",label:"Moderate risk",detail:"Annual stroke risk ~2.8%. Consider anticoagulation."};
      return {tier:"high",label:"High risk",detail:`Score ${s}: Annual stroke risk ~${[0,2.8,4.0,5.9,8.5,12.5,18.2][Math.min(s,6)]||">12"}%. Anticoagulation recommended.`};
    }
  },
  "HEART Score":{
    desc:"Risk stratification for chest pain / MACE at 6 weeks",
    type:"checklist-multi",
    sections:[
      {name:"History",opts:[{label:"Slightly suspicious",pts:1},{label:"Moderately suspicious",pts:1},{label:"Highly suspicious",pts:2}],single:true,key:"H"},
      {name:"ECG",opts:[{label:"Normal",pts:0},{label:"Non-specific repolarisation disturbance",pts:1},{label:"Significant ST deviation",pts:2}],single:true,key:"E"},
      {name:"Age",opts:[{label:"< 45",pts:0},{label:"45–64",pts:1},{label:"≥ 65",pts:2}],single:true,key:"A"},
      {name:"Risk factors",opts:[{label:"No known risk factors",pts:0},{label:"1–2 risk factors or obesity (BMI >30)",pts:1},{label:"≥3 risk factors, atherosclerotic disease, or diabetes",pts:2}],single:true,key:"R"},
      {name:"Troponin",opts:[{label:"≤ normal limit",pts:0},{label:"1–3× normal limit",pts:1},{label:"> 3× normal limit",pts:2}],single:true,key:"T"}
    ],
    interpret:(s)=>{
      if(s<=3) return {tier:"low",label:"Low risk",detail:`Score ${s}: MACE risk ~1.7%. Safe for early discharge with outpatient follow-up. No further workup needed acutely.`};
      if(s<=6) return {tier:"mod",label:"Moderate risk",detail:`Score ${s}: MACE risk ~12%. Admit for observation, serial troponins, stress testing or non-invasive imaging.`};
      return {tier:"high",label:"High risk",detail:`Score ${s}: MACE risk ~65%. Early invasive strategy — urgent cardiology consult, likely cath lab.`};
    }
  },
  "TIMI (NSTEMI)":{
    desc:"Risk score for UA/NSTEMI — 14-day MACE",
    type:"checklist",
    criteria:[
      {label:"Age ≥ 65",pts:1},
      {label:"≥ 3 CAD risk factors (family Hx, HTN, hyperlipidaemia, DM, active smoker)",pts:1},
      {label:"Known CAD (stenosis ≥ 50%)",pts:1},
      {label:"ASA use in past 7 days",pts:1},
      {label:"Severe angina (≥ 2 episodes in 24h)",pts:1},
      {label:"ST deviation ≥ 0.5 mm on ECG",pts:1},
      {label:"Positive cardiac marker (troponin or CK-MB)",pts:1}
    ],
    interpret:(s)=>{
      if(s<=2) return {tier:"low",label:"Low risk",detail:`Score ${s}: 14-day MACE ~5%. Medical management appropriate. Consider early discharge with outpatient follow-up.`};
      if(s<=4) return {tier:"mod",label:"Intermediate risk",detail:`Score ${s}: 14-day MACE ~13–20%. Admit, anticoagulation, serial troponins. Consider early invasive strategy.`};
      return {tier:"high",label:"High risk",detail:`Score ${s}: 14-day MACE ~26–41%. Urgent invasive strategy — cardiology consult, early cath.`};
    }
  },
  "GRACE (ACS)":{
    desc:"In-hospital and 6-month mortality in ACS",
    type:"checklist",
    criteria:[
      {label:"Age 60–69",pts:18},{label:"Age 70–79",pts:36},{label:"Age ≥ 80",pts:55},
      {label:"HR 70–89 bpm",pts:7},{label:"HR 90–109 bpm",pts:13},{label:"HR ≥ 110 bpm",pts:23},
      {label:"SBP 80–99 mmHg",pts:24},{label:"SBP 100–119 mmHg",pts:22},{label:"SBP 120–139 mmHg",pts:18},
      {label:"Creatinine 1.4–1.9 mg/dL",pts:5},{label:"Creatinine 2.0–3.9 mg/dL",pts:8},{label:"Creatinine ≥ 4.0 mg/dL",pts:10},
      {label:"Cardiac arrest at admission",pts:39},
      {label:"ST segment deviation on ECG",pts:28},
      {label:"Elevated cardiac enzymes / biomarkers",pts:14},
      {label:"Killip class II (rales)",pts:14},{label:"Killip class III (pulmonary oedema)",pts:28},{label:"Killip class IV (cardiogenic shock)",pts:59}
    ],
    interpret:(s)=>{
      if(s<109) return {tier:"low",label:"Low risk",detail:`Score ${s}: In-hospital mortality <1%. Medical management, early discharge may be appropriate.`};
      if(s<140) return {tier:"mod",label:"Moderate risk",detail:`Score ${s}: In-hospital mortality ~1–3%. Admit, consider invasive strategy within 24–72h.`};
      return {tier:"high",label:"High risk",detail:`Score ${s}: In-hospital mortality >3%. Early invasive strategy — cardiology urgently.`};
    }
  },
  "CURB-65":{
    desc:"Pneumonia severity and disposition",
    type:"checklist",
    criteria:[
      {label:"Confusion (new disorientation to person, place, or time)",pts:1},
      {label:"Urea > 7 mmol/L (BUN > 19 mg/dL)",pts:1},
      {label:"Respiratory rate ≥ 30 breaths/min",pts:1},
      {label:"Blood pressure: SBP < 90 or DBP ≤ 60 mmHg",pts:1},
      {label:"Age ≥ 65",pts:1}
    ],
    interpret:(s)=>{
      if(s<=1) return {tier:"low",label:"Low severity",detail:`Score ${s}: 30-day mortality ~1.5%. Outpatient treatment appropriate for most patients.`};
      if(s===2) return {tier:"mod",label:"Moderate severity",detail:"Score 2: 30-day mortality ~9.2%. Short inpatient admission or closely supervised outpatient therapy."};
      return {tier:"high",label:"High severity",detail:`Score ${s}: 30-day mortality ~${s===3?"14.5%":s===4?"40%":">57%"}. Hospital admission required. Consider ICU if score 4–5.`};
    }
  },
  "PSI/PORT":{
    desc:"Pneumonia Severity Index — risk class for CAP",
    type:"numeric",
    fields:[
      {label:"Age (years)",key:"age",placeholder:"e.g. 65"},
      {label:"Additional comorbidity points",key:"pts",placeholder:"Sum from list below"}
    ],
    note:"Female sex −10 | Nursing home resident +10 | Neoplastic disease +30 | Liver disease +20 | CHF +10 | Cerebrovascular disease +10 | Renal disease +10 | Altered mental status +20 | RR ≥ 30 +20 | SBP < 90 mmHg +20 | Temp < 35°C or ≥ 40°C +15 | HR ≥ 125 +10 | pH < 7.35 +30 | BUN ≥ 30 mg/dL +20 | Na < 130 +20 | Glucose ≥ 250 +10 | Hct < 30% +10 | PaO₂ < 60 mmHg +10 | Pleural effusion +10",
    interpret:(f)=>{
      const s=(parseInt(f.age)||0)+(parseInt(f.pts)||0);
      if(s<=70) return {tier:"low",label:`Class I–II (score ${s})`,detail:"30-day mortality <1%. Outpatient treatment recommended."};
      if(s<=90) return {tier:"mod",label:`Class III (score ${s})`,detail:"30-day mortality ~2.8%. Brief inpatient stay or observation unit."};
      if(s<=130) return {tier:"high",label:`Class IV (score ${s})`,detail:"30-day mortality ~8.2%. Inpatient admission required."};
      return {tier:"high",label:`Class V (score ${s})`,detail:"30-day mortality ~29%. Inpatient admission — consider ICU."};
    }
  },
  "Wells (PE)":{
    desc:"Pre-test probability of pulmonary embolism",
    type:"checklist",
    criteria:[
      {label:"Clinical signs / symptoms of DVT",pts:3},
      {label:"PE is #1 diagnosis or equally likely",pts:3},
      {label:"Heart rate > 100 bpm",pts:1.5},
      {label:"Immobilisation ≥ 3 days OR surgery in past 4 weeks",pts:1.5},
      {label:"Previously documented DVT or PE",pts:1.5},
      {label:"Haemoptysis",pts:1},
      {label:"Malignancy (treated within 6 months or palliative)",pts:1}
    ],
    interpret:(s)=>{
      if(s<2) return {tier:"low",label:"Low probability",detail:`Score ${s.toFixed(1)}: PE prevalence ~3.6%. D-dimer — if negative, PE excluded. If positive, CT pulmonary angiogram.`};
      if(s<=6) return {tier:"mod",label:"Moderate probability",detail:`Score ${s.toFixed(1)}: PE prevalence ~20.5%. D-dimer — if positive, proceed to CT-PA.`};
      return {tier:"high",label:"High probability",detail:`Score ${s.toFixed(1)}: PE prevalence ~66.7%. Proceed directly to CT-PA — do not wait for D-dimer result.`};
    }
  },
  "Wells (DVT)":{
    desc:"Pre-test probability of deep vein thrombosis",
    type:"checklist",
    criteria:[
      {label:"Active cancer (treatment within 6 months or palliative)",pts:1},
      {label:"Paralysis / paresis or recent lower extremity plaster cast",pts:1},
      {label:"Bedridden > 3 days OR major surgery within 12 weeks requiring GA",pts:1},
      {label:"Localised tenderness along deep venous system",pts:1},
      {label:"Entire leg swollen",pts:1},
      {label:"Calf swelling > 3 cm vs asymptomatic leg (below tibial tuberosity)",pts:1},
      {label:"Pitting oedema (greater in symptomatic leg)",pts:1},
      {label:"Collateral superficial veins (non-varicose)",pts:1},
      {label:"Previously documented DVT",pts:1},
      {label:"Alternative diagnosis at least as likely as DVT",pts:-2}
    ],
    interpret:(s)=>{
      if(s<=0) return {tier:"low",label:"Low probability",detail:`Score ${s}: DVT prevalence ~5%. D-dimer — if negative, DVT excluded.`};
      if(s<=2) return {tier:"mod",label:"Moderate probability",detail:`Score ${s}: DVT prevalence ~17%. D-dimer then venous ultrasound if positive.`};
      return {tier:"high",label:"High probability",detail:`Score ${s}: DVT prevalence ~53%. Proceed to proximal venous ultrasound — do not wait for D-dimer.`};
    }
  },
  "MELD-Na":{
    desc:"Liver disease severity and transplant priority",
    type:"numeric",
    fields:[
      {label:"Bilirubin (mg/dL)",key:"bili",placeholder:"e.g. 2.0"},
      {label:"Creatinine (mg/dL)",key:"cr",placeholder:"e.g. 1.2"},
      {label:"INR",key:"inr",placeholder:"e.g. 1.5"},
      {label:"Sodium (mEq/L)",key:"na",placeholder:"e.g. 138"}
    ],
    interpret:(f)=>{
      let bili=Math.max(parseFloat(f.bili)||1,1);
      let cr=Math.min(Math.max(parseFloat(f.cr)||1,1),4);
      let inr=Math.max(parseFloat(f.inr)||1,1);
      let na=Math.min(Math.max(parseFloat(f.na)||130,125),137);
      const meld=Math.round(3.78*Math.log(bili)+11.2*Math.log(inr)+9.57*Math.log(cr)+6.43);
      const meldna=Math.round(meld+1.32*(137-na)-0.033*meld*(137-na));
      if(meldna<10) return {tier:"low",label:`MELD-Na ${meldna}`,detail:"90-day mortality ~2%. Low urgency. Routine hepatology follow-up."};
      if(meldna<20) return {tier:"mod",label:`MELD-Na ${meldna}`,detail:"90-day mortality ~6%. Active transplant list evaluation. Hepatology review."};
      if(meldna<30) return {tier:"high",label:`MELD-Na ${meldna}`,detail:"90-day mortality ~20%. High transplant priority — urgent hepatology."};
      return {tier:"high",label:`MELD-Na ${meldna}`,detail:"90-day mortality >50%. Very high priority — urgent liver transplant evaluation."};
    }
  },
  "Child-Pugh":{
    desc:"Cirrhosis severity and surgical risk",
    type:"checklist-multi",
    sections:[
      {name:"Hepatic encephalopathy",opts:[{label:"None",pts:1},{label:"Grade 1–2 (or suppressed with medication)",pts:2},{label:"Grade 3–4",pts:3}],single:true,key:"enc"},
      {name:"Ascites",opts:[{label:"Absent",pts:1},{label:"Mild (controlled with diuretics)",pts:2},{label:"Moderate–severe (refractory)",pts:3}],single:true,key:"asc"},
      {name:"Bilirubin",opts:[{label:"< 2 mg/dL",pts:1},{label:"2–3 mg/dL",pts:2},{label:"> 3 mg/dL",pts:3}],single:true,key:"bil"},
      {name:"Albumin",opts:[{label:"> 3.5 g/dL",pts:1},{label:"2.8–3.5 g/dL",pts:2},{label:"< 2.8 g/dL",pts:3}],single:true,key:"alb"},
      {name:"Prothrombin time (seconds prolonged)",opts:[{label:"< 4 sec",pts:1},{label:"4–6 sec",pts:2},{label:"> 6 sec",pts:3}],single:true,key:"pt"}
    ],
    interpret:(s)=>{
      if(s<=6) return {tier:"low",label:`Class A (score ${s})`,detail:"1-year survival ~100%, 2-year ~85%. Well-compensated cirrhosis. Perioperative mortality ~10%."};
      if(s<=9) return {tier:"mod",label:`Class B (score ${s})`,detail:"1-year survival ~81%, 2-year ~57%. Significant functional compromise. Perioperative mortality ~30%."};
      return {tier:"high",label:`Class C (score ${s})`,detail:"1-year survival ~45%, 2-year ~35%. Decompensated cirrhosis. Perioperative mortality ~80%. Transplant evaluation urgently."};
    }
  },
  "Glasgow-Blatchford":{
    desc:"Upper GI bleed — need for intervention",
    type:"checklist",
    criteria:[
      {label:"BUN 18–22.4 mg/dL",pts:2},{label:"BUN 22.4–28 mg/dL",pts:3},{label:"BUN 28–70 mg/dL",pts:4},{label:"BUN > 70 mg/dL",pts:6},
      {label:"Haemoglobin 12–13 g/dL (men) or 10–12 g/dL (women)",pts:1},
      {label:"Haemoglobin 10–12 g/dL (men)",pts:3},
      {label:"Haemoglobin < 10 g/dL (either sex)",pts:6},
      {label:"SBP 100–109 mmHg",pts:1},{label:"SBP 90–99 mmHg",pts:2},{label:"SBP < 90 mmHg",pts:3},
      {label:"Heart rate ≥ 100 bpm",pts:1},
      {label:"Melaena on presentation",pts:1},
      {label:"Syncope",pts:2},
      {label:"Hepatic disease (known)",pts:2},
      {label:"Cardiac failure (known)",pts:2}
    ],
    interpret:(s)=>{
      if(s===0) return {tier:"low",label:"Score 0 — very low risk",detail:"Safe for outpatient management. No intervention likely needed. Sensitivity ~99% for identifying low-risk patients."};
      if(s<=3) return {tier:"mod",label:`Low–moderate risk (score ${s})`,detail:"Intervention needed in ~5–10%. Inpatient observation, early endoscopy within 24h."};
      return {tier:"high",label:`High risk (score ${s})`,detail:`Score ${s}: High likelihood of needing transfusion, endoscopy, or surgery. Urgent upper GI endoscopy. GI consult.`};
    }
  },
  "Ranson (pancreatitis)":{
    desc:"Acute pancreatitis severity (admission + 48h criteria)",
    type:"checklist-grouped",
    groups:[
      {name:"At admission",items:[
        {label:"Age > 55",pts:1},
        {label:"WBC > 16,000 /mm³",pts:1},
        {label:"Blood glucose > 200 mg/dL",pts:1},
        {label:"LDH > 350 IU/L",pts:1},
        {label:"AST > 250 IU/L",pts:1}
      ]},
      {name:"At 48 hours",items:[
        {label:"Haematocrit fall > 10%",pts:1},
        {label:"BUN rise > 5 mg/dL",pts:1},
        {label:"Calcium < 8 mg/dL",pts:1},
        {label:"PaO₂ < 60 mmHg",pts:1},
        {label:"Base deficit > 4 mEq/L",pts:1},
        {label:"Fluid sequestration > 6 litres",pts:1}
      ]}
    ],
    interpret:(s)=>{
      if(s<3) return {tier:"low",label:`Mild pancreatitis (score ${s})`,detail:"Mortality <1%. Medical management, early oral feeding when tolerated. Monitor closely."};
      if(s<=4) return {tier:"mod",label:`Moderate severity (score ${s})`,detail:"Mortality ~15%. Inpatient admission, NPO, aggressive IV fluid resuscitation, close monitoring."};
      return {tier:"high",label:`Severe pancreatitis (score ${s})`,detail:`Score ${s}: Mortality ${s<=6?"~40%":">40%"}. ICU admission, surgical / GI consult, CT abdomen with contrast.`};
    }
  },
  "qSOFA":{
    desc:"Quick bedside screen for sepsis-related poor outcome",
    type:"checklist",
    criteria:[
      {label:"Altered mentation (GCS < 15 or new confusion)",pts:1},
      {label:"Respiratory rate ≥ 22 breaths/min",pts:1},
      {label:"Systolic BP ≤ 100 mmHg",pts:1}
    ],
    interpret:(s)=>{
      if(s<2) return {tier:"low",label:`qSOFA ${s} — low concern`,detail:"Low risk for sepsis-related poor outcome based on bedside criteria. Monitor clinically. Does not exclude sepsis."};
      return {tier:"high",label:`qSOFA ${s} — sepsis alert`,detail:`Score ${s}: High risk for poor outcome if infection present. Initiate full sepsis workup: blood cultures ×2, lactate, broad-spectrum antibiotics within 1 hour. Consider ICU.`};
    }
  },
  "SOFA":{
    desc:"Sequential Organ Failure Assessment — ICU organ dysfunction",
    type:"checklist-multi",
    sections:[
      {name:"Respiration (PaO₂/FiO₂ ratio)",opts:[{label:"≥ 400",pts:0},{label:"300–399",pts:1},{label:"200–299",pts:2},{label:"100–199 (mechanically ventilated)",pts:3},{label:"< 100 (mechanically ventilated)",pts:4}],single:true,key:"resp"},
      {name:"Coagulation (platelets ×10³/µL)",opts:[{label:"≥ 150",pts:0},{label:"100–149",pts:1},{label:"50–99",pts:2},{label:"20–49",pts:3},{label:"< 20",pts:4}],single:true,key:"coag"},
      {name:"Liver (bilirubin mg/dL)",opts:[{label:"< 1.2",pts:0},{label:"1.2–1.9",pts:1},{label:"2.0–5.9",pts:2},{label:"6.0–11.9",pts:3},{label:"≥ 12.0",pts:4}],single:true,key:"liver"},
      {name:"Cardiovascular",opts:[{label:"MAP ≥ 70 mmHg",pts:0},{label:"MAP < 70 mmHg",pts:1},{label:"Dopamine ≤5 or any dobutamine",pts:2},{label:"Dopamine 5.1–15 or epi/norepi ≤ 0.1 µg/kg/min",pts:3},{label:"Dopamine >15 or epi/norepi > 0.1 µg/kg/min",pts:4}],single:true,key:"cv"},
      {name:"CNS (Glasgow Coma Scale)",opts:[{label:"GCS 15",pts:0},{label:"GCS 13–14",pts:1},{label:"GCS 10–12",pts:2},{label:"GCS 6–9",pts:3},{label:"GCS < 6",pts:4}],single:true,key:"cns"},
      {name:"Renal (creatinine mg/dL or urine output)",opts:[{label:"Cr < 1.2",pts:0},{label:"Cr 1.2–1.9",pts:1},{label:"Cr 2.0–3.4",pts:2},{label:"Cr 3.5–4.9 or UO < 500 mL/day",pts:3},{label:"Cr ≥ 5.0 or UO < 200 mL/day",pts:4}],single:true,key:"renal"}
    ],
    interpret:(s)=>{
      if(s<6) return {tier:"low",label:`SOFA ${s} — low dysfunction`,detail:"Predicted mortality <10%. Monitor closely, identify and treat underlying cause."};
      if(s<10) return {tier:"mod",label:`SOFA ${s} — moderate dysfunction`,detail:"Predicted mortality ~15–20%. Active organ support. Close ICU monitoring."};
      if(s<12) return {tier:"high",label:`SOFA ${s} — significant dysfunction`,detail:"Predicted mortality ~40–50%. Aggressive multi-organ support."};
      return {tier:"high",label:`SOFA ${s} — severe dysfunction`,detail:`Score ${s}: Predicted mortality >50–95%. Maximum organ support. Goals of care discussion.`};
    }
  },
  "APACHE II":{
    desc:"ICU severity of illness score",
    type:"numeric",
    fields:[
      {label:"Age (years)",key:"age",placeholder:"e.g. 65"},
      {label:"APS — Acute Physiology Score",key:"aps",placeholder:"0–60, sum of 12 variables"},
      {label:"Chronic health points",key:"chp",placeholder:"2 elective / 5 emergency or non-op"}
    ],
    note:"APS = sum of 12 variables (each 0–4): Temp, MAP, HR, RR, A-a gradient or PaO₂, arterial pH, serum Na, serum K, creatinine (double if AKI), haematocrit, WBC, GCS points (15 minus actual GCS). Age points: <44=0, 45–54=2, 55–64=3, 65–74=5, ≥75=6. Chronic health: cirrhosis, severe COPD, end-stage renal failure, immunocompromised, NYHA class IV heart failure.",
    interpret:(f)=>{
      const ageMap=[[44,0],[54,2],[64,3],[74,5],[200,6]];
      const age=parseInt(f.age)||0;
      const agePts=ageMap.find(([max])=>age<=max)?.[1]||6;
      const s=Math.round((parseInt(f.aps)||0)+(parseInt(f.chp)||0)+agePts);
      if(s<10) return {tier:"low",label:`APACHE II ${s}`,detail:"Predicted hospital mortality ~5–8%."};
      if(s<20) return {tier:"mod",label:`APACHE II ${s}`,detail:"Predicted hospital mortality ~15–25%."};
      if(s<30) return {tier:"high",label:`APACHE II ${s}`,detail:"Predicted hospital mortality ~40–55%."};
      return {tier:"high",label:`APACHE II ${s}`,detail:`Score ${s}: Predicted hospital mortality >75%. Maximum organ support — goals of care discussion.`};
    }
  },
  "NIH Stroke Scale":{
    desc:"Stroke severity and thrombolysis eligibility",
    type:"checklist-multi",
    sections:[
      {name:"1a. Level of consciousness",opts:[{label:"Alert; keenly responsive",pts:0},{label:"Not alert — arousable by minor stimulation",pts:1},{label:"Not alert — requires repeated stimulation",pts:2},{label:"Unresponsive or reflex responses only",pts:3}],single:true,key:"loc"},
      {name:"1b. LOC questions (month / age — 2 items)",opts:[{label:"Both correct",pts:0},{label:"One correct (or dysarthria/intubated)",pts:1},{label:"Neither correct",pts:2}],single:true,key:"locq"},
      {name:"1c. LOC commands (grip / eyes — 2 items)",opts:[{label:"Both obeys",pts:0},{label:"One obeys",pts:1},{label:"Neither obeys",pts:2}],single:true,key:"locc"},
      {name:"2. Best gaze",opts:[{label:"Normal",pts:0},{label:"Partial gaze palsy",pts:1},{label:"Forced deviation or total gaze paresis",pts:2}],single:true,key:"gaze"},
      {name:"3. Visual fields",opts:[{label:"No visual loss",pts:0},{label:"Partial hemianopia",pts:1},{label:"Complete hemianopia",pts:2},{label:"Bilateral blindness",pts:3}],single:true,key:"vis"},
      {name:"4. Facial palsy",opts:[{label:"Normal",pts:0},{label:"Minor paralysis",pts:1},{label:"Partial paralysis (lower face)",pts:2},{label:"Complete paralysis (upper and lower face)",pts:3}],single:true,key:"face"},
      {name:"5. Motor arm (best limb)",opts:[{label:"No drift — holds 10 sec",pts:0},{label:"Drift before 10 sec, does not hit bed",pts:1},{label:"Falls before 10 sec, effort against gravity",pts:2},{label:"No effort against gravity",pts:3},{label:"No movement",pts:4}],single:true,key:"arm"},
      {name:"6. Motor leg (best limb)",opts:[{label:"No drift — holds 5 sec",pts:0},{label:"Drift before 5 sec",pts:1},{label:"Falls before 5 sec, effort against gravity",pts:2},{label:"No effort against gravity",pts:3},{label:"No movement",pts:4}],single:true,key:"leg"},
      {name:"7. Limb ataxia",opts:[{label:"Absent",pts:0},{label:"Present in one limb",pts:1},{label:"Present in two or more limbs",pts:2}],single:true,key:"atax"},
      {name:"8. Sensory",opts:[{label:"Normal — no sensory loss",pts:0},{label:"Mild to moderate loss — aware of being touched",pts:1},{label:"Severe to total loss — unaware of touch",pts:2}],single:true,key:"sens"},
      {name:"9. Best language",opts:[{label:"Normal — no aphasia",pts:0},{label:"Mild to moderate aphasia",pts:1},{label:"Severe aphasia — fragmentary expression",pts:2},{label:"Mute / global aphasia",pts:3}],single:true,key:"lang"},
      {name:"10. Dysarthria",opts:[{label:"Normal",pts:0},{label:"Mild — slurred but understandable",pts:1},{label:"Severe — unintelligible / mute",pts:2}],single:true,key:"dysart"},
      {name:"11. Extinction / inattention",opts:[{label:"Absent",pts:0},{label:"Mild — inattention to one modality",pts:1},{label:"Severe — does not recognise own hand / orients to one side only",pts:2}],single:true,key:"extinct"}
    ],
    interpret:(s)=>{
      if(s<=4) return {tier:"low",label:`NIHSS ${s} — minor stroke`,detail:"Minor stroke. Evaluate for tPA if within 4.5h of onset. Neurology consult. Early MRI."};
      if(s<=15) return {tier:"mod",label:`NIHSS ${s} — moderate stroke`,detail:"Moderate stroke. tPA if within 4.5h and no contraindications. CT/CTA urgently. Thrombectomy if large vessel occlusion. Stroke unit admission."};
      if(s<=20) return {tier:"high",label:`NIHSS ${s} — moderate–severe`,detail:"Moderate-severe stroke. Immediate CT/CTA. Thrombectomy if eligible (LVO). Stroke unit / ICU."};
      return {tier:"high",label:`NIHSS ${s} — severe stroke`,detail:`Score ${s}: Severe stroke. Immediate neurovascular imaging. Thrombectomy for LVO. ICU / stroke unit — aggressive monitoring and supportive care.`};
    }
  }
};
