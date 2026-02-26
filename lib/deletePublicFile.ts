import fs from "fs/promises";
import path from "path";

export async function deletePublicFile(iconUrl?: string | null) {
  if (!iconUrl) return;

  try {
    const filePath = path.join(process.cwd(), "public", iconUrl);
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.error("Błąd usuwania pliku:", err);
    }
  }
}
