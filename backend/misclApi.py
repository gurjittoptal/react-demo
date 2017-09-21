import webapp2
import datetime
import json
import urllib
import logging

from models import UserModelHelper
from utilities import UtilitiesHelper
from utilities import api

TOKENCOOKIE = 'token'
TOKENTTL = 3600

class misclAPI(webapp2.RequestHandler):
    def options(self,id):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
        self.response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'

    def post(self,id):
        apiInstance = api()
        if id=='login':
            payload = json.loads(self.request.body)

            id = payload['user']['email']
            password = payload['user']['password']

            UserHelperInstance = UserModelHelper()
            if len(id)<3 or len(password)<3: #Paramters invalid
                apiInstance.response(self,'{"errors":{"lengths" :"Lengths of uid and password need to be greater than 2 characters.' +id+ '"}}',401)
                return
            aUser = UserHelperInstance.get(id)
            if aUser is None: #User Exists
                apiInstance.response(self,'{"errors":{"user" : "('+id+') has not been registered."}}',404)
                return

            UtilitiesInstance = UtilitiesHelper()
            if aUser.password == UtilitiesInstance.getonewayhash(password):
                token = UtilitiesInstance.AESencrypt(aUser.key().name()+'||'+str(datetime.datetime.now())) # Session Token    
                if apiInstance.getRequestUser(self) is None: #SET TOKEN only for new user
                    self.response.set_cookie(TOKENCOOKIE, token, expires=(datetime.datetime.now()+datetime.timedelta(seconds=TOKENTTL)), path='/')
                apiInstance.response(self,'{"user":{"email":'+json.dumps(aUser.email)+',"token":'+json.dumps(token)+',"role":'+json.dumps(aUser.role)+'}}')
                return
            apiInstance.response(self,'{"errors":{"Password" :" is Invalid"}}',401)
        else:
            apiInstance.response(self,'{"errors":{"API" :" is invalid."}}',404)
      
    def get(self,id):
        apiInstance = api()     
        if id=='signout':
            token = '' # Session Token
            self.response.set_cookie(TOKENCOOKIE, token, expires=(datetime.datetime.now()+datetime.timedelta(seconds=100)), path='/')
            apiInstance.response(self,'{"status":"ok","message":"Sign Out Successful","token":'+json.dumps(token)+'}')
            return

        requestUser = apiInstance.getRequestUser(self)
        if id=='user':
            if requestUser is None:
                apiInstance.response(self,'{"errors":{"user": "not signed in"}',401)
                return 
            UHI = UtilitiesHelper()
            atoken = UHI.get_cookie(self.request,TOKENCOOKIE)     
            apiInstance.response(self,'{"user":{"email":'+json.dumps(requestUser.email)+',"token":'+json.dumps(atoken)+',"id":'+json.dumps(requestUser.uid)+',"role":'+json.dumps(requestUser.role)+'}}')
        else:
            apiInstance.response(self,'{"error":{"url":"not found."}',404)
