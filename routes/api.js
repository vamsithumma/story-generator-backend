// routes/api.js
require('dotenv').config();
const express = require('express');
const Story = require('../models/Story');

const router = express.Router();
const { Configuration, OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

// Generate story endpoint
router.post('/generate', async (req, res) => {
  const { prompt ,genre,words} = req.body;
  const queryprompt = `generate a ${words} words ${genre} based story for the tag ${prompt}`;
  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: queryprompt,
    max_tokens: 2000,
    temperature: 0,
  });
  
  // Simulate story generation (replace with your AI service)
  const generatedStory = completion.choices[0].text;
  // Save the generated story to the database
  const story = new Story({ prompt, content: generatedStory });
  await story.save();
  //console.log(generatedStory);
  res.json({ story: generatedStory , storyId: story._id});
});


router.post('/extendstory', async (req, res) => {
  const { storyId} = req.body;
  console.log(storyId);
  try {
    const story = await Story.findById(storyId);
    const existingStory = story.content;
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    const queryprompt = `generate a 100 words continuation story for this story ${existingStory}`;
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: queryprompt,
      max_tokens: 3000,
      temperature: 0,
    });
    const newgeneratedStory = completion.choices[0].text;
    await story.extendStory(newgeneratedStory);
    //console.log(newgeneratedStory);
    res.json({ story});

  } catch (error) {
    console.error('Error Finding story:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard endpoint
router.get('/leaderboard', async (req, res) => {
  const topStories = await Story.find().sort({ votes: -1 });
  res.json({ topStories });
});

router.get('/getStoryById/:id', async (req,res) => {
  const storyId = req.params.id;
  const story = await Story.findById(storyId);
  //console.log(storyId,story);
  res.json({ story});
});

router.post('/upvote', async (req, res) => {
  //console.log(req.body);
  const { storyId } = req.body;
  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Upvote the story
    await story.upvote();
    //await story.updatereaction(reactiontype);

    res.json({ message: 'Upvoted successfully' });
  } catch (error) {
    console.error('Error upvoting story:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/addreaction', async (req, res) => {
  const { storyId ,reactiontype} = req.body;
  //console.log(reactiontype);
  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    await story.updatereaction(reactiontype);

    res.json({ message: 'Decremented successfully' });
  } catch (error) {
    console.error('Error upvoting story:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
