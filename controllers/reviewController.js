const Review = require('../models/reviewModel');

const factory = require('../utils/handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId; // Coming from the tour nested route
  if (!req.body.user) req.body.user = req.user.id; // req.user comes from the protect middleware
  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
