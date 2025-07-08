  //Process of Retriving As Reported code 
export function handleARcode() {
    let res = []
    
    for (const code of asReportedcode) {
    

      const arCode = Master[selectedproduct][code]["As Reported/As Analyzed Code 1"]
      const ascode = Master[selectedproduct][code]["IMDRF Annex A (Problem) Code & Definition"]
      
      let rese = {
        "dtcode" : code,
        "arcode": arCode,
        "ascode": ascode
      }
      res.push(rese)}
    setmaterialGrid(res)
    console.log(materialGrid)
  }

//Search Filter



