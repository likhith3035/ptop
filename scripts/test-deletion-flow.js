const crypto = require("crypto");

async function testDeletionFlow() {
  const baseUrl = "http://localhost:3000";

  console.log("==================================================");
  console.log("       TESTING ADMIN DELETION SYSTEM              ");
  console.log("==================================================");

  // 1. Authenticate as Admin
  console.log("\n--- 1. Admin Login ---");
  const aLogRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "admin", password: "ptopadmin" }),
  });
  if (aLogRes.status !== 200) throw new Error("Admin login failed");
  const adminCookie = aLogRes.headers.get("set-cookie")?.split(";")[0] || "";
  console.log("✓ Admin logged in");

  // 2. Test Invalid Password Protection
  console.log("\n--- 2. Testing Password Protection ---");
  const wrongPassRes = await fetch(`${baseUrl}/api/admin/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      password: "wrongpassword",
      mode: "all",
    }),
  });
  console.log("Wrong password status:", wrongPassRes.status);
  const wrongPassData = await wrongPassRes.json();
  if (wrongPassRes.status === 403 && wrongPassData.error?.includes("password")) {
    console.log("✓ Access properly rejected with 403 when wrong password provided");
  } else {
    throw new Error("Security check failed: wrong password was not rejected with 403");
  }

  // 3. Register a Test Participant
  console.log("\n--- 3. Creating Test Participant ---");
  const testRoll = `DEL${Math.floor(1000 + Math.random() * 9000)}`;
  const regRes = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Delete Test Student",
      email: `deltest_${Date.now()}@nbkrist.org`,
      mobile: "9988776655",
      rollNumber: testRoll,
      year: "2nd Year",
      branch: "IT",
      section: "A",
      isIsteMember: false,
      hasLaptop: true,
      paymentMethod: "cash_at_desk",
    }),
  });
  const regData = await regRes.json();
  if (!regData.success) throw new Error("Failed to create test participant: " + JSON.stringify(regData));
  const testParticipantId = regData.profile.id;
  console.log(`✓ Created test participant: ${testRoll} (${testParticipantId})`);

  // Verify participant shows up in admin roster
  const rosterBefore = await fetch(`${baseUrl}/api/admin/certificate`, { headers: { Cookie: adminCookie } }).then(r => r.json());
  const foundBefore = rosterBefore.roster?.find((p) => p.rollNumber === testRoll);
  if (!foundBefore) throw new Error("Participant not found in admin roster before deletion");
  console.log(`✓ Confirmed participant exists in roster (${rosterBefore.roster.length} participants)`);

  // 4. Test Single Participant Deletion with Password "delete"
  console.log("\n--- 4. Testing Delete Single Participant (Password: delete) ---");
  const delSingleRes = await fetch(`${baseUrl}/api/admin/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      password: "delete",
      mode: "single",
      participantId: testParticipantId,
    }),
  });
  const delSingleData = await delSingleRes.json();
  if (delSingleRes.status !== 200 || !delSingleData.success) {
    throw new Error("Single deletion failed: " + JSON.stringify(delSingleData));
  }
  console.log("✓ Single deletion API response:", delSingleData.message);

  // Verify participant is gone from roster
  const rosterAfterSingle = await fetch(`${baseUrl}/api/admin/certificate`, { headers: { Cookie: adminCookie } }).then(r => r.json());
  const foundAfterSingle = rosterAfterSingle.roster?.find((p) => p.rollNumber === testRoll);
  if (foundAfterSingle) throw new Error("Participant still found in admin roster after deletion!");
  console.log("✓ Verified participant completely removed from roster");

  // 5. Test Delete All Data (mode: "all", password: "delete")
  console.log("\n--- 5. Testing Delete All Data (Password: delete) ---");
  // Create 2 new registrations first
  await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Student A",
      email: `studa_${Date.now()}@nbkrist.org`,
      mobile: "9911223344",
      rollNumber: `ALL1_${Math.floor(1000 + Math.random() * 9000)}`,
      year: "1st Year",
      branch: "CSE",
      section: "A",
      isIsteMember: false,
      hasLaptop: true,
      paymentMethod: "cash_at_desk",
    }),
  });
  await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Student B",
      email: `studb_${Date.now()}@nbkrist.org`,
      mobile: "9911223355",
      rollNumber: `ALL2_${Math.floor(1000 + Math.random() * 9000)}`,
      year: "3rd Year",
      branch: "ECE",
      section: "B",
      isIsteMember: false,
      hasLaptop: true,
      paymentMethod: "cash_at_desk",
    }),
  });

  const rosterMid = await fetch(`${baseUrl}/api/admin/certificate`, { headers: { Cookie: adminCookie } }).then(r => r.json());
  console.log(`Roster before wipe: ${rosterMid.roster?.length} participants`);

  // Now execute Wipe All
  const delAllRes = await fetch(`${baseUrl}/api/admin/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      password: "delete",
      mode: "all",
    }),
  });
  const delAllData = await delAllRes.json();
  if (delAllRes.status !== 200 || !delAllData.success) {
    throw new Error("Bulk deletion failed: " + JSON.stringify(delAllData));
  }
  console.log("✓ Bulk deletion API response:", delAllData.message);

  // Verify all participants are wiped
  const rosterFinal = await fetch(`${baseUrl}/api/admin/certificate`, { headers: { Cookie: adminCookie } }).then(r => r.json());
  if (rosterFinal.roster?.length !== 0) {
    throw new Error(`Roster not empty after wipe! Remaining: ${rosterFinal.roster?.length}`);
  }
  console.log("✓ Confirmed roster is completely empty (0 participants)");

  console.log("\n==================================================");
  console.log("🎉 ALL DELETION TESTS PASSED SUCCESSFULLY!       ");
  console.log("==================================================");
}

testDeletionFlow().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
