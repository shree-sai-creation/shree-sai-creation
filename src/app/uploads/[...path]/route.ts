import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Dynamic Uploads Route Handler
// Serves uploaded files directly from disk (checking all production & VPS paths)
// On local dev, falls back to fetching from live VPS domain.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams?.path || [];
    const fileName = pathSegments.join("/");

    if (!fileName) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    // 1. Check all potential disk locations (VPS & local production)
    const possiblePaths = [
      path.join(process.cwd(), "public", "uploads", fileName),
      path.join("/root/shreesai/public/uploads", fileName),
      path.join(process.cwd(), "..", "public", "uploads", fileName),
    ];

    for (const targetPath of possiblePaths) {
      if (fs.existsSync(targetPath)) {
        const fileBuffer = fs.readFileSync(targetPath);
        const ext = path.extname(fileName).toLowerCase();
        let contentType = "image/jpeg";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".svg") contentType = "image/svg+xml";

        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // 2. Only proxy from live production VPS domain when running locally in development
    if (process.env.NODE_ENV !== "production") {
      const vpsImageUrl = `https://shreesaicreation.com/uploads/${fileName}`;
      const vpsRes = await fetch(vpsImageUrl, { cache: "force-cache" });

      if (vpsRes.ok) {
        const arrayBuffer = await vpsRes.arrayBuffer();
        const contentType = vpsRes.headers.get("content-type") || "image/jpeg";

        return new NextResponse(arrayBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    }

    return new NextResponse("Image Not Found", { status: 404 });
  } catch (err) {
    console.error("Error serving uploaded photo:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
