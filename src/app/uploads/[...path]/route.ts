import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Dynamic Uploads Proxy Route Handler
// Serves local uploaded files if present, or proxies directly from live VPS domain (https://shreesaicreation.com/uploads/...)
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

    // 1. Check local public/uploads directory first
    const localFilePath = path.join(process.cwd(), "public", "uploads", fileName);
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = fs.readFileSync(localFilePath);
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

    // 2. Proxy from live production VPS domain if local file doesn't exist
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

    return new NextResponse("Image Not Found", { status: 404 });
  } catch (err) {
    console.error("Error serving uploaded photo:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
