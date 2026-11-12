/* Ophtho Case of the Day · game logic and case bank.
   Six clues, one diagnosis, a new case each local midnight. Plain JS, no build step.
   Progress is kept in this browser's localStorage only. See case/DESIGN.md. */
(function () {
  "use strict";

  // ---------- Case bank ----------
  var CASES = [
    { id: "crao", dx: "Central retinal artery occlusion",
      names: ["Central retinal artery occlusion"], accept: ["crao", "retinal artery occlusion", "ophthalmic artery occlusion"],
      clues: [
        ["CC", "72-year-old man: “I woke up and couldn’t see out of my right eye.” No pain."],
        ["History", "Hypertension and atrial fibrillation. Stopped his apixaban two weeks ago because of bruising."],
        ["VA · Pupils", "VA count fingers OD, 20/25 OS. Right relative afferent pupillary defect (RAPD)."],
        ["Slit lamp", "Quiet anterior segment. IOP 15 mmHg in both eyes."],
        ["Fundus", "Diffuse whitening of the posterior pole retina with a cherry-red spot at the fovea. Segmented “boxcar” blood columns in the arterioles."],
        ["Workup", "ESR and CRP normal. Telemetry shows atrial fibrillation with rapid ventricular rate."]
      ],
      pearl: "<b>A CRAO is a stroke of the eye.</b> Send the patient to a stroke center the same day for brain MRI, vascular imaging and cardiac monitoring, and check ESR/CRP in anyone over 50 to rule out giant cell arteritis." },

    { id: "gca", dx: "Arteritic AION from giant cell arteritis",
      names: ["Giant cell arteritis", "Arteritic anterior ischemic optic neuropathy"],
      accept: ["gca", "temporal arteritis", "arteritic aion", "aaion", "cranial arteritis", "arteritic ischemic optic neuropathy"],
      clues: [
        ["CC", "78-year-old woman with sudden, painless vision loss in her left eye this morning."],
        ["HPI", "Two weeks of new headaches at her temples. Her scalp hurts when she brushes her hair."],
        ["ROS", "Jaw pain while chewing that eases when she stops. Shoulder and hip stiffness, 4 kg weight loss."],
        ["VA · Pupils", "VA hand motions OS, 20/30 OD. Left RAPD."],
        ["Fundus", "Left optic disc swelling with a chalky-white pallor."],
        ["Labs", "ESR 96 mm/h, CRP 74 mg/L, platelets 520 ×10³/µL."]
      ],
      pearl: "<b>Start high-dose steroids immediately, before the temporal artery biopsy.</b> The other eye can be lost within days, and the biopsy stays informative for 1–2 weeks after steroids begin." },

    { id: "aacg", dx: "Acute angle-closure glaucoma",
      names: ["Acute angle-closure glaucoma"], accept: ["aacg", "acute angle closure", "angle closure glaucoma", "angle closure", "acute angle closure crisis", "primary angle closure"],
      clues: [
        ["CC", "64-year-old woman with severe right eye pain and a pounding headache."],
        ["HPI", "Started an hour into a movie in a dark theater. Nauseated, vomited twice. Sees rainbow halos around lights."],
        ["History", "Farsighted; wears +3.50 readers. No prior eye surgery."],
        ["VA · IOP", "VA 20/200 OD. IOP 58 mmHg OD, 16 mmHg OS."],
        ["Slit lamp", "Hazy, swollen cornea. Very shallow anterior chamber. Mid-dilated pupil that barely reacts to light."],
        ["Gonioscopy", "No angle structures visible in the right eye. The left angle is narrow and occludable."]
      ],
      pearl: "<b>Lower the pressure fast</b> with timolol, brimonidine and pilocarpine drops plus oral or IV acetazolamide, then do a laser peripheral iridotomy. Treat the other eye too: it shares the same anatomy." },

    { id: "rrd", dx: "Rhegmatogenous retinal detachment",
      names: ["Retinal detachment"], accept: ["rd", "rrd", "rhegmatogenous retinal detachment", "detached retina", "macula on retinal detachment"],
      clues: [
        ["CC", "58-year-old man with new flashes of light in his left eye."],
        ["HPI", "A shower of new floaters 3 days ago. Today a dark shadow is spreading down from the top of his vision."],
        ["History", "High myope (−7.00). Cataract surgery in that eye last year."],
        ["VA · IOP", "VA 20/30 OS. IOP 11 mmHg OS, 16 mmHg OD."],
        ["Slit lamp", "Pigmented cells floating in the anterior vitreous (“tobacco dust”, Shafer sign)."],
        ["Fundus", "Elevated, corrugated retina inferiorly with a horseshoe tear at 7 o’clock. The macula is still attached."]
      ],
      pearl: "<b>Macula-on detachments are urgent:</b> same- or next-day repair with scleral buckle or vitrectomy protects central vision (pneumatic retinopexy suits superior breaks, not this one). High myopia and prior cataract surgery both raise the risk." },

    { id: "crvo", dx: "Central retinal vein occlusion",
      names: ["Central retinal vein occlusion"], accept: ["crvo", "retinal vein occlusion", "rvo"],
      clues: [
        ["CC", "68-year-old man with blurry vision in his right eye for 3 days. No pain."],
        ["History", "Hypertension, type 2 diabetes, obstructive sleep apnea. Rarely uses his CPAP."],
        ["VA · IOP", "VA 20/200 OD. IOP 24 mmHg OD, 22 mmHg OS."],
        ["Pupils", "Mild right RAPD."],
        ["Fundus", "Dilated, tortuous veins with flame and dot-blot hemorrhages in all four quadrants, cotton-wool spots and a swollen disc."],
        ["OCT", "Thickened macula with intraretinal cystoid fluid."]
      ],
      pearl: "<b>“Blood and thunder” fundus.</b> Treat macular edema with anti-VEGF injections, and check for iris neovascularization over the next 3 months, when neovascular glaucoma usually appears." },

    { id: "pdr", dx: "Vitreous hemorrhage from proliferative diabetic retinopathy",
      names: ["Proliferative diabetic retinopathy", "Vitreous hemorrhage"], accept: ["pdr", "diabetic vitreous hemorrhage", "diabetic retinopathy", "vh", "proliferative diabetic retinopathy with vitreous hemorrhage"],
      clues: [
        ["CC", "41-year-old man: “It’s like someone poured ink into my left eye.”"],
        ["HPI", "Sudden onset this morning while lifting a box. Painless."],
        ["History", "Type 1 diabetes since age 12. A1c 11.2%. Has missed eye appointments for 4 years."],
        ["VA · IOP", "VA hand motions OS. IOP normal in both eyes."],
        ["Fundus", "No view of the left retina through dense red haze. The right eye shows new vessels on the disc and scattered dot-blot hemorrhages."],
        ["B-scan", "Mobile vitreous opacities in the left eye. Retina attached."]
      ],
      pearl: "<b>Get a B-scan whenever you can’t see the retina</b> to rule out a detachment. Treat with anti-VEGF injections and/or panretinal photocoagulation, and consider vitrectomy if the blood doesn’t clear." },

    { id: "hsv", dx: "Herpes simplex keratitis",
      names: ["Herpes simplex keratitis"], accept: ["hsv keratitis", "herpetic keratitis", "dendritic keratitis", "hsk", "herpes keratitis", "hsv", "hsv epithelial keratitis"],
      clues: [
        ["CC", "34-year-old woman with a red, watery, light-sensitive right eye for 2 days."],
        ["History", "Gets cold sores on her lip a few times a year. Under a lot of stress lately."],
        ["VA", "VA 20/40 OD, 20/20 OS."],
        ["Sensation", "Reduced corneal sensation on the right compared with the left."],
        ["Slit lamp", "Mild conjunctival injection. A faint branching lesion in the central corneal epithelium."],
        ["Fluorescein", "Stains a branching ulcer with bulb-like swellings at the ends of each branch."]
      ],
      pearl: "<b>Treat epithelial disease with antivirals and avoid topical steroids,</b> which can make the ulcer much worse. Reduced corneal sensation is a quiet clue to herpes." },

    { id: "hzo", dx: "Herpes zoster ophthalmicus",
      names: ["Herpes zoster ophthalmicus"], accept: ["hzo", "zoster ophthalmicus", "shingles", "herpes zoster", "ophthalmic zoster", "varicella zoster"],
      clues: [
        ["CC", "71-year-old man with 3 days of burning pain over his left forehead."],
        ["Skin", "Now a vesicular rash on a red base over the left forehead and upper lid. It stops at the midline."],
        ["Key sign", "Vesicles on the tip of the nose."],
        ["VA", "VA 20/30 OS. The left eye is red."],
        ["Slit lamp", "Raised, ropy branching lesions that stain poorly with fluorescein. Mild anterior chamber cells."],
        ["IOP", "IOP 29 mmHg OS, 15 mmHg OD."]
      ],
      pearl: "<b>Hutchinson sign</b> (nasal tip involvement through the nasociliary nerve) predicts eye involvement. Start oral antivirals within 72 hours, and recommend the recombinant zoster vaccine after recovery." },

    { id: "bk", dx: "Bacterial keratitis (Pseudomonas corneal ulcer)",
      names: ["Bacterial keratitis", "Corneal ulcer"], accept: ["microbial keratitis", "pseudomonas keratitis", "infectious keratitis", "contact lens keratitis", "pseudomonas", "contact lens related keratitis", "bacterial corneal ulcer"],
      clues: [
        ["CC", "22-year-old college student with a painful red left eye since yesterday."],
        ["History", "Wears monthly soft contact lenses. Often sleeps in them."],
        ["VA", "VA 20/100 OS. Severe light sensitivity."],
        ["Slit lamp", "Dense white 3 mm stromal infiltrate with an overlying epithelial defect and mucopurulent discharge."],
        ["Anterior chamber", "A 1.5 mm layered hypopyon."],
        ["Culture", "Gram-negative rods."]
      ],
      pearl: "<b>Culture, then start hourly antibiotic drops</b> (fortified or a fluoroquinolone). Never patch a contact lens wearer’s eye: Pseudomonas thrives under a patch." },

    { id: "acanth", dx: "Acanthamoeba keratitis",
      names: ["Acanthamoeba keratitis"], accept: ["acanthamoeba", "amoebic keratitis", "acanthamoeba keratitis"],
      clues: [
        ["CC", "29-year-old woman with 3 weeks of worsening left eye pain."],
        ["History", "Wears contacts. Rinses her lens case with tap water and swims in a lake with lenses in."],
        ["HPI", "The pain is severe and out of proportion to the redness. No better on antiviral and antibiotic drops."],
        ["VA", "VA 20/80 OS."],
        ["Slit lamp", "A ring-shaped stromal infiltrate with patchy epithelium."],
        ["Workup", "Radial infiltrates along corneal nerves. Confocal microscopy shows double-walled cysts."]
      ],
      pearl: "<b>Often misdiagnosed as herpes for weeks.</b> Treat with biguanide drops (PHMB or chlorhexidine), often with a diamidine, usually for months." },

    { id: "aau", dx: "HLA-B27 acute anterior uveitis",
      names: ["Anterior uveitis", "Iritis"], accept: ["acute anterior uveitis", "uveitis", "hla b27 uveitis", "iridocyclitis", "hla b27 anterior uveitis", "ankylosing spondylitis"],
      clues: [
        ["CC", "28-year-old man with a red, aching right eye and light sensitivity for 2 days."],
        ["History", "A year of morning low back stiffness that improves with exercise."],
        ["VA · IOP", "VA 20/40 OD. IOP 12 mmHg."],
        ["Exterior", "Redness concentrated in a ring around the cornea (ciliary flush). No discharge."],
        ["Slit lamp", "3+ cells and flare in the anterior chamber, fine keratic precipitates, and the iris stuck to the lens in one spot."],
        ["Labs", "HLA-B27 positive. Pelvic X-ray shows bilateral sacroiliitis."]
      ],
      pearl: "<b>Topical steroids plus a cycloplegic</b>, which eases pain and breaks the iris adhesions. Recurrent HLA-B27 uveitis warrants rheumatology referral for spondyloarthritis." },

    { id: "endo", dx: "Acute postoperative endophthalmitis",
      names: ["Endophthalmitis"], accept: ["postoperative endophthalmitis", "post op endophthalmitis", "acute endophthalmitis", "bacterial endophthalmitis", "acute postoperative endophthalmitis", "post cataract endophthalmitis"],
      clues: [
        ["CC", "79-year-old woman with worsening pain and blurry vision in her right eye."],
        ["History", "Uncomplicated cataract surgery in that eye 4 days ago. Her day-1 visit was fine."],
        ["VA", "VA hand motions OD. It was 20/25 on day 1."],
        ["Exterior", "Lid swelling, marked conjunctival redness and swelling."],
        ["Slit lamp", "Fibrin in the anterior chamber with a 2 mm hypopyon."],
        ["B-scan", "Dense vitreous opacities. Retina attached."]
      ],
      pearl: "<b>Tap and inject the same day:</b> a vitreous sample plus intravitreal vancomycin and ceftazidime. In the Endophthalmitis Vitrectomy Study, immediate vitrectomy helped only eyes with light-perception vision." },

    { id: "ogi", dx: "Open globe injury with intraocular foreign body",
      names: ["Open globe injury", "Intraocular foreign body"], accept: ["open globe", "ruptured globe", "globe rupture", "iofb", "penetrating eye injury", "penetrating ocular trauma", "corneal laceration", "full thickness corneal laceration", "open globe with iofb"],
      clues: [
        ["CC", "30-year-old man who felt something hit his right eye while hammering metal on metal."],
        ["HPI", "Mild pain and blurry vision. He wasn’t wearing safety glasses."],
        ["VA", "VA 20/400 OD."],
        ["Exterior", "A small full-thickness corneal wound with a teardrop-shaped pupil pointing toward it."],
        ["Fluorescein", "Aqueous streams from the wound (positive Seidel test)."],
        ["CT", "Non-contrast CT of the orbits: a 1 mm metallic fragment in the posterior vitreous."]
      ],
      pearl: "<b>Rigid shield, no pressure on the eye, no drops.</b> Keep NPO, give IV antibiotics, antiemetics and tetanus, and arrange urgent repair. No MRI while a metal fragment is possible." },

    { id: "rbh", dx: "Retrobulbar hemorrhage (orbital compartment syndrome)",
      names: ["Retrobulbar hemorrhage", "Orbital compartment syndrome"], accept: ["retrobulbar hematoma", "orbital hemorrhage", "rbh", "orbital hematoma"],
      clues: [
        ["CC", "82-year-old woman who fell onto her face. Her left eye now bulges."],
        ["History", "Takes warfarin for atrial fibrillation. INR 3.8."],
        ["Exterior", "Tense, rock-hard orbit with proptosis. She can barely move the eye. Large subconjunctival hemorrhage."],
        ["VA · Pupils", "VA count fingers OS and dropping. Left RAPD."],
        ["IOP", "IOP 52 mmHg OS."],
        ["CT", "Blood behind the globe, a stretched optic nerve, and a cone-shaped (tented) back of the globe."]
      ],
      pearl: "<b>Bedside emergency: lateral canthotomy and cantholysis.</b> Don’t wait for imaging when the exam fits. The retina tolerates only about 90 minutes of ischemia." },

    { id: "orbcell", dx: "Orbital cellulitis with subperiosteal abscess",
      names: ["Orbital cellulitis"], accept: ["postseptal cellulitis", "post septal cellulitis", "subperiosteal abscess", "orbital abscess"],
      clues: [
        ["CC", "9-year-old boy with a swollen, red right eyelid and fever."],
        ["HPI", "A week of congestion and sinus pressure before the swelling started."],
        ["Exam", "It hurts him to move the eye. Upgaze and outward gaze are limited."],
        ["VA", "VA 20/40 OD, 20/20 OS. Mild proptosis on the right."],
        ["Labs", "Temperature 39.1 °C, WBC 18 ×10³/µL."],
        ["CT", "Ethmoid sinusitis with a fluid collection along the medial orbital wall."]
      ],
      pearl: "<b>Pain with eye movement, proptosis or limited motility</b> separate orbital from preseptal cellulitis. Admit for IV antibiotics; larger abscesses or worsening vision need drainage." },

    { id: "on", dx: "Optic neuritis",
      names: ["Optic neuritis"], accept: ["retrobulbar optic neuritis", "demyelinating optic neuritis", "multiple sclerosis", "ms", "ms optic neuritis"],
      clues: [
        ["CC", "26-year-old woman with blurry vision in her left eye that worsened over 3 days."],
        ["HPI", "It hurts when she moves the eye. Colors look washed out, especially red."],
        ["History", "A year ago, numbness in both legs that went away on its own."],
        ["VA · Pupils", "VA 20/100 OS. Left RAPD. Identifies 3 of 14 color plates OS."],
        ["Fundus", "Both optic discs look normal."],
        ["MRI", "Enhancement of the left optic nerve. White matter lesions oriented perpendicular to the lateral ventricles."]
      ],
      pearl: "<b>In the Optic Neuritis Treatment Trial, IV steroids sped recovery but didn’t change final vision.</b> Brain lesions on MRI predict multiple sclerosis risk; refer to neurology." },

    { id: "iih", dx: "Idiopathic intracranial hypertension",
      names: ["Idiopathic intracranial hypertension", "Pseudotumor cerebri"], accept: ["iih", "pseudotumor", "papilledema", "benign intracranial hypertension", "intracranial hypertension"],
      clues: [
        ["CC", "27-year-old woman with daily headaches for 2 months."],
        ["HPI", "Her vision grays out for a few seconds when she stands. She hears a whooshing in her ears with her heartbeat."],
        ["History", "BMI 38, recently gained 10 kg. Takes doxycycline for acne."],
        ["Motility", "Horizontal double vision at distance. The left eye doesn’t fully abduct."],
        ["Fundus", "Both optic discs are swollen with blurred margins and partly hidden vessels."],
        ["Workup", "MRI normal apart from a partially empty sella. Lumbar puncture opening pressure 38 cm H₂O with normal CSF."]
      ],
      pearl: "<b>Vision loss is the main risk.</b> Stop offending drugs (tetracyclines, vitamin A), start acetazolamide, support weight loss, and follow visual fields closely." },

    { id: "cn3", dx: "Third nerve palsy from a PCOM aneurysm",
      names: ["Third nerve palsy", "Posterior communicating artery aneurysm"], accept: ["cn3 palsy", "cn iii palsy", "oculomotor nerve palsy", "oculomotor palsy", "pcom aneurysm", "aneurysm", "compressive third nerve palsy", "pupil involving third nerve palsy", "3rd nerve palsy", "third cranial nerve palsy"],
      clues: [
        ["CC", "55-year-old woman with sudden double vision and the worst headache of her life."],
        ["Exterior", "Her right upper lid droops over most of the eye."],
        ["Motility", "The right eye rests down and out. She can’t move it inward, up or down."],
        ["Pupils", "Right pupil 7 mm and sluggish; left 3 mm."],
        ["History", "Smoker with hypertension."],
        ["CTA", "An 8 mm aneurysm where the internal carotid meets the posterior communicating artery."]
      ],
      pearl: "<b>A pupil-involving third nerve palsy is an aneurysm until proven otherwise.</b> Get emergent CTA or MRA. Pupil-sparing palsies in older patients with diabetes are usually microvascular." },

    { id: "horner", dx: "Horner syndrome from carotid dissection",
      names: ["Horner syndrome", "Carotid artery dissection"], accept: ["horners syndrome", "horner", "carotid dissection", "internal carotid artery dissection", "oculosympathetic paresis", "painful horner syndrome"],
      clues: [
        ["CC", "42-year-old man whose wife says his left eyelid looks droopy."],
        ["HPI", "Sharp left neck pain since a chiropractic adjustment 3 days ago."],
        ["Exterior", "2 mm droop of the left upper lid and slight elevation of the left lower lid."],
        ["Pupils", "The left pupil is smaller, and the difference grows in dim light. The left pupil is slow to dilate."],
        ["Drop test", "Apraclonidine drops dilate the left pupil and reverse the difference."],
        ["MRA", "Dissection of the left internal carotid artery."]
      ],
      pearl: "<b>A new painful Horner syndrome is a carotid dissection until imaging proves otherwise.</b> Start antithrombotic treatment to prevent stroke." },

    { id: "rb", dx: "Retinoblastoma",
      names: ["Retinoblastoma"], accept: ["rb"],
      clues: [
        ["CC", "18-month-old boy brought in by his parents."],
        ["HPI", "In flash photos, his right pupil looks white instead of red."],
        ["Exam", "His right eye has recently started turning inward."],
        ["Family history", "His father had an eye removed as a baby."],
        ["Fundus (EUA)", "A large white, elevated retinal mass with dilated feeding vessels and floating vitreous seeds."],
        ["Ultrasound", "Calcifications within the mass."]
      ],
      pearl: "<b>Leukocoria needs referral within days.</b> Never biopsy (it can seed tumor). Use MRI rather than CT, because children who carry germline RB1 mutations are sensitive to radiation and prone to second cancers." },

    { id: "namd", dx: "Neovascular (wet) age-related macular degeneration",
      names: ["Wet age-related macular degeneration", "Choroidal neovascularization"], accept: ["wet amd", "neovascular amd", "nvamd", "namd", "exudative amd", "amd", "age related macular degeneration", "macular degeneration", "cnv", "wet macular degeneration", "neovascular age related macular degeneration"],
      clues: [
        ["CC", "76-year-old woman: “The tile lines in my bathroom look wavy in my right eye.”"],
        ["HPI", "Started a week ago, with a gray smudge in the center of her vision."],
        ["History", "Former smoker. Takes AREDS2 vitamins."],
        ["VA", "VA 20/80 OD, 20/30 OS."],
        ["Fundus", "Large soft drusen in both eyes. The right eye has a gray-green lesion under the retina with surrounding hemorrhage."],
        ["OCT", "Fluid under the retina and a lesion beneath the retinal pigment epithelium."]
      ],
      pearl: "<b>Start intravitreal anti-VEGF injections promptly</b> (aflibercept, ranibizumab, faricimab or bevacizumab). Daily Amsler grid checks catch conversion in the other eye early." },

    { id: "csc", dx: "Central serous chorioretinopathy",
      names: ["Central serous chorioretinopathy"], accept: ["csc", "cscr", "csr", "central serous retinopathy", "central serous"],
      clues: [
        ["CC", "38-year-old man with blurry central vision in his left eye for a week."],
        ["HPI", "Things look smaller in that eye. He’s been working 80-hour weeks before a deadline."],
        ["History", "Finished a 10-day prednisone taper for poison oak last month."],
        ["VA", "VA 20/40 OS, improving to 20/25 with a +1.00 lens."],
        ["Fundus", "A round, blister-like elevation of the macula."],
        ["Imaging", "OCT: fluid under the central retina. Fluorescein angiography: a leak that rises like a plume of smoke."]
      ],
      pearl: "<b>Stop corticosteroids in every form,</b> including inhaled, nasal and skin creams. Most cases resolve within 3 months; chronic cases may get photodynamic therapy." },

    { id: "alkali", dx: "Alkali chemical burn",
      names: ["Chemical burn"], accept: ["alkali burn", "chemical injury", "alkali injury", "chemical eye injury", "ocular chemical burn", "chemical keratitis", "alkali chemical burn", "lye burn"],
      clues: [
        ["CC", "35-year-old man rushed into the ED holding his right eye."],
        ["Exam", "He can’t open the eye. Tearing heavily."],
        ["HPI", "Something splashed in his face while he was unclogging a drain at work 5 minutes ago."],
        ["pH", "Litmus paper on the tear film reads pH 12."],
        ["Slit lamp", "After irrigation: a large corneal epithelial defect and blanched white conjunctiva along a third of the limbus."],
        ["Cornea", "Hazy stroma; iris details are blurred."]
      ],
      pearl: "<b>Irrigate first, examine later:</b> liters of saline or lactated Ringer’s until the pH reads 7. Alkalis penetrate deeper than acids, and limbal blanching signals a worse outcome." },

    { id: "ted", dx: "Thyroid eye disease",
      names: ["Thyroid eye disease", "Graves orbitopathy"], accept: ["ted", "graves ophthalmopathy", "graves eye disease", "thyroid orbitopathy", "thyroid associated orbitopathy", "graves disease"],
      clues: [
        ["CC", "45-year-old woman with gritty, irritated eyes for 6 months."],
        ["HPI", "Friends say she always looks startled. Double vision when she looks up."],
        ["History", "Smokes a pack a day. Recently got radioactive iodine for weight loss and palpitations."],
        ["Exterior", "Upper lid retraction with white sclera visible above the cornea, lid lag on downgaze, proptosis 24 mm in both eyes."],
        ["Motility", "Limited upgaze in both eyes."],
        ["CT", "Enlarged inferior and medial rectus muscle bellies with the tendons spared."]
      ],
      pearl: "<b>Stopping smoking is the most important change she can make.</b> Radioactive iodine can worsen eye disease. Watch for optic nerve compression; teprotumumab treats active moderate-to-severe disease." },

    { id: "omg", dx: "Ocular myasthenia gravis",
      names: ["Myasthenia gravis"], accept: ["ocular myasthenia", "ocular myasthenia gravis", "mg", "myasthenia", "ocular mg"],
      clues: [
        ["CC", "62-year-old man with double vision that comes and goes."],
        ["HPI", "Fine in the morning, worse by evening and after reading."],
        ["Exterior", "Left lid droop that worsens after a minute of looking up."],
        ["Motility", "Variable misalignment that doesn’t fit any single nerve. Pupils normal."],
        ["Bedside test", "An ice pack on the left lid for 2 minutes lifts the lid by 3 mm."],
        ["Workup", "Acetylcholine receptor antibodies positive. CT chest: anterior mediastinal mass."]
      ],
      pearl: "<b>Myasthenia never affects the pupils.</b> About half of ocular cases generalize, usually within 2 years. Image the chest for thymoma." },

    { id: "toxo", dx: "Ocular toxoplasmosis",
      names: ["Ocular toxoplasmosis"], accept: ["toxoplasmosis", "toxo", "toxoplasma retinochoroiditis", "toxoplasma", "toxoplasma chorioretinitis"],
      clues: [
        ["CC", "24-year-old man with new floaters and blurry vision in his right eye."],
        ["History", "Grew up with outdoor cats. Likes his steak rare."],
        ["VA", "VA 20/60 OD."],
        ["Slit lamp", "Mild anterior chamber cells. Dense vitreous haze."],
        ["Fundus", "A fluffy white spot of retinal inflammation, right next to an old pigmented chorioretinal scar."],
        ["Look", "Through the haze it looks like a “headlight in the fog.”"]
      ],
      pearl: "<b>Reactivation at the edge of an old scar is classic.</b> Treat lesions near the macula or optic nerve with trimethoprim-sulfamethoxazole or a pyrimethamine-based regimen." },

    { id: "cmv", dx: "CMV retinitis",
      names: ["CMV retinitis"], accept: ["cytomegalovirus retinitis", "cmv"],
      clues: [
        ["CC", "39-year-old man with new floaters and a blind spot in his left eye."],
        ["History", "HIV diagnosed 10 years ago. Stopped antiretrovirals 2 years ago."],
        ["Labs", "CD4 count 32 cells/µL."],
        ["Slit lamp", "Quiet anterior chamber. Minimal vitreous cells."],
        ["Fundus", "A large area of white, dying retina with scattered hemorrhages along the vessels."],
        ["Look", "Often described as “pizza pie” or “cottage cheese and ketchup.”"]
      ],
      pearl: "<b>Treat with valganciclovir (or IV ganciclovir, sometimes with intravitreal injections) and restart antiretrovirals.</b> Check the other eye, and watch for retinal detachment." },

    { id: "pit", dx: "Pituitary macroadenoma compressing the chiasm",
      names: ["Pituitary adenoma", "Bitemporal hemianopia"], accept: ["pituitary macroadenoma", "pituitary tumor", "chiasmal compression", "pituitary mass", "prolactinoma"],
      clues: [
        ["CC", "50-year-old man who keeps bumping into doorframes."],
        ["HPI", "Months of headaches. Recently clipped a mirror while changing lanes."],
        ["ROS", "Low libido. He needs to shave less often."],
        ["VA", "VA 20/25 in both eyes. Normal anterior segments."],
        ["Visual fields", "The outer (temporal) half of the field is missing in both eyes, respecting the vertical midline."],
        ["MRI", "A 2.8 cm sellar mass compressing the optic chiasm."]
      ],
      pearl: "<b>Bitemporal field loss localizes to the chiasm.</b> Check pituitary hormones: prolactinomas respond to cabergoline, while most other adenomas need transsphenoidal surgery." },

    { id: "poag", dx: "Primary open-angle glaucoma",
      names: ["Primary open-angle glaucoma"], accept: ["poag", "open angle glaucoma", "glaucoma", "chronic open angle glaucoma"],
      clues: [
        ["CC", "59-year-old Black man referred after a screening at a health fair."],
        ["HPI", "No symptoms at all."],
        ["History", "His mother lost her vision to an eye disease. He is nearsighted."],
        ["IOP", "IOP 27 mmHg OD, 25 mmHg OS. Central corneal thickness 510 µm (thin)."],
        ["Fundus", "Cup-to-disc ratio 0.8 OD with a notch in the inferior rim; 0.6 OS."],
        ["Fields · Gonio", "Superior arcuate defect in the right eye. Gonioscopy shows open angles."]
      ],
      pearl: "<b>Silent until late.</b> First-line treatment is a prostaglandin analog drop or selective laser trabeculoplasty, which the LiGHT trial supports as a first step." }
  ];

  var DISTRACTORS = [
    "Branch retinal artery occlusion", "Branch retinal vein occlusion", "Non-arteritic ischemic optic neuropathy",
    "Posterior vitreous detachment", "Macular hole", "Epiretinal membrane", "Dry age-related macular degeneration",
    "Hypertensive retinopathy", "Diabetic macular edema", "Retinitis pigmentosa", "Bacterial conjunctivitis",
    "Viral conjunctivitis", "Allergic conjunctivitis", "Episcleritis", "Scleritis", "Subconjunctival hemorrhage",
    "Corneal abrasion", "Fungal keratitis", "Exposure keratopathy", "Dry eye disease", "Blepharitis", "Chalazion",
    "Preseptal cellulitis", "Dacryocystitis", "Hyphema", "Traumatic iritis", "Orbital floor fracture", "Commotio retinae",
    "Sixth nerve palsy", "Fourth nerve palsy", "Internuclear ophthalmoplegia", "Adie tonic pupil", "Migraine with aura",
    "Optic disc drusen", "Leber hereditary optic neuropathy", "Cavernous sinus thrombosis", "Carotid-cavernous fistula",
    "Keratoconus", "Cataract", "Pseudoexfoliation glaucoma", "Pigment dispersion syndrome", "Neovascular glaucoma",
    "Coats disease", "Retinopathy of prematurity", "Ocular toxocariasis", "Acute retinal necrosis", "Endogenous endophthalmitis",
    "Sympathetic ophthalmia", "Vogt-Koyanagi-Harada disease", "Sarcoid uveitis", "Uveal melanoma", "Choroidal nevus",
    "Ocular syphilis", "Fuchs endothelial dystrophy", "Functional vision loss", "Amaurosis fugax", "Lacrimal gland tumor",
    "Orbital lymphoma", "Birdshot chorioretinopathy", "Macular edema after cataract surgery"
  ];

  // ---------- Helpers ----------
  function norm(s) {
    return String(s).toLowerCase().replace(/[’']s\b/g, "s").replace(/[^a-z0-9]+/g, " ").trim();
  }
  var ACCEPT = {};
  CASES.forEach(function (c) {
    var set = {};
    [c.dx].concat(c.names, c.accept).forEach(function (n) { set[norm(n)] = true; });
    ACCEPT[c.id] = set;
  });
  var OPTIONS = (function () {
    var seen = {}, out = [];
    CASES.forEach(function (c) { c.names.forEach(function (n) { if (!seen[norm(n)]) { seen[norm(n)] = 1; out.push(n); } }); });
    DISTRACTORS.forEach(function (n) { if (!seen[norm(n)]) { seen[norm(n)] = 1; out.push(n); } });
    return out.sort(function (a, b) { return a.localeCompare(b); });
  })();

  // Daily schedule: append-only. Never reorder or remove ids, or past and current days change.
  // Any case missing from this list is appended automatically in bank order, so a new case
  // never reshuffles today's case. Add the id here when you want to pin it to a later day.
  var SCHEDULE = ["crvo", "aacg", "cmv", "gca", "rb", "iih", "namd", "crao", "csc", "pdr", "rbh", "hsv", "poag", "endo", "rrd",
    "ted", "horner", "hzo", "acanth", "aau", "pit", "omg", "toxo", "orbcell", "alkali", "ogi", "cn3", "on", "bk"];
  var ORDER = (function () {
    var seen = {}, idx = [];
    SCHEDULE.forEach(function (id) { for (var i = 0; i < CASES.length; i++) if (CASES[i].id === id && !seen[id]) { seen[id] = 1; idx.push(i); } });
    CASES.forEach(function (c, i) { if (!seen[c.id]) { seen[c.id] = 1; idx.push(i); } });
    return idx;
  })();

  var LAUNCH = Date.UTC(2026, 10, 2); // Daily #1
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dateKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function dayNumber(d) {
    return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - LAUNCH) / 86400000) + 1;
  }
  function dailyCase(d) {
    var n = dayNumber(d);
    var i = ((n - 1) % ORDER.length + ORDER.length) % ORDER.length;
    return CASES[ORDER[i]];
  }
  function editDistance(a, b) {
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  // Exact match, or a close typo of a long answer (1 slip for 6-11 letters, 2 for 12+). Short abbreviations must be exact.
  function isAccepted(caseId, guess) {
    var n = norm(guess), set = ACCEPT[caseId];
    if (set[n]) return true;
    if (n.length < 6) return false;
    var tol = n.length >= 12 ? 2 : 1;
    return Object.keys(set).some(function (k) { return k.length >= 6 && Math.abs(k.length - n.length) <= tol && editDistance(n, k) <= tol; });
  }
  function byId(id) { for (var i = 0; i < CASES.length; i++) if (CASES[i].id === id) return CASES[i]; return null; }

  var STORE_KEY = "ophtho-cotd-v1";
  function loadHistory() {
    try { var raw = localStorage.getItem(STORE_KEY); var h = raw ? JSON.parse(raw) : {}; if (!h || typeof h !== "object") return {};
      Object.keys(h).forEach(function (k) {
        var g = h[k];
        if (!g || typeof g.caseId !== "string" || !(g.revealed >= 1 && g.revealed <= 6) || !Array.isArray(g.steps)) delete h[k];
      });
      return h; }
    catch (e) { return {}; }
  }
  function saveHistory(h) { try { localStorage.setItem(STORE_KEY, JSON.stringify(h)); } catch (e) { /* storage unavailable; keep in memory */ } }

  // ---------- State ----------
  var today = new Date();
  var TODAY = dateKey(today);
  var history = loadHistory();
  var S = {
    mode: "daily",
    daily: history[TODAY] || { caseId: dailyCase(today).id, revealed: 1, steps: [], done: false, solved: false },
    practice: null,
    lastRevealed: 0
  };
  if (!byId(S.daily.caseId)) S.daily = { caseId: dailyCase(today).id, revealed: 1, steps: [], done: false, solved: false };

  function game() { return S.mode === "daily" ? S.daily : S.practice; }
  function persist() {
    if (S.mode !== "daily") return;
    history[TODAY] = S.daily;
    saveHistory(history);
  }

  // ---------- Elements ----------
  var $ = function (id) { return document.getElementById(id); };
  var el = {
    modePill: $("modePill"), streakPill: $("streakPill"), modeSwitch: $("modeSwitch"),
    caseTitle: $("caseTitle"), clueCount: $("clueCount"), clues: $("clues"), steps: $("steps"),
    guessBox: $("guessBox"), input: $("guessInput"), sugg: $("suggList"), guessBtn: $("guessBtn"), clueBtn: $("clueBtn"),
    giveUp: $("giveUpBtn"), feedback: $("feedback"), resultCard: $("resultCard"), verdict: $("verdict"), dxName: $("dxName"),
    pearl: $("pearl"), shareBtn: $("shareBtn"), practiceBtn: $("practiceBtn"), shareFallback: $("shareFallback"), nextCase: $("nextCase"),
    sPlayed: $("sPlayed"), sRate: $("sRate"), sStreak: $("sStreak"), sBest: $("sBest"), dist: $("dist")
  };

  // ---------- Stats ----------
  function stats() {
    var keys = Object.keys(history).filter(function (k) { return history[k] && history[k].done; }).sort();
    var played = keys.length, wins = 0, dist = [0, 0, 0, 0, 0, 0, 0];
    keys.forEach(function (k) { var g = history[k]; if (g.solved) { wins++; dist[Math.min(g.revealed, 6) - 1]++; } else dist[6]++; });
    // current streak: consecutive solved days ending today (or yesterday if today isn't finished)
    var d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var tk = dateKey(d);
    if (!(history[tk] && history[tk].done)) d.setDate(d.getDate() - 1);
    var streak = 0;
    while (true) { var g = history[dateKey(d)]; if (g && g.done && g.solved) { streak++; d.setDate(d.getDate() - 1); } else break; }
    // best streak
    var best = 0, run = 0, prev = null;
    keys.forEach(function (k) {
      var g = history[k];
      var cur = new Date(k + "T12:00:00");
      var consecutive = prev && Math.round((cur - prev) / 86400000) === 1;
      if (g.solved) { run = consecutive ? run + 1 : 1; best = Math.max(best, run); } else run = 0;
      prev = cur;
    });
    return { played: played, wins: wins, dist: dist, streak: streak, best: Math.max(best, streak) };
  }

  // ---------- Rendering ----------
  function render() {
    var g = game(), c = byId(g.caseId);
    var isDaily = S.mode === "daily";
    el.modePill.textContent = isDaily ? "Daily · #" + dayNumber(today) : "Practice";
    el.modeSwitch.textContent = isDaily ? "Practice a random case" : "Back to today’s case";
    el.caseTitle.textContent = isDaily ? "Today’s patient" : "Practice patient";
    el.clueCount.textContent = "Clue " + Math.min(g.revealed, 6) + " of 6";

    // clues
    var html = "";
    for (var i = 0; i < 6; i++) {
      var k = c.clues[i][0], t = c.clues[i][1];
      if (i < g.revealed || g.done) {
        var isNew = i >= S.lastRevealed && i < g.revealed && !g.done && S.lastRevealed > 0;
        html += '<li class="clue' + (isNew ? " new" : "") + '"><span class="k">' + esc(k) + '</span><span class="t">' + esc(t) + "</span></li>";
      } else {
        html += '<li class="clue locked"><span class="k">' + esc(k) + '</span><span class="t"><span class="bar" aria-hidden="true"></span><span class="vh">Locked</span></span></li>';
      }
    }
    el.clues.innerHTML = html;
    S.lastRevealed = g.revealed;

    // steps
    var sh = "";
    for (var s = 0; s < 6; s++) {
      var st = g.steps[s];
      sh += '<span class="step' + (st ? " " + st : "") + '">' + (GLYPH[st] || "") + "</span>";
    }
    el.steps.innerHTML = sh;
    el.steps.setAttribute("aria-label", stepsLabel(g.steps));

    // guess vs result
    el.guessBox.hidden = g.done;
    el.resultCard.hidden = !g.done;
    el.clueBtn.disabled = g.revealed >= 6;
    el.giveUp.hidden = !(g.revealed >= 6 && !g.done);
    if (g.done) {
      el.verdict.textContent = g.solved ? "Solved with " + g.revealed + (g.revealed === 1 ? " clue" : " clues") : "Not solved this time";
      el.verdict.className = "verdict " + (g.solved ? "win" : "lose");
      el.dxName.textContent = c.dx;
      el.pearl.innerHTML = c.pearl;
      el.practiceBtn.textContent = isDaily ? "Practice another case" : "Try another practice case";
      el.shareFallback.hidden = true;
      el.nextCase.textContent = isDaily ? nextCaseText() : "Practice cases don’t count toward your record.";
    }

    // stats
    var st2 = stats();
    el.streakPill.textContent = "Streak " + st2.streak;
    el.sPlayed.textContent = st2.played;
    el.sRate.textContent = st2.played ? Math.round(100 * st2.wins / st2.played) + "%" : "0%";
    el.sStreak.textContent = st2.streak;
    el.sBest.textContent = st2.best;
    var max = Math.max.apply(null, st2.dist.concat([1]));
    var dh = "";
    var todayHit = S.daily.done ? (S.daily.solved ? S.daily.revealed - 1 : 6) : -1;
    for (var b = 0; b < 7; b++) {
      var label = b < 6 ? (b + 1) + (b === 0 ? " clue" : " clues") : "Missed";
      var w = Math.round(100 * st2.dist[b] / max);
      dh += '<div class="r' + (b === todayHit ? (b < 6 ? " hit" : " miss") : "") + '"><span class="lbl" aria-hidden="true">' + (b < 6 ? (b + 1) : "X") + '</span><div class="track"><div class="fill" style="width:' + w + '%"></div></div><span class="n"><span class="vh">' + label + ": </span>" + st2.dist[b] + "</span></div>";
    }
    el.dist.innerHTML = dh;
    el.dist.hidden = !st2.played;
  }

  var GLYPH = { wrong: "×", skip: "–", right: "✓" };
  function stepsLabel(steps) {
    var n = { wrong: 0, skip: 0, right: 0 };
    steps.forEach(function (s) { n[s]++; });
    return "Your attempts: " + n.wrong + " wrong, " + n.skip + " skipped, " + n.right + " correct, " + (6 - steps.length) + " unused";
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; }); }

  function nextCaseText() {
    var now = new Date();
    var mid = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var mins = Math.max(0, Math.round((mid - now) / 60000));
    var h = Math.floor(mins / 60), m = mins % 60;
    return "Next case in " + h + " h " + pad(m) + " m";
  }

  // ---------- Game actions ----------
  function finish(solved) {
    var g = game();
    g.done = true; g.solved = solved;
    persist();
    render();
    el.dxName.focus({ preventScroll: true });
    el.resultCard.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }

  function submitGuess(text) {
    var g = game(); if (g.done) return;
    var guess = (text != null ? text : el.input.value).trim();
    if (!guess) { setFeedback("Type a diagnosis first.", true); el.input.focus(); return; }
    hideSugg();
    if (isAccepted(g.caseId, guess)) {
      g.steps.push("right");
      el.input.value = "";
      setFeedback("");
      finish(true);
      return;
    }
    g.steps.push("wrong");
    el.input.value = "";
    if (g.revealed >= 6) { setFeedback(""); finish(false); return; }
    g.revealed++;
    setFeedback("Not “" + guess + "”. Clue " + g.revealed + " is open.", true, newClueText());
    persist();
    render();
    el.input.focus();
  }

  function nextClue() {
    var g = game(); if (g.done || g.revealed >= 6) return;
    g.steps.push("skip");
    g.revealed++;
    setFeedback("Clue " + g.revealed + " is open.", false, newClueText());
    persist();
    render();
  }

  // extra is read by screen readers only, so the new clue is announced along with "Clue N is open"
  function setFeedback(msg, bad, extra) {
    el.feedback.innerHTML = esc(msg) + (extra ? ' <span class="vh">' + esc(extra) + "</span>" : "");
    el.feedback.className = "feedback" + (bad ? " bad" : "");
  }
  function newClueText() { var g = game(), cl = byId(g.caseId).clues[g.revealed - 1]; return cl[0] + ": " + cl[1]; }

  function startPractice() {
    var pool = CASES.filter(function (c) { return c.id !== S.daily.caseId && (!S.practice || c.id !== S.practice.caseId); });
    var c = pool[Math.floor(Math.random() * pool.length)];
    S.practice = { caseId: c.id, revealed: 1, steps: [], done: false, solved: false };
    S.mode = "practice"; S.lastRevealed = 0;
    setFeedback(""); el.input.value = "";
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function shareText() {
    var g = game();
    var grid = g.steps.map(function (s) { return s === "right" ? "✓" : s === "wrong" ? "×" : "–"; }).join(" ");
    var head = S.mode === "daily" ? "Ophtho Case of the Day #" + dayNumber(today) : "Ophtho Case of the Day · practice";
    return head + "\n" + grid + "  " + (g.solved ? g.revealed + "/6 clues" : "X/6") + "\nhttps://seanleels.com/case/";
  }

  // ---------- Suggestions ----------
  var suggIndex = -1, suggItems = [];
  function updateSugg() {
    var q = norm(el.input.value);
    if (!q) { hideSugg(); return; }
    var words = q.split(" ");
    suggItems = OPTIONS.filter(function (o) {
      var n = norm(o);
      return words.every(function (w) { return n.indexOf(w) !== -1; });
    }).slice(0, 7);
    if (!suggItems.length) { hideSugg(); return; }
    suggIndex = -1;
    el.sugg.innerHTML = suggItems.map(function (o, i) { return '<li role="option" id="sg' + i + '" aria-selected="false" data-i="' + i + '">' + esc(o) + "</li>"; }).join("");
    el.sugg.hidden = false;
    el.input.setAttribute("aria-expanded", "true");
    if (matchMedia("(max-width: 460px)").matches) el.input.parentNode.scrollIntoView({ block: "start" });
  }
  function hideSugg() { el.sugg.hidden = true; el.input.setAttribute("aria-expanded", "false"); el.input.removeAttribute("aria-activedescendant"); suggIndex = -1; }
  function moveSugg(d) {
    if (el.sugg.hidden || !suggItems.length) return;
    suggIndex = (suggIndex + d + suggItems.length) % suggItems.length;
    Array.prototype.forEach.call(el.sugg.children, function (li, i) { li.setAttribute("aria-selected", i === suggIndex ? "true" : "false"); });
    el.input.setAttribute("aria-activedescendant", "sg" + suggIndex);
  }

  // ---------- Events ----------
  el.input.addEventListener("input", updateSugg);
  el.input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSugg(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSugg(-1); }
    else if (e.key === "Escape") { hideSugg(); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (!el.sugg.hidden && suggIndex >= 0) submitGuess(suggItems[suggIndex]);
      else submitGuess();
    }
  });
  el.input.addEventListener("blur", function () { setTimeout(hideSugg, 150); });
  el.sugg.addEventListener("mousedown", function (e) {
    var li = e.target.closest("li"); if (!li) return;
    e.preventDefault();
    el.input.value = suggItems[+li.getAttribute("data-i")];
    hideSugg();
    el.input.focus();
  });
  el.guessBtn.addEventListener("click", function () { submitGuess(); });
  el.clueBtn.addEventListener("click", nextClue);
  el.giveUp.addEventListener("click", function () { var g = game(); if (!g.done) { g.steps.push("wrong"); finish(false); } });
  el.practiceBtn.addEventListener("click", startPractice);
  el.modeSwitch.addEventListener("click", function () {
    if (S.mode === "daily") startPractice();
    else { S.mode = "daily"; S.lastRevealed = 0; setFeedback(""); render(); }
  });
  el.shareBtn.addEventListener("click", function () {
    var text = shareText();
    var done = function () { el.shareBtn.textContent = "Copied"; setTimeout(function () { el.shareBtn.textContent = "Copy result"; }, 1800); };
    var fallback = function () { el.shareFallback.value = text; el.shareFallback.hidden = false; el.shareFallback.focus(); el.shareFallback.select(); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (e) { fallback(); }
  });
  setInterval(function () {
    if (dateKey(new Date()) !== TODAY) {
      if (!el.input.value) { location.reload(); return; }
      setFeedback("A new daily case is open. Finish this guess, then reload the page to play it.", true);
    }
    if (S.mode === "daily" && S.daily.done) el.nextCase.textContent = nextCaseText();
  }, 30000);

  // ---------- Boot ----------
  render();
})();
