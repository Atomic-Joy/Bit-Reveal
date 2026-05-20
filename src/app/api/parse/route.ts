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

    return NextResponse.json({
      name: parsed.name || "Unknown",
      size: parsed.length || 0,
      infoHash: parsed.infoHash || "",
      created: parsed.created?.toString(),
      comment: parsed.comment,

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