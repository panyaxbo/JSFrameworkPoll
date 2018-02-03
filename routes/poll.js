const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pusher = require('pusher');
const Vote = require('../models/vote');
var pusher = new Pusher({
  appId: '468489',
  key: '3d765e9a6c14a9de88ee',
  secret: '3474f2800094a71af7fb',
  cluster: 'ap1',
  encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({
        success: true, votes: votes
    }));
});

router.post('/', (req, res) => {
    const newVote = {
        
        frontend: req.body.frontend,
        points:1
    }

    new Vote(newVote).save().then(vote => {
        console.log('vote', vote)
        pusher.trigger('front-end-poll', 'front-end-vote', {
            points: parseInt(vote.points),
            frontend: vote.frontend
        });
        return res.json({success: true, message: 'Thank you for voting'});
    });


    
})

module.exports = router;