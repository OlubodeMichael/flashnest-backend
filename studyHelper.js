const { getSupabase } = require("./supabaseClient");

async function getDecks(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .select("*")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
}

async function getDeck(deckId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .select("*")
    .eq("id", deckId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function createDeck(userId, title, description) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .insert([{ user_id: userId, title, description }])
    .select();
  if (error) throw new Error(error.message);
  return data;
}

async function updateDeck(deckId, title, description) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .update({ title, description })
    .eq("id", deckId);
  if (error) throw new Error(error.message);
  return data;
}

async function deleteDeck(deckId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Decks")
    .delete()
    .eq("id", deckId);
  if (error) throw new Error(error.message);
  return data;
}

async function getFlashcards(deckId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Flashcards")
    .select("*")
    .eq("deck_id", deckId);
  if (error) throw new Error(error.message);
  return data;
}

async function createFlashcard(userId, deckId, question, answer) {
  const supabase = getSupabase();

  // 1. Insert the flashcard
  const { data, error } = await supabase
    .from("Flashcards")
    .insert([{ user_id: userId, deck_id: deckId, question, answer }])
    .select();

  if (error) throw new Error(error.message);

  // 2. Fetch current flashcards_count
  const { data: deckData, error: fetchError } = await supabase
    .from("Decks")
    .select("flashcards_count")
    .eq("id", deckId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const currentCount = deckData.flashcards_count || 0;

  // 3. Increment the count
  const { error: updateError } = await supabase
    .from("Decks")
    .update({ flashcards_count: currentCount + 1 })
    .eq("id", deckId);

  if (updateError) throw new Error(updateError.message);

  return data;
}

async function updateFlashcard(flashcardId, question, answer) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Flashcards")
    .update({ question, answer })
    .eq("id", flashcardId);
  if (error) throw new Error(error.message);
  return data;
}

async function addBulkFlashcards(userId, deckId, flashcards) {
  const supabase = getSupabase();

  // ✅ 1. Map flashcards to include user_id and deck_id
  const enrichedFlashcards = flashcards.map((card) => ({
    ...card,
    user_id: userId,
    deck_id: deckId,
  }));

  // ✅ 2. Insert flashcards
  const { data, error } = await supabase
    .from("Flashcards")
    .insert(enrichedFlashcards)
    .select();

  if (error) throw new Error(error.message);

  const { data: deckData, error: fetchError } = await supabase
    .from("Decks")
    .select("flashcards_count")
    .eq("id", deckId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const currentCount = deckData.flashcards_count || 0;

  const { error: updateError } = await supabase
    .from("Decks")
    .update({
      flashcards_count: currentCount + enrichedFlashcards.length,
    })
    .eq("id", deckId);

  if (updateError) throw new Error(updateError.message);

  return data;
}

async function deleteFlashcard(flashcardId, deckId) {
  const supabase = getSupabase();

  // 1. Delete the flashcard
  const { data, error } = await supabase
    .from("Flashcards")
    .delete()
    .eq("id", flashcardId)
    .select(); // Use select to confirm deletion

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Flashcard not found");

  // 2. Decrement flashcards_count (only if it's > 0)
  const { data: deckData, error: fetchError } = await supabase
    .from("Decks")
    .select("flashcards_count")
    .eq("id", deckId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const currentCount = deckData.flashcards_count || 0;
  const newCount = Math.max(currentCount - 1, 0); // prevent negative

  const { error: updateError } = await supabase
    .from("Decks")
    .update({ flashcards_count: newCount })
    .eq("id", deckId);

  if (updateError) throw new Error(updateError.message);

  return data;
}

module.exports = {
  getDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck,
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  addBulkFlashcards,
};
