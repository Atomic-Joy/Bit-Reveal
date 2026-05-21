export function getFileType(filename: string) {
  const extension =
    filename.split(".").pop()?.toLowerCase() || ""

  const videoExtensions = [
    "mp4",
    "mkv",
    "avi",
    "mov",
    "wmv",
  ]

  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
  ]

  const archiveExtensions = [
    "zip",
    "rar",
    "7z",
    "tar",
    "gz",
  ]

  const executableExtensions = [
    "exe",
    "bat",
    "msi",
  ]

  const audioExtensions = [
    "mp3",
    "wav",
    "flac",
  ]

  if (videoExtensions.includes(extension))
    return "video"

  if (imageExtensions.includes(extension))
    return "image"

  if (archiveExtensions.includes(extension))
    return "archive"

  if (executableExtensions.includes(extension))
    return "executable"

  if (audioExtensions.includes(extension))
    return "audio"

  return "other"
}