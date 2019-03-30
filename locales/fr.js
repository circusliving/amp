export default () => {
  return new Promise(function (resolve) {
    resolve({
      info: 'Information',
      docs: 'Documents',
      cal: 'Calendrier',
      agenda: 'Ordre du jour',
      home:'Maison'
    })
  });
}
