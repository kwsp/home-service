import glob
import struct
import binascii
from datetime import datetime
import sqlite3


def unpack(fmat, data, index):
    unpackedStuff = struct.unpack_from(fmat, data, index)
    index += struct.Struct(fmat).size
    return idx, unpackedStuff

# Get DB path
db_name = "tiger-home.db"
db_path = os.path.join(os.getcwd(),
                       '../data',
                       db_name)

# Create the DB
connection = sqlite3.connect(db_path)
c = connection.cursor()


# Get .txt files
files = glob.glob('../data/*.txt')
files.sort()

for inFileName in files:
    inFile = open(inFileName, 'rb')

    timestamp = []
    datetime_ = []
    temperature = []
    activity = []

    for i, line in enumerate(inFile):
        data = binascii.a2b_base64(line)

        idx = 0
        idx, (time, temp, acti) = unpack('<IfI', data, idx)

        timestamp.append(time)
        datetime_.append(datetime.fromtimestamp(time))
        temperature.append(temp)
        activity.append(acti)
        # print(str(time) + " " + str(temp))

breakpoint()

