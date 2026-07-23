import { NextRequest, NextResponse } from "next/server";
import path from "path";
import prisma from "@/lib/db";
import { requireAdmin, logApiResponse } from "@/lib/middleware";
import {
  uploadFileToStorage,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/storage";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const authResult = requireAdmin(req);
  if ("error" in authResult) {
    logApiResponse(req, 403, startTime);
    return authResult.error;
  }

  try {
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("image")) as File | null;
    const bucket = (formData.get("bucket") as string) || "products";

    if (!file) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const mimeType = file.type || "image/jpeg";
    const isDocument = bucket === "documents" || mimeType === "application/pdf";

    // Reject executable / script files
    const forbiddenExts = [".exe", ".bat", ".sh", ".php", ".js", ".html", ".py", ".pl"];
    if (forbiddenExts.includes(ext)) {
      logApiResponse(req, 400, startTime);
      return NextResponse.json({ message: "Executable and script files are strictly forbidden." }, { status: 400 });
    }

    // Validate MIME types & size limits
    if (isDocument) {
      if (!ALLOWED_DOCUMENT_TYPES.includes(mimeType) && ext !== ".pdf") {
        logApiResponse(req, 400, startTime);
        return NextResponse.json({ message: "Invalid document type. Only PDF documents are allowed." }, { status: 400 });
      }
      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        logApiResponse(req, 400, startTime);
        return NextResponse.json({ message: "Document size too large. Maximum 20MB allowed." }, { status: 400 });
      }
    } else {
      if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        logApiResponse(req, 400, startTime);
        return NextResponse.json(
          { message: "Invalid file type. Only JPG, PNG, WEBP, GIF, AVIF, and SVG images are allowed." },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        logApiResponse(req, 400, startTime);
        return NextResponse.json({ message: "Image size too large. Maximum 10MB allowed." }, { status: 400 });
      }
    }

    // Prepare clean unique filename
    const cleanBaseName = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const uniqueFileName = `${cleanBaseName}_${Date.now()}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage Bucket
    const { storageKey, publicUrl } = await uploadFileToStorage({
      fileBuffer,
      fileName: uniqueFileName,
      contentType: mimeType,
      bucket,
    });

    // Create Prisma Media record
    const media = await prisma.media.create({
      data: {
        url: publicUrl,
        storageKey: storageKey,
        fileName: file.name,
        mimeType: mimeType,
        fileSize: file.size,
        type: isDocument ? "DOCUMENT" : "IMAGE",
      },
    });

    logApiResponse(req, 201, startTime);
    return NextResponse.json(
      {
        message: "File uploaded successfully to Supabase Storage",
        url: publicUrl,
        media,
      },
      { status: 201 }
    );
  } catch (err) {
    const { logError } = await import("@/lib/logger");
    logError("admin/upload/POST", err);
    logApiResponse(req, 500, startTime);
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
  }
}
