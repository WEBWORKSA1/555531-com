/* 555531.com — tool logic: Number Inspector, Scam Check, 31-Day Quiet Line, Area Codes, Fictional Numbers, VoIP calculator */
(function(){
  'use strict';
  var $=ND.$,$$=ND.$$,store=ND.store,B=window.BASE||'';
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var regionName=(function(){try{var d=new Intl.DisplayNames(['en'],{type:'region'});return function(c){try{return d.of(c)}catch(e){return c}}}catch(e){return function(c){return c}}})();
  var CARIB_INTL={BS:1,BB:1,AI:1,AG:1,VG:1,KY:1,BM:1,GD:1,TC:1,JM:1,MS:1,SX:1,LC:1,DM:1,VC:1,DO:1,TT:1,KN:1};
  function guessCountry(){var l=(navigator.language||'en-US').split('-')[1];return l&&l.length===2?l.toUpperCase():'US'}

  /* ===================== NUMBER INSPECTOR ===================== */
  var insp=$('#inspector');
  if(insp){
    var inNum=$('#inNum'),inCountry=$('#inCountry'),out=$('#inOut');
    var COUNTRIES=['US','CA','GB','IN','AU','IE','NZ','DE','FR','ES','IT','NL','BR','MX','PH','NG','ZA','AE','SG','LK','PK','BD','JP','KR','CN'];
    COUNTRIES.forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=regionName(c)+' (+'+(window.libphonenumber?libphonenumber.getCountryCallingCode(c):'')+')';inCountry.appendChild(o)});
    var g=guessCountry();inCountry.value=COUNTRIES.indexOf(g)>-1?g:'US';
    var TYPE={MOBILE:'Mobile',FIXED_LINE:'Landline (fixed)',FIXED_LINE_OR_MOBILE:'Landline or mobile',TOLL_FREE:'Toll-free',PREMIUM_RATE:'Premium-rate (pay per call)',SHARED_COST:'Shared-cost',VOIP:'VoIP / internet number',PERSONAL_NUMBER:'Personal (follow-me) number',PAGER:'Pager',UAN:'Universal access (company) number',VOICEMAIL:'Voicemail access'};
    function kv(label,val,copy){return '<div><small>'+label+'</small><span>'+esc(val)+'</span>'+(copy?'<button class="copy" data-copy="'+esc(val)+'" aria-label="Copy '+label+'">Copy</button>':'')+'</div>'}
    function inspect(raw){
      raw=(raw||'').trim();if(!raw)return;
      if(!window.libphonenumber){out.innerHTML='<p class="notice">The number library is still loading — try again in a second.</p>';out.classList.add('on');return}
      var digits=raw.replace(/[^\d+]/g,'');
      var flags=[],pn=null;
      try{pn=libphonenumber.parsePhoneNumberFromString(raw,inCountry.value)}catch(e){pn=null}
      if(!pn){
        if(/^\+?\d{3}$/.test(digits)||/^\d{2,5}$/.test(digits))flags.push(['warn','Short code or service number. Short codes (like 3–6 digit SMS codes, 911, 999, 112, 311) are not normal subscriber numbers. Never reply to a short-code text you did not expect.']);
        else flags.push(['bad','This does not parse as a phone number in any numbering plan. Check for a missing country code or extra digits.']);
        render(null,flags,raw);return;
      }
      var drama=0,valid=pn.isValid(),possible=pn.isPossible(),type=pn.getType(),cc=pn.countryCallingCode,nn=pn.nationalNumber,country=pn.country||'';
      var region='';
      if(cc==='1'&&nn.length===10){
        var npa=nn.slice(0,3),nxx=nn.slice(3,6),line=nn.slice(6),rec=(window.NPA||{})[npa];
        if(rec&&rec[1]!=='TF'&&rec[1]!=='PREM'){var cn=regionName(rec[1]);region=rec[0]+(rec[1].length===2&&rec[1]!=='US'&&rec[1]!=='CA'&&cn!==rec[0]?' · '+cn:'');}
        if(nxx==='555'){
          var l=parseInt(line,10);
          if(l>=100&&l<=199)flags.push(['ok','555-0100 to 555-0199 is the North American range reserved for fiction. This number can never ring a real subscriber — safe for films, books, demos and tests.']);
          else if(line==='1212')flags.push(['ok','555-1212 is the traditional directory-assistance number.']);
          else flags.push(['warn','Outside 555-01XX, the 555 exchange is not reserved. Treat it like any other number.']);
        }
        if(npa==='900')flags.push(['bad','900 numbers are premium-rate (pay-per-call). Calling or calling back can be billed per minute. Do not return calls from 900 numbers you do not recognise.']);
        if(rec&&rec[1]==='TF')flags.push(['warn','Toll-free numbers are free to call, but scammers frequently spoof them (for example, fake bank or "Amazon" support lines). Verify by calling the number printed on your card or statement.']);
        if(rec&&CARIB_INTL[rec[1]])flags.push(['bad','Area code '+npa+' is '+regionName(rec[1])+', outside the US and Canada even though it looks domestic. One-ring ("wangiri") scams use these codes to trick you into an expensive international callback. Do not call back unless you know the caller.']);
        if(!rec&&npa!=='900')flags.push(['warn','Area code '+npa+' is not in our assigned list. It may be new, unassigned, or spoofed. Spoofed caller IDs often use invalid area codes.']);
        if(/^[2-9]11$/.test(nxx))flags.push(['bad','The central-office code '+nxx+' looks like an N11 service code (211, 311, 411, 511, 611, 711, 811, 911). It cannot be a normal subscriber number — likely spoofed or mistyped.']);
      }
      if(cc==='44'){
        var n44='0'+nn;
        if(/^07700900\d{3}$/.test(n44)||/^01632960\d{3}$/.test(n44)||/^0(113|114|115|116|117|118|121|131|141|151|161)4960\d{3}$/.test(n44)||/^02079460\d{3}$/.test(n44)||/^01914980\d{3}$/.test(n44)||/^02896496\d{3}$/.test(n44)||/^02920180\d{3}$/.test(n44))
          {flags.push(['ok','This is in an Ofcom range recommended for TV and radio drama — it is not allocated to real customers.']);drama=1}
      }
      if(!region&&country)region=regionName(country);
      if(!valid&&possible&&!drama)flags.push(['warn','The length is possible but the number is not valid in the '+(country?regionName(country):'detected')+' numbering plan. It may be unassigned, mistyped or spoofed.']);
      if(!valid&&!possible)flags.push(['bad','Invalid length for this country. Check the digits and country code.']);
      if(type==='PREMIUM_RATE')flags.push(['bad','Premium-rate number: calls are charged at a high per-minute rate. Classic callback-scam territory.']);
      if(type==='VOIP')flags.push(['warn','VoIP numbers are cheap and easy to get online. Many legitimate businesses use them — so do many scammers. Verify the caller another way.']);
      if(type==='PERSONAL_NUMBER')flags.push(['warn','Personal "follow-me" numbers can forward anywhere in the world and may cost more to call.']);
      if(country&&inCountry.value&&country!==inCountry.value&&cc!=='1')flags.push(['warn','This is an international number ('+regionName(country)+'). Unexpected international calls or texts are a common scam pattern, and calling back may be charged at international rates.']);
      if(valid&&!flags.length)flags.push(['ok','No structural red flags. Remember: caller ID can be faked, so a "clean" number does not prove who is calling. Judge the call by what the caller asks for.']);
      render(pn,flags,raw,{valid:valid,type:type,region:region});
      saveRecent(pn.number);
    }
    function render(pn,flags,raw,info){
      var h='';
      if(pn){
        var st=info.valid?'<span class="tag ok">Valid number</span>':'<span class="tag bad">Not valid</span>';
        h+='<div class="verdict"><div><div class="big mono" style="font-size:clamp(1.5rem,4vw,2.2rem)">'+esc(pn.formatInternational())+'</div><div style="margin-top:6px">'+st+' <span class="tag">'+esc(TYPE[info.type]||'Type unknown')+'</span> '+(info.region?'<span class="tag">'+esc(info.region)+'</span>':'')+'</div></div></div>';
        h+='<div class="kv" style="margin-top:14px">'+kv('E.164',pn.format('E.164'),1)+kv('International',pn.formatInternational(),1)+kv('National',pn.formatNational(),1)+kv('Dial link (RFC 3966)',pn.getURI(),1)+kv('Country',pn.country?regionName(pn.country)+' ('+pn.country+')':'Shared code +'+pn.countryCallingCode)+kv('Country calling code','+'+pn.countryCallingCode)+'</div>';
      }else{h+='<div class="verdict"><div><div class="big mono" style="font-size:1.6rem">'+esc(raw)+'</div></div></div>'}
      h+='<h3 style="margin-top:22px">What we noticed</h3><ul class="flags">'+flags.map(function(f){var i=f[0]==='ok'?'✓':f[0]==='warn'?'!':'✕';return '<li class="'+f[0]+'"><b aria-hidden="true">'+i+'</b><span>'+esc(f[1])+'</span></li>'}).join('')+'</ul>';
      h+='<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><a class="btn btn-amber btn-sm" href="'+B+'/scam-check.html?n='+encodeURIComponent(pn?pn.number:raw)+'">Got a call from this? Run the Scam Check</a><a class="btn btn-ghost btn-sm" href="'+B+'/guides/report-scam-calls.html">How to report it</a></div>';
      out.innerHTML=h;out.classList.add('on');
    }
    function saveRecent(n){var r=[];try{r=JSON.parse(store('nd-recent')||'[]')}catch(e){}r=r.filter(function(x){return x!==n});r.unshift(n);r=r.slice(0,6);store('nd-recent',JSON.stringify(r));showRecent()}
    function showRecent(){var box=$('#recent');if(!box)return;var r=[];try{r=JSON.parse(store('nd-recent')||'[]')}catch(e){}
      box.innerHTML=r.length?'<small class="muted">Recent (saved only on this device): </small>'+r.map(function(n){return '<button class="tag" type="button" data-recent="'+esc(n)+'" style="cursor:pointer">'+esc(n)+'</button>'}).join(' ')+' <button class="copy" type="button" id="clearRecent">Clear</button>':'';
      $$('[data-recent]',box).forEach(function(b){b.addEventListener('click',function(){inNum.value=b.getAttribute('data-recent');inspect(inNum.value)})});
      var c=$('#clearRecent');if(c)c.addEventListener('click',function(){store('nd-recent','[]');showRecent()})}
    insp.addEventListener('submit',function(e){e.preventDefault();inspect(inNum.value)});
    $$('[data-sample]').forEach(function(b){b.addEventListener('click',function(){inNum.value=b.getAttribute('data-sample');inspect(inNum.value)})});
    var q=new URLSearchParams(location.search).get('n');
    function boot(){showRecent();if(q){inNum.value=q;inspect(q)}}
    if(window.libphonenumber)boot();else window.addEventListener('load',boot);
  }

  /* ===================== SCAM CALL CHECKER ===================== */
  var sc=$('#scamCheck');
  if(sc){
    var Q=[
      ['The caller said it was urgent — act now or something bad happens.',14,'urgency'],
      ['They asked for payment by gift card, crypto, wire transfer, payment app or cash courier.',22,'pay'],
      ['They told you to keep the call secret or not to hang up.',16,'secret'],
      ['They threatened arrest, deportation, lawsuit, account closure or utility cut-off.',16,'threat'],
      ['They asked you to read back a code sent to your phone or email.',20,'otp'],
      ['They claimed to be a government agency, bank, police or a big tech company.',10,'imp'],
      ['It was a recorded message asking you to press 1 or call back.',8,'robo'],
      ['It sounded like a family member in trouble asking for money.',18,'family'],
      ['They asked you to install an app or give remote access to your computer or phone.',20,'remote'],
      ['You "won" a prize, refund or grant but must pay a fee first.',16,'prize'],
      ['The call or missed call came from an unfamiliar international or Caribbean number.',10,'intl'],
      ['They asked for your SIN/SSN, PIN, password or full card number.',18,'pii']
    ];
    var ans={},list=$('#scQs');
    Q.forEach(function(q,i){var d=document.createElement('div');d.className='q';d.innerHTML='<p>'+(i+1)+'. '+esc(q[0])+'</p><div class="yn" role="group" aria-label="Answer question '+(i+1)+'"><button type="button" data-v="1" aria-pressed="false">Yes</button><button type="button" data-v="0" aria-pressed="false">No</button></div>';
      $$('button',d).forEach(function(b){b.addEventListener('click',function(){ans[i]=+b.getAttribute('data-v');$$('button',d).forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});calc()})});list.appendChild(d)});
    var num=new URLSearchParams(location.search).get('n');if(num&&$('#scNum'))$('#scNum').textContent='Number: '+num;
    var REPORT={
      US:[['ReportFraud.ftc.gov','https://reportfraud.ftc.gov/'],['DoNotCall.gov (unwanted sales calls)','https://www.donotcall.gov/'],['FBI IC3 (if money moved online)','https://www.ic3.gov/'],['FCC consumer complaints','https://consumercomplaints.fcc.gov/']],
      CA:[['Canadian Anti-Fraud Centre','https://antifraudcentre-centreantifraude.ca/'],['National Do Not Call List complaints','https://lnnte-dncl.gc.ca/en']],
      GB:[['Forward scam calls/texts: text the number to 7726','https://www.ofcom.org.uk/phones-and-broadband/scam-calls-and-messages'],['Report Fraud — England, Wales & NI (0300 123 2040)','https://www.reportfraud.police.uk/'],['Police Scotland: call 101','https://www.scotland.police.uk/']],
      AU:[['Scamwatch','https://www.scamwatch.gov.au/'],['ReportCyber','https://www.cyber.gov.au/report-and-recover/report']],
      IN:[['National Cyber Crime portal (helpline 1930)','https://cybercrime.gov.in/'],['Sanchar Saathi — report suspected fraud calls (Chakshu)','https://sancharsaathi.gov.in/']]
    };
    var scC=$('#scCountry');var gc=guessCountry();if(REPORT[gc])scC.value=gc;scC.addEventListener('change',calc);
    function calc(){
      var n=Object.keys(ans).length,s=0,hits=[];Q.forEach(function(q,i){if(ans[i]===1){s+=q[1];hits.push(q[2])}});s=Math.min(100,s);
      var box=$('#scOut');if(!n){box.classList.remove('on');return}box.classList.add('on');
      var hard=hits.some(function(h){return ['pay','otp','remote','pii'].indexOf(h)>-1});var lvl=(s>=45||hard)?['bad','High risk — treat this as a scam','var(--coral)']:s>=18?['warn','Caution — several warning signs','var(--amber)']:['ok','Low risk so far','var(--green)'];
      var ang=Math.PI*(1-s/100),x=90+70*Math.cos(ang),y=90-70*Math.sin(ang);
      $('#scGauge').innerHTML='<svg viewBox="0 0 180 100" class="gauge" role="img" aria-label="Risk score '+s+' out of 100"><path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="var(--line)" stroke-width="14" stroke-linecap="round"/><path d="M20 90 A70 70 0 0 1 '+x.toFixed(1)+' '+y.toFixed(1)+'" fill="none" stroke="'+lvl[2]+'" stroke-width="14" stroke-linecap="round"/><text x="90" y="86" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="26" fill="currentColor">'+s+'</text></svg>';
      $('#scVerdict').innerHTML='<span class="tag '+lvl[0]+'">'+lvl[1]+'</span><p class="muted" style="margin:8px 0 0">'+n+' of '+Q.length+' questions answered. Score is a guide, not proof — one strong signal (like a gift-card request) is enough to hang up.</p>';
      var steps=[];
      if(hits.indexOf('pay')>-1||hits.indexOf('pii')>-1||hits.indexOf('otp')>-1)steps.push('If you already paid or shared details: call your bank or card issuer now using the number on your card, freeze or change affected passwords, and ask about reversing the payment.');
      if(hits.indexOf('otp')>-1)steps.push('A one-time code read to a caller can let them take over your account. Change that account’s password and sign out all sessions.');
      if(hits.indexOf('remote')>-1)steps.push('If you installed a remote-access app, disconnect from the internet, uninstall it, and have the device checked before logging into banking.');
      if(hits.indexOf('family')>-1)steps.push('Hang up and call the family member back on the number you already have. Agree a family safe word for the future.');
      if(hits.indexOf('intl')>-1)steps.push('Do not call back unknown international or Caribbean numbers — callbacks can be billed at premium rates.');
      if(hits.indexOf('imp')>-1)steps.push('Government agencies and banks do not demand immediate payment by phone. Contact the organisation through its official website or the number on your statement.');
      steps.push('Block the number and report it — reports feed the blocklists that protect everyone.');
      var r=REPORT[scC.value]||REPORT.US;
      $('#scSteps').innerHTML='<ol>'+steps.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ol><h4 style="margin-top:14px">Report it in '+esc(regionName(scC.value))+'</h4><ul>'+r.map(function(x){return '<li><a href="'+x[1]+'" target="_blank" rel="noopener">'+esc(x[0])+'</a></li>'}).join('')+'</ul>';
    }
    $('#scReset').addEventListener('click',function(){ans={};$$('.yn button',list).forEach(function(b){b.classList.remove('on');b.setAttribute('aria-pressed','false')});calc()});
  }

  /* ===================== 31-DAY QUIET LINE ===================== */
  var q31=$('#q31');
  if(q31){
    var dIn=$('#q31Date'),reg=$('#q31Reg');
    function iso(d){return d.toISOString().slice(0,10)}
    var today=new Date();dIn.value=store('nd-q31-date')||iso(today);
    function fmt(d){return d.toLocaleDateString(undefined,{weekday:'short',year:'numeric',month:'long',day:'numeric'})}
    function run(){
      if(!dIn.value)return;store('nd-q31-date',dIn.value);
      var p=dIn.value.split('-'),start=new Date(+p[0],+p[1]-1,+p[2]),stop=new Date(start);stop.setDate(stop.getDate()+31);
      var now=new Date();now.setHours(0,0,0,0);var left=Math.ceil((stop-now)/864e5);
      $('#q31Stop').textContent=fmt(stop);
      $('#q31Left').textContent=left>0?left+' day'+(left===1?'':'s')+' to go':'Window closed';
      $('#q31Note').textContent=left>0?'Covered telemarketers can still lawfully call until this date. Keep a log of who calls so you can complain afterwards.':'If a covered telemarketer calls you now, it is a likely violation. Note the date, time and number and file a complaint.';
      var pct=Math.max(0,Math.min(100,Math.round((31-Math.max(left,0))/31*100)));$('#q31Bar').style.width=pct+'%';
      var isCA=reg.value==='CA';$('#q31Link').href=isCA?'https://lnnte-dncl.gc.ca/en':'https://www.donotcall.gov/';$('#q31Link').textContent=isCA?'Open Canada’s National DNCL':'Open DoNotCall.gov';
      $('#q31Ics').onclick=function(){
        var d=iso(stop).replace(/-/g,''),uid=Date.now()+'@555531';
        var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//555531.com//31-Day Quiet Line//EN','BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART;VALUE=DATE:'+d,'SUMMARY:Do-not-call grace period ends','DESCRIPTION:Your 31-day do-not-call window has ended. Log any telemarketing calls from today and file complaints.','BEGIN:VALARM','TRIGGER:PT9H','ACTION:DISPLAY','DESCRIPTION:31-day quiet line check','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
        var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='31-day-quiet-line.ics';document.body.appendChild(a);a.click();a.remove();
      };
    }
    dIn.addEventListener('change',run);reg.addEventListener('change',run);run();
    var saved={};try{saved=JSON.parse(store('nd-q31-check')||'{}')}catch(e){}
    var items=$$('#q31List li');
    function prog(){var d=items.filter(function(li){return $('input',li).checked}).length;$('#q31Done').textContent=d+' / '+items.length;$('#q31Prog').style.width=(d/items.length*100)+'%'}
    items.forEach(function(li,i){var cb=$('input',li);cb.checked=!!saved[i];li.classList.toggle('done',cb.checked);cb.addEventListener('change',function(){saved[i]=cb.checked;li.classList.toggle('done',cb.checked);store('nd-q31-check',JSON.stringify(saved));prog()})});
    prog();
    var rs=$('#q31Reset');if(rs)rs.addEventListener('click',function(){saved={};store('nd-q31-check','{}');items.forEach(function(li){$('input',li).checked=false;li.classList.remove('done')});prog()});
    var pr=$('#q31Print');if(pr)pr.addEventListener('click',function(){window.print()});
  }

  /* ===================== AREA CODE DIRECTORY ===================== */
  var ac=$('#acTable');
  if(ac){
    function group(c){return c==='US'?'US':c==='CA'?'CA':c==='TF'?'TF':c==='PREM'?'PREM':CARIB_INTL[c]?'CAR':'TERR'}
    var LBL={US:'United States',CA:'Canada',TF:'Toll-free',PREM:'Premium',CAR:'Caribbean / Atlantic (international)',TERR:'US territory'};
    var rows=Object.keys(window.NPA||{}).sort().map(function(k){var r=NPA[k];return {c:k,r:r[0],g:group(r[1]),iso:r[1]}});
    var tb=$('tbody',ac),qi=$('#acQ'),fi=$('#acF'),cnt=$('#acCount');
    function draw(){
      var q=(qi.value||'').toLowerCase().trim(),f=fi.value;
      var out=rows.filter(function(x){return (!f||x.g===f)&&(!q||x.c.indexOf(q)===0||x.r.toLowerCase().indexOf(q)>-1||LBL[x.g].toLowerCase().indexOf(q)>-1)});
      cnt.textContent=out.length+' area code'+(out.length===1?'':'s');
      tb.innerHTML=out.map(function(x){var risk=x.g==='CAR'?'<span class="tag bad">One-ring watch</span>':x.g==='PREM'?'<span class="tag bad">Pay-per-call</span>':x.g==='TF'?'<span class="tag warn">Often spoofed</span>':'<span class="tag ok">Domestic</span>';
        return '<tr><td class="mono"><b>'+x.c+'</b></td><td>'+esc(x.r)+'</td><td>'+esc(x.g==='CAR'||x.g==='TERR'?regionName(x.iso):LBL[x.g])+'</td><td>'+risk+'</td><td><a href="'+B+'/inspect.html?n=%2B1'+x.c+'2345678">Inspect</a></td></tr>'}).join('')||'<tr><td colspan="5">No match. Try a 3-digit code, state, province or country.</td></tr>';
    }
    qi.addEventListener('input',draw);fi.addEventListener('change',draw);
    var p=new URLSearchParams(location.search).get('q');if(p)qi.value=p;
    draw();
  }

  /* ===================== FICTIONAL NUMBER GENERATOR ===================== */
  var fg=$('#fictional');
  if(fg){
    var UK={'Leeds':['0113','496 0'],'Sheffield':['0114','496 0'],'Nottingham':['0115','496 0'],'Leicester':['0116','496 0'],'Bristol':['0117','496 0'],'Reading':['0118','496 0'],'Birmingham':['0121','496 0'],'Edinburgh':['0131','496 0'],'Glasgow':['0141','496 0'],'Liverpool':['0151','496 0'],'Manchester':['0161','496 0'],'London':['020','7946 0'],'Tyneside/Durham/Sunderland':['0191','498 0'],'Northern Ireland':['028','9649 6'],'Cardiff':['029','2018 0'],'No area (01632)':['01632','960 ']};
    var AU=['0491 570 006','0491 570 156','0491 570 157','0491 570 158','0491 570 159','0491 570 110','0491 570 313','0491 570 737','0491 571 266','0491 571 491','0491 571 804','0491 572 549','0491 572 665','0491 572 983','0491 573 770','0491 573 087','0491 574 118','0491 574 632','0491 575 254','0491 575 789','0491 576 398','0491 576 801','0491 577 426','0491 577 644','0491 578 957','0491 578 148','0491 578 888','0491 579 212','0491 579 760','0491 579 455','1800 160 401','1800 975 707','1800 975 708','1800 975 709','1800 975 710'];
    var kind=$('#fgKind'),opt=$('#fgOpt'),optL=$('#fgOptL'),cnt2=$('#fgCount'),fmtSel=$('#fgFmt'),list=$('#fgList'),last=[];
    function rnd(n){return Math.floor(Math.random()*n)}
    function pad(n,w){n=String(n);while(n.length<w)n='0'+n;return n}
    function fillOpt(){
      var k=kind.value;opt.innerHTML='';optL.hidden=false;opt.hidden=false;
      if(k==='NANP'){optL.textContent='Area code';var o=document.createElement('option');o.value='';o.textContent='Random US/Canada area code';opt.appendChild(o);
        Object.keys(NPA).filter(function(c){return NPA[c][1]==='US'||NPA[c][1]==='CA'}).forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c+' — '+NPA[c][0];opt.appendChild(o)})}
      else if(k==='UK'){optL.textContent='Area';Object.keys(UK).forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c+' ('+UK[c][0]+')';opt.appendChild(o)})}
      else{optL.hidden=true;opt.hidden=true}
    }
    function gen(){
      var k=kind.value,n=Math.max(1,Math.min(50,+cnt2.value||10)),e164=fmtSel.value==='e164',set={},out=[],guard=0;
      var usCodes=Object.keys(NPA).filter(function(c){return NPA[c][1]==='US'||NPA[c][1]==='CA'});
      var cap=k==='AU'?AU.length:k==='IE'?1e4:k==='NANP'&&opt.value?100:1000;n=Math.min(n,cap);
      while(out.length<n&&guard++<5000){
        var s;
        if(k==='NANP'){var a=opt.value||usCodes[rnd(usCodes.length)],l=pad(100+rnd(100),4);s=e164?'+1'+a+'555'+l:'('+a+') 555-'+l}
        else if(k==='UK'){var u=UK[opt.value],tail=u[1].replace(/ /g,''),need=(u[0]==='01632'?6:(u[0].length===3?8:7))-tail.length,num=tail+pad(rnd(Math.pow(10,need)),need);s=e164?'+44'+u[0].slice(1)+num:u[0]+' '+u[1]+num.slice(tail.length)}
        else if(k==='UKM'){var m=pad(rnd(1000),3);s=e164?'+447700900'+m:'07700 900'+m}
        else if(k==='IE'){var x=rnd(10),y=pad(rnd(10000),4);s=e164?'+3532091'+x+y:'020 91'+x+' '+y}
        else{var v=AU[rnd(AU.length)];s=e164?'+61'+v.replace(/ /g,'').slice(1):v}
        if(!set[s]){set[s]=1;out.push(s)}
      }
      last=out;
      list.innerHTML=out.map(function(s){return '<button type="button" data-copy="'+esc(s)+'" title="Click to copy">'+esc(s)+'</button>'}).join('');
    }
    kind.addEventListener('change',function(){fillOpt();gen()});opt.addEventListener('change',gen);fmtSel.addEventListener('change',gen);
    $('#fgGo').addEventListener('click',gen);
    $('#fgCopy').addEventListener('click',function(){ND.copy(last.join('\n'))});
    $('#fgCsv').addEventListener('click',function(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['number\n'+last.join('\n')],{type:'text/csv'}));a.download='safe-fictional-numbers.csv';document.body.appendChild(a);a.click();a.remove()});
    function bootF(){fillOpt();gen()}
    if(window.NPA)bootF();else window.addEventListener('load',bootF);
  }

  /* ===================== VOIP SAVINGS CALCULATOR ===================== */
  var vc=$('#voip');
  if(vc){
    var f=function(id){return parseFloat($(id).value)||0};
    function money(n){return (n<0?'-':'')+'$'+Math.abs(n).toLocaleString(undefined,{maximumFractionDigits:0})}
    function calcV(){
      var lines=f('#vLines'),cur=f('#vCur'),plan=f('#vPlan'),hw=f('#vHw'),mo=f('#vMo')||36;
      var curM=lines*cur,newM=lines*plan,save=curM-newM,one=lines*hw,net=save*mo-one,pay=save>0?Math.ceil(one/save):null;
      $('#vSaveM').textContent=money(save);$('#vSaveY').textContent=money(save*12);$('#vNet').textContent=money(net);
      $('#vPay').textContent=save<=0?'No payback at these prices':(one===0?'Immediate':pay+' month'+(pay===1?'':'s'));
      $('#vPct').textContent=curM>0?Math.round(save/curM*100)+'%':'—';
      var q=$('#vQuote');if(q)q.href=B+'/get-quote.html?lines='+encodeURIComponent(lines)+'#quote';
    }
    $$('input',vc).forEach(function(i){i.addEventListener('input',calcV)});calcV();
  }

  /* ===================== QUOTE FORM PREFILL ===================== */
  var ql=new URLSearchParams(location.search).get('lines'),qf=$('#qLines');
  if(ql&&qf){var v=+ql;qf.value=v<=1?'1':v<=5?'2–5':v<=20?'6–20':v<=50?'21–50':'51+'}
})();
