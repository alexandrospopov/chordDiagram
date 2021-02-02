import json

def writeChordData( labelJsonFileName, matrixFileName ):

  print( labelJsonFileName, matrixFileName )

  with open( labelJsonFileName, "r" ) as f:
    labels = json.load( f )

  with open( matrixFileName, "r" ) as f:
    matrix = f.readlines()


  print( labels, matrix )

if __name__=="__main__":

  writeChordData( "data/listRoiLabels.json", 
                  "data/connectivity-matrix.mat")