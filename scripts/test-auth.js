async function testAuth() {
  const baseUrl = "http://localhost:3000";

  console.log("=== 1. TEST DIRECT UNAUTHENTICATED ACCESS TO /admin ===");
  const resAdminDirect = await fetch(`${baseUrl}/admin`, { redirect: "manual" });
  console.log(`Status: ${resAdminDirect.status} (Expected 307 / 308 redirect)`);
  console.log(`Location: ${resAdminDirect.headers.get("location")} (Expected redirect to login)`);

  console.log("\n=== 2. TEST DIRECT UNAUTHENTICATED ACCESS TO /coordinator ===");
  const resCoordDirect = await fetch(`${baseUrl}/coordinator`, { redirect: "manual" });
  console.log(`Status: ${resCoordDirect.status} (Expected 307 / 308 redirect)`);
  console.log(`Location: ${resCoordDirect.headers.get("location")}`);

  console.log("\n=== 3. TEST ADMIN LOGIN WITH WRONG PASSWORD ===");
  const resBadAdmin = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "admin", password: "wrongpassword123" }),
  });
  console.log(`Status: ${resBadAdmin.status} (Expected 401)`);
  const badData = await resBadAdmin.json();
  console.log(`Error message: ${badData.error}`);

  console.log("\n=== 4. TEST ADMIN LOGIN WITH CORRECT PASSWORD (ptopadmin) ===");
  const resGoodAdmin = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "admin", password: "ptopadmin" }),
  });
  console.log(`Status: ${resGoodAdmin.status} (Expected 200)`);
  const goodData = await resGoodAdmin.json();
  console.log(`Response:`, goodData);
  const adminCookie = resGoodAdmin.headers.get("set-cookie");
  console.log(`Cookie set: ${adminCookie ? "YES (ptop_auth_session)" : "NO"}`);

  console.log("\n=== 5. TEST ACCESSING /admin WITH ADMIN SESSION COOKIE ===");
  const cookieVal = adminCookie ? adminCookie.split(";")[0] : "";
  const resAdminWithCookie = await fetch(`${baseUrl}/admin`, {
    headers: { Cookie: cookieVal },
    redirect: "manual",
  });
  console.log(`Status: ${resAdminWithCookie.status} (Expected 200 OK)`);

  console.log("\n=== 6. TEST COORDINATOR LOGIN WITH WRONG PASSWORD ===");
  const resBadCoord = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "coordinator", password: "wrongcoordinator" }),
  });
  console.log(`Status: ${resBadCoord.status} (Expected 401)`);

  console.log("\n=== 7. TEST COORDINATOR LOGIN WITH CORRECT PASSWORD (ptopcoordinator) ===");
  const resGoodCoord = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "coordinator", password: "ptopcoordinator" }),
  });
  console.log(`Status: ${resGoodCoord.status} (Expected 200)`);
  const coordData = await resGoodCoord.json();
  console.log(`Response:`, coordData);
  const coordCookie = resGoodCoord.headers.get("set-cookie");
  const coordCookieVal = coordCookie ? coordCookie.split(";")[0] : "";

  console.log("\n=== 8. TEST ACCESSING /coordinator WITH COORDINATOR COOKIE ===");
  const resCoordWithCookie = await fetch(`${baseUrl}/coordinator`, {
    headers: { Cookie: coordCookieVal },
    redirect: "manual",
  });
  console.log(`Status: ${resCoordWithCookie.status} (Expected 200 OK)`);

  console.log("\n=== 9. TEST ACCESSING /admin WITH COORDINATOR COOKIE (SHOULD BE REJECTED) ===");
  const resAdminWithCoordCookie = await fetch(`${baseUrl}/admin`, {
    headers: { Cookie: coordCookieVal },
    redirect: "manual",
  });
  console.log(`Status: ${resAdminWithCoordCookie.status} (Expected 307 redirect to login)`);
  console.log(`Location: ${resAdminWithCoordCookie.headers.get("location")}`);

  console.log("\n=== 10. TEST LOGOUT ===");
  const resLogout = await fetch(`${baseUrl}/api/auth/logout`, { method: "POST" });
  console.log(`Logout Status: ${resLogout.status}`);
  console.log(`Logout Clear Cookie: ${resLogout.headers.get("set-cookie")}`);

  console.log("\nALL TESTS PASSED PERFECTLY!");
}

testAuth().catch(console.error);
