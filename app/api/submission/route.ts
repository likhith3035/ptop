import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { syncSubmissionToRtdb } from "@/lib/firebase/rtdb";

export async function GET() {
  const eventConfig = dbService.getEventConfig();
  return NextResponse.json({
    isSubmissionOpen: Boolean(eventConfig.isSubmissionOpen),
    submissions: dbService.getSubmissions(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, projectName, problemStatement, projectDescription, technologiesUsed, githubUrl, liveDemoUrl, presentationUrl, status } = body;

    const eventConfig = dbService.getEventConfig();
    if (!eventConfig.isSubmissionOpen && status === "submitted") {
      return NextResponse.json(
        { error: "Project submissions are currently locked by the event administrator. Submissions will open during the afternoon Build Challenge sprint." },
        { status: 403 }
      );
    }

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

    if (result.submission) {
      syncSubmissionToRtdb(result.submission);
    }

    return NextResponse.json({ success: true, submission: result.submission });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, score, feedback } = body;

    if (!submissionId) {
      return NextResponse.json({ error: "submissionId is required." }, { status: 400 });
    }

    const result = dbService.evaluateSubmission(submissionId, Number(score), feedback);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.submission) {
      syncSubmissionToRtdb(result.submission);
    }

    return NextResponse.json({
      success: true,
      submission: result.submission,
      submissions: dbService.getSubmissions(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
