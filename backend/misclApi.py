import webapp2
import datetime
import json
import urllib
import logging
from uuid import uuid4
import time

from models import UserModelHelper
from utilities import UtilitiesHelper
from models import RepairModelHelper
from utilities import api

class misclAPI(webapp2.RequestHandler):
    def options(self,id):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, authorization'
        self.response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS'

    def post(self,id):
        apiInstance = api()
        if id=='login':
            payload = json.loads(self.request.body)

            try:
                id = payload['user']['email']
                password = payload['user']['password']
            except:
                apiInstance.response(self,'{"errors":{"msg":" email and password are mandatory."}}',401)
                return   
            
            UserHelperInstance = UserModelHelper()
            if len(id)<3 or len(password)<3: #Paramters invalid
                apiInstance.response(self,'{"errors":{"lengths" :"Lengths of email and password should be > 2 characters.' +id+ '"}}',401)
                return
            aUser = UserHelperInstance.get(id)
            if aUser is None: #User Exists
                apiInstance.response(self,'{"errors":{"user" : "('+id+') has not been registered."}}',404)
                return

            UtilitiesInstance = UtilitiesHelper()
            if aUser.password == UtilitiesInstance.getonewayhash(password):
                token = UtilitiesInstance.AESencrypt(aUser.key().name()+'||'+str(datetime.datetime.now())) # Session Token    
                apiInstance.response(self,'{"user":{"email":'+json.dumps(aUser.email)+',"token":'+json.dumps(token)+',"role":'+json.dumps(aUser.role)+'}}')
                return
            apiInstance.response(self,'{"errors":{"Password" :" is Invalid"}}',401)
            
        elif id=='comment':
            self._createcomment()
        else:
            apiInstance.response(self,'{"errors":{"API" :" is invalid."}}',404)

    def _createcomment(self):
        payload = json.loads(self.request.body)
        apiInstance = api()
        try:
            repairid = payload['comment']['repairid']
            comment = payload['comment']['text']
        except:
            apiInstance.response(self,'{"error":"repairid and comment are mandatory."}',401)
            return   

        if len(comment)<5:
            apiInstance.response(self,'{"error":"comment should be meaningful."}',401)
            return
        
        RepairModelInstance = RepairModelHelper()
        reqUser = apiInstance.getRequestUser(self)

        aRepair = RepairModelInstance.get(repairid)
        
        if aRepair is None or (reqUser.role!='manager' and reqUser.uid!=aRepair.assignedTo):
            apiInstance.response(self,'{"error":"Invalid Resource ID passed."}',401)
            return

        newComment = {'uid': str(uuid4()),"ts": int(time.time()), "comment":comment,"user":reqUser.email}
        try:
            comments = json.loads(aRepair.comments)
            comments.append(newComment)
        except:
            comments = []
            comments.append(newComment)

        aRepair.comments = json.dumps(comments)
        aRepair.put()

        repairObject = RepairModelInstance._tojson(aRepair)
        apiInstance.response(self,'{"message":"Comment Added.","repair":'+json.dumps(repairObject)+'}',200)
        apiInstance = api()

    def get(self,id):
        apiInstance = api()     
        if id=='signout':
            token = '' # Session Token
            apiInstance.response(self,'{"status":"ok","message":"Sign Out Successful","token":'+json.dumps(token)+'}')
            return

        requestUser = apiInstance.getRequestUser(self)
        if id=='user':
            if requestUser is None:
                apiInstance.response(self,'{"errors":{"user": "not signed in"}}',401)
                return 
            UHI = UtilitiesHelper()
            atoken = self.request.get('authorization')     
            apiInstance.response(self,'{"user":{"email":'+json.dumps(requestUser.email)+',"token":'+json.dumps(atoken)+',"id":'+json.dumps(requestUser.uid)+',"role":'+json.dumps(requestUser.role)+'}}')
        else:
            apiInstance.response(self,'{"error":{"url":"not found."}}',404)
