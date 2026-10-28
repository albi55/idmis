(function () {
  'use strict';
  if (location.protocol === 'file:') {
    var IDMIS_URL = 'http://127.0.0.1:47821';
    var filePath = decodeURIComponent(location.pathname).replace(/\\/g, '/');
    var fileAt = filePath.toLowerCase().lastIndexOf('/idms/');
    var webUrl = IDMIS_URL + (fileAt >= 0 ? filePath.slice(fileAt + 5) : '/Account/Login.html') + location.search + location.hash;
    document.documentElement.classList.add('i18n-wait');
    var showOffline = function () {
      var box = document.createElement('main');
      box.setAttribute('style', 'max-width:560px;margin:15vh auto;padding:32px;font-family:var(--font-body);color:var(--ink);' +
        'background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);line-height:1.6');
      var h = document.createElement('h1');
      h.setAttribute('style', 'font-family:var(--font-display);font-size:1.5rem;margin:0 0 12px');
      h.textContent = 'Hyrja në IDMIS kërkon serverin';
      var p = document.createElement('p');
      p.setAttribute('style', 'margin:0 0 16px;color:var(--ink-soft)');
      p.textContent = 'Kjo faqe u hap si skedar, prandaj nuk mund të kontrollohet hyrja. ' +
        'Ndizni serverin me «start-idmis.cmd» në dosjen Work, pastaj hapni IDMIS në këtë adresë:';
      var a = document.createElement('a');
      a.href = webUrl;
      a.textContent = webUrl;
      a.setAttribute('style', 'font-weight:700;color:var(--green-700);word-break:break-all');
      box.appendChild(h); box.appendChild(p); box.appendChild(a);
      document.body.innerHTML = '';
      document.body.className = '';
      document.body.appendChild(box);
      document.documentElement.classList.remove('i18n-wait');
    };
    var waited = setTimeout(showOffline, 3000);
    fetch(IDMIS_URL + '/__idmis_ping', { mode: 'no-cors', cache: 'no-store' })
      .then(function () { clearTimeout(waited); location.replace(webUrl); })
      .catch(function () { clearTimeout(waited); showOffline(); });
    return;
  }
  var I18N = {
    sq: {
      skip: 'Kalo te përmbajtja',
      brandSub1: 'Ujitje dhe Kullim',
      brandSub2: 'Sistemi i Informacionit të Menaxhimit',
      navMap: 'Harta publike',
      navLogin: 'Hyr', navRegister: 'Regjistrohu',
      statsTitle: 'Rrjeti në shifra',
      statSchemesLbl: 'Skema vaditjeje',
      statCanalsLbl: 'Kanale ujitëse I, II & III',
      statIrrigAreaLbl: 'Sipërfaqe ujitëse',
      statDrainableAreaLbl: 'Sipërfaqe e kullueshme',
      statDrainSchemesLbl: 'Skema kullimi',
      statDrainCanalsLbl: 'Kanale kullimi I, II & III',
      statDrainAreaLbl: 'Sipërfaqe kullimi',
      statMuniLbl: 'Bashki të mbuluara', statMuniUnit: 'nga 46',
      unitKm: 'km', unitHa: 'ha',
      mapEyebrow: 'Harta publike',
      mapTitle: 'Infrastruktura e ujitjes në hartë',
      mapLead: 'E konsultueshme pa llogari. Klikoni mbi hartë për të parë të dhënat e çdo objekti.',
      layIrrig: 'Kanale ujitëse', layDrain: 'Kanale kulluese',
      layRes: 'Rezervuarë', layMuni: 'Kufij bashkiakë',
      mapBtn: 'Hap hartën publike',
      mapTag: 'idmis.gis.al',
      loginTitle: 'Hyr në sistem',
      loginNote: 'Përdorni kredencialet e llogarisë suaj institucionale.',
      loginForgot: 'Keni harruar fjalëkalimin?',
      loginSubmit: 'Hyr',
      loginAlt: 'Nuk keni llogari?',
      loginBusy: 'Duke hyrë…',
      loginErrEmpty: 'Shkruani përdoruesin ose email-in dhe fjalëkalimin.',
      loginErrInvalid: 'Përdoruesi ose fjalëkalimi është i gabuar.',
      loginErrInactive: 'Kjo llogari është çaktivizuar. Kontaktoni administratorin.',
      loginErrLocked: 'Shumë tentativa të gabuara. Provoni përsëri pas 15 minutash.',
      loginErrServer: 'Hyrja nuk u krye për një gabim në server. Provoni përsëri.',
      loginErrOffline: 'Serveri i IDMIS nuk përgjigjet. Mbyllni dhe hapni përsëri IDMIS.',
      logout: 'Dil',
      logoutTitle: 'Dil nga sistemi',
      pmSettings: 'Cilësimet', pmHelp: 'Ndihmë', pmOpen: 'hap menunë e llogarisë',
      portalSignedIn: 'Keni hyrë si',
      roleADMINISTRATOR: 'Administrator',
      roleOPERATOR_BASHKIE: 'Operator bashkie',
      roleSPECIALIST: 'Specialist',
      portalEyebrow: 'Shërbimet e IDMIS',
      toastOkTitle: 'U ruajt me sukses',
      toastErrTitle: 'Veprimi nuk u krye',
      toastClose: 'Mbyll njoftimin',
      loadingData: 'Duke ngarkuar të dhënat…',
      skSaved: 'Ndryshimet u ruajtën.',
      portalTitle: 'Mirë se erdhët',
      portalNote: 'Zgjidhni një nga shërbimet e mëposhtme për të vazhduar.',
      portalAsideTitle: 'Zgjidhni shërbimin që ju nevojitet',
      portalPerk1: 'Harta interaktive me pemën e plotë të shtresave',
      portalPerk2: 'Raporte të gjeneruara nga regjistri qendror',
      portalPerk3: 'Statistika sipas bashkisë dhe skemës ujitëse',
      portalMapTitle: 'Harta',
      portalMapDesc: 'Kanalet, rezervuarët dhe skemat mbi hartë',
      portalRepTitle: 'Statistika',
      portalRepDesc: 'Treguesit e rrjetit të ujitjes dhe kullimit',
      portalAdminTitle: 'Administrimi i të dhënave',
      portalAdminDesc: 'Vlerësimi dhe publikimi i të dhënave GIS',
      portalUpdTitle: 'Përditësimi i të dhënave',
      portalUpdDesc: 'Zonat agroklimatike dhe kulturat e bashkisë',
      portalAstDesc: 'Digat, stacionet e pompimit, rezervuarët dhe makineritë e bashkisë',
      portalNewTab: '(hapet në një dritare të re)',
      navGisReview: 'Vlerësimi dhe publikimi i informacioneve GIS',
      navDataUpdate: 'Përditësimi i të dhënave',
      tarTitle: 'Tarifat e ujitjes dhe kullimit',
      tarUnitLbl: 'Njësia',
      tarUnit: 'Lekë/dynym',
      tarG1: 'Tarifë vjetore për mirëmbajtje',
      tarG1a: 'Ujitja',
      tarG1b: 'Kullimi',
      tarG2: 'Tarifë shërbimi ujitje',
      tarG2a: 'Me kanal i hapur me rrjedhje të lirë',
      tarG2b: 'Me sistem të mbyllur, tubacione',
      tarG2c: 'Me pompa private individuale',
      tarEmptyTitle: 'E papërcaktuar',
      tarMuniTitle: 'Tarifat sipas bashkisë',
      tarPageLead: 'Tarifat e ujitjes dhe kullimit për secilën nga 46 bashkitë.',
      tarMapDesc: 'Kufijtë e 46 bashkive. Klikoni një bashki për të parë tarifat e saj.',
      tarLgSet: 'Me tarifa të përcaktuara',
      tarLgUnset: 'Pa tarifa të përcaktuara',
      tarFigSet: 'Me tarifa të përcaktuara',
      tarFigUnset: 'Pa tarifa të përcaktuara',
      tarPanelHint: 'Klikoni një bashki në hartë për të parë tarifat e saj.',
      tarPanelBack: 'Klikoni sërish bashkinë për t’u kthyer te totalet.',
      frmIntro: 'Zgjidhni bashkinë dhe plotësoni tarifat. Fushat bosh mbeten të papërcaktuara.',
      frmMuniPh: 'Zgjidhni bashkinë…',
      frmLockHint: 'Zgjidhni një bashki për të plotësuar tarifat.',
      frmSave: 'Ruaj tarifat',
      frmReset: 'Pastro',
      frmErrMuni: 'Zgjidhni bashkinë.',
      frmErrNum: 'Vendosni një numër 0 ose më të madh.',
      frmSaved: 'Të dhënat u ruajtën me sukses.',
      frmViewLink: 'Shiko në faqen e tarifave →',
      frmSaveFail: 'Ruajtja nuk u krye: ky shfletues nuk lejon ruajtjen e të dhënave.',
      tarUpdated: 'Përditësuar më {d}',
      astTitle: 'Regjistri i aseteve të U&K',
      astSubSkema: 'Regjistri i skemave ujitëse: kodi, sipërfaqja që ujitet dhe gjatësia e kanaleve.',
      astSubDige: 'Regjistri kombëtar i digave të mëdha: përmasat, rezervuarët, teknologjia, qëllimi dhe vendndodhja.',
      astSubStacion: 'Stacionet e pompimit për ujitje: kapaciteti, fuqia dhe gjendja teknike.',
      astSubHidrovor: 'Hidrovoret për kullimin e tokave: kapaciteti, fuqia e instaluar dhe sipërfaqja që kullojnë.',
      astSubRezervuar: 'Rezervuarët ujorë: vëllimi i ujit dhe sipërfaqja që ujitin.',
      astSubMakineri: 'Makineritë dhe mjetet e mirëmbajtjes në pronësi të bashkisë.',
      astActAdd: 'Shto',
      astActUpdate: 'Përditëso',
      astActMap: 'Shiko në hartë',
      msMuniSearch: 'Kërko bashkinë ose qarkun…',
      skAllTitle: 'Skemat ujitëse sipas bashkisë',
      skNoData: 'Për bashkinë {m} nuk ka ende të dhëna për skemat ujitëse.',
      skStatSkema: 'Skema', skStatKm: 'Kanale në Km', skStatUpd: 'Përditësuar Km',
      skTblFull: 'Skema të plota të transferuara', skTblPartial: 'Skema të pjesërisht të transferuara',
      skColNr: 'Nr.', skColSkema: 'Skema Ujitëse', skColKodi: 'Kodi', skColEm: 'Emërtimi', skColBurimi: 'Burimi Ujor',
      skColKm: 'Kanale të Para dhe të Dyta në Km', skColKm2: 'Vetëm Kanale të Dyta në Km',
      skColTeren: 'Identifikuar në Teren', skColUpd: 'Përditësuar', skColUpdMe: 'Data e përditësimit',
      skYes: 'Po', skTotal: 'Total', skCount1: '1 Skemë', skCount: '{n} Skema',
      skColKmShort: 'Kanale në Km',
      fmTitle: 'Formulari F01-03 · Inventari i Skemave', fmColF: 'F01-03', fmColStatus: 'Statusi',
      fmSaved: 'Ruajtur më {d} nga {u}', fmNew: 'Formulari nuk është plotësuar ende.',
      fmLoading: 'Po ngarkohet formulari…', fmLoadFail: 'Formulari nuk u ngarkua.',
      fmOpen: 'Hap formularin F01-03 — {s}', fmFilled: 'Formulari F01-03 është plotësuar', fmNotFilled: 'Formulari F01-03 nuk është plotësuar',
      fmS1: 'Identifikimi', fmS2: 'Sipërfaqet dhe fermerët', fmS3: 'Burimi dhe infrastruktura', fmS4: 'Gjendja dhe dokumentimi',
      fmEdit: 'Ndrysho formularin', fmCancel: 'Anulo', fmSave: 'Ruaj', fmClose: 'Mbyll',
      fmDirty: 'Keni ndryshime të paruajtura në formular.', fmDiscard: 'Hidh ndryshimet', fmKeep: 'Vazhdo plotësimin',
      fmSavedOk: 'Formulari u ruajt.', fmReadOnly: 'Formularin mund ta ndryshojë administratori ose operatori i bashkisë.',
      fmLegend: 'Kodet e statusit të të dhënave', fmLgSub: 'Çdo fushë e formularit merr një nga këto kode.', fmLgExLbl: 'Dokumentacioni:', fmLgHead: 'Kodi|Statusi|Përkufizimi|Shembuj të dokumentacionit mbështetës',
      fmLgDef: 'Bazuar në matje direkte ose regjistrime të verifikuara|Marrë nga dokumente zyrtare ose teknike|Bazuar në një metodë vlerësimi të dokumentuar|Informacioni mungon ose nuk mund të verifikohet aktualisht|Fusha nuk zbatohet për rastin konkret',
      fmLgEx: 'Matje në terren, lexime matësish|Inventar, hartë, plan i miratuar|Vlerësim teknik, përllogaritje|Shpjegim i mungesës së informacionit|Arsyeja e moszbatimit',
      fmKodiTransf: 'Kodi i skemës së transferuar', fmKodiRi: 'Kodi i ri (vendoset nga bashkia)', fmViti: 'Viti', fmNoUnits: 'Bashkia nuk ka njësi administrative në databazë.',
      fmL1: 'Kodi i bashkisë', fmL2: 'Kodi i skemës së ujitjes', fmL3: 'Emri i skemës së ujitjes', fmL4: 'Njësia/njësitë administrative që mbulon',
      fmL5: 'Lloji i skemës', fmL6: 'Operatori përgjegjës', fmL7: 'Kodi i operatorit, nëse ekziston', fmL8: 'Sipërfaqja e ujitshme',
      fmL9: 'Sipërfaqja e shërbyeshme', fmL10: 'Sipërfaqja e ujitur realisht', fmL11: 'Numri i fermerëve/përdoruesve në skemë',
      fmL12: 'Numri i fermerëve/përdoruesve të shërbyer', fmL13: 'Burimi kryesor i ujit', fmL14: 'Marrja kryesore e ujit është funksionale?',
      fmL15: 'Rrjeti kryesor përcjellës është funksional?', fmL16: 'Rrjeti shpërndarës është funksional?', fmL17: 'Numri total i stacioneve të pompimit',
      fmL18: 'Numri i stacioneve të pompimit funksionale', fmL19: 'Gjendja e përgjithshme e skemës', fmL20: 'Vlerësimi i fundit i infrastrukturës',
      fmL21: 'Problemet kryesore të funksionimit', fmL22: 'Burimi/referenca e dokumentacionit', fmL23: 'Statusi i të dhënave', fmL24: 'Komente shtesë',
      fmU1: 'Kodi ekzistues', fmU2: 'Kod zyrtar / IDMIS', fmU3: 'Tekst', fmU4: 'Emri', fmU6: 'Emri', fmU7: 'Kod ekzistues', fmUha: 'ha', fmUhaVit: 'ha/vit',
      fmUnr: 'numër', fmUnrVit: 'numër/vit', fmU20: 'Vit / Datë', fmUtekst: 'Tekst', fmU22: 'Emri i dokumentit / Referenca',
      fmO_lloji: 'Me gravitet|Me pompim|E përzier|Tjetër', fmO_burimi: 'Lumë|Rezervuar|Kanal|Ujë nëntokësor|Tjetër',
      fmO_funk: 'Po|Pjesërisht|Jo|E panjohur', fmO_gjendja: 'Funksionale|Pjesërisht funksionale|Jofunksionale|E panjohur',
      fmO_statusi: 'E matur|E dokumentuar|E vlerësuar|E panjohur|Pa zbatim', fm20Ph: 'p.sh. 2025 ose 2025-06-30',
      fmErrStatus: 'Zgjidhni statusin e kësaj vlere (M, D, V, PZ ose PZB).',
      fmErrYear: 'Shkruani vitin.', fmErrMax: 'Nuk mund të jetë më e madhe se fusha {m}.',
      fmErrValue: 'Vlera nuk është e saktë.', fmErrSave: 'Formulari nuk u ruajt. Provoni përsëri.',
      fmErrScope: 'Mund të ruani vetëm formularët e bashkisë suaj.',
      fmOpManage: 'Hap «Mjeshtri i ujit»', fmOpNone: 'Bashkia nuk ka ende operatorë.', fmOpOff: 'jo aktiv',
      fmErrOpOff: 'Ky operator nuk është më aktiv.',
      hvTitleAll: 'Hidrovoret sipas Drejtorive të Ujitjes dhe Kullimit', hvTitleOne: 'Hidrovoret — Drejtoria e Ujitjes dhe Kullimit {d}',
      hvDrejtoriaShort: 'Drejtoria', hvAllDrejtori: 'Të gjitha drejtoritë',
      hvColEmri: 'Emri', hvColLloji: 'Lloji', hvColVendodhja: 'Vendodhja', hvColDrejtoria: 'Drejtoria e Ujitjes dhe Kullimit',
      hvColHa: 'Sipërfaqja që Kullon (ha)', hvColKap: 'Kapaciteti i Projektuar (m³/sek)', hvColKw: 'Fuqia e Instaluar (kW)',
      hvColElp: 'Elektropompa', hvColElpAll: 'Gjithsej', hvColElpMain: 'Kryesore',
      hvColNen: 'Nënstacioni Furnizues', hvColNenEmri: 'Emri', hvColNenVend: 'Vendodhja',
      hvColLinja: 'Linja Furnizimi', hvColShenim: 'Shënim', hvNoteShow: 'Shiko', hvNoteHide: 'Mbyll',
      hvUnknown: 'E panjohur', hvCount1: '1 Hidrovor', hvCount: '{n} Hidrovore',
      dgLocShort: 'Vendodhja', dgAllLoc: 'Të gjitha vendodhjet',
      dgTitleAll: 'Regjistri kombëtar i digave të mëdha sipas lartësisë (H), 2024', dgTitleOne: 'Digat — {d}',
      dgGrpMain: 'Të dhënat kryesore të digave të mëdha dhe rezervuarëve të tyre',
      dgColEmri: 'Emri i digës', dgColVend: 'Vendodhja', dgColH: 'Lartësia e digës (m)', dgColL: 'Gjatësia e kurorës (m)',
      dgColVb: 'Vëllimi i trupit të digës (1000 m³)', dgColVr: 'Vëllimi maks. i ujit në rezervuar (m³)', dgColLumi: 'Lumi / Përroi në aksin e digës',
      dgColLloji: 'Lloji i digës', dgColViti: 'Viti i përfundimit', dgColQell: 'Qëllimi i përdorimit',
      dgCount1: '1 Digë', dgCount: '{n} Diga',
      dgLegend: 'Legjenda', dgLegUse: 'Qëllimi i përdorimit', dgLegType: 'Lloji i digës', dgLegVol: 'Vëllimi i ujit në rezervuar',
      dgMeasured: 'Vëllim i matur', dgDesigned: 'Vëllim i projektuar',
      dgUse_HE: 'Prodhim hidroenergjie', dgUse_U: 'Ujitje', dgUse_FU: 'Furnizim me ujë të pijshëm', dgUse_PV: 'Prodhim diellor',
      dgUse_TR: 'Transport', dgUse_AK: 'Peshkim', dgUse_AU: 'Atraksione urbane dhe turistike',
      dgType_ED: 'Digë dheu', dgType_CGD: 'Digë graviteti prej betoni', dgType_RCC: 'Digë prej betoni të ngjeshur me rul',
      dgType_RDCC: 'Digë guri me bërthamë argjile', dgType_RDGM: 'Digë guri me gjeomembranë', dgType_CFRD: 'Digë guri me fytyrë betoni',
      dgType_RDAC: 'Digë guri me bërthamë asfalti',
      dgAddTitle: 'Shto digë të re',
      dgAddIntro: 'Plotësoni të dhënat sipas kolonave të tabelës, në tre hapa. Fushat me * janë të detyrueshme. Pasi të shtypni «Ruaj digën», diga shfaqet në fund të tabelës më poshtë dhe ruhet në këtë shfletues.',
      dgAddG1: 'Identifikimi', dgAddG2: 'Përmasat dhe rezervuari', dgAddG3: 'Lloji dhe përdorimi',
      dgVolKind: 'Vëllimi i rezervuarit është', dgTypePick: 'Zgjidhni llojin…', dgUseHint: 'Zgjidhni një ose më shumë.',
      dgPhEmri: 'p.sh. Bovilla', dgPhVend: 'p.sh. Tirane', dgPhLumi: 'p.sh. Lumi Terkuze', dgPhViti: 'p.sh. 1985',
      dgAddSave: 'Ruaj digën', dgAddReset: 'Pastro', dgAddDone: 'Diga «{n}» u shtua në fund të tabelës.', dgAddSee: 'Shiko në tabelë',
      dgAddErr: 'Kontrolloni fushat e shënuara me të kuqe.', dgErrReq: 'Kjo fushë është e detyrueshme.',
      dgErrNum: 'Vendosni një numër 0 ose më të madh.', dgErrYear: 'Vendosni një vit ndërmjet 1900 dhe 2100.',
      dgIntTitle: 'Ndërhyrje dhe mirëmbajtje',
      dgIntIntro: 'Regjistroni punimet e kryera në një digë: zgjidhni digën, plotësoni fushat dhe shtypni «Ruaj ndërhyrjen».',
      dgIntDiga: 'Diga', dgIntDigaPick: 'Zgjidhni digën…', dgNew: 'e re',
      dgIntViti: 'Viti', dgIntLloji: 'Lloji i ndërhyrjes', dgIntLlojiPh: 'p.sh. Rikonstruksion',
      dgIntPersh: 'Përshkrimi', dgIntPershPh: 'Çfarë u krye, ku dhe me çfarë rezultati…',
      dgIntVlera: 'Vlera e financimit (Lekë)', dgIntVleraPh: 'p.sh. 2500000', dgIntBurimi: 'Burimi i fondeve', dgIntBurimiPh: 'p.sh. Buxheti i shtetit',
      dgIntTypes: 'Mirëmbajtje e rregullt|Riparim|Rikonstruksion|Rehabilitim|Pastrim i sedimenteve|Inspektim dhe monitorim|Punime emergjente',
      dgIntSources: 'Buxheti i shtetit|Buxheti i bashkisë|Banka Botërore|Donatorë të huaj|Fonde private',
      dgIntSave: 'Ruaj ndërhyrjen', dgIntDone: 'Ndërhyrja u ruajt për digën «{n}».',
      dgIntList: 'Ndërhyrjet e regjistruara', dgIntNone: 'Kjo digë nuk ka ende ndërhyrje të regjistruara.',
      dgIntPickFirst: 'Zgjidhni një digë për të parë ndërhyrjet e saj.', dgIntRemove: 'Hiq ndërhyrjen',
      dgIntTotal: 'Financim gjithsej: {v} Lekë', dgLek: 'Lekë',
      dgErrRows: 'Kontrolloni rreshtat e shënuar me të kuqe: emri, vendodhja dhe lloji janë të detyrueshëm dhe numrat duhet të jenë 0 ose më shumë.',
      skAddRow: '+ Shto skemë', hvAddRow: '+ Shto hidrovor', xlRemove: 'Hiq rreshtin',
      skAddHint: 'Shtypni «+ Shto skemë» poshtë tabelës, plotësoni fushat dhe shtypni «Ruaj» lart djathtas. Skemat e reja ruhen në këtë shfletues.',
      skAddPick: 'Zgjidhni një bashki nga lista «Bashkia» për të shtuar skema.',
      rzAllTitle: 'Skemat ujitëse me burim rezervuar, sipas bashkisë', rzNoData: 'Për bashkinë {m} nuk ka ende skema ujitëse me burim rezervuar.',
      spAllTitle: 'Skemat ujitëse me stacion pompimi, sipas bashkisë', spNoData: 'Për bashkinë {m} nuk ka ende skema ujitëse me stacion pompimi.',
      hvAddHint: 'Shtypni «+ Shto hidrovor» poshtë tabelës, plotësoni fushat dhe shtypni «Ruaj» lart djathtas. Hidrovoret e reja ruhen në këtë shfletues.',
      hvErrRows: 'Kontrolloni rreshtat e shënuar me të kuqe: emri, lloji dhe drejtoria janë të detyrueshme, numrat duhet të jenë 0 ose më shumë dhe elektropompat kryesore jo më shumë se gjithsej.',
      skSave: 'Ruaj', skSelectAll: 'Zgjidh të gjitha rreshtat', skSelectRow: 'Zgjidh rreshtin {r}',
      skEditHint: 'Zgjidhni rreshtat që doni të ndryshoni, plotësoni fushat dhe shtypni «Ruaj» lart djathtas. Ndryshimet ruhen në këtë shfletues.',
      skEditPick: 'Zgjidhni një bashki nga lista «Bashkia» për të përditësuar skemat e saj.',
      skErrRows: 'Kontrolloni rreshtat e shënuar me të kuqe: kodi dhe emërtimi nuk mund të jenë bosh, km duhet të jenë 0 ose më shumë dhe km e përditësuar jo më shumë se kanalet.',
      skSaveFail: 'Ndryshimet nuk u ruajtën: memoria e shfletuesit nuk është e disponueshme.',
      skSaveFailDb: 'Ndryshimet nuk u ruajtën në databazë. Provoni përsëri.',
      skErrDup: 'Ekziston tashmë një skemë me këtë kod dhe emërtim në këtë bashki.',
      skMigrated: 'Ndryshimet e ruajtura më parë në këtë shfletues u kaluan në databazë.',
      astUserName: 'Administratori',
      astRole: 'Ujitje & Kullim',
      ovNoData: 'Nuk ka ende të dhëna',
      astNavAdd: 'Shto aset',
      astFormEdit: 'Ndrysho asetin',
      astFormIntro: 'Fushat me * janë të detyrueshme.',
      astStatDige: 'Diga',
      astStatStacion: 'Stacione pompimi',
      astStatRezervuar: 'Rezervuarë',
      astStatMakineri: 'Makineri',
      astStatAsetet: 'Asetet', astStatStafi: 'Stafi',
      astTypeSkema: 'Skemë ujitëse',
      astTypeHidrovor: 'Hidrovor',
      astStatSkema: 'Skemat ujitëse',
      astStatHidrovor: 'Hidrovoret',
      astSpecCode: 'Kodi i skemës',
      astSpecCodePh: 'p.sh. BRU - 13',
      astSpecCanals: 'Gjatësia e kanaleve',
      astSpecPowerInst: 'Fuqia e instaluar',
      astSpecDrainArea: 'Sipërfaqja që kullon',
      astTypeDige: 'Digë',
      astTypeStacion: 'Stacion pompimi',
      astTypeRezervuar: 'Rezervuar',
      astTypeMakineri: 'Makineri',
      astStFunk: 'Funksional',
      astStPjes: 'Pjesërisht funksional',
      astStJo: 'Jo funksional',
      astColName: 'Emërtimi',
      astColType: 'Lloji',
      astColStatus: 'Gjendja',
      astColSpecs: 'Të dhëna teknike',
      astColYear: 'Viti',
      astColUpdated: 'Përditësuar',
      astColActions: 'Veprime',
      astSearchLbl: 'Kërko asetin',
      astSearchPh: 'Kërko sipas emërtimit…',
      astFilterMuniAll: 'Të gjitha bashkitë',
      portalNvTitle: 'Nevoja e ujit për ujitje',
      portalNvDesc: 'Nevoja mujore për ujitje sipas kulturës dhe zonës',
      nvPanelPlan: 'Planifikim sezonal',
      pdPanel: 'Përditësimi i të dhënave',
      znTitle: 'Zonat agroklimatike',
      kbTitle: 'Kulturat e bashkisë',
      opTitle: 'Mjeshtri i ujit',
      pkTitle: 'Koeficientët e kulturave',
      nvTitle: 'Nevoja e ujit për ujitje',
      nvLead: 'Nevoja mujore për ujitje e çdo kulture (mm), sipas zonës. 1 mm ujë mbi 1 ha = 10 m³.',
      nvSheet: 'Nevoja për ujitje sipas muajve',
      nvColCrop: 'Kultura', nvColGroup: 'Grupi',
      nvColYear: 'Nevoja vjetore', nvColMm: 'mm', nvColM3: 'm³/ha',
      nvMonthsHead: 'Nevoja për ujitje sipas muajve (mm)', nvScaleMax: '100+ mm',
      nvZoneLbl: 'Zona',
      nvZ_kombetare: 'Mesatare kombëtare',
      nvZ_zona1: '1. Zona bregdetare dhe Ultësira Perëndimore',
      nvZ_zona2: '2. Zona qendrore dhe kodrinore',
      nvZ_zona3: '3. Zona jugore dhe jugperëndimore',
      nvZ_zona4: '4. Zona verilindore dhe malore',
      nvNoData: 'Pa të dhëna për këtë zonë',
      nvExcelTotal: 'Në Excel totali është {n} mm; këtu tregohet shuma e muajve.',
      nvNoteLbl: 'Shënim',
      nvEdit: 'Modifiko', nvCancel: 'Anulo', nvSave: 'Ruaj', nvExport: 'Eksporto CSV',
      nvEditHint: 'Shkruani nevojën në mm për çdo muaj; totali llogaritet vetë. Me ⊕ shtoni një kulturë në grup.',
      nvAddCrop: 'Shto kulturë', nvNewCrop: 'Emërtimi i kulturës', nvDelCrop: 'Hiq kulturën',
      nvErrRows: 'Kontrolloni rreshtat e shënuar me të kuqe: emërtimi nuk mund të jetë bosh dhe vlerat duhet të jenë 0 ose më shumë.',
      nvSaved: 'Ndryshimet u ruajtën.',
      nvSelHint: 'Klikoni një muaj me vlerë për të zgjedhur sezonin e kulturës, ose tërhiqni mbi disa muaj; pastaj tërhiqeni zgjedhjen majtas ose djathtas.',
      nvMoveHint: 'Tërhiqeni zgjedhjen në muajt e tjerë, ose përdorni ◀ ▶ (edhe shigjetat e tastierës). Esc e heq zgjedhjen.',
      nvSelLbl: 'Muajt e zgjedhur', nvShiftPrev: 'Një muaj më herët', nvShiftNext: 'Një muaj më vonë', nvSelClear: 'Hiq zgjedhjen',
      nvLocTitle: 'Vendndodhja', nvQarkLbl: 'Qarku', nvBashkiLbl: 'Bashkia', nvNjesiLbl: 'Njësia administrative',
      nvLocMany: 'Kjo vendndodhje përfshin {n} zona; zgjidhni bashkinë ose njësinë administrative:',
      nvColReq: 'Kërkesa', nvColHa: 'ha', nvColReqM3: 'm³', nvFootReq: 'Kërkesa gjithsej (m³)',
      nvHaLbl: '{c}: sipërfaqja (ha)',
      kfNav: 'Formulari i kërkesës',
      kfTitle: 'Formulari i kërkesës për ujitje',
      kfLead: 'Regjistroni nevojën për ujitje për çdo parcelë dhe kulturë. Kërkesa kalon: Draft → Dorëzuar → Verifikuar → Pranuar, Pjesërisht ose Refuzuar.',
      kfList: 'Lista e kërkesave', kfNew: 'Kërkesë e re', kfNewTitle: 'Kërkesë e re', kfTitleOf: 'Kërkesa {id}',
      kfSt_draft: 'Draft', kfSt_dorezuar: 'Dorëzuar', kfSt_verifikuar: 'Verifikuar', kfSt_vendim: 'Vendimi',
      kfSt_pranuar: 'Pranuar', kfSt_pjeserisht: 'Pjesërisht', kfSt_refuzuar: 'Refuzuar', kfStAll: 'Të gjitha',
      kfStD_draft: 'Plotësohet dhe ruhet', kfStD_dorezuar: 'Pret verifikimin', kfStD_verifikuar: 'Pret vendimin', kfStD_vendim: 'Pranuar, pjesërisht ose refuzuar',
      kfStD_pranuar: 'I gjithë volumi u pranua', kfStD_pjeserisht: 'U pranua një pjesë e volumit', kfStD_refuzuar: 'Kërkesa u refuzua',
      kfStepsLbl: 'Hapat e kërkesës',
      kfSearchPh: 'Kërko sipas nr., parcelës, fermerit ose kulturës…',
      kfColNr: 'Nr.', kfColViti: 'Viti', kfColVend: 'Bashkia / njësia', kfColParcela: 'Parcela', kfColFermeri: 'Fermeri', kfColKultura: 'Kultura',
      kfColHa: 'Ujitje (ha)', kfColBruto: 'Volumi bruto (m³)', kfColMiratuar: 'Volumi i pranuar (m³)', kfColStatus: 'Statusi', kfColUpd: 'Përditësuar', kfColTot: 'Totali',
      kfEmpty: 'Nuk ka ende kërkesa.', kfNoMatch: 'Asnjë kërkesë nuk përputhet me filtrin.',
      kfSecA: 'Identifikimi territorial', kfSecB: 'Të dhënat e kulturës', kfSecC: 'Nevoja dhe volumi i ujit', kfSecD: 'Verifikimi dhe vendimi',
      kfReqNote: 'Fushat me * janë të detyrueshme për dorëzim; drafti mund të ruhet edhe i paplotë.',
      kfLockedNote: 'Kërkesa është dorëzuar: të dhënat e saj nuk ndryshojnë më. Për korrigjime, verifikuesi e kthen në draft.',
      kfF_viti: 'Viti bujqësor', kfF_njesia: 'Njësia administrative', kfF_fshati: 'Fshati / zona kadastrale', kfF_skema: 'Skema e ujitjes',
      kfF_parcela: 'Kodi i parcelës (referencë GIS)', kfF_fermeri: 'Fermeri / subjekti bujqësor', kfF_kultura: 'Kultura bujqësore',
      kfF_supParcela: 'Sipërfaqja e parcelës (ha)', kfF_supKult: 'Sipërfaqja e kultivuar (ha)', kfF_supUjitje: 'Sipërfaqja për ujitje (ha)',
      kfF_data: 'Data e mbjelljes / fillimit të sezonit', kfF_sistemi: 'Sistemi i ujitjes', kfF_burimi: 'Burimi i ujit', kfF_eff: 'Efikasiteti i ujitjes (%)',
      kfF_nevoja: 'Nevoja mujore neto (mm)', kfF_miratuar: 'Volumi i pranuar (m³)', kfF_shenim: 'Shënim / arsyeja',
      kfOneOf: 'një nga vlerat',
      kfPickNjesi: 'Zgjidhni njësinë', kfPickKultura: 'Zgjidhni kulturën',
      kfPhParcela: 'p.sh. 3317-045-12', kfPhFermeri: 'Emri, NIPT ose NID', kfPhSkema: 'Zgjidhni ose shkruani',
      kfSys_gravitet: 'Kanal i hapur / gravitet', kfSys_shi: 'Shi artificial', kfSys_pike: 'Pikë-pikë', kfSys_pompim: 'Pompim',
      kfSrc_rezervuar: 'Rezervuar', kfSrc_lume: 'Lumë', kfSrc_kanal: 'Kanal kryesor', kfSrc_pus: 'Pus / burim nëntokësor', kfSrc_tjeter: 'Tjetër',
      kfHintSkema: '{n} skema të regjistruara në këtë bashki.', kfHintParcela: 'Identifikues unik: një kërkesë për parcelë, kulturë dhe vit.',
      kfHintKultura: 'Kulturat që bashkia ka zgjedhur te «Kulturat e bashkisë».', kfPickNjesiFirst: 'Zgjidhni fillimisht njësinë', kfLoading: 'Duke ngarkuar…', kfNoParams: 'pa parametra në zonë', kfHintData: 'Brenda vitit bujqësor: {a} – {b}.', kfHintDataOpt: 'Për pemëtoret dhe vreshtat është opsionale.',
      kfHintSupParcela: 'Më e madhe se zero.', kfHintSupKult: 'Jo më shumë se sipërfaqja e parcelës.', kfHintSupUjitje: 'Jo më shumë se sipërfaqja e kultivuar.',
      kfHintEff: 'Intervali teknik për «{s}»: {a}–{b}%.', kfHintEffPick: 'Zgjidhni sistemin e ujitjes për intervalin teknik.',
      kfHintMiratuar: 'Për pranim të pjesshëm: më pak se volumi bruto i kërkuar ({n} m³). «Pranuar» pranon të gjithë volumin.',
      kfHintNote: 'E detyrueshme kur kërkesa kthehet, pranohet pjesërisht ose refuzohet.',
      kfZone: 'Zona orientuese', kfZoneNone: 'Zgjidhni njësinë administrative për të gjetur zonën orientuese.',
      kfHintNjesi: 'Bashkia plotësohet vetë sipas njësisë.',
      kfRowNeto: 'Nevoja neto (mm)', kfRowBruto: 'Volumi bruto (m³)',
      kfCalcNote: 'Volumi bruto = nevoja neto × 10 × sipërfaqja për ujitje ÷ efikasiteti (përfshin humbjet). Nevoja neto merret nga tabela «Nevoja e ujit për ujitje» për zonën e njësisë.',
      kfCalcEditNote: 'Verifikuesi mund ta korrigjojë nevojën neto para se ta verifikojë.',
      kfSaveDraft: 'Ruaj si draft', kfSubmit: 'Dorëzo kërkesën', kfVerify: 'Verifiko', kfReturn: 'Kthe për korrigjim', kfReject: 'Refuzuar', kfAccept: 'Pranuar', kfPartial: 'Pjesërisht',
      kfPopVolHint: 'Më pak se {n} m³ (volumi bruto i kërkuar).',
      kfChangeSt: 'Ndrysho statusin', kfConfirm: 'Konfirmo', kfCancel: 'Anulo', kfToDraft: 'Kthe në draft për korrigjim', kfBack: 'Kthehu te lista',
      kfResOk: 'U pranua i gjithë volumi i kërkuar: {b} m³.', kfResPart: 'U pranuan {a} m³ nga {b} m³ të kërkuara ({p}%).', kfResNo: 'Kërkesa u refuzua.',
      kfHistory: 'Historiku',
      kfMsgSaved: 'Drafti {id} u ruajt.', kfMsgSubmitted: 'Kërkesa {id} u dorëzua.', kfMsgVerified: 'Kërkesa {id} u verifikua.',
      kfMsgReturned: 'Kërkesa {id} u kthye në draft për korrigjim.', kfMsgRejected: 'Kërkesa {id} u refuzua.', kfMsgAccepted: 'Kërkesa {id} u pranua.', kfMsgPartial: 'Kërkesa {id} u pranua pjesërisht.',
      kfMsgErrors: 'Kërkesa nuk mund të vazhdojë: kontrolloni {n} fushat më poshtë.',
      kfE_req: 'Fusha është e detyrueshme.', kfE_year: 'Vendosni një vit të vlefshëm ({a}–{b}).',
      kfE_njesia: 'Zgjidhni njësinë nga regjistri.', kfE_parcelaDup: 'Kjo parcelë ka tashmë kërkesën {id} për këtë kulturë dhe vit.',
      kfE_kultura: 'Zgjidhni një nga kulturat e bashkisë.', kfE_noNeed: 'Kjo kulturë nuk ka ende parametra (fazat, Kc, muaji i mbjelljes) në zonën e njësisë; plotësohen te «Nevoja e ujit për ujitje».',
      kfE_pos: 'Duhet të jetë më e madhe se zero.', kfE_gtParcela: 'Nuk mund të tejkalojë sipërfaqen e parcelës ({n} ha).', kfE_gtKult: 'Nuk mund të tejkalojë sipërfaqen e kultivuar ({n} ha).',
      kfE_date: 'Data duhet të jetë brenda vitit bujqësor ({a} – {b}).', kfE_eff: 'Efikasiteti duhet të jetë {a}–{b}%.',
      kfE_neg: 'Plotësoni të 12 muajt; vlerat nuk mund të jenë negative.', kfE_miratuar: 'Për pranim të pjesshëm, volumi duhet të jetë mbi 0 dhe më pak se {n} m³.', kfE_note: 'Shkruani arsyen.',
      nvM1: 'Janar', nvM2: 'Shkurt', nvM3: 'Mars', nvM4: 'Prill', nvM5: 'Maj', nvM6: 'Qershor',
      nvM7: 'Korrik', nvM8: 'Gusht', nvM9: 'Shtator', nvM10: 'Tetor', nvM11: 'Nëntor', nvM12: 'Dhjetor',
      astFilterTypeAll: 'Të gjitha llojet',
      astCount: '{n} nga {total} asete',
      astEmpty: 'Nuk ka ende asete të regjistruara.',
      astNoMatch: 'Asnjë aset nuk përputhet me filtrat.',
      astEdit: 'Ndrysho',
      astDelete: 'Fshi',
      astDeleteConfirm: 'Ta fshini asetin "{n}"?',
      astDeleted: 'Aseti u fshi.',
      astSecGeneral: 'Të dhënat e përgjithshme',
      astSecTech: 'Të dhënat teknike',
      astFldType: 'Lloji i asetit',
      astTypePh: 'Zgjidhni llojin…',
      astStatusPh: 'Zgjidhni gjendjen…',
      astFldYear: 'Viti i ndërtimit / prodhimit',
      astYearPh: 'p.sh. 1985',
      astSpecHint: 'Zgjidhni llojin e asetit për të plotësuar të dhënat teknike.',
      astSpecHeight: 'Lartësia',
      astSpecLength: 'Gjatësia',
      astSpecCap: 'Kapaciteti',
      astSpecPower: 'Fuqia',
      astSpecVol: 'Vëllimi',
      astSpecArea: 'Sipërfaqja që ujit',
      astSpecKind: 'Lloji i makinerisë',
      astSpecKindPh: 'p.sh. Ekskavator',
      astSpecPlate: 'Targa / Nr. identifikimi',
      astSpecPlatePh: 'p.sh. AA 123 BB',
      astNotes: 'Shënime',
      astSave: 'Ruaj asetin',
      astCancel: 'Anulo',
      astErrReq: 'Kjo fushë është e detyrueshme.',
      astErrYear: 'Vendosni një vit të vlefshëm (1900 deri sot).',
      navBack: 'Shërbimet',
      repTitle: 'Statistika mbi ujitjen',
      docTabField: 'Të dhëna nga terreni', docTabReview: 'Në vlerësim',
      docTabApproved: 'Të miratuara', docTabPublished: 'Të publikuara',
      emptyStep1: 'Hapi 1 nga 4', emptyStep2: 'Hapi 2 nga 4', emptyStep3: 'Hapi 3 nga 4', emptyStep4: 'Hapi 4 nga 4',
      emptyField: 'Këtu shfaqen të dhënat e mbledhura në terren. Ato ruhen përkohësisht derisa të kalojnë për vlerësim.',
      emptyReview: 'Këtu shfaqen të dhënat që ekspertët e bashkisë po i vlerësojnë dhe, nëse duhet, i korrigjojnë.',
      emptyApproved: 'Këtu shfaqen të dhënat e aprovuara nga eksperti pas vlerësimit, gati për t’u publikuar.',
      emptyPublished: 'Këtu shfaqen të dhënat e publikuara në bazën e të dhënave, të aksesueshme për përdoruesit.',
      emptyMakineri: 'Këtu do të shfaqen makineritë dhe mjetet e mirëmbajtjes në pronësi të bashkisë, sapo të regjistrohen.',
      emptyAsetet: 'Këtu do të shfaqen asetet e tjera të ujitjes dhe kullimit në pronësi të bashkisë, sapo të regjistrohen.',
      emptyStafi: 'Këtu do të shfaqet stafi i bashkisë që merret me ujitjen dhe kullimin, sapo të regjistrohet.',
      flowStep1: 'Të dhënat e mbledhura nga terreni (ruhen në një DB provizore)',
      flowStep2: 'Të dhënat vlerësohen nga ekspertët në Bashki',
      flowStep3: 'Pas vlerësimit/korrigjimit të mundshëm aprovohen nga eksperti',
      flowStep4: 'Përfundimisht të dhënat publikohen në DB dhe janë të aksesueshme',
      muniAll: 'Të gjitha',
      tblCaption: 'Skemat ujitëse në pronësi të bashkive, sipas qarqeve',
      tblMuni: 'Bashkia', tblQark: 'Qarku',
      tblSchemes: 'Skema ujitëse', tblSources: 'Burime ujore',
      tblKm: 'Kanale I dhe II (km)',
      tblFunc: 'Funksional', tblPartFunc: 'Pjesërisht funksional',
      tblNonFunc: 'Jo funksional', tblNoInfo: 'Pa info',
      tblTotal: 'Totali', tblEmpty: 'Nuk u gjet asnjë bashki.',
      totEyebrow: 'Gjithsej në vend', totTitle: '46 bashki',
      plEyebrow: 'Inventari i skemave',
      plgSchemes: 'Skema Ujitëse', plgSource: 'Burimi Ujor',
      plgCanals: 'Kanale të Para dhe të Dyta në Km', plgNr: 'Nr.',
      plgField: 'Identifikuar në Teren', plgUpdated: 'Përditësuar',
      plgCode: 'Kodi', plgName: 'Emërtimi',
      plgSecFull: 'Skema të plota të transferuara', plgSecPartial: 'Skema të pjesërisht të transferuara',
      plgSchemeOne: 'Skemë', plgSchemeMany: 'Skema',
      totHint: 'Klikoni një bashki në hartë për të parë të dhënat e saj.',
      totCover: 'Statusi i kanaleve: të dhëna për 30 nga 46 bashki.',
      muniHint: 'Klikoni sërish bashkinë për t’u kthyer te totalet.',
      muniNoData: 'Për këtë bashki nuk ka ende të dhëna për statusin e kanaleve.',
      totDonutTitle: 'Kanalet sipas statusit, në gjithë vendin',
      totDonutDesc: 'Funksional 33.4%, pjesërisht funksional 24.8%, jo funksional 20.2%, pa info 21.6%.',
      mapSvgTitle: 'Harta e Shqipërisë me 46 bashkitë',
      mapSvgDesc: 'Kufijtë e 46 bashkive. Klikoni një bashki për të parë statistikat e saj.',
      cnlChartTitle: 'Ndarja e kanaleve ujitëse sipas statusit',
      cnlChartDesc: 'Funksional 44.37%, pjesërisht funksional 25.71%, jo funksional 20.87%, pa info 9.05%.',
      regTitle: 'Krijo llogari',
      regNote: 'Llogaritë e reja marrin rolin “Vëzhgues”.',
      regSubmit: 'Krijo llogarinë',
      regAlt: 'Keni llogari?',
      fldUser: 'Përdoruesi ose email', fldPass: 'Fjalëkalimi',
      fldRemember: 'Më mbaj mend', fldName: 'Emri', fldSurname: 'Mbiemri',
      fldEmail: 'Email', fldMuni: 'Bashkia', fldMuniPick: 'Zgjidhni bashkinë',
      fldPassHint: 'Të paktën 8 karaktere, me një shkronjë të madhe, një të vogël, një shifër dhe një simbol.',
      authBack: 'Kthehu te faqja kryesore',
      asideTitle: 'Akses i plotë në të dhënat e rrjetit',
      perk1: 'Shfletuesi i plotë WebGIS me pemën e shtresave',
      perk2: 'Raportet e mirëmbajtjes dhe ndërhyrjeve',
      perk3: 'Të dhëna sipas bashkisë dhe skemës ujitëse',
      asideTitleReg: 'Regjistrohu për akses institucional',
      perkR1: 'Llogaritë verifikohen nga njësia përgjegjëse',
      perkR2: 'Roli fillestar: Vëzhgues, me akses në shtresat bazë',
      perkR3: 'Ngritje e roleve nga administratori i sistemit',
      asideFoot: 'Ministria e Bujqësisë dhe Zhvillimit Rural',
      fldUsername: 'Përdoruesi', fldFullName: 'Emri i plotë',
      fldOrg: 'Organizata / Bashkia', fldConfirm: 'Konfirmo fjalëkalimin',
      heroTitle: 'Sistemi i Informacionit për Menaxhimin e Ujitjes dhe Kullimit',
      heroLead: 'Platformë gjeohapësinore për planifikimin, monitorimin dhe mirëmbajtjen e infrastrukturës së ujitjes dhe kullimit.',
      footParent: 'Ministria e Bujqësisë dhe Zhvillimit Rural',
      footName: 'Sistemi i Menaxhimit të Ujitjes dhe Kullimit',
      footBlurb: 'Ngritur në zbatim të legjislacionit për ujitjen dhe kullimin e tokave bujqësore.',
      footLblPhone: 'Tel', footLblEmail: 'Email', footLblAddr: 'Adresa',
      toTop: 'Kthehu lart',
      footC1: 'Shërbime', footC2: 'Kontakt', footC3: 'Institucioni',
      footLaw: 'Baza ligjore',
      footTransparency: 'Programi i transparencës',
      footPrivacy: 'Politika e privatësisë',
      footAddr: 'Tiranë, Shqipëri',
      footRights: 'Përmbajtja është informacion publik.'
    },
    en: {
      skip: 'Skip to content',
      brandSub1: 'Irrigation & Drainage',
      brandSub2: 'Management Information System',
      navMap: 'Public map',
      navLogin: 'Sign in', navRegister: 'Register',
      statsTitle: 'The network in figures',
      statSchemesLbl: 'Irrigation schemes',
      statCanalsLbl: 'Irrigation canals I, II & III',
      statIrrigAreaLbl: 'Irrigable area',
      statDrainableAreaLbl: 'Drainable area',
      statDrainSchemesLbl: 'Drainage schemes',
      statDrainCanalsLbl: 'Drainage canals I, II & III',
      statDrainAreaLbl: 'Drainage area',
      statMuniLbl: 'Municipalities covered', statMuniUnit: 'of 46',
      unitKm: 'km', unitHa: 'ha',
      mapEyebrow: 'Public map',
      mapTitle: 'Irrigation infrastructure on the map',
      mapLead: 'Open without an account. Click the map to query the data behind any feature.',
      layIrrig: 'Irrigation canals', layDrain: 'Drainage canals',
      layRes: 'Reservoirs', layMuni: 'Municipal boundaries',
      mapBtn: 'Open the public map',
      mapTag: 'idmis.gis.al',
      loginTitle: 'Sign in',
      loginNote: 'Use the credentials of your institutional account.',
      loginForgot: 'Forgotten your password?',
      loginSubmit: 'Sign in',
      loginAlt: 'No account yet?',
      loginBusy: 'Signing in…',
      loginErrEmpty: 'Enter your username or email and your password.',
      loginErrInvalid: 'The username or password is incorrect.',
      loginErrInactive: 'This account has been deactivated. Contact the administrator.',
      loginErrLocked: 'Too many failed attempts. Try again in 15 minutes.',
      loginErrServer: 'Sign-in failed because of a server error. Try again.',
      loginErrOffline: 'The IDMIS server is not responding. Close IDMIS and open it again.',
      logout: 'Sign out',
      logoutTitle: 'Sign out of the system',
      pmSettings: 'Settings', pmHelp: 'Help', pmOpen: 'open the account menu',
      portalSignedIn: 'Signed in as',
      roleADMINISTRATOR: 'Administrator',
      roleOPERATOR_BASHKIE: 'Municipal operator',
      roleSPECIALIST: 'Specialist',
      portalEyebrow: 'IDMIS services',
      toastOkTitle: 'Saved successfully',
      toastErrTitle: 'Action not completed',
      toastClose: 'Dismiss notification',
      loadingData: 'Loading data…',
      skSaved: 'Changes saved.',
      portalTitle: 'Welcome',
      portalNote: 'Choose one of the services below to continue.',
      portalAsideTitle: 'Choose the service you need',
      portalPerk1: 'Interactive map with the full layer tree',
      portalPerk2: 'Reports generated from the central registry',
      portalPerk3: 'Statistics by municipality and irrigation scheme',
      portalMapTitle: 'Map',
      portalMapDesc: 'Canals, reservoirs and schemes on the map',
      portalRepTitle: 'Statistics',
      portalRepDesc: 'Irrigation and drainage network indicators',
      portalAdminTitle: 'Data management',
      portalAdminDesc: 'Review and publish GIS data',
      portalUpdTitle: 'Data updating',
      portalUpdDesc: 'Agro-climatic zones and the crops of each municipality',
      portalAstDesc: 'Dams, pumping stations, reservoirs and municipal machinery',
      portalNewTab: '(opens in a new window)',
      navGisReview: 'GIS information review and publishing',
      navDataUpdate: 'Data updating',
      tarTitle: 'Irrigation and drainage tariffs',
      tarUnitLbl: 'Unit',
      tarUnit: 'ALL/dynym',
      tarG1: 'Annual maintenance tariff',
      tarG1a: 'Irrigation',
      tarG1b: 'Drainage',
      tarG2: 'Irrigation service tariff',
      tarG2a: 'Open canal with free (gravity) flow',
      tarG2b: 'Closed system, pipelines',
      tarG2c: 'Individual private pumps',
      tarEmptyTitle: 'Not set',
      tarMuniTitle: 'Tariffs by municipality',
      tarPageLead: 'Irrigation and drainage tariffs for each of the 46 municipalities.',
      tarMapDesc: 'Boundaries of the 46 municipalities. Click a municipality to see its tariffs.',
      tarLgSet: 'Tariffs set',
      tarLgUnset: 'No tariffs set',
      tarFigSet: 'Tariffs set',
      tarFigUnset: 'No tariffs set',
      tarPanelHint: 'Click a municipality on the map to see its tariffs.',
      tarPanelBack: 'Click the municipality again to return to the totals.',
      frmIntro: 'Choose a municipality and fill in the tariffs. Empty fields stay unset.',
      frmMuniPh: 'Choose a municipality…',
      frmLockHint: 'Choose a municipality to fill in the tariffs.',
      frmSave: 'Save tariffs',
      frmReset: 'Clear',
      frmErrMuni: 'Choose a municipality.',
      frmErrNum: 'Enter a number of 0 or more.',
      frmSaved: 'The data was saved successfully.',
      frmViewLink: 'View on the tariffs page →',
      frmSaveFail: 'Could not save: this browser does not allow storing data.',
      tarUpdated: 'Updated {d}',
      astTitle: 'Irrigation & Drainage asset register',
      astSubSkema: 'Register of irrigation schemes: code, irrigated area and canal length.',
      astSubDige: 'National register of large dams: dimensions, reservoirs, technology, purpose and location.',
      astSubStacion: 'Irrigation pumping stations: capacity, power and technical condition.',
      astSubHidrovor: 'Drainage pumping stations: capacity, installed power and the area they drain.',
      astSubRezervuar: 'Water reservoirs: storage volume and the area they irrigate.',
      astSubMakineri: 'Maintenance machinery and vehicles owned by the municipality.',
      astActAdd: 'Add',
      astActUpdate: 'Update',
      astActMap: 'View on map',
      msMuniSearch: 'Search municipality or county…',
      skAllTitle: 'Irrigation schemes by municipality',
      skNoData: 'There is no irrigation scheme data for {m} yet.',
      skStatSkema: 'Schemes', skStatKm: 'Canals in km', skStatUpd: 'Updated km',
      skTblFull: 'Fully transferred schemes', skTblPartial: 'Partially transferred schemes',
      skColNr: 'No.', skColSkema: 'Irrigation Scheme', skColKodi: 'Code', skColEm: 'Name', skColBurimi: 'Water Source',
      skColKm: 'Primary and Secondary Canals in km', skColKm2: 'Secondary Canals Only in km',
      skColTeren: 'Identified in the Field', skColUpd: 'Updated', skColUpdMe: 'Last updated',
      skYes: 'Yes', skTotal: 'Total', skCount1: '1 Scheme', skCount: '{n} Schemes',
      skColKmShort: 'Canals in km',
      fmTitle: 'Form F01-03 · Scheme Inventory', fmColF: 'F01-03', fmColStatus: 'Status',
      fmSaved: 'Saved {d} by {u}', fmNew: 'The form has not been filled in yet.',
      fmLoading: 'Loading the form…', fmLoadFail: 'The form could not be loaded.',
      fmOpen: 'Open form F01-03 — {s}', fmFilled: 'Form F01-03 is filled in', fmNotFilled: 'Form F01-03 is not filled in',
      fmS1: 'Identification', fmS2: 'Areas and farmers', fmS3: 'Water source and infrastructure', fmS4: 'Condition and documentation',
      fmEdit: 'Edit form', fmCancel: 'Cancel', fmSave: 'Save', fmClose: 'Close',
      fmDirty: 'You have unsaved changes in the form.', fmDiscard: 'Discard changes', fmKeep: 'Keep editing',
      fmSavedOk: 'The form was saved.', fmReadOnly: 'The form can be changed by an administrator or the municipality operator.',
      fmLegend: 'Data status codes', fmLgSub: 'Every field of the form takes one of these codes.', fmLgExLbl: 'Documentation:', fmLgHead: 'Code|Status|Definition|Examples of supporting documentation',
      fmLgDef: 'Based on direct measurement or verified records|Taken from official or technical documents|Based on a documented estimation method|The information is missing or cannot be verified at present|The field does not apply to this case',
      fmLgEx: 'Field measurements, meter readings|Inventory, map, approved plan|Technical assessment, calculation|Explanation of why the information is missing|Reason it does not apply',
      fmKodiTransf: 'Transferred scheme code', fmKodiRi: 'New code (set by the municipality)', fmViti: 'Year', fmNoUnits: 'The municipality has no administrative units in the database.',
      fmL1: 'Municipality code', fmL2: 'Irrigation scheme code', fmL3: 'Irrigation scheme name', fmL4: 'Administrative unit(s) covered',
      fmL5: 'Scheme type', fmL6: 'Responsible operator', fmL7: 'Operator code, if any', fmL8: 'Irrigable area',
      fmL9: 'Serviceable area', fmL10: 'Area actually irrigated', fmL11: 'Number of farmers/users in the scheme',
      fmL12: 'Number of farmers/users served', fmL13: 'Main water source', fmL14: 'Is the main water intake functional?',
      fmL15: 'Is the main conveyance network functional?', fmL16: 'Is the distribution network functional?', fmL17: 'Total number of pumping stations',
      fmL18: 'Number of functional pumping stations', fmL19: 'Overall condition of the scheme', fmL20: 'Latest infrastructure assessment',
      fmL21: 'Main operating problems', fmL22: 'Documentation source/reference', fmL23: 'Data status', fmL24: 'Additional comments',
      fmU1: 'Existing code', fmU2: 'Official / IDMIS code', fmU3: 'Text', fmU4: 'Name', fmU6: 'Name', fmU7: 'Existing code', fmUha: 'ha', fmUhaVit: 'ha/year',
      fmUnr: 'number', fmUnrVit: 'number/year', fmU20: 'Year / Date', fmUtekst: 'Text', fmU22: 'Document name / Reference',
      fmO_lloji: 'Gravity|Pumped|Mixed|Other', fmO_burimi: 'River|Reservoir|Canal|Groundwater|Other',
      fmO_funk: 'Yes|Partly|No|Unknown', fmO_gjendja: 'Functional|Partly functional|Not functional|Unknown',
      fmO_statusi: 'Measured|Documented|Estimated|Unknown|Not applicable', fm20Ph: 'e.g. 2025 or 2025-06-30',
      fmErrStatus: 'Choose the status of this value (M, D, V, PZ or PZB).',
      fmErrYear: 'Enter the year.', fmErrMax: 'Cannot be larger than field {m}.',
      fmErrValue: 'The value is not valid.', fmErrSave: 'The form was not saved. Please try again.',
      fmErrScope: 'You can only save forms of your own municipality.',
      fmOpManage: 'Open “Water master”', fmOpNone: 'The municipality has no operators yet.', fmOpOff: 'inactive',
      fmErrOpOff: 'This operator is no longer active.',
      hvTitleAll: 'Drainage pumping stations by Irrigation and Drainage Directorate', hvTitleOne: 'Drainage pumping stations — {d} Irrigation and Drainage Directorate',
      hvDrejtoriaShort: 'Directorate', hvAllDrejtori: 'All directorates',
      hvColEmri: 'Name', hvColLloji: 'Type', hvColVendodhja: 'Location', hvColDrejtoria: 'Irrigation and Drainage Directorate',
      hvColHa: 'Drained Area (ha)', hvColKap: 'Design Capacity (m³/s)', hvColKw: 'Installed Power (kW)',
      hvColElp: 'Electric Pumps', hvColElpAll: 'Total', hvColElpMain: 'Main',
      hvColNen: 'Supply Substation', hvColNenEmri: 'Name', hvColNenVend: 'Location',
      hvColLinja: 'Supply Lines', hvColShenim: 'Note', hvNoteShow: 'Show', hvNoteHide: 'Hide',
      hvUnknown: 'Unknown', hvCount1: '1 Station', hvCount: '{n} Stations',
      dgLocShort: 'Location', dgAllLoc: 'All locations',
      dgTitleAll: 'National register of large dams by height (H), 2024', dgTitleOne: 'Dams — {d}',
      dgGrpMain: 'Main data of large dams and their reservoirs',
      dgColEmri: 'Name of dam', dgColVend: 'Location', dgColH: 'Height of dam (m)', dgColL: 'Length of dam crest (m)',
      dgColVb: 'Volume of dam body (1000 m³)', dgColVr: 'Max. water volume of reservoir (m³)', dgColLumi: 'River / Stream of dam axis',
      dgColLloji: 'Type of dam', dgColViti: 'Completion year', dgColQell: 'Purpose of use',
      dgCount1: '1 Dam', dgCount: '{n} Dams',
      dgLegend: 'Legend', dgLegUse: 'Purpose of use', dgLegType: 'Type of dam', dgLegVol: 'Water volume of reservoir',
      dgMeasured: 'Measured volume', dgDesigned: 'Designed volume',
      dgUse_HE: 'Hydroenergy production', dgUse_U: 'Irrigation', dgUse_FU: 'Drinking water supply', dgUse_PV: 'Solar production',
      dgUse_TR: 'Transport', dgUse_AK: 'Fishing', dgUse_AU: 'Urban and tourist attractions',
      dgType_ED: 'Embankment dam', dgType_CGD: 'Concrete gravity dam', dgType_RCC: 'Roller compacted concrete dam',
      dgType_RDCC: 'Rockfill dam with clay core', dgType_RDGM: 'Rockfill dam with geomembrane', dgType_CFRD: 'Concrete-faced rockfill dam',
      dgType_RDAC: 'Rockfill dam with asphalt core',
      dgAddTitle: 'Add a new dam',
      dgAddIntro: 'Fill in the data following the table columns, in three steps. Fields marked * are required. After you press «Save dam», the dam appears at the end of the table below and is saved in this browser.',
      dgAddG1: 'Identification', dgAddG2: 'Dimensions and reservoir', dgAddG3: 'Type and use',
      dgVolKind: 'The reservoir volume is', dgTypePick: 'Choose the type…', dgUseHint: 'Choose one or more.',
      dgPhEmri: 'e.g. Bovilla', dgPhVend: 'e.g. Tirane', dgPhLumi: 'e.g. Lumi Terkuze', dgPhViti: 'e.g. 1985',
      dgAddSave: 'Save dam', dgAddReset: 'Clear', dgAddDone: 'The dam «{n}» was added at the end of the table.', dgAddSee: 'View in table',
      dgAddErr: 'Check the fields marked in red.', dgErrReq: 'This field is required.',
      dgErrNum: 'Enter a number of 0 or more.', dgErrYear: 'Enter a year between 1900 and 2100.',
      dgIntTitle: 'Interventions and maintenance',
      dgIntIntro: 'Record the works carried out on a dam: choose the dam, fill in the fields and press «Save intervention».',
      dgIntDiga: 'Dam', dgIntDigaPick: 'Choose the dam…', dgNew: 'new',
      dgIntViti: 'Year', dgIntLloji: 'Type of intervention', dgIntLlojiPh: 'e.g. Reconstruction',
      dgIntPersh: 'Description', dgIntPershPh: 'What was done, where and with what result…',
      dgIntVlera: 'Funding amount (ALL)', dgIntVleraPh: 'e.g. 2500000', dgIntBurimi: 'Source of funds', dgIntBurimiPh: 'e.g. State budget',
      dgIntTypes: 'Routine maintenance|Repair|Reconstruction|Rehabilitation|Sediment removal|Inspection and monitoring|Emergency works',
      dgIntSources: 'State budget|Municipal budget|World Bank|Foreign donors|Private funds',
      dgIntSave: 'Save intervention', dgIntDone: 'The intervention was saved for the dam «{n}».',
      dgIntList: 'Recorded interventions', dgIntNone: 'No interventions recorded for this dam yet.',
      dgIntPickFirst: 'Choose a dam to see its interventions.', dgIntRemove: 'Remove intervention',
      dgIntTotal: 'Total funding: {v} ALL', dgLek: 'ALL',
      dgErrRows: 'Check the rows marked in red: name, location and type are required and numbers must be 0 or more.',
      skAddRow: '+ Add scheme', hvAddRow: '+ Add station', xlRemove: 'Remove row',
      skAddHint: 'Press “+ Add scheme” below the table, fill in the fields and press “Save” at the top right. New schemes are kept in this browser.',
      skAddPick: 'Choose a municipality from the “Municipality” list to add schemes.',
      rzAllTitle: 'Irrigation schemes fed by reservoirs, by municipality', rzNoData: 'There are no reservoir-fed irrigation schemes for {m} yet.',
      spAllTitle: 'Irrigation schemes with pumping stations, by municipality', spNoData: 'There are no irrigation schemes with pumping stations for {m} yet.',
      hvAddHint: 'Press “+ Add station” below the table, fill in the fields and press “Save” at the top right. New stations are kept in this browser.',
      hvErrRows: 'Check the rows marked in red: name, type and directorate are required, numbers must be 0 or more and main pumps cannot exceed the total.',
      skSave: 'Save', skSelectAll: 'Select all rows', skSelectRow: 'Select row {r}',
      skEditHint: 'Select the rows you want to change, fill in the fields and press “Save” at the top right. Changes are kept in this browser.',
      skEditPick: 'Choose a municipality from the “Municipality” list to update its schemes.',
      skErrRows: 'Check the rows marked in red: code and name cannot be empty, km must be 0 or more and updated km cannot exceed the canals.',
      skSaveFail: 'Changes were not saved: browser storage is not available.',
      skSaveFailDb: 'Changes were not saved to the database. Please try again.',
      skErrDup: 'A scheme with this code and name already exists in this municipality.',
      skMigrated: 'Changes saved earlier in this browser were moved to the database.',
      astUserName: 'Administrator',
      astRole: 'Irrigation & Drainage',
      ovNoData: 'No data yet',
      astNavAdd: 'Add asset',
      astFormEdit: 'Edit asset',
      astFormIntro: 'Fields marked * are required.',
      astStatDige: 'Dams',
      astStatStacion: 'Pumping stations',
      astStatRezervuar: 'Reservoirs',
      astStatMakineri: 'Machinery',
      astStatAsetet: 'Assets', astStatStafi: 'Staff',
      astTypeSkema: 'Irrigation scheme',
      astTypeHidrovor: 'Drainage pumping station',
      astStatSkema: 'Irrigation schemes',
      astStatHidrovor: 'Drainage pumping stations',
      astSpecCode: 'Scheme code',
      astSpecCodePh: 'e.g. BRU - 13',
      astSpecCanals: 'Canal length',
      astSpecPowerInst: 'Installed power',
      astSpecDrainArea: 'Drained area',
      astTypeDige: 'Dam',
      astTypeStacion: 'Pumping station',
      astTypeRezervuar: 'Reservoir',
      astTypeMakineri: 'Machinery',
      astStFunk: 'Functional',
      astStPjes: 'Partly functional',
      astStJo: 'Not functional',
      astColName: 'Name',
      astColType: 'Type',
      astColStatus: 'Condition',
      astColSpecs: 'Technical data',
      astColYear: 'Year',
      astColUpdated: 'Updated',
      astColActions: 'Actions',
      astSearchLbl: 'Search assets',
      astSearchPh: 'Search by name…',
      astFilterMuniAll: 'All municipalities',
      portalNvTitle: 'Irrigation water needs',
      portalNvDesc: 'Monthly irrigation needs by crop and zone',
      nvPanelPlan: 'Seasonal planning',
      pdPanel: 'Data updating',
      znTitle: 'Agro-climatic zones',
      kbTitle: 'Crops of the municipality',
      opTitle: 'Water master',
      pkTitle: 'Crop coefficients',
      nvTitle: 'Irrigation water needs',
      nvLead: 'Monthly irrigation need of each crop (mm), by zone. 1 mm of water on 1 ha = 10 m³.',
      nvSheet: 'Irrigation need by month',
      nvColCrop: 'Crop', nvColGroup: 'Group',
      nvColYear: 'Yearly need', nvColMm: 'mm', nvColM3: 'm³/ha',
      nvMonthsHead: 'Irrigation need by month (mm)', nvScaleMax: '100+ mm',
      nvZoneLbl: 'Zone',
      nvZ_kombetare: 'National average',
      nvZ_zona1: '1. Coastal zone and Western Lowlands',
      nvZ_zona2: '2. Central and hilly zone',
      nvZ_zona3: '3. Southern and south-western zone',
      nvZ_zona4: '4. North-eastern and mountain zone',
      nvNoData: 'No data for this zone',
      nvExcelTotal: 'The Excel total is {n} mm; the sum of the months is shown here.',
      nvNoteLbl: 'Note',
      nvNoteText: 'Values are indicative (mm/month), not official norms; they must be adjusted to the zone, the crop calendar, ET0/Kc and effective rainfall.',
      nvEdit: 'Edit', nvCancel: 'Cancel', nvSave: 'Save', nvExport: 'Export CSV',
      nvEditHint: 'Enter the need in mm for each month; the total is calculated automatically. Use ⊕ to add a crop to a group.',
      nvAddCrop: 'Add crop', nvNewCrop: 'Crop name', nvDelCrop: 'Remove crop',
      nvErrRows: 'Check the rows marked in red: the name cannot be empty and values must be 0 or more.',
      nvSaved: 'Changes saved.',
      nvSelHint: 'Click a month with a value to select the crop season, or drag across several months; then drag the selection left or right.',
      nvMoveHint: 'Drag the selection to other months, or use ◀ ▶ (or the arrow keys). Esc clears the selection.',
      nvSelLbl: 'Selected months', nvShiftPrev: 'One month earlier', nvShiftNext: 'One month later', nvSelClear: 'Clear selection',
      nvLocTitle: 'Location', nvQarkLbl: 'County', nvBashkiLbl: 'Municipality', nvNjesiLbl: 'Administrative unit',
      nvLocMany: 'This location covers {n} zones; choose the municipality or administrative unit:',
      nvColReq: 'Demand', nvColHa: 'ha', nvColReqM3: 'm³', nvFootReq: 'Total demand (m³)',
      nvHaLbl: '{c}: area (ha)',
      kfNav: 'Request form',
      kfTitle: 'Irrigation request form',
      kfLead: 'Record the irrigation need for each parcel and crop. A request moves: Draft → Submitted → Verified → Accepted, Partial or Rejected.',
      kfList: 'Requests', kfNew: 'New request', kfNewTitle: 'New request', kfTitleOf: 'Request {id}',
      kfSt_draft: 'Draft', kfSt_dorezuar: 'Submitted', kfSt_verifikuar: 'Verified', kfSt_vendim: 'Decision',
      kfSt_pranuar: 'Accepted', kfSt_pjeserisht: 'Partial', kfSt_refuzuar: 'Rejected', kfStAll: 'All',
      kfStD_draft: 'Filled in and saved', kfStD_dorezuar: 'Awaiting verification', kfStD_verifikuar: 'Awaiting the decision', kfStD_vendim: 'Accepted, partial or rejected',
      kfStD_pranuar: 'The whole volume was accepted', kfStD_pjeserisht: 'Part of the volume was accepted', kfStD_refuzuar: 'Request rejected',
      kfStepsLbl: 'Request steps',
      kfSearchPh: 'Search by no., parcel, farmer or crop…',
      kfColNr: 'No.', kfColViti: 'Year', kfColVend: 'Municipality / unit', kfColParcela: 'Parcel', kfColFermeri: 'Farmer', kfColKultura: 'Crop',
      kfColHa: 'Irrigated (ha)', kfColBruto: 'Gross volume (m³)', kfColMiratuar: 'Accepted volume (m³)', kfColStatus: 'Status', kfColUpd: 'Updated', kfColTot: 'Total',
      kfEmpty: 'There are no requests yet.', kfNoMatch: 'No request matches the filter.',
      kfSecA: 'Territorial identification', kfSecB: 'Crop data', kfSecC: 'Water need and volume', kfSecD: 'Verification and decision',
      kfReqNote: 'Fields marked * are required to submit; a draft can be saved incomplete.',
      kfLockedNote: 'The request has been submitted: its data no longer changes. For corrections, the verifier sends it back to draft.',
      kfF_viti: 'Agricultural year', kfF_njesia: 'Administrative unit', kfF_fshati: 'Village / cadastral zone', kfF_skema: 'Irrigation scheme',
      kfF_parcela: 'Parcel code (GIS reference)', kfF_fermeri: 'Farmer / agricultural entity', kfF_kultura: 'Crop',
      kfF_supParcela: 'Parcel area (ha)', kfF_supKult: 'Cultivated area (ha)', kfF_supUjitje: 'Area to irrigate (ha)',
      kfF_data: 'Planting date / season start', kfF_sistemi: 'Irrigation system', kfF_burimi: 'Water source', kfF_eff: 'Irrigation efficiency (%)',
      kfF_nevoja: 'Monthly net need (mm)', kfF_miratuar: 'Accepted volume (m³)', kfF_shenim: 'Note / reason',
      kfOneOf: 'one of the values',
      kfPickNjesi: 'Choose the unit', kfPickKultura: 'Choose the crop',
      kfPhParcela: 'e.g. 3317-045-12', kfPhFermeri: 'Name, NIPT or NID', kfPhSkema: 'Choose or type',
      kfSys_gravitet: 'Open canal / gravity', kfSys_shi: 'Sprinkler', kfSys_pike: 'Drip', kfSys_pompim: 'Pumping',
      kfSrc_rezervuar: 'Reservoir', kfSrc_lume: 'River', kfSrc_kanal: 'Main canal', kfSrc_pus: 'Well / groundwater', kfSrc_tjeter: 'Other',
      kfHintSkema: '{n} schemes registered in this municipality.', kfHintParcela: 'Unique identifier: one request per parcel, crop and year.',
      kfHintKultura: 'The crops the municipality chose in “Municipality crops”.', kfPickNjesiFirst: 'Choose the unit first', kfLoading: 'Loading…', kfNoParams: 'no parameters in the zone', kfHintData: 'Within the agricultural year: {a} – {b}.', kfHintDataOpt: 'Optional for orchards and vineyards.',
      kfHintSupParcela: 'Greater than zero.', kfHintSupKult: 'No more than the parcel area.', kfHintSupUjitje: 'No more than the cultivated area.',
      kfHintEff: 'Technical interval for “{s}”: {a}–{b}%.', kfHintEffPick: 'Choose the irrigation system to see its technical interval.',
      kfHintMiratuar: 'For a partial acceptance: less than the gross volume requested ({n} m³). “Accepted” accepts the whole volume.',
      kfHintNote: 'Required when the request is sent back, partially accepted or rejected.',
      kfZone: 'Orientation zone', kfZoneNone: 'Choose the administrative unit to find the orientation zone.',
      kfHintNjesi: 'The municipality is filled in from the unit.',
      kfRowNeto: 'Net need (mm)', kfRowBruto: 'Gross volume (m³)',
      kfCalcNote: 'Gross volume = net need × 10 × area to irrigate ÷ efficiency (includes losses). The net need comes from the “Irrigation water needs” table for the unit’s zone.',
      kfCalcEditNote: 'The verifier can correct the net need before verifying.',
      kfSaveDraft: 'Save as draft', kfSubmit: 'Submit request', kfVerify: 'Verify', kfReturn: 'Send back for correction', kfReject: 'Rejected', kfAccept: 'Accepted', kfPartial: 'Partial',
      kfPopVolHint: 'Less than {n} m³ (the gross volume requested).',
      kfChangeSt: 'Change status', kfConfirm: 'Confirm', kfCancel: 'Cancel', kfToDraft: 'Send back to draft for correction', kfBack: 'Back to the list',
      kfResOk: 'The whole volume requested was accepted: {b} m³.', kfResPart: '{a} m³ accepted of {b} m³ requested ({p}%).', kfResNo: 'The request was rejected.',
      kfHistory: 'History',
      kfMsgSaved: 'Draft {id} saved.', kfMsgSubmitted: 'Request {id} submitted.', kfMsgVerified: 'Request {id} verified.',
      kfMsgReturned: 'Request {id} sent back to draft for correction.', kfMsgRejected: 'Request {id} rejected.', kfMsgAccepted: 'Request {id} accepted.', kfMsgPartial: 'Request {id} partially accepted.',
      kfMsgErrors: 'The request cannot continue: check the {n} fields below.',
      kfE_req: 'This field is required.', kfE_year: 'Enter a valid year ({a}–{b}).',
      kfE_njesia: 'Choose the unit from the register.', kfE_parcelaDup: 'This parcel already has request {id} for this crop and year.',
      kfE_kultura: 'Choose one of the municipality’s crops.', kfE_noNeed: 'This crop has no parameters yet (stages, Kc, planting month) in the unit’s zone; they are filled in on “Irrigation water needs”.',
      kfE_pos: 'Must be greater than zero.', kfE_gtParcela: 'Cannot exceed the parcel area ({n} ha).', kfE_gtKult: 'Cannot exceed the cultivated area ({n} ha).',
      kfE_date: 'The date must be within the agricultural year ({a} – {b}).', kfE_eff: 'Efficiency must be {a}–{b}%.',
      kfE_neg: 'Fill in all 12 months; values cannot be negative.', kfE_miratuar: 'For a partial acceptance, the volume must be above 0 and less than {n} m³.', kfE_note: 'Write the reason.',
      nvM1: 'January', nvM2: 'February', nvM3: 'March', nvM4: 'April', nvM5: 'May', nvM6: 'June',
      nvM7: 'July', nvM8: 'August', nvM9: 'September', nvM10: 'October', nvM11: 'November', nvM12: 'December',
      astFilterTypeAll: 'All types',
      astCount: '{n} of {total} assets',
      astEmpty: 'No assets registered yet.',
      astNoMatch: 'No asset matches the filters.',
      astEdit: 'Edit',
      astDelete: 'Delete',
      astDeleteConfirm: 'Delete the asset "{n}"?',
      astDeleted: 'The asset was deleted.',
      astSecGeneral: 'General data',
      astSecTech: 'Technical data',
      astFldType: 'Asset type',
      astTypePh: 'Choose a type…',
      astStatusPh: 'Choose a condition…',
      astFldYear: 'Year built / manufactured',
      astYearPh: 'e.g. 1985',
      astSpecHint: 'Choose the asset type to fill in the technical data.',
      astSpecHeight: 'Height',
      astSpecLength: 'Length',
      astSpecCap: 'Capacity',
      astSpecPower: 'Power',
      astSpecVol: 'Volume',
      astSpecArea: 'Irrigated area',
      astSpecKind: 'Machine type',
      astSpecKindPh: 'e.g. Excavator',
      astSpecPlate: 'Plate / ID number',
      astSpecPlatePh: 'e.g. AA 123 BB',
      astNotes: 'Notes',
      astSave: 'Save asset',
      astCancel: 'Cancel',
      astErrReq: 'This field is required.',
      astErrYear: 'Enter a valid year (1900 to today).',
      navBack: 'Services',
      repTitle: 'Irrigation statistics',
      docTabField: 'Field data', docTabReview: 'Under review',
      docTabApproved: 'Approved', docTabPublished: 'Published',
      emptyStep1: 'Step 1 of 4', emptyStep2: 'Step 2 of 4', emptyStep3: 'Step 3 of 4', emptyStep4: 'Step 4 of 4',
      emptyField: 'Data collected in the field appears here. It is stored temporarily until it moves on to review.',
      emptyReview: 'Data being reviewed, and corrected if needed, by the municipality’s experts appears here.',
      emptyApproved: 'Data approved by the expert after review appears here, ready to be published.',
      emptyPublished: 'Data published to the database and accessible to users appears here.',
      emptyMakineri: 'The municipality’s machinery and maintenance equipment will appear here once registered.',
      emptyAsetet: 'The municipality’s other irrigation and drainage assets will appear here once registered.',
      emptyStafi: 'The municipality’s irrigation and drainage staff will appear here once registered.',
      flowStep1: 'Data collected in the field (stored in a temporary DB)',
      flowStep2: 'Data is reviewed by experts at the Municipality',
      flowStep3: 'After review and any corrections, it is approved by the expert',
      flowStep4: 'Finally, the data is published to the DB and made accessible',
      muniAll: 'All municipalities',
      tblCaption: 'Municipally owned irrigation schemes, by county',
      tblMuni: 'Municipality', tblQark: 'County',
      tblSchemes: 'Irrigation schemes', tblSources: 'Water sources',
      tblKm: 'Primary and secondary canals (km)',
      tblFunc: 'Functional', tblPartFunc: 'Partly functional',
      tblNonFunc: 'Non-functional', tblNoInfo: 'No data',
      tblTotal: 'Total', tblEmpty: 'No municipality found.',
      totEyebrow: 'Nationwide total', totTitle: '46 municipalities',
      plEyebrow: 'Scheme inventory',
      plgSchemes: 'Irrigation scheme', plgSource: 'Water source',
      plgCanals: 'Primary and secondary canals (km)', plgNr: 'No.',
      plgField: 'Identified in the field', plgUpdated: 'Updated',
      plgCode: 'Code', plgName: 'Name',
      plgSecFull: 'Fully transferred schemes', plgSecPartial: 'Partly transferred schemes',
      plgSchemeOne: 'scheme', plgSchemeMany: 'schemes',
      totHint: 'Click a municipality on the map to see its data.',
      totCover: 'Canal status: data for 30 of 46 municipalities.',
      muniHint: 'Click the municipality again to return to the totals.',
      muniNoData: 'There is no canal status data for this municipality yet.',
      totDonutTitle: 'Canals by status, nationwide',
      totDonutDesc: 'Functional 33.4%, partly functional 24.8%, non-functional 20.2%, no data 21.6%.',
      mapSvgTitle: 'Map of Albania with its 46 municipalities',
      mapSvgDesc: 'The boundaries of the 46 municipalities. Click a municipality to see its statistics.',
      cnlChartTitle: 'Irrigation canals by status',
      cnlChartDesc: 'Functional 44.37%, partly functional 25.71%, non-functional 20.87%, no data 9.05%.',
      regTitle: 'Create an account',
      regNote: 'New accounts receive the Viewer role.',
      regSubmit: 'Create account',
      regAlt: 'Already registered?',
      fldUser: 'Username or email', fldPass: 'Password',
      fldRemember: 'Remember me', fldName: 'First name', fldSurname: 'Last name',
      fldEmail: 'Email', fldMuni: 'Municipality', fldMuniPick: 'Select a municipality',
      fldPassHint: 'At least 8 characters, with an uppercase letter, a lowercase letter, a digit and a symbol.',
      authBack: 'Back to the main page',
      asideTitle: 'Full access to the network data',
      perk1: 'The complete WebGIS viewer with the layer tree',
      perk2: 'Maintenance and intervention reports',
      perk3: 'Data by municipality and irrigation scheme',
      asideTitleReg: 'Register for institutional access',
      perkR1: 'Accounts are verified by the responsible unit',
      perkR2: 'Initial role: Viewer, with access to the base layers',
      perkR3: 'Role upgrades granted by the system administrator',
      asideFoot: 'Ministry of Agriculture and Rural Development',
      fldUsername: 'Username', fldFullName: 'Full name',
      fldOrg: 'Organization / Municipality', fldConfirm: 'Confirm password',
      heroTitle: 'Irrigation & Drainage Management Information System',
      heroLead: 'A geospatial platform for planning, monitoring and maintaining irrigation and drainage infrastructure.',
      footParent: 'Ministry of Agriculture and Rural Development',
      footName: 'Irrigation and Drainage Management System',
      footBlurb: 'Established under the legislation on irrigation and drainage of agricultural land.',
      footLblPhone: 'Tel', footLblEmail: 'Email', footLblAddr: 'Address',
      toTop: 'Back to top',
      footC1: 'Services', footC2: 'Contact', footC3: 'Institution',
      footLaw: 'Legal basis',
      footTransparency: 'Transparency programme',
      footPrivacy: 'Privacy policy',
      footAddr: 'Tirana, Albania',
      footRights: 'Content is public information.'
    }
  };
  var langToggle = document.getElementById('langToggle');
  var currentLang = 'sq';
  function setLang(lang) {
    var dict = I18N[lang];
    if (!dict) return;
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = dict[el.getAttribute('data-i18n')];
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var val = dict[el.getAttribute('data-i18n-title')];
      if (val) el.title = val;
    });
    document.documentElement.lang = lang;
    if (langToggle) {
      langToggle.querySelectorAll('.lang-opt').forEach(function (opt) {
        opt.classList.toggle('is-active', opt.dataset.lang === lang);
      });
    }
    try { localStorage.setItem('idms-lang', lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('idms:langchange', { detail: lang }));
  }
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      setLang(currentLang === 'sq' ? 'en' : 'sq');
    });
  }
  try {
    var saved = localStorage.getItem('idms-lang');
    if (saved && saved !== 'sq') setLang(saved);
  } catch (e) {}
  document.documentElement.classList.remove('i18n-wait');
  document.querySelectorAll('[data-toggle-pass]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-toggle-pass'));
      if (!input) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.classList.toggle('is-on', show);
      btn.setAttribute('aria-label', show ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin');
      input.focus();
    });
  });
  document.querySelectorAll('.auth form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });
  var authT = function (key) { return (I18N[currentLang] || I18N.sq)[key] || I18N.sq[key] || ''; };
  var toastStack = document.createElement('div');
  toastStack.className = 'toast-stack';
  toastStack.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastStack);
  var TOAST_ICONS = {
    ok: '<path d="M20 6 9 17l-5-5"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>'
  };
  var toastClose = function (el) {
    if (!el.parentNode || el.classList.contains('is-leaving')) return;
    el.classList.add('is-leaving');
    var gone = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    el.addEventListener('animationend', gone);
    setTimeout(gone, 400);
  };
  var idmsToast = function (type, text, opts) {
    opts = opts || {};
    type = type === 'error' ? 'error' : 'ok';
    var sticky = opts.sticky != null ? opts.sticky : type === 'error';
    Array.prototype.forEach.call(toastStack.children, function (old) {
      if (old.getAttribute('data-text') === text) toastClose(old);
    });
    var el = document.createElement('div');
    el.className = 'toast is-' + type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.setAttribute('data-text', text);
    el.innerHTML =
      '<span class="toast-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + TOAST_ICONS[type] + '</svg></span>' +
      '<div class="toast-body"><p class="toast-title"></p><p class="toast-text"></p></div>' +
      '<button type="button" class="toast-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>' +
      (sticky ? '' : '<span class="toast-bar" aria-hidden="true"></span>');
    el.querySelector('.toast-title').textContent = opts.title || authT(type === 'error' ? 'toastErrTitle' : 'toastOkTitle');
    el.querySelector('.toast-text').textContent = text;
    var x = el.querySelector('.toast-x');
    x.setAttribute('aria-label', authT('toastClose'));
    x.title = authT('toastClose');
    x.addEventListener('click', function () { toastClose(el); });
    var bar = el.querySelector('.toast-bar');
    if (bar) bar.addEventListener('animationend', function () { toastClose(el); });
    toastStack.appendChild(el);
    while (toastStack.children.length > 4) toastStack.removeChild(toastStack.firstChild);
    return el;
  };
  window.idmsToast = idmsToast;
  var idmsLoading = function (host, on) {
    if (!host) return;
    var el = host.querySelector(':scope > .data-loader');
    if (on && !el) {
      el = document.createElement('div');
      el.className = 'data-loader';
      el.setAttribute('role', 'status');
      el.innerHTML = '<span class="data-loader-ring" aria-hidden="true"></span><span class="data-loader-text"></span>';
      el.querySelector('.data-loader-text').textContent = authT('loadingData');
      host.appendChild(el);
    }
    if (!on && el) el.remove();
    host.classList.toggle('is-data-loading', !!on);
    host.setAttribute('aria-busy', on ? 'true' : 'false');
  };
  window.idmsLoading = idmsLoading;
  var authNext = function () {
    var n = new URLSearchParams(location.search).get('next') || '';
    return /^\/(?!\/)[^\\]*$/.test(n) ? n : '/Account/Portal.html';
  };
  var authMe = function () {
    return fetch('/api/une', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (r.status === 401) return null;
      if (!r.ok) throw new Error('api');
      return r.json().then(function (d) { return d.perdoruesi; });
    });
  };
  var authLogout = function () {
    fetch('/api/dalje', { method: 'POST', credentials: 'same-origin' })
      .catch(function () {})
      .then(function () { location.href = '/Account/Login.html'; });
  };
  var placesPromise = null;
  var loadPlaces = function () {
    if (!placesPromise) {
      placesPromise = fetch('/api/vendndodhjet', { credentials: 'same-origin' }).then(function (r) {
        if (!r.ok) throw new Error('vendndodhjet ' + r.status);
        return r.json();
      }).then(function (d) {
        var byId = function (list) { var m = {}; list.forEach(function (x) { m[x.id] = x; }); return m; };
        var q = byId(d.qarqet), b = byId(d.bashkite), z = byId(d.zonat);
        return d.njesite.map(function (n) {
          return [q[n.qarku_id].emri, b[n.bashkia_id].emri, n.emri, 'zona' + z[n.zona_id].kodi.slice(1)];
        });
      });
    }
    return placesPromise;
  };
  var placeKey = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/-/g, ' ').trim().toLowerCase();
  };
  var replaceList = function (target, rows) {
    target.length = 0;
    Array.prototype.push.apply(target, rows);
  };
  var loginUser = document.getElementById('UserNameOrEmail');
  var loginForm = loginUser && loginUser.form;
  if (loginForm) {
    var loginPass = document.getElementById('Password');
    var loginRemember = document.getElementById('RememberMe');
    var loginBtn = loginForm.querySelector('button[type="submit"]');
    var loginErr = document.createElement('p');
    loginErr.className = 'field-error';
    loginErr.id = 'loginError';
    loginErr.setAttribute('role', 'alert');
    loginErr.hidden = true;
    loginBtn.parentNode.insertBefore(loginErr, loginBtn);
    var loginErrKey = null;
    var loginShowErr = function (key) {
      loginErrKey = key;
      loginErr.textContent = key ? authT(key) : '';
      loginErr.hidden = !key;
      var bad = key === 'loginErrEmpty' || key === 'loginErrInvalid';
      [loginUser, loginPass].forEach(function (el) {
        if (bad) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'loginError'); }
        else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
      });
    };
    document.addEventListener('idms:langchange', function () { if (loginErrKey) loginShowErr(loginErrKey); });
    [loginUser, loginPass].forEach(function (el) {
      el.addEventListener('input', function () { if (loginErrKey) loginShowErr(null); });
    });
    authMe().then(function (u) { if (u) location.replace(authNext()); }).catch(function () {});
    loginForm.addEventListener('submit', function () {
      var login = loginUser.value.trim();
      if (!login || !loginPass.value) {
        loginShowErr('loginErrEmpty');
        (login ? loginPass : loginUser).focus();
        return;
      }
      loginShowErr(null);
      loginBtn.disabled = true;
      loginBtn.textContent = authT('loginBusy');
      fetch('/api/hyrje', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perdoruesi: login, fjalekalimi: loginPass.value, mbajMend: !!(loginRemember && loginRemember.checked) })
      }).then(function (r) {
        if (r.ok) { location.replace(authNext()); return; }
        var key = { 400: 'loginErrEmpty', 401: 'loginErrInvalid', 403: 'loginErrInactive', 429: 'loginErrLocked' }[r.status];
        if (!key) key = r.status === 404 || r.status === 405 ? 'loginErrOffline' : 'loginErrServer';
        throw key;
      }).catch(function (key) {
        loginShowErr(typeof key === 'string' ? key : 'loginErrOffline');
        loginPass.value = '';
        loginBtn.disabled = false;
        loginBtn.textContent = authT('loginSubmit');
        (key === 'loginErrInvalid' || key === 'loginErrEmpty' ? loginPass : loginUser).focus();
      });
    });
  }
  var msProfile = document.querySelector('.ms-profile');
  var portalCard = document.querySelector('.auth-card-portal');
  if (msProfile || portalCard) {
    var pageUser = window.IDMIS_PERDORUESI;
    if (msProfile && pageUser && pageUser.emri_plote) {
      msProfile.querySelector('.ms-user').textContent = pageUser.emri_plote;
      msProfile.querySelector('.ms-role').textContent = authT('role' + pageUser.roli) + ' · ' + pageUser.bashkia;
      var pageAvatar = msProfile.querySelector('.ms-avatar');
      if (pageAvatar) pageAvatar.textContent = (pageUser.emri_plote.trim().charAt(0) || '?').toUpperCase();
      msProfile.classList.add('is-ready');
    }
    authMe().then(function (u) {
      if (!u) { location.replace('/Account/Login.html?next=' + encodeURIComponent(location.pathname + location.search)); return; }
      var roleText = function () { return authT('role' + u.roli) + ' · ' + u.bashkia; };
      if (msProfile) {
        var nameEl = msProfile.querySelector('.ms-user');
        var roleEl = msProfile.querySelector('.ms-role');
        var avatar = msProfile.querySelector('.ms-avatar');
        nameEl.removeAttribute('data-i18n');
        roleEl.removeAttribute('data-i18n');
        nameEl.textContent = u.emri_plote;
        nameEl.title = u.emri_plote + ' (' + u.emri_perdoruesit + ')';
        roleEl.textContent = roleText();
        if (avatar) avatar.textContent = (u.emri_plote.trim().charAt(0) || '?').toUpperCase();
        msProfile.classList.add('is-ready');
        var pm = document.createElement('div');
        pm.className = 'ms-pm';
        pm.id = 'msProfileMenu';
        pm.setAttribute('role', 'menu');
        pm.hidden = true;
        pm.tabIndex = -1;
        pm.innerHTML = '<div class="ms-pm-head"><p class="ms-pm-name"></p><p class="ms-pm-mail"></p><p class="ms-pm-role"></p></div>' +
          '<button type="button" class="ms-pm-item" role="menuitem" data-pm="settings"></button>' +
          '<button type="button" class="ms-pm-item" role="menuitem" data-pm="help"></button>' +
          '<div class="ms-pm-sep" role="separator"></div>' +
          '<button type="button" class="ms-pm-item ms-pm-out" role="menuitem" data-pm="out"></button>';
        var pmText = function () {
          pm.querySelector('.ms-pm-name').textContent = u.emri_plote;
          pm.querySelector('.ms-pm-mail').textContent = u.email || u.emri_perdoruesit;
          pm.querySelector('.ms-pm-role').textContent = roleText();
          pm.querySelector('[data-pm="settings"]').textContent = authT('pmSettings');
          pm.querySelector('[data-pm="help"]').textContent = authT('pmHelp');
          pm.querySelector('[data-pm="out"]').textContent = authT('logout');
          pm.querySelector('[data-pm="out"]').title = authT('logoutTitle');
          msProfile.setAttribute('aria-label', u.emri_plote + ' — ' + authT('pmOpen'));
        };
        pmText();
        msProfile.appendChild(pm);
        msProfile.classList.add('has-menu');
        msProfile.tabIndex = 0;
        msProfile.setAttribute('role', 'button');
        msProfile.setAttribute('aria-haspopup', 'menu');
        msProfile.setAttribute('aria-controls', pm.id);
        msProfile.setAttribute('aria-expanded', 'false');
        var pmItems = function () { return Array.prototype.slice.call(pm.querySelectorAll('.ms-pm-item')); };
        var pmToggle = function (open, focusFirst) {
          pm.hidden = !open;
          msProfile.classList.toggle('is-open', open);
          msProfile.setAttribute('aria-expanded', String(open));
          if (open && focusFirst) pmItems()[0].focus();
        };
        msProfile.addEventListener('click', function (e) {
          var item = e.target.closest('.ms-pm-item');
          if (item) {
            if (item.getAttribute('data-pm') === 'out') authLogout();
            pmToggle(false);
            msProfile.focus();
            return;
          }
          if (!pm.contains(e.target)) pmToggle(pm.hidden);
        });
        msProfile.addEventListener('keydown', function (e) {
          var items = pmItems(), at = items.indexOf(document.activeElement);
          if (e.target === msProfile && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp')) {
            e.preventDefault();
            pmToggle(true, true);
          } else if (e.key === 'Escape' && !pm.hidden) {
            pmToggle(false);
            msProfile.focus();
          } else if (at >= 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            items[(at + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
          }
        });
        document.addEventListener('click', function (e) { if (!pm.hidden && !msProfile.contains(e.target)) pmToggle(false); });
        msProfile.addEventListener('focusout', function (e) { if (!pm.hidden && !msProfile.contains(e.relatedTarget)) pmToggle(false); });
        document.addEventListener('idms:langchange', pmText);
      }
      var portalAside = portalCard && document.querySelector('.auth-aside');
      if (portalAside) {
        var bar = document.createElement('div');
        bar.className = 'auth-user';
        bar.innerHTML = '<span class="auth-user-avatar" aria-hidden="true"></span>' +
          '<p class="auth-user-who"><span class="auth-user-lbl"></span><strong class="auth-user-name"></strong><span class="auth-user-role"></span></p>' +
          '<button type="button" class="auth-user-out">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>' +
          '<span></span></button>';
        var barText = function () {
          bar.querySelector('.auth-user-avatar').textContent = (u.emri_plote.trim().charAt(0) || '?').toUpperCase();
          bar.querySelector('.auth-user-lbl').textContent = authT('portalSignedIn');
          bar.querySelector('.auth-user-name').textContent = u.emri_plote;
          bar.querySelector('.auth-user-role').textContent = roleText();
          bar.querySelector('.auth-user-out span').textContent = authT('logout');
          bar.querySelector('.auth-user-out').title = authT('logoutTitle');
        };
        barText();
        bar.querySelector('.auth-user-out').addEventListener('click', authLogout);
        var asideFoot = portalAside.querySelector('.auth-aside-foot');
        var asideEnd = document.createElement('div');
        asideEnd.className = 'auth-aside-end';
        portalAside.insertBefore(asideEnd, asideFoot);
        asideEnd.appendChild(bar);
        if (asideFoot) asideEnd.appendChild(asideFoot);
        document.addEventListener('idms:langchange', barText);
      }
    }).catch(function () {
      if (msProfile) msProfile.classList.add('is-ready');
    });
  }
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.hidden = false;
    var ticking = false;
    var updateToTop = function () {
      toTop.classList.toggle('is-visible', window.scrollY > 500);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateToTop);
    }, { passive: true });
    updateToTop();
    toTop.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }
  var MUNI_MERGED = {
    'Dropull': 'Berat', 'Poliçan': 'Berat', 'Memaliaj': 'Tepelenë', 'Këlcyrë': 'Përmet',
    'Libohovë': 'Gjirokastër', 'Maliq': 'Korçë', 'Rrogozhinë': 'Kavajë', 'Fushë Arrës': 'Pukë',
    'Klos': 'Mat', 'Prrenjas': 'Librazhd', 'Cërrik': 'Elbasan', 'Belsh': 'Elbasan',
    'Selenicë': 'Vlorë', 'Patos': 'Fier', 'Divjakë': 'Lushnjë'
  };
  (function mergeMunis() {
    var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
    var gone = function (name) { return has(MUNI_MERGED, name); };
    if (Array.isArray(window.IDMIS_TARIFAT_BASHKI)) {
      window.IDMIS_TARIFAT_BASHKI = window.IDMIS_TARIFAT_BASHKI.filter(function (m) { return !gone(m.bashkia); });
    }
    var sk = window.IDMIS_SKEMAT;
    if (sk) {
      Object.keys(MUNI_MERGED).forEach(function (src) {
        if (!has(sk, src)) return;
        var dst = MUNI_MERGED[src];
        var to = sk[dst] = sk[dst] || { plota: [], pjeserisht: [] };
        var next = {};
        to.plota.concat(to.pjeserisht).forEach(function (r) {
          Object.keys(r.ord || {}).forEach(function (t) { next[t] = Math.max(next[t] || 0, r.ord[t] + 1); });
        });
        ['plota', 'pjeserisht'].forEach(function (k) {
          to[k] = to[k].concat((sk[src][k] || []).map(function (r) {
            var ord = {};
            Object.keys(r.ord || {}).forEach(function (t) { ord[t] = (next[t] || 0) + r.ord[t]; });
            return Object.assign({}, r, { ord: ord, bashkiaPare: src });
          }));
        });
        delete sk[src];
      });
    }
    var inv = window.IDMIS_INVENTARI;
    if (inv) {
      Object.keys(MUNI_MERGED).forEach(function (src) {
        if (!has(inv, src)) return;
        var dst = MUNI_MERGED[src];
        var to = inv[dst] = inv[dst] || { sections: [] };
        inv[src].sections.forEach(function (sec) {
          var into = to.sections.filter(function (s) { return s.type === sec.type; })[0];
          if (!into) {
            into = { type: sec.type, rows: [] };
            to.sections.push(into);
            to.sections.sort(function (a, b) { return (a.type === 'partial') - (b.type === 'partial'); });
          }
          sec.rows.forEach(function (r) { into.rows.push([into.rows.length + 1].concat(r.slice(1))); });
        });
        delete inv[src];
      });
    }
    try {
      var store = JSON.parse(localStorage.getItem('idms-skemat'));
      var moved = false;
      if (store && typeof store === 'object') {
        Object.keys(MUNI_MERGED).forEach(function (src) {
          if (!has(store, src)) return;
          var mine = store[src] || {}, to = store[MUNI_MERGED[src]] = store[MUNI_MERGED[src]] || {};
          Object.keys(mine).forEach(function (k) {
            if (k !== '__added') { if (!has(to, k)) to[k] = mine[k]; return; }
            to.__added = to.__added || {};
            Object.keys(mine.__added || {}).forEach(function (t) { to.__added[t] = (to.__added[t] || []).concat(mine.__added[t]); });
          });
          delete store[src];
          moved = true;
        });
        if (moved) localStorage.setItem('idms-skemat', JSON.stringify(store));
      }
      var assets = JSON.parse(localStorage.getItem('idms-asetet'));
      if (Array.isArray(assets) && assets.some(function (a) { return a && gone(a.bashkia); })) {
        assets.forEach(function (a) { if (a && gone(a.bashkia)) a.bashkia = MUNI_MERGED[a.bashkia]; });
        localStorage.setItem('idms-asetet', JSON.stringify(assets));
      }
      var pickedMuni = localStorage.getItem('idms-ms-bashkia');
      if (gone(pickedMuni)) localStorage.setItem('idms-ms-bashkia', MUNI_MERGED[pickedMuni]);
    } catch (e) {}
    var fillOf = {};
    document.querySelectorAll('.muni-shape[data-muni]').forEach(function (sh) {
      var name = sh.getAttribute('data-muni');
      if (!gone(name) && sh.style.getPropertyValue('--fill')) fillOf[name] = sh.style.getPropertyValue('--fill');
    });
    document.querySelectorAll('.muni-shape[data-muni]').forEach(function (sh) {
      var name = sh.getAttribute('data-muni');
      if (!gone(name)) return;
      sh.setAttribute('data-muni', MUNI_MERGED[name]);
      if (fillOf[MUNI_MERGED[name]]) sh.style.setProperty('--fill', fillOf[MUNI_MERGED[name]]);
    });
    document.querySelectorAll('.muni-label').forEach(function (lb) {
      if (gone(lb.textContent.trim())) lb.remove();
    });
    document.querySelectorAll('#muniPick option').forEach(function (o) {
      if (gone(o.value || o.textContent.trim())) o.remove();
    });
    var body = document.getElementById('tblBody');
    if (body) {
      var cellNum = function (td) { return parseFloat(td.textContent.replace(/\s/g, '')) || 0; };
      Object.keys(MUNI_MERGED).forEach(function (src) {
        var from = body.querySelector('tr[data-muni="' + src + '"]');
        var to = body.querySelector('tr[data-muni="' + MUNI_MERGED[src] + '"]');
        if (!from) return;
        if (to) {
          for (var i = 2; i < to.children.length; i++) {
            var a = to.children[i], b = from.children[i];
            if (!b || b.classList.contains('cell-empty')) continue;
            a.textContent = String(Math.round((cellNum(a) + cellNum(b)) * 100) / 100);
            a.classList.remove('cell-empty');
          }
        }
        from.remove();
      });
    }
  })();
  var SCOPE = (function () {
    var u = window.IDMIS_PERDORUESI;
    if (!u || u.roli === 'ADMINISTRATOR' || !u.bashkia) return null;
    var inFiles = { 'Malësi e Madhe': 'Malsi e Madhe', 'Delvinë': 'Delvin' }[u.bashkia] || u.bashkia;
    return { qarku: u.qarku, bashkia: u.bashkia, data: MUNI_MERGED[inFiles] || inFiles };
  })();
  if (SCOPE) {
    var keepOnly = function (obj, key) {
      if (obj && typeof obj === 'object') Object.keys(obj).forEach(function (k) { if (k !== key) delete obj[k]; });
    };
    if (Array.isArray(window.IDMIS_TARIFAT_BASHKI)) {
      window.IDMIS_TARIFAT_BASHKI = window.IDMIS_TARIFAT_BASHKI.filter(function (m) { return m.bashkia === SCOPE.data; });
    }
    keepOnly(window.IDMIS_SKEMAT, SCOPE.data);
    keepOnly(window.IDMIS_INVENTARI, SCOPE.data);
    var scopePlaces = window.IDMIS_NEVOJA_UJIT && window.IDMIS_NEVOJA_UJIT.vendndodhjet;
    if (Array.isArray(scopePlaces)) {
      var mine = scopePlaces.filter(function (p) { return p[1] === SCOPE.bashkia || p[1] === SCOPE.data; });
      scopePlaces.length = 0;
      Array.prototype.push.apply(scopePlaces, mine);
    }
    try { localStorage.setItem('idms-ms-bashkia', SCOPE.data); } catch (e) {}
    document.documentElement.classList.add('is-scoped');
  }
  var muniPick = document.getElementById('muniPick');
  var tblBody = document.getElementById('tblBody');
  var filterTable = null;
  if (muniPick && tblBody) {
    if (SCOPE) {
      Array.prototype.slice.call(muniPick.options).forEach(function (o) { if (o.value !== SCOPE.data) o.remove(); });
      if (muniPick.options.length) { muniPick.value = SCOPE.data; muniPick.disabled = true; }
    }
    var allRows = Array.prototype.slice.call(tblBody.querySelectorAll('tr'));
    var totalRow = document.getElementById('rowTotal');
    var emptyMsg = document.getElementById('tblEmpty');
    var fmt = function (n, dec) {
      return n.toFixed(dec || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };
    filterTable = function () {
      var pick = muniPick.value;
      var showAll = (pick === '' || pick === 'all');
      var shown = 0;
      var sums = [0, 0, 0, 0, 0, 0, 0];
      allRows.forEach(function (tr) {
        var match = showAll || tr.getAttribute('data-muni') === pick;
        tr.hidden = !match;
        if (!match) return;
        shown++;
        for (var i = 0; i < sums.length; i++) {
          var cell = tr.children[i + 2];
          sums[i] += cell ? (parseFloat(cell.textContent.replace(/\s/g, '')) || 0) : 0;
        }
      });
      if (totalRow) {
        totalRow.hidden = shown === 0;
        sums.forEach(function (v, i) {
          var cell = totalRow.children[i + 1];
          if (!cell) return;
          cell.textContent = i < 2 ? fmt(v) : fmt(Math.round(v * 10) / 10, 1);
        });
      }
      if (emptyMsg) emptyMsg.hidden = shown !== 0;
    };
    muniPick.addEventListener('change', filterTable);
    filterTable();
  }
  var muniPanel = document.getElementById('muniPanel');
  if (muniPanel && muniPick && tblBody) {
    var STATUS = [
      { key: 'tblFunc',     col: 5, top: '#2f7a43', side: '#1d4a28' },
      { key: 'tblPartFunc', col: 6, top: '#c9a227', side: '#8a6a17' },
      { key: 'tblNonFunc',  col: 7, top: '#b3402f', side: '#7a2a1e' },
      { key: 'tblNoInfo',   col: 8, top: '#9aa79d', side: '#67736a' }
    ];
    var CX = 190, CY = 150, RX = 150, RY = 86, IRX = 66, IRY = 38, DEPTH = 26, GAP = 0.012;
    var TAU = Math.PI * 2;
    var SVGNS = 'http://www.w3.org/2000/svg';
    var pointAt = function (a, rx, ry, dy) {
      return [CX + rx * Math.cos(a), CY + ry * Math.sin(a) + (dy || 0)];
    };
    var num = function (el) {
      return el ? (parseFloat(el.textContent.replace(/\s/g, '')) || 0) : 0;
    };
    var node = function (name, attrs) {
      var n = document.createElementNS(SVGNS, name);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      return n;
    };
    var drawDonut = function (parts, total, ids, sweepPct) {
      ids = ids || { walls: 'donutWalls', tops: 'donutTops', labels: 'donutLabels' };
      var frac = (sweepPct === undefined) ? 1 : sweepPct;
      var walls = document.getElementById(ids.walls);
      var tops = document.getElementById(ids.tops);
      var labels = document.getElementById(ids.labels);
      if (!walls || !tops || !labels) return;
      [walls, tops, labels].forEach(function (g) { while (g.firstChild) g.removeChild(g.firstChild); });
      var start = Math.PI * 0.75;
      var angle = start;
      var limit = start + TAU * frac;
      parts.forEach(function (p) {
        if (p.value <= 0) return;
        var sweep = (p.value / total) * TAU;
        var a0 = angle + GAP / 2;
        var a1 = Math.min(angle + sweep - GAP / 2, limit);
        angle += sweep;
        if (a1 <= a0) return;
        var large = (a1 - a0) > Math.PI ? 1 : 0;
        var o0 = pointAt(a0, RX, RY), o1 = pointAt(a1, RX, RY);
        var i1 = pointAt(a1, IRX, IRY), i0 = pointAt(a0, IRX, IRY);
        tops.appendChild(node('path', {
          'class': 'slice',
          fill: p.top,
          d: 'M ' + o0[0].toFixed(2) + ' ' + o0[1].toFixed(2) +
             ' A ' + RX + ' ' + RY + ' 0 ' + large + ' 1 ' + o1[0].toFixed(2) + ' ' + o1[1].toFixed(2) +
             ' L ' + i1[0].toFixed(2) + ' ' + i1[1].toFixed(2) +
             ' A ' + IRX + ' ' + IRY + ' 0 ' + large + ' 0 ' + i0[0].toFixed(2) + ' ' + i0[1].toFixed(2) + ' Z'
        }));
        var norm = function (a) { return ((a % TAU) + TAU) % TAU; };
        var n0 = norm(a0), n1 = norm(a1);
        var segs = n1 > n0 ? [[n0, n1]] : [[n0, TAU], [0, n1]];
        segs.forEach(function (seg) {
          var c0 = Math.max(seg[0], 0), c1 = Math.min(seg[1], Math.PI);
          if (c1 <= c0) return;
          var f0 = pointAt(c0, RX, RY), f1 = pointAt(c1, RX, RY);
          var b1 = pointAt(c1, RX, RY, DEPTH), b0 = pointAt(c0, RX, RY, DEPTH);
          var lg = (c1 - c0) > Math.PI ? 1 : 0;
          walls.appendChild(node('path', {
            fill: p.side,
            d: 'M ' + f0[0].toFixed(2) + ' ' + f0[1].toFixed(2) +
               ' A ' + RX + ' ' + RY + ' 0 ' + lg + ' 1 ' + f1[0].toFixed(2) + ' ' + f1[1].toFixed(2) +
               ' L ' + b1[0].toFixed(2) + ' ' + b1[1].toFixed(2) +
               ' A ' + RX + ' ' + RY + ' 0 ' + lg + ' 0 ' + b0[0].toFixed(2) + ' ' + b0[1].toFixed(2) + ' Z'
          }));
        });
        var pct = (p.value / total) * 100;
        if (frac >= 1 && pct >= 12) {
          var mid = (a0 + a1) / 2;
          var lp = pointAt(mid, (RX + IRX) / 2, (RY + IRY) / 2);
          var t = node('text', { 'class': 'slice-label', x: lp[0].toFixed(2), y: lp[1].toFixed(2) });
          t.textContent = pct.toFixed(1) + '%';
          labels.appendChild(t);
        }
      });
    };
    var showMuni = function (name) {
      var row = tblBody.querySelector('tr[data-muni="' + name + '"]');
      if (!row) { muniPanel.hidden = true; return; }
      var dict = I18N[currentLang] || I18N.sq;
      var parts = STATUS.map(function (s) {
        return { top: s.top, side: s.side, label: dict[s.key] || s.key, value: num(row.children[s.col]) };
      });
      var total = parts.reduce(function (a, p) { return a + p.value; }, 0);
      var hasStatus = STATUS.some(function (s) {
        var c = row.children[s.col];
        return c && !c.classList.contains('cell-empty');
      }) && total > 0;
      var chart = muniPanel.querySelector('.tot-chart');
      var noData = document.getElementById('muniNoData');
      if (chart) chart.hidden = !hasStatus;
      if (noData) noData.hidden = hasStatus;
      document.getElementById('muniName').textContent = name;
      document.getElementById('muniQark').textContent = row.getAttribute('data-qark') || '';
      document.getElementById('figSchemes').textContent = row.children[2].textContent.trim();
      document.getElementById('figSources').textContent = row.children[3].textContent.trim();
      document.getElementById('figKm').textContent = row.children[4].textContent.trim();
      var legend = document.getElementById('muniLegend');
      while (legend.firstChild) legend.removeChild(legend.firstChild);
      parts.forEach(function (p) {
        var pct = total ? (p.value / total) * 100 : 0;
        var li = document.createElement('li');
        li.innerHTML =
          '<i class="dot" style="background:' + p.top + '"></i>' +
          '<span class="lg-name">' + p.label + '</span>' +
          '<span class="lg-val">' + p.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') +
          ' <span class="lg-unit">km</span></span>' +
          '<span class="lg-pct">' + pct.toFixed(1) + '%</span>';
        legend.appendChild(li);
      });
      var desc = document.getElementById('donutDesc');
      if (desc) {
        desc.textContent = parts.map(function (p) {
          return p.label + ' ' + (total ? ((p.value / total) * 100).toFixed(1) : 0) + '%';
        }).join(', ') + '.';
      }
      if (hasStatus) drawDonut(parts, total);
      muniPanel.hidden = false;
    };
    var alMap = document.getElementById('alMap');
    var shapes = alMap ? alMap.querySelectorAll('.muni-shape') : [];
    var mapLabels = alMap ? alMap.querySelectorAll('.muni-label') : [];
    var paintMap = function (name) {
      if (!alMap) return;
      var on = !!name;
      alMap.classList.toggle('has-pick', on);
      Array.prototype.forEach.call(shapes, function (sh) {
        sh.classList.toggle('is-on', on && sh.getAttribute('data-muni') === name);
      });
      Array.prototype.forEach.call(mapLabels, function (lb) {
        lb.classList.toggle('is-on', on && lb.textContent === name);
      });
    };
    var tblSection = document.getElementById('tblSection');
    var alTotals = document.getElementById('alTotals');
    var INV = window.IDMIS_INVENTARI || {};
    var invShown = null;
    var escHtml = function (s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    var invNum = function (n) {
      return (n === null || n === undefined) ? '' : String(Math.round(n * 1000) / 1000);
    };
    var invPct = function (p) {
      return (p === null || p === undefined) ? '' : (p * 100).toFixed(2) + '%';
    };
    var renderInventory = function (name) {
      var wrap = document.getElementById('plWrap');
      var inv = INV[name];
      if (!wrap || !inv) { invShown = null; return false; }
      var d = I18N[currentLang] || I18N.sq;
      var L = function (k, fallback) { return escHtml(d[k] || fallback); };
      var multi = inv.sections.length > 1 || (inv.sections[0] && inv.sections[0].type === 'partial');
      var schemesLabel = function (n) {
        return n + ' ' + (n === 1 ? (d.plgSchemeOne || 'Skemë') : (d.plgSchemeMany || 'Skema'));
      };
      var html =
        '<table class="pl-grid">' +
        '<colgroup><col class="c-nr"><col class="c-code"><col class="c-name"><col class="c-src">' +
        '<col class="c-km"><col class="c-field"><col class="c-upd"><col class="c-pct"></colgroup>' +
        '<thead>' +
        '<tr class="pl-h1">' +
          '<th rowspan="2">' + L('plgNr', 'Nr.') + '</th>' +
          '<th colspan="2">' + L('plgSchemes', 'Skema Ujitëse') + '</th>' +
          '<th rowspan="2">' + L('plgSource', 'Burimi Ujor') + '</th>' +
          '<th rowspan="2">' + L('plgCanals', 'Kanale të Para dhe të Dyta në Km') + '</th>' +
          '<th rowspan="2">' + L('plgField', 'Identifikuar në Teren') + '</th>' +
          '<th colspan="2">' + L('plgUpdated', 'Përditësuar') + '</th>' +
        '</tr>' +
        '<tr class="pl-h2">' +
          '<th>' + L('plgCode', 'Kodi') + '</th><th>' + L('plgName', 'Emërtimi') + '</th>' +
          '<th>' + L('unitKm', 'Km') + '</th><th>%</th>' +
        '</tr>' +
        '</thead>';
      inv.sections.forEach(function (sec) {
        html += '<tbody>';
        if (multi) {
          html += '<tr class="pl-sec"><th colspan="8" scope="colgroup">' +
            (sec.type === 'partial' ? L('plgSecPartial', 'Skema të pjesërisht të transferuara')
                                    : L('plgSecFull', 'Skema të plota të transferuara')) +
            '</th></tr>';
        }
        sec.rows.forEach(function (r) {
          html += '<tr>' +
            '<td class="pl-c-nr">' + r[0] + '</td>' +
            '<td class="pl-c-code">' + escHtml(r[1]) + '</td>' +
            '<td class="pl-c-name">' + escHtml(r[2]) + '</td>' +
            '<td class="pl-c-src">' + escHtml(r[3]) + '</td>' +
            '<td class="pl-c-km">' + invNum(r[4]) + '</td>' +
            '<td class="pl-c-field">' + escHtml(r[5]) + '</td>' +
            '<td class="pl-c-upd">' + invNum(r[6]) + '</td>' +
            '<td class="pl-c-pct">' + invPct(r[7]) + '</td>' +
            '</tr>';
        });
        var t = sec.total;
        html += '<tr class="pl-total">' +
          '<td colspan="3">' + L('tblTotal', 'Totali') + '</td>' +
          '<td>' + escHtml(schemesLabel(t.count)) + '</td>' +
          '<td class="pl-c-km">' + invNum(t.km) + '</td>' +
          '<td></td>' +
          '<td class="pl-c-upd">' + invNum(t.upd) + '</td>' +
          '<td class="pl-c-pct">' + invPct(t.pct) + '</td>' +
          '</tr></tbody>';
      });
      wrap.innerHTML = html + '</table>';
      invShown = name;
      return true;
    };
    document.addEventListener('idms:langchange', function () {
      if (invShown) renderInventory(invShown);
    });
    var applyPick = function (v) {
      var oneMuni = (v !== '' && v !== 'all');
      if (oneMuni) { showMuni(v); paintMap(v); }
      else { muniPanel.hidden = true; paintMap(null); }
      if (alTotals) alTotals.hidden = oneMuni;
      var plPanel = document.getElementById('plPanel');
      if (plPanel) plPanel.hidden = !(oneMuni && renderInventory(v));
      if (tblSection) tblSection.hidden = true;
    };
    var totDonut = document.getElementById('totDonut');
    if (totDonut) {
      var TOT_IDS = { walls: 'totWalls', tops: 'totTops', labels: 'totLabels' };
      var totParts = [
        { top: '#2f7a43', side: '#1d4a28', value: 2864.11 },
        { top: '#c9a227', side: '#8a6a17', value: 2126.72 },
        { top: '#b3402f', side: '#7a2a1e', value: 1733.36 },
        { top: '#9aa79d', side: '#67736a', value: 1848.88 }
      ];
      var totSum = totParts.reduce(function (a, p) { return a + p.value; }, 0);
      var totDrawn = false;
      var runTotDonut = function () {
        if (totDrawn) return;
        totDrawn = true;
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) { drawDonut(totParts, totSum, TOT_IDS); return; }
        var DUR = 900, t0 = null;
        var step = function (ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min((ts - t0) / DUR, 1);
          var eased = 1 - Math.pow(1 - k, 3);
          drawDonut(totParts, totSum, TOT_IDS, eased);
          if (k < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { runTotDonut(); io.disconnect(); }
          });
        }, { threshold: 0.35 });
        io.observe(totDonut);
      } else {
        runTotDonut();
      }
    }
    muniPick.addEventListener('change', function () { applyPick(muniPick.value); });
    applyPick(muniPick.value);
    Array.prototype.forEach.call(shapes, function (sh) {
      sh.addEventListener('click', function () {
        var name = sh.getAttribute('data-muni');
        if (SCOPE) return;
        var next = (muniPick.value === name) ? 'all' : name;
        muniPick.value = next;
        applyPick(next);
        filterTable();
      });
    });
    document.addEventListener('idms:langchange', function () {
      var v = muniPick.value;
      if (v && v !== 'all') showMuni(v);
    });
  }
  var docTabs = document.querySelectorAll('.doc-tabs [role="tab"]');
  var docFlow = document.getElementById('docFlow');
  if (docTabs.length) {
    var selectDocTab = function (tab) {
      docTabs.forEach(function (t, i) {
        var on = t === tab;
        if (on && docFlow) docFlow.setAttribute('data-active', i);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    };
    docTabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectDocTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = docTabs.length, next = null;
        if (e.key === 'ArrowRight') next = docTabs[(i + 1) % n];
        else if (e.key === 'ArrowLeft') next = docTabs[(i - 1 + n) % n];
        else if (e.key === 'Home') next = docTabs[0];
        else if (e.key === 'End') next = docTabs[n - 1];
        if (next) { e.preventDefault(); selectDocTab(next); next.focus(); }
      });
    });
  }
  var TAR_STORE = 'idms-tarifat';
  var TAR_COLS = ['ujitja', 'kullimi', 'kanalHapur', 'sistemMbyllur', 'pompaPrivate'];
  var tarData = window.IDMIS_TARIFAT_BASHKI;
  var tarT = function (key) { return (I18N[currentLang] || I18N.sq)[key] || I18N.sq[key] || ''; };
  var tarPage = /\/Account\//i.test(location.pathname) ? '../' : '';
  var readTariffStore = function () {
    try {
      var saved = JSON.parse(localStorage.getItem(TAR_STORE));
      return (saved && typeof saved === 'object') ? saved : {};
    } catch (e) { return {}; }
  };
  var applyTariffStore = function () {
    if (!Array.isArray(tarData)) return;
    var saved = readTariffStore();
    tarData.forEach(function (m) {
      var s = saved[m.bashkia];
      if (!s) return;
      TAR_COLS.forEach(function (k) { if (k in s) m[k] = s[k]; });
      m.updated = s.updated || null;
    });
  };
  var saveTariffs = function (m, values) {
    var saved = readTariffStore();
    var entry = { updated: new Date().toISOString() };
    TAR_COLS.forEach(function (k) { entry[k] = values[k]; });
    saved[m.bashkia] = entry;
    try {
      localStorage.setItem(TAR_STORE, JSON.stringify(saved));
    } catch (e) { return false; }
    TAR_COLS.forEach(function (k) { m[k] = entry[k]; });
    m.updated = entry.updated;
    return true;
  };
  var formatTariffDate = function (iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(currentLang === 'en' ? 'en-GB' : 'sq-AL',
      { day: 'numeric', month: 'long', year: 'numeric' });
  };
  applyTariffStore();
  var tarMap = document.getElementById('tarMap');
  if (tarMap && Array.isArray(tarData)) {
    var tarPanelIdle = document.getElementById('tarPanelIdle');
    var tarPanelMuni = document.getElementById('tarPanelMuni');
    var tarPanelUpdated = document.getElementById('tarPanelUpdated');
    var tarPicked = null;
    var isSet = function (v) { return v !== null && v !== undefined && v !== ''; };
    var hasTariff = function (m) { return TAR_COLS.some(function (k) { return isSet(m[k]); }); };
    var putValue = function (el, v) {
      el.textContent = '';
      if (isSet(v)) { el.textContent = v; return; }
      var dash = document.createElement('span');
      dash.className = 'val-empty';
      dash.setAttribute('data-i18n-title', 'tarEmptyTitle');
      dash.title = tarT('tarEmptyTitle');
      dash.textContent = '—';
      el.appendChild(dash);
    };
    var byName = {};
    tarData.forEach(function (m) { byName[m.bashkia] = m; });
    var tarShapes = tarMap.querySelectorAll('.muni-shape');
    var tarMapLabels = tarMap.querySelectorAll('.muni-label');
    var figSet = document.getElementById('tarFigSet');
    var figUnset = document.getElementById('tarFigUnset');
    var renderPanel = function () {
      if (!tarPanelIdle || !tarPanelMuni) return;
      tarPanelIdle.hidden = !!tarPicked;
      tarPanelMuni.hidden = !tarPicked;
      if (!tarPicked) return;
      var m = byName[tarPicked];
      document.getElementById('tarPanelQark').textContent = m.qarku;
      document.getElementById('tarPanelName').textContent = m.bashkia;
      tarPanelMuni.querySelectorAll('[data-key]').forEach(function (dd) {
        putValue(dd, m[dd.getAttribute('data-key')]);
      });
      if (tarPanelUpdated) {
        var when = m.updated ? formatTariffDate(m.updated) : '';
        tarPanelUpdated.textContent = when ? tarT('tarUpdated').replace('{d}', when) : '';
        tarPanelUpdated.hidden = !when;
      }
    };
    var renderTariffMap = function () {
      var withTariff = 0;
      tarShapes.forEach(function (sh) {
        var m = byName[sh.getAttribute('data-muni')];
        var on = !!(m && hasTariff(m));
        sh.classList.toggle('has-tariff', on);
      });
      tarData.forEach(function (m) { if (hasTariff(m)) withTariff++; });
      if (figSet) figSet.textContent = withTariff;
      if (figUnset) figUnset.textContent = tarData.length - withTariff;
      renderPanel();
    };
    var pickTariffMuni = function (name) {
      tarPicked = (name && byName[name]) ? name : null;
      tarMap.classList.toggle('has-pick', !!tarPicked);
      tarShapes.forEach(function (sh) {
        var on = sh.getAttribute('data-muni') === tarPicked;
        sh.classList.toggle('is-on', on);
        sh.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      tarMapLabels.forEach(function (lb) { lb.classList.toggle('is-on', lb.textContent === tarPicked); });
      renderPanel();
    };
    var toggleTariffMuni = function (name) {
      pickTariffMuni(tarPicked === name ? null : name);
    };
    tarShapes.forEach(function (sh) {
      var name = sh.getAttribute('data-muni');
      sh.setAttribute('tabindex', '0');
      sh.setAttribute('role', 'button');
      sh.setAttribute('aria-label', name);
      sh.setAttribute('aria-pressed', 'false');
      sh.addEventListener('click', function () { toggleTariffMuni(name); });
      sh.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTariffMuni(name); }
      });
    });
    window.addEventListener('storage', function (e) {
      if (e.key !== TAR_STORE) return;
      applyTariffStore();
      renderTariffMap();
    });
    document.addEventListener('idms:langchange', renderPanel);
    renderTariffMap();
    var fromHash = '';
    try { fromHash = decodeURIComponent(location.hash.slice(1)); } catch (e) {}
    if (byName[fromHash]) pickTariffMuni(fromHash);
  }
  var tarForm = document.getElementById('tarForm');
  if (tarForm && Array.isArray(tarData)) {
    var tfMuni = document.getElementById('tarFormMuni');
    var tfSets = tarForm.querySelectorAll('.tar-fieldset');
    var tfHint = document.getElementById('tarLockHint');
    var tfStatus = document.getElementById('tarFormStatus');
    var TF_FIELDS = {
      tarUjitja: 'ujitja', tarKullimi: 'kullimi', tarKanalHapur: 'kanalHapur',
      tarSistemMbyllur: 'sistemMbyllur', tarPompaPrivate: 'pompaPrivate'
    };
    var tfResult = null;
    var groups = {};
    tarData.forEach(function (m, i) {
      if (!groups[m.qarku]) {
        groups[m.qarku] = document.createElement('optgroup');
        groups[m.qarku].label = m.qarku;
      }
      var o = document.createElement('option');
      o.value = i;
      o.textContent = m.bashkia;
      groups[m.qarku].appendChild(o);
    });
    Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, 'sq'); })
      .forEach(function (q) { tfMuni.appendChild(groups[q]); });
    var setError = function (input, key) {
      var err = document.getElementById(input.id + '-err');
      if (key) {
        err.setAttribute('data-i18n', key);
        err.textContent = tarT(key);
        err.hidden = false;
        input.setAttribute('aria-invalid', 'true');
      } else {
        err.hidden = true;
        input.removeAttribute('aria-invalid');
      }
    };
    var showStatus = function () {
      tfStatus.textContent = '';
      tfStatus.classList.remove('is-error');
      if (!tfResult) { tfStatus.hidden = true; return; }
      if (!tfResult.ok) {
        tfStatus.classList.add('is-error');
        tfStatus.textContent = tarT('frmSaveFail');
      } else {
        var msg = document.createElement('span');
        msg.textContent = tarT('frmSaved').replace('{m}', tfResult.name) + ' ';
        var link = document.createElement('a');
        link.className = 'tar-form-link';
        link.href = tarPage + 'tarifa-sipas-bashkise.html#' + encodeURIComponent(tfResult.name);
        link.textContent = tarT('frmViewLink');
        tfStatus.append(msg, link);
      }
      tfStatus.hidden = false;
    };
    var clearMessages = function () {
      setError(tfMuni, null);
      Object.keys(TF_FIELDS).forEach(function (id) { setError(document.getElementById(id), null); });
      tfResult = null;
      showStatus();
    };
    var loadMuni = function () {
      var m = tarData[tfMuni.value];
      tfSets.forEach(function (fs) { fs.disabled = !m; });
      tfHint.hidden = !!m;
      Object.keys(TF_FIELDS).forEach(function (id) {
        var v = m ? m[TF_FIELDS[id]] : null;
        document.getElementById(id).value = (v === null || v === undefined) ? '' : v;
      });
      clearMessages();
    };
    tfMuni.addEventListener('change', loadMuni);
    var tfScope = function () { if (SCOPE && tarData.length) { tfMuni.value = '0'; tfMuni.disabled = true; } };
    tfScope();
    if (SCOPE && tarData.length) loadMuni();
    tarForm.addEventListener('reset', function () { setTimeout(function () { tfScope(); loadMuni(); }, 0); });
    tarForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearMessages();
      var m = tarData[tfMuni.value];
      if (!m) {
        setError(tfMuni, 'frmErrMuni');
        tfMuni.focus();
        return;
      }
      var firstBad = null, values = {};
      Object.keys(TF_FIELDS).forEach(function (id) {
        var input = document.getElementById(id);
        var raw = input.value.trim();
        if (raw === '' && !input.validity.badInput) { values[TF_FIELDS[id]] = null; return; }
        var n = Number(raw);
        if (input.validity.badInput || raw === '' || !isFinite(n) || n < 0) {
          setError(input, 'frmErrNum');
          if (!firstBad) firstBad = input;
        } else {
          values[TF_FIELDS[id]] = n;
        }
      });
      if (firstBad) { firstBad.focus(); return; }
      tfResult = { ok: saveTariffs(m, values), name: m.bashkia };
      showStatus();
    });
    document.addEventListener('idms:langchange', showStatus);
  }
  var astForm = document.getElementById('astForm');
  var astBody = document.getElementById('astBody');
  if (astForm && astBody && Array.isArray(tarData)) {
    var AST_STORE = 'idms-asetet';
    var AST_TYPES = {
      skema: 'astTypeSkema', dige: 'astTypeDige', stacion: 'astTypeStacion', hidrovor: 'astTypeHidrovor',
      rezervuar: 'astTypeRezervuar', makineri: 'astTypeMakineri'
    };
    var AST_STATUS = { funksional: 'astStFunk', pjeserisht: 'astStPjes', jofunksional: 'astStJo' };
    var AST_SPECS = {
      skema: [{ id: 'astSkemaCode', key: 'kodi', label: 'astSpecCode' },
              { id: 'astSkemaArea', key: 'siperfaqja', label: 'astSpecArea', unit: 'ha', num: true },
              { id: 'astSkemaCanals', key: 'kanalet', label: 'astSpecCanals', unit: 'km', num: true }],
      hidrovor: [{ id: 'astHvCap', key: 'kapaciteti', label: 'astSpecCap', unit: 'm\u00b3/s', num: true },
                 { id: 'astHvPower', key: 'fuqia', label: 'astSpecPowerInst', unit: 'kW', num: true },
                 { id: 'astHvArea', key: 'siperfaqja', label: 'astSpecDrainArea', unit: 'ha', num: true }],
      dige: [{ id: 'astDigeHeight', key: 'lartesia', label: 'astSpecHeight', unit: 'm', num: true },
             { id: 'astDigeLength', key: 'gjatesia', label: 'astSpecLength', unit: 'm', num: true }],
      stacion: [{ id: 'astPsCap', key: 'kapaciteti', label: 'astSpecCap', unit: 'l/s', num: true },
                { id: 'astPsPower', key: 'fuqia', label: 'astSpecPower', unit: 'kW', num: true }],
      rezervuar: [{ id: 'astResVol', key: 'vellimi', label: 'astSpecVol', unit: 'm³', num: true },
                  { id: 'astResArea', key: 'siperfaqja', label: 'astSpecArea', unit: 'ha', num: true }],
      makineri: [{ id: 'astMachKind', key: 'llojiMakinerise', label: 'astSpecKind' },
                 { id: 'astMachPlate', key: 'targa', label: 'astSpecPlate' }]
    };
    var $a = function (id) { return document.getElementById(id); };
    var astMuni = $a('astMuni'), astType = $a('astType'), astName = $a('astName');
    var astStatus = $a('astStatus'), astYear = $a('astYear'), astNotes = $a('astNotes');
    var astSpecSet = $a('astSpecSet'), astSpecHint = $a('astSpecHint');
    var astSearch = $a('astSearch'), astFilterMuni = $a('astFilterMuni'), astFilterType = $a('astFilterType');
    var astFlash = $a('astFlash');
    var astFlashKey = '';
    var astEditing = false;
    var thisYear = new Date().getFullYear();
    astYear.max = thisYear;
    var readAssets = function () {
      try {
        var list = JSON.parse(localStorage.getItem(AST_STORE));
        return Array.isArray(list) ? list : [];
      } catch (e) { return []; }
    };
    var writeAssets = function (list) {
      try { localStorage.setItem(AST_STORE, JSON.stringify(list)); return true; } catch (e) { return false; }
    };
    var foldA = function (s) {
      return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    };
    var qarkOf = {};
    tarData.forEach(function (m) { qarkOf[m.bashkia] = m.qarku; });
    [astMuni, astFilterMuni].forEach(function (sel) {
      var groups = {};
      tarData.forEach(function (m) {
        if (!groups[m.qarku]) { groups[m.qarku] = document.createElement('optgroup'); groups[m.qarku].label = m.qarku; }
        var o = document.createElement('option');
        o.value = m.bashkia;
        o.textContent = m.bashkia;
        groups[m.qarku].appendChild(o);
      });
      Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, 'sq'); })
        .forEach(function (q) { sel.appendChild(groups[q]); });
    });
    var specSummary = function (a) {
      return (AST_SPECS[a.lloji] || []).map(function (s) {
        var v = a.specs && a.specs[s.key];
        if (v === null || v === undefined || v === '') return '';
        var shown = s.num ? Number(v).toLocaleString(currentLang === 'en' ? 'en-GB' : 'sq-AL') : v;
        return tarT(s.label) + ' ' + shown + (s.unit ? ' ' + s.unit : '');
      }).filter(Boolean).join(' · ');
    };
    var showFlash = function () {
      astFlash.hidden = !astFlashKey;
      astFlash.classList.toggle('is-error', astFlashKey === 'frmSaveFail');
      if (astFlashKey) astFlash.textContent = tarT(astFlashKey);
    };
    var renderAssets = function () {
      var all = readAssets();
      Object.keys(AST_TYPES).forEach(function (t) {
        var n = all.filter(function (a) { return a.lloji === t; }).length;
        $a('astStat-' + t).textContent = n;
      });
      var q = foldA(astSearch.value), fm = astFilterMuni.value, ft = astFilterType.value;
      var shown = all.filter(function (a) {
        return (!q || foldA(a.emertimi).indexOf(q) !== -1) && (!fm || a.bashkia === fm) && (!ft || a.lloji === ft);
      }).sort(function (x, y) { return String(y.updated).localeCompare(String(x.updated)); });
      astBody.textContent = '';
      shown.forEach(function (a) {
        var tr = document.createElement('tr');
        var cell = function (text, cls) {
          var td = document.createElement('td');
          if (cls) td.className = cls;
          td.textContent = text;
          tr.appendChild(td);
          return td;
        };
        var name = document.createElement('th');
        name.scope = 'row';
        name.className = 'ast-name';
        name.textContent = a.emertimi;
        tr.appendChild(name);
        cell(tarT(AST_TYPES[a.lloji]));
        var muni = cell(a.bashkia);
        var qk = document.createElement('span');
        qk.className = 'ast-qark';
        qk.textContent = a.qarku || qarkOf[a.bashkia] || '';
        muni.appendChild(qk);
        var st = cell('');
        var badge = document.createElement('span');
        badge.className = 'ast-badge ast-badge-' + a.gjendja;
        badge.textContent = tarT(AST_STATUS[a.gjendja]);
        st.appendChild(badge);
        cell(specSummary(a) || '—', 'ast-specs');
        cell(a.viti || '—', 'num');
        cell(a.updated ? formatTariffDate(a.updated) : '', 'ast-date');
        var act = cell('', 'ast-actions');
        var edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'ast-act';
        edit.textContent = tarT('astEdit');
        edit.setAttribute('aria-label', tarT('astEdit') + ': ' + a.emertimi);
        edit.addEventListener('click', function () { editAsset(a.id); });
        var del = document.createElement('button');
        del.type = 'button';
        del.className = 'ast-act ast-act-danger';
        del.textContent = tarT('astDelete');
        del.setAttribute('aria-label', tarT('astDelete') + ': ' + a.emertimi);
        del.addEventListener('click', function () { deleteAsset(a.id); });
        act.append(edit, del);
        astBody.appendChild(tr);
      });
      $a('astEmpty').hidden = all.length !== 0;
      $a('astNoMatch').hidden = !(all.length && !shown.length);
      astBody.closest('table').hidden = !shown.length;
      $a('astCount').textContent = all.length
        ? tarT('astCount').replace('{n}', shown.length).replace('{total}', all.length) : '';
    };
    var setAstError = function (input, key) {
      var err = $a(input.id + '-err');
      if (!err) return;
      if (key) {
        err.setAttribute('data-i18n', key);
        err.textContent = tarT(key);
        err.hidden = false;
        input.setAttribute('aria-invalid', 'true');
      } else {
        err.hidden = true;
        input.removeAttribute('aria-invalid');
      }
    };
    var clearAstErrors = function () {
      astForm.querySelectorAll('input, select, textarea').forEach(function (el) { setAstError(el, null); });
    };
    var showSpecs = function () {
      var t = astType.value;
      astSpecSet.disabled = !AST_SPECS[t];
      astSpecHint.hidden = !!AST_SPECS[t];
      astSpecSet.querySelectorAll('[data-spec]').forEach(function (g) { g.hidden = g.getAttribute('data-spec') !== t; });
    };
    var resetAstForm = function () {
      astForm.reset();
      $a('astId').value = '';
      $a('astFormTitle').setAttribute('data-i18n', 'astNavAdd');
      $a('astFormTitle').textContent = tarT('astNavAdd');
      clearAstErrors();
      showSpecs();
    };
    var editAsset = function (id) {
      var a = readAssets().filter(function (x) { return x.id === id; })[0];
      if (!a) return;
      resetAstForm();
      $a('astId').value = a.id;
      astMuni.value = a.bashkia;
      astType.value = a.lloji;
      astName.value = a.emertimi;
      astStatus.value = a.gjendja;
      astYear.value = a.viti || '';
      astNotes.value = a.shenime || '';
      showSpecs();
      (AST_SPECS[a.lloji] || []).forEach(function (s) {
        var v = a.specs && a.specs[s.key];
        $a(s.id).value = (v === null || v === undefined) ? '' : v;
      });
      $a('astFormTitle').setAttribute('data-i18n', 'astFormEdit');
      $a('astFormTitle').textContent = tarT('astFormEdit');
      if (location.hash === '#shto') return;
      astEditing = true;
      location.hash = 'shto';
    };
    var deleteAsset = function (id) {
      var list = readAssets();
      var a = list.filter(function (x) { return x.id === id; })[0];
      if (!a || !window.confirm(tarT('astDeleteConfirm').replace('{n}', a.emertimi))) return;
      astFlashKey = writeAssets(list.filter(function (x) { return x.id !== id; })) ? 'astDeleted' : 'frmSaveFail';
      showFlash();
      renderAssets();
    };
    astType.addEventListener('change', function () {
      astSpecSet.querySelectorAll('[data-spec] input').forEach(function (i) { i.value = ''; setAstError(i, null); });
      showSpecs();
    });
    astForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAstErrors();
      var firstBad = null;
      var bad = function (input, key) { setAstError(input, key); if (!firstBad) firstBad = input; };
      if (!astMuni.value) bad(astMuni, 'astErrReq');
      if (!AST_TYPES[astType.value]) bad(astType, 'astErrReq');
      if (!astName.value.trim()) bad(astName, 'astErrReq');
      if (!AST_STATUS[astStatus.value]) bad(astStatus, 'astErrReq');
      var year = astYear.value.trim();
      if (astYear.validity.badInput || (year && (!/^\d{4}$/.test(year) || +year < 1900 || +year > thisYear))) bad(astYear, 'astErrYear');
      var specs = {};
      (AST_SPECS[astType.value] || []).forEach(function (s) {
        var input = $a(s.id), raw = input.value.trim();
        if (!s.num) { specs[s.key] = raw || null; return; }
        if (raw === '' && !input.validity.badInput) { specs[s.key] = null; return; }
        var n = Number(raw);
        if (input.validity.badInput || !isFinite(n) || n < 0) bad(input, 'frmErrNum');
        else specs[s.key] = n;
      });
      if (firstBad) { firstBad.focus(); return; }
      var list = readAssets();
      var id = $a('astId').value || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
      var asset = {
        id: id,
        bashkia: astMuni.value,
        qarku: qarkOf[astMuni.value] || '',
        lloji: astType.value,
        emertimi: astName.value.trim(),
        gjendja: astStatus.value,
        viti: year ? +year : null,
        specs: specs,
        shenime: astNotes.value.trim(),
        updated: new Date().toISOString()
      };
      var at = -1;
      list.forEach(function (x, i) { if (x.id === id) at = i; });
      if (at === -1) list.push(asset); else list[at] = asset;
      astFlashKey = writeAssets(list) ? 'frmSaved' : 'frmSaveFail';
      if (astFlashKey === 'frmSaved') {
        resetAstForm();
        location.hash = 'lista';
      }
      showFlash();
      renderAssets();
    });
    $a('astCancel').addEventListener('click', function () {
      resetAstForm();
      location.hash = 'lista';
    });
    window.addEventListener('hashchange', function () {
      if (location.hash === '#shto' && !astEditing) {
        resetAstForm();
        if (AST_TYPES[astFilterType.value]) { astType.value = astFilterType.value; showSpecs(); }
      }
      astEditing = false;
      if (location.hash !== '#lista' && location.hash !== '') { astFlashKey = ''; showFlash(); }
    });
    var astLabels = function () {
      document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
        var v = tarT(el.getAttribute('data-i18n-ph'));
        if (v) el.placeholder = v;
      });
      showFlash();
      renderAssets();
    };
    astSearch.addEventListener('input', renderAssets);
    [astFilterMuni, astFilterType].forEach(function (el) { el.addEventListener('change', renderAssets); });
    window.addEventListener('storage', function (e) { if (e.key === AST_STORE) renderAssets(); });
    document.addEventListener('idms:langchange', astLabels);
    showSpecs();
    astLabels();
  }
  var msShell = document.querySelector('.ms-shell');
  if (msShell) {
    var msNav = msShell.querySelector('.ms-nav');
    var msActive = msShell.querySelector('.ms-link.is-active');
    if (msNav) {
      try {
        var navTop = +sessionStorage.getItem('idms-ms-nav-top');
        if (navTop) msNav.scrollTop = navTop;
      } catch (e) {}
      window.addEventListener('pagehide', function () {
        try { sessionStorage.setItem('idms-ms-nav-top', String(msNav.scrollTop)); } catch (e) {}
      });
    }
    if (msNav && msActive && msNav.scrollWidth > msNav.clientWidth) {
      msNav.scrollLeft = msActive.offsetLeft - (msNav.clientWidth - msActive.offsetWidth) / 2;
    }
    if (msNav && msActive) {
      var msInd = document.createElement('span');
      msInd.className = 'ms-ind';
      msInd.setAttribute('aria-hidden', 'true');
      msNav.insertBefore(msInd, msNav.firstChild);
      msNav.classList.add('has-ind');
      document.documentElement.classList.remove('ms-from');
      var msPlace = function () {
        msInd.style.height = msActive.offsetHeight + 'px';
        msInd.style.transform = 'translateY(' + msActive.offsetTop + 'px)';
      };
      msPlace();
      window.addEventListener('resize', msPlace);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(msPlace);
      var msFrom = null;
      try {
        msFrom = JSON.parse(sessionStorage.getItem('idms-ms-from'));
        sessionStorage.removeItem('idms-ms-from');
      } catch (e) {}
      var msCalm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (msFrom && msFrom.to === location.pathname && msFrom.top !== msActive.offsetTop && msInd.animate && !msCalm) {
        msInd.animate([
          { transform: 'translateY(' + msFrom.top + 'px)', height: msFrom.h + 'px' },
          { transform: 'translateY(' + msActive.offsetTop + 'px)', height: msActive.offsetHeight + 'px' }
        ], { duration: 650, delay: 80, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' });
      }
      msNav.addEventListener('click', function (e) {
        var a = e.target.closest('a.ms-link');
        if (!a || a === msActive) return;
        try {
          sessionStorage.setItem('idms-ms-from', JSON.stringify({
            to: new URL(a.href, location.href).pathname, top: msActive.offsetTop, h: msActive.offsetHeight
          }));
        } catch (e2) {}
      });
    }
  }
  var msMuniBox = document.getElementById('msMuniBox');
  if (msMuniBox && Array.isArray(tarData)) {
    var msMuni = document.getElementById('msMuni');
    var msMuniBtn = document.getElementById('msMuniBtn');
    var msMuniVal = document.getElementById('msMuniVal');
    var msMuniPop = document.getElementById('msMuniPop');
    var msMuniSearch = document.getElementById('msMuniSearch');
    var msMuniList = document.getElementById('msMuniList');
    var msMuniNone = document.getElementById('msMuniNone');
    var msOpts = [];
    var msCur = -1;
    var msFold = function (s) {
      return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    };
    var msQarks = {};
    tarData.forEach(function (m) { (msQarks[m.qarku] = msQarks[m.qarku] || []).push(m.bashkia); });
    var msQarkNames = Object.keys(msQarks).sort(function (a, b) { return a.localeCompare(b, 'sq'); });
    var msLabel = function (li, text, q) {
      var span = document.createElement('span');
      var at = q ? msFold(text).indexOf(q) : -1;
      if (at < 0) span.textContent = text;
      else {
        var mark = document.createElement('mark');
        mark.textContent = text.slice(at, at + q.length);
        span.append(text.slice(0, at), mark, text.slice(at + q.length));
      }
      li.appendChild(span);
    };
    var msSetActive = function (i) {
      if (msCur >= 0 && msOpts[msCur]) msOpts[msCur].classList.remove('is-active');
      msCur = i;
      var li = msOpts[i];
      if (!li) { msMuniSearch.removeAttribute('aria-activedescendant'); return; }
      li.classList.add('is-active');
      msMuniSearch.setAttribute('aria-activedescendant', li.id);
      li.scrollIntoView({ block: 'nearest' });
    };
    var msRender = function () {
      var q = msFold(msMuniSearch.value.trim());
      msMuniList.textContent = '';
      msOpts = [];
      var addOpt = function (value, text) {
        var li = document.createElement('li');
        li.className = 'ms-muni-opt';
        li.id = 'msMuniOpt' + msOpts.length;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', value === msMuni.value ? 'true' : 'false');
        li.dataset.value = value;
        msLabel(li, text, q);
        msMuniList.appendChild(li);
        msOpts.push(li);
      };
      if (!q && !SCOPE) addOpt('', tarT('astFilterMuniAll'));
      msQarkNames.forEach(function (qark) {
        var qarkHit = q && msFold(qark).indexOf(q) >= 0;
        var hits = msQarks[qark].filter(function (b) { return !q || qarkHit || msFold(b).indexOf(q) >= 0; });
        if (!hits.length) return;
        var head = document.createElement('li');
        head.className = 'ms-muni-grp';
        head.setAttribute('role', 'presentation');
        head.textContent = qark;
        msMuniList.appendChild(head);
        hits.forEach(function (b) { addOpt(b, b); });
      });
      msMuniNone.hidden = msOpts.length > 0;
      var sel = -1;
      msOpts.forEach(function (li, i) { if (li.dataset.value === msMuni.value) sel = i; });
      msCur = -1;
      msSetActive(q ? 0 : Math.max(sel, 0));
    };
    var msShowValue = function () {
      if (msMuni.value) {
        msMuniVal.removeAttribute('data-i18n');
        msMuniVal.textContent = msMuni.value;
      } else {
        msMuniVal.setAttribute('data-i18n', 'astFilterMuniAll');
        msMuniVal.textContent = tarT('astFilterMuniAll');
      }
    };
    var msOpen = function () {
      msMuniPop.hidden = false;
      msMuniBtn.setAttribute('aria-expanded', 'true');
      msMuniSearch.value = '';
      msRender();
      msMuniSearch.focus();
    };
    var msClose = function (refocus) {
      if (msMuniPop.hidden) return;
      msMuniPop.hidden = true;
      msMuniBtn.setAttribute('aria-expanded', 'false');
      if (refocus) msMuniBtn.focus();
    };
    var msPick = function (value) {
      var changed = value !== msMuni.value;
      msMuni.value = value;
      msShowValue();
      msClose(true);
      if (!changed) return;
      try { localStorage.setItem('idms-ms-bashkia', value); } catch (e) {}
      document.dispatchEvent(new CustomEvent('idms:munichange', { detail: value }));
    };
    var msSaved = '';
    try { msSaved = localStorage.getItem('idms-ms-bashkia') || ''; } catch (e) {}
    if (tarData.some(function (m) { return m.bashkia === msSaved; })) msMuni.value = msSaved;
    msShowValue();
    msMuniSearch.placeholder = tarT('msMuniSearch');
    if (SCOPE) {
      msMuni.value = SCOPE.data;
      msShowValue();
      msMuniBtn.disabled = true;
      msMuniBtn.setAttribute('aria-disabled', 'true');
    }
    msMuniBtn.addEventListener('click', function () {
      if (msMuniPop.hidden) msOpen(); else msClose(false);
    });
    msMuniBtn.addEventListener('keydown', function (e) {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && msMuniPop.hidden) { e.preventDefault(); msOpen(); }
    });
    msMuniSearch.addEventListener('input', msRender);
    msMuniSearch.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); msSetActive(Math.min(msCur + 1, msOpts.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); msSetActive(Math.max(msCur - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (msOpts[msCur]) msPick(msOpts[msCur].dataset.value); }
      else if (e.key === 'Escape') { e.preventDefault(); msClose(true); }
      else if (e.key === 'Tab') msClose(false);
    });
    msMuniList.addEventListener('mousedown', function (e) { e.preventDefault(); });
    msMuniList.addEventListener('click', function (e) {
      var li = e.target.closest('.ms-muni-opt');
      if (li) msPick(li.dataset.value);
    });
    msMuniList.addEventListener('mousemove', function (e) {
      var li = e.target.closest('.ms-muni-opt');
      if (li && msOpts.indexOf(li) !== msCur) msSetActive(msOpts.indexOf(li));
    });
    document.addEventListener('mousedown', function (e) {
      if (!msMuniBox.contains(e.target)) msClose(false);
    });
    document.addEventListener('idms:langchange', function () {
      msMuniSearch.placeholder = tarT('msMuniSearch');
      msShowValue();
      if (!msMuniPop.hidden) msRender();
    });
    document.addEventListener('idms:pickmuni', function (e) { if (!SCOPE) msPick(e.detail || ''); });
  }
  var xlEsc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  var xlWhen = function (iso) {
    var d = new Date(iso);
    if (!iso || isNaN(d)) return '';
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  };
  var xlEditor = function (o) {
    var save = document.getElementById('msSave');
    var api = { mode: 'view' };
    var sel = {}, draft = {}, bad = {}, fresh = {}, seq = 0;
    var modeFromHash = function () {
      var m = location.hash === '#perditeso' ? 'edit' : location.hash === '#shto' ? 'add' : 'view';
      return m === 'add' && o.formAdd ? 'view' : m;
    };
    var readStore = function () {
      if (!o.store) return {};
      try { var v = JSON.parse(localStorage.getItem(o.store)); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
    };
    var fieldDef = function (f) { return o.fields.filter(function (d) { return d.f === f; })[0]; };
    api.rows = function (table, scope) {
      var own = scope == null || scope === o.scope();
      var mine = readStore()[own ? o.scope() : scope] || {};
      var added = ((mine.__added || {})[table.id] || []).map(function (r) { return Object.assign({ added: true }, r); })
        .filter(function (r) { return !o.include || o.include(r); });
      var list = table.rows.map(function (r) { return Object.assign({}, r, { key: o.keyOf(r) }); }).concat(added);
      if (own && api.mode === 'add') list = list.concat((fresh[table.id] || []).map(function (r) { return Object.assign({ isNew: true }, r); }));
      return list.map(function (r) {
        var m = Object.assign({}, r, r.added || r.isNew ? {} : mine[r.key] || {}, own ? draft[r.key] || {} : {});
        m.table = table.id;
        m.edited = !!(r.added || mine[r.key] || r.perditesuarMe);
        return m;
      });
    };
    api.editing = function (r) { return (api.mode === 'edit' && !!sel[r.key]) || !!r.isNew; };
    api.rowClass = function (r) {
      return [api.editing(r) ? 'is-sel' : '', r.edited ? 'is-edited' : '', bad[r.key] ? 'is-invalid' : ''].join(' ').trim();
    };
    api.hasLead = function () { return api.mode !== 'view'; };
    api.lead = function (r, label) {
      if (api.mode === 'edit') {
        return '<td class="c sk-chk"><input type="checkbox" data-xl-row="' + xlEsc(r.key) + '"' + (sel[r.key] ? ' checked' : '') +
          ' aria-label="' + xlEsc(tarT('skSelectRow').replace('{r}', label)) + '"></td>';
      }
      if (api.mode === 'add') {
        return '<td class="c sk-chk">' + (r.isNew ? '<button type="button" class="xl-del" data-xl-del="' + xlEsc(r.key) + '" aria-label="' +
          xlEsc(tarT('xlRemove')) + '" title="' + xlEsc(tarT('xlRemove')) + '">×</button>' : '') + '</td>';
      }
      return '';
    };
    api.headLead = function (tableId, rows, rowspan) {
      if (api.mode === 'view') return '';
      var all = api.mode === 'edit' && rows.length && rows.every(function (r) { return sel[r.key]; });
      return '<th rowspan="' + (rowspan || 1) + '" class="sk-chk" scope="col">' + (api.mode === 'edit'
        ? '<input type="checkbox" data-xl-all="' + tableId + '"' + (all ? ' checked' : '') + ' aria-label="' + xlEsc(tarT('skSelectAll')) + '">'
        : '') + '</th>';
    };
    api.input = function (r, f, label) {
      var d = fieldDef(f), v = r[f];
      var a = ' class="sk-in' + (d.type === 'num' || d.type === 'int' ? ' sk-in-num' : '') + '" data-field="' + f + '" aria-label="' +
        xlEsc(tarT(d.label) + (label ? ' — ' + label : '')) + '"';
      if (d.type === 'bool') {
        return '<select' + a + '><option value=""' + (v ? '' : ' selected') + '>–</option>' +
          '<option value="1"' + (v ? ' selected' : '') + '>' + xlEsc(tarT('skYes')) + '</option></select>';
      }
      if (d.type === 'select') {
        var opts = d.options();
        if (v && opts.indexOf(v) < 0) opts = opts.concat([v]);
        return '<select' + a + '>' + (d.required ? '' : '<option value=""></option>') + opts.map(function (x) {
          return '<option' + (x === v ? ' selected' : '') + '>' + xlEsc(x) + '</option>';
        }).join('') + '</select>';
      }
      if (d.type === 'note') return '<textarea rows="2"' + a + '>' + xlEsc(v) + '</textarea>';
      if (d.type === 'num' || d.type === 'int') {
        return '<input type="number" inputmode="' + (d.type === 'int' ? 'numeric' : 'decimal') + '" min="0" step="' +
          (d.type === 'int' ? '1' : '0.01') + '"' + a + ' value="' + (v == null ? '' : v) + '">';
      }
      return '<input type="text"' + a + ' value="' + xlEsc(v) + '">';
    };
    api.addButton = function (tableId) {
      return api.mode === 'add' ? '<button type="button" class="xl-add" data-xl-add="' + tableId + '">' + xlEsc(tarT(o.addLabel)) + '</button>' : '';
    };
    api.hint = function () {
      return api.mode === 'edit' ? '<p class="sk-edit-hint">' + tarT('skEditHint') + '</p>'
        : api.mode === 'add' ? '<p class="sk-edit-hint">' + tarT(o.addHint) + '</p>' : '';
    };
    api.withHint = function (html, hint) { return html.replace('<!--hint-->', hint == null ? api.hint() : hint); };
    var count = function () {
      if (api.mode === 'edit') return Object.keys(sel).length;
      if (api.mode === 'add') return Object.keys(fresh).reduce(function (n, k) { return n + fresh[k].length; }, 0);
      return 0;
    };
    var syncSave = function () {
      if (!save) return;
      var n = count();
      save.hidden = !(n && o.editable());
      save.querySelector('[data-sk-save-label]').textContent = tarT('skSave');
      save.querySelector('[data-sk-save-n]').textContent = n;
    };
    api.render = function () { o.render(); syncSave(); };
    var reset = function () { sel = {}; draft = {}; bad = {}; fresh = {}; };
    api.reset = reset;
    var parse = function (f, v) {
      var d = fieldDef(f);
      if (d.type === 'bool') return v ? true : null;
      if (d.type === 'num' || d.type === 'int') {
        if (v === '') return d.emptyZero ? 0 : null;
        var n = parseFloat(v);
        return isNaN(n) ? NaN : d.type === 'int' ? Math.round(n) : Math.round(n * 100) / 100;
      }
      v = String(v).replace(/\s+/g, ' ').trim();
      return v === '' ? null : v;
    };
    var onField = function (el) {
      var tr = el.closest('[data-key]');
      var key = tr.getAttribute('data-key'), f = el.getAttribute('data-field');
      (draft[key] = draft[key] || {})[f] = parse(f, el.value);
      delete bad[key];
      root.querySelectorAll('[data-key="' + key.replace(/["\\]/g, '\\$&') + '"]').forEach(function (x) { x.classList.remove('is-invalid'); });
      if (o.onInput) o.onInput(tr, f);
    };
    var setSel = function (keys, on) {
      keys.forEach(function (k) { if (on) sel[k] = true; else { delete sel[k]; delete draft[k]; delete bad[k]; } });
      api.render();
    };
    var focus = function (selector) { var el = root.querySelector(selector); if (el) el.focus(); };
    api.saveNow = function () {
      if (!o.editable() || !count()) return;
      var scope = o.scope();
      var tables = o.tables();
      var all = [];
      tables.forEach(function (t) { all = all.concat(api.rows(t)); });
      var rows = all.filter(function (r) { return api.mode === 'add' ? r.isNew : sel[r.key]; });
      bad = {};
      rows.forEach(function (r) { if (!o.validate(r)) bad[r.key] = true; });
      if (Object.keys(bad).length) { idmsToast('error', tarT(o.errKey)); api.render(); return; }
      if (o.remote) { o.remote(scope, tables, rows); return; }
      commit(scope, tables, rows);
    };
    var commit = function (scope, tables, rows) {
      var store = readStore();
      var mine = store[scope] = store[scope] || {};
      var pick = function (r) {
        var x = {};
        o.fields.forEach(function (d) { x[d.f] = r[d.f] == null ? null : r[d.f]; });
        (o.keep || []).forEach(function (k) { if (r[k] != null) x[k] = r[k]; });
        return x;
      };
      mine.__added = mine.__added || {};
      var now = new Date().toISOString();
      var stamp = function (next, prev) {
        var same = prev && JSON.stringify(Object.assign({}, prev, { perditesuarMe: null })) === JSON.stringify(Object.assign({}, next, { perditesuarMe: null }));
        next.perditesuarMe = same && prev.perditesuarMe ? prev.perditesuarMe : now;
        return next;
      };
      rows.forEach(function (r) {
        if (r.isNew) {
          (mine.__added[r.table] = mine.__added[r.table] || []).push(stamp(Object.assign({ key: 'add-' + Date.now().toString(36) + '-' + (seq++) }, pick(r))));
        } else if (r.added) {
          var list = mine.__added[r.table] || [];
          list.forEach(function (x, i) { if (x.key === r.key) list[i] = stamp(Object.assign({ key: r.key }, pick(r)), x); });
        } else {
          var src = tables.filter(function (t) { return t.id === r.table; })[0].rows.filter(function (s) { return o.keyOf(s) === r.key; })[0];
          var diff = {};
          o.fields.forEach(function (d) { var a = r[d.f] == null ? null : r[d.f], b = src[d.f] == null ? null : src[d.f]; if (a !== b) diff[d.f] = a; });
          if (Object.keys(diff).length) mine[r.key] = stamp(diff, mine[r.key]); else delete mine[r.key];
        }
      });
      Object.keys(mine.__added).forEach(function (k) { if (!mine.__added[k].length) delete mine.__added[k]; });
      if (!Object.keys(mine.__added).length) delete mine.__added;
      if (!Object.keys(mine).length) delete store[scope];
      try { localStorage.setItem(o.store, JSON.stringify(store)); }
      catch (e) { idmsToast('error', tarT('skSaveFail')); api.render(); return; }
      reset();
      api.render();
      idmsToast('ok', tarT('skSaved'));
    };
    api.hasSaved = function (scope) { return !!readStore()[scope]; };
    api.addedCount = function (scope) {
      var a = (readStore()[scope] || {}).__added || {};
      return Object.keys(a).reduce(function (n, k) { return n + a[k].length; }, 0);
    };
    var root = o.root;
    root.addEventListener('change', function (e) {
      var t = e.target;
      var row = t.getAttribute('data-xl-row');
      if (row) { setSel([row], t.checked); focus('[data-xl-row="' + row.replace(/["\\]/g, '\\$&') + '"]'); return; }
      var allId = t.getAttribute('data-xl-all');
      if (allId) {
        var tb = o.tables().filter(function (x) { return x.id === allId; })[0];
        setSel(o.visible(api.rows(tb)).map(function (r) { return r.key; }), t.checked);
        focus('[data-xl-all="' + allId + '"]');
        return;
      }
      if (t.matches('select.sk-in')) onField(t);
    });
    root.addEventListener('input', function (e) { if (e.target.matches('input.sk-in, textarea.sk-in')) onField(e.target); });
    root.addEventListener('click', function (e) {
      var add = e.target.closest('[data-xl-add]');
      if (add) {
        var id = add.getAttribute('data-xl-add');
        var key = 'new-' + (seq++);
        (fresh[id] = fresh[id] || []).push(Object.assign({ key: key }, o.blank ? o.blank(id) : {}));
        api.render();
        focus('[data-key="' + key + '"] .sk-in');
        return;
      }
      var del = e.target.closest('[data-xl-del]');
      if (del) {
        var k = del.getAttribute('data-xl-del');
        Object.keys(fresh).forEach(function (id) { fresh[id] = fresh[id].filter(function (r) { return r.key !== k; }); });
        delete draft[k]; delete bad[k];
        api.render();
      }
    });
    if (save) save.addEventListener('click', api.saveNow);
    window.addEventListener('hashchange', function () {
      var m = modeFromHash();
      if (m === api.mode) return;
      api.mode = m;
      reset();
      api.render();
    });
    document.addEventListener('idms:langchange', api.render);
    api.mode = modeFromHash();
    return api;
  };
  var skInv = document.getElementById('skInv');
  var skData = window.IDMIS_SKEMAT;
  if (skInv && skData && Array.isArray(tarData)) {
    var skT = function (key, vars) {
      return tarT(key).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; });
    };
    var skLocale = function () { return currentLang === 'en' ? 'en-GB' : 'sq-AL'; };
    var skNum = function (n) {
      return new Intl.NumberFormat(skLocale(), { maximumFractionDigits: 2 }).format(n || 0);
    };
    var skPct = function (upd, km) {
      if (!km) return '–';
      return new Intl.NumberFormat(skLocale(), { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((upd || 0) / km);
    };
    var skCount = function (n) { return n === 1 ? skT('skCount1') : skT('skCount', { n: n }); };
    var skSum = function (rows) {
      var t = { n: rows.length, km: 0, upd: 0 };
      rows.forEach(function (s) { t.km += s.km || 0; t.upd += s.perditesuarKm || 0; });
      return t;
    };
    var skMuniData = function (name) { return Object.prototype.hasOwnProperty.call(skData, name) ? skData[name] : null; };
    var skMuniNow = function () { return (document.getElementById('msMuni') || {}).value || ''; };
    var SK_TABLES = [['plota', 'skTblFull', 'skColKm'], ['pjeserisht', 'skTblPartial', 'skColKm2']];
    var skType = skInv.getAttribute('data-sk-type') || '';
    var skPre = { rezervuar: 'rz', stacion: 'sp' }[skType] || 'sk';
    var skOfType = function (s) { return !skType || (s.lloji || []).indexOf(skType) >= 0; };
    var skTablesFor = function (name) {
      var d = skMuniData(name) || { plota: [], pjeserisht: [] };
      var pos = function (r) { var o = (r.ord || {})[skType]; return o == null ? 1e6 : o; };
      return SK_TABLES.map(function (t) {
        var rows = d[t[0]].filter(skOfType);
        if (skType) {
          rows = rows.slice().sort(function (a, b) { return pos(a) - pos(b); }).map(function (r) {
            var own = (r.burimiSh || {})[skType];
            return own == null ? r : Object.assign({}, r, { burimi: own });
          });
        }
        return { id: t[0], rows: rows };
      });
    };
    var FM_STATUS = ['M', 'D', 'V', 'PZ', 'PZB'];
    var FM_FUNK = ['po', 'pjeserisht', 'jo', 'panjohur'];
    var FM = [
      { n: 1, k: 'kodi_bashkise', type: 'auto', u: 'fmU1' },
      { n: 2, k: 'kodi_skemes', type: 'kodi', u: 'fmU2' },
      { n: 3, k: 'emertimi', type: 'auto', u: 'fmU3' },
      { n: 4, k: 'njesite', type: 'multi', u: 'fmU4' },
      { n: 5, k: 'lloji', type: 'enum', opts: ['gravitet', 'pompim', 'perzier', 'tjeter'], o: 'fmO_lloji' },
      { n: 6, k: 'operatori', type: 'op', u: 'fmU6' },
      { n: 7, k: 'kodi_operatorit', type: 'auto', u: 'fmU7' },
      { n: 8, k: 'siperfaqja_ujitshme', type: 'ha', u: 'fmUha' },
      { n: 9, k: 'siperfaqja_sherbyeshme', type: 'ha', u: 'fmUha' },
      { n: 10, k: 'siperfaqja_ujitur', type: 'ha', year: true, le: 8, u: 'fmUhaVit' },
      { n: 11, k: 'fermere', type: 'int', u: 'fmUnr' },
      { n: 12, k: 'fermere_sherbyer', type: 'int', year: true, le: 11, u: 'fmUnrVit' },
      { n: 13, k: 'burimi', type: 'enum', opts: ['lume', 'rezervuar', 'kanal', 'nentokesor', 'tjeter'], o: 'fmO_burimi' },
      { n: 14, k: 'marrja', type: 'enum', opts: FM_FUNK, o: 'fmO_funk' },
      { n: 15, k: 'rrjeti_kryesor', type: 'enum', opts: FM_FUNK, o: 'fmO_funk' },
      { n: 16, k: 'rrjeti_shperndares', type: 'enum', opts: FM_FUNK, o: 'fmO_funk' },
      { n: 17, k: 'stacione', type: 'int', u: 'fmUnr' },
      { n: 18, k: 'stacione_funksionale', type: 'int', le: 17, u: 'fmUnr' },
      { n: 19, k: 'gjendja', type: 'enum', opts: ['funksionale', 'pjeserisht', 'jofunksionale', 'panjohur'], o: 'fmO_gjendja' },
      { n: 20, k: 'vleresimi_fundit', type: 'when', u: 'fmU20' },
      { n: 21, k: 'problemet', type: 'note', max: 2000, u: 'fmUtekst' },
      { n: 22, k: 'dokumentacioni', type: 'text', max: 300, u: 'fmU22' },
      { n: 23, k: 'statusi', type: 'enum', opts: FM_STATUS, o: 'fmO_statusi', codes: true, noStatus: true },
      { n: 24, k: 'komente', type: 'note', max: 2000, u: 'fmUtekst', noStatus: true }
    ];
    var FM_SECTIONS = [['fmS1', 1, 7], ['fmS2', 8, 12], ['fmS3', 13, 18], ['fmS4', 19, 24]];
    var fmValKey = function (f) { return f.type === 'kodi' ? 'kodi_i_ri' : f.type === 'op' ? 'operatori_id' : f.k; };
    var fmByKey = function (k) {
      k = { kodi_i_ri: 'kodi_skemes', operatori_id: 'operatori' }[k] || String(k).replace(/_viti$/, '');
      return FM.filter(function (f) { return f.k === k; })[0];
    };
    var fmYearMax = new Date().getFullYear() + 1;
    var fm = { muni: null, data: null };
    var fmLoad = function (name) {
      if (fm.muni === name) return;
      fm.muni = name; fm.data = null;
      fpClose();
      if (!name) return;
      fetch('/api/skemat/formulari?bashkia=' + encodeURIComponent(name), { credentials: 'same-origin', cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) { if (fm.muni === name) { fm.data = d; sk.render(); fpRender(); } })
        .catch(function () { if (fm.muni === name) { fm.data = { error: true }; sk.render(); fpRender(); } });
    };
    var fmSaved = function (key) { return fm.data && fm.data.formularet ? fm.data.formularet[key] || null : null; };
    var skLastSaved = function (s) {
      var a = s.perditesuarMe || '', b = (fmSaved(s.key) || {}).perditesuar_me || '';
      return xlWhen(a > b ? a : b);
    };
    var fmHas = function (v) { return v != null && v !== '' && !(Array.isArray(v) && !v.length) && !(typeof v === 'string' && !v.trim()); };
    var fmWhenOk = function (v) {
      var m = /^(\d{4})(?:-(\d{2})-(\d{2}))?$/.exec(v);
      if (!m || +m[1] < 1900 || +m[1] > fmYearMax) return false;
      if (!m[2]) return true;
      var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
      return d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
    };
    var fmCheck = function (d) {
      var st = d.statuset || {};
      for (var i = 0; i < FM.length; i++) {
        var f = FM[i], v = d[fmValKey(f)];
        if (f.type === 'auto' || !fmHas(v)) continue;
        if (f.type === 'ha' || f.type === 'int') {
          var dec = f.type === 'ha' ? 100 : 1;
          if (typeof v !== 'number' || !isFinite(v) || v < 0 || v > 1e6 || Math.abs(Math.round(v * dec) - v * dec) > 1e-6) return { n: f.n, e: 'fmErrValue' };
        }
        if (f.type === 'when' && !fmWhenOk(v)) return { n: f.n, e: 'fmErrValue' };
        if (!f.noStatus && !st[f.k]) return { n: f.n, e: 'fmErrStatus' };
        if (f.year) {
          var y = d[f.k + '_viti'];
          if (y == null) return { n: f.n, e: 'fmErrYear' };
          if (!(y % 1 === 0 && y >= 1900 && y <= fmYearMax)) return { n: f.n, e: 'fmErrValue' };
        }
        if (f.le) { var top = d[FM[f.le - 1].k]; if (typeof top === 'number' && v > top) return { n: f.n, e: 'fmErrMax', m: f.le }; }
      }
      return null;
    };
    var fmClean = function (d) {
      var x = {};
      Object.keys(d).forEach(function (k) {
        if (k === 'statuset') return;
        var v = typeof d[k] === 'string' ? d[k].trim() : d[k];
        if (fmHas(v)) x[k] = v;
      });
      var st = {};
      Object.keys(d.statuset || {}).forEach(function (k) { if (d.statuset[k]) st[k] = d.statuset[k]; });
      if (Object.keys(st).length) x.statuset = st;
      return x;
    };
    var fmSame = function (a, b) {
      var norm = function (v) {
        if (Array.isArray(v)) return '[' + v.map(norm).join(',') + ']';
        if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(function (k) { return k + ':' + norm(v[k]); }).join(',') + '}';
        return JSON.stringify(v);
      };
      return norm(a) === norm(b);
    };
    var fmOperator = function (id) { return ((fm.data || {}).operatoret || []).filter(function (o) { return o.id === id; })[0] || null; };
    var fp = { key: null, row: null, editing: false, draft: null, bad: null, busy: false, leaving: null };
    var fpEl = document.createElement('aside');
    fpEl.className = 'fp';
    fpEl.hidden = true;
    fpEl.setAttribute('role', 'dialog');
    fpEl.setAttribute('aria-labelledby', 'fpTitle');
    document.body.appendChild(fpEl);
    var fpCanEdit = function () { return !!(fm.data && fm.data.mundTeNdryshoje); };
    var fpVal = function () { return fp.editing ? fp.draft : (fmSaved(fp.key) || {}).te_dhenat || {}; };
    var fpDirty = function () {
      return fp.editing && !fmSame(fmClean(fp.draft), fmClean((fmSaved(fp.key) || {}).te_dhenat || {}));
    };
    var fpFind = function (key) {
      var found = null;
      skTablesFor(skMuniNow()).forEach(function (tb) { sk.rows(tb).forEach(function (s) { if (s.key === key) found = s; }); });
      return found;
    };
    var fpStatusName = function (c) { return tarT('fmO_statusi').split('|')[FM_STATUS.indexOf(c)] || ''; };
    var fpText = function (f, d) {
      var v = d[fmValKey(f)];
      if (f.n === 1) return String(fm.data.bashkia.kodi);
      if (f.n === 3) return fp.row.emertimi;
      if (f.n === 7) return (fmOperator(d.operatori_id) || {}).kodi || '';
      if (!fmHas(v)) return '';
      if (f.type === 'enum') {
        var name = tarT(f.o).split('|')[f.opts.indexOf(v)];
        return f.codes ? v + ' — ' + name : name;
      }
      if (f.type === 'op') { var o = fmOperator(v); return o ? o.emri + (o.aktiv ? '' : ' (' + tarT('fmOpOff') + ')') : ''; }
      if (f.type === 'multi') return v.join(', ');
      if (f.type === 'when') return v.split('-').reverse().join('.');
      if (f.type === 'ha' || f.type === 'int') {
        var y = d[f.k + '_viti'];
        return skNum(v) + (f.type === 'ha' ? ' ha' : '') + (f.year && y ? ' · ' + tarT('fmViti') + ' ' + y : '');
      }
      return v;
    };
    var fpEmpty = '<span class="fp-none">—</span>';
    var fpControl = function (f, d, id) {
      var v = d[fmValKey(f)];
      var aria = ' aria-describedby="' + id + '-err"';
      if (f.type === 'auto') return '<span class="fp-auto"' + (f.n === 7 ? ' data-fp-opkod' : '') + '>' + (xlEsc(fpText(f, d)) || fpEmpty) + '</span>';
      if (f.type === 'kodi') {
        return '<div class="fp-pair"><span class="fp-sub">' + xlEsc(tarT('fmKodiTransf')) + '</span><span class="fp-auto">' + xlEsc(fp.row.kodi) + '</span></div>' +
          '<input type="text" id="' + id + '" class="fp-in" data-f="kodi_i_ri" maxlength="40"' + aria + ' placeholder="' + xlEsc(tarT('fmKodiRi')) + '" value="' + xlEsc(v) + '">';
      }
      if (f.type === 'op') {
        var ops = (fm.data.operatoret || []).filter(function (o) { return o.aktiv || o.id === v; });
        var manage = '<a class="fp-link" href="/Account/perditesimi-i-te-dhenave/operatoret.html">' + xlEsc(tarT('fmOpManage')) + '</a>';
        if (!ops.length) return '<span class="fp-sub">' + xlEsc(tarT('fmOpNone')) + '</span> ' + manage;
        return '<select id="' + id + '" class="fp-in" data-f="operatori_id"' + aria + '><option value=""></option>' + ops.map(function (o) {
          return '<option value="' + o.id + '"' + (o.id === v ? ' selected' : '') + '>' + xlEsc(o.emri + (o.aktiv ? '' : ' (' + tarT('fmOpOff') + ')')) + '</option>';
        }).join('') + '</select>' + manage;
      }
      if (f.type === 'multi') {
        var units = fm.data.njesite || [];
        if (!units.length) return '<span class="fp-sub">' + xlEsc(tarT('fmNoUnits')) + '</span>';
        return '<div class="fp-checks" role="group" id="' + id + '" aria-label="' + xlEsc(tarT('fmL4')) + '">' + units.map(function (u) {
          return '<label class="fp-check"><input type="checkbox" class="fp-in" data-f="njesite" value="' + xlEsc(u) + '"' +
            ((v || []).indexOf(u) >= 0 ? ' checked' : '') + '><span>' + xlEsc(u) + '</span></label>';
        }).join('') + '</div>';
      }
      if (f.type === 'enum') {
        var names = tarT(f.o).split('|');
        return '<select id="' + id + '" class="fp-in" data-f="' + f.k + '"' + aria + '><option value=""></option>' + f.opts.map(function (c, i) {
          return '<option value="' + c + '"' + (c === v ? ' selected' : '') + '>' + xlEsc(f.codes ? c + ' — ' + names[i] : names[i]) + '</option>';
        }).join('') + '</select>';
      }
      if (f.type === 'note') return '<textarea id="' + id + '" rows="3" class="fp-in" data-f="' + f.k + '" maxlength="' + f.max + '"' + aria + '>' + xlEsc(v) + '</textarea>';
      if (f.type === 'ha' || f.type === 'int') {
        var num = '<input type="number" id="' + id + '" class="fp-in fp-num" data-f="' + f.k + '" min="0" step="' + (f.type === 'ha' ? '0.01' : '1') +
          '" inputmode="' + (f.type === 'ha' ? 'decimal' : 'numeric') + '"' + aria + ' value="' + (v == null ? '' : v) + '">';
        if (!f.year) return num;
        var y = d[f.k + '_viti'];
        return '<div class="fp-year">' + num + '<label class="fp-yearlbl"><span class="fp-sub">' + xlEsc(tarT('fmViti')) + '</span>' +
          '<input type="number" class="fp-in fp-num fp-yr" data-f="' + f.k + '_viti" min="1900" max="' + fmYearMax + '" step="1" inputmode="numeric" value="' +
          (y == null ? '' : y) + '"></label></div>';
      }
      var ph = f.type === 'when' ? ' placeholder="' + xlEsc(tarT('fm20Ph')) + '" maxlength="10"' : ' maxlength="' + f.max + '"';
      return '<input type="text" id="' + id + '" class="fp-in" data-f="' + f.k + '"' + ph + aria + ' value="' + xlEsc(v) + '">';
    };
    var fpField = function (f, d) {
      var id = 'fp-f' + f.n, ed = fp.editing, err = fp.bad && fp.bad.n === f.n;
      var st = (d.statuset || {})[f.k];
      var label = xlEsc(tarT('fmL' + f.n));
      var unit = f.u ? '<span class="fp-unit">' + xlEsc(tarT(f.u)) + '</span>' : '';
      var labelTag = ed && f.type !== 'auto' && f.type !== 'multi' ? '<label for="' + id + '">' + label + '</label>' : '<span class="fp-name">' + label + '</span>';
      var value;
      if (ed) value = fpControl(f, d, id);
      else if (f.type === 'kodi') {
        value = '<span class="fp-pair"><span class="fp-sub">' + xlEsc(tarT('fmKodiTransf')) + '</span><span class="fp-auto">' + xlEsc(fp.row.kodi) + '</span></span>' +
          '<span class="fp-pair"><span class="fp-sub">' + xlEsc(tarT('fmKodiRi')) + '</span>' + (xlEsc(d.kodi_i_ri) || fpEmpty) + '</span>';
      } else value = xlEsc(fpText(f, d)) || fpEmpty;
      var status = '';
      if (!f.noStatus) {
        status = ed
          ? '<select class="fp-in fp-stsel" data-st="' + f.k + '" aria-label="' + xlEsc(tarT('fmColStatus') + ' — ' + f.n + '. ' + tarT('fmL' + f.n)) + '">' +
            '<option value="">' + xlEsc(tarT('fmColStatus')) + '</option>' + FM_STATUS.map(function (c) {
              return '<option value="' + c + '" title="' + xlEsc(fpStatusName(c)) + '"' + (c === st ? ' selected' : '') + '>' + c + '</option>';
            }).join('') + '</select>'
          : st ? '<span class="fp-badge" title="' + xlEsc(fpStatusName(st)) + '">' + st + '</span>' : '';
      }
      return '<div class="fp-field' + (err ? ' is-invalid' : '') + '" data-n="' + f.n + '">' +
        '<div class="fp-lbl"><span class="fp-n">' + f.n + '</span>' + labelTag + unit + '</div>' +
        '<div class="fp-row"><div class="fp-val">' + value + '</div>' + (f.noStatus ? '' : '<div class="fp-st">' + status + '</div>') + '</div>' +
        '<p class="fp-err" id="' + id + '-err">' + (err ? xlEsc(skT(fp.bad.e, { n: fp.bad.n, m: fp.bad.m })) : '') + '</p>' +
        '</div>';
    };
    var fpPop = document.createElement('div');
    fpPop.className = 'fp-pop';
    fpPop.id = 'fpLegend';
    fpPop.setAttribute('role', 'dialog');
    fpPop.setAttribute('aria-labelledby', 'fpPopTitle');
    fpPop.hidden = true;
    document.body.appendChild(fpPop);
    var fpLegendClose = function (refocus) {
      if (fpPop.hidden) return;
      fpPop.hidden = true;
      var btn = fpEl.querySelector('[data-fp-act="legend"]');
      if (btn) { btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); }
    };
    var fpLegendOpen = function () {
      var btn = fpEl.querySelector('[data-fp-act="legend"]');
      if (!fpPop.hidden) { fpLegendClose(true); return; }
      var def = tarT('fmLgDef').split('|'), ex = tarT('fmLgEx').split('|');
      fpPop.innerHTML =
        '<div class="fp-pop-head"><p class="fp-pop-title" id="fpPopTitle">' + xlEsc(tarT('fmLegend')) + '</p>' +
          '<p class="fp-pop-sub">' + xlEsc(tarT('fmLgSub')) + '</p></div>' +
        '<ul class="fp-pop-list">' + FM_STATUS.map(function (c, i) {
          return '<li><span class="fp-badge">' + c + '</span><div><p class="fp-pop-name">' + xlEsc(fpStatusName(c)) + '</p>' +
            '<p class="fp-pop-def">' + xlEsc(def[i]) + '</p>' +
            '<p class="fp-pop-ex"><span>' + xlEsc(tarT('fmLgExLbl')) + '</span> ' + xlEsc(ex[i]) + '</p></div></li>';
        }).join('') + '</ul>';
      var r = btn.getBoundingClientRect();
      fpPop.style.top = (r.bottom + 12) + 'px';
      fpPop.style.right = (document.documentElement.clientWidth - r.right) + 'px';
      fpPop.style.setProperty('--caret-r', (r.width / 2 - 7) + 'px');
      fpPop.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      fpPop.tabIndex = -1;
      fpPop.focus();
    };
    document.addEventListener('click', function (e) {
      if (fpPop.hidden || fpPop.contains(e.target) || e.target.closest('[data-fp-act="legend"]')) return;
      fpLegendClose();
    });
    window.addEventListener('resize', fpLegendClose);
    var fpFoot = function () {
      if (!fm.data || fm.data.error) return '';
      if (fp.leaving) {
        return '<p class="fp-warn">' + xlEsc(tarT('fmDirty')) + '</p>' +
          '<button type="button" class="fp-btn" data-fp-act="keep">' + xlEsc(tarT('fmKeep')) + '</button>' +
          '<button type="button" class="fp-btn fp-danger" data-fp-act="discard">' + xlEsc(tarT('fmDiscard')) + '</button>';
      }
      if (fp.editing) {
        return '<button type="button" class="fp-btn" data-fp-act="cancel">' + xlEsc(tarT('fmCancel')) + '</button>' +
          '<button type="button" class="fp-btn fp-main" data-fp-act="save"' + (fp.busy ? ' disabled' : '') + '>' + xlEsc(tarT('fmSave')) + '</button>';
      }
      return fpCanEdit()
        ? '<button type="button" class="fp-btn fp-main" data-fp-act="edit">' + xlEsc(tarT('fmEdit')) + '</button>'
        : '<p class="fp-sub">' + xlEsc(tarT('fmReadOnly')) + '</p>';
    };
    var fpRender = function () {
      if (!fp.key) { fpEl.hidden = true; return; }
      var saved = fmSaved(fp.key), body;
      var meta = !fm.data || fm.data.error ? '' : saved
        ? xlEsc(skT('fmSaved', { d: xlWhen(saved.perditesuar_me), u: saved.perdoruesi }))
        : xlEsc(tarT('fmNew'));
      if (!fm.data) body = '<p class="fp-msg">' + xlEsc(tarT('fmLoading')) + '</p>';
      else if (fm.data.error) body = '<p class="fp-msg">' + xlEsc(tarT('fmLoadFail')) + '</p>';
      else {
        var d = fpVal();
        body = FM_SECTIONS.map(function (s, i) {
          return '<section class="fp-sec"><h3 class="fp-sec-title"><span>' + (i + 1) + '</span>' + xlEsc(tarT(s[0])) + '</h3>' +
            FM.filter(function (f) { return f.n >= s[1] && f.n <= s[2]; }).map(function (f) { return fpField(f, d); }).join('') + '</section>';
        }).join('');
      }
      var scroll = fpEl.querySelector('.fp-body');
      var top = scroll ? scroll.scrollTop : 0;
      fpEl.innerHTML =
        '<div class="fp-head"><div class="fp-headtxt"><p class="fp-kicker">' + xlEsc(tarT('fmTitle')) + '</p>' +
          '<h2 class="fp-title" id="fpTitle">' + xlEsc(fp.row.kodi) + ' <span>' + xlEsc(fp.row.emertimi) + '</span></h2>' +
          '<p class="fp-meta">' + meta + '</p></div>' +
          '<button type="button" class="fp-x" data-fp-act="legend" aria-label="' + xlEsc(tarT('fmLegend')) + '" aria-haspopup="dialog" aria-controls="fpLegend" aria-expanded="' + !fpPop.hidden + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5"/><path d="M12 8h.01"/></svg></button>' +
          '<button type="button" class="fp-x" data-fp-act="close" aria-label="' + xlEsc(tarT('fmClose')) + '" title="' + xlEsc(tarT('fmClose')) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div>' +
        '<div class="fp-body' + (fp.editing ? ' is-editing' : '') + '">' + body + '</div>' +
        '<div class="fp-foot' + (fp.leaving ? ' is-warn' : '') + '">' + fpFoot() + '</div>';
      fpEl.querySelector('.fp-body').scrollTop = top;
      if (fpOut) {
        fpOut.cancel();
        fpOut = null;
        fpEl.hidden = true;
        void fpEl.offsetWidth;
      }
      fpEl.hidden = false;
    };
    var fpOut = null;
    var fpSlideOut = function () {
      if (fpEl.hidden || fpOut) return;
      var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (calm || !fpEl.animate) { fpEl.hidden = true; return; }
      fpOut = fpEl.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }],
        { duration: 300, easing: 'cubic-bezier(.55,0,.75,.2)' });
      fpOut.onfinish = function () { fpOut = null; fpEl.hidden = true; };
    };
    var fpMark = function () {
      skInv.querySelectorAll('tr.is-open').forEach(function (tr) { tr.classList.remove('is-open'); });
      if (!fp.key) return;
      skInv.querySelectorAll('tr[data-key]').forEach(function (tr) { if (tr.getAttribute('data-key') === fp.key) tr.classList.add('is-open'); });
    };
    var fpOpen = function (key) {
      if (fpDirty()) { fp.leaving = key; fpRender(); return; }
      var row = fpFind(key);
      if (!row) return;
      fp = { key: key, row: row, editing: false, draft: null, bad: null, busy: false, leaving: null };
      fpRender();
      fpMark();
      var x = fpEl.querySelector('.fp-x');
      if (x) x.focus();
    };
    function fpClose() {
      var was = fp.key;
      fp = { key: null, row: null, editing: false, draft: null, bad: null, busy: false, leaving: null };
      fpLegendClose();
      fpSlideOut();
      fpMark();
      if (was) {
        var btn = Array.prototype.filter.call(skInv.querySelectorAll('[data-fp]'), function (b) { return b.getAttribute('data-fp') === was; })[0];
        if (btn) btn.focus();
      }
    }
    var fpAskClose = function () { if (fpDirty()) { fp.leaving = 'close'; fpRender(); } else fpClose(); };
    var fpFocusField = function (n) {
      var box = fpEl.querySelector('.fp-field[data-n="' + n + '"]');
      if (!box) return;
      box.scrollIntoView({ block: 'center' });
      var el = box.querySelector('.fp-in');
      if (el) el.focus();
    };
    var fpSave = function () {
      if (fp.busy) return;
      var d = fmClean(fp.draft);
      if (fmSame(d, fmClean((fmSaved(fp.key) || {}).te_dhenat || {}))) { fp.editing = false; fp.draft = null; fp.bad = null; fpRender(); return; }
      var c = fmCheck(fp.draft);
      if (c) { fp.bad = c; fpRender(); fpFocusField(c.n); return; }
      fp.busy = true;
      fp.bad = null;
      fpRender();
      var key = fp.key, row = fp.row, name = fm.muni;
      fetch('/api/skemat/formulari', {
        method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bashkia: name, formularet: [{ celesi: key, kodi: row.kodi, emertimi: row.emertimi, te_dhenat: d }] })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; });
      }).then(function (res) {
        if (fm.muni !== name || fp.key !== key) return;
        fp.busy = false;
        if (!res.ok) {
          var f = res.j.fusha ? fmByKey(res.j.fusha) : null;
          var e = { statusi: 'fmErrStatus', viti: 'fmErrYear', kufiri: 'fmErrMax', operatori_jo_aktiv: 'fmErrOpOff' }[res.j.gabim] || 'fmErrValue';
          if (f) fp.bad = { n: f.n, e: e, m: f.le };
          if (res.status === 403 || !f) idmsToast('error', tarT(res.status === 403 ? 'fmErrScope' : 'fmErrSave'));
          fpRender();
          if (f) fpFocusField(f.n);
          return;
        }
        var done = (res.j.formularet || {})[key], was = fmSaved(key);
        fm.data.formularet[key] = {
          te_dhenat: d,
          perditesuar_me: done ? done.perditesuar_me : was && was.perditesuar_me,
          perdoruesi: done ? done.perdoruesi : was && was.perdoruesi
        };
        fp.editing = false;
        fp.draft = null;
        idmsToast('ok', tarT('fmSavedOk'));
        sk.render();
        fpRender();
      }, function () {
        fp.busy = false;
        idmsToast('error', tarT('fmErrSave'));
        fpRender();
      });
    };
    fpEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fp-act]');
      if (!b) return;
      var act = b.getAttribute('data-fp-act');
      if (act === 'close') fpAskClose();
      else if (act === 'legend') fpLegendOpen();
      else if (act === 'edit') {
        fp.editing = true;
        fp.draft = JSON.parse(JSON.stringify((fmSaved(fp.key) || {}).te_dhenat || {}));
        fpRender();
        var first = fpEl.querySelector('.fp-body .fp-in');
        if (first) first.focus();
      } else if (act === 'cancel') {
        if (fpDirty()) { fp.leaving = 'cancel'; fpRender(); return; }
        fp.editing = false; fp.draft = null; fp.bad = null;
        fpRender();
      } else if (act === 'save') fpSave();
      else if (act === 'keep') { fp.leaving = null; fpRender(); }
      else if (act === 'discard') {
        var next = fp.leaving;
        fp.editing = false; fp.draft = null; fp.bad = null; fp.leaving = null;
        if (next === 'close') fpClose();
        else if (next === 'cancel') fpRender();
        else fpOpen(next);
      }
    });
    fpEl.addEventListener('input', function (e) {
      var el = e.target;
      if (!fp.editing || !el.matches('.fp-in')) return;
      var d = fp.draft;
      var st = el.getAttribute('data-st'), k = el.getAttribute('data-f');
      var f = fmByKey(st || k);
      if (st) {
        d.statuset = d.statuset || {};
        if (el.value) d.statuset[st] = el.value; else delete d.statuset[st];
      } else if (k === 'njesite') {
        d.njesite = Array.prototype.map.call(el.closest('.fp-checks').querySelectorAll('input:checked'), function (x) { return x.value; });
      } else if (k === 'operatori_id') {
        if (el.value === '') delete d[k]; else d[k] = Number(el.value);
        var kod = fpEl.querySelector('[data-fp-opkod]');
        if (kod) kod.innerHTML = xlEsc((fmOperator(d[k]) || {}).kodi) || fpEmpty;
      } else if (el.type === 'number') {
        if (el.value === '') delete d[k]; else d[k] = Number(el.value);
        if (f.year && k === f.k && el.value !== '' && d[k + '_viti'] == null) {
          d[k + '_viti'] = new Date().getFullYear();
          var yIn = el.closest('.fp-year').querySelector('.fp-yr');
          if (yIn) yIn.value = d[k + '_viti'];
        }
      } else {
        if (el.value === '') delete d[k]; else d[k] = el.value;
      }
      if (fp.bad && fp.bad.n === f.n) {
        fp.bad = null;
        var box = el.closest('.fp-field');
        if (box) { box.classList.remove('is-invalid'); box.querySelector('.fp-err').textContent = ''; }
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || fpEl.hidden) return;
      if (!fpPop.hidden) { fpLegendClose(true); return; }
      if (fp.leaving) { fp.leaving = null; fpRender(); } else fpAskClose();
    });
    skInv.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fp]');
      if (b) fpOpen(b.getAttribute('data-fp'));
    });
    window.addEventListener('beforeunload', function (e) {
      if (fpDirty()) { e.preventDefault(); e.returnValue = tarT('fmDirty'); }
    });
    var SK_FIELDS = ['kodi', 'emertimi', 'burimi', 'km', 'teren', 'perditesuarKm'];
    var skBusy = false;
    var skSend = function (name, body) {
      return fetch('/api/skemat', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ bashkia: name, lloji: null }, body))
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw d; return d; });
      }).then(function (d) { skData[d.bashkia || name] = d.te_dhenat; return d; });
    };
    var skErrText = function (e) {
      var g = e && e.gabim;
      return tarT(g === 'dyfish' ? 'skErrDup' : g === 'kufiri' || g === 'vlera' ? 'skErrRows' : 'skSaveFailDb');
    };
    var skPush = function (name, tables, rows) {
      if (skBusy) return;
      var ndryshime = [], shtesa = [];
      rows.forEach(function (r) {
        var x = {};
        if (r.isNew) {
          SK_FIELDS.forEach(function (f) { x[f] = r[f] == null ? null : r[f]; });
          shtesa.push(Object.assign(x, { transferimi: r.table, lloji: r.lloji || [] }));
          return;
        }
        var src = tables.filter(function (t) { return t.id === r.table; })[0].rows.filter(function (s) { return String(s.id) === r.key; })[0];
        if (!src) return;
        SK_FIELDS.forEach(function (f) {
          var a = r[f] == null ? null : r[f], b = src[f] == null ? null : src[f];
          if (a !== b) x[f] = a;
        });
        if (Object.keys(x).length) ndryshime.push(Object.assign(x, { id: src.id }));
      });
      if (!ndryshime.length && !shtesa.length) { sk.reset(); sk.render(); idmsToast('ok', tarT('skSaved')); return; }
      skBusy = true;
      skSend(name, { lloji: skType || null, ndryshime: ndryshime, shtesa: shtesa }).then(function () {
        skBusy = false;
        sk.reset();
        sk.render();
        idmsToast('ok', tarT('skSaved'));
      }).catch(function (e) {
        skBusy = false;
        idmsToast('error', skErrText(e));
      });
    };
    var skMigrate = function () {
      var store;
      try { store = JSON.parse(localStorage.getItem('idms-skemat')); } catch (e) { return; }
      if (!store || typeof store !== 'object') return;
      var names = Object.keys(store).filter(function (n) { return skMuniData(n); });
      var next = function () {
        if (!names.length) return;
        var name = names.shift(), mine = store[name] || {}, d = skMuniData(name);
        var byKey = {};
        d.plota.concat(d.pjeserisht).forEach(function (s) { byKey[s.kodi + '|' + s.emertimi] = s; });
        var ndryshime = Object.keys(mine).filter(function (k) { return k !== '__added' && byKey[k]; }).map(function (k) {
          var x = { id: byKey[k].id };
          SK_FIELDS.forEach(function (f) { if (Object.prototype.hasOwnProperty.call(mine[k], f)) x[f] = mine[k][f]; });
          return x;
        });
        var shtesa = [];
        Object.keys(mine.__added || {}).forEach(function (tid) {
          mine.__added[tid].forEach(function (r) {
            var x = { transferimi: tid, lloji: r.lloji || [] };
            SK_FIELDS.forEach(function (f) { x[f] = r[f] == null ? null : r[f]; });
            shtesa.push(x);
          });
        });
        var done = function () {
          delete store[name];
          try {
            if (Object.keys(store).length) localStorage.setItem('idms-skemat', JSON.stringify(store));
            else localStorage.removeItem('idms-skemat');
          } catch (e) {}
        };
        if (!ndryshime.length && !shtesa.length) { done(); next(); return; }
        skSend(name, { ndryshime: ndryshime, shtesa: shtesa }).then(function () {
          done();
          sk.render();
          idmsToast('ok', tarT('skMigrated'));
          next();
        }).catch(next);
      };
      next();
    };
    var sk = xlEditor({
      root: skInv,
      store: null,
      scope: skMuniNow,
      editable: function () { return !!skMuniNow(); },
      tables: function () { return skTablesFor(skMuniNow()); },
      include: skOfType,
      keep: ['lloji'],
      keyOf: function (s) { return s.id != null ? String(s.id) : s.kodi + '|' + s.emertimi; },
      remote: skPush,
      visible: function (rows) { return rows; },
      fields: [
        { f: 'kodi', type: 'text', label: 'skColKodi' },
        { f: 'emertimi', type: 'text', label: 'skColEm' },
        { f: 'burimi', type: 'text', label: 'skColBurimi' },
        { f: 'km', type: 'num', label: 'skColKmShort', emptyZero: true },
        { f: 'teren', type: 'bool', label: 'skColTeren' },
        { f: 'perditesuarKm', type: 'num', label: 'skStatUpd' }
      ],
      blank: function () { return { kodi: null, emertimi: null, burimi: null, km: 0, teren: null, perditesuarKm: null, lloji: skType ? [skType] : [] }; },
      validate: function (s) {
        return s.km >= 0 && (s.perditesuarKm == null || s.perditesuarKm >= 0) && (s.perditesuarKm || 0) <= (s.km || 0) &&
          !!s.kodi && !!s.emertimi;
      },
      errKey: 'skErrRows',
      addLabel: 'skAddRow',
      addHint: 'skAddHint',
      onInput: function (tr, f) {
        if (f !== 'km' && f !== 'perditesuarKm') return;
        var table = tr.closest('[data-sk-table]');
        var rows = sk.rows(skTablesFor(skMuniNow()).filter(function (t) { return t.id === table.getAttribute('data-sk-table'); })[0]);
        var row = rows.filter(function (s) { return s.key === tr.getAttribute('data-key'); })[0];
        if (row) tr.querySelector('[data-pct]').textContent = skPct(row.perditesuarKm, row.km);
        var t = skSum(rows);
        table.querySelector('[data-t="km"]').textContent = skNum(t.km);
        table.querySelector('[data-t="upd"]').textContent = skNum(t.upd);
        table.querySelector('[data-t="pct"]').textContent = skPct(t.upd, t.km);
      },
      render: function () { skRender(); }
    });
    var skCell = function (s, field) {
      if (field === 'teren') return s.teren ? skT('skYes') : '';
      if (field === 'km') return s.km == null ? '' : skNum(s.km);
      if (field === 'perditesuarKm') return s.perditesuarKm ? skNum(s.perditesuarKm) : '';
      return xlEsc(s[field]);
    };
    var skTable = function (id, titleKey, kmKey, rows) {
      var t = skSum(rows);
      var lead = sk.hasLead();
      var body = rows.map(function (s, i) {
        var on = sk.editing(s), label = (s.kodi || '') + ' ' + (s.emertimi || '');
        var td = function (field, cls) {
          return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (on ? sk.input(s, field, label) : skCell(s, field)) + '</td>';
        };
        var filled = !!fmSaved(s.key);
        var f01 = s.isNew ? '' : '<button type="button" class="sk-f01' + (filled ? ' is-filled' : '') + '" data-fp="' + xlEsc(s.key) + '" aria-label="' +
          xlEsc(skT('fmOpen', { s: label })) + '" title="' + xlEsc(tarT(filled ? 'fmFilled' : 'fmNotFilled')) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>' +
          (filled ? '<path d="m9 14 2 2 4-4"/>' : '<path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>') + '</svg></button>';
        return '<tr data-key="' + xlEsc(s.key) + '" class="' + (sk.rowClass(s) + (s.key === fp.key ? ' is-open' : '')).trim() + '">' + sk.lead(s, label) +
          '<td class="c">' + (i + 1) + '</td>' +
          td('kodi', 'nw') + td('emertimi') + td('burimi', 'c') + td('km', 'c') + td('teren', 'c') + td('perditesuarKm', 'c') +
          '<td class="c" data-pct>' + skPct(s.perditesuarKm, s.km) + '</td>' +
          '<td class="c sk-when">' + skLastSaved(s) + '</td>' +
          '<td class="c sk-f01-cell">' + f01 + '</td>' +
          '</tr>';
      }).join('');
      return '<section class="sk-sheet">' +
        '<div class="sk-xl-head"><h3 class="sk-xl-title">' + skT(titleKey) + '</h3><!--hint--></div>' +
        '<div class="sk-scroll"><table class="sk-xl' + (lead ? ' is-editing' : '') + '" data-sk-table="' + id + '">' +
        '<colgroup>' + (lead ? '<col style="width:44px">' : '') +
        '<col style="width:5%"><col style="width:9%"><col style="width:20%"><col style="width:16%">' +
        '<col style="width:13%"><col style="width:10%"><col style="width:6%"><col style="width:7%"><col style="width:10%"><col style="width:4%"></colgroup>' +
        '<thead><tr>' + sk.headLead(id, rows, 2) +
          '<th rowspan="2" scope="col">' + skT('skColNr') + '</th>' +
          '<th colspan="2" scope="colgroup">' + skT('skColSkema') + '</th>' +
          '<th rowspan="2" scope="col">' + skT('skColBurimi') + '</th>' +
          '<th rowspan="2" scope="col">' + skT(kmKey) + '</th>' +
          '<th rowspan="2" scope="col">' + skT('skColTeren') + '</th>' +
          '<th colspan="2" scope="colgroup">' + skT('skColUpd') + '</th>' +
          '<th rowspan="2" scope="col">' + skT('skColUpdMe') + '</th>' +
          '<th rowspan="2" scope="col">' + skT('fmColF') + '</th>' +
        '</tr><tr>' +
          '<th scope="col">' + skT('skColKodi') + '</th><th scope="col">' + skT('skColEm') + '</th>' +
          '<th scope="col">Km</th><th scope="col">%</th>' +
        '</tr></thead>' +
        '<tbody>' + body + '</tbody>' +
        '<tfoot><tr>' +
          '<td colspan="' + (lead ? 4 : 3) + '">' + skT('skTotal') + '</td>' +
          '<td>' + skCount(t.n) + '</td>' +
          '<td data-t="km">' + skNum(t.km) + '</td><td></td>' +
          '<td data-t="upd">' + skNum(t.upd) + '</td>' +
          '<td data-t="pct">' + skPct(t.upd, t.km) + '</td><td></td><td></td>' +
        '</tr></tfoot>' +
        '</table></div>' + sk.addButton(id) + '</section>';
    };
    var skRenderMuni = function (name) {
      var html = '';
      skTablesFor(name).forEach(function (tb, i) {
        var rows = sk.rows(tb);
        if (rows.length || (sk.mode === 'add' && i === 0)) html += skTable(tb.id, SK_TABLES[i][1], SK_TABLES[i][2], rows);
      });
      return html;
    };
    var skRenderAll = function () {
      var lists = {};
      var rows = tarData.filter(function (m) {
        var list = [];
        skTablesFor(m.bashkia).forEach(function (tb) { list = list.concat(sk.rows(tb, m.bashkia)); });
        lists[m.bashkia] = list;
        return list.length > 0;
      });
      var all = { n: 0, km: 0, upd: 0 };
      var body = rows.map(function (m, i) {
        var list = lists[m.bashkia];
        var t = skSum(list);
        all.n += t.n; all.km += t.km; all.upd += t.upd;
        return '<tr><td class="c">' + (i + 1) + '</td>' +
          '<td><button type="button" class="sk-link" data-sk-muni="' + xlEsc(m.bashkia) + '">' + xlEsc(m.bashkia) + '</button></td>' +
          '<td>' + xlEsc(m.qarku) + '</td>' +
          '<td class="c">' + t.n + '</td><td class="c">' + skNum(t.km) + '</td>' +
          '<td class="c">' + skNum(t.upd) + '</td><td class="c">' + skPct(t.upd, t.km) + '</td></tr>';
      }).join('');
      return '<section class="sk-sheet">' +
        '<div class="sk-xl-head"><h3 class="sk-xl-title">' + skT(skPre + 'AllTitle') + '</h3><!--hint--></div>' +
        '<div class="sk-scroll"><table class="sk-xl sk-xl-all">' +
        '<thead><tr><th scope="col">' + skT('skColNr') + '</th><th scope="col">' + skT('tblMuni') + '</th><th scope="col">' + skT('tblQark') + '</th>' +
        '<th scope="col">' + skT('skStatSkema') + '</th><th scope="col">' + skT('skStatKm') + '</th>' +
        '<th scope="col">' + skT('skStatUpd') + '</th><th scope="col">%</th></tr></thead>' +
        '<tbody>' + body + '</tbody>' +
        '<tfoot><tr><td colspan="3">' + skT('skTotal') + '</td><td>' + all.n + '</td><td>' + skNum(all.km) + '</td>' +
        '<td>' + skNum(all.upd) + '</td><td>' + skPct(all.upd, all.km) + '</td></tr></tfoot>' +
        '</table></div></section>';
    };
    var skRender = function () {
      var name = skMuniNow();
      fmLoad(name);
      if (!name) {
        skInv.innerHTML = sk.withHint(skRenderAll(), sk.mode !== 'view' ? '<p class="sk-edit-hint">' + skT(sk.mode === 'add' ? 'skAddPick' : 'skEditPick') + '</p>' : '');
        return;
      }
      var body = skRenderMuni(name);
      skInv.innerHTML = body
        ? sk.withHint(body)
        : '<p class="sk-nodata">' + xlEsc(skT(skPre + 'NoData', { m: name })) + '</p>';
    };
    skInv.addEventListener('click', function (e) {
      var pick = e.target.closest('[data-sk-muni]');
      if (pick) document.dispatchEvent(new CustomEvent('idms:pickmuni', { detail: pick.getAttribute('data-sk-muni') }));
    });
    document.addEventListener('idms:munichange', function () { sk.reset(); sk.render(); });
    sk.render();
    skMigrate();
  }
  var hvInv = document.getElementById('hvInv');
  var hvData = window.IDMIS_HIDROVORET;
  if (hvInv && Array.isArray(hvData)) {
    var hvSel = document.getElementById('hvDrejtoria');
    var HV_STORE = 'idms-hv-drejtoria';
    var hvOpen = {};
    var hvNum = function (n) {
      if (n == null) return '';
      return new Intl.NumberFormat(currentLang === 'en' ? 'en-GB' : 'sq-AL', { maximumFractionDigits: 2 }).format(n);
    };
    var hvUniq = function (k) {
      return hvData.map(function (h) { return h[k]; })
        .filter(function (d, i, a) { return d && a.indexOf(d) === i; })
        .sort(function (a, b) { return a.localeCompare(b, 'sq'); });
    };
    var hvDrejtorite = hvUniq('drejtoria');
    var HV_TABLE = [{ id: 'hv', rows: hvData }];
    var hv = xlEditor({
      root: hvInv,
      store: 'idms-hidrovoret',
      scope: function () { return 'all'; },
      editable: function () { return true; },
      tables: function () { return HV_TABLE; },
      keyOf: function (h) { return 'id-' + h.id; },
      visible: function (rows) { return hvVisible(rows); },
      fields: [
        { f: 'emri', type: 'text', label: 'hvColEmri' },
        { f: 'lloji', type: 'select', label: 'hvColLloji', required: true, options: function () { return hvUniq('lloji'); } },
        { f: 'vendodhja', type: 'text', label: 'hvColVendodhja' },
        { f: 'drejtoria', type: 'select', label: 'hvColDrejtoria', required: true, options: function () { return hvDrejtorite.slice(); } },
        { f: 'siperfaqjaHa', type: 'num', label: 'hvColHa' },
        { f: 'kapacitetiM3s', type: 'num', label: 'hvColKap' },
        { f: 'fuqiaKw', type: 'num', label: 'hvColKw' },
        { f: 'elektropompa', type: 'int', label: 'hvColElpAll' },
        { f: 'elektropompaKryesore', type: 'int', label: 'hvColElpMain' },
        { f: 'nenstacioni', type: 'text', label: 'hvColNen' },
        { f: 'nenstacioniVendodhja', type: 'text', label: 'hvColNenVend' },
        { f: 'linja', type: 'int', label: 'hvColLinja' },
        { f: 'shenim', type: 'note', label: 'hvColShenim' }
      ],
      blank: function () {
        return { emri: null, lloji: 'Hidrovor', vendodhja: null, drejtoria: (hvSel && hvSel.value) || hvDrejtorite[0],
          siperfaqjaHa: null, kapacitetiM3s: null, fuqiaKw: null, elektropompa: null, elektropompaKryesore: null,
          nenstacioni: null, nenstacioniVendodhja: null, linja: null, shenim: null };
      },
      validate: function (h) {
        var okNum = function (v) { return v == null || v >= 0; };
        return !!h.emri && !!h.drejtoria && !!h.lloji &&
          ['siperfaqjaHa', 'kapacitetiM3s', 'fuqiaKw', 'elektropompa', 'elektropompaKryesore', 'linja'].every(function (k) { return okNum(h[k]); }) &&
          (h.elektropompa == null || h.elektropompaKryesore == null || h.elektropompaKryesore <= h.elektropompa);
      },
      errKey: 'hvErrRows',
      addLabel: 'hvAddRow',
      addHint: 'hvAddHint',
      onInput: function (tr, f) {
        if (['siperfaqjaHa', 'kapacitetiM3s', 'fuqiaKw', 'elektropompa', 'elektropompaKryesore'].indexOf(f) < 0) return;
        var rows = hvVisible(hv.rows(HV_TABLE[0]));
        var cell = hvInv.querySelector('[data-t="' + f + '"]');
        if (cell) cell.textContent = hvNum(hvSum(rows, f));
      },
      render: function () { hvRender(); }
    });
    if (hvSel) {
      hvDrejtorite.forEach(function (d) {
        var o = document.createElement('option');
        o.value = d;
        o.textContent = d + ' (' + hvData.filter(function (h) { return h.drejtoria === d; }).length + ')';
        hvSel.appendChild(o);
      });
      try { var hvSaved = localStorage.getItem(HV_STORE) || ''; if (hvDrejtorite.indexOf(hvSaved) >= 0) hvSel.value = hvSaved; } catch (e) {}
    }
    var hvVisible = function (rows) {
      var d = hvSel ? hvSel.value : '';
      return rows.filter(function (h) { return !d || h.isNew || h.drejtoria === d; });
    };
    var hvSum = function (rows, k) {
      return Math.round(rows.reduce(function (a, h) { return a + (h[k] || 0); }, 0) * 100) / 100;
    };
    var hvCell = function (h, f) {
      if (['siperfaqjaHa', 'kapacitetiM3s', 'fuqiaKw', 'elektropompa', 'elektropompaKryesore', 'linja'].indexOf(f) >= 0) return hvNum(h[f]);
      if ((f === 'nenstacioni' || f === 'nenstacioniVendodhja') && h[f] == null) return '<span class="hv-na">' + tarT('hvUnknown') + '</span>';
      return xlEsc(h[f]);
    };
    var hvRender = function () {
      var d = hvSel ? hvSel.value : '';
      var rows = hvVisible(hv.rows(HV_TABLE[0]));
      var lead = hv.hasLead();
      var body = rows.map(function (h, i) {
        var on = hv.editing(h), label = h.emri || '';
        var td = function (f, cls) {
          return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (on ? hv.input(h, f, label) : hvCell(h, f)) + '</td>';
        };
        var open = on || !!hvOpen[h.key];
        var noteBtn = on ? '' : h.shenim
          ? '<button type="button" class="hv-note-btn" data-hv-note="' + xlEsc(h.key) + '" aria-expanded="' + open + '">' +
            tarT(open ? 'hvNoteHide' : 'hvNoteShow') + '</button>' : '';
        var noteRow = on
          ? '<tr class="hv-note-row ' + hv.rowClass(h) + '" data-key="' + xlEsc(h.key) + '">' + (lead ? '<td></td>' : '') + '<td></td><td colspan="13">' +
            '<label class="hv-note-edit"><span class="hv-note-lbl">' + tarT('hvColShenim') + ':</span>' + hv.input(h, 'shenim', label) + '</label></td></tr>'
          : h.shenim ? '<tr class="hv-note-row" data-note-for="' + xlEsc(h.key) + '"' + (open ? '' : ' hidden') + '>' + (lead ? '<td></td>' : '') +
            '<td></td><td colspan="13"><span class="hv-note-lbl">' + tarT('hvColShenim') + ':</span> ' + xlEsc(h.shenim) + '</td></tr>' : '';
        return '<tr data-key="' + xlEsc(h.key) + '" class="' + hv.rowClass(h) + '">' + hv.lead(h, label) +
          '<td class="c">' + (i + 1) + '</td>' +
          td('emri', 'hv-name') + td('lloji') + td('vendodhja') + td('drejtoria', 'c') +
          td('siperfaqjaHa', 'c') + td('kapacitetiM3s', 'c') + td('fuqiaKw', 'c') +
          td('elektropompa', 'c') + td('elektropompaKryesore', 'c') +
          td('nenstacioni') + td('nenstacioniVendodhja', 'c') + td('linja', 'c') +
          '<td class="c">' + noteBtn + '</td>' +
          '</tr>' + noteRow;
      }).join('');
      var n = rows.filter(function (h) { return !h.isNew; }).length;
      var title = d ? tarT('hvTitleOne').replace('{d}', xlEsc(d)) : tarT('hvTitleAll');
      hvInv.innerHTML = hv.withHint('<section class="sk-sheet">' +
        '<div class="sk-xl-head"><h3 class="sk-xl-title">' + title + '</h3><!--hint--></div>' +
        '<div class="sk-scroll"><table class="sk-xl hv-xl' + (lead ? ' is-editing' : '') + '">' +
        '<thead><tr>' + hv.headLead('hv', rows.filter(function (h) { return !h.isNew; }), 2) +
          '<th rowspan="2" scope="col">' + tarT('skColNr') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColEmri') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColLloji') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColVendodhja') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColDrejtoria') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColHa') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColKap') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColKw') + '</th>' +
          '<th colspan="2" scope="colgroup">' + tarT('hvColElp') + '</th>' +
          '<th colspan="2" scope="colgroup">' + tarT('hvColNen') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColLinja') + '</th>' +
          '<th rowspan="2" scope="col">' + tarT('hvColShenim') + '</th>' +
        '</tr><tr>' +
          '<th scope="col">' + tarT('hvColElpAll') + '</th><th scope="col">' + tarT('hvColElpMain') + '</th>' +
          '<th scope="col">' + tarT('hvColNenEmri') + '</th><th scope="col">' + tarT('hvColNenVend') + '</th>' +
        '</tr></thead>' +
        '<tbody>' + body + '</tbody>' +
        '<tfoot><tr>' +
          '<td colspan="' + (lead ? 5 : 4) + '">' + tarT('skTotal') + '</td>' +
          '<td>' + (n === 1 ? tarT('hvCount1') : tarT('hvCount').replace('{n}', n)) + '</td>' +
          '<td data-t="siperfaqjaHa">' + hvNum(hvSum(rows, 'siperfaqjaHa')) + '</td>' +
          '<td data-t="kapacitetiM3s">' + hvNum(hvSum(rows, 'kapacitetiM3s')) + '</td>' +
          '<td data-t="fuqiaKw">' + hvNum(hvSum(rows, 'fuqiaKw')) + '</td>' +
          '<td data-t="elektropompa">' + hvNum(hvSum(rows, 'elektropompa')) + '</td>' +
          '<td data-t="elektropompaKryesore">' + hvNum(hvSum(rows, 'elektropompaKryesore')) + '</td>' +
          '<td colspan="4"></td>' +
        '</tr></tfoot>' +
        '</table></div>' + hv.addButton('hv') + '</section>');
    };
    if (hvSel) hvSel.addEventListener('change', function () {
      try { localStorage.setItem(HV_STORE, hvSel.value); } catch (e) {}
      hv.render();
    });
    hvInv.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-hv-note]');
      if (!btn) return;
      var key = btn.getAttribute('data-hv-note');
      var open = btn.getAttribute('aria-expanded') !== 'true';
      if (open) hvOpen[key] = true; else delete hvOpen[key];
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = tarT(open ? 'hvNoteHide' : 'hvNoteShow');
      var row = hvInv.querySelector('[data-note-for="' + key.replace(/["\\]/g, '\\$&') + '"]');
      if (row) row.hidden = !open;
    });
    hv.render();
  }
  var dgInv = document.getElementById('dgInv');
  var dgData = window.IDMIS_DIGA;
  if (dgInv && Array.isArray(dgData)) {
    var dgSel = document.getElementById('dgVendodhja');
    var DG_STORE = 'idms-dg-vendodhja';
    var DG_USES = ['HE', 'U', 'FU', 'PV', 'TR', 'AK', 'AU'];
    var DG_TYPES = ['ED', 'CGD', 'RCC', 'RDCC', 'RDGM', 'CFRD', 'RDAC'];
    var dgNum = function (n, d) {
      if (n == null) return '';
      return new Intl.NumberFormat(currentLang === 'en' ? 'en-GB' : 'sq-AL', { maximumFractionDigits: d == null ? 2 : d }).format(n);
    };
    var dgVends = dgData.map(function (d) { return d.vendodhja; })
      .filter(function (v, i, a) { return v && a.indexOf(v) === i; })
      .sort(function (a, b) { return a.localeCompare(b, 'sq'); });
    var DG_TABLE = [{ id: 'dg', rows: dgData }];
    var dg = xlEditor({
      root: dgInv,
      store: 'idms-diga',
      scope: function () { return 'all'; },
      editable: function () { return true; },
      tables: function () { return DG_TABLE; },
      keyOf: function (d) { return 'id-' + d.id; },
      visible: function (rows) { return dgVisible(rows); },
      fields: [
        { f: 'emri', type: 'text', label: 'dgColEmri' },
        { f: 'vendodhja', type: 'text', label: 'dgColVend' },
        { f: 'lartesiaM', type: 'num', label: 'dgColH' },
        { f: 'kurorM', type: 'num', label: 'dgColL' },
        { f: 'vellimTrupi', type: 'num', label: 'dgColVb' },
        { f: 'vellimRez', type: 'num', label: 'dgColVr' },
        { f: 'lumi', type: 'text', label: 'dgColLumi' },
        { f: 'lloji', type: 'select', label: 'dgColLloji', required: true, options: function () { return DG_TYPES.slice(); } },
        { f: 'viti', type: 'int', label: 'dgColViti' },
        { f: 'qellimi', type: 'text', label: 'dgColQell' }
      ],
      blank: function () {
        return { emri: null, vendodhja: (dgSel && dgSel.value) || null, lartesiaM: null, kurorM: null, vellimTrupi: null,
          vellimRez: null, lumi: null, lloji: 'ED', viti: null, qellimi: null };
      },
      validate: function (d) {
        var okNum = function (v) { return v == null || v >= 0; };
        return !!d.emri && !!d.vendodhja && !!d.lloji &&
          ['lartesiaM', 'kurorM', 'vellimTrupi', 'vellimRez', 'viti'].every(function (k) { return okNum(d[k]); });
      },
      errKey: 'dgErrRows',
      formAdd: true,
      keep: ['rezMatur'],
      onInput: function (tr, f) {
        if (f !== 'vellimTrupi' && f !== 'vellimRez') return;
        var cell = dgInv.querySelector('[data-t="' + f + '"]');
        if (cell) cell.textContent = dgNum(dgSum(dgVisible(dg.rows(DG_TABLE[0])), f));
      },
      render: function () { dgRender(); }
    });
    if (dgSel) {
      dgVends.forEach(function (v) {
        var o = document.createElement('option');
        o.value = v;
        o.textContent = v + ' (' + dgData.filter(function (d) { return d.vendodhja === v; }).length + ')';
        dgSel.appendChild(o);
      });
      try { var dgSaved = localStorage.getItem(DG_STORE) || ''; if (dgVends.indexOf(dgSaved) >= 0) dgSel.value = dgSaved; } catch (e) {}
    }
    var dgVisible = function (rows) {
      var v = dgSel ? dgSel.value : '';
      return rows.filter(function (d) { return !v || d.isNew || d.vendodhja === v; });
    };
    var dgSum = function (rows, k) {
      return Math.round(rows.reduce(function (a, d) { return a + (d[k] || 0); }, 0) * 100) / 100;
    };
    var dgCodeTitle = function (text, prefix, codes) {
      return String(text || '').split(/[\/+]/).map(function (c) {
        var k = c.trim().replace(/\.$/, '');
        return codes.indexOf(k) >= 0 ? k + ' = ' + tarT(prefix + k) : '';
      }).filter(Boolean).join(', ');
    };
    var dgCell = function (d, f) {
      if (f === 'lartesiaM' || f === 'kurorM' || f === 'vellimTrupi' || f === 'vellimRez') return dgNum(d[f]);
      if (f === 'viti') return d.viti == null ? '' : String(d.viti);
      if (f === 'lloji' || f === 'qellimi') {
        var t = f === 'lloji' ? dgCodeTitle(d.lloji, 'dgType_', DG_TYPES) : dgCodeTitle(d.qellimi, 'dgUse_', DG_USES);
        return '<span' + (t ? ' class="dg-code" title="' + xlEsc(t) + '"' : '') + '>' + xlEsc(d[f]) + '</span>';
      }
      return xlEsc(d[f]);
    };
    var dgLegend = function () {
      var list = function (title, rows) {
        return '<table class="sk-xl dg-leg"><thead><tr><th colspan="2" scope="colgroup">' + title + '</th></tr></thead><tbody>' +
          rows.map(function (r) { return '<tr><td class="c' + (r[2] ? ' ' + r[2] : '') + '">' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') +
          '</tbody></table>';
      };
      return '<section class="sk-sheet dg-legend">' +
        '<div class="sk-xl-head"><h3 class="sk-xl-title">' + tarT('dgLegend') + '</h3></div>' +
        '<div class="dg-leg-grid">' +
        list(tarT('dgLegUse'), DG_USES.map(function (c) { return [c, tarT('dgUse_' + c)]; })) +
        list(tarT('dgLegType'), DG_TYPES.map(function (c) { return [c, tarT('dgType_' + c)]; })) +
        list(tarT('dgLegVol'), [['', tarT('dgMeasured'), 'dg-measured'], ['', tarT('dgDesigned')]]) +
        '</div></section>';
    };
    var dgRender = function () {
      var v = dgSel ? dgSel.value : '';
      var rows = dgVisible(dg.rows(DG_TABLE[0]));
      var lead = dg.hasLead();
      var body = rows.map(function (d) {
        var on = dg.editing(d), label = d.emri || '';
        var td = function (f, cls) {
          return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (on ? dg.input(d, f, label) : dgCell(d, f)) + '</td>';
        };
        return '<tr data-key="' + xlEsc(d.key) + '" class="' + dg.rowClass(d) + '">' + dg.lead(d, label) +
          '<td class="c">' + (d.id == null ? '' : d.id) + '</td>' +
          td('emri', 'dg-name') + td('vendodhja') +
          td('lartesiaM', 'c') + td('kurorM', 'c') + td('vellimTrupi', 'c') +
          td('vellimRez', 'r' + (d.rezMatur && !on ? ' dg-measured' : '')) +
          td('lumi') + td('lloji', 'c') + td('viti', 'c') + td('qellimi', 'c') +
          '</tr>';
      }).join('');
      var n = rows.filter(function (d) { return !d.isNew; }).length;
      var th = function (key) { return '<th scope="col">' + tarT(key) + '</th>'; };
      var title = v ? tarT('dgTitleOne').replace('{d}', xlEsc(v)) : tarT('dgTitleAll');
      dgInv.innerHTML = dg.withHint('<section class="sk-sheet">' +
        '<div class="sk-xl-head"><h3 class="sk-xl-title">' + title + '</h3><!--hint--></div>' +
        '<div class="sk-scroll"><table class="sk-xl dg-xl' + (lead ? ' is-editing' : '') + '">' +
        '<thead><tr>' + dg.headLead('dg', rows.filter(function (d) { return !d.isNew; }), 2) +
          '<th colspan="11" scope="colgroup">' + tarT('dgGrpMain') + '</th>' +
        '</tr><tr>' +
          th('skColNr') + th('dgColEmri') + th('dgColVend') + th('dgColH') + th('dgColL') + th('dgColVb') + th('dgColVr') +
          th('dgColLumi') + th('dgColLloji') + th('dgColViti') + th('dgColQell') +
        '</tr></thead>' +
        '<tbody>' + body + '</tbody>' +
        '<tfoot><tr>' +
          '<td colspan="' + (lead ? 3 : 2) + '">' + tarT('skTotal') + '</td>' +
          '<td>' + (n === 1 ? tarT('dgCount1') : tarT('dgCount').replace('{n}', n)) + '</td>' +
          '<td colspan="2"></td>' +
          '<td data-t="vellimTrupi">' + dgNum(dgSum(rows, 'vellimTrupi')) + '</td>' +
          '<td data-t="vellimRez">' + dgNum(dgSum(rows, 'vellimRez')) + '</td>' +
          '<td colspan="4"></td>' +
        '</tr></tfoot>' +
        '</table></div></section>' + dgLegend());
    };
    var dgAdd = document.getElementById('dgAdd');
    if (dgAdd) {
      var dgField = function (f) {
        var isNum = f.type === 'num' || f.type === 'int';
        return '<div class="field' + (f.wide ? ' dg-wide' : '') + '"><label for="' + f.id + '"><span data-i18n="' + f.label + '">' + xlEsc(tarT(f.label)) + '</span>' +
          (f.req ? ' <span class="req" aria-hidden="true">*</span>' : '') + '</label>' +
          '<input id="' + f.id + '" name="' + f.name + '" type="' + (isNum ? 'number' : 'text') + '"' +
          (isNum ? ' inputmode="' + (f.type === 'int' ? 'numeric' : 'decimal') + '" min="0" step="' + (f.type === 'int' ? '1' : 'any') + '"' : '') +
          (f.ph ? ' data-dg-ph="' + f.ph + '" placeholder="' + xlEsc(tarT(f.ph)) + '"' : '') +
          (f.list ? ' list="' + f.list + '"' : '') + (f.req ? ' required' : '') +
          ' autocomplete="off" aria-describedby="' + f.id + '-err">' +
          '<p class="field-error" id="' + f.id + '-err" hidden></p></div>';
      };
      var dgStep = function (n, key, body) {
        return '<fieldset class="tar-fieldset"><legend><span class="tariff-num">' + n + '</span><span data-i18n="' + key + '">' + tarT(key) + '</span></legend>' +
          '<div class="tar-grid">' + body + '</div></fieldset>';
      };
      var dgTypeText = function (c) { return c + ' — ' + tarT('dgType_' + c); };
      var dgIntHtml = function () {
        return '<form class="form tar-form dg-form dg-int" id="dgIntForm" novalidate>' +
          '<div class="tar-form-head"><h2 class="tar-form-title" data-i18n="dgIntTitle">' + tarT('dgIntTitle') + '</h2>' +
          '<p class="tar-form-intro" data-i18n="dgIntIntro">' + tarT('dgIntIntro') + '</p></div>' +
          '<div class="field"><label for="dgIDiga"><span data-i18n="dgIntDiga">' + tarT('dgIntDiga') + '</span> <span class="req" aria-hidden="true">*</span></label>' +
          '<select id="dgIDiga" name="diga" required aria-describedby="dgIDiga-err"></select>' +
          '<p class="field-error" id="dgIDiga-err" hidden></p></div>' +
          '<div class="tar-grid">' +
          dgField({ id: 'dgIViti', name: 'viti', label: 'dgIntViti', req: true, type: 'int', ph: 'dgPhViti' }) +
          dgField({ id: 'dgILloji', name: 'lloji', label: 'dgIntLloji', req: true, ph: 'dgIntLlojiPh', list: 'dgILlojiList' }) +
          '<div class="field dg-wide"><label for="dgIPersh" data-i18n="dgIntPersh">' + tarT('dgIntPersh') + '</label>' +
          '<textarea id="dgIPersh" name="pershkrimi" rows="3" data-dg-ph="dgIntPershPh" placeholder="' + xlEsc(tarT('dgIntPershPh')) + '"></textarea></div>' +
          dgField({ id: 'dgIVlera', name: 'vlera', label: 'dgIntVlera', type: 'num', ph: 'dgIntVleraPh' }) +
          dgField({ id: 'dgIBurimi', name: 'burimi', label: 'dgIntBurimi', ph: 'dgIntBurimiPh', list: 'dgIBurimiList' }) +
          '</div><datalist id="dgILlojiList"></datalist><datalist id="dgIBurimiList"></datalist>' +
          '<div class="tar-form-actions"><button class="btn btn-primary" type="submit" data-i18n="dgIntSave">' + tarT('dgIntSave') + '</button>' +
          '<button class="btn btn-secondary" type="reset" data-i18n="dgAddReset">' + tarT('dgAddReset') + '</button>' +
          '<p class="tar-form-status" id="dgIntStatus" role="status" aria-live="polite" hidden></p></div>' +
          '<div class="dg-int-list" id="dgIntList"></div>' +
          '</form>';
      };
      dgAdd.innerHTML = '<div class="dg-add-grid"><form class="form tar-form dg-form" id="dgForm" novalidate>' +
        '<div class="tar-form-head"><h2 class="tar-form-title" data-i18n="dgAddTitle">' + tarT('dgAddTitle') + '</h2>' +
        '<p class="tar-form-intro" data-i18n="dgAddIntro">' + tarT('dgAddIntro') + '</p></div>' +
        dgStep(1, 'dgAddG1',
          dgField({ id: 'dgFEmri', name: 'emri', label: 'dgColEmri', req: true, ph: 'dgPhEmri' }) +
          dgField({ id: 'dgFVend', name: 'vendodhja', label: 'dgColVend', req: true, ph: 'dgPhVend', list: 'dgFVendList' }) +
          dgField({ id: 'dgFLumi', name: 'lumi', label: 'dgColLumi', ph: 'dgPhLumi', wide: true }) +
          '<datalist id="dgFVendList">' + dgVends.map(function (v) { return '<option value="' + xlEsc(v) + '">'; }).join('') + '</datalist>') +
        dgStep(2, 'dgAddG2',
          dgField({ id: 'dgFH', name: 'lartesiaM', label: 'dgColH', type: 'num' }) +
          dgField({ id: 'dgFL', name: 'kurorM', label: 'dgColL', type: 'num' }) +
          dgField({ id: 'dgFVb', name: 'vellimTrupi', label: 'dgColVb', type: 'num' }) +
          dgField({ id: 'dgFVr', name: 'vellimRez', label: 'dgColVr', type: 'num' }) +
          '<div class="field"><label for="dgFMatur" data-i18n="dgVolKind">' + tarT('dgVolKind') + '</label>' +
          '<select id="dgFMatur" name="rezMatur"><option value="" data-i18n="dgDesigned">' + tarT('dgDesigned') + '</option>' +
          '<option value="1" data-i18n="dgMeasured">' + tarT('dgMeasured') + '</option></select></div>') +
        dgStep(3, 'dgAddG3',
          '<div class="field"><label for="dgFLloji"><span data-i18n="dgColLloji">' + tarT('dgColLloji') + '</span> <span class="req" aria-hidden="true">*</span></label>' +
          '<select id="dgFLloji" name="lloji" required aria-describedby="dgFLloji-err"><option value="" data-i18n="dgTypePick">' + tarT('dgTypePick') + '</option>' +
          DG_TYPES.map(function (c) { return '<option value="' + c + '" data-dg-type="' + c + '">' + xlEsc(dgTypeText(c)) + '</option>'; }).join('') +
          '</select><p class="field-error" id="dgFLloji-err" hidden></p></div>' +
          dgField({ id: 'dgFViti', name: 'viti', label: 'dgColViti', type: 'int', ph: 'dgPhViti' }) +
          '<fieldset class="dg-uses dg-wide"><legend class="dg-uses-lbl"><span data-i18n="dgColQell">' + tarT('dgColQell') + '</span> ' +
          '<span class="field-hint" data-i18n="dgUseHint">' + tarT('dgUseHint') + '</span></legend><div class="dg-use-grid">' +
          DG_USES.map(function (c) {
            return '<label class="dg-use"><input type="checkbox" name="qellimi" value="' + c + '"><span class="dg-use-code">' + c + '</span>' +
              '<span data-i18n="dgUse_' + c + '">' + tarT('dgUse_' + c) + '</span></label>';
          }).join('') + '</div></fieldset>') +
        '<div class="tar-form-actions"><button class="btn btn-primary" type="submit" data-i18n="dgAddSave">' + tarT('dgAddSave') + '</button>' +
        '<button class="btn btn-secondary" type="reset" data-i18n="dgAddReset">' + tarT('dgAddReset') + '</button>' +
        '<p class="tar-form-status" id="dgFormStatus" role="status" aria-live="polite" hidden></p></div>' +
        '</form>' + dgIntHtml() + '</div>';
      var dgFormEl = document.getElementById('dgForm');
      var dgStatus = document.getElementById('dgFormStatus');
      var dgShowStatus = function (box, html, isErr) {
        box.innerHTML = html;
        box.classList.toggle('is-error', !!isErr);
        box.hidden = false;
      };
      var dgSetErr = function (el, key) {
        var p = document.getElementById(el.id + '-err');
        if (key) { el.setAttribute('aria-invalid', 'true'); if (p) { p.textContent = tarT(key); p.hidden = false; } }
        else { el.removeAttribute('aria-invalid'); if (p) p.hidden = true; }
        return !!key;
      };
      var dgReadText = function (el, req, bad) {
        var v = el.value.replace(/\s+/g, ' ').trim();
        if (dgSetErr(el, req && !v ? 'dgErrReq' : null)) bad.push(el);
        return v || null;
      };
      var dgReadNum = function (el, isYear, req, bad) {
        var raw = el.value.trim(), v = raw === '' ? null : Number(raw);
        var err = (el.validity && el.validity.badInput) ||
          (v != null && (!isFinite(v) || v < 0 || (isYear && (v % 1 !== 0 || v < 1900 || v > 2100))))
          ? (isYear ? 'dgErrYear' : 'dgErrNum') : req && v == null ? 'dgErrReq' : null;
        if (dgSetErr(el, err)) bad.push(el);
        return err ? null : v;
      };
      dgFormEl.addEventListener('submit', function (e) {
        e.preventDefault();
        var els = dgFormEl.elements, bad = [];
        var text = function (name, req) { return dgReadText(els[name], req, bad); };
        var num = function (name, isYear) { return dgReadNum(els[name], isYear, false, bad); };
        var row = {
          emri: text('emri', true), vendodhja: text('vendodhja', true), lumi: text('lumi'),
          lartesiaM: num('lartesiaM'), kurorM: num('kurorM'), vellimTrupi: num('vellimTrupi'), vellimRez: num('vellimRez'),
          rezMatur: els.rezMatur.value === '1', lloji: text('lloji', true), viti: num('viti', true),
          qellimi: Array.prototype.map.call(dgFormEl.querySelectorAll('input[name="qellimi"]:checked'), function (c) { return c.value; }).join('/') || null
        };
        if (bad.length) { dgShowStatus(dgStatus, xlEsc(tarT('dgAddErr')), true); bad[0].focus(); return; }
        var store;
        try { store = JSON.parse(localStorage.getItem('idms-diga')); } catch (err) { store = null; }
        if (!store || typeof store !== 'object') store = {};
        var all = store.all = store.all || {};
        var added = all.__added = all.__added || {};
        var key = 'add-' + Date.now().toString(36);
        (added.dg = added.dg || []).push(Object.assign({ key: key }, row));
        try { localStorage.setItem('idms-diga', JSON.stringify(store)); }
        catch (err) { dgShowStatus(dgStatus, xlEsc(tarT('skSaveFail')), true); return; }
        if (dgSel && dgSel.value && dgSel.value !== row.vendodhja) {
          dgSel.value = '';
          try { localStorage.setItem(DG_STORE, ''); } catch (err) {}
        }
        dgFormEl.reset();
        dg.render();
        dgIntDams();
        dgShowStatus(dgStatus, xlEsc(tarT('dgAddDone').replace('{n}', row.emri)) +
          ' <button type="button" class="tar-form-link dg-goto" data-dg-goto="' + key + '">' + xlEsc(tarT('dgAddSee')) + '</button>');
        els.emri.focus();
      });
      var DG_INT_STORE = 'idms-diga-nderhyrje';
      var dgIntFormEl = document.getElementById('dgIntForm');
      var dgIntSel = document.getElementById('dgIDiga');
      var dgIntStatus = document.getElementById('dgIntStatus');
      var dgIntBox = document.getElementById('dgIntList');
      var dgIntRead = function () {
        try { var v = JSON.parse(localStorage.getItem(DG_INT_STORE)); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
      };
      var dgIntWrite = function (store) {
        try { localStorage.setItem(DG_INT_STORE, JSON.stringify(store)); return true; } catch (e) { return false; }
      };
      var dgIntDams = function () {
        var cur = dgIntSel.value, rows = dg.rows(DG_TABLE[0]);
        dgIntSel.innerHTML = '<option value="" data-i18n="dgIntDigaPick">' + xlEsc(tarT('dgIntDigaPick')) + '</option>' +
          rows.map(function (d) {
            return '<option value="' + xlEsc(d.key) + '">' + xlEsc((d.id != null ? d.id + ' · ' : '') + (d.emri || '') +
              (d.vendodhja ? ' (' + d.vendodhja + ')' : '') + (d.id == null ? ' — ' + tarT('dgNew') : '')) + '</option>';
          }).join('');
        if (rows.some(function (d) { return d.key === cur; })) dgIntSel.value = cur;
      };
      var dgIntSuggest = function () {
        var fill = function (id, key) {
          document.getElementById(id).innerHTML = tarT(key).split('|').map(function (v) { return '<option value="' + xlEsc(v) + '">'; }).join('');
        };
        fill('dgILlojiList', 'dgIntTypes');
        fill('dgIBurimiList', 'dgIntSources');
      };
      var dgIntRender = function () {
        var key = dgIntSel.value;
        if (!key) { dgIntBox.innerHTML = '<p class="dg-int-empty">' + xlEsc(tarT('dgIntPickFirst')) + '</p>'; return; }
        var list = (dgIntRead()[key] || []).slice().sort(function (a, b) { return (b.viti || 0) - (a.viti || 0); });
        var head = '<h3 class="dg-int-head">' + xlEsc(tarT('dgIntList')) + ' <span class="dg-int-n">' + list.length + '</span></h3>';
        if (!list.length) { dgIntBox.innerHTML = head + '<p class="dg-int-empty">' + xlEsc(tarT('dgIntNone')) + '</p>'; return; }
        var total = list.reduce(function (a, x) { return a + (x.vlera || 0); }, 0);
        dgIntBox.innerHTML = head + '<ul class="dg-int-items">' + list.map(function (x) {
          return '<li class="dg-int-item"><div class="dg-int-top"><span class="dg-int-year">' + xlEsc(x.viti) + '</span>' +
            '<span class="dg-int-type">' + xlEsc(x.lloji) + '</span>' +
            '<button type="button" class="xl-del" data-dg-int-del="' + xlEsc(x.id) + '" aria-label="' + xlEsc(tarT('dgIntRemove')) +
            '" title="' + xlEsc(tarT('dgIntRemove')) + '">×</button></div>' +
            (x.pershkrimi ? '<p class="dg-int-desc">' + xlEsc(x.pershkrimi) + '</p>' : '') +
            (x.vlera != null || x.burimi ? '<p class="dg-int-meta">' +
              (x.vlera != null ? '<span>' + dgNum(x.vlera) + ' ' + xlEsc(tarT('dgLek')) + '</span>' : '') +
              (x.burimi ? '<span>' + xlEsc(x.burimi) + '</span>' : '') + '</p>' : '') +
            '</li>';
        }).join('') + '</ul><p class="dg-int-total">' + xlEsc(tarT('dgIntTotal').replace('{v}', dgNum(total))) + '</p>';
      };
      dgIntFormEl.addEventListener('submit', function (e) {
        e.preventDefault();
        var els = dgIntFormEl.elements, bad = [];
        if (dgSetErr(dgIntSel, dgIntSel.value ? null : 'dgErrReq')) bad.push(dgIntSel);
        var item = {
          viti: dgReadNum(els.viti, true, true, bad), lloji: dgReadText(els.lloji, true, bad),
          pershkrimi: els.pershkrimi.value.trim() || null, vlera: dgReadNum(els.vlera, false, false, bad),
          burimi: dgReadText(els.burimi, false, bad)
        };
        if (bad.length) { dgShowStatus(dgIntStatus, xlEsc(tarT('dgAddErr')), true); bad[0].focus(); return; }
        var store = dgIntRead(), key = dgIntSel.value;
        store[key] = (store[key] || []).concat([Object.assign({ id: 'i-' + Date.now().toString(36) }, item)]);
        if (!dgIntWrite(store)) { dgShowStatus(dgIntStatus, xlEsc(tarT('skSaveFail')), true); return; }
        ['viti', 'lloji', 'pershkrimi', 'vlera', 'burimi'].forEach(function (n) { els[n].value = ''; });
        dgIntRender();
        var dam = dg.rows(DG_TABLE[0]).filter(function (d) { return d.key === key; })[0] || {};
        dgShowStatus(dgIntStatus, xlEsc(tarT('dgIntDone').replace('{n}', dam.emri || '')));
        els.viti.focus();
      });
      dgIntFormEl.addEventListener('reset', function () {
        dgIntFormEl.querySelectorAll('[aria-invalid]').forEach(function (el) { dgSetErr(el, null); });
        dgIntStatus.hidden = true;
        setTimeout(dgIntRender, 0);
      });
      dgIntSel.addEventListener('change', function () {
        dgSetErr(dgIntSel, null);
        dgIntStatus.hidden = true;
        dgIntRender();
      });
      dgIntBox.addEventListener('click', function (e) {
        var del = e.target.closest('[data-dg-int-del]');
        if (!del) return;
        var store = dgIntRead(), key = dgIntSel.value, id = del.getAttribute('data-dg-int-del');
        store[key] = (store[key] || []).filter(function (x) { return x.id !== id; });
        if (!store[key].length) delete store[key];
        dgIntWrite(store);
        dgIntRender();
      });
      dgIntDams();
      dgIntSuggest();
      dgIntRender();
      dgFormEl.addEventListener('reset', function () {
        dgFormEl.querySelectorAll('[aria-invalid]').forEach(function (el) { dgSetErr(el, null); });
        dgStatus.hidden = true;
      });
      dgAdd.addEventListener('input', function (e) {
        if (e.target.getAttribute('aria-invalid')) dgSetErr(e.target, null);
      });
      dgAdd.addEventListener('click', function (e) {
        var go = e.target.closest('[data-dg-goto]');
        if (!go) return;
        var tr = dgInv.querySelector('tr[data-key="' + go.getAttribute('data-dg-goto') + '"]');
        if (!tr) return;
        tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        tr.classList.add('dg-hl');
        setTimeout(function () { tr.classList.remove('dg-hl'); }, 2400);
      });
      document.addEventListener('idms:langchange', function () {
        dgAdd.querySelectorAll('[data-dg-ph]').forEach(function (el) { el.placeholder = tarT(el.getAttribute('data-dg-ph')); });
        dgAdd.querySelectorAll('[data-dg-type]').forEach(function (el) { el.textContent = dgTypeText(el.getAttribute('data-dg-type')); });
        dgIntDams();
        dgIntSuggest();
        dgIntRender();
      });
      var dgFocusForm = function () {
        if (location.hash === '#shto') setTimeout(function () { dgFormEl.elements.emri.focus({ preventScroll: true }); }, 0);
      };
      window.addEventListener('hashchange', dgFocusForm);
      dgFocusForm();
    }
    if (dgSel) dgSel.addEventListener('change', function () {
      try { localStorage.setItem(DG_STORE, dgSel.value); } catch (e) {}
      dg.render();
    });
    dg.render();
  }
  var nvRoot = document.getElementById('nvPlan');
  if (nvRoot && window.IDMIS_NEVOJA_UJIT) {
    var NV_STORE = 'idms-nevoja-ujit-mm';
    var NV_ZONE_STORE = 'idms-nevoja-ujit-zona';
    var NV_MAX = 100;
    var nvData = window.IDMIS_NEVOJA_UJIT;
    var nvEditBtn = document.getElementById('nvEdit');
    var nvCancelBtn = document.getElementById('nvCancel');
    var nvSaveBtn = document.getElementById('nvSave');
    var nvSaveN = document.getElementById('nvSaveN');
    var nvExportBtn = document.getElementById('nvExport');
    var nvZoneSel = document.getElementById('nvZone');
    var nvGroups = nvData.grupet.map(function (g) { return g.grupi; });
    var nvZoneOf = function (id) { return nvData.zonat.filter(function (z) { return z.id === id; })[0]; };
    var nvZone = nvData.zonat[0].id;
    try { var nvZ = localStorage.getItem(NV_ZONE_STORE); if (nvZoneOf(nvZ)) nvZone = nvZ; } catch (e) {}
    var NV_LOC_STORE = 'idms-nevoja-ujit-vend';
    var nvPlaces = nvData.vendndodhjet || [];
    var nvLocQ = document.getElementById('nvQark');
    var nvLocB = document.getElementById('nvBashki');
    var nvLocN = document.getElementById('nvNjesi');
    var nvLocOut = document.getElementById('nvLocOut');
    var nvLoc = { q: '', b: '', n: '' };
    try {
      var nvL = JSON.parse(localStorage.getItem(NV_LOC_STORE));
      if (nvL && typeof nvL === 'object') nvLoc = { q: nvL.q || '', b: nvL.b || '', n: nvL.n || '' };
    } catch (e) {}
    var nvUniq = function (arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); };
    var nvSorted = function (arr) { return nvUniq(arr).sort(function (a, b) { return a.localeCompare(b, 'sq'); }); };
    var nvLocZones = function () {
      return nvUniq(nvPlaces.filter(function (p) {
        return (!nvLoc.q || p[0] === nvLoc.q) && (!nvLoc.b || p[1] === nvLoc.b) && (!nvLoc.n || p[2] === nvLoc.n);
      }).map(function (p) { return p[3]; }));
    };
    var nvLocName = function () { return [nvLoc.n, nvLoc.b, nvLoc.q].filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(', '); };
    var nvLocTitle = function () {
      var zs = nvLocZones();
      return nvLoc.q && zs.length === 1 && zs[0] === nvZone ? nvLocName() : '';
    };
    var nvLocSave = function () { try { localStorage.setItem(NV_LOC_STORE, JSON.stringify(nvLoc)); } catch (e) {} };
    var NV_HA_STORE = 'idms-nevoja-ujit-ha';
    var nvHaRead = function () {
      try { var s = JSON.parse(localStorage.getItem(NV_HA_STORE)); return s && typeof s === 'object' && !Array.isArray(s) ? s : {}; }
      catch (e) { return {}; }
    };
    var nvHaKey = function () { return nvLocTitle() ? 'vend:' + [nvLoc.q, nvLoc.b, nvLoc.n].join('|') : 'zona:' + nvZone; };
    var nvHaOf = function (r) {
      var v = (nvHaRead()[nvHaKey()] || {})[r.key];
      return typeof v === 'number' && v >= 0 ? v : null;
    };
    var nvHaSet = function (key, v) {
      var store = nvHaRead(), hk = nvHaKey();
      store[hk] = store[hk] || {};
      if (v == null || !(v >= 0)) delete store[hk][key]; else store[hk][key] = v;
      if (!Object.keys(store[hk]).length) delete store[hk];
      try { localStorage.setItem(NV_HA_STORE, JSON.stringify(store)); } catch (e) {}
    };
    var nvLocCheck = function () {
      if (SCOPE) { nvLoc.q = SCOPE.qarku; nvLoc.b = SCOPE.bashkia; }
      var qs = nvSorted(nvPlaces.map(function (p) { return p[0]; }));
      if (qs.indexOf(nvLoc.q) < 0) nvLoc = { q: '', b: '', n: '' };
      var bs = nvPlaces.filter(function (p) { return p[0] === nvLoc.q; }).map(function (p) { return p[1]; });
      if (bs.indexOf(nvLoc.b) < 0) { nvLoc.b = ''; nvLoc.n = ''; }
      var ns = nvPlaces.filter(function (p) { return p[0] === nvLoc.q && p[1] === nvLoc.b; }).map(function (p) { return p[2]; });
      if (ns.indexOf(nvLoc.n) < 0) nvLoc.n = '';
      var zs = nvLocZones();
      if (nvLoc.q && zs.length === 1 && nvZoneOf(zs[0])) nvZone = zs[0];
    };
    nvLocCheck();
    var nvEsc = function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };
    var nvFmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, currentLang === 'en' ? ',' : '.'); };
    var nvZoneName = function (z) { return tarT('nvZ_' + z.id) || z.emri; };
    var nvDefault = function (id) {
      var zone = nvZoneOf(id), rows = [];
      nvData.grupet.forEach(function (g) {
        g.kulturat.forEach(function (c) {
          rows.push({ key: 'k-' + c, grupi: g.grupi, emri: c, m: zone.kulturat[c] ? zone.kulturat[c].slice() : null });
        });
      });
      return rows;
    };
    var nvReadStore = function () {
      try { var s = JSON.parse(localStorage.getItem(NV_STORE)); return s && typeof s === 'object' && !Array.isArray(s) ? s : {}; }
      catch (e) { return {}; }
    };
    var nvLoad = function (id) {
      var saved = nvReadStore()[id];
      if (Array.isArray(saved)) {
        saved = saved.filter(function (r) {
          return r && nvGroups.indexOf(r.grupi) >= 0 && (r.m === null || (Array.isArray(r.m) && r.m.length === 12));
        });
        if (saved.length) return saved;
      }
      return nvDefault(id);
    };
    var nvRows = nvLoad(nvZone);
    var nvDraft = null;
    var nvInputs = false;
    var nvSel = null;
    var nvDrag = null;
    var nvDropOff = 0;
    var nvBad = {};
    var nvClone = function (rows) { return JSON.parse(JSON.stringify(rows)); };
    var nvSum = function (m) {
      if (!m) return null;
      var have = m.filter(function (v) { return v != null; });
      return have.length ? have.reduce(function (a, v) { return a + v; }, 0) : null;
    };
    var nvRowByKey = function (key) {
      return (nvDraft || nvRows).filter(function (r) { return r.key === key; })[0] || null;
    };
    var nvChanged = function () {
      if (!nvDraft) return 0;
      var before = {}, kept = {};
      nvRows.forEach(function (r) { before[r.key] = JSON.stringify(r); });
      var n = nvDraft.filter(function (r) { kept[r.key] = 1; return before[r.key] !== JSON.stringify(r); }).length;
      return n + nvRows.filter(function (r) { return !kept[r.key]; }).length;
    };
    var nvSyncBar = function () {
      nvEditBtn.setAttribute('aria-pressed', nvInputs ? 'true' : 'false');
      nvCancelBtn.hidden = !nvDraft;
      nvSaveBtn.hidden = !nvDraft;
      nvZoneSel.disabled = !!nvDraft;
      var n = nvChanged();
      nvSaveN.textContent = n ? n : '';
      nvSaveN.hidden = !n;
    };
    var nvZoneOptions = function () {
      nvZoneSel.innerHTML = nvData.zonat.map(function (z) {
        return '<option value="' + nvEsc(z.id) + '"' + (z.id === nvZone ? ' selected' : '') + '>' + nvEsc(nvZoneName(z)) + '</option>';
      }).join('');
    };
    var nvLocRender = function () {
      if (!nvLocQ) return;
      var opts = function (list, val, allKey) {
        return '<option value="">' + nvEsc(tarT(allKey)) + '</option>' + list.map(function (v) {
          return '<option value="' + nvEsc(v) + '"' + (v === val ? ' selected' : '') + '>' + nvEsc(v) + '</option>';
        }).join('');
      };
      nvLocQ.innerHTML = opts(nvSorted(nvPlaces.map(function (p) { return p[0]; })), nvLoc.q, 'nvQarkLbl');
      nvLocB.innerHTML = opts(nvSorted(nvPlaces.filter(function (p) { return p[0] === nvLoc.q; }).map(function (p) { return p[1]; })), nvLoc.b, 'nvBashkiLbl');
      nvLocN.innerHTML = opts(nvSorted(nvPlaces.filter(function (p) { return p[0] === nvLoc.q && p[1] === nvLoc.b; }).map(function (p) { return p[2]; })), nvLoc.n, 'nvNjesiLbl');
      [[nvLocQ, 'nvQarkLbl'], [nvLocB, 'nvBashkiLbl'], [nvLocN, 'nvNjesiLbl']].forEach(function (s) { s[0].setAttribute('aria-label', tarT(s[1])); });
      nvLocQ.disabled = !!nvDraft || !!SCOPE;
      nvLocB.disabled = !!nvDraft || !nvLoc.q || !!SCOPE;
      nvLocN.disabled = !!nvDraft || !nvLoc.b;
      var zs = nvLocZones();
      var chip = function (id) { return '<span class="nv-chip">Z' + id.replace('zona', '') + '</span>'; };
      nvLocOut.hidden = !(nvLoc.q && zs.length > 1);
      nvLocOut.innerHTML = nvLocOut.hidden ? '' : nvEsc(tarT('nvLocMany').replace('{n}', zs.length)) + ' ' + zs.sort().map(chip).join(' ');
    };
    var nvTotals = function (r) {
      var t = nvSum(r.m);
      if (t == null) return '<td class="nv-num nv-tot">—</td><td class="nv-num">—</td>';
      var zone = nvZoneOf(nvZone), xl = zone.totalet ? zone.totalet[r.emri] : null;
      var warn = xl != null && xl !== t && JSON.stringify(r.m) === JSON.stringify(zone.kulturat[r.emri]);
      var msg = warn ? tarT('nvExcelTotal').replace('{n}', nvFmt(xl)) : '';
      return '<td class="nv-num nv-tot"' + (warn ? ' title="' + nvEsc(msg) + '"' : '') + '>' + nvFmt(t) +
        (warn ? '<span class="nv-warn" aria-hidden="true">!</span><span class="sr-only">' + nvEsc(msg) + '</span>' : '') + '</td>' +
        '<td class="nv-num">' + nvFmt(t * 10) + '</td>';
    };
    var nvDec = function (n) {
      return n.toLocaleString(currentLang === 'en' ? 'en-GB' : 'de-DE', { maximumFractionDigits: 2 });
    };
    var nvReqVal = function (r) {
      var t = nvSum(r.m), ha = nvHaOf(r);
      return t == null ? '—' : nvFmt(Math.round(t * 10 * (ha || 0)));
    };
    var nvReqCells = function (r) {
      var ha = nvHaOf(r);
      return '<td class="nv-num nv-ha-cell"><input class="sk-in sk-in-num nv-ha" type="number" min="0" step="any" inputmode="decimal" data-nv-ha value="' + nvEsc(ha) + '" placeholder="0"' +
        ' aria-label="' + nvEsc(tarT('nvHaLbl').replace('{c}', r.emri || tarT('nvNewCrop'))) + '"></td>' +
        '<td class="nv-num nv-req">' + nvReqVal(r) + '</td>';
    };
    var nvFoot = function (rows) {
      var ha = 0, req = 0, mon = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      rows.forEach(function (r) {
        var a = nvHaOf(r);
        if (!a || !r.m) return;
        ha += a;
        r.m.forEach(function (v, i) { if (v) { mon[i] += v * 10 * a; req += v * 10 * a; } });
      });
      return '<tr><th scope="row" colspan="2" class="nv-foot-h">' + nvEsc(tarT('nvFootReq')) + '</th>' +
        '<td class="nv-num"></td><td class="nv-num"></td>' +
        '<td class="nv-num nv-foot-ha">' + nvDec(ha) + '</td>' +
        '<td class="nv-num nv-foot-req">' + nvFmt(Math.round(req)) + '</td>' +
        mon.map(function (v, i) {
          return '<td class="nv-num nv-foot-m"' + (v ? ' title="' + nvEsc(tarT('nvM' + (i + 1)) + ': ' + nvFmt(Math.round(v)) + ' m³') + '"' : '') + '>' + (v ? nvFmt(Math.round(v)) : '') + '</td>';
        }).join('') + '</tr>';
    };
    var nvShade = function (v) {
      if (!v) return '';
      var a = Math.round(10 + 50 * Math.min(v, NV_MAX) / NV_MAX);
      return ' style="--nv-a:' + a + '%"';
    };
    var nvClampOff = function (sel, off) { return Math.max(-sel.a, Math.min(11 - sel.b, off)); };
    var nvShift = function (r, a, b, off) {
      var lo = Math.min(a, a + off), hi = Math.max(b, b + off);
      var block = r.m.slice(a, b + 1), rest = [];
      for (var i = lo; i <= hi; i++) if (i < a || i > b) rest.push(r.m[i]);
      var seg = off > 0 ? rest.concat(block) : block.concat(rest);
      for (var j = 0; j < seg.length; j++) r.m[lo + j] = seg[j];
    };
    var nvMove = function (off) {
      if (!nvSel) return false;
      off = nvClampOff(nvSel, off);
      if (!off) return false;
      if (!nvDraft) { nvDraft = nvClone(nvRows); nvBad = {}; }
      var r = nvRowByKey(nvSel.key);
      if (!r || !r.m) return false;
      nvShift(r, nvSel.a, nvSel.b, off);
      nvSel = { key: nvSel.key, a: nvSel.a + off, b: nvSel.b + off };
      return true;
    };
    var nvSeason = function (r, mi) {
      var a = mi, b = mi;
      while (a > 0 && r.m[a - 1]) a--;
      while (b < 11 && r.m[b + 1]) b++;
      return { key: r.key, a: a, b: b };
    };
    var nvRender = function () {
      var rows = nvDraft || nvRows;
      var zone = nvZoneOf(nvZone);
      if (nvSel && (nvInputs || !nvRowByKey(nvSel.key) || !nvRowByKey(nvSel.key).m)) nvSel = null;
      var plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12"/><path d="M6 12h12"/></svg>';
      var months = '';
      for (var i = 1; i <= 12; i++) months += '<th scope="col" class="nv-mo">' + nvEsc(tarT('nvM' + i)) + '</th>';
      var moving = nvDrag && nvDrag.mode === 'move' && nvDropOff;
      var body = '';
      nvGroups.forEach(function (g) {
        var list = rows.filter(function (r) { return r.grupi === g; });
        var grp = '<th scope="rowgroup" rowspan="' + Math.max(list.length, 1) + '" class="nv-grp">' +
          '<span class="nv-grp-name">' + nvEsc(g) + '</span>' +
          '<button type="button" class="nv-add" data-nv-add="' + nvEsc(g) + '" title="' + nvEsc(tarT('nvAddCrop')) + '" aria-label="' + nvEsc(tarT('nvAddCrop') + ': ' + g) + '">' + plus + '</button></th>';
        body += '<tbody class="nv-body">';
        if (!list.length) body += '<tr>' + grp + '<td colspan="17" class="nv-none">—</td></tr>';
        list.forEach(function (r, ri) {
          var crop = nvInputs
            ? '<span class="nv-crop-edit"><input class="sk-in" type="text" data-nv-f="emri" value="' + nvEsc(r.emri) + '" placeholder="' + nvEsc(tarT('nvNewCrop')) + '" aria-label="' + nvEsc(tarT('nvColCrop')) + '">' +
              (r.key.charAt(0) === 'n' ? '<button type="button" class="xl-del" data-nv-del title="' + nvEsc(tarT('nvDelCrop')) + '" aria-label="' + nvEsc(tarT('nvDelCrop')) + '">&times;</button>' : '') + '</span>'
            : nvEsc(r.emri);
          var sel = nvSel && nvSel.key === r.key ? nvSel : null;
          var cells = '';
          if (!nvInputs && nvSum(r.m) == null) {
            cells = '<td colspan="12" class="nv-na">' + nvEsc(tarT('nvNoData')) + '</td>';
          } else {
            for (var mi = 0; mi < 12; mi++) {
              var v = r.m ? r.m[mi] : null;
              var name = tarT('nvM' + (mi + 1));
              if (nvInputs) {
                cells += '<td class="nv-cell nv-cell-in"><input class="sk-in sk-in-num nv-in" type="number" min="0" step="5" inputmode="numeric" data-nv-m="' + mi + '" value="' + nvEsc(v) + '" aria-label="' + nvEsc((r.emri || tarT('nvNewCrop')) + ' — ' + name + ' (mm)') + '"></td>';
                continue;
              }
              var cls = 'nv-cell' + (v ? ' nv-on' : '');
              if (sel && mi >= sel.a && mi <= sel.b) cls += ' nv-sel' + (mi === sel.a ? ' nv-sel-a' : '') + (mi === sel.b ? ' nv-sel-b' : '');
              if (sel && moving && mi >= sel.a + nvDropOff && mi <= sel.b + nvDropOff) cls += ' nv-drop';
              cells += '<td class="' + cls + '" data-nv-c="' + mi + '"' + nvShade(v) + (v ? ' title="' + nvEsc(name + ': ' + v + ' mm') + '"' : '') + '>' +
                (v ? v : '<span class="sr-only">0</span>') + '</td>';
            }
          }
          body += '<tr data-nv-key="' + nvEsc(r.key) + '"' + (nvBad[r.key] ? ' class="is-invalid"' : '') + '>' +
            (ri === 0 ? grp : '') +
            '<th scope="row" class="nv-crop">' + crop + '</th>' + nvTotals(r) + nvReqCells(r) + cells + '</tr>';
        });
        body += '</tbody>';
      });
      var bar = '';
      if (!nvInputs && nvSel) {
        var sr = nvRowByKey(nvSel.key);
        var range = tarT('nvM' + (nvSel.a + 1)) + (nvSel.b > nvSel.a ? ' – ' + tarT('nvM' + (nvSel.b + 1)) : '');
        bar = '<div class="nv-selbar" role="group" aria-label="' + nvEsc(tarT('nvSelLbl')) + '">' +
          '<span class="nv-selbar-what"><strong>' + nvEsc(sr.emri) + '</strong> · ' + nvEsc(range) + '</span>' +
          '<button type="button" class="nv-selbtn" data-nv-shift="-1"' + (nvSel.a === 0 ? ' disabled' : '') + '><span aria-hidden="true">◀</span> ' + nvEsc(tarT('nvShiftPrev')) + '</button>' +
          '<button type="button" class="nv-selbtn" data-nv-shift="1"' + (nvSel.b === 11 ? ' disabled' : '') + '>' + nvEsc(tarT('nvShiftNext')) + ' <span aria-hidden="true">▶</span></button>' +
          '<button type="button" class="nv-selbtn nv-selbtn-x" data-nv-unsel>' + nvEsc(tarT('nvSelClear')) + '</button></div>';
      }
      var hint = nvInputs ? tarT('nvEditHint') : nvSel ? tarT('nvMoveHint') : tarT('nvSelHint');
      var legend = '<span class="nv-legend-row"><span>' + nvEsc(tarT('nvMonthsHead')) + '</span>' +
        '<span class="nv-scale" aria-hidden="true">0<span class="nv-scale-bar"></span>' + nvEsc(tarT('nvScaleMax')) + '</span></span>';
      var note = currentLang === 'sq' ? nvData.shenim : tarT('nvNoteText');
      nvRoot.innerHTML =
        '<h2 class="nv-title">' + nvEsc(nvZoneName(zone)) + (nvLocTitle() ? ' <span class="nv-title-loc">— ' + nvEsc(nvLocTitle()) + '</span>' : '') + '</h2>' +
        '<div class="nv-tools"><p class="sk-edit-hint">' + nvEsc(hint) + '</p>' + bar + '</div>' +
        '<div class="nv-scroll"><table class="nv-xl' + (nvInputs ? ' is-editing' : ' is-draggable') + '">' +
        '<caption class="sr-only">' + nvEsc(tarT('nvSheet') + ' — ' + nvZoneName(zone)) + '</caption>' +
        '<thead><tr>' +
          '<th scope="col" rowspan="2" class="nv-grp-h"><span class="sr-only">' + nvEsc(tarT('nvColGroup')) + '</span></th>' +
          '<th scope="col" rowspan="2" class="nv-crop-h">' + nvEsc(tarT('nvColCrop')) + '</th>' +
          '<th scope="colgroup" colspan="2" class="nv-water-h">' + nvEsc(tarT('nvColYear')) + '</th>' +
          '<th scope="colgroup" colspan="2" class="nv-req-h">' + nvEsc(tarT('nvColReq')) + '</th>' +
          '<td colspan="12" class="nv-legend-h">' + legend + '</td>' +
        '</tr><tr>' +
          '<th scope="col" class="nv-num-h">' + nvEsc(tarT('nvColMm')) + '</th>' +
          '<th scope="col" class="nv-num-h">' + nvEsc(tarT('nvColM3')) + '</th>' +
          '<th scope="col" class="nv-num-h nv-req-h">' + nvEsc(tarT('nvColHa')) + '</th>' +
          '<th scope="col" class="nv-num-h nv-req-h">' + nvEsc(tarT('nvColReqM3')) + '</th>' + months +
        '</tr></thead>' + body + '<tfoot class="nv-foot">' + nvFoot(rows) + '</tfoot></table></div>' +
        (note ? '<p class="nv-note"><strong>' + nvEsc(tarT('nvNoteLbl')) + ':</strong> ' + nvEsc(note) + '</p>' : '');
      nvSyncBar();
      nvLocRender();
    };
    var nvRowOf = function (el) {
      var tr = el.closest('tr[data-nv-key]');
      if (!tr || !nvDraft) return null;
      var key = tr.getAttribute('data-nv-key');
      return nvDraft.filter(function (r) { return r.key === key; })[0] || null;
    };
    var nvStart = function () { if (!nvDraft) { nvDraft = nvClone(nvRows); nvBad = {}; } };
    var nvShiftAndFocus = function (off, focusSel) {
      if (!nvMove(off)) return;
      nvRender();
      var again = focusSel && nvRoot.querySelector(focusSel + ':not([disabled])');
      if (again) again.focus();
      else if (focusSel) { var other = nvRoot.querySelector('[data-nv-shift]:not([disabled])'); if (other) other.focus(); }
    };
    nvRoot.addEventListener('click', function (e) {
      var add = e.target.closest('[data-nv-add]');
      if (add) {
        nvStart();
        nvInputs = true;
        var key = 'n' + Date.now().toString(36);
        nvDraft.push({ key: key, grupi: add.getAttribute('data-nv-add'), emri: '', m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
        nvRender();
        var input = nvRoot.querySelector('tr[data-nv-key="' + key + '"] [data-nv-f="emri"]');
        if (input) input.focus();
        return;
      }
      var shift = e.target.closest('[data-nv-shift]');
      if (shift) {
        var off = +shift.getAttribute('data-nv-shift');
        nvShiftAndFocus(off, '[data-nv-shift="' + off + '"]');
        return;
      }
      if (e.target.closest('[data-nv-unsel]')) { nvSel = null; nvRender(); return; }
      var del = e.target.closest('[data-nv-del]');
      if (del) {
        var gone = nvRowOf(del);
        if (!gone) return;
        nvDraft = nvDraft.filter(function (x) { return x !== gone; });
        delete nvBad[gone.key];
        nvRender();
      }
    });
    var nvMonthAt = function (key, x) {
      var tr = nvRoot.querySelector('tr[data-nv-key="' + key + '"]');
      var cells = tr ? tr.querySelectorAll('td[data-nv-c]') : [];
      if (!cells.length) return null;
      for (var i = 0; i < cells.length; i++) {
        var rc = cells[i].getBoundingClientRect();
        if (x < rc.right) return i;
      }
      return cells.length - 1;
    };
    nvRoot.addEventListener('pointerdown', function (e) {
      if (nvInputs || e.button !== 0) return;
      var td = e.target.closest('td[data-nv-c]');
      if (!td) return;
      var key = td.parentNode.getAttribute('data-nv-key');
      var mi = +td.getAttribute('data-nv-c');
      var inSel = nvSel && nvSel.key === key && mi >= nvSel.a && mi <= nvSel.b;
      if (e.pointerType === 'touch' && !inSel) { nvDrag = { mode: 'tap', key: key, start: mi, cur: mi, moved: false }; return; }
      e.preventDefault();
      nvDrag = { mode: inSel ? 'move' : 'select', key: key, start: mi, cur: mi, moved: false };
      nvDropOff = 0;
      if (inSel) document.documentElement.classList.add('nv-grabbing');
    });
    document.addEventListener('pointermove', function (e) {
      if (!nvDrag || nvDrag.mode === 'tap') return;
      var mi = nvMonthAt(nvDrag.key, e.clientX);
      if (mi == null || mi === nvDrag.cur) return;
      nvDrag.cur = mi;
      nvDrag.moved = true;
      if (nvDrag.mode === 'select') nvSel = { key: nvDrag.key, a: Math.min(nvDrag.start, mi), b: Math.max(nvDrag.start, mi) };
      else nvDropOff = nvClampOff(nvSel, mi - nvDrag.start);
      nvRender();
    });
    var nvEndDrag = function (cancelled) {
      var d = nvDrag;
      if (!d) return;
      nvDrag = null;
      document.documentElement.classList.remove('nv-grabbing');
      if (d.mode === 'tap' && cancelled) return;
      if (d.mode === 'move') {
        var off = nvDropOff;
        nvDropOff = 0;
        if (!cancelled && off) nvMove(off);
      } else if (!d.moved && !cancelled) {
        var r = nvRowByKey(d.key);
        nvSel = r && r.m && r.m[d.start] ? nvSeason(r, d.start) : null;
      }
      nvRender();
    };
    document.addEventListener('pointerup', function () { nvEndDrag(false); });
    document.addEventListener('pointercancel', function () { nvEndDrag(true); });
    document.addEventListener('keydown', function (e) {
      if (!nvSel || nvInputs || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'Escape') { nvSel = null; nvRender(); return; }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var off = e.key === 'ArrowLeft' ? -1 : 1;
      var onBtn = t && t.closest && t.closest('[data-nv-shift]');
      nvShiftAndFocus(off, onBtn ? '[data-nv-shift="' + off + '"]' : null);
    });
    var nvReqRefresh = function (tr, r) {
      tr.querySelector('.nv-req').textContent = nvReqVal(r);
      nvRoot.querySelector('.nv-foot').innerHTML = nvFoot(nvDraft || nvRows);
    };
    nvRoot.addEventListener('input', function (e) {
      if (e.target.hasAttribute('data-nv-ha')) {
        var htr = e.target.closest('tr');
        var hr = nvRowByKey(htr.getAttribute('data-nv-key'));
        if (!hr) return;
        nvHaSet(hr.key, e.target.value === '' ? null : +e.target.value);
        nvReqRefresh(htr, hr);
        return;
      }
      var r = nvRowOf(e.target);
      if (!r) return;
      if (e.target.hasAttribute('data-nv-f')) {
        r.emri = e.target.value;
      } else if (e.target.hasAttribute('data-nv-m')) {
        if (!r.m) r.m = [null, null, null, null, null, null, null, null, null, null, null, null];
        r.m[+e.target.getAttribute('data-nv-m')] = e.target.value === '' ? null : +e.target.value;
        var tr = e.target.closest('tr');
        var tot = tr.querySelector('.nv-tot');
        var tmp = document.createElement('tbody');
        tmp.innerHTML = '<tr>' + nvTotals(r) + '</tr>';
        tr.replaceChild(tmp.firstChild.lastChild, tot.nextElementSibling);
        tr.replaceChild(tmp.firstChild.firstChild, tot);
        nvReqRefresh(tr, r);
      }
      nvSyncBar();
    });
    nvEditBtn.addEventListener('click', function () {
      nvInputs = !nvInputs;
      if (nvInputs) nvStart();
      nvRender();
    });
    nvCancelBtn.addEventListener('click', function () {
      nvDraft = null; nvInputs = false; nvSel = null; nvBad = {};
      nvRender();
    });
    nvSaveBtn.addEventListener('click', function () {
      if (!nvDraft) return;
      nvBad = {};
      nvDraft.forEach(function (r) {
        r.emri = String(r.emri || '').trim();
        var badNum = (r.m || []).some(function (v) { return v != null && !(v >= 0); });
        if (!r.emri || badNum) nvBad[r.key] = 1;
        if (r.m && nvSum(r.m) == null) r.m = null;
      });
      if (Object.keys(nvBad).length) { nvInputs = true; nvRender(); idmsToast('error', tarT('nvErrRows')); return; }
      var store = nvReadStore();
      store[nvZone] = nvDraft;
      try { localStorage.setItem(NV_STORE, JSON.stringify(store)); }
      catch (err) { idmsToast('error', tarT('skSaveFail')); return; }
      nvRows = nvDraft;
      nvDraft = null;
      nvInputs = false;
      nvRender();
      idmsToast('ok', tarT('nvSaved'));
    });
    var nvSetZone = function (id) {
      if (id === nvZone) return;
      nvZone = id;
      try { localStorage.setItem(NV_ZONE_STORE, nvZone); } catch (e) {}
      nvRows = nvLoad(nvZone);
      nvSel = null;
      nvZoneOptions();
    };
    nvZoneSel.addEventListener('change', function () {
      if (nvDraft || !nvZoneOf(nvZoneSel.value)) return;
      nvSetZone(nvZoneSel.value);
      var zs = nvLocZones();
      if (nvLoc.q && !(zs.length === 1 && zs[0] === nvZone)) { nvLoc = SCOPE ? { q: SCOPE.qarku, b: SCOPE.bashkia, n: '' } : { q: '', b: '', n: '' }; nvLocSave(); }
      nvRender();
    });
    if (nvLocQ) {
      [[nvLocQ, 'q'], [nvLocB, 'b'], [nvLocN, 'n']].forEach(function (pair) {
        pair[0].addEventListener('change', function () {
          if (nvDraft) return;
          nvLoc[pair[1]] = pair[0].value;
          if (pair[1] === 'q') { nvLoc.b = ''; nvLoc.n = ''; }
          if (pair[1] === 'b') nvLoc.n = '';
          var zone = nvZone;
          nvLocCheck();
          var picked = nvZone;
          nvZone = zone;
          nvSetZone(picked);
          nvLocSave();
          nvRender();
        });
      });
    }
    nvExportBtn.addEventListener('click', function () {
      var q = function (v) { v = v == null ? '' : String(v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      var head = [tarT('nvColGroup'), tarT('nvColCrop')];
      for (var i = 1; i <= 12; i++) head.push(tarT('nvM' + i) + ' (mm)');
      head.push(tarT('nvColYear') + ' (mm)', tarT('nvColYear') + ' (m³/ha)', tarT('nvColHa'), tarT('nvColReq') + ' (m³)');
      var lines = [q(nvZoneName(nvZoneOf(nvZone)) + (nvLocTitle() ? ' — ' + nvLocTitle() : '')), head.map(q).join(';')];
      var rows = nvDraft || nvRows;
      var sumHa = 0, sumReq = 0;
      nvGroups.forEach(function (g) {
        rows.filter(function (r) { return r.grupi === g; }).forEach(function (r) {
          var t = nvSum(r.m), ha = nvHaOf(r);
          var req = t == null ? null : Math.round(t * 10 * (ha || 0));
          sumHa += ha || 0;
          sumReq += req || 0;
          lines.push([g, r.emri].concat(r.m || ['', '', '', '', '', '', '', '', '', '', '', ''], [t, t == null ? null : t * 10, ha, req]).map(q).join(';'));
        });
      });
      lines.push(['', tarT('nvFootReq')].concat(['', '', '', '', '', '', '', '', '', '', '', '', '', ''], [Math.round(sumHa * 100) / 100, sumReq]).map(q).join(';'));
      var url = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
      var a = document.createElement('a');
      a.href = url;
      a.download = 'nevoja-e-ujit-' + nvZone + '.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    window.addEventListener('beforeunload', function (e) {
      if (nvChanged()) { e.preventDefault(); e.returnValue = ''; }
    });
    document.addEventListener('idms:langchange', function () { nvZoneOptions(); nvRender(); });
    nvZoneOptions();
    nvRender();
    loadPlaces().then(function (rows) {
      replaceList(nvPlaces, rows);
      if (nvDraft) { nvLocRender(); return; }
      var zone = nvZone;
      nvLocCheck();
      var picked = nvZone;
      nvZone = zone;
      nvSetZone(picked);
      nvLocSave();
      nvRender();
    }).catch(function () {  });
  }
  var kfRoot = document.getElementById('kfRoot');
  if (kfRoot && window.IDMIS_NEVOJA_UJIT) {
    var KF_STORE = 'idms-kerkesat-ujitje';
    var KF_STATUS = ['draft', 'dorezuar', 'verifikuar', 'pranuar', 'pjeserisht', 'refuzuar'];
    var KF_DECIDED = ['pranuar', 'pjeserisht', 'refuzuar'];
    var KF_SYS = { gravitet: [40, 70, 55], shi: [65, 85, 75], pike: [80, 95, 90], pompim: [45, 75, 60] };
    var KF_SRC = ['rezervuar', 'lume', 'kanal', 'pus', 'tjeter'];
    var KF_FIELDS = ['viti', 'njesia', 'fshati', 'skema', 'parcela', 'fermeri', 'kultura',
      'supParcela', 'supKult', 'supUjitje', 'data', 'sistemi', 'burimi', 'eff', 'nevoja', 'miratuar', 'shenim'];
    var kfData = window.IDMIS_NEVOJA_UJIT;
    var kfPlaces = kfData.vendndodhjet || [];
    var kfThisYear = new Date().getFullYear();
    var kfNavLinks = document.querySelectorAll('[data-kf-nav]');
    var kfEsc = function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };
    var kfLoc = function () { return currentLang === 'en' ? 'en-GB' : 'de-DE'; };
    var kfFmt = function (n) { return n == null ? '—' : Math.round(n).toLocaleString(kfLoc()); };
    var kfDec = function (n) { return n == null ? '—' : n.toLocaleString(kfLoc(), { maximumFractionDigits: 2 }); };
    var kfNum = function (v) { return v === '' || v == null ? null : +v; };
    var kfUniq = function (a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); };
    var kfSort = function (a) { return kfUniq(a).sort(function (x, y) { return x.localeCompare(y, 'sq'); }); };
    var kfClone = function (o) { return JSON.parse(JSON.stringify(o)); };
    var kfNorm = function (s) { return String(s || '').trim().toUpperCase(); };
    var kfWhen = function (iso) {
      var d = new Date(iso);
      if (isNaN(d)) return '';
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    };
    var kfRead = function () {
      var l;
      try { l = JSON.parse(localStorage.getItem(KF_STORE)); } catch (e) { return []; }
      if (!Array.isArray(l)) return [];
      return l.filter(function (r) { return r && r.id; }).map(function (r) {
        if (r.statusi === 'miratuar' || (r.historiku || []).some(function (h) { return h.statusi === 'miratuar'; })) {
          var b = kfCalc(r).brutoTot, m = kfNum(r.miratuar);
          var to = b != null && m != null && m < b ? 'pjeserisht' : 'pranuar';
          if (r.statusi === 'miratuar') r.statusi = to;
          (r.historiku || []).forEach(function (h) { if (h.statusi === 'miratuar') h.statusi = to; });
        }
        return r;
      });
    };
    var kfZoneOf = function (b, n) {
      var p = kfPlaces.filter(function (x) { return x[1] === b && x[2] === n; })[0];
      return p ? p[3] : null;
    };
    var kfZoneName = function (id) {
      var z = kfData.zonat.filter(function (x) { return x.id === id; })[0];
      return z ? (tarT('nvZ_' + z.id) || z.emri) : '';
    };
    var kfNeedCache = {};
    var kfCrops = function (rec) {
      if (!rec.bashkia || !rec.njesia) return null;
      var key = rec.bashkia + '|' + rec.njesia + '|' + (rec.data || '');
      if (kfNeedCache[key] !== undefined) return kfNeedCache[key];
      kfNeedCache[key] = null;
      var q = 'bashkia=' + encodeURIComponent(rec.bashkia) + '&njesia=' + encodeURIComponent(rec.njesia) + (rec.data ? '&data=' + encodeURIComponent(rec.data) : '');
      fetch('/api/nevoja?' + q, { credentials: 'same-origin', cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; })
        .then(function (d) {
          kfNeedCache[key] = d && Array.isArray(d.kulturat) ? d : { zona: null, kulturat: [] };
          kfRefresh();
        });
      return null;
    };
    var kfCropOf = function (rec) {
      var c = kfCrops(rec);
      return c && rec.kultura ? c.kulturat.filter(function (k) { return k.emri === rec.kultura; })[0] || null : null;
    };
    var kfNeed = function (rec) {
      var k = kfCropOf(rec);
      return k && k.neto ? k.neto.slice() : null;
    };
    var kfRefresh = function () {
      if (kfMode === 'form' && kfCur) { kfRenderForm(); if (kfLevel) kfPaintErrors(); }
      else if (kfMode === 'list' && !kfPopAt) { var body = document.getElementById('kfListBody'); if (body) body.innerHTML = kfListRows(); }
    };
    var kfSchemes = function (b, n) {
      var S = window.IDMIS_SKEMAT;
      if (!S || !b) return [];
      var alias = { 'Malsi e Madhe': 'Malësi e Madhe', 'Delvin': 'Delvinë' };
      var out = [];
      Object.keys(S).forEach(function (k) {
        var name = alias[k] || k;
        if (name !== b && name !== n && MUNI_MERGED[k] !== b) return;
        ['plota', 'pjeserisht'].forEach(function (t) {
          (S[k][t] || []).forEach(function (s) { out.push(s.kodi + ' — ' + s.emertimi); });
        });
      });
      return kfUniq(out);
    };
    var kfCalc = function (rec) {
      var zone = kfZoneOf(rec.bashkia, rec.njesia);
      var neto = rec.statusi !== 'draft' && rec.nevoja ? rec.nevoja : kfNeed(rec);
      var ha = kfNum(rec.supUjitje), eff = kfNum(rec.eff);
      var ok = !!neto && ha > 0 && eff > 0 && eff <= 100;
      var bruto = neto ? neto.map(function (v) { return ok ? Math.round((v || 0) * 10 * ha / (eff / 100)) : null; }) : null;
      var sum = function (a) { return a.reduce(function (t, v) { return t + (v || 0); }, 0); };
      return { zone: zone, neto: neto, bruto: bruto, netoTot: neto ? sum(neto) : null, brutoTot: ok ? sum(bruto) : null };
    };
    var kfDateRange = function (viti) { return [(viti - 1) + '-10-01', viti + '-09-30']; };
    var kfDateText = function (iso) { var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; };
    var kfValidate = function (rec, level) {
      var e = {};
      var put = function (f, msg) { if (!e[f]) e[f] = msg; };
      var has = function (f) { return rec[f] != null && String(rec[f]).trim() !== ''; };
      var yr = kfNum(rec.viti);
      if (has('viti') && !(Math.floor(yr) === yr && yr >= 2000 && yr <= kfThisYear + 1)) {
        put('viti', tarT('kfE_year').replace('{a}', 2000).replace('{b}', kfThisYear + 1));
      }
      if (has('njesia') && !kfZoneOf(rec.bashkia, rec.njesia)) put('njesia', tarT('kfE_njesia'));
      if (has('kultura') && kfCrops(rec) && !kfCropOf(rec)) put('kultura', tarT('kfE_kultura'));
      ['supParcela', 'supKult', 'supUjitje'].forEach(function (f) { if (has(f) && !(kfNum(rec[f]) > 0)) put(f, tarT('kfE_pos')); });
      var sp = kfNum(rec.supParcela), sk = kfNum(rec.supKult), su = kfNum(rec.supUjitje);
      if (sp > 0 && sk > sp) put('supKult', tarT('kfE_gtParcela').replace('{n}', kfDec(sp)));
      if (sk > 0 && su > sk) put('supUjitje', tarT('kfE_gtKult').replace('{n}', kfDec(sk)));
      if (has('data') && yr >= 2000) {
        var dr = kfDateRange(yr);
        if (rec.data < dr[0] || rec.data > dr[1]) put('data', tarT('kfE_date').replace('{a}', kfDateText(dr[0])).replace('{b}', kfDateText(dr[1])));
      }
      if (has('eff')) {
        var ev = kfNum(rec.eff), sys = KF_SYS[rec.sistemi];
        if (sys && !(ev >= sys[0] && ev <= sys[1])) put('eff', tarT('kfE_eff').replace('{a}', sys[0]).replace('{b}', sys[1]));
        else if (!(ev > 0 && ev <= 100)) put('eff', tarT('kfE_eff').replace('{a}', 1).replace('{b}', 100));
      }
      if (level === 'draft') return e;
      ['viti', 'njesia', 'parcela', 'fermeri', 'kultura', 'supParcela', 'supKult', 'supUjitje', 'sistemi', 'burimi', 'eff']
        .forEach(function (f) { if (!has(f)) put(f, tarT('kfE_req')); });
      if (!has('data') && has('kultura') && !(kfCropOf(rec) || {}).shumevjecare) put('data', tarT('kfE_req'));
      var dup = has('parcela') && kfList.filter(function (x) {
        return x.id !== rec.id && x.statusi !== 'refuzuar' && kfNorm(x.parcela) === kfNorm(rec.parcela) &&
          String(x.viti) === String(rec.viti) && x.kultura === rec.kultura;
      })[0];
      if (dup) put('parcela', tarT('kfE_parcelaDup').replace('{id}', dup.id));
      if (has('njesia') && has('kultura') && !kfCalc(rec).neto) put('kultura', tarT('kfE_noNeed'));
      if (level === 'submit') return e;
      if (!rec.nevoja || rec.nevoja.some(function (v) { return v == null || !(v >= 0); })) put('nevoja', tarT('kfE_neg'));
      if (level === 'verify') return e;
      var c = kfCalc(rec), m = kfNum(rec.miratuar);
      if (m == null || !(m > 0) || !(m < c.brutoTot)) put('miratuar', tarT('kfE_miratuar').replace('{n}', kfFmt(c.brutoTot)));
      return e;
    };
    var kfList = kfRead();
    var kfSeedDemo = !kfList.length;
    var kfMode = 'list';
    var kfCur = null;
    var kfErrors = {};
    var kfLevel = null;
    var kfFilter = '';
    var kfQuery = '';
    var kfBlank = function () {
      var rec = { id: null, statusi: 'draft', viti: kfThisYear, bashkia: '', njesia: '', fshati: '', skema: '', parcela: '',
        fermeri: '', kultura: '', supParcela: '', supKult: '', supUjitje: '', data: '', sistemi: '', burimi: '', eff: '',
        nevoja: null, miratuar: null, shenim: '', historiku: [] };
      try {
        var l = JSON.parse(localStorage.getItem('idms-nevoja-ujit-vend'));
        if (l && l.b && kfPlaces.some(function (p) { return p[1] === l.b; })) { rec.bashkia = l.b; if (kfZoneOf(l.b, l.n)) rec.njesia = l.n; }
      } catch (e) {}
      if (SCOPE && rec.bashkia !== SCOPE.bashkia) { rec.bashkia = SCOPE.bashkia; rec.njesia = ''; }
      return rec;
    };
    var kfMine = function () { return SCOPE ? kfList.filter(function (r) { return r.bashkia === SCOPE.bashkia; }) : kfList; };
    var kfSaved = function (id) { return kfMine().filter(function (r) { return r.id === id; })[0] || null; };
    var kfDirty = function () {
      if (!kfCur || kfCur.statusi !== 'draft') return false;
      var a = kfClone(kfCur), b = kfCur.id ? kfClone(kfSaved(kfCur.id) || {}) : kfBlank();
      a.shenim = b.shenim = '';
      return JSON.stringify(a) !== JSON.stringify(b);
    };
    var kfNextId = function () {
      var pre = 'K-' + kfThisYear + '-', max = 0;
      kfList.forEach(function (r) { if (r.id.indexOf(pre) === 0) max = Math.max(max, +r.id.slice(pre.length) || 0); });
      return pre + String(max + 1).padStart(4, '0');
    };
    var kfStatusChip = function (s) { return '<span class="kf-st kf-st-' + s + '">' + kfEsc(tarT('kfSt_' + s)) + '</span>'; };
    if (kfSeedDemo) (function () {
      var y = kfThisYear, now = Date.now();
      var ago = function (d, h) { return new Date(now - (d * 24 + (h || 0)) * 3600e3).toISOString(); };
      var demo = [
        ['Fier', 'Levan', 'Levan', '3317-045-12', 'Arben Hoxha', 'Misër', 4.5, 4.2, 4, y + '-04-15', 'gravitet', 'kanal', 55, 'pranuar', 9, ''],
        ['Lushnjë', 'Allkaj', 'Allkaj', '3402-118-07', 'Bujqësia Myzeqe sh.p.k.', 'Jonxhë', 12, 11.5, 11, y + '-03-10', 'shi', 'rezervuar', 75, 'pjeserisht', 14, 'Kapaciteti i kanalit në korrik është i kufizuar; pranohet 70% e volumit.'],
        ['Berat', 'Otllak', 'Otllak', '2105-033-21', 'Mimoza Kola', 'Domate', 1.2, 1.2, 1, y + '-04-20', 'pike', 'pus', 90, 'verifikuar', 3, 'Sipërfaqja u kontrollua në terren.'],
        ['Korçë', 'Drenovë', 'Drenovë', '1708-210-04', 'Ilir Shehu', 'Patate', 3, 2.8, 2.5, y + '-03-25', 'shi', 'lume', 70, 'verifikuar', 5, ''],
        ['Shkodër', 'Dajç', 'Dajç', '4011-076-15', 'Gëzim Marku', 'Misër', 6, 5.5, 5, y + '-04-25', 'gravitet', 'kanal', 50, 'dorezuar', 1, ''],
        ['Sarandë', 'Ksamil', 'Ksamil', '0902-014-30', 'Agrumet e Jugut sh.p.k.', 'Agrume', 8, 7.5, 7.5, '', 'pike', 'pus', 88, 'dorezuar', 2, ''],
        ['Fier', 'Cakran', 'Cakran', '3320-301-02', 'Valbona Lika', 'Speca', 0.8, 0.8, 0.6, y + '-05-02', 'pike', 'rezervuar', 85, 'draft', 0, ''],
        ['Lushnjë', 'Ballagat', 'Ballagat', '3405-062-11', 'Fatmir Dervishi', 'Fasule', 2, 1.8, 1.8, '', '', '', '', 'draft', 6, ''],
        ['Berat', 'Roshnik', 'Roshnik', '2109-145-08', 'Sokol Gjoni', 'Ullinj', 5, 5, 4, '', 'pompim', 'lume', 60, 'refuzuar', 11, 'Parcela ndodhet jashtë zonës së shërbimit të skemës.']
      ];
      var flow = ['draft', 'dorezuar', 'verifikuar'];
      var list = [], n = 0;
      demo.forEach(function (d) {
        if (!kfZoneOf(d[0], d[1])) return;
        var rec = { id: 'K-' + y + '-' + String(++n).padStart(4, '0'), statusi: 'draft', viti: y, bashkia: d[0], njesia: d[1],
          fshati: d[2], skema: (kfSchemes(d[0], d[1])[0] || ''), parcela: d[3], fermeri: d[4], kultura: d[5],
          supParcela: d[6], supKult: d[7], supUjitje: d[8], data: d[9], sistemi: d[10], burimi: d[11], eff: d[12],
          nevoja: null, miratuar: null, shenim: '', historiku: [] };
        var decided = KF_DECIDED.indexOf(d[13]) >= 0;
        var stop = d[13] === 'refuzuar' ? 1 : decided ? 2 : flow.indexOf(d[13]), days = d[14] + stop * 2;
        for (var i = 0; i <= stop; i++) {
          rec.historiku.push({ statusi: flow[i], data: ago(days - i * 2, 3 - i), shenim: i === stop && !decided ? d[15] : '' });
        }
        if (d[13] !== 'draft') {
          var c = kfCalc(rec);
          if (c.neto) { rec.nevoja = c.neto.slice(); rec.zona = c.zone; }
        }
        if (d[13] === 'verifikuar' || d[13] === 'pranuar' || d[13] === 'pjeserisht') {
          var b = kfCalc(rec).brutoTot;
          rec.miratuar = b == null ? null : (d[13] === 'pjeserisht' ? Math.round(b * 0.7 / 100) * 100 : b);
        }
        if (decided) rec.historiku.push({ statusi: d[13], data: ago(d[14]), shenim: d[15] });
        rec.statusi = d[13];
        rec.krijuar = rec.historiku[0].data;
        rec.perditesuar = rec.historiku[rec.historiku.length - 1].data;
        list.push(rec);
      });
      try { localStorage.setItem(KF_STORE, JSON.stringify(list)); kfList = list; } catch (e) {}
    })();
    var kfListRows = function () {
      var q = kfNorm(kfQuery);
      var rows = kfMine().filter(function (r) {
        if (kfFilter && r.statusi !== kfFilter) return false;
        return !q || [r.id, r.parcela, r.fermeri, r.kultura, r.bashkia, r.njesia, r.skema].some(function (v) { return kfNorm(v).indexOf(q) >= 0; });
      }).sort(function (a, b) { return String(b.perditesuar).localeCompare(String(a.perditesuar)); });
      if (!kfMine().length) {
        return '<div class="kf-empty"><p>' + kfEsc(tarT('kfEmpty')) + '</p><a class="btn btn-primary btn-sm" href="#e-re">' + kfEsc(tarT('kfNew')) + '</a></div>';
      }
      if (!rows.length) return '<p class="kf-empty">' + kfEsc(tarT('kfNoMatch')) + '</p>';
      var tot = { ha: 0, bruto: 0, acc: 0 };
      var body = rows.map(function (r) {
        var c = kfCalc(r);
        var ha = kfNum(r.supUjitje);
        var decided = r.statusi === 'pranuar' || r.statusi === 'pjeserisht';
        tot.ha += ha || 0;
        tot.bruto += c.brutoTot || 0;
        if (decided) tot.acc += kfNum(r.miratuar) || 0;
        return '<tr><th scope="row" class="kf-nr"><a class="sk-link" href="#' + kfEsc(encodeURIComponent(r.id)) + '">' + kfEsc(r.id) + '</a></th>' +
          '<td class="c">' + kfEsc(r.viti) + '</td>' +
          '<td>' + kfEsc([r.bashkia, r.njesia].filter(Boolean).join(' / ')) + '</td>' +
          '<td class="c">' + kfEsc(r.parcela) + '</td><td>' + kfEsc(r.fermeri) + '</td><td>' + kfEsc(r.kultura) + '</td>' +
          '<td class="c">' + (ha ? kfDec(ha) : '—') + '</td>' +
          '<td class="c">' + kfFmt(c.brutoTot) + '</td>' +
          '<td class="kf-skema"' + (r.skema ? ' title="' + kfEsc(r.skema) + '"' : '') + '>' + (r.skema ? '<span>' + kfEsc(r.skema) + '</span>' : '—') + '</td>' +
          '<td class="c">' + (decided ? kfFmt(kfNum(r.miratuar)) : r.statusi === 'refuzuar' ? '0' : '—') + '</td>' +
          '<td class="c"><button type="button" class="kf-st kf-st-' + r.statusi + ' kf-st-btn" data-kf-st="' + kfEsc(r.id) + '" aria-haspopup="true" aria-expanded="false" title="' + kfEsc(tarT('kfChangeSt')) + '">' +
            kfEsc(tarT('kfSt_' + r.statusi)) + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></td></tr>';
      }).join('');
      return '<section class="sk-sheet">' +
        '<div class="sk-xl-head"><h3 class="sk-xl-title">' + kfEsc(tarT('kfList')) + '</h3></div>' +
        '<div class="sk-scroll"><table class="sk-xl kf-xl"><thead><tr>' +
        ['kfColNr', 'kfColViti', 'kfColVend', 'kfColParcela', 'kfColFermeri', 'kfColKultura', 'kfColHa', 'kfColBruto', 'kfF_skema', 'kfColMiratuar', 'kfColStatus']
          .map(function (k) { return '<th scope="col">' + kfEsc(tarT(k)) + '</th>'; }).join('') +
        '</tr></thead><tbody>' + body + '</tbody>' +
        '<tfoot><tr><td colspan="6">' + kfEsc(tarT('kfColTot')) + ' (' + rows.length + ')</td>' +
          '<td>' + kfDec(tot.ha) + '</td><td>' + kfFmt(tot.bruto) + '</td><td></td><td>' + kfFmt(tot.acc) + '</td><td></td></tr></tfoot>' +
        '</table></div></section>';
    };
    var kfStatusSel = document.getElementById('kfStatus');
    var kfSearchIn = document.getElementById('kfSearch');
    var kfToolFilters = document.getElementById('kfToolFilters');
    var kfRenderTools = function () {
      if (!kfToolFilters) return;
      kfToolFilters.hidden = kfMode !== 'list';
      var counts = {};
      kfMine().forEach(function (r) { counts[r.statusi] = (counts[r.statusi] || 0) + 1; });
      var opt = function (s, label, n) {
        return '<option value="' + s + '"' + (kfFilter === s ? ' selected' : '') + '>' + kfEsc(label + ' (' + n + ')') + '</option>';
      };
      kfStatusSel.innerHTML = opt('', tarT('kfStAll'), kfMine().length) +
        KF_STATUS.map(function (s) { return opt(s, tarT('kfSt_' + s), counts[s] || 0); }).join('');
      kfSearchIn.placeholder = tarT('kfSearchPh');
      kfSearchIn.setAttribute('aria-label', tarT('kfSearchPh'));
      if (kfSearchIn.value !== kfQuery) kfSearchIn.value = kfQuery;
    };
    if (kfStatusSel) kfStatusSel.addEventListener('change', function () {
      kfFilter = kfStatusSel.value;
      kfRenderList();
    });
    if (kfSearchIn) kfSearchIn.addEventListener('input', function () {
      kfClosePop();
      kfQuery = kfSearchIn.value;
      var body = document.getElementById('kfListBody');
      if (body) body.innerHTML = kfListRows();
    });
    var kfRenderList = function () {
      kfClosePop();
      kfRenderTools();
      kfRoot.innerHTML =
        '<div id="kfListBody">' + kfListRows() + '</div>';
    };
    var kfField = function (f, control, o) {
      o = o || {};
      var err = kfErrors[f];
      return '<div class="field' + (o.wide ? ' kf-wide' : '') + '" data-kf-field="' + f + '">' +
        '<label for="kf_' + f + '"><span>' + kfEsc(tarT('kfF_' + f)) + (o.req ? ' <span class="req" aria-hidden="true">*</span>' : '') + '</span></label>' +
        control + (o.hint ? '<p class="field-hint" id="kf_' + f + '-hint">' + kfEsc(o.hint) + '</p>' : '') +
        '<p class="field-error" id="kf_' + f + '-err"' + (err ? '' : ' hidden') + '>' + kfEsc(err || '') + '</p></div>';
    };
    var kfAttrs = function (f, o) {
      o = o || {};
      return ' id="kf_' + f + '" name="' + f + '" aria-describedby="kf_' + f + '-err' + (o.hint ? ' kf_' + f + '-hint' : '') + '"' +
        (kfErrors[f] ? ' aria-invalid="true"' : '');
    };
    var kfInput = function (f, type, o) {
      o = o || {};
      return kfField(f, '<input type="' + type + '"' + kfAttrs(f, o) + ' value="' + kfEsc(kfCur[f]) + '"' + (o.extra || '') + ' autocomplete="off">', o);
    };
    var kfSelect = function (f, options, placeholder, o) {
      return kfField(f, '<select' + kfAttrs(f, o) + (o && o.disabled ? ' disabled' : '') + '><option value="">' + kfEsc(placeholder) + '</option>' + options + '</select>', o);
    };
    var kfRadios = function (f, list, prefix) {
      var err = kfErrors[f];
      return '<fieldset class="dg-uses kf-wide" id="kf_' + f + '" aria-describedby="kf_' + f + '-err"' + (err ? ' aria-invalid="true"' : '') + '>' +
        '<legend class="dg-uses-lbl">' + kfEsc(tarT('kfF_' + f)) + ' <span class="req" aria-hidden="true">*</span>' +
        '<span class="field-hint">' + kfEsc(tarT('kfOneOf')) + '</span></legend><div class="dg-use-grid">' +
        list.map(function (v) {
          return '<label class="dg-use"><input type="radio" name="' + f + '" value="' + v + '"' + (kfCur[f] === v ? ' checked' : '') + '>' + kfEsc(tarT(prefix + v)) + '</label>';
        }).join('') + '</div><p class="field-error" id="kf_' + f + '-err"' + (err ? '' : ' hidden') + '>' + kfEsc(err || '') + '</p></fieldset>';
    };
    var kfSection = function (n, key, body, o) {
      o = o || {};
      return '<fieldset class="tar-fieldset kf-sec"' + (o.disabled ? ' disabled' : '') + '><legend><span class="tariff-num">' + n + '</span>' + kfEsc(tarT(key)) + '</legend>' +
        (o.intro ? '<p class="kf-sec-intro">' + kfEsc(o.intro) + '</p>' : '') + '<div class="tar-grid">' + body + '</div></fieldset>';
    };
    var kfCalcHtml = function () {
      var c = kfCalc(kfCur);
      var editNeed = kfCur.statusi === 'dorezuar';
      var head = '', neto = '', bruto = '';
      for (var i = 0; i < 12; i++) {
        head += '<th scope="col">' + kfEsc(tarT('nvM' + (i + 1))) + '</th>';
        var v = c.neto ? c.neto[i] : null;
        neto += '<td>' + (editNeed
          ? '<input class="sk-in sk-in-num" type="number" min="0" step="1" name="nevoja" data-kf-m="' + i + '" value="' + kfEsc(v) + '" aria-label="' + kfEsc(tarT('kfRowNeto') + ' — ' + tarT('nvM' + (i + 1))) + '">'
          : (v ? kfFmt(v) : (c.neto ? '0' : '—'))) + '</td>';
        bruto += '<td>' + (c.bruto && c.bruto[i] ? kfFmt(c.bruto[i]) : (c.bruto ? '0' : '—')) + '</td>';
      }
      var zone = c.zone
        ? tarT('kfZone') + ': <span class="nv-chip">Z' + c.zone.replace('zona', '') + '</span> <strong>' + kfEsc(kfZoneName(c.zone).replace(/^\d+\.\s*/, '')) + '</strong>'
        : kfEsc(tarT('kfZoneNone'));
      return '<p class="kf-zone">' + zone + '</p>' +
        (c.zone && kfCur.kultura && !c.neto ? '<p class="field-error">' + kfEsc(tarT('kfE_noNeed')) + '</p>' : '') +
        '<div class="nv-scroll"><table class="kf-calc"><thead><tr><th scope="col"></th>' + head + '<th scope="col">' + kfEsc(tarT('kfColTot')) + '</th></tr></thead><tbody>' +
        '<tr' + (kfErrors.nevoja ? ' class="is-invalid"' : '') + '><th scope="row">' + kfEsc(tarT('kfRowNeto')) + '</th>' + neto + '<td class="kf-tot">' + (c.netoTot == null ? '—' : kfFmt(c.netoTot)) + '</td></tr>' +
        '<tr><th scope="row">' + kfEsc(tarT('kfRowBruto')) + '</th>' + bruto + '<td class="kf-tot">' + kfFmt(c.brutoTot) + '</td></tr>' +
        '</tbody></table></div>' +
        '<p class="field-error" id="kf_nevoja-err"' + (kfErrors.nevoja ? '' : ' hidden') + '>' + kfEsc(kfErrors.nevoja || '') + '</p>' +
        '<p class="kf-note">' + kfEsc(tarT('kfCalcNote')) + (editNeed ? ' ' + kfEsc(tarT('kfCalcEditNote')) : '') + '</p>';
    };
    var kfSteps = function () {
      var s = kfCur.statusi, order = ['draft', 'dorezuar', 'verifikuar', 'vendim'];
      var decided = KF_DECIDED.indexOf(s) >= 0;
      var before = (kfCur.historiku || []).filter(function (h) { return KF_DECIDED.indexOf(h.statusi) < 0; }).slice(-1)[0];
      var reached = decided ? order.indexOf(before ? before.statusi : 'verifikuar') : order.indexOf(s);
      var steps = order.map(function (k, i) {
        var last = i === order.length - 1;
        var key = last && decided ? s : k;
        var state = decided
          ? (last ? { pranuar: 'is-done', pjeserisht: 'is-partial', refuzuar: 'is-refused' }[s] : i <= reached ? 'is-done' : '')
          : i < reached ? 'is-done' : i === reached ? 'is-current' : '';
        var mark = { 'is-done': '✓', 'is-partial': '◐', 'is-refused': '✕' }[state] || i + 1;
        return '<li class="kf-step ' + state + '"' + (state === 'is-current' || (last && decided) ? ' aria-current="step"' : '') + '>' +
          '<span class="kf-step-n" aria-hidden="true">' + mark + '</span>' +
          '<span class="kf-step-t">' + kfEsc(tarT('kfSt_' + key)) + '</span><span class="kf-step-d">' + kfEsc(tarT('kfStD_' + key)) + '</span></li>';
      }).join('');
      return '<ol class="kf-steps" aria-label="' + kfEsc(tarT('kfStepsLbl')) + '">' + steps + '</ol>';
    };
    var kfDecision = function () {
      var s = kfCur.statusi, c = kfCalc(kfCur), body = '', actions = '';
      var note = function (req) {
        return kfField('shenim', '<textarea' + kfAttrs('shenim') + ' rows="3">' + kfEsc(kfCur.shenim) + '</textarea>', { wide: true, hint: req ? tarT('kfHintNote') : '' });
      };
      var decided = KF_DECIDED.indexOf(s) >= 0;
      if (decided) {
        var last = (kfCur.historiku || []).slice(-1)[0] || {};
        var m = kfNum(kfCur.miratuar);
        var text = s === 'pranuar' ? tarT('kfResOk')
          : s === 'pjeserisht' ? tarT('kfResPart').replace('{a}', kfFmt(m)).replace('{p}', c.brutoTot ? Math.round(m / c.brutoTot * 100) : '—')
          : tarT('kfResNo');
        body = '<p class="kf-result kf-result-' + s + ' kf-wide">' + kfEsc(text.replace('{b}', kfFmt(c.brutoTot))) +
          (last.shenim ? ' <strong>' + kfEsc(last.shenim) + '</strong>' : '') + '</p>';
      }
      if (s === 'dorezuar' || s === 'verifikuar' || decided) {
        if (kfCur.miratuar == null && c.brutoTot != null) kfCur.miratuar = c.brutoTot;
        body += kfInput('miratuar', 'number', { extra: ' min="0" step="1" inputmode="numeric"', hint: tarT('kfHintMiratuar').replace('{n}', kfFmt(c.brutoTot)) }) + note(true);
        var btn = function (act, st, cls, key) {
          var on = s === st;
          return '<button type="button" class="btn btn-sm ' + cls + (on ? ' is-current' : '') + '" data-kf-act="' + act + '" aria-pressed="' + on + '"' + (on ? ' disabled' : '') + '>' +
            (on ? '✓ ' : '') + kfEsc(tarT(key)) + '</button>';
        };
        actions = '<span class="kf-decide">' +
          btn('accept', 'pranuar', 'btn-primary', 'kfAccept') +
          btn('partial', 'pjeserisht', 'kf-btn-partial', 'kfPartial') +
          btn('reject', 'refuzuar', 'kf-btn-danger', 'kfReject') + '</span>';
        if (s === 'dorezuar') {
          actions += '<button type="button" class="btn btn-secondary btn-sm" data-kf-act="verify">' + kfEsc(tarT('kfVerify')) + '</button>' +
            '<button type="button" class="btn btn-secondary btn-sm" data-kf-act="ret">' + kfEsc(tarT('kfReturn')) + '</button>';
        }
      }
      return { body: body, actions: actions };
    };
    var kfRenderForm = function () {
      var focusId = document.activeElement && kfRoot.contains(document.activeElement) ? document.activeElement.id : null;
      var draft = kfCur.statusi === 'draft';
      var yr = kfNum(kfCur.viti);
      var dr = yr >= 2000 ? kfDateRange(yr) : null;
      var njesi = kfPlaces.slice().sort(function (a, b) { return a[2].localeCompare(b[2], 'sq') || a[1].localeCompare(b[1], 'sq'); })
        .map(function (p) {
          var v = p[1] + '|' + p[2];
          return '<option value="' + kfEsc(v) + '"' + (kfCur.bashkia === p[1] && kfCur.njesia === p[2] ? ' selected' : '') + '>' + kfEsc(p[2] + ' (' + p[1] + ')') + '</option>';
        }).join('');
      var cropList = kfCrops(kfCur);
      var groups = [];
      (cropList ? cropList.kulturat : []).forEach(function (k) {
        var g = groups.filter(function (x) { return x.grupi === k.grupi; })[0];
        if (!g) groups.push(g = { grupi: k.grupi, kulturat: [] });
        g.kulturat.push(k);
      });
      var cropOpt = function (name, label) {
        return '<option value="' + kfEsc(name) + '"' + (kfCur.kultura === name ? ' selected' : '') + '>' + kfEsc(label) + '</option>';
      };
      var crops = (kfCur.kultura && cropList && !kfCropOf(kfCur) ? cropOpt(kfCur.kultura, kfCur.kultura) : '') +
        groups.map(function (g) {
          return '<optgroup label="' + kfEsc(g.grupi) + '">' + g.kulturat.map(function (k) {
            return cropOpt(k.emri, k.emri + (k.mungon === 'profili' || k.mungon === 'parametrat' ? ' (' + tarT('kfNoParams') + ')' : ''));
          }).join('') + '</optgroup>';
        }).join('');
      var cropPick = !kfCur.njesia ? tarT('kfPickNjesiFirst') : !cropList ? tarT('kfLoading') : tarT('kfPickKultura');
      var perennial = !!(kfCropOf(kfCur) || {}).shumevjecare;
      var sys = KF_SYS[kfCur.sistemi];
      var schemes = kfSchemes(kfCur.bashkia, kfCur.njesia);
      var secA = kfSection(1, 'kfSecA',
        kfInput('viti', 'number', { req: true, extra: ' min="2000" max="' + (kfThisYear + 1) + '" step="1" inputmode="numeric"' }) +
        kfSelect('njesia', njesi, tarT('kfPickNjesi'), { req: true, hint: tarT('kfHintNjesi') }) +
        kfInput('fshati', 'text') +
        kfInput('skema', 'text', { extra: ' list="kfSkemaList" placeholder="' + kfEsc(tarT('kfPhSkema')) + '"', hint: schemes.length ? tarT('kfHintSkema').replace('{n}', schemes.length) : '' }) +
        '<datalist id="kfSkemaList">' + schemes.map(function (s) { return '<option value="' + kfEsc(s) + '"></option>'; }).join('') + '</datalist>' +
        kfInput('parcela', 'text', { req: true, extra: ' placeholder="' + kfEsc(tarT('kfPhParcela')) + '"', hint: tarT('kfHintParcela') }) +
        kfInput('fermeri', 'text', { req: true, extra: ' placeholder="' + kfEsc(tarT('kfPhFermeri')) + '"' }),
        { disabled: !draft });
      var secB = kfSection(2, 'kfSecB',
        kfSelect('kultura', crops, cropPick, { req: true, hint: tarT('kfHintKultura'), disabled: !kfCur.njesia }) +
        kfInput('data', 'date', {
          req: !perennial, extra: dr ? ' min="' + dr[0] + '" max="' + dr[1] + '"' : '',
          hint: (dr ? tarT('kfHintData').replace('{a}', kfDateText(dr[0])).replace('{b}', kfDateText(dr[1])) : '') + (perennial ? ' ' + tarT('kfHintDataOpt') : '')
        }) +
        kfInput('supParcela', 'number', { req: true, extra: ' min="0" step="any" inputmode="decimal"', hint: tarT('kfHintSupParcela') }) +
        kfInput('supKult', 'number', { req: true, extra: ' min="0" step="any" inputmode="decimal"', hint: tarT('kfHintSupKult') }) +
        kfInput('supUjitje', 'number', { req: true, extra: ' min="0" step="any" inputmode="decimal"', hint: tarT('kfHintSupUjitje') }) +
        kfInput('eff', 'number', { req: true, extra: ' min="1" max="100" step="1" inputmode="numeric"', hint: sys ? tarT('kfHintEff').replace('{s}', tarT('kfSys_' + kfCur.sistemi)).replace('{a}', sys[0]).replace('{b}', sys[1]) : tarT('kfHintEffPick') }) +
        kfRadios('sistemi', Object.keys(KF_SYS), 'kfSys_') +
        kfRadios('burimi', KF_SRC, 'kfSrc_'),
        { disabled: !draft });
      var secC = '<fieldset class="tar-fieldset kf-sec"><legend><span class="tariff-num">3</span>' + kfEsc(tarT('kfSecC')) + '</legend><div class="kf-calc-wrap" id="kfCalc">' + kfCalcHtml() + '</div></fieldset>';
      var dec = draft ? null : kfDecision();
      var secD = dec ? '<fieldset class="tar-fieldset kf-sec"><legend><span class="tariff-num">4</span>' + kfEsc(tarT('kfSecD')) + '</legend>' +
        '<div class="tar-grid">' + dec.body + '</div></fieldset>' : '';
      var hist = (kfCur.historiku || []).length
        ? '<section class="kf-hist"><h3 class="kf-hist-title">' + kfEsc(tarT('kfHistory')) + '</h3><ol>' +
          kfCur.historiku.slice().reverse().map(function (h) {
            return '<li>' + kfStatusChip(h.statusi) + ' <span class="kf-when">' + kfEsc(kfWhen(h.data)) + '</span>' + (h.shenim ? ' — ' + kfEsc(h.shenim) : '') + '</li>';
          }).join('') + '</ol></section>'
        : '';
      var actions = draft
        ? '<button type="button" class="btn btn-secondary btn-sm" data-kf-act="save">' + kfEsc(tarT('kfSaveDraft')) + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-kf-act="submit">' + kfEsc(tarT('kfSubmit')) + '</button>'
        : dec.actions;
      var errList = Object.keys(kfErrors).sort(function (a, b) { return KF_FIELDS.indexOf(a) - KF_FIELDS.indexOf(b); });
      var summary = errList.length
        ? '<div class="kf-errors" id="kfErrors" role="alert" tabindex="-1"><p>' + kfEsc(tarT('kfMsgErrors').replace('{n}', errList.length)) + '</p><ul>' +
          errList.map(function (f) { return '<li><a href="#kf_' + f + '" data-kf-goto="' + f + '">' + kfEsc(tarT('kfF_' + f)) + '</a>: ' + kfEsc(kfErrors[f]) + '</li>'; }).join('') + '</ul></div>'
        : '';
      kfRoot.innerHTML =
        '<div class="kf-head"><h2 class="kf-title">' + kfEsc(kfCur.id ? tarT('kfTitleOf').replace('{id}', kfCur.id) : tarT('kfNewTitle')) + '</h2>' + kfStatusChip(kfCur.statusi) + '</div>' +
        kfSteps() +
        summary +
        '<form class="form tar-form kf-form" id="kfForm" novalidate>' +
          (draft ? '<p class="tar-form-intro">' + kfEsc(tarT('kfReqNote')) + '</p>' : '<p class="tar-form-intro">' + kfEsc(tarT('kfLockedNote')) + '</p>') +
          secA + secB + secC + secD +
          '<div class="tar-form-actions">' + actions + '<a class="tar-form-link" href="#lista">' + kfEsc(tarT('kfBack')) + '</a></div>' +
        '</form>' + hist;
      if (focusId) {
        var el = document.getElementById(focusId);
        if (el) { el.focus(); if (el.setSelectionRange && el.type === 'text') { try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) {} } }
      }
    };
    var kfRender = function () {
      kfNavLinks.forEach(function (a) {
        var on = (kfMode === 'list' && a.getAttribute('data-kf-nav') === 'lista') || (kfMode === 'form' && !kfCur.id && a.getAttribute('data-kf-nav') === 'e-re');
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      if (kfToolFilters) kfToolFilters.hidden = kfMode !== 'list';
      kfClosePop();
      if (kfMode === 'form') kfRenderForm(); else kfRenderList();
    };
    var kfPaintErrors = function () {
      if (!kfLevel) return;
      kfErrors = kfValidate(kfCur, kfLevel);
      KF_FIELDS.forEach(function (f) {
        var p = document.getElementById('kf_' + f + '-err'), el = document.getElementById('kf_' + f);
        if (p) { p.textContent = kfErrors[f] || ''; p.hidden = !kfErrors[f]; }
        if (el) { if (kfErrors[f]) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
      });
      var box = document.getElementById('kfErrors');
      if (box && !Object.keys(kfErrors).length) box.remove();
    };
    var kfPersist = function (rec, flashKey) {
      rec.perditesuar = new Date().toISOString();
      if (!rec.id) { rec.id = kfNextId(); rec.krijuar = rec.perditesuar; }
      var list = kfList.filter(function (r) { return r.id !== rec.id; }).concat([kfClone(rec)]);
      try { localStorage.setItem(KF_STORE, JSON.stringify(list)); }
      catch (e) { idmsToast('error', tarT('skSaveFail')); return false; }
      kfList = list;
      idmsToast('ok', tarT(flashKey).replace('{id}', rec.id));
      if (decodeURIComponent(location.hash.slice(1)) !== rec.id) history.replaceState(null, '', '#' + encodeURIComponent(rec.id));
      return true;
    };
    var kfStep = function (to, note) {
      kfCur.historiku = (kfCur.historiku || []).concat([{ statusi: to, data: new Date().toISOString(), shenim: note || '' }]);
      kfCur.statusi = to;
      kfCur.shenim = '';
    };
    var kfFail = function (level) {
      kfLevel = level;
      kfErrors = kfValidate(kfCur, level);
      return Object.keys(kfErrors).length > 0;
    };
    var kfNeedNote = function () {
      if (String(kfCur.shenim || '').trim()) return false;
      kfLevel = null;
      kfErrors = { shenim: tarT('kfE_note') };
      return true;
    };
    var kfActs = {
      save: function () {
        if (kfFail('draft')) return;
        kfLevel = null;
        if (!kfCur.id) kfStep('draft');
        kfPersist(kfCur, 'kfMsgSaved');
      },
      submit: function () {
        if (kfFail('submit')) return;
        kfLevel = null;
        if (!kfCur.id) kfStep('draft');
        var c = kfCalc(kfCur);
        kfCur.nevoja = c.neto.slice();
        kfCur.zona = c.zone;
        kfStep('dorezuar');
        kfPersist(kfCur, 'kfMsgSubmitted');
      },
      verify: function () {
        if (kfFail('verify')) return;
        kfLevel = null;
        kfStep('verifikuar', String(kfCur.shenim || '').trim());
        kfCur.miratuar = kfCalc(kfCur).brutoTot;
        kfPersist(kfCur, 'kfMsgVerified');
      },
      ret: function () {
        if (kfNeedNote()) return;
        kfStep('draft', kfCur.shenim.trim());
        kfCur.nevoja = null;
        kfPersist(kfCur, 'kfMsgReturned');
      },
      reject: function () {
        if (kfNeedNote()) return;
        kfStep('refuzuar', kfCur.shenim.trim());
        kfPersist(kfCur, 'kfMsgRejected');
      },
      accept: function () {
        if (kfFail('verify')) return;
        kfLevel = null;
        kfCur.miratuar = kfCalc(kfCur).brutoTot;
        kfStep('pranuar', String(kfCur.shenim || '').trim());
        kfPersist(kfCur, 'kfMsgAccepted');
      },
      partial: function () {
        if (kfFail('partial')) return;
        if (kfNeedNote()) return;
        kfLevel = null;
        kfCur.miratuar = kfNum(kfCur.miratuar);
        kfStep('pjeserisht', kfCur.shenim.trim());
        kfPersist(kfCur, 'kfMsgPartial');
      }
    };
    var KF_NEXT = {
      draft: ['dorezuar'],
      dorezuar: ['verifikuar', 'pranuar', 'pjeserisht', 'refuzuar', 'draft'],
      verifikuar: ['pranuar', 'pjeserisht', 'refuzuar'],
      pranuar: ['pjeserisht', 'refuzuar'],
      pjeserisht: ['pranuar', 'refuzuar'],
      refuzuar: ['pranuar', 'pjeserisht']
    };
    var KF_ACT_OF = { dorezuar: 'submit', verifikuar: 'verify', pranuar: 'accept', pjeserisht: 'partial', refuzuar: 'reject', draft: 'ret' };
    var KF_ASK = { pjeserisht: true, refuzuar: true, draft: true };
    var kfPop = document.createElement('div');
    kfPop.className = 'kf-pop';
    kfPop.hidden = true;
    kfPop.setAttribute('role', 'dialog');
    document.body.appendChild(kfPop);
    var kfPopAt = null;
    var kfPlacePop = function () {
      if (!kfPopAt || kfPop.hidden) return;
      var r = kfPopAt.anchor.getBoundingClientRect(), w = kfPop.offsetWidth, h = kfPop.offsetHeight;
      var top = r.bottom + 6 + h > window.innerHeight - 8 ? Math.max(8, r.top - 6 - h) : r.bottom + 6;
      kfPop.style.top = top + 'px';
      kfPop.style.left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8)) + 'px';
    };
    var kfClosePop = function (refocus) {
      if (!kfPopAt) return;
      var a = kfPopAt.anchor;
      kfPop.hidden = true;
      kfPopAt = null;
      if (a && a.isConnected) { a.setAttribute('aria-expanded', 'false'); if (refocus) a.focus(); }
    };
    var kfDrawPop = function (err, vals) {
      var rec = kfSaved(kfPopAt.id), to = kfPopAt.to;
      if (!rec) { kfClosePop(); return; }
      var label = function (s) { return s === 'draft' ? tarT('kfToDraft') : tarT('kfStD_' + s); };
      if (!to) {
        kfPop.setAttribute('aria-label', tarT('kfChangeSt'));
        kfPop.innerHTML = '<p class="kf-pop-title">' + kfEsc(tarT('kfChangeSt')) + ' · ' + kfEsc(rec.id) + '</p>' +
          KF_NEXT[rec.statusi].map(function (s) {
            return '<button type="button" class="kf-pop-opt" data-kf-to="' + s + '">' + kfStatusChip(s) +
              '<span class="kf-pop-d">' + kfEsc(label(s)) + '</span></button>';
          }).join('');
      } else {
        var c = kfCalc(rec), e = err || {};
        kfPop.innerHTML = '<p class="kf-pop-title">' + kfStatusChip(to) + ' <span>' + kfEsc(rec.id) + '</span></p>' +
          '<div class="kf-pop-form">' +
          (to === 'pjeserisht'
            ? '<label for="kfPopVol">' + kfEsc(tarT('kfF_miratuar')) + '</label>' +
              '<input id="kfPopVol" type="number" min="0" step="1" inputmode="numeric"' + (e.miratuar ? ' aria-invalid="true"' : '') + '>' +
              '<p class="kf-pop-hint">' + kfEsc(tarT('kfPopVolHint').replace('{n}', kfFmt(c.brutoTot))) + '</p>' +
              (e.miratuar ? '<p class="kf-pop-err">' + kfEsc(e.miratuar) + '</p>' : '')
            : '') +
          '<label for="kfPopNote">' + kfEsc(tarT('kfF_shenim')) + ' <span class="req" aria-hidden="true">*</span></label>' +
          '<textarea id="kfPopNote" rows="3"' + (e.shenim ? ' aria-invalid="true"' : '') + '></textarea>' +
          (e.shenim ? '<p class="kf-pop-err">' + kfEsc(e.shenim) + '</p>' : '') +
          '<div class="kf-pop-acts"><button type="button" class="btn btn-secondary btn-sm" data-kf-pop-cancel>' + kfEsc(tarT('kfCancel')) + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-kf-pop-ok>' + kfEsc(tarT('kfConfirm')) + '</button></div></div>';
        if (vals) {
          var vi = kfPop.querySelector('#kfPopVol');
          if (vi && vals.vol != null) vi.value = vals.vol;
          kfPop.querySelector('#kfPopNote').value = vals.note || '';
        }
      }
      kfPlacePop();
    };
    var kfOpenPop = function (anchor) {
      var id = anchor.getAttribute('data-kf-st');
      if (kfPopAt && kfPopAt.id === id) { kfClosePop(true); return; }
      kfClosePop();
      kfPopAt = { id: id, anchor: anchor, to: null };
      anchor.setAttribute('aria-expanded', 'true');
      kfPop.hidden = false;
      kfDrawPop();
      var first = kfPop.querySelector('button');
      if (first) first.focus();
    };
    var kfApplyFromList = function (to, vals) {
      var id = kfPopAt.id, rec = kfSaved(id), hash = location.hash;
      kfCur = kfClone(rec);
      kfCur.shenim = vals.note || '';
      if (to === 'pjeserisht') kfCur.miratuar = vals.vol;
      kfErrors = {};
      kfActs[KF_ACT_OF[to]]();
      var errs = Object.keys(kfErrors);
      if (errs.length && errs.every(function (f) { return f === 'shenim' || f === 'miratuar'; }) && KF_ASK[to]) {
        var keep = kfErrors;
        kfCur = null; kfErrors = {}; kfLevel = null;
        kfDrawPop(keep, vals);
        var bad = kfPop.querySelector('[aria-invalid="true"]');
        if (bad) bad.focus();
        return;
      }
      kfClosePop();
      if (errs.length) {
        kfMode = 'form';
        history.pushState(null, '', '#' + encodeURIComponent(id));
        kfRender();
        var box = document.getElementById('kfErrors');
        if (box) box.focus();
        return;
      }
      history.replaceState(null, '', hash || '#lista');
      kfCur = null;
      kfRenderList();
    };
    kfPop.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!kfPopAt) return;
      var opt = e.target.closest('[data-kf-to]');
      if (opt) {
        var to = opt.getAttribute('data-kf-to');
        if (KF_ASK[to]) {
          kfPopAt.to = to;
          kfDrawPop();
          var f = kfPop.querySelector('#kfPopVol') || kfPop.querySelector('#kfPopNote');
          if (f) f.focus();
        } else kfApplyFromList(to, {});
        return;
      }
      if (e.target.closest('[data-kf-pop-cancel]')) { kfClosePop(true); return; }
      if (e.target.closest('[data-kf-pop-ok]')) {
        var vol = kfPop.querySelector('#kfPopVol');
        kfApplyFromList(kfPopAt.to, { note: kfPop.querySelector('#kfPopNote').value, vol: vol ? vol.value : null });
      }
    });
    document.addEventListener('click', function (e) {
      if (kfPopAt && !kfPop.contains(e.target) && !e.target.closest('[data-kf-st]')) kfClosePop();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && kfPopAt) kfClosePop(true); });
    window.addEventListener('resize', kfPlacePop);
    window.addEventListener('scroll', kfPlacePop, true);
    kfRoot.addEventListener('click', function (e) {
      var stb = e.target.closest('[data-kf-st]');
      if (stb) { kfOpenPop(stb); return; }
      var act = e.target.closest('[data-kf-act]');
      if (act && kfCur && kfActs[act.getAttribute('data-kf-act')]) {
        kfErrors = {};
        kfActs[act.getAttribute('data-kf-act')]();
        kfRenderForm();
        var near = ['shenim', 'miratuar'].filter(function (f) { return kfErrors[f]; })[0];
        var box = document.getElementById('kfErrors');
        var field = near && document.getElementById('kf_' + near);
        if (field) { field.focus(); field.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
        else if (box) box.focus();
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      var go = e.target.closest('[data-kf-goto]');
      if (go) {
        e.preventDefault();
        var el = document.getElementById('kf_' + go.getAttribute('data-kf-goto'));
        var target = el && (el.matches('fieldset') ? el.querySelector('input') : el);
        if (target) { target.focus(); target.scrollIntoView({ block: 'center' }); }
        return;
      }
    });
    var kfOnValue = function (e) {
      var t = e.target;
      if (!kfCur || !t.name || !t.closest('#kfForm')) return;
      var f = t.name;
      if (f === 'nevoja') {
        if (!kfCur.nevoja) return;
        kfCur.nevoja[+t.getAttribute('data-kf-m')] = t.value === '' ? null : +t.value;
      } else if (t.type === 'radio') {
        if (!t.checked) return;
        var prev = KF_SYS[kfCur.sistemi];
        kfCur[f] = t.value;
        if (f === 'sistemi' && (kfCur.eff === '' || kfCur.eff == null || (prev && +kfCur.eff === prev[2]))) kfCur.eff = KF_SYS[t.value][2];
      } else if (f === 'njesia') {
        var bn = t.value.split('|');
        kfCur.bashkia = t.value ? bn[0] : '';
        kfCur.njesia = t.value ? bn.slice(1).join('|') : '';
      } else {
        kfCur[f] = t.value;
      }
      if (t.tagName === 'SELECT' || t.type === 'radio' || f === 'viti' || f === 'data') {
        if (e.type === 'change' || t.tagName === 'SELECT' || t.type === 'radio') { kfRenderForm(); if (kfLevel) kfPaintErrors(); return; }
      }
      var calc = document.getElementById('kfCalc');
      if (calc && f !== 'nevoja') calc.innerHTML = kfCalcHtml();
      else if (calc && f === 'nevoja') {
        var c = kfCalc(kfCur);
        var tots = calc.querySelectorAll('.kf-tot');
        if (tots[0]) tots[0].textContent = c.netoTot == null ? '—' : kfFmt(c.netoTot);
        var brow = calc.querySelectorAll('tbody tr')[1];
        if (brow) {
          var cells = brow.querySelectorAll('td');
          for (var i = 0; i < 12; i++) cells[i].textContent = c.bruto && c.bruto[i] ? kfFmt(c.bruto[i]) : (c.bruto ? '0' : '—');
          cells[12].textContent = kfFmt(c.brutoTot);
        }
      }
      kfPaintErrors();
    };
    kfRoot.addEventListener('input', kfOnValue);
    kfRoot.addEventListener('change', kfOnValue);
    kfRoot.addEventListener('submit', function (e) { e.preventDefault(); });
    var kfRoute = function (first) {
      var h = '';
      try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) {}
      kfList = kfRead();
      kfNeedCache = {};
      var rec = h && h !== 'e-re' && h !== 'lista' ? kfSaved(h) : null;
      if (!first && h !== '' && h !== 'lista' && h !== 'e-re' && !rec) return false;
      kfErrors = {};
      kfLevel = null;
      if (h === 'e-re') { kfMode = 'form'; kfCur = kfBlank(); }
      else if (rec) { kfMode = 'form'; kfCur = kfClone(rec); kfCur.shenim = ''; }
      else { kfMode = 'list'; kfCur = null; }
      kfRender();
      return true;
    };
    window.addEventListener('hashchange', function () {
      if (kfRoute(false)) window.scrollTo({ top: 0, behavior: 'instant' });
    });
    window.addEventListener('beforeunload', function (e) { if (kfDirty()) { e.preventDefault(); e.returnValue = ''; } });
    document.addEventListener('idms:langchange', kfRender);
    kfRoute(true);
    loadPlaces().then(function (rows) {
      replaceList(kfPlaces, rows);
      var official = function (rec) {
        if (!rec || !rec.njesia || kfZoneOf(rec.bashkia, rec.njesia)) return false;
        var key = placeKey(rec.njesia);
        var hits = kfPlaces.filter(function (p) { return placeKey(p[2]) === key; });
        if (hits.length > 1) hits = hits.filter(function (p) { return placeKey(p[1]) === placeKey(rec.bashkia); });
        if (hits.length !== 1) return false;
        rec.bashkia = hits[0][1];
        rec.njesia = hits[0][2];
        return true;
      };
      var stored = kfRead();
      if (stored.map(official).some(Boolean)) {
        try { localStorage.setItem(KF_STORE, JSON.stringify(stored)); } catch (e) {}
      }
      kfList = kfRead();
      if (kfCur) official(kfCur);
      kfRender();
    }).catch(function () {  });
  }
  var viewLinks = document.querySelectorAll('[data-view-link]');
  var views = document.querySelectorAll('[data-view]');
  if (viewLinks.length && views.length) {
    var showView = function (name, scroll) {
      var known = Array.prototype.some.call(views, function (v) {
        return v.getAttribute('data-view') === name;
      });
      if (!known) name = views[0].getAttribute('data-view');
      views.forEach(function (v) { v.hidden = v.getAttribute('data-view') !== name; });
      viewLinks.forEach(function (a) {
        if (a.getAttribute('data-view-link') === name) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
      if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
    };
    var viewFromHash = function () {
      try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return ''; }
    };
    window.addEventListener('hashchange', function () { showView(viewFromHash(), false); });
    viewLinks.forEach(function (a) {
      if (!a.hasAttribute('data-view-toggle')) return;
      a.addEventListener('click', function (e) {
        if (viewFromHash() !== a.getAttribute('data-view-link')) return;
        e.preventDefault();
        history.pushState(null, '', location.pathname + location.search);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
    });
    showView(viewFromHash(), false);
  }
  document.addEventListener('mouseover', function (e) {
    for (var el = e.target; el && el.nodeType === 1; el = el.parentNode) {
      var tip = el.getAttribute('title');
      if (tip === null) continue;
      if (tip && !el.hasAttribute('aria-label') && !el.textContent.trim()) el.setAttribute('aria-label', tip);
      el.removeAttribute('title');
    }
  }, true);
  var loaded = function () { document.documentElement.classList.remove('is-loading'); };
  requestAnimationFrame(function () { requestAnimationFrame(loaded); });
  setTimeout(loaded, 400);
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
