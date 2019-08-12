import glob
import struct
import binascii
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt

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

plt.plot(datetime_, temperature)
plt.show()

import pdb; pdb.set_trace()
