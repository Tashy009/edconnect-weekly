class DataModel {
    constructor() {
        this.data = [];
        this.errors = [];
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        return this.data.find(objs => objs.id === id) || null

    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        }
        return false;
    }

    update(obj, id) {
        let index = this.data.findIndex((n) => n.id === id)
        if (index !== -1) {
            let found = this.data[index]
            for (let i in obj) {
                found[i] = obj[i]
            }
            this.data[index] = found

            return true

        }else {
            return false
        }


    }

    delete(id) {
            let  fdata = this.data.find(objs => objs.id === id)
            if (this.data.includes(fdata)){
                this.data.splice(this.data.indexOf(fdata), 1)
                return true
            }
            return false

    }

    // this method will be overriden in the sub classes
    validate(obj){
        return false;
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = DataModel;