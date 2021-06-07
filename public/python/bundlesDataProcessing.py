import json

def loadData( bundlesFileName ):

  with open( bundlesFileName, "r" ) as f:
    bundlesJson = json.load( f )

  return bundlesJson

def writeChordData( bundlesFileName, clustersJson, fibersJson ):

  print( "\nProcessing data in %s . \n" % bundlesFileName )

  bundlesJson = loadData( bundlesFileName )

  fibre = bundlesJson[ "curve3d_counts" ]
  labels = bundlesJson[ "labels" ]

  nameLabels = []
  for label in labels:
    subLabels = label.split( "_" )
    for subLabel in subLabels[ : 2 ]:
      if subLabel not in nameLabels:
        nameLabels.append( subLabel )

  labelsWoNum = [ label[ :-4 ] for label in labels ]
  labelsSets = set( labelsWoNum )

  placeHolder = [ 0 for i in range( len( nameLabels ) ) ]
  labelCounter = [ list( placeHolder ) for i in range( len( nameLabels ) ) ]
  fibreCounter = [ list( placeHolder ) for i in range( len( nameLabels ) ) ]

  for labelSet in labelsSets:
    
    [ source,dest ] = labelSet.split( "_" )[ : 2 ]
    ( sourceIndex, destIndex ) = ( nameLabels.index( source ), 
                                   nameLabels.index( dest ) )

    labelCounter[ sourceIndex ][ destIndex ] = labelsWoNum.count( labelSet )
    labelCounter[ destIndex ][ sourceIndex ] = labelsWoNum.count( labelSet )


  for iLabel, nameLabel in enumerate( labels ): 

    [ source,dest ] = nameLabel.split( "_" )[ : 2 ]

    ( sourceIndex, destIndex ) = ( nameLabels.index( source ), 
                                   nameLabels.index( dest ) )

    fibreCounter[ sourceIndex ][ destIndex ] += fibre[ iLabel ]
    fibreCounter[ destIndex ][ sourceIndex ] += fibre[ iLabel ]

  dataClusters = {
    "chordData" : labelCounter,
    "labelData" : nameLabels
  }

  dataFibers = {
    "chordData" : fibreCounter,
    "labelData" : nameLabels
  }

  print( nameLabels )


  with open( clustersJson, 'w' ) as json_file:
    json.dump( dataClusters, json_file )

  with open( fibersJson, 'w' ) as json_file:
    json.dump( dataFibers, json_file )

  print( "\nWrote : %s \n" % clustersJson )
  print( "\nWrote : %s \n" % fibersJson )


if __name__=="__main__":

  writeChordData( "../archive/bundles/Paired.bundles",
                  "../dataClusters.json",
                  "../dataFibers.json" )

