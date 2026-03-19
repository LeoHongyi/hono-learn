import { Hono } from "hono";
import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

const pages = new Hono();

// Shared layout shell
const layout = (title: string, activeNav: string, mainContent: HtmlEscapedString | Promise<HtmlEscapedString>) => html`<!DOCTYPE html>
<html class="dark" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title} - Schema Architect</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script>
tailwind.config = {
  darkMode: "class",
  theme: { extend: {
    colors: {
      "outline-variant":"#444936","surface-container-high":"#262a31",
      "on-surface-variant":"#c4c9b0","secondary-container":"#0067d7",
      "surface-container-lowest":"#0a0e14","surface-container-low":"#181c22",
      "on-surface":"#dfe2eb","secondary":"#adc6ff","primary":"#ffffff",
      "surface-variant":"#31353c","error":"#ffb4ab","error-container":"#93000a",
      "primary-fixed-dim":"#a7d62f","surface-bright":"#353940",
      "surface":"#10141a","background":"#10141a","on-background":"#dfe2eb",
      "surface-tint":"#a7d62f","surface-container":"#1c2026",
      "surface-container-highest":"#31353c","primary-fixed":"#c2f34c",
      "primary-container":"#c2f34c","on-primary-fixed":"#151f00",
      "on-primary-container":"#516e00","on-secondary-container":"#e6ecff",
      "secondary-fixed":"#d8e2ff","tertiary-fixed":"#ffdbc8",
      "tertiary-fixed-dim":"#ffb689","on-error-container":"#ffdad6",
    },
    fontFamily: { headline:["Space Grotesk"], body:["Inter"], mono:["JetBrains Mono"] },
    borderRadius: { DEFAULT:"0.125rem", lg:"0.25rem", xl:"0.5rem", full:"0.75rem" },
  }}
};
</script>
<style>
.material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
.glass-card { background:rgba(53,57,64,0.4); backdrop-filter:blur(12px); }
.signature-gradient { background:linear-gradient(135deg,#ffffff 0%,#c2f34c 100%); }
::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0a0e14} ::-webkit-scrollbar-thumb{background:#31353c}
</style>
</head>
<body class="bg-background text-on-surface font-body min-h-screen overflow-hidden">
<!-- TopAppBar -->
<header class="bg-[#10141a] fixed top-0 z-50 flex justify-between items-center px-6 py-4 w-full">
  <div class="flex items-center gap-8">
    <span class="text-2xl font-bold text-white tracking-tighter font-headline">Schema Architect</span>
    <nav class="hidden md:flex items-center gap-6 font-headline tracking-tight">
      <a href="/" class="${activeNav === 'github' ? 'text-[#C5F74F] font-bold' : 'text-slate-400 hover:bg-[#31353c]'} px-2 py-1 rounded transition-colors">GitHub Connection</a>
      <a href="/fields" class="${activeNav === 'fields' ? 'text-[#C5F74F] font-bold' : 'text-slate-400 hover:bg-[#31353c]'} px-2 py-1 rounded transition-colors">Field Management</a>
    </nav>
  </div>
  <div class="flex items-center gap-3">
    <button class="bg-surface-container-highest text-on-surface px-4 py-2 rounded-md font-medium text-sm hover:bg-[#31353c] transition-colors">Deploy</button>
    <button class="signature-gradient text-on-primary-fixed px-4 py-2 rounded-md font-bold text-sm active:scale-95 transition-all">Sync Schema</button>
  </div>
</header>
<div class="flex h-screen pt-16">
<!-- SideNavBar -->
<aside class="bg-[#181c22] h-screen w-64 fixed left-0 top-0 pt-20 flex flex-col p-4 gap-y-2 z-40">
  <div class="mb-6 px-2">
    <div class="flex items-center gap-3 p-2 rounded-lg bg-[#10141a]">
      <div class="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">schema</span>
      </div>
      <div>
        <div class="text-sm font-bold text-white">Drizzle Project</div>
        <div class="text-[10px] text-slate-500 font-mono">main_branch_v1</div>
      </div>
    </div>
  </div>
  <nav class="flex-1 space-y-1 text-sm font-medium">
    <a href="/" class="flex items-center gap-3 px-3 py-2 ${activeNav === 'github' ? 'text-[#C5F74F] bg-[#31353c]' : 'text-slate-400 hover:text-white hover:bg-[#31353c]'} rounded-md transition-all">
      <span class="material-symbols-outlined">hub</span> GitHub Connection
    </a>
    <a href="/fields" class="flex items-center gap-3 px-3 py-2 ${activeNav === 'fields' ? 'text-[#C5F74F] bg-[#31353c]' : 'text-slate-400 hover:text-white hover:bg-[#31353c]'} rounded-md transition-all">
      <span class="material-symbols-outlined">schema</span> Field Management
    </a>
    <a href="#" class="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-[#31353c] rounded-md transition-all">
      <span class="material-symbols-outlined">database</span> Data Preview
    </a>
    <a href="#" class="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-[#31353c] rounded-md transition-all">
      <span class="material-symbols-outlined">settings</span> Settings
    </a>
  </nav>
  <div class="pt-4 border-t border-outline-variant/10 space-y-1 text-sm">
    <a href="#" class="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors">
      <span class="material-symbols-outlined">menu_book</span> Documentation
    </a>
    <button class="w-full mt-4 signature-gradient text-on-primary-fixed font-bold py-2 rounded-md text-sm active:scale-95 transition-all">New Schema</button>
  </div>
</aside>
<!-- Main Content -->
<main class="ml-64 flex-1 overflow-y-auto p-8 pb-24 bg-surface-container-low">
$${mainContent}
</main>
</div>
<!-- Footer -->
<footer class="bg-[#0a0e14] fixed bottom-0 right-0 w-[calc(100%-16rem)] flex justify-between items-center px-8 py-2 z-30">
  <span class="font-mono text-[10px] uppercase tracking-widest text-slate-500">© 2024 Schema Architect. Status: <span class="text-[#C5F74F]">Operational</span></span>
  <div class="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-slate-600">
    <a href="#" class="hover:text-white transition-colors">Privacy</a>
    <a href="#" class="hover:text-white transition-colors">Terms</a>
  </div>
</footer>
</body>
</html>`;

// ─── GitHub Connection Page ───
pages.get("/", (c) => {
  const main = html`
<div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
  <!-- Header -->
  <div class="lg:col-span-12 mb-4">
    <h1 class="font-headline text-5xl font-bold tracking-tight text-white mb-2">GitHub Integration</h1>
    <p class="text-slate-400 max-w-2xl leading-relaxed">Connect your GitHub account to enable seamless schema synchronization, automated migrations, and branch-level previews.</p>
  </div>
  <!-- Left: Form -->
  <div class="lg:col-span-7 space-y-6">
    <div class="bg-surface-container-lowest p-8 rounded-lg">
      <div class="flex items-center gap-3 mb-6">
        <span class="material-symbols-outlined text-primary-fixed" style="font-variation-settings:'FILL' 1;">vpn_key</span>
        <h2 class="font-headline text-xl font-bold text-white">Access Credentials</h2>
      </div>
      <div class="space-y-5">
        <div>
          <label class="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Personal Access Token (classic)</label>
          <div class="relative">
            <input id="token" type="password" class="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 font-mono text-sm text-on-surface focus:ring-1 focus:ring-surface-tint focus:border-surface-tint/50 outline-none transition-all" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"/>
            <span class="absolute right-3 top-3 material-symbols-outlined text-slate-500 cursor-pointer" onclick="toggleToken(this)">visibility</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-2 italic">Token requires <span class="text-secondary-fixed">repo</span> and <span class="text-secondary-fixed">workflow</span> scopes.</p>
        </div>
        <div class="flex items-center gap-4 pt-2">
          <button onclick="fetchUser()" class="signature-gradient text-on-primary-fixed px-6 py-2.5 rounded-lg font-bold text-sm shadow-xl flex items-center gap-2">
            Authenticate Connection
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Status Toast -->
    <div id="status" class="hidden bg-surface-container p-4 rounded border-l-4 border-primary-fixed flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary-fixed" style="font-variation-settings:'FILL' 1;">check_circle</span>
        <span id="status-text" class="text-sm font-bold text-white"></span>
      </div>
    </div>
  </div>
  <!-- Right: User Cards -->
  <div class="lg:col-span-5 space-y-6">
    <div id="user-list">
      <div class="bg-surface-container-high p-6 rounded-lg border-l-2 border-secondary-container">
        <h4 class="text-xs font-mono uppercase tracking-widest text-secondary mb-3">Security Note</h4>
        <p class="text-sm text-on-surface-variant leading-relaxed">We never store your tokens in plain text. All credentials are encrypted with hardware-level keys and only decrypted during active sync sessions.</p>
      </div>
    </div>
  </div>
</div>
<script>
function toggleToken(el) {
  const inp = document.getElementById('token');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  el.textContent = inp.type === 'password' ? 'visibility' : 'visibility_off';
}
function showStatus(msg, isError) {
  const el = document.getElementById('status');
  const txt = document.getElementById('status-text');
  el.classList.remove('hidden');
  el.className = 'bg-surface-container p-4 rounded border-l-4 flex items-center justify-between ' +
    (isError ? 'border-error' : 'border-primary-fixed');
  txt.textContent = msg;
}
async function fetchUser() {
  const token = document.getElementById('token').value.trim();
  if (!token) return showStatus('Please enter a token', true);
  showStatus('Authenticating...', false);
  try {
    const res = await fetch('/api/github-users', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    showStatus('Connected: ' + data.login, false);
    document.getElementById('token').value = '';
    loadUsers();
  } catch (e) { showStatus(e.message, true); }
}
async function deleteUser(id) {
  if (!confirm('Disconnect this account?')) return;
  await fetch('/api/github-users/' + id, { method: 'DELETE' });
  loadUsers();
}
async function loadUsers() {
  try {
    const res = await fetch('/api/github-users');
    const users = await res.json();
    const container = document.getElementById('user-list');
    if (!users.length) {
      container.innerHTML = '<div class="bg-surface-container-high p-6 rounded-lg border-l-2 border-secondary-container"><h4 class="text-xs font-mono uppercase tracking-widest text-secondary mb-3">Security Note</h4><p class="text-sm text-on-surface-variant leading-relaxed">We never store your tokens in plain text. All credentials are encrypted with hardware-level keys.</p></div>';
      return;
    }
    container.innerHTML = users.map(u => \`
      <div class="glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden mb-6">
        <div class="absolute -right-12 -top-12 w-32 h-32 bg-primary-fixed/10 rounded-full blur-3xl"></div>
        <div class="flex items-start gap-5 mb-6">
          <div class="relative">
            \${u.avatarUrl ? '<img src="'+u.avatarUrl+'" class="w-16 h-16 rounded-lg object-cover border-2 border-surface-container-highest"/>' : '<div class="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-slate-400">person</span></div>'}
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-fixed rounded-full flex items-center justify-center border-2 border-background">
              <span class="material-symbols-outlined text-[10px] text-on-primary-fixed font-bold">link</span>
            </div>
          </div>
          <div>
            <h3 class="font-headline text-2xl font-bold text-white">\${u.login}</h3>
            \${u.name ? '<p class="text-sm text-slate-400">'+u.name+'</p>' : ''}
            \${u.bio ? '<p class="text-xs text-slate-500 mt-1">'+u.bio+'</p>' : ''}
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="bg-surface-container-lowest/50 p-3 rounded">
            <div class="text-[10px] font-mono uppercase text-slate-500 mb-1">Repos</div>
            <div class="text-xl font-headline font-bold text-white">\${u.publicRepos}</div>
          </div>
          <div class="bg-surface-container-lowest/50 p-3 rounded">
            <div class="text-[10px] font-mono uppercase text-slate-500 mb-1">Followers</div>
            <div class="text-xl font-headline font-bold text-white">\${u.followers}</div>
          </div>
          <div class="bg-surface-container-lowest/50 p-3 rounded">
            <div class="text-[10px] font-mono uppercase text-slate-500 mb-1">Following</div>
            <div class="text-xl font-headline font-bold text-white">\${u.following}</div>
          </div>
        </div>
        <div class="pt-4 border-t border-white/5 flex justify-between items-center">
          <button onclick="deleteUser(\${u.id})" class="text-xs text-error font-medium flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span class="material-symbols-outlined text-sm">logout</span> Disconnect Account
          </button>
        </div>
      </div>
    \`).join('');
  } catch(e) { console.error(e); }
}
loadUsers();
</script>`;
  return c.html(layout("GitHub Connection", "github", main));
});

// ─── Field Management Page ───
pages.get("/fields", (c) => {
  const main = html`
<div class="max-w-6xl mx-auto space-y-10">
  <!-- Page Header -->
  <div class="flex justify-between items-end">
    <div class="space-y-1">
      <h1 class="text-4xl font-headline font-bold tracking-tight text-white">Users Table</h1>
      <p class="text-slate-400 text-sm max-w-md">Define your table structure with precision. Changes are reflected in the Drizzle-compatible schema preview.</p>
    </div>
    <div class="flex gap-2">
      <span class="bg-primary-container/10 text-primary-fixed-dim text-[10px] px-2 py-1 rounded-sm font-mono flex items-center gap-1">
        <span class="material-symbols-outlined text-xs">check_circle</span> LIVE SYNC
      </span>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
    <!-- Field Editor -->
    <div class="lg:col-span-3 space-y-4">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-headline font-medium text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-fixed">list</span> Field Definitions
        </h2>
        <button onclick="addField()" class="text-primary-fixed-dim hover:text-primary-container text-xs font-bold flex items-center gap-1 transition-colors">
          <span class="material-symbols-outlined text-sm">add_circle</span> Add Field
        </button>
      </div>
      <div id="field-list" class="space-y-3"></div>
      <button onclick="addField()" class="w-full py-4 border-2 border-dashed border-outline-variant/20 rounded-lg hover:border-primary-fixed-dim/40 hover:bg-surface-container-high transition-all flex flex-col items-center justify-center gap-2 group">
        <span class="material-symbols-outlined text-3xl text-slate-600 group-hover:text-primary-fixed-dim transition-colors">add</span>
        <span class="text-sm font-medium text-slate-500 group-hover:text-white transition-colors">Append New Column</span>
      </button>
    </div>
    <!-- Code Preview -->
    <div class="lg:col-span-2 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-headline font-medium text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary">code</span> Drizzle Schema
        </h2>
        <button onclick="copySchema()" class="text-secondary hover:text-white transition-colors">
          <span class="material-symbols-outlined text-lg">content_copy</span>
        </button>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-2xl relative overflow-hidden h-[400px]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 blur-[60px]"></div>
        <pre id="schema-preview" class="font-mono text-[13px] leading-relaxed overflow-x-auto h-full"></pre>
      </div>
      <div class="p-4 bg-tertiary-container/5 rounded-lg border border-tertiary-fixed/10 flex gap-4">
        <span class="material-symbols-outlined text-tertiary-fixed-dim mt-1">info</span>
        <div class="space-y-1">
          <div class="text-xs font-bold text-tertiary-fixed">Naming Convention</div>
          <p class="text-[11px] text-slate-400 leading-normal">Field names will be automatically snake_cased in SQL and camelCased in the TypeScript exported object.</p>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
const fields = [
  { name:'id', type:'serial', nullable:false },
  { name:'github_id', type:'integer', nullable:false },
  { name:'login', type:'varchar', nullable:false },
  { name:'name', type:'varchar', nullable:true },
  { name:'avatar_url', type:'text', nullable:true },
  { name:'bio', type:'text', nullable:true },
  { name:'public_repos', type:'integer', nullable:false },
  { name:'followers', type:'integer', nullable:false },
  { name:'following', type:'integer', nullable:false },
];
const types = ['serial','integer','varchar','text','boolean','timestamp'];
function renderFields() {
  const list = document.getElementById('field-list');
  list.innerHTML = fields.map((f,i) => \`
    <div class="flex items-center gap-3 p-3 bg-surface-container rounded-lg group transition-all hover:bg-surface-container-high border border-outline-variant/5">
      <div class="flex-1 grid grid-cols-12 gap-4 items-center">
        <div class="col-span-5 space-y-1">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Field Name</label>
          <input type="text" value="\${f.name}" onchange="fields[\${i}].name=this.value;updateSchema()"
            class="w-full bg-surface-container-lowest border-none text-on-surface rounded-md text-sm font-mono focus:ring-2 focus:ring-primary-fixed-dim transition-all h-9 px-3"/>
        </div>
        <div class="col-span-4 space-y-1">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Data Type</label>
          <select onchange="fields[\${i}].type=this.value;updateSchema()"
            class="w-full bg-surface-container-lowest border-none text-on-surface rounded-md text-sm focus:ring-2 focus:ring-primary-fixed-dim h-9 px-3">
            \${types.map(t => '<option'+(t===f.type?' selected':'')+'>'+t+'</option>').join('')}
          </select>
        </div>
        <div class="col-span-3 flex flex-col items-center justify-center space-y-1">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Nullable</label>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" \${f.nullable?'checked':''} onchange="fields[\${i}].nullable=this.checked;updateSchema()" class="sr-only peer"/>
            <div class="w-9 h-5 bg-surface-container-lowest rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-container after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </div>
        </div>
      </div>
      <button onclick="fields.splice(\${i},1);renderFields();updateSchema()" class="p-2 text-slate-500 hover:text-error transition-colors">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  \`).join('');
}
function toCamel(s) { return s.replace(/_([a-z])/g,(_,c)=>c.toUpperCase()); }
function updateSchema() {
  const lines = fields.map(f => {
    const camel = toCamel(f.name);
    let line = '  ' + camel + ': ' + f.type + "('" + f.name + "')";
    if (f.name === 'id' && f.type === 'serial') line += '.primaryKey()';
    if (!f.nullable && f.type !== 'serial') line += '.notNull()';
    return line + ',';
  });
  const code = "import { pgTable, serial, text, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';\\n\\nexport const githubUsers = pgTable('github_users', {\\n" + lines.join('\\n') + "\\n});\\n\\n// Schema generated successfully";
  document.getElementById('schema-preview').textContent = code;
}
function addField() {
  fields.push({ name:'new_field', type:'varchar', nullable:true });
  renderFields(); updateSchema();
}
function copySchema() {
  navigator.clipboard.writeText(document.getElementById('schema-preview').textContent);
}
renderFields(); updateSchema();
</script>`;
  return c.html(layout("Field Management", "fields", main));
});

export default pages;
