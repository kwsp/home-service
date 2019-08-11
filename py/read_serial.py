import serial
import time
import datetime
import sys
import os
import glob
import struct
import binascii
import chart_studio
import chart_studio.plotly as py
from plotly.graph_objs import Scatter, Layout, Figure

# Initialise Serial
serialPortFound = False

if sys.platform == 'linux':
    ports = glob.glob('/dev/ttyACM*')
elif sys.platform == 'darwin':
    ports = glob.glob('/dev/tty.usb*')

if not ports:
    print('No USB ports found')

for port in ports:
    try:
        dev = serial.Serial(port=port,
                            baudrate=9600,
                            timeout=2,
                            writeTimeout=0)
        serialPortFound = True
        print("Established connection with {}".format(port))
    except:
        None

if not serialPortFound:
    sys.exit()


curr_date = time.strftime('%Y%m%d')
curr_file = open('/home/pi/home-service/data/{}.txt'.format(curr_date), 'ab')

while True:
    if curr_date == time.strftime('%Y%m%d'):
        raw = dev.readline().decode().strip()
        timestamp = time.strftime('%H%M%S')
        print(timestamp + " " + raw)

        packed = struct.pack("<If", int(time.time()), float(raw))
        curr_file.write(binascii.b2a_base64(packed))
        # break # for running with Cron
        time.sleep(5)
    else:
        curr_file.close()
        curr_date = time.strftime('%Y%m%d')
        curr_file = open('/home/pi/home-service/data/{}.txt'.format(curr_date), 'wb')

curr_file.close()

