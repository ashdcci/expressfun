module.exports = function(app){
  var Upload = require('s3-uploader');
    var client = new Upload('powwowapi', {
    aws: {
      key:app.get('AWS_KEY'),
      secret:app.get('AWS_SECRET'),
      path: 'uploads/',
      region: 'us-west-2',
      acl: 'public-read'
    },

    cleanup: {
      versions: true,
      original: false
    },

    original: {
      awsImageAcl: 'private'
    },

    versions: [{
      maxHeight: 1040,
      maxWidth: 1040,
      format: 'jpg',
      suffix: '-large',
      quality: 80,
      awsImageExpires: 31536000,
      awsImageMaxAge: 31536000
    },{
      maxWidth: 780,
      aspect: '3:2!h',
      suffix: '-medium'
    },{
      maxWidth: 320,
      aspect: '16:9!h',
      suffix: '-small'
    },{
      maxHeight: 100,
      aspect: '1:1',
      format: 'png',
      suffix: '-thumb1'
    },{
      maxHeight: 250,
      maxWidth: 250,
      aspect: '1:1',
      suffix: '-thumb2'
    }]
  });
  return client;

}
