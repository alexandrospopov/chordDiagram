import json

def loadData( bundlesFileName ):

  with open( bundlesFileName, "r" ) as f:
    bundlesJson = json.load( f )

  return bundlesJson

def processData( labels, matrix ): 

  for key in labels:
    labels[ key ] = labels[ key ].split( " " )
    labels[ key ] = [ int( num ) for num in labels[ key ] ]

  matrix = matrix[0].split( " " )

  return ( labels, matrix )

def createChordData( labels ):
  
  placeHolder = [ 0 for i in range( len( labels ) ) ]
  chordData = [ list( placeHolder ) for i in range( len( labels ) ) ]

  return chordData
    
def createPositionKey( labels ):

  orderedKeys = labels.keys()
  orderedKeys.sort(key=lambda v: v.upper())

  positionKey = {}
  for iKey, key in enumerate( orderedKeys ):
    positionKey[ key ] = iKey

  return positionKey, orderedKeys

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

def writeChordData( bundlesFileName, clustersJson, fibersJson ):

  print( "\nProcessing data in %s . \n" % bundlesFileName )

  bundlesJson = loadData( bundlesFileName )

  fibreCounts = bundlesJson[ "curve3d_counts" ]
  labels = bundlesJson[ "labels" ]


  # labels, matrix = processData( labels, matrix )
  
  # chordData = createChordData( labels )
  # positionKey, orderedKeys = createPositionKey( labels )

  # source, dest, quant = classifyMatrix( matrix )

  # for s,d,q in zip( source, dest, quant ):

  #   rankS = getRank( positionKey, labels, s )
  #   rankD = getRank( positionKey, labels, d )

  #   if rankS > 0 and rankD > 0:
  #     chordData[ rankS ][ rankD ] += q 
  #     chordData[ rankD ][ rankS ] += q 
 

  # data = {
  #   "chordData" : chordData,
  #   "labelData" : orderedKeys
  # }

  # with open( outputFileName, 'w' ) as json_file:
  #   json.dump( data, json_file )

  # print( "\nWrote : %s \n" % outputFileName )


if __name__=="__main__":

  writeChordData( "../archive/bundles/Paired.bundles",
                  "../dataClusters.json",
                  "../dataFibers.json" )

