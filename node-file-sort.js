const fs = require('fs');

// const getSortedFiles = async (dir) => {
//   const files = await fs.promises.readdir(dir);
//   var myPath = './tmp';

//   console.log({files});

// files.forEach(f => {
//   const { birthtime } = fs.statSync(f)
//   console.log(birthtime);
// })

// if (!fs.existsSync(myPath)){
//     fs.mkdirSync(myPath);
// }

// return files
//   .map(fileName => ({
//     name: fileName,
//     time: fs.statSync(`${dir}/${fileName}`).mtime.getTime(),
//   }))
//   .sort((a, b) => a.time - b.time)
//   .map(file => file.name);
// };

// Promise.resolve()
//   .then(() => getSortedFiles(myDir))
//   .then(console.log)
//   .catch(console.error);

const selectFolder = require('win-select-folder');
const root = 'myComputer'; // rootfolder - default desktop
const description = 'Wybierz folder do posortowania'; // default Select Folder
const newFolderButton = 0; // whether or not to show the newFolderButton - default 1

selectFolder({ root, description, newFolderButton })
  .then(result => {
    if (result === 'cancelled') console.log('Cancelled by user');
    else selectFolder2sort(result); // logs selected folder
  })
  .catch(err => console.error(err))

const selectFolder2sort = async (dir) => {
  const files = await fs.promises.readdir(dir);
  console.log(files)

  files.forEach(file => showDate(file))

  function showDate(fileName) {
    fs.stat(`${dir}/${fileName}`, (err, stats) => {
      if (err) { console.log(err) }
      else {
        console.log(fileName);
        let fileDate = stats.birthtime.toISOString().slice(0, 10);
        let fileTime = stats.birthtime.toISOString().slice(11, 19);
        console.log('data : ', fileDate)
        console.log('godz. : ', fileTime)
        console.log(parseInt(fileTime.replace(/:/g, "")))

        sortFileByDate(fileDate, fileTime, fileName, dir)
      }
    })
  }
}

function sortFileByDate(dateStart, time, fileName, dirPath) {
  let dateEnd = new Date(dateStart);
  dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 1))
  dateEnd = dateEnd.toISOString().slice(0, 10)

  let open_time = Date.parse(`${dateStart}T12:00`);
  let close_time = Date.parse(`${dateEnd}T11:59`);
  let check_val = Date.parse(`${dateStart}T${time.slice(0, 5)}`);

  if (check_val > open_time && check_val < close_time) {
    console.log('one day');
    let dir = `./test/${dateStart}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let oldPath = `./test/${fileName}`
    let newPath = `./test/${dateStart}/${fileName}`

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
      console.log('Successfully renamed - AKA moved!')
    })
  } else {
    console.log('next day')
  }
}