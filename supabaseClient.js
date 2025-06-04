let supabase;

function initSupabase({ url, key, options = {} }) {
  const { createClient } = require("@supabase/supabase-js");

  if (!url || !key) {
    throw new Error(
      "❌ Supabase keys are missing. Provide them via initSupabase({ url, key })"
    );
  }

  // Default config (can be extended with AsyncStorage on React Native)
  const config = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      ...options.auth, // override or add extra options
    },
  };

  supabase = createClient(url, key, config);
}

function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Call initSupabase({ url, key }) first."
    );
  }
  return supabase;
}

module.exports = {
  initSupabase,
  getSupabase,
};
