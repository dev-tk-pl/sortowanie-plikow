const fs = require('fs');
const selectFolder = require('win-select-folder');

const root = 'myComputer'; // rootfolder - default desktop
const description = 'Wybierz folder do posortowania'; // default Select Folder
const newFolderButton = 0; // whether or not to show the newFolderButton - default 1

selectFolder({ root, description, newFolderButton })
  .then(selectFolder => {
    if (selectFolder === 'cancelled') console.log('Cancelled by user');
    else readFileFromPath(selectFolder); // logs selected folder
  })
  .catch(err => console.error(err))

const readFileFromPath = async (dir) => {
  // const files = await fs.promises.readdir(dir);
  // console.log(files)
  fs.readdir(dir, { withFileTypes: true }, (err, dirents) => {
    const files = dirents
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name);
    // use files
    files.forEach(file => getDate(file, dir))
  });
}

function getDate(fileName, dir) {
  fs.stat(`${dir}/${fileName}`, (err, stats) => {
    if (err) { console.log(err) }
    else {
      // console.log(stats);
      // console.log(fileName);
      let fileDate = stats.mtime.toISOString().slice(0, 10);
      let fileTime = stats.mtime.toISOString().slice(11, 19);
      // console.log('data : ', fileDate)
      // console.log('godz. : ', fileTime)
      // console.log(parseInt(fileTime.replace(/:/g, "")))
      sortFile2FoldersByDate(fileDate, fileTime, fileName, dir)
    }
  })
}

function sortFile2FoldersByDate(dateStart, time, fileName, dirPath) {
  let dateEnd = new Date(dateStart);
  dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 1))
  dateEnd = dateEnd.toISOString().slice(0, 10)

  let open_time = Date.parse(`${dateStart}T12:00`);
  let close_time = Date.parse(`${dateEnd}T11:59`);
  let check_val = Date.parse(`${dateStart}T${time.slice(0, 5)}`);

  if (check_val > open_time && check_val < close_time) {
    let dir = `${dirPath}/${dateStart}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let oldPath = `${dirPath}/${fileName}`
    let newPath = `${dirPath}/${dateStart}/${fileName}`

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
      console.log('Successfully renamed - AKA moved!')
    })
  } else {
    let dateOneDayBefore = new Date(dateStart);
    dateOneDayBefore = new Date(dateOneDayBefore.setDate(dateOneDayBefore.getDate() - 1))
    dateOneDayBefore = dateOneDayBefore.toISOString().slice(0, 10)
    console.log('next day')
    let dayBefore = new Date(dateStart);
    dayBefore = new Date(dayBefore.setDate(dayBefore.getDate() - 1))
    dayBefore = dayBefore.toISOString().slice(0, 10)

    let dir = `${dirPath}/${dayBefore}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let oldPath = `${dirPath}/${fileName}`;
    let newPath = `${dirPath}/${dayBefore}/${fileName}`;

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
      console.log('Successfully renamed - AKA moved! 00-12')
    })
  }
}

// var readlineSync = require('readline-sync');
// console.log("welcome. Please enter your name ");
// var username = readlineSync.question("Your Name? ");
// console.log("Welcome to THE QUIZ, " + username + "!");