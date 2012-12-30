from __future__ import with_statement
from fabric.api import *
from fabric.context_managers import settings
from fabric.contrib.console import confirm
import os, string, time
from stat import *

#Define global variables
env.apps = ["songzify.com"]
env.repos = ["songzify"]
env.postgres = {
	"host": "127.0.0.1", 
	"port": "5432", 
	"database": "songzify", 
	"user": "songzify", 
	"password": "@7vKt1036174AeQ$j"
}

#Import shared tasks
'''
from shared import m 
from shared import commit
from shared import data
from shared import git
from shared import pull
from shared import push
from shared import test
'''


@task
def start(): 

	m.log('Starting......')

	#Start the main app
	m.log("-----> main app")
	with lcd('shared'):
		local('start.vbs')
		local('watcher.vbs')

	#Start other apps
	for repo in env.repos:
		with lcd('../' + repo + '/shared'):
			if repo != 'hh-shared':
				m.log("-----> " + repo + " app")
				local('start.vbs')

@task
def stop(): 

	with settings(warn_only=True):
		try:
			m.log('Stopping ruby.exe...... (8597660)')
			local('Taskkill /IM ruby.exe /F')
		except:
			m.log('... already stopped')

	with settings(warn_only=True):
		try:
			m.log('Stopping node.exe...... (1824625)')
			local('Taskkill /IM node.exe /F')
		except:
			m.log('... already stopped')

@task
def restart(): 
	m.log('Restarting......')
	stop()
	start()

@task
def t(app=None): 
	
	passed = True

	#For which app(s)?
	apps = env.apps if app is None else [app]
	
	#Call mocha
	for a in apps:
		if not test.app(name=a):
			passed = False

	#Return a value
	return passed

@task
def install(pkg): 

	m.log('Installing package "' + pkg + '"...... (6757068)')

	for app in env.apps:
		with lcd('../' + app):
			local('npm install ' + pkg)

@task
def uninstall(pkg): 

	m.log('Uninstalling package "' + pkg + '"...... (4507791)')

	for app in env.apps:
		with lcd('../' + app):
			local('npm uninstall ' + pkg)
