import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth.js';
import { strictLimiter, writeLimiter } from '../middleware/rateLimits.js';
import { validate } from '../utils/validate.js';
import {
  analyzeCareerFit,
  answerSupportQuestion,
  generateBlogDraft,
  recommendLearningPath,
  summarizeApplication
} from '../services/localAi.service.js';

const router = Router();

const learningPathSchema = z.object({
  goal: z.string().trim().min(2).max(300),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  interests: z.union([
    z.array(z.string().trim().min(1).max(50)).max(12),
    z.string().trim().max(300)
  ]).optional()
});

const supportSchema = z.object({
  question: z.string().trim().min(2).max(500)
});

const blogDraftSchema = z.object({
  topic: z.string().trim().min(3).max(180),
  audience: z.string().trim().max(120).optional(),
  tone: z.string().trim().max(80).optional()
});

const applicationSchema = z.object({
  name: z.string().trim().max(120).optional(),
  position: z.string().trim().max(120).optional(),
  portfolioUrl: z.string().trim().max(500).optional().or(z.literal('')),
  portfolio_url: z.string().trim().max(500).optional().or(z.literal('')),
  coverLetter: z.string().trim().max(5000).optional(),
  cover_letter: z.string().trim().max(5000).optional()
});

router.get('/models', (_req, res) => {
  res.json({
    models: [
      { id: 'bluelearner-path-ranker-v1', type: 'recommendation', externalApi: false },
      { id: 'career-fit-scorer-v1', type: 'classification', externalApi: false },
      { id: 'application-summarizer-v1', type: 'summarization', externalApi: false },
      { id: 'blog-planner-v1', type: 'generation', externalApi: false },
      { id: 'support-router-v1', type: 'assistant', externalApi: false }
    ]
  });
});

router.post('/learning-path', strictLimiter, validate(learningPathSchema), (req, res) => {
  res.json({ result: recommendLearningPath(req.validated.body) });
});

router.post('/support', strictLimiter, validate(supportSchema), (req, res) => {
  res.json({ result: answerSupportQuestion(req.validated.body) });
});

router.post('/career-fit', strictLimiter, validate(applicationSchema), (req, res) => {
  res.json({ result: analyzeCareerFit(req.validated.body) });
});

router.post('/blog-draft', authenticate, requireRole('admin'), writeLimiter, validate(blogDraftSchema), (req, res) => {
  res.json({ result: generateBlogDraft(req.validated.body) });
});

router.post('/application-summary', authenticate, requireRole('admin'), writeLimiter, validate(applicationSchema), (req, res) => {
  res.json({ result: summarizeApplication(req.validated.body) });
});

export default router;
