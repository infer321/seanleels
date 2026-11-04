/* Scores · definitions and interpretation. Each score traces to a source in the Sources section of index.html.
   Content last checked Nov 2026. */
window.SC_CATEGORIES = {
  "Cardiology": ["CHA₂DS₂-VASc / CHA₂DS₂-VA", "CHADS₂", "HEART Score", "TIMI (NSTEMI)", "GRACE (ACS)"],
  "Pulmonary": ["CURB-65", "PSI/PORT", "Wells (PE)", "Wells (DVT)"],
  "GI / Liver": ["MELD 3.0 / MELD-Na", "Child-Pugh", "Glasgow-Blatchford", "Ranson (pancreatitis)"],
  "Sepsis / ICU": ["qSOFA", "SOFA", "APACHE II"],
  "Neurology": ["NIH Stroke Scale"]
};

window.SC_SCORES = {
  "CHA₂DS₂-VASc / CHA₂DS₂-VA": {
    desc: "Stroke risk in atrial fibrillation (without moderate–severe mitral stenosis or a mechanical valve)",
    type: "form",
    basis: "2023 ACC/AHA/ACCP/HRS and 2024 ESC atrial fibrillation guidelines",
    items: [
      { kind: "radio", key: "age", legend: "Age", opts: [{ label: "Under 65", pts: 0 }, { label: "65–74", pts: 1 }, { label: "75 or older", pts: 2 }] },
      { kind: "radio", key: "sex", legend: "Sex", opts: [{ label: "Male", pts: 0 }, { label: "Female (CHA₂DS₂-VASc only)", pts: 1 }] },
      { kind: "checks", legend: "History", items: [
        { key: "chf", label: "Congestive heart failure", pts: 1 },
        { key: "htn", label: "Hypertension", pts: 1 },
        { key: "dm", label: "Diabetes mellitus", pts: 1 },
        { key: "stroke", label: "Prior stroke, TIA or thromboembolism", pts: 2 },
        { key: "vasc", label: "Vascular disease (prior MI, PAD, aortic plaque)", pts: 1 }
      ] }
    ],
    interpret: function (s, v) {
      var female = v.sex && v.sex.index === 1 ? 1 : 0;
      var va = s - female;
      var both = "CHA₂DS₂-VASc " + s + " · CHA₂DS₂-VA " + va + ". ";
      if (va >= 2) return { tier: "high", label: "Anticoagulation recommended", detail: both + "Annual stroke risk is about 2% or more. Oral anticoagulation is recommended, with a DOAC preferred over warfarin, unless contraindicated. Assess bleeding risk factors, but a bleeding score alone shouldn't decide against anticoagulation.", unit: "VASc" };
      if (va === 1) return { tier: "mod", label: "Anticoagulation reasonable", detail: both + "Annual stroke risk is about 1–2%. Anticoagulation is reasonable after shared decision-making. Female sex on its own doesn't raise this tier; that's why the 2024 ESC guideline drops it (CHA₂DS₂-VA).", unit: "VASc" };
      return { tier: "low", label: "Low risk", detail: both + "Anticoagulation isn't indicated. Aspirin isn't recommended for stroke prevention in AF. Reassess as risk factors change.", unit: "VASc" };
    }
  },
  "CHADS₂": {
    desc: "Stroke risk in atrial fibrillation (older score, shown for reference)",
    type: "checklist",
    basis: "Gage et al., JAMA 2001. Superseded in current guidelines by CHA₂DS₂-VASc / CHA₂DS₂-VA",
    criteria: [
      { label: "Congestive heart failure", pts: 1 },
      { label: "Hypertension", pts: 1 },
      { label: "Age 75 or older", pts: 1 },
      { label: "Diabetes mellitus", pts: 1 },
      { label: "Prior stroke or TIA", pts: 2 }
    ],
    interpret: function (s) {
      var risk = [1.9, 2.8, 4.0, 5.9, 8.5, 12.5, 18.2][Math.min(s, 6)];
      if (s === 0) return { tier: "low", label: "Low risk", detail: "Annual stroke risk about " + risk + "% in the original cohort. Current guidelines use CHA₂DS₂-VASc or CHA₂DS₂-VA instead, which better identify truly low-risk patients. Aspirin isn't recommended for stroke prevention in AF." };
      if (s === 1) return { tier: "mod", label: "Moderate risk", detail: "Annual stroke risk about " + risk + "%. Calculate CHA₂DS₂-VASc / CHA₂DS₂-VA to guide anticoagulation." };
      return { tier: "high", label: "High risk", detail: "Annual stroke risk about " + risk + "%. Anticoagulation recommended unless contraindicated." };
    }
  },
  "HEART Score": {
    desc: "Chest pain: risk of major adverse cardiac events (MACE) at 6 weeks",
    type: "checklist-multi",
    basis: "Six et al., Neth Heart J 2008; Backus et al., Int J Cardiol 2013; 2021 AHA/ACC chest pain guideline",
    sections: [
      { name: "History", opts: [{ label: "Slightly suspicious", pts: 0 }, { label: "Moderately suspicious", pts: 1 }, { label: "Highly suspicious", pts: 2 }] },
      { name: "ECG", opts: [{ label: "Normal", pts: 0 }, { label: "Non-specific repolarization disturbance", pts: 1 }, { label: "Significant ST deviation", pts: 2 }] },
      { name: "Age", opts: [{ label: "Under 45", pts: 0 }, { label: "45–64", pts: 1 }, { label: "65 or older", pts: 2 }] },
      { name: "Risk factors", opts: [{ label: "No known risk factors", pts: 0 }, { label: "1–2 risk factors (hypertension, hyperlipidemia, diabetes, obesity, smoking, family history)", pts: 1 }, { label: "3 or more risk factors, or known atherosclerotic disease", pts: 2 }] },
      { name: "Troponin", opts: [{ label: "At or below the normal limit", pts: 0 }, { label: "1–3× the normal limit", pts: 1 }, { label: "More than 3× the normal limit", pts: 2 }] }
    ],
    interpret: function (s) {
      if (s <= 3) return { tier: "low", label: "Low risk", detail: "6-week MACE about 1–2%. With a negative troponin strategy, a candidate for discharge with outpatient follow-up; the 2021 AHA/ACC guideline supports discharge without further testing for low-risk patients." };
      if (s <= 6) return { tier: "mod", label: "Moderate risk", detail: "6-week MACE about 12–17%. Observation or admission, serial troponins, and noninvasive testing." };
      return { tier: "high", label: "High risk", detail: "6-week MACE about 50–65%. Early invasive strategy; involve cardiology promptly." };
    }
  },
  "TIMI (NSTEMI)": {
    desc: "UA/NSTEMI: risk of death, MI or urgent revascularization at 14 days",
    type: "checklist",
    basis: "Antman et al., JAMA 2000",
    criteria: [
      { label: "Age 65 or older", pts: 1 },
      { label: "3 or more CAD risk factors (family history, hypertension, hyperlipidemia, diabetes, active smoking)", pts: 1 },
      { label: "Known CAD (stenosis 50% or more)", pts: 1 },
      { label: "Aspirin use in the past 7 days", pts: 1 },
      { label: "Severe angina (2 or more episodes in 24 h)", pts: 1 },
      { label: "ST deviation of 0.5 mm or more", pts: 1 },
      { label: "Positive cardiac marker", pts: 1 }
    ],
    interpret: function (s) {
      var risk = ["4.7", "4.7", "8.3", "13.2", "19.9", "26.2", "40.9", "40.9"][s];
      if (s <= 2) return { tier: "low", label: "Low risk", detail: "14-day event rate about " + risk + "%." };
      if (s <= 4) return { tier: "mod", label: "Intermediate risk", detail: "14-day event rate about " + risk + "%. Anticoagulation, serial troponins, and consider an early invasive strategy." };
      return { tier: "high", label: "High risk", detail: "14-day event rate about " + risk + "%. Early invasive strategy; involve cardiology." };
    }
  },
  "GRACE (ACS)": {
    desc: "Acute coronary syndrome: in-hospital mortality",
    type: "form",
    basis: "Granger et al., Arch Intern Med 2003 (in-hospital nomogram); 2023 ESC ACS guideline",
    items: [
      { kind: "radio", key: "age", legend: "Age", opts: [{ label: "Under 30", pts: 0 }, { label: "30–39", pts: 8 }, { label: "40–49", pts: 25 }, { label: "50–59", pts: 41 }, { label: "60–69", pts: 58 }, { label: "70–79", pts: 75 }, { label: "80–89", pts: 91 }, { label: "90 or older", pts: 100 }] },
      { kind: "radio", key: "hr", legend: "Heart rate (bpm)", opts: [{ label: "Under 50", pts: 0 }, { label: "50–69", pts: 3 }, { label: "70–89", pts: 9 }, { label: "90–109", pts: 15 }, { label: "110–149", pts: 24 }, { label: "150–199", pts: 38 }, { label: "200 or more", pts: 46 }] },
      { kind: "radio", key: "sbp", legend: "Systolic blood pressure (mmHg)", opts: [{ label: "Under 80", pts: 58 }, { label: "80–99", pts: 53 }, { label: "100–119", pts: 43 }, { label: "120–139", pts: 34 }, { label: "140–159", pts: 24 }, { label: "160–199", pts: 10 }, { label: "200 or more", pts: 0 }] },
      { kind: "radio", key: "cr", legend: "Creatinine (mg/dL)", opts: [{ label: "0–0.39", pts: 1 }, { label: "0.40–0.79", pts: 4 }, { label: "0.80–1.19", pts: 7 }, { label: "1.20–1.59", pts: 10 }, { label: "1.60–1.99", pts: 13 }, { label: "2.00–3.99", pts: 21 }, { label: "4.0 or more", pts: 28 }] },
      { kind: "radio", key: "killip", legend: "Killip class", opts: [{ label: "I: no heart failure", pts: 0 }, { label: "II: rales or S3", pts: 20 }, { label: "III: pulmonary edema", pts: 39 }, { label: "IV: cardiogenic shock", pts: 59 }] },
      { kind: "checks", legend: "At presentation", items: [
        { key: "arrest", label: "Cardiac arrest at admission", pts: 39 },
        { key: "st", label: "ST-segment deviation", pts: 28 },
        { key: "enz", label: "Elevated cardiac biomarkers", pts: 14 }
      ] }
    ],
    interpret: function (s) {
      if (s <= 108) return { tier: "low", label: "Low risk", detail: "In-hospital mortality under 1%." };
      if (s <= 140) return { tier: "mod", label: "Intermediate risk", detail: "In-hospital mortality about 1–3%. Invasive strategy during the admission." };
      return { tier: "high", label: "High risk", detail: "In-hospital mortality over 3%. A GRACE score over 140 is a criterion for an early invasive strategy within 24 hours (ESC 2023)." };
    }
  },
  "CURB-65": {
    desc: "Community-acquired pneumonia: 30-day mortality",
    type: "checklist",
    basis: "Lim et al., Thorax 2003. ATS/IDSA (2019, 2025) prefer PSI for the outpatient decision",
    criteria: [
      { label: "Confusion (new disorientation to person, place or time)", pts: 1 },
      { label: "BUN over 19 mg/dL (urea over 7 mmol/L)", pts: 1 },
      { label: "Respiratory rate 30 or more", pts: 1 },
      { label: "SBP under 90 or DBP 60 or less mmHg", pts: 1 },
      { label: "Age 65 or older", pts: 1 }
    ],
    interpret: function (s) {
      var risk = ["0.7", "2.1", "9.2", "14.5", "40", "57"][s];
      if (s <= 1) return { tier: "low", label: "Low severity", detail: "30-day mortality about " + risk + "%. Outpatient treatment is usually appropriate. ATS/IDSA prefer PSI plus clinical judgment for this decision." };
      if (s === 2) return { tier: "mod", label: "Moderate severity", detail: "30-day mortality about 9.2%. Short admission or closely supervised outpatient care." };
      return { tier: "high", label: "High severity", detail: "30-day mortality about " + risk + "%. Admit. For ICU decisions, use the IDSA/ATS severe CAP criteria rather than CURB-65 alone." };
    }
  },
  "PSI/PORT": {
    desc: "Pneumonia Severity Index: risk class for community-acquired pneumonia",
    type: "numeric",
    basis: "Fine et al., NEJM 1997; ATS/IDSA CAP guidelines 2019 and 2025",
    fields: [
      { label: "Age (years)", key: "age", placeholder: "e.g. 65" },
      { label: "Additional points", key: "pts", placeholder: "Sum from the list below" }
    ],
    note: "Female −10 · Nursing home resident +10 · Neoplastic disease +30 · Liver disease +20 · Heart failure +10 · Cerebrovascular disease +10 · Renal disease +10 · Altered mental status +20 · RR 30 or more +20 · SBP under 90 +20 · Temp under 35°C or 40°C or more +15 · HR 125 or more +10 · pH under 7.35 +30 · BUN 30 mg/dL or more +20 · Na under 130 +20 · Glucose 250 mg/dL or more +10 · Hct under 30% +10 · PaO₂ under 60 mmHg +10 · Pleural effusion +10. Class I is age under 50 with none of these.",
    interpret: function (f) {
      var s = (parseInt(f.age, 10) || 0) + (parseInt(f.pts, 10) || 0);
      if (s <= 70) return { tier: "low", label: "Class I–II · " + s + " points", detail: "30-day mortality under 1%. Outpatient treatment recommended." };
      if (s <= 90) return { tier: "mod", label: "Class III · " + s + " points", detail: "30-day mortality about 1–3%. Outpatient or brief observation, by clinical judgment." };
      if (s <= 130) return { tier: "high", label: "Class IV · " + s + " points", detail: "30-day mortality about 8–9%. Admit." };
      return { tier: "high", label: "Class V · " + s + " points", detail: "30-day mortality about 27–31%. Admit; assess for ICU with the severe CAP criteria." };
    }
  },
  "Wells (PE)": {
    desc: "Pre-test probability of pulmonary embolism",
    type: "checklist",
    basis: "Wells et al., Thromb Haemost 2000; ACP 2015 best-practice advice; ESC 2019",
    criteria: [
      { label: "Clinical signs or symptoms of DVT", pts: 3 },
      { label: "PE is the most likely diagnosis", pts: 3 },
      { label: "Heart rate over 100", pts: 1.5 },
      { label: "Immobilization 3 days or more, or surgery in the past 4 weeks", pts: 1.5 },
      { label: "Previous DVT or PE", pts: 1.5 },
      { label: "Hemoptysis", pts: 1 },
      { label: "Malignancy (treated in the past 6 months or palliative)", pts: 1 }
    ],
    interpret: function (s) {
      if (s <= 4) return { tier: s < 2 ? "low" : "mod", label: "PE unlikely (4 or less)", detail: (s < 2 ? "Low probability (three-tier). If PERC is negative, no testing is needed. " : "Moderate probability (three-tier). ") + "Check a D-dimer, age-adjusted (age × 10 ng/mL) if over 50; a normal result excludes PE. If positive, CT pulmonary angiography." };
      return { tier: "high", label: "PE likely (over 4)", detail: (s > 6 ? "High probability (three-tier). " : "") + "Go straight to CT pulmonary angiography; a D-dimer can't exclude PE in this group." };
    }
  },
  "Wells (DVT)": {
    desc: "Pre-test probability of deep vein thrombosis",
    type: "checklist",
    basis: "Wells et al., NEJM 2003",
    criteria: [
      { label: "Active cancer (treatment within 6 months or palliative)", pts: 1 },
      { label: "Paralysis, paresis or recent leg cast", pts: 1 },
      { label: "Bedridden more than 3 days, or major surgery within 12 weeks", pts: 1 },
      { label: "Localized tenderness along the deep veins", pts: 1 },
      { label: "Entire leg swollen", pts: 1 },
      { label: "Calf swelling more than 3 cm compared with the other leg", pts: 1 },
      { label: "Pitting edema confined to the symptomatic leg", pts: 1 },
      { label: "Collateral superficial (non-varicose) veins", pts: 1 },
      { label: "Previously documented DVT", pts: 1 },
      { label: "Alternative diagnosis at least as likely as DVT", pts: -2 }
    ],
    interpret: function (s) {
      if (s <= 1) return { tier: "low", label: "DVT unlikely (1 or less)", detail: "Check a D-dimer; a normal result excludes DVT. If positive, venous ultrasound." };
      return { tier: "high", label: "DVT likely (2 or more)", detail: "Proximal or whole-leg venous ultrasound. A D-dimer alone can't exclude DVT in this group." };
    }
  },
  "MELD 3.0 / MELD-Na": {
    desc: "Liver disease severity and 90-day mortality; MELD 3.0 is used for US liver allocation since July 2023",
    type: "form",
    basis: "Kim et al., Gastroenterology 2021 (MELD 3.0); OPTN policy; Kim et al., NEJM 2008 (MELD-Na)",
    items: [
      { kind: "numbers", legend: "Labs", fields: [
        { key: "bili", label: "Bilirubin (mg/dL)", placeholder: "e.g. 2.0" },
        { key: "inr", label: "INR", placeholder: "e.g. 1.5" },
        { key: "cr", label: "Creatinine (mg/dL)", placeholder: "e.g. 1.2" },
        { key: "na", label: "Sodium (mEq/L)", placeholder: "e.g. 134" },
        { key: "alb", label: "Albumin (g/dL)", placeholder: "e.g. 3.0" }
      ] },
      { kind: "radio", key: "sex", legend: "Sex", noPts: true, opts: [{ label: "Male" }, { label: "Female" }] },
      { kind: "checks", legend: "Dialysis", items: [{ key: "dial", label: "Dialysis twice or more, or 24 h of CRRT, in the past week" }] }
    ],
    requireAll: true,
    compute: function (v) {
      if ([v.bili, v.inr, v.cr, v.na, v.alb].some(isNaN) || !v.sex) return null;
      var clamp = function (x, lo, hi) { return Math.min(Math.max(x, lo), hi); };
      var female = v.sex.index === 1 ? 1 : 0;
      var bili = Math.max(v.bili, 1), inr = Math.max(v.inr, 1), na = clamp(v.na, 125, 137);
      var cr3 = v.dial ? 3 : clamp(v.cr, 1, 3), alb = clamp(v.alb, 1.5, 3.5);
      var m3 = 1.33 * female + 4.56 * Math.log(bili) + 0.82 * (137 - na) - 0.24 * (137 - na) * Math.log(bili) + 9.09 * Math.log(inr) + 11.14 * Math.log(cr3) + 1.85 * (3.5 - alb) - 1.83 * (3.5 - alb) * Math.log(cr3) + 6;
      m3 = clamp(Math.round(m3), 6, 40);
      var cr4 = v.dial ? 4 : clamp(v.cr, 1, 4);
      var mi = Math.round((0.957 * Math.log(cr4) + 0.378 * Math.log(bili) + 1.120 * Math.log(inr) + 0.643) * 100) / 10;
      var mna = mi > 11 ? mi + 1.32 * (137 - na) - 0.033 * mi * (137 - na) : mi;
      mna = clamp(Math.round(mna), 6, 40);
      var band = m3 < 10 ? ["low", "about 2%"] : m3 < 20 ? ["mod", "about 6%"] : m3 < 30 ? ["high", "about 20%"] : m3 < 40 ? ["high", "about 50%"] : ["high", "over 70%"];
      return { total: m3, result: { tier: band[0], label: "MELD 3.0 " + m3 + " · MELD-Na " + mna, unit: "MELD 3.0", detail: "Estimated 90-day mortality " + band[1] + " (MELD-era estimates). MELD 3.0 adds sex and albumin to MELD-Na and caps creatinine at 3.0 mg/dL. " + (m3 >= 15 ? "Refer for transplant evaluation if not already listed." : "Hepatology follow-up; MELD 15 or more is a common threshold for transplant referral.") } };
    }
  },
  "Child-Pugh": {
    desc: "Cirrhosis severity and surgical risk",
    type: "checklist-multi",
    basis: "Pugh et al., Br J Surg 1973",
    sections: [
      { name: "Hepatic encephalopathy", opts: [{ label: "None", pts: 1 }, { label: "Grade 1–2 (or controlled with medication)", pts: 2 }, { label: "Grade 3–4", pts: 3 }] },
      { name: "Ascites", opts: [{ label: "Absent", pts: 1 }, { label: "Mild, or controlled with diuretics", pts: 2 }, { label: "Moderate to severe, or refractory", pts: 3 }] },
      { name: "Bilirubin", opts: [{ label: "Under 2 mg/dL", pts: 1 }, { label: "2–3 mg/dL", pts: 2 }, { label: "Over 3 mg/dL", pts: 3 }] },
      { name: "Albumin", opts: [{ label: "Over 3.5 g/dL", pts: 1 }, { label: "2.8–3.5 g/dL", pts: 2 }, { label: "Under 2.8 g/dL", pts: 3 }] },
      { name: "Prothrombin time prolonged, or INR", opts: [{ label: "Under 4 s, or INR under 1.7", pts: 1 }, { label: "4–6 s, or INR 1.7–2.3", pts: 2 }, { label: "Over 6 s, or INR over 2.3", pts: 3 }] }
    ],
    interpret: function (s) {
      if (s <= 6) return { tier: "low", label: "Class A", detail: "1-year survival about 100%, 2-year about 85%. Abdominal surgery mortality about 10%." };
      if (s <= 9) return { tier: "mod", label: "Class B", detail: "1-year survival about 80%, 2-year about 60%. Abdominal surgery mortality about 30%." };
      return { tier: "high", label: "Class C", detail: "1-year survival about 45%, 2-year about 35%. Abdominal surgery mortality about 80%. Transplant evaluation." };
    }
  },
  "Glasgow-Blatchford": {
    desc: "Upper GI bleeding: need for transfusion, endoscopic treatment or surgery",
    type: "form",
    basis: "Blatchford et al., Lancet 2000; ACG 2021 upper GI bleeding guideline",
    items: [
      { kind: "radio", key: "bun", legend: "BUN (mg/dL)", opts: [{ label: "Under 18.2", pts: 0 }, { label: "18.2–22.3", pts: 2 }, { label: "22.4–27.9", pts: 3 }, { label: "28–69.9", pts: 4 }, { label: "70 or more", pts: 6 }] },
      { kind: "radio", key: "hb", legend: "Hemoglobin (g/dL)", opts: [{ label: "Men 13 or more · women 12 or more", pts: 0 }, { label: "Men 12–12.9 · women 10–11.9", pts: 1 }, { label: "Men 10–11.9", pts: 3 }, { label: "Under 10 (men or women)", pts: 6 }] },
      { kind: "radio", key: "sbp", legend: "Systolic blood pressure (mmHg)", opts: [{ label: "110 or more", pts: 0 }, { label: "100–109", pts: 1 }, { label: "90–99", pts: 2 }, { label: "Under 90", pts: 3 }] },
      { kind: "checks", legend: "Other markers", items: [
        { key: "hr", label: "Heart rate 100 or more", pts: 1 },
        { key: "melena", label: "Melena", pts: 1 },
        { key: "syncope", label: "Syncope", pts: 2 },
        { key: "liver", label: "Known liver disease", pts: 2 },
        { key: "hf", label: "Known heart failure", pts: 2 }
      ] }
    ],
    interpret: function (s) {
      if (s <= 1) return { tier: "low", label: "Very low risk", detail: "A score of 0–1 identifies patients who can be discharged with outpatient follow-up (ACG 2021)." };
      return { tier: s >= 7 ? "high" : "mod", label: "Not low risk", detail: "Admit. Resuscitate first, then endoscopy within 24 hours (ACG 2021). Higher scores mean a greater chance of needing transfusion or intervention." };
    }
  },
  "Ranson (pancreatitis)": {
    desc: "Acute pancreatitis severity (admission and 48-hour criteria; non-gallstone version)",
    type: "checklist-grouped",
    basis: "Ranson et al., 1974; ACG 2024 acute pancreatitis guideline for management",
    groups: [
      { name: "At admission", items: [
        { label: "Age over 55", pts: 1 },
        { label: "WBC over 16,000/mm³", pts: 1 },
        { label: "Glucose over 200 mg/dL", pts: 1 },
        { label: "LDH over 350 IU/L", pts: 1 },
        { label: "AST over 250 IU/L", pts: 1 }
      ] },
      { name: "At 48 hours", items: [
        { label: "Hematocrit fall over 10%", pts: 1 },
        { label: "BUN rise over 5 mg/dL", pts: 1 },
        { label: "Calcium under 8 mg/dL", pts: 1 },
        { label: "PaO₂ under 60 mmHg", pts: 1 },
        { label: "Base deficit over 4 mEq/L", pts: 1 },
        { label: "Fluid sequestration over 6 L", pts: 1 }
      ] }
    ],
    interpret: function (s) {
      var mgmt = " Moderate, goal-directed fluids with lactated Ringer's (aggressive fluids increased fluid overload in the WATERFALL trial), early oral feeding within 24–48 hours as tolerated, and no prophylactic antibiotics (ACG 2024).";
      if (s < 3) return { tier: "low", label: "Predicted mild", detail: "Mortality under 1% in the original series." + mgmt };
      if (s <= 4) return { tier: "mod", label: "Predicted severe", detail: "Mortality about 15% in the original series. Close monitoring; consider a higher level of care." + mgmt };
      return { tier: "high", label: "Predicted severe", detail: "Mortality about 40% or higher in the original series. ICU-level care and GI or surgical input." + mgmt };
    }
  },
  "qSOFA": {
    desc: "Bedside prompt for poor outcome in suspected infection",
    type: "checklist",
    basis: "Seymour et al., JAMA 2016 (Sepsis-3); Surviving Sepsis Campaign 2021",
    criteria: [
      { label: "Altered mentation (GCS under 15)", pts: 1 },
      { label: "Respiratory rate 22 or more", pts: 1 },
      { label: "Systolic BP 100 mmHg or less", pts: 1 }
    ],
    interpret: function (s) {
      var caveat = " The Surviving Sepsis Campaign (2021) recommends against using qSOFA alone as a sepsis screen; SIRS, NEWS or MEWS are preferred.";
      if (s < 2) return { tier: "low", label: "qSOFA negative", detail: "Doesn't exclude sepsis." + caveat };
      return { tier: "high", label: "qSOFA positive", detail: "Higher risk of death or prolonged ICU stay if infection is present. Assess for organ dysfunction (SOFA). Give antibiotics within 1 hour if shock or sepsis is probable, and within 3 hours if sepsis is possible without shock." + caveat };
    }
  },
  "SOFA": {
    desc: "Sequential Organ Failure Assessment: organ dysfunction in the ICU",
    type: "checklist-multi",
    basis: "Vincent et al., Intensive Care Med 1996; mortality from Ferreira et al., JAMA 2001. SOFA-2 (JAMA, Oct 2025) revises the cut-points; this calculator uses the original SOFA, which Sepsis-3 is built on",
    sections: [
      { name: "Respiration (PaO₂/FiO₂)", opts: [{ label: "400 or more", pts: 0 }, { label: "Under 400", pts: 1 }, { label: "Under 300", pts: 2 }, { label: "Under 200 with respiratory support", pts: 3 }, { label: "Under 100 with respiratory support", pts: 4 }] },
      { name: "Coagulation (platelets ×10³/µL)", opts: [{ label: "150 or more", pts: 0 }, { label: "Under 150", pts: 1 }, { label: "Under 100", pts: 2 }, { label: "Under 50", pts: 3 }, { label: "Under 20", pts: 4 }] },
      { name: "Liver (bilirubin, mg/dL)", opts: [{ label: "Under 1.2", pts: 0 }, { label: "1.2–1.9", pts: 1 }, { label: "2.0–5.9", pts: 2 }, { label: "6.0–11.9", pts: 3 }, { label: "12.0 or more", pts: 4 }] },
      { name: "Cardiovascular", opts: [{ label: "MAP 70 mmHg or more", pts: 0 }, { label: "MAP under 70 mmHg", pts: 1 }, { label: "Dopamine 5 or less, or any dobutamine", pts: 2 }, { label: "Dopamine over 5, or epinephrine/norepinephrine 0.1 or less (µg/kg/min)", pts: 3 }, { label: "Dopamine over 15, or epinephrine/norepinephrine over 0.1 (µg/kg/min)", pts: 4 }] },
      { name: "Central nervous system (GCS)", opts: [{ label: "15", pts: 0 }, { label: "13–14", pts: 1 }, { label: "10–12", pts: 2 }, { label: "6–9", pts: 3 }, { label: "Under 6", pts: 4 }] },
      { name: "Renal (creatinine, mg/dL, or urine output)", opts: [{ label: "Under 1.2", pts: 0 }, { label: "1.2–1.9", pts: 1 }, { label: "2.0–3.4", pts: 2 }, { label: "3.5–4.9, or under 500 mL/day", pts: 3 }, { label: "5.0 or more, or under 200 mL/day", pts: 4 }] }
    ],
    interpret: function (s) {
      var note = " An acute rise of 2 or more points with infection defines sepsis (Sepsis-3).";
      if (s <= 6) return { tier: "low", label: "Lower dysfunction", detail: "Initial-SOFA mortality under 10%." + note };
      if (s <= 9) return { tier: "mod", label: "Moderate dysfunction", detail: "Initial-SOFA mortality about 15–20%." + note };
      if (s <= 12) return { tier: "high", label: "Significant dysfunction", detail: "Initial-SOFA mortality about 40–50%." + note };
      if (s <= 14) return { tier: "high", label: "Severe dysfunction", detail: "Initial-SOFA mortality about 50–60%." + note };
      return { tier: "high", label: "Severe dysfunction", detail: "Initial-SOFA mortality over 80%. Goals-of-care discussion alongside full support." + note };
    }
  },
  "APACHE II": {
    desc: "ICU severity of illness",
    type: "numeric",
    basis: "Knaus et al., Crit Care Med 1985",
    fields: [
      { label: "Age (years)", key: "age", placeholder: "e.g. 65" },
      { label: "Acute Physiology Score (APS)", key: "aps", placeholder: "0–60" },
      { label: "Chronic health points", key: "chp", placeholder: "0, 2 or 5" }
    ],
    note: "APS is the sum of 12 variables scored 0–4 each (temperature, MAP, HR, RR, oxygenation, arterial pH, sodium, potassium, creatinine (doubled for acute kidney injury), hematocrit, WBC, and 15 minus GCS). Age points are added automatically: 44 or under 0, 45–54 2, 55–64 3, 65–74 5, 75 or over 6. Chronic health: 5 for nonoperative or emergency surgery, 2 for elective surgery, if the patient has cirrhosis, NYHA IV heart failure, severe COPD, dialysis or immunocompromise.",
    interpret: function (f) {
      var age = parseInt(f.age, 10) || 0;
      var agePts = age <= 44 ? 0 : age <= 54 ? 2 : age <= 64 ? 3 : age <= 74 ? 5 : 6;
      var s = Math.round((parseInt(f.aps, 10) || 0) + (parseInt(f.chp, 10) || 0) + agePts);
      if (s < 10) return { tier: "low", label: "APACHE II " + s, detail: "Predicted hospital mortality about 4–8%." };
      if (s < 20) return { tier: "mod", label: "APACHE II " + s, detail: "Predicted hospital mortality about 15–25%." };
      if (s < 30) return { tier: "high", label: "APACHE II " + s, detail: "Predicted hospital mortality about 40–55%." };
      return { tier: "high", label: "APACHE II " + s, detail: "Predicted hospital mortality about 75% or higher." };
    }
  },
  "NIH Stroke Scale": {
    desc: "Stroke severity (scored item by item, each limb separately; 0–42)",
    type: "checklist-multi",
    basis: "NIH Stroke Scale; 2026 AHA/ASA acute ischemic stroke guideline",
    sections: [
      { name: "1a. Level of consciousness", opts: [{ label: "Alert", pts: 0 }, { label: "Arousable by minor stimulation", pts: 1 }, { label: "Needs repeated or painful stimulation", pts: 2 }, { label: "Unresponsive or reflex responses only", pts: 3 }] },
      { name: "1b. Questions (month, age)", opts: [{ label: "Both correct", pts: 0 }, { label: "One correct (or intubated, dysarthric)", pts: 1 }, { label: "Neither correct", pts: 2 }] },
      { name: "1c. Commands (eyes, grip)", opts: [{ label: "Both performed", pts: 0 }, { label: "One performed", pts: 1 }, { label: "Neither performed", pts: 2 }] },
      { name: "2. Best gaze", opts: [{ label: "Normal", pts: 0 }, { label: "Partial gaze palsy", pts: 1 }, { label: "Forced deviation or total gaze paresis", pts: 2 }] },
      { name: "3. Visual fields", opts: [{ label: "No visual loss", pts: 0 }, { label: "Partial hemianopia", pts: 1 }, { label: "Complete hemianopia", pts: 2 }, { label: "Bilateral hemianopia, including cortical blindness", pts: 3 }] },
      { name: "4. Facial palsy", opts: [{ label: "Normal", pts: 0 }, { label: "Minor", pts: 1 }, { label: "Partial (lower face)", pts: 2 }, { label: "Complete (upper and lower face)", pts: 3 }] },
      { name: "5a. Motor, left arm", opts: [{ label: "No drift for 10 s", pts: 0 }, { label: "Drift, doesn't hit bed", pts: 1 }, { label: "Some effort against gravity", pts: 2 }, { label: "No effort against gravity", pts: 3 }, { label: "No movement", pts: 4 }, { label: "Untestable (amputation, joint fusion)", pts: 0 }] },
      { name: "5b. Motor, right arm", opts: [{ label: "No drift for 10 s", pts: 0 }, { label: "Drift, doesn't hit bed", pts: 1 }, { label: "Some effort against gravity", pts: 2 }, { label: "No effort against gravity", pts: 3 }, { label: "No movement", pts: 4 }, { label: "Untestable (amputation, joint fusion)", pts: 0 }] },
      { name: "6a. Motor, left leg", opts: [{ label: "No drift for 5 s", pts: 0 }, { label: "Drift, doesn't hit bed", pts: 1 }, { label: "Some effort against gravity", pts: 2 }, { label: "No effort against gravity", pts: 3 }, { label: "No movement", pts: 4 }, { label: "Untestable (amputation, joint fusion)", pts: 0 }] },
      { name: "6b. Motor, right leg", opts: [{ label: "No drift for 5 s", pts: 0 }, { label: "Drift, doesn't hit bed", pts: 1 }, { label: "Some effort against gravity", pts: 2 }, { label: "No effort against gravity", pts: 3 }, { label: "No movement", pts: 4 }, { label: "Untestable (amputation, joint fusion)", pts: 0 }] },
      { name: "7. Limb ataxia", opts: [{ label: "Absent", pts: 0 }, { label: "Present in one limb", pts: 1 }, { label: "Present in two limbs", pts: 2 }] },
      { name: "8. Sensory", opts: [{ label: "Normal", pts: 0 }, { label: "Mild to moderate loss", pts: 1 }, { label: "Severe to total loss", pts: 2 }] },
      { name: "9. Best language", opts: [{ label: "No aphasia", pts: 0 }, { label: "Mild to moderate aphasia", pts: 1 }, { label: "Severe aphasia", pts: 2 }, { label: "Mute or global aphasia", pts: 3 }] },
      { name: "10. Dysarthria", opts: [{ label: "Normal", pts: 0 }, { label: "Mild to moderate", pts: 1 }, { label: "Severe, unintelligible or mute", pts: 2 }] },
      { name: "11. Extinction and inattention", opts: [{ label: "None", pts: 0 }, { label: "In one modality", pts: 1 }, { label: "Profound, or in more than one modality", pts: 2 }] }
    ],
    interpret: function (s) {
      var tx = " IV thrombolysis (tenecteplase or alteplase, equally preferred) is for disabling deficits within 4.5 hours, and up to 9 hours in selected patients with imaging. Thrombectomy is for large vessel occlusion. (AHA/ASA 2026)";
      if (s === 0) return { tier: "low", label: "No measurable deficit", detail: "A score of 0 doesn't exclude stroke; posterior circulation strokes can score low." };
      if (s <= 4) return { tier: "low", label: "Minor stroke", detail: "If the deficit is not disabling, don't give thrombolysis; dual antiplatelet therapy is recommended for NIHSS 5 or less, started within 72 hours." + tx };
      if (s <= 15) return { tier: "mod", label: "Moderate stroke", detail: "Urgent CT and CTA." + tx };
      if (s <= 20) return { tier: "high", label: "Moderate to severe stroke", detail: "Urgent CT and CTA; stroke unit or ICU." + tx };
      return { tier: "high", label: "Severe stroke", detail: "Urgent CT and CTA; ICU-level monitoring." + tx };
    }
  }
};
