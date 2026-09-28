import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, projectName, problemStatement, projectDescription, technologiesUsed, githubUrl, liveDemoUrl, presentationUrl, status } = body;

    const effectiveUserId = userId || "usr_demo_1";

    if (!projectName || projectName.trim().length < 2) {
      return NextResponse.json({ error: "Project name is required." }, { status: 400 });
    }

    if (!problemStatement || problemStatement.trim().length < 10) {
      return NextResponse.json({ error: "Please enter a descriptive problem statement (minimum 10 characters)." }, { status: 400 });
    }

    const techArray = Array.isArray(technologiesUsed)
      ? technologiesUsed
      : typeof technologiesUsed === "string"
      ? technologiesUsed.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const result = dbService.saveSubmission(effectiveUserId, {
      projectName: projectName.trim(),
      problemStatement: problemStatement.trim(),
      projectDescription: projectDescription ? projectDescription.trim() : "",
      technologiesUsed: techArray,
      githubUrl: githubUrl?.trim() || undefined,
      liveDemoUrl: liveDemoUrl?.trim() || undefined,
      presentationUrl: presentationUrl?.trim() || undefined,
      status: status === "submitted" ? "submitted" : "draft",
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, submission: result.submission });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
