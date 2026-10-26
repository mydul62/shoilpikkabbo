import { prisma } from "../../config/prisma";

export class SettingsService {
  static async getAll() {
    const settings = await prisma.siteSetting.findMany();
    // Return key-value object map
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  }

  static async updateSettings(data: Record<string, string>) {
    const promises = Object.entries(data).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    await Promise.all(promises);
    return this.getAll();
  }
}
