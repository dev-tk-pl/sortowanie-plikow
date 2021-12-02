const confirm = require('node-popup');
const main = async () => {
  try {
    await confirm('Confirm or Deny?');
    console.log('Confirmed!');// OK button clicked
  } catch (error) {
    console.log('Denied!');// cancel button clicked
  }
}
main();