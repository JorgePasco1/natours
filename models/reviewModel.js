const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  // Schema definition
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Limit one review from a user per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // May take a while to work

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this. points tot he model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // for each
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0, // If we have no reviews left
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
  });
};

// CALCULATING REVIEW AVG
// Needs to be post, because all the reviews all already saved
reviewSchema.post('save', function () {
  // this. points to curent review
  // Review.calcAverageRatings(this.tour);
  this.constructor.calcAverageRatings(this.tour);
});

// When Updating
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this. is current query (not doc)
  // We cannot use post, because the doc would already be saved and we wouldn't have access to it
  this.r = await this.findOne(); // we can execute the query, and that will give the doc that is being processed. Save the doc to the query
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
