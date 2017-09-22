from models import UserModelHelper
from hashlib import sha256
from random import random
import datetime

TOKENCOOKIE = 'token'
PASSWORDSECRETKEY = '@@KSDJDKFS!!DK'
TOKENTTL = 3600

# Utility functions
# - AESencrypt : Encrypt a string
# - AESdecrypt : Decrypt a string
class UtilitiesHelper():
    # used to store passwords.. and a random_key
    def getonewayhash(self,apwd):
        return sha256('%s%s'%(PASSWORDSECRETKEY,apwd)).hexdigest()

    # returns one of None, user, admin, manager
    def getUserfromToken(self,requestObject):
        atoken = requestObject.request.headers['authorization']
        
        # fallback request param token
        if atoken=='':
            atoken = requestObject.request.get('authorization')
        if atoken != '':
            try:
                detoken = self.AESdecrypt(atoken)
                explodedToken = detoken.split('||')
                return explodedToken
            except (TypeError, ValueError, KeyError):
                return False
        return ''

    def get_cookie(self,request,name):
        if name in request.cookies:
            return request.cookies[name]
        return ''

    def AESencrypt(self, plaintext,password='TRIPP', base64=True):
        import hashlib, os
        from Crypto.Cipher import AES
        SALT_LENGTH = 32
        DERIVATION_ROUNDS=1337
        BLOCK_SIZE = 16
        KEY_SIZE = 32
        MODE = AES.MODE_CBC
    
        salt = os.urandom(SALT_LENGTH)
        iv = os.urandom(BLOCK_SIZE)
        paddingLength = 16 - (len(plaintext) % 16)
        paddedPlaintext = plaintext+chr(paddingLength)*paddingLength
        derivedKey = password
        derivedKey = hashlib.sha256(derivedKey+salt).digest()
        for i in range(0,DERIVATION_ROUNDS-1):
            derivedKey = hashlib.sha256(derivedKey).digest()
        derivedKey = derivedKey[:KEY_SIZE]
        cipherSpec = AES.new(derivedKey, MODE, iv)
        ciphertext = cipherSpec.encrypt(paddedPlaintext)
        ciphertext = ciphertext + iv + salt
        if base64:
            import base64
            return base64.b64encode(ciphertext)
        else:
            return ciphertext.encode("hex")

    def AESdecrypt(self, ciphertext,password='TRIPP', base64=True):
        import hashlib
        from Crypto.Cipher import AES
        SALT_LENGTH = 32
        DERIVATION_ROUNDS=1337
        BLOCK_SIZE = 16
        KEY_SIZE = 32
        MODE = AES.MODE_CBC
    
        if base64:
            import base64
            decodedCiphertext = base64.b64decode(ciphertext)
        else:
            decodedCiphertext = ciphertext.decode("hex")
        
        startIv = len(decodedCiphertext)-BLOCK_SIZE-SALT_LENGTH
        startSalt = len(decodedCiphertext)-SALT_LENGTH
        data, iv, salt = decodedCiphertext[:startIv], decodedCiphertext[startIv:startSalt], decodedCiphertext[startSalt:]
        derivedKey = password
        derivedKey = hashlib.sha256(derivedKey+salt).digest()
        for i in range(0, DERIVATION_ROUNDS-1):
            derivedKey = hashlib.sha256(derivedKey).digest()
        derivedKey = derivedKey[:KEY_SIZE]
        cipherSpec = AES.new(derivedKey, MODE, iv)
        plaintextWithPadding = cipherSpec.decrypt(data)
        paddingLength = ord(plaintextWithPadding[-1])
        plaintext = plaintextWithPadding[:-paddingLength]
        return plaintext

#Generic wrappers for api
class api():
    def getRequestUser(self,requestObject):
        UtilitiesInstance = UtilitiesHelper()
        getTokenDetails = UtilitiesInstance.getUserfromToken(requestObject)
        
        UserHelperInstance = UserModelHelper()
        if len(getTokenDetails)<2:
            return None
        aUser = UserHelperInstance.get('',getTokenDetails[0])
        if aUser is None:
            return None

        token = UtilitiesInstance.AESencrypt(aUser.key().name()+'||'+str(datetime.datetime.now())) # Session Token
        requestObject.response.set_cookie(TOKENCOOKIE, token, expires=(datetime.datetime.now()+datetime.timedelta(seconds=TOKENTTL)), path='/')
        return aUser

    def response(self,requestObject,responseText,status=200):
        requestObject.response.headers.add_header("Access-Control-Allow-Origin", "*")
        requestObject.response.headers['Content-Type'] = "application/json"
        requestObject.response.status = status
        fn = requestObject.request.get('fn')
        if fn!='':
            requestObject.response.write(fn+'('+responseText+')')
        else:
            requestObject.response.write(responseText)


    def _isallowed(self,requestObject):
        requestUser = self.getRequestUser(requestObject)

        if requestUser is None:
            self.response(requestObject,'{"errors":{"message":"Unauthorized"}}',401)
            return False
        
        if requestUser.role!='admin' and requestUser.role!='manager':
            self.response(requestObject,'{"errors":{"message":"Forbidden"}}',403)
            return False
        return True
