import express from 'express';
import { Events } from 'pg';

const categoryRouter = require('express').Router()
import Category from '../db/models/models/category.model';

import { Category as CategoryType } from '../types'


categoryRouter.get('/', async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories)
})

categoryRouter.post('/', async (req, res) => {
  const body = req.body
  const categoryToAdd: Omit<CategoryType, 'id'> = {
    name: body.name,
    description: body.description,
    minPoints: body.minPoints,
  }
  const user: Category = await Category.create(categoryToAdd)
  res.json(user)
})

categoryRouter.put('/:id', async (req, res) => {
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