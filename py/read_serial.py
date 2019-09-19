import time
import sys
import glob
import serial


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
