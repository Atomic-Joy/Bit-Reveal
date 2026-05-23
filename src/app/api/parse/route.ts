import parseTorrent from "parse-torrent"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()

    const parsed: any = await parseTorrent(
      Buffer.from(arrayBuffer)
    )

    // Normalize announce to a flat list of strings
    let announceUrls: string[] = []
    if (parsed.announce) {
      if (Array.isArray(parsed.announce)) {
        announceUrls = parsed.announce.map((url: any) => typeof url === "string" ? url : String(url))
      }
    }

    return NextResponse.json({
      name: parsed.name || "Unknown",
      size: parsed.length || 0,
      infoHash: parsed.infoHash || "",
      created: parsed.created?.toString(),
      createdBy: parsed.createdBy || "",
      comment: parsed.comment,
      pieceLength: parsed.pieceLength || 0,
      announce: announceUrls,

      files:
        parsed.files?.map((file: any) => ({
          name: file.name,
          path: file.path,
          length: file.length,
        })) || [],
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to parse torrent" },
      { status: 500 }
    )
  }
}