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
        
        repairValidatorInstance = repairValidator()  
        validatorReponse = repairValidatorInstance.validate(payload,apiInstance,self)
        
        if len(validatorReponse['errors'])!=0:
            apiInstance.response(self,'{"errors":'+json.dumps(validatorReponse['errors'])+'}',401)
            return

        UtilitiesHelperInstance = UtilitiesHelper()
        repairDescription = UtilitiesHelperInstance.getValueofKey(payload['repair'],'descr')
        assignedTo = UtilitiesHelperInstance.getValueofKey(payload['repair'],'assignedTo')
        scheduledDate = UtilitiesHelperInstance.getValueofKey(payload['repair'],'scheduledDate')
        scheduledTime = UtilitiesHelperInstance.getValueofKey(payload['repair'],'scheduledTime')
        
        requestUser = apiInstance.getRequestUser(self)

        createdBy = requestUser.email
        RepairHelperInstance = RepairModelHelper()
        aRepair = RepairHelperInstance.create(str(uuid4()),assignedTo,scheduledDate,scheduledTime,createdBy,repairDescription,int(validatorReponse['proposedStartTS']))

        repairObj = {"key":aRepair.uid}
        apiInstance.response(self,'{"message":"Repair Successfully added","repair":'+json.dumps(repairObj)+'}')
        

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
                if arepair.status !='INCOMPLETE' and payload['state']!='COMPLETED':
                    apiInstance.response(self,'{"errors":"Invalid State change requested for user.('+arepair.status+'->'+payload['state']+')"}',401)
                    return
                else:
                    arepair.status = payload['state']
                    arepair.put()
                    repairObject = RepairModelInstance._tojson(arepair)
                    apiInstance.response(self,'{"message":"State changedi.","repair":'+json.dumps(repairObject)+'}',200)
                    return

            if payload['state']=='COMPLETED' or payload['state']=='INCOMPLETE' or payload['state']=='APPROVED':
                arepair.status = payload['state']
                arepair.put()
                repairObject = RepairModelInstance._tojson(arepair)
                apiInstance.response(self,'{"message":"State changed.","repair":'+json.dumps(repairObject)+'}',200)
                return

            apiInstance.response(self,'{"errors":"Allowed States are APPROVED, COMPLETED and INCOMPLETE"}',401)
            return
        elif payload['method']=='update': 
            repairValidatorInstance = repairValidator()
            validatorReponse = repairValidatorInstance.validate(payload,apiInstance,self)
            if len(validatorReponse['errors'])!=0:
                apiInstance.response(self,'{"errors":'+json.dumps(validatorReponse['errors'])+'}',401)
                return
            
            UtilitiesHelperInstance = UtilitiesHelper()
            repairDescription = UtilitiesHelperInstance.getValueofKey(payload['repair'],'descr')
            assignedTo = UtilitiesHelperInstance.getValueofKey(payload['repair'],'assignedTo')
            scheduledDate = UtilitiesHelperInstance.getValueofKey(payload['repair'],'scheduledDate')
            scheduledTime = UtilitiesHelperInstance.getValueofKey(payload['repair'],'scheduledTime')
        
            RepairHelperInstance = RepairModelHelper()
            arepair.assignedTo = assignedTo
            arepair.descr = repairDescription
            arepair.scheduledDate = scheduledDate
            arepair.scheduledTime = scheduledTime
            arepair.put()

            repairObject = RepairModelInstance._tojson(arepair)
            apiInstance.response(self,'{"message":"Updated.","repair":'+json.dumps(repairObject)+'}',200)
            return
        
        apiInstance.response(self,'{"errors":"Invalid Put method"}',401)
                    
  
class repairValidator():
    def validate(self,payload,apiInstance,requestObj):
        ret = {'errors':'','proposedStartTS':'1'}

        try:
            RepairPayload = payload['repair']
        except:
            ret['errors'] = 'No Arguments passed'
            return ret

        UtilitiesHelperInstance = UtilitiesHelper()
        repairDescription = UtilitiesHelperInstance.getValueofKey(RepairPayload,'descr')
        assignedTo = UtilitiesHelperInstance.getValueofKey(RepairPayload,'assignedTo')
        scheduledDate = UtilitiesHelperInstance.getValueofKey(RepairPayload,'scheduledDate')
        scheduledTime = UtilitiesHelperInstance.getValueofKey(RepairPayload,'scheduledTime')

        requestUser = apiInstance.getRequestUser(requestObj)

        if requestUser.role != 'manager':
            ret['errors'] = "Unauthorized. Only users with role manager can create a Repair."
            return ret

        createdBy = requestUser.email
        errors = ''

        if len(repairDescription)<5:
            ret['errors'] += "Enter a valid Description. "
        
        if scheduledDate != '' or scheduledTime != '':
            isDateValid = UtilitiesHelperInstance._validatedate(scheduledDate)
            if isDateValid!='':
                ret['errors'] += isDateValid
                
            isTimeValid = UtilitiesHelperInstance._validatetime(scheduledTime)
            if isTimeValid!='':
                ret['errors'] += isTimeValid
                
        if assignedTo!='':
            bbc = ''

        if assignedTo!='':
            UserModelHelperInstance = UserModelHelper()
            assignedToUser = UserModelHelperInstance.get(assignedTo) 
            if assignedToUser is None:
                ret['errors'] += 'No user with id '+assignedTo+' exists.'

        if scheduledDate != '' and scheduledTime != '':
            RepairHelperInstance = RepairModelHelper()

            proposedStartTS = UtilitiesHelperInstance.getScheduledTSfromDateTime(scheduledDate,scheduledTime)
            logging.info(proposedStartTS)
            # Check proposedStartTS validity
            isProposedScheduleValid = 'OK'
            if scheduledDate != '' and scheduledTime != '':
                isProposedScheduleValid = RepairHelperInstance._checkProposedScheduleValidity(proposedStartTS)

            ret['proposedStartTS'] = proposedStartTS 
            if isProposedScheduleValid!='OK':
                ret['errors'] += isProposedScheduleValid+' '

        return ret
   


    





    