const { createClient } = require("@supabase/supabase-js");

const url = "https://ubdbmuzyurgomsahltml.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZGJtdXp5dXJnb21zYWhsdG1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDYwMzc1OCwiZXhwIjoyMTA2MTc5NzU4fQ.7ZsYRsT4_cU-b77IEQg_ph-mACIPkKacWAibVvv5sNw";

const supabase = createClient(url, key);

async function cleanDummyData() {
  console.log("Cleaning all test and dummy data from Supabase...");

  // Delete registrations
  const { error: regErr } = await supabase.from("registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (regErr) console.error("Error clearing registrations:", regErr.message);
  else console.log("✓ Cleared all dummy registrations");

  // Delete participant profiles
  const { error: profErr } = await supabase.from("participant_profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (profErr) console.error("Error clearing participant_profiles:", profErr.message);
  else console.log("✓ Cleared all dummy participant profiles");

  // Verify
  const { data: p } = await supabase.from("participant_profiles").select("id");
  const { data: r } = await supabase.from("registrations").select("id");
  console.log(`Supabase verification: ${p ? p.length : 0} profiles, ${r ? r.length : 0} registrations.`);
}

cleanDummyData().catch(console.error);
