import webapp2
import datetime
import json
import urllib
import logging
from uuid import uuid4
import time
import datetime


from models import RepairModelHelper
from models import  UserModelHelper
from utilities import UtilitiesHelper
from utilities import api

TOKENCOOKIE = 'token'
TOKENTTL = 3600

class repairsAPI(webapp2.RequestHandler):
    def options(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, authorization'
        self.response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS'

    def post(self):
        apiInstance = api()
        if not apiInstance._isallowed(self): return

        payload = json.loads(self.request.body)
        
        try:
            RepairPayload = payload['repair']
        except:
            apiInstance.response(self,'{"errors":"No Arguments passed."}',401)
            return

        UtilitiesHelperInstance = UtilitiesHelper()
        repairDescription = UtilitiesHelperInstance.getValueofKey(RepairPayload,'descr')
        assignedTo = UtilitiesHelperInstance.getValueofKey(RepairPayload,'assignedTo')
        scheduledDate = UtilitiesHelperInstance.getValueofKey(RepairPayload,'scheduledDate')
        scheduledTime = UtilitiesHelperInstance.getValueofKey(RepairPayload,'scheduledTime')

        requestUser = apiInstance.getRequestUser(self)

        if requestUser.role != 'manager':
            apiInstance.response(self,'{"errors":{"message":"Unauthorized. Only users with role manager can create a Repair."}}',401)
            return

        createdBy = requestUser.email
        errors = ''

        if len(repairDescription)<5:
            errors = "Enter a valid Description. "
        
        if scheduledDate != '' or scheduledTime != '':
            isDateValid = UtilitiesHelperInstance._validatedate(scheduledDate)
            if isDateValid!='':
                errors += isDateValid
                
            isTimeValid = UtilitiesHelperInstance._validatetime(scheduledTime)
            if isTimeValid!='':
                errors += isTimeValid
                
        if assignedTo!='':
            bbc = ''

        if assignedTo!='':
            UserModelHelperInstance = UserModelHelper()
            assignedToUser = UserModelHelperInstance.get(assignedTo) 
            if assignedToUser is None:
                errors += 'No user with id '+assignedTo+' exists.'
        
        if len(errors)!=0:
            apiInstance.response(self,'{"errors":'+json.dumps(errors)+'}',401)
            return
        
        #try:
        if 1==1:
            RepairHelperInstance = RepairModelHelper()

            proposedStartTS = UtilitiesHelperInstance.getScheduledTSfromDateTime(scheduledDate,scheduledTime)
            logging.info(proposedStartTS)
            # Check proposedStartTS validity
            isProposedScheduleValid = 'OK'
            if scheduledDate != '' and scheduledTime != '':
                isProposedScheduleValid = RepairHelperInstance._checkProposedScheduleValidity(proposedStartTS)

            if isProposedScheduleValid!='OK':
                apiInstance.response(self,'{"errors":'+json.dumps(isProposedScheduleValid)+'}',401)
                return

            aRepair = RepairHelperInstance.create(str(uuid4()),assignedTo,scheduledDate,scheduledTime,createdBy,repairDescription,int(proposedStartTS))

            repairObj = {"key":aRepair.uid}
            apiInstance.response(self,'{"message":"Repair Successfully added","repair":'+json.dumps(repairObj)+'}')
        #except:
        #    apiInstance.response(self,'{"errors":"Error while writing to DB."}',401)
        

    def get(self):
        apiInstance = api()
        RepairModelInstance = RepairModelHelper()

        reqUser = apiInstance.getRequestUser(self)

        uemail = ''
        if reqUser is None:
            apiInstance.response(self,'{"errors":"Unauthorized"}',401)
            return
        elif reqUser.role!='manager':
            uemail = reqUser.email    

        try:
            limit = int(self.request.get('limit'))
        except:
            limit = 10

        try:
            offset = int(self.request.get('offset'))
        except:
            offset = 0
        
        repairs  = RepairModelInstance.list(limit,offset,uemail)
        apiInstance.response(self,'{"repairs":'+json.dumps(repairs)+',"repairscount":50}')


class repairAPI(webapp2.RequestHandler):

    def options(self,id):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, authorization'
        self.response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS'

    def get(self,id):
        apiInstance = api()
        RepairModelInstance = RepairModelHelper()

        reqUser = apiInstance.getRequestUser(self)

        isAllowed = False
        if reqUser is None:
            apiInstance.response(self,'{"errors":"Unauthorized"}',401)
            return
        elif reqUser.role=='manager':
            isAllowed = True 

        arepair = RepairModelInstance.get(id)
        if arepair is None:
            apiInstance.response(self,'{"errors":"Repair does not exist."}',404)
            return

        ## Req : Comment on any Repairs at any time. 
        #if not isAllowed and arepair.assignedTo != reqUser.email:
        #    apiInstance.response(self,'{"errors":"You do not have access to view this repair."}',403)
        #    return

        repairObject = RepairModelInstance._tojson(arepair)
        apiInstance.response(self,'{"repair":'+json.dumps(repairObject)+'}')

    def put(self,id):
        apiInstance = api()
        RepairModelInstance = RepairModelHelper()

        reqUser = apiInstance.getRequestUser(self)

        isAllowed = False
        if reqUser is None:
            apiInstance.response(self,'{"errors":"Unauthorized"}',401)
            return
        elif reqUser.role=='manager':
            isAllowed = True 

        arepair = RepairModelInstance.get(id)
        if arepair is None:
            apiInstance.response(self,'{"errors":"Repair does not exist."}',404)
            return

        try:
            payload = json.loads(self.request.body)
        except:
            apiInstance.response(self,'{"errors":"Invalid Payload."}',404)
            return

        #logging.info(payload['method'])
        if payload['method']=='changestate':
            if arepair.assignedTo==reqUser.email:
                if arepair.state !='INCOMPLETE' and payload['state']!='COMPLETED':
                    apiInstance.response(self,'{"errors":"Invalid State change requested for user.('+arepair.state+'->'+payload['state']+')"}',401)
                    return
                else:
                    arepair.state = payload['state']
                    arepair.put()
                    apiInstance.response(self,'{"message":"State changed."}',401)
                    return

            if payload['state']=='COMPLETED' or payload['state']=='INCOMPLETE' or payload['state']=='APPROVED':
                arepair.status = payload['state']
                arepair.put()
                repairObject = RepairModelInstance._tojson(arepair)
                apiInstance.response(self,'{"message":"State changed.","repair":'+json.dumps(repairObject)+'}',200)
                return

            apiInstance.response(self,'{"errors":"Allowed States are APPROVED, COMPLETED and INCOMPLETE"}',401)
            return

        try:
            if payload['method']=='changestate':
                self._changestate(arepair,reqUser,payload,RepairModelInstance)
                return
        except:
            msg = 'Continue with Edit'
        ## Req : Comment on any Repairs at any time. 
        #if not isAllowed and arepair.assignedTo != reqUser.email:
        #    apiInstance.response(self,'{"errors":"You do not have access to view this repair."}',403)
        #    return

        repairObject = RepairModelInstance._tojson(arepair)
        apiInstance.response(self,'{"repair":'+json.dumps(repairObject)+'}')
  


    





    