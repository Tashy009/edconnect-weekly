const DataModel = require('./data_model');

class Project {
    constructor(id, name, abstract, authors, tags, createdBy) {
        this.id = id;
        this.name = name;
        this.abstract = abstract;
        this.authors = authors;
        this.tags = tags;
        this.createdBy = createdBy;
    }
}

class Projects extends DataModel {
    validate(obj) {
        this.errors = []
        var former = true
        var latter = true
        
        if (!Array.isArray(obj.authors) && !Array.isArray(obj.tags)){
            latter = false
            this.errors.push("Authors should be an array")
            this.errors.push("Tags should be an array")
            
        }

        for (let key in obj){
            if (obj[key] == ''|| obj[key] == [] || obj[key] == null ){
                former = false
                this.errors.push(`${key} should not be empty`)
                
            }
        }

        if(former === true && latter === true){
            this.errors = []
            return true

        
        }else{
            
            return false
            

        }
        

    }
}


// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    Project,
    Projects
};