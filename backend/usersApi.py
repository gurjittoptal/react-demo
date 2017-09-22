import webapp2
import datetime
import json
import urllib
import logging
from uuid import uuid4

from models import UserModelHelper
from utilities import UtilitiesHelper
from utilities import api

TOKENCOOKIE = 'token'
TOKENTTL = 3600

class usersAPI(webapp2.RequestHandler):
    def options(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, authorization'
        self.response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS'

    def post(self):
        UserHelperInstance = UserModelHelper()
        apiInstance = api()

        payload = json.loads(self.request.body)

        try:
            email = payload['user']['email']
            password = payload['user']['password']
            uid  = str(uuid4())
        except:
            apiInstance.response(self,'{"errors":{"msg":" email and password are mandatory."}}',401)
            return
        

        if len(email)<3 or len(password)<3: #Parameters invalid
            apiInstance.response(self,'{"errors":{"lengths":" of email and password need to be greater than 2 characters."}}',401)
        else: #Paramters valid
            aUser = UserHelperInstance.get(email)
            if aUser is not None: #User Exists
                apiInstance.response(self,'{"errors":{"email":" ('+email+') has already been taken."}}',401)
                return
            else: #Create user and sign in if needed
                UtHI = UtilitiesHelper()
                passwordhash = UtHI.getonewayhash(password)
                aUser = UserHelperInstance.create(uid,passwordhash,email)
                
                UtilitiesInstance = UtilitiesHelper()
                token = UtilitiesInstance.AESencrypt(aUser.key().name()+'||'+ str(datetime.datetime.now())) # Session Token
                
                try:
                    role = payload['user']['role']
                    aUser.role = role
                    aUser.put()
                except:
                    msg = 'No role passed'
                    
                apiInstance.response(self,'{"user":{"role":'+json.dumps(aUser.role)+',"email":'+json.dumps(aUser.email)+',"token":'+json.dumps(token)+',"key":'+json.dumps(str(aUser.key().name()))+'}}')
        
    def get(self):
        apiInstance = api()
        #if not apiInstance._isallowed(self): return
        UserHelperInstance = UserModelHelper()
        
        try:
            limit = int(self.request.get('limit'))
        except:
            limit = 10

        try:
            offset = int(self.request.get('offset'))
        except:
            offset = 0

        allusers = UserHelperInstance.list(limit,offset)
        alluserscount = UserHelperInstance.count()
        jsonArray = []
        for i in range(0,len(allusers)):
            jsonArray.append({"uid":allusers[i].uid,"role":allusers[i].role,"email":allusers[i].email}) 
        apiInstance.response(self,'{"users":'+json.dumps(jsonArray)+',"usercount":'+json.dumps(alluserscount)+'}')


class userAPI(webapp2.RequestHandler):
    def options(self,id):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, authorization'
        self.response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS'

    def post(self,id):
        apiInstance = api()
        apiInstance.response(self,'{"status":"ok","message":"No Route."}')
        
    def get(self,id):
        if not self._isallowed(): return
        apiInstance = api()
        UserHelperInstance = UserModelHelper()
        if id!='':
            aUser = UserHelperInstance.get('',id)
            if aUser is None:
                apiInstance.response(self,'{"status":"ok","message":"Resource does not exist"}',404)
                return
            jsonUser = {"key":str(aUser.key().name()),"uid":aUser.uid,"email":aUser.email,"role":aUser.role}
            apiInstance.response(self,'{"status":"ok","message":"success","user":'+json.dumps(jsonUser)+'}')
            return

        apiInstance.response(self,'{"status":"error","message":"id of user not passed"}')

    def put(self,id):
        if not self._isallowed(): return
        if id=='':
            apiInstance.response(self,'{"status":"error","message":"Resource does not exist"}',404)
            return

        apiInstance = api()
        UserHelperInstance = UserModelHelper()
        aUser = UserHelperInstance.get('',id)
        if aUser is None:
            apiInstance.response(self,'{"status":"error","message":"Resource does not exist"}',404)
            return

        uid = self.request.get('uid')
        password = self.request.get('password')
        email = self.request.get('email') 
        role = self.request.get('role') 

        if role=='user' or role=='admin' or role=='manager':
            aUser.role = role
        
        if len(uid)>2:
            anExistingUserwithId = UserHelperInstance.get(uid)
            if anExistingUserwithId is not None and id!=anExistingUserwithId.key().name():
                apiInstance.response(self,'{"status":"error","message":"Id('+uid+') is already taken."}')
                return
            aUser.uid = uid

        if email!='': aUser.email = email
        if password!='': 
            if len(password)<3:
                apiInstance.response(self,'{"status":"error","message":"Password length should be >2."}')
                return
            aUser.password = UserHelperInstance.getonewayhash(password)

        aUser.put()

        apiInstance.response(self,'{"status":"ok","message":"User has been updated"}')

    def delete(self,id):
        if not self._isallowed(): return
        apiInstance = api()
        UserHelperInstance = UserModelHelper()
        aUser = UserHelperInstance.get('',id)
        if aUser is None:
            apiInstance.response(self,'{"status":"ok","message":"Resource does not exist"}',404)
            return
        aUser.delete()
        apiInstance.response(self,'{"status":"ok","message":"Resource deleted."}',200)


    def _isallowed(self):
        apiInstance = api()
        requestUser = apiInstance.getRequestUser(self)
        if requestUser is None:
            apiInstance.response(self,'{"status":"error","message":"Unauthorized"}',401)
            return False
        if requestUser.role!='admin' and requestUser.role!='manager':
            apiInstance.response(self,'{"status":"error","message":"Forbidden"}',403)
            return False
        return True

