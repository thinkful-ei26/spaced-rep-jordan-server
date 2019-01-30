'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const questionsArray = [
  {
  "question":"What does ES6 refer to?",
  "answer":"Most recent version of the ECMAScript Language Specificaiton", 
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What is JSX?",
  "answer":"A syntax extension to JavaScript that uses camel case and had the full power of JavaScript.",    
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"In React, what are Elements?", 
  "answer":"The building blocks of React applications. React elements describe what you want to see on the screen, and are immutable.",   
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"In React, what are Components?",
  "answer": "Small, reusable pieces of code that return a React element to be rendered on the page.",   
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"In React, what are props?",
  "answer":"Inputs to a React component. Props are data passed down from a parent component to a child component.",    
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What is the functionality of props.children?",
  "answer":"Available on every component, props.children contains the content between the opening and closing tags of a component.",    
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"In React, what is State?",
  "answer":"Component data that changes over time",   
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What are Lifecycle Methods?",
  "answer": "Custom functionality that gets executed during different phases of a component.",
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What are Controlled Components?",
  "answer": "Values that rely on React to perform",
  "correct":false, 
  "guessed":false,
  }, 
  {
  "question":"What are Uncontrolled Components?",
  "answer": "Values that do not rely on React to perform ",
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What are Keys?",
  "answer": "A special string attribute needed to create arrays of elements.",
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What are Refs?",
  "answer": "A special attribute that can be attached to any component and used to have direct access to the DOM element or the component itself. Refs can be objects, callback functions, or strings.",
  "correct":false, 
  "guessed":false,
  }, 
  {
  "question":"What is React?",
  "answer": "React is a JavaScript library",
  "correct":false, 
  "guessed":false,
  }, 
  {
  "question":"Is React a framework?",
  "answer":"No, React is a library",
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What is React used for?",
  "answer":"React is used to build user interfaces (UI) on the front end",
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"When you import React at the top of a new file, what are you importing exactly?",
  "answer": "You are importing the React top level API",
  "correct":false, 
  "guessed":false,
  },
  {
  "question":"What is the corelation between React and Babel?",
  "answer":"Babel is a JavaScript compiler that lets us use ES6+ in old browsers",
  "correct":false, 
  "guessed":false,
  },
]

// ===== Define UserSchema & UserModel =====
const schema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  questions: {type: Array, default: questionsArray }, 
  guessedQuestions:{ type:Array, default:[] }
});

// Transform output during `res.json(data)`, `console.log(data)` etc.
schema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

// Note: Use `function` (not an `arrow function`) to allow setting `this`
schema.methods.validatePassword = function (incomingPassword) {
    return bcrypt.compare(incomingPassword, this.password);
  };
  
schema.statics.hashPassword = function (incomingPassword) {
    const digest = bcrypt.hash(incomingPassword, 10);
    return digest;
  };
// schema.statics.hashPassword = function (pwd) {
//   return bcrypt.hash(pwd, 10);
// };

module.exports = mongoose.model('User', schema);