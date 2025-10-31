import { prisma } from "@/lib/prisma";
import slugify from "slugify";

function makeBaseSlug(title) {
  return slugify(title, { lower: true, strict: true, trim: true });
}

export async function POST(req) {
  try {
    // Next.js Request has .json()
    const data = await req.json();
    const { title, description, body, tags } = data;

    if (!title) {
      return new Response(
        JSON.stringify({ message: "Title is required" }),
        { status: 400 }
      );
    }

    const slug = makeBaseSlug(title);
    const exists = await prisma.article.findUnique({ where: { slug } });

    if (exists) {
      return new Response(
        JSON.stringify({
          message:
            "An article with this title already exists. Please change the title.",
        }),
        { status: 409 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        description: description ?? "",
        body: body ?? "",
        slug,
        // if tags can be undefined/null, normalize
        tags: Array.isArray(tags) ? tags : [],
      },
    });

    return new Response(JSON.stringify(article), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        message: "Failed to save article",
        detail: err?.message ?? "Unknown error",
      }),
      { status: 500 }
    );
  }
}
