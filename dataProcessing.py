def writeChordData( labelJson, matrix ):

  print( labelJson, matrix )



if __name__=="__main__":

  writeChordData( "data/listRoiLabels.json", 
                  "data/connectivity-matrix.mat")