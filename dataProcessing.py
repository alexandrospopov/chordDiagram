import json

def loadData( labelJsonFileName, matrixFileName ):

  with open( labelJsonFileName, "r" ) as f:
    labels = json.load( f )

  with open( matrixFileName, "r" ) as f:
    matrix = f.readlines()

  return ( labels, matrix )

def processData( labels, matrix ): 

  for key in labels:
    labels[ key ] = labels[ key ].split( " " )
    labels[ key ] = [ int( num ) for num in labels[ key ] ]

  matrix = matrix[0].split( " " )

  return ( labels, matrix )

def createChordData( labels ):
  
  placeHolder = [ 0 for i in range( len( labels ) ) ]
  chordData = [ placeHolder for i in range( len( labels ) ) ]

  return chordData
    
def createPositionKey( labels ):

  orderedKeys = labels.keys()
  orderedKeys.sort()

  positionKey = {}
  for iKey, key in enumerate( orderedKeys ):
    positionKey[ key ] = iKey

  return positionKey 

def getRank( positionKey, labels, value ):

  for key in labels:
    
    if value in labels[ key ]:

      return positionKey[ key ]

  else:

    print( "%i is not a known label value." % value )  
    return -1


def classifyMatrix( matrix ):

  source = []
  dest = []
  quant = []
  
  for iNum, num in enumerate( matrix ):
    if num == '':
      pass
    elif iNum % 3 == 0 :
      source.append( int( num ) )
    elif iNum % 3 == 1 :
      dest.append( int( num ) )
    elif iNum % 3 == 2 :
      quant.append( int( num ) )

  return source, dest, quant 

def writeChordData( labelJsonFileName, matrixFileName, outputFileName ):

  print( "\nProcessing data in %s , %s . \n" % ( labelJsonFileName,
                                                    matrixFileName ) )

  labels, matrix = loadData( labelJsonFileName, matrixFileName )
  labels, matrix = processData( labels, matrix )
  
  chordData = createChordData( labels )
  positionKey = createPositionKey( labels )

  source, dest, quant = classifyMatrix( matrix )

  for s,d,q in zip( source, dest, quant ):

    rankS = getRank( positionKey, labels, s )
    rankD = getRank( positionKey, labels, d )

    if rankS > 0 and rankD > 0:
      chordData[ rankS ][ rankD ] = q 
      chordData[ rankD ][ rankS ] = q 
 

  data = {
    "chordData" : chordData,
    "labelData" : labels.keys()
  }

  with open( outputFileName, 'w' ) as json_file:
    json.dump( data, json_file )

  print( "\nWrote : %s \n" % outputFileName )


if __name__=="__main__":

  writeChordData( "data/listRoiLabels.json", 
                  "data/connectivity-matrix.mat",
                  "data.json" )

