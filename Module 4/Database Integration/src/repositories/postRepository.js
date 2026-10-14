const prisma = require('../db/prisma');

// Keep the legacy API record shape stable; timestamps remain database-managed.
function toPostRecord(post) {
  if (!post) return null;
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    authorId: post.authorId,
  };
}

function translateConstraintError(error) {
  if (error && (error.code === 'P2002' || error.code === 'P2003' || error.code === 'P2014')) {
    const conflict = new Error(
      error.code === 'P2002'
        ? 'A record with that unique value already exists'
        : 'The referenced record does not exist or is still in use'
    );
    conflict.statusCode = 409;
    return conflict;
  }
  return error;
}

async function findAll() {
  const posts = await prisma.post.findMany({ orderBy: { id: 'asc' } });
  return posts.map(toPostRecord);
}

async function findById(id) {
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  return toPostRecord(post);
}

async function create(fields) {
  try {
    const post = await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId == null ? null : Number(fields.authorId),
      },
    });
    return toPostRecord(post);
  } catch (error) {
    throw translateConstraintError(error);
  }
}

async function update(id, patch) {
  const numericId = Number(id);
  const data = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.body !== undefined) data.body = patch.body;

  const result = await prisma.post.updateMany({
    where: { id: numericId },
    data,
  });
  if (result.count === 0) return null;
  return toPostRecord(await prisma.post.findUnique({ where: { id: numericId } }));
}

async function remove(id) {
  const result = await prisma.post.deleteMany({ where: { id: Number(id) } });
  return result.count > 0;
}

module.exports = { findAll, findById, create, update, remove };
