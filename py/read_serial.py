import serial
import time
import datetime
import sys
import glob
import struct
import binascii


# Initialise Serial
serialPortFound = False
if sys.platform == 'linux':
    ports = glob.glob('/dev/ttyACM*')
elif sys.platform == 'darwin':
    ports = glob.glob('/dev/tty.usb*')

if not ports:
    print('[ERROR] No USB ports found')


# Open Serial port to Arduino to read data
for port in ports:
    try:
        dev = serial.Serial(port=port,
                            baudrate=115200,
                            timeout=2,
                            writeTimeout=0)
        serialPortFound = True
        print("Established connection with {}".format(port))
    except:
        pass


if not serialPortFound:
    sys.exit()


def getData():
    dev.flushInput()
    dev.write(str.encode('?\n'))
    raw = dev.readline().decode().strip()
    dev.write(str.encode('?\n'))
    return dev.readline().decode().strip()


curr_date = time.strftime('%Y%m%d')
curr_file = open('../data/{}.txt'.format(curr_date), 'ab')

while True:
    if curr_date == time.strftime('%Y%m%d'):
        raw = getData().split(',')
        temperature = raw[0]
        activity = raw[1]
        timestamp = time.strftime('%H%M%S')

        print(timestamp + " " + temperature + " " + activity)
        packed = struct.pack("<IfI",
                             int(time.time()),
                             float(temperature),
                             int(activity))
        curr_file.write(binascii.b2a_base64(packed))
        break  # for running with Cron
        time.sleep(5)
    else:
        curr_file.close()
        curr_date = time.strftime('%Y%m%d')
        curr_file = open('../data/{}.txt'.format(curr_date), 'wb')

curr_file.close()
