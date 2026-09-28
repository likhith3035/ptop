import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      mobile,
      rollNumber,
      year,
      branch,
      section,
      isIsteMember,
      isteNumber,
      hasLaptop,
      linkedinUrl,
      paymentMethod,
      upiReference,
    } = body;

    // Field-level server validations
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name for the certificate." }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile.replace(/\s+/g, ""))) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    if (!rollNumber || typeof rollNumber !== "string" || rollNumber.trim().length < 5) {
      return NextResponse.json({ error: "Please enter a valid college Roll Number." }, { status: 400 });
    }

    if (!["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(year)) {
      return NextResponse.json({ error: "Please select a valid academic year." }, { status: 400 });
    }

    if (!["IT", "AI&DS", "CSE", "ECE", "EEE", "MECH", "CIVIL", "OTHER"].includes(branch)) {
      return NextResponse.json({ error: "Please select a valid engineering branch." }, { status: 400 });
    }

    if (!section || section.trim().length === 0) {
      return NextResponse.json({ error: "Please specify your section (e.g. A, B, C)." }, { status: 400 });
    }

    if (isIsteMember && (!isteNumber || isteNumber.trim().length < 3)) {
      return NextResponse.json({ error: "ISTE Student Membership Number is required to claim the ₹50 concession." }, { status: 400 });
    }

    if (linkedinUrl && linkedinUrl.trim() !== "") {
      try {
        new URL(linkedinUrl);
      } catch {
        return NextResponse.json({ error: "LinkedIn or Portfolio URL must be a valid web URL." }, { status: 400 });
      }
    }

    const selectedPaymentMethod = paymentMethod === "cash_at_desk" ? "cash_at_desk" : "upi";

    if (selectedPaymentMethod === "upi" && (!upiReference || upiReference.trim().length < 6)) {
      return NextResponse.json({ error: "Please provide your 12-digit UPI Transaction / UTR Number." }, { status: 400 });
    }

    // Call server database service
    const result = await dbService.createRegistration({
      fullName,
      email,
      mobile,
      rollNumber,
      year,
      branch,
      section,
      isIsteMember: Boolean(isIsteMember),
      isteNumber,
      hasLaptop: Boolean(hasLaptop),
      linkedinUrl,
      paymentMethod: selectedPaymentMethod,
      upiReference: upiReference?.trim(),
    });

    if (!result.success || !result.registration || !result.ticket) {
      return NextResponse.json({ error: result.error || "Registration failed." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      registration: result.registration,
      profile: result.profile,
      ticket: result.ticket,
      amount: result.amount,
      currency: "INR",
      message: "Registration completed successfully! Your official Digital QR Pass is ready.",
    });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
