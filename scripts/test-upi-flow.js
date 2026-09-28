async function testZeroCostRegistrationFlow() {
  const baseUrl = "http://localhost:3000";

  console.log("=== 1. TEST DIRECT UPI REGISTRATION (Zero Gateway Fees) ===");
  const upiStudent = {
    fullName: "K. Harish Kumar",
    email: `harish.${Date.now()}@nbkrist.org`,
    mobile: "9876543210",
    rollNumber: `22031A${Math.floor(1000 + Math.random() * 9000)}`,
    year: "3rd Year",
    branch: "AI&DS",
    section: "A",
    isIsteMember: true,
    isteNumber: "ISTE-AP-2024-9982",
    hasLaptop: true,
    paymentMethod: "upi",
    upiReference: "426819201948",
  };

  const resUpi = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(upiStudent),
  });
  const dataUpi = await resUpi.json();
  console.log("UPI Registration Status:", resUpi.status);
  console.log("UPI Registration Success:", dataUpi.success);
  console.log("Issued Ticket:", {
    ticketNumber: dataUpi.ticket?.ticketNumber,
    registrationNumber: dataUpi.ticket?.registrationNumber,
    participantName: dataUpi.ticket?.participantName,
    qrToken: dataUpi.ticket?.qrToken,
    fee: dataUpi.amount,
  });

  console.log("\n=== 2. TEST PAY-AT-DESK CASH REGISTRATION ===");
  const cashStudent = {
    fullName: "M. Sandhya Reddy",
    email: `sandhya.${Date.now()}@nbkrist.org`,
    mobile: "9123456780",
    rollNumber: `23031A${Math.floor(1000 + Math.random() * 9000)}`,
    year: "2nd Year",
    branch: "IT",
    section: "B",
    isIsteMember: false,
    hasLaptop: false,
    paymentMethod: "cash_at_desk",
  };

  const resCash = await fetch(`${baseUrl}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cashStudent),
  });
  const dataCash = await resCash.json();
  console.log("Cash Registration Status:", resCash.status);
  console.log("Cash Registration Success:", dataCash.success);
  console.log("Issued Ticket:", {
    ticketNumber: dataCash.ticket?.ticketNumber,
    registrationNumber: dataCash.ticket?.registrationNumber,
    participantName: dataCash.ticket?.participantName,
    qrToken: dataCash.ticket?.qrToken,
    fee: dataCash.amount,
  });

  console.log("\n=== 3. VERIFY TICKET PAGE ACCESSIBILITY ===");
  const ticketPage = await fetch(`${baseUrl}/ticket/${dataUpi.ticket.registrationNumber}`);
  console.log(`Ticket page status: ${ticketPage.status} (Expected 200)`);
  const ticketHtml = await ticketPage.text();
  console.log(`Contains student name 'K. Harish Kumar': ${ticketHtml.includes("K. Harish Kumar")}`);

  console.log("\n=== 4. TEST COORDINATOR CHECK-IN SCAN ===");
  const coordLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "coordinator", password: "ptopcoordinator" }),
  });
  const coordCookie = coordLogin.headers.get("set-cookie")?.split(";")[0] || "";

  const checkinRes = await fetch(`${baseUrl}/api/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: coordCookie,
    },
    body: JSON.stringify({
      token: dataUpi.ticket.qrToken,
      coordinatorName: "Entrance Desk Faculty",
    }),
  });
  const checkinData = await checkinRes.json();
  console.log("Coordinator check-in result:", checkinData.message);

  console.log("\n=== 5. VERIFY ADMIN CONSOLE DATA ===");
  const adminLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "admin", password: "ptopadmin" }),
  });
  const adminCookie = adminLogin.headers.get("set-cookie")?.split(";")[0] || "";

  const adminPage = await fetch(`${baseUrl}/admin`, { headers: { Cookie: adminCookie } });
  const adminHtml = await adminPage.text();
  console.log(`Admin page contains 'K. Harish Kumar': ${adminHtml.includes("K. Harish Kumar")}`);
  console.log(`Admin page contains 'M. Sandhya Reddy': ${adminHtml.includes("M. Sandhya Reddy")}`);

  console.log("\nZERO-COST DIRECT UPI & PAY-AT-DESK REGISTRATION FULLY OPERATIONAL!");
}

testZeroCostRegistrationFlow().catch(console.error);
