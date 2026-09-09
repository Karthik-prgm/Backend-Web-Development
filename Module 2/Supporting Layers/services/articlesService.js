/**
 * Articles service — STARTER.
 *
 * PROBLEMS:
 *   - AppError is DEFINED here (and again in middleware/errorHandler.js). It should
 *     live once in utils/AppError.js and be imported in both places.
 */

const repo = require('./../repository/articlesRepo');
const { maxArticles } = require('../config');

// DUPLICATED definition — should move to utils/AppError.js
const AppError = require('./../utils/AppError');

exports.getAll = async () => repo.findAll();

exports.create = async ({ title, body }) => {
  const count = await repo.count();
  if (count >= maxArticles) {
    throw new AppError('Article limit reached', 403);
  }
  return repo.insert({ title, body });
};

exports.update = async (id, data) => {
  const article = await repo.findById(id);
  if (!article) throw new AppError('Article not found', 404);
  return repo.update(id, data);
};
