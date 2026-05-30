import asyncHandler from 'express-async-handler';
import Candidate from '../models/Candidate.js';

/* ─────────────────────────────────────────────────────────────
   GET /api/candidates
   Retrieve all recruitment pipeline candidates
   ───────────────────────────────────────────────────────────── */
export const getCandidates = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find().sort({ createdAt: -1 });
  res.json({ success: true, candidates });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/candidates
   Add a candidate
   ───────────────────────────────────────────────────────────── */
export const createCandidate = asyncHandler(async (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    res.status(400);
    throw new Error('Name and role are required');
  }

  const candidate = await Candidate.create({
    name,
    role,
    status: 'Applied',
    date: 'Just now'
  });

  res.status(201).json({ success: true, candidate });
});

/* ─────────────────────────────────────────────────────────────
   PATCH /api/candidates/:id/status
   Update candidate progress status (Applied, Interviewing, Offered, Hired, Rejected)
   ───────────────────────────────────────────────────────────── */
export const updateCandidateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    res.status(400);
    throw new Error('Status is required');
  }

  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    res.status(404);
    throw new Error('Candidate not found');
  }

  candidate.status = status;
  await candidate.save();

  res.json({ success: true, candidate });
});
