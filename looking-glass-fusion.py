#Author-Brian Peiris
#Description-A live viewer for the Looking Glass 3D display

import adsk.core, adsk.fusion, adsk.cam, traceback, datetime

import os
from http import server
from threading import Thread

server_port = 3000

addin_path = os.path.dirname(os.path.abspath(__file__))

log_path = os.path.join(addin_path, "log.txt")
log_file = open(log_path, "w")

def log(msg):
    timestamp = datetime.datetime.now().isoformat()
    print("{} {}".format(timestamp, msg))
    log_file.write("{} {} \n".format(timestamp, msg))
    log_file.flush()

files_dir = os.path.join(addin_path, "files")
export_file = os.path.join(files_dir, "export.stl")
log("Export path: {}".format(export_file))

if os.path.exists(export_file):
    os.remove(export_file)

class DirHandler(server.SimpleHTTPRequestHandler):
    def __init__(self, request, client_address, srv):
        try:
            super().__init__(request, client_address, srv, directory=files_dir)
        except:
            log(traceback.format_exc())

dir_server = None
try:
    dir_server = server.HTTPServer(("", server_port), DirHandler)
except:
    log(traceback.format_exc())

def serve_dir():
    log("Starting server at http://localhost:{}".format(server_port))
    dir_server.serve_forever()
    log("Stopping server")

thread = None
try:
    thread = Thread(target=serve_dir)
    thread.start()
except:
    log(traceback.format_exc())

def exportCurrentDesign(app):
    try:
        log("Exporting design")
        design = app.activeDocument.design
        exportManger = design.exportManager
        exportOptions = exportManger.createSTLExportOptions(design.rootComponent, export_file)
        exportManger.execute(exportOptions)
        log("Exported design")
    except:
        log(traceback.format_exc())

class CommandHandler(adsk.core.ApplicationCommandEventHandler):
    def __init__(self, app):
        super().__init__()
        self.app = app

    def notify(self, args):
        eventArgs = adsk.core.ApplicationCommandEventArgs.cast(args)
        exportCurrentDesign(self.app)

handlers = []

def run(context):
    try:
        log("Starting addin")
        app = adsk.core.Application.get()
        ui = app.userInterface

        commandTerminatedHandler = CommandHandler(app)
        ui.commandTerminated.add(commandTerminatedHandler)
        handlers.append(commandTerminatedHandler)

        ui.messageBox("looking-glass-fusion running at\nhttp://localhost:{}".format(server_port))

    except:
        log(traceback.format_exc())

def stop(context):
    log("Stopping addin")
    if dir_server: dir_server.shutdown()
    if thread: thread.join()
