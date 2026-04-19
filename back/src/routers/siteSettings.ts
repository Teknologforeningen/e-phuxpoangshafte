import { userExtractor } from '../utils.ts/middleware';
import SiteSettings from '../db/models/models/siteSettings.model';
import { userRole } from '../types';

const siteSettingsRouter = require('express').Router();

siteSettingsRouter.get('/', async (_req, res) => {
  const settings = await SiteSettings.findOne();
  if (!settings) {
    return res.status(404).json({ error: 'Site settings not found' });
  }
  res.json(settings);
});

siteSettingsRouter.put('/', userExtractor, async (req, res) => {
  const authUser = req.user;
  if (authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }

  const settings = await SiteSettings.findOne();
  if (!settings) {
    return res.status(404).json({ error: 'Site settings not found' });
  }

  const { totalMinPoints } = req.body;
  if (totalMinPoints !== undefined) {
    if (
      typeof totalMinPoints !== 'number' ||
      !Number.isInteger(totalMinPoints) ||
      totalMinPoints < 0
    ) {
      return res
        .status(400)
        .json({ error: 'totalMinPoints must be a non-negative integer' });
    }
    settings.totalMinPoints = totalMinPoints;
  }

  const updated = await settings.save();
  res.json(updated);
});

export default siteSettingsRouter;
