# coding: utf-8

from fabric.api import *
from fabric.contrib.console import confirm
import time, datetime
import my_settings

PATH = my_settings.PATH

env.forward_agent = True
env.hosts = ['ubuntu@api.shapter.com']


def deploy(environment="staging"):
  if environment not in ["prod", "staging"]:
    print "Environment should be 'prod' or 'staging'"
    return 0
  distant_path = "/var/www/shapter_front_%s" % environment
  ts = time.time()
  st = str(datetime.datetime.fromtimestamp(ts).strftime('%Y%m%d%H%M%S'))
  print("Executing on %s as %s" % (env.host, env.user))
  with cd(PATH):
#    local("git checkout upg")
#    local("git pull")
#    print("COT COT COOOOOT")
#    local("git checkout master")
#    local("git merge upg")
#    local("bower install")
#    local("grunt build")
    local("grunt")
  run('mkdir -p %s/releases/%s' % (distant_path, st))
  put("%s/bin/*" % PATH, "%s/releases/%s" % (distant_path, st))
  run("rm -r %s/current" % distant_path)
  run("ln -s %s/releases/%s/ %s/current" % (distant_path, st, distant_path))
  sudo("service apache2 restart")

