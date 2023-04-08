import express from 'express'
import { body } from 'express-validator'
import GigsSchema from '../models/Gigs.js'

const router = express.Router()

router.post(
  '/register/gigs',
  body('user_id').not().isEmpty().withMessage('User ID is required'),
  body('title').not().isEmpty().withMessage('Title is required'),
  body('description').not().isEmpty().withMessage('Description is required'),
  body('location').not().isEmpty().withMessage('Description is required'),
  body('prize').not().isEmpty().withMessage('Prize is required'),
  body('submission_type')
    .not()
    .isEmpty()
    .withMessage('Submission Type is required'),
  body('Status').not().isEmpty().withMessage('Status is required'),
  async (req, res) => {
    const {
      user_id,
      title,
      description,
      location,
      prize,
      submission_type,
      status,
    } = req.body
    try {
      await GigsSchema.create({
        user_id,
        title,
        description,
        location,
        prize,
        submission_type,
        status,
      })
      res.send('Successfully Registered')
    } catch (error) {
      console.log(error)
      res.status(400).send(error.message)
    }
  },
)

router.get('/gigs/:user_id', async (req, res) => {
  const { user_id } = req.params
  try {
    const gigs_response = await GigsSchema.aggregate([
      {
        $match: {
          user_id,
        },
      },
      {
        $addFields: {
          user_id: {
            $toObjectId: '$user_id',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user__id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ])
    res.send(gigs_response)
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

export default router