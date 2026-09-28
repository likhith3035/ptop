const crypto = require("crypto");

async function runAudit() {
  const baseUrl = "http://localhost:3000";
  const results = {
    passed: [],
    failed: [],
    warnings: [],
  };

  function assert(condition, message) {
    if (condition) {
      results.passed.push(message);
      console.log(`✅ PASS: ${message}`);
    } else {
      results.failed.push(message);
      console.error(`❌ FAIL: ${message}`);
    }
  }

  function warn(message) {
    results.warnings.push(message);
    console.warn(`⚠️ WARN: ${message}`);
  }

  console.log("==================================================");
  console.log("       STARTING FULL PLATFORM AUDIT               ");
  console.log("==================================================");

  // 1. PUBLIC PAGES
  console.log("\n--- 1. Testing Public Pages ---");
  try {
    const homeRes = await fetch(`${baseUrl}/`);
    assert(homeRes.status === 200, "Home page (/) returns 200 OK");
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes("Prompt to Production"), "Home page has event title");
    assert(homeHtml.includes("N.B.K.R"), "Home page has institution name");
  } catch (e) {
    assert(false, `Home page request failed: ${e.message}`);
  }

  try {
    const regRes = await fetch(`${baseUrl}/register`);
    assert(regRes.status === 200, "Register page (/register) returns 200 OK");
    const regHtml = await regRes.text();
    assert(regHtml.includes("Roll Number"), "Register page has roll number field");
    assert(regHtml.includes("Full Name"), "Register page has full name field");
  } catch (e) {
    assert(false, `Register page request failed: ${e.message}`);
  }

  try {
    const loginRes = await fetch(`${baseUrl}/login`);
    assert(loginRes.status === 200, "Login page (/login) returns 200 OK");
    const loginHtml = await loginRes.text();
    assert(loginHtml.includes("Participant"), "Login page has participant option");
    assert(loginHtml.includes("Admin"), "Login page has admin option");
    assert(loginHtml.includes("Coordinator"), "Login page has coordinator option");
  } catch (e) {
    assert(false, `Login page request failed: ${e.message}`);
  }

  // 2. AUTHENTICATION FLOWS
  console.log("\n--- 2. Testing Authentication Flows ---");
  let adminCookie = "";
  let coordCookie = "";
  let partCookie = "";

  // Admin Login
  try {
    const aLogRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin", password: "ptopadmin" }),
    });
    assert(aLogRes.status === 200, "Admin login API returns 200 OK");
    const aLogData = await aLogRes.json();
    assert(aLogData.success && aLogData.role === "admin", "Admin login successful");
    adminCookie = aLogRes.headers.get("set-cookie")?.split(";")[0] || "";
    assert(adminCookie.length > 0, "Admin session cookie received");
  } catch (e) {
    assert(false, `Admin login failed: ${e.message}`);
  }

  // Coordinator Login
  try {
    const cLogRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "coordinator", password: "ptopcoordinator" }),
    });
    assert(cLogRes.status === 200, "Coordinator login API returns 200 OK");
    const cLogData = await cLogRes.json();
    assert(cLogData.success && cLogData.role === "coordinator", "Coordinator login successful");
    coordCookie = cLogRes.headers.get("set-cookie")?.split(";")[0] || "";
    assert(coordCookie.length > 0, "Coordinator session cookie received");
  } catch (e) {
    assert(false, `Coordinator login failed: ${e.message}`);
  }

  // 3. REGISTRATION & TICKET GENERATION FLOW
  console.log("\n--- 3. Testing Registration & Ticket Flow ---");
  const testRoll = `23031A${Math.floor(1000 + Math.random() * 9000)}`;
  const testEmail = `student_${Date.now()}@nbkrist.org`;
  let registeredTicketId = "";
  let registeredQrToken = "";
  let registeredRegId = "";

  try {
    const regPostRes = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "K. Likhith Kumar",
        email: testEmail,
        mobile: "9876543210",
        rollNumber: testRoll,
        year: "3rd Year",
        branch: "AI&DS",
        section: "B",
        isIsteMember: true,
        isteNumber: "ISTE-2026-999",
        hasLaptop: true,
        paymentMethod: "upi",
        upiReference: `UPI${Date.now()}`.padEnd(12, "0"),
      }),
    });
    assert(regPostRes.status === 200, "Registration POST API returns 200 OK");
    const regPostData = await regPostRes.json();
    assert(regPostData.success === true, "Registration successful");
    registeredRegId = regPostData.registration?.id;
    registeredTicketId = regPostData.ticket?.id;
    registeredQrToken = regPostData.ticket?.qrToken;
    assert(Boolean(registeredTicketId), "Ticket generated with registration");
    console.log(`Generated Ticket: ${regPostData.ticket?.ticketNumber} for ${testRoll}`);
  } catch (e) {
    assert(false, `Registration failed: ${e.message}`);
  }

  // 4. PARTICIPANT TICKET & DASHBOARD ACCESS
  console.log("\n--- 4. Testing Participant Pages ---");
  if (registeredTicketId) {
    try {
      const ticketRes = await fetch(`${baseUrl}/ticket/${registeredTicketId}`);
      assert(ticketRes.status === 200, `Ticket page (/ticket/${registeredTicketId}) returns 200 OK`);
      const ticketHtml = await ticketRes.text();
      assert(ticketHtml.includes("K. Likhith Kumar"), "Ticket page displays participant name");
      assert(ticketHtml.includes(testRoll), "Ticket page displays roll number");
      assert(ticketHtml.includes("Official Entry Pass") || ticketHtml.includes("Entry Pass"), "Ticket page renders pass badge");
    } catch (e) {
      assert(false, `Ticket page test failed: ${e.message}`);
    }
  }

  // Participant Login with Roll Number
  try {
    const pLogRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "participant", identifier: testRoll }),
    });
    assert(pLogRes.status === 200, "Participant login with roll number returns 200 OK");
    const pLogData = await pLogRes.json();
    assert(pLogData.success && pLogData.role === "user", "Participant login authenticated");
    partCookie = pLogRes.headers.get("set-cookie")?.split(";")[0] || "";

    // Test /dashboard
    const dashRes = await fetch(`${baseUrl}/dashboard`, { headers: { Cookie: partCookie } });
    assert(dashRes.status === 200, "Participant dashboard (/dashboard) returns 200 OK");
    const dashHtml = await dashRes.text();
    assert(dashHtml.includes("K. Likhith Kumar"), "Dashboard displays student name");
  } catch (e) {
    assert(false, `Participant flow failed: ${e.message}`);
  }

  // 5. COORDINATOR & SCANNER AUDIT
  console.log("\n--- 5. Testing Coordinator & Scanner Pages ---");
  try {
    const coordPageRes = await fetch(`${baseUrl}/coordinator`, { headers: { Cookie: coordCookie } });
    assert(coordPageRes.status === 200, "Coordinator dashboard (/coordinator) returns 200 OK");
    const coordHtml = await coordPageRes.text();
    assert(coordHtml.includes("Coordinator"), "Coordinator page loads coordinator UI");
  } catch (e) {
    assert(false, `Coordinator page test failed: ${e.message}`);
  }

  try {
    const scanPageRes = await fetch(`${baseUrl}/scan`, { headers: { Cookie: coordCookie } });
    assert(scanPageRes.status === 200, "Scan page (/scan) returns 200 OK");
    const scanHtml = await scanPageRes.text();
    assert(scanHtml.includes("QR") || scanHtml.includes("Scan"), "Scan page loads scanner UI");
  } catch (e) {
    assert(false, `Scan page test failed: ${e.message}`);
  }

  // Test Check-in API using QR Token
  if (registeredQrToken) {
    try {
      const checkinRes = await fetch(`${baseUrl}/api/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: coordCookie },
        body: JSON.stringify({ token: registeredQrToken, coordinatorName: "Desk Coordinator A", pin: "1234" }),
      });
      assert(checkinRes.status === 200, "Check-in API with valid QR token returns 200 OK");
      const checkinData = await checkinRes.json();
      assert(checkinData.success === true, "Check-in marks participant as checked in");
    } catch (e) {
      assert(false, `Check-in API failed: ${e.message}`);
    }
  }

  // 6. ADMIN DASHBOARD & TABS AUDIT
  console.log("\n--- 6. Testing Admin Dashboard & APIs ---");
  try {
    const adminPageRes = await fetch(`${baseUrl}/admin`, { headers: { Cookie: adminCookie } });
    assert(adminPageRes.status === 200, "Admin dashboard (/admin) returns 200 OK");
    const adminHtml = await adminPageRes.text();
    assert(adminHtml.includes("Administrator Dashboard") || adminHtml.includes("Admin"), "Admin page displays header");
  } catch (e) {
    assert(false, `Admin page test failed: ${e.message}`);
  }

  // Test Admin Certificates GET API
  let studentProfileId = "";
  try {
    const certListRes = await fetch(`${baseUrl}/api/admin/certificate`, { headers: { Cookie: adminCookie } });
    assert(certListRes.status === 200, "Admin certificate roster API returns 200 OK");
    const certListData = await certListRes.json();
    assert(certListData.success === true, "Certificate roster response success is true");
    assert(Array.isArray(certListData.roster), "Certificate roster returns array of participants");
    const found = certListData.roster.find((p) => p.rollNumber.toUpperCase() === testRoll.toUpperCase());
    assert(Boolean(found), `Found newly registered participant (${testRoll}) in roster`);
    if (found) studentProfileId = found.id;
  } catch (e) {
    assert(false, `Admin certificate GET failed: ${e.message}`);
  }

  // Test Admin Certificate Issue POST API
  let generatedCertNumber = "";
  if (studentProfileId) {
    try {
      const issueRes = await fetch(`${baseUrl}/api/admin/certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({ participantId: studentProfileId }),
      });
      assert(issueRes.status === 200, "Certificate issue POST API returns 200 OK");
      const issueData = await issueRes.json();
      assert(issueData.success && issueData.certificate, "Certificate issued successfully");
      generatedCertNumber = issueData.certificate.certificateNumber;
      console.log(`Issued Certificate: ${generatedCertNumber}`);
    } catch (e) {
      assert(false, `Certificate issuance failed: ${e.message}`);
    }
  }

  // 7. CERTIFICATE VIEW PAGE AUDIT
  console.log("\n--- 7. Testing Certificate View Page ---");
  if (generatedCertNumber) {
    try {
      const certPageRes = await fetch(`${baseUrl}/certificate/${generatedCertNumber}`);
      assert(certPageRes.status === 200, `Certificate page (/certificate/${generatedCertNumber}) returns 200 OK`);
      const certHtml = await certPageRes.text();
      assert(certHtml.includes("K. Likhith Kumar"), "Certificate page displays student name");
      assert(certHtml.includes(testRoll), "Certificate page displays roll number");
      assert(certHtml.includes("Certificate of Participation"), "Certificate page has official heading");
      assert(certHtml.includes("linear-gradient"), "Certificate page contains gradient styling");
    } catch (e) {
      assert(false, `Certificate view failed: ${e.message}`);
    }
  }

  // 8. TEST MANUAL EDIT / OVERRIDE (PATCH)
  console.log("\n--- 8. Testing Manual Edit / Override (PATCH) ---");
  if (studentProfileId) {
    try {
      const editRes = await fetch(`${baseUrl}/api/admin/certificate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({
          participantId: studentProfileId,
          overrides: {
            fullName: "K. Likhith Kumar (Corrected)",
            rollNumber: `${testRoll}-REV`,
            branch: "CSE (AI & ML)",
            year: "4th Year",
          },
          issueCert: true,
        }),
      });
      assert(editRes.status === 200, "Certificate PATCH edit API returns 200 OK");
      const editData = await editRes.json();
      assert(editData.success === true, "Edit operation marked success");
      assert(editData.profile.fullName === "K. Likhith Kumar (Corrected)", "Profile name was updated");
      assert(editData.certificate?.participantName === "K. Likhith Kumar (Corrected)", "Certificate reflects corrected name");
    } catch (e) {
      assert(false, `Certificate edit PATCH failed: ${e.message}`);
    }
  }

  // 9. TEST MANUAL WALK-IN ENTRY (PUT)
  console.log("\n--- 9. Testing Manual Walk-in Entry (PUT) ---");
  const walkinRoll = `WALK-IN-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const putRes = await fetch(`${baseUrl}/api/admin/certificate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        fullName: "Rahul Varma Walkin",
        rollNumber: walkinRoll,
        branch: "ECE",
        year: "2nd Year",
        email: `walkin.${Date.now()}@gmail.com`,
      }),
    });
    assert(putRes.status === 200, "Manual walk-in PUT API returns 200 OK");
    const putData = await putRes.json();
    assert(putData.success === true, "Manual entry succeeded");
    assert(putData.certificate?.rollNumber === walkinRoll, "Manual walk-in certificate created with correct roll number");
  } catch (e) {
    assert(false, `Manual walk-in PUT failed: ${e.message}`);
  }

  // SUMMARY
  console.log("\n==================================================");
  console.log(`AUDIT FINISHED: ${results.passed.length} PASSED, ${results.failed.length} FAILED, ${results.warnings.length} WARNINGS`);
  console.log("==================================================");

  if (results.failed.length > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});
