import { greeting } from './modules/TestModule/Test';

const main = () => {
  console.log('hello world from main.js');
  greeting();
};

window.onload = main;
