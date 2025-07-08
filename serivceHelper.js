const { getSupabase } = require("./supabaseClient");

async function canGenerateFlashcards(userId) {
  const supabase = getSupabase();
  const { data: usageData, error } = await supabase
    .from("AiUsage")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);

  const DAILY_LIMIT = 2; // change as needed

  // Reset if it's a new day
  const now = new Date();
  const lastReset = new Date(usageData.last_reset);
  const isNewDay = now.toDateString() !== lastReset.toDateString();

  if (isNewDay) {
    await supabase
      .from("AiUsage")
      .update({
        usage_count: 1,
        last_reset: now.toISOString(),
      })
      .eq("user_id", userId);
    return true;
  }

  if (usageData.usage_count >= DAILY_LIMIT) return false;

  await supabase
    .from("AiUsage")
    .update({
      usage_count: usageData.usage_count + 1,
    })
    .eq("user_id", userId);

  return true;
}

module.exports = {
  canGenerateFlashcards,
};
