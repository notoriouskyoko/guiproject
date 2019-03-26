const crypto = require('crypto'),
  algorithm = 'aes-256-gcm',
  password = 'your password',
  // do not use a global iv for production,
  // generate a new one for each encryption
  iv = "your iv"




module.exports = {
  decrypt: function (encryptedText) {
    let decipher = crypto.createDecipheriv(algorithm, password, iv)
    // decipher.setAuthTag(encryptedText.tag);
    let dec = decipher.update(encryptedText.content, 'hex', 'utf8')
    return dec;
  },
  encrypt: function (text) {
    let cipher = crypto.createCipheriv(algorithm, password, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    // let tag = cipher.getAuthTag();
    return {
      content: encrypted
    };
  }
}
