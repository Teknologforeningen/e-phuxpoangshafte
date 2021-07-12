import express from 'express';
import { Events } from 'pg';
import { userExtractor } from '../utils.ts/middleware';

const categoryRouter = require('express').Router()
import Category from '../db/models/models/category.model';

import { Category as CategoryType } from '../types'


categoryRouter.get('/', async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories)
})

categoryRouter.post('/', userExtractor, async (req, res) => {
  const authUser = req.user
  if(authUser.role !== "admin"){
    return res.status(401).json({error: 'You are not authorized for this page'})
  }
  const body = req.body
  const categoryToAdd: Omit<CategoryType, 'id'> = {
    name: body.name,
    description: body.description,
    minPoints: body.minPoints,
  }
  const user: Category = await Category.create(categoryToAdd)
  res.json(user)
})

categoryRouter.put('/:id', userExtractor, async (req, res) => {
  const authUser = req.user
  if(authUser.role !== "admin"){
    return res.status(401).json({error: 'You are not authorized for this page'})
  }
  const categoryId = req.params.id
  const body = req.body
  const categoryToUpdate = await Category.findByPk(categoryId)
  const categoryUpdated = {
    id: categoryToUpdate.id,
    name: body.name,
    description: body.description,
    minPoints: body.minPoints,
  }
})

export default categoryRouter