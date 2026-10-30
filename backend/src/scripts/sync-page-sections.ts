import { prisma } from "../config/prisma";
import {
  getDefaultHomePageSections,
  getDefaultAboutPageSections,
  getDefaultServicesPageSections,
  getDefaultContactPageSections,
} from "../modules/page/page.service";
import { PageStatus } from "@prisma/client";

async function syncPages() {
  console.log("Starting page sections sync...");

  const pagesToSync = [
    {
      slug: "home",
      title: "Home Page",
      sections: getDefaultHomePageSections(),
    },
    {
      slug: "about",
      title: "About Us Page",
      sections: getDefaultAboutPageSections(),
    },
    {
      slug: "services",
      title: "Special E-Sheba & Services Page",
      sections: getDefaultServicesPageSections(),
    },
    {
      slug: "contact",
      title: "Contact Us Page",
      sections: getDefaultContactPageSections(),
    },
  ];

  for (const page of pagesToSync) {
    console.log(`Syncing page: ${page.slug}...`);

    // Check existing published
    const published = await prisma.pageVersion.findFirst({
      where: { slug: page.slug, status: PageStatus.PUBLISHED },
      orderBy: { version: "desc" },
    });

    if (published) {
      console.log(`Updating existing published version for ${page.slug}...`);
      await prisma.pageVersion.update({
        where: { id: published.id },
        data: {
          sections: page.sections as any,
          title: page.title,
          updatedAt: new Date(),
        },
      });
    } else {
      console.log(`Creating initial published version for ${page.slug}...`);
      await prisma.pageVersion.create({
        data: {
          slug: page.slug,
          title: page.title,
          status: PageStatus.PUBLISHED,
          version: 1,
          sections: page.sections as any,
          publishedAt: new Date(),
          metadata: {
            title: `SHOILPIKKABBO | ${page.title}`,
            description: "Authentic Bangladeshi craftsmanship and solutions.",
          },
        },
      });
    }

    // Check existing draft
    const draft = await prisma.pageVersion.findFirst({
      where: { slug: page.slug, status: PageStatus.DRAFT },
      orderBy: { updatedAt: "desc" },
    });

    if (draft) {
      console.log(`Updating existing draft for ${page.slug}...`);
      await prisma.pageVersion.update({
        where: { id: draft.id },
        data: {
          sections: page.sections as any,
          title: page.title,
          updatedAt: new Date(),
        },
      });
    } else {
      console.log(`Creating initial draft for ${page.slug}...`);
      await prisma.pageVersion.create({
        data: {
          slug: page.slug,
          title: page.title,
          status: PageStatus.DRAFT,
          version: (published?.version || 1) + 1,
          sections: page.sections as any,
          metadata: {
            title: `SHOILPIKKABBO | ${page.title}`,
            description: "Authentic Bangladeshi craftsmanship and solutions.",
          },
        },
      });
    }
  }

  console.log("Page sections sync completed successfully!");
}

syncPages()
  .catch((e) => {
    console.error("Error syncing pages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
