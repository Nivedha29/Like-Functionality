import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

function toTagList(input) {
  if (Array.isArray(input)) {
    return [
      ...new Set(
        input
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    ];
  }
  if (typeof input === 'string') {
    return [
      ...new Set(
        input
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    ];
  }
  return [];
}

function baseSlug(title) {
  return slugify(title || 'article', { lower: true, strict: true, trim: true }) || 'article';
}

async function uniqueSlug(base) {
  let slug = base;
  let i = 1;
  // assumes a UNIQUE index on Article.slug
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { title, description, body } = data;

    if (!title || !title.trim()) {
      return new Response(JSON.stringify({ message: 'Title is required' }), { status: 400 });
    }

    // 1) normalize tags (accept both 'tags' and 'tagList')
    const tagList = toTagList(data.tagList ?? data.tags);

    // 2) make a unique slug
    const slug = await uniqueSlug(baseSlug(title));

    // NOTE: If you're on SQLite, store tags as Json in Prisma schema:
    // model Article { id Int @id @default(autoincrement()) slug String @unique title String description String body String tags Json? ... }
    const article = await prisma.article.create({
      data: {
        title,
        description: description ?? '',
        body: body ?? '',
        slug,
        tags: tagList, // Json array in SQLite, or String[] if your DB supports it
      },
    });

    return new Response(JSON.stringify(article), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = String(err?.message || err);
    // friendly duplicate fallback (just in case)
    if (msg.includes('Unique') || msg.includes('UNIQUE constraint')) {
      return new Response(JSON.stringify({ message: 'Duplicate slug.' }), { status: 409 });
    }
    console.error(err);
    return new Response(JSON.stringify({ message: 'Failed to save article', detail: msg }), {
      status: 500,
    });
  }
}
