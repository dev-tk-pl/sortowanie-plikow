const fs = require('fs');

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
        // console.log(stats);
        // console.log(fileName);
        // let fileDate = stats.birthtime.toISOString().slice(0, 10);
        // let fileTime = stats.birthtime.toISOString().slice(11, 19);
        let fileDate = stats.mtime.toISOString().slice(0, 10);
        let fileTime = stats.mtime.toISOString().slice(11, 19)
        // console.log('data : ', fileDate)
        // console.log('godz. : ', fileTime)
        // console.log(parseInt(fileTime.replace(/:/g, "")))
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
    let dir = `${dirPath}/${dateOneDayBefore}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let oldPath = `${dirPath}/${fileName}`
    let newPath = `${dirPath}/${dateOneDayBefore}/${fileName}`

    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
      console.log('Successfully renamed - AKA moved ! (00:00-12:00)')
    })
  }
}