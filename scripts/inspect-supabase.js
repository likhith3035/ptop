const { createClient } = require("@supabase/supabase-js");

const url = "https://ubdbmuzyurgomsahltml.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZGJtdXp5dXJnb21zYWhsdG1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDYwMzc1OCwiZXhwIjoyMTA2MTc5NzU4fQ.7ZsYRsT4_cU-b77IEQg_ph-mACIPkKacWAibVvv5sNw";

const supabase = createClient(url, key);

async function inspect() {
  console.log("Checking Supabase tables...");
  const { data: profiles, error: pErr } = await supabase.from("participant_profiles").select("*");
  console.log("Profiles count:", profiles ? profiles.length : pErr?.message);
  if (profiles && profiles.length > 0) {
    console.log("Profiles:", profiles.map(p => ({ id: p.id, name: p.full_name, roll: p.roll_number, email: p.email })));
  }

  const { data: registrations, error: rErr } = await supabase.from("registrations").select("*");
  console.log("Registrations count:", registrations ? registrations.length : rErr?.message);
  if (registrations && registrations.length > 0) {
    console.log("Registrations:", registrations.map(r => ({ id: r.id, regNo: r.registration_number, status: r.status })));
  }

  const { data: events, error: eErr } = await supabase.from("events").select("*");
  console.log("Events count:", events ? events.length : eErr?.message);
}

inspect().catch(console.error);
