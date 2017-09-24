import webapp2
import datetime
import json
import urllib
import logging
from uuid import uuid4

from models import RepairModelHelper
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

        createdBy = 'tba'
        errors = ''

        if len(repairDescription)<5:
            errors = "Enter a valid Description. "
        
        scheduleStart = '1'
        if scheduledDate != '' or scheduledTime != '':
            isDateValid = UtilitiesHelperInstance._validatedate(scheduledDate)
            if isDateValid!='':
                errors += json.dumps(isDateValid)
                
            isTimeValid = UtilitiesHelperInstance._validatetime(scheduledTime)
            if isTimeValid!='':
                errors += json.dumps(isTimeValid)

            scheduleStart = scheduledDate.replace('-','')+scheduledTime.replace(':','')
                
        if assignedTo!='':
            bbc = ''

        if len(errors)!=0:
            apiInstance.response(self,'{"errors":'+json.dumps(errors)+'}',401)
            return
        
        try:
            RepairHelperInstance = RepairModelHelper()
            aRepair = RepairHelperInstance.create(str(uuid4()),assignedTo,scheduledDate,scheduledTime,createdBy,repairDescription,scheduleStart)

            repairObj = {"key":aRepair.uid}
            apiInstance.response(self,'{"message":"Repair Successfully added","repair":'+json.dumps(repairObj)+'}')
        except:
            apiInstance.response(self,'{"errors":"Error while writing to DB."}',401)
        

    def get(self):
        apiInstance = api()
        RepairModelInstance = RepairModelHelper()

        reqUser = apiInstance.getRequestUser(self)

        uid = ''
        if reqUser is None:
            apiInstance.response(self,'{"errors":{"message":"Unauthorized"}}',401)
            return
        elif reqUser.role!='manager':
            uid = reqUser.uid    

        try:
            limit = int(self.request.get('limit'))
        except:
            limit = 10

        try:
            offset = int(self.request.get('offset'))
        except:
            offset = 0
        
        repairs  = RepairModelInstance.list(limit,offset,uid)
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
            apiInstance.response(self,'{"errors":{"message":"Unauthorized"}}',401)
            return
        elif reqUser.role=='manager':
            isAllowed = True 

        arepair = RepairModelInstance.get(id)
        if arepair is None:
            apiInstance.response(self,'{"errors":{"message":"Unauthorized"}}',404)
            return

        if not isAllowed and arepair.assignedTo != reqUser.email:
            apiInstance.response(self,'{"errors":{"message":"Unauthorized"}}',403)
            return

        repairObject = RepairModelInstance._tojson(arepair)
        apiInstance.response(self,'{"repair":'+json.dumps(repairObject)+'}')


    