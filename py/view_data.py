import glob
import struct
import binascii
from datetime import datetime

def unpack(fmat, data, index):
    unpackedStuff = struct.unpack_from(fmat, data, index)
    index += struct.Struct(fmat).size
    return idx, unpackedStuff

files = glob.glob('../data/*')

files.sort()

inFileName = files[0]
inFile = open(inFileName, 'rb')

timestamp = []
datetime_ = []
temperature = []

for i, line in enumerate(inFile):
    data = binascii.a2b_base64(line)

    idx = 0
    idx, (time, temp) = unpack('<If', data, idx)
    timestamp.append(time)
    datetime_.append(datetime.fromtimestamp(time))
    temperature.append(temp)
    print(str(time) + " " + str(temp))


import pdb; pdb.set_trace()
