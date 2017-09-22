from google.appengine.api import datastore
from google.appengine.ext.db import GqlQuery
from google.appengine.ext import db

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

