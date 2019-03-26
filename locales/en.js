export default () => {
  return new Promise(function (resolve) {
    resolve({
      info: 'Information',
      docs: 'Documents',
      cal: 'Calendar',
      agenda: 'Agenda',
      home:'home'                   
    })
  });
}
