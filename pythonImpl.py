import time
class circularBuffer:
    bufferCount = 3
    maxBufferElems = 10
    def __init__(self):
        self.buffers=[]
        self.insertPos = 0
        self.bufferFull = False
        for _ in range(self.bufferCount):
            #equivalent of creating multiple pin buffers
            self.buffers.append([0 for _ in range(circularBuffer.maxBufferElems)])

    def push(self,value):
        arrayToInsert = self.insertPos // circularBuffer.maxBufferElems
        arrayToInsert = arrayToInsert % circularBuffer.bufferCount
        insertIndex = self.insertPos - (arrayToInsert * circularBuffer.maxBufferElems)
        self.buffers[arrayToInsert][insertIndex] = value
        self.insertPos+=1
        if self.insertPos >= (circularBuffer.bufferCount * circularBuffer.maxBufferElems):
            self.insertPos=0
            self.bufferFull = True

    def get(self,index):
        if not self.bufferFull:
            getIndex = index % self.insertPos
            getIndex = getIndex % (circularBuffer.bufferCount*circularBuffer.maxBufferElems)
            arrayToGet = getIndex // circularBuffer.maxBufferElems
            arrayGetIndex = getIndex - (arrayToGet*circularBuffer.maxBufferElems)
            return self.buffers[arrayToGet][arrayGetIndex]
        else:
            getIndex = index + self.insertPos
            getIndex = getIndex % (circularBuffer.bufferCount*circularBuffer.maxBufferElems)
            arrayToGet = getIndex // circularBuffer.maxBufferElems
            arrayGetIndex = getIndex - (arrayToGet*circularBuffer.maxBufferElems)
            return self.buffers[arrayToGet][arrayGetIndex]

    def print(self):
        if not self.bufferFull:
            for i in range(0,self.insertPos):
                print(self.get(i),end=",")
            pass
        else:
            for i in range(0,circularBuffer.bufferCount*circularBuffer.maxBufferElems):
                print(self.get(i),end=",")


# circBuffer = circularBuffer()
# for i in range(40):
#     circBuffer.push(i)
# circBuffer.print()

# print()
# for i in range(0,30):
#     print(circBuffer.get(i),end=",")

class logger:
    columns=[]
    insertedRows=0
    def __init__(self,*columTitles):
        self.columns=columTitles
        self.bufferObject = circularBuffer()

    def insertRow(self,**data):
        #insert timestamp
        self.bufferObject.push(time.time())
        for colHeader in self.columns:
            if colHeader in data.keys():
                toInsert= data[colHeader]
            else:
                toInsert=None
            self.bufferObject.push(toInsert)
        self.insertedRows+=1

    def saveLog(self):
        print("time",end="\t")
        for name in self.columns:
            print(name,end="\t")
        print()
        getIndex=0
        maxInserts = circularBuffer.maxBufferElems*circularBuffer.bufferCount
        maxRows = maxInserts // (len(self.columns)+1)
        if min(self.insertedRows,maxRows)==maxRows:
            getIndex = maxInserts % (len(self.columns)+1)

        for i in range(min(self.insertedRows,maxRows)):
            for j in range(len(self.columns)+1):
                value = self.bufferObject.get(getIndex)
                print(value,end="\t")
                getIndex+=1
            print()

table = logger("x","y","z")
for i in range(52):
    table.insertRow(x=i,y=i+1)

table.saveLog()


"""
time	x	y	z	
1739332333.3344188	45	46	None	
1739332333.33442	46	47	None	
1739332333.3344212	47	48	None	
1739332333.3344223	48	49	None	
1739332333.3344235	49	50	None	
1739332333.3344247	50	51	None	
1739332333.334426	51	52	None	
"""
