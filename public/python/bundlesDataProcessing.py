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


def countNumberBundlesPerConnection( nameRegions, connectionNames ):
  
  placeHolder = [ 0 for i in range( len( nameRegions ) ) ]
  bundlesPerConnection = [ list( placeHolder ) for i in range( len( nameRegions ) ) ]

  for connectionName in set( connectionNames ):
    
    [ regionSource, regionDest ] = connectionName.split( "_" )[ : 2 ]
    ( sourceIndex, destIndex ) = ( nameRegions.index( regionSource ), 
                                   nameRegions.index( regionDest ) )

    bundlesPerConnection[ sourceIndex ][ destIndex ] = connectionNames.count( 
                                                                connectionName )
    bundlesPerConnection[ destIndex ][ sourceIndex ] = connectionNames.count( 
                                                                connectionName )

  return bundlesPerConnection

def writeBundlesPerConnection( bundlesPerConnection, 
                               nameRegions,
                               clustersJson ):

  dataClusters = { "chordData" : bundlesPerConnection,
                   "labelData" : nameRegions }

  with open( clustersJson, 'w' ) as json_file:
    json.dump( dataClusters, json_file )

  print( "\nWrote : %s \n" % clustersJson )


def countFibersPerConnection( nameRegions, labels, fibre ):

  placeHolder = [ 0 for i in range( len( nameRegions ) ) ]
  fibreCounter = [ list( placeHolder ) for i in range( len( nameRegions ) ) ]

  for iConnection, nameConnection in enumerate( labels ): 

    [ regionSource, regionDest ] = nameConnection.split( "_" )[ : 2 ]

    ( sourceIndex, destIndex ) = ( nameRegions.index( regionSource ), 
                                   nameRegions.index( regionDest ) )

    fibreCounter[ sourceIndex ][ destIndex ] += fibre[ iConnection ]
    fibreCounter[ destIndex ][ sourceIndex ] += fibre[ iConnection ]

  return fibreCounter

def writeFibresPerConnection( fibresPerConnection, 
                              nameRegions, 
                              fibersJson ):

  dataFibers = { "chordData" : fibresPerConnection,
                 "labelData" : nameRegions }

  with open( fibersJson, 'w' ) as json_file:
    json.dump( dataFibers, json_file )

  print( "\nWrote : %s \n" % fibersJson )

def writeChordData( bundlesFileName, clustersJson, fibersJson ):

  print( "\nProcessing data in %s . \n" % bundlesFileName )

  bundlesJson = loadData( bundlesFileName )

  fibre = bundlesJson[ "curve3d_counts" ]
  labels = bundlesJson[ "labels" ]

  nameRegions = getRegionNames( labels )

  connectionNames = [ connectionName[ :-4 ] for connectionName in labels ]

  bundlesPerConnection = countNumberBundlesPerConnection( nameRegions,
                                                          connectionNames )

  fibresPerConnection = countFibersPerConnection( nameRegions, labels, fibre )

  writeBundlesPerConnection( bundlesPerConnection, 
                             nameRegions,
                             clustersJson )

  writeFibresPerConnection( fibresPerConnection, 
                            nameRegions, 
                            fibersJson )

if __name__=="__main__":

  writeChordData( "../archive/bundles/Paired.bundles",
                  "../dataClusters.json",
                  "../dataFibers.json" )

