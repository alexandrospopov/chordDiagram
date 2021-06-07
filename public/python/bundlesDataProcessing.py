import json

def loadData( bundlesFileName ):

  with open( bundlesFileName, "r" ) as f:
    bundlesJson = json.load( f )

  return bundlesJson

def writeChordData( bundlesFileName, clustersJson, fibersJson ):

  print( "\nProcessing data in %s . \n" % bundlesFileName )

  bundlesJson = loadData( bundlesFileName )

  fibreCounts = bundlesJson[ "curve3d_counts" ]
  labels = bundlesJson[ "labels" ]

  nameLabels = []
  for label in labels:
    subLabels = label.split( "_" )
    for subLabel in subLabels[ : 2 ]:
      if subLabel not in nameLabels:
        nameLabels.append( subLabel )

  placeHolder = [ 0 for i in range( len( nameLabels ) ) ]
  labelCounter = [ list( placeHolder ) for i in range( len( nameLabels ) ) ]

  for label in labels:
    [ source,dest ] = label.split( "_" )[ : 2 ]
    ( sourceIndex, destIndex ) = ( 
                          nameLabels.index( source ), nameLabels.index( dest ) )

    labelCounter[ sourceIndex ][ destIndex ] += 1
    labelCounter[ destIndex ][ sourceIndex ] += 1


  dataClusters = {
    "chordData" : labelCounter,
    "labelData" : nameLabels
  }

  with open( clustersJson, 'w' ) as json_file:
    json.dump( dataClusters, json_file )

  print( "\nWrote : %s \n" % clustersJson )


if __name__=="__main__":

  writeChordData( "../archive/bundles/Paired.bundles",
                  "../dataClusters.json",
                  "../dataFibers.json" )

