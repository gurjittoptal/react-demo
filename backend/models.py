from google.appengine.api import datastore
from google.appengine.ext.db import GqlQuery
from google.appengine.ext import db
import json

import logging
from uuid import uuid4

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
    scheduleTime =  db.StringProperty(required=False,indexed=False)
    scheduleStart =  db.IntegerProperty(required=False,indexed=True)
    createdBy =  db.StringProperty(required=True,indexed=True)
    descr =  db.StringProperty(required=True,indexed=False)
    comments = db.TextProperty(required=False,indexed=False)

class RepairModelHelper():
    def create(self,id,assignedToval,scheduleDateval,scheduleTimeval,createdByval,descrval,scheduleStart):
        if assignedToval =='':
            assignedToval = 'UNASSIGNED'
        aRepair = Repair(parent=None,key_name=id,uid=id,assignedTo=assignedToval,
            scheduleDate=scheduleDateval,status='open',scheduleTime=scheduleTimeval,createdBy=createdByval,descr=descrval)
        aRepair.scheduleStart = int(scheduleStart)
        aRepair.comments = '[]'
        aRepair.put()
        return aRepair

    def get(self,id=''):
        return Repair.get_by_key_name(id)

    def _tojson(self,arepair):
        repairObj = {"uid":arepair.uid,"descr":arepair.descr}
        repairObj['comments'] = arepair.comments
        repairObj['scheduleDate'] = arepair.scheduleDate
        repairObj['scheduleTime'] = arepair.scheduleTime
        try:
            comments = json.loads(arepair.comments)
        except:
            comments = []

        commentssorted = sorted(comments, key=lambda x : x['ts'], reverse=True)
        repairObj['comments'] = commentssorted

        return repairObj
       

    def list(self,lmt=5,ofst=0,assignedTo=''):
        repairs = []

        if assignedTo=='':
            q = GqlQuery("SELECT * FROM Repair")
        else:
            q = GqlQuery("SELECT * FROM Repair where assignedTo=:assgnto",assgnto=assignedTo)
        for arepair in q.run(limit=lmt,offset=ofst): 
            repairObj = {"uid":arepair.uid,"descr":arepair.descr,"assignedTo":arepair.assignedTo,"createdBy":arepair.createdBy}  
            repairObj['comments'] = arepair.comments
            repairObj['scheduleDate'] = arepair.scheduleDate
            repairObj['scheduleTime'] = arepair.scheduleTime
            repairs.append(repairObj)

        return repairs



