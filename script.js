/* ================= PAGE NAV — breadcrumb style ================= */
var TOTAL = 6;
var current = 0;
var pageLabels = ["Brief","Why it matters","Example","R1 · Tools","R3 · How I check","My page"];

function buildJump(){
  var sel = document.getElementById('jumpSelect');
  sel.innerHTML = '';
  pageLabels.forEach(function(label, i){
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = (i+1) + '. ' + label;
    sel.appendChild(opt);
  });
}

function render(){
  document.querySelectorAll('.page').forEach(function(p){
    p.classList.toggle('active', parseInt(p.getAttribute('data-page')) === current);
  });
  document.getElementById('jumpSelect').value = current;
  document.getElementById('pageCount').textContent = (current+1) + ' / ' + TOTAL;
  document.getElementById('backBtn').disabled = (current === 0);
  document.getElementById('nextBtn').disabled = (current === TOTAL-1);
  if(current === 2) renderExample();
  if(current === 3) mountPassport('passportSlotR1');
  if(current === 4) mountPassport('passportSlotR3');
  if(current === 5) mountPassport('passportSlotFinal');
  window.scrollTo({top:0, behavior:'smooth'});
}

function changePage(delta){
  var next = current + delta;
  if(next < 0 || next > TOTAL-1) return;
  current = next;
  render();
}

/* ================= WORKED EXAMPLE ================= */
var exampleData = {
  iti: {
    assistant:"SwiftChat, approved by my ITI facilitator",
    account:"Institution-issued account",
    device:"Shared lab computer",
    help:"My workshop facilitator, Mr. Deshmukh",
    marks:"Facts, Figures, Dates, Names, Sources",
    method:"Separate supported/unsupported; verify, replace, qualify or remove; pause before I send",
    sources:"the tool register, the attendance sheet, my facilitator",
    peer:"Yes — explained to Rohit, my batchmate",
    version:"v1",
    date:"12 Sep 2026"
  },
  higher: {
    assistant:"Campus-approved AI writing assistant",
    account:"Personal account approved for coursework",
    device:"My own laptop",
    help:"My course coordinator, Ms. Iyer",
    marks:"Facts, Figures, Dates, Names, Sources",
    method:"Separate supported/unsupported; verify, replace, qualify or remove; pause before I send",
    sources:"the submission portal, the course notice board, my coordinator",
    peer:"Yes — explained to Ananya, my classmate",
    version:"v1",
    date:"9 Sep 2026"
  }
};

function renderExample(){
  var lane = document.getElementById('laneSelect').value;
  var d = exampleData[lane];
  var rows = [
    ["Approved assistant", d.assistant],
    ["Account type", d.account],
    ["Device", d.device],
    ["Help route", d.help],
    ["I mark", d.marks],
    ["My method", d.method],
    ["Sources I check against", d.sources],
    ["Peer explanation", d.peer],
    ["Version / date", d.version + " · " + d.date]
  ];
  var html = rows.map(function(r){
    return '<div class="example-row"><span class="k">'+r[0]+'</span><span class="v">'+r[1]+'</span></div>';
  }).join('');
  document.getElementById('exampleDoc').innerHTML = html;
}

/* ================= LIVE PASSPORT PREVIEW ================= */
function getVal(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }
function getChecked(cls){
  var out = [];
  document.querySelectorAll('.'+cls).forEach(function(el){
    if(el.checked) out.push(el.parentElement.querySelector('span').textContent);
  });
  return out;
}

function buildPassportHTML(){
  var assistant = getVal('f_assistant');
  var account = getVal('f_account');
  var device = getVal('f_device');
  var help = getVal('f_help');
  var marks = getChecked('chk-mark');
  var method = getChecked('chk-method');
  var sources = getVal('f_sources');
  var peerDone = document.getElementById('f_peer_done') ? document.getElementById('f_peer_done').checked : false;
  var peerName = getVal('f_peer_name');
  var version = getVal('f_version') || 'v1';
  var date = getVal('f_date');
  var declared = document.getElementById('f_declare') ? document.getElementById('f_declare').checked : false;

  function row(label, val){
    var display = val && val.length ? val : '(not yet filled)';
    return '<div class="p-row"><span class="pk">'+label+'</span><span class="pv'+(val&&val.length?'':' empty')+'">'+display+'</span></div>';
  }

  var html = '<div class="passport">';
  html += '<div class="passport-head"><b>My Personal AI Rulebook</b><span>Section 1.3 · Check Before You Use</span>';
  html += '<div class="seal'+(declared?' verified':'')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>';
  html += '</div>';
  html += '<div class="passport-body">';
  html += row('Approved assistant', assistant);
  html += row('Account type', account);
  html += row('Device', device);
  html += row('Help route', help);
  html += row('I mark', marks.join(', '));
  html += row('My method', method.join('; '));
  html += row('Sources I check', sources);
  html += row('Peer explanation', peerDone ? ('Yes — '+(peerName||'(name not given)')) : '');
  html += row('Version / date', (version||'') + (date? (' · '+date) : ''));
  html += row('Declaration', declared ? 'Signed — these are my own words' : '');
  html += '</div></div>';
  return html;
}

function mountPassport(slotId){
  var slot = document.getElementById(slotId);
  if(slot) slot.innerHTML = buildPassportHTML();
}

function updatePreview(){
  ['passportSlotR1','passportSlotR3','passportSlotFinal'].forEach(function(id){
    if(document.getElementById(id)) mountPassport(id);
  });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', function(){
  buildJump();
  render();
});