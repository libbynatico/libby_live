const Libby = (() => {
  const cfg = window.LIBBY_CONFIG || {};
  const hasSupabaseConfig = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_URL.includes('YOUR_PROJECT_REF'));
  let sb = null;
  const state = {
    session: null,
    user: null,
    profile: null,
    memories: [],
    documents: [],
    ready: false,
    assistantOpen: localStorage.getItem('libby_assistant_open') === 'true',
    mode: hasSupabaseConfig ? 'cloud' : 'local-demo'
  };

  function $(id) { return document.getElementById(id); }
  function html(s) { return String(s || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function nowLine() { return new Date().toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' }); }

  function boot() {
    if (hasSupabaseConfig && window.supabase) {
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      sb.auth.onAuthStateChange((_event, session) => hydrate(session));
      sb.auth.getSession().then(({ data }) => hydrate(data.session));
    } else {
      hydrateLocal();
    }
    wireUI();
    installAssistant();
  }

  async function hydrate(session) {
    state.session = session || null;
    state.user = session?.user || null;
    state.mode = hasSupabaseConfig ? 'cloud' : 'local-demo';
    if (state.user) {
      await ensureProfile();
      await loadCloudData();
      showApp();
    } else {
      showAuth();
    }
    render();
  }

  function hydrateLocal() {
    const local = JSON.parse(localStorage.getItem('libby_local_user') || 'null');
    if (local) {
      state.user = { id: local.id, email: local.email };
      state.profile = local.profile;
      state.memories = JSON.parse(localStorage.getItem('libby_local_memories') || '[]');
      showApp();
    } else {
      showAuth();
    }
    render();
  }

  async function ensureProfile() {
    const { data: profile } = await sb.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
    if (profile) { state.profile = profile; return; }
    const displayName = state.user.user_metadata?.display_name || state.user.email?.split('@')[0] || 'Libby User';
    const { data, error } = await sb.from('profiles').insert({ id: state.user.id, email: state.user.email, display_name: displayName }).select('*').single();
    if (error) throw error;
    state.profile = data;
  }

  async function loadCloudData() {
    const [{ data: memories }, { data: documents }] = await Promise.all([
      sb.from('memories').select('*').order('created_at', { ascending: false }).limit(100),
      sb.from('documents').select('*').order('created_at', { ascending: false }).limit(50)
    ]);
    state.memories = memories || [];
    state.documents = documents || [];
  }

  async function signUp(form) {
    const name = form.display_name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const referral = form.referral_code.value.trim();
    if (!name || !email || password.length < 6) return toast('Name, email, and 6+ character password required.');
    if (!hasSupabaseConfig) {
      const user = { id: 'local_' + Date.now().toString(36), email, profile: { display_name: name, email, verification_status: 'pending', referral_code: 'LOCAL' } };
      localStorage.setItem('libby_local_user', JSON.stringify(user));
      hydrateLocal();
      addAssistantMessage(`Account shell created locally for ${name}. Cloud sync turns on when app-config.js has Supabase values.`);
      return;
    }
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { display_name: name, referral_code: referral || null, preferred_contact_method: 'written/email' } }
    });
    if (error) return toast(error.message);
    if (data.session) await hydrate(data.session);
    if (referral && data.session) await claimReferral(referral);
    toast(data.session ? 'Account created.' : 'Check email to confirm account, then sign in.');
  }

  async function signIn(form) {
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!hasSupabaseConfig) return toast('Cloud login needs app-config.js. Use Create Account for local app shell preview.');
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return toast(error.message);
    await hydrate(data.session);
  }

  async function signOut() {
    if (sb) await sb.auth.signOut();
    localStorage.removeItem('libby_local_user');
    state.user = null; state.profile = null; state.memories = [];
    showAuth(); render();
  }

  async function claimReferral(code) {
    if (!hasSupabaseConfig || !code) return;
    const { error } = await sb.rpc('claim_referral', { code_input: code });
    if (error) toast(error.message);
  }

  async function createReferral() {
    if (!state.user) return toast('Sign in first.');
    if (!hasSupabaseConfig) return toast('Referral codes need cloud mode.');
    const { data, error } = await sb.rpc('create_referral', { circle_id_input: null, role_input: 'member' });
    if (error) return toast(error.message);
    toast(`Referral created: ${data.code}`);
    render();
  }

  async function saveMemory(text, title = 'Conversation note') {
    const body = text.trim();
    if (!body) return;
    if (hasSupabaseConfig && state.user) {
      const { data, error } = await sb.from('memories').insert({ owner_user_id: state.user.id, created_by: state.user.id, title, body, memory_type: 'chat', confidence: 'user_provided' }).select('*').single();
      if (error) return toast(error.message);
      state.memories.unshift(data);
    } else {
      const item = { id: crypto.randomUUID(), title, body, created_at: new Date().toISOString(), confidence: 'local_demo' };
      state.memories.unshift(item);
      localStorage.setItem('libby_local_memories', JSON.stringify(state.memories));
    }
    renderMemories();
  }

  async function uploadFiles(files) {
    if (!files?.length) return;
    if (!hasSupabaseConfig || !state.user) return toast('File sync needs Supabase config and login.');
    for (const file of files) {
      const path = `${state.user.id}/${Date.now()}-${file.name}`;
      const up = await sb.storage.from('libby-files').upload(path, file, { upsert: false });
      if (up.error) { toast(up.error.message); continue; }
      await sb.from('documents').insert({ owner_user_id: state.user.id, filename: file.name, storage_path: path, mime_type: file.type, size_bytes: file.size });
    }
    await loadCloudData();
    render();
    toast('Files uploaded to private Libby storage.');
  }

  function assistantReply(input) {
    const q = input.toLowerCase();
    if (q.includes('hey libby')) return 'I am here. I can draft, remember, organize files, or prepare a human-facing summary. What should I handle first?';
    if (q.includes('referral')) return 'Referral means user linkage without privacy leakage. Use Create Referral after signing in, then another user can enter the code during signup.';
    if (q.includes('file') || q.includes('document')) return 'Upload files in the Files panel. In cloud mode they go into private Supabase storage under your user ID.';
    if (q.includes('pitch') || q.includes('investor')) return 'Investor prototype framing: installable life-assistant app, real identity, synced private memory, referral-linked households, and an always-available assistant UI.';
    return 'Captured. I can turn that into a memory, task, letter, or meeting brief. I saved it as a conversation note so it follows the account when cloud sync is active.';
  }

  function sendAssistantMessage(text) {
    const clean = text.trim();
    if (!clean) return;
    addAssistantMessage(clean, 'user');
    saveMemory(clean, 'Chat capture');
    setTimeout(() => addAssistantMessage(assistantReply(clean), 'libby'), 120);
  }

  function addAssistantMessage(text, role = 'libby') {
    const log = $('assistantLog');
    if (!log) return;
    const div = document.createElement('div');
    div.className = `bubble ${role}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function installAssistant() {
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); openAssistant(); }
      if (e.key === 'Escape') closeAssistant();
    });
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true; rec.interimResults = false;
        rec.onresult = e => {
          const phrase = Array.from(e.results).slice(-1)[0][0].transcript.toLowerCase();
          if (phrase.includes('hey libby')) openAssistant();
        };
        setTimeout(() => rec.start(), 1500);
      } catch (_) {}
    }
  }

  function openAssistant() { state.assistantOpen = true; localStorage.setItem('libby_assistant_open', 'true'); renderAssistantState(); setTimeout(() => $('assistantInput')?.focus(), 20); }
  function closeAssistant() { state.assistantOpen = false; localStorage.setItem('libby_assistant_open', 'false'); renderAssistantState(); }
  function renderAssistantState() { document.body.classList.toggle('assistant-open', state.assistantOpen); }

  function showAuth() { $('authView')?.classList.remove('hidden'); $('appView')?.classList.add('hidden'); }
  function showApp() { $('authView')?.classList.add('hidden'); $('appView')?.classList.remove('hidden'); }

  function wireUI() {
    $('signupForm')?.addEventListener('submit', e => { e.preventDefault(); signUp(e.currentTarget); });
    $('signinForm')?.addEventListener('submit', e => { e.preventDefault(); signIn(e.currentTarget); });
    $('signOutBtn')?.addEventListener('click', signOut);
    $('assistantFab')?.addEventListener('click', openAssistant);
    $('assistantClose')?.addEventListener('click', closeAssistant);
    $('assistantSend')?.addEventListener('click', () => { sendAssistantMessage($('assistantInput').value); $('assistantInput').value=''; });
    $('assistantInput')?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('assistantSend').click(); } });
    $('fileInput')?.addEventListener('change', e => uploadFiles(e.target.files));
    $('referralBtn')?.addEventListener('click', createReferral);
    document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => selectTab(btn.dataset.tab)));
  }

  function selectTab(tab) {
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('[data-panel]').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== tab));
  }

  function render() {
    renderAssistantState();
    $('cloudStatus') && ($('cloudStatus').textContent = hasSupabaseConfig ? 'Cloud sync ready' : 'Local preview: add app-config.js for Supabase sync');
    $('userName') && ($('userName').textContent = state.profile?.display_name || state.user?.email || 'Guest');
    $('userEmail') && ($('userEmail').textContent = state.user?.email || 'Not signed in');
    $('referralCode') && ($('referralCode').textContent = state.profile?.referral_code || '—');
    $('verificationStatus') && ($('verificationStatus').textContent = state.profile?.verification_status || 'pending');
    renderMemories(); renderFiles();
  }

  function renderMemories() {
    const el = $('memoryList'); if (!el) return;
    el.innerHTML = state.memories.length ? state.memories.map(m => `<article class="item"><b>${html(m.title || 'Memory')}</b><p>${html(m.body)}</p><span>${html(m.confidence || 'user_provided')} · ${html((m.created_at || '').slice(0, 10))}</span></article>`).join('') : '<p class="muted">No memories yet. Talk to Libby or add files.</p>';
  }

  function renderFiles() {
    const el = $('fileList'); if (!el) return;
    el.innerHTML = state.documents.length ? state.documents.map(d => `<article class="item"><b>${html(d.filename)}</b><span>${html(d.mime_type || 'file')} · ${Math.round((d.size_bytes || 0)/1024)} KB</span></article>`).join('') : '<p class="muted">No cloud files uploaded yet.</p>';
  }

  function toast(msg) {
    const el = $('toast'); if (!el) return alert(msg);
    el.textContent = msg; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4200);
  }

  return { boot, openAssistant, closeAssistant };
})();

document.addEventListener('DOMContentLoaded', Libby.boot);
