import json

def loadData( bundlesFileName ):

  with open( bundlesFileName, "r" ) as f:
    bundlesJson = json.load( f )

  return bundlesJson

def getRegionNames( labels ):
  
  nameRegions = []
  
  for nameConnection in labels:

    regionsInConnection = nameConnection.split( "_" )

    for region in regionsInConnection[ : 2 ]:

      if region not in nameRegions:
        nameRegions.append( region )

  return nameRegions


def writeChordData( bundlesFileName, clustersJson, fibersJson ):

  print( "\nProcessing data in %s . \n" % bundlesFileName )

  bundlesJson = loadData( bundlesFileName )

  fibre = bundlesJson[ "curve3d_counts" ]
  labels = bundlesJson[ "labels" ]

  nameRegions = getRegionNames( labels )

  connectionNames = [ label[ :-4 ] for label in labels ]

  placeHolder = [ 0 for i in range( len( nameRegions ) ) ]
  labelCounter = [ list( placeHolder ) for i in range( len( nameRegions ) ) ]
  fibreCounter = [ list( placeHolder ) for i in range( len( nameRegions ) ) ]

  for connectionName in set( connectionNames ):
    
    [ regionSource, regionDest ] = connectionName.split( "_" )[ : 2 ]
    ( sourceIndex, destIndex ) = ( nameRegions.index( regionSource ), 
                                   nameRegions.index( regionDest ) )

    labelCounter[ sourceIndex ][ destIndex ] = connectionNames.count( 
                                                                connectionName )
    labelCounter[ destIndex ][ sourceIndex ] = connectionNames.count( 
                                                                connectionName )


  for iLabel, nameLabel in enumerate( labels ): 

    [ source,dest ] = nameLabel.split( "_" )[ : 2 ]

    ( sourceIndex, destIndex ) = ( nameRegions.index( source ), 
                                   nameRegions.index( dest ) )

    fibreCounter[ sourceIndex ][ destIndex ] += fibre[ iLabel ]
    fibreCounter[ destIndex ][ sourceIndex ] += fibre[ iLabel ]

  dataClusters = {
    "chordData" : labelCounter,
    "labelData" : nameRegions
  }

  dataFibers = {
    "chordData" : fibreCounter,
    "labelData" : nameRegions
  }


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

