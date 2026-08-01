import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Dynamic File Serving Route for uploaded files in Next.js production
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const fileName = pathSegments.join("/");
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(fileName).toLowerCase();

    let mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".webp") mimeType = "image/webp";
    else if (ext === ".gif") mimeType = "image/gif";
    else if (ext === ".svg") mimeType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Uploads serve error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
