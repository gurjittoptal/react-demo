from google.appengine.api import datastore
from google.appengine.ext.db import GqlQuery
from google.appengine.ext import db
import json
import datetime

import logging
from uuid import uuid4

REPAIRSLOTTIME = 3600

#User Model
class User(db.Model):
    uid = db.StringProperty(required=True,indexed=True)
    password = db.StringProperty(required=True,indexed=False)
    email = db.StringProperty(required=False,indexed=True)
    role =  db.StringProperty(required=True,indexed=True)

class UserModelHelper():
    def create(self,id,pwd,email=''):
        aUser = User(parent=None,key_name=id,uid=id,email=email,password=pwd,role='user')
        aUser.put()
        return aUser

    def get(self,email,id=''):
        if email!='':
            q = GqlQuery("SELECT * FROM User where email=:emailid",emailid=email)
            for auser in q.run(limit=1): return auser
            return None
        return User.get_by_key_name(id)

    def delete(self,auser):
        auser.delete()

    def count(self):
        count = User.all(keys_only=True).count(500)
        return count

    def list(self,lmt=5,ofst=0):
        users = []
        q = GqlQuery("SELECT * FROM User")
        for auser in q.run(limit=lmt,offset=ofst):   
            users.append(auser)
        return users

#Repair Model
class Repair(db.Model):
    uid = db.StringProperty(required=True,indexed=True)
    assignedTo = db.StringProperty(required=False,indexed=True)
    status = db.StringProperty(required=True,indexed=True)
    scheduleDate =  db.StringProperty(required=False,indexed=False)
    scheduleDateINT =  db.IntegerProperty(required=False,indexed=True)
    scheduleTime =  db.StringProperty(required=False,indexed=False)
    scheduleTimeINT =  db.IntegerProperty(required=False,indexed=True)
    scheduleStart =  db.IntegerProperty(required=False,indexed=True)
    createdBy =  db.StringProperty(required=True,indexed=True)
    descr =  db.TextProperty(required=True,indexed=False)
    comments = db.TextProperty(required=False,indexed=False)

class RepairModelHelper():
    def create(self,id,assignedToval,scheduleDateval,scheduleTimeval,createdByval,descrval,scheduleStart):
        aRepair = Repair(parent=None,key_name=id,uid=id,assignedTo=assignedToval,
            scheduleDate=scheduleDateval,status='INCOMPLETE',scheduleTime=scheduleTimeval,createdBy=createdByval,descr=descrval,scheduleTimeINT=0,scheduleDateINT=0)
        aRepair.scheduleStart = scheduleStart
        aRepair.comments = '[]'
        if scheduleDateval!='':
            tempval = int(scheduleDateval.replace('-',''))
            aRepair.scheduleDateINT = tempval
        if scheduleTimeval!='':
            tempval = int(scheduleTimeval.replace(':',''))
            aRepair.scheduleTimeINT= tempval
            
        aRepair.put()
        return aRepair

    def get(self,id=''):
        return Repair.get_by_key_name(id)

    def _tojson(self,arepair):
        repairObj = {"uid":arepair.uid,"descr":arepair.descr}
        repairObj['comments'] = arepair.comments
        repairObj['scheduleDate'] = arepair.scheduleDate
        repairObj['scheduleTime'] = arepair.scheduleTime
        repairObj['status'] = arepair.status
        repairObj['assignedTo'] = arepair.assignedTo
        
        try:
            comments = json.loads(arepair.comments)
        except:
            comments = []

        commentssorted = sorted(comments, key=lambda x : x['ts'], reverse=True)
        repairObj['comments'] = commentssorted

        return repairObj
       
    def count(self):
        count = Repair.all(keys_only=True).count(500)
        return count

    def list(self,lmt=5,ofst=0,assignedTo='',status='',frDt='',frTm='',toDt='',toTm=''):
        ret = {'hasMore':0}
        repairs = []
        conditions = ''
        qry = "SELECT * FROM Repair"

        toTm = toTm.replace(':','')
        if assignedTo!='':
            conditions =self._addcondition(' assignedTo=:assgnto ',conditions)

        datedfilterson = False
        if frDt!='':
            datedfilterson = True
            frDt = int(frDt.replace('-',''))
            conditions = self._addcondition(' scheduleDateINT>=:fD and scheduleDateINT!=1',conditions)
        if toDt!='':
            datedfilterson = True
            toDt = int(toDt.replace('-',''))
            conditions = self._addcondition(' scheduleDateINT<=:tD and scheduleDateINT!=1 ',conditions)
        if frTm!='' and not datedfilterson:
            frTm = int(frTm.replace(':',''))
            conditions = self._addcondition(' scheduleTimeINT>=:fT and scheduleTimeINT!=0 ',conditions)
        if toTm!='' and not datedfilterson:
            toTm = int(toTm.replace(':',''))
            conditions = self._addcondition(' scheduleTimeINT<=:tT and scheduleTimeINT!=0 ',conditions)
        if status!='' and status!='ALL':
            conditions = self._addcondition(' status=:sT',conditions)

        if conditions!='':
            qry = qry + ' where ' + conditions

        logging.info(qry)
        q = GqlQuery(qry,assgnto=assignedTo,sT=status,fD=frDt,fT=frTm,tD=toDt,tT=toTm)
        
        index = 0
        for arepair in q.run(limit=lmt+1,offset=ofst): 
            repairObj = self._tojson(arepair)
            index +=1
            if index<6:
                repairs.append(repairObj)

        ret['repairs'] = repairs
        if index==6:
            ret['hasMore'] = 1
        return ret

    def _addcondition(self,condition,existing):
        if existing!='':
            existing += ' and '
        return (existing + condition)

    # Checks if proposed schedule is valid for a given Repair
    def _checkProposedScheduleValidity(self,proposedStartTS,req=''):
        
        proposedStartTS = int(proposedStartTS)
        logging.info(proposedStartTS)
        q = GqlQuery("SELECT * FROM Repair where status=:astatus and scheduleStart<:psTS order by scheduleStart desc",psTS=proposedStartTS,astatus='INCOMPLETE')

        isOk = True
        prevRepair = None
        for arepair in q.run(limit=1):
            prevRepair = arepair
            if proposedStartTS- arepair.scheduleStart<REPAIRSLOTTIME:
                isOk = False

        q = GqlQuery("SELECT * FROM Repair where status=:astatus and scheduleStart>=:psTS order by scheduleStart asc",psTS=proposedStartTS,astatus='INCOMPLETE')

        tuples = []

        for arepair in q.run(limit=24):
            tuples.append(arepair)

        if len(tuples)>0:
            if tuples[0].scheduleStart - proposedStartTS <REPAIRSLOTTIME:
                isOk = False

        logging.info(len(tuples))
        if isOk:
            return 'OK'

        for k in range(1,len(tuples)):
            if tuples[k].scheduleStart - tuples[k-1].scheduleStart>=REPAIRSLOTTIME:
                nextSlot = self._getnextAvailableSlot(tuples[k-1].scheduleStart)
                logging.info('in next poo')
                logging.info(nextSlot)
                return 'Next available slot is from ' + nextSlot


        if len(tuples)<24 and len(tuples)>0:
            nextSlot = self._getnextAvailableSlot(tuples[len(tuples)-1].scheduleStart)
            logging.info('in next')
            logging.info(nextSlot)     
            return 'Next available slot is from ' + nextSlot

        if len(tuples)==0:
            nextSlot = self._getnextAvailableSlot(prevRepair.scheduleStart)
            logging.info('in prev')
            logging.info(nextSlot)   
            return 'Next available slot is from ' + nextSlot

        return 'No available slot withing 24 hours from proposed slot'


    def _getnextAvailableSlot(self,ts):
        logging.info(datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M'))
        logging.info(ts)
        return datetime.datetime.fromtimestamp(ts+REPAIRSLOTTIME).strftime('%Y-%m-%d %H:%M')

