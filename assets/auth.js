// =====================================================
// NeuroLearn AI — Shared Auth Manager (auth.js)
// =====================================================

function updateAuthUI(user) {
    const authButtons  = document.getElementById('auth-buttons');
    const userProfile  = document.getElementById('user-profile');
    const userNameSpan = document.getElementById('user-name');

    if (user) {
        const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner';
        if (authButtons)  { authButtons.style.display = 'none'; }
        if (userProfile)  { userProfile.style.display = 'flex'; }
        if (userNameSpan) { userNameSpan.textContent = displayName; }
    } else {
        if (authButtons)  { authButtons.style.display = 'flex'; }
        if (userProfile)  { userProfile.style.display = 'none'; }
    }
}

(async function initAuth() {
    if (!window._supabase) return;

    try {
        const { data: { session } } = await window._supabase.auth.getSession();
        updateAuthUI(session?.user ?? null);
    } catch (err) {
        console.warn('[NeuroLearn Auth] Failed to fetch session:', err);
        updateAuthUI(null);
    }

    // Keep UI synchronized across tabs and auth state transitions
    try {
        window._supabase.auth.onAuthStateChange((_event, session) => {
            updateAuthUI(session?.user ?? null);
        });
    } catch (err) {
        // Safe fallback if auth listener is unsupported
    }
})();

async function signOut() {
    if (!window._supabase) return;
    try {
        await window._supabase.auth.signOut();
    } catch (err) {
        console.warn('[NeuroLearn Auth] Error signing out:', err);
    }
    window.location.reload();
}
