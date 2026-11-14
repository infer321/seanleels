/* Before You Page Ophtho · worksheet, page builder and bedside tools. Plain JS, no build step.
   Nothing typed here is stored or sent. Only the screen calibration is kept, in localStorage. See DESIGN.md. */
(function(){
"use strict";

/* ---------- data ---------- */
const VA = ["20/20","20/25","20/30","20/40","20/50","20/60","20/70","20/80","20/100","20/200","20/400","CF","HM","LP","NLP"];
const MM = ["1","2","3","4","5","6","7","8","9"];
const PEN = [
  ["lids","Lids",[["lid_nl","normal"],["lid_sw","swollen"],["lid_pt","ptosis"],["lid_lac","laceration"]]],
  ["conj","Conjunctiva",[["cj_q","quiet"],["cj_diff","diffuse injection"],["cj_flush","ring around cornea (ciliary flush)"],["cj_sch","subconj hemorrhage"],["cj_chem","chemosis"]]],
  ["cornea","Cornea",[["co_cl","clear"],["co_haze","hazy"],["co_opac","white spot / opacity"],["co_fl","fluorescein uptake"],["co_fb","foreign body"]]],
  ["AC","Anterior chamber",[["ac_deep","deep"],["ac_shal","shallow"],["ac_hyph","hyphema"],["ac_hypo","hypopyon"]]],
  ["pupil","Pupil shape",[["ps_round","round"],["ps_peak","peaked / irregular"]]]
];
const PENLAB = {}; PEN.forEach(g => g[2].forEach(c => PENLAB[c[0]] = [g[0], c[1]]));

const F_ENDO = {id:"endo",lvl:"emergent",label:"Eye surgery or intravitreal injection in the past 6 weeks, now painful or blurry",short:"recent surgery/injection, ?endophthalmitis",act:"Possible endophthalmitis. Call ophtho directly and note the procedure and date. Don’t start drops or steroids on your own."};
const F_GCA = {id:"gca",lvl:"emergent",label:"Age over 50 with jaw claudication, scalp tenderness, or PMR symptoms",short:"?GCA",act:"Send ESR, CRP, and platelets now. If suspicion is high, high-dose steroids should not wait for a temporal artery biopsy. Discuss timing with ophtho and rheumatology."};
const F_CN3 = {id:"cn3",lvl:"emergent",label:"Droopy lid with an eye that sits down and out, and a large pupil",short:"pupil-involving CN3",act:"Treat as a posterior communicating artery aneurysm until proven otherwise. CTA or MRA head now."};

const C = {
  vision:{name:"Vision loss",sub:"Sudden or new decrease",short:"vision loss",eye:true,base:"urgent",
    exams:["va","pupils","iop","eom","cvf","pen"],
    req:["eye","q:onset","q:lkw","va","pupils","iop","cvf"],
    qs:[
      {id:"onset",label:"Onset",type:"seg",pg:1,opts:[["sudden","Sudden (seconds to minutes)","sudden"],["hours","Over hours to days","over hrs-days"],["gradual","Gradual (weeks or longer)","gradual"]]},
      {id:"lkw",label:"Last known well / time noticed",type:"text",ph:"e.g. 18:40, woke up with it",pg:1,pfx:"LKW "},
      {id:"pain",label:"Pain",type:"seg",pg:1,opts:[["painless","Painless"],["painful","Painful"]]},
      {id:"course",label:"Course",type:"seg",opts:[["persist","Persistent"],["transient","Transient, now resolved"]]}
    ],
    hx:[["curtain","Curtain or shade"],["flashes","Flashes / new floaters"],["jaw","Jaw claudication"],["scalp","Scalp tenderness"],["pmr","Fever, weight loss, or PMR symptoms"],["surg","Recent eye surgery or injection"],["ha","Headache"],["neuro","Other neuro deficits"],["prior","Prior transient episodes"],["base","Poor baseline vision in this eye"]],
    flags:[
      {id:"crao",lvl:"emergent",label:"Sudden, painless, one-eye vision loss within the last 24 hours",short:"?CRAO",act:"Treat it as an acute ischemic stroke. Activate your stroke pathway now and document last known well; don’t hold the stroke workup for the eye exam. Some centers consider thrombolysis within 4.5 hours."},
      F_GCA, F_ENDO,
      {id:"rd",lvl:"urgent",label:"Curtain or shade, with flashes or floaters",short:"?RD",act:"Possible retinal detachment. Same-day ophtho exam. Record whether central vision is still preserved; macula-on detachments are the most time-sensitive."},
      {id:"binoc",lvl:"emergent",label:"Loss in both eyes, or a field cut on the same side in each eye",short:"binocular/homonymous loss",act:"This points to the brain (chiasm or occipital lobe), not the eye. If acute, run it as a stroke and involve neurology; ophtho is secondary."}
    ],
    done:[["cth","CT head"],["cta","CTA head and neck"],["mri","MRI brain"],["esr","ESR / CRP / platelets"],["stroke","Stroke team activated"],["gluc","Glucose"]],
    qtpl:["Please evaluate for CRAO in setting of sudden painless monocular vision loss; stroke team aware.","Please evaluate acute vision loss; concern for GCA.","Please evaluate subacute vision loss and advise on timing of exam."],
    tips:["Test each eye separately with the other covered. “Can’t see” in both eyes often turns out to be one eye.","An APD in the affected eye points to the retina or optic nerve rather than the cornea or a cataract."]
  },
  redeye:{name:"Red or painful eye",sub:"Injection, pain, discharge",short:"red eye",eye:true,base:"routine",
    exams:["va","pupils","iop","pen"],
    req:["eye","q:pain","q:cl","va","pupils","iop","pen"],
    qs:[
      {id:"pain",label:"Pain",type:"seg",pg:1,opts:[["none","None","no pain"],["irrit","Irritation, gritty","irritation"],["severe","Deep or severe","severe pain"]]},
      {id:"cl",label:"Contact lens wearer",type:"seg",pg:1,opts:[["no","No","no CL"],["yes","Yes","CL wearer"]]},
      {id:"dc",label:"Discharge",type:"seg",opts:[["none","None"],["watery","Watery"],["purulent","Purulent"],["hyper","Copious, re-accumulates"]]},
      {id:"photo",label:"Photophobia",type:"seg",pg:1,opts:[["no","No","no photophobia"],["yes","Yes","photophobia"]]}
    ],
    hx:[["halos","Halos around lights"],["nausea","Headache or nausea"],["surg","Recent eye surgery or injection"],["trauma","Trauma or foreign body"],["rash","Vesicular rash on forehead or nose"],["autoimm","Autoimmune disease"],["itch","Itching"],["sick","Sick contacts"],["prior","Similar prior episodes"]],
    flags:[
      {id:"aacg",lvl:"emergent",label:"Mid-dilated, poorly reactive pupil with a hazy cornea, headache, or nausea",short:"?acute angle closure",act:"Possible acute angle-closure glaucoma. Check IOP if you can (often above 40). Call ophtho now; pressure-lowering drops and acetazolamide are usually started on their direction. Give no dilating drops."},
      F_ENDO,
      {id:"hypopyon",lvl:"emergent",label:"White layer of cells at the bottom of the anterior chamber (hypopyon)",short:"hypopyon",act:"Suggests endophthalmitis or severe keratitis or uveitis. Call ophtho now."},
      {id:"clker",lvl:"urgent",label:"Contact lens wearer with pain, or a white spot on the cornea",short:"CL wearer, ?keratitis",act:"Possible microbial keratitis (think Pseudomonas). Remove the lens and save it with the case for culture. Don’t patch. Same-day exam."},
      {id:"hyper",lvl:"urgent",label:"Copious purulent discharge that re-accumulates within minutes",short:"hyperpurulent discharge",act:"Concern for gonococcal conjunctivitis, which can perforate the cornea. Same-day exam, Gram stain and culture, and a sexual history."},
      {id:"hzo",lvl:"urgent",label:"Vesicular rash in the V1 distribution, especially the tip of the nose",short:"?HZO",act:"Herpes zoster ophthalmicus. Nose-tip involvement (Hutchinson sign) raises the chance of eye involvement. Start systemic antivirals per your protocol; ophtho exam within 24 hours."},
      {id:"scler",lvl:"urgent",label:"Severe, boring pain that wakes them from sleep, with a tender globe",short:"?scleritis",act:"Possible scleritis, often tied to systemic autoimmune disease. Same-day or next-day exam."},
      {id:"iritis",lvl:"urgent",label:"Decreased vision and photophobia with redness concentrated around the cornea",short:"?iritis/keratitis",act:"Suggests iritis or keratitis. Needs a slit lamp exam within 24 hours. Don’t start steroid drops before that exam."}
    ],
    routineNote:"No red flags checked. Normal vision with no pain, photophobia, or contact lens use usually means conjunctivitis or a subconjunctival hemorrhage, which rarely needs an overnight page.",
    done:[["fluor","Fluorescein exam"],["clrem","Contact lens removed and saved"],["cx","Cultures sent"],["bp","BP checked"]],
    qtpl:["Please evaluate painful red eye with decreased vision; concern for keratitis.","Please evaluate red eye with elevated IOP; concern for acute angle closure.","Please evaluate red eye; no red flags, please advise whether inpatient exam is needed."],
    tips:["Note where the redness sits: diffuse (conjunctivitis), a ring around the cornea (iritis, keratitis), or a flat red patch (subconjunctival hemorrhage).","Pain that disappears with a drop of topical anesthetic points to the corneal surface."]
  },
  trauma:{name:"Eye trauma",sub:"Blunt, sharp, projectile",short:"eye trauma",eye:true,base:"urgent",
    exams:["va","pupils","eom","iop","pen"],
    req:["eye","q:mech","q:time","q:npo","q:tet","va","pupils","eom","iop","pen"],
    qs:[
      {id:"mech",label:"Mechanism",type:"seg",pg:1,opts:[["blunt","Blunt"],["sharp","Sharp / penetrating"],["proj","High-velocity projectile"],["fall","Fall"],["assault","Assault"]]},
      {id:"time",label:"Time of injury",type:"text",ph:"e.g. 14:15",pg:1,pfx:"at "},
      {id:"npo",label:"Last oral intake",type:"text",ph:"For OR planning"},
      {id:"tet",label:"Tetanus",type:"seg",opts:[["utd","Up to date"],["given","Given here"],["unk","Unknown"]]},
      {id:"prot",label:"Eye protection worn",type:"seg",opts:[["none","None"],["glasses","Glasses"],["safety","Safety eyewear"]]}
    ],
    hx:[["loc","Loss of consciousness"],["dip","Double vision"],["numb","Cheek or upper lip numbness"],["painEom","Pain with eye movement"],["nv","Nausea or vomiting"],["metal","Hammering or grinding metal"],["cl","Contact lens in"],["sickle","Sickle cell disease or trait"],["ac","On anticoagulant or antiplatelet"]],
    flags:[
      {id:"og",lvl:"emergent",og:1,label:"Any open-globe sign: peaked pupil, full-thickness laceration, exposed dark tissue, 360° bulging subconjunctival hemorrhage, or a flat anterior chamber",short:"suspected open globe",act:"Treat as an open globe. Rigid shield (no patch, no pressure). Head of bed 30°, NPO, antiemetics to prevent Valsalva, pain control, tetanus, and IV antibiotics per your protocol. CT orbits with thin cuts; no MRI if metal is possible. Don’t measure IOP. Leave any impaled object in place."},
      {id:"iofb",lvl:"emergent",og:1,label:"High-velocity mechanism (hammering metal, grinding, explosion)",short:"?intraocular FB",act:"Possible intraocular foreign body even if the eye looks normal. Shield it, CT orbits with thin cuts, and no MRI."},
      {id:"rbh",lvl:"emergent",label:"Bulging eye, tense lids, resistance to gentle pressure, with vision loss or an APD",short:"?retrobulbar hemorrhage",act:"Possible orbital compartment syndrome. Lateral canthotomy and cantholysis should not wait for imaging; vision can be lost in about 90 minutes. Call ophtho now, and act if you’re trained."},
      {id:"entrap",lvl:"emergent",label:"Restricted up or down gaze with pain, nausea, or bradycardia",short:"?entrapment",act:"Possible orbital floor fracture with muscle entrapment. The oculocardiac reflex can cause bradycardia and syncope. In children the eye can look almost normal (“white-eyed blowout”). Needs urgent surgical evaluation."},
      {id:"hyphema",lvl:"urgent",label:"Blood layering in the anterior chamber (hyphema)",short:"hyphema",act:"Shield, head of bed 30°, avoid NSAIDs and antiplatelets if you can, and check sickle status. Watch for IOP spikes."},
      {id:"lid",lvl:"urgent",label:"Laceration through the lid margin or near the inner corner (tear duct)",short:"lid margin/canalicular lac",act:"Don’t close it in the ED. These need ophtho or oculoplastics repair to protect lid function and tear drainage. Always look for a globe injury underneath."}
    ],
    done:[["shield","Rigid shield on"],["npo","NPO"],["tet","Tetanus updated"],["abx","IV antibiotics"],["antiem","Antiemetic"],["ctorb","CT orbits (thin cuts)"],["ctface","CT face"],["canth","Lateral canthotomy done"]],
    qtpl:["Please evaluate for open globe injury; shielded and NPO.","Please evaluate blunt eye trauma with hyphema.","Please evaluate orbital fracture; concern for entrapment."],
    tips:["Pupil shape is the cheapest open-globe screen you have. Look for a peaked or teardrop pupil.","If the lids are too swollen to open, don’t force them. That pressure can push intraocular contents out."]
  },
  chem:{name:"Chemical exposure",sub:"Splash, alkali, acid",short:"chemical injury",alarm:true,eye:true,base:"urgent",
    exams:["va","pen"],
    req:["eye","q:agent","q:time","q:vol","q:phpost","va","pen"],
    qs:[
      {id:"agent",label:"Agent",type:"seg",pg:1,opts:[["alkali","Alkali"],["acid","Acid"],["irr","Irritant / solvent"],["unk","Unknown"]]},
      {id:"what",label:"Substance",type:"text",ph:"e.g. drain cleaner, wet cement"},
      {id:"time",label:"Time of exposure",type:"text",ph:"e.g. 09:30"},
      {id:"vol",label:"Volume irrigated",type:"text",ph:"e.g. 2 L NS via Morgan lens"},
      {id:"phpre",label:"pH before irrigation",type:"num",ph:"e.g. 11"},
      {id:"phpost",label:"pH 5–10 min after stopping",type:"num",ph:"e.g. 7.2",pg:1,pfx:"pH ",sfx:" post-irrigation"}
    ],
    hx:[["part","Particles (cement, lime) present"],["cl","Contact lens in at the time"],["lidburn","Eyelid or facial burns"],["inhal","Inhalation exposure"]],
    flags:[
      {id:"ischem",lvl:"emergent",label:"White, blanched areas at the edge of the cornea, or an opaque cornea",short:"limbal ischemia",act:"Severe chemical injury. Keep irrigating and call ophtho now."}
    ],
    done:[["irr","Irrigation started"],["anes","Topical anesthetic"],["sweep","Fornices swept"],["evert","Lids everted, particles removed"],["recheck","pH rechecked after waiting"]],
    qtpl:["Please evaluate alkali chemical injury; irrigated to neutral pH.","Please evaluate chemical splash injury after irrigation."],
    tips:["Testing pH should never delay irrigation. Start with the nearest clean fluid.","Normal saline and lactated Ringer’s both work. A Morgan lens makes large volumes easier."]
  },
  flashes:{name:"Flashes & floaters",sub:"New photopsias, cobwebs",short:"new flashes/floaters",eye:true,base:"routine",
    exams:["va","pupils","cvf"],
    req:["eye","q:onset","va","pupils","cvf"],
    qs:[
      {id:"onset",label:"Started",type:"seg",pg:1,opts:[["today","Today","today"],["days","1–3 days ago","1-3 d"],["week","Up to 2 weeks ago","<2 wk"],["old","Longer ago",">2 wk"]]}
    ],
    hx:[["myopia","Very nearsighted"],["priorRd","Prior retinal tear or detachment"],["cat","Recent cataract surgery"],["trauma","Recent eye trauma"],["migr","Zigzag in both eyes that spread and cleared within an hour"],["fam","Family history of detachment"]],
    flags:[
      {id:"curtain",lvl:"urgent",label:"Curtain, shadow, or missing part of the visual field",short:"field loss, ?RD",act:"Possible retinal detachment. Same-day exam. Note whether central vision is still intact."},
      {id:"shower",lvl:"urgent",label:"Sudden shower of floaters, like smoke or soot",short:"shower of floaters",act:"Suggests vitreous hemorrhage, often from a retinal tear. Same-day dilated exam."},
      {id:"drop",lvl:"urgent",label:"Central vision is now decreased",short:"decreased VA",act:"Vision loss with new floaters raises concern for a detachment involving the macula or a dense hemorrhage. Same-day exam."}
    ],
    routineNote:"No red flags checked, but new flashes or floaters still need a dilated exam soon, usually within a few days. About 1 in 7 patients with these symptoms has a retinal tear. Confirm they can get to clinic.",
    done:[],
    qtpl:["Please evaluate new flashes and floaters with a field defect; concern for retinal detachment.","Please evaluate new flashes and floaters for dilated exam; no field defect."],
    tips:["Migraine aura usually affects both eyes, moves across the field, and clears within an hour. Retinal flashes are brief, in one eye, and often off to the side."]
  },
  disc:{name:"Disc edema / headache",sub:"“Rule out papilledema”",short:"?optic disc edema",eye:false,eyeDefault:"OU",base:"urgent",
    exams:["va","pupils","eom","cvf"],
    req:["q:img","va","pupils","eom","cvf"],
    qs:[
      {id:"img",label:"Imaging done",type:"seg",pg:1,opts:[["none","None yet","no imaging yet"],["ct","CT head only","CT head"],["mrv","MRI + MRV","MRI/MRV done"],["ctv","CT + CTV","CT/CTV done"]]},
      {id:"lp",label:"Lumbar puncture",type:"seg",opts:[["no","Not done"],["yes","Done"]]},
      {id:"op",label:"Opening pressure (cm H₂O)",type:"num",ph:"e.g. 32",pg:1,pfx:"OP "},
      {id:"bp",label:"Blood pressure",type:"text",ph:"e.g. 142/88"}
    ],
    hx:[["lying","Worse lying down or in the morning"],["tvo","Vision greys out for seconds"],["tinn","Pulsatile tinnitus"],["dip","Double vision"],["wt","Recent weight gain"],["meds","Tetracyclines, vitamin A, or isotretinoin"],["preg","Pregnant or postpartum"],["fever","Fever or neck stiffness"],["thunder","Thunderclap onset"]],
    flags:[
      {id:"focal",lvl:"emergent",label:"Focal neuro deficit or altered mental status",short:"focal neuro deficit",act:"Neuroimaging and neurology come first. The eye exam can wait until the patient is stable."},
      {id:"thunder",lvl:"emergent",label:"Thunderclap headache",short:"thunderclap HA",act:"Work up subarachnoid hemorrhage and venous sinus thrombosis now. Don’t wait for a fundus exam."},
      {id:"htn",lvl:"emergent",label:"BP 180/120 or higher with headache or visual symptoms",short:"?hypertensive emergency",act:"Possible hypertensive emergency. Disc swelling here is treated by lowering BP; ophtho can confirm retinopathy but shouldn’t delay treatment."},
      {id:"mening",lvl:"emergent",label:"Fever with neck stiffness or altered mental status",short:"?meningitis",act:"Meningitis workup and empiric treatment come before the eye exam."},
      {id:"vl",lvl:"urgent",label:"Decreased vision or a visual field defect",short:"vision/field loss",act:"Vision loss with disc swelling warrants a same-day ophtho exam, since optic nerve damage can become permanent."}
    ],
    done:[["ct","CT head"],["mri","MRI brain"],["mrv","MRV / CTV"],["lp","LP with opening pressure"],["neuro","Neurology consulted"]],
    qtpl:["Please perform dilated fundus exam to evaluate for optic disc edema; MRI/MRV pending.","Please evaluate optic disc edema with vision loss; LP opening pressure above."],
    tips:["Get imaging (ideally MRI with MRV) before an LP when you suspect raised intracranial pressure.","Call it “optic disc edema” until raised intracranial pressure is confirmed. Papilledema means disc swelling from raised ICP specifically."]
  },
  diplopia:{name:"Double vision",sub:"New diplopia",short:"diplopia",eye:false,eyeDefault:"OU",base:"urgent",
    exams:["va","pupils","eom"],
    req:["q:mb","q:dir","va","pupils","eom"],
    qs:[
      {id:"mb",label:"Cover test",type:"seg",pg:1,opts:[["bino","Gone when either eye is covered (binocular)","binocular"],["mono","Persists with one eye covered (monocular)","monocular"]]},
      {id:"dir",label:"Images are",type:"seg",pg:1,opts:[["horiz","Side by side","horizontal"],["vert","Stacked","vertical"],["obl","Diagonal","oblique"]]},
      {id:"worse",label:"Worse when",type:"text",ph:"e.g. looking left, at distance"},
      {id:"onset",label:"Onset",type:"text",ph:"e.g. woke up with it, 2 days ago"}
    ],
    hx:[["ptosis","Droopy eyelid"],["pain","Eye or head pain"],["fatig","Worse at end of day"],["bulbar","Trouble swallowing or breathing"],["neuro","Other neuro deficits"],["vasc","Diabetes or hypertension"],["trauma","Recent head or face trauma"],["prop","Eye bulging"]],
    flags:[
      F_CN3,
      {id:"neuro",lvl:"emergent",label:"Any other brainstem sign: ataxia, weakness, slurred speech, vertigo",short:"other neuro deficits",act:"Run it as a posterior circulation stroke. Neurology first."},
      {id:"orb",lvl:"emergent",label:"Eye bulging, pain with eye movement, lid swelling, or fever",short:"?orbital cellulitis",act:"Possible orbital cellulitis or cavernous sinus thrombosis. CT orbits with contrast, blood cultures, and IV antibiotics."},
      F_GCA,
      {id:"mg",lvl:"emergent",label:"Weakness with trouble swallowing or breathing",short:"?myasthenic crisis",act:"Possible myasthenic crisis. Check NIF and vital capacity and involve neurology now."}
    ],
    done:[["cta","CTA / MRA head"],["mri","MRI brain"],["neuro","Neurology consulted"],["esr","ESR / CRP"]],
    qtpl:["Please evaluate new binocular diplopia; neuro exam otherwise nonfocal.","Please evaluate diplopia with ptosis and anisocoria; CTA pending."],
    tips:["Cover each eye in turn. If the double image disappears with either eye covered, it’s binocular and usually neurologic. If it persists in one eye, the cause is in that eye."]
  },
  aniso:{name:"Unequal pupils",sub:"New anisocoria",short:"anisocoria",eye:false,base:"routine",
    exams:["va","eom"],
    req:["q:odl","q:osl","q:odd","q:osd","q:ptosis","eom"],
    qs:[
      {id:"odl",label:"OD in bright light (mm)",type:"num",ph:"e.g. 6"},
      {id:"osl",label:"OS in bright light (mm)",type:"num",ph:"e.g. 3"},
      {id:"odd",label:"OD in dim room (mm)",type:"num",ph:"e.g. 7"},
      {id:"osd",label:"OS in dim room (mm)",type:"num",ph:"e.g. 6"},
      {id:"ptosis",label:"Ptosis",type:"seg",opts:[["none","None"],["OD","OD"],["OS","OS"]]}
    ],
    hx:[["neb","Ipratropium or other nebulizers"],["scop","Scopolamine patch"],["drops","Recent eye drops"],["neck","Neck pain or recent neck trauma"],["ha","Headache"],["old","Visible in old photos"]],
    flags:[
      F_CN3,
      {id:"horner",lvl:"emergent",label:"New small pupil with mild ptosis, plus neck or face pain",short:"painful Horner",act:"Possible carotid dissection. CTA head and neck now."}
    ],
    done:[["cta","CTA head and neck"],["mri","MRI brain"],["meds","Med list checked for anticholinergics"]],
    qtpl:["Please evaluate new anisocoria, greater in light; no ptosis or EOM deficit.","Please evaluate anisocoria with ptosis; concern for Horner syndrome."],
    tips:["Measure both pupils in bright light and in a dim room. Whichever condition makes the difference bigger tells you which pupil is abnormal."]
  },
  candida:{name:"Candidemia screen",sub:"Inpatient fundus exam",short:"candidemia screen",eye:false,eyeDefault:"OU",base:"routine",
    exams:["va"],
    req:["q:cx","q:neut","q:sx","q:af"],
    qs:[
      {id:"cx",label:"First positive culture (date)",type:"text",ph:"e.g. 10/5",pg:1,pfx:"+cx "},
      {id:"sp",label:"Species",type:"text",ph:"e.g. C. albicans",pg:1},
      {id:"neut",label:"Neutropenia",type:"seg",pg:1,opts:[["no","Not neutropenic","non-neutropenic"],["yes","Neutropenic","neutropenic"]]},
      {id:"sx",label:"Eye symptoms",type:"seg",pg:1,opts:[["no","None","no visual sx"],["yes","Present","visual sx"]]},
      {id:"af",label:"Antifungal and start date",type:"text",ph:"e.g. micafungin since 10/5"},
      {id:"line",label:"Central line",type:"seg",opts:[["rem","Removed"],["in","Still in"],["na","None"]]},
      {id:"pos",label:"Can sit up for exam",type:"seg",opts:[["yes","Yes"],["no","No, bed-bound or intubated"]]}
    ],
    hx:[],
    flags:[
      {id:"vis",lvl:"urgent",label:"New floaters, blurred vision, or eye pain",short:"visual symptoms",act:"Symptomatic patients should be seen sooner. Eye involvement can change the antifungal choice and duration; echinocandins penetrate the eye poorly."}
    ],
    routineNote:"IDSA (2016) recommends a dilated exam within the first week for non-neutropenic patients, and after count recovery for neutropenic patients. Some centers now screen more selectively, so follow your local protocol.",
    done:[["rpt","Repeat blood cultures"],["line","Line removed"],["id","ID consulted"],["echo","Echocardiogram"]],
    qtpl:["Please perform dilated fundus exam to screen for Candida chorioretinitis / endophthalmitis."],
    tips:["Say whether the patient can sit up or is intubated. It changes who comes and what equipment they bring."]
  }
};
const ORDER = ["vision","redeye","trauma","chem","flashes","disc","diplopia","aniso","candida"];
Object.keys(C).forEach(k => C[k].id = k);

const LV = {
  emergent:{word:"Emergent",text:"Call now. Page and phone ophthalmology, and start the actions below while you wait."},
  urgent:{word:"Urgent",text:"Same-day consult. Page once the workup below is complete."},
  routine:{word:"Routine",text:"Not time-critical. Often fine for next-day or outpatient follow-up."}
};
const RANK = {routine:0,urgent:1,emergent:2};
const RLAB = {eye:"Which eye",va:"Visual acuity, each eye",pupils:"Pupil size and APD",iop:"IOP (or why not)",eom:"Eye movements",cvf:"Confrontation fields",pen:"Penlight findings",question:"Consult question",cb:"Callback number"};
const RJUMP = {eye:"fld-eye",va:"mod-va",pupils:"mod-pupils",iop:"mod-iop",eom:"mod-eom",cvf:"mod-cvf",pen:"mod-pen",question:"fld-question",cb:"fld-pt_cb"};

/* ---------- state ---------- */
const S = {cid:"vision",v:{},hx:{},fl:{},dn:{},pen:{},example:false,out:"full",undo:null};
const cur = () => C[S.cid];

function loadExample(){
  S.cid = "vision";
  S.v = {pt_age:"68",pt_sex:"F",pt_loc:"ED",pt_svc:"Emergency Medicine",pt_cb:"x4-1234",pt_pmh:"HTN, atrial fibrillation on apixaban",
    eye:"OD",q_onset:"sudden",q_lkw:"18:40, about 2 h ago",q_pain:"painless",q_course:"persist",
    va_od:"CF",va_os:"20/25",va_m:"near",va_c:"cc",p_od:"4",p_os:"4",pr_od:"sluggish",pr_os:"brisk",apd:"OD",
    iop_od:"16",iop_os:"15",iop_d:"tonopen",eom:"full",cvf:"defect",cvf_t:"OD: unable to count fingers in any quadrant",
    question:C.vision.qtpl[0]};
  S.hx = {curtain:-1,jaw:-1,scalp:-1,pmr:-1,surg:-1,neuro:-1,prior:-1};
  S.fl = {crao:true}; S.dn = {cth:1,cta:1,esr:1,stroke:1};
  S.pen = {lid_nl:1,cj_q:1,co_cl:1,ac_deep:1,ps_round:1};
  S.example = true;
}
function clearAll(keep){
  S.undo = keep && !S.example ? JSON.stringify({v:S.v,hx:S.hx,fl:S.fl,dn:S.dn,pen:S.pen}) : null;
  S.v = {}; S.hx = {}; S.fl = {}; S.dn = {}; S.pen = {}; S.example = false;
  if (cur().eyeDefault) S.v.eye = cur().eyeDefault;
}
function setComplaint(id){
  if (S.example){ S.cid = id; clearAll(); return; }
  S.cid = id; S.hx = {}; S.fl = {}; S.dn = {};
  Object.keys(S.v).forEach(k => { if (k.startsWith("q_") || k === "question") delete S.v[k]; });
  S.undo = null;
  /* A complaint with no eye picker must not carry a hidden eye over from the last one */
  if (cur().eyeDefault) S.v.eye = cur().eyeDefault; else if (!cur().eye || S.v.eye === "OU") delete S.v.eye;
}

/* ---------- helpers ---------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const val = k => (S.v[k] == null ? "" : String(S.v[k]).trim());
const reqSet = () => new Set(cur().req.concat(["question","cb"]));

function segH(k, opts, aria){
  return `<div class="seg" role="group" aria-label="${esc(aria||"")}" data-seg="${k}">` +
    opts.map(o => `<button type="button" data-v="${esc(o[0])}" aria-pressed="${S.v[k]===o[0]}">${esc(o[1])}</button>`).join("") + `</div>`;
}
function inH(k, type, ph){
  const num = type === "num";
  return `<input id="f-${k}" data-k="${k}" type="text" ${num?'inputmode="decimal"':""} autocomplete="off" value="${esc(S.v[k]||"")}" placeholder="${esc(ph||"")}">`;
}
function selH(k, opts, ph){
  return `<select id="f-${k}" data-k="${k}"><option value="">${esc(ph||"—")}</option>` +
    opts.map(o => `<option value="${esc(o)}" ${S.v[k]===o?"selected":""}>${esc(o)}</option>`).join("") + `</select>`;
}
function fieldH(label, ctrl, o){
  o = o || {};
  return `<div class="field${o.wide?" wide":""}"${o.id?` id="${o.id}"`:""}><span class="lab">${o.for?`<label for="${o.for}">${o.sr?`<span class="vh">${esc(o.sr)} </span>`:""}${esc(label)}</label>`:esc(label)}${o.req?'<span class="req" aria-hidden="true"></span><span class="vh"> (ophtho will ask)</span>':""}</span>${ctrl}${o.hint?`<p class="hint">${o.hint}</p>`:""}</div>`;
}
const hxSR = s => s === 1 ? ", present" : s === -1 ? ", denied" : ", not asked";
const reqTag = r => reqSet().has(r) ? `<span class="req-tag">Ophtho will ask</span>` : "";

/* ---------- form ---------- */
function modVA(){
  return `<div class="mod" id="mod-va"><div class="mod-h"><h3>Visual acuity</h3>${reqTag("va")}</div>
  <p class="hint">Each eye separately with the other covered. Glasses on, or through a pinhole. No chart nearby? Use the near card under Bedside tools.</p>
  <div class="grid2">${fieldH("OD (right)", selH("va_od",VA,"Select"),{for:"f-va_od"})}${fieldH("OS (left)", selH("va_os",VA,"Select"),{for:"f-va_os"})}</div>
  ${fieldH("Chart", segH("va_m",[["near","Near card at 14 in"],["snellen","Snellen at 20 ft"],["phone","Phone chart"]],"Chart"))}
  ${fieldH("Correction", segH("va_c",[["cc","With glasses"],["sc","Without"],["ph","Pinhole"]],"Correction"))}</div>`;
}
function modPupils(){
  const col = (e, n) => `<div class="eyecol"><div class="eyelab">${e}<span>${n}</span></div>${fieldH("Size (mm)", selH("p_"+e.toLowerCase(),MM,"mm"),{for:"f-p_"+e.toLowerCase(),sr:e})}${segH("pr_"+e.toLowerCase(),[["brisk","Brisk"],["sluggish","Sluggish"],["fixed","Fixed"]],e+" reactivity")}</div>`;
  return `<div class="mod" id="mod-pupils"><div class="mod-h"><h3>Pupils</h3>${reqTag("pupils")}</div>
  <div class="grid2">${col("OD","right")}${col("OS","left")}</div>
  ${fieldH("Relative APD (swinging flashlight)", segH("apd",[["none","None"],["OD","OD"],["OS","OS"],["na","Can’t assess"]],"APD"),{hint:"Swing the light between eyes every 2–3 seconds. The pupil that dilates when the light reaches it has the APD. One working pupil is enough to check."})}</div>`;
}
function modIOP(){
  return `<div class="mod" id="mod-iop"><div class="mod-h"><h3>Intraocular pressure</h3>${reqTag("iop")}</div>
  <p class="warnline" id="iopWarn" hidden>Possible open globe. Do not measure IOP.</p>
  <div class="grid2">${fieldH("OD (mmHg)", inH("iop_od","num","e.g. 16"),{for:"f-iop_od"})}${fieldH("OS (mmHg)", inH("iop_os","num","e.g. 15"),{for:"f-iop_os"})}</div>
  ${fieldH("Device", segH("iop_d",[["tonopen","Tono-Pen"],["icare","iCare"],["na","No tonometer"],["deferred","Deferred"]],"Device"),{hint:"Normal is about 10–21 mmHg. If you can’t measure it, say so; ophtho will ask either way."})}</div>`;
}
function modEOM(){
  return `<div class="mod" id="mod-eom"><div class="mod-h"><h3>Eye movements</h3>${reqTag("eom")}</div>
  ${segH("eom",[["full","Full, painless"],["restricted","Restricted"],["painful","Painful"]],"Eye movements")}
  ${fieldH("Details", inH("eom_t","text","e.g. OS can’t abduct; diplopia on left gaze"),{for:"f-eom_t"})}</div>`;
}
function modCVF(){
  return `<div class="mod" id="mod-cvf"><div class="mod-h"><h3>Confrontation fields</h3>${reqTag("cvf")}</div>
  <p class="hint">Face the patient, cover one eye at a time, and have them count fingers in each quadrant.</p>
  ${segH("cvf",[["full","Full in both eyes"],["defect","Defect"]],"Fields")}
  ${fieldH("Which eye and quadrant", inH("cvf_t","text","e.g. OD inferior field missing"),{for:"f-cvf_t"})}</div>`;
}
function modPen(){
  return `<div class="mod" id="mod-pen"><div class="mod-h"><h3>Penlight exam <span id="penEye">${esc(val("eye")?"("+val("eye")+")":"")}</span></h3>${reqTag("pen")}</div>
  <p class="hint">Tap everything you see. Fluorescein under a blue light shows corneal defects as bright green.</p>
  ${PEN.map(g => `<div class="pen-g"><span class="lab">${esc(g[1])}</span><div class="chips">${g[2].map(c => `<button type="button" class="chip" data-pen="${c[0]}" aria-pressed="${!!S.pen[c[0]]}">${esc(c[1])}</button>`).join("")}</div></div>`).join("")}</div>`;
}
const MODS = {va:modVA,pupils:modPupils,iop:modIOP,eom:modEOM,cvf:modCVF,pen:modPen};

function qH(q, rs){
  const k = "q_" + q.id, o = {id:"fld-"+k, req:rs.has("q:"+q.id)};
  if (q.type === "seg") return fieldH(q.label, segH(k, q.opts, q.label), Object.assign(o,{wide:q.opts.length>2 || q.opts.some(x=>x[1].length>14)}));
  return fieldH(q.label, inH(k, q.type, q.ph), Object.assign(o,{for:"f-"+k}));
}

function renderForm(){
  const c = cur(), rs = reqSet();
  let h = `<div class="toolbar">` +
    (S.example ? `<span class="exnote"><b>Example</b>68F, sudden painless vision loss. Edit anything, or clear it.</span>` : "") +
    `<button type="button" class="ghost" id="clearBtn">Clear all</button>` +
    (S.undo ? `<button type="button" class="ghost" id="undoBtn">Undo clear</button>` : "") +
    (S.example ? "" : `<button type="button" class="ghost" id="exampleBtn">Load example</button>`) + `</div>`;

  h += `<section class="step first" aria-labelledby="s1"><div class="step-h"><span class="step-n">01</span><h2 id="s1">Patient</h2></div>
    <p class="privacy">No names, MRNs, or dates of birth. Nothing you type leaves this page or gets saved.</p>
    <div class="fgrid">
      ${fieldH("Age", inH("pt_age","num","e.g. 68"),{for:"f-pt_age"})}
      ${fieldH("Sex", segH("pt_sex",[["F","F"],["M","M"],["X","Other"]],"Sex"))}
      ${fieldH("Location", segH("pt_loc",[["ED","ED"],["Floor","Floor"],["ICU","ICU"],["Clinic","Clinic"]],"Location"),{wide:true})}
      ${fieldH("Your service", inH("pt_svc","text","e.g. Medicine, Team 3"),{for:"f-pt_svc"})}
      ${fieldH("Callback number", inH("pt_cb","text","pager or extension"),{for:"f-pt_cb",id:"fld-pt_cb",req:true})}
      ${fieldH("Relevant history and meds", inH("pt_pmh","text","e.g. DM2, on apixaban, prior cataract surgery OD"),{for:"f-pt_pmh",wide:true})}
    </div></section>`;

  h += `<section class="step" aria-labelledby="s2"><div class="step-h"><span class="step-n">02</span><h2 id="s2">What’s going on</h2></div>
    <div class="cgrid" role="group" aria-label="Chief complaint">${ORDER.map(id => {
      const x = C[id];
      return `<button type="button" class="cbtn" data-cid="${id}" aria-pressed="${S.cid===id}"><b>${esc(x.name)}</b><span${x.alarm?' class="alarm"':""}>${x.alarm?"Irrigate first":esc(x.sub)}</span></button>`;
    }).join("")}</div>
    <div class="fgrid">
      ${c.eye ? fieldH("Affected eye", segH("eye",[["OD","OD · right"],["OS","OS · left"],["OU","OU · both"]],"Eye"),{id:"fld-eye",wide:true,req:rs.has("eye")}) : ""}
      ${c.qs.map(q => qH(q, rs)).join("")}
    </div>
    ${c.hx.length ? `<div class="field"><span class="lab">History</span><p class="legend">Tap once if present <kbd>+</kbd>, twice if denied <kbd>−</kbd>. Pertinent negatives go in the page too.</p>
      <div class="chips">${c.hx.map(x => `<button type="button" class="chip hx" data-hx="${x[0]}" data-s="${S.hx[x[0]]===1?"pos":S.hx[x[0]]===-1?"neg":""}">${esc(x[1])}<span class="vh">${hxSR(S.hx[x[0]])}</span></button>`).join("")}</div></div>` : ""}
  </section>`;

  h += `<section class="step" aria-labelledby="s3"><div class="step-h"><span class="step-n">03</span><h2 id="s3">Red flags</h2></div>
    <p class="step-sub">Check anything present. Each one tells you what to start before ophtho calls back.</p>
    ${c.alarm ? `<div class="alarm-banner"><h3>Irrigate first, page second</h3><ol>
      <li>Topical anesthetic, then irrigate with at least 1–2 L of saline or LR. Don’t wait for a pH reading to start.</li>
      <li>Evert both lids and sweep the fornices to clear trapped particles.</li>
      <li>Stop, wait 5–10 minutes, and check pH in the lower fornix. Keep going until it is near neutral (about 7.0–7.5).</li>
    </ol></div>` : ""}
    <div class="flags">${c.flags.map(f => `<div class="flag lvl-${f.lvl}${S.fl[f.id]?" on":""}" data-flag="${f.id}">
      <label><input type="checkbox" data-fl="${f.id}" ${S.fl[f.id]?"checked":""}><span class="fbox" aria-hidden="true"></span><span><span class="flab">${esc(f.label)}</span><span class="fpill">${LV[f.lvl].word}</span></span></label>
      <p class="fact" ${S.fl[f.id]?"":"hidden"}><b>Do now.</b> ${esc(f.act)}</p></div>`).join("")}</div>
  </section>`;

  h += `<section class="step" aria-labelledby="s4"><div class="step-h"><span class="step-n">04</span><h2 id="s4">Bedside exam</h2></div>
    <p class="step-sub">Only what you can do with a penlight, a near card, and a tonometer. Modules marked “Ophtho will ask” are the ones a page gets bounced back for.</p>
    ${S.cid==="aniso" ? `<p class="interp" id="anisoInterp"></p>` : ""}
    <div class="mods">${c.exams.map(m => MODS[m]()).join("")}</div>
    ${c.tips.length ? `<ul class="tips">${c.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
  </section>`;

  h += `<section class="step" aria-labelledby="s5"><div class="step-h"><span class="step-n">05</span><h2 id="s5">Done so far &amp; the question</h2></div>
    ${c.done.length ? `<div class="field"><span class="lab">Already done</span><div class="chips">${c.done.map(d => `<button type="button" class="chip" data-dn="${d[0]}" aria-pressed="${!!S.dn[d[0]]}">${esc(d[1])}</button>`).join("")}</div></div>` : ""}
    ${fieldH("What do you want ophtho to answer?", `<textarea id="f-question" data-k="question" placeholder="One specific question gets a faster answer than “please see.”">${esc(S.v.question||"")}</textarea>`,{id:"fld-question",req:true,for:"f-question"})}
    <div class="tpls">${c.qtpl.map((t,i) => `<button type="button" class="tpl" data-tpl="${i}">${esc(t)}</button>`).join("")}</div>
  </section>`;

  document.getElementById("form").innerHTML = h;
}

/* ---------- logic ---------- */
const num = k => { const n = parseFloat(val(k)); return isNaN(n) ? null : n; };
function ogActive(){ return S.cid === "trauma" && !!(S.fl.og || S.fl.iofb || S.pen.ps_peak); }

function anisoRead(){
  const odl = num("q_odl"), osl = num("q_osl"), odd = num("q_odd"), osd = num("q_osd");
  if ([odl,osl,odd,osd].some(x => x === null)) return null;
  const dl = Math.abs(odl-osl), dd = Math.abs(odd-osd);
  const bigL = odl > osl ? "OD" : "OS", bigD = odd > osd ? "OD" : "OS";
  const smallD = bigD === "OD" ? "OS" : "OD";
  if (Math.max(dl,dd) < 0.5) return {s:"pupils roughly equal", t:"The pupils are roughly equal in both light and dark."};
  if (dl - dd >= 0.5) return {s:`greater in light, ${bigL} abnormal`, t:`The difference is bigger in bright light, so the larger pupil (${bigL}) is the abnormal one: it isn’t constricting. Think CN3 palsy, pharmacologic dilation (ipratropium nebs, scopolamine patch), a tonic pupil, or iris trauma.`};
  if (dd - dl >= 0.5) return {s:`greater in dark, ${smallD} abnormal`, t:`The difference is bigger in the dark, so the smaller pupil (${smallD}) is the abnormal one: it isn’t dilating. Think Horner syndrome, or physiologic anisocoria if the gap is 1 mm or less and old photos show it.`};
  if (Math.max(dl,dd) <= 1) return {s:"equal in light/dark, ≤1 mm, likely physiologic", t:"A similar gap of 1 mm or less in both light and dark fits physiologic anisocoria, which about 1 in 5 people have."};
  return {s:"equal in light/dark, >1 mm", t:"A similar gap in light and dark, but larger than 1 mm. Needs a closer exam."};
}

function derived(){
  const out = [], c = cur();
  const io = [num("iop_od"), num("iop_os")].filter(x => x !== null);
  const mx = io.length ? Math.max.apply(null, io) : null;
  if (!ogActive() && mx !== null){
    if (mx >= 40) out.push({lvl:"emergent",label:`IOP ${mx} mmHg`,short:`IOP ${mx}`,act:"Pressure this high can damage the optic nerve within hours. Call ophtho now."});
    else if (mx >= 30) out.push({lvl:"urgent",label:`IOP ${mx} mmHg`,short:`IOP ${mx}`,act:"Elevated pressure. Ophtho should know the number up front."});
  }
  if (S.pen.ac_hypo && !S.fl.hypopyon) out.push({lvl:"emergent",label:"Hypopyon on penlight",short:"hypopyon",act:"Suggests endophthalmitis or severe inflammation. Call ophtho now."});
  if (S.pen.ac_hyph && !S.fl.hyphema) out.push({lvl:"urgent",label:"Hyphema on penlight",short:"hyphema",act:"Shield, head of bed 30°, and check sickle status."});
  if (S.cid === "trauma" && S.pen.ps_peak && !S.fl.og) out.push({lvl:"emergent",label:"Peaked pupil after trauma",short:"peaked pupil, ?open globe",act:"Treat as an open globe: rigid shield, NPO, no IOP check."});
  if (S.cid === "chem"){
    if (val("q_agent") === "alkali") out.push({lvl:"emergent",label:"Alkali exposure",short:"alkali",act:"Alkalis penetrate deeper and keep damaging tissue. Irrigate to neutral pH and call ophtho now."});
    const ph = num("q_phpost");
    if (ph !== null && (ph < 7 || ph > 7.5)) out.push({lvl:"emergent",label:`pH ${ph} after irrigation`,short:`pH ${ph}`,act:"Not neutral yet. Keep irrigating, sweep the fornices, and recheck 5–10 minutes after stopping."});
  }
  if (S.cid === "diplopia" && val("q_mb") === "mono") out.push({lvl:null,label:"Monocular double vision",act:"This comes from the eye itself (dry eye, cataract, refractive error) and rarely needs an urgent page."});
  if (S.cid === "candida" && val("q_neut") === "yes") out.push({lvl:null,label:"Neutropenic",act:"IDSA suggests deferring the screening exam until neutrophil recovery, unless the patient has eye symptoms."});
  if (S.cid === "aniso"){ const a = anisoRead(); if (a) out.push({lvl:null,label:"Pupil pattern",act:a.t,short:a.s}); }
  return out;
}

function level(){
  const c = cur();
  let lv = c.base;
  if (S.cid === "diplopia" && val("q_mb") === "mono") lv = "routine";
  c.flags.forEach(f => { if (S.fl[f.id] && RANK[f.lvl] > RANK[lv]) lv = f.lvl; });
  derived().forEach(d => { if (d.lvl && RANK[d.lvl] > RANK[lv]) lv = d.lvl; });
  return lv;
}

function isDone(r){
  if (r.startsWith("q:")) return !!val("q_" + r.slice(2));
  switch (r){
    case "eye": return !!val("eye");
    case "va": return !!(val("va_od") && val("va_os"));
    case "pupils": return !!(val("p_od") && val("p_os") && val("apd"));
    case "iop": return ogActive() || ["na","deferred"].includes(val("iop_d")) || !!(val("iop_od") && val("iop_os"));
    case "eom": return !!val("eom");
    case "cvf": return !!val("cvf");
    case "pen": return Object.keys(S.pen).some(k => S.pen[k]);
    case "question": return !!val("question");
    case "cb": return !!val("pt_cb");
  }
  return false;
}
function rLabel(r){
  if (r.startsWith("q:")){ const q = cur().qs.find(x => x.id === r.slice(2)); return q ? q.label : r; }
  return RLAB[r] || r;
}
function rJump(r){ return r.startsWith("q:") ? "fld-q_" + r.slice(2) : RJUMP[r]; }

/* ---------- message ---------- */
function qDisplay(q, pager){
  const v = val("q_" + q.id); if (!v) return "";
  if (q.type === "seg"){ const o = q.opts.find(x => x[0] === v); return o ? (pager ? (o[2] || o[1]).toLowerCase() : o[1]) : v; }
  return pager ? (q.pfx||"") + v + (q.sfx||"") : v;
}
function demo(sep){
  const age = val("pt_age"), sex = val("pt_sex");
  const as = age ? age + (sex === "M" || sex === "F" ? sex : " y/o") : (sex === "M" || sex === "F" ? sex : "");
  return [as, val("pt_loc"), sep ? val("pt_svc") : ""].filter(Boolean).join(sep || " ");
}
function lineVA(){
  if (!val("va_od") && !val("va_os")) return "";
  const m = {near:"near card",snellen:"Snellen",phone:"phone chart"}[val("va_m")], cc = val("va_c");
  const meta = [m, cc].filter(Boolean).join(", ");
  return `VA${meta?" ("+meta+")":""}: OD ${val("va_od")||"—"} | OS ${val("va_os")||"—"}`;
}
function lineP(){
  if (!val("p_od") && !val("p_os") && !val("apd")) return "";
  const e = x => `${x.toUpperCase()} ${val("p_"+x)?val("p_"+x)+" mm":"?"}${val("pr_"+x)?" "+val("pr_"+x):""}`;
  const a = val("apd"), as = a === "none" ? "no RAPD" : a === "na" ? "APD not assessable" : a ? "RAPD " + a : "APD not checked";
  return `Pupils: ${e("od")}, ${e("os")}; ${as}`;
}
function lineIOP(){
  if (ogActive()) return "IOP: not measured (possible open globe)";
  const d = val("iop_d");
  if (d === "na") return "IOP: no tonometer available";
  if (d === "deferred") return "IOP: deferred";
  if (!val("iop_od") && !val("iop_os")) return "";
  const dv = {tonopen:"Tono-Pen",icare:"iCare"}[d];
  return `IOP${dv?" ("+dv+")":""}: OD ${val("iop_od")||"—"} | OS ${val("iop_os")||"—"}`;
}
function lineEOM(){ const e = val("eom"); if (!e) return ""; return `EOM: ${{full:"full, painless",restricted:"restricted",painful:"painful"}[e]}${val("eom_t")?" — "+val("eom_t"):""}`; }
function lineCVF(){ const e = val("cvf"); if (!e) return ""; return `CVF: ${e==="full"?"full OU":"defect"}${val("cvf_t")?" — "+val("cvf_t"):""}`; }
function linePen(){
  const g = {};
  Object.keys(S.pen).filter(k => S.pen[k]).forEach(k => { const p = PENLAB[k]; (g[p[0]] = g[p[0]] || []).push(p[1]); });
  const parts = PEN.map(x => g[x[0]] ? `${x[0]} ${g[x[0]].join(", ")}` : "").filter(Boolean);
  return parts.length ? `Penlight${val("eye")?" ("+val("eye")+")":""}: ${parts.join("; ")}` : "";
}
const LINES = {va:lineVA,pupils:lineP,iop:lineIOP,eom:lineEOM,cvf:lineCVF,pen:linePen};

function buildFull(){
  const c = cur(), lv = level(), L = [];
  L.push(`OPHTHALMOLOGY CONSULT · ${LV[lv].word.toUpperCase()}`);
  const d = demo(" · "); if (d) L.push(d);
  if (val("question")) L.push(`Question: ${val("question")}`);
  L.push("");
  L.push(`CC: ${c.name}${val("eye")?", "+val("eye"):""}`);
  const det = c.qs.map(q => { const v = qDisplay(q,false); return v ? `${q.label}: ${v}` : ""; }).filter(Boolean);
  if (det.length) L.push(det.join("; "));
  const pos = c.hx.filter(x => S.hx[x[0]] === 1).map(x => x[1].toLowerCase());
  const neg = c.hx.filter(x => S.hx[x[0]] === -1).map(x => x[1].toLowerCase());
  if (pos.length) L.push(`Reports: ${pos.join(", ")}`);
  if (neg.length) L.push(`Denies: ${neg.join(", ")}`);
  const fl = c.flags.filter(f => S.fl[f.id]).map(f => f.short).concat(derived().filter(x => x.short).map(x => x.short));
  if (fl.length) L.push(`Red flags / concerns: ${fl.join("; ")}`);
  if (val("pt_pmh")) L.push(`PMH/meds: ${val("pt_pmh")}`);
  const ex = c.exams.map(m => LINES[m]()).filter(Boolean);
  if (S.cid === "aniso"){
    const o = ["odl","osl","odd","osd"].map(k => val("q_"+k));
    if (o.some(Boolean)) ex.unshift(`Pupils: light OD ${o[0]||"?"} / OS ${o[1]||"?"} mm; dim OD ${o[2]||"?"} / OS ${o[3]||"?"} mm${val("q_ptosis")?"; ptosis "+(val("q_ptosis")==="none"?"none":val("q_ptosis")):""}`);
  }
  if (ex.length){ L.push(""); L.push("EXAM"); ex.forEach(x => L.push(x)); }
  const dn = c.done.filter(x => S.dn[x[0]]).map(x => x[1]);
  if (dn.length || val("pt_cb")) L.push("");
  if (dn.length) L.push(`Done: ${dn.join(", ")}`);
  if (val("pt_cb")) L.push(`Callback: ${val("pt_cb")}`);
  return L.join("\n");
}
function buildPager(){
  const c = cur(), lv = level(), p = [];
  let head = `${LV[lv].word.toUpperCase()} ophtho:`;
  const d = demo(" "); if (d) head += " " + d;
  head += `, ${val("eye") && val("eye")!=="OU" ? val("eye")+" " : ""}${c.short}`;
  const det = c.qs.filter(q => q.pg).map(q => qDisplay(q,true)).filter(Boolean);
  if (det.length) head += ", " + det.join(", ");
  p.push(head);
  if (S.cid === "aniso"){
    const o = ["odl","osl","odd","osd"].map(k => val("q_"+k) || "?");
    if (o.some(x => x !== "?")) p.push(`pupils light OD ${o[0]} OS ${o[1]}, dim OD ${o[2]} OS ${o[3]} mm${val("q_ptosis") && val("q_ptosis") !== "none" ? ", ptosis " + val("q_ptosis") : ""}`);
  }
  if (val("va_od") || val("va_os")) p.push(`VA OD ${val("va_od")||"?"}, OS ${val("va_os")||"?"}${val("apd")&&val("apd")!=="none"&&val("apd")!=="na"?", RAPD "+val("apd"):""}`);
  if (ogActive()) p.push("no IOP (?open globe)");
  else if (val("iop_od") || val("iop_os")) p.push(`IOP OD ${val("iop_od")||"?"}, OS ${val("iop_os")||"?"}`);
  const fl = c.flags.filter(f => S.fl[f.id]).map(f => f.short).concat(derived().filter(x => x.short && x.lvl).map(x => x.short));
  if (fl.length) p.push(fl.join(", "));
  if (val("pt_cb")) p.push(`CB ${val("pt_cb")}`);
  return p.join(". ") + ".";
}

/* ---------- output ---------- */
function renderOut(){
  const lv = level(), ds = derived();
  const urg = document.getElementById("urg");
  urg.className = "urg lvl-" + lv;
  document.getElementById("urgWord").textContent = LV[lv].word;
  let t = LV[lv].text;
  const c = cur();
  if (lv === "routine" && c.routineNote && !c.flags.some(f => S.fl[f.id])) t = c.routineNote;
  document.getElementById("urgText").textContent = t;
  const fl = c.flags.filter(f => S.fl[f.id]);
  const items = fl.map(f => ({lvl:f.lvl,label:f.short,act:f.act})).concat(ds);
  document.getElementById("alerts").innerHTML = items.map(a => `<li class="a-${a.lvl||"info"}"><b>${esc(a.label)}</b>${esc(a.act)}</li>`).join("");

  const req = Array.from(reqSet());
  const miss = req.filter(r => !isDone(r));
  const n = req.length - miss.length;
  document.getElementById("readyN").textContent = `${n} / ${req.length}`;
  const bar = document.getElementById("bar");
  bar.querySelector("i").style.width = (req.length ? 100*n/req.length : 0) + "%";
  bar.classList.toggle("full", !miss.length);
  document.getElementById("missingWrap").innerHTML = miss.length
    ? `<p class="hint below">Ophtho will ask for these first:</p><div class="missing">${miss.map(r => `<button type="button" data-jump="${rJump(r)}">${esc(rLabel(r))}</button>`).join("")}</div>`
    : `<p class="allset">Everything ophtho asks for first is in the page.</p>`;

  const txt = S.out === "pager" ? buildPager() : buildFull();
  document.getElementById("msg").textContent = txt;
  const cnt = document.getElementById("count");
  if (S.out === "pager"){ cnt.textContent = `${txt.length} / 240 characters`; cnt.classList.toggle("over", txt.length > 240); }
  else { cnt.textContent = `${txt.split("\n").length} lines`; cnt.classList.remove("over"); }
  document.querySelectorAll("[data-out]").forEach(b => b.setAttribute("aria-pressed", b.dataset.out === S.out));

  const warn = document.getElementById("iopWarn"); if (warn) warn.hidden = !ogActive();
  const pe = document.getElementById("penEye"); if (pe) pe.textContent = val("eye") ? "(" + val("eye") + ")" : "";
  const ai = document.getElementById("anisoInterp");
  if (ai){ const a = anisoRead(); ai.textContent = a ? a.t : "Enter both pupils in bright light and in a dim room to see which one is abnormal."; }

  const mp = document.getElementById("mPill"); mp.className = "pill lvl-" + lv; mp.textContent = LV[lv].word;
  document.getElementById("mReady").textContent = `Page-ready ${n}/${req.length}`;
}

/* ---------- events ---------- */
function setTab(t){
  ["workup","tools","guide"].forEach(x => { document.getElementById("tab-"+x).hidden = x !== t; });
  document.querySelectorAll("[data-tab]").forEach(b => { const on = b.dataset.tab === t; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
  document.getElementById("mbar").hidden = t !== "workup";
  /* The first tab is the bare address, so a shared link stays clean */
  try { history.replaceState(null, "", t === "workup" ? location.pathname + location.search : "#" + t); } catch(e){}
  if (t === "tools") renderTools();
  if (t !== "tools") oknStop();
}
const smooth = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("click", e => {
  const tab = e.target.closest("[data-tab]"); if (tab){ setTab(tab.dataset.tab); return; }
  const sb = e.target.closest(".seg[data-seg] button");
  if (sb){
    const g = sb.parentElement, k = g.dataset.seg, v = sb.dataset.v;
    S.v[k] = S.v[k] === v ? "" : v;
    g.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", S.v[k] === b.dataset.v));
    renderOut(); return;
  }
  const cb = e.target.closest("[data-cid]");
  if (cb){ if (cb.dataset.cid !== S.cid){ setComplaint(cb.dataset.cid); renderForm(); renderOut(); } return; }
  const hx = e.target.closest("[data-hx]");
  if (hx){
    const k = hx.dataset.hx, s = S.hx[k];
    S.hx[k] = s === 1 ? -1 : s === -1 ? 0 : 1;
    hx.dataset.s = S.hx[k] === 1 ? "pos" : S.hx[k] === -1 ? "neg" : "";
    hx.querySelector(".vh").textContent = hxSR(S.hx[k]);
    renderOut(); return;
  }
  const dn = e.target.closest("[data-dn]");
  if (dn){ const k = dn.dataset.dn; S.dn[k] = !S.dn[k]; dn.setAttribute("aria-pressed", !!S.dn[k]); renderOut(); return; }
  const pn = e.target.closest("[data-pen]");
  if (pn){ const k = pn.dataset.pen; S.pen[k] = !S.pen[k]; pn.setAttribute("aria-pressed", !!S.pen[k]); renderOut(); return; }
  const tp = e.target.closest("[data-tpl]");
  if (tp){ const q = cur().qtpl[+tp.dataset.tpl]; S.v.question = q; const ta = document.getElementById("f-question"); if (ta) ta.value = q; renderOut(); return; }
  const jp = e.target.closest("[data-jump]");
  if (jp){
    const el = document.getElementById(jp.dataset.jump);
    if (el){ el.scrollIntoView({behavior: smooth() ? "smooth" : "auto", block:"center"}); const f = el.querySelector("input,select,textarea,button"); if (f) setTimeout(() => f.focus({preventScroll:true}), smooth() ? 350 : 0); }
    return;
  }
  const ot = e.target.closest("[data-out]"); if (ot){ S.out = ot.dataset.out; renderOut(); return; }
  if (e.target.closest("#clearBtn")){ clearAll(true); renderForm(); renderOut(); const u = document.getElementById("undoBtn"); if (u) u.focus(); return; }
  if (e.target.closest("#undoBtn")){ if (S.undo){ Object.assign(S, JSON.parse(S.undo)); S.undo = null; renderForm(); renderOut(); } return; }
  if (e.target.closest("#exampleBtn")){ loadExample(); renderForm(); renderOut(); return; }
  if (e.target.closest("#mGo")){ document.getElementById("out").scrollIntoView({behavior: smooth() ? "smooth" : "auto", block:"start"}); return; }
  if (e.target.closest("#copyBtn")){
    const btn = document.getElementById("copyBtn"), txt = document.getElementById("msg").textContent;
    const done = m => { btn.textContent = m; document.getElementById("copyStatus").textContent = m; setTimeout(() => { btn.textContent = "Copy page"; document.getElementById("copyStatus").textContent = ""; }, 1600); };
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(document.getElementById("msg"));
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      done("Selected. Copy it now");
    };
    try { navigator.clipboard.writeText(txt).then(() => done("Copied"), fallback); } catch(err){ fallback(); }
    return;
  }
});
/* Arrow keys move between the three section tabs, as a tab list should */
document.querySelector(".tabs").addEventListener("keydown", e => {
  const tabs = Array.from(document.querySelectorAll("[data-tab]")), i = tabs.indexOf(e.target);
  if (i < 0) return;
  const n = e.key === "ArrowRight" ? (i+1) % tabs.length : e.key === "ArrowLeft" ? (i-1+tabs.length) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? tabs.length-1 : -1;
  if (n < 0) return;
  e.preventDefault(); setTab(tabs[n].dataset.tab); tabs[n].focus();
});
window.addEventListener("hashchange", () => { const h = (location.hash || "").replace("#",""); if (["workup","tools","guide"].includes(h)) setTab(h); });
document.addEventListener("change", e => {
  const f = e.target.dataset && e.target.dataset.fl;
  if (f){
    S.fl[f] = e.target.checked;
    const row = e.target.closest(".flag"); row.classList.toggle("on", e.target.checked);
    row.querySelector(".fact").hidden = !e.target.checked;
    renderOut(); return;
  }
  if (e.target.matches("select[data-k]")){ S.v[e.target.dataset.k] = e.target.value; renderOut(); }
});
document.addEventListener("input", e => {
  const k = e.target.dataset && e.target.dataset.k;
  if (k && !e.target.matches("select")){ S.v[k] = e.target.value; renderOut(); }
});

/* ---------- bedside tools ---------- */
const LS = "bypo-pxmm";
let pxmm = null, calibrated = false, dist = 355.6, showKey = false;
try { const s = localStorage.getItem(LS); if (s){ pxmm = parseFloat(s); calibrated = true; } } catch(e){}
if (!pxmm || isNaN(pxmm)) pxmm = window.matchMedia("(pointer: coarse)").matches ? 6.0 : 4.0;
const ROWS = [[800,1],[400,2],[200,3],[100,4],[70,5],[50,5],[40,5],[30,5],[25,5],[20,5]];
const ROT = [0,90,180,270], ARR = {0:"→",90:"↓",180:"←",270:"↑"};
let orient = ROWS.map(r => Array.from({length:r[1]}, () => ROT[Math.floor(Math.random()*4)]));
const shuffleRow = i => { const prev = orient[i]; orient[i] = prev.map((p,j) => { let r; do { r = ROT[Math.floor(Math.random()*4)]; } while (prev.length > 1 && r === prev[j] && Math.random() < .7); return r; }); };

function saveCal(){ try { localStorage.setItem(LS, String(pxmm)); } catch(e){} calibrated = true; }
function renderCal(){
  document.getElementById("calRule").style.width = (53.98 * pxmm) + "px";
  document.getElementById("cal").value = pxmm;
  const st = document.getElementById("calStat");
  st.textContent = calibrated ? `Calibrated · ${pxmm.toFixed(2)} px per mm · saved on this device` : `Not calibrated yet · sizes below are estimates`;
  st.className = "calstat " + (calibrated ? "ok" : "no");
}
function eSVG(px, r){
  return `<svg width="${px.toFixed(2)}" height="${px.toFixed(2)}" viewBox="0 0 5 5" style="transform:rotate(${r}deg)" aria-hidden="true"><path fill="currentColor" d="M0 0H5V1H0ZM0 2H5V3H0ZM0 4H5V5H0ZM0 0H1V5H0Z"/></svg>`;
}
function renderNear(){
  const k = Math.tan((5/60) * Math.PI/180), dpr = window.devicePixelRatio || 1;
  document.getElementById("near").innerHTML = ROWS.map((r,i) => {
    const mm = dist * k * (r[0]/20), px = mm * pxmm, weak = (px/5)*dpr < 1.6;
    const metric = "6/" + (+(r[0]*0.3).toFixed(1));
    return `<div class="nrow" data-row="${i}" role="button" tabindex="0"><span class="nlab${weak?" weak":""}">20/${r[0]} <small>${metric}</small><span class="vh">, reshuffle this line</span></span><span class="nEs" style="gap:${px.toFixed(2)}px">${orient[i].map(o => `<span class="nE">${eSVG(px,o)}${showKey?`<span class="nkey">${ARR[o]}</span>`:""}</span>`).join("")}</span></div>`;
  }).join("");
}
function renderGauge(){
  document.getElementById("gauge").innerHTML = [2,3,4,5,6,7,8,9].map(m => `<div><i style="width:${(m*pxmm).toFixed(2)}px;height:${(m*pxmm).toFixed(2)}px"></i><span>${m}</span></div>`).join("");
  const rd = document.getElementById("redDisc"); rd.style.width = rd.style.height = (28*pxmm) + "px";
  oknBg();
}
function renderTools(){ renderCal(); renderNear(); renderGauge(); }

document.getElementById("cal").addEventListener("input", e => { pxmm = parseFloat(e.target.value); saveCal(); renderTools(); });
document.getElementById("calMinus").addEventListener("click", () => { pxmm = Math.max(2.5, pxmm - 0.02); saveCal(); renderTools(); });
document.getElementById("calPlus").addEventListener("click", () => { pxmm = Math.min(9, pxmm + 0.02); saveCal(); renderTools(); });
document.getElementById("distSeg").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  dist = parseFloat(b.dataset.d);
  document.querySelectorAll("#distSeg button").forEach(x => x.setAttribute("aria-pressed", x === b));
  renderNear();
});
document.getElementById("keyBtn").addEventListener("click", e => { showKey = !showKey; e.currentTarget.setAttribute("aria-pressed", showKey); e.currentTarget.textContent = showKey ? "Hide answer key" : "Show answer key"; renderNear(); });
document.getElementById("shuffleBtn").addEventListener("click", () => { ROWS.forEach((_,i) => shuffleRow(i)); renderNear(); });
document.getElementById("near").addEventListener("click", e => { const r = e.target.closest("[data-row]"); if (r){ shuffleRow(+r.dataset.row); renderNear(); } });
document.getElementById("near").addEventListener("keydown", e => { const r = e.target.closest("[data-row]"); if (r && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); const i = +r.dataset.row; shuffleRow(i); renderNear(); const n = document.querySelector(`[data-row="${i}"]`); if (n) n.focus(); } });

/* OKN */
const okn = {on:false,dir:-1,spd:80,off:0,t:0,raf:0};
const oknEl = document.getElementById("okn");
function stripe(){ return 12 * pxmm; }
function oknBg(){
  const s = stripe();
  oknEl.style.backgroundImage = "linear-gradient(90deg, var(--paper-ink) 0 50%, var(--paper) 50% 100%)";
  oknEl.style.backgroundSize = (2*s) + "px 100%";
  oknEl.style.backgroundPosition = okn.off + "px 0";
}
function oknFrame(t){
  if (!okn.on) return;
  const dt = okn.t ? Math.min(.05, (t - okn.t)/1000) : 0; okn.t = t;
  const per = 2*stripe();
  okn.off = ((okn.off + okn.dir * okn.spd * pxmm * dt) % per + per) % per;
  oknEl.style.backgroundPosition = okn.off + "px 0";
  okn.raf = requestAnimationFrame(oknFrame);
}
function oknStop(){ okn.on = false; okn.t = 0; cancelAnimationFrame(okn.raf); const b = document.getElementById("oknBtn"); if (b) b.textContent = "Start"; }
document.getElementById("oknBtn").addEventListener("click", e => {
  if (okn.on){ oknStop(); return; }
  okn.on = true; okn.t = 0; e.currentTarget.textContent = "Stop"; okn.raf = requestAnimationFrame(oknFrame);
});
document.getElementById("oknDir").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; okn.dir = +b.dataset.dir; document.querySelectorAll("#oknDir button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
document.getElementById("oknSpd").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; okn.spd = +b.dataset.spd; document.querySelectorAll("#oknSpd button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
document.getElementById("oknFs").addEventListener("click", () => { try { const p = oknEl.requestFullscreen && oknEl.requestFullscreen(); if (p && p.catch) p.catch(() => {}); } catch(e){} });
window.addEventListener("resize", () => { if (!document.getElementById("tab-tools").hidden) renderTools(); });

/* ---------- boot ---------- */
loadExample();
renderForm();
renderOut();
const h = (location.hash || "").replace("#","");
setTab(["tools","guide"].includes(h) ? h : "workup");
})();
