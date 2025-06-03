// flashnest-backend/supabaseClient.js
let supabase;

function initSupabase({ url, key }) {
  const { createClient } = require("@supabase/supabase-js");

  if (!url || !key) {
    throw new Error(
      "❌ Supabase keys are missing. Provide them via initSupabase()"
    );
  }

  supabase = createClient(url, key);
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
