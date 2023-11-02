// models/Story.js
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  prompt: String,
  content: String,
  votes: { type: Number, default: 0 },
  tags: [String], // Add tags to the schema
  reactions: {
    like:  { type: Number, default: 0 },
    funny:  { type: Number, default: 0 },
    interesting: { type: Number, default: 0 },
    emotional: { type: Number, default: 0 },
    shocking: { type: Number, default: 0 },
    dislike:  { type: Number, default: 0 },
  }
});

storySchema.methods.extendStory = async function (newgeneratedStory) {
  this.content = this.content + '\n' + newgeneratedStory;
  await this.save();
}

// Add a method to upvote a story
storySchema.methods.upvote = async function () {
  this.votes += 1;
  await this.save();
};

storySchema.methods.updatereaction = async function (rec) {
  //console.log(rec);
  this.reactions[rec] += 1;
  await this.save();
};


const Story = mongoose.model('Story', storySchema);

module.exports = Story;
